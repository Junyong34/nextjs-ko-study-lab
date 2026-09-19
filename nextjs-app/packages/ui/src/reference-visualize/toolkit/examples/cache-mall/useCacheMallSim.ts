'use client';

/**
 * @fileoverview cache-mall/useCacheMallSim.ts
 * `CacheMallDemo`의 상태·시계·애니메이션 훅.
 * 시뮬레이션(`mall-model.ts`)은 ref에 두고 매 프레임 `tickSim`으로 흘리며, 캔버스는 그 값을 읽어 그린다.
 * DOM에 필요한 값(시계 표시·최근 결과·로그)만 낮은 빈도로 state에 반영한다 — `isr-cache`와 같은 구조.
 *
 * 시계는 둘이다. 시뮬레이션 시계(`sim.nowSec`)는 재생 중일 때만 배속대로 흐르고, 애니메이션 시계
 * (`animMs`)는 일시정지 중에도 배속대로 흐른다 — 그래서 0.5×에서는 점의 이동도 함께 느려지고,
 * 멈춘 상태에서 보낸 요청도 끝까지 그려진다.
 */

import { useCallback, useRef, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { paintMall, type AdminPulse, type LaneTravel, type SaveFlash, MALL_TIMING } from '../../components/cache-components/paint-mall';
import {
  SHELF_LIFE_OPTIONS,
  applyTag,
  createSim,
  sendPageRequest,
  tickSim,
  withShelfLife,
  type LaneKey,
  type LaneResult,
  type MallSim,
  type PageRequestOutcome,
  type ShelfLifeOption,
  type TagMode
} from '../../components/cache-components/mall-model';

const MAX_LOGS = 4;
/** 1× → 0.5× → 0.25× → 2× 순환 — 개념을 따라가기엔 느린 쪽이 더 필요하다 */
const SPEED_CYCLE = [1, 0.5, 0.25, 2];
/** 페이지 요청 점 애니메이션이 완전히 사라진 뒤 정리하기까지의 여유 */
const TRAVEL_TTL_MS = 2400 + MALL_TIMING.resultBadgeMs;

export function useCacheMallSim() {
  const simRef = useRef<MallSim>(createSim());
  const travelsRef = useRef<LaneTravel[]>([]);
  const flashesRef = useRef<SaveFlash[]>([]);
  const adminRef = useRef<AdminPulse | null>(null);
  const lastResultsRef = useRef<Record<LaneKey, LaneResult> | null>(null);
  const hoveredRef = useRef<LaneKey | null>(null);
  const sampleRef = useRef(0);
  const animMsRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [shelfLife, setShelfLife] = useState<ShelfLifeOption>(SHELF_LIFE_OPTIONS[0]);
  const [displaySec, setDisplaySec] = useState(0);
  const [displayAge, setDisplayAge] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<PageRequestOutcome | null>(null);
  const [logs, setLogs] = useState<PageRequestOutcome[]>([]);
  const [lastTag, setLastTag] = useState<TagMode | null>(null);
  const [hoveredLane, setHoveredLane] = useState<LaneKey | null>(null);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  hoveredRef.current = hoveredLane;

  const advance = useCallback((dtSec: number) => {
    const { sim, completed } = tickSim(simRef.current, dtSec);
    simRef.current = sim;
    if (completed.length) {
      const now = animMsRef.current;
      flashesRef.current = [...flashesRef.current, ...completed.map((lane) => ({ lane, startMs: now }))];
    }
  }, []);

  const { canvasRef } = useCanvas({
    trackPointer: false,
    onFrame: ({ ctx, size, deltaTime }) => {
      const frameMs = Math.min(50, Math.max(0, deltaTime));
      animMsRef.current += frameMs * speedRef.current;
      const dt = playingRef.current ? (frameMs / 1000) * speedRef.current : 0;
      if (dt > 0) advance(dt);

      const now = animMsRef.current;
      travelsRef.current = travelsRef.current.filter((t) => now - t.startMs < TRAVEL_TTL_MS);
      flashesRef.current = flashesRef.current.filter((f) => now - f.startMs < MALL_TIMING.flashMs);
      if (adminRef.current && now - adminRef.current.startMs > MALL_TIMING.adminPulseMs) adminRef.current = null;

      sampleRef.current += deltaTime;
      if (sampleRef.current >= 100) {
        sampleRef.current = 0;
        const sim = simRef.current;
        setDisplaySec(sim.nowSec);
        setDisplayAge(Math.max(0, sim.nowSec - sim.shelf.createdAtSec));
      }

      ctx.clearRect(0, 0, size.width, size.height);
      paintMall(ctx, {
        width: size.width,
        height: size.height,
        timeMs: now,
        sim: simRef.current,
        travels: travelsRef.current,
        adminPulse: adminRef.current,
        flashes: flashesRef.current,
        lastResults: lastResultsRef.current,
        hoveredLane: hoveredRef.current
      });
    }
  });

  const sendRequest = useCallback(() => {
    const outcome = sendPageRequest(simRef.current);
    simRef.current = outcome.sim;
    const startMs = animMsRef.current;
    const lanes: LaneKey[] = ['shelf', 'product', 'cart'];
    travelsRef.current = [
      ...travelsRef.current,
      ...lanes.map((lane) => ({
        lane,
        result: outcome.lanes[lane].result,
        startMs,
        versionLabel: lane === 'cart' ? '' : `v${outcome.lanes[lane].version}`
      }))
    ];
    lastResultsRef.current = { shelf: outcome.lanes.shelf.result, product: outcome.lanes.product.result, cart: 'DYNAMIC' };
    setLastOutcome(outcome);
    setLogs((prev) => [outcome, ...prev].slice(0, MAX_LOGS));
  }, []);

  const runTag = useCallback((mode: TagMode) => {
    simRef.current = applyTag(simRef.current, mode);
    adminRef.current = { mode, startMs: animMsRef.current };
    setLastTag(mode);
  }, []);

  const selectShelfLife = useCallback((option: ShelfLifeOption) => {
    simRef.current = withShelfLife(simRef.current, option);
    setShelfLife(option);
  }, []);

  const skip = useCallback((sec: number) => advance(sec), [advance]);

  const reset = useCallback(() => {
    simRef.current = createSim(shelfLife);
    travelsRef.current = [];
    flashesRef.current = [];
    adminRef.current = null;
    lastResultsRef.current = null;
    setDisplaySec(0);
    setDisplayAge(0);
    setLastOutcome(null);
    setLogs([]);
    setLastTag(null);
    setIsPlaying(true);
  }, [shelfLife]);

  return {
    canvasRef,
    isPlaying,
    speed,
    shelfLife,
    displaySec,
    displayAge,
    lastOutcome,
    logs,
    lastTag,
    hoveredLane,
    setHoveredLane,
    toggle: () => setIsPlaying((p) => !p),
    cycleSpeed: () => setSpeed((s) => SPEED_CYCLE[(SPEED_CYCLE.indexOf(s) + 1) % SPEED_CYCLE.length]),
    sendRequest,
    runTag,
    selectShelfLife,
    skip,
    reset
  };
}
