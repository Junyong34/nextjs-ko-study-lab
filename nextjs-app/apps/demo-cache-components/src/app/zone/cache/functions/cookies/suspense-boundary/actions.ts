'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAME, COOKIE_VALUE, DEMO_PATH } from './lib/constants'

/** 데모 쿠키를 발급한다. path를 데모 경로로 좁혀 같은 zone의 다른 데모에 보내지 않는다. */
export async function setSessionAction(): Promise<string> {
  const store = await cookies()
  store.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: DEMO_PATH,
    maxAge: 60 * 10,
  })
  return COOKIE_VALUE
}

export async function clearSessionAction(): Promise<void> {
  const store = await cookies()
  store.delete({ name: COOKIE_NAME, path: DEMO_PATH })
}
