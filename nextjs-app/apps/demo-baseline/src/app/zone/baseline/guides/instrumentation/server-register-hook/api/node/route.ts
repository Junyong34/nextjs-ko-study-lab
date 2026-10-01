import { NextResponse } from 'next/server'
import { getServerBootLogSnapshot } from '@/instrumentation'
import { createHandlerCounter } from '../../lib/handler-state'
import type { RegisterProbe } from '../../types'

// 기본값과 같지만 비교 대상(api/edge)과 대칭이 되도록 명시한다.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const counter = createHandlerCounter()

export async function GET() {
  const body: RegisterProbe = {
    handlerRuntime: 'nodejs',
    // register()를 다시 부르지 않는다. register()가 이미 globalThis에 남긴 값을 읽기만 한다.
    snapshot: getServerBootLogSnapshot() ?? null,
    handlerRequestCount: counter.next(),
    handlerLoadedAtMs: counter.loadedAtMs,
    receivedAt: new Date().toISOString(),
  }
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
