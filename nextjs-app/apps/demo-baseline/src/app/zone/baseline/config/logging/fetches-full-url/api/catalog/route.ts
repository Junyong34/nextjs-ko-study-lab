import { NextResponse, type NextRequest } from 'next/server'

// page.tsx의 서버 fetch가 도착하는 곳. 받은 쿼리스트링을 그대로 돌려줘서
// 긴 URL이 잘리지 않고 서버까지 전달됐는지(로그 표시와 별개로) 확인하게 한다.
let requestCount = 0

export async function GET(request: NextRequest) {
  requestCount += 1
  return NextResponse.json({
    receivedPath: request.nextUrl.pathname,
    receivedSearch: request.nextUrl.search,
    requestCount,
    servedAt: new Date().toISOString(),
  })
}
