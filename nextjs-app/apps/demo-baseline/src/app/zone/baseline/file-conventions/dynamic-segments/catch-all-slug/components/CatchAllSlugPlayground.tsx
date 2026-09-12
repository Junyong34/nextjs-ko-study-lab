'use client'
import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { CatchAllSlugDemo } from './CatchAllSlugDemo'
import { VerificationFooter } from './VerificationFooter'

interface ZeroSegmentProbeResult {
  status: number
  ok: boolean
}

/**
 * 실습화면(CatchAllSlugDemo)의 0단계 fetch 검증 결과를
 * 검증 패널(VerificationFooter)까지 공유하기 위한 클라이언트 조립 컴포넌트.
 */
export function CatchAllSlugPlayground() {
  const [zeroSegmentProbe, setZeroSegmentProbe] = useState<ZeroSegmentProbeResult | null>(null)

  return (
    <>
      <DemoPlaygroundCard title="[...slug] Catch-all 동적 세그먼트 실습">
        <CatchAllSlugDemo onProbeResult={setZeroSegmentProbe} />
      </DemoPlaygroundCard>
      <VerificationFooter zeroSegmentProbe={zeroSegmentProbe} />
    </>
  )
}
