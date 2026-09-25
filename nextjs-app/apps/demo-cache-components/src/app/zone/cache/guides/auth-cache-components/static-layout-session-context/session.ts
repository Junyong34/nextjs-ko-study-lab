import { cookies } from 'next/headers'
import { MOCK_USER_SESSIONS } from '@study/demo-kit'
import type { CurrentUserResult, SessionUser } from './types'

/** 이 데모 경로에서만 쓰는 쿠키 — 이름에 데모 접두사를 붙이고 path를 데모 경로로 한정한다. */
export const SESSION_COOKIE_NAME = 'demo-static-layout-session-context-sid'
export const DEMO_PATH = '/zone/cache/guides/auth-cache-components/static-layout-session-context'

/** 데모 사용자 저장소 — 외부 IdP 대신 demo-kit의 고정 사용자 표를 조회한다. */
export const DEMO_USER_IDS = ['usr_guest123', 'usr_vip999'] as const

export function findUserById(userId: string): SessionUser | null {
  const found = Object.values(MOCK_USER_SESSIONS).find((u) => u.userId === userId)
  if (!found || !(DEMO_USER_IDS as readonly string[]).includes(found.userId)) return null
  // 클라이언트로 갈 필드만 좁혀서 반환한다 (email·role·token 제외).
  return { id: found.userId, name: found.name, tier: found.tier, points: found.points }
}

/**
 * 가이드 1단계의 getCurrentUser() — 요청 시점에 세션 쿠키를 읽는다.
 * cookies()를 읽으므로 반드시 Suspense 경계 안에서만 기다려야 한다.
 * (가이드는 여기에 'use cache: private'를 붙이지만, 이 데모는 스트리밍 구조에 집중하려고
 *  캐시 없이 매 요청 새로 읽는다. 형제 실습 private-cache-user 참고)
 */
export async function getCurrentUser(): Promise<CurrentUserResult> {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const user = sessionId ? findUserById(sessionId) : null
  return {
    user,
    requestId: crypto.randomUUID().slice(0, 8),
    readAt: new Date().toISOString(),
  }
}
