'use server'

import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, SWITCHABLE_SESSION_IDS } from './types'
import type { SwitchableSessionId } from './types'

// 실제 Set-Cookie 응답 헤더를 보낸다 — 클라이언트에서 상태만 바꿔 흉내 내지 않는다.
export async function switchPrivateSessionAction(sessionId: SwitchableSessionId) {
  if (!(SWITCHABLE_SESSION_IDS as string[]).includes(sessionId)) {
    throw new Error(`invalid sessionId: ${sessionId}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })
}

export async function resetPrivateSessionAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
