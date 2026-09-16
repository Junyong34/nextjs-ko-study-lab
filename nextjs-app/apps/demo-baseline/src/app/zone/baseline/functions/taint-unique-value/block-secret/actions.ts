'use server'

import { getPaymentGatewaySecrets } from './payment-secret'
import type { TaintAttemptResult } from './types'

function nowKST(): string {
  return new Date().toLocaleTimeString('ko-KR')
}

/**
 * taint된 pgSecretKey를 그대로 Server Action 응답에 담아 클라이언트로 반환하려 시도한다.
 * React가 응답을 직렬화하는 시점에 실제 예외를 던지므로, 정상적으로는 이 함수가 값을 반환하기
 * 전에 호출부(page.tsx)의 await가 reject된다. 아래 return은 "taint가 실패했다면"의 방어 코드다.
 */
export async function attemptTaintedSecretAction(): Promise<TaintAttemptResult> {
  const secrets = getPaymentGatewaySecrets()
  // 주의: 여기서 `pgSecretKey`를 템플릿 리터럴로 문자열에 섞으면 안 된다 — taint는 파생된
  // 값을 추적하지 못하므로, 문자열 보간으로 만든 새 문자열은 taint 없이 그대로 직렬화되어
  // "message" 필드를 통해 시크릿이 유출된다(이 데모를 만들며 curl로 직접 확인한 실제 동작).
  // 반드시 taint된 원본 참조(secrets.pgSecretKey)를 그대로 전달해야 차단된다.
  return {
    case: 'tainted',
    blocked: false,
    message: '차단되지 않음 — pgSecretKey가 원문 그대로 반환됨',
    revealedSecret: secrets.pgSecretKey,
    timestamp: nowKST(),
  }
}

/** taint를 걸지 않은 legacyWebhookSecret을 그대로 반환한다 — 정상적으로 성공해야 한다. */
export async function attemptUntaintedSecretAction(): Promise<TaintAttemptResult> {
  const secrets = getPaymentGatewaySecrets()
  return {
    case: 'untainted',
    blocked: false,
    message: `taint 미적용 — legacyWebhookSecret이 그대로 반환됨: ${secrets.legacyWebhookSecret}`,
    revealedSecret: secrets.legacyWebhookSecret,
    timestamp: nowKST(),
  }
}
