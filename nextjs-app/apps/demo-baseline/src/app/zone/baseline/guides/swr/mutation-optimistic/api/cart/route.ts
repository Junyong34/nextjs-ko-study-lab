import { NextResponse, type NextRequest } from 'next/server'
import { applyDelta, logRequest, resetStore, snapshot } from '../../lib/cart-store'
import type { PatchInput } from '../../types'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }
const MAX_DELAY = 5000

const wait = (ms: number) => new Promise((r) => setTimeout(r, Math.min(MAX_DELAY, Math.max(0, ms))))

// GET: useSWR의 fetcher가 읽는 장바구니. 이 URL이 그대로 SWR 캐시 키다.
export async function GET() {
  const no = logRequest('GET', '장바구니 조회')
  return NextResponse.json(snapshot(no), { headers: NO_STORE })
}

// PATCH: 수량 변경. delayMs만큼 늦게 응답하고, fail=true면 저장하지 않고 500을 돌려준다.
export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as PatchInput
  const no = logRequest('PATCH', `${body.itemId} ${body.delta > 0 ? '+' : ''}${body.delta} 수신 (지연 ${body.delayMs}ms${body.fail ? ', 강제 실패' : ''})`)
  await wait(body.delayMs)
  if (body.fail) {
    logRequest('PATCH', `요청 #${no} 실패 응답 500 — 저장 안 함`)
    return NextResponse.json({ error: '강제 실패: 재고 시스템 응답 없음' }, { status: 500, headers: NO_STORE })
  }
  const qty = applyDelta(body.itemId, body.delta)
  if (qty === null) return NextResponse.json({ error: '없는 상품' }, { status: 404, headers: NO_STORE })
  logRequest('PATCH', `요청 #${no} 저장 완료 — ${body.itemId} 확정 수량 ${qty}`)
  return NextResponse.json(snapshot(no), { headers: NO_STORE })
}

// DELETE: 실습 초기화
export async function DELETE() {
  resetStore()
  return NextResponse.json(snapshot(0), { headers: NO_STORE })
}
