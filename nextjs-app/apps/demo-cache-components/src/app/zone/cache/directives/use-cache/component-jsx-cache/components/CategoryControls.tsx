'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { RANKING_CATEGORIES, type RankingCategory } from '../types'
import { useObservations } from './ObservationContext'

export function CategoryControls({ current }: { current: RankingCategory }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { reset } = useObservations()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <nav className="flex flex-wrap items-center gap-1.5" aria-label="category prop 선택">
        <span className="mr-1 font-semibold text-zinc-700 dark:text-zinc-300">category prop</span>
        {RANKING_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={{ query: { category: c.id } }}
            // 자동 prefetch가 캐시 컴포넌트를 미리 실행해 실행 횟수를 흐리지 않도록 끈다.
            prefetch={false}
            scroll={false}
            className={`rounded px-2.5 py-1 font-medium transition ${
              current === c.id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? '요청 중...' : '같은 prop으로 다시 요청 (router.refresh)'}
        </button>
        <DemoResetButton label="관측 기록 초기화" onReset={reset} />
      </div>
    </div>
  )
}
