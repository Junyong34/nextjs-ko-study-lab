import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const targetUrl = new URL(
    '/zone/baseline/functions/next-response/rewrite-virtual/target',
    request.url
  )

  // NextResponse.rewrite를 통해 요청을 내부 대상 엔드포인트로 투명하게 리라이트
  return NextResponse.rewrite(targetUrl, {
    headers: {
      'x-rewritten-by': 'NextResponse.rewrite',
      'x-virtual-source': request.nextUrl.pathname,
    },
  })
}
