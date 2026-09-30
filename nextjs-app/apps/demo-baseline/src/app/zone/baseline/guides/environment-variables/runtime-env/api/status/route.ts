import { NextResponse } from 'next/server'
import { snapshotServerEnv } from '../../lib/serverEnv'

// GET 핸들러는 기본이 동적이다(v15.0.0-RC부터). 호출될 때마다 이 함수가 실제로 실행되어
// 그 순간의 process.env를 읽는다. 모듈 변수 requestCount는 "같은 서버 프로세스에서 매 요청 실행됨"의 증거다.
let requestCount = 0

export async function GET() {
  requestCount += 1
  return NextResponse.json(snapshotServerEnv('route-handler', requestCount))
}
