export type SwitchableSessionId = 'customer' | 'vip' | 'admin'
export type PrivateSessionId = SwitchableSessionId | 'guest'

export const SESSION_COOKIE_NAME = 'private-profile-cache-session'

export const SWITCHABLE_SESSION_IDS: SwitchableSessionId[] = ['customer', 'vip', 'admin']

export interface PersonalOrderItem {
  productName: string
  price: number
}

export interface PersonalOrder {
  orderNumber: string
  statusName: string
  createdAt: string
  items: PersonalOrderItem[]
  totalAmount: number
}

export interface PrivateProfileCacheResult {
  sessionId: PrivateSessionId
  userName: string
  tier: string | null
  orders: PersonalOrder[]
  generatedAt: string
  cacheInstanceId: string
}

// 서버(cachedData.ts)와 클라이언트(components/*)가 함께 쓰는 세션 표시 라벨.
export const SESSION_LABELS: Record<PrivateSessionId, string> = {
  guest: '게스트 (비로그인)',
  customer: '김쇼핑 (일반 고객)',
  vip: '이우수 (VIP)',
  admin: '박관리 (관리자)',
}
