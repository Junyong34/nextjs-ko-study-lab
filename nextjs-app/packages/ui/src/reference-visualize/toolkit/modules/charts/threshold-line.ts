/**
 * @fileoverview Threshold Line Module
 * 임계값, 목표선, 한계선을 점선 및 라벨 텍스트와 함께 드로잉하는 모듈
 */

import { drawDashedLine } from '../../primitives/lines';
import { drawText } from '../../primitives/typography';
import type { Bounds } from '../../core/types';

export interface ThresholdLineOptions {
  bounds: Bounds;
  y: number; // Y 좌표 (또는 bounds 상대 비율/값)
  label: string;
  color?: string;
  lineDash?: number[];
  lineWidth?: number;
  labelPosition?: 'left' | 'right';
}

/** 임계선 및 라벨 드로잉 */
export function drawThresholdLine(
  ctx: CanvasRenderingContext2D,
  options: ThresholdLineOptions
): void {
  const {
    bounds,
    y,
    label,
    color = '#adb5bd',
    lineDash = [5, 4],
    lineWidth = 1.2,
    labelPosition = 'left'
  } = options;

  // 1. 점선 그리기
  drawDashedLine(ctx, {
    from: [bounds.x, y],
    to: [bounds.x + bounds.width, y],
    stroke: color,
    lineWidth,
    dashPattern: lineDash
  });

  // 2. 라벨 텍스트
  const textX = labelPosition === 'left' ? bounds.x + 4 : bounds.x + bounds.width - 4;
  const align = labelPosition === 'left' ? 'left' : 'right';

  drawText(ctx, label, {
    x: textX,
    y: y - 4,
    fontSize: 10,
    fontWeight: 600,
    color,
    align,
    baseline: 'bottom'
  });
}
