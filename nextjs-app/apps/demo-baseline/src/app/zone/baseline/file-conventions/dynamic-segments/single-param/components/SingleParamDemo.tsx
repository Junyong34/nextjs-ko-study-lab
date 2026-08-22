'use client'
import React from 'react'
import Link from 'next/link'

const PRODUCTS = [
  {
    id: 'PROD-101',
    name: '에어 플라이트 러닝화',
    category: '러닝 / 신발',
    price: 139000,
    badge: '인기 상품',
  },
  {
    id: 'PROD-102',
    name: '울트라 라이트 윈드쉘 자켓',
    category: '아우터 / 스포츠',
    price: 179000,
    badge: '품절 임박',
  },
  {
    id: 'PROD-103',
    name: '테크 백팩 28L',
    category: '가방 / 액세서리',
    price: 115000,
    badge: '신상품',
  },
]

export function SingleParamDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/single-param'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 세그먼트 상품 카탈로그</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              items/[id] 디렉토리 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">각 상품 카드를 클릭하면 Next.js의 <code>items/[id]/page.tsx</code> 동적 라우트로 이동합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-blue-400 hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {prod.id}
                </span>
                <span className="text-[10px] text-blue-600 font-semibold dark:text-blue-400">
                  {prod.badge}
                </span>
              </div>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{prod.name}</h5>
              <p className="text-xs text-zinc-500">{prod.category}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {prod.price.toLocaleString()}원
              </span>
              <Link
                href={`${BASE_PATH}/items/${prod.id}`}
                className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                상세 보기 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
