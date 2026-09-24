'use client'

import { useSyncExternalStore } from 'react'
import type { EventScope, SdkEvent, SdkEventKind } from '../types'

/**
 * 모듈 스코프 이벤트 로그.
 * next/script의 내부 LoadCache/ScriptCache도 모듈 스코프라서 "소프트 내비게이션 동안 유지, 새로고침 시 초기화"라는
 * 같은 수명을 가진다. 그래서 컴포넌트가 언마운트·재마운트되어도 콜백 호출 이력이 실제로 누적된 그대로 보인다.
 */
const EMPTY: SdkEvent[] = []
let events: SdkEvent[] = EMPTY
let mountCount = 0
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return events
}

function getServerSnapshot() {
  return EMPTY
}

export function isSdkPresent() {
  return typeof window !== 'undefined' && typeof window.DemoPay !== 'undefined'
}

export function recordEvent(
  kind: SdkEventKind,
  scope: EventScope,
  detail: string,
  extra: { ok?: boolean } = {},
) {
  const entry: SdkEvent = {
    seq: events.length + 1,
    kind,
    scope,
    at: performance.now(),
    sdkPresent: isSdkPresent(),
    execCount: window.DemoPay?.executionCount ?? null,
    mountNo: mountCount,
    detail,
    ...extra,
  }
  events = [...events, entry]
  listeners.forEach((l) => l())
}

/** SDK 호스트 컴포넌트 인스턴스가 실제로 마운트될 때 1회 호출된다. */
export function recordMount(detail: string) {
  mountCount += 1
  recordEvent('mount', 'main', detail)
}

export function useSdkEventLog(): SdkEvent[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** 실제 브라우저 Resource Timing에서 해당 스크립트 응답의 HTTP status를 읽는다(Chromium 109+). */
export function readResponseStatus(src: string): number | null {
  const url = new URL(src, window.location.href).href
  const entries = performance.getEntriesByName(url) as PerformanceResourceTiming[]
  const last = entries[entries.length - 1]
  return last && typeof last.responseStatus === 'number' && last.responseStatus > 0 ? last.responseStatus : null
}

/** window.DemoPay.init()을 그대로 호출하고, 실패하면 실제로 던져진 에러 메시지를 돌려준다. */
export function tryInitDemoPay(clientKey: string) {
  try {
    const instance = window.DemoPay!.init({ clientKey })
    return { ok: true as const, instance, message: `instanceId=${instance.instanceId} 생성` }
  } catch (err) {
    const e = err as Error
    return { ok: false as const, instance: null, message: `${e.name}: ${e.message}` }
  }
}
