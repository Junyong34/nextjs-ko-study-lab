import { FAULTS, type FaultKey, type FaultResult, type PresetReading, type PresetSpec, type ReadingPhase } from '../types'

// 서버 시계 기준 측정이지만 요청 처리 시간만큼의 오차를 허용한다.
const TOLERANCE_SEC = 0.5

/**
 * 직전 읽기와 비교해 이번 읽기가 새 계산(new)인지, 수명 안 재사용(hit)인지, revalidate가 지난 재사용(stale)인지.
 * 첫 읽기(first)는 비교 대상이 없다 — 측정 전부터 서버에 남아 있던 엔트리일 수 있다.
 */
export function classify(prev: PresetReading | undefined, r: PresetReading, spec: PresetSpec): ReadingPhase {
  if (!prev) return 'first'
  if (prev.cacheId !== r.cacheId) return 'new'
  return r.ageSec < spec.revalidate ? 'hit' : 'stale'
}

export interface Refresh {
  seq: number
  /** 교체되기 직전 엔트리의 나이(초) — 이 값이 revalidate 이상이어야 설정대로 동작한 것이다. */
  oldAgeSec: number
  ok: boolean
}

export interface PresetVerdict {
  spec: PresetSpec
  refreshes: Refresh[]
  /** 설정과 어긋난 관측: revalidate 전에 교체됐거나 expire를 넘긴 엔트리가 응답됨 */
  violations: string[]
}

export function judgePreset(spec: PresetSpec, readings: PresetReading[]): PresetVerdict {
  const refreshes: Refresh[] = []
  const violations: string[] = []
  readings.forEach((r, i) => {
    const prev = readings[i - 1]
    if (prev && prev.cacheId !== r.cacheId) {
      const oldAgeSec = (r.servedAt - prev.generatedAt) / 1000
      const ok = oldAgeSec + TOLERANCE_SEC >= spec.revalidate
      refreshes.push({ seq: r.seq, oldAgeSec, ok })
      if (!ok) violations.push(`#${r.seq}: ${oldAgeSec.toFixed(1)}초 된 엔트리가 revalidate(${spec.revalidate}초) 전에 교체됨`)
    }
    if (r.ageSec > spec.expire + TOLERANCE_SEC) {
      violations.push(`#${r.seq}: expire(${spec.expire}초)를 넘긴 ${r.ageSec.toFixed(1)}초 된 엔트리가 응답됨`)
    }
  })
  return { spec, refreshes, violations }
}

/**
 * 짧은 프리셋이 교체된 바로 그 측정 회차에 중간 프리셋은 같은 엔트리를 재사용(hit)했는가.
 * 같은 함수 본문인데 cacheLife에 넘긴 프리셋 이름만 달라서 수명이 갈렸다는 직접 증거다.
 */
export function findDivergence(
  shortReadings: PresetReading[],
  mediumReadings: PresetReading[],
  shortSpec: PresetSpec,
  mediumSpec: PresetSpec,
): number | null {
  for (let i = 1; i < shortReadings.length; i++) {
    const s = shortReadings[i]
    if (classify(shortReadings[i - 1], s, shortSpec) !== 'new') continue
    const mi = mediumReadings.findIndex((m) => m.seq === s.seq)
    if (mi > 0 && classify(mediumReadings[mi - 1], mediumReadings[mi], mediumSpec) === 'hit') return s.seq
  }
  return null
}

export function isFaultMatched(key: FaultKey, result: FaultResult | null): boolean | undefined {
  if (!result) return undefined
  const fault = FAULTS.find((f) => f.key === key)
  return result.httpStatus === 500 && Boolean(fault && result.error.includes(fault.expectedMessage))
}
