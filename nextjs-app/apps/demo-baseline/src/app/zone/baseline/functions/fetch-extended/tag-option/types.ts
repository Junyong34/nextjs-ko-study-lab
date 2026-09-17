export type ProductKey = 'shoes' | 'windbreaker'

/**
 * 캐시 태그는 앱 전역이라 같은 zone의 다른 데모 캐시를 지울 수 있다.
 * 이 데모 전용 접두사를 붙여 다른 데모와 충돌하지 않게 한다.
 */
export const PRODUCT_TAGS: Record<ProductKey, string> = {
  shoes: 'fetch-extended-tag-option-shoes',
  windbreaker: 'fetch-extended-tag-option-windbreaker',
}

export interface TaggedProductSnapshot {
  product: ProductKey
  name: string
  price: number
  /** 이 데모 전용 Route Handler가 실제로 실행된(=캐시 미스) 누적 횟수 */
  fetchCount: number
  /** Route Handler가 이 응답을 실제로 만들어낸 서버 시각(ISO). 캐시 HIT이면 이전 값과 동일하게 유지된다 */
  fetchedAt: string
}

export interface PurgeResult {
  tag: string
  purgedAt: string
}
