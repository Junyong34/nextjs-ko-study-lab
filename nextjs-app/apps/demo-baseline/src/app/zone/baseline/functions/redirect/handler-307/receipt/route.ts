import { PRODUCT_IDS } from '../constants'
import { parseOrderInput } from '../verification'

const headers = { 'Cache-Control': 'no-store' }

function respond(input: unknown, method: string, source: 'body' | 'query') {
  const order = parseOrderInput(input, PRODUCT_IDS)
  if (!order) {
    return Response.json({ error: '허용된 상품, 정수 수량 1~10, 요청 식별자가 필요합니다.' }, { status: 400, headers })
  }
  return Response.json({ ...order, method, source }, { headers })
}

export async function POST(request: Request) {
  let input: unknown
  try {
    input = await request.json()
  } catch {
    return Response.json({ error: '유효한 JSON 본문이 필요합니다.' }, { status: 400, headers })
  }
  return respond(input, request.method, 'body')
}

export function GET(request: Request) {
  const query = new URL(request.url).searchParams
  return respond({
    productId: query.get('productId'),
    quantity: Number(query.get('quantity')),
    requestId: query.get('requestId'),
  }, request.method, 'query')
}
