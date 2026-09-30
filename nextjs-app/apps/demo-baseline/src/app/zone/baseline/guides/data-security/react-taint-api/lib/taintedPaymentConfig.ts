import 'server-only'
import { experimental_taintObjectReference, experimental_taintUniqueValue } from 'react'

export interface PaymentConfig {
  merchantId: string
  secretKey: string
}

export function getPaymentConfig(): PaymentConfig {
  const config: PaymentConfig = {
    merchantId: 'MID-7788',
    secretKey: 'sk_live_DEMO_NOT_REAL_9a8b7c6d5e4f3a2b1c0d',
  }

  // 객체 참조 자체를 오염: config 객체를 그대로 클라이언트에 넘기면 차단된다.
  // (복사본 { ...config }은 다른 참조라 보호받지 못한다.)
  experimental_taintObjectReference(
    'config 객체를 클라이언트로 전달할 수 없습니다 (taintObjectReference)',
    config,
  )
  // 값 자체를 오염: secretKey 문자열이 어디서 나오든 그 값 그대로는 차단된다.
  // 세 번째 인자(config)가 살아 있는 동안 오염이 유지된다.
  experimental_taintUniqueValue(
    'secretKey 값은 클라이언트로 전달할 수 없습니다 (taintUniqueValue)',
    config,
    config.secretKey,
  )

  return config
}
