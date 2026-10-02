'use client'
import { useRef, useState } from 'react'
import { TARGET_BASE, TARGETS, type HeaderReading, type TargetKey } from '../types'

/** 중간 계층(CDN)이 응답을 처리했다는 흔적. 있으면 Cache-Control이 원래 값과 다를 수 있다. */
function detectIntermediary(res: Response): string | null {
  if (res.headers.has('x-vercel-cache')) return `x-vercel-cache: ${res.headers.get('x-vercel-cache')}`
  if (res.headers.has('cf-cache-status')) return `cf-cache-status: ${res.headers.get('cf-cache-status')}`
  return null
}

export function useHeaderProbe() {
  const [readings, setReadings] = useState<Partial<Record<TargetKey, HeaderReading>>>({})
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const roundRef = useRef(0)

  async function measure() {
    setIsPending(true)
    const round = ++roundRef.current
    try {
      const next: Partial<Record<TargetKey, HeaderReading>> = {}
      for (const target of TARGETS) {
        // cache: 'no-store'는 쓰지 않는다 (요청에 Cache-Control: no-cache가 붙는다). 회차 번호로 브라우저 HTTP 캐시만 피한다.
        const res = await fetch(`${TARGET_BASE}/${target.key}?round=${round}`)
        await res.text()
        const nextHeaders: string[] = []
        res.headers.forEach((value, name) => {
          if (name.startsWith('x-nextjs')) nextHeaders.push(`${name}: ${value}`)
        })
        next[target.key] = {
          key: target.key,
          status: res.status,
          cacheControl: res.headers.get('cache-control'),
          nextHeaders,
          intermediary: detectIntermediary(res),
          measuredAt: Date.now(),
        }
      }
      setReadings(next)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsPending(false)
    }
  }

  const reset = () => {
    setReadings({})
    setError(null)
  }

  return { readings, error, isPending, measure, reset }
}

export type HeaderProbeState = ReturnType<typeof useHeaderProbe>
