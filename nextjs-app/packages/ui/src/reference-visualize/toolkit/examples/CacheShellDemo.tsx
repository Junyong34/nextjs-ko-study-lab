'use client';

/**
 * @fileoverview CacheShellDemo
 * 정적 셸과 요청 시 스트리밍 — `use cache`는 페이지를 정적으로 만드는 것이 아니라 셸에 포함시킨다.
 * 근거: `01-getting-started/08-caching.md:241-300`(세 종류의 공존), `:444-454`(셸의 CDN 서빙).
 */

import React from 'react';
import { CacheFrame } from '../components/cache-components/CacheFrame';
import { paintShell, SHELL_STEPS } from '../components/cache-components/paint-shell';
import { stepAt, useCacheSequence } from '../components/cache-components/sequence';
import { StructureControls } from '../components/structure';
import type { NoteItem } from '../components/structure';

const CONCLUSIONS = [
  '빌드 — 정적 헤더와 use cache가 붙은 BlogPosts가 셸 상자 안에 들어갑니다. Suspense 구역에는 폴백만 들어갑니다.',
  '요청 — 셸은 이미 완성돼 있어 CDN에서 그대로 나갑니다. 서버 연산 없이 헤더와 글 목록이 먼저 보입니다.',
  '요청 시 실행 — 셸 밖에 남아 있던 UserPreferences가 이때 cookies()를 읽고 서버에서 렌더됩니다.',
  '스트리밍 완료 — 같은 응답 안에서 도착해 폴백 자리를 대체합니다. 한 페이지에 정적·캐시·런타임이 함께 존재합니다.'
];

const NOTES: NoteItem[] = [
  {
    id: 'three',
    label: '한 페이지에 세 가지가 공존한다',
    meta: '08-caching.md:241-300',
    detail:
      '정적 콘텐츠는 자동으로 프리렌더되고, use cache가 붙은 동적 콘텐츠는 정적 셸에 포함되며, <Suspense> 안의 런타임 동적 콘텐츠는 요청 시 스트리밍된다. 라우트 단위로 하나를 고르는 것이 아니다.',
    color: '#2563eb'
  },
  {
    id: 'not-static',
    label: 'use cache는 페이지를 정적으로 만들지 않는다',
    meta: '셸 상자의 안과 밖',
    detail:
      '캐시된 컴포넌트의 결과가 셸에 포함될 뿐이다. 같은 페이지에 cookies()를 읽는 구역이 있으면 그 구역은 셸 밖에 남아 요청마다 실행된다. 상자 경계가 곧 그 구분이다.',
    color: '#047857'
  },
  {
    id: 'shell-cdn',
    label: '정적 셸은 HTML이자 RSC Payload',
    meta: '08-caching.md:444-454',
    detail:
      '셸은 초기 로드용 HTML과 클라이언트 내비게이션용 RSC Payload 두 형태로 생성되어 업스트림 서버를 거치지 않고 CDN에서 직접 서빙된다. 그래서 주소로 바로 들어와도 즉시 내용이 보인다.',
    color: '#7c3aed'
  }
];

const CANVAS_H = 300;

export const CacheShellDemo: React.FC = () => {
  const sequence = useCacheSequence(SHELL_STEPS.length);
  const { advance } = sequence;

  return (
    <CacheFrame
      title="정적 셸과 요청 시 스트리밍"
      source="https://nextjs.org/docs/app/getting-started/caching"
      height={CANVAS_H}
      notes={NOTES}
      controls={
        <StructureControls
          isPlaying={sequence.isPlaying}
          speed={sequence.speed}
          readout={`${sequence.step + 1} / ${SHELL_STEPS.length} · ${SHELL_STEPS[sequence.step]}`}
          onToggle={sequence.toggle}
          onReplay={sequence.replay}
          onCycleSpeed={sequence.cycleSpeed}
        />
      }
      conclusion={CONCLUSIONS[sequence.step]}
      onFrame={({ ctx, size, deltaTime }) => {
        const nowMs = advance(deltaTime);
        paintShell(ctx, size.width, size.height, nowMs, stepAt(nowMs, SHELL_STEPS.length));
      }}
    />
  );
};
