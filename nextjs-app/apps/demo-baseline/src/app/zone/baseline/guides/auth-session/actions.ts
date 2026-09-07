'use server'

import { cookies } from 'next/headers'
import type { UserSession } from './types'

const SESSION_COOKIE_NAME = 'demo_auth_session'

interface SessionCookiePayload {
  userId: string
  userName: string
  role: 'customer' | 'admin'
  token: string
}

export async function getSession(): Promise<UserSession> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!raw) {
    return { isLoggedIn: false }
  }

  try {
    const payload = JSON.parse(raw) as SessionCookiePayload
    return { isLoggedIn: true, ...payload }
  } catch {
    return { isLoggedIn: false }
  }
}

export async function loginAction(
  userId: string,
  role: 'customer' | 'admin',
): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const payload: SessionCookiePayload = {
    userId,
    userName: role === 'admin' ? '최고관리자 (Admin)' : '홍길동 고객님',
    role,
    token: `auth_jwt_${Date.now()}`,
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })

  return { isLoggedIn: true, ...payload }
}

export async function logoutAction(): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  return { isLoggedIn: false }
}
