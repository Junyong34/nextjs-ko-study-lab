'use client'

import React, { useState } from 'react'
import styles from './ProductCard.module.css'

export function ProductCard() {
  const [cartAdded, setCartAdded] = useState(false)

  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between">
        <h4 className={styles.title}>프로 무선 기계식 키보드</h4>
        <span className={styles.badge}>BEST 상품</span>
      </div>
      <div className={styles.price}>189,000원</div>
      <p className="mt-1 text-xs text-zinc-500">
        스코프 클래스: <code className="font-mono text-[11px] font-bold text-blue-700">.card, .title, .badge, .price</code>
      </p>
      <button
        type="button"
        onClick={() => setCartAdded(true)}
        className={styles.action}
      >
        {cartAdded ? '✓ 장바구니에 담김' : '장바구니 담기'}
      </button>
    </div>
  )
}

// Alias for backwards compatibility
export const CardA = ProductCard
