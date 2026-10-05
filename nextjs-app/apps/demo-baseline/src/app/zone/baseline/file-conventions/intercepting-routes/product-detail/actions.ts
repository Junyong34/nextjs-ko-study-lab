'use server'

import { getProductDetail } from './data'
import type { ProductDetail } from './types'

/**
 * 모달(클라이언트)이 본문을 받아오는 Server Action. 목록 요약은 이미 화면에 있으므로
 * 여기서는 요약에 없는 상세만 가져온다.
 */
export async function fetchProductDetail(id: string): Promise<ProductDetail | null> {
  return getProductDetail(id)
}
