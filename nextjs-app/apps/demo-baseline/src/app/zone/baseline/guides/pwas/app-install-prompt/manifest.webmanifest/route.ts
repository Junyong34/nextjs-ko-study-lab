import { NextResponse } from 'next/server'
import manifest from '../manifest'

/**
 * 실제 GET 엔드포인트. manifest.ts의 default export를 그대로 호출해 응답을 만든다 —
 * 검증 화면은 이 응답을 fetch로 읽을 뿐, 값을 다시 계산하거나 흉내 내지 않는다.
 * Content-Type은 웹 앱 매니페스트 표준 MIME(application/manifest+json)이다.
 */
export async function GET() {
  return new NextResponse(JSON.stringify(manifest()), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
