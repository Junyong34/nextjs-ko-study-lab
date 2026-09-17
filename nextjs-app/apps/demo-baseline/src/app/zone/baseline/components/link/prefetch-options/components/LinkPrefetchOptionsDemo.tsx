'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { VariantConfig } from '../types'
import { usePrefetchResourceWatch } from './usePrefetchResourceWatch'
import { useViewportSeen } from './useViewportSeen'
import { VerificationFooter } from './VerificationFooter'

const VARIANTS: VariantConfig[] = [
  {
    key: 'auto',
    prefetchProp: undefined,
    label: '상품 A 상세보기 (prefetch 미지정 → 기본값 auto)',
    badge: 'prefetch={null}',
  },
  {
    key: 'full',
    prefetchProp: true,
    label: '상품 B 빠른 구매 (prefetch={true})',
    badge: 'prefetch={true}',
  },
  {
    key: 'false',
    prefetchProp: false,
    label: '상품 C 자주 안 보는 옵션 (prefetch={false})',
    badge: 'prefetch={false}',
  },
]

export function LinkPrefetchOptionsDemo() {
  const scrollBoxRef = useRef<HTMLDivElement>(null)
  const { entries, reset: resetEntries } = usePrefetchResourceWatch()
  const { seen, registerRef } = useViewportSeen(VARIANTS.map((v) => v.key))

  const handleReset = () => {
    resetEntries()
    scrollBoxRef.current?.scrollTo({ top: 0 })
  }

  return (
    <>
      <DemoPlaygroundCard title="상품 목록 → 상세 링크 — 실제 파일: components/LinkPrefetchOptionsDemo.tsx">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              아래 박스 <strong>안에서</strong> 스크롤해 링크 3개를 뷰포트에 진입시키세요. Next.js의 prefetch용
              IntersectionObserver는 실제 브라우저 교차 영역을 기준으로 동작합니다(시뮬레이션 아님).
            </p>
            <DemoResetButton onReset={handleReset} label="관찰 로그 초기화" />
          </div>

          <div
            ref={scrollBoxRef}
            className="h-56 overflow-y-auto rounded border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="flex h-64 items-center justify-center text-[11px] text-zinc-400 dark:text-zinc-500">
              ↓ 아래로 스크롤하세요 ↓
            </div>
            <div className="space-y-2 p-3">
              {VARIANTS.map((variant) => (
                <Link
                  key={variant.key}
                  ref={registerRef(variant.key)}
                  href={`/zone/baseline/components/link/prefetch-options/target/${variant.key}`}
                  prefetch={variant.prefetchProp}
                  className="block rounded border border-zinc-300 bg-white px-3 py-2.5 text-xs font-medium text-zinc-800 shadow-xs transition hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{variant.label}</span>
                    <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {variant.badge}
                    </span>
                  </div>
                  {seen[variant.key] && (
                    <span className="mt-1 inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ 뷰포트 교차 확인됨
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="h-32" />
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter variants={VARIANTS} entries={entries} seen={seen} />
    </>
  )
}
