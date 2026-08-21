import React from 'react'
import Link from 'next/link'
import { FlaskConical, BookOpen, ArrowLeft, Sparkles } from 'lucide-react'

export interface DemoEmptyStateProps {
  /** 문서 제목 (예: "Installation") */
  docTitle: string
  /** 문서 카테고리/섹션 (예: "Getting Started") */
  category?: string
  /** 실제 학습 문서 URL (예: "/getting-started/installation") */
  docUrl: string
}

/**
 * 실습 데모가 아직 등록되지 않은 문서 메뉴 선택 시 표시되는 안내 컴포넌트입니다.
 */
export function DemoEmptyState({ docTitle, category, docUrl }: DemoEmptyStateProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* 상단 내비게이션 */}
      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>전체 데모 색인</span>
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {category ? `${category} > ` : ''}{docTitle}
        </span>
      </div>

      {/* 헤더 영역 */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <FlaskConical className="h-3.5 w-3.5 text-zinc-500" />
            <span>실습 데모</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            준비 중
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {docTitle}
        </h1>
      </div>

      {/* 안내 카드 (Empty State 본체) */}
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 sm:p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-4">
          <FlaskConical className="h-7 w-7" />
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          이 주제의 실습 데모가 준비 중입니다
        </h3>
        
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto break-keep">
          현재 <span className="font-semibold text-zinc-800 dark:text-zinc-200">[{docTitle}]</span>에 대한 인터랙티브 실습 예제는 제작 진행 중입니다. 공식 한국어 학습 문서를 통해 관련 개념을 먼저 확인해 보세요.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={docUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <BookOpen className="h-4 w-4" />
            <span>학습 문서 보러가기</span>
          </Link>

          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>다른 실습 데모 둘러보기</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
