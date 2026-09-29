'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { incrementViaUpdateTagAction, incrementViaRevalidateTagAction } from '../actions'
import { VerificationFooter } from './VerificationFooter'
import type { CartQtyActionResult, CartQtySnapshot } from '../types'

interface UpdateTagInstantDemoProps {
  updateTagCache: CartQtySnapshot
  revalidateTagCache: CartQtySnapshot
}

export function UpdateTagInstantDemo({ updateTagCache, revalidateTagCache }: UpdateTagInstantDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [updateTagResult, setUpdateTagResult] = useState<CartQtyActionResult | null>(null)
  const [revalidateTagResult, setRevalidateTagResult] = useState<CartQtyActionResult | null>(null)

  const runUpdateTag = () => {
    startTransition(async () => {
      const res = await incrementViaUpdateTagAction()
      setUpdateTagResult(res)
      router.refresh()
    })
  }

  const runRevalidateTag = () => {
    startTransition(async () => {
      const res = await incrementViaRevalidateTagAction()
      setRevalidateTagResult(res)
      router.refresh()
    })
  }

  const updateTagMatched = updateTagResult !== null ? updateTagCache.qty === updateTagResult.qty : undefined
  const revalidateTagMatched =
    revalidateTagResult !== null ? revalidateTagCache.qty === revalidateTagResult.qty : undefined

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="장바구니 수량 변경 — updateTag() vs revalidateTag()" className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2.5 rounded-lg border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-sans font-bold text-blue-950 dark:text-blue-200">updateTag() 흐름</span>
              <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                cart-qty-update-tag
              </code>
            </div>
            <div className="rounded bg-white/70 p-2.5 font-mono text-xs dark:bg-zinc-950/40">
              <div className="text-zinc-500">
                캐시된 조회 #{updateTagCache.cacheId} · {updateTagCache.generatedAt}
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">수량 {updateTagCache.qty}개</div>
            </div>
            <div className="rounded bg-white/70 p-2.5 font-mono text-xs dark:bg-zinc-950/40">
              <div className="text-zinc-500">액션 응답{updateTagResult ? ` · ${updateTagResult.timestamp}` : ''}</div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">
                {updateTagResult ? `수량 ${updateTagResult.qty}개` : '아직 실행하지 않음'}
              </div>
            </div>
            <button
              type="button"
              onClick={runUpdateTag}
              disabled={isPending}
              className="w-full cursor-pointer rounded bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {isPending ? '처리 중...' : 'updateTag 실행 (수량 +1)'}
            </button>
          </div>

          <div className="space-y-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-sans font-bold text-emerald-950 dark:text-emerald-200">revalidateTag() 흐름</span>
              <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                cart-qty-revalidate-tag
              </code>
            </div>
            <div className="rounded bg-white/70 p-2.5 font-mono text-xs dark:bg-zinc-950/40">
              <div className="text-zinc-500">
                캐시된 조회 #{revalidateTagCache.cacheId} · {revalidateTagCache.generatedAt}
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">수량 {revalidateTagCache.qty}개</div>
            </div>
            <div className="rounded bg-white/70 p-2.5 font-mono text-xs dark:bg-zinc-950/40">
              <div className="text-zinc-500">
                액션 응답{revalidateTagResult ? ` · ${revalidateTagResult.timestamp}` : ''}
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">
                {revalidateTagResult ? `수량 ${revalidateTagResult.qty}개` : '아직 실행하지 않음'}
              </div>
            </div>
            <button
              type="button"
              onClick={runRevalidateTag}
              disabled={isPending}
              className="w-full cursor-pointer rounded bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isPending ? '처리 중...' : 'revalidateTag 실행 (수량 +1)'}
            </button>
          </div>
        </div>

        {(updateTagResult || revalidateTagResult) && (
          <div className="space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {updateTagResult && (
              <p>
                {updateTagMatched
                  ? 'updateTag 실행 후 새로고침 1회만으로 캐시된 조회 수량이 액션 응답과 곧바로 같아졌습니다.'
                  : '캐시된 조회 수량이 아직 액션 응답과 다릅니다 — 새로고침이 진행 중일 수 있습니다.'}
              </p>
            )}
            {revalidateTagResult && (
              <p>
                {revalidateTagMatched
                  ? 'revalidateTag 실행 후 캐시된 조회 수량도 액션 응답과 같아졌습니다 — 백그라운드 재검증이 이미 끝난 상태입니다.'
                  : 'revalidateTag 실행 직후에는 캐시된 조회 수량이 액션 응답보다 지연될 수 있습니다(stale-while-revalidate) — 버튼을 한 번 더 누르거나 새로고침을 반복해 값이 따라잡는지 관찰하세요.'}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <DemoResetButton label="화면 초기화" />
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        updateTagCache={updateTagCache}
        revalidateTagCache={revalidateTagCache}
        updateTagResult={updateTagResult}
        revalidateTagResult={revalidateTagResult}
      />
    </div>
  )
}
