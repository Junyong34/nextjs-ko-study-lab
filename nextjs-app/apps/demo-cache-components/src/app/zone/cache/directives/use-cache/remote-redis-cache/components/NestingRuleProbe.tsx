'use client'

import { useTransition } from 'react'
import { triggerNestingViolation } from '../actions'
import { useObservations } from './ObservationContext'

/**
 * "Remote caches cannot be nested inside private caches" / "Private caches cannot be
 * nested inside remote caches" (use-cache-remote.md, Nesting rules). 여기서는 실제로
 * 'use cache: remote' 함수 안에서 'use cache: private' 함수를 호출해 Next.js가 던지는
 * 에러를 그대로 화면에 보여준다 — 문서를 옮겨 적은 설명이 아니라 실행 결과다.
 */
export function NestingRuleProbe() {
  const { nestingResult: result, setNestingResult } = useObservations()
  const [isPending, startTransition] = useTransition()

  const run = () => {
    startTransition(async () => {
      setNestingResult(await triggerNestingViolation())
    })
  }

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-zinc-700 dark:text-zinc-300">
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[11px] dark:bg-zinc-800">
            'use cache: remote'
          </code>{' '}
          함수 안에서{' '}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[11px] dark:bg-zinc-800">
            'use cache: private'
          </code>{' '}
          함수를 호출한다 (nesting.ts)
        </div>
        <button
          type="button"
          onClick={run}
          disabled={isPending}
          className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-rose-700 disabled:opacity-50"
        >
          {isPending ? '실행 중...' : '실제로 실행해 에러 관측'}
        </button>
      </div>
      {result && (
        <div
          className={`rounded border p-2.5 font-mono text-[11px] leading-relaxed ${
            result.ok
              ? 'border-amber-300 bg-amber-50/60 text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300'
              : 'border-rose-300 bg-rose-50/60 text-rose-800 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300'
          }`}
        >
          {result.ok ? (
            <span>예상과 다르게 에러 없이 완료됨 (checkedAt {result.checkedAt})</span>
          ) : (
            <>
              <div>name: {result.name}</div>
              <div className="whitespace-pre-wrap">message: {result.message}</div>
              {result.digest && <div>digest: {result.digest}</div>}
              <div className="mt-1 text-zinc-500">checkedAt {result.checkedAt}</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
