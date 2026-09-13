import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import type { DraftStatus } from '../types'

/**
 * 실습 0단계(사전 준비) 전용 Route Handler.
 * disable() 실습은 "먼저 켜져 있는 초안 모드"가 있어야 의미가 있으므로,
 * 여기서 실제 draftMode().enable()을 호출해 __prerender_bypass 쿠키를 발급한다.
 */
export async function POST(): Promise<Response> {
  const draft = await draftMode()
  draft.enable()

  const cookieStore = await cookies()
  const status: DraftStatus = {
    isEnabled: draft.isEnabled,
    hasBypassCookie: Boolean(cookieStore.get('__prerender_bypass')?.value),
  }
  return Response.json(status)
}
