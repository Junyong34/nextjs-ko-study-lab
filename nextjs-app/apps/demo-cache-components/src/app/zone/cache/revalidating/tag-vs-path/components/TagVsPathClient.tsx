'use client'

import React, { useTransition, useState } from 'react'
import {
  revalidateProductATag,
  revalidateProductBTag,
  revalidateEntirePath,
} from '../actions'

export function TagVsPathClient() {
  const [isPending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState('대기 중: 아래 무효화 버튼을 눌러보세요.')

  const handleRevalidateA = () => {
    startTransition(async () => {
      await revalidateProductATag()
      setStatusMessage('[확인] revalidateTag("tag-vs-path:product-a") 완료: A 상품 캐시만 선택 갱신됨')
    })
  }

  const handleRevalidateB = () => {
    startTransition(async () => {
      await revalidateProductBTag()
      setStatusMessage('[확인] revalidateTag("tag-vs-path:product-b") 완료: B 상품 캐시만 선택 갱신됨')
    })
  }

  const handleRevalidatePath = () => {
    startTransition(async () => {
      await revalidateEntirePath()
      setStatusMessage('[확인] revalidatePath() 완료: 페이지 전체 캐시(배너 + A 상품 + B 상품) 일괄 갱신됨')
    })
  }

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        온디맨드 캐시 무효화 컨트롤러:
      </div>

      <div className="flex flex-wrap gap-2.5">
        {/* 1. A 상품 태그 무효화 */}
        <button
          type="button"
          onClick={handleRevalidateA}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          <span>1. A 상품만 무효화</span>
          <span className="rounded bg-blue-800 px-1 py-0.2 font-mono text-[9px] text-blue-200">
            revalidateTag('product-a')
          </span>
        </button>

        {/* 2. B 상품 태그 무효화 */}
        <button
          type="button"
          onClick={handleRevalidateB}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          <span>2. B 상품만 무효화</span>
          <span className="rounded bg-emerald-800 px-1 py-0.2 font-mono text-[9px] text-emerald-200">
            revalidateTag('product-b')
          </span>
        </button>

        {/* 3. 경로 전체 무효화 */}
        <button
          type="button"
          onClick={handleRevalidatePath}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
        >
          <span>3. 경로 전체 일괄 무효화</span>
          <span className="rounded bg-rose-800 px-1 py-0.2 font-mono text-[9px] text-rose-200">
            revalidatePath()
          </span>
        </button>
      </div>

      <div className="font-mono text-[11px] text-zinc-500 pt-1">
        • 실행 상태: <span className="font-medium text-zinc-800 dark:text-zinc-200">{statusMessage}</span>
      </div>
    </div>
  )
}
