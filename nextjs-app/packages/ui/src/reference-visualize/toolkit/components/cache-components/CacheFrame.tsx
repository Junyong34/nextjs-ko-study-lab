'use client';

/**
 * @fileoverview cache-components/CacheFrame.tsx
 * Cache Components 데모 4종의 공통 껍데기.
 *
 * 구성 규약을 쇼케이스의 다른 데모(타임라인·구조)와 맞춘다:
 * 컨트롤은 캔버스 **위 한 줄**, 캔버스 높이는 **고정**, 긴 설명은 캔버스 밖 `StructureNotes`.
 * 단계 버튼·중복 슬라이더·긴 회색 문단을 두지 않는다 — 무엇을 만지면 무엇이 변하는지가 흐려진다.
 */

import React, { useId } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { StructureNotes } from '../structure/StructureNotes';
import type { CanvasFrameContext } from '../../core/types';
import type { NoteItem } from '../structure/types';

export const CACHE_CONTROL =
  'rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-40';

export interface CacheFrameProps {
  title: string;
  /** 근거 문서 링크 */
  source: string;
  /** 캔버스 위 한 줄에 놓이는 컨트롤 */
  controls: React.ReactNode;
  /** 캔버스 아래 결론 스트립 — "지금 무슨 일이 일어났는가" 한 줄 */
  conclusion: React.ReactNode;
  notes: NoteItem[];
  hoveredId?: string | null;
  onHoverNote?: (id: string | null) => void;
  /** 내용량과 무관하게 고정한다 */
  height: number;
  minWidth?: number;
  onFrame: (frame: CanvasFrameContext) => void;
  onCanvasClick?: React.MouseEventHandler<HTMLCanvasElement>;
  canvasCursor?: string;
}

export const CacheFrame: React.FC<CacheFrameProps> = ({
  title,
  source,
  controls,
  conclusion,
  notes,
  hoveredId = null,
  onHoverNote,
  height,
  minWidth = 640,
  onFrame,
  onCanvasClick,
  canvasCursor = 'cursor-default'
}) => {
  const id = useId();
  const { canvasRef } = useCanvas({
    trackPointer: true,
    onFrame: (frame) => {
      frame.ctx.clearRect(0, 0, frame.size.width, frame.size.height);
      onFrame(frame);
    }
  });

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>개념 시각화 · Next.js 16.3.2 기준 · 실제 서버 실행이나 측정이 아닙니다</span>
        <a className="underline underline-offset-4" href={source} target="_blank" rel="noreferrer">
          공식 문서 ↗
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">{controls}</div>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth, height }} className="relative">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={title}
            aria-describedby={id}
            onClick={onCanvasClick}
            style={{ width: '100%', height }}
            className={`block w-full select-none touch-pan-y ${canvasCursor}`}
          />
        </div>
      </div>

      <p
        id={id}
        role="status"
        className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-slate-300"
      >
        {conclusion}
      </p>

      <StructureNotes items={notes} hoveredId={hoveredId} onHover={onHoverNote ?? (() => {})} />
    </div>
  );
};
