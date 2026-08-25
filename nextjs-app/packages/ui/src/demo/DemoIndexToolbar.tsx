'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { FIELD_SURFACE } from '../styles'

export interface DemoIndexToolbarProps {
  /** 현재 검색어 */
  query: string
  /** 검색어 변경 콜백 (디바운스 후 호출) */
  onQueryChange: (query: string) => void
  /** 현재 선택된 카테고리 (기본값: '전체') */
  selectedCategory: string
  /** 사용 가능한 카테고리 목록 */
  categories?: readonly string[] | string[]
  /** 카테고리 선택 변경 콜백 */
  onCategoryChange?: (category: string) => void
  onCategorySelect?: (category: string) => void
  /** 필터링된 결과 개수 */
  totalCount?: number
  totalResults?: number
  /** 필터 전 전체 개수 */
  allCount?: number
  /** 현재 페이지 */
  currentPage?: number
  /** 전체 페이지 */
  totalPages?: number
  /** 디바운스 대기시간 (ms, 기본: 250) */
  debounceMs?: number
  /** 검색/필터 초기화 */
  onClearFilters?: () => void
  /** 진행 중 상태 표시 */
  isPending?: boolean
  className?: string
}

export const DEFAULT_DEMO_CATEGORIES = [
  'All',
  'Getting Started',
  'Guides',
  'API Reference',
  'Architecture',
] as const

export function DemoIndexToolbar({
  query,
  onQueryChange,
  selectedCategory,
  categories = DEFAULT_DEMO_CATEGORIES,
  onCategoryChange,
  onCategorySelect,
  totalCount,
  totalResults,
  allCount = 241,
  currentPage = 1,
  totalPages = 1,
  debounceMs = 250,
  onClearFilters,
  isPending: externalIsPending,
  className = '',
}: DemoIndexToolbarProps) {
  const [inputValue, setInputValue] = useState(query)
  const [internalIsPending, startTransition] = useTransition()
  const isPending = externalIsPending ?? internalIsPending

  const count = totalCount ?? totalResults ?? 0

  useEffect(() => {
    setInputValue(query)
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        startTransition(() => {
          onQueryChange(inputValue)
        })
      }
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [inputValue, query, debounceMs, onQueryChange])

  const handleClearInput = () => {
    setInputValue('')
    onQueryChange('')
  }

  const handleCategoryClick = (cat: string) => {
    onCategoryChange?.(cat)
    onCategorySelect?.(cat)
  }

  const isFiltered =
    query.trim().length > 0 ||
    (selectedCategory !== 'All' &&
      selectedCategory !== '전체' &&
      selectedCategory !== '' &&
      selectedCategory !== undefined)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. 검색 입력창 */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="데모 제목, URL, 관련 문서명 검색..."
          aria-label="데모 검색"
          className={`${FIELD_SURFACE} pl-10 pr-10 py-2.5 text-sm rounded-xl transition-all shadow-xs w-full`}
        />
        {isPending ? (
          <Loader2 className="absolute right-3.5 h-4 w-4 text-zinc-400 animate-spin" />
        ) : inputValue ? (
          <button
            type="button"
            onClick={handleClearInput}
            aria-label="검색어 지우기"
            className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* 2. 카테고리 칩 목록 */}
      <div className="flex items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="카테고리 필터"
          className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0 min-w-0 flex-1"
        >
          {categories.map((cat) => {
            const isSelected =
              selectedCategory === cat ||
              ((cat === 'All' || cat === '전체') && (!selectedCategory || selectedCategory === 'All' || selectedCategory === '전체'))
            return (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => handleCategoryClick(cat)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {isFiltered && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline decoration-zinc-300 underline-offset-2 shrink-0 whitespace-nowrap transition-colors"
          >
            <X className="h-3 w-3" />
            <span>필터 초기화</span>
          </button>
        )}
      </div>

      {/* 3. 검색 결과 요약 및 접근성 Live Region */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
        <div>
          {isFiltered ? (
            <span>
              검색 결과 <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{count}</strong>개 (전체 {allCount}개 중)
            </span>
          ) : (
            <span>
              총 <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{count}</strong>개의 데모
            </span>
          )}
          {totalPages > 1 && (
            <span className="ml-2 text-zinc-400 dark:text-zinc-500">
              (페이지 {currentPage} / {totalPages})
            </span>
          )}
        </div>

        {/* 스크린 리더용 안내 영역 */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isFiltered
            ? `검색 결과 ${count}개 데모가 표시되었습니다. 총 ${totalPages}페이지 중 ${currentPage}페이지입니다.`
            : `총 ${count}개의 데모 중 ${currentPage}페이지입니다.`}
        </div>
      </div>
    </div>
  )
}
