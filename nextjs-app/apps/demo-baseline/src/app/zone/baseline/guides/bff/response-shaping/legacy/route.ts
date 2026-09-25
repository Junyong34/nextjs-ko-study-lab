// 대조군: 브라우저가 레거시 상품 API 원본을 직접 받는 HTTP 경로.
// 본체 로직은 _lib/legacy-product.ts이며, BFF(bff/route.ts)는 HTTP를 거치지 않고 같은 함수를 직접 호출한다.
// 레거시 관례대로 실패해도 HTTP 200에 RESULT_CD·ERR_STACK을 담아 보낸다 — 가공 없이 노출하면 어떻게 되는지 보여 주는 경로다.
import type { NextRequest } from 'next/server'
import { getLegacyProduct } from '../_lib/legacy-product'

export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id') ?? ''
  return Response.json(getLegacyProduct(id), { headers: { 'Cache-Control': 'no-store' } })
}
