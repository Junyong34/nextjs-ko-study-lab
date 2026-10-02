// 이 데모가 헤더를 측정하는 대상 라우트. 셸 안(iframe)에서도 같은 상대 경로로 cache zone에 도달한다.
export const TARGET_BASE = '/zone/cache/config/expire-time/memory-isr-tuning/targets'

/** next@16.3.2 config-shared.js의 expireTime 기본값 (초). 이 앱은 expireTime을 설정하지 않았다. */
export const DEFAULT_EXPIRE_TIME = 31_536_000

export type TargetKey = 'default-profile' | 'hours-profile' | 'dynamic'

export interface TargetSpec {
  key: TargetKey
  label: string
  /** 대상 페이지가 쓰는 캐시 설정 (화면 표시용) */
  code: string
  /** production(next start)에서 기대하는 Cache-Control. null이면 s-maxage가 없어야 한다. */
  expected: { sMaxage: number; swr: number } | null
  /** 기대값이 나오는 이유 */
  why: string
}

export const TARGETS: readonly TargetSpec[] = [
  {
    key: 'default-profile',
    label: "cacheLife('default') — expire 미지정",
    code: "'use cache'\ncacheLife('default') // revalidate 900, expire 무한대",
    expected: { sMaxage: 900, swr: DEFAULT_EXPIRE_TIME - 900 },
    why: '경로에 유한한 expire가 없으므로 expireTime(기본 31536000초)이 expire 자리를 채운다. stale-while-revalidate = expireTime − revalidate.',
  },
  {
    key: 'hours-profile',
    label: "cacheLife('hours') — expire 86400 지정",
    code: "'use cache'\ncacheLife('hours') // revalidate 3600, expire 86400",
    expected: { sMaxage: 3600, swr: 86_400 - 3600 },
    why: 'cacheLife가 expire를 이미 정했으므로 expireTime은 쓰이지 않는다. stale-while-revalidate = 86400 − 3600.',
  },
  {
    key: 'dynamic',
    label: 'connection() — 요청마다 렌더링',
    code: 'await connection() // <Suspense> 안의 동적 구간',
    expected: null,
    why: '요청 시점 렌더링이 섞인 응답은 ISR 캐시 대상이 아니라 s-maxage와 stale-while-revalidate가 붙지 않는다.',
  },
]

/** 브라우저가 대상 라우트 한 곳을 요청해 받은 실제 응답 헤더 */
export interface HeaderReading {
  key: TargetKey
  status: number
  cacheControl: string | null
  nextHeaders: string[]
  /** CDN 등 중간 계층이 응답을 바꿨다고 볼 수 있는 헤더 (예: x-vercel-cache) */
  intermediary: string | null
  measuredAt: number
}

export type Verdict = 'match' | 'mismatch' | 'undetermined'
