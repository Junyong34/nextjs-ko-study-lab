import React from 'react'
import Link from 'next/link'
import { FlaskConical, BookOpen, ArrowLeft, Sparkles, SearchX, RotateCcw } from 'lucide-react'

export interface DemoEmptyStateProps {
  /** 문서 제목 (문서 준비 중 모드) */
  docTitle?: string
  /** 문서 카테고리/섹션 (문서 준비 중 모드) */
  category?: string
  /** 실제 학습 문서 URL (문서 준비 중 모드) */
  docUrl?: string
  /** 검색어 (검색 결과 없음 모드) */
  query?: string
  /** 초기화 콜백 (검색 결과 없음 모드) */
  onReset?: () => void
  /** 변형 모드 명시 (선택) */
  variant?: 'doc-pending' | 'search-empty'
}

export function DemoEmptyState({
  docTitle,
  category,
  docUrl,
  query,
  onReset,
  variant,
}: DemoEmptyStateProps) {
  const isSearchEmpty =
    variant === 'search-empty' ||
    (query !== undefined || onReset !== undefined || !docTitle)

  // 1. 검색/필터 결과 없음 모드
  if (isSearchEmpty) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 sm:p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-4">
          <SearchX className="h-7 w-7" />
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          일치하는 예제가 없습니다
        </h3>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto break-keep">
          {query && category && category !== 'All' && category !== '전체' ? (
            <>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{query}"</span> 검색어 및{' '}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{category}"</span> 카테고리와 일치하는 예제를 찾을 수 없습니다.
            </>
          ) : query ? (
            <>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{query}"</span> 검색어와 일치하는 예제를 찾을 수 없습니다.
            </>
          ) : category && category !== 'All' && category !== '전체' ? (
            <>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{category}"</span> 카테고리에 해당하는 예제가 없습니다.
            </>
          ) : (
            '검색 조건을 만족하는 예제가 없습니다. 검색어를 변경하거나 필터를 초기화해 보세요.'
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span>검색 및 필터 초기화</span>
            </button>
          ) : (
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span>전체 예제 목록 보기</span>
            </Link>
          )}
        </div>
      </div>
    )
  }

  // 2. 문서 실습 데모 준비 중 모드 (기존 호환)
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>전체 예제 목록</span>
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {category ? `${category} > ` : ''}{docTitle}
        </span>
      </div>

      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <FlaskConical className="h-3.5 w-3.5 text-zinc-500" />
            <span>실습 예제</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            준비 중
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {docTitle}
        </h1>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 sm:p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-4">
          <FlaskConical className="h-7 w-7" />
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          이 주제의 실습 예제가 준비 중입니다
        </h3>
        
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto break-keep">
          현재 <span className="font-semibold text-zinc-800 dark:text-zinc-200">[{docTitle}]</span>에 대한 실습 예제를 준비하고 있습니다. 관련 개념은 한국어 학습 문서에서 먼저 확인해 보세요.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {docUrl && (
            <Link
              href={docUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <BookOpen className="h-4 w-4" />
              <span>학습 문서 보러가기</span>
            </Link>
          )}

          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>다른 실습 예제 둘러보기</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
