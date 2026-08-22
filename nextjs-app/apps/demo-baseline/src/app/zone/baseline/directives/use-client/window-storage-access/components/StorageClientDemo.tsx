'use client'
import React, { useState, useEffect } from 'react'
import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export function StorageClientDemo() {
  const [recentViewed, setRecentViewed] = useState<Product[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('demo_recent_products')
      if (saved) {
        setRecentViewed(JSON.parse(saved))
      }
    } catch {
      // ignore SSR
    }
  }, [])

  const addRecent = (product: Product) => {
    const next = [product, ...recentViewed.filter(p => p.id !== product.id)].slice(0, 4)
    setRecentViewed(next)
    try {
      localStorage.setItem('demo_recent_products', JSON.stringify(next))
    } catch {}
  }

  const clearStorage = () => {
    setRecentViewed([])
    try {
      localStorage.removeItem('demo_recent_products')
    } catch {}
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">최근 본 상품 (브라우저 localStorage 동기화)</h4>
        <button
          type="button"
          onClick={clearStorage}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          기록 비우기
        </button>
      </div>

      <div className="space-y-1.5">
        <span className="text-zinc-500 font-medium">상품 클릭하여 최근 본 목록에 추가:</span>
        <div className="flex flex-wrap gap-2">
          {MOCK_PRODUCTS.slice(0, 4).map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => addRecent(p)}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 transition cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
          저장된 최근 본 상품 목록 ({recentViewed.length}개):
        </div>
        {recentViewed.length === 0 ? (
          <div className="text-zinc-400">최근 본 상품이 없습니다. 위 상품을 클릭해보세요.</div>
        ) : (
          <div className="space-y-1">
            {recentViewed.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                <span>{idx + 1}. {item.name} ({item.categoryName})</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
