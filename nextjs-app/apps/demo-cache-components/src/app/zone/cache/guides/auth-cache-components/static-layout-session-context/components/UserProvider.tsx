'use client'

import { createContext, use } from 'react'
import type { ReactNode } from 'react'
import type { CurrentUserResult } from '../types'

// 가이드 3단계 그대로 — Context에는 값이 아니라 Promise를 담는다.
const UserContext = createContext<Promise<CurrentUserResult> | null>(null)

export function UserProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<CurrentUserResult>
  children: ReactNode
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}

/** Promise가 풀릴 때까지 중단(suspend)하므로 호출 컴포넌트는 자체 Suspense 뒤에 둔다. */
export function useUser(): CurrentUserResult {
  const userPromise = use(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return use(userPromise)
}
