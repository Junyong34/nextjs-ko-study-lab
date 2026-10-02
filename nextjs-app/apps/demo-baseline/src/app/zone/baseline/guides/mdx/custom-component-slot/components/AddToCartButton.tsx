'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { CartResponse } from '../types'

interface Props {
  sku: string
  name: string
  price: number
  maxQty: number
}

// MDX(서버 컴포넌트) 안에서 import되는 클라이언트 경계. 이 파일만 브라우저 번들에 들어간다.
export function AddToCartButton({ sku, name, price, maxQty }: Props) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [hydrated, setHydrated] = useState(false)
  const [last, setLast] = useState<{ status: number; body: CartResponse } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => setHydrated(true), [])

  const add = () => {
    startTransition(async () => {
      const res = await fetch(`${window.location.pathname}/api/cart`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sku, qty }),
      })
      setLast({ status: res.status, body: await res.json() })
      // 서버 컴포넌트(page.tsx → MDX)를 다시 렌더해 쿠키의 새 수량을 props로 받는다.
      router.refresh()
    })
  }

  const step = 'h-7 w-7 cursor-pointer rounded border border-zinc-300 text-sm disabled:opacity-40 dark:border-zinc-700'
  return (
    <div
      data-bundle-marker="MDXSLOT-BUTTON-C1"
      data-hydrated={hydrated ? 'true' : 'false'}
      className="my-3 flex flex-wrap items-center gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="font-semibold">{name}</span>
      <button type="button" className={step} disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} aria-label="수량 줄이기">−</button>
      <span className="w-6 text-center font-mono" aria-live="polite">{qty}</span>
      <button type="button" className={step} disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)} aria-label="수량 늘리기">+</button>
      <button
        type="button"
        onClick={add}
        disabled={!hydrated || isPending}
        className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 font-bold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isPending ? '담는 중...' : `장바구니 담기 (${(price * qty).toLocaleString('ko-KR')}원)`}
      </button>
      <span className="font-mono text-zinc-500">
        {!hydrated
          ? '하이드레이션 전'
          : last
            ? `POST ${last.status} · 서버 수량 ${last.body.count}${last.body.error ? ` · ${last.body.error}` : ''}`
            : '하이드레이션 완료 · 아직 담지 않음'}
      </span>
    </div>
  )
}
