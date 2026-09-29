'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { purchaseRemoteStockAction, restockRemoteStockAction } from '../actions'
import type { PodInstance, RemoteStockActionResult, RemoteStockSnapshot } from '../types'

interface DirectiveUseCacheRemoteDemoProps {
  pods: PodInstance[]
  snapshots: RemoteStockSnapshot[]
}

export function DirectiveUseCacheRemoteDemo({ pods, snapshots }: DirectiveUseCacheRemoteDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastAction, setLastAction] = useState<RemoteStockActionResult | null>(null)
  const [prevCacheId, setPrevCacheId] = useState<string | null>(null)

  const currentCacheId = snapshots[0]?.cacheId ?? null
  const cacheCaughtUp = prevCacheId !== null && prevCacheId !== currentCacheId

  const runAction = (action: () => Promise<RemoteStockActionResult>) => {
    setPrevCacheId(currentCacheId)
    startTransition(async () => {
      const result = await action()
      setLastAction(result)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 공유 원격 캐시 풀 상태 및 안내 */}
      <div className="rounded-xl border border-blue-300 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2 dark:border-blue-900">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              USE CACHE: REMOTE
            </span>
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200 font-mono">
              getRemoteStockSnapshot() · cacheTag(&apos;remote-redis-cache:stock&apos;)
            </span>
          </div>
          <button
            type="button"
            onClick={() => runAction(restockRemoteStockAction)}
            disabled={isPending}
            className="rounded border border-blue-300 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-300 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            재고 보충 (25개로 초기화)
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          이 dev 환경은 <code>cacheHandlers</code> 미설정 시의 기본 in-memory 원격 캐시 풀을 사용하며, 운영
          환경에서는 <code>cacheHandlers.remote</code>로 Redis 등 실제 원격 스토리지를 연결합니다. 이 데모는
          리전 간 실시간 동기화 자체를 검증하는 것이 아니라, 아래 3개 화면(카드)이 같은 공유 캐시 풀을
          읽는다는 것만 보여줍니다.
        </p>
      </div>

      {/* 2. 3개 화면(카드) — 실제 분산 인프라 없이 같은 공유 캐시 풀을 각자 독립 조회 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pods.map((pod, i) => {
          const snapshot = snapshots[i]
          return (
            <div
              key={pod.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                  {pod.name}
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  cacheId #{snapshot.cacheId}
                </span>
              </div>

              <div className="text-[10px] text-zinc-400 font-mono">
                {pod.region} (리전 표기용 — 실제 분산 인프라 아님)
              </div>

              <div className="rounded bg-zinc-50 p-2 text-center dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                <div className="text-[10px] text-zinc-500">공유 캐시 풀에서 읽은 재고</div>
                <div className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {snapshot.stock}개
                </div>
              </div>

              <button
                type="button"
                onClick={() => runAction(purchaseRemoteStockAction)}
                disabled={isPending || snapshot.stock <= 0}
                className={`w-full rounded py-1.5 text-xs font-semibold text-white shadow-2xs transition cursor-pointer ${
                  snapshot.stock <= 0
                    ? 'bg-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
                }`}
              >
                {snapshot.stock <= 0 ? '품절 (매진)' : '주문 구매 (재고 -1)'}
              </button>
            </div>
          )
        })}
      </div>

      {/* 3. 방금 실행한 액션의 즉시 응답과 공유 캐시 풀 추적 결과 */}
      {lastAction && (
        <p className="text-[11px] text-zinc-500">
          {cacheCaughtUp
            ? `공유 캐시 풀이 갱신되어 cacheId가 #${prevCacheId} → #${currentCacheId}로 바뀌었고, 3개 화면 모두 새 재고(${lastAction.stock}개)를 함께 읽었습니다.`
            : `액션 응답은 재고 ${lastAction.stock}개(${lastAction.timestamp})로 즉시 최신이지만, revalidateTag(tag, 'max')는 stale-while-revalidate라 화면이 이 값을 따라잡는 데 새로고침이 한 번 더 필요할 수 있습니다.`}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <DemoResetButton label="화면 상태 초기화" />
      </div>
    </div>
  )
}
