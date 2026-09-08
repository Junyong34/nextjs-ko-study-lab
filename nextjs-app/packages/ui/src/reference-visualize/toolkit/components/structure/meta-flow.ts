/**
 * @fileoverview structure/meta-flow.ts
 * 좌측 세그먼트 카드 — 평가 순서대로 활성화되고, 결과 패널로 전달 화살표를 쏜다.
 * 결과 `<head>` 패널은 meta-head.ts가 그린다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { drawLineArrowHead } from '../timeline/arrow-head';
import { fitLabel } from '../timeline/label-fit';
import { STRUCTURE_UI, drawPanel } from './frame';
import { segmentPulse } from './meta-merge';
import type { MetadataSegment, Panel } from './types';

const SEG_COLOR = ['#3b82f6', '#8b5cf6', '#ec4899'];
export const META_ROW_H = 15;

export function segmentColor(index: number): string {
  return SEG_COLOR[index % SEG_COLOR.length];
}

export interface SegmentPaintOptions {
  panel: Panel;
  segments: MetadataSegment[];
  progress: number;
  hoveredId: string | null;
}

/** 좌측 세그먼트 카드 — 평가 순서대로 활성화된다 */
export function paintSegments(
  ctx: CanvasRenderingContext2D,
  { panel, segments, progress, hoveredId }: SegmentPaintOptions
): void {
  drawPanel(ctx, panel, '평가 순서 — root → 아래');

  const top = panel.y + 26;
  const gap = 6;
  const cardH = (panel.height - 26 - 8 - gap * (segments.length - 1)) / segments.length;

  segments.forEach((segment, index) => {
    const color = segmentColor(index);
    const y = top + index * (cardH + gap);
    const applied = progress >= segment.resolveAt;
    const pulse = segmentPulse(segment, progress);
    const isHovered = hoveredId === segment.id;

    drawRoundRect(ctx, {
      x: panel.x + 10,
      y,
      width: panel.width - 20,
      height: cardH,
      radius: 7,
      fill: applied ? `${color}10` : '#f8fafc',
      stroke: isHovered || pulse > 0 ? color : applied ? `${color}88` : STRUCTURE_UI.panelBorder,
      lineWidth: isHovered ? 2.2 : pulse > 0 ? 1.6 + pulse : 1.2,
      lineDash: applied ? undefined : [4, 3]
    });

    const label = segment.isGenerate ? `${segment.label} (async)` : segment.label;
    const fit = fitLabel(ctx, label, panel.width - 40, index, [11, 10, 9]);
    if (fit.mode !== 'none') {
      drawText(ctx, fit.text, {
        x: panel.x + 18,
        y: y + 13,
        baseline: 'middle',
        fontSize: fit.fontSize,
        fontWeight: 700,
        color: applied ? color : STRUCTURE_UI.faint
      });
    }

    segment.entries.forEach((entry, entryIndex) => {
      const ey = y + 26 + entryIndex * META_ROW_H;
      if (ey + META_ROW_H > y + cardH) return;
      drawText(ctx, `${entry.key}: ${entry.value}`, {
        x: panel.x + 18,
        y: ey,
        baseline: 'middle',
        fontSize: 9,
        fontWeight: 600,
        color: applied ? '#475569' : STRUCTURE_UI.faint
      });
    });
  });
}

/** 활성 세그먼트 카드에서 결과 패널로 향하는 전달 화살표 */
export function paintHandoff(
  ctx: CanvasRenderingContext2D,
  from: Panel,
  to: Panel,
  segments: MetadataSegment[],
  progress: number
): void {
  const top = from.y + 26;
  const gap = 6;
  const cardH = (from.height - 26 - 8 - gap * (segments.length - 1)) / segments.length;

  segments.forEach((segment, index) => {
    const pulse = segmentPulse(segment, progress);
    if (pulse <= 0) return;
    const y = top + index * (cardH + gap) + cardH / 2;
    const x0 = from.x + from.width - 8;
    const x1 = to.x - 4;

    ctx.save();
    ctx.strokeStyle = segmentColor(index);
    ctx.globalAlpha = pulse;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.restore();

    drawLineArrowHead(ctx, x1, y, 0, segmentColor(index), 4, 1.3);
  });
}

/** 세그먼트 카드 위 포인터 판정 */
export function hitTestSegments(
  panel: Panel,
  segments: MetadataSegment[],
  pointer: { x: number; y: number; isInside: boolean }
): string | null {
  if (!pointer.isInside) return null;
  if (pointer.x < panel.x || pointer.x > panel.x + panel.width) return null;

  const top = panel.y + 26;
  const gap = 6;
  const cardH = (panel.height - 26 - 8 - gap * (segments.length - 1)) / segments.length;
  const index = Math.floor((pointer.y - top) / (cardH + gap));
  if (index < 0 || index >= segments.length) return null;
  return segments[index].id;
}
