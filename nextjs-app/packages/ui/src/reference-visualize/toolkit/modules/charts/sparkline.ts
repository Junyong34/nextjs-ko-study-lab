/**
 * @fileoverview Sparkline & Line Chart Module
 * 데이터 배열을 전달받아 영역에 맞추어 스케일링하여 선 그래프를 렌더링하는 모듈
 */

import { drawCircle } from '../../primitives/shapes';
import type { Bounds, Point, BaseStyleOptions } from '../../core/types';

export interface SparklineOptions extends BaseStyleOptions {
  bounds: Bounds;
  data: number[] | Point[];
  minVal?: number;
  maxVal?: number;
  showLastDot?: boolean;
  dotColor?: string;
  dotRadius?: number;
}

/** 스파크라인 / 라인 차트 드로잉 */
export function drawSparkline(ctx: CanvasRenderingContext2D, options: SparklineOptions): void {
  const {
    bounds,
    data,
    minVal: explicitMin,
    maxVal: explicitMax,
    stroke = '#228be6',
    lineWidth = 2,
    lineDash,
    lineCap = 'round',
    lineJoin = 'round',
    showLastDot = false,
    dotColor = '#fa5252',
    dotRadius = 4,
    globalAlpha
  } = options;

  if (!data || data.length < 2) return;

  // 데이터 정규화
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
    // Point[] 형식인 경우 bounds 기준으로 그대로 매핑
    points.push(...(data as Point[]));
  }

  ctx.save();
  if (globalAlpha !== undefined) ctx.globalAlpha = globalAlpha;
  if (lineDash) ctx.setLineDash(lineDash);

  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // 마지막 점 강조 (현재 실시간 데이터 포인트 표시)
  if (showLastDot && points.length > 0) {
    const last = points[points.length - 1];
    drawCircle(ctx, {
      x: last.x,
      y: last.y,
      radius: dotRadius,
      fill: dotColor
    });
  }

  ctx.restore();
}
