'use server'

import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, type SessionState } from './types'

export async function getCurrentSession(): Promise<SessionState> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value === 'authenticated' ? 'authenticated' : 'anonymous'
}

export async function setSessionAction(session: SessionState): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function resetSessionAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
