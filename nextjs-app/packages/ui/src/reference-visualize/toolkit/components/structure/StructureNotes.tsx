'use client';

/**
 * @fileoverview structure/StructureNotes.tsx
 * 캔버스 밖 DOM 설명 리스트. 긴 한국어 문장은 전부 여기에 두고,
 * 캔버스에는 짧은 라벨만 남겨 어떤 폭에서도 글자가 겹치지 않게 한다.
 * 캔버스 요소와는 `id`로 연결되어 호버가 양방향 동기화된다.
 */

import React from 'react';
import type { NoteItem } from './types';

export interface StructureNotesProps {
  items: NoteItem[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  /** 기본 2열, 항목이 적으면 1열로 */
  columns?: 1 | 2;
  caption?: string;
}

export const StructureNotes: React.FC<StructureNotesProps> = ({
  items,
  hoveredId,
  onHover,
  columns = 2,
  caption
}) => (
  <div className="space-y-2">
    {caption && <p className="text-[11px] leading-relaxed text-slate-500">{caption}</p>}
    <ul className={`grid gap-1.5 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
      {items.map((item) => {
        const isHovered = hoveredId === item.id;
        return (
          <li
            key={item.id}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            className={`flex gap-2 rounded-md border px-2 py-1.5 transition-colors cursor-default ${
              isHovered ? 'border-slate-300 bg-white shadow-xs' : 'border-transparent bg-slate-50/70'
            }`}
          >
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[11px] font-bold" style={{ color: item.color }}>
                  {item.label}
                </span>
                {item.meta && (
                  <span className="font-mono text-[10px] text-slate-400">{item.meta}</span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed break-keep text-slate-600">{item.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);
