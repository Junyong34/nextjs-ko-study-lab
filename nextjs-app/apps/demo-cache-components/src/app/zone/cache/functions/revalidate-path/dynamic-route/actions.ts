'use server'

import { revalidatePath } from 'next/cache'
import type { RevalidateResult } from './types'
import { PRODUCT_PAGE_PATTERN, buildProductPath } from './paths'

export async function revalidateProductPatternAction(): Promise<RevalidateResult> {
  const timestamp = new Date().toLocaleTimeString()

  // Next.js 16 공식 revalidatePath(path, type) 호출.
  // path가 '/products/[id]' 같은 다이나믹 세그먼트 패턴이면 type이 필수다.
  // 'page'는 이 패턴과 일치하는 모든 인스턴스(products/1, products/2, ...)를 함께 무효화한다.
  revalidatePath(PRODUCT_PAGE_PATTERN, 'page')

  return { mode: 'pattern', targetPath: PRODUCT_PAGE_PATTERN, timestamp }
}

export async function revalidateProductInstanceAction(id: string): Promise<RevalidateResult> {
  const timestamp = new Date().toLocaleTimeString()
  const targetPath = buildProductPath(id)

  // path가 '/products/1'처럼 파라미터가 바인딩된 리터럴 경로면 type을 생략한다.
  // 이 호출은 지정한 id 인스턴스 하나만 무효화하고 다른 id는 그대로 둔다.
  revalidatePath(targetPath)

  return { mode: 'instance', targetPath, timestamp }
}
