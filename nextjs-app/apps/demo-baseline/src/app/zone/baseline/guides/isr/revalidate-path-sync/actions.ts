'use server'

import { revalidatePath } from 'next/cache'
import type { RevalidatePathResult } from './types'

let currentVersion = 1

export async function executeRevalidatePathAction(targetPath: string = '/shop'): Promise<RevalidatePathResult> {
  currentVersion += 1
  const time = new Date().toLocaleTimeString()

  // Next.js 공식 revalidatePath 호출
  revalidatePath(targetPath)

  return {
    path: targetPath,
    status: 'PURGED',
    segments: [
      { name: '상단 글로벌 배너 (ShopBanner)', type: 'component', cachedTime: time, version: currentVersion },
      { name: '카테고리 필터 사이드바 (ShopSidebar)', type: 'component', cachedTime: time, version: currentVersion },
      { name: '메인 상품 그리드 (ProductGrid)', type: 'page', cachedTime: time, version: currentVersion },
      { name: '추천 알고리즘 피드 (RecommendationSlot)', type: 'component', cachedTime: time, version: currentVersion },
    ],
    message: `[확인] revalidatePath("${targetPath}") 호출 완료: 상단 배너, 사이드바, 상품 목록 전체 캐시 일괄 퍼지`,
    timestamp: time,
  }
}
