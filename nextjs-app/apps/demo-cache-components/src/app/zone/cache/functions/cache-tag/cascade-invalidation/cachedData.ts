import { cacheTag, cacheLife } from 'next/cache'
import { TAGS } from './tags'

export interface CategorySummary {
  categoryName: string
  cacheId: string
  generatedAt: string
}

export async function getCategorySummaryCache(): Promise<CategorySummary> {
  'use cache'
  cacheLife('max')
  cacheTag(TAGS.category)

  return {
    categoryName: '러닝화 카테고리',
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export interface ProductListResult {
  category: CategorySummary
  products: string[]
  cacheId: string
  generatedAt: string
}

export async function getProductListCache(): Promise<ProductListResult> {
  'use cache'
  cacheLife('max')
  cacheTag(TAGS.category, TAGS.products)

  // 상위 카테고리 요약 캐시를 내부에서 호출한다.
  // category 태그를 이 함수의 cacheTag에도 함께 등록했기 때문에,
  // revalidateTag(category)가 호출되면 이 캐시 항목도 함께 무효화된다.
  const category = await getCategorySummaryCache()

  return {
    category,
    products: ['에어맥스 러닝화', '테라스카이 트레일화', '클라우드 워킹화'],
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}
