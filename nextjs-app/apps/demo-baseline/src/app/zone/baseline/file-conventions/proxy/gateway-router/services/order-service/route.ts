import { NextRequest, NextResponse } from 'next/server'

// 이 파일은 proxy.ts의 NextResponse.rewrite() 목적지다. 클라이언트는 이 경로를 직접
// 호출하지 않는다 — /api/orders 요청이 proxy.ts를 거쳐 여기로 투명하게 전달된다.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'order-service',
    handledBy: 'services/order-service/route.ts',
    // proxy.ts가 주입한 게이트웨이 헤더가 실제로 업스트림 서비스까지 전달됐는지 그대로 echo한다.
    gatewayForwardedHeaders: {
      'x-gateway-target-service': request.headers.get('x-gateway-target-service'),
      'x-gateway-matched-prefix': request.headers.get('x-gateway-matched-prefix'),
      'x-gateway-upstream-port': request.headers.get('x-gateway-upstream-port'),
      'x-gateway-request-id': request.headers.get('x-gateway-request-id'),
    },
    data: {
      queuedOrders: 3,
      nextOrderId: 'ORD-10452',
      queueLatencyMs: 42,
    },
    timestamp: new Date().toISOString(),
  })
}
