import React from 'react'
import Link from 'next/link'
import { Rocket, BookOpen, Layers, PlayCircle, BookmarkCheck, ArrowRight } from 'lucide-react'

interface RoadmapHeroProps {
  totalDocs: number
  totalDemos: number
}

export function RoadmapHero({ totalDocs, totalDemos }: RoadmapHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50/80 via-white to-white p-6 sm:p-8 md:p-10 dark:border-zinc-800 dark:from-zinc-900/80 dark:via-zinc-950 dark:to-zinc-950">
      {/* Background Accent Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-zinc-200/30 blur-3xl dark:bg-zinc-800/10"
      />

      <div className="relative z-10 space-y-6">
        {/* Release & Environment Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            Next.js 16.3.1
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            React 19.2.8
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            Turbopack
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            App Router
          </span>
        </div>

        {/* Headline & Description */}
        <div className="space-y-5 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl leading-tight sm:leading-tight dark:text-zinc-50">
            <span>Next.js App Router</span>
            <span className="block mt-2 sm:mt-3.5 text-zinc-500 dark:text-zinc-400 text-2xl sm:text-3xl lg:text-4xl font-bold">
              공식 문서 한국어 번역 &amp; 실습 랩
            </span>
          </h1>
          <p className="pt-1 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            Next.js 공식 문서(App Router)의 한국어 번역과 기능 검증을 위한 실습 데모를 제공합니다.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Rocket className="h-4 w-4" />
            로드맵 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <PlayCircle className="h-4 w-4" />
            실습 데모 둘러보기
          </Link>
          <Link
            href="/glossary"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <BookmarkCheck className="h-4 w-4" />
            핵심 용어 사전 (48종)
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-3.5 backdrop-blur-xs dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">전체 문서</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {totalDocs > 0 ? `${totalDocs}개` : '280+ 챕터'}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-3.5 backdrop-blur-xs dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-medium">학습 카테고리</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              5단계 로드맵
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-3.5 backdrop-blur-xs dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <PlayCircle className="h-4 w-4" />
              <span className="text-xs font-medium">실습 데모</span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {totalDemos > 0 ? `${totalDemos}개 랩` : '인터랙티브 랩'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
