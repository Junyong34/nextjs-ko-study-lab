'use server'

import type { ProductInfo, RecommendationItem, FetchResult } from './types'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getProductData(id: string): Promise<ProductInfo> {
  const start = Date.now()
  await sleep(600) // 600ms 지연
  return {
    id,
    title: '고급 인체공학 무선 트랙볼 마우스',
    price: 99000,
    category: '전자기기/주변기기',
    fetchDurationMs: Date.now() - start,
  }
}

async function getRecommendationsData(id: string): Promise<RecommendationItem[]> {
  const start = Date.now()
  await sleep(800) // 800ms 지연
  return [
    {
      id: 'rec-1',
      name: '메모리폼 손목 받침대 패드',
      reason: '함께 구매 시 15% 할인',
      fetchDurationMs: Date.now() - start,
    },
    {
      id: 'rec-2',
      name: 'USB-C 고속 충전 케이블 2M',
      reason: '함께 자주 조회한 상품',
      fetchDurationMs: Date.now() - start,
    },
  ]
}

/**
 * 1. 직렬 Waterfall 패칭 (Sequential)
 * 상품 조회(600ms) 완료 후 -> 추천 상품(800ms) 시작 = 총 약 1400ms 소요
 */
export async function executeSequentialFetching(id: string): Promise<FetchResult> {
  const start = Date.now()
  const product = await getProductData(id)
  const recommendations = await getRecommendationsData(id)
  const totalDurationMs = Date.now() - start

  return {
    mode: 'sequential',
    totalDurationMs,
    product,
    recommendations,
  }
}

/**
 * 2. 병렬 패칭 (Promise.all)
 * 상품 조회(600ms)와 추천 상품(800ms)을 동시에 시작 = 가장 느린 요청 기준 총 약 800ms 소요
 */
export async function executeParallelFetching(id: string): Promise<FetchResult> {
  const start = Date.now()
  const productPromise = getProductData(id)
  const recommendationsPromise = getRecommendationsData(id)

  const [product, recommendations] = await Promise.all([
    productPromise,
    recommendationsPromise,
  ])
  const totalDurationMs = Date.now() - start

  return {
    mode: 'parallel',
    totalDurationMs,
    product,
    recommendations,
  }
}
