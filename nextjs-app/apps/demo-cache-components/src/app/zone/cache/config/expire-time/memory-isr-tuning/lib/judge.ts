import type { HeaderReading, TargetSpec, Verdict } from '../types'

/** Cache-Control 문자열에서 s-maxage와 stale-while-revalidate 값을 꺼낸다. */
export function parseCacheControl(value: string | null) {
  const pick = (name: string) => {
    const match = value?.match(new RegExp(`${name}=(\\d+)`))
    return match ? Number(match[1]) : null
  }
  return { sMaxage: pick('s-maxage'), swr: pick('stale-while-revalidate') }
}

/**
 * 한 대상의 실측 헤더를 기대값과 비교한다.
 * next dev는 모든 페이지에 Cache-Control: no-cache, must-revalidate를 붙이므로 판정할 수 없다.
 * CDN 같은 중간 계층이 헤더를 바꾼 흔적이 있어도 next start의 원래 값을 알 수 없어 판정하지 않는다.
 */
export function judgeTarget(spec: TargetSpec, reading: HeaderReading | undefined, nodeEnv: string): { verdict: Verdict; reason: string } {
  if (nodeEnv !== 'production') {
    return { verdict: 'undetermined', reason: `NODE_ENV=${nodeEnv}. next dev는 ISR 경로에도 Cache-Control: no-cache, must-revalidate를 보낸다.` }
  }
  if (!reading) return { verdict: 'undetermined', reason: '아직 측정하지 않았다.' }
  if (reading.intermediary) {
    return { verdict: 'undetermined', reason: `중간 계층(${reading.intermediary})이 Cache-Control을 소비·변경했을 수 있다.` }
  }
  const { sMaxage, swr } = parseCacheControl(reading.cacheControl)
  if (spec.expected === null) {
    return sMaxage === null
      ? { verdict: 'match', reason: 's-maxage가 없다. ISR 캐시 수명이 없는 응답이다.' }
      : { verdict: 'mismatch', reason: `동적 경로인데 s-maxage=${sMaxage}가 붙었다.` }
  }
  if (sMaxage === spec.expected.sMaxage && swr === spec.expected.swr) {
    return { verdict: 'match', reason: `s-maxage + stale-while-revalidate = ${sMaxage + swr}초 (경로의 expire)` }
  }
  return { verdict: 'mismatch', reason: `기대 s-maxage=${spec.expected.sMaxage}, stale-while-revalidate=${spec.expected.swr}와 다르다.` }
}

export function overallMatched(verdicts: Verdict[]): boolean | undefined {
  if (verdicts.some((v) => v === 'mismatch')) return false
  if (verdicts.length > 0 && verdicts.every((v) => v === 'match')) return true
  return undefined
}
