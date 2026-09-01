import React from 'react'
import Link from 'next/link'
import { PlayCircle, BookOpen, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { cardClass } from '../primitives/Card'
import { DemoStatusBadge } from './DemoStatus'
import { LearningCompletionStatus } from '../learning'

export interface DocDemoItem {
  url: string
  title: string
  zone: string
  status: string
  doc: string
}

export interface DocDemoHubProps {
  /** 문서 제목 (예: "Caching") */
  docTitle: string
  /** 문서 카테고리/섹션 (예: "Getting Started") */
  category?: string
  /** 실제 학습 문서 URL (예: "/getting-started/caching") */
  docUrl: string
  /** 문서 슬러그 경로 (예: "getting-started/caching") */
  docSlug: string
  /** 이 문서에 속한 데모 목록 */
  demos: DocDemoItem[]
  /** 학습 완료된 데모 URL. 카드에는 상태만 표시합니다. */
  learningCompletedUrls?: string[]
}

/**
 * 특정 문서에 등록된 실습 데모 카드 목록을 보여주는 메인 페이지 컴포넌트입니다.
 */
export function DocDemoHub({
  docTitle,
  category,
  docUrl,
  docSlug,
  demos,
  learningCompletedUrls,
}: DocDemoHubProps) {
  const doneCount = demos.filter((d) => d.status === 'done').length

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 상단 빵부스러기 */}
      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>전체 예제 목록</span>
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {category ? `${category} > ` : ''}
        </span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {docTitle}
        </span>
      </div>

      {/* 헤더 영역 */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <PlayCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="leading-none">실습 예제 {demos.length}개</span>
            </span>
            {doneCount === demos.length ? (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium leading-none text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                실습 준비 완료
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium leading-none text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                {doneCount}/{demos.length} 구현 완료
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {docTitle} 실습 예제
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 break-keep">
            예제를 실행하며 이 주제의 핵심 원리를 확인할 수 있습니다.
          </p>
        </div>

        <Link
          href={docUrl}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <BookOpen className="h-4 w-4 text-zinc-500" />
          <span>관련 학습 문서 보기</span>
        </Link>
      </div>

      {/* 데모 목록 그리드 */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          실습 가능한 예제 목록
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {demos.map((demo) => {
            const runHref = `/demo/${docSlug}?run=${encodeURIComponent(demo.url)}`
            const directZoneHref = `/zone/${demo.zone}/${demo.url}`

            return (
              <div
                key={demo.url}
                className={cardClass({ density: 'index' })}
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {demo.url}
                      </span>
                    </div>
                    <DemoStatusBadge status={demo.status} />
                  </div>

                  {learningCompletedUrls && demo.status === 'done' && (
                    <div className="mt-2">
                      <LearningCompletionStatus
                        completed={learningCompletedUrls.includes(demo.url)}
                      />
                    </div>
                  )}

                  <h3 className="mt-3 text-lg font-bold text-zinc-900 transition dark:text-zinc-100">
                    <Link
                      href={runHref}
                      className="hover:underline hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      {demo.title}
                    </Link>
                  </h3>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3.5 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <a
                      href={directZoneHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
                      title="Zone 앱 직접 새 탭으로 열기"
                    >
                      <span>새 탭으로 열기</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={runHref}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs"
                    >
                      <span>예제 실행하기</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
