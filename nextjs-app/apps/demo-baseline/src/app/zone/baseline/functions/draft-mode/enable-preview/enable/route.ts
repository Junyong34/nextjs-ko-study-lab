import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * 공식 문서(app/api-reference/functions/draft-mode) Step 1 예제와 동일한 Route Handler다.
 * draft.enable()이 실제로 __prerender_bypass 쿠키를 Set-Cookie 응답 헤더로 내려보내므로,
 * 이 경로로의 이동 자체가 검증 대상이다 — 브라우저 개발자 도구 Network 탭에서 확인한다.
 */
export async function GET() {
  const draft = await draftMode()
  draft.enable()
  redirect('/zone/baseline/functions/draft-mode/enable-preview')
}
