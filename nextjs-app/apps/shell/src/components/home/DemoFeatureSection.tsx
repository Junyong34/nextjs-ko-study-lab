import React from 'react'
import Link from 'next/link'
import { PlayCircle, CheckCircle2, SplitSquareVertical, ArrowRight, Laptop, MonitorCheck } from 'lucide-react'

export function DemoFeatureSection() {
  return (
    <section id="demos" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Interactive Laboratory</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100 mt-1">
            ⚡ 인터랙티브 실습 데모 랩
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          개념을 읽는 것에 그치지 않고, 브라우저와 독립 데모 환경에서 실제 동작을 즉시 검증합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Feature 1: Inline Demo */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-4">
              <Laptop className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              본문 인라인 실습 (Inline Demos)
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              문서 본문을 읽는 도중 삽입된 <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">DemoFrame</code>을 통해 다른 탭으로 이동할 필요 없이 즉시 코드를 실행하고 인터랙션을 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>문서와 실습의 자연스러운 결합</span>
          </div>
        </div>

        {/* Feature 2: Multi-zone Isolated Lab */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-4">
              <SplitSquareVertical className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              독립 데모 랩 (Multi-zones)
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              전체 데모 목록을 한눈에 둘러보고, Next.js 독립 존(Multi-zones)으로 격리된 실습 화면에서 설정별 동작 차이를 집중 분석할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              <span>전체 실습 데모 둘러보기</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature 3: Expected vs Actual Verification Panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-4">
              <MonitorCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              기대값 vs 실제값 검증 패널
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              각 데모 화면 하단에 공식 문서가 명시한 기대 동작(Expected)과 실제 서버/클라이언트 상태(Actual)를 실시간 비교해 주는 검증 패널이 탑재되어 있습니다.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>이론과 실제 결과의 일치성 검증</span>
          </div>
        </div>
      </div>
    </section>
  )
}
