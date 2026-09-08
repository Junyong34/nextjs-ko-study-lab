/**
 * @fileoverview Pulse Indicator Module
 * 상태 표시 점, 방사형 펄스 링 애니메이션 렌더링 모듈
 */

import { drawCircle } from '../../primitives/shapes';
import { clamp } from '../../core/math';
import type { Point } from '../../core/types';

export interface PulseIndicatorOptions {
  center: Point | [number, number];
  color?: string;
  radius?: number;
  pulseProgress?: number; // 0 ~ 1 사이의 펄스 주기 진행도
  maxSpread?: number;
}

/** 펄스 링 및 상태 인디케이터 드로잉 */
export function drawPulseIndicator(
  ctx: CanvasRenderingContext2D,
  options: PulseIndicatorOptions
): void {
  const {
    center,
    color = '#228be6',
    radius = 5,
    pulseProgress = 0,
    maxSpread = 16
  } = options;

  const cx = Array.isArray(center) ? center[0] : center.x;
  const cy = Array.isArray(center) ? center[1] : center.y;

  const progress = clamp(pulseProgress, 0, 1);

  // 1. 방사형 펄스 링 (바깥으로 퍼지며 투명해짐)
  if (progress > 0 && progress < 1) {
    const spreadRadius = radius + progress * maxSpread;
    const alpha = (1 - progress) * 0.7;

    drawCircle(ctx, {
      x: cx,
      y: cy,
      radius: spreadRadius,
      stroke: color,
      lineWidth: 1.5,
      globalAlpha: alpha
    });
  }

  // 2. 중심 도트 (Solid)
  drawCircle(ctx, {
    x: cx,
    y: cy,
    radius,
    fill: color
  });
}
