import type { RunTimeline, NestedLoadingVerification } from './types'

function createEmptyTimeline(runId: string): RunTimeline {
  return {
    runId,
    catalogFallbackSeenAt: null,
    catalogReadyAt: null,
    productId: null,
    productFallbackSeenAt: null,
    parentActionAt: null,
    productReadyAt: null,
  }
}

function pending(reason: string): NestedLoadingVerification {
  return { isMatched: undefined, reason }
}
function fail(reason: string): NestedLoadingVerification {
  return { isMatched: false, reason }
}
function success(reason: string): NestedLoadingVerification {
  return { isMatched: true, reason }
}

function baseFor(timeline: RunTimeline | null, runId: string): RunTimeline {
  return timeline && timeline.runId === runId ? timeline : createEmptyTimeline(runId)
}

/** catalog/loading.tsx가 마운트될 때 1회 기록한다 (같은 실행에서는 최초 관측만 유지). */
export function applyCatalogFallback(timeline: RunTimeline | null, runId: string, at: number): RunTimeline {
  const base = baseFor(timeline, runId)
  if (base.catalogFallbackSeenAt) return base
  return { ...base, catalogFallbackSeenAt: at }
}

/** catalog/[run]/page.tsx의 서버 지연이 끝나고 실제로 마운트됐을 때 기록한다. */
export function applyCatalogReady(timeline: RunTimeline | null, runId: string, at: number): RunTimeline {
  const base = baseFor(timeline, runId)
  if (base.catalogReadyAt) return base
  return { ...base, catalogReadyAt: at }
}

/**
 * catalog/[run]/[product]/loading.tsx가 마운트될 때 기록한다.
 * 같은 실행 안에서 다른 상품으로 이동하면(productId가 바뀌면) 이전 상품에 대한
 * 상위 조작·완료 기록은 새 상품의 증거가 될 수 없으므로 함께 초기화한다.
 */
export function applyProductFallback(
  timeline: RunTimeline | null,
  runId: string,
  productId: string,
  at: number,
): RunTimeline {
  const base = baseFor(timeline, runId)
  if (base.productId !== productId) {
    return { ...base, productId, productFallbackSeenAt: at, parentActionAt: null, productReadyAt: null }
  }
  if (base.productFallbackSeenAt) return base
  return { ...base, productFallbackSeenAt: at }
}

/** catalog/[run]/layout.tsx의 상위 컨트롤 버튼 클릭 시 기록한다 (최초 클릭만 유지). */
export function applyParentAction(timeline: RunTimeline | null, runId: string, at: number): RunTimeline {
  const base = baseFor(timeline, runId)
  if (base.parentActionAt) return base
  return { ...base, parentActionAt: at }
}

/** catalog/[run]/[product]/page.tsx가 실제로 마운트됐을 때 기록한다. */
export function applyProductReady(
  timeline: RunTimeline | null,
  runId: string,
  productId: string,
  at: number,
): RunTimeline {
  const base = baseFor(timeline, runId)
  if (base.productId !== productId) {
    return { ...base, productId, productReadyAt: at }
  }
  if (base.productReadyAt) return base
  return { ...base, productReadyAt: at }
}

/**
 * 다섯 단계(카탈로그 fallback → 카탈로그 완료 → 상품 fallback → fallback 중 상위 조작 →
 * 상품 완료)가 같은 실행(runId) 안에서 실제 순서대로 관측됐을 때만 성공으로 판정한다.
 * 관측이 아직 없으면 대기(undefined), 순서·범위를 벗어나면 실패(false)로 구분한다.
 */
export function verifyNestedLoading(
  timeline: RunTimeline | null,
  currentRunId: string | null,
): NestedLoadingVerification {
  if (!currentRunId) {
    return pending('아직 [새 실행 시작]을 누르지 않았습니다. 버튼을 눌러 새 catalog/[run] 경로를 생성하세요.')
  }
  if (!timeline || timeline.runId !== currentRunId) {
    return pending(
      '현재 실행(run)의 관측 기록이 아직 없습니다. 이전 실행의 결과는 이번 실행의 증거로 인정하지 않습니다.',
    )
  }
  if (!timeline.catalogFallbackSeenAt) {
    return pending(
      '카탈로그 상위 loading.tsx fallback이 아직 관측되지 않았습니다. Router Cache로 즉시 이동했다면 [새 실행 시작]으로 다시 시도하세요.',
    )
  }
  if (!timeline.catalogReadyAt) {
    return pending('카탈로그 서버 응답(catalog/[run]/page.tsx)을 기다리는 중입니다.')
  }
  if (timeline.catalogReadyAt < timeline.catalogFallbackSeenAt) {
    return fail('카탈로그 완료 시각이 fallback 관측 시각보다 앞섭니다. 관측 순서가 올바르지 않습니다.')
  }
  if (!timeline.productId) {
    return pending('아직 상품 상세로 이동하지 않았습니다. 카탈로그 목록에서 상품을 클릭하세요.')
  }
  if (!timeline.productFallbackSeenAt) {
    if (timeline.productReadyAt) {
      return fail(
        '하위 loading.tsx fallback을 관측하지 못한 채 상품 상세가 완료됐습니다. 캐시된 이동으로 로딩 경계를 건너뛰었을 수 있습니다.',
      )
    }
    return pending('상품 상세 하위 loading.tsx fallback을 기다리는 중입니다.')
  }
  if (timeline.productFallbackSeenAt < timeline.catalogReadyAt) {
    return fail('상품 하위 fallback이 카탈로그 완료 이전에 관측되었습니다. 실행 순서가 올바르지 않습니다.')
  }
  if (!timeline.parentActionAt) {
    if (timeline.productReadyAt) {
      return fail('하위 fallback이 표시되는 동안 상위 조작(catalog/[run]/layout.tsx의 버튼)을 수행하지 않았습니다.')
    }
    return pending('하위 fallback이 표시되는 동안 상위 GNB의 [상위 조작] 버튼을 눌러주세요.')
  }
  if (timeline.parentActionAt < timeline.productFallbackSeenAt) {
    return fail('상위 조작이 하위 fallback 시작 전에 발생했습니다. fallback이 보이는 동안 눌러야 합니다.')
  }
  if (!timeline.productReadyAt) {
    return pending('상품 상세 서버 응답(catalog/[run]/[product]/page.tsx)을 기다리는 중입니다.')
  }
  if (timeline.parentActionAt > timeline.productReadyAt) {
    return fail('상위 조작이 상품 상세 완료 이후에 발생했습니다. 하위 fallback이 보이는 동안 조작해야 합니다.')
  }
  return success(
    `실행 ${timeline.runId}: 카탈로그 fallback → 완료 → 상품 fallback 중 상위 조작 → 상품 상세 완료 순서가 모두 실제로 관측되었습니다.`,
  )
}
