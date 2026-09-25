import { NextRequest, NextResponse } from 'next/server'
import { buildProbeBody } from '../probe-body'
import { PROBE_MAX_DELAY_MS, PROBE_NAMES } from '../types'
import type { ProbeName } from '../types'

export const dynamic = 'force-dynamic'

/**
 * 외부 CDN 대신 서드파티 스크립트 역할을 하는 실제 JS 파일.
 * - ?name= : 허용 목록의 프로브 이름만 받는다(그 외 400).
 * - ?delay=ms : 서버가 응답을 실제로 늦춘다(최대 2000ms). 무거운 SDK가 늦게 도착하는 네트워크 조건을 만든다.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const name = params.get('name') ?? ''
  if (!(PROBE_NAMES as string[]).includes(name)) {
    return new NextResponse('/* unknown probe */', {
      status: 400,
      headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }

  const rawDelay = Number(params.get('delay') ?? 0)
  const delayMs = Number.isFinite(rawDelay) ? Math.min(Math.max(Math.trunc(rawDelay), 0), PROBE_MAX_DELAY_MS) : 0
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  return new NextResponse(buildProbeBody(name as ProbeName), {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
