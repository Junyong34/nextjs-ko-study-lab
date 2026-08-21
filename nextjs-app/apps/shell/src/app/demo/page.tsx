import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PlayCircle, Layers, BookOpen, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { getDemos, getManifest, type Demo } from '@/lib/docs'

export const metadata: Metadata = {
  title: '인터랙티브 데모 색인',
  description: 'Next.js App Router 공식 문서와 연계된 데모 실습 데모 목록',
}

export default function DemoIndexPage() {
  const demos = getDemos()
  const manifest = getManifest()

  // Match doc URLs
  const getDocUrlForDemo = (demoDoc: string) => {
    const matched = manifest.docs.find(
      (d) => d.path === demoDoc || d.path.endsWith(demoDoc)
    )
    return matched ? matched.url : '/'
  }

  const doneCount = demos.filter((d) => d.status === 'done').length
  const totalCount = demos.length

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 mb-2">
          <PlayCircle className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Interactive Demos
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          실습 데모
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Next.js App Router 핵심 기능과 동작 원리를 다중 존(Multi-zones) 아키텍처 기반의 인터랙티브 데모로 직접 실험하고 검증합니다.
        </p>

        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              총 데모 수
            </span>
            <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalCount}개
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              구현 완료
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {doneCount}
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              아키텍처
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Layers className="h-4 w-4" />
              <span>Multi-zones (Rewrites)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demos Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          데모 목록 ({demos.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {demos.map((demo) => {
            const docUrl = getDocUrlForDemo(demo.doc)
            const isDone = demo.status === 'done'

            return (
              <div
                key={demo.url}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {demo.url}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#14161a0f] px-2 py-0.5 text-[11px] font-medium text-zinc-800 dark:bg-white/10 dark:text-zinc-200">
                        <Layers className="h-3 w-3" />
                        zone: {demo.zone}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      <span>{demo.status.toUpperCase()}</span>
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                    <Link href={`/demo/${demo.url}`}>{demo.title}</Link>
                  </h3>

                  <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>관련 문서: </span>
                    <Link
                      href={docUrl}
                      className="text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
                    >
                      {demo.doc}
                    </Link>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <span className="text-xs text-zinc-400">
                    독립 실행 환경 호스팅
                  </span>

                  <Link
                    href={`/demo/${demo.url}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    <span>데모 열기</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
