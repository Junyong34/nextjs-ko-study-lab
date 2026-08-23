'use client'

import React from 'react'
import type { ProductItem } from '../types'

interface ScrollContentProps {
  title: string
  products: ProductItem[]
}

export function ScrollContent({ title, products }: ScrollContentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          {title} ({products.length}개)
        </h3>
        <span className="text-[11px] text-zinc-400">
          스크롤을 아래로 내린 뒤 상단의 {'<'}Link scroll={'{'}false{'}'}{'>'} 버튼을 클릭해 보세요.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </span>
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {p.categoryLabel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">{p.desc}</p>
            </div>
            <div className="mt-2.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {p.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
