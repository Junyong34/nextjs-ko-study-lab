import { NextRequest, NextResponse } from 'next/server'

// proxy.ts의 NextResponse.rewrite() 목적지. /api/search 요청만 이 파일로 전달된다.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'search-service',
    handledBy: 'services/search-service/route.ts',
    gatewayForwardedHeaders: {
      'x-gateway-target-service': request.headers.get('x-gateway-target-service'),
      'x-gateway-matched-prefix': request.headers.get('x-gateway-matched-prefix'),
      'x-gateway-upstream-port': request.headers.get('x-gateway-upstream-port'),
      'x-gateway-request-id': request.headers.get('x-gateway-request-id'),
    },
    data: {
      indexedDocuments: 15302,
      lastReindexAt: '2026-09-24T02:00:00.000Z',
    },
    timestamp: new Date().toISOString(),
  })
}
