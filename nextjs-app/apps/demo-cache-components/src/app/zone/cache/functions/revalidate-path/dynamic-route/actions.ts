'use server'

import { revalidatePath } from 'next/cache'
import type { RevalidateMode, RevalidateResult } from './types'
import { LITERAL_TARGET_ID, PRODUCT_PATTERN, productPath } from './paths'

export async function runRevalidatePath(mode: Exclude<RevalidateMode, 'reload'>): Promise<RevalidateResult> {
  let call: string

  if (mode === 'literal') {
    // 구체 경로: /products/1 페이지 하나만 무효화. type은 생략한다(문서 권장).
    const path = productPath(LITERAL_TARGET_ID)
    revalidatePath(path)
    call = `revalidatePath('${path}')`
  } else if (mode === 'pattern-page') {
    // 라우트 패턴 + 'page': products/[id]/page.tsx로 렌더되는 모든 경로를 무효화.
    revalidatePath(PRODUCT_PATTERN, 'page')
    call = `revalidatePath('${PRODUCT_PATTERN}', 'page')`
  } else {
    // 라우트 패턴인데 type 누락: Next.js는 경고만 남기고 아무것도 무효화하지 않는다.
    revalidatePath(PRODUCT_PATTERN)
    call = `revalidatePath('${PRODUCT_PATTERN}')`
  }

  return { mode, call, executedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }) }
}
