import { NextResponse } from 'next/server'

// 실제 마이크로서비스를 흉내 낸 세 개의 독립 비동기 함수 — 각기 다른 지연시간을 갖는다.
async function fetchOrderService() {
  await new Promise((r) => setTimeout(r, 150))
  return { orderId: 'ORD-2026-881', status: '결제완료' }
}
async function fetchInventoryService() {
  await new Promise((r) => setTimeout(r, 220))
  return { warehouse: '창고 A', remaining: 42 }
}
async function fetchShippingService() {
  await new Promise((r) => setTimeout(r, 180))
  return { courier: '김배송', status: '배정완료' }
}

export async function GET() {
  const start = Date.now()
  // Promise.all로 실제 병렬 호출 — 순차 호출이었다면 150+220+180=550ms, 병렬이면 max(220)ms에 근접해야 한다.
  const [order, inventory, shipping] = await Promise.all([
    fetchOrderService(),
    fetchInventoryService(),
    fetchShippingService(),
  ])
  const elapsedMs = Date.now() - start

  return NextResponse.json({ order, inventory, shipping, elapsedMs })
}
