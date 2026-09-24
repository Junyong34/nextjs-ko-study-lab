'use client'

import { useSyncExternalStore } from 'react'
import type { NavMeasurement } from '../types'

// 클라이언트 모듈 전역 상태: soft navigation(목록 → 목적지 → 목록) 동안에도 JS 모듈은 그대로라
// 클릭 시각과 측정 결과가 유지된다. 전체 새로고침하면 초기화된다.
let pending: { id: string; clickAt: number; loadingAt: number | null } | null = null
let results: NavMeasurement[] = []
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

/** 링크 onClick에서 호출 — performance.now() 기준 클릭 시각을 기록한다. */
export function markClick(id: string) {
  pending = { id, clickAt: performance.now(), loadingAt: null }
}

/** 목적지 loading.tsx가 실제로 마운트될 때 호출 */
export function markLoading(id: string) {
  if (pending?.id === id && pending.loadingAt === null) pending.loadingAt = performance.now()
}

/** 목적지 page.tsx 본문이 마운트될 때 호출 — 이번 이동의 측정값을 확정한다. */
export function markContent(id: string): NavMeasurement | null {
  if (pending?.id !== id) return null
  const measurement: NavMeasurement = { ...pending, contentAt: performance.now() }
  pending = null
  results = [...results, measurement]
  emit()
  return measurement
}

export function latestFor(id: string): NavMeasurement | null {
  for (let i = results.length - 1; i >= 0; i -= 1) if (results[i].id === id) return results[i]
  return null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
const EMPTY: NavMeasurement[] = []
export function useMeasurements(): NavMeasurement[] {
  return useSyncExternalStore(subscribe, () => results, () => EMPTY)
}
