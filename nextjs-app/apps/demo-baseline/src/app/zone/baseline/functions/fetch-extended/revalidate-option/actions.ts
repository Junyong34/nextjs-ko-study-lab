'use server'

import { headers } from 'next/headers'
import type { ProductCode, StockFetchResult, StockSourcePayload } from './types'

const SOURCE_PATH = '/zone/baseline/functions/fetch-extended/revalidate-option/api'

/**
 * Next.js 확장 fetch()의 next.revalidate 옵션을 실제로 호출하는 지점.
 * 같은 URL(productCode + sessionId)로 반복 호출하면, revalidateSeconds 이내에는
 * Data Cache가 이 fetch 자체를 가로채 origin(Route Handler)을 실행하지 않는다.
 */
export async function fetchStockWithRevalidate(
  productCode: ProductCode,
  sessionId: number,
  revalidateSeconds: number
): Promise<StockFetchResult> {
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'
  const url = `${protocol}://${host}${SOURCE_PATH}?product=${encodeURIComponent(productCode)}&session=${sessionId}`

  const startedAt = Date.now()
  const res = await fetch(url, { next: { revalidate: revalidateSeconds } })
  const data = (await res.json()) as StockSourcePayload
  const durationMs = Date.now() - startedAt

  return {
    ...data,
    revalidateSeconds,
    httpStatus: res.status,
    fetchedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    durationMs,
  }
}
