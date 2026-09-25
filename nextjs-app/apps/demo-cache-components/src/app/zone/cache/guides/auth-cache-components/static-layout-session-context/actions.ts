'use server'

import { cookies } from 'next/headers'
import { DEMO_PATH, SESSION_COOKIE_NAME, findUserById } from './session'

/** 데모 로그인 — 서버에서 사용자 ID를 검증한 뒤 세션 ID만 httpOnly 쿠키로 저장한다. */
export async function loginAction(formData: FormData): Promise<void> {
  const userId = String(formData.get('userId') ?? '')
  // 클라이언트가 보낸 값을 그대로 믿지 않고 사용자 저장소에서 다시 확인한다.
  if (!findUserById(userId)) return

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: DEMO_PATH,
    maxAge: 60 * 60,
  })
}

/** 데모 로그아웃 — 같은 path로 쿠키를 지운다. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete({ name: SESSION_COOKIE_NAME, path: DEMO_PATH })
}
