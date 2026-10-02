'use client'

import React, { type ReactNode } from 'react'
import Link from 'next/link'
import { DemoContainer, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useDynamicProbe } from '../hooks/useDynamicProbe'
import { useNavigationState } from '../hooks/useNavigationState'
import { useRscLog } from '../hooks/useRscLog'
import { judge } from '../lib/judge'
import { BASE, PRODUCTS } from '../lib/products'
import { ConceptQuiz } from './ConceptQuiz'
import { ExportExplainer } from './ExportExplainer'
import { Guide } from './Guide'
import { RscRequestTable } from './RscRequestTable'
import { VerificationFooter } from './VerificationFooter'

const LINKS = [{ href: '', label: '상품 목록' }, ...PRODUCTS.map((p) => ({ href: `/products/${p.id}`, label: p.name }))]
const btn = 'rounded border border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-700'

export function ClientRoutingLab({ children }: { children: ReactNode }) {
  const { requests, clear } = useRscLog()
  const { state, addToCart, reset: resetNav } = useNavigationState()
  const dynamic = useDynamicProbe()
  const checks = judge(requests, state, dynamic.probes)

  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <Guide />
      <DemoPlaygroundCard title="layout.tsx + products/[id] (실제 라우트와 <Link>)" className="min-w-0">
        <div className="min-w-0 space-y-6 text-sm">
          <section className="space-y-3" aria-label="클라이언트 탐색 실측">
            <h3 className="font-semibold">1. 이 앱에서 Link 이동이 보내는 요청 (서버 모드 실측)</h3>
            <div className="flex flex-wrap items-center gap-2">
              {LINKS.map((l) => (
                <Link key={l.label} href={`${BASE}${l.href}`} className={btn}>{l.label}</Link>
              ))}
              <button type="button" onClick={addToCart} className={btn}>장바구니 담기 ({state.cartCount})</button>
              <DemoResetButton
                className="ml-auto"
                onReset={() => {
                  clear()
                  resetNav()
                  dynamic.reset()
                }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              usePathname: <code>{state.pathname}</code> · 클라이언트 탐색 {state.softNavigations}회 · 장바구니 {state.cartCount}개 (레이아웃 상태)
            </p>
            {children}
            <RscRequestTable requests={requests} />
          </section>
          <section className="space-y-3" aria-label="동적 경로 확인">
            <h3 className="font-semibold">2. generateStaticParams 밖의 상세 경로</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={dynamic.run} disabled={dynamic.busy} className={btn}>
                {dynamic.busy ? '요청 중...' : '상세 경로 문서 요청 (목록 안 · 목록 밖)'}
              </button>
              <span className="font-mono text-xs">
                {dynamic.error ?? dynamic.probes?.map((p) => `${p.path} → ${p.status}`).join(' · ') ?? '대기'}
              </span>
            </div>
          </section>
          <section className="space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800" aria-label="output export 설명">
            <h3 className="font-semibold">3. output: &apos;export&apos; (설명 · 개념 확인)</h3>
            <ExportExplainer />
            <ConceptQuiz />
          </section>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter checks={checks} />
    </DemoContainer>
  )
}
