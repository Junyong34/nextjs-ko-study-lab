import type { EnvName } from '../types'

/**
 * 브라우저 번들에서 process.env를 읽는 두 가지 방법.
 * - literal: `process.env.이름` 형태의 리터럴 참조. NEXT_PUBLIC_ 변수와 NODE_ENV는 빌드(컴파일) 시점에 값으로 치환(인라인)된다.
 * - dynamic: `process.env[name]` 동적 조회. 치환 대상이 아니어서 브라우저에서는 항상 값을 찾지 못한다.
 */
export function readInBrowser(name: EnvName): { literal: string | null; dynamic: string | null } {
  const literals: Record<EnvName, string | undefined> = {
    NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
    INTERNAL_ADMIN_EMAIL: process.env.INTERNAL_ADMIN_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
  }
  return { literal: literals[name] ?? null, dynamic: process.env[name] ?? null }
}
