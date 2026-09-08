/**
 * @fileoverview Canvas Line & Arrow Primitives
 * 직선, 점선, 베지어 곡선, 화살표 드로잉 함수
 */

import type { BaseStyleOptions, Point } from '../core/types';

export interface LineOptions extends BaseStyleOptions {
  from: Point | [number, number];
  to: Point | [number, number];
}

/** 직선 그리기 */
export function drawLine(ctx: CanvasRenderingContext2D, options: LineOptions): void {
  const { from, to, stroke = '#adb5bd', lineWidth = 1, lineDash, lineCap = 'round', globalAlpha } = options;

  const fx = Array.isArray(from) ? from[0] : from.x;
  const fy = Array.isArray(from) ? from[1] : from.y;
  const tx = Array.isArray(to) ? to[0] : to.x;
  const ty = Array.isArray(to) ? to[1] : to.y;

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;

  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  ctx.restore();
}

export interface DashedLineOptions extends LineOptions {
  dashPattern?: number[];
}

/** 점선 그리기 */
export function drawDashedLine(ctx: CanvasRenderingContext2D, options: DashedLineOptions): void {
  const { dashPattern = [5, 4], ...rest } = options;
  drawLine(ctx, { ...rest, lineDash: dashPattern });
}

export interface ArrowOptions extends BaseStyleOptions {
  from: Point | [number, number];
  to: Point | [number, number];
  arrowSize?: number;
  arrowAngle?: number;
  doubleHeaded?: boolean;
}

/** 화살표 그리기 (선 + 화살촉) */
export function drawArrow(ctx: CanvasRenderingContext2D, options: ArrowOptions): void {
  const {
    from,
    to,
    arrowSize = 8,
    arrowAngle = Math.PI / 6, // 30도
    doubleHeaded = false,
    stroke = '#adb5bd',
    fill = stroke,
    lineWidth = 1.5,
    lineDash,
    globalAlpha
  } = options;

  const fx = Array.isArray(from) ? from[0] : from.x;
  const fy = Array.isArray(from) ? from[1] : from.y;
  const tx = Array.isArray(to) ? to[0] : to.x;
  const ty = Array.isArray(to) ? to[1] : to.y;

  const angle = Math.atan2(ty - fy, tx - fx);

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  // 본체 선
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  ctx.setLineDash([]); // 화살촉은 실선으로 채움

  // 끝점 화살촉 그리기 헬퍼
  const drawHead = (hx: number, hy: number, headAngle: number) => {
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(
      hx - arrowSize * Math.cos(headAngle - arrowAngle),
      hy - arrowSize * Math.sin(headAngle - arrowAngle)
    );
    ctx.lineTo(
      hx - arrowSize * Math.cos(headAngle + arrowAngle),
      hy - arrowSize * Math.sin(headAngle + arrowAngle)
    );
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  drawHead(tx, ty, angle);

  if (doubleHeaded) {
    drawHead(fx, fy, angle + Math.PI);
  }

  ctx.restore();
}
