'use server'

import { setTimeout } from 'node:timers/promises'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { validateOrder } from './validation'
import type { OrderResult } from './types'

export async function submitExampleOrder(_previous: OrderResult | null, data: FormData): Promise<OrderResult> {
  const result = validateOrder(data, MOCK_PRODUCTS[0]!.id)
  // 실제 Server Action 요청을 관찰할 시간을 확보한다. 결제나 영구 저장은 하지 않는다.
  await setTimeout(1200)
  return result
}
