/**
 * @fileoverview RscStreamingWaterfallDemo
 * 서버가 보낸 것(좌: 청크 워터폴)과 사용자가 본 것(우: 브라우저 화면)을 같은 시각축으로 나란히 본다.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  StructureControls,
  StructureLegendChip,
  StructureNotes,
  hitTestWaterfall,
  paintBrowserViewport,
  paintWaterfall,
  streamSummary,
  type NoteItem,
  type RscStreamSpec
} from '../components/structure';
import { formatMs } from '../components/timeline/scale';

const SPEC: RscStreamSpec = {
  totalMs: 2000,
  firstPaintMs: 300,
  url: 'localhost:3000/products/42',
  slots: [
    { title: '상품 정보', shape: 'card' },
    { title: '리뷰', shape: 'list' },
    { title: '추천 상품', shape: 'grid' }
  ],
  chunks: [
    {
      id: 'layout',
      shortLabel: 'layout',
      file: 'app/layout.tsx',
      kind: 'shell',
      startMs: 0,
      durationMs: 160,
      color: '#3b82f6',
      detail: '루트 레이아웃 RSC 페이로드. 데이터가 필요 없어 가장 먼저 만들어지고 TTFB를 결정한다.'
    },
    {
      id: 'page',
      shortLabel: 'page',
      file: 'app/products/[id]/page.tsx',
      kind: 'shell',
      startMs: 160,
      durationMs: 140,
      color: '#60a5fa',
      detail: '페이지 셸과 Suspense fallback(스켈레톤)까지 함께 flush 된다. 여기까지가 300ms 첫 페인트다.'
    },
    {
      id: 'info',
      shortLabel: 'ProductInfo',
      file: '<Suspense> ProductInfo',
      kind: 'suspense',
      startMs: 300,
      durationMs: 380,
      slot: 0,
      color: '#22c55e',
      detail: 'await getProduct() — 캐시 히트라 680ms에 가장 먼저 도착해 상품 정보 칸의 스켈레톤을 교체한다.'
    },
    {
      id: 'reviews',
      shortLabel: 'Reviews',
      file: '<Suspense> Reviews',
      kind: 'suspense',
      startMs: 300,
      durationMs: 880,
      slot: 1,
      color: '#f59e0b',
      detail: 'await getReviews() — DB 조회라 1,180ms가 걸리지만, 이 지연이 셸이나 다른 칸을 막지 않는다.'
    },
    {
      id: 'recs',
      shortLabel: 'Recs',
      file: '<Suspense> Recommendations',
      kind: 'suspense',
      startMs: 520,
      durationMs: 1180,
      slot: 2,
      color: '#ec4899',
      detail: '외부 API라 1,700ms로 가장 늦다. 그 사이에도 나머지 화면은 이미 보이고 조작할 수 있다.'
    }
  ]
};

/** 범례는 청크 데이터에서 그대로 만든다 — 색을 손으로 적지 않으므로 막대와 어긋날 수 없다 */
const SHELL_CHUNKS = SPEC.chunks.filter((chunk) => chunk.kind === 'shell');
const SUSPENSE_CHUNKS = SPEC.chunks.filter((chunk) => chunk.kind === 'suspense');

const NOTES: NoteItem[] = SPEC.chunks.map((chunk) => ({
  id: chunk.id,
  label: chunk.shortLabel,
  meta: `${chunk.file} · ${formatMs(chunk.startMs + chunk.durationMs)} 도착`,
  detail: chunk.detail,
  color: chunk.color
}));

const MIN_WIDTH = 560;
const PANEL_H = 190;

export const RscStreamingWaterfallDemo: React.FC = () => {
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;
  const scrubRef = useRef(-1);

  const playback = useTimelinePlayback({ totalMs: SPEC.totalMs, cycleMs: 5000 });
  const { advance, scrubTo } = playback;
  const summary = streamSummary(SPEC.firstPaintMs, SPEC.chunks);

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime, time }) => {
      ctx.clearRect(0, 0, size.width, size.height);

      const pad = 12;
      const gap = 10;
      const leftW = Math.max(240, (size.width - pad * 2 - gap) * 0.58);
      const left = { x: pad, y: pad, width: leftW, height: PANEL_H };
      const right = {
        x: pad + leftW + gap,
        y: pad,
        width: Math.max(150, size.width - pad * 2 - gap - leftW),
        height: PANEL_H
      };

      if (pointer.isDown && pointer.isInside && pointer.x >= left.x && pointer.x <= left.x + left.width) {
        const geo = { x0: left.x + 10, w: left.width - 20 };
        const ratio = (pointer.x - geo.x0) / geo.w;
        const ms = Math.max(0, Math.min(SPEC.totalMs, ratio * SPEC.totalMs));
        if (Math.abs(ms - scrubRef.current) > SPEC.totalMs * 0.004) {
          scrubRef.current = ms;
          scrubTo(ms);
        }
      }

      const nowMs = advance(deltaTime);

      paintWaterfall(ctx, {
        panel: left,
        chunks: SPEC.chunks,
        totalMs: SPEC.totalMs,
        firstPaintMs: SPEC.firstPaintMs,
        nowMs,
        hoveredId: hoverRef.current
      });
      paintBrowserViewport(ctx, {
        panel: right,
        url: SPEC.url,
        slots: SPEC.slots,
        chunks: SPEC.chunks,
        firstPaintMs: SPEC.firstPaintMs,
        nowMs,
        timeMs: time,
        hoveredId: hoverRef.current
      });

      const hit = hitTestWaterfall(left, SPEC.chunks, pointer);
      if (hit !== canvasHoverRef.current) {
        canvasHoverRef.current = hit;
        setCanvasHover(hit);
      }
    }
  });

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <StructureControls
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        readout={`${formatMs(playback.displayMs)} / ${formatMs(SPEC.totalMs)}`}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
        extra={
          <>
            <span className="text-[10px] font-semibold whitespace-nowrap text-slate-500">셸 flush</span>
            {SHELL_CHUNKS.map((chunk) => (
              <StructureLegendChip key={chunk.id} color={chunk.color} label={chunk.shortLabel} />
            ))}
            <span className="ml-1 text-[10px] font-semibold whitespace-nowrap text-slate-500">
              Suspense 청크
            </span>
            {SUSPENSE_CHUNKS.map((chunk) => (
              <StructureLegendChip key={chunk.id} color={chunk.color} label={chunk.shortLabel} />
            ))}
          </>
        }
      />

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: PANEL_H + 24 }} className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: PANEL_H + 24 }}
            className="block w-full cursor-crosshair select-none touch-pan-y"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
        <span>
          첫 페인트 <span className="mx-1 font-mono text-emerald-300">{formatMs(summary.firstPaint)}</span>
          <span className="text-slate-500">·</span>
          <span className="mx-1">전체 완료</span>
          <span className="font-mono text-amber-300">{formatMs(summary.complete)}</span>
        </span>
        <span className="text-slate-400">
          막대 색 = 오른쪽 화면 칸 색 · 청크가 도착하면 같은 색 칸이 채워집니다 · 좌측 타임라인 드래그로 이동
        </span>
      </div>

      <StructureNotes items={NOTES} hoveredId={hoverId} onHover={setListHover} />
    </div>
  );
};
