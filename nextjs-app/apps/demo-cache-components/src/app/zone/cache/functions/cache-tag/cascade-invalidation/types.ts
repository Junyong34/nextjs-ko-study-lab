/** 캐시 엔트리가 태그 계층에서 차지하는 위치 */
export type EntryLevel = 'catalog' | 'category' | 'product'

export type CategoryId = 'keyboard' | 'mouse'
export type ProductId = 'k1' | 'k2' | 'm1' | 'm2'

/**
 * 'use cache' 함수 하나가 반환하는 캐시 엔트리의 스냅샷.
 * cacheId·generatedAt은 캐시 함수 본문이 실제로 실행될 때만 새로 만들어진다.
 */
export interface CacheEntrySnapshot {
  key: string
  level: EntryLevel
  label: string
  detail: string
  /** 이 엔트리에 cacheTag()로 실제 부착한 태그 목록 */
  tags: string[]
  cacheId: string
  generatedAt: string
}

/** 무효화 버튼 하나가 대상으로 삼는 태그 */
export interface InvalidationTarget {
  id: string
  level: EntryLevel
  label: string
  tag: string
}
