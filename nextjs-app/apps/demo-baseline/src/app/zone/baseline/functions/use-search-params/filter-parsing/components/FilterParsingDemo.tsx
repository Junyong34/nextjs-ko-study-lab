'use client'
import React from 'react'
import { MOCK_PRODUCTS, ProductCard, DemoResetButton } from '@study/demo-kit'
import { CATEGORY_OPTIONS, MAX_PRICE, MIN_PRICE, PRICE_STEP, SORT_OPTIONS } from '../types'
import { filterAndSortProducts } from '../filters'
import { useParsedFilters } from '../hooks/useParsedFilters'

export function FilterParsingDemo() {
  const { filters, hasInvalidRaw, rawQueryString, updateParam, reset } = useParsedFilters()
  const results = filterAndSortProducts(MOCK_PRODUCTS, filters)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">useSearchParams()가 읽은 현재 URL 쿼리 스트링</h4>
          <p className="text-zinc-500 text-[11px]">아래 필터를 바꾸면 주소창의 쿼리 문자열이 실제로 바뀌고, 그 값을 다시 읽어 목록을 계산합니다.</p>
        </div>
        <div className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300 font-bold">
          {rawQueryString ? `?${rawQueryString}` : '(쿼리 없음)'}
        </div>
      </div>

      {hasInvalidRaw && (
        <p className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          URL의 category/sort/maxPrice 중 유효 목록에 없는 값이 있어 해당 조건만 기본값으로 안전하게 대체했습니다.
        </p>
      )}

      {/* 필터 툴바 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <div>
          <label htmlFor="filter-category" className="block text-zinc-500 font-medium mb-1">카테고리</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => updateParam('category', e.target.value === 'all' ? null : e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className="block text-zinc-500 font-medium mb-1">정렬 기준</label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => updateParam('sort', e.target.value === 'best' ? null : e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-max-price" className="block text-zinc-500 font-medium mb-1">
            최대 가격: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{filters.maxPrice.toLocaleString()}원</span>
          </label>
          <input
            id="filter-max-price"
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={PRICE_STEP}
            value={filters.maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value === String(MAX_PRICE) ? null : e.target.value)}
            className="w-full cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* URL 직접 진입(잘못된 값 포함) 실제 테스트용 링크 */}
      <div className="rounded border border-dashed border-zinc-300 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-zinc-500 text-[11px] mb-1.5">잘못된 쿼리로 주소창에 직접 진입해도 안전하게 복구되는지 실제 링크로 확인:</p>
        <a
          href="?category=doesnotexist&sort=invalid-sort&maxPrice=abc"
          className="inline-block rounded border border-zinc-300 px-2 py-1 font-mono text-[11px] text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          ?category=doesnotexist&amp;sort=invalid-sort&amp;maxPrice=abc 로 직접 이동
        </a>
      </div>

      {/* 결과 상품 목록 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-zinc-700 dark:text-zinc-300">조회 결과 ({results.length}개 상품)</div>
          <DemoResetButton label="필터 초기화" onReset={reset} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {results.length === 0 && (
          <p className="text-center text-zinc-400 py-4">조건에 맞는 상품이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
