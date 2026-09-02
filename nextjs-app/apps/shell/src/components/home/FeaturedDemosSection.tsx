import React from 'react'
import Link from 'next/link'
import { PlayCircle, ArrowRight, Terminal, Code2, CheckCircle2 } from 'lucide-react'
import type { Demo } from '@study/demos'

interface FeaturedDemoItem {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  zone: string
  demoUrl: string
  docUrl: string
  tags: string[]
}

const FEATURED_DEMOS: FeaturedDemoItem[] = [
  {
    id: 'server-actions-basic',
    title: 'Server Actions 기본 폼 처리',
    subtitle: 'Server Actions Basic Form & Mutations',
    category: 'Guides > Server Actions',
    description: 'Server Action으로 폼을 제출하고 서버 상태가 바뀌는 흐름을 확인합니다.',
    zone: 'demo-baseline',
    demoUrl: '/demo/server-actions/basic',
    docUrl: '/guides/server-actions',
    tags: ['Server Actions', 'Form Action', 'Pending UI'],
  },
  {
    id: 'caching-basic',
    title: 'use cache 컴포넌트 캐싱',
    subtitle: 'Cache Components & revalidateTag',
    category: 'Getting Started > Caching',
    description: "Next.js 16의 'use cache'로 컴포넌트 출력과 비동기 함수 결과를 각각 캐시합니다.",
    zone: 'demo-cache-components',
    demoUrl: '/demo/caching/basic',
    docUrl: '/getting-started/caching',
    tags: ['use cache', 'cacheLife', 'revalidateTag'],
  },
  {
    id: 'layouts-nested',
    title: '중첩 레이아웃 & 부분 렌더링',
    subtitle: 'Partial Rendering & Nested Layouts',
    category: 'Getting Started > Layouts',
    description: '쇼핑몰의 상단 메뉴와 사이드바를 유지하면서 본문만 다시 렌더링하는 흐름을 확인합니다.',
    zone: 'demo-baseline',
    demoUrl: '/demo/layouts-and-pages/nested-layouts',
    docUrl: '/getting-started/layouts-and-pages',
    tags: ['layout.tsx', 'Partial Rendering', 'GNB'],
  },
  {
    id: 'optimistic-cart',
    title: 'React 19 낙관적 장바구니 UI',
    subtitle: 'useOptimistic Real-world Pattern',
    category: 'Getting Started > Mutations',
    description: '서버 응답을 기다리는 동안 장바구니 UI를 먼저 바꾸고, 실패하면 이전 상태로 되돌립니다.',
    zone: 'demo-baseline',
    demoUrl: '/demo/mutating-data/optimistic-cart',
    docUrl: '/getting-started/mutating-data',
    tags: ['useOptimistic', 'React 19', 'Cart UI'],
  },
  {
    id: 'use-promise-streaming',
    title: 'React 19 use(Promise) 스트리밍',
    subtitle: 'use(Promise) & Suspense Streaming',
    category: 'Getting Started > Fetching',
    description: 'React 19의 use()와 Suspense로 늦게 도착하는 구매 후기를 스트리밍합니다.',
    zone: 'demo-baseline',
    demoUrl: '/demo/fetching-data/use-promise-streaming',
    docUrl: '/getting-started/fetching-data',
    tags: ['use(Promise)', 'Suspense', 'Streaming'],
  },
  {
    id: 'proxy-rewrite',
    title: 'Next.js 16 proxy.ts 요청 제어',
    subtitle: 'Proxy Rewrite & Header Injection',
    category: 'Getting Started > Proxy',
    description: 'Next.js 16의 proxy.ts로 요청을 가로채고 경로와 헤더를 바꾸는 흐름을 확인합니다.',
    zone: 'demo-baseline',
    demoUrl: '/demo/proxy/rewrite-and-headers',
    docUrl: '/getting-started/proxy',
    tags: ['proxy.ts', 'Rewrites', 'Header Injection'],
  },
]

export function FeaturedDemosSection({ totalDemos }: { totalDemos: number }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Interactive Labs
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            주요 실습 예제
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            전체 <strong className="text-zinc-900 dark:text-zinc-100">{totalDemos}개</strong> 예제
          </span>
          <Link
            href="/demo"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300 transition"
          >
            전체 보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED_DEMOS.map((demo) => (
          <div
            key={demo.id}
            className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-5 transition hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">
                  <Terminal className="h-3 w-3" />
                  실습 예제
                </span>
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  {demo.category.split('>')[0]}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white">
                  {demo.title}
                </h3>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">{demo.subtitle}</p>
              </div>

              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {demo.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-100/90 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
              <Link
                href={demo.docUrl}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
              >
                관련 문서
              </Link>
              <Link
                href={demo.demoUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                예제 실행
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
