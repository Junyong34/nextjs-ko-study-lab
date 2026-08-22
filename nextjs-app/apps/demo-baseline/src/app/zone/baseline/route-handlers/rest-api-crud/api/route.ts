import { NextRequest } from 'next/server'
import type { Item } from '../types'

let items: Item[] = [
  { id: '1', name: '무선 노이즈 캔슬링 헤드폰', price: 299000, status: 'in_stock' },
  { id: '2', name: '기계식 게이밍 키보드', price: 149000, status: 'in_stock' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const filtered = status ? items.filter((i) => i.status === status) : items

  return Response.json({
    timestamp: new Date().toISOString(),
    total: filtered.length,
    data: filtered,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newItem: Item = {
      id: String(Date.now()),
      name: body.name || '신규 등록 상품',
      price: Number(body.price) || 50000,
      status: 'in_stock',
    }
    items.push(newItem)

    return Response.json({ success: true, created: newItem }, { status: 201 })
  } catch {
    return Response.json({ error: 'Invalid JSON Body' }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    const target = items.find((i) => i.id === id)
    if (!target) {
      return Response.json({ error: 'Item not found' }, { status: 404 })
    }

    target.status = status
    return Response.json({ success: true, updated: target })
  } catch {
    return Response.json({ error: 'Invalid JSON Body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return Response.json({ error: 'Missing id query parameter' }, { status: 400 })
  }

  const prevLen = items.length
  items = items.filter((i) => i.id !== id)

  if (items.length === prevLen) {
    return Response.json({ error: 'Item not found' }, { status: 404 })
  }

  return Response.json({ success: true, deletedId: id })
}
