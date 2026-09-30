import { addBeacon, clearBeacons, listBeacons } from './store'

// sendBeacon은 항상 POST로 나가고 응답 본문을 읽지 못한다. 그래서 수신 여부는 GET으로 서버 저장소를 따로 조회해 확인한다.
export async function POST(request: Request) {
  const raw = await request.text()
  let payload: Record<string, unknown> = {}
  try {
    payload = JSON.parse(raw)
  } catch {
    return new Response(null, { status: 400 })
  }

  const item = {
    id: String(payload.id ?? ''),
    event: String(payload.event ?? ''),
    productId: String(payload.productId ?? ''),
    contentType: request.headers.get('content-type') ?? '(없음)',
    method: request.method,
    receivedAt: new Date().toISOString(),
  }
  addBeacon(item)
  console.log('[custom-beacon] 수신', item)
  return new Response(null, { status: 204 })
}

export async function GET() {
  return Response.json(listBeacons(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE() {
  clearBeacons()
  return new Response(null, { status: 204 })
}
