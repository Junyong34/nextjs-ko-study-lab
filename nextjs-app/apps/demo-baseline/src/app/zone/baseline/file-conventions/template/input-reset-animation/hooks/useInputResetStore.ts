'use client'

import { useSyncExternalStore } from 'react'
import type { AnimationLogEntry, InputResetState } from '../types'

/**
 * template.tsx는 라우트 이동마다 실제로 언마운트·재마운트되므로 그 내부의 useState로는
 * "직전 인스턴스에서 어떤 값이 사라졌는가"를 다음 인스턴스로 넘길 수 없다. 모듈 스코프
 * store는 클라이언트 라우팅(같은 페이지 로드) 동안 유지되므로, 리마운트 자체는 그대로 두고
 * "리마운트 직전 DOM에 실제로 존재하던 값"과 "애니메이션 이벤트가 실제로 몇 번 발생했는가"만
 * 별도로 관측 기록한다.
 */
let state: InputResetState = {
  templateMountCount: 0,
  templateMountedAt: '',
  lastValueBeforeUnmount: '',
  animationLog: [],
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

function getServerSnapshot() {
  return state
}

export function recordTemplateMount() {
  state = {
    ...state,
    templateMountCount: state.templateMountCount + 1,
    templateMountedAt: new Date().toLocaleTimeString(),
  }
  emit()
}

/** template.tsx 언마운트 직전, 비제어 입력의 실제 DOM 값을 그대로 캡처한다. */
export function recordTemplateUnmount(observedValue: string) {
  state = { ...state, lastValueBeforeUnmount: observedValue }
  emit()
}

const MAX_LOG_ENTRIES = 6

/** 실제 native `animationstart`/`animationend` 이벤트가 발생했을 때만 호출된다. */
export function recordAnimationEvent(type: AnimationLogEntry['type']) {
  const entry: AnimationLogEntry = {
    type,
    mountNumber: state.templateMountCount,
    at: new Date().toLocaleTimeString(),
  }
  state = { ...state, animationLog: [...state.animationLog, entry].slice(-MAX_LOG_ENTRIES) }
  emit()
}

export function resetInputResetState() {
  state = {
    templateMountCount: 0,
    templateMountedAt: '',
    lastValueBeforeUnmount: '',
    animationLog: [],
  }
  emit()
}

export function useInputResetState(): InputResetState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
