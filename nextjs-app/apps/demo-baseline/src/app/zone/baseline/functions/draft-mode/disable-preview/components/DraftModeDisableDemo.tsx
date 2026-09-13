'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import type { RenderSnapshot, RenderLogEntry } from '../types'

interface DraftModeDisableDemoProps {
  initial: RenderSnapshot
}

let logIdCounter = 0

function toLogEntry(snapshot: RenderSnapshot): RenderLogEntry {
  logIdCounter += 1
  return {
    id: logIdCounter,
    requestedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    ...snapshot,
  }
}

export function DraftModeDisableDemo({ initial }: DraftModeDisableDemoProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [log, setLog] = useState<RenderLogEntry[]>(() => [toLogEntry(initial)])

  // draftMode 쿠키가 바뀌거나 "다시 요청"으로 서버 컴포넌트를 재실행할 때마다
  // page.tsx가 새로 계산/캐시 조회한 renderedAt이 이 prop으로 갱신된다.
  useEffect(() => {
    setLog((prev) => [toLogEntry(initial), ...prev].slice(0, 6))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  const runAndRefresh = (path: string) => {
    startTransition(async () => {
      await fetch(path, { method: 'POST', cache: 'no-store' })
      router.refresh()
    })
  }

  const handleRerender = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  const handleReset = async () => {
    await fetch(`${pathname}/disable`, { method: 'POST', cache: 'no-store' })
    setLog([])
    router.refresh()
  }

  return (
    <>
      <DemoPlaygroundCard title="draftMode().disable() 정적 캐시 모드 복귀 실습">
        <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              draftMode().isEnabled: {String(initial.isEnabled)} · __prerender_bypass 쿠키:{' '}
              {initial.hasBypassCookie ? '있음' : '없음'}
            </span>
            <DemoResetButton onReset={handleReset} label="예제 초기화" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => runAndRefresh(`${pathname}/enable`)}
              disabled={isPending}
              className="cursor-pointer rounded bg-purple-600 px-3.5 py-1.5 font-bold text-white disabled:opacity-50"
            >
              {isPending ? '전환 중...' : '0. 사전 준비: 초안 모드 켜기'}
            </button>
            <button
              type="button"
              onClick={() => runAndRefresh(`${pathname}/disable`)}
              disabled={isPending}
              className="cursor-pointer rounded bg-zinc-900 px-3.5 py-1.5 font-bold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {isPending ? '전환 중...' : 'draftMode().disable() 실행 (미리보기 닫기)'}
            </button>
            <button
              type="button"
              onClick={handleRerender}
              disabled={isPending}
              className="cursor-pointer rounded border border-zinc-400 px-3.5 py-1.5 font-bold text-zinc-800 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200"
            >
              {isPending ? '조회 중...' : '정적 캐시 렌더링 시각 다시 요청'}
            </button>
          </div>

          {log.length > 0 && (
            <ol className="divide-y divide-zinc-100 rounded border border-zinc-200 text-[11px] dark:divide-zinc-800 dark:border-zinc-800">
              {log.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                  <span className="font-mono text-zinc-500">{entry.requestedAt}</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{entry.renderedAt}</span>
                  <span className={entry.hasBypassCookie ? 'text-purple-600' : 'text-emerald-600'}>
                    {entry.hasBypassCookie ? '초안 모드(우회)' : '정적 캐시'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter log={log} />
    </>
  )
}
