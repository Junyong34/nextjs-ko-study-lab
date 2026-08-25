import React from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { DemoStatusBadge } from './DemoStatus'

export interface SiblingDemo {
  url: string
  title: string
  zone?: string
}

export interface DemoPageHeaderProps {
  title: string
  zone?: string
  status: string
  /** 학습자 URL 조각 (예: "caching/basic") */
  url: string
  /** 근거 문서의 사이트 URL */
  docUrl: string
  /** 근거 문서 제목 */
  docTitle: string
  /** 뒤로가기 대상 URL (기본값: /demo) */
  backUrl?: string
  /** 뒤로가기 버튼 라벨 (기본값: "데모 목록") */
  backLabel?: string
  /** 커스텀 뒤로가기 버튼 컴포넌트 */
  customBackButton?: React.ReactNode
  /** 동일 문서에 속한 다른 데모 목록 */
  siblingDemos?: SiblingDemo[]
  /** 현재 실행 중인 데모 URL */
  currentDemoUrl?: string
  /** 데모 전환 링크 빌더 (예: (demoUrl) => `/demo/docSlug?run=${demoUrl}`) */
  getDemoHref?: (demoUrl: string) => string
}

/**
 * 데모 독립 열람 페이지의 머리말.
 *
 * 뒤로가기 버튼(이전 데모 목록 복귀), 상단 문서 브레드크럼 링크, 이전/다음 데모 선택을 제공합니다.
 */
export function DemoPageHeader({
  title,
  status,
  url,
  docUrl,
  docTitle,
  backUrl = '/demo',
  backLabel = '데모 목록',
  customBackButton,
  siblingDemos = [],
  currentDemoUrl,
  getDemoHref,
}: DemoPageHeaderProps) {
  const currentIndex = siblingDemos.findIndex((d) => d.url === (currentDemoUrl ?? url))
  const prevDemo = currentIndex > 0 ? siblingDemos[currentIndex - 1] : null
  const nextDemo =
    currentIndex >= 0 && currentIndex < siblingDemos.length - 1
      ? siblingDemos[currentIndex + 1]
      : null

  const resolveDemoHref = (targetUrl: string) => {
    if (getDemoHref) return getDemoHref(targetUrl)
    return `/demo/${targetUrl}`
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 상단 내비게이션 바: 뒤로가기 + 문서 브레드크럼 + 이전/다음 데모 스위처 */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {customBackButton ? (
            customBackButton
          ) : (
            <Link
              href={backUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 hover:text-zinc-950 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{backLabel}</span>
            </Link>
          )}

          <span className="text-zinc-300 dark:text-zinc-700">/</span>

          <Link
            href={docUrl}
            className="inline-flex items-center gap-1 font-medium text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">문서:</span>
            <span className="font-semibold">{docTitle}</span>
          </Link>
        </div>

        {/* 이전/다음 데모 이동 버튼 */}
        {siblingDemos.length > 1 && (
          <div className="flex items-center gap-1.5">
            {prevDemo ? (
              <Link
                href={resolveDemoHref(prevDemo.url)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                title={`이전: ${prevDemo.title}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden md:inline">이전 데모</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-100 bg-zinc-50 px-2 py-1 text-xs text-zinc-300 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-600 cursor-not-allowed">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden md:inline">이전 데모</span>
              </span>
            )}

            <span className="text-[11px] font-mono text-zinc-400 px-1">
              {currentIndex >= 0 ? currentIndex + 1 : 1} / {siblingDemos.length}
            </span>

            {nextDemo ? (
              <Link
                href={resolveDemoHref(nextDemo.url)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                title={`다음: ${nextDemo.title}`}
              >
                <span className="hidden md:inline">다음 데모</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-100 bg-zinc-50 px-2 py-1 text-xs text-zinc-300 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-600 cursor-not-allowed">
                <span className="hidden md:inline">다음 데모</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* 헤더 본문: 상태 뱃지 + 데모 타이틀 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          {status && status !== 'done' && (
            <div className="flex items-center gap-2 mb-1">
              <DemoStatusBadge status={status} />
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      {/* 동일 문서에 데모가 여러 개일 때 하위 데모 탭 칩 목록 */}
      {siblingDemos.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          <span className="text-[11px] font-semibold text-zinc-400 shrink-0 mr-1">
            이 문서의 데모:
          </span>
          {siblingDemos.map((sDemo, idx) => {
            const isSelected = sDemo.url === (currentDemoUrl ?? url)
            return (
              <Link
                key={sDemo.url}
                href={resolveDemoHref(sDemo.url)}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium shrink-0 transition ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <span className="text-[10px] opacity-75">#{idx + 1}</span>
                <span>{sDemo.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
