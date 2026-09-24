import type { Product } from '@study/demo-kit'

/** 캐시 함수의 첫 번째 인자. searchParams에서 읽어 문자열로 넘긴다. */
export type StatsCategory = Extract<Product['category'], 'electronics' | 'fashion' | 'books'>
/** 캐시 함수의 두 번째 인자({ currency })에 들어가는 값 */
export type Currency = 'KRW' | 'USD'

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

/** 'use cache' 함수 본문이 실제로 실행될 때 기록하는 값. 캐시 HIT이면 이전 실행의 값이 그대로 돌아온다. */
export interface CategoryStats {
  category: StatsCategory
  currency: Currency
  cacheId: string
  /** Date 그대로 반환 → 직렬화 후에도 Date인지 호출부에서 검사한다 */
  generatedAt: Date
  /** 서버 프로세스 전체에서 이 함수 본문이 실행된 순번 */
  globalExecNo: number
  /** 같은 인자 조합으로 본문이 실행된 횟수 */
  argsExecNo: number
  productCount: number
  totalStock: number
  avgPrice: number
  /** Map / Set도 그대로 반환해 직렬화 결과를 관측한다 */
  priceByProduct: Map<string, number>
  tags: Set<string>
}

/** 캐시 밖(호출부)에서 반환값을 검사한 결과 */
export interface ReturnTypeCheck {
  dateIsDate: boolean
  mapIsMap: boolean
  setIsSet: boolean
  /** 클래스 인스턴스를 반환하는 캐시 함수를 호출했을 때의 결과 */
  classInstance: { ok: true; detail: string } | { ok: false; error: string }
}

/** 한 번의 서버 요청에서 관측한 값 (클라이언트로 전달되어 기록된다) */
export interface RequestObservation {
  requestId: string
  requestAt: string
  argsKey: string
  callA: { cacheId: string; globalExecNo: number; argsExecNo: number; generatedAt: string }
  callB: { cacheId: string; globalExecNo: number; argsExecNo: number }
  types: ReturnTypeCheck
}

export interface Observation extends RequestObservation {
  seq: number
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
