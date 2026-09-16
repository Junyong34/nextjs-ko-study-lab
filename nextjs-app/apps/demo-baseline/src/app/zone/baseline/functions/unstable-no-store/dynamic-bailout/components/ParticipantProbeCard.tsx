import React from 'react'
import type { BranchMode } from '../types'
import { FLASH_SALE_COUPON } from '../types'

const MODE_LABEL: Record<BranchMode, string> = {
  static: 'unstable_noStore() 미사용 — 정적 렌더링 시도',
  'no-store': 'unstable_noStore() 사용 — 강제 다이나믹 렌더링',
}

/**
 * data-rendered-at / data-participants 속성은 장식이 아니라 VerificationFooter가 이 라우트를
 * fetch()로 직접 요청했을 때 실제 서버 렌더 결과를 읽어내는 유일한 통로다.
 */
export function ParticipantProbeCard({
  mode,
  participants,
  renderedAt,
}: {
  mode: BranchMode
  participants: number
  renderedAt: string
}) {
  const isDynamic = mode === 'no-store'

  return (
    <div
      data-no-store-probe={mode}
      data-rendered-at={renderedAt}
      data-participants={participants}
      className={`rounded border p-3.5 text-sm ${
        isDynamic
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40'
          : 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{MODE_LABEL[mode]}</span>
        <span className="rounded bg-white/70 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-black/30 dark:text-zinc-300">
          /{mode}-branch
        </span>
      </div>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        {FLASH_SALE_COUPON.name} · 마감 {FLASH_SALE_COUPON.expiresAt}
      </p>
      <p className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
        실시간 참여 {participants.toLocaleString('ko-KR')}명
      </p>
      <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">서버 렌더 시각: {renderedAt}</p>
    </div>
  )
}
