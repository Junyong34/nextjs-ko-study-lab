import 'server-only'
import { experimental_taintUniqueValue } from 'react'

/**
 * PG(결제 대행사) 연동 시크릿을 서버에서만 읽는다는 것을 흉내 낸 값이다.
 * pgSecretKey는 experimental_taintUniqueValue로 오염(taint) 표시되어 Client Component
 * props나 Server Action 응답으로 그대로 반환되면 React가 실제 런타임 에러를 던진다.
 * legacyWebhookSecret은 의도적으로 taint를 걸지 않은 대조군이다 — taint를 걸지 않으면
 * 보호가 전혀 적용되지 않는다는 것을 같은 화면에서 대조하기 위한 값이다.
 */
export function getPaymentGatewaySecrets() {
  const secrets = {
    merchantId: 'MERCHANT-48291',
    pgSecretKey: 'DEMO-PG-SECRET-KEY-NOT-REAL-7f3a9c2e8b1d4f6a0c5e9b2d',
    legacyWebhookSecret: 'DEMO-LEGACY-WEBHOOK-SECRET-NOT-REAL-c481f9203ade77b6',
  }

  experimental_taintUniqueValue(
    'pgSecretKey는 experimental_taintUniqueValue로 보호됩니다. Client Component나 Server Action 응답으로 전달할 수 없습니다.',
    secrets,
    secrets.pgSecretKey,
  )

  return secrets
}
