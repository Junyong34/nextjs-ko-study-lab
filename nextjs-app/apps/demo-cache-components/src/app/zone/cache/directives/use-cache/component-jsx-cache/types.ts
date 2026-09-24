import type { Product } from '@study/demo-kit'

/** 캐시된 컴포넌트에 prop으로 전달되는 카테고리 값. 이 값이 캐시 키의 일부가 된다. */
export type RankingCategory = 'all' | Product['category']

export const RANKING_CATEGORIES: { id: RankingCategory; label: string }[] = [
  { id: 'all', label: '종합' },
  { id: 'electronics', label: '전자기기' },
  { id: 'fashion', label: '패션/의류' },
  { id: 'books', label: '도서' },
]

export function toRankingCategory(value: string | string[] | undefined): RankingCategory {
  const raw = Array.isArray(value) ? value[0] : value
  return RANKING_CATEGORIES.some((c) => c.id === raw) ? (raw as RankingCategory) : 'all'
}

/** 'use cache' 컴포넌트 본문이 실행될 때 기록된 값 (캐시 HIT이면 이전 실행의 값이 그대로 재사용된다) */
export interface CachedRenderInfo {
  category: RankingCategory
  renderId: string
  renderedAt: string
  /** 서버 프로세스 전체에서 이 컴포넌트 본문이 실행된 순번 */
  globalExecNo: number
  /** 이 category prop 값으로 본문이 실행된 횟수 */
  categoryExecNo: number
}

/** children 슬롯(캐시 밖)에서 매 요청마다 기록된 값 */
export interface RequestInfo {
  category: RankingCategory
  requestId: string
  requestAt: string
}

export interface Observation extends CachedRenderInfo {
  seq: number
  requestId: string
  requestAt: string
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
