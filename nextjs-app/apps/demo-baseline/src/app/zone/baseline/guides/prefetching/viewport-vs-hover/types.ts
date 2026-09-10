export interface PrefetchCounts {
  /** prefetch prop 미지정 링크(뷰포트 자동 prefetch)에서 실제 관찰된 요청 수 */
  autoCount: number
  /** prefetch={false} 링크에서 실제 관찰된 요청 수 (항상 0이어야 정상) */
  disabledCount: number
}
