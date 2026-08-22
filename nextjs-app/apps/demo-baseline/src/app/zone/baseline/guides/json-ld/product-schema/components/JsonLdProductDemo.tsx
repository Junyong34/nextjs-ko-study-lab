'use client'
import React from 'react'
export function JsonLdProductDemo() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '기계식 게이밍 키보드',
    offers: { '@type': 'Offer', price: '149000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock' }
  }
  return (
    <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
      <div className="text-zinc-400">// HTML &lt;head&gt;에 출력되는 JSON-LD 스키마:</div>
      <pre>{JSON.stringify(jsonLd, null, 2)}</pre>
    </div>
  )
}
