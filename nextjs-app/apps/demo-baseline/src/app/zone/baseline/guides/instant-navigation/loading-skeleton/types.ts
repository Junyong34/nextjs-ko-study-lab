export const LOADING_SKELETON_BASE_PATH = '/zone/baseline/guides/instant-navigation/loading-skeleton'

/** 두 하위 page.tsx가 서버에서 실제로 await하는 시간(ms). 관측용 의도적 지연이다. */
export const SERVER_DELAY_MS = 1500

/** loading.tsx가 있는 경로 / 없는 경로. 폴더 이름과 동일하다. */
export type Variant = 'with-loading' | 'without-loading'

export const VARIANTS: readonly Variant[] = ['with-loading', 'without-loading']

export const VARIANT_LABEL: Record<Variant, string> = {
  'with-loading': 'loading.tsx 있음',
  'without-loading': 'loading.tsx 없음',
}

/** MutationObserver가 찾는 DOM 표식. loading.tsx와 page.tsx가 이 속성을 렌더링한다. */
export const MARKER_ATTR = 'data-lsk-marker'
export const SERVER_MS_ATTR = 'data-lsk-server-ms'

export function variantHref(variant: Variant) {
  return `${LOADING_SKELETON_BASE_PATH}/${variant}`
}

/** 한 번의 클릭 → 전환 완료까지 브라우저에서 실측한 값. 시각은 모두 performance.now() 기준(ms). */
export interface NavMeasurement {
  runId: number
  variant: Variant
  clickAt: number
  skeletonAt: number | null
  contentAt: number | null
  /** 서버 page.tsx가 스스로 잰 대기 시간(최종 콘텐츠의 data 속성에서 읽음) */
  serverMs: number | null
  /** 클릭 이전에 이 경로로 나간 fetch 수 (이전 전환 요청 제외 = prefetch) */
  prefetchBeforeClick: number
  /** 그 prefetch 응답들의 decodedBodySize 합(bytes) — Resource Timing API 실측 */
  prefetchBytes: number
  mode: 'development' | 'production'
}

export interface LoadingSkeletonVerdict {
  isMatched: boolean | undefined
  reasons: string[]
}
