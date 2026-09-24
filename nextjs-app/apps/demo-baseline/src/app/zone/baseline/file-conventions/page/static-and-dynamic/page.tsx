import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/page/static-and-dynamic')

/**
 * 기본 경로. 4단 레이아웃은 layout.tsx가 그리고, 이 page는 하위 page를 고르기 전 안내만 표시한다.
 * 이 page도 런타임 API를 쓰지 않으므로 그 자체로 ○(Static)이다.
 */
export default function StaticAndDynamicIndexPage() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      위 링크로 하위 page를 열면 이 자리에 해당 page가 서버에서 렌더링된 시각과 렌더 ID가 표시됩니다. 네 page의 차이는
      본문에서 호출하는 런타임 API 하나뿐입니다.
    </div>
  )
}
