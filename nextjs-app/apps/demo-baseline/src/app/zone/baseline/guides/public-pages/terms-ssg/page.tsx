import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/public-pages/terms-ssg')

/**
 * 기본 경로. 4단 레이아웃은 layout.tsx가 그리고, 이 page는 약관 문서를 고르기 전 안내만 표시한다.
 * 런타임 API를 쓰지 않으므로 이 page 자체는 ○(Static)이다.
 */
export default function TermsSsgIndexPage() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      위 링크로 약관 문서를 열면 이 자리에 문서 본문과, 그 page가 서버에서 렌더링된 시각·렌더 ID가 표시됩니다. documents/
      아래 세 문서는 next build 때 만들어진 HTML이고, with-cookies/는 같은 문서를 요청마다 새로 렌더링합니다.
    </div>
  )
}
