import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'linking-and-navigating/router-prefetch/vip')

import React from 'react'

export default function VipPage() {
  return (
    <div className="space-y-3 rounded border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          VIP 전용 프라이빗 라운지 (URL: /router-prefetch/vip)
        </h3>
        <span className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          prefetch 없는 온디맨드 로드 라우트
        </span>
      </div>

      <div className="rounded border border-zinc-200 bg-white p-4 text-xs text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 space-y-2">
        <p className="leading-relaxed">
          이 페이지는 prefetch를 진행하지 않은 일반 라우트입니다. <code className="font-mono text-[11px]">router.push('/vip')</code> 실행 시점에 브라우저가 서버에 직접 RSC Payload를 요청하여 응답을 수신한 후 렌더링을 시작합니다.
        </p>
        <div className="text-[11px] text-zinc-500">
          * 특가 페이지(/deals)와 전환 시점의 네트워크 요청 차이를 개발자 도구의 Network 탭에서 비교할 수 있습니다.
        </div>
      </div>
    </div>
  )
}
