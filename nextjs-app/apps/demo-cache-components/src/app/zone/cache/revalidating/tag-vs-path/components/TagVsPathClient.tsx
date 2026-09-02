'use client'

import React, { useTransition, useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import {
  updateProductATag,
  updateProductBTag,
  revalidateEntirePath,
} from '../actions'
import { VerificationFooter } from './VerificationFooter'

interface CacheItem {
  title?: string
  name?: string
  price?: number
  timestamp: string
  cacheId: string
}

interface TagVsPathClientProps {
  banner: CacheItem
  productA: CacheItem
  productB: CacheItem
}

export function TagVsPathClient({
  banner,
  productA,
  productB,
}: TagVsPathClientProps) {
  const [isPending, startTransition] = useTransition()
  const [lastActionType, setLastActionType] = useState<'tag-a' | 'tag-b' | 'path' | null>(null)
  const [statusMessage, setStatusMessage] = useState('대기 중: 아래 무효화 버튼을 눌러보세요.')

  const handleRevalidateA = () => {
    setLastActionType('tag-a')
    startTransition(async () => {
      await updateProductATag()
      setStatusMessage('[확인] updateTag("tag-vs-path:product-a") 완료: A 상품 캐시만 즉시 선택 갱신됨')
    })
  }

  const handleRevalidateB = () => {
    setLastActionType('tag-b')
    startTransition(async () => {
      await updateProductBTag()
      setStatusMessage('[확인] updateTag("tag-vs-path:product-b") 완료: B 상품 캐시만 즉시 선택 갱신됨')
    })
  }

  const handleRevalidatePath = () => {
    setLastActionType('path')
    startTransition(async () => {
      await revalidateEntirePath()
      setStatusMessage('[확인] revalidatePath() 완료: 페이지 전체 캐시(배너 + A 상품 + B 상품) 일괄 갱신됨')
    })
  }

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="다중 캐시 블록 모니터 및 무효화 제어" className="space-y-4">
        {/* 온디맨드 무효화 컨트롤러 */}
        <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            온디맨드 캐시 무효화 컨트롤러:
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* 1. A 상품 태그 무효화 */}
            <button
              type="button"
              onClick={handleRevalidateA}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              <span>1. A 상품만 무효화</span>
              <span className="rounded bg-blue-800 px-1 py-0.2 font-mono text-[9px] text-blue-200">
                updateTag('product-a')
              </span>
            </button>

            {/* 2. B 상품 태그 무효화 */}
            <button
              type="button"
              onClick={handleRevalidateB}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              <span>2. B 상품만 무효화</span>
              <span className="rounded bg-emerald-800 px-1 py-0.2 font-mono text-[9px] text-emerald-200">
                updateTag('product-b')
              </span>
            </button>

            {/* 3. 경로 전체 무효화 */}
            <button
              type="button"
              onClick={handleRevalidatePath}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
            >
              <span>3. 경로 전체 일괄 무효화</span>
              <span className="rounded bg-rose-800 px-1 py-0.2 font-mono text-[9px] text-rose-200">
                revalidatePath()
              </span>
            </button>
          </div>

          <div className="font-mono text-[11px] text-zinc-500 pt-1">
            • 실행 상태: <span className="font-medium text-zinc-800 dark:text-zinc-200">{statusMessage}</span>
          </div>
        </div>

        {/* 1) 공지 배너 캐시 카드 */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {banner.title}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-zinc-400">생성: {banner.timestamp}</span>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              배너 캐시 #{banner.cacheId}
            </span>
          </div>
        </div>

        {/* 2) A & B 상품 캐시 2단 그리드 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          {/* A 상품 */}
          <div className="rounded border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                A 상품: {productA.name}
              </span>
              <span className="rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                #{productA.cacheId}
              </span>
            </div>
            <div className="font-mono text-zinc-700 dark:text-zinc-300">
              가격: {(productA.price || 0).toLocaleString()}원
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              태그: cacheTag('tag-vs-path:product-a') | 시각: {productA.timestamp}
            </div>
          </div>

          {/* B 상품 */}
          <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                B 상품: {productB.name}
              </span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                #{productB.cacheId}
              </span>
            </div>
            <div className="font-mono text-zinc-700 dark:text-zinc-300">
              가격: {(productB.price || 0).toLocaleString()}원
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              태그: cacheTag('tag-vs-path:product-b') | 시각: {productB.timestamp}
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter lastActionType={lastActionType} isPending={isPending} />
    </div>
  )
}
