import { NextResponse } from 'next/server'
import os from 'node:os'

// Route Handler는 정적으로 사전 렌더링되지 않는다 — 매 요청마다 이 함수가 실제로 실행되어
// 그 시점의 process.env / process.pid를 읽는다. 빌드 타임에 값이 굳는 SSG와 다르다.
export async function GET() {
  return NextResponse.json({
    pid: process.pid,
    nodeEnv: process.env.NODE_ENV ?? null,
    hostname: process.env.HOSTNAME ?? os.hostname(),
    evaluatedAt: new Date().toISOString(),
  })
}
