'use server'
import { cookies } from 'next/headers'
import { ROLE_COOKIE, type Role } from './roleCookie'

// Server Action에서 쿠키를 바꾸면 현재 라우트가 서버에서 다시 렌더링되고,
// layout.tsx가 새 쿠키로 슬롯을 다시 고른다.
export async function setRole(role: Role) {
  const store = await cookies()
  store.set(ROLE_COOKIE, role, { path: '/', sameSite: 'lax', httpOnly: false })
}

export async function clearRole() {
  const store = await cookies()
  store.delete(ROLE_COOKIE)
}
