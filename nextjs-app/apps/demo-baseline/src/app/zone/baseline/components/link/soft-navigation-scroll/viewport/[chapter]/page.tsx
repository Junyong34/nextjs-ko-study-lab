import { notFound } from 'next/navigation'
import { CHAPTERS } from '../../types'

export const dynamicParams = false

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ chapter }))
}

const SECTIONS = [
  { id: 's-1', title: '도입' },
  { id: 's-2', title: '배경' },
  { id: 's-3', title: '본문 3' },
  { id: 's-4', title: '사례' },
  { id: 's-5', title: '결론' },
  { id: 's-6', title: '부록' },
]

/**
 * Page 세그먼트. 최상위 요소(data-scroll-page)가 Next.js가 scroll 판정에 쓰는 "첫 Page 엘리먼트"다.
 * 세 장 모두 같은 높이라 scroll={false} 이동에서 브라우저가 scrollY를 잘라내지(clamp) 않는다.
 */
export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  if (!CHAPTERS.includes(chapter as (typeof CHAPTERS)[number])) notFound()

  return (
    <article data-scroll-page data-chapter={chapter} className="space-y-3 pt-3">
      <h1 className="text-sm font-bold">
        {chapter}장 — Page 세그먼트의 첫 엘리먼트 (viewport/{chapter}/page.tsx)
      </h1>
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className="h-72 scroll-mt-48 rounded sm:scroll-mt-28 border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {chapter}-{i + 1}. {s.title} <code className="font-normal text-zinc-500">#{s.id}</code>
          </h2>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            section 높이 288px · scroll-margin-top = sticky 헤더 높이 보정(sm 이상 112px, 모바일 192px — 공식 문서 권장 방식)
          </p>
        </section>
      ))}
      {/* #s-5, #s-6도 문서 상단까지 올라갈 수 있도록 여유 공간을 둔다 */}
      <div className="h-[420px]" aria-hidden />
    </article>
  )
}
