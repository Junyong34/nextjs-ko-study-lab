// 이 데모의 Route Handler 경로. 셸 안(iframe)에서도 같은 상대 경로로 cache zone에 도달한다.
export const PROBE_PATH = '/zone/cache/config/cache-life/custom-presets/probe'

export type PresetKey = 'short' | 'medium' | 'long'

export interface PresetSpec {
  key: PresetKey
  /** next.config.ts의 cacheLife 객체에 선언한 프로필 이름 (cacheLife('이 이름')으로 호출) */
  profile: string
  label: string
  stale: number
  revalidate: number
  expire: number
}

/**
 * next.config.ts 최상위 cacheLife에 선언한 값과 동일하다 (설정 파일이 단일 원천이고, 이 표는 화면 표시·판정용 사본).
 * 'use cache'/next/cache import가 없는 파일이라 클라이언트 컴포넌트가 안전하게 import할 수 있다.
 */
export const PRESETS: readonly PresetSpec[] = [
  { key: 'short', profile: 'config-cache-life-custom-presets:short', label: '짧은 수명', stale: 10, revalidate: 20, expire: 300 },
  { key: 'medium', profile: 'config-cache-life-custom-presets:medium', label: '중간 수명', stale: 30, revalidate: 50, expire: 300 },
  { key: 'long', profile: 'config-cache-life-custom-presets:long', label: '긴 수명', stale: 60, revalidate: 120, expire: 900 },
]

/** next@16.3.2 config-shared.js의 기본 프로필 이름. 같은 이름으로 선언하면 내장 값이 앱 전역에서 바뀐다. */
export const BUILTIN_PROFILE_NAMES = ['default', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'max'] as const

/** 잘못된 cacheLife 사용을 실제로 실행해 Next.js가 던지는 오류를 받아 오는 실험 */
export type FaultKey = 'invalid-order' | 'unknown-profile'

export const FAULTS: readonly { key: FaultKey; label: string; code: string; expectedMessage: string }[] = [
  {
    key: 'invalid-order',
    label: 'revalidate > expire',
    code: "cacheLife({ revalidate: 60, expire: 30 })",
    expectedMessage: 'expire option must be greater than the revalidate option',
  },
  {
    key: 'unknown-profile',
    label: '선언하지 않은 프리셋 이름',
    code: "cacheLife('config-cache-life-custom-presets:unknown')",
    expectedMessage: 'is not configured in next.config.js',
  },
]

/** probe Route Handler의 JSON 응답 */
export type ProbeBody =
  | { ok: true; preset: PresetKey | null; cacheId: string; generatedAt: number; servedAt: number }
  | { ok: false; error: string }

/** 클라이언트가 probe 한 번을 호출해 기록한 측정값 (시각은 모두 서버 시계 기준 epoch ms) */
export interface PresetReading {
  seq: number
  cacheId: string
  generatedAt: number
  servedAt: number
  /** 이번 응답이 이 시점 캐시 엔트리의 나이(초) */
  ageSec: number
  httpStatus: number
  cacheControl: string | null
  nextHeaders: string[]
}

export interface FaultResult {
  httpStatus: number
  error: string
}

/** 한 번의 '읽기'가 캐시 수명 중 어디에 해당하는지 */
export type ReadingPhase = 'first' | 'new' | 'hit' | 'stale'
