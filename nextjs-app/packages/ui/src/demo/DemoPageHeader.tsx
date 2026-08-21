import React from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { DemoStatusBadge, DemoZoneBadge } from './DemoStatus'

export interface DemoPageHeaderProps {
  title: string
  zone: string
  status: string
  /** 학습자 URL 조각 (예: "caching/basic"). 내부 경로 표시에 쓴다 */
  url: string
  /** 근거 문서의 사이트 URL */
  docUrl: string
  /** 근거 문서 제목 */
  docTitle: string
}

/**
 * 데모 독립 열람 페이지의 머리말.
 *
 * **제목·설명·근거 문서 링크는 셸이 그립니다** (규칙 12). 데모 앱은 chrome을 그리지 않습니다.
 * 지금은 데모 앱도 자기 제목을 그리고 있어 중복입니다 — Phase 8에서 정리합니다.
 */
export function DemoPageHeader({
  title,
  zone,
  status,
  url,
  docUrl,
  docTitle,
}: DemoPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>전체 데모</span>
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <Link
          href={docUrl}
          className="inline-flex items-center gap-1 font-medium text-zinc-700 hover:text-zinc-950 transition dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>근거 문서: {docTitle}</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <DemoZoneBadge zone={zone} />
            <DemoStatusBadge status={status} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            /zone/{zone}/{url}
          </p>
        </div>

        <Link
          href={docUrl}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
          <span>근거 문서 보기</span>
        </Link>
      </div>
    </div>
  )
}
