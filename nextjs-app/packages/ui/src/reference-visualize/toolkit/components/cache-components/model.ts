/** Educational models; these do not execute or measure the Next.js cache. */
export interface KeyInput {
  build: string;
  product: string;
  locale: string;
}
export interface CacheEntry {
  key: string;
  label: string;
}
export type RefreshMode = 'swr' | 'immediate';
export const LIFE = { stale: 30, revalidate: 60, expire: 180 } as const;

// Illustrative identity, not Next.js's actual serialization/hash algorithm.
export function makeKey(input: KeyInput): string {
  return JSON.stringify([input.build, 'getProduct', input.product, input.locale]);
}

export function readEntry(entries: CacheEntry[], input: KeyInput) {
  const key = makeKey(input);
  const hit = entries.some((entry) => entry.key === key);
  return {
    hit,
    key,
    entries: hit
      ? entries
      : [
          ...entries,
          {
            key,
            label: `${input.build} · 상품 ${input.product} · ${input.locale}`,
          },
        ],
  };
}

export function lifetimeAt(age: number) {
  return {
    client: age < LIFE.stale ? 'reuse' : 'check',
    server: age > LIFE.expire ? 'blocking' : age > LIFE.revalidate ? 'swr' : 'fresh',
  } as const;
}

export const TAG_ENTRIES = [
  { id: 'list', label: '상품 목록', tags: ['products'] },
  { id: 'detail', label: '상품 1 상세', tags: ['products', 'product:1'] },
  { id: 'news', label: '뉴스', tags: ['news'] },
];
export function taggedEntries(tag: string) {
  return TAG_ENTRIES.filter((entry) => entry.tags.includes(tag)).map((entry) => entry.id);
}
export function tagResponse(mode: RefreshMode, step: number): string {
  if (step === 0) return 'v1 · 캐시 보관';
  if (step === 1) return mode === 'swr' ? 'STALE · 다음 접근 대기' : 'EXPIRED · 다음 읽기 대기';
  if (step === 2) return mode === 'swr' ? 'v1 응답 · 백그라운드 갱신' : '응답 대기 · 새 값 생성';
  return mode === 'swr' ? 'v2 저장 · 다음 읽기에 사용' : 'v2 응답 · 갱신 완료';
}

/* ------------------------------------------------------------------ */
/* 아래는 재설계에서 추가한 모델. 위의 기존 export는 그대로 두어                */
/* model.test.mjs가 계속 통과한다.                                       */
/* ------------------------------------------------------------------ */

export type KeySegmentId = 'build' | 'fn' | 'product' | 'locale';

export interface KeySegment {
  id: KeySegmentId;
  label: string;
  value: string;
  /** 이 조각이 무엇에서 오는지 (경계 설명용) */
  origin: string;
}

/**
 * 캐시 키를 이루는 조각들.
 * 근거: `03-api-reference/01-directives/use-cache.md:74-99`
 * — Build ID + Function ID(위치·시그니처 해시) + 직렬화된 인자 (+ 개발 전용 HMR 해시).
 * 외부 스코프에서 캡처한 변수도 자동으로 인자가 되어 키에 들어간다.
 */
export function keySegments(input: KeyInput): KeySegment[] {
  return [
    { id: 'build', label: 'Build ID', value: input.build, origin: '배포마다 바뀜' },
    { id: 'fn', label: 'Function ID', value: 'getProduct#a91f', origin: '함수 위치·시그니처 해시' },
    { id: 'product', label: '인자 id', value: input.product, origin: '경계 밖에서 전달' },
    { id: 'locale', label: '인자 locale', value: input.locale, origin: 'cookies()를 밖에서 읽어 전달' }
  ];
}

/** cacheLife 프리셋 — `04-functions/cacheLife.md:139-147` */
export interface LifeProfile {
  name: string;
  stale: number;
  revalidate: number;
  expire: number | null;
  note: string;
}

export const LIFE_PROFILES: LifeProfile[] = [
  { name: 'seconds', stale: 30, revalidate: 1, expire: 60, note: '실시간 데이터' },
  { name: 'minutes', stale: 300, revalidate: 60, expire: 3600, note: '자주 바뀌는 콘텐츠' },
  { name: 'hours', stale: 300, revalidate: 3600, expire: 86400, note: '하루에 여러 번' },
  { name: 'default', stale: 300, revalidate: 900, expire: null, note: '표준 (만료 없음)' }
];

/** 캐시 나이가 어느 구간인지 — 요청이 왔을 때의 결과를 가른다 */
export type LifeZone = 'fresh' | 'swr' | 'blocking';

export function lifeZone(ageSec: number, profile: LifeProfile): LifeZone {
  if (ageSec <= profile.revalidate) return 'fresh';
  if (profile.expire === null || ageSec <= profile.expire) return 'swr';
  return 'blocking';
}
