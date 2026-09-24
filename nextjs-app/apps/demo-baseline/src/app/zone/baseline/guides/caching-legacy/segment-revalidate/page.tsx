import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/caching-legacy/segment-revalidate')

/**
 * 기본 경로. 4단 레이아웃은 layout.tsx가 그리고, 이 page는 하위 page를 고르기 전 안내만 표시한다.
 * 실측 대상은 isr-10s/와 static/ 두 하위 page이며, 이 page 자체는 revalidate를 선언하지 않는다.
 */
export default function SegmentRevalidateIndexPage() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      위 링크로 하위 page를 열면 이 자리에 그 page가 서버에서 렌더링된 시각과 렌더 ID가 표시됩니다. 두 page의 차이는{' '}
      <code>export const revalidate = 10</code> 한 줄뿐입니다. 시간에 따른 변화는 아래 [자동 관측]으로 기록하세요.
    </div>
  )
}
