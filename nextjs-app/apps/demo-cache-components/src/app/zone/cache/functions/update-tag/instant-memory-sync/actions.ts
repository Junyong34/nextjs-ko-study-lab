'use server'

import { updateTag, revalidateTag } from 'next/cache'
import { TAGS } from './tags'
import { incrementUpdateTagCartQty, incrementRevalidateTagCartQty } from './cartStore'
import type { CartQtyActionResult } from './types'

export async function incrementViaUpdateTagAction(): Promise<CartQtyActionResult> {
  const qty = incrementUpdateTagCartQty()

  // Server Action 안에서만 호출 가능. 다음 요청이 새 값을 기다리게 만든다(read-your-own-writes).
  updateTag(TAGS.updateTagCart)

  return {
    mode: 'updateTag',
    tag: TAGS.updateTagCart,
    qty,
    timestamp: new Date().toLocaleTimeString(),
  }
}

export async function incrementViaRevalidateTagAction(): Promise<CartQtyActionResult> {
  const qty = incrementRevalidateTagCartQty()

  // profile 'max' → stale-while-revalidate. 다음 방문까지 이전 값이 먼저 보일 수 있다.
  revalidateTag(TAGS.revalidateTagCart, 'max')

  return {
    mode: 'revalidateTag',
    tag: TAGS.revalidateTagCart,
    qty,
    timestamp: new Date().toLocaleTimeString(),
  }
}
