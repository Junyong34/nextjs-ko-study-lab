import { NextRequest, NextResponse } from 'next/server'
import { getDiscountAt } from '../discount-data'

// 데이터 원본 조회용 Route Handler. 매 요청마다 서버에서 계산해야 하므로 동적으로 고정한다.
export const dynamic = 'force-dynamic'

/**
 * GET ?at=<ISO>
 * - current: 지금 이 순간 서버 모듈이 계산한 할인율
 * - atGeneration: 이미지가 생성된 시각(at) 기준으로 같은 모듈이 계산한 할인율
 */
export async function GET(request: NextRequest) {
  const serverNow = new Date()
  const atParam = request.nextUrl.searchParams.get('at')
  const at = atParam ? new Date(atParam) : null
  const atGeneration = at && !Number.isNaN(at.getTime()) ? getDiscountAt(at) : null

  return NextResponse.json({
    serverNow: serverNow.toISOString(),
    current: getDiscountAt(serverNow),
    atGeneration,
  })
}
