export const NESTED_LOADING_BASE_PATH =
  '/zone/baseline/file-conventions/loading/nested-segment-loading'

/**
 * 하나의 실행(run)에서 실제로 관측된 이벤트 타임스탬프.
 * catalog/loading.tsx → catalog/[run]/page.tsx → catalog/[run]/[product]/loading.tsx →
 * (fallback 중 상위 조작) → catalog/[run]/[product]/page.tsx 순서로 채워진다.
 */
export interface RunTimeline {
  runId: string
  catalogFallbackSeenAt: number | null
  catalogReadyAt: number | null
  productId: string | null
  productFallbackSeenAt: number | null
  parentActionAt: number | null
  productReadyAt: number | null
}

export interface NestedLoadingVerification {
  isMatched: boolean | undefined
  reason: string
}

export function createRunId(): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(16).slice(2, 10)
  return `run-${Date.now().toString(36)}-${random}`
}
