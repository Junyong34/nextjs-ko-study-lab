'use server'

import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { DEMO_PATH, RECEIPT_COOKIE } from './constants'
import { RECEIPT_MAX_AGE, validateOrder } from './receipt'
import type { OrderActionState, Receipt } from './types'

const cookieOptions = {
  path: DEMO_PATH,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

export async function submitOrder(
  _previous: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const cookieStore = await cookies()
  const order = validateOrder(
    formData.get('productId'),
    formData.get('quantity'),
    MOCK_PRODUCTS.slice(0, 2).map(product => product.id),
  )
  if (!order) {
    cookieStore.set(RECEIPT_COOKIE, '', { ...cookieOptions, maxAge: 0 })
    return { error: '서버가 제출을 거부했습니다. 예시 상품과 정수 수량 1~10개를 선택해 주세요. 완료 화면으로 이동하지 않았습니다.' }
  }

  const receipt: Receipt = { ...order, receiptId: randomUUID(), issuedAt: Date.now() }
  cookieStore.set(RECEIPT_COOKIE, JSON.stringify(receipt), {
    ...cookieOptions,
    maxAge: RECEIPT_MAX_AGE,
  })
  // redirect()는 예외로 흐름을 종료하므로 try/catch로 감싸지 않습니다.
  redirect(`${DEMO_PATH}/complete?receiptId=${receipt.receiptId}`)
}

export async function resetReceipt() {
  const cookieStore = await cookies()
  cookieStore.set(RECEIPT_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  redirect(DEMO_PATH)
}
