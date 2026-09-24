/** 비교할 revalidateTag 두 번째 인자(profile) — 한 줄 = 독립된 'use cache' 엔트리 하나(각자 다른 태그) */
export type ProfileId = 'max' | 'hours' | 'expire5' | 'expire0'

export interface ProfileRow {
  name: string
  /** 화면에 보여 줄 실제 호출 코드 */
  code: string
  /** revalidateTag의 두 번째 인자로 그대로 넘기는 값 */
  profile: string | { expire: number }
  /** 이 profile이 태그에 기록하는 만료 시간(초): 무효화 후 이 시간 안의 요청만 stale 값을 받을 수 있다 */
  expireSeconds: number
  tag: string
}

/** 'use cache' 함수 본문이 실행된 순간 기록한 값 — 재계산될 때만 바뀐다 */
export interface CachedPrice {
  version: number
  cacheId: string
  generatedAt: string
  generatedAtMs: number
}

/** 서버 메모리의 원본 가격표 (캐시를 거치지 않고 직접 읽은 값) */
export interface SourcePrice {
  version: number
  updatedAt: string
  updatedAtMs: number
}

/** GET probe 한 번의 응답: 그 요청이 받은 캐시 값 + 원본 + 캐시 함수 호출에 걸린 시간 */
export interface ProbeResult {
  profileId: ProfileId
  cached: CachedPrice
  source: SourcePrice
  servedAt: string
  durationMs: number
}

/** POST invalidate(Route Handler) 응답: 원본을 올린 뒤 revalidateTag(tag, profile)를 호출한 기록 */
export interface InvalidateResult {
  profileId: ProfileId
  code: string
  sourceAfter: SourcePrice
}

export type RunPhase = 'before' | 'invalidate' | 'wait' | 'first' | 'second' | 'done'

/** 버튼 한 번의 측정: 기준 요청 → 무효화 → (대기) → 1회차 요청 → 2회차 요청 */
export interface MeasureRun {
  id: number
  profileId: ProfileId
  delaySec: number
  phase: RunPhase
  before?: ProbeResult
  invalidation?: InvalidateResult
  first?: ProbeResult
  second?: ProbeResult
  error?: string
}

/** 한 줄의 현재 모습 (페이지 렌더 또는 마지막 probe 응답) */
export interface RowView {
  cached: CachedPrice
  source: SourcePrice
}
