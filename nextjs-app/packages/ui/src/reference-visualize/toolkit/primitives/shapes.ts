/**
 * @fileoverview Canvas Shape Primitives
 * 둥근 모서리 사각형, 원, 호, 다각형 등 아토믹 도형 드로잉 함수
 */

import type { BaseStyleOptions } from '../core/types';

export interface RoundRectOptions extends BaseStyleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number | number[];
}

/** 둥근 모서리 사각형 그리기 (기존 300+회 중복 ll/K/roundRect 헬퍼 통합) */
export function drawRoundRect(ctx: CanvasRenderingContext2D, options: RoundRectOptions): void {
  const {
    x,
    y,
    width,
    height,
    radius = 6,
    fill,
    stroke,
    lineWidth = 1,
    lineDash,
    globalAlpha
  } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    // CanvasRenderingContext2D.roundRect 폴리필
    const r = typeof radius === 'number' ? radius : radius[0] || 0;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  ctx.restore();
}

export interface CircleOptions extends BaseStyleOptions {
  x: number;
  y: number;
  radius: number;
}

/** 원 그리기 */
export function drawCircle(ctx: CanvasRenderingContext2D, options: CircleOptions): void {
  const { x, y, radius, fill, stroke, lineWidth = 1, lineDash, globalAlpha } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  ctx.restore();
}

export interface ArcOptions extends BaseStyleOptions {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  counterClockwise?: boolean;
}

/** 호(Arc) 그리기 */
export function drawArc(ctx: CanvasRenderingContext2D, options: ArcOptions): void {
  const {
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterClockwise = false,
    fill,
    stroke,
    lineWidth = 1,
    lineCap = 'round',
    globalAlpha
  } = options;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;

  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, radius), startAngle, endAngle, counterClockwise);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.stroke();
  }

  ctx.restore();
}
