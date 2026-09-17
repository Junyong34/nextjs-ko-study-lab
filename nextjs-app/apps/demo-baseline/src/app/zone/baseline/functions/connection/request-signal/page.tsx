import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/connection/request-signal')

import React from 'react'

export default function OverviewPage() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      <p className="font-bold text-zinc-900 dark:text-zinc-100">개요 — 기본 경로</p>
      <p>
        위 탭에서 [정적 브랜치 (미사용)]과 [connection() 브랜치]로 이동해, 같은 재고 위젯이 실제로 서로 다르게
        렌더링되는 과정을 비교합니다. 두 라우트 모두 이 디렉토리 안의 실제 page.tsx 파일이며, 어느 쪽도
        하드코딩된 값을 흉내 내지 않습니다.
      </p>
    </div>
  )
}
