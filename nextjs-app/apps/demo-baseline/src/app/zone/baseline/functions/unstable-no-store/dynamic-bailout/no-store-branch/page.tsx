import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/unstable-no-store/dynamic-bailout/no-store-branch',
)

import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { ParticipantProbeCard } from '../components/ParticipantProbeCard'
import { rollLiveParticipantCount } from '../types'

export default function NoStoreBranchPage() {
  noStore() // 이 호출 지점에서 정적 prerender를 명시적으로 옵트아웃 — 이후 코드는 매 요청 실행된다
  const participants = rollLiveParticipantCount()
  const renderedAt = new Date().toISOString()

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        이 브랜치는 컴포넌트 최상단에서 noStore()를 호출해 정적 캐시를 명시적으로 차단한다.
      </p>
      <ParticipantProbeCard mode="no-store" participants={participants} renderedAt={renderedAt} />
    </div>
  )
}
