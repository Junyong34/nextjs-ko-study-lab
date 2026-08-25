'use client'

import React, { useState, useTransition } from 'react'
import type { ScopeRevalidateResult } from '../types'
import { executeScopeRevalidateAction } from '../actions'

export function RevalidatePathScopeDemo() {
  const [result, setResult] = useState<ScopeRevalidateResult | null>(null)
  const [scope, setScope] = useState<'page' | 'layout'>('page')
  const [isPending, startTransition] = useTransition()

  const handleRun = (targetScope: 'page' | 'layout') => {
    setScope(targetScope)
    startTransition(async () => {
      const res = await executeScopeRevalidateAction(targetScope)
      setResult(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 스코프 선택 버튼 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleRun('page')}
            disabled={isPending}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              scope === 'page'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            revalidatePath('/shop', 'page')
          </button>
          <button
            type="button"
            onClick={() => handleRun('layout')}
            disabled={isPending}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              scope === 'layout'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            revalidatePath('/shop', 'layout')
          </button>
        </div>

        <span className="text-xs font-mono text-zinc-500">
          {isPending ? '무효화 파이프라인 실행 중...' : result ? `퍼지된 라우트: ${result.purgedCount}개` : '옵션을 선택하세요'}
        </span>
      </div>

      {/* 2. 라우트 트리 무효화 범위 매트릭스 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2.5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            라우트 트리 세그먼트별 캐시 무효화 결과 대조
          </span>
          <span className="text-[11px] text-zinc-400">
            현재 스코프: <strong>'{scope}'</strong>
          </span>
        </div>

        <div className="space-y-1.5">
          {(result?.segments || [
            { path: '/shop', label: '메인 쇼핑몰 허브 (루트 페이지)', status: 'PURGED' },
            { path: '/shop/items/101', label: '상품 상세 (나이키 러닝화)', status: 'PRESERVED' },
            { path: '/shop/category/shoes', label: '신발 카테고리 피드', status: 'PRESERVED' },
            { path: '/shop/category/clothing', label: '의류 카테고리 피드', status: 'PRESERVED' },
            { path: '/account/profile', label: '사용자 프로필 (다른 레이아웃)', status: 'PRESERVED' },
          ]).map((seg, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded p-2.5 border transition ${
                seg.status === 'PURGED'
                  ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'border-zinc-100 bg-zinc-50/60 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-500'
              }`}
            >
              <div>
                <span className="font-bold">{seg.path}</span>
                <span className="ml-2 text-[11px] font-sans">({seg.label})</span>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  seg.status === 'PURGED'
                    ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {seg.status === 'PURGED' ? 'PURGED (캐시 재생성)' : 'PRESERVED (캐시 유지)'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
