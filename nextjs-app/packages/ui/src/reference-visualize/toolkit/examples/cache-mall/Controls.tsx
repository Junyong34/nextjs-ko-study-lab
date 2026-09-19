'use client';

/**
 * @fileoverview cache-mall/Controls.tsx
 * 데모 고유 컨트롤. 재생 바는 다른 구조 데모와 같은 `StructureControls`를 쓰고, 이 파일은
 * "설정(선택)"과 "실행(누르면 캔버스에서 일이 일어남)" 두 묶음만 담당한다.
 * 실행 버튼은 ▶ 아이콘·채운 배경·그림자로 설정 칩과 한눈에 구분되게 한다 — 무엇을 누르면
 * 무슨 일이 생기는지가 보여야 한다. 라벨은 실제 API 이름 그대로다.
 */

import React from 'react';
import { SHELF_LIFE_OPTIONS, type ShelfLifeOption, type TagMode } from '../../components/cache-components/mall-model';

const CHIP = 'rounded-md border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer';
const CHIP_OFF = 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100';
const CHIP_ON = 'border-blue-400 bg-blue-50 text-blue-700';
const ACTION =
  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-xs transition-colors cursor-pointer active:translate-y-px';
const ACTION_VIOLET = 'border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100 hover:border-violet-400';
const ACTION_VIOLET_LAST = 'border-violet-500 bg-violet-100 text-violet-900 ring-2 ring-violet-200';
const ACTION_SLATE = 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200';
const GROUP_LABEL = 'text-[10px] font-bold tracking-wide text-slate-400 whitespace-nowrap';

export interface CacheMallControlsProps {
  shelfLife: ShelfLifeOption;
  onSelectShelfLife: (option: ShelfLifeOption) => void;
  onRunTag: (mode: TagMode) => void;
  onSkip: (sec: number) => void;
  lastTag: TagMode | null;
}

const PlayIcon = () => (
  <span aria-hidden="true" className="text-[9px] leading-none">
    ▶
  </span>
);

export const CacheMallControls: React.FC<CacheMallControlsProps> = ({ shelfLife, onSelectShelfLife, onRunTag, onSkip, lastTag }) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    <fieldset className="flex flex-wrap items-center gap-1.5">
      <legend className="sr-only">진열대 cacheLife 설정</legend>
      <span className={GROUP_LABEL}>설정 · 진열대 cacheLife</span>
      {SHELF_LIFE_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={shelfLife.key === option.key}
          onClick={() => onSelectShelfLife(option)}
          className={`${CHIP} ${shelfLife.key === option.key ? CHIP_ON : CHIP_OFF}`}
          title={option.note}
        >
          {option.label}
          <span className="ml-1.5 font-mono text-[10px] font-medium opacity-70">
            {option.expire === null ? `revalidate ${option.revalidate}s` : `${option.revalidate}s / ${option.expire}s`}
          </span>
        </button>
      ))}
    </fieldset>

    <div className="flex flex-wrap items-center gap-1.5">
      <span className={GROUP_LABEL}>실행 · 누르면 캔버스에 반영</span>
      <button
        type="button"
        onClick={() => onSkip(5)}
        className={`${ACTION} ${ACTION_SLATE}`}
        title="시뮬레이션 시계를 5초 앞으로 — 기다리지 않고 수명을 넘길 수 있다"
      >
        <span aria-hidden="true" className="text-[10px] leading-none">⏩</span>
        +5s 건너뛰기
      </button>
      <button
        type="button"
        onClick={() => onRunTag('updateTag')}
        className={`${ACTION} font-mono ${lastTag === 'updateTag' ? ACTION_VIOLET_LAST : ACTION_VIOLET}`}
        title="관리자 Server Action — 즉시 만료. 다음 요청은 새 값이 준비될 때까지 기다린다"
      >
        <PlayIcon />
        updateTag('product:1')
      </button>
      <button
        type="button"
        onClick={() => onRunTag('revalidateTag')}
        className={`${ACTION} font-mono ${lastTag === 'revalidateTag' ? ACTION_VIOLET_LAST : ACTION_VIOLET}`}
        title="관리자 Server Action — STALE 표시. 다음 요청은 구값을 즉시 받고 뒤에서 갱신한다"
      >
        <PlayIcon />
        revalidateTag('product:1', 'max')
      </button>
    </div>
  </div>
);
