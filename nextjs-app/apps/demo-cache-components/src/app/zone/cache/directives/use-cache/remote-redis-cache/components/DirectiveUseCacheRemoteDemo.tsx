'use client'

import React, { useState, useTransition } from 'react'

interface PodInstance {
  id: string
  region: string
  name: string
  lastSyncTime: string
}

export function DirectiveUseCacheRemoteDemo() {
  const [remoteStock, setRemoteStock] = useState<number>(25)
  const [totalOrders, setTotalOrders] = useState<number>(0)
  const [lastMutatingPod, setLastMutatingPod] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const pods: PodInstance[] = [
    { id: 'pod-icn-01', region: 'Seoul (ap-northeast-2)', name: 'Instance-Seoul-1', lastSyncTime: '실시간' },
    { id: 'pod-icn-02', region: 'Seoul (ap-northeast-2)', name: 'Instance-Seoul-2', lastSyncTime: '실시간' },
    { id: 'pod-nrt-01', region: 'Tokyo (ap-northeast-1)', name: 'Instance-Tokyo-1', lastSyncTime: '실시간' },
  ]

  const handlePurchase = (podId: string) => {
    if (remoteStock <= 0) return
    startTransition(() => {
      setRemoteStock((prev) => Math.max(0, prev - 1))
      setTotalOrders((prev) => prev + 1)
      setLastMutatingPod(podId)
    })
  }

  const handleRestock = () => {
    startTransition(() => {
      setRemoteStock(25)
      setLastMutatingPod(null)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 글로벌 Redis 원격 공유 캐시 상태 */}
      <div className="rounded-xl border border-blue-300 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2 dark:border-blue-900">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              REDIS REMOTE L2
            </span>
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200 font-mono">
              use cache: remote (Shared CacheHandler)
            </span>
          </div>
          <span className="font-mono text-xs text-blue-800 dark:text-blue-300">
            원격 캐시 키: <strong>flash_sale:stock:PROD-LIMITED-01</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              [한정 수량] 타임세일 프리미엄 블루투스 헤드폰
            </div>
            <div className="text-[11px] text-zinc-500">
              다중 인스턴스 간 원격 Redis 캐시 레이어를 통해 실시간 분산 원자적 재고 동기화
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">글로벌 잔여 재고</div>
              <div className="font-mono text-xl font-extrabold text-blue-600 dark:text-blue-400">
                {remoteStock}개 <span className="text-xs font-normal text-zinc-400">/ 25개</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRestock}
              className="rounded border border-blue-300 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-300 cursor-pointer shadow-2xs"
            >
              재고 보충 (+25)
            </button>
          </div>
        </div>
      </div>

      {/* 2. 분산된 3개 파드 인스턴스 뷰 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pods.map((pod) => (
          <div
            key={pod.id}
            className={`rounded-lg border bg-white p-3 shadow-2xs dark:bg-zinc-950 space-y-2 transition ${
              lastMutatingPod === pod.id
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                {pod.name}
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                L1 Sync OK
              </span>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono">
              {pod.region}
            </div>

            <div className="rounded bg-zinc-50 p-2 text-center dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              <div className="text-[10px] text-zinc-500">인스턴스 감지 재고</div>
              <div className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                {remoteStock}개
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePurchase(pod.id)}
              disabled={isPending || remoteStock <= 0}
              className={`w-full rounded py-1.5 text-xs font-semibold text-white shadow-2xs transition cursor-pointer ${
                remoteStock <= 0
                  ? 'bg-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
              }`}
            >
              {remoteStock <= 0 ? '품절 (매진)' : `주문 구매 (재고 -1)`}
            </button>
          </div>
        ))}
      </div>

      {/* 3. 분산 캐시 동작 원리 설명 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
        <div>• <strong>원격 캐시 핸들러 (Redis CacheHandler)</strong>: 모든 분산 서버 인스턴스가 단일 Redis 원격 티어를 공유합니다.</div>
        <div>• <strong>실시간 일관성</strong>: 특정 인스턴스(예: Seoul-1)에서 구매가 발생하여 재고가 차감되면, Tokyo-1 인스턴스에서도 즉시 동일한 최신 재고 수량을 조회합니다.</div>
      </div>
    </div>
  )
}
