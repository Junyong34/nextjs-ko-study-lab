import { REVALIDATE_SECONDS, type FetchMode, type FetchProbeResult } from '../types'

export interface ModeVerdict {
  mode: FetchMode
  calls: number
  /** undefined: 비교할 호출이 아직 부족함 */
  ok: boolean | undefined
  detail: string
}

const STATIC_EXPECT: Record<FetchMode, 'same' | 'increase' | 'window'> = {
  default: 'increase',
  'force-cache': 'same',
  'no-store': 'increase',
  revalidate: 'window',
}

/** 같은 epoch(무효화 사이 구간)의 연속 호출 쌍만 비교해 실측 sourceCount로 판정한다. */
export function evaluateMode(mode: FetchMode, all: FetchProbeResult[]): ModeVerdict {
  const rule = STATIC_EXPECT[mode]
  const calls = all.filter((c) => c.mode === mode).sort((a, b) => a.calledAt - b.calledAt)
  const pairs: [FetchProbeResult, FetchProbeResult][] = []
  for (let i = 1; i < calls.length; i++) {
    if (calls[i].epoch === calls[i - 1].epoch) pairs.push([calls[i - 1], calls[i]])
  }
  if (pairs.length === 0) {
    return { mode, calls: calls.length, ok: undefined, detail: '같은 구간에서 2회 이상 호출 필요' }
  }
  let ok = true
  for (const [prev, cur] of pairs) {
    if (rule === 'same') ok &&= prev.sourceCount === cur.sourceCount
    else if (rule === 'increase') ok &&= cur.sourceCount > prev.sourceCount
    else {
      // 이전 응답이 만든 캐시 항목이 아직 신선한(10초 미만) 시점의 호출은 같은 값이어야 한다.
      // 만료 후에는 stale 응답 뒤 백그라운드 갱신이 일어나 값이 바뀌어도 위반이 아니다.
      const ageSec = (cur.calledAt - new Date(prev.generatedAt).getTime()) / 1000
      if (ageSec < REVALIDATE_SECONDS) ok &&= prev.sourceCount === cur.sourceCount
    }
  }
  const seq = calls.map((c) => c.sourceCount).join(' → ')
  return { mode, calls: calls.length, ok, detail: `sourceCount ${seq}` }
}
