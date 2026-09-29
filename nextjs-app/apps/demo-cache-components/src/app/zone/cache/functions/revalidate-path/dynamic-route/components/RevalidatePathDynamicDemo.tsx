'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { revalidateProductPatternAction, revalidateProductInstanceAction } from '../actions'
import { PRODUCT_ID_A, PRODUCT_ID_B, buildProductPath } from '../paths'
import type { ProductCacheEntry } from '../types'

interface RevalidatePathDynamicDemoProps {
  productA: ProductCacheEntry
  productB: ProductCacheEntry
}

export function RevalidatePathDynamicDemo({ productA, productB }: RevalidatePathDynamicDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastMode, setLastMode] = useState<'pattern' | 'instance' | null>(null)
  const [prevA, setPrevA] = useState<string | null>(null)
  const [prevB, setPrevB] = useState<string | null>(null)

  const snapshotBefore = () => {
    setPrevA(productA.cacheId)
    setPrevB(productB.cacheId)
  }

  const runPattern = () => {
    snapshotBefore()
    startTransition(async () => {
      await revalidateProductPatternAction()
      setLastMode('pattern')
      router.refresh()
    })
  }

  const runInstanceA = () => {
    snapshotBefore()
    startTransition(async () => {
      await revalidateProductInstanceAction(PRODUCT_ID_A)
      setLastMode('instance')
      router.refresh()
    })
  }

  const aChanged = prevA !== null && prevA !== productA.cacheId
  const bChanged = prevB !== null && prevB !== productB.cacheId

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-sans font-bold text-zinc-900 dark:text-zinc-100">상품 #{PRODUCT_ID_A} (products/{PRODUCT_ID_A})</div>
          <div>
            cacheId:{' '}
            <span className={`font-bold ${aChanged ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
              #{productA.cacheId}
            </span>
          </div>
          <div className="text-zinc-500">{productA.generatedAt}</div>
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-sans font-bold text-zinc-900 dark:text-zinc-100">상품 #{PRODUCT_ID_B} (products/{PRODUCT_ID_B})</div>
          <div>
            cacheId:{' '}
            <span className={`font-bold ${bChanged ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
              #{productB.cacheId}
            </span>
          </div>
          <div className="text-zinc-500">{productB.generatedAt}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runPattern}
          disabled={isPending}
          className="cursor-pointer rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          패턴 전체 무효화 (products/[id])
        </button>
        <button
          type="button"
          onClick={runInstanceA}
          disabled={isPending}
          className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          상품 #{PRODUCT_ID_A}만 무효화 (인스턴스)
        </button>
      </div>

      {lastMode && (
        <p className="text-[11px] text-zinc-500">
          방금 {lastMode === 'pattern' ? (
            <code>revalidatePath('/…/products/[id]', 'page')</code>
          ) : (
            <code>revalidatePath('/…/products/{PRODUCT_ID_A}')</code>
          )}{' '}
          실행됨 →{' '}
          {aChanged && bChanged
            ? `상품 #${PRODUCT_ID_A}, #${PRODUCT_ID_B} cacheId가 모두 바뀜 (#${prevA}→#${productA.cacheId}, #${prevB}→#${productB.cacheId}).`
            : aChanged
              ? `상품 #${PRODUCT_ID_A}만 cacheId가 바뀜 (#${prevA}→#${productA.cacheId}). 상품 #${PRODUCT_ID_B}는 그대로 #${productB.cacheId}.`
              : '새로고침 반영 대기 중.'}{' '}
          {lastMode === 'pattern'
            ? '패턴 무효화는 [id]에 바인딩되는 모든 상품 인스턴스에 영향을 줍니다.'
            : '인스턴스 무효화는 지정한 id 하나만 영향을 주고 나머지 인스턴스는 그대로 유지됩니다.'}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
        <Link href={buildProductPath(PRODUCT_ID_A)} className="text-blue-700 underline dark:text-blue-300">
          → 상품 #{PRODUCT_ID_A} 상세로 이동
        </Link>
        <Link href={buildProductPath(PRODUCT_ID_B)} className="text-purple-700 underline dark:text-purple-300">
          → 상품 #{PRODUCT_ID_B} 상세로 이동
        </Link>
      </div>

      <div className="flex justify-end pt-1">
        <DemoResetButton label="캐시 상태 초기화" />
      </div>
    </div>
  )
}
