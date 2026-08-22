'use client'

import React from 'react'
import Link from 'next/link'

export default function SegmentErrorHomePage() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          주문 상품 내역
        </h4>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          총 2개 품목
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
        <div className="flex justify-between">
          <span>• 에어 줌 프로 러닝화 (270mm)</span>
          <span className="font-mono">159,000원</span>
        </div>
        <div className="flex justify-between">
          <span>• 오버핏 기모 맨투맨 (L, 블랙)</span>
          <span className="font-mono">49,000원</span>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Link
          href="/zone/baseline/error-handling/segment-error/payment"
          className="inline-flex items-center gap-1.5 rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          <span>최종 결제 단계로 이동 (/payment) →</span>
        </Link>
      </div>
    </div>
  )
}
