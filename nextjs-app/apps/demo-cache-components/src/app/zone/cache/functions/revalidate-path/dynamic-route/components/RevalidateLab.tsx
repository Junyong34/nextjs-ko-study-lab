'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useProductFrames } from '../hooks/useProductFrames'
import { LITERAL_TARGET_ID, PRODUCT_IDS, PRODUCT_PATTERN, productPath } from '../paths'
import type { RevalidateMode } from '../types'
import { RoundTable } from './RoundTable'
import { VerificationPanel } from './VerificationPanel'

const BUTTONS: { mode: RevalidateMode; label: string; code: string; tone: string }[] = [
  { mode: 'literal', label: '구체 경로', code: `revalidatePath('.../products/${LITERAL_TARGET_ID}')`, tone: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' },
  { mode: 'pattern-page', label: '패턴 + page', code: "revalidatePath('.../products/[id]', 'page')", tone: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' },
  { mode: 'pattern-no-type', label: '패턴, type 누락', code: "revalidatePath('.../products/[id]')", tone: 'border border-zinc-300 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200' },
  { mode: 'reload', label: '대조군: 다시 요청만', code: 'revalidatePath 호출 없음', tone: 'border border-zinc-300 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200' },
]

export function RevalidateLab() {
  const { frameKey, round, busy, ready, run, reset } = useProductFrames()

  return (
    <>
      <DemoPlaygroundCard title="상품 상세 products/[id] 캐시 무효화 비교">
        <div className="space-y-4 text-sm">
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 break-keep">
            아래 세 칸은 실제 라우트 <code className="font-mono">{PRODUCT_PATTERN}</code>를 id별로 요청한 iframe입니다.
            cacheId는 <code className="font-mono">&apos;use cache&apos;</code> 함수 안에서 만들어지므로 캐시가 재생성될 때만 바뀌고,
            요청 시각은 매 요청마다 바뀝니다.
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PRODUCT_IDS.map((id) => (
              <iframe
                key={`${id}-${frameKey}`}
                src={productPath(id)}
                title={`products/${id}`}
                className="h-28 w-full rounded border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BUTTONS.map((b) => (
              <button
                key={b.mode}
                type="button"
                disabled={busy || !ready}
                onClick={() => run(b.mode)}
                className={`cursor-pointer rounded-md px-3 py-2 text-left text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${b.tone}`}
              >
                <div>{b.label}</div>
                <div className="mt-0.5 break-all font-mono text-[10px] font-normal opacity-80">{b.code}</div>
              </button>
            ))}
          </div>

          {!ready && <p className="text-[11px] text-amber-600">상품 iframe 3개의 초기 값을 기다리는 중...</p>}
          {round && <RoundTable round={round} />}

          <div className="flex justify-end">
            <DemoResetButton label="비교 기록 초기화" onReset={reset} />
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationPanel round={round} busy={busy} />
    </>
  )
}
