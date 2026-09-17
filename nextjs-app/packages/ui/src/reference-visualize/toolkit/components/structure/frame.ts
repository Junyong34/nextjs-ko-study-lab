/**
 * @fileoverview structure/frame.ts
 * 구조 데모 3종이 공유하는 캔버스 프리미티브 — 패널, 단계 인디케이터,
 * 그리고 **경계를 넘지 않는 배지**.
 *
 * `drawBadge`는 텍스트 길이만큼 폭이 늘어나므로, 호출부가 고정 여백으로 위치를 잡으면
 * 긴 한국어 문구에서 캔버스 밖으로 나간다. 여기서는 폭을 먼저 재고 안으로 밀어 넣으며,
 * 그래도 들어가지 않으면 아예 그리지 않는다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, drawBadge, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import type { Panel } from './types';

export const STRUCTURE_UI = {
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  title: '#0f172a',
  sub: '#64748b',
  faint: '#94a3b8',
  guide: '#eef2f6',
  skeleton: '#e2e8f0'
} as const;

/** 흰 배경 패널 + 좌상단 제목 */
export function drawPanel(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  title?: string,
  right?: string
): void {
  drawRoundRect(ctx, {
    x: panel.x + 0.5,
    y: panel.y + 0.5,
    width: panel.width - 1,
    height: panel.height - 1,
    radius: 9,
    fill: STRUCTURE_UI.panel,
    stroke: STRUCTURE_UI.panelBorder
  });

  if (title) {
    drawText(ctx, title, {
      x: panel.x + 12,
      y: panel.y + 15,
      fontSize: 11,
      fontWeight: 700,
      color: STRUCTURE_UI.sub,
      baseline: 'middle'
    });
  }
  if (right) {
    drawText(ctx, right, {
      x: panel.x + panel.width - 12,
      y: panel.y + 15,
      align: 'right',
      fontSize: 10,
      fontWeight: 600,
      color: STRUCTURE_UI.faint,
      baseline: 'middle'
    });
  }
}

export interface ClampedBadgeOptions {
  text: string;
  /** 원하는 좌상단 위치 — 경계를 넘으면 안으로 밀린다 */
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  paddingX?: number;
  paddingY?: number;
  radius?: number;
  border?: string;
}

/**
 * 캔버스 경계 안으로 클램프해서 배지를 그린다.
 * @returns 실제로 그렸으면 true. 폭이 캔버스보다 넓어 못 그렸으면 false.
 */
export function drawClampedBadge(
  ctx: CanvasRenderingContext2D,
  {
    text,
    x,
    y,
    canvasWidth,
    canvasHeight,
    bg = '#0f172a',
    color = '#f8fafc',
    fontSize = 10,
    paddingX = 8,
    paddingY = 3,
    radius = 6,
    border
  }: ClampedBadgeOptions
): boolean {
  ctx.font = `600 ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
  const width = ctx.measureText(text).width + paddingX * 2;
  const height = fontSize + paddingY * 2;
  const margin = 4;

  if (width > canvasWidth - margin * 2 || height > canvasHeight - margin * 2) return false;

  drawBadge(ctx, {
    text,
    x: Math.max(margin, Math.min(x, canvasWidth - width - margin)),
    y: Math.max(margin, Math.min(y, canvasHeight - height - margin)),
    fontSize,
    paddingX,
    paddingY,
    radius,
    bg,
    color,
    border
  });
  return true;
}

/** ① ② ③ 형태의 단계 인디케이터 — 현재 단계만 강조한다 */
export function drawStepIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  steps: string[],
  activeIndex: number,
  accent: string
): void {
  const marks = ['①', '②', '③', '④'];
  const gap = 10;
  ctx.font = `700 10px ${DEFAULT_FONT_FAMILY}`;
  const widths = steps.map((s, i) => ctx.measureText(`${marks[i]} ${s}`).width);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (steps.length - 1);
  // 다 못 들어가면 현재 단계 하나만 보여 준다
  const compact = total > maxWidth;

  let cursor = x;
  steps.forEach((step, i) => {
    if (compact && i !== activeIndex) return;
    const active = i === activeIndex;
    drawText(ctx, `${marks[i]} ${step}`, {
      x: compact ? x : cursor,
      y,
      fontSize: 10,
      fontWeight: active ? 700 : 600,
      color: active ? accent : STRUCTURE_UI.faint,
      baseline: 'middle'
    });
    cursor += widths[i] + gap;
  });
}

/** 스켈레톤 자리표시자 — 회색 막대 몇 줄 */
export function drawSkeletonLines(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  lines: number,
  timeMs: number
): void {
  const lineH = Math.max(5, (panel.height - (lines - 1) * 5) / lines);
  const shimmer = 0.55 + 0.2 * Math.sin(timeMs / 320);

  for (let i = 0; i < lines; i++) {
    const w = panel.width * (i === lines - 1 ? 0.6 : 1);
    drawRoundRect(ctx, {
      x: panel.x,
      y: panel.y + i * (lineH + 5),
      width: w,
      height: lineH,
      radius: 3,
      fill: STRUCTURE_UI.skeleton,
      globalAlpha: shimmer
    });
  }
}
