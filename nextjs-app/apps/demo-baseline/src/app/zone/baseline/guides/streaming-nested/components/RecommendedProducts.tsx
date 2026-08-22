import React from 'react'
import type { Product } from '../types'

async function getRecommendedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return [
    { id: 'rec-1', name: '알루미늄 팜레스트 손목 받침대', price: 29000, category: '액세서리' },
    { id: 'rec-2', name: 'USB-C 코일형 항공 케이블', price: 35000, category: '케이블' },
    { id: 'rec-3', name: '키캡 풀러 & 스위치 윤활 키트', price: 18000, category: '툴' },
  ]
}

export async function RecommendedProducts() {
  const products = await getRecommendedProducts()

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          함께 구매하면 좋은 추천 상품
        </h4>
        <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          600ms Suspense 청크
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="text-[10px] font-medium text-zinc-400 font-mono">
              {item.category}
            </div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {item.name}
            </div>
            <div className="mt-1 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {item.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
