'use server'

import { cookies } from 'next/headers'
import { readExecCount } from './queries'
import { getOrdersWithSharedCache } from './shared-cache-probe'
import {
  BASE_PATH,
  USER_COOKIE,
  formatTime,
  toViewerId,
  type DemoUserId,
  type ExecCountResult,
  type ProbeResult,
} from './types'

/** 로그인 사용자 전환: 데모 경로로 한정한 쿠키를 발급한다. 쿠키 변경은 현재 라우트를 다시 렌더한다. */
export async function switchUser(userId: DemoUserId): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(USER_COOKIE, toViewerId(userId), {
    path: BASE_PATH,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete({ name: USER_COOKIE, path: BASE_PATH })
}

/** 서버 프로세스가 지금까지 현재 사용자로 private 함수 본문을 몇 번 실행했는지 읽는다 (캐시 함수는 호출하지 않는다). */
export async function checkServerExecCount(): Promise<ExecCountResult> {
  const viewer = toViewerId((await cookies()).get(USER_COOKIE)?.value)
  return { viewer, count: readExecCount(viewer), checkedAt: formatTime(new Date()) }
}

/** 대조 실험: 일반 'use cache' 안의 cookies() 호출이 실제로 거부되는지 확인한다. */
export async function probeSharedCacheCookies(): Promise<ProbeResult> {
  const checkedAt = formatTime(new Date())
  try {
    const value = await getOrdersWithSharedCache()
    return { ok: true, value, checkedAt }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    const digest = 'digest' in err && typeof err.digest === 'string' ? err.digest : null
    return { ok: false, name: err.name, message: err.message, digest, checkedAt }
  }
}
