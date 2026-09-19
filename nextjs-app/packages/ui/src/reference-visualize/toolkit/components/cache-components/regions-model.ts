/**
 * @fileoverview cache-components/regions-model.ts
 * "한 페이지, 영역별 캐시 경계" 데모의 순수 모델. 한 페이지가 4개 영역으로 나뉘고 영역마다
 * 캐시 전략이 다를 때, 각 영역의 데이터가 어디서 출발해 어떤 경로로 사용자 화면에 닿는지를
 * 시나리오(캐시 채워짐 / 비어 있음)별 이동 단계 목록으로 표현한다. 시간은 시연용 ms이며 실측이 아니다.
 *
 * 근거: `use-cache.md`(컴포넌트·함수 어디든 'use cache', 안에서 cookies() 금지 → 인자로 전달),
 * `cacheLife.md`·`cacheTag.md`(수명·태그), `caching.md`(동적 영역은 Suspense로 스트리밍).
 */

export type RegionId = 'header' | 'products' | 'price' | 'recs';
export type RegionMode = 'static' | 'cached-component' | 'cached-function' | 'dynamic';
/** 캐시 채워짐(평소) / 비어 있음(빌드·태그 갱신 직후 첫 요청) */
export type CacheFill = 'warm' | 'cold';
export type RegionState = 'blank' | 'skeleton' | 'filled';

export const REGION_IDS: RegionId[] = ['header', 'products', 'price', 'recs'];

export interface RegionSpec {
  id: RegionId;
  title: string;
  mode: RegionMode;
  file: string;
  /** 원천 노드 라벨 — 없으면 원천 열을 비운다 */
  source: string | null;
  /** 캐시 열 노드 라벨 — 없으면 "캐시 없음" 자리표시 */
  cacheLabel: string | null;
  /** 캐시 노드 부 라벨에 덧붙이는 짧은 정보(태그·키). 없으면 상태만 표시 */
  cacheHint?: string;
  detail: string;
}

export const REGIONS: RegionSpec[] = [
  {
    id: 'header',
    title: '헤더 · 내비게이션',
    mode: 'static',
    file: 'app/_components/Header.tsx',
    source: null,
    cacheLabel: '정적 셸 (HTML)',
    cacheHint: '빌드 시 프리렌더',
    detail:
      '데이터를 읽지 않는 순수 마크업이라 빌드 시점에 HTML로 미리 만들어진다. 요청이 오면 정적 셸의 일부로 첫 바이트와 함께 도착한다 — 캐시 지시자를 붙일 필요조차 없다.'
  },
  {
    id: 'products',
    title: '상품 목록',
    mode: 'cached-component',
    file: 'app/_components/ProductList.tsx',
    source: 'DB · products',
    cacheLabel: '컴포넌트 출력(RSC) 캐시',
    cacheHint: "cacheTag('products')",
    detail:
      "컴포넌트 함수 첫 줄에 'use cache'를 두면 렌더 결과(RSC 페이로드) 자체가 캐시된다. cacheLife('hours')로 수명을, cacheTag('products')로 갱신 손잡이를 단다. 캐시가 채워져 있으면 정적 셸에 포함돼 헤더와 같은 순간에 도착하고, 비어 있으면 DB까지 다녀와 저장한 뒤에야 셸이 완성된다."
  },
  {
    id: 'price',
    title: '환율 배너',
    mode: 'cached-function',
    file: 'app/_components/PriceBanner.tsx · lib/rates.ts',
    source: '외부 환율 API',
    cacheLabel: 'getRate() 반환값 캐시',
    cacheHint: '키 = currency 인자',
    detail:
      "컴포넌트는 cookies()로 사용자의 통화를 읽어야 해서 요청마다 렌더된다(Suspense 안). 대신 비싼 데이터 함수 getRate(currency)에만 'use cache'를 붙여 반환값을 재사용한다 — 통화를 인자로 넘기므로 통화별로 캐시 키가 갈린다. cookies()를 함수 안에서 읽으면 next-request-in-use-cache 오류가 난다."
  },
  {
    id: 'recs',
    title: '맞춤 추천',
    mode: 'dynamic',
    file: 'app/_components/Recommendations.tsx',
    source: 'DB · 세션 기반 추천 쿼리',
    cacheLabel: null,
    detail:
      '사용자마다 결과가 다르고 매 요청 최신이어야 해서 캐시하지 않는다. cookies()로 세션을 읽고 DB를 조회해 서버에서 렌더링한 뒤 <Suspense> 경계 안으로 스트리밍된다 — 그동안 사용자는 fallback 스켈레톤을 본다.'
  }
];

export const REGION_BY_ID: Record<RegionId, RegionSpec> = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, RegionSpec>;

export type FlowKind = 'shell' | 'fetch' | 'read' | 'stream';
export type FlowNode = 'source' | 'cache' | 'page';

export interface FlowStep {
  kind: FlowKind;
  from: FlowNode;
  to: FlowNode;
  startMs: number;
  endMs: number;
  /** 이동 중 점 옆에 뜨는 짧은 라벨 */
  label: string;
}

/** 시연 타임라인 길이(ms) — 두 시나리오가 같은 축을 쓴다 */
export const REGIONS_TOTAL_MS = 1600;

const TIMINGS = {
  warm: { firstPaint: 220, priceCookie: 220, priceRead: 520, recsFill: 1150 },
  cold: { firstPaint: 900, productsFetch: 700, priceCookie: 900, priceFetch: 1250, priceRead: 1450, recsFill: 1400 }
} as const;

export function firstPaintMs(fill: CacheFill): number {
  return TIMINGS[fill].firstPaint;
}

/** 영역별·시나리오별 이동 단계. 순서대로 재생되며 마지막 단계가 끝나는 순간 영역이 채워진다 */
export function flowStepsFor(id: RegionId, fill: CacheFill): FlowStep[] {
  const fp = firstPaintMs(fill);
  if (id === 'header') return [{ kind: 'shell', from: 'cache', to: 'page', startMs: 0, endMs: fp, label: '정적 셸 HTML' }];

  if (id === 'products') {
    if (fill === 'warm') return [{ kind: 'read', from: 'cache', to: 'page', startMs: 0, endMs: fp, label: '캐시 HIT · 셸에 포함' }];
    return [
      { kind: 'fetch', from: 'source', to: 'cache', startMs: 0, endMs: TIMINGS.cold.productsFetch, label: 'DB 조회 → 렌더 → 캐시에 저장' },
      { kind: 'read', from: 'cache', to: 'page', startMs: TIMINGS.cold.productsFetch, endMs: fp, label: '이제야 셸 완성' }
    ];
  }

  if (id === 'price') {
    if (fill === 'warm') {
      return [{ kind: 'read', from: 'cache', to: 'page', startMs: TIMINGS.warm.priceCookie, endMs: TIMINGS.warm.priceRead, label: "cookies() 읽고 getRate('KRW') HIT" }];
    }
    return [
      { kind: 'fetch', from: 'source', to: 'cache', startMs: TIMINGS.cold.priceCookie, endMs: TIMINGS.cold.priceFetch, label: "getRate('KRW') MISS → API 호출" },
      { kind: 'read', from: 'cache', to: 'page', startMs: TIMINGS.cold.priceFetch, endMs: TIMINGS.cold.priceRead, label: '저장 후 렌더' }
    ];
  }

  const start = fp;
  return [{ kind: 'stream', from: 'source', to: 'page', startMs: start, endMs: TIMINGS[fill].recsFill, label: 'cookies() → DB 조회 → 스트리밍' }];
}

export function regionFillMs(id: RegionId, fill: CacheFill): number {
  const steps = flowStepsFor(id, fill);
  return steps[steps.length - 1].endMs;
}

export function regionStateAt(id: RegionId, fill: CacheFill, nowMs: number): RegionState {
  if (nowMs < firstPaintMs(fill)) return 'blank';
  return nowMs >= regionFillMs(id, fill) ? 'filled' : 'skeleton';
}

export function activeStepAt(id: RegionId, fill: CacheFill, nowMs: number): FlowStep | null {
  return flowStepsFor(id, fill).find((s) => nowMs >= s.startMs && nowMs < s.endMs) ?? null;
}

/** 결론 스트립 — 지금 이 순간 각 영역이 겪는 일 */
export function summaryAt(fill: CacheFill, nowMs: number): string {
  const fp = firstPaintMs(fill);
  if (nowMs < fp) {
    return fill === 'warm'
      ? '요청 도착 — 정적 셸(헤더 + 캐시된 상품 목록)이 곧바로 나간다'
      : '요청 도착 — 상품 목록 캐시가 비어 있어 DB 조회·저장이 끝날 때까지 셸이 나가지 못한다';
  }
  const parts = REGION_IDS.filter((id) => id !== 'header').map((id) => {
    const state = regionStateAt(id, fill, nowMs);
    const step = activeStepAt(id, fill, nowMs);
    const name = REGION_BY_ID[id].title;
    if (state === 'filled') return `${name} 도착`;
    if (step) return `${name}: ${step.label}`;
    return `${name} 대기`;
  });
  return `${fp}ms 첫 페인트 — ${parts.join(' · ')}`;
}

export const MODE_LABEL: Record<RegionMode, string> = {
  static: '정적 셸',
  'cached-component': "'use cache' 컴포넌트",
  'cached-function': "'use cache' 함수",
  dynamic: '동적 · 캐시 없음'
};

export const FILL_LABEL: Record<CacheFill, string> = {
  warm: '캐시 채워짐 (평소)',
  cold: '캐시 비어 있음 (빌드·태그 갱신 직후)'
};
