'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Rocket, BookOpen, Layers, PlayCircle, BookmarkCheck, ArrowRight, Copy, Check, Terminal } from 'lucide-react'

interface RoadmapHeroProps {
  totalDocs: number
  totalDemos: number
}

export function RoadmapHero({ totalDocs, totalDemos }: RoadmapHeroProps) {
  const [copied, setCopied] = useState(false)
  const cliCommand = 'npx create-next-app@latest --typescript --tailwind --app'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cliCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 미지원 fallback
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 via-white to-zinc-50/50 p-6 sm:p-10 md:p-12 dark:border-zinc-800/80 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950/60 shadow-xs">
      {/* Decorative Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* Decorative Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-zinc-300/30 blur-3xl dark:bg-zinc-700/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-zinc-200/40 blur-3xl dark:bg-zinc-800/20"
      />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-xs backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Next.js 16.3.2
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100/90 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            React 19.2
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100/90 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            Turbopack
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100/90 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            <PlayCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            {totalDemos} Live Demos
          </span>
        </div>

        {/* Main Headline & Description */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl leading-[1.15] dark:text-zinc-50">
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400">
              Next.js App Router
            </span>
            <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-700 dark:text-zinc-300">
              한국어 학습 가이드 & 실습 예제
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl">
            Next.js 공식 문서를 바탕으로 만든 한국어 학습 문서를 읽고, {totalDemos}개 실습 예제에서 핵심 기능의 동작을 직접 확인해 보세요.
          </p>
        </div>

        {/* Action Buttons & Terminal Box */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2">
          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 hover:shadow-lg dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Rocket className="h-4 w-4" />
              학습 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-sm font-semibold text-zinc-800 shadow-xs transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <PlayCircle className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              실습 예제 둘러보기
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-xs transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <BookmarkCheck className="h-4 w-4" />
              용어집 (48개)
            </Link>
          </div>

          {/* Quick CLI Copy Box */}
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-900/5 px-3.5 py-2.5 text-xs font-mono text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 backdrop-blur-xs w-fit max-w-full overflow-x-auto">
            <Terminal className="h-4 w-4 text-zinc-500 shrink-0" />
            <span className="select-all whitespace-nowrap text-zinc-900 dark:text-zinc-100 font-semibold">{cliCommand}</span>
            <button
              onClick={handleCopy}
              className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-sans font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition cursor-pointer"
              title="명령어 복사"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xs dark:border-zinc-800/70 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">한국어 학습 문서</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {totalDocs > 0 ? `${totalDocs}개` : '280+개'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {totalDocs > 0 ? `App Router 관련 문서 ${totalDocs}개` : 'App Router 학습 문서'}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xs dark:border-zinc-800/70 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <PlayCircle className="h-4 w-4" />
              <span className="text-xs font-medium">실습 예제</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {totalDemos > 0 ? `${totalDemos}개` : '241개'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">Next.js 기능을 실행하며 확인</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xs dark:border-zinc-800/70 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <BookmarkCheck className="h-4 w-4" />
              <span className="text-xs font-medium">핵심 기술 용어</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              48개
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">알파벳 색인 & 상세 해설</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xs dark:border-zinc-800/70 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-medium">학습 진도 관리</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              진도율 관리
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">실시간 진도율 & 체크리스트</p>
          </div>
        </div>
      </div>
    </div>
  )
}
