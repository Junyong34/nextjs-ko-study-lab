'use client'

import React, { useState, useTransition } from 'react'
import type { InventoryTagPurgeResult } from '../types'
import { purgeInventoryTagAction } from '../actions'

export function RevalidateTagBasicDemo() {
  const [result, setResult] = useState<InventoryTagPurgeResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handlePurge = () => {
    startTransition(async () => {
      const res = await purgeInventoryTagAction()
      setResult(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 태그 정보 및 무효화 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">무효화 대상 태그:</span>
          <code className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            #{result ? `${result.tag} (revalidateTag 호출됨)` : 'inventory'}
          </code>
          {result && (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {result.versionId}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handlePurge}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {isPending ? '태그 퍼지 중...' : "revalidateTag('inventory') 실행"}
        </button>
      </div>

      {/* 2. 재고 캐시 테이블 뷰어 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2.5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            재고 캐시 슬롯 (Tag: <code>'inventory'</code>)
          </span>
          <span className="text-[11px] text-zinc-400">
            {result ? `동기화 시각: ${result.timestamp}` : '초기 캐시 유지 중'}
          </span>
        </div>

        <div className="space-y-2">
          {(result?.items || [
            { sku: 'SKU-HD01', name: '노이즈캔슬링 무선 헤드폰', stock: 8, location: '물류센터 A (김포)', lastSync: '초기 로드' },
            { sku: 'SKU-MS02', name: 'RGB 초경량 게이밍 마우스', stock: 24, location: '물류센터 B (이천)', lastSync: '초기 로드' },
          ]).map((item) => (
            <div
              key={item.sku}
              className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  {item.sku} • {item.location}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  재고 {item.stock}개
                </span>
                <div className="text-[10px] text-zinc-400 mt-0.5">{item.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
