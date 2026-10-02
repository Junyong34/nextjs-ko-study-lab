import { NextResponse } from 'next/server'
import { readLog, snapshot } from '../../lib/cart-store'

export const dynamic = 'force-dynamic'

// 서버가 받은 요청 순서와 현재 저장소 값. SWR 캐시 키(api/cart)와 다른 URL이라 useSWR 요청 수에 섞이지 않는다.
export async function GET() {
  return NextResponse.json({ entries: readLog(), cart: snapshot(-1) }, { headers: { 'Cache-Control': 'no-store' } })
}
