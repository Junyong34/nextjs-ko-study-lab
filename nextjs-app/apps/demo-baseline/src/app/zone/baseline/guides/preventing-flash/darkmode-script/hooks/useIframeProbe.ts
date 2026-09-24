'use client'

import { useEffect, useState, type RefObject } from 'react'
import { summarize, type ProbeSummary } from '../lib/summarize'

/**
 * 같은 오리진 iframe(하위 라우트)의 window에 프로브가 기록한 실측값을 읽는다.
 * loadKey가 바뀌면 iframe 요소가 새로 만들어져 하드 로드되므로 이전 값을 버리고 다시 읽는다.
 */
export function useIframeProbe(ref: RefObject<HTMLIFrameElement | null>, loadKey: number) {
  const [summary, setSummary] = useState<ProbeSummary | null>(null)

  useEffect(() => {
    setSummary(null)
    const id = window.setInterval(() => {
      let probe
      try {
        probe = ref.current?.contentWindow?.__darkmodeScriptProbe
      } catch {
        return
      }
      if (!probe) return
      setSummary(summarize(probe))
      if (probe.done) window.clearInterval(id)
    }, 250)
    return () => window.clearInterval(id)
  }, [ref, loadKey])

  return summary
}
