'use client'

import { useSyncExternalStore } from 'react'
import type { RemountCounts } from '../types'

/**
 * layout.tsx / template.tsx는 React 트리상 서로 다른 위치(부모-자식 관계이지만
 * 검증 패널은 template.tsx보다 더 안쪽인 page.tsx에서 렌더링됨)에 있어 useState를
 * 그대로 끌어올릴 수 없다. 모듈 스코프 store는 클라이언트 라우팅(같은 페이지 로드) 동안
 * 유지되므로, "컴포넌트 인스턴스는 리마운트되어도 마운트 횟수 집계 자체는 실제로 누적된다"는
 * 사실을 useSyncExternalStore로 그대로 노출한다.
 */
let state: RemountCounts = {
  layoutMountCount: 0,
  layoutMountedAt: '',
  templateMountCount: 0,
  templateMountedAt: '',
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

export function recordLayoutMount() {
  state = {
    ...state,
    layoutMountCount: state.layoutMountCount + 1,
    layoutMountedAt: new Date().toLocaleTimeString(),
  }
  emit()
}

export function recordTemplateMount() {
  state = {
    ...state,
    templateMountCount: state.templateMountCount + 1,
    templateMountedAt: new Date().toLocaleTimeString(),
  }
  emit()
}

export function useRemountCounts(): RemountCounts {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
