'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard, type Product } from '@study/demo-kit'

export function FilterParsingDemo() {
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<string>('best')
  const [maxPrice, setMaxPrice] = useState<number>(350000)

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (category !== 'all' && p.category !== category) return false
    if (p.price > maxPrice) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0)
  })

  const currentQueryString = `?category=${category}&sort=${sort}&maxPrice=${maxPrice}`

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">useSearchParams() 상품 필터 & 정렬 쿼리 파싱</h4>
          <p className="text-zinc-500 text-[11px]">URL SearchParams 쿼리를 파싱하여 실시간 상품 목록을 필터링 및 정렬합니다.</p>
        </div>
        <div className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300 font-bold">
          {currentQueryString}
        </div>
      </div>

      {/* 필터 툴바 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <div>
          <label className="block text-zinc-500 font-medium mb-1">카테고리</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">전체 카테고리</option>
            <option value="electronics">전자기기</option>
            <option value="fashion">패션/의류</option>
            <option value="books">도서</option>
            <option value="living">리빙/인테리어</option>
            <option value="sports">스포츠/레저</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-500 font-medium mb-1">정렬 기준</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            <option value="best">인기/추천순</option>
            <option value="price-asc">낮은 가격순</option>
            <option value="price-desc">높은 가격순</option>
            <option value="rating">평점 높은순</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-500 font-medium mb-1">
            최대 가격: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{maxPrice.toLocaleString()}원</span>
          </label>
          <input
            type="range"
            min="30000"
            max="350000"
            step="10000"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* 결과 상품 목록 */}
      <div className="space-y-2">
        <div className="font-bold text-zinc-700 dark:text-zinc-300">
          조회 결과 ({filtered.length}개 상품):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
