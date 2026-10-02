import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CART_COOKIE, PRODUCT_STOCK, countCart, readCart } from '../../lib/cart'
import type { CartResponse } from '../../types'

const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, maxAge: 60 * 60 }

async function respond(status = 200, error?: string) {
  const cart = readCart((await cookies()).get(CART_COOKIE)?.value)
  const body: CartResponse = { cart, count: countCart(cart), handledAt: new Date().toISOString(), ...(error ? { error } : {}) }
  return NextResponse.json(body, { status })
}

export async function GET() {
  return respond()
}

// MDX 안의 클라이언트 버튼이 호출한다. 재고를 넘기면 409로 거절한다.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { sku?: unknown; qty?: unknown } | null
  const sku = typeof body?.sku === 'string' ? body.sku : ''
  const qty = Number(body?.qty)
  if (!(sku in PRODUCT_STOCK) || !Number.isInteger(qty) || qty < 1) return respond(400, '알 수 없는 상품이거나 수량이 잘못됐습니다.')

  const jar = await cookies()
  const cart = readCart(jar.get(CART_COOKIE)?.value)
  const next = (cart[sku] ?? 0) + qty
  if (next > PRODUCT_STOCK[sku]) return respond(409, `재고 ${PRODUCT_STOCK[sku]}개를 넘길 수 없습니다 (현재 ${cart[sku] ?? 0}개).`)

  jar.set(CART_COOKIE, JSON.stringify({ ...cart, [sku]: next }), cookieOptions)
  return respond()
}

export async function DELETE() {
  ;(await cookies()).delete({ name: CART_COOKIE, path: '/' })
  return respond()
}
