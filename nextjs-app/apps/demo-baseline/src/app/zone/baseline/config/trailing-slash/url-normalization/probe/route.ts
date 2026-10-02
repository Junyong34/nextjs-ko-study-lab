import { NextRequest, NextResponse } from 'next/server'
import { CASES } from '../lib/cases'
import type { ProbeResult } from '../types'

// 브라우저 fetch(redirect: 'manual')는 3xx를 opaqueredirect로 가려 status/Location을 읽을 수 없다.
// 그래서 서버(Node fetch)가 같은 앱에 요청을 보내 308 응답을 있는 그대로 읽는다.
// 정의된 케이스 id만 받아 임의 URL 요청을 막는다.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('case')
  const c = CASES.find((item) => item.id === id)
  if (!c) return NextResponse.json({ error: '정의된 케이스만 요청할 수 있습니다.' }, { status: 400 })

  const startedAt = performance.now()
  let res: Response
  try {
    res = await fetch(`${request.nextUrl.origin}${c.path}`, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(10_000) })
  } catch (e) {
    return NextResponse.json({ error: `요청 실패: ${e instanceof Error ? e.message : String(e)}` }, { status: 502 })
  }
  const result: ProbeResult = {
    caseId: c.id,
    requestedPath: c.path,
    status: res.status,
    statusText: res.statusText,
    location: res.headers.get('location'),
    contentType: res.headers.get('content-type'),
    elapsedMs: Math.round(performance.now() - startedAt),
  }
  return NextResponse.json(result)
}
