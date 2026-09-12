'use client'

import { useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton, ProductCard } from '@study/demo-kit'
import { DEMO_PRODUCTS } from '../constants'
import { useRedirectRequest } from '../hooks/useRedirectRequest'
import type { RequestMethod } from '../types'
import { VerificationFooter } from './VerificationFooter'
import { RedirectDeepDive } from './RedirectDeepDive'

export function RedirectHandler307Demo() {
  const [selectedProduct, setSelectedProduct] = useState(DEMO_PRODUCTS[0].id)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [method, setMethod] = useState<RequestMethod>('POST')
  const request = useRedirectRequest()
  const product = DEMO_PRODUCTS.find(item => item.id === selectedProduct) ?? DEMO_PRODUCTS[0]

  function reset() {
    request.reset()
    setSelectedProduct(DEMO_PRODUCTS[0].id)
    setOrderQuantity(1)
    setMethod('POST')
  }

  return (
    <>
      <DemoPlaygroundCard title="이전 주소로 상품 접수하기">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              상품은 학습용 데이터이며 실제 주문·결제는 저장하지 않습니다.
            </p>
            <DemoResetButton onReset={reset} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProductCard product={product} />
            <form
              className="space-y-3"
              onSubmit={event => {
                event.preventDefault()
                void request.execute(selectedProduct, orderQuantity, method)
              }}
            >
              <label className="block space-y-1">
                <span className="text-xs font-semibold">상품</span>
                <select
                  value={selectedProduct}
                  onChange={event => {
                    setSelectedProduct(event.target.value)
                    request.clearResult()
                  }}
                  className="w-full min-w-0 rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
                >
                  {DEMO_PRODUCTS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold">수량 (1~10)</span>
                  <input
                    type="number" min={1} max={10} step={1} required value={orderQuantity}
                    onChange={event => {
                      setOrderQuantity(Number(event.target.value))
                      request.clearResult()
                    }}
                    className="w-full rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold">요청 방식</span>
                  <select
                    value={method}
                    onChange={event => {
                      setMethod(event.target.value === 'GET' ? 'GET' : 'POST')
                      request.clearResult()
                    }}
                    className="w-full rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
                  >
                    <option value="POST">POST · 본문</option>
                    <option value="GET">GET · 비교</option>
                  </select>
                </label>
              </div>
              <button
                type="submit" disabled={request.pending}
                className="w-full rounded bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {request.pending ? '접수 요청 중…' : '접수 요청 보내기'}
              </button>
              <p role="status" className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {request.pending
                  ? '제출 당시 값으로 검증합니다. 요청 중 옵션을 바꿔도 보낸 요청은 바뀌지 않습니다. 초기화하면 요청을 취소합니다.'
                  : 'POST는 JSON 본문으로, GET은 주소의 query로 보냅니다. 실제 HTTP 요청이 두 접수 주소를 거칩니다.'}
              </p>
            </form>
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter submitted={request.submitted} result={request.result} pending={request.pending} />
      <RedirectDeepDive />
    </>
  )
}
