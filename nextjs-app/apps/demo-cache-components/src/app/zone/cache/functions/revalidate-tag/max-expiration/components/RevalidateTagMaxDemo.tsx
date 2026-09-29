'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { revisePromoBannerAction, reviseRecallNoticeAction } from '../actions'
import { VerificationFooter } from './VerificationFooter'
import type { NoticeReviseResult, NoticeSnapshot } from '../types'

interface RevalidateTagMaxDemoProps {
  promo: NoticeSnapshot
  recall: NoticeSnapshot
}

interface PolicyState {
  result: NoticeReviseResult | null
  baselineRefresh: number
  convergedAt: number | null
}

const INITIAL_POLICY_STATE: PolicyState = { result: null, baselineRefresh: 0, convergedAt: null }

function PolicyPanel({
  label,
  callLabel,
  snapshot,
  state,
  isPending,
  onRevise,
}: {
  label: string
  callLabel: string
  snapshot: NoticeSnapshot
  state: PolicyState
  isPending: boolean
  onRevise: () => void
}) {
  const converged = state.result !== null && state.convergedAt !== null
  const waiting = state.result !== null && state.convergedAt === null

  return (
    <div className="space-y-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{label}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
            converged
              ? 'bg-emerald-600 text-white'
              : waiting
                ? 'bg-amber-500 text-white'
                : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {converged ? `반영 완료 · 새로고침 ${state.convergedAt}회 만에` : waiting ? '반영 대기 (새로고침 필요)' : '대기 중'}
        </span>
      </div>

      <div className="rounded border border-zinc-200 bg-white p-2.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <div className="text-zinc-500">캐시된 조회: cacheId #{snapshot.cacheId} · rev {snapshot.entry.revision} · {snapshot.generatedAt}</div>
        <div className="mt-1 font-bold text-zinc-900 dark:text-zinc-100">{snapshot.entry.headline}</div>
      </div>

      {state.result && (
        <div className="rounded border border-emerald-200 bg-emerald-50/50 p-2.5 font-mono text-[11px] text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
          <div>액션 응답: {state.result.versionId} · rev {state.result.entry.revision} · {state.result.timestamp}</div>
          <div className="mt-1 font-bold">{state.result.entry.headline}</div>
        </div>
      )}

      <button
        type="button"
        onClick={onRevise}
        disabled={isPending}
        className="w-full cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {callLabel}
      </button>
    </div>
  )
}

export function RevalidateTagMaxDemo({ promo, recall }: RevalidateTagMaxDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [refreshCount, setRefreshCount] = useState(0)
  const [promoState, setPromoState] = useState<PolicyState>(INITIAL_POLICY_STATE)
  const [recallState, setRecallState] = useState<PolicyState>(INITIAL_POLICY_STATE)

  useEffect(() => {
    if (promoState.result && promoState.convergedAt === null && promo.entry.revision === promoState.result.entry.revision) {
      setPromoState((s) => (s.convergedAt === null ? { ...s, convergedAt: refreshCount - s.baselineRefresh } : s))
    }
  }, [promo.entry.revision, promoState, refreshCount])

  useEffect(() => {
    if (recallState.result && recallState.convergedAt === null && recall.entry.revision === recallState.result.entry.revision) {
      setRecallState((s) => (s.convergedAt === null ? { ...s, convergedAt: refreshCount - s.baselineRefresh } : s))
    }
  }, [recall.entry.revision, recallState, refreshCount])

  const handleRevisePromo = () => {
    startTransition(async () => {
      const res = await revisePromoBannerAction()
      setPromoState({ result: res, baselineRefresh: refreshCount, convergedAt: null })
    })
  }

  const handleReviseRecall = () => {
    startTransition(async () => {
      const res = await reviseRecallNoticeAction()
      setRecallState({ result: res, baselineRefresh: refreshCount, convergedAt: null })
    })
  }

  const handleRefresh = () => {
    setRefreshCount((n) => n + 1)
    router.refresh()
  }

  return (
    <>
      <DemoPlaygroundCard title="revalidateTag() profile 비교 (cachedData.ts / actions.ts)">
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PolicyPanel
              label="정책 A · revalidateTag(tag, 'max')"
              callLabel="프로모션 배너 수정 실행"
              snapshot={promo}
              state={promoState}
              isPending={isPending}
              onRevise={handleRevisePromo}
            />
            <PolicyPanel
              label="정책 B · revalidateTag(tag, { expire: 0 })"
              callLabel="긴급 리콜 공지 수정 실행"
              snapshot={recall}
              state={recallState}
              isPending={isPending}
              onRevise={handleReviseRecall}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isPending}
              className="cursor-pointer rounded border border-zinc-300 bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-800 transition hover:bg-zinc-200 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              새로고침 (router.refresh()) — 총 {refreshCount}회
            </button>
            <DemoResetButton label="예제 초기화" loadingLabel="초기화 중..." />
          </div>

          <p className="text-[11px] text-zinc-500">
            각 [수정 실행] 버튼은 실제 Server Action이며, 위 두 캐시 항목 모두 <code>cacheLife(&apos;max&apos;)</code>로 동일하게
            설정돼 있다. [새로고침]을 반복 클릭하며 어느 카드가 몇 번째 새로고침에서 &quot;반영 완료&quot;로 바뀌는지 비교하라.
          </p>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        promoConvergedAt={promoState.convergedAt}
        recallConvergedAt={recallState.convergedAt}
        promoTriggered={promoState.result !== null}
        recallTriggered={recallState.result !== null}
      />
    </>
  )
}
