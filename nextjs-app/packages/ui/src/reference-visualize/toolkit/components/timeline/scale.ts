/**
 * @fileoverview timeline/scale.ts
 * ms ↔ px 스케일, nice tick 생성, 반응형 밀도 판정.
 * 두 레인이 이 스케일 하나를 공유하므로 같은 ms는 항상 같은 x에 놓인다.
 */

import type { Density, TimeScale } from './types';

export interface TimeScaleOptions {
  totalMs: number;
  plotX: number;
  plotWidth: number;
}

export function createTimeScale({ totalMs, plotX, plotWidth }: TimeScaleOptions): TimeScale {
  const span = Math.max(1, totalMs);
  return {
    totalMs: span,
    plotX,
    plotWidth,
    msToX: (ms: number) => plotX + (Math.max(0, Math.min(span, ms)) / span) * plotWidth,
    xToMs: (x: number) => ((Math.max(plotX, Math.min(plotX + plotWidth, x)) - plotX) / plotWidth) * span
  };
}

/** 1 · 2 · 5 × 10ⁿ 계열에서 읽기 좋은 눈금 간격을 고른다 */
export function niceStep(totalMs: number, targetCount: number): number {
  const raw = totalMs / Math.max(1, targetCount);
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(1, raw))));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
}

/** 0부터 totalMs까지의 눈금 값 목록. 마지막 눈금은 항상 totalMs다 */
export function niceTicks(totalMs: number, targetCount: number): number[] {
  const step = niceStep(totalMs, targetCount);
  const ticks: number[] = [];
  for (let ms = 0; ms < totalMs - step * 0.35; ms += step) {
    ticks.push(Math.round(ms));
  }
  ticks.push(Math.round(totalMs));
  return ticks;
}

/** 캔버스 폭에 따른 표현 밀도 */
export function resolveDensity(width: number): Density {
  if (width < 620) return 'compact';
  if (width < 900) return 'regular';
  return 'comfortable';
}

export function tickCountFor(density: Density): number {
  if (density === 'compact') return 3;
  if (density === 'regular') return 5;
  return 7;
}

/** 1,240ms / 2.4s 형태로 사람이 읽기 좋게 포맷한다 */
export function formatMs(ms: number): string {
  const value = Math.round(ms);
  if (value >= 10000) return `${(value / 1000).toFixed(1)}s`;
  return `${value.toLocaleString('en-US')}ms`;
}

/** 개선 배수 — 0ms까지 줄어든 경우는 즉시로 표기한다 */
export function formatSpeedup(beforeMs: number, afterMs: number): string {
  if (afterMs <= 0) return '즉시 반영';
  const ratio = beforeMs / afterMs;
  if (!Number.isFinite(ratio) || ratio <= 1) return '';
  return `${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}× 빠름`;
}
