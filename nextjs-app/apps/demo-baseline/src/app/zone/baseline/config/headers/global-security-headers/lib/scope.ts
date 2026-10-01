import { HEADERS_SCOPE_SOURCE, SECURITY_HEADERS } from '@/config/demo-next-config/headers-security'
import type { HeaderVerdict, PathProbe } from '../types'

// source가 '<base>/:path*' 형태일 때 base 자신과 그 하위 경로만 범위 안이다. (path-to-regexp의 :path*는 0개 이상 세그먼트)
const SCOPE_BASE = HEADERS_SCOPE_SOURCE.replace(/\/:path\*$/, '')

export const isInScope = (path: string) => path === SCOPE_BASE || path.startsWith(`${SCOPE_BASE}/`)

/** 설정 조각이 선언한 헤더 목록. 기대값의 단일 출처로 쓴다. */
export const EXPECTED_HEADERS = SECURITY_HEADERS

/** 측정하는 헤더 이름 목록(소문자). 설정 조각의 헤더 + 넣지 않기로 한 X-Frame-Options. */
export const WATCHED_HEADERS = [...EXPECTED_HEADERS.map((h) => h.key.toLowerCase()), 'x-frame-options']

/**
 * 헤더 단위 판정.
 * - 대상 경로: 선언한 값과 정확히 같아야 한다.
 * - 대조 경로: 선언한 값과 달라야 한다. (Vercel 같은 플랫폼이 HSTS를 직접 붙이면 '없음'이 아니라 '값이 다름'으로 판정한다)
 */
export function judge(target: PathProbe, control: PathProbe): HeaderVerdict[] {
  return EXPECTED_HEADERS.map(({ key, value }) => {
    const k = key.toLowerCase()
    const targetValue = target.headers[k] ?? null
    const controlValue = control.headers[k] ?? null
    return {
      key,
      expectedValue: value,
      targetValue,
      controlValue,
      targetOk: isInScope(target.path) ? targetValue === value : targetValue !== value,
      controlOk: isInScope(control.path) ? controlValue === value : controlValue !== value,
    }
  })
}
