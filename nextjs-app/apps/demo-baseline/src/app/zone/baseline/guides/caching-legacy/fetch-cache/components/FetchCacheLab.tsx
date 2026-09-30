'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { FetchCacheDemo } from './FetchCacheDemo'
import { VerificationFooter } from './VerificationFooter'
import { useFetchCacheDemo } from '../hooks/useFetchCacheDemo'

export function FetchCacheLab() {
  const { calls, pending, probe, invalidate, reset } = useFetchCacheDemo()
  return (
    <>
      <DemoPlaygroundCard title="fetch 캐시 옵션별 원본 호출 횟수 관찰 (api/source)">
        <FetchCacheDemo calls={calls} pending={pending} onProbe={probe} onInvalidate={invalidate} onReset={reset} />
      </DemoPlaygroundCard>
      <VerificationFooter calls={calls} />
    </>
  )
}
