import React from 'react'
import type { CartLineSnapshot } from '../types'

interface CartLineCardProps {
  line: CartLineSnapshot
  disabled: boolean
  onChange: (delta: number) => void
}

export function CartLineCard({ line, disabled, onChange }: CartLineCardProps) {
  const inSync = line.cached.qty === line.source.qty
  const btn =
    'h-7 w-7 cursor-pointer rounded border border-zinc-300 bg-white text-sm font-bold text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{line.name}</div>
          <div className="mt-0.5 font-mono text-[11px] text-zinc-500">수량 변경 후 {line.api}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" className={btn} disabled={disabled} onClick={() => onChange(-1)} aria-label="수량 1개 줄이기">
            −
          </button>
          <span className="w-6 text-center font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{line.cached.qty}</span>
          <button type="button" className={btn} disabled={disabled} onClick={() => onChange(1)} aria-label="수량 1개 늘리기">
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div className="rounded border border-blue-200 bg-blue-50/50 p-2 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="font-sans font-semibold text-blue-900 dark:text-blue-200">캐시 함수가 반환한 값</div>
          <div className="mt-1 text-zinc-800 dark:text-zinc-200">수량 {line.cached.qty}개</div>
          <div className="text-zinc-500">cacheId #{line.cached.cacheId}</div>
          <div className="text-zinc-500">생성 {line.cached.generatedAt}</div>
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="font-sans font-semibold text-zinc-800 dark:text-zinc-200">서버 메모리 원본</div>
          <div className="mt-1 text-zinc-800 dark:text-zinc-200">수량 {line.source.qty}개</div>
          <div className="text-zinc-500">변경 {line.source.updatedAt}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <code className="truncate text-[10px] text-zinc-500">{line.tag}</code>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            inSync
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {inSync ? '캐시 = 원본' : '캐시 ≠ 원본 (stale)'}
        </span>
      </div>
    </div>
  )
}
