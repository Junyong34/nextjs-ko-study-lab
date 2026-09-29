import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { MOCK_PRODUCTS, MOCK_USER_SESSIONS } from '@study/demo-kit'
import { SESSION_COOKIE_NAME, SWITCHABLE_SESSION_IDS } from './types'
import type { PersonalOrder, PrivateProfileCacheResult, PrivateSessionId, SwitchableSessionId } from './types'

function buildOrder(
  orderNumber: string,
  statusName: string,
  createdAt: string,
  productIds: string[],
): PersonalOrder {
  const items = productIds.map((id) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === id)
    if (!product) throw new Error(`product not found: ${id}`)
    return { productName: product.name, price: product.price }
  })
  return {
    orderNumber,
    statusName,
    createdAt,
    items,
    totalAmount: items.reduce((sum, item) => sum + item.price, 0),
  }
}

// 세션별 개인화 주문 내역. userId가 아니라 쿠키의 세션 식별자를 키로 삼는다.
const ORDER_HISTORY: Record<SwitchableSessionId, PersonalOrder[]> = {
  customer: [
    buildOrder('ORD-8801', '배송 완료', '2026-09-12', ['prod-001']),
    buildOrder('ORD-8815', '배송 중', '2026-09-24', ['prod-004']),
  ],
  vip: [
    buildOrder('ORD-4402', '배송 완료', '2026-09-05', ['prod-003', 'prod-006']),
    buildOrder('ORD-4419', '결제 완료', '2026-09-26', ['prod-007']),
  ],
  admin: [
    buildOrder('ORD-0091', '배송 완료', '2026-08-30', ['prod-002']),
    buildOrder('ORD-0103', '취소됨', '2026-09-18', ['prod-008']),
  ],
}

function resolveSessionId(raw: string | undefined): PrivateSessionId {
  return (SWITCHABLE_SESSION_IDS as string[]).includes(raw ?? '') ? (raw as SwitchableSessionId) : 'guest'
}

/**
 * 'use cache: private' 스코프 안에서만 cookies()를 호출할 수 있다(일반 'use cache'는 금지).
 * 결과는 서버에 저장되지 않고 브라우저 메모리에만 캐시되므로, 새로고침하면 cacheInstanceId가
 * 다시 발급된다 — nextjs-app/apps/demo-cache-components/node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-private.md 기준.
 */
export async function getPrivateOrderHistory(): Promise<PrivateProfileCacheResult> {
  'use cache: private'
  cacheLife('minutes')

  const cookieStore = await cookies()
  const sessionId = resolveSessionId(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  cacheTag(`directives-use-cache-private-profile-cache:${sessionId}`)

  const isGuest = sessionId === 'guest'
  const session = isGuest ? null : MOCK_USER_SESSIONS[sessionId]

  return {
    sessionId,
    userName: session?.name ?? '게스트 (비로그인)',
    tier: session?.tier ?? null,
    orders: isGuest ? [] : ORDER_HISTORY[sessionId],
    generatedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    cacheInstanceId: Math.random().toString(36).slice(2, 8).toUpperCase(),
  }
}
