'use client'

import React from 'react'
import Link from 'next/link'
import { useLiveHead } from '../hooks/useLiveHead'
import type { ProductMeta } from '../types'

const BASE_PATH = '/zone/baseline/functions/generate-metadata/dynamic-title'

interface DynamicTitleInspectorProps {
  products: ProductMeta[]
  activeProductId?: string
}

export function DynamicTitleInspector({ products, activeProductId }: DynamicTitleInspectorProps) {
  const liveHead = useLiveHead()

  return (
    <div className="space-y-4">
      {/* 상품 프리셋 — 실제 라우트로 이동하는 링크 */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          상품 프리셋 (클릭 시 실제 라우트 이동 → generateMetadata 서버 재실행):
        </span>
        <Link href={BASE_PATH} className={navClass(!activeProductId)}>
          정적 루트 (params 없음)
        </Link>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`${BASE_PATH}/products/${product.id}`}
            className={navClass(activeProductId === product.id)}
          >
            {product.name}
          </Link>
        ))}
      </div>

      {/* 실제 <head> 인스펙터 — DOM에서 직접 읽은 값만 표시 */}
      <div className="rounded border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          실제 &lt;head&gt; 인스펙터 (document.title / meta 태그를 DOM에서 직접 읽음)
        </span>
        {liveHead ? (
          <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-emerald-400 leading-relaxed">
{`<title>${liveHead.title}</title>
<meta name="description" content="${liveHead.description}" />
<meta property="og:title" content="${liveHead.ogTitle}" />
<meta property="og:description" content="${liveHead.ogDescription}" />`}
          </pre>
        ) : (
          <div className="mt-1.5 text-[11px] text-zinc-400">읽는 중...</div>
        )}
        <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {activeProductId
            ? `현재 라우트: /products/${activeProductId} — generateMetadata({ params })가 params.productId="${activeProductId}"로 실제 생성한 title/description입니다. og:title/og:description은 이 라우트가 override하지 않아 루트 레이아웃 값 그대로입니다.`
            : '현재 라우트: 정적 루트 — params 없이 항상 동일한 metadata 객체 값입니다.'}
        </p>
      </div>
    </div>
  )
}

function navClass(active: boolean) {
  return `rounded px-2.5 py-1 text-[11px] font-medium transition ${
    active
      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
  }`
}
