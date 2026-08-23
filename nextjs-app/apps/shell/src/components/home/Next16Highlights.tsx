import React from 'react'
import Link from 'next/link'
import { Sparkles, Database, FastForward, ShieldAlert, ArrowRight } from 'lucide-react'

export function Next16Highlights() {
  return (
    <section id="next16-highlights" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>What's New in Next.js 16</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100 mt-1">
            ✨ Next.js 16 핵심 아키텍처 하이라이트
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          기존 캐싱 복잡성을 해소하고 성능을 극대화한 Next.js 16의 새로운 패러다임을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Highlight 1: Cache Components */}
        <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                <Database className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">01</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Cache Components
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              "use cache" & cacheLife()
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              함수나 컴포넌트 단위로 캐시 범위를 선언적으로 지정하며, <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">cacheTag</code>와 <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">updateTag</code>로 필요 시 정밀하게 무효화합니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/guides/incremental-static-regeneration-cache-components"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <span>가이드 보기</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Highlight 2: Turbopack FileSystem Cache */}
        <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                <FastForward className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">02</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Turbopack FileSystem Cache
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              turbopackFileSystemCache
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              디스크에 컴파일 산출물을 영구 캐시하여 개발 서버 재시작 및 후속 빌드 시간을 획기적으로 단축시키는 고속 번들링 파이프라인입니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/architecture"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <span>아키텍처 탐구</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Highlight 3: Proxy Architecture */}
        <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">03</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Proxy Architecture
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              proxy.js (구 Middleware)
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              네트워크 경계에서 요청을 가로채어 rewrite, redirect, 보안 헤더 주입을 수행하는 역할을 명확히 한 신규 파일 규칙입니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/getting-started/proxy"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <span>Proxy 가이드</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
