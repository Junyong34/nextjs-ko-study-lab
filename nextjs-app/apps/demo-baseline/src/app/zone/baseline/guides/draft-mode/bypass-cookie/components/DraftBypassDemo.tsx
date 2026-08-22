'use client'
import React, { useState } from 'react'

export function DraftBypassDemo() {
  const [isDraftMode, setIsDraftMode] = useState(false)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">VIP 시크릿 특가전 상품 상세</h4>
          <p className="text-xs text-zinc-500">draftMode().enable()로 정적 캐시를 우회하여 미공개 특가 초안 데이터를 즉시 검수합니다.</p>
        </div>
        <button
          onClick={() => setIsDraftMode(!isDraftMode)}
          className={`rounded px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer ${
            isDraftMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-800'
          }`}
        >
          {isDraftMode ? '초안 모드 끄기 (Live 모드 복귀)' : '초안 검수 모드 켜기 (draftMode)'}
        </button>
      </div>

      <div className="rounded border p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">프리미엄 노이즈 캔슬링 헤드폰</span>
            {isDraftMode ? (
              <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">DRAFT PREVIEW (우회 모드)</span>
            ) : (
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">LIVE 정적 캐시</span>
            )}
          </div>
          <span className="text-xs text-zinc-500">캐시 상태: {isDraftMode ? 'Bypassed (0ms 검수)' : 'Static HIT'}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {isDraftMode ? '₩249,000 (VIP 40% 특가 초안)' : '₩399,000 (정상 판매가)'}
          </span>
          {isDraftMode && <span className="text-xs text-red-500 font-bold">비공개 시크릿 할인 적용 중</span>}
        </div>
      </div>
    </div>
  )
}
