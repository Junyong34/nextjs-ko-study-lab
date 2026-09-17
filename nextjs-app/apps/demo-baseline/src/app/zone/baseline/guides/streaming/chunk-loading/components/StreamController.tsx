'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VerificationFooter } from './VerificationFooter'

export interface StreamControllerProps {
  renderedAt: string
  children: React.ReactNode
}

export function StreamController({ renderedAt, children }: StreamControllerProps) {
  const router = useRouter()
  const lastRenderedAt = useRef(renderedAt)
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    if (renderedAt !== lastRenderedAt.current) {
      lastRenderedAt.current = renderedAt
      setRefreshCount(c => c + 1)
    }
  }, [renderedAt])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">이번 렌더 시작 시각: {renderedAt}</span>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          스트리밍 다시 재생
        </button>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">{children}</div>
      <VerificationFooter refreshCount={refreshCount} />
    </div>
  )
}
