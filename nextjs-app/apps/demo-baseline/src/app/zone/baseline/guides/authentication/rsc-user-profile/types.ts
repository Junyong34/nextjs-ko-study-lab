export interface UserProfile {
  id: string
  name: string
  grade: 'VIP' | 'REGULAR' | 'GUEST'
  points: number
  couponCount: number
  email: string
  renderedAt: string
}

export type SessionRole = 'vip' | 'regular' | 'guest'
