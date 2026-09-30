export const ROLE_COOKIE = 'demo_role'
export type Role = 'admin' | 'user'

// admin 이외의 값(없음 포함)은 모두 user 슬롯으로 처리한다.
export function toRole(value: string | undefined): Role {
  return value === 'admin' ? 'admin' : 'user'
}
