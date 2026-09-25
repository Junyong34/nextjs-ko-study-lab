import type { MetadataRoute } from 'next'
import { getProducts, getSitemapCount, URLS_PER_SITEMAP } from './catalog'

/**
 * generateSitemaps()가 반환한 id 개수만큼 `<이 세그먼트>/sitemap/[id].xml`이 생성된다.
 * 여기서는 전체 상품 수로 필요한 파일 수를 계산한다: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
 */
export async function generateSitemaps() {
  return Array.from({ length: getSitemapCount() }, (_, id) => ({ id }))
}

/**
 * Next.js 16부터 id는 Promise<string>으로 전달된다. generateSitemaps()에서 숫자로 반환했어도
 * await 결과는 문자열이므로, 오프셋 계산 전에 Number()로 변환한다.
 */
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  const start = Number(id) * URLS_PER_SITEMAP
  const end = start + URLS_PER_SITEMAP

  return getProducts(start, end).map((product) => ({
    url: product.url,
    lastModified: product.lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
}
