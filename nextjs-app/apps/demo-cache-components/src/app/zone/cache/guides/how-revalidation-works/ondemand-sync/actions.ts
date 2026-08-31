'use server'

import { revalidateTag } from 'next/cache'
import { productStore } from './store'

export async function revalidateProductsTagAction() {
  for (const p of productStore) {
    p.price += Math.random() > 0.5 ? 1000 : -1000
    p.stock = Math.max(1, p.stock + Math.floor(Math.random() * 5) - 2)
  }

  // Next.js 16 공식 캐시 태그 무효화 트리거 (tag, profile)
  revalidateTag('products', 'max')
}
