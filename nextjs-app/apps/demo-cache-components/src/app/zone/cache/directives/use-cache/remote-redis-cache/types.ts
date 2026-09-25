import type { Product } from '@study/demo-kit'

/** 캐시 함수의 첫 번째 인자. searchParams에서 읽어 문자열로 넘긴다. */
export type StatsCategory = Extract<Product['category'], 'electronics' | 'fashion' | 'books'>
/** 캐시 함수의 두 번째 인자에 들어가는 값 */
export type Currency = 'KRW' | 'USD'
/** 이 데모가 대조하는 두 캐시 지시어 종류 (next.config의 cacheHandlers 키와 이름이 같다) */
export type CacheKind = 'default' | 'remote'

export const CATEGORIES: { id: StatsCategory; label: string }[] = [
  { id: 'electronics', label: '전자기기' },
  { id: 'fashion', label: '패션' },
  { id: 'books', label: '도서' },
]
export const CURRENCIES: Currency[] = ['KRW', 'USD']

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function toCategory(value: string | string[] | undefined): StatsCategory {
  const raw = first(value)
  return CATEGORIES.some((c) => c.id === raw) ? (raw as StatsCategory) : 'electronics'
}

export function toCurrency(value: string | string[] | undefined): Currency {
  return first(value) === 'USD' ? 'USD' : 'KRW'
}

export function formatServerTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })
}

/** getDefaultCategoryStats / getRemoteCategoryStats 공통 반환 형태 */
export interface CategoryStatsResult {
  kind: CacheKind
  category: StatsCategory
  currency: Currency
  cacheId: string
  generatedAt: string
  /** 이 지시어(kind)의 캐시 함수 본문이 서버 프로세스 전체에서 실행된 순번 */
  globalExecNo: number
  /** 같은 인자 조합으로 본문이 실행된 횟수 */
  argsExecNo: number
  productCount: number
  avgPrice: number
}

/** 한 번의 요청에서 default·remote 두 지시어를 나란히 호출한 관측 기록 */
export interface RequestObservation {
  requestId: string
  requestAt: string
  argsKey: string
  defaultStats: CategoryStatsResult
  remoteStats: CategoryStatsResult
  handlerProbe: HandlerIdentityProbe
}

export interface Observation extends RequestObservation {
  seq: number
}

/**
 * globalThis에 등록된 Next.js 내부 캐시 핸들러 레지스트리를 읽어
 * 'default'와 'remote' 키가 같은 핸들러 인스턴스를 가리키는지 확인한 결과.
 * cacheHandlers를 next.config에 등록하지 않았을 때만 유효한 관측이다.
 */
export interface HandlerIdentityProbe {
  /** 레지스트리(globalThis 심볼)를 실제로 찾았는지. false면 버전 차이 등으로 판단 불가 */
  initialized: boolean
  /** 'default' 핸들러와 'remote' 핸들러가 Object.is로 동일한 객체인지 */
  sameInstance: boolean | null
  defaultHandlerId: string | null
  remoteHandlerId: string | null
}

/** private ⇄ remote 중첩 금지 규칙을 실제로 실행해 관측한 결과 */
export interface NestingViolationProbe {
  ok: boolean
  name?: string
  message?: string
  digest?: string | null
  checkedAt: string
}
