import { cookies } from 'next/headers'
import { USER_COOKIE } from './types'

/**
 * 대조군: 일반 'use cache' 스코프 안에서 cookies()를 호출한다.
 * 문서상 허용되지 않는 사용법이며, 실제로 호출하면 Next.js가 오류를 던진다.
 * 페이지 렌더에서는 호출하지 않고 버튼(Server Action)으로만 실행한다.
 */
export async function getOrdersWithSharedCache(): Promise<string> {
  'use cache'
  const value = (await cookies()).get(USER_COOKIE)?.value
  return value ?? 'guest'
}
