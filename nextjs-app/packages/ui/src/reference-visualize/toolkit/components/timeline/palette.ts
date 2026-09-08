/**
 * @fileoverview timeline/palette.ts
 * 태스크 종류별 색상 팔레트. 캔버스(paint-*)와 DOM(범례·스텝 리스트)이 같은 값을 공유한다.
 */

import type { TaskKind } from './types';

export interface KindPalette {
  /** 재생 헤드가 지나간 뒤의 채움색 */
  fill: string;
  /** 아직 지나지 않은 예정 구간의 옅은 채움색 */
  ghost: string;
  stroke: string;
  text: string;
}

export const KIND_PALETTE: Record<TaskKind, KindPalette> = {
  work: { fill: '#dbeafe', ghost: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
  block: { fill: '#fee2e2', ghost: '#fef2f2', stroke: '#ef4444', text: '#b91c1c' },
  network: { fill: '#ede9fe', ghost: '#f5f3ff', stroke: '#8b5cf6', text: '#6d28d9' },
  render: { fill: '#dcfce7', ghost: '#f0fdf4', stroke: '#22c55e', text: '#15803d' },
  input: { fill: '#fef3c7', ghost: '#fffbeb', stroke: '#f59e0b', text: '#b45309' },
  cache: { fill: '#ffedd5', ghost: '#fff7ed', stroke: '#f97316', text: '#c2410c' },
  idle: { fill: '#e2e8f0', ghost: '#f8fafc', stroke: '#94a3b8', text: '#475569' }
};

export const KIND_LABEL: Record<TaskKind, string> = {
  work: '작업',
  block: '블로킹',
  network: '네트워크',
  render: '렌더',
  input: '입력',
  cache: '캐시',
  idle: '유휴'
};

/** 대기 시간에 따른 지연 막대 색 — 초록 → 호박 → 빨강 */
export function waitColor(waitedMs: number): string {
  if (waitedMs <= 50) return '#22c55e';
  if (waitedMs <= 200) return '#f59e0b';
  return '#ef4444';
}

export const UI = {
  axisText: '#94a3b8',
  guide: '#eef2f6',
  laneTitle: '#0f172a',
  laneSub: '#64748b',
  playhead: '#2563eb',
  flag: '#0f172a',
  surface: '#ffffff'
} as const;
