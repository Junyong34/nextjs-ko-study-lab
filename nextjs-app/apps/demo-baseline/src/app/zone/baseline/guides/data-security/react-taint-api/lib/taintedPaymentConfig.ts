import 'server-only'
import { experimental_taintUniqueValue } from 'react'

export function getPaymentConfig() {
  const config = {
    merchantId: 'MID-7788',
    secretKey: 'sk_live_9a8b7c6d5e4f3a2b1c0d',
  }

  // 이 값이 클라이언트 경계를 넘어가려는 순간 React가 실제로 런타임 에러를 던진다.
  // (next.config.ts의 experimental.taint: true가 활성화되어 있어야 동작한다)
  experimental_taintUniqueValue(
    '이 결제 시크릿 키는 클라이언트로 전달할 수 없습니다 (React Taint API로 보호됨)',
    config,
    config.secretKey
  )

  return config
}
