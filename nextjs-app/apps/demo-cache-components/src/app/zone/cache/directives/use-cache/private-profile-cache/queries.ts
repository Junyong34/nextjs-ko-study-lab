import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import {
  USER_COOKIE,
  formatTime,
  toViewerId,
  type OrderRow,
  type PrivateOrderSnapshot,
  type ViewerId,
} from './types'

// 서버 프로세스 메모리의 실행 카운터 (캐시가 아니라 계측용).
// 'use cache: private' 본문이 서버에서 실제로 실행될 때만 증가한다.
const execCountByViewer = new Map<ViewerId, number>()

export function readExecCount(viewer: ViewerId): number {
  return execCountByViewer.get(viewer) ?? 0
}

const STATUSES: OrderRow['status'][] = ['배송 중', '결제 완료', '배송 완료']

function buildOrders(viewer: ViewerId): OrderRow[] {
  if (viewer === 'guest') return []
  const offset = viewer === 'user-a' ? 0 : 1
  return [0, 2, 4].map((step, i) => {
    const product = MOCK_PRODUCTS[(step + offset) % MOCK_PRODUCTS.length]
    const tag = viewer === 'user-a' ? 'A' : 'B'
    return {
      orderId: `ORD-${tag}-${String(i + 1).padStart(3, '0')}`,
      productName: product.name,
      price: product.price,
      status: STATUSES[(i + offset) % STATUSES.length],
      trackingNo: `${tag}${7310 + i * 17 + offset * 5}`,
    }
  })
}

/**
 * 개인화 주문 내역. cookies()를 캐시 스코프 "안에서" 직접 읽는다.
 * 일반 'use cache'에서는 오류지만 'use cache: private'에서는 허용된다.
 * 결과는 서버에 저장되지 않고, 이 요청을 보낸 브라우저의 메모리에만 캐시된다.
 */
export async function getMyOrders(): Promise<PrivateOrderSnapshot> {
  'use cache: private'
  // stale 5분 이상이어야 라우트의 App Shell(프리페치)에 포함되어 브라우저가 재사용할 수 있다.
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })

  const cookieValue = (await cookies()).get(USER_COOKIE)?.value ?? null
  const viewer = toViewerId(cookieValue ?? undefined)

  const execNoForViewer = readExecCount(viewer) + 1
  execCountByViewer.set(viewer, execNoForViewer)

  return {
    viewer,
    cookieValue,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: formatTime(new Date()),
    execNoForViewer,
    orders: buildOrders(viewer),
  }
}
