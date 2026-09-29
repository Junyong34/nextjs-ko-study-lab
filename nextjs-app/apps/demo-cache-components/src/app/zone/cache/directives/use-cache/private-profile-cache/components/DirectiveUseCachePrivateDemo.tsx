'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { switchPrivateSessionAction } from '../actions'
import { SWITCHABLE_SESSION_IDS } from '../types'
import { VerificationFooter } from './VerificationFooter'
import { SESSION_LABELS, type PrivateProfileCacheResult, type SwitchableSessionId } from '../types'

const RELOAD_STORAGE_PREFIX = 'private-profile-cache-demo:last-instance:'

interface DirectiveUseCachePrivateDemoProps {
  data: PrivateProfileCacheResult
}

export function DirectiveUseCachePrivateDemo({ data }: DirectiveUseCachePrivateDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingTarget, setPendingTarget] = useState<SwitchableSessionId | null>(null)
  const [reloadNote, setReloadNote] = useState<string | null>(null)

  useEffect(() => {
    // 'use cache: private' 결과는 서버에 저장되지 않고 브라우저 메모리에만 캐시된다.
    // sessionStorage에 직전 cacheInstanceId를 남겨, 새로고침 시 값이 바뀌는지 화면에서 바로 비교한다.
    try {
      const key = `${RELOAD_STORAGE_PREFIX}${data.sessionId}`
      const previousInstanceId = window.sessionStorage.getItem(key)
      if (previousInstanceId && previousInstanceId !== data.cacheInstanceId) {
        setReloadNote(
          `이전 조회 cacheInstanceId #${previousInstanceId} → 이번 조회 #${data.cacheInstanceId} (서버에 저장되지 않아 새로고침마다 다시 계산됨)`,
        )
      }
      window.sessionStorage.setItem(key, data.cacheInstanceId)
    } catch {
      // 프라이빗 브라우징 등 sessionStorage 접근이 막힌 환경에서는 관찰 보조 문구만 생략한다.
    }
  }, [data.sessionId, data.cacheInstanceId])

  const handleSwitch = (sessionId: SwitchableSessionId) => {
    setPendingTarget(sessionId)
    startTransition(async () => {
      await switchPrivateSessionAction(sessionId)
      router.refresh()
    })
  }

  const isMatched = pendingTarget === null ? undefined : !isPending && data.sessionId === pendingTarget

  return (
    <>
      <DemoPlaygroundCard title="개인화 주문 내역 (cachedData.ts: getPrivateOrderHistory)">
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap gap-2">
              {SWITCHABLE_SESSION_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSwitch(id)}
                  className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    data.sessionId === id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  {SESSION_LABELS[id]}로 전환
                </button>
              ))}
            </div>
            <DemoResetButton label="페이지 새로고침" loadingLabel="새로고침 중..." />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
              <div className="text-zinc-800 dark:text-zinc-200">
                <span className="font-bold">현재 세션: </span>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-blue-600 dark:bg-zinc-900 dark:text-blue-400">
                  {SESSION_LABELS[data.sessionId]}
                </code>
                {data.tier && <span className="ml-1.5 text-[11px] text-zinc-400">({data.tier})</span>}
              </div>
              <span className="text-[11px] text-zinc-400">
                cacheInstanceId: #{data.cacheInstanceId} · {data.generatedAt}
              </span>
            </div>

            {data.orders.length === 0 ? (
              <p className="text-zinc-400">비로그인 상태입니다 — 위 버튼으로 사용자를 전환하면 주문 내역이 표시됩니다.</p>
            ) : (
              <div className="space-y-1.5">
                {data.orders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="rounded bg-zinc-50 p-2 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {order.orderNumber} · {order.statusName} · {order.createdAt}
                      </span>
                      <span className="font-bold">{order.totalAmount.toLocaleString()}원</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">
                      {order.items.map((item) => item.productName).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-zinc-500">
            버튼은 Server Action으로 실제 세션 쿠키를 바꾸고, 위 카드는 'use cache: private' 함수가 그 쿠키를 읽어
            반환한 결과다. 사용자를 전환할 때마다 cacheInstanceId가 새로 발급되는지 확인하라.
          </p>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        currentSessionId={data.sessionId}
        cacheInstanceId={data.cacheInstanceId}
        generatedAt={data.generatedAt}
        pendingTarget={pendingTarget}
        isPending={isPending}
        isMatched={isMatched}
        reloadNote={reloadNote}
      />
    </>
  )
}
