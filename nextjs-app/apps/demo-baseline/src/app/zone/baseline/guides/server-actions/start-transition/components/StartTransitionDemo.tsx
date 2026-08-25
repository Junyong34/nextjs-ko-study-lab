'use client'

import React, { useState, useTransition } from 'react'
import type { ServerFilterResult } from '../types'
import { filterCategoryProductsAction } from '../actions'

interface StartTransitionDemoProps {
  initialResult: ServerFilterResult
}

export function StartTransitionDemo({ initialResult }: StartTransitionDemoProps) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(initialResult.category)
  const [result, setResult] = useState<ServerFilterResult>(initialResult)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleChange = (cat: string) => {
    setSelected(cat)
    startTransition(async () => {
      const res = await filterCategoryProductsAction(cat)
      setResult(res)
    })
  }

  // 클라이언트 즉시 검색 필터 (논블로킹 타이핑 입증)
  const displayedProducts = result.products.filter((p) =>
    p.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* 1. 카테고리 탭 및 논블로킹 검색 입력 */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">카테고리 선택:</span>
          {isPending ? (
            <span className="font-mono font-bold text-blue-500 animate-pulse">
              서버 트랜지션 처리 중...
            </span>
          ) : (
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 서버 동기화 완료 ({result.serverLatencyMs}ms)
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {['전체', '전자기기', '의류', '도서'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChange(cat)}
              className={`rounded px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                selected === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 논블로킹 UI 실증 입력창 */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">논블로킹 입력 테스트:</span>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="트랜지션 진행 중에도 끊김 없이 타이핑 가능..."
              className="flex-1 rounded border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-900 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* 2. 서버 페칭 상품 결과 렌더링 그리드 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>서버 조회 결과: {displayedProducts.length}개 상품</span>
          <span className="font-mono">갱신 시각: {result.serverTimestamp}</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50/60 p-2.5 text-xs transition dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</div>
                <div className="text-[11px] text-zinc-500">
                  {product.category} • 재고 {product.stock}개
                </div>
              </div>
              <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {product.price.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
