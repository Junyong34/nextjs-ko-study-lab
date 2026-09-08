'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ExternalLink, Play } from 'lucide-react'
import type { DemoMeta } from './types'
import { getDemoBadge } from './data'

interface VisualizeCardProps {
  demo: DemoMeta
  isActive: boolean
  onToggle: () => void
}

export function VisualizeCard({ demo, isActive, onToggle }: VisualizeCardProps) {
  const badge = getDemoBadge(demo)

  return (
    <div
      id={`card-${demo.key}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isActive
          ? 'bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900/10 dark:bg-zinc-900 dark:border-zinc-200'
          : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-xs dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700'
      }`}
    >
      {/* 카드 상단 헤더 및 요약 영역 */}
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.className}`}
          >
            {badge.label}
          </span>
          <Link
            href={`/visualize/${demo.key}`}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition"
            title="전체 화면 상세 페이지로 이동"
          >
            <span>상세 보기</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {demo.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {demo.description}
          </p>
        </div>

        {/* 토글 버튼 */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onToggle}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isActive
                ? 'w-auto px-6 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs'
                : 'w-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {isActive ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>닫기</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current text-zinc-700 dark:text-zinc-300" />
                <span>미리보기</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 펼쳐졌을 때 렌더링되는 캔버스 영역 */}
      {isActive && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-4 sm:p-6 space-y-4">
          <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 sm:p-4">
            {demo.component}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <span>💡 타임라인 슬라이더나 컨트롤을 조작해 상태 변화를 확인하세요.</span>
            <Link
              href={`/visualize/${demo.key}`}
              className="inline-flex items-center gap-1 font-semibold text-zinc-900 hover:underline dark:text-zinc-100 shrink-0"
            >
              <span>전체 화면과 소스 코드 보기</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
