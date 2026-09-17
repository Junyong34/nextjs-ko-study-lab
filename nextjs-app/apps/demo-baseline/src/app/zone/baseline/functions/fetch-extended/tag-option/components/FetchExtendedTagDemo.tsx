'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { purgeShoesTagAction, purgeWindbreakerTagAction, purgeBothTagsAction } from '../actions'
import { PRODUCT_TAGS } from '../types'
import type { ProductKey, TaggedProductSnapshot } from '../types'
import { VerificationFooter } from './VerificationFooter'

export type LastAction = ProductKey | 'both' | null

interface FetchExtendedTagDemoProps {
  shoes: TaggedProductSnapshot
  windbreaker: TaggedProductSnapshot
}

interface LogEntry {
  id: number
  message: string
  timestamp: string
}

function ProductTagCard({
  label,
  snapshot,
  tag,
  changed,
  disabled,
  onPurge,
}: {
  label: string
  snapshot: TaggedProductSnapshot
  tag: string
  changed: boolean
  disabled: boolean
  onPurge: () => void
}) {
  return (
    <div
      className={`rounded border p-3.5 space-y-2.5 transition-colors ${
        changed
          ? 'border-emerald-400 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20'
          : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">{tag}</span>
      </div>
      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        <div>
          가격: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{snapshot.price.toLocaleString('ko-KR')}원</span>
        </div>
        <div>
          Route Handler 실제 실행(캐시 미스) 횟수: <span className="font-mono font-bold">{snapshot.fetchCount}</span>
        </div>
        <div>
          fetch 캐시에 저장된 시각: <span className="font-mono font-bold">{new Date(snapshot.fetchedAt).toLocaleTimeString('ko-KR')}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onPurge}
        disabled={disabled}
        className="w-full rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
      >
        {label} 캐시 태그 무효화 (revalidateTag)
      </button>
    </div>
  )
}

export function FetchExtendedTagDemo({ shoes, windbreaker }: FetchExtendedTagDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastAction, setLastAction] = useState<LastAction>(null)
  const [prevShoes, setPrevShoes] = useState(shoes)
  const [prevWindbreaker, setPrevWindbreaker] = useState(windbreaker)
  const [log, setLog] = useState<LogEntry[]>([])

  const shoesChanged = shoes.fetchedAt !== prevShoes.fetchedAt
  const windbreakerChanged = windbreaker.fetchedAt !== prevWindbreaker.fetchedAt

  // router.refresh()로 새 props가 들어온 뒤, 이번 렌더의 비교가 끝나면 "이전 값"을 다음 비교를 위해 갱신한다.
  useEffect(() => {
    setPrevShoes(shoes)
    setPrevWindbreaker(windbreaker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoes.fetchedAt, windbreaker.fetchedAt])

  const appendLog = (message: string) => {
    setLog((prev) => [{ id: prev.length, message, timestamp: new Date().toLocaleTimeString('ko-KR') }, ...prev].slice(0, 5))
  }

  const handlePurge = (product: ProductKey) => {
    startTransition(async () => {
      const action = product === 'shoes' ? purgeShoesTagAction : purgeWindbreakerTagAction
      const result = await action()
      appendLog(`revalidateTag('${result.tag}', { expire: 0 }) 호출 완료 → router.refresh() 실행`)
      setLastAction(product)
      router.refresh()
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      const results = await purgeBothTagsAction()
      appendLog(`두 태그(${results.map((r) => r.tag).join(', ')}) 모두 무효화 → router.refresh() 실행`)
      setLastAction('both')
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Next.js 확장 fetch tags 태그 바인딩 실습 콘솔</h4>
            <p className="text-xs text-zinc-500">두 상품을 각각 다른 캐시 태그로 fetch합니다. 태그를 무효화하면 그 상품만 다시 조회됩니다.</p>
          </div>
          <DemoResetButton onReset={handleReset} label="두 태그 모두 무효화" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProductTagCard
            label="러닝화"
            snapshot={shoes}
            tag={PRODUCT_TAGS.shoes}
            changed={shoesChanged}
            disabled={isPending}
            onPurge={() => handlePurge('shoes')}
          />
          <ProductTagCard
            label="윈드브레이커"
            snapshot={windbreaker}
            tag={PRODUCT_TAGS.windbreaker}
            changed={windbreakerChanged}
            disabled={isPending}
            onPurge={() => handlePurge('windbreaker')}
          />
        </div>

        {log.length > 0 && (
          <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
            <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">실시간 도메인 로그:</div>
            <div className="space-y-1 pt-1 text-[11px]">
              {log.map((entry, i) => (
                <div key={entry.id} className={i === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  [{entry.timestamp}] {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <VerificationFooter
        lastAction={lastAction}
        shoesChanged={shoesChanged}
        windbreakerChanged={windbreakerChanged}
        shoes={shoes}
        windbreaker={windbreaker}
      />
    </div>
  )
}
