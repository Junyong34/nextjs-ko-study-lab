'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  OG_BADGE_API_ENDPOINT,
  OG_BADGE_DISCOUNT_RATES,
  OG_BADGE_PRODUCTS,
  type OgBadgeResponseState,
} from '../types'

interface ImageResponseOgBadgeDemoProps {
  onResponseChange?: (state: OgBadgeResponseState) => void
}

interface HistoryEntry {
  productId: string
  discountRate: number
  contentLength: number
  requestSeq: number
}

export function ImageResponseOgBadgeDemo({ onResponseChange }: ImageResponseOgBadgeDemoProps) {
  const [productId, setProductId] = useState(OG_BADGE_PRODUCTS[0].id)
  const [discountRate, setDiscountRate] = useState<number>(OG_BADGE_DISCOUNT_RATES[0])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const previousObjectUrl = useRef<string | null>(null)
  const previousContentLength = useRef<number | null>(null)

  const requestOgBadge = async (targetProductId: string, targetDiscountRate: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${OG_BADGE_API_ENDPOINT}?product=${targetProductId}&discountRate=${targetDiscountRate}`,
      )
      const contentType = res.headers.get('content-type')
      const cacheControl = res.headers.get('cache-control')
      const requestSeqHeader = res.headers.get('x-study-og-request-seq')
      const renderedAt = res.headers.get('x-study-og-rendered-at')
      const blob = await res.blob()

      if (previousObjectUrl.current) URL.revokeObjectURL(previousObjectUrl.current)
      const objectUrl = URL.createObjectURL(blob)
      previousObjectUrl.current = objectUrl
      setImageUrl(objectUrl)

      const requestSeq = requestSeqHeader ? Number(requestSeqHeader) : null
      setHistory((prev) => [
        { productId: targetProductId, discountRate: targetDiscountRate, contentLength: blob.size, requestSeq: requestSeq ?? 0 },
        ...prev.slice(0, 3),
      ])

      onResponseChange?.({
        requestedProductId: targetProductId,
        requestedDiscountRate: targetDiscountRate,
        httpStatus: res.status,
        contentType,
        contentLength: blob.size,
        cacheControl,
        requestSeq,
        renderedAt,
        previousContentLength: previousContentLength.current,
      })
      previousContentLength.current = blob.size
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    requestOgBadge(productId, discountRate)
    return () => {
      if (previousObjectUrl.current) URL.revokeObjectURL(previousObjectUrl.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">실시간 할인 뱃지 OG 이미지 생성 콘솔</h4>
          <p className="text-xs text-zinc-500">
            아래 조작은 <code>api/route.tsx</code>의 <code>ImageResponse</code>를 실제로 호출합니다.
          </p>
        </div>
        <div className="flex gap-2">
          {OG_BADGE_PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => setProductId(product.id)}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                productId === product.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {product.name} (#{product.id.slice(-3)})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              ImageResponse 렌더링 결과 (실제 PNG, 1200 × 630 px):
            </span>
            <span className="font-mono text-[10px] text-zinc-400">GET {OG_BADGE_API_ENDPOINT}</span>
          </div>
          <div className="aspect-[1200/630] w-full overflow-hidden rounded-xl border border-zinc-300 bg-zinc-900 shadow-lg dark:border-zinc-700">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="실시간 생성된 할인 뱃지 OG 이미지" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">이미지 요청 중...</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">할인율 선택</div>
            <div className="grid grid-cols-2 gap-1.5">
              {OG_BADGE_DISCOUNT_RATES.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setDiscountRate(rate)}
                  className={`rounded px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
                    discountRate === rate
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  -{rate}%
                </button>
              ))}
            </div>
            <button
              onClick={() => requestOgBadge(productId, discountRate)}
              disabled={isLoading}
              className="w-full rounded bg-zinc-900 px-3 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {isLoading ? '렌더링 중...' : 'OG 이미지 생성'}
            </button>
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-1">
            <div className="font-bold text-zinc-400 font-sans text-xs border-b border-zinc-800 pb-1">
              실제 요청 이력 (최근 4건):
            </div>
            {history.length === 0 && <div className="text-zinc-500 pt-1">요청 대기 중...</div>}
            {history.map((entry, i) => (
              <div key={i} className={i === 0 ? 'text-emerald-400 pt-1' : 'text-zinc-500 pt-1'}>
                #{entry.requestSeq} {entry.productId} -{entry.discountRate}% → {entry.contentLength.toLocaleString()} bytes
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
