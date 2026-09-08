'use client';

/**
 * @fileoverview timeline/TimelineStepList.tsx
 * 캔버스 밖 DOM 스텝 리스트. 긴 한국어 설명은 전부 여기에 두고,
 * 캔버스에는 짧은 라벨만 남겨 어떤 폭에서도 글자가 겹치지 않게 한다.
 */

import React from 'react';
import { KIND_PALETTE } from './palette';
import { formatMs } from './scale';
import { ordinalGlyph } from './label-fit';
import type { TimelineLaneSpec } from './types';

export interface TimelineStepListProps {
  lane: TimelineLaneSpec;
  hoveredTaskId: string | null;
  onHoverTask: (taskId: string | null) => void;
}

export const TimelineStepList: React.FC<TimelineStepListProps> = ({
  lane,
  hoveredTaskId,
  onHoverTask
}) => {
  const isBefore = lane.variant === 'before';

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${
        isBefore ? 'border-rose-200/70 bg-rose-50/30' : 'border-blue-200/70 bg-blue-50/30'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-xs font-bold text-slate-900">
          {isBefore ? '🔒' : '⚡'} {lane.title}
        </h4>
        <span className="text-[11px] font-mono text-slate-500 shrink-0">
          {formatMs(lane.metricMs)}
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-600">{lane.summary}</p>

      <ol className="space-y-1">
        {lane.tasks.map((task, index) => {
          const palette = KIND_PALETTE[task.kind];
          const isHovered = hoveredTaskId === task.id;
          return (
            <li
              key={task.id}
              onMouseEnter={() => onHoverTask(task.id)}
              onMouseLeave={() => onHoverTask(null)}
              className={`flex gap-2 rounded-md px-2 py-1.5 transition-colors cursor-default ${
                isHovered ? 'bg-white shadow-xs ring-1 ring-slate-200' : 'hover:bg-white/70'
              }`}
            >
              <span
                className="mt-0.5 shrink-0 text-[11px] font-bold leading-none"
                style={{ color: palette.text }}
              >
                {ordinalGlyph(index)}
              </span>
              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[11px] font-bold" style={{ color: palette.text }}>
                    {task.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatMs(task.startMs)} – {formatMs(task.startMs + task.durationMs)}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 break-keep">{task.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {lane.events.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 border-t border-slate-200/70 pt-2">
          {lane.events.map((event) => {
            const waited = Math.max(0, event.handledMs - event.arriveMs);
            const tone =
              waited <= 50
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : waited <= 200
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700';
            return (
              <li
                key={event.id}
                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${tone}`}
                title={event.detail}
              >
                {event.label} · {waited <= 0 ? '0ms 대기' : `${formatMs(waited)} 대기`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
