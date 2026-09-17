import { NextResponse } from 'next/server'
import type { ProductKey, TaggedProductSnapshot } from '../../types'

export const dynamic = 'force-dynamic'

const PRODUCT_CATALOG: Record<ProductKey, { name: string; basePrice: number }> = {
  shoes: { name: '경량 쿠셔닝 러닝화', basePrice: 159000 },
  windbreaker: { name: '방수 하이브리드 윈드브레이커', basePrice: 129000 },
}

/**
 * 이 카운터가 늘어난 횟수 = 이 Route Handler가 실제로 실행된(=상위 fetch가 캐시 미스였던) 횟수다.
 * 상위 fetch가 캐시 HIT이면 Next.js가 이 함수를 아예 호출하지 않으므로 카운터도 그대로다.
 */
const fetchCounters: Record<ProductKey, number> = { shoes: 0, windbreaker: 0 }

function isProductKey(value: string): value is ProductKey {
  return value === 'shoes' || value === 'windbreaker'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ product: string }> },
) {
  const { product } = await params

  if (!isProductKey(product)) {
    return NextResponse.json({ error: `unknown product: ${product}` }, { status: 404 })
  }

  fetchCounters[product] += 1
  const catalog = PRODUCT_CATALOG[product]

  const snapshot: TaggedProductSnapshot = {
    product,
    name: catalog.name,
    price: catalog.basePrice + fetchCounters[product] * 1000,
    fetchCount: fetchCounters[product],
    fetchedAt: new Date().toISOString(),
  }

  return NextResponse.json(snapshot)
}
