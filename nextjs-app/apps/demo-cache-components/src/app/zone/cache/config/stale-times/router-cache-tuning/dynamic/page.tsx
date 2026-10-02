import React, { Suspense } from 'react'
import { StampCard } from '../components/StampCard'
import { getRequestStamp } from '../lib/stamps'

/** 측정 대상 동적 page. 요청 시점 값은 Suspense 안에서만 만들 수 있다(cacheComponents 규칙). */
export default function StaleTimesDynamicPage() {
  return (
    <Suspense fallback={<p className="text-xs text-zinc-500">동적 page 렌더 대기 중…</p>}>
      <DynamicStamp />
    </Suspense>
  )
}

async function DynamicStamp() {
  const stamp = await getRequestStamp()
  return <StampCard route="dynamic" stamp={stamp} />
}
