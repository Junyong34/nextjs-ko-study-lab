import React from 'react'
import type { ProductDetail, ProductSummary } from '../types'

/** 요약만으로 그릴 수 있는 영역 — 이름·카테고리·가격. 서버 조회 없이 즉시 그린다. */
export function SummaryHeader({ summary }: { summary: ProductSummary }) {
  return (
    <div data-role="summary-header" className="space-y-3">
      <div
        className={`flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br p-4 text-center text-lg font-bold text-white ${summary.color}`}
      >
        {summary.name}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{summary.name}</h4>
          <p className="text-xs text-zinc-500">
            {summary.category} · 상품 ID {summary.id}
          </p>
        </div>
        <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
          {summary.price.toLocaleString()}원
        </span>
      </div>
    </div>
  )
}

/** 서버에서 받아야 하는 영역 — 설명·사양·재고. */
export function DetailBody({ detail }: { detail: ProductDetail }) {
  return (
    <div data-role="detail-body" className="space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{detail.description}</p>
      <ul className="list-inside list-disc space-y-0.5 text-xs text-zinc-600 dark:text-zinc-400">
        {detail.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        {detail.stock > 0 ? `재고 ${detail.stock}개` : '품절'}
      </p>
    </div>
  )
}

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`} />
}

/** 요약이 없을 때 헤더 자리에 보이는 스켈레톤 */
export function HeaderSkeleton() {
  return (
    <div data-role="header-skeleton" className="space-y-3">
      <Bar className="h-32 w-full" />
      <Bar className="h-4 w-1/2" />
    </div>
  )
}

/** 본문이 도착하기 전 자리를 채우는 스켈레톤(Suspense fallback / 모달 로딩 공용) */
export function BodySkeleton({ label }: { label: string }) {
  return (
    <div data-role="detail-skeleton" className="space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <Bar className="h-3 w-full" />
      <Bar className="h-3 w-5/6" />
      <Bar className="h-3 w-2/3" />
      <p className="pt-1 text-[11px] text-zinc-500">{label}</p>
    </div>
  )
}
