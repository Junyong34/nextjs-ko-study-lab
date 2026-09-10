'use server'

import { cookies } from 'next/headers'
import { MOCK_USER_SESSIONS } from '@study/demo-kit'
import type { SessionCookieState, SessionRole } from './types'

const SESSION_TOKEN_COOKIE = 'session-token'
const USER_ROLE_COOKIE = 'user-role'

export async function getSessionCookieState(): Promise<SessionCookieState> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value ?? null
  const role = cookieStore.get(USER_ROLE_COOKIE)?.value ?? null

  return {
    role,
    hasSessionToken: token !== null,
    sessionTokenPreview: token ? `${token.slice(0, 24)}…` : null,
  }
}

// 역할 버튼 클릭 시 실제로 호출되는 Server Action.
// (await cookies()).set()이 실제 Set-Cookie 응답 헤더 2개를 브라우저로 전송한다.
export async function issueSessionAction(role: SessionRole): Promise<SessionCookieState> {
  const session = MOCK_USER_SESSIONS[role]
  const cookieStore = await cookies()

  // session-token: httpOnly라서 브라우저 JS(document.cookie)가 읽을 수 없다.
  cookieStore.set(SESSION_TOKEN_COOKIE, `jwt_${session.userId}_${Date.now()}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === 'production',
  })

  // user-role: httpOnly가 아니므로 document.cookie로 실제로 읽힌다 (대조군).
  cookieStore.set(USER_ROLE_COOKIE, session.role, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  return getSessionCookieState()
}

export async function resetSessionAction(): Promise<SessionCookieState> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_TOKEN_COOKIE)
  cookieStore.delete(USER_ROLE_COOKIE)

  return getSessionCookieState()
}
