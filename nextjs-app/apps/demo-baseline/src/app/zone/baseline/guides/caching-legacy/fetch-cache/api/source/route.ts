import { NextResponse } from 'next/server'

// 원본 데이터 소스. 요청을 실제로 처리할 때마다 sourceCount가 1씩 올라간다.
// fetch 응답이 Data Cache에서 나오면 이 함수는 실행되지 않으므로 sourceCount가 그대로다.
let sourceCount = 0

export async function GET(request: Request) {
  sourceCount += 1
  const mode = new URL(request.url).searchParams.get('mode')
  return NextResponse.json({
    mode,
    sourceCount,
    generatedAt: new Date().toISOString(),
    pid: process.pid,
  })
}
