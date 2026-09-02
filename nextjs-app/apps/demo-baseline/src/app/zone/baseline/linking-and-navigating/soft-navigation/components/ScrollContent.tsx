'use client'

import React from 'react'
import type { ProductItem } from '../types'

interface ScrollContentProps {
  title: string
  products: ProductItem[]
}

export function ScrollContent({ title, products }: ScrollContentProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {title} ({products.length}개 상품)
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            아래로 스크롤을 내린 상태에서 상단의 <strong>{'<Link scroll={false}>'}</strong>와 <strong>{'<Link>'}</strong>를 비교해 보세요.
          </p>
        </div>
        <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          세로 스크롤 목록 영역
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((p, idx) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition hover:border-zinc-300 hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {idx + 1}
                  </span>
                  {p.name}
                </span>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {p.categoryLabel}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {p.desc}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {p.price.toLocaleString()}원
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                무료배송
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 스크롤 하단 안내 배너 */}
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300">
          📍 스크롤 하단 영역에 도달했습니다!
        </p>
        <p className="mt-1">
          현재 위치에서 상단의 <strong>[베스트 상품 (scroll=false)]</strong>을 클릭하면 이 스크롤 위치가 그대로 유지되고,<br />
          <strong>[신상품 (기본 Link)]</strong>을 클릭하면 페이지 최상단으로 자동 스크롤 점프합니다.
        </p>
      </div>
    </div>
  )
}
