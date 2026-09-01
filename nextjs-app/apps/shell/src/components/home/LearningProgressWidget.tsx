'use client'

import React from 'react'
import Link from 'next/link'
import { Layers, CheckCircle2, PlayCircle, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import { useLearningProgress } from '@/components/learning-progress/LearningProgressProvider'

export function LearningProgressWidget() {
  const { inventory, progress, storageStatus } = useLearningProgress()

  const totalDocs = inventory.documents.length
  const totalDemos = inventory.demos.length

  const completedDocsCount = Object.values(progress.documents || {}).filter(Boolean).length
  const completedDemosCount = Object.values(progress.demos || {}).filter(Boolean).length

  const totalItems = totalDocs + totalDemos
  const totalCompleted = completedDocsCount + completedDemosCount
  const progressPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0

  return (
    <section className="rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 text-white shadow-md dark:border-zinc-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-xs">
            학습 대시보드
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            나의 Next.js 학습 대시보드
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
            문서를 읽고 예제를 실습한 뒤 완료 상태를 기록하세요.
          </p>
        </div>

        {/* Progress Card & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
              <span>전체 완료율</span>
              <span className="font-mono text-base font-bold text-white">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-zinc-300" />
                문서: {completedDocsCount} / {totalDocs}
              </span>
              <span className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3 text-zinc-300" />
                예제: {completedDemosCount} / {totalDemos}
              </span>
            </div>
          </div>

          <Link
            href="/study-progress"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-zinc-100 hover:shadow-md shrink-0"
          >
            <Layers className="h-4 w-4" />
            학습 기록 자세히 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
