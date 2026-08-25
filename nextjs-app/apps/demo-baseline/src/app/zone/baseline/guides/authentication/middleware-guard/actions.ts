'use server'

import { cookies } from 'next/headers'
import type { AuthCookieState, RouteGuardTestResult } from './types'

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

export async function testMiddlewareRouteAccess(targetPath: string): Promise<RouteGuardTestResult> {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(AUTH_COOKIE_NAME)
  const isAuth = tokenCookie?.value === 'valid'
  const isProtected = targetPath.startsWith('/admin') || targetPath.startsWith('/mypage')

  if (isProtected && !isAuth) {
    return {
      path: targetPath,
      status: 307,
      decision: 'REDIRECTED',
      redirectUrl: `/login?redirect=${encodeURIComponent(targetPath)}`,
      reason: `미인증 요청 차단: '${AUTH_COOKIE_NAME}' 쿠키가 없어 로그인 페이지로 307 임시 리다이렉트`,
      timestamp: new Date().toLocaleTimeString(),
    }
  }

  return {
    path: targetPath,
    status: 200,
    decision: 'ALLOWED',
    reason: isProtected
      ? `인가 성공: 유효한 '${AUTH_COOKIE_NAME}=valid' 쿠키가 확인되어 보호 구역 접근 허용`
      : `공개 라우트: 인증 불필요 (누구나 접근 가능)`,
    timestamp: new Date().toLocaleTimeString(),
  }
}
