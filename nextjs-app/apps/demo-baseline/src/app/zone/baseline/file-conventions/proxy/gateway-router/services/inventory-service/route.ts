import { NextRequest, NextResponse } from 'next/server'

// proxy.ts의 NextResponse.rewrite() 목적지. /api/inventory 요청만 이 파일로 전달된다.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'inventory-service',
    handledBy: 'services/inventory-service/route.ts',
    gatewayForwardedHeaders: {
      'x-gateway-target-service': request.headers.get('x-gateway-target-service'),
      'x-gateway-matched-prefix': request.headers.get('x-gateway-matched-prefix'),
      'x-gateway-upstream-port': request.headers.get('x-gateway-upstream-port'),
      'x-gateway-request-id': request.headers.get('x-gateway-request-id'),
    },
    data: {
      skuCount: 128,
      lowStockAlerts: 2,
      warehouse: 'ICN-1',
    },
    timestamp: new Date().toISOString(),
  })
}
