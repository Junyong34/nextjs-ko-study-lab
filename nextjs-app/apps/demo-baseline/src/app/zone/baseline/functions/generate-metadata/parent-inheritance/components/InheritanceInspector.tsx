'use client'

import React from 'react'
import Link from 'next/link'
import { useLiveHead } from '../hooks/useLiveHead'
import { BASE_PATH, PARENT_OPEN_GRAPH, type ProductMeta } from '../types'

interface InheritanceInspectorProps {
  products: ProductMeta[]
  activeProductId?: string
}

export function InheritanceInspector({ products, activeProductId }: InheritanceInspectorProps) {
  const liveHead = useLiveHead()

  return (
    <div className="space-y-4">
      {/* 실제 라우트로 이동하는 링크 — 인덱스(자체 openGraph 교체) vs 상품(부모 openGraph 상속) */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">실제 라우트 이동:</span>
        <Link href={BASE_PATH} className={navClass(!activeProductId)}>
          인덱스 (자체 openGraph 반환)
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

      {/* 부모 layout.tsx 선언값 — 소스 오브 트루스 */}
      <div className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          ../layout.tsx가 선언한 부모 openGraph (기대값의 근거)
        </span>
        <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-300 leading-relaxed">
{`openGraph.siteName: "${PARENT_OPEN_GRAPH.siteName}"
openGraph.title: "${PARENT_OPEN_GRAPH.title}"`}
        </pre>
      </div>

      {/* 실제 <head> 인스펙터 — DOM에서 직접 읽은 값만 표시 */}
      <div className="rounded border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          실제 &lt;head&gt; 인스펙터 (title / link[rel=canonical] / og:* 태그를 DOM에서 직접 읽음)
        </span>
        {liveHead ? (
          <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-emerald-400 leading-relaxed">
{`<title>${liveHead.title}</title>
<link rel="canonical" href="${liveHead.canonical ?? '(없음)'}" />
<meta property="og:site_name" content="${liveHead.ogSiteName ?? '(없음)'}" />
<meta property="og:title" content="${liveHead.ogTitle ?? '(없음)'}" />
<meta property="og:image" content="${liveHead.ogImage ?? '(없음)'}" />`}
          </pre>
        ) : (
          <div className="mt-1.5 text-[11px] text-zinc-400">읽는 중...</div>
        )}
        {activeProductId && liveHead && (
          <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            서버 generateMetadata가 <code>await parent</code>로 읽은 openGraph.siteName(
            <code>{liveHead.parentOgSiteNameFromServer ?? '(없음)'}</code>)과 브라우저가 실제로 렌더링한 og:site_name이
            일치하면, 이 라우트가 openGraph를 반환하지 않아 상위 값이 그대로 상속됐다는 뜻입니다.
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {activeProductId
            ? `현재 라우트: /products/${activeProductId} — generateMetadata가 title/alternates.canonical만 반환해 두 값만 바뀌고, openGraph는 반환하지 않아 그대로 상속됩니다.`
            : '현재 라우트: 인덱스 — 자체 openGraph를 반환하므로 layout.tsx의 openGraph는 통째로 교체되어 og:site_name이 사라집니다.'}
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
