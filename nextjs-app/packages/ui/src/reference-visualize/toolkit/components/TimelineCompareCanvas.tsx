'use client';

/**
 * @fileoverview TimelineCompareCanvas
 * 두 레인이 하나의 시간축을 공유하는 Before/After 비교 캔버스.
 *
 * 설계 원칙:
 * - 블록 위치는 절대 시각(startMs/durationMs)에서만 나온다. 같은 ms는 두 레인에서 같은 x다.
 * - 애니메이션은 장식이 아니라 메커니즘을 보여준다 — 큐 적체, 대기 지연, 양보, 예약.
 * - 캔버스에는 짧은 라벨만, 긴 설명은 DOM(TimelineStepList)에 둔다.
 */

import React, { useCallback, useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  assignEventRows,
  computeLayout,
  computeYieldSignals,
  createTimeScale,
  formatMs,
  formatSpeedup,
  hitTestTask,
  maxEventRows,
  paintAxis,
  paintCompletionFlag,
  paintDeltaBracket,
  paintEventFlow,
  paintLaneHeader,
  paintPlayhead,
  paintScheduleArcs,
  paintTasks,
  paintTooltip,
  paintYieldSparks,
  resolveDensity,
  simulateLane,
  TimelineControls,
  TimelineStepList
} from './timeline';
import type { TimelineCompareCanvasProps, TimelineTaskSpec } from './timeline';

export const TimelineCompareCanvas: React.FC<TimelineCompareCanvasProps> = ({
  spec,
  minWidth = 520,
  minHeight = 280,
  cycleMs = 5200,
  className = ''
}) => {
  const [canvasHover, setCanvasHover] = useState<string | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const hoverId = canvasHover ?? listHover;
  const hoverRef = useRef(hoverId);
  hoverRef.current = hoverId;
  const canvasHoverRef = useRef(canvasHover);
  canvasHoverRef.current = canvasHover;
  const heightRef = useRef(canvasHeight);
  const scrubRef = useRef(-1);

  const playback = useTimelinePlayback({ totalMs: spec.totalMs, cycleMs });
  const { advance, scrubTo } = playback;

  const findTask = useCallback(
    (taskId: string): TimelineTaskSpec | undefined =>
      [...spec.before.tasks, ...spec.after.tasks].find((task) => task.id === taskId),
    [spec]
  );

  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: ({ ctx, size, pointer, deltaTime, time }) => {
      ctx.clearRect(0, 0, size.width, size.height);

      const density = resolveDensity(size.width);
      const layout = computeLayout({ width: size.width, density, laneCount: 2, minHeight });
      if (Math.abs(layout.height - heightRef.current) > 0.5) {
        heightRef.current = layout.height;
        setCanvasHeight(layout.height);
      }

      const scale = createTimeScale({
        totalMs: spec.totalMs,
        plotX: layout.plotX,
        plotWidth: layout.plotWidth
      });

      // 캔버스를 누른 채 움직이면 그 시각으로 스크럽한다
      if (pointer.isDown && pointer.isInside) {
        const ms = scale.xToMs(pointer.x);
        if (Math.abs(ms - scrubRef.current) > spec.totalMs * 0.002) {
          scrubRef.current = ms;
          scrubTo(ms);
        }
      }

      const nowMs = advance(deltaTime);
      paintAxis(ctx, layout, scale);

      const lanes = [spec.before, spec.after];
      const states = lanes.map((lane, index) => {
        const laneLayout = layout.lanes[index];
        const state = simulateLane(lane, nowMs);
        const signals = computeYieldSignals(lane, nowMs, spec.totalMs);
        const rows = assignEventRows(lane, maxEventRows(density));

        paintScheduleArcs(ctx, laneLayout, scale, signals);
        paintTasks(ctx, lane, laneLayout, {
          scale,
          nowMs,
          hoverTaskId: hoverRef.current,
          timeMs: time
        });
        paintYieldSparks(ctx, laneLayout, scale, signals);
        paintCompletionFlag(ctx, lane, laneLayout, scale, nowMs);
        paintEventFlow(ctx, lane, laneLayout, {
          scale,
          nowMs,
          totalMs: spec.totalMs,
          rows,
          density,
          timeMs: time
        });
        return state;
      });

      paintDeltaBracket(ctx, layout, scale, spec, nowMs);
      paintPlayhead(ctx, layout, scale, nowMs);

      // 레인 제목은 재생 헤드보다 위에 올려 선이 글자를 가로지르지 않게 한다
      lanes.forEach((lane, index) => {
        paintLaneHeader(ctx, lane, layout.lanes[index], {
          state: states[index],
          metricLabel: spec.metricLabel,
          compact: density === 'compact'
        });
      });

      const hit = hitTestTask(layout, scale, spec, pointer);
      const hitId = hit?.taskId ?? null;
      if (hitId !== canvasHoverRef.current) {
        canvasHoverRef.current = hitId;
        setCanvasHover(hitId);
      }
      if (hitId) {
        const task = findTask(hitId);
        if (task) paintTooltip(ctx, layout, task, pointer);
      }
    }
  });

  const speedup = formatSpeedup(spec.before.metricMs, spec.after.metricMs);

  return (
    <div
      className={`w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs ${className}`}
    >
      <TimelineControls
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        displayMs={playback.displayMs}
        totalMs={spec.totalMs}
        legends={spec.legends}
        onToggle={playback.toggle}
        onReplay={playback.replay}
        onCycleSpeed={playback.cycleSpeed}
      />

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth, height: canvasHeight }} className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: canvasHeight }}
            className="block w-full cursor-crosshair select-none touch-pan-y"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
        <span>
          <span className="font-semibold text-white">{spec.metricLabel}</span>
          <span className="mx-2 font-mono text-rose-300">{formatMs(spec.before.metricMs)}</span>
          <span className="text-slate-500">→</span>
          <span className="mx-2 font-mono text-emerald-300">{formatMs(spec.after.metricMs)}</span>
          {speedup && <span className="font-semibold text-emerald-400">{speedup}</span>}
        </span>
        <span className="text-slate-400">
          타임라인을 드래그하면 그 시각으로 이동합니다 · 블록에 마우스를 올리면 아래 설명과 연결됩니다
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TimelineStepList
          lane={spec.before}
          hoveredTaskId={hoverId}
          onHoverTask={setListHover}
        />
        <TimelineStepList
          lane={spec.after}
          hoveredTaskId={hoverId}
          onHoverTask={setListHover}
        />
      </div>
    </div>
  );
};

export type { TimelineCompareCanvasProps };
