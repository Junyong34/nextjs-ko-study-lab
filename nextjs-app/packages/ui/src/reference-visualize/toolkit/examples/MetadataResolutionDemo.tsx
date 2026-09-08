/**
 * @fileoverview MetadataResolutionDemo
 * layout·page가 각각 export 한 metadata가 어떤 순서로 평가되고, 어떻게 얕게 병합되어
 * 최종 `<head>`가 되는지를 재생한다. 덮어써지는 키는 취소선을 남기고 사라진다.
 *
 * 근거: next@16.3.2 번들 문서
 * - 평가 순서·얕은 병합·중첩 객체 통째 교체 — `01-app/03-api-reference/04-functions/generate-metadata.md:1318-1330`
 * - 스트리밍 메타데이터와 HTML-limited bots — 같은 파일 `:1222-1232`
 */

'use client';

import React, { useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  StructureControls,
  StructureNotes,
  hitTestSegments,
  paintHandoff,
  paintHeadPanel,
  paintSegments,
  resolveMetadata,
  segmentColor,
  type MetadataSegment,
  type NoteItem
} from '../components/structure';

const SEGMENTS: MetadataSegment[] = [
  {
    id: 'root',
    label: 'Root Layout',
    file: 'app/layout.tsx',
    resolveAt: 0.18,
    entries: [
      { key: 'title', value: "'Acme'" },
      { key: 'description', value: "'Acme는…'" },
      { key: 'openGraph', value: '{ title, description, siteName }', nested: ['title', 'description', 'siteName'] }
    ],
    detail:
      '루트 레이아웃이 사이트 전역 기본값을 잡는다. openGraph에 title·description·siteName 세 필드를 모두 채워 두었다.'
  },
  {
    id: 'blog',
    label: 'Blog Layout',
    file: 'app/blog/layout.tsx',
    resolveAt: 0.45,
    entries: [
      { key: 'title', value: "'Acme 블로그'" },
      { key: 'openGraph', value: '{ title }', nested: ['title'] }
    ],
    detail:
      '여기가 함정이다. openGraph에 title 하나만 다시 썼는데 얕은 병합이라 객체가 통째로 교체되어, 루트가 넣어 둔 description·siteName이 사라진다. 공유하려면 그 필드를 여기서 다시 써야 한다.'
  },
  {
    id: 'post',
    label: 'Post Page',
    file: 'app/blog/[slug]/page.tsx',
    resolveAt: 0.75,
    isGenerate: true,
    entries: [
      { key: 'title', value: "'RSC 스트리밍 입문'" },
      { key: 'description', value: "'이 글에서는…'" }
    ],
    detail:
      'generateMetadata로 글 데이터를 fetch해 채운다. async 함수이므로 스트리밍 대상이 되며, 마지막 세그먼트라 title·description의 최종 값이 된다.'
  }
];

const CONCEPT_NOTES: NoteItem[] = [
  {
    id: 'merge',
    label: '얕은 병합',
    meta: 'generate-metadata.md:1328-1330',
    detail:
      '세그먼트별 metadata는 root → 아래 순서로 평가되고 얕게 병합된다. 같은 키는 나중 것이 앞의 것을 교체한다. openGraph·robots처럼 중첩 필드를 가진 키는 부분 병합이 아니라 객체 전체가 바뀐다.',
    color: '#ef4444'
  },
  {
    id: 'streaming',
    label: '스트리밍 메타데이터',
    meta: 'generate-metadata.md:1222-1232',
    detail:
      'generateMetadata가 끝나기를 기다리지 않고 초기 UI를 먼저 보낸다. 준비된 태그는 <head>가 아니라 <body>에 추가된다. JS를 실행하는 봇(Googlebot)은 정상적으로 인식하지만, HTML-limited bots(facebookexternalhit 등)에서는 여전히 대기한 뒤 <head>에 넣는다. htmlLimitedBots로 조절한다.',
    color: '#8b5cf6'
  },
  {
    id: 'cache-components',
    label: 'Next 16 — Cache Components와 함께 쓸 때',
    meta: 'generate-metadata.md "With Cache Components"',
    detail:
      'cacheComponents가 켜져 있으면 generateMetadata도 다른 컴포넌트와 같은 규칙을 따른다. 런타임 데이터(cookies, headers, params, searchParams)나 캐시되지 않은 fetch를 쓰면 요청 시로 미뤄진다. 페이지의 나머지가 완전히 프리렌더 가능한데 메타데이터만 런타임을 타면 Next.js가 명시적 선택을 요구하는 에러를 낸다 — 데이터를 use cache로 캐시하거나, 동적임을 의도적으로 표시해야 한다.',
    color: '#f59e0b'
  }
];

const PANEL_H = 236;
const CANVAS_H = PANEL_H + 24;
const MIN_WIDTH = 560;
const TOTAL = 1000;

export const MetadataResolutionDemo: React.FC = () => {
  const [streaming, setStreaming] = useState(true);
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;
  const streamingRef = useRef(streaming);
  streamingRef.current = streaming;

  const playback = useTimelinePlayback({ totalMs: TOTAL, cycleMs: 5600 });
  const { advance } = playback;
  const progress = playback.displayMs / TOTAL;

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime }) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const pad = 12;
      const gap = 14;
      const leftW = Math.max(200, (size.width - pad * 2 - gap) * 0.46);
      const left = { x: pad, y: pad, width: leftW, height: PANEL_H };
      const right = {
        x: pad + leftW + gap,
        y: pad,
        width: Math.max(180, size.width - pad * 2 - gap - leftW),
        height: PANEL_H
      };

      const p = advance(deltaTime) / TOTAL;
      const resolution = resolveMetadata(SEGMENTS, p, streamingRef.current);

      paintSegments(ctx, { panel: left, segments: SEGMENTS, progress: p, hoveredId: hoverRef.current });
      paintHandoff(ctx, left, right, SEGMENTS, p);
      paintHeadPanel(ctx, {
        panel: right,
        segments: SEGMENTS,
        resolution,
        progress: p,
        streaming: streamingRef.current,
        hoveredId: hoverRef.current
      });

      const hit = hitTestSegments(left, SEGMENTS, pointer);
      if (hit !== canvasHoverRef.current) {
        canvasHoverRef.current = hit;
        setCanvasHover(hit);
      }
    }
  });

  const notes: NoteItem[] = [
    ...SEGMENTS.map((segment, index) => ({
      id: segment.id,
      label: segment.label,
      meta: segment.file,
      detail: segment.detail,
      color: segmentColor(index)
    })),
    ...CONCEPT_NOTES
  ];

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <StructureControls
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        readout={`평가 ${Math.round(progress * 100)}%`}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
        extra={
          <button
            type="button"
            onClick={() => setStreaming((prev) => !prev)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
              streaming
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-slate-300 bg-white text-slate-600'
            }`}
            title="generateMetadata 스트리밍 on/off"
          >
            {streaming ? '스트리밍 켜짐' : '스트리밍 꺼짐 (블로킹)'}
          </button>
        }
      />

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-default select-none touch-pan-y"
          />
        </div>
      </div>

      <div className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
        {streaming ? (
          <>
            <span className="font-semibold text-white">스트리밍 켜짐</span>
            <span className="mx-2 text-slate-500">—</span>
            초기 UI를 먼저 보내고 <span className="font-mono text-violet-300">generateMetadata</span> 결과는{' '}
            <span className="font-mono text-violet-300">&lt;body&gt;</span>에 추가됩니다. JS를 실행하지 못하는 봇은
            여전히 기다린 뒤 <span className="font-mono">&lt;head&gt;</span>에서 받습니다.
          </>
        ) : (
          <>
            <span className="font-semibold text-white">스트리밍 꺼짐</span>
            <span className="mx-2 text-slate-500">—</span>
            <span className="font-mono text-amber-300">htmlLimitedBots: /.*/</span> 로 전부 끄면 모든 요청에서
            메타데이터가 준비될 때까지 렌더링이 지연되고, 태그는 전부{' '}
            <span className="font-mono">&lt;head&gt;</span>로 들어갑니다.
          </>
        )}
      </div>

      <StructureNotes items={notes} hoveredId={hoverId} onHover={setListHover} />
    </div>
  );
};
