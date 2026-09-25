import { NextResponse } from 'next/server'
import { getServerBootLogSnapshot } from '@/instrumentation'
import type { BootSnapshotResponse } from '../../types'

export const dynamic = 'force-dynamic'

// 이 Route Handler 모듈 자체의 요청 카운터. register()의 registerCallCount(서버 부팅 시 1회 고정)와
// 달리, 이 값은 클라이언트가 재요청할 때마다 실제로 증가한다 — 두 값의 대비가 이 데모의 핵심 증거다.
let requestCount = 0

export async function GET() {
  const snapshot = getServerBootLogSnapshot()

  if (!snapshot) {
    // Edge 런타임 등 register()가 아직 nodejs/edge 분기를 기록하지 않은 극히 드문 초기 타이밍에만 발생.
    return NextResponse.json(
      { error: 'instrumentation.ts register()가 아직 부팅 스냅샷을 기록하지 않았습니다. 서버가 완전히 기동된 뒤 다시 시도하세요.' },
      { status: 503 }
    )
  }

  requestCount += 1

  const payload: BootSnapshotResponse = {
    ...snapshot,
    requestReceivedAt: new Date().toISOString(),
    requestCount,
  }

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
