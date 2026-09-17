'use client';

/**
 * @fileoverview structure/StructureControls.tsx
 * 구조 데모 3종이 공유하는 재생 컨트롤 바.
 * 같은 그룹의 데모끼리 조작 방법이 달라지지 않도록 이 컴포넌트 하나만 쓴다.
 */

import React from 'react';

export interface StructureControlsProps {
  isPlaying: boolean;
  speed: number;
  /** 현재 재생 위치 표시 문자열 (예: "680ms / 2,000ms") */
  readout: string;
  onToggle: () => void;
  onReplay: () => void;
  onCycleSpeed: () => void;
  /** 우측 슬롯 — 범례나 데모 고유 버튼 */
  extra?: React.ReactNode;
}

const BTN =
  'px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer';

export const StructureControls: React.FC<StructureControlsProps> = ({
  isPlaying,
  speed,
  readout,
  onToggle,
  onReplay,
  onCycleSpeed,
  extra
}) => (
  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
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
      <span className="px-2 font-mono text-[11px] whitespace-nowrap text-slate-500">{readout}</span>
    </div>

    {extra && <div className="flex flex-wrap items-center gap-1.5">{extra}</div>}
  </div>
);

export interface StructureLegendChipProps {
  color: string;
  label: string;
}

/** 컨트롤 바 우측에 놓는 범례 칩 */
export const StructureLegendChip: React.FC<StructureLegendChipProps> = ({ color, label }) => (
  <span
    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-semibold"
    style={{ backgroundColor: `${color}14`, borderColor: color, color }}
  >
    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </span>
);
