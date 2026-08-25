'use server'

import { cookies } from 'next/headers'
import type { UserProfile, SessionRole } from './types'

const SESSION_COOKIE_NAME = 'user_session_role'

export async function getServerUserProfile(): Promise<UserProfile> {
  const cookieStore = await cookies()
  const sessionRole = (cookieStore.get(SESSION_COOKIE_NAME)?.value as SessionRole) || 'vip'

  if (sessionRole === 'guest') {
    return {
      id: 'guest',
      name: '비회원 게스트',
      grade: 'GUEST',
      points: 0,
      couponCount: 0,
      email: 'guest@shop.com',
      renderedAt: new Date().toISOString(),
    }
  }

  if (sessionRole === 'regular') {
    return {
      id: 'user-02',
      name: '이몽룡',
      grade: 'REGULAR',
      points: 3500,
      couponCount: 1,
      email: 'mongryong@shop.com',
      renderedAt: new Date().toISOString(),
    }
  }

  // Default: VIP (홍길동)
  return {
    id: 'user-01',
    name: '홍길동',
    grade: 'VIP',
    points: 15200,
    couponCount: 3,
    email: 'gildong.hong@shop.com',
    renderedAt: new Date().toISOString(),
  }
}

export async function switchSessionRoleAction(role: SessionRole): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}
