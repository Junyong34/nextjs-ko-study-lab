import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 200,
    source: 'Target Endpoint (/target/route.ts)',
    virtualRoute: '/zone/baseline/functions/next-response/rewrite-virtual/api',
    targetRoute: '/zone/baseline/functions/next-response/rewrite-virtual/target',
    message: 'NextResponse.rewrite()에 의해 내부적으로 /target 엔드포인트로 포워딩되었습니다.',
    headersReceived: {
      rewrittenBy: request.headers.get('x-rewritten-by'),
      forwardedHost: request.headers.get('x-forwarded-host'),
    },
    catalogItem: {
      id: 'PROD-VIRTUAL-01',
      name: '가상 리라이트 매핑 상품 (프리미엄 슈즈)',
      price: 159000,
      stock: 32,
    },
    timestamp: new Date().toISOString(),
  })
}
