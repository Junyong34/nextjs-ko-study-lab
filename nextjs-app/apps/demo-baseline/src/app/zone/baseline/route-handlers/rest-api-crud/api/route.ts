import { NextRequest, NextResponse } from 'next/server'
import type { Item } from '../types'

export const dynamic = 'force-dynamic'

const INITIAL_ITEMS: Item[] = [
  { id: '1', name: '무선 노이즈 캔슬링 헤드폰', price: 299000, status: 'in_stock' },
  { id: '2', name: '기계식 게이밍 키보드', price: 149000, status: 'in_stock' },
]

let items: Item[] = [...INITIAL_ITEMS]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const reset = searchParams.get('reset')

  if (reset === 'true') {
    items = [...INITIAL_ITEMS]
    return NextResponse.json({
      success: true,
      message: '목록이 초기 상태로 복구되었습니다.',
      total: items.length,
      data: items,
    })
  }

  const filtered = status ? items.filter((i) => i.status === status) : items

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    total: filtered.length,
    data: filtered,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.reset === true) {
      items = [...INITIAL_ITEMS]
      return NextResponse.json({
        success: true,
        message: '목록이 초기 상태로 복구되었습니다.',
        total: items.length,
        data: items,
      })
    }

    const newItem: Item = {
      id: String(Date.now()),
      name: body.name || '신규 등록 상품',
      price: Number(body.price) || 50000,
      status: 'in_stock',
    }
    items.push(newItem)

    return NextResponse.json({ success: true, created: newItem }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON Body' }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const target = items.find((i) => i.id === id)
    if (!target) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    target.status = status
    return NextResponse.json({ success: true, updated: target })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON Body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 })
  }

  const prevLen = items.length
  items = items.filter((i) => i.id !== id)

  if (items.length === prevLen) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, deletedId: id })
}
