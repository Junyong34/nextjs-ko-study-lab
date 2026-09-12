import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
import { INVENTORY_CATALOG } from '../../../types'

/**
 * 공식 문서 "Serving a 404 from a Route Handler" 예제와 동일한 위치에서 notFound()를 호출한다.
 * Server Component(missing-product-404의 items/[id]/page.tsx)가 아니라 Route Handler에서
 * 호출해도 동일한 예외가 던져지며, 이번에는 HTML not-found.tsx 대신 순수 HTTP 404 응답으로 끝난다.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sku: string }> },
) {
  const { sku } = await params
  const item = INVENTORY_CATALOG[sku]

  if (!item) {
    notFound()
  }

  return NextResponse.json(item)
}
