import type { Order, OrderLookupResult } from './types'

export const VALID_SESSION_TOKEN = 'sess_8921_signed_ok'

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-7781', item: '무선 노이즈 캔슬링 헤드폰', amount: 299000 },
  { id: 'ORD-7782', item: '기계식 게이밍 키보드', amount: 149000 },
  { id: 'ORD-7783', item: '보조배터리 20000mAh', amount: 39000 },
]

/**
 * 인입된 요청에서 읽은 Authorization 값을 그대로 받아 주문 내역을 조회하는 내부 서비스.
 * headers()로 추출한 값이 이 함수의 매개변수로 그대로 흘러 들어간다는 것이 이 데모의 핵심 관찰 지점이다.
 */
export async function fetchOrdersWithAuthorization(
  authorizationHeader: string | null
): Promise<OrderLookupResult> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return {
      status: 401,
      authorizationReceived: authorizationHeader,
      error: 'Authorization 헤더가 없습니다. 로그인 후 다시 시도해 주세요.',
    }
  }

  const token = authorizationHeader.slice('Bearer '.length)

  if (token !== VALID_SESSION_TOKEN) {
    return {
      status: 401,
      authorizationReceived: authorizationHeader,
      error: `Bearer 토큰이 유효하지 않습니다. (수신된 토큰: ${token})`,
    }
  }

  return {
    status: 200,
    authorizationReceived: authorizationHeader,
    orders: MOCK_ORDERS,
  }
}
