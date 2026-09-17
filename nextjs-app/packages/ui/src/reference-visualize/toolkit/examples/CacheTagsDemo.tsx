'use client';

/**
 * @fileoverview CacheTagsDemo
 * 태그와 갱신 방식 — 같은 저장 시점에서 updateTag와 revalidateTag의 "다음 읽기"가 갈린다.
 * 근거: `01-getting-started/09-revalidating.md:91-163`.
 */

import React, { useState } from 'react';
import { CACHE_CONTROL, CacheFrame } from '../components/cache-components/CacheFrame';
import { paintTags, TAG_STEPS } from '../components/cache-components/paint-tags';
import { useCacheSequence } from '../components/cache-components/sequence';
import { taggedEntries } from '../components/cache-components/model';
import { StructureControls } from '../components/structure';
import type { NoteItem } from '../components/structure';

const TAGS = ['products', 'product:1', 'news'];
const CANVAS_H = 320;

const CONCLUSIONS = [
  '저장 전 — 태그가 걸린 항목들이 모두 FRESH 상태로 v1을 들고 있습니다.',
  '저장 성공 — 같은 항목이라도 갱신 방식에 따라 상태가 달라집니다. updateTag 쪽은 EXPIRED, revalidateTag 쪽은 STALE입니다.',
  '다음 읽기 — 같은 요청도 서로 다른 응답을 받습니다. EXPIRED 쪽은 재생성이 끝난 v2를 받고, STALE 쪽은 이전 값 v1을 즉시 받은 뒤 백그라운드에서 갱신합니다.',
  '그 다음 읽기 — 두 갈래 모두 FRESH · v2로 만납니다. 차이는 "누가 먼저 새 값을 보느냐"뿐이었습니다.'
];

const NOTES: NoteItem[] = [
  {
    id: 'update',
    label: 'updateTag — read-your-own-writes',
    meta: '09-revalidating.md:119-160',
    detail:
      '캐시를 즉시 만료시켜 사용자가 방금 만든 변경을 곧바로 보게 한다. Server Actions에서만 쓸 수 있다. 글을 쓴 뒤 상세 페이지로 이동하는 흐름처럼, 방금 한 변경을 확인하지 못하면 버그로 느껴지는 곳에 쓴다.',
    color: '#2563eb'
  },
  {
    id: 'revalidate',
    label: 'revalidateTag — 백그라운드 갱신',
    meta: '09-revalidating.md:91-117',
    detail:
      'stale-while-revalidate로 동작한다. 이전 값을 즉시 제공하고 뒤에서 새로 만든다. 약간의 지연이 괜찮은 블로그 글이나 상품 카탈로그에 맞다. Server Actions와 Route Handlers 양쪽에서 쓸 수 있다.',
    color: '#b45309'
  },
  {
    id: 'max',
    label: "두 번째 인자 'max'는 stale 창의 길이다",
    meta: '09-revalidating.md:117',
    detail:
      '이전 값을 제공해도 되는 기간을 정한다. 이 기간이 끝나면 이후 요청은 새 콘텐츠가 준비될 때까지 기다린다. max는 가장 긴 기간을 준다.',
    color: '#7c3aed'
  },
  {
    id: 'scope',
    label: '태그는 여러 항목에 걸쳐 적용된다',
    meta: "cacheTag('products', 'product:1')",
    detail:
      '한 캐시 항목에 여러 태그를 붙일 수 있고, 같은 태그를 여러 함수에서 재사용하면 한 번에 함께 무효화된다. 무효화 대상은 두 흐름에 공통이라 왼쪽 열에 한 번만 그린다. 태그를 바꿔 어떤 항목이 영향을 받는지 확인할 수 있다.',
    color: '#64748b'
  }
];

export const CacheTagsDemo: React.FC = () => {
  const [tag, setTag] = useState(TAGS[0]);
  const [noteHover, setNoteHover] = useState<string | null>(null);
  const sequence = useCacheSequence(TAG_STEPS.length, 2300);
  const { advance } = sequence;
  const tagRef = React.useRef(tag);
  tagRef.current = tag;

  return (
    <CacheFrame
      title="태그와 갱신 방식"
      source="https://nextjs.org/docs/app/getting-started/revalidating"
      height={CANVAS_H}
      notes={NOTES}
      hoveredId={noteHover}
      onHoverNote={setNoteHover}
      controls={
        <>
          <StructureControls
            isPlaying={sequence.isPlaying}
            speed={sequence.speed}
            readout={`${sequence.step + 1} / ${TAG_STEPS.length} · ${TAG_STEPS[sequence.step]}`}
            onToggle={sequence.toggle}
            onReplay={sequence.replay}
            onCycleSpeed={sequence.cycleSpeed}
          />
          <span className="text-[11px] font-semibold text-slate-500">태그</span>
          {TAGS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              className={`${CACHE_CONTROL} ${tag === item ? 'border-blue-400 bg-blue-50 text-blue-700' : ''}`}
            >
              {item} · {taggedEntries(item).length}건
            </button>
          ))}
        </>
      }
      conclusion={CONCLUSIONS[sequence.step]}
      onFrame={({ ctx, size, deltaTime }) => {
        // 정수 단계가 아니라 진행 시각을 넘긴다 — 단계 안의 움직임이 개념을 나른다
        paintTags(ctx, {
          width: size.width,
          height: size.height,
          nowMs: advance(deltaTime),
          selectedTag: tagRef.current
        });
      }}
    />
  );
};
