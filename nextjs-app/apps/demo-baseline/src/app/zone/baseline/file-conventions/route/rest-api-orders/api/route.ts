import { NextRequest, NextResponse } from 'next/server'

interface Order {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
  status: 'PENDING' | 'CONFIRMED'
  createdAt: string
}

const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  'PROD-001': { name: '프리미엄 러닝화', price: 129000 },
  'PROD-002': { name: '방수 윈드브레이커', price: 189000 },
  'PROD-003': { name: '초경량 트레킹 백팩', price: 95000 },
}

const orders: Order[] = [
  {
    id: 'ORD-2026-001',
    productId: 'PROD-001',
    productName: '프리미엄 러닝화',
    quantity: 1,
    price: 129000,
    total: 129000,
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(
    {
      source: 'Next.js App Router route.ts (GET)',
      total: orders.length,
      orders,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'x-route-handler': 'rest-api-orders',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !PRODUCT_CATALOG[productId]) {
      return NextResponse.json(
        { error: '존재하지 않는 상품 ID입니다.' },
        { status: 400 }
      )
    }

    const qty = Math.max(1, Number(quantity) || 1)
    const product = PRODUCT_CATALOG[productId]
    const newOrder: Order = {
      id: `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
      productId,
      productName: product.name,
      quantity: qty,
      price: product.price,
      total: product.price * qty,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    }

    orders.unshift(newOrder)

    return NextResponse.json(
      {
        source: 'Next.js App Router route.ts (POST)',
        success: true,
        order: newOrder,
        totalOrders: orders.length,
      },
      {
        status: 201,
        headers: {
          'x-route-handler': 'rest-api-orders',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: '주문 요청 본문(JSON) 파싱 실패' },
      { status: 400 }
    )
  }
}
