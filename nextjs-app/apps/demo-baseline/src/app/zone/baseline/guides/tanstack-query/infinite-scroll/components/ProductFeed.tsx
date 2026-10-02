'use client'
import React, { useEffect, useRef } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { BURST_CALLS, useProductFeed } from '../hooks/useProductFeed'

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

export function ProductFeed() {
  const { q, pages, loadNextFromSentinel, burst, reset } = useProductFeed()
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onVisible = useRef(loadNextFromSentinel)
  useEffect(() => {
    onVisible.current = loadNextFromSentinel
  })

  // 스크롤 영역 바닥의 센티널이 보이면 다음 페이지를 요청한다.
  // hasNextPage·isFetchingNextPage가 바뀔 때 다시 관찰해, 받아 온 뒤에도 센티널이 보이면 이어서 요청한다.
  useEffect(() => {
    const root = rootRef.current
    const target = sentinelRef.current
    if (!root || !target) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) onVisible.current()
    }, { root })
    io.observe(target)
    return () => io.disconnect()
  }, [q.hasNextPage, q.isFetchingNextPage, q.status])

  const items = q.data?.pages.flatMap((p) => p.items) ?? []
  const total = q.data?.pages[0]?.total

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button className={btn} disabled={!q.hasNextPage || q.isFetching} onClick={() => burst(true)}>
          fetchNextPage() {BURST_CALLS}번 연속 (기본값)
        </button>
        <button className={btn} disabled={!q.hasNextPage || q.isFetching} onClick={() => burst(false)}>
          {`fetchNextPage({ cancelRefetch: false })`} {BURST_CALLS}번 연속
        </button>
        <DemoResetButton onReset={reset} />
      </div>
      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <span>
          불러온 상품 {items.length}{total ? ` / ${total}` : ''}개 · 페이지 {pages}개
        </span>
        <span className="font-mono">
          hasNextPage={String(q.hasNextPage)} · isFetchingNextPage={String(q.isFetchingNextPage)}
        </span>
      </div>
      <div ref={rootRef} className="h-72 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        {q.isPending && <p className="p-4 text-xs text-zinc-500">첫 페이지를 불러오는 중...</p>}
        {q.isError && <p className="p-4 text-xs text-rose-600">불러오지 못했습니다: {q.error.message}</p>}
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-3 py-3.5 text-sm">
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{p.name}</div>
                <div className="text-[11px] text-zinc-500">
                  {p.category} · {p.id}
                </div>
              </div>
              <span className="font-mono text-xs font-bold">{won(p.price)}</span>
            </li>
          ))}
        </ul>
        <div ref={sentinelRef} className="px-3 py-3 text-center text-[11px] text-zinc-500">
          {q.isFetchingNextPage ? '다음 페이지를 불러오는 중...' : q.hasNextPage ? '아래로 스크롤하면 다음 페이지를 불러옵니다' : q.data ? '마지막 상품입니다' : ''}
        </div>
      </div>
    </div>
  )
}
