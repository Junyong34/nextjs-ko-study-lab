'use server'

import { after } from 'next/server'
import { randomUUID, pbkdf2 } from 'node:crypto'
import { promisify } from 'node:util'
import type { AuditLogEntry, SubmitOrderResult } from './types'

const pbkdf2Async = promisify(pbkdf2)

/**
 * dev 서버 프로세스가 살아있는 동안 유지되는 실제 감사 로그 저장소.
 * 요청마다 초기화되는 mock이 아니라, after() 콜백이 실제로 기록한 타임스탬프를 보관한다.
 */
const auditLogStore = new Map<string, AuditLogEntry>()

/** after() 내부에서 실행할 실제 비동기 작업: 카드 결제 식별자를 PBKDF2로 해시 마스킹한다.
 *  setTimeout으로 지연을 흉내 내는 대신, libuv 스레드풀에서 실제로 계산 비용이 드는 연산을 수행해
 *  after() 콜백이 진짜로 실행 시간이 걸리는 background 작업을 완료함을 보여준다. */
const AUDIT_HASH_ITERATIONS = 120_000

export async function submitOrder(orderNumber: string, amount: number): Promise<SubmitOrderResult> {
  const orderId = randomUUID()
  const responseReturnedAt = Date.now()

  auditLogStore.set(orderId, {
    orderId,
    responseReturnedAt,
    afterStartedAt: null,
    afterCompletedAt: null,
    maskedCardDigest: null,
  })

  after(async () => {
    const afterStartedAt = Date.now()
    const pendingEntry = auditLogStore.get(orderId)
    if (pendingEntry) {
      pendingEntry.afterStartedAt = afterStartedAt
    }

    const digest = await pbkdf2Async(
      `${orderNumber}:${amount}`,
      orderId,
      AUDIT_HASH_ITERATIONS,
      16,
      'sha256',
    )
    const afterCompletedAt = Date.now()

    const finalEntry = auditLogStore.get(orderId)
    if (finalEntry) {
      finalEntry.afterCompletedAt = afterCompletedAt
      finalEntry.maskedCardDigest = digest.toString('hex')
    }

    console.info(
      `[after-background-logging] orderId=${orderId} responseReturnedAt=${responseReturnedAt} afterStartedAt=${afterStartedAt} afterCompletedAt=${afterCompletedAt} delta=${afterStartedAt - responseReturnedAt}ms`,
    )
  })

  return { orderId, orderNumber, amount, responseReturnedAt }
}

export async function fetchAuditLogEntry(orderId: string): Promise<AuditLogEntry | null> {
  return auditLogStore.get(orderId) ?? null
}

export async function resetAuditLog(): Promise<void> {
  auditLogStore.clear()
}
