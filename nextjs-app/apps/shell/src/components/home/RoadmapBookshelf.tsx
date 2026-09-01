import React from 'react'
import Link from 'next/link'
import { Book, FaviconMark } from '@study/ui'
import type { Demo } from '@study/demos'
import { getDemoCategory, type DemoIndexCategory } from '@/lib/demo-index'

interface ChapterItem {
  step: string
  title: string
  subtitle: string
  summary: string
  href: string
}

const ROADMAP_STEPS: ChapterItem[] = [
  {
    step: 'Step 01',
    title: '시작하기',
    subtitle: 'Getting Started',
    summary: 'Next.js 설치, 기본 프로젝트 구조, 라우팅 및 데이터 페칭 기초를 다룹니다.',
    href: '/getting-started',
  },
  {
    step: 'Step 02',
    title: '실무 가이드',
    subtitle: 'Guides',
    summary: '렌더링, Server Actions, 캐싱, 폼 처리, 인증/보안 등 주제별 심층 가이드입니다.',
    href: '/guides',
  },
  {
    step: 'Step 03',
    title: 'API 레퍼런스',
    subtitle: 'API Reference',
    summary: '컴포넌트, 내장 함수, 지시어, next.config.js 등 공식 API 명세입니다.',
    href: '/api-reference',
  },
  {
    step: 'Step 04',
    title: '용어집',
    subtitle: 'Glossary',
    summary: 'Next.js 공식 문서에서 사용되는 48가지 핵심 기술 용어 사전입니다.',
    href: '/glossary',
  },
  {
    step: 'Step 05',
    title: '아키텍처',
    subtitle: 'Architecture',
    summary: 'Turbopack 번들러, SWC 컴파일러, Fast Refresh 등 내부 동작 원리를 다룹니다.',
    href: '/architecture',
  },
]

interface RoadmapBookshelfProps {
  demos: Demo[]
}

const DEMO_CATEGORY_BY_SUBTITLE: Partial<Record<string, DemoIndexCategory>> = {
  'Getting Started': 'Getting Started',
  Guides: 'Guides',
  'API Reference': 'API Reference',
  Architecture: 'Architecture',
}

/** 표지 색 — 학습/데모 2가지 그레이 톤(원톤)으로만 구분한다 (순검정 회피: 다크 차콜 vs 라이트 그레이). */
const BAND = {
  study: { fill: 'bg-zinc-700', text: 'text-white', tagText: 'text-white/70', label: '문서' },
  demo: { fill: 'bg-zinc-300', text: 'text-zinc-900', tagText: 'text-zinc-900/60', label: '실습' },
} as const

const BOOK_WIDTH = 168
const BOOK_DEPTH = 34

function BookCover({
  tone,
  step,
  koreanTitle,
  title,
}: {
  tone: keyof typeof BAND
  step: string
  koreanTitle: string
  title: string
}) {
  const t = BAND[tone]
  return (
    <div className={`flex h-full flex-col items-start p-4 ${t.fill}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${t.tagText}`}>{t.label}</span>
      <div className="flex flex-1 flex-col justify-center space-y-1.5">
        <p className={`font-mono text-[10px] uppercase ${t.tagText}`}>{step}</p>
        <p className={`text-base font-bold leading-snug ${t.text}`}>{title}</p>
        <p className={`text-xs ${t.tagText}`}>{koreanTitle}</p>
      </div>
      <FaviconMark className="h-4 w-4" />
    </div>
  )
}

export function RoadmapBookshelf({ demos }: RoadmapBookshelfProps) {
  return (
    <section id="bookshelf" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Curriculum Bookshelf
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            5대 핵심 학습 트랙
          </h2>
        </div>
      </div>

      {/* Modern Bookshelf Deck Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROADMAP_STEPS.map((chapter, idx) => {
          const category = DEMO_CATEGORY_BY_SUBTITLE[chapter.subtitle]
          const demoCount = category ? demos.filter((demo) => getDemoCategory(demo) === category).length : 0
          const isLastSingle = idx === 4

          return (
            <div
              key={chapter.step}
              className={`flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white/70 p-6 sm:p-7 shadow-xs transition hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90 ${
                isLastSingle ? 'md:col-span-2' : ''
              }`}
            >
              {/* Chapter Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {chapter.step}
                  </span>
                  {category && demoCount > 0 && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      데모 {demoCount}개
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {chapter.title}
                  <span className="ml-2 text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                    {chapter.subtitle}
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {chapter.summary}
                </p>
              </div>

              {/* Books Row */}
              <div className="flex flex-wrap items-end gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                {/* 1. 학습 문서 책 */}
                <Link
                  href={chapter.href}
                  className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
                  aria-label={`${chapter.title} 학습 문서 보기`}
                >
                  <Book coverClassName={BAND.study.fill} depth={BOOK_DEPTH} width={BOOK_WIDTH}>
                    <BookCover
                      tone="study"
                      step={chapter.step}
                      koreanTitle={chapter.title}
                      title={chapter.subtitle}
                    />
                  </Book>
                </Link>

                {/* 2. 실습 데모 책 */}
                {category && demoCount > 0 && (
                  <Link
                    href={{ pathname: '/demo', query: { category } }}
                    className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
                    aria-label={`${chapter.title} 실습 데모 보기`}
                  >
                    <Book coverClassName={BAND.demo.fill} depth={BOOK_DEPTH} width={BOOK_WIDTH}>
                      <BookCover
                        tone="demo"
                        step={chapter.step}
                        koreanTitle={chapter.title}
                        title={chapter.subtitle}
                      />
                    </Book>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

