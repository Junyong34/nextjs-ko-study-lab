'use server'

import type { UserSession } from './types'

let currentSession: UserSession = {
  isLoggedIn: false,
}

export async function getSession(): Promise<UserSession> {
  return { ...currentSession }
}

export async function loginAction(
  userId: string,
  role: 'customer' | 'admin',
): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  currentSession = {
    isLoggedIn: true,
    userId,
    userName: role === 'admin' ? '최고관리자 (Admin)' : '홍길동 고객님',
    role,
    token: `auth_jwt_${Date.now()}`,
  }

  return { ...currentSession }
}

export async function logoutAction(): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  currentSession = {
    isLoggedIn: false,
  }

  return { ...currentSession }
}
