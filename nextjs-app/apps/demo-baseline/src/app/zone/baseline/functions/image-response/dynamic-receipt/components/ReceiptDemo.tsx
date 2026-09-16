'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, MOCK_COUPONS, DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import {
  RECEIPT_PRODUCT_IDS,
  RECEIPT_COUPON_IDS,
  RECEIPT_MAX_QUANTITY,
  formatKRW,
  type ReceiptFetchSuccess,
  type ReceiptFetchFailure,
} from '../types'

const API_ENDPOINT = '/zone/baseline/functions/image-response/dynamic-receipt/api'
const RECEIPT_PRODUCTS = RECEIPT_PRODUCT_IDS.map(
  (id) => MOCK_PRODUCTS.find((p) => p.id === id)!,
)
const RECEIPT_COUPONS = RECEIPT_COUPON_IDS.map(
  (id) => (id === 'none' ? null : MOCK_COUPONS.find((c) => c.id === id)!),
)

async function toSha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function ReceiptDemo() {
  const [productId, setProductId] = useState(RECEIPT_PRODUCTS[0].id)
  const [quantity, setQuantity] = useState(1)
  const [couponId, setCouponId] = useState<string>('none')
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'KAKAO_PAY'>('CARD')
  const [isLoading, setIsLoading] = useState(false)
  const [current, setCurrent] = useState<ReceiptFetchSuccess | undefined>()
  const [previous, setPrevious] = useState<ReceiptFetchSuccess | undefined>()
  const [error, setError] = useState<ReceiptFetchFailure | undefined>()
  const [mode, setMode] = useState<'idle' | 'success' | 'error'>('idle')

  const buildUrl = (overrideProductId?: string) => {
    const params = new URLSearchParams({
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      paidAt: new Date().toISOString(),
      productId: overrideProductId ?? productId,
      quantity: String(quantity),
      couponId,
      paymentMethod,
    })
    return `${API_ENDPOINT}?${params.toString()}`
  }

  const generateReceipt = async () => {
    setIsLoading(true)
    setError(undefined)
    try {
      const url = buildUrl()
      const res = await fetch(url)
      if (!res.ok) {
        const data = await res.json()
        setError({ kind: 'failure', status: res.status, message: data.error })
        setMode('error')
        return
      }
      const buffer = await res.arrayBuffer()
      const sha256 = await toSha256Hex(buffer)
      const objectUrl = URL.createObjectURL(
        new Blob([buffer], { type: res.headers.get('content-type') || 'image/png' }),
      )
      const result: ReceiptFetchSuccess = {
        kind: 'success',
        orderId: new URL(url, window.location.origin).searchParams.get('orderId')!,
        productId,
        quantity,
        byteLength: buffer.byteLength,
        sha256,
        contentType: res.headers.get('content-type'),
        cacheControl: res.headers.get('cache-control'),
        objectUrl,
      }
      setCurrent((prevCurrent) => {
        setPrevious((prevPrevious) => {
          if (prevPrevious?.objectUrl) URL.revokeObjectURL(prevPrevious.objectUrl)
          return prevCurrent
        })
        return result
      })
      setMode('success')
    } finally {
      setIsLoading(false)
    }
  }

  const requestInvalidProduct = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(buildUrl('prod-invalid-999'))
      const data = await res.json()
      setError({ kind: 'failure', status: res.status, message: data.error })
      setMode('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl)
    if (previous?.objectUrl) URL.revokeObjectURL(previous.objectUrl)
    setCurrent(undefined)
    setPrevious(undefined)
    setError(undefined)
    setMode('idle')
    setProductId(RECEIPT_PRODUCTS[0].id)
    setQuantity(1)
    setCouponId('none')
    setPaymentMethod('CARD')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          주문 정보 구성
        </span>
        <DemoResetButton onReset={handleReset} />
      </div>

      <div className="space-y-3 rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-wrap gap-2">
          {RECEIPT_PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProductId(p.id)}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                productId === p.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
              }`}
            >
              {p.name} ({formatKRW(p.price)})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">수량</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-6 w-6 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-6 text-center font-mono text-xs font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(RECEIPT_MAX_QUANTITY, q + 1))}
              className="h-6 w-6 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">쿠폰</span>
            {RECEIPT_COUPON_IDS.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setCouponId(id)}
                className={`rounded px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                  couponId === id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                }`}
              >
                {id === 'none' ? '없음' : `${RECEIPT_COUPONS[i]!.discountValue}${RECEIPT_COUPONS[i]!.discountType === 'PERCENT' ? '%' : '원'}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">결제수단</span>
            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`rounded px-2 py-1 text-[11px] font-semibold cursor-pointer ${paymentMethod === 'CARD' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'}`}
            >
              신용카드
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('KAKAO_PAY')}
              className={`rounded px-2 py-1 text-[11px] font-semibold cursor-pointer ${paymentMethod === 'KAKAO_PAY' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'}`}
            >
              카카오페이
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={generateReceipt}
            disabled={isLoading}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? '생성 중...' : '영수증 생성 (ImageResponse 요청)'}
          </button>
          <button
            type="button"
            onClick={requestInvalidProduct}
            disabled={isLoading}
            className="rounded border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
          >
            잘못된 상품 ID로 요청 (실패 케이스)
          </button>
        </div>
      </div>

      {current && (
        <div className="flex flex-col items-center gap-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.objectUrl}
            alt="생성된 결제 영수증"
            className="h-auto w-56 rounded border border-zinc-200 dark:border-zinc-800"
          />
          <div className="font-mono text-[11px] text-zinc-500">
            {current.byteLength.toLocaleString()} bytes · sha256:{current.sha256.slice(0, 16)}…
          </div>
        </div>
      )}

      <VerificationFooter mode={mode} current={current} previous={previous} error={error} />
    </div>
  )
}
