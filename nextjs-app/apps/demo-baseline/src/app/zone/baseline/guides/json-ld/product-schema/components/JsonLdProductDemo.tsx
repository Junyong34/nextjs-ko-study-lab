'use client'
import React, { useEffect, useState } from 'react'

const PRODUCT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '기계식 게이밍 키보드',
  offers: { '@type': 'Offer', price: '149000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock' },
}

interface JsonLdProductDemoProps {
  onCheck: (found: boolean, parsed: unknown) => void
}

export function JsonLdProductDemo({ onCheck }: JsonLdProductDemoProps) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // 실제로 DOM에 렌더링된 <script type="application/ld+json">을 찾아 파싱한다.
    const el = document.querySelector('script[type="application/ld+json"][data-demo="json-ld-product"]')
    const parsed = el ? JSON.parse(el.textContent || 'null') : null
    onCheck(Boolean(parsed), parsed)
    setChecked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-2">
      {/* 실제로 렌더링되는 JSON-LD 스크립트 태그 (검색 엔진이 파싱하는 것과 동일) */}
      <script
        type="application/ld+json"
        data-demo="json-ld-product"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }}
      />
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-emerald-400 space-y-1">
        <div className="text-zinc-400">// 실제 DOM에서 조회한 &lt;script type=&quot;application/ld+json&quot;&gt; 내용:</div>
        <pre>{JSON.stringify(PRODUCT_JSON_LD, null, 2)}</pre>
        <div className="text-zinc-400 pt-1">document.querySelector 결과: {checked ? '조회 완료 (아래 검증 패널 참고)' : '조회 중...'}</div>
      </div>
    </div>
  )
}
