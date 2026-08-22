'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function ImagePriorityLcpDemo() {
  const [selectedProduct, setSelectedProduct] = useState('prod-001')
  const [priorityEnabled, setPriorityEnabled] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  const product = MOCK_PRODUCTS.find((p) => p.id === selectedProduct) || MOCK_PRODUCTS[0]

  // Base64 tiny placeholder for blurDataURL
  const blurDataUrl =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4='

  const handleProductChange = (id: string) => {
    setSelectedProduct(id)
    setImageLoaded(false)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 컨트롤 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            next/image priority & LCP 사전 로드 실습 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            LCP(Largest Contentful Paint) 대상 히어로 이미지에 priority 속성을 지정하여 브라우저 preload 링크를 생성합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {MOCK_PRODUCTS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProductChange(p.id)}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                  selectedProduct === p.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {p.id.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={priorityEnabled}
              onChange={(e) => {
                setPriorityEnabled(e.target.checked)
                setImageLoaded(false)
              }}
              className="rounded border-zinc-300"
            />
            <span>priority={'{'}{priorityEnabled ? 'true' : 'false'}{'}'}</span>
          </label>
        </div>
      </div>

      {/* 2. 실시간 렌더링 카드 & next/image 뷰포트 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 p-4 space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priorityEnabled}
              placeholder="blur"
              blurDataURL={blurDataUrl}
              onLoad={() => setImageLoaded(true)}
              className="object-cover transition-all duration-500"
            />
            {priorityEnabled && (
              <div className="absolute top-2 left-2 rounded bg-blue-600/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                LCP Priority High
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{product.name}</div>
              <div className="text-[11px] text-zinc-500">{product.price.toLocaleString()}원</div>
            </div>
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {imageLoaded ? 'Image Loaded (100%)' : 'Loading / Blur...'}
            </span>
          </div>
        </div>

        {/* 3. HTML 생성 속성 및 Preload 태그 인스펙터 */}
        <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1.5">
            생성된 Next.js Image DOM & Preload 태그:
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="text-emerald-400">
              {priorityEnabled
                ? `<link rel="preload" as="image" href="${product.imageUrl}" fetchpriority="high" />`
                : '<!-- priority=false: Lazy load with loading="lazy" -->'}
            </div>
            <div className="text-blue-300 break-all">
              &lt;img src="{product.imageUrl}" alt="{product.name}" fetchpriority="{priorityEnabled ? 'high' : 'auto'}" loading="{priorityEnabled ? 'eager' : 'lazy'}" /&gt;
            </div>
            <div className="text-zinc-500 pt-1">
              • sizes: "(max-width: 768px) 100vw, 50vw"
              <br />
              • placeholder: "blur" (CLS 방지 및 부드러운 전환)
              <br />
              • format: AVIF / WebP 자동 변환 지원
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
