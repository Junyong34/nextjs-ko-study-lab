'use client';

/**
 * @fileoverview timeline/TimelineControls.tsx
 * 재생 컨트롤 바와 범례 칩. 좁은 폭에서 자연스럽게 래핑되도록 전부 DOM으로 둔다.
 */

import React from 'react';
import { KIND_PALETTE } from './palette';
import { formatMs } from './scale';
import type { TimelineLegendSpec } from './types';

export interface TimelineControlsProps {
  isPlaying: boolean;
  speed: number;
  displayMs: number;
  totalMs: number;
  legends: TimelineLegendSpec[];
  onToggle: () => void;
  onReplay: () => void;
  onCycleSpeed: () => void;
}

const BTN =
  'px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer';

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  speed,
  displayMs,
  totalMs,
  legends,
  onToggle,
  onReplay,
  onCycleSpeed
}) => (
  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-100 pb-3">
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
      <button
        type="button"
        onClick={onToggle}
        className={`${BTN} border border-slate-200/80 bg-white text-slate-700 shadow-2xs hover:text-blue-600`}
      >
        {isPlaying ? '⏸ 일시정지' : '▶ 재생'}
      </button>
      <button
        type="button"
        onClick={onReplay}
        className={`${BTN} text-slate-600 hover:bg-slate-200/60 hover:text-slate-900`}
        title="처음부터 다시 재생"
      >
        ↺ 처음부터
      </button>
      <button
        type="button"
        onClick={onCycleSpeed}
        className={`${BTN} ${
          speed === 1 ? 'text-slate-600 hover:bg-slate-200/60' : 'bg-blue-50 font-bold text-blue-700'
        }`}
        title="재생 속도 전환 (1× → 2× → 0.5×)"
      >
        {speed}× 속도
      </button>
      <span className="px-2 font-mono text-[11px] whitespace-nowrap text-slate-500">
        {formatMs(displayMs)} / {formatMs(totalMs)}
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-1.5">
      {legends.map((legend) => {
        const palette = KIND_PALETTE[legend.kind];
        return (
          <span
            key={`${legend.kind}-${legend.label}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: palette.ghost, borderColor: palette.stroke, color: palette.text }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: palette.stroke }}
            />
            {legend.label}
          </span>
        );
      })}
    </div>
  </div>
);
