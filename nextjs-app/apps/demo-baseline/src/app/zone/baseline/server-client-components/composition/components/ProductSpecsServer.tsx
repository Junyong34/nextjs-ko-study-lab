import React from 'react'
import type { ProductDetail } from '../types'

interface ProductSpecsServerProps {
  product: ProductDetail
}

/**
 * Server Component (RSC):
 * 클라이언트 번들로 자바스크립트가 내려가지 않고,
 * 서버에서 순수 HTML/RSC Payload로만 직렬화되어 전송됩니다.
 */
export function ProductSpecsServer({ product }: ProductSpecsServerProps) {
  return (
    <div className="space-y-2.5 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          상품 상세 제원 (Server Component 렌더링)
        </span>
        <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          RSC (0 KB JS Bundle)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        {product.specs.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded border border-zinc-200 bg-white px-2.5 py-1.5 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <span className="text-zinc-500">{s.label}</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400 font-mono">
        <span>서버 렌더 타임스탬프: {product.renderedAt}</span>
        <span>{product.serverSecretNote}</span>
      </div>
    </div>
  )
}
