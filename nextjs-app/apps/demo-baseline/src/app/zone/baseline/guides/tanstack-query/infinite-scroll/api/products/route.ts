import { NextResponse, type NextRequest } from 'next/server'
import { PRODUCTS, readPage, resetCatalog } from '../../lib/catalog'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }

// GET ?cursor=<마지막 상품 id>&limit=6&delay=700 — 커서 기반 페이지네이션
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const cursor = params.get('cursor') || null
  const limit = Math.min(12, Math.max(1, Number(params.get('limit')) || 6))
  const delay = Math.min(3000, Math.max(0, Number(params.get('delay')) || 0))

  if (cursor && !PRODUCTS.some((p) => p.id === cursor)) {
    return NextResponse.json({ error: `알 수 없는 커서 ${cursor}` }, { status: 400, headers: NO_STORE })
  }
  // 카운트는 요청을 받은 즉시 올린다. 브라우저가 중간에 취소한 요청도 서버에 도착했다면 센다.
  const page = readPage(cursor, limit)
  if (delay) await new Promise((r) => setTimeout(r, delay))
  return NextResponse.json(page, { headers: NO_STORE })
}

// DELETE — 실습 초기화(요청 카운터 비우기)
export async function DELETE() {
  resetCatalog()
  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}
