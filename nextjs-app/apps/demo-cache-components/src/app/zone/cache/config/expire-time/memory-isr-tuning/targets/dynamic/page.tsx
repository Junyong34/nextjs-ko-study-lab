import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { TargetFrame } from '../TargetFrame'

export const metadata: Metadata = { title: 'expireTime 측정 대상: 동적 렌더링', robots: { index: false } }

async function RequestTimeStamp() {
  // 요청마다 렌더링한다. 캐시 수명이 없으므로 expireTime이 끼어들 자리가 없다.
  await connection()
  return <TargetFrame title="connection() 대상 라우트" stampLabel="요청 처리 시각" stamp={Date.now()} />
}

export default function DynamicTarget() {
  return (
    <Suspense fallback={<p className="p-6 text-sm">요청 시점 렌더링 중…</p>}>
      <RequestTimeStamp />
    </Suspense>
  )
}
