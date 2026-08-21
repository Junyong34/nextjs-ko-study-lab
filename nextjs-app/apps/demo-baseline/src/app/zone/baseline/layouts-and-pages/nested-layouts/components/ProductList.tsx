'use client'

import React from 'react'
import { useSearch } from './SearchContext'
import type { Product, CategoryKey } from '../types'

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '에어 줌 프로 러닝화',
    category: 'shoes',
    price: 159000,
    stock: 12,
    categoryLabel: '신발',
    keywords: ['러닝화', '런닝화', '운동화', '신발', '에어줌', 'shoes'],
  },
  {
    id: '2',
    name: '클래식 캔버스 스니커즈',
    category: 'shoes',
    price: 69000,
    stock: 25,
    categoryLabel: '신발',
    keywords: ['스니커즈', '단화', '신발', '캔버스', 'shoes'],
  },
  {
    id: '3',
    name: '오버핏 기모 맨투맨',
    category: 'clothing',
    price: 49000,
    stock: 40,
    categoryLabel: '의류',
    keywords: ['맨투맨', '티셔츠', '상의', '의류', '기모'],
  },
  {
    id: '4',
    name: '프리미엄 헤비 후디',
    category: 'clothing',
    price: 79000,
    stock: 18,
    categoryLabel: '의류',
    keywords: ['후디', '후드티', '후드집업', '상의', '의류'],
  },
  {
    id: '5',
    name: '노이즈 캔슬링 무선 헤드폰',
    category: 'electronics',
    price: 289000,
    stock: 8,
    categoryLabel: '전자기기',
    keywords: ['헤드폰', '헤드셋', '이어폰', '노이즈캔슬링', '음향'],
  },
  {
    id: '6',
    name: '스마트 피트니스 워치',
    category: 'electronics',
    price: 199000,
    stock: 15,
    categoryLabel: '전자기기',
    keywords: ['워치', '스마트워치', '시계', '피트니스'],
  },
]

interface ProductListProps {
  category: CategoryKey
  categoryTitle: string
}

export function ProductList({ category, categoryTitle }: ProductListProps) {
  const { searchQuery } = useSearch()

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/\s+/g, '')

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchCat = category === 'all' || p.category === category
    if (!cleanQuery) return matchCat

    const nameMatch = p.name.toLowerCase().replace(/\s+/g, '').includes(cleanQuery)
    const categoryMatch = p.categoryLabel.toLowerCase().includes(cleanQuery)
    const keywordMatch = p.keywords.some((kw) =>
      kw.toLowerCase().includes(cleanQuery) || cleanQuery.includes(kw.toLowerCase()),
    )

    return matchCat && (nameMatch || categoryMatch || keywordMatch)
  })

  return (
    <div className="flex-1 bg-white p-3.5 dark:bg-zinc-950">
      {/* 상품 목록 헤더 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {categoryTitle}
          </span>
          <span className="text-xs text-zinc-400">
            ({filtered.length}개 상품)
          </span>
          {searchQuery.trim() && (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              "{searchQuery}" 검색 결과
            </span>
          )}
        </div>
      </div>

      {/* 상품 그리드 */}
      {filtered.length === 0 ? (
        <div className="rounded border border-dashed border-zinc-300 p-6 text-center text-xs text-zinc-400 dark:border-zinc-700">
          검색어 "{searchQuery}"에 일치하는 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {product.name}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {product.price.toLocaleString()}원 · 재고 {product.stock}개
                </div>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">
                [{product.categoryLabel}]
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
