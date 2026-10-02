import { NextResponse } from 'next/server'
import { readServerReads, resetServerReads } from '../../lib/deals'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }

// 서버가 데이터를 읽은 기록(어느 쪽이 읽었는지). 이 URL은 api/deals와 달라 브라우저 요청 수 측정에 섞이지 않는다.
export async function GET() {
  return NextResponse.json({ reads: readServerReads(), serverNow: Date.now() }, { headers: NO_STORE })
}

export async function DELETE() {
  resetServerReads()
  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}
