import { NextResponse } from 'next/server'
import { readAll } from '../../lib/readings'
import type { ServerRead } from '../../types'

// 서버(Route Handler)가 같은 키를 점 접근과 동적 접근으로 읽는다. 브라우저 번들과 비교하는 기준값이다.
export async function GET() {
  const body: ServerRead = { readings: readAll(), pid: process.pid, evaluatedAt: new Date().toISOString() }
  return NextResponse.json(body)
}
