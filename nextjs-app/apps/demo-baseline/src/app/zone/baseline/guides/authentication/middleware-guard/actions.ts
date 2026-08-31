'use server'

import { cookies } from 'next/headers'
import type { AuthCookieState } from './types'

const AUTH_COOKIE_NAME = 'auth_token'

export async function getAuthCookieState(): Promise<AuthCookieState> {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(AUTH_COOKIE_NAME)

  if (tokenCookie && tokenCookie.value === 'valid') {
    return {
      hasAuth: true,
      token: 'valid',
      user: {
        name: '데모 관리자 (홍길동)',
        role: 'admin',
      },
    }
  }

  return {
    hasAuth: false,
    token: null,
    user: null,
  }
}

export async function toggleAuthCookieAction(): Promise<AuthCookieState> {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(AUTH_COOKIE_NAME)

  if (tokenCookie && tokenCookie.value === 'valid') {
    cookieStore.delete(AUTH_COOKIE_NAME)
    return {
      hasAuth: false,
      token: null,
      user: null,
    }
  }

  cookieStore.set(AUTH_COOKIE_NAME, 'valid', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return {
    hasAuth: true,
    token: 'valid',
    user: {
      name: '데모 관리자 (홍길동)',
      role: 'admin',
    },
  }
}

