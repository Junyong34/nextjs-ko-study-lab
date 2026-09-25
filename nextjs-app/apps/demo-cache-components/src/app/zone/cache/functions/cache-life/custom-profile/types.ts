/** 이 실습에서 비교하는 두 개의 'use cache' 바인딩 방식 */
export type BindingMode = 'custom' | 'default'

/** next.config.ts의 cacheLife 커스텀 프로필 키. cacheLife() 호출부와 반드시 동일한 문자열이어야 한다. */
export const CUSTOM_PROFILE_NAME = 'functions-cache-life-custom-profile:breaking-news' as const

export interface BindingSpec {
  mode: BindingMode
  /** cacheLife() 호출부에 실제로 쓰는 인자. default는 호출 자체를 생략한다. */
  callArg: string
  /** 초 단위 */
  stale: number
  revalidate: number
  expire: number
  source: string
}

/**
 * 두 바인딩의 stale/revalidate/expire 값 (단위: 초).
 * - custom: 이 앱 next.config.ts의 cacheLife[CUSTOM_PROFILE_NAME] 정의값과 반드시 일치해야 한다.
 * - default: next.config.ts가 재정의하지 않은 내장 default 프로필.
 *   출처: node_modules/next/dist/server/config-shared.js defaultConfig.cacheLife.default
 *        (stale은 experimental.staleTimes.static에서 채워짐, revalidate 900, expire INFINITE_CACHE)
 */
export const BINDING_SPECS: BindingSpec[] = [
  {
    mode: 'custom',
    callArg: `cacheLife('${CUSTOM_PROFILE_NAME}')`,
    stale: 30,
    revalidate: 4,
    expire: 20,
    source: 'next.config.ts cacheLife 커스텀 프로필',
  },
  {
    mode: 'default',
    callArg: '(cacheLife 호출 없음)',
    stale: 300,
    revalidate: 900,
    expire: Number.POSITIVE_INFINITY,
    source: '내장 default 프로필 (config-shared.js defaultConfig.cacheLife.default)',
  },
]

/** 'use cache' 함수 본문이 실제로 실행될 때 기록한 값. 캐시 HIT이면 이전 실행의 값이 그대로 온다. */
export interface CacheSnapshot {
  mode: BindingMode
  cacheId: string
  /** 본문 실행 시각 (서버 epoch ms) */
  generatedAt: number
  /** 서버 프로세스에서 이 함수 본문이 실행된 횟수 */
  execNo: number
}

/** 한 번의 서버 요청에서 관측한 값 */
export interface RequestSnapshot {
  requestId: string
  /** 두 캐시 함수를 모두 await한 뒤의 서버 시각 (epoch ms) */
  requestAt: number
  mode: string
  rows: Record<BindingMode, CacheSnapshot>
}

export interface Observation extends RequestSnapshot {
  seq: number
}

export function formatDuration(sec: number): string {
  if (!Number.isFinite(sec)) return '만료 없음 (never)'
  if (sec < 60) return `${sec}초`
  if (sec < 3600) return `${sec / 60}분`
  return `${sec / 3600}시간`
}

export function formatAge(ms: number): string {
  const s = ms / 1000
  return s < 60 ? `${s.toFixed(1)}초` : `${Math.floor(s / 60)}분 ${Math.round(s % 60)}초`
}

export function formatServerTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })
}
