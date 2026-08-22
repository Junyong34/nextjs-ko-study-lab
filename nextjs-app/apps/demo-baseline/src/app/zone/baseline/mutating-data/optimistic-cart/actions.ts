'use server'

import type { OptimisticCartItem } from './types'

// 서버 메모리 장바구니
let serverCart: OptimisticCartItem[] = [
  { id: 'item-1', name: '초경량 메쉬 러닝화', price: 129000, quantity: 1 },
]

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getServerCart(): Promise<OptimisticCartItem[]> {
  return [...serverCart]
}

/**
 * Server Action: 의도적으로 800ms 네트워크 지연을 두고 장바구니에 아이템 추가
 */
export async function addCartItemServer(
  item: Omit<OptimisticCartItem, 'quantity' | 'isOptimistic'>,
): Promise<OptimisticCartItem[]> {
  // 실제 네트워크 통신 및 DB 트랜잭션 지연 (800ms)
  await sleep(800)

  const existing = serverCart.find((i) => i.id === item.id)
  if (existing) {
    serverCart = serverCart.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
    )
  } else {
    serverCart = [...serverCart, { ...item, quantity: 1 }]
  }

  return [...serverCart]
}

export async function resetServerCart(): Promise<OptimisticCartItem[]> {
  serverCart = [
    { id: 'item-1', name: '초경량 메쉬 러닝화', price: 129000, quantity: 1 },
  ]
  return [...serverCart]
}
