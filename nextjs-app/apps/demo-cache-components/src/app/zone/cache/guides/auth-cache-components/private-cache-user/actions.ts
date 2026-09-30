'use server'

import { cookies } from 'next/headers'
import { resetRuns } from './runCounter'
import { CART_USER_IDS, USER_COOKIE_NAME, type CartUserId } from './types'

// 실제 Set-Cookie 응답을 보낸다. 사용자 전환은 쿠키 값이 바뀌는 것뿐이다.
export async function switchCartUserAction(userId: CartUserId) {
  if (!CART_USER_IDS.includes(userId)) throw new Error(`invalid userId: ${userId}`)
  ;(await cookies()).set(USER_COOKIE_NAME, userId, { sameSite: 'lax', path: '/', maxAge: 60 * 60 })
}

export async function resetCartDemoAction() {
  ;(await cookies()).delete(USER_COOKIE_NAME)
  resetRuns()
}
