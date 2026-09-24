'use client'
import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useJsonLdProbe } from '../hooks/useJsonLdProbe'
import { SsrProbeResult } from './SsrProbeResult'
import { ContrastResult } from './ContrastResult'
import { JsonLdVerification } from './JsonLdVerification'
import type { ProductJsonLd, ProductRecord } from '../types'

interface JsonLdLabProps {
  product: ProductRecord
  jsonLd: ProductJsonLd
  injectionMarker: string
  /** page.tsx(서버 컴포넌트)가 렌더한 상품 상세 + JSON-LD <script> */
  children: React.ReactNode
}

const primaryBtn =
  'inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 cursor-pointer'
const outlineBtn =
  'inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer'

export function JsonLdLab({ product, jsonLd, injectionMarker, children }: JsonLdLabProps) {
  const { ssr, contrast, error, isRunning, runSsrProbe, runContrast, reset } = useJsonLdProbe(
    product,
    jsonLd,
    injectionMarker,
  )

  return (
    <>
      <DemoPlaygroundCard title={'page.tsx(서버 컴포넌트) → <script type="application/ld+json">'}>
        <div className="space-y-4">
          {children}

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={runSsrProbe} disabled={isRunning} className={primaryBtn}>
                {isRunning ? 'HTML 요청 중...' : 'HTML 원문 다시 받아 JSON-LD 검사'}
              </button>
              <button type="button" onClick={runContrast} className={outlineBtn}>
                치환 전/후 파싱 대조
              </button>
            </div>
            <DemoResetButton onReset={reset} />
          </div>

          <div role="status" aria-live="polite" className="space-y-3">
            {error && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {error}
              </div>
            )}
            {ssr && <SsrProbeResult probe={ssr} />}
            {contrast && <ContrastResult items={contrast} />}
            {!ssr && !contrast && !error && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 p-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
                대기 중: 위 두 버튼으로 실제 HTML 원문 검사와 격리 파싱 대조를 실행하세요.
              </div>
            )}
          </div>
        </div>
      </DemoPlaygroundCard>

      <JsonLdVerification ssr={ssr} contrast={contrast} />
    </>
  )
}
