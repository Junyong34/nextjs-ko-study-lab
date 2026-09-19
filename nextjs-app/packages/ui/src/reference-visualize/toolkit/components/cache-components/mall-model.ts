/**
 * @fileoverview cache-components/mall-model.ts
 * "스터디몰" 요청 추적 시뮬레이션 — 순수 함수만. 그림·타이밍은 다루지 않는다(→ paint-mall*.ts).
 *
 * 한 번의 페이지 요청이 세 레인(진열대·상품 상세·장바구니)을 동시에 지나며 레인마다 다른 결과를 겪는다.
 * 시계는 흐르지만 캐시는 저절로 갱신되지 않는다 — 요청이 도착해야 STALE/EXPIRED가 재생성을 트리거한다.
 * 근거: `cacheLife.md`(stale·revalidate·expire), `revalidateTag.md`·`updateTag.md`(태그 갱신 두 방식),
 * `use-cache.md:126`(`cookies()`는 use cache 안에서 못 읽는다 → 장바구니는 동적 렌더링).
 */

import { lifeZone, type LifeZone } from './model';

export type LaneKey = 'shelf' | 'product' | 'cart';
export type LaneResult = 'HIT' | 'STALE' | 'EXPIRED' | 'DYNAMIC';
export type TagMode = 'updateTag' | 'revalidateTag';

export const LANE_KEYS: LaneKey[] = ['shelf', 'product', 'cart'];

/** 시연용 축소 프로필 — 인라인 객체는 실제 API이며 누락 속성은 default에서 상속된다(cacheLife.md:35) */
export interface ShelfLifeOption {
  key: 'short' | 'long';
  label: string;
  revalidate: number;
  /** null이면 default(만료 없음)에서 상속 */
  expire: number | null;
  code: string;
  note: string;
}

export const SHELF_LIFE_OPTIONS: ShelfLifeOption[] = [
  {
    key: 'short',
    label: '자주 갱신',
    revalidate: 8,
    expire: 18,
    code: 'cacheLife({ revalidate: 8, expire: 18 })',
    note: '8s 뒤 STALE, 18s 뒤 EXPIRED — 실제로는 "seconds"·"minutes" 프리셋처럼 쓴다'
  },
  {
    key: 'long',
    label: '오래 유지',
    revalidate: 20,
    expire: null,
    code: 'cacheLife({ revalidate: 20 })',
    note: 'expire를 생략해 default(만료 없음)를 상속 — 20s 뒤에도 구값을 주고 뒤에서 갱신한다'
  }
];

/** 원본 서버가 한 항목을 다시 만드는 데 걸리는 시연 시간(초) */
export const REGEN_SEC = 1.3;

export interface CacheEntryState {
  version: number;
  createdAtSec: number;
  /** 재생성 완료 예정 시각. null이면 재생성 중이 아님 */
  regenUntilSec: number | null;
  /** 지금 도는 재생성이 백그라운드(SWR)인지, 요청을 기다리게 하는 동기(blocking) 재생성인지 */
  regenMode: 'background' | 'blocking' | null;
  /** 태그 갱신 API가 강제한 상태 */
  forced: 'none' | 'stale' | 'expired';
}

export interface MallSim {
  nowSec: number;
  shelfLife: ShelfLifeOption;
  shelf: CacheEntryState;
  product: CacheEntryState;
  requestCount: number;
}

const BUILD_ENTRY: CacheEntryState = { version: 1, createdAtSec: 0, regenUntilSec: null, regenMode: null, forced: 'none' };

export function createSim(shelfLife: ShelfLifeOption = SHELF_LIFE_OPTIONS[0]): MallSim {
  return { nowSec: 0, shelfLife, shelf: BUILD_ENTRY, product: BUILD_ENTRY, requestCount: 0 };
}

/** 프로필을 바꾸면 그 규칙으로 방금 빌드된 진열대부터 다시 본다 */
export function withShelfLife(sim: MallSim, shelfLife: ShelfLifeOption): MallSim {
  return { ...sim, shelfLife, shelf: { ...BUILD_ENTRY, createdAtSec: sim.nowSec } };
}

function settleEntry(entry: CacheEntryState, nowSec: number): { entry: CacheEntryState; completed: boolean } {
  if (entry.regenUntilSec === null || nowSec < entry.regenUntilSec) return { entry, completed: false };
  return {
    entry: { version: entry.version + 1, createdAtSec: entry.regenUntilSec, regenUntilSec: null, regenMode: null, forced: 'none' },
    completed: true
  };
}

/** 시계를 dt만큼 흘리고, 끝난 재생성을 캐시에 반영한다 */
export function tickSim(sim: MallSim, dtSec: number): { sim: MallSim; completed: LaneKey[] } {
  const nowSec = sim.nowSec + dtSec;
  const shelf = settleEntry(sim.shelf, nowSec);
  const product = settleEntry(sim.product, nowSec);
  const completed: LaneKey[] = [];
  if (shelf.completed) completed.push('shelf');
  if (product.completed) completed.push('product');
  return { sim: { ...sim, nowSec, shelf: shelf.entry, product: product.entry }, completed };
}

export function shelfAgeSec(sim: MallSim): number {
  return Math.max(0, sim.nowSec - sim.shelf.createdAtSec);
}

/** 진열대 캐시 항목이 지금 어느 구간인지 — cache-lifetime과 같은 `lifeZone` 판정 */
export function shelfZone(sim: MallSim): LifeZone {
  const { revalidate, expire } = sim.shelfLife;
  return lifeZone(shelfAgeSec(sim), { name: sim.shelfLife.key, stale: 0, revalidate, expire, note: '' });
}

/** 상품 상세는 cacheLife를 생략해 default(revalidate 15분)를 상속 — 시연 중엔 시간으로 안 만료되고 태그로만 바뀐다 */
export function productZone(sim: MallSim): LifeZone {
  if (sim.product.forced === 'expired') return 'blocking';
  if (sim.product.forced === 'stale') return 'swr';
  return 'fresh';
}

export interface LaneOutcome {
  result: LaneResult;
  /** 이 요청이 실제로 받은 버전 */
  version: number;
  /** 이 요청이 재생성을 새로 시작시켰는지 */
  triggeredRegen: boolean;
  reason: string;
}

export interface PageRequestOutcome {
  sim: MallSim;
  id: number;
  atSec: number;
  lanes: Record<LaneKey, LaneOutcome>;
}

function requestEntry(
  entry: CacheEntryState,
  zone: LifeZone,
  nowSec: number,
  ctx: { fresh: string; stale: string; staleAgain: string; expired: string }
): { entry: CacheEntryState; outcome: LaneOutcome } {
  if (entry.regenUntilSec !== null) {
    return { entry, outcome: { result: 'STALE', version: entry.version, triggeredRegen: false, reason: ctx.staleAgain } };
  }
  if (zone === 'fresh') {
    return { entry, outcome: { result: 'HIT', version: entry.version, triggeredRegen: false, reason: ctx.fresh } };
  }
  const regenerating: CacheEntryState = { ...entry, regenUntilSec: nowSec + REGEN_SEC, regenMode: zone === 'swr' ? 'background' : 'blocking' };
  if (zone === 'swr') {
    return { entry: regenerating, outcome: { result: 'STALE', version: entry.version, triggeredRegen: true, reason: ctx.stale } };
  }
  return { entry: regenerating, outcome: { result: 'EXPIRED', version: entry.version + 1, triggeredRegen: true, reason: ctx.expired } };
}

/** "페이지 요청" 한 번 — 세 레인이 같은 순간에 각자의 결과를 낸다 */
export function sendPageRequest(sim: MallSim): PageRequestOutcome {
  const age = shelfAgeSec(sim).toFixed(1);
  const { revalidate, expire } = sim.shelfLife;
  const shelf = requestEntry(sim.shelf, shelfZone(sim), sim.nowSec, {
    fresh: `나이 ${age}s ≤ revalidate ${revalidate}s — 서버에 묻지 않고 캐시된 진열대를 그대로 돌려준다.`,
    stale: `나이 ${age}s > revalidate ${revalidate}s — 구값(v${sim.shelf.version})을 즉시 주고, 이 요청이 백그라운드 재생성을 시작시킨다.`,
    staleAgain: `이미 재생성이 돌고 있다 — 끝날 때까지 이 요청도 구값(v${sim.shelf.version})을 즉시 받는다.`,
    expired: `나이 ${age}s > expire ${expire}s — 구값을 줄 수 없어 새 진열대가 만들어질 때까지 이 요청이 기다린다.`
  });
  const product = requestEntry(sim.product, productZone(sim), sim.nowSec, {
    fresh: `cacheTag('product:1') 항목이 FRESH — 캐시된 v${sim.product.version}을 그대로 돌려준다(default 프로필은 시연 중 시간으로 안 만료).`,
    stale: `revalidateTag()가 STALE로 표시해 둔 항목 — v${sim.product.version}을 즉시 주고, 이 요청이 백그라운드 재생성을 시작시킨다.`,
    staleAgain: `이미 재생성이 돌고 있다 — 끝날 때까지 이 요청도 v${sim.product.version}을 즉시 받는다.`,
    expired: `updateTag()가 즉시 만료시킨 항목 — 구값을 주지 않고 새 v${sim.product.version + 1}이 준비될 때까지 기다린다(read-your-own-writes).`
  });
  const cart: LaneOutcome = {
    result: 'DYNAMIC',
    version: 0,
    triggeredRegen: false,
    reason: 'cookies()로 이 사용자의 세션을 읽어야 해서 use cache 안에 둘 수 없다 — 요청마다 서버에서 렌더링한다.'
  };
  const id = sim.requestCount + 1;
  return {
    sim: { ...sim, shelf: shelf.entry, product: product.entry, requestCount: id },
    id,
    atSec: sim.nowSec,
    lanes: { shelf: shelf.outcome, product: product.outcome, cart }
  };
}

/** 관리자의 재고 변경 — Server Action 안에서 태그 갱신 API를 부른다 */
export function applyTag(sim: MallSim, mode: TagMode): MallSim {
  if (sim.product.regenUntilSec !== null) return sim;
  return { ...sim, product: { ...sim.product, forced: mode === 'updateTag' ? 'expired' : 'stale' } };
}

export const RESULT_LABEL: Record<LaneResult, string> = {
  HIT: 'HIT · 캐시에서 즉시',
  STALE: 'STALE · 구값 즉시 + 백그라운드 재생성',
  EXPIRED: 'EXPIRED · 서버 대기 후 새 값',
  DYNAMIC: '서버 렌더 · 캐시 없음'
};
