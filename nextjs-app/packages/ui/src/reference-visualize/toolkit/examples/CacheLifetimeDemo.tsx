'use client';

/**
 * @fileoverview CacheLifetimeDemo
 * cacheLife의 세 시간 — 클라이언트(`stale`)와 서버(`revalidate`·`expire`)는 서로 다른 축이다.
 * 축 위 아무 지점이나 눌러 "그 시점에 요청이 도착하면 어떻게 되는지"를 바로 확인한다.
 * 근거: `04-functions/cacheLife.md:91-93,108-127`(세 값), `:139-147`(프로필 표).
 */

import React, { useRef, useState } from 'react';
import { CACHE_CONTROL, CacheFrame } from '../components/cache-components/CacheFrame';
import { axisMaxOf, formatSec, paintLife, secAtX } from '../components/cache-components/paint-life';
import { LIFE_PROFILES, lifeZone, type LifeProfile } from '../components/cache-components/model';
import type { NoteItem } from '../components/structure';

const CANVAS_H = 300;

const NOTES: NoteItem[] = [
  {
    id: 'stale',
    label: 'stale — 클라이언트의 시간',
    meta: 'cacheLife.md:95-105',
    detail:
      '클라이언트 라우터가 서버에 확인하지 않고 캐시된 내용을 그대로 쓰는 시간이다. 이 구간에서는 네트워크 요청 자체가 없다. 이 시간이 지나면 다음 이동이나 요청 때 서버에 확인한다.',
    color: '#16a34a'
  },
  {
    id: 'revalidate',
    label: 'revalidate — 다음 요청이 트리거한다',
    meta: 'cacheLife.md:108-120',
    detail:
      '이 시간이 지나면 서버는 다음 요청에 캐시된 값을 먼저 주고 백그라운드에서 재생성한다. 시간이 지나기만 해서는 갱신이 시작되지 않으며, 다음 요청이 있어야 한다.',
    color: '#f59e0b'
  },
  {
    id: 'expire',
    label: 'expire — 여기서는 요청이 기다린다',
    meta: 'cacheLife.md:123-128',
    detail:
      '트래픽이 없는 채로 이 시간을 넘기면 다음 요청은 구값을 받지 못하고 새 콘텐츠가 준비될 때까지 동기적으로 기다린다. expire는 revalidate보다 길어야 하며, Next.js가 검증해 잘못된 설정에 에러를 낸다.',
    color: '#dc2626'
  },
  {
    id: 'profiles',
    label: '프로필은 이름 붙은 세 값의 조합이다',
    meta: 'cacheLife.md:139-147',
    detail:
      'seconds·minutes·hours·days·weeks와 default·max가 미리 정의돼 있고, next.config에서 재정의할 수 있다. cacheLife를 부르지 않으면 default가 적용되므로, 캐시 지시자마다 프로필을 명시하는 편이 좋다.',
    color: '#2563eb'
  }
];

export const CacheLifetimeDemo: React.FC = () => {
  const [profile, setProfile] = useState<LifeProfile>(LIFE_PROFILES[2]);
  const [requestAtSec, setRequestAtSec] = useState(() => Math.round(LIFE_PROFILES[2].revalidate * 1.5));
  const [noteHover, setNoteHover] = useState<string | null>(null);

  const stateRef = useRef({ profile, requestAtSec });
  stateRef.current = { profile, requestAtSec };
  const draggingRef = useRef(false);

  const pick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRequestAtSec(secAtX(event.clientX - rect.left, rect.width, stateRef.current.profile));
  };

  const changeProfile = (next: LifeProfile) => {
    setProfile(next);
    setRequestAtSec(Math.min(requestAtSec, axisMaxOf(next)));
  };

  const zone = lifeZone(requestAtSec, profile);

  return (
    <CacheFrame
      title="cacheLife의 세 시간"
      source="https://nextjs.org/docs/app/api-reference/functions/cacheLife"
      height={CANVAS_H}
      minWidth={620}
      notes={NOTES}
      hoveredId={noteHover}
      onHoverNote={setNoteHover}
      canvasCursor="cursor-crosshair"
      onCanvasClick={pick}
      controls={
        <>
          <span className="text-[11px] font-semibold text-slate-500">프로필</span>
          {LIFE_PROFILES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => changeProfile(item)}
              className={`${CACHE_CONTROL} ${
                profile.name === item.name ? 'border-blue-400 bg-blue-50 text-blue-700' : ''
              }`}
              title={item.note}
            >
              {item.name}
            </button>
          ))}
          <span className="text-[11px] text-slate-500">
            축을 클릭해 요청이 도착하는 시점을 골라 보세요
          </span>
        </>
      }
      conclusion={
        <>
          <span className="font-semibold text-white">
            캐시가 만들어지고 {formatSec(requestAtSec)} 뒤에 요청이 도착하면
          </span>
          <span className="mx-2 text-slate-500">—</span>
          {zone === 'fresh'
            ? '서버는 캐시된 결과를 그대로 돌려주고 재생성하지 않습니다.'
            : zone === 'swr'
              ? '구값을 즉시 돌려주고, 바로 그 요청이 백그라운드 재생성을 시작시킵니다.'
              : '구값을 줄 수 없어 이 요청은 새 콘텐츠가 준비될 때까지 기다립니다.'}
        </>
      }
      onFrame={({ ctx, size, pointer }) => {
        // 드래그로도 시점을 옮길 수 있게 한다 (클릭은 onCanvasClick이 처리)
        if (pointer.isDown && pointer.isInside) {
          draggingRef.current = true;
          const sec = secAtX(pointer.x, size.width, stateRef.current.profile);
          if (sec !== stateRef.current.requestAtSec) setRequestAtSec(sec);
        } else {
          draggingRef.current = false;
        }
        paintLife(ctx, {
          width: size.width,
          height: size.height,
          profile: stateRef.current.profile,
          requestAtSec: stateRef.current.requestAtSec
        });
      }}
    />
  );
};
