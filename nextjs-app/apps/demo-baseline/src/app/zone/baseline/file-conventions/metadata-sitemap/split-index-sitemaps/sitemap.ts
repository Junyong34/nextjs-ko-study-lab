import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // 분할 사이트맵 인덱스 ID 목록 (상품 0, 카테고리 1, 프로모션 2)
  return [{ id: 0 }, { id: 1 }, { id: 2 }]
}

export default async function sitemap(props: { id: Promise<string | number> }): Promise<MetadataRoute.Sitemap> {
  const { id } = await props
  const sitemapId = Number(id)
  const BASE_URL = 'https://study-lab.example.com'

  if (sitemapId === 0) {
    // 상품 사이트맵 (sitemap/0.xml)
    return [
      {
        url: `${BASE_URL}/products/PROD-101`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/products/PROD-102`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ]
  }

  if (sitemapId === 1) {
    // 카테고리 사이트맵 (sitemap/1.xml)
    return [
      {
        url: `${BASE_URL}/category/shoes`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/category/apparel`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]
  }

  // 프로모션/기획전 사이트맵 (sitemap/2.xml)
  return [
    {
      url: `${BASE_URL}/promotions/summer-sale`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ]
}
