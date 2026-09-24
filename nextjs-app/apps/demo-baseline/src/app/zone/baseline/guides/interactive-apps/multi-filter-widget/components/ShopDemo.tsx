'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CartSummary, DemoPlaygroundCard, DemoResetButton, ProductCard, type CartItem, type Product } from '@study/demo-kit'
import { useNavObservations } from '../hooks/useNavObservations'
import type { CategoryOption, ServerSnapshot } from '../types'
import { FilterBar } from './FilterBar'
import { StatePanel } from './StatePanel'
import { ObservationLog } from './ObservationLog'
import { VerificationFooter } from './VerificationFooter'

const TOOL_BUTTON =
  'cursor-pointer rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'

interface ShopDemoProps {
  snapshot: ServerSnapshot
  products: Product[]
  categories: CategoryOption[]
}

/**
 * 클라이언트 경계. 서버가 필터링한 products는 prop으로 받아 그리기만 하고,
 * 이 컴포넌트가 직접 가진 상태는 장바구니(cart) 하나뿐이다.
 */
export function ShopDemo({ snapshot, products, categories }: ShopDemoProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [cart, setCart] = useState<CartItem[]>([])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const { entries, mountId, reload, markPush, clearEntries } = useNavObservations(snapshot, cartCount)

  const query = searchParams.toString()
  const href = query ? `${pathname}?${query}` : pathname

  function addToCart(product: Product) {
    setCart((prev) =>
      prev.some((i) => i.product.id === product.id)
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1, selected: true }],
    )
  }

  function changeQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0),
    )
  }

  function reset() {
    setCart([])
    clearEntries()
    markPush()
    router.push(pathname, { scroll: false })
  }

  return (
    <>
      <DemoPlaygroundCard title="쇼핑 위젯 — URL(필터) · Server Component(목록) · Client Component(장바구니)">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {href}
            </code>
            <button type="button" className={TOOL_BUTTON} onClick={() => window.history.back()}>
              뒤로가기 history.back()
            </button>
            <button type="button" className={TOOL_BUTTON} onClick={() => window.history.forward()}>
              앞으로
            </button>
            <button type="button" className={TOOL_BUTTON} onClick={() => window.location.reload()}>
              새로고침
            </button>
            <a className={TOOL_BUTTON} href={href} target="_blank" rel="noopener noreferrer">
              이 URL을 새 탭에서 열기
            </a>
            <DemoResetButton onReset={reset} />
          </div>

          <StatePanel href={href} snapshot={snapshot} cartCount={cartCount} mountId={mountId} />

          <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
            <div className="group space-y-3">
              <FilterBar categories={categories} onNavigate={markPush} />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>
                  서버 필터링 결과 <strong className="text-zinc-900 dark:text-zinc-100">{snapshot.count}</strong> / {snapshot.total}개
                </span>
                <span className="hidden font-semibold text-amber-600 group-has-data-pending:inline dark:text-amber-400">
                  새 URL의 서버 렌더 대기 중 (data-pending)
                </span>
              </div>
              <div className="grid gap-3 transition-opacity group-has-data-pending:opacity-50 sm:grid-cols-2">
                {products.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-xs text-zinc-500 sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-900/40">
                    조건에 맞는 상품이 없습니다. 칩을 해제하거나 [예제 초기화]를 누르세요.
                  </div>
                ) : (
                  products.map((p) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)
                )}
              </div>
            </div>
            <CartSummary items={cart} onQuantityChange={changeQuantity} onRemoveItem={(id) => changeQuantity(id, -Infinity)} className="h-fit lg:sticky lg:top-4" />
          </div>

          <ObservationLog entries={entries} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter entries={entries} reload={reload} />
    </>
  )
}
