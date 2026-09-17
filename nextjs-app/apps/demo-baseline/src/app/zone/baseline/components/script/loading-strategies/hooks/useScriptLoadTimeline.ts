'use client'
import { useEffect, useState } from 'react'
import { SCRIPT_LOADED_EVENT, WORKER_TIMEOUT_MS } from '../types'
import type { ScriptLoadEvent } from '../types'

/**
 * 하이드레이션 완료 실측 시각(이 훅의 useEffect가 최초 실행되는 순간)과,
 * timing-script 라우트가 실제로 실행되며 dispatch하는 CustomEvent를 그대로 받아
 * 로드 이벤트 배열을 구성한다. 순서·값을 하드코딩하지 않고 브라우저가 보고한
 * 타임스탬프만 사용한다.
 */
export function useScriptLoadTimeline() {
  const [hydratedAt, setHydratedAt] = useState<number | null>(null)
  const [events, setEvents] = useState<ScriptLoadEvent[]>([])
  const [workerTimedOut, setWorkerTimedOut] = useState(false)

  useEffect(() => {
    // 이 useEffect가 처음 실행되는 순간 = 이 서브트리의 React 하이드레이션 커밋 직후.
    setHydratedAt(performance.now())
  }, [])

  useEffect(() => {
    function handleLoaded(event: Event) {
      const detail = (event as CustomEvent<ScriptLoadEvent>).detail
      if (!detail) return
      setEvents((prev) => (prev.some((e) => e.strategy === detail.strategy) ? prev : [...prev, detail]))
    }
    window.addEventListener(SCRIPT_LOADED_EVENT, handleLoaded as EventListener)
    return () => window.removeEventListener(SCRIPT_LOADED_EVENT, handleLoaded as EventListener)
  }, [])

  useEffect(() => {
    if (events.some((e) => e.strategy === 'worker')) return
    const timer = setTimeout(() => setWorkerTimedOut(true), WORKER_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [events])

  return { hydratedAt, events, workerTimedOut }
}
