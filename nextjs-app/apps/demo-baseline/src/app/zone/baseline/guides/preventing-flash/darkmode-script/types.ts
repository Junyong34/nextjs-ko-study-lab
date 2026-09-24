export type Theme = 'light' | 'dark'

export type Variant = 'use-effect' | 'inline-script'

/** rAF 프레임마다 데모 영역의 테마가 바뀔 때만 한 구간을 추가하고, 같은 테마면 count만 늘린다. */
export interface FrameSegment {
  /** 이 구간의 첫 프레임 시각 (performance.now, ms) */
  t: number
  theme: string | null
  bg: string
  /** 이 테마로 그려진 rAF 프레임 수 */
  count: number
}

/** 하위 라우트의 프로브 인라인 스크립트가 window에 기록하는 실측값 */
export interface ProbeResult {
  variant: Variant
  /** 프로브 스크립트가 실행된 시각 */
  start: number
  /** 저장된 테마 원문 (localStorage 값, 없으면 null) */
  stored: string | null
  frames: FrameSegment[]
  /** PerformanceObserver('paint')가 보고한 first-paint / first-contentful-paint */
  paints: { name: string; t: number }[]
  /** 테마 인라인 스크립트가 data-theme을 설정한 시각 (inline-script 방식만) */
  scriptAt: { t: number; theme: string | null } | null
  /** 하이드레이션 직후 첫 useEffect 실행 시각과 그 시점의 data-theme */
  hydratedAt: number | null
  themeAtHydration: string | null
  /** console.error / window error 로 보고된 hydration 관련 메시지 */
  errors: string[]
  done: boolean
}

declare global {
  interface Window {
    __darkmodeScriptProbe?: ProbeResult
  }
}
