/**
 * @fileoverview Area Fill Module
 * 데이터 곡선 아래 영역을 반투명 색상 또는 그라디언트로 채우는 모듈
 */

import type { Bounds, Point } from '../../core/types';

export interface AreaFillOptions {
  bounds: Bounds;
  data: number[] | Point[];
  minVal?: number;
  maxVal?: number;
  color?: string;
  gradient?: {
    startColor: string;
    endColor: string;
  };
}

/** 데이터 곡선 하단 면적 채우기 */
export function drawAreaFill(ctx: CanvasRenderingContext2D, options: AreaFillOptions): void {
  const {
    bounds,
    data,
    minVal: explicitMin,
    maxVal: explicitMax,
    color = 'rgba(34, 139, 230, 0.1)',
    gradient
  } = options;

  if (!data || data.length < 2) return;

  const points: Point[] = [];
  let min = explicitMin ?? Infinity;
  let max = explicitMax ?? -Infinity;

  if (typeof data[0] === 'number') {
    const numData = data as number[];
    if (explicitMin === undefined || explicitMax === undefined) {
      for (const v of numData) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    const valRange = max - min || 1;

    for (let i = 0; i < numData.length; i++) {
      const x = bounds.x + (i / (numData.length - 1)) * bounds.width;
      const normalizedY = (numData[i] - min) / valRange;
      const y = bounds.y + bounds.height - normalizedY * bounds.height;
      points.push({ x, y });
    }
  } else {
    points.push(...(data as Point[]));
  }

  const baselineY = bounds.y + bounds.height;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, baselineY);
  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.lineTo(points[points.length - 1].x, baselineY);
  ctx.closePath();

  if (gradient) {
    const grad = ctx.createLinearGradient(0, bounds.y, 0, baselineY);
    grad.addColorStop(0, gradient.startColor);
    grad.addColorStop(1, gradient.endColor);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = color;
  }

  ctx.fill();
  ctx.restore();
}
