import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/instrumentation/client-timing-metrics/station-b'
)

import React from 'react'
import { InstrumentationClientTimingDemo } from '../components/InstrumentationClientTimingDemo'

export default function StationBPage() {
  return (
    <div className="w-full space-y-3.5 bg-white p-4 sm:p-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div>
        <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">상세 리포트 (/station-b)</h5>
        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          실제 서브 라우트 page.tsx다. 이 페이지로의 이동도 instrumentation-client.ts의
          onRouterTransitionStart를 실제로 트리거한다.
        </p>
      </div>
      <InstrumentationClientTimingDemo station="report" />
    </div>
  )
}
