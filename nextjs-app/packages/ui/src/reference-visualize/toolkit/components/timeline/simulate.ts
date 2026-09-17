/**
 * @fileoverview timeline/simulate.ts
 * 재생 시각 nowMs에서 각 레인이 어떤 상태인지 계산한다.
 * 그리기와 완전히 분리되어 있어, 값만 따로 검증할 수 있다.
 */

import type {
  HandledEvent,
  LaneRuntimeState,
  TimelineLaneSpec,
  TimelineTaskSpec
} from './types';

/** 대기 큐에 쌓였는지 / 이미 처리됐는지를 nowMs 기준으로 분류한다 */
export function simulateLane(lane: TimelineLaneSpec, nowMs: number): LaneRuntimeState {
  let activeTask: TimelineTaskSpec | null = null;
  for (const task of lane.tasks) {
    if (nowMs >= task.startMs && nowMs < task.startMs + task.durationMs) {
      activeTask = task;
      break;
    }
  }

  const queued = lane.events.filter((e) => nowMs >= e.arriveMs && nowMs < e.handledMs);
  const handled: HandledEvent[] = lane.events
    .filter((e) => nowMs >= e.handledMs)
    .map((e) => ({ spec: e, waitedMs: Math.max(0, e.handledMs - e.arriveMs) }));

  const maxWaitMs = handled.reduce((max, h) => Math.max(max, h.waitedMs), 0);
  const liveWaitMs = queued.reduce((max, e) => Math.max(max, nowMs - e.arriveMs), 0);

  let lastYieldMs: number | null = null;
  for (const y of lane.yieldPointsMs ?? []) {
    if (nowMs >= y) lastYieldMs = y;
  }

  return {
    activeTask,
    queued,
    handled,
    maxWaitMs: Math.max(maxWaitMs, liveWaitMs),
    isComplete: nowMs >= lane.completeMs,
    lastYieldMs
  };
}

export interface YieldSignal {
  /** 제어권을 양보한 시각 */
  atMs: number;
  /** 남은 작업이 다시 시작되는 시각 (없으면 atMs) */
  resumeMs: number;
  /** 스파크 밝기 0~1 — 지나간 직후 1에서 0으로 감쇠 */
  spark: number;
  /** 스케줄 아크 위를 이동하는 파티클 진행도 0~1 */
  particleT: number;
  passed: boolean;
}

const CONTINUATION_KINDS = new Set(['work', 'network', 'cache', 'block']);

/**
 * 양보 지점마다 "남은 작업이 다음 태스크로 예약됐다"는 신호를 만든다.
 * 스파크 지속과 파티클 이동 창은 축 전체 길이에 비례해 잡아,
 * 400ms 타임라인과 3,200ms 타임라인이 같은 속도감으로 보이게 한다.
 */
export function computeYieldSignals(lane: TimelineLaneSpec, nowMs: number, totalMs: number): YieldSignal[] {
  const points = lane.yieldPointsMs ?? [];
  if (points.length === 0) return [];

  const sparkWindow = Math.min(300, Math.max(20, totalMs * 0.05));

  return points.map((atMs) => {
    const next = lane.tasks.find((t) => t.startMs >= atMs - 1 && CONTINUATION_KINDS.has(t.kind));
    const resumeMs = next ? next.startMs : atMs;
    const travelWindow = Math.max(resumeMs - atMs, totalMs * 0.06);
    const passed = nowMs >= atMs;
    const age = nowMs - atMs;

    return {
      atMs,
      resumeMs,
      spark: passed ? Math.max(0, 1 - age / sparkWindow) : 0,
      particleT: passed ? Math.max(0, Math.min(1, age / travelWindow)) : 0,
      passed
    };
  });
}

/** 이벤트 처리 직후의 팝 링 애니메이션 세기 (0~1) */
export function handledPop(handledMs: number, nowMs: number, totalMs: number): number {
  const window = Math.min(220, Math.max(16, totalMs * 0.04));
  const age = nowMs - handledMs;
  if (age < 0 || age > window) return 0;
  return 1 - age / window;
}

/** 도착 직후 아래에서 떠오르는 오프셋 (px 비율 0~1, 1이면 완전히 아래) */
export function arriveRise(arriveMs: number, nowMs: number, totalMs: number): number {
  const window = Math.min(160, Math.max(12, totalMs * 0.03));
  const age = nowMs - arriveMs;
  if (age < 0) return 1;
  if (age > window) return 0;
  return 1 - age / window;
}
