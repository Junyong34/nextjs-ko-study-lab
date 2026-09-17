import { NextRequest, NextResponse } from 'next/server'
import type { ProductCode, StockSourcePayload } from '../types'

/**
 * 이 Route Handler 자체는 절대 캐시되지 않는 "origin"이다.
 * fetch(next.revalidate)의 캐시 HIT/MISS를 실측하려면, origin 호출 여부를
 * 거짓 없이 알려줄 카운터가 필요하기 때문에 force-dynamic으로 고정한다.
 */
export const dynamic = 'force-dynamic'

const BASE_PRICE_KRW: Record<ProductCode, number> = {
  'PROD-001': 129_000,
  'PROD-002': 189_000,
}

// productCode:sessionId 별로 origin 호출 횟수와 마지막 재고 값을 보관한다.
const originState = new Map<string, { count: number; stock: number }>()

function randomStock(): number {
  return 10 + Math.floor(Math.random() * 90)
}

function resolveProductCode(value: string | null): ProductCode {
  return value === 'PROD-002' ? 'PROD-002' : 'PROD-001'
}

export async function GET(request: NextRequest) {
  const productCode = resolveProductCode(request.nextUrl.searchParams.get('product'))
  const sessionId = request.nextUrl.searchParams.get('session') ?? '0'
  const key = `${productCode}:${sessionId}`

  const prev = originState.get(key)
  const state = { count: (prev?.count ?? 0) + 1, stock: randomStock() }
  originState.set(key, state)

  const payload: StockSourcePayload = {
    productCode,
    stock: state.stock,
    priceKrw: BASE_PRICE_KRW[productCode],
    originCallCount: state.count,
    generatedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
  }

  return NextResponse.json(payload)
}
