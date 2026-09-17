'use client';

/**
 * @fileoverview useTimelinePlayback
 * 타임라인 재생 상태(재생/일시정지·속도·스크럽·루프 홀드)를 ref로 구동한다.
 * 프레임마다 setState 하지 않고, 화면 표시용 시각만 낮은 빈도로 동기화한다.
 */

import { useCallback, useRef, useState } from 'react';

export interface UseTimelinePlaybackOptions {
  /** 타임라인 축의 전체 길이 (시뮬레이션 시간) */
  totalMs: number;
  /** 0 → totalMs 를 재생하는 실제 벽시계 시간 */
  cycleMs?: number;
  /** 사이클 끝에서 최종 상태를 보여주며 멈춰 있는 시간 */
  holdMs?: number;
  autoPlay?: boolean;
}

export type PlaybackSpeed = 0.5 | 1 | 2;

export function useTimelinePlayback({
  totalMs,
  cycleMs = 5200,
  holdMs = 900,
  autoPlay = true
}: UseTimelinePlaybackOptions) {
  const elapsedRef = useRef(0);
  const displayAccRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [displayMs, setDisplayMs] = useState(0);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const speedRef = useRef<number>(speed);
  speedRef.current = speed;

  const toNowMs = useCallback(
    (elapsed: number) => Math.min(1, elapsed / cycleMs) * totalMs,
    [cycleMs, totalMs]
  );

  /** 매 프레임 호출 — 진행시킨 뒤 현재 시뮬레이션 시각을 돌려준다 */
  const advance = useCallback(
    (deltaMs: number): number => {
      if (playingRef.current) {
        // 탭 복귀 등으로 delta가 튀는 경우를 잘라낸다
        elapsedRef.current += Math.min(50, Math.max(0, deltaMs)) * speedRef.current;
        if (elapsedRef.current > cycleMs + holdMs) elapsedRef.current = 0;
      }

      const nowMs = toNowMs(elapsedRef.current);

      displayAccRef.current += deltaMs;
      if (displayAccRef.current > 80) {
        displayAccRef.current = 0;
        setDisplayMs((prev) => (Math.abs(prev - nowMs) > 0.5 ? nowMs : prev));
      }
      return nowMs;
    },
    [cycleMs, holdMs, toNowMs]
  );

  const toggle = useCallback(() => setIsPlaying((prev) => !prev), []);

  const replay = useCallback(() => {
    elapsedRef.current = 0;
    setDisplayMs(0);
    setIsPlaying(true);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
  }, []);

  /** 캔버스 드래그 스크럽 — 재생을 멈추고 그 시각으로 이동한다 */
  const scrubTo = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(totalMs, ms));
      elapsedRef.current = (clamped / Math.max(1, totalMs)) * cycleMs;
      setDisplayMs(clamped);
      setIsPlaying(false);
    },
    [cycleMs, totalMs]
  );

  return { advance, isPlaying, speed, displayMs, toggle, replay, cycleSpeed, scrubTo };
}
