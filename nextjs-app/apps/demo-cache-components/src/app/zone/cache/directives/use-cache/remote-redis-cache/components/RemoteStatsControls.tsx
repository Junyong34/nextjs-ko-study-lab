'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { revalidateCategoryTags } from '../actions'
import { CATEGORIES, CURRENCIES, type Currency, type StatsCategory } from '../types'
import { useObservations } from './ObservationContext'

const chip = (active: boolean) =>
  `rounded px-2.5 py-1 font-medium transition ${
    active
      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
  }`

export function RemoteStatsControls({ category, currency }: { category: StatsCategory; currency: Currency }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRevalidating, setIsRevalidating] = useState(false)
  const { reset } = useObservations()

  const handleRevalidate = () => {
    setIsRevalidating(true)
    startTransition(async () => {
      await revalidateCategoryTags(category)
      router.refresh()
      setIsRevalidating(false)
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="space-y-1.5">
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="category 인자 선택">
          <span className="mr-1 w-20 font-semibold text-zinc-700 dark:text-zinc-300">category</span>
          {CATEGORIES.map((c) => (
            // prefetch가 캐시 함수를 미리 실행해 실행 횟수를 흐리지 않도록 끈다.
            <Link key={c.id} href={{ query: { category: c.id, currency } }} prefetch={false} scroll={false} className={chip(category === c.id)}>
              {c.label}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="currency 인자 선택">
          <span className="mr-1 w-20 font-semibold text-zinc-700 dark:text-zinc-300">currency</span>
          {CURRENCIES.map((cur) => (
            <Link key={cur} href={{ query: { category, currency: cur } }} prefetch={false} scroll={false} className={chip(currency === cur)}>
              {cur}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending && !isRevalidating ? '요청 중...' : '같은 인자로 다시 요청'}
        </button>
        <button
          type="button"
          onClick={handleRevalidate}
          disabled={isPending}
          className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 font-medium text-indigo-700 shadow-xs transition hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-800 dark:bg-zinc-900 dark:text-indigo-300"
        >
          {isRevalidating ? '무효화 중...' : `updateTag('...${category}')`}
        </button>
        <DemoResetButton label="관측 기록 초기화" onReset={reset} />
      </div>
    </div>
  )
}
