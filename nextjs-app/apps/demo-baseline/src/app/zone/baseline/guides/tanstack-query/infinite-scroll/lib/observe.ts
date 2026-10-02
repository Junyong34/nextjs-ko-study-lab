'use client'
import { useSyncExternalStore } from 'react'
import type { FetchRecord, LabAction, LabActionType, ObserveState } from '../types'

// 이 데모 전용 관찰 기록. 브라우저 탭 안의 모듈 상태라 목록 화면이 언마운트됐다가 다시 마운트돼도 유지된다.
// 전역 객체(window·fetch)는 건드리지 않는다.
const EMPTY: ObserveState = { fetches: [], actions: [], settledIds: [], resourceStarts: [] }
let state: ObserveState = EMPTY
let seq = 0
const listeners = new Set<() => void>()

function update(next: (s: ObserveState) => ObserveState) {
  state = next(state)
  listeners.forEach((l) => l())
}

export function useObserved(): ObserveState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
    () => EMPTY
  )
}

export function startFetch(cursor: string | null): number {
  const id = ++seq
  const rec: FetchRecord = { id, cursor, startedAt: performance.now(), endedAt: null, status: 'pending', pageNo: null, cursorHits: null }
  update((s) => ({ ...s, fetches: [...s.fetches, rec] }))
  return id
}

export function endFetch(id: number, patch: Partial<FetchRecord>) {
  update((s) => ({
    ...s,
    fetches: s.fetches.map((f) => (f.id === id ? { ...f, ...patch, endedAt: performance.now() } : f)),
  }))
}

/** at: 동작이 실제로 시작된 시각. 진입 기록은 effect보다 먼저 시작되는 첫 요청을 포함하도록 마운트(첫 렌더) 시각을 넘긴다. */
export function recordAction(type: LabActionType, extra: Omit<LabAction, 'id' | 'type' | 'startT'>, at = performance.now()): LabAction {
  const action: LabAction = { id: ++seq, type, startT: at, ...extra }
  update((s) => ({ ...s, actions: [...s.actions, action] }))
  return action
}

export function markSettled(id: number) {
  update((s) => ({ ...s, settledIds: [...s.settledIds, id] }))
}

export function resetObserved() {
  update(() => EMPTY)
}

// 브라우저가 실제로 보낸 상품 API 요청의 시작 시각(Resource Timing). 버퍼 한도(기본 250건)에
// 걸리지 않도록 getEntriesByType 대신 PerformanceObserver로 받는다. 구독만 할 뿐 전역 설정은 바꾸지 않는다.
if (typeof window !== 'undefined' && typeof PerformanceObserver !== 'undefined') {
  new PerformanceObserver((list) => {
    const starts = list.getEntries().filter((e) => e.name.includes('/infinite-scroll/api/products')).map((e) => e.startTime)
    if (starts.length) update((s) => ({ ...s, resourceStarts: [...s.resourceStarts, ...starts] }))
  }).observe({ type: 'resource', buffered: true })
}

/** since 이후 시작해 Resource Timing에 기록된 상품 API 요청 수 */
export function countResourceEntries(obs: ObserveState, since: number): number {
  return obs.resourceStarts.filter((t) => t >= since).length
}
