import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROADMAP_STEPS } from './roadmap-data'

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
