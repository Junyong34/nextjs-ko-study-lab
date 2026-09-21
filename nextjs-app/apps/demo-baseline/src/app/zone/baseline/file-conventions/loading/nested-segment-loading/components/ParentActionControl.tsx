'use client'

import React, { useState } from 'react'
import { useLoadingObservation } from './LoadingObservation'

/**
 * catalog/[run]/layout.tsx 안에서 렌더링되는 상시 인터랙션 버튼이다.
 * 이 레이아웃은 catalog/[run]/[product]/loading.tsx의 Suspense 경계보다 바깥에 있으므로,
 * 하위 상품 상세가 fallback을 보이는 동안에도 이 버튼은 계속 클릭 가능하다.
 */
export function ParentActionControl({ runId }: { runId: string }) {
  const { markParentAction } = useLoadingObservation()
  const [clicks, setClicks] = useState(0)

  const handleClick = () => {
    setClicks((count) => count + 1)
    markParentAction(runId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95"
    >
      상위 조작 (클릭 {clicks}회) — 하위 fallback 중에도 눌러보세요
    </button>
  )
}
