'use client';

/**
 * @fileoverview cache-components/sequence.ts
 * 단계 재생이 필요한 데모(셸·태그)를 위한 얇은 래퍼.
 * 캔버스는 `advance()`가 매 프레임 돌려주는 값으로 그리고, DOM 문구만 `displayMs`를 쓴다.
 */

import { useTimelinePlayback } from '../../hooks/useTimelinePlayback';

/** 한 단계에 배정하는 가상 시간 */
export const STEP_MS = 1000;

export function useCacheSequence(stepCount: number, msPerStep = 1700) {
  const playback = useTimelinePlayback({
    totalMs: stepCount * STEP_MS,
    cycleMs: stepCount * msPerStep,
    holdMs: 1400
  });

  return {
    ...playback,
    stepCount,
    /** DOM 문구용 — 12.5Hz로 갱신되는 표시값 기준 */
    step: stepAt(playback.displayMs, stepCount)
  };
}

/** 재생 시각 → 단계 인덱스 */
export function stepAt(nowMs: number, stepCount: number): number {
  return Math.max(0, Math.min(stepCount - 1, Math.floor(nowMs / STEP_MS)));
}

/** 현재 단계 안에서의 진행도 0~1 */
export function stepProgress(nowMs: number): number {
  return Math.max(0, Math.min(1, (nowMs % STEP_MS) / STEP_MS));
}

/** 단계 전환 직후의 강조 세기 (0~1) */
export function stepEnterPulse(nowMs: number): number {
  const p = stepProgress(nowMs);
  return p < 0.25 ? 1 - p / 0.25 : 0;
}
