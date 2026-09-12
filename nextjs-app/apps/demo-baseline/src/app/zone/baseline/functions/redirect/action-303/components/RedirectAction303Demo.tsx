'use client'

import { useActionState } from 'react'
import { DemoPlaygroundCard, MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'
import { submitOrder } from '../actions'
import { DEMO_PATH } from '../constants'
import { ResetReceipt } from './ResetReceipt'
import { VerificationFooter } from './VerificationFooter'

const products = MOCK_PRODUCTS.slice(0, 2)
const inputClass = 'w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900'

export function RedirectAction303Demo() {
  const [state, formAction, pending] = useActionState(submitOrder, { error: null }, DEMO_PATH)
  return (
    <>
      <DemoPlaygroundCard title="상품 제출">
        <div className="space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">학습용 상품입니다. 실제 주문과 결제는 발생하지 않습니다.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <form action={formAction} noValidate className="space-y-3">
            <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-[1fr_8rem]">
              <div>
                <label htmlFor="action-product" className="mb-1 block text-sm font-medium">제출할 상품</label>
                <select id="action-product" name="productId" defaultValue={products[0]?.id} className={inputClass}>
                  {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="action-quantity" className="mb-1 block text-sm font-medium">수량 (1~10개)</label>
                <input id="action-quantity" name="quantity" type="number" min="1" max="10" step="1" defaultValue="1" aria-describedby="action-quantity-help" className={inputClass} />
              </div>
              <p id="action-quantity-help" className="text-xs text-zinc-600 sm:col-span-2 dark:text-zinc-400">서버 검증을 관찰하도록 브라우저의 사전 검사는 생략했습니다. 수량 0을 제출하면 서버가 거부해야 합니다.</p>
              <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">{pending ? '서버에서 처리 중...' : '상품 제출하고 완료 화면으로'}</button>
            </fieldset>
            <p role="status" aria-live="polite" className="text-sm text-rose-700 dark:text-rose-400">{pending ? '서버 응답을 기다립니다.' : state.error}</p>
          </form>
          <ResetReceipt />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter error={pending ? null : state.error} />
    </>
  )
}
