/**
 * @fileoverview AppRouterRenderTreeDemo
 * URL 세그먼트 → 중첩 렌더 트리 → 렌더 순서(셸 → 스트리밍 → 수화) 세 가지를 하나로 잇는다.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  KIND_COLOR,
  RENDER_PHASES,
  StructureControls,
  StructureLegendChip,
  StructureNotes,
  buildTreeBoxes,
  drawStepIndicator,
  hitTestTree,
  measureNode,
  paintTree,
  phaseIndexAt,
  phaseSummary,
  type NoteItem,
  type RenderTreeNode
} from '../components/structure';
import { SEGMENTS, TREE } from './render-tree-data';

function flatten(node: RenderTreeNode): RenderTreeNode[] {
  return [node, ...(node.children ?? []).flatMap(flatten)];
}

const NODES = flatten(TREE);
const NOTES: NoteItem[] = NODES.map((node) => ({
  id: node.id,
  label: node.title,
  meta: node.file,
  detail: node.detail,
  color: KIND_COLOR[node.kind]
}));

const TREE_H = measureNode(TREE);
const CANVAS_H = 32 + TREE_H + 12;
const MIN_WIDTH = 460;
const TOTAL = 1000;

export const AppRouterRenderTreeDemo: React.FC = () => {
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;
  // 슬라이더는 uncontrolled로 두고 프레임마다 직접 써 넣는다.
  // displayMs(≈12.5Hz)에 묶으면 80ms 계단으로 튀어 버벅여 보인다.
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const draggingRef = useRef(false);

  const playback = useTimelinePlayback({ totalMs: TOTAL, cycleMs: 6000 });
  const { advance, scrubTo } = playback;
  const progress = playback.displayMs / TOTAL;
  const phaseIndex = phaseIndexAt(progress);

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime, time }) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const pad = 12;

      // 이 캔버스는 시간축이 아니라 중첩 구조다. 클릭으로 진행도를 옮기지 않는다.
      // 진행도 조절은 캔버스 아래 슬라이더가 담당한다.
      const nowMs = advance(deltaTime);
      const p = nowMs / TOTAL;

      if (sliderRef.current && !draggingRef.current) {
        sliderRef.current.value = String(Math.round(nowMs));
      }

      drawStepIndicator(
        ctx,
        pad,
        pad + 7,
        size.width - pad * 2,
        RENDER_PHASES.map((phase) => phase.label),
        phaseIndexAt(p),
        '#2563eb'
      );

      const boxes = buildTreeBoxes(TREE, pad, 32, size.width - pad * 2);
      paintTree(ctx, { boxes, progress: p, hoveredId: hoverRef.current, timeMs: time });

      const hit = hitTestTree(boxes, p, pointer);
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
        readout={`${Math.round(progress * 100)}% · ${RENDER_PHASES[phaseIndex].label}`}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
        extra={
          <>
            <StructureLegendChip color={KIND_COLOR.rsc} label="RSC 서버 컴포넌트" />
            <StructureLegendChip color={KIND_COLOR.suspense} label="Suspense 경계" />
            <StructureLegendChip color={KIND_COLOR.client} label="'use client'" />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="mr-1 font-mono text-[11px] text-slate-400">localhost:3000</span>
        {SEGMENTS.map((segment) => (
          <button
            key={segment.nodeId}
            type="button"
            onMouseEnter={() => setListHover(segment.nodeId)}
            onMouseLeave={() => setListHover(null)}
            className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold transition-colors cursor-default ${
              hoverId === segment.nodeId
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
            title={segment.file}
          >
            /{segment.label === '/' ? '' : segment.label}
          </button>
        ))}
        <span className="ml-1 text-[11px] text-slate-400">
          세그먼트에 마우스를 올리면 대응하는 트리 노드가 강조됩니다 (`42`는 `[id]` 동적 세그먼트)
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: MIN_WIDTH, height: CANVAS_H }} className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: CANVAS_H }}
            className="block w-full cursor-default select-none touch-pan-y"
          />
        </div>
      </div>

      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={TOTAL}
          step={1}
          ref={sliderRef}
          defaultValue={0}
          onPointerDown={() => {
            draggingRef.current = true;
          }}
          onPointerUp={() => {
            draggingRef.current = false;
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
          }}
          onChange={(event) => scrubTo(Number(event.target.value))}
          aria-label="렌더 순서 진행도"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
        />
        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
          {RENDER_PHASES.map((phase, index) => (
            <span key={phase.key} className={index === phaseIndex ? 'text-blue-600' : undefined}>
              {phase.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
        <span className="font-semibold text-white">{RENDER_PHASES[phaseIndex].label}</span>
        <span className="mx-2 text-slate-500">—</span>
        {phaseSummary(progress)}
      </div>

      <StructureNotes items={NOTES} hoveredId={hoverId} onHover={setListHover} />
    </div>
  );
};
