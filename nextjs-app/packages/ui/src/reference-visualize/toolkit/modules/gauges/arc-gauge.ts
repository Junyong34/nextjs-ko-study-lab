/**
 * @fileoverview Arc Gauge Module
 * 원호(Arc) 형태의 게이지/미터 시각화 모듈
 */

import { drawArc } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { clamp } from '../../core/math';
import type { Point } from '../../core/types';

export interface ArcGaugeOptions {
  center: Point | [number, number];
  radius: number;
  value: number;
  minValue?: number;
  maxValue?: number;
  startAngle?: number; // 기본값: 0.75 * Math.PI (약 135도)
  endAngle?: number;   // 기본값: 2.25 * Math.PI (약 405도)
  trackWidth?: number;
  trackColor?: string;
  fillColor?: string;
  title?: string;
  unit?: string;
  showValueText?: boolean;
}

/** 원형/호 게이지 드로잉 */
export function drawArcGauge(ctx: CanvasRenderingContext2D, options: ArcGaugeOptions): void {
  const {
    center,
    radius,
    value,
    minValue = 0,
    maxValue = 100,
    startAngle = 0.75 * Math.PI,
    endAngle = 2.25 * Math.PI,
    trackWidth = 10,
    trackColor = '#e9ecef',
    fillColor = '#228be6',
    title,
    unit = '',
    showValueText = true
  } = options;

  const cx = Array.isArray(center) ? center[0] : center.x;
  const cy = Array.isArray(center) ? center[1] : center.y;

  // 정규화된 진행률 (0 ~ 1)
  const ratio = clamp((value - minValue) / (maxValue - minValue), 0, 1);
  const currentAngle = startAngle + (endAngle - startAngle) * ratio;

  // 1. 배경 트랙 그리기
  drawArc(ctx, {
    x: cx,
    y: cy,
    radius,
    startAngle,
    endAngle,
    stroke: trackColor,
    lineWidth: trackWidth,
    lineCap: 'round'
  });

  // 2. 활성 값 호 그리기
  if (ratio > 0.001) {
    drawArc(ctx, {
      x: cx,
      y: cy,
      radius,
      startAngle,
      endAngle: currentAngle,
      stroke: fillColor,
      lineWidth: trackWidth,
      lineCap: 'round'
    });
  }

  // 3. 중앙 텍스트 (값 및 제목)
  if (showValueText) {
    const displayValue = `${Math.round(value)}${unit}`;
    drawText(ctx, displayValue, {
      x: cx,
      y: cy + (title ? -2 : 4),
      fontSize: Math.max(14, Math.round(radius * 0.4)),
      fontWeight: 700,
      color: '#343a40',
      align: 'center',
      baseline: 'middle'
    });
  }

  if (title) {
    drawText(ctx, title, {
      x: cx,
      y: cy + radius * 0.45,
      fontSize: Math.max(10, Math.round(radius * 0.22)),
      fontWeight: 500,
      color: '#868e96',
      align: 'center',
      baseline: 'middle'
    });
  }
}
