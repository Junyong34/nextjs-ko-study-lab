'use server'

import { cookies } from 'next/headers'
import type { CookieObservation } from './types'

const COOKIE_NAME = 'study-cookies-delete-logout-session'
const COOKIE_PATH = '/zone/baseline/functions/cookies/delete-logout'
const COOKIE_VALUE = 'demo-vip'

export async function readSessionCookie(): Promise<CookieObservation> {
  const cookie = (await cookies()).get(COOKIE_NAME)
  return {
    present: cookie !== undefined,
    isDemoMember: cookie?.value === COOKIE_VALUE,
    checkedAt: new Date().toISOString(),
  }
}

export async function createSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    path: COOKIE_PATH,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function deleteSessionCookie(): Promise<{ hadCookie: boolean }> {
  const cookieStore = await cookies()
  const hadCookie = cookieStore.has(COOKIE_NAME)
  cookieStore.delete({ name: COOKIE_NAME, path: COOKIE_PATH })
  // 삭제 전 요청의 존재 여부다. 브라우저 적용 결과는 별도 읽기로 확인한다.
  return { hadCookie }
}
