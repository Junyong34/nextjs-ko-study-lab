import { NextRequest, NextResponse } from 'next/server'
import { REGEX_DEMO_BASE } from '@/config/demo-next-config/redirects-regex'
import type { ProbeResult } from '../types'

// 브라우저의 fetch(redirect: 'manual')는 3xx 응답을 opaqueredirect로 가려 status/Location을 못 읽는다.
// 그래서 서버(Node fetch)가 같은 앱에 요청을 보내 3xx 응답을 있는 그대로 읽는다.
// 이 핸들러는 데모 base 하위 경로만 호출하도록 제한한다(임의 URL 요청 방지).
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? ''
  const invalid = !path.startsWith('/') || path.startsWith('//') || path.startsWith('/probe') || path.length > 200 || /[\\\s]|\.\./.test(path)
  if (invalid) return NextResponse.json({ error: '데모 경로(/…)만 조회할 수 있습니다.' }, { status: 400 })

  const target = `${request.nextUrl.origin}${REGEX_DEMO_BASE}${path}`
  const startedAt = performance.now()
  const res = await fetch(target, { redirect: 'manual', cache: 'no-store' })
  const result: ProbeResult = {
    requestedPath: `${REGEX_DEMO_BASE}${path}`,
    status: res.status,
    statusText: res.statusText,
    location: res.headers.get('location'),
    refresh: res.headers.get('refresh'),
    elapsedMs: Math.round(performance.now() - startedAt),
  }
  return NextResponse.json(result)
}
