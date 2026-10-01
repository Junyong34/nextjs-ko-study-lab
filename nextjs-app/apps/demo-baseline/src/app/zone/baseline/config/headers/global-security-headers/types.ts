// 이 데모의 headers() 설정이 적용되는 범위(source)의 접두 경로. 설정 조각(headers-security.ts)의 source에서 ':path*'를 뺀 값이다.
export const DEMO_BASE = '/zone/baseline/config/headers/global-security-headers'

// 서버 액션이 대신 fetch할 수 있는 경로. 임의 URL을 받지 않도록 화이트리스트로 고정한다.
export const PROBE_PATHS = [
  { path: DEMO_BASE, label: '데모 페이지 (page.tsx)' },
  { path: `${DEMO_BASE}/probe`, label: '데모 하위 Route Handler (probe/route.ts)' },
  { path: '/zone/baseline/guides/environment-variables/runtime-env/api/status', label: '다른 데모의 Route Handler (환경변수 데모)' },
  { path: '/zone/baseline/config/powered-by-header/hide-x-powered', label: '다른 데모 페이지 (X-Powered-By 데모)' },
] as const

export type ProbePath = (typeof PROBE_PATHS)[number]['path']

/** 서버가 같은 앱의 한 경로를 fetch해 읽은 응답 */
export interface PathProbe {
  path: string
  status: number
  /** 소문자 헤더 이름 → 값. 이 데모가 관심 있는 헤더만 담는다. */
  headers: Record<string, string | null>
  measuredAt: string
}

/** 헤더 한 줄의 판정 결과 */
export interface HeaderVerdict {
  key: string
  expectedValue: string
  targetValue: string | null
  controlValue: string | null
  targetOk: boolean
  controlOk: boolean
}

export type MeasureResult = { ok: true; target: PathProbe; control: PathProbe } | { ok: false; error: string }
