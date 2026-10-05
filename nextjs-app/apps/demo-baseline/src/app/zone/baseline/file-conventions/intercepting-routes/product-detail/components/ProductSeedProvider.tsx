'use client'

import React, { createContext, useContext, useState } from 'react'
import type { ProductSummary } from '../types'

interface SeedContextValue {
  seed: ProductSummary | null
  setSeed: (summary: ProductSummary | null) => void
}

const SeedContext = createContext<SeedContextValue>({ seed: null, setSeed: () => {} })

/**
 * 카드를 누르는 순간 "방금 누른 상품의 요약"을 담아 두는 Context.
 * 실무에서는 목록 store(캐시)가 이 역할을 하지만, 학습용으로는 Context 하나면 충분하다.
 * 메모리에만 있으므로 새로고침(하드 내비게이션)하면 사라진다.
 */
export function ProductSeedProvider({ children }: { children: React.ReactNode }) {
  const [seed, setSeed] = useState<ProductSummary | null>(null)
  return <SeedContext.Provider value={{ seed, setSeed }}>{children}</SeedContext.Provider>
}

export function useSetProductSeed() {
  return useContext(SeedContext).setSeed
}

/** id가 같은 요약이 담겨 있으면 돌려주고, 아니면 null(= 요약 없음). */
export function useProductSeed(id: string): ProductSummary | null {
  const { seed } = useContext(SeedContext)
  return seed?.id === id ? seed : null
}
