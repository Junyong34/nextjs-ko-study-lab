import React from 'react'
import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'config/stale-times/router-cache-tuning')

/** 시작 화면. 측정은 layout의 <Link>로 static/dynamic page를 오가며 한다. */
export default function StaleTimesStartPage() {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 p-4 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      시작 화면입니다. 위의 &lt;Link&gt;로 정적 page와 동적 page를 번갈아 여러 번 이동하세요. 같은 page로 돌아갈 때 RSC 요청이
      다시 나가는지, 렌더 ID가 그대로인지가 아래 표에 기록됩니다.
    </section>
  )
}
