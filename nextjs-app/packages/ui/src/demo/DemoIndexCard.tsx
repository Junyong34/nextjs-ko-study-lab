import React from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { cardClass } from '../primitives/Card'
import { DemoStatusBadge } from './DemoStatus'

export interface DemoIndexCardProps {
  /** 학습자 URL 조각 (예: "caching/basic") */
  url: string
  title: string
  status: string
  /** 근거 문서 제목 또는 파일명 */
  doc?: string
  /** 근거 문서의 사이트 URL */
  docUrl?: string
  /** 카테고리 명칭 (선택) */
  category?: string
  /** 클릭/내비게이션 시 콜백 (스크롤 복원 상태 저장용) */
  onCardClick?: (url: string) => void
  onNavigate?: (url: string) => void
  className?: string
}

export function DemoIndexCard({
  url,
  title,
  status,
  doc,
  docUrl,
  category,
  onCardClick,
  onNavigate,
  className = '',
}: DemoIndexCardProps) {
  const handleClick = () => {
    onCardClick?.(url)
    onNavigate?.(url)
  }

  return (
    <div
      id={`demo-card-${url.replace(/\//g, '-')}`}
      data-demo-url={url}
      className={cardClass({
        density: 'index',
        className: `group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 ${className}`,
      })}
    >
      <div>
        {/* 상단 1줄: 카테고리 칩 + 상태 뱃지 */}
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0 whitespace-nowrap">
              {category}
            </span>
          )}
          <DemoStatusBadge status={status} />
        </div>

        {/* 상단 2줄: URL 경로 (독립 줄) */}
        <div className="mt-2">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 break-all select-all">
            {url}
          </span>
        </div>

        {/* 데모 타이틀 (Stretched Link 적용: 카드 전체 클릭 영역 활성화) */}
        <h3 className="mt-2.5 text-sm sm:text-base font-bold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
          <Link
            href={`/demo/${url}`}
            onClick={handleClick}
            className="focus:outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {title}
          </Link>
        </h3>
      </div>

      {/* 하단 푸터: 관련 문서 링크 (좌측) + 데모 열기 액션 (우측) */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80 min-w-0">
        {doc && docUrl ? (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 min-w-0 flex-1 mr-2">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <Link
              href={docUrl}
              className="relative z-10 truncate text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
              title={doc}
            >
              {doc}
            </Link>
          </div>
        ) : (
          <span className="text-[11px] text-zinc-400">인터랙티브 데모</span>
        )}

        <div className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 shrink-0 whitespace-nowrap transition-colors">
          <span>데모 열기</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  )
}
