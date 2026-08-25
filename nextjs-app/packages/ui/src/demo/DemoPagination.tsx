import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface DemoPaginationProps {
  /** 현재 페이지 (1-based) */
  currentPage: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void
  /** 페이지 번호 링크 href 생성기 (선택) */
  getPageHref?: (page: number) => string
  className?: string
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export function DemoPagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  className = '',
}: DemoPaginationProps) {
  if (totalPages <= 1) return null

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  const renderPageItem = (p: number | '...', idx: number) => {
    if (p === '...') {
      return (
        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-zinc-400 select-none">
          ...
        </span>
      )
    }

    const isCurrent = p === currentPage
    const content = (
      <span
        aria-current={isCurrent ? 'page' : undefined}
        className={`inline-flex items-center justify-center h-8 min-w-8 px-2.5 rounded-lg text-xs font-medium transition-all ${
          isCurrent
            ? 'bg-zinc-900 text-white font-bold shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
            : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
        }`}
      >
        {p}
      </span>
    )

    if (getPageHref && !isCurrent) {
      return (
        <Link key={p} href={getPageHref(p)} onClick={() => onPageChange(p)}>
          {content}
        </Link>
      )
    }

    return (
      <button key={p} type="button" onClick={() => onPageChange(p)} disabled={isCurrent}>
        {content}
      </button>
    )
  }

  return (
    <nav aria-label="페이지 내비게이션" className={`flex items-center justify-center pt-6 ${className}`}>
      {/* 1. 데스크톱 번호 기반 페이지네이션 (hidden on mobile, flex on sm+) */}
      <div className="hidden sm:flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>이전</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers(currentPage, totalPages).map((p, idx) => renderPageItem(p, idx))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap transition-colors"
        >
          <span>다음</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. 모바일 컴팩트 페이지네이션 (flex on mobile, hidden on sm+) */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-xs gap-3">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className="inline-flex items-center gap-1 flex-1 justify-center h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap transition-colors shadow-2xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>이전</span>
        </button>

        <div className="flex items-center justify-center px-3 py-1.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 shrink-0 whitespace-nowrap">
          <span>{currentPage}</span>
          <span className="mx-1 text-zinc-400">/</span>
          <span>{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className="inline-flex items-center gap-1 flex-1 justify-center h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap transition-colors shadow-2xs"
        >
          <span>다음</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  )
}
