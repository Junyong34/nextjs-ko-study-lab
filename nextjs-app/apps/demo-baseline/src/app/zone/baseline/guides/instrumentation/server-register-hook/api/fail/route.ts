import { NextResponse } from 'next/server'
import { getServerBootLogSnapshot } from '@/instrumentation'
import { installRequestErrorCapture, readRequestErrors } from '../../lib/request-error-log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

installRequestErrorCapture()

// GET: 지금까지 모은 onRequestError 로그와 현재 registerCallCount를 돌려준다.
export async function GET() {
  return NextResponse.json(
    { entries: readRequestErrors(), registerCallCount: getServerBootLogSnapshot()?.registerCallCount ?? null },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

// POST: 의도적으로 예외를 던진다. Next.js가 500으로 응답하고 instrumentation.ts의 onRequestError를 호출한다.
export async function POST() {
  throw new Error('guides/instrumentation/server-register-hook: 의도한 Route Handler 오류')
}
