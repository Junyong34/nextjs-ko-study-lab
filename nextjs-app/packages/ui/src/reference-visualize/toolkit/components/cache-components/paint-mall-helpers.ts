/**
 * @fileoverview cache-components/paint-mall-helpers.ts
 * paint-mall 계열이 공유하는 색·타이밍 상수와 "요청 점이 지금 어디 있는가" 계산.
 * 그림은 그리지 않는다 — 좌표·색만 계산한다.
 */

import { clamp, lerp, easing } from '../../core/math';
import type { LaneKey, LaneResult, MallSim } from './mall-model';
import { productZone, shelfZone } from './mall-model';
import type { LifeZone } from './model';
import type { LaneGeometry, LaneTravel } from './paint-mall-types';

export const MALL_COLOR = {
  ink: '#0f172a',
  sub: '#64748b',
  faint: '#94a3b8',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  lane: '#f8fafc',
  browser: '#2563eb',
  server: '#334155',
  hit: '#16a34a',
  stale: '#f97316',
  expired: '#e11d48',
  dynamic: '#2563eb',
  regen: '#8b5cf6',
  admin: '#7c3aed'
} as const;

export const RESULT_COLOR: Record<LaneResult, string> = {
  HIT: MALL_COLOR.hit,
  STALE: MALL_COLOR.stale,
  EXPIRED: MALL_COLOR.expired,
  DYNAMIC: MALL_COLOR.dynamic
};

export const ZONE_COLOR: Record<LifeZone, string> = {
  fresh: MALL_COLOR.hit,
  swr: MALL_COLOR.stale,
  blocking: MALL_COLOR.expired
};

export const ZONE_BADGE: Record<LifeZone, string> = { fresh: 'FRESH', swr: 'STALE', blocking: 'EXPIRED' };

export const MALL_TIMING = {
  /** 브라우저 ↔ 캐시 노드 한 구간 */
  hopMs: 650,
  /** 캐시 노드 안을 통과하는 짧은 구간 */
  passMs: 220,
  /** 캐시 ↔ 서버 한 구간 */
  farHopMs: 600,
  /** 서버에서 새 값을 기다리는 시간 */
  serverWaitMs: 900,
  /** 장바구니: 브라우저 ↔ 서버 직행 */
  directMs: 1100,
  directWaitMs: 450,
  adminPulseMs: 1400,
  flashMs: 900,
  /** 결과 배지가 브라우저 옆에 남아 있는 시간 */
  resultBadgeMs: 3200
} as const;

export interface TravelSegment {
  fromX: number;
  toX: number;
  ms: number;
  color: string;
  /** 서버·캐시에서 멈춰 있는 구간 */
  wait?: boolean;
}

/** 결과별 이동 경로 — 어디까지 갔다가 돌아오는지가 곧 개념이다 */
export function travelSegments(result: LaneResult, g: LaneGeometry): TravelSegment[] {
  const T = MALL_TIMING;
  const color = RESULT_COLOR[result];
  if (!g.cacheBox) {
    return [
      { fromX: g.x0, toX: g.x1, ms: T.directMs, color },
      { fromX: g.x1, toX: g.x1, ms: T.directWaitMs, color, wait: true },
      { fromX: g.x1, toX: g.x0, ms: T.directMs, color }
    ];
  }
  const cl = g.cacheBox.x;
  const cr = g.cacheBox.x + g.cacheBox.width;
  if (result === 'EXPIRED') {
    return [
      { fromX: g.x0, toX: cl, ms: T.hopMs, color },
      { fromX: cl, toX: cr, ms: T.passMs, color },
      { fromX: cr, toX: g.x1, ms: T.farHopMs, color },
      { fromX: g.x1, toX: g.x1, ms: T.serverWaitMs, color, wait: true },
      { fromX: g.x1, toX: cr, ms: T.farHopMs, color: MALL_COLOR.hit },
      { fromX: cr, toX: cl, ms: T.passMs, color: MALL_COLOR.hit },
      { fromX: cl, toX: g.x0, ms: T.hopMs, color: MALL_COLOR.hit }
    ];
  }
  return [
    { fromX: g.x0, toX: cl, ms: T.hopMs, color },
    { fromX: cl, toX: cl, ms: T.passMs, color, wait: true },
    { fromX: cl, toX: g.x0, ms: T.hopMs, color }
  ];
}

export function travelTotalMs(result: LaneResult, g: LaneGeometry): number {
  return travelSegments(result, g).reduce((sum, s) => sum + s.ms, 0);
}

export interface TravelPose {
  x: number;
  color: string;
  waiting: boolean;
  /** 돌아오는 길인지 — 응답 방향 */
  returning: boolean;
  done: boolean;
}

export function travelPose(travel: LaneTravel, g: LaneGeometry, timeMs: number): TravelPose {
  const segments = travelSegments(travel.result, g);
  let elapsed = timeMs - travel.startMs;
  let passedOut = false;
  for (let i = 0; i < segments.length; i += 1) {
    const s = segments[i];
    if (elapsed <= s.ms) {
      const t = s.wait ? 1 : easing.easeInOutQuad(clamp(elapsed / s.ms, 0, 1));
      return { x: lerp(s.fromX, s.toX, t), color: s.color, waiting: !!s.wait, returning: passedOut, done: false };
    }
    elapsed -= s.ms;
    if (s.wait) passedOut = true;
  }
  const last = segments[segments.length - 1];
  return { x: last.toX, color: last.color, waiting: false, returning: true, done: true };
}

export function laneZone(sim: MallSim, lane: LaneKey): LifeZone | null {
  if (lane === 'shelf') return shelfZone(sim);
  if (lane === 'product') return productZone(sim);
  return null;
}

/** 값이 막 바뀐 순간 살짝 떠오르며 나타나는 "팝인" 진행도 */
export function pop(timeMs: number, startMs: number, ms: number): number {
  if (startMs <= 0) return 1;
  return easing.easeOutCubic(clamp((timeMs - startMs) / ms, 0, 1));
}
