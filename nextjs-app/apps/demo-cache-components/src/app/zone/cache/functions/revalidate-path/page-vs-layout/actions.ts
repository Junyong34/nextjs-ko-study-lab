'use server'

import { revalidatePath } from 'next/cache'
import type { ScopeRevalidateResult } from './types'
import { HUB_PATH } from './paths'

export async function executeScopeRevalidateAction(scope: 'page' | 'layout'): Promise<ScopeRevalidateResult> {
  const timestamp = new Date().toLocaleTimeString()

  // Next.js 16 공식 revalidatePath(path, type) 호출.
  // scope === 'page': 이 허브 페이지 자신만 무효화. 하위(items/[id], category/[slug])는 영향 없음.
  // scope === 'layout': 이 경로의 layout.tsx와 그 아래 모든 페이지(허브 자신 포함)가 무효화.
  revalidatePath(HUB_PATH, scope)

  return { scope, targetPath: HUB_PATH, timestamp }
}
