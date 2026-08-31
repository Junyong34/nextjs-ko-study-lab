import Link from 'next/link'
import {
  PerspectiveBook,
  PerspectiveBookDescription,
  PerspectiveBookHeader,
  PerspectiveBookTitle,
  type BookTone,
} from '@study/ui'
import type { GuideBookItem } from '@/lib/guide-books'

interface DeepDiveGuidesSectionProps {
  guideBooks: GuideBookItem[]
}

const CATEGORY_BOOK_TONES: Record<GuideBookItem['category'], BookTone> = {
  All: 'sky',
  'Getting Started': 'sky',
  Guides: 'grove',
  'API Reference': 'violet',
  Architecture: 'rose',
}

export function DeepDiveGuidesSection({ guideBooks }: DeepDiveGuidesSectionProps) {
  return (
    <section id="deep-dive-guides" className="space-y-4 scroll-mt-20">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            더 깊이 파고들기
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            대표 데모와 함께 실무 가이드를 더 깊게 살펴보세요.
          </p>
        </div>
        <Link
          href="/demo?category=Guides"
          className="inline-flex w-fit items-center rounded-md text-sm font-semibold text-zinc-900 underline-offset-4 transition hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-100 dark:focus-visible:outline-zinc-100"
        >
          가이드 데모 전체 보기
        </Link>
      </div>

      <div className="overflow-x-auto pb-8 pt-2">
        <div className="mx-auto flex w-max min-w-full justify-center gap-5 px-4">
          {guideBooks.map((book) => (
            <Link
              key={book.guideUrl}
              href={book.guideUrl}
              className="group rounded-r-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
            >
              <PerspectiveBook
                tone={CATEGORY_BOOK_TONES[book.category]}
                trigger="group"
                width="11rem"
                illustration={<img src="/icon.svg" alt="" aria-hidden />}
              >
                <PerspectiveBookHeader>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {book.category} · 데모 {book.demoCount}개
                  </p>
                  <PerspectiveBookTitle className="mt-2">{book.guideTitle}</PerspectiveBookTitle>
                  <PerspectiveBookDescription className="text-zinc-700 dark:text-zinc-200">
                    {book.demoTitle}
                  </PerspectiveBookDescription>
                  <p className="mt-3 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    {book.demoPath}
                  </p>
                </PerspectiveBookHeader>
              </PerspectiveBook>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
