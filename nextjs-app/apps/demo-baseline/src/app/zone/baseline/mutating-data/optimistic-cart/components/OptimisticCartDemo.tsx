'use client'
import React, { useState, useOptimistic, useTransition } from 'react'
import { MOCK_PRODUCTS, CartSummary, type CartItem } from '@study/demo-kit'

export function OptimisticCartDemo() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selected: true },
    { product: MOCK_PRODUCTS[1], quantity: 2, selected: true }
  ])
  const [isPending, startTransition] = useTransition()

  const [optimisticCart, setOptimisticCart] = useOptimistic(
    cartItems,
    (state, update: { productId: string; delta: number }) => {
      return state.map(item => {
        if (item.product.id === update.productId) {
          const newQty = Math.max(1, item.quantity + update.delta)
          return { ...item, quantity: newQty }
        }
        return item
      })
    }
  )

  const handleQuantityChange = (productId: string, delta: number) => {
    startTransition(async () => {
      // 1. 낙관적 즉각 반영
      setOptimisticCart({ productId, delta })
      // 2. 서버 동기화
      await new Promise(r => setTimeout(r, 600))
      setCartItems(prev =>
        prev.map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) }
          }
          return item
        })
      )
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId))
  }

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center gap-2 rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
          <span className="animate-spin"></span>
          Server Action 실행 중... 낙관적 UI에 의해 브라우저 수량은 0ms 즉시 갱신되었습니다.
        </div>
      )}

      <CartSummary
        items={optimisticCart}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => alert('주문서 페이지로 이동합니다.')}
      />
    </div>
  )
}
