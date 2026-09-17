export type PrefetchVariant = 'auto' | 'full' | 'false'

/** 실제 PerformanceObserver('resource')가 캡처한 prefetch 요청 1건 */
export interface PrefetchResourceEntry {
  variant: PrefetchVariant
  url: string
  transferSize: number
  encodedBodySize: number
  initiatorType: string
  startTime: number
}

export interface VariantConfig {
  key: PrefetchVariant
  /** next/link의 prefetch prop에 그대로 전달되는 값 (undefined = null/auto 기본값) */
  prefetchProp: boolean | undefined
  label: string
  badge: string
}
