'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Copy, ExternalLink, Code2 } from 'lucide-react'
import { ShareButton } from '@study/ui'
import type { DemoMeta } from './types'
import { getDemoBadge } from './data'

interface VisualizeDetailViewerProps {
  demo: DemoMeta
  relatedDemos: DemoMeta[]
}

export function VisualizeDetailViewer({ demo, relatedDemos }: VisualizeDetailViewerProps) {
  const [copied, setCopied] = useState(false)
  const badge = getDemoBadge(demo)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(demo.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-8">
      {/* 상단 내비게이션 & 헤더 */}
      <div className="space-y-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/visualize"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>시각화 목록으로 돌아가기</span>
          </Link>

          <ShareButton title={`${demo.title} - Next.js & React 시각화`} url={`/visualize/${demo.key}`} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {demo.title}
          </h1>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
          {demo.description}
        </p>
      </div>

      {/* 메인 캔버스 렌더링 뷰포트 */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Canvas Stage
          </span>
          <span>슬라이더와 버튼으로 상태를 실시간으로 바꿔 볼 수 있습니다</span>
        </div>

        <div className="w-full bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl p-2 sm:p-4 border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
          {demo.component}
        </div>
      </section>

      {/* 결합 구현 소스 코드 섹션 */}
      {demo.code && (
        <section className="bg-zinc-950 text-zinc-100 rounded-2xl p-5 sm:p-6 border border-zinc-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 font-sans">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Code2 className="h-4 w-4 text-emerald-400" />
              <span>시각화 조합 예시 코드</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>코드 복사</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-emerald-400 overflow-x-auto leading-relaxed py-2">
            {demo.code}
          </pre>
        </section>
      )}

      {/* 같은 카테고리의 다른 시각화 둘러보기 */}
      {relatedDemos.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            같은 카테고리의 다른 시각화
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedDemos.map((rel) => {
              const relBadge = getDemoBadge(rel)
              return (
                <Link
                  key={rel.key}
                  href={`/visualize/${rel.key}`}
                  className="group block p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition shadow-xs"
                >
                  <div className="mb-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${relBadge.className}`}
                    >
                      {relBadge.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:underline transition">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {rel.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
