'use client'
import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useCspProbe } from '../hooks/useCspProbe'
import { judge } from '../lib/judge'
import { NoncePanel } from './NoncePanel'
import { VerificationFooter } from './VerificationFooter'

const btn =
  'rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'

export function CspLab({ nonce, requestCsp }: { nonce: string | null; requestCsp: string | null }) {
  const p = useCspProbe(nonce)
  const checks = judge(p.page, p.samples, p.injection)

  return (
    <>
      <DemoPlaygroundCard title="nonce-injection/page.tsx — headers()로 읽은 nonce를 스크립트에 적용">
        <div className="space-y-4">
          <NoncePanel nonce={nonce} requestCsp={requestCsp} page={p.page} samples={p.samples} injection={p.injection} />
          <div ref={p.hostRef} aria-hidden className="hidden" />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={btn} onClick={p.requestNonce} disabled={p.busy || !nonce}>
              새 요청으로 nonce 확인
            </button>
            <button type="button" className={btn} onClick={p.inject} disabled={p.busy || !nonce}>
              XSS 주입 시도
            </button>
            <DemoResetButton onReset={p.reset} label="측정 초기화" />
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => window.location.reload()}
            >
              페이지 새로고침
            </button>
          </div>
          {p.error && <p className="text-[11px] text-rose-600">요청 실패: {p.error}</p>}
          <p className="text-[11px] leading-relaxed text-zinc-500">
            [새 요청]은 이 페이지 URL을 fetch로 다시 받아 응답 헤더와 HTML을 대조합니다. [XSS 주입 시도]는 nonce 없는 onerror
            핸들러를 가진 요소를 DOM에 넣어 브라우저가 막는지 봅니다.
          </p>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter checks={checks} />
    </>
  )
}
