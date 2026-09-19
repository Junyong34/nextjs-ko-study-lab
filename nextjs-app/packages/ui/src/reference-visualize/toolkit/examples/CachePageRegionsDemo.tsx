'use client';

/**
 * @fileoverview CachePageRegionsDemo
 * 한 페이지, 영역별 캐시 경계 — 헤더(정적 셸) · 상품 목록('use cache' 컴포넌트) ·
 * 환율 배너('use cache' 함수만) · 맞춤 추천(캐시 없음)의 데이터가 원천 → 캐시 계층 → 화면으로
 * 각각 어떤 경로를 거치는지 한 번의 페이지 요청을 재생해 비교한다.
 *
 * 구성은 다른 구조 데모와 같다: 재생 컨트롤 → 캔버스 → 결론 스트립 → 코드 지도 → 설명 목록.
 * 시나리오(캐시 채워짐/비어 있음)를 바꾸면 도착 시각이 달라진다. 모델은 `regions-model.ts`, 그림은 `paint-regions*.ts`.
 */

import React, { useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import { StructureControls, StructureLegendChip, StructureNotes } from '../components/structure';
import { MODE_COLOR, hitTestRegion, paintRegions } from '../components/cache-components/paint-regions';
import {
  FILL_LABEL,
  MODE_LABEL,
  REGIONS_TOTAL_MS,
  summaryAt,
  type CacheFill,
  type RegionId
} from '../components/cache-components/regions-model';
import { RegionCodeMap } from './cache-regions/RegionCodeMap';
import { REGIONS_SOURCE, regionNotes } from './cache-regions/notes';

const CANVAS_H = 330;
const MIN_WIDTH = 720;
const FILLS: CacheFill[] = ['warm', 'cold'];
const CHIP = 'rounded-md border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer';

export const CachePageRegionsDemo: React.FC = () => {
  const [fill, setFill] = useState<CacheFill>('warm');
  const [canvasHover, setCanvasHover] = useState<RegionId | null>(null);
  const [domHover, setDomHover] = useState<RegionId | null>(null);
  const playback = useTimelinePlayback({ totalMs: REGIONS_TOTAL_MS, cycleMs: 5600, holdMs: 1400 });
  const { advance } = playback;

  const hoveredId = domHover ?? canvasHover;
  const fillRef = useRef(fill);
  fillRef.current = fill;
  const hoverRef = useRef(hoveredId);
  hoverRef.current = hoveredId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, deltaTime, time, pointer }) => {
      const nowMs = advance(deltaTime);
      const hit = pointer.isInside ? hitTestRegion(size.width, size.height, pointer.x, pointer.y) : null;
      if (hit !== canvasHoverRef.current) {
        canvasHoverRef.current = hit;
        setCanvasHover(hit);
      }
      ctx.clearRect(0, 0, size.width, size.height);
      paintRegions(ctx, { width: size.width, height: size.height, fill: fillRef.current, nowMs, timeMs: time, hoveredId: hoverRef.current });
    }
  });

  const changeFill = (next: CacheFill) => {
    setFill(next);
    playback.replay();
  };

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>개념 시각화 · Next.js 16.3.2 기준 · 시간(ms)은 시연용이며 실측이 아닙니다</span>
        <a className="underline underline-offset-4" href={REGIONS_SOURCE} target="_blank" rel="noreferrer">
          공식 문서 ↗
        </a>
      </div>

      <StructureControls
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        readout={`${Math.round(playback.displayMs)}ms / ${REGIONS_TOTAL_MS}ms`}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
        extra={
          <>
            {(Object.keys(MODE_LABEL) as (keyof typeof MODE_LABEL)[]).map((mode) => (
              <StructureLegendChip key={mode} color={MODE_COLOR[mode]} label={MODE_LABEL[mode]} />
            ))}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold tracking-wide text-slate-400 whitespace-nowrap">시나리오 · 요청이 올 때 캐시 상태</span>
        {FILLS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={fill === f}
            onClick={() => changeFill(f)}
            className={`${CHIP} ${fill === f ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
          >
            {FILL_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="한 페이지의 네 영역이 데이터 원천 → 캐시 계층 → 사용자 화면으로 각각 다른 경로를 지나는 흐름도"
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-default select-none"
          />
        </div>
      </div>

      <p role="status" className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
        <span className="font-semibold text-white">{FILL_LABEL[fill]}</span>
        <span className="mx-2 text-slate-500">—</span>
        {summaryAt(fill, playback.displayMs)}
      </p>

      <RegionCodeMap hoveredId={hoveredId} onHover={setDomHover} />

      <StructureNotes
        items={regionNotes(fill)}
        hoveredId={hoveredId}
        onHover={(id) => setDomHover(id as RegionId | null)}
        columns={2}
        caption="영역마다 캐시 경계가 다르다 — 항목·코드·캔버스 행은 같은 색과 호버로 연결됩니다."
      />
    </div>
  );
};
