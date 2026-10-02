'use client'
import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useSlashProbes } from '../hooks/useSlashProbes'
import { BASE } from '../lib/cases'
import { CaseTable } from './CaseTable'
import { ConceptQuiz } from './ConceptQuiz'
import { ConfigExplainer } from './ConfigExplainer'
import { VerificationFooter } from './VerificationFooter'

export function TrailingSlashLab() {
  const s = useSlashProbes()
  return (
    <>
      <DemoPlaygroundCard title="현재 설정(false) 실측 · probe/route.ts" className="min-w-0">
        <div className="min-w-0 space-y-6 text-sm">
          <section className="space-y-3" aria-label="현재 설정 실측">
            <h3 className="font-semibold">1. 이 앱의 실제 응답 (trailingSlash 미지정 = false)</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              [요청]을 누르면 Route Handler가 같은 앱에 <code>fetch(url, {'{'} redirect: &apos;manual&apos; {'}'})</code>를 보내
              리다이렉트를 따라가지 않은 원래 응답의 상태 코드와 Location을 읽어 옵니다. 대상은 실제
              <code> catalog/page.tsx</code>와 <code>catalog/spec.txt/route.ts</code>입니다.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={s.runAll}
                disabled={s.pendingId !== null}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {s.pendingId === 'all' ? '요청 중...' : `전체 요청 (${s.summary.total}개)`}
              </button>
              <a href={`${BASE}/catalog/?sort=price`} className="rounded border border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-700">
                catalog/?sort=price 직접 열기
              </a>
              <span className="text-xs text-zinc-500">실행 {s.summary.ran} / {s.summary.total}</span>
              <DemoResetButton onReset={s.reset} className="ml-auto" />
            </div>
            <CaseTable outcomes={s.outcomes} predictions={s.predictions} pendingId={s.pendingId} onPredict={s.predict} onRun={s.run} />
            <p className="text-xs text-zinc-500">
              [직접 열기]는 브라우저가 308을 따라간 뒤 catalog 페이지가 읽은 주소를 보여 줍니다. &quot;true였다면&quot; 열은 Next.js
              소스의 규칙으로 정리한 설명이며 이 앱에서 측정한 값이 아닙니다.
            </p>
          </section>
          <section className="space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800" aria-label="trailingSlash: true 설명">
            <h3 className="font-semibold">2. trailingSlash: true (설명 · 개념 확인)</h3>
            <ConfigExplainer />
            <ConceptQuiz />
          </section>
        </div>
      </DemoPlaygroundCard>
      <div aria-live="polite">
        <VerificationFooter summary={s.summary} />
      </div>
    </>
  )
}
