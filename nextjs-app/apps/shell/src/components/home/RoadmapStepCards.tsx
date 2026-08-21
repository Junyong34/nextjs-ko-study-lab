import React from 'react'
import Link from 'next/link'
import {
  Compass,
  Code2,
  BookOpenText,
  FileCode2,
  Cpu,
  ArrowRight,
} from 'lucide-react'

interface StepCard {
  step: string
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  summary: string
  countText: string
  tags: string[]
  href: string
  icon: React.ElementType
}

const ROADMAP_STEPS: StepCard[] = [
  {
    step: 'Step 01',
    title: '시작하기',
    subtitle: 'Getting Started',
    badge: '기초',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    summary: 'Next.js 설치, 기본 프로젝트 구조, 라우팅 및 데이터 페칭 기초를 다룹니다.',
    countText: '18개 챕터',
    tags: ['설치 & 구조', 'Layouts & Pages', 'RSC 경계', '페칭 & 캐싱', '최적화'],
    href: '/getting-started',
    icon: Compass,
  },
  {
    step: 'Step 02',
    title: '실무 가이드',
    subtitle: 'Guides',
    badge: '주제별 가이드',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    summary: '렌더링, Server Actions, 캐싱, 폼 처리, 인증/보안 등 주제별 심층 가이드입니다.',
    countText: '64개 챕터',
    tags: ['렌더링', 'use cache', 'Server Actions', '인증 & 보안', '배포'],
    href: '/guides',
    icon: Code2,
  },
  {
    step: 'Step 03',
    title: 'API 레퍼런스',
    subtitle: 'API Reference',
    badge: 'API 명세',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    summary: '컴포넌트, 내장 함수, 지시어, next.config.js 등 공식 API 명세입니다.',
    countText: '9개 분야',
    tags: ['Components', 'Functions', 'Directives', 'File Conventions', 'Config'],
    href: '/api-reference',
    icon: FileCode2,
  },
  {
    step: 'Step 04',
    title: '용어집',
    subtitle: 'Glossary',
    badge: '용어 사전',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    summary: 'Next.js 공식 문서에서 사용되는 48가지 핵심 기술 용어 사전입니다.',
    countText: '48개 용어',
    tags: ['RSC & Hydration', 'PPR & App Shell', 'Cache Tags', 'Proxy'],
    href: '/glossary',
    icon: BookOpenText,
  },
  {
    step: 'Step 05',
    title: '아키텍처',
    subtitle: 'Architecture',
    badge: '내부 원리',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    summary: 'Turbopack 번들러, SWC 컴파일러, Fast Refresh 등 내부 동작 원리를 다룹니다.',
    countText: '4개 챕터',
    tags: ['Turbopack', 'SWC Compiler', 'Fast Refresh', 'Supported Browsers'],
    href: '/architecture',
    icon: Cpu,
  },
]

export function RoadmapStepCards() {
  return (
    <section id="roadmap" className="space-y-4 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            학습 로드맵
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Next.js 공식 문서를 순서대로 읽고 학습할 수 있도록 구성했습니다.
        </p>
      </div>

      <div className="space-y-3">
        {ROADMAP_STEPS.map((card) => {
          const Icon = card.icon
          const stepId = card.step.toLowerCase().replace(/\s+/g, '-')

          return (
            <Link
              key={card.step}
              id={stepId}
              href={card.href}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md scroll-mt-24 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-600"
            >
              {/* Left: Icon + Step + Title + Summary + Tags */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">
                      {card.step}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                      {card.title}
                    </h3>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                      {card.subtitle}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1">
                    {card.summary}
                  </p>

                  {/* Key tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {card.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Chapter count + Action Arrow */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {card.countText}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline">
                  <span>학습하기</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
