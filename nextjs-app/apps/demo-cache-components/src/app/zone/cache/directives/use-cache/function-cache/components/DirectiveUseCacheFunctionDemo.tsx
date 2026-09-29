'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { refetchPopularRankingAction } from '../actions'
import type { PopularRankingResult } from '../cachedData'
import { VerificationFooter } from './VerificationFooter'

interface CallRecord {
  order: number
  cacheId: string
  generatedAt: string
}

export function DirectiveUseCacheFunctionDemo({ initial }: { initial: PopularRankingResult }) {
  const [current, setCurrent] = useState(initial)
  const [history, setHistory] = useState<CallRecord[]>([
    { order: 1, cacheId: initial.cacheId, generatedAt: initial.generatedAt },
  ])
  const [isPending, startTransition] = useTransition()

  const handleRefetch = () => {
    startTransition(async () => {
      const result = await refetchPopularRankingAction()
      setCurrent(result)
      setHistory((prev) => [
        ...prev,
        { order: prev.length + 1, cacheId: result.cacheId, generatedAt: result.generatedAt },
      ])
    })
  }

  const uniqueCacheIds = Array.from(new Set(history.map((h) => h.cacheId)))
  const isMatched = history.length > 1 ? uniqueCacheIds.length === 1 : undefined

  const expected =
    "cacheTag/cacheLife 없이 'use cache'만 선언해도, 같은 함수를 여러 번 호출하면 함수 본문이 재실행되지 않고 매번 같은 cacheId·생성 시각이 반환된다."
  const actual =
    history.length > 1
      ? `총 ${history.length}회 호출 — 관찰된 고유 cacheId: ${uniqueCacheIds
          .map((id) => `#${id}`)
          .join(', ')} (${uniqueCacheIds.length === 1 ? '전부 동일' : '서로 다름'})`
      : `1회 호출됨 (#${current.cacheId}). [함수 다시 호출하기]를 눌러 두 번째 호출 결과와 비교하세요.`

  return (
    <>
      <DemoPlaygroundCard title="getPopularProductRanking() — directives/use-cache/function-cache/cachedData.ts">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                async function getPopularProductRanking()
              </span>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                'use cache'만 선언 — cacheTag·cacheLife 없음
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefetch}
                disabled={isPending}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 cursor-pointer"
              >
                {isPending ? '호출 중...' : '함수 다시 호출하기'}
              </button>
              <DemoResetButton />
            </div>
          </div>

          <ol className="space-y-1.5">
            {current.ranking.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="w-5 shrink-0 font-mono font-bold text-zinc-400">{item.rank}</span>
                <span className="flex-1 px-2 font-medium text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </span>
                <span className="shrink-0 font-mono text-zinc-500 dark:text-zinc-400">
                  ★{item.rating} · 리뷰 {item.reviewCount}
                </span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-emerald-300 bg-emerald-50/60 p-3 text-xs dark:border-emerald-900 dark:bg-emerald-950/20">
            <span>
              현재 캐시 ID:{' '}
              <strong className="font-mono text-emerald-700 dark:text-emerald-300">
                #{current.cacheId}
              </strong>
            </span>
            <span>
              생성 시각: <strong className="font-mono">{current.generatedAt}</strong>
            </span>
          </div>

          <div className="overflow-hidden rounded border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-[11px]">
              <thead className="bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-2.5 py-1.5 text-left font-semibold">호출 순서</th>
                  <th className="px-2.5 py-1.5 text-left font-semibold">cacheId</th>
                  <th className="px-2.5 py-1.5 text-left font-semibold">생성 시각</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr
                    key={record.order}
                    className="border-t border-zinc-100 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    <td className="px-2.5 py-1.5">{record.order}번째 호출</td>
                    <td className="px-2.5 py-1.5 font-mono">#{record.cacheId}</td>
                    <td className="px-2.5 py-1.5 font-mono">{record.generatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        isMatched={isMatched}
        expected={expected}
        actual={actual}
        description="버튼을 누를 때마다 getPopularProductRanking()을 호출하는 Server Action이 다시 실행됩니다. cacheId가 계속 같다면 함수 본문이 재실행되지 않고 캐시된 반환값이 재사용된 것입니다."
      />
    </>
  )
}
