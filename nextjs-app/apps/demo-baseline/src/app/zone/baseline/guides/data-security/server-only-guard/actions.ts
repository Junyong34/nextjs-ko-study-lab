'use server'

import { signOrderSync } from './lib/orderSyncSecret'

export interface OrderSyncResult {
  productId: string
  quantity: number
  digest: string
  secretPreview: string
  responseContainsRawSecret: boolean
  timestamp: string
}

export async function syncOrderAction(productId: string, quantity: number): Promise<OrderSyncResult> {
  const { digest, secretPreview } = signOrderSync(productId, quantity)
  const payload = { productId, quantity, digest, secretPreview }

  return {
    ...payload,
    // 클라이언트로 반환되는 JSON에 원본 시크릿 문자열이 없는지 실제로 검사한다.
    responseContainsRawSecret: JSON.stringify(payload).includes('sk_live_9f3a7c21b6d84e0f'),
    timestamp: new Date().toLocaleTimeString(),
  }
}
