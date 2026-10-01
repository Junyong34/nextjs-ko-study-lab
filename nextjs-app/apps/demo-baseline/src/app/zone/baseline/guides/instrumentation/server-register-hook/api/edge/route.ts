import { NextResponse } from 'next/server'
import { getServerBootLogSnapshot } from '@/instrumentation'
import { createHandlerCounter } from '../../lib/handler-state'
import type { RegisterProbe } from '../../types'

// Edge 런타임은 Node.js 프로세스와 분리된 isolate에서 돈다. register()도 그 안에서 따로 호출된다.
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const counter = createHandlerCounter()

export async function GET() {
  const body: RegisterProbe = {
    handlerRuntime: 'edge',
    // register()를 다시 부르지 않는다. register()가 이미 globalThis에 남긴 값을 읽기만 한다.
    snapshot: getServerBootLogSnapshot() ?? null,
    handlerRequestCount: counter.next(),
    handlerLoadedAtMs: counter.loadedAtMs,
    receivedAt: new Date().toISOString(),
  }
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
