import { NextRequest, NextResponse } from 'next/server'
import { readRequests } from '../lib/requestLog'

export const dynamic = 'force-dynamic'

/** ?run= 에 해당하는 영상 요청 기록을 JSON으로 반환한다 (서버가 직접 센 값). */
export async function GET(request: NextRequest) {
  const run = request.nextUrl.searchParams.get('run') ?? 'none'
  return NextResponse.json({ run, requests: readRequests(run) }, { headers: { 'Cache-Control': 'no-store' } })
}
