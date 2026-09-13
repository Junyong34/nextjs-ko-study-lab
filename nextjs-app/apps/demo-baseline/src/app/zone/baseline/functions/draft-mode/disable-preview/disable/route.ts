import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import type { DraftStatus } from '../types'

/**
 * 이번 실습의 핵심 Route Handler. draftMode().disable()을 호출해
 * __prerender_bypass 쿠키를 삭제한다 (Next.js 내부 구현: Max-Age=0이 아니라
 * expires를 과거(1970-01-01)로 설정해 삭제한다).
 *
 * 브라우저 개발자 도구 Network 탭에서 이 POST 요청의 Response Headers >
 * Set-Cookie 값을 직접 열어보면 "__prerender_bypass=; Path=/;
 * Expires=Thu, 01 Jan 1970 ...; HttpOnly"를 실제로 확인할 수 있다.
 */
export async function POST(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()

  const cookieStore = await cookies()
  const status: DraftStatus = {
    isEnabled: draft.isEnabled,
    hasBypassCookie: Boolean(cookieStore.get('__prerender_bypass')?.value),
  }
  return Response.json(status)
}
