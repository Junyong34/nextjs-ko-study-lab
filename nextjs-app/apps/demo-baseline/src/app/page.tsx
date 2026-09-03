import type { Metadata } from 'next'
import Link from 'next/link'
import manifest from '@study/demos/manifest'
import { siteUrl, type Demo } from '@study/demos'

const baselineDemos = (manifest as Demo[]).filter((d) => d.zone === 'baseline')

export const metadata: Metadata = {
  title: 'Baseline 데모 카탈로그',
  description: `Next.js App Router 표준 기능 및 아키텍처 실습 예제 카탈로그 (${baselineDemos.length}개 데모)`,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${siteUrl}/`,
    siteName: 'Next.js 학습 데모',
    title: 'Baseline 데모 카탈로그 | Next.js 학습',
    description: `Next.js App Router 표준 기능 및 아키텍처 실습 예제 카탈로그 (${baselineDemos.length}개 데모)`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Next.js Baseline 데모' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baseline 데모 카탈로그 | Next.js 학습',
    description: `Next.js App Router 표준 기능 및 아키텍처 실습 예제 카탈로그 (${baselineDemos.length}개 데모)`,
    images: ['/og-image.png'],
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  architecture: 'Architecture (아키텍처)',
  components: 'Components (내장 컴포넌트)',
  config: 'Configuration (환경 설정)',
  css: 'CSS & 스타일링',
  directives: 'Directives (지시어)',
  edge: 'Edge Runtime',
  'error-handling': 'Error Handling (오류 처리)',
  'fetching-data': 'Data Fetching (데이터 조회)',
  'file-conventions': 'File Conventions (특수 파일 규약)',
  fonts: 'Font Optimization (폰트)',
  functions: 'Functions & Hooks (App Router 함수)',
  guides: 'Guides (실무 가이드)',
  images: 'Image Optimization (이미지)',
  'layouts-and-pages': 'Layouts & Pages (레이아웃 & 페이지)',
  'linking-and-navigating': 'Linking & Navigating (링크 & 내비게이션)',
  'metadata-and-og-images': 'Metadata & Open Graph',
  'mutating-data': 'Mutating Data (데이터 변형)',
  proxy: 'Proxy & Rewrites (프록시 & 리라이트)',
  'route-handlers': 'Route Handlers (라우트 핸들러)',
  'server-actions': 'Server Actions (서버 액션)',
  'server-client-components': 'Server & Client Components',
}

export default function BaselineRootPage() {
  const demos = baselineDemos

  // Group demos by category
  const categoriesMap = new Map<string, Demo[]>()
  for (const demo of demos) {
    const catKey = demo.url.split('/')[0] || 'other'
    const list = categoriesMap.get(catKey) || []
    list.push(demo)
    categoriesMap.set(catKey, list)
  }

  const categoryEntries = Array.from(categoriesMap.entries()).sort(([a], [b]) => a.localeCompare(b))

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Navigation Bar */}
        <nav aria-label="상단 내비게이션" className="mb-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <a
            href={siteUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            메인 학습 허브로 이동
          </a>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300">
            Next.js 16.3.2
          </span>
        </nav>

        {/* Hero Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Next.js App Router Study Lab
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              Baseline Zone
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Next.js Baseline 데모 카탈로그
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Next.js App Router의 표준 기능, 라우팅 컨벤션, 렌더링 아키텍처, 서버 컴포넌트, 캐싱 레거시 등 총 {demos.length}개의 실행 가능한 실습 예제를 제공합니다.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 font-medium">
              총 {demos.length}개 예제
            </span>
            <span className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 font-medium">
              {categoryEntries.length}개 카테고리
            </span>
            <span className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 font-medium">
              포트: 3001
            </span>
          </div>
        </header>

        {/* Categories Section */}
        <section aria-label="데모 카테고리 목록" className="space-y-10">
          {categoryEntries.map(([catKey, catDemos]) => {
            const label = CATEGORY_LABELS[catKey] || catKey
            return (
              <div key={catKey} className="border-t border-zinc-200 dark:border-zinc-800/80 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {label}
                  </h2>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {catDemos.length}개 데모
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catDemos.map((demo) => (
                    <Link
                      key={demo.url}
                      href={`/zone/baseline/${demo.url}`}
                      className="group flex flex-col justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 shadow-xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                            {demo.title}
                          </h3>
                          <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {demo.status === 'done' ? '완료' : '실습'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="truncate max-w-[200px]">{demo.url}</span>
                        <span className="shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <p className="mb-2">Next.js App Router 한국어 학습 랩 — Baseline Zone</p>
          <a
            href={siteUrl}
            className="font-medium underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            메인 학습 허브로 돌아가기
          </a>
        </footer>
      </div>
    </main>
  )
}
