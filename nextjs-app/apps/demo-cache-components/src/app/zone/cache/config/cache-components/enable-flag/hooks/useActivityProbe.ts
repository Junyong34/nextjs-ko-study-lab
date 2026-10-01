'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ActivityReturn } from '../types'
import { clearAwayObservation, readAwayObservation } from '../lib/activityStore'

function newInstanceId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

/**
 * 실습 화면 쪽 Activity 관측.
 * - instanceId·draft는 컴포넌트 state다. 라우트를 떠났다 돌아왔을 때 값이 같으면
 *   컴포넌트가 언마운트되지 않고 숨겨져 있었다는 뜻이다.
 * - Activity가 숨김 → 표시로 바뀌면 이펙트가 다시 실행되므로, 그때 away 페이지가 남긴 관측값을 읽는다.
 */
export function useActivityProbe() {
  // 렌더 중 Math.random()은 정적 셸 prerender에서 오류가 나므로 마운트 이후에 만든다
  const [instanceId, setInstanceId] = useState('')
  const [draft, setDraft] = useState('')
  const [returns, setReturns] = useState<ActivityReturn[]>([])
  const lastSeq = useRef(0)
  // 이펙트가 다시 실행될 때 최신 state를 읽기 위한 ref (deps가 []라 클로저 값은 첫 렌더 값이다)
  const instanceRef = useRef('')
  const draftRef = useRef('')
  draftRef.current = draft

  useEffect(() => {
    const id = instanceRef.current || newInstanceId()
    instanceRef.current = id
    setInstanceId(id)
    const obs = readAwayObservation()
    // StrictMode의 이펙트 이중 실행에도 같은 관측을 두 번 세지 않도록 seq로 거른다
    if (obs && obs.seq !== lastSeq.current) {
      lastSeq.current = obs.seq
      // 복귀 "순간"의 state를 함께 기록한다 — 이후 입력을 고쳐도 판정이 바뀌지 않는다
      const record = { obs, instanceAtReturn: id, draftAtReturn: draftRef.current }
      setReturns((prev) => [...prev, record].slice(-4))
    }
  }, [])

  const reset = useCallback(() => {
    clearAwayObservation()
    instanceRef.current = newInstanceId()
    setInstanceId(instanceRef.current)
    setDraft('')
    setReturns([])
  }, [])

  return { instanceId, draft, setDraft, latestReturn: returns.at(-1) ?? null, returnCount: returns.length, reset }
}
