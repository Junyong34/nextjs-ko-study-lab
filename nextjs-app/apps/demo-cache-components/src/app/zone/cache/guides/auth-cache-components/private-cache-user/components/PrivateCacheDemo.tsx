'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { resetCartDemoAction, switchCartUserAction } from '../actions'
import { CART_USER_IDS, USER_LABELS, type CartUserId, type PrivateCartResult } from '../types'
import { VerificationFooter, type Observation } from './VerificationFooter'

export function PrivateCacheDemo({ data }: { data: PrivateCartResult }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [target, setTarget] = useState<CartUserId | null>(null)
  const [refetches, setRefetches] = useState(0)
  // 사용자별로 화면에서 실제 관찰한 결과. 두 사용자를 다 본 뒤 격리 여부를 판정한다.
  const [seen, setSeen] = useState<Partial<Record<CartUserId, Observation>>>({})

  useEffect(() => {
    if (data.userId === 'guest') return
    setSeen((prev) => ({
      ...prev,
      [data.userId as CartUserId]: {
        cacheId: data.cacheId,
        itemIds: data.cartItems.map((i) => i.id),
        bodyRuns: data.bodyRuns,
      },
    }))
  }, [data])

  const run = (action: () => Promise<void>) =>
    startTransition(async () => {
      await action()
      router.refresh()
    })

  const reset = () =>
    startTransition(async () => {
      await resetCartDemoAction()
      setTarget(null)
      setRefetches(0)
      setSeen({})
      router.refresh()
    })

  return (
    <>
      <DemoPlaygroundCard title="사용자별 장바구니 (cachedData.ts: getPrivateCart)">
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap gap-2">
              {CART_USER_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setTarget(id)
                    run(() => switchCartUserAction(id))
                  }}
                  className={`rounded px-3.5 py-1.5 font-bold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    data.userId === id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  {id === 'user_A' ? '사용자 A로 전환' : '사용자 B로 전환'}
                </button>
              ))}
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setRefetches((n) => n + 1)
                  run(async () => {})
                }}
                className="rounded border border-zinc-300 bg-white px-3.5 py-1.5 font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 cursor-pointer dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                다시 조회 (router.refresh)
              </button>
            </div>
            <DemoResetButton label="초기화" loadingLabel="초기화 중..." onReset={reset} />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
              <span className="text-zinc-800 dark:text-zinc-200">
                쿠키가 가리키는 사용자:{' '}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-blue-600 dark:bg-zinc-900 dark:text-blue-400">
                  {data.userId === 'guest' ? '없음 (게스트)' : USER_LABELS[data.userId]}
                </code>
              </span>
              <span className="text-[11px] text-zinc-400">
                cacheId #{data.cacheId} · {data.generatedAt} · 서버 실행(bodyRuns) {data.bodyRuns}회
              </span>
            </div>
            {data.cartItems.length === 0 ? (
              <p className="text-zinc-400">쿠키가 없어 장바구니가 비어 있다. 위 버튼으로 사용자를 전환하라.</p>
            ) : (
              data.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between rounded border border-zinc-100 bg-zinc-50 p-2 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  <span>• {item.name} × {item.quantity}</span>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))
            )}
            <div className="flex justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
              <span>합계</span>
              <span className="font-bold">{data.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            버튼은 Server Action으로 실제 쿠키를 바꾼다. 카드는 <code>'use cache: private'</code> 함수가 그 쿠키를 스코프 안에서 읽고 만든 결과다.
            bodyRuns는 함수 본문이 서버에서 실행된 횟수로, 서버 프로세스 전체의 사용자별 누적값이다.
          </p>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter data={data} target={target} isPending={isPending} refetches={refetches} seen={seen} />
    </>
  )
}
