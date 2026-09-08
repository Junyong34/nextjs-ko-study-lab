/**
 * @fileoverview Canvas Grid & Axis Helpers
 * 보조선 그리드 및 중심 십자선 드로잉 함수
 */

import type { Bounds, BaseStyleOptions } from '../core/types';

export interface GridOptions extends BaseStyleOptions {
  bounds: Bounds;
  stepX?: number;
  stepY?: number;
  step?: number;
}

/** 사각 영역 내 격자 보조선 그리기 */
export function drawGrid(ctx: CanvasRenderingContext2D, options: GridOptions): void {
  const {
    bounds,
    step,
    stepX = step ?? 40,
    stepY = step ?? 40,
    stroke = '#f1f3f5',
    lineWidth = 1,
    lineDash,
    globalAlpha
  } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  // 수직선
  for (let x = bounds.x; x <= bounds.x + bounds.width; x += stepX) {
    ctx.moveTo(x, bounds.y);
    ctx.lineTo(x, bounds.y + bounds.height);
  }

  // 수평선
  for (let y = bounds.y; y <= bounds.y + bounds.height; y += stepY) {
    ctx.moveTo(bounds.x, y);
    ctx.lineTo(bounds.x + bounds.width, y);
  }

  ctx.stroke();
  ctx.restore();
}

export interface CrosshairOptions extends BaseStyleOptions {
  x: number;
  y: number;
  length?: number;
}

/** 중심 십자선 (+) 그리기 */
export function drawCrosshair(ctx: CanvasRenderingContext2D, options: CrosshairOptions): void {
  const { x, y, length = 10, stroke = '#adb5bd', lineWidth = 1, globalAlpha } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  ctx.moveTo(x - length, y);
  ctx.lineTo(x + length, y);
  ctx.moveTo(x, y - length);
  ctx.lineTo(x, y + length);

  ctx.stroke();
  ctx.restore();
}
