'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard, type Product } from '@study/demo-kit'

export function DirectiveUseClientDemo() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [lastAction, setLastAction] = useState<string>('대기 중')

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev =>
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    )
    setLastAction(`위시리스트 ${wishlist.includes(product.id) ? '해제' : '추가'}: ${product.name}`)
  }

  const handleAddToCart = (product: Product) => {
    setCartCount(c => c + 1)
    setLastAction(`장바구니 담기 완료 (+1): ${product.name}`)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">장바구니: <span className="text-blue-600 font-extrabold">{cartCount}</span>개</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">찜한 상품: <span className="text-rose-600 font-extrabold">{wishlist.length}</span>개</span>
        </div>
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          최근 액션: {lastAction}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_PRODUCTS.slice(0, 2).map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
