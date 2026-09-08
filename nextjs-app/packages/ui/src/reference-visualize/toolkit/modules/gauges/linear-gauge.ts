/**
 * @fileoverview Linear Gauge / Progress Bar Module
 * 수평/수직 선형 게이지 및 프로그레스 바 시각화 모듈
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { clamp } from '../../core/math';
import type { Bounds } from '../../core/types';

export interface LinearGaugeOptions {
  bounds: Bounds;
  value: number;
  minValue?: number;
  maxValue?: number;
  trackColor?: string;
  fillColor?: string;
  radius?: number;
  showLabel?: boolean;
  label?: string;
  unit?: string;
}

/** 선형 프로그레스 바/게이지 드로잉 */
export function drawLinearGauge(ctx: CanvasRenderingContext2D, options: LinearGaugeOptions): void {
  const {
    bounds,
    value,
    minValue = 0,
    maxValue = 100,
    trackColor = '#f1f3f5',
    fillColor = '#228be6',
    radius = 4,
    showLabel = false,
    label,
    unit = '%'
  } = options;

  const ratio = clamp((value - minValue) / (maxValue - minValue), 0, 1);

  // 1. 배경 트랙
  drawRoundRect(ctx, {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    radius,
    fill: trackColor
  });

  // 2. 활성 채움 바
  const fillWidth = Math.max(0, bounds.width * ratio);
  if (fillWidth > 0) {
    drawRoundRect(ctx, {
      x: bounds.x,
      y: bounds.y,
      width: fillWidth,
      height: bounds.height,
      radius: fillWidth < radius * 2 ? 2 : radius,
      fill: fillColor
    });
  }

  // 3. 라벨 텍스트
  if (showLabel || label) {
    const text = label ?? `${Math.round(ratio * 100)}${unit}`;
    drawText(ctx, text, {
      x: bounds.x + bounds.width + 8,
      y: bounds.y + bounds.height / 2,
      fontSize: 11,
      fontWeight: 600,
      color: '#495057',
      align: 'left',
      baseline: 'middle'
    });
  }
}
