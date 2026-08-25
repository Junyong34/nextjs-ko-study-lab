'use server'

import { revalidatePath } from 'next/cache'
import type { ScopeRevalidateResult } from './types'

export async function executeScopeRevalidateAction(scope: 'page' | 'layout'): Promise<ScopeRevalidateResult> {
  const targetPath = '/shop'
  const time = new Date().toLocaleTimeString()

  // Next.js 공식 revalidatePath(path, type) 호출
  revalidatePath(targetPath, scope)

  const allRoutes = [
    { path: '/shop', label: '메인 쇼핑몰 허브 (루트 페이지)', isDirectTarget: true, isNestedUnderLayout: true },
    { path: '/shop/items/101', label: '상품 상세 (나이키 러닝화)', isDirectTarget: false, isNestedUnderLayout: true },
    { path: '/shop/category/shoes', label: '신발 카테고리 피드', isDirectTarget: false, isNestedUnderLayout: true },
    { path: '/shop/category/clothing', label: '의류 카테고리 피드', isDirectTarget: false, isNestedUnderLayout: true },
    { path: '/account/profile', label: '사용자 프로필 (다른 레이아웃)', isDirectTarget: false, isNestedUnderLayout: false },
  ]

  const segments = allRoutes.map((r) => {
    if (scope === 'page') {
      return {
        ...r,
        status: r.isDirectTarget ? ('PURGED' as const) : ('PRESERVED' as const),
      }
    } else {
      // layout
      return {
        ...r,
        status: r.isNestedUnderLayout ? ('PURGED' as const) : ('PRESERVED' as const),
      }
    }
  })

  const purgedCount = segments.filter((s) => s.status === 'PURGED').length

  return {
    scope,
    targetPath,
    purgedCount,
    segments,
    timestamp: time,
  }
}
