'use client'

import { useSyncExternalStore } from 'react'
import { PROBE_EVENT, probeSrc } from '../types'
import type { ProbeName, ProbeRun, ProbeStore } from '../types'

/**
 * window.__strategyOrder를 그대로 구독한다. 이 객체는 프로브 스크립트와 이 파일의 update()만
 * 불변 방식으로 교체하므로, 참조 비교만으로 변경을 감지할 수 있다.
 * window 전역이라 소프트 내비게이션 동안 유지되고 새로고침하면 초기화된다(next/script의 LoadCache와 같은 수명).
 */
function emptyStore(): ProbeStore {
  return { runs: [], hydratedAt: null, loadAt: null, visits: [], slotMounts: 0 }
}

function subscribe(listener: () => void) {
  window.addEventListener(PROBE_EVENT, listener)
  return () => window.removeEventListener(PROBE_EVENT, listener)
}

function getSnapshot(): ProbeStore | null {
  return window.__strategyOrder ?? null
}

function getServerSnapshot(): ProbeStore | null {
  return null
}

/** 스토어의 일부 필드를 불변 방식으로 교체하고 구독자에게 알린다. */
export function updateProbeStore(patch: (s: ProbeStore) => Partial<ProbeStore>) {
  const current = window.__strategyOrder ?? emptyStore()
  window.__strategyOrder = { ...current, ...patch(current) }
  window.dispatchEvent(new CustomEvent(PROBE_EVENT))
}

/** 서버 렌더·하이드레이션 중에는 null, 이후에는 실측 스토어를 돌려준다. */
export function useProbeStore(): ProbeStore | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function runsOf(store: ProbeStore | null, name: ProbeName): ProbeRun[] {
  return store ? store.runs.filter((r) => r.name === name) : []
}

/**
 * 브라우저 Resource Timing에 실제로 기록된, 해당 프로브 URL에 대한 네트워크 요청 수.
 * (preload와 <script> 실행이 같은 응답을 재사용하면 1건으로 남는다)
 */
export function requestCount(name: ProbeName, delayMs = 0): number {
  if (typeof window === 'undefined') return 0
  const url = new URL(probeSrc(name, delayMs), window.location.href).href
  return performance.getEntriesByName(url, 'resource').length
}
