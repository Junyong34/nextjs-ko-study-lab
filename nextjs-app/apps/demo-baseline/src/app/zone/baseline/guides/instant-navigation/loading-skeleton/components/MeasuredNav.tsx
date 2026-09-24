'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { useNavTiming } from './NavTimingProvider'
import { LOADING_SKELETON_BASE_PATH, SERVER_DELAY_MS, VARIANTS, VARIANT_LABEL, variantHref } from '../types'

const FOLDER_HINT = {
  'with-loading': 'with-loading/loading.tsx + page.tsx',
  'without-loading': 'without-loading/page.tsx (loading.tsx 없음)',
} as const

/** layout에 있어 전환 중에도 유지되는 내비게이션. 기본 <Link>(prefetch 기본값)를 그대로 쓴다. */
export function MeasuredNav() {
  const pathname = usePathname()
  const { startMeasure, reset } = useNavTiming()
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          두 하위 page.tsx는 같은 서버 컴포넌트로, 요청마다 서버에서{' '}
          <code className="font-mono">await connection()</code> 후{' '}
          <strong className="font-mono">{SERVER_DELAY_MS}ms</strong>를 실제로 await합니다. 차이는 loading.tsx 유무뿐입니다.
        </p>
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {isProd ? 'production (next start): 자동 prefetch 동작' : 'development (next dev): 자동 prefetch 없음'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {VARIANTS.map((variant) => {
          const href = variantHref(variant)
          const isCurrent = pathname === href
          const base =
            'flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors'
          if (isCurrent) {
            return (
              <span
                key={variant}
                className={`${base} border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900`}
              >
                <span className="font-semibold">현재 화면: {VARIANT_LABEL[variant]}</span>
                <span className="font-mono text-[10px]">{FOLDER_HINT[variant]}</span>
              </span>
            )
          }
          return (
            <Link
              key={variant}
              href={href}
              onClick={() => startMeasure(variant)}
              className={`${base} border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900`}
            >
              <span className="font-semibold">{VARIANT_LABEL[variant]} 경로로 이동 →</span>
              <span className="font-mono text-[10px] text-zinc-500">{FOLDER_HINT[variant]}</span>
            </Link>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {pathname === LOADING_SKELETON_BASE_PATH ? (
          <span className="text-[11px] text-zinc-500">현재 화면: 시작 화면</span>
        ) : (
          <Link href={LOADING_SKELETON_BASE_PATH} className="text-[11px] text-zinc-600 underline dark:text-zinc-400">
            ← 시작 화면으로
          </Link>
        )}
        <DemoResetButton onReset={reset} label="측정 기록 초기화" />
      </div>
    </div>
  )
}
