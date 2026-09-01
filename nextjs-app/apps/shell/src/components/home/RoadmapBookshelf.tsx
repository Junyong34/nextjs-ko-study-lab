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

/** 로드맵 챕터 subtitle → 데모 카테고리 매핑. 용어집은 연결된 데모가 없어 매핑에서 제외됩니다. */
const DEMO_CATEGORY_BY_SUBTITLE: Partial<Record<string, DemoIndexCategory>> = {
  'Getting Started': 'Getting Started',
  Guides: 'Guides',
  'API Reference': 'API Reference',
  Architecture: 'Architecture',
}

/** 표지 색 — 학습/데모 2가지 그레이 톤(원톤)으로만 구분한다(순검정 회피: 다크 차콜 vs 라이트 그레이). */
const BAND = {
  study: { fill: 'bg-zinc-700', text: 'text-white', tagText: 'text-white/70', label: '문서' },
  demo: { fill: 'bg-zinc-300', text: 'text-zinc-900', tagText: 'text-zinc-900/60', label: '실습' },
} as const

const BOOK_WIDTH = 192
const BOOK_DEPTH = 38

function BookCover({ tone, step, koreanTitle, title }: { tone: keyof typeof BAND; step: string; koreanTitle: string; title: string }) {
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

function ChapterShelf({ chapter, demoCount, category }: { chapter: ChapterItem; demoCount: number; category?: DemoIndexCategory }) {
  return (
    <div className="space-y-3 border-b-4 border-zinc-200 pb-6 dark:border-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{chapter.summary}</p>

      <div className="flex flex-wrap items-end gap-6">
        <Link href={chapter.href} className="shrink-0" aria-label={`${chapter.title} 학습하기`}>
          <Book coverClassName={BAND.study.fill} depth={BOOK_DEPTH} width={BOOK_WIDTH}>
            <BookCover tone="study" step={chapter.step} koreanTitle={chapter.title} title={chapter.subtitle} />
          </Book>
        </Link>

        {category && demoCount > 0 && (
          <Link
            href={{ pathname: '/demo', query: { category } }}
            className="shrink-0"
            aria-label={`${chapter.title} 데모 보기`}
          >
            <Book coverClassName={BAND.demo.fill} depth={BOOK_DEPTH} width={BOOK_WIDTH}>
              <BookCover tone="demo" step={chapter.step} koreanTitle={chapter.title} title={chapter.subtitle} />
            </Book>
          </Link>
        )}
      </div>
    </div>
  )
}

export function RoadmapBookshelf({ demos }: RoadmapBookshelfProps) {
  return (
    <section id="bookshelf" className="space-y-4 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            Next.js 학습하기
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          챕터별 문서와 데모 페이지 가이드를 책 표지로 살펴보고 바로 시작해 보세요.
        </p>
      </div>

      <div className="space-y-8">
        {ROADMAP_STEPS.map((chapter) => {
          const category = DEMO_CATEGORY_BY_SUBTITLE[chapter.subtitle]
          const demoCount = category ? demos.filter((demo) => getDemoCategory(demo) === category).length : 0

          return <ChapterShelf key={chapter.step} chapter={chapter} demoCount={demoCount} category={category} />
        })}
      </div>
    </section>
  )
}
