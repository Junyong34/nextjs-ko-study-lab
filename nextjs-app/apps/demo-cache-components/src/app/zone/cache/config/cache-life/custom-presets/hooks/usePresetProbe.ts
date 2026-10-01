'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PRESETS, PROBE_PATH, type FaultKey, type FaultResult, type PresetKey, type PresetReading, type ProbeBody } from '../types'

const POLL_INTERVAL_MS = 5000
// 긴 수명(revalidate 120초)의 교체까지 볼 수 있도록 3분 동안 자동 측정한 뒤 멈춘다.
const AUTO_STOP_MS = 180_000

type ReadingsByPreset = Record<PresetKey, PresetReading[]>
const emptyReadings = (): ReadingsByPreset => ({ short: [], medium: [], long: [] })

/** 응답 헤더 중 캐시와 관련된 것만 남긴다. */
function pickHeaders(res: Response) {
  const nextHeaders: string[] = []
  res.headers.forEach((value, name) => {
    if (name.startsWith('x-nextjs')) nextHeaders.push(`${name}: ${value}`)
  })
  return { cacheControl: res.headers.get('cache-control'), nextHeaders }
}

export function usePresetProbe() {
  const [readings, setReadings] = useState<ReadingsByPreset>(emptyReadings)
  const [faults, setFaults] = useState<Record<FaultKey, FaultResult | null>>({ 'invalid-order': null, 'unknown-profile': null })
  const [error, setError] = useState<string | null>(null)
  const [isAuto, setIsAuto] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [autoStartedAt, setAutoStartedAt] = useState<number | null>(null)
  const seqRef = useRef(0)
  const inFlight = useRef(false)

  const measureOnce = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    setIsPending(true)
    const seq = ++seqRef.current
    try {
      // 세 프리셋을 같은 회차(seq)로 묶어 순서대로 호출한다 — 같은 시점의 수명 차이를 비교하기 위해서다.
      const next: Partial<Record<PresetKey, PresetReading>> = {}
      for (const spec of PRESETS) {
        // cache: 'no-store'는 쓰지 않는다. 브라우저가 Cache-Control: no-cache 요청 헤더를 붙이고, next dev는 그 헤더가 있으면
        // 'use cache'를 강제로 다시 계산해 프리셋 수명을 관측할 수 없다. 대신 회차 번호로 브라우저 HTTP 캐시만 피한다.
        const res = await fetch(`${PROBE_PATH}?preset=${spec.key}&round=${seq}`)
        const body = (await res.json()) as ProbeBody
        if (!body.ok) throw new Error(body.error)
        next[spec.key] = {
          seq,
          cacheId: body.cacheId,
          generatedAt: body.generatedAt,
          servedAt: body.servedAt,
          ageSec: (body.servedAt - body.generatedAt) / 1000,
          httpStatus: res.status,
          ...pickHeaders(res),
        }
      }
      setReadings((prev) => ({
        short: [...prev.short, next.short!],
        medium: [...prev.medium, next.medium!],
        long: [...prev.long, next.long!],
      }))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setIsAuto(false)
    } finally {
      inFlight.current = false
      setIsPending(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuto) return
    void measureOnce()
    const id = setInterval(() => {
      if (autoStartedAt !== null && Date.now() - autoStartedAt > AUTO_STOP_MS) setIsAuto(false)
      else void measureOnce()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isAuto, autoStartedAt, measureOnce])

  const toggleAuto = () => {
    if (!isAuto) setAutoStartedAt(Date.now())
    setIsAuto((v) => !v)
  }

  const runFault = async (key: FaultKey) => {
    try {
      const res = await fetch(`${PROBE_PATH}?fault=${key}&at=${Date.now()}`)
      const body = (await res.json()) as ProbeBody
      setFaults((prev) => ({ ...prev, [key]: { httpStatus: res.status, error: body.ok ? '(오류 없이 값이 반환됨)' : body.error } }))
    } catch (e) {
      setFaults((prev) => ({ ...prev, [key]: { httpStatus: 0, error: (e as Error).message } }))
    }
  }

  // 측정 기록만 지운다. 서버의 'use cache' 엔트리는 각자의 수명대로 남아 있다.
  const reset = () => {
    setIsAuto(false)
    setAutoStartedAt(null)
    setReadings(emptyReadings())
    setFaults({ 'invalid-order': null, 'unknown-profile': null })
    setError(null)
    seqRef.current = 0
  }

  return { readings, faults, error, isAuto, isPending, autoStartedAt, measureOnce, toggleAuto, runFault, reset }
}

export type PresetProbeState = ReturnType<typeof usePresetProbe>
