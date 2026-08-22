'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function InlineActionClosureDemo() {
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0])
  const [orderResult, setOrderResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleInstantBuy = () => {
    startTransition(async () => {
      // Simulate inline server closure action
      await new Promise(r => setTimeout(r, 700))
      const orderNo = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
      setOrderResult(`[즉시 주문 성공] 주문번호: ${orderNo} | 상품: ${selectedProduct.name} | 결제금액: ${selectedProduct.price.toLocaleString()}원`)
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 즉시 결제 (컴포넌트 인라인 'use server' 클로저)</h4>
        <p className="text-zinc-500 text-[11px] mt-0.5">컴포넌트 스코프의 변수(productId, price)를 클로저로 캡처하여 즉시 구매를 실행합니다.</p>
      </div>

      <div className="flex gap-2">
        {MOCK_PRODUCTS.slice(0, 3).map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedProduct(p)}
            className={`flex-1 rounded border p-2 text-left cursor-pointer transition ${
              selectedProduct.id === p.id
                ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</div>
            <div className="text-blue-600 dark:text-blue-400 font-extrabold font-mono mt-1">{p.price.toLocaleString()}원</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">선택 상품: {selectedProduct.name}</div>
          <div className="text-zinc-500 text-[11px]">단독 구매 배송비: 무료배송</div>
        </div>
        <button
          type="button"
          onClick={handleInstantBuy}
          disabled={isPending}
          className="rounded bg-rose-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition"
        >
          {isPending ? '결제 처리 중...' : '원클릭 즉시 구매'}
        </button>
      </div>

      {orderResult && (
        <div className="rounded border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-mono">
          {orderResult}
        </div>
      )}
    </div>
  )
}
