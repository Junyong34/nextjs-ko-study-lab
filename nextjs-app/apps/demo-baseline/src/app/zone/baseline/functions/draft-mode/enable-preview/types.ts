export interface DraftPreviewSnapshot {
  /** unstable_cache 함수가 실행된 시각(ISO). 캐시가 유지되는 동안은 값이 그대로다. */
  renderedAt: string
  /** 실행마다 새로 뽑는 식별자. renderedAt과 함께 캐시 HIT/MISS를 이중으로 확인한다. */
  requestId: string
}
