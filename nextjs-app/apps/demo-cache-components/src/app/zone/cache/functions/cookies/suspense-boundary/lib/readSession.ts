import { cookies } from 'next/headers'
import { COOKIE_NAME, READ_DELAY_MS } from './constants'

/** 요청 쿠키를 읽고 {READ_DELAY_MS}ms 뒤에 돌려준다. 캐시하지 않으며 요청 시점 API(cookies())를 쓴다. */
export async function readSession(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value ?? null
  await new Promise((resolve) => setTimeout(resolve, READ_DELAY_MS))
  return value
}
