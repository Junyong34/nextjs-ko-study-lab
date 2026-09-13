'use client'
import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import type { OrderResult, ProductBuyItem } from '../types'

export function InlineActionClosureDemo({ items }: { items: ProductBuyItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedItem = items[selectedIndex]

  // buyAction은 page.tsx(Server Component)에서 상품별로 클로저 캡처되어 생성된
  // 실제 Server Action 참조다. 여기서는 그 참조를 그대로 호출할 뿐, 인자로
  // productId나 price를 넘기지 않는다 — 그런데도 서버 응답에 정확한 값이 돌아온다면
  // 클로저 캡처값이 실제로 서버까지 직렬화되어 전달됐다는 뜻이다.
  const handleInstantBuy = () => {
    setOrderResult(null)
    startTransition(async () => {
      const result = await selectedItem.buyAction()
      setOrderResult(result)
    })
  }

  const isMatched = orderResult
    ? orderResult.productId === selectedItem.product.id && orderResult.price === selectedItem.product.price
    : undefined

  return (
    <>
      <DemoPlaygroundCard title="컴포넌트 내부 인라인 'use server' 클로저 액션 실습">
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
          <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 즉시 결제 (서버 컴포넌트 인라인 'use server' 클로저)</h4>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              상품마다 productId·price를 클로저로 캡처한 인라인 Server Action을 실제로 호출합니다.
            </p>
          </div>

          <div className="flex gap-2">
            {items.map((item, index) => (
              <button
                key={item.product.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`flex-1 rounded border p-2 text-left cursor-pointer transition ${
                  selectedIndex === index
                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20'
                    : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.product.name}</div>
                <div className="text-blue-600 dark:text-blue-400 font-extrabold font-mono mt-1">
                  {item.product.price.toLocaleString()}원
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900">
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">선택 상품: {selectedItem.product.name}</div>
              <div className="text-zinc-500 text-[11px]">단독 구매 배송비: 무료배송</div>
            </div>
            <button
              type="button"
              onClick={handleInstantBuy}
              disabled={isPending}
              className="rounded bg-rose-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition"
            >
              {isPending ? '서버 액션 응답 대기 중...' : '원클릭 즉시 구매'}
            </button>
          </div>

          {orderResult && (
            <div className="rounded border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-mono">
              <div>
                [즉시 주문 성공] 주문번호: {orderResult.orderNo} | 상품: {orderResult.productName} | 결제금액: {orderResult.price.toLocaleString()}원
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                서버 처리 시각(processedAt, 클라이언트가 만들 수 없는 값): {orderResult.processedAt}
              </div>
            </div>
          )}
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        isMatched={isMatched}
        expected={`선택 상품의 클로저 캡처값 — productId: ${selectedItem.product.id}, price: ${selectedItem.product.price.toLocaleString()}원`}
        actual={
          orderResult
            ? `서버 응답 — productId: ${orderResult.productId}, price: ${orderResult.price.toLocaleString()}원, processedAt: ${orderResult.processedAt}`
            : undefined
        }
      />
    </>
  )
}
