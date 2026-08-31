'use server'

import { getPaymentConfig } from './lib/taintedPaymentConfig'

export interface TaintActionResult {
  ok: boolean
  merchantId?: string
  maskedKey?: string
  errorMessage?: string
  timestamp: string
}

export async function safePaymentAction(): Promise<TaintActionResult> {
  const config = getPaymentConfig()
  const maskedKey = `${config.secretKey.slice(0, 7)}${'*'.repeat(config.secretKey.length - 7)}`
  return {
    ok: true,
    merchantId: config.merchantId,
    maskedKey,
    timestamp: new Date().toLocaleTimeString(),
  }
}

// 의도적으로 tainted 값을 그대로 클라이언트에 반환하려는 "위험한 시도".
// React가 이 반환값을 클라이언트로 직렬화하는 시점에 실제 런타임 에러를 던지므로,
// 이 함수 자체는 정상 반환처럼 보여도 호출부(클라이언트)의 await가 예외로 reject된다.
export async function leakPaymentSecretAction(): Promise<TaintActionResult> {
  const config = getPaymentConfig()
  return {
    ok: true,
    merchantId: config.secretKey,
    timestamp: new Date().toLocaleTimeString(),
  }
}
