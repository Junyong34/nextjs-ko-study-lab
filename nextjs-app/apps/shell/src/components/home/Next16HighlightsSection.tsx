import React from 'react'
import Link from 'next/link'
import { Sparkles, Zap, Server, ShieldCheck, Database, ArrowUpRight } from 'lucide-react'

interface FeatureHighlight {
  title: string
  subtitle: string
  badge: string
  description: string
  topics: string[]
  href: string
  icon: React.ElementType
}

const HIGHLIGHTS: FeatureHighlight[] = [
  {
    title: 'Cache Components & use cache',
    subtitle: '컴포넌트 단위 캐싱',
    badge: 'Next.js 16 New',
    description:
      "'use cache' 지시어와 cacheLife, cacheTag로 컴포넌트와 비동기 함수의 캐시 수명과 revalidation을 제어합니다.",
    topics: ['use cache', 'cacheLife', 'cacheTag', 'Dynamic I/O'],
    href: '/guides/caching',
    icon: Database,
  },
  {
    title: 'React 19 Server Actions & Hooks',
    subtitle: '풀스택 데이터 변경 처리',
    badge: 'React 19 Core',
    description:
      "Server Actions와 useActionState, useOptimistic, formStatus를 결합하여 JavaScript를 끈 환경에서도 동작하는 점진적 향상과 낙관적 UI를 구현합니다.",
    topics: ['Server Actions', 'useActionState', 'useOptimistic', 'Pending UI'],
    href: '/guides/data-fetching',
    icon: Zap,
  },
  {
    title: 'Async Request APIs & Streaming',
    subtitle: '비동기 런타임과 Suspense 스트리밍',
    badge: 'Breaking Change in 15/16',
    description:
      'params, searchParams, cookies(), headers()가 비동기 API로 동작하도록 바뀌어 서버 렌더링을 나누고 필요한 부분을 스트리밍합니다.',
    topics: ['Async params', 'Suspense Streaming', 'loading.tsx', 'Selective Hydration'],
    href: '/guides/routing',
    icon: Server,
  },
  {
    title: 'Turbopack Bundler & Architecture',
    subtitle: 'Rust 기반 번들러를 기본으로 제공',
    badge: 'Default in 16',
    description:
      'next dev와 next build에서 기본으로 사용하는 Turbopack의 구조와 SWC 컴파일러의 동작 방식을 살펴봅니다.',
    topics: ['Turbopack', 'SWC Transformer', 'Fast Refresh', 'Multi-zones'],
    href: '/architecture',
    icon: ShieldCheck,
  },
]

export function Next16HighlightsSection() {
  return (
    <section className="space-y-6">
      <div className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            What&apos;s New in 16
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Next.js 16 주요 변경 사항
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 group-hover:scale-105 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white flex items-center gap-1.5">
                    {item.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-500" />
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{item.subtitle}</p>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
                {item.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md bg-zinc-100/80 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
