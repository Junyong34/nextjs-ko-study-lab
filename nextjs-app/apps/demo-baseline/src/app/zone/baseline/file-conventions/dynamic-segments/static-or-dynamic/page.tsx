import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/dynamic-segments/static-or-dynamic')

/** 기본 경로. 하위 라우트를 고르기 전 안내만 표시한다. 런타임 API를 쓰지 않는다. */
export default function StaticOrDynamicIndexPage() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      위 링크로 하위 라우트를 열면 이 자리에 서버 렌더 ID와 params.slug가 표시됩니다. 네 라우트의 차이는 generateStaticParams와
      headers() 호출 여부뿐입니다.
    </div>
  )
}
