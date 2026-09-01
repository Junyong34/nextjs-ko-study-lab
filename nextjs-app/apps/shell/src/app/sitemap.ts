import type { MetadataRoute } from 'next'
import { getDemos, getManifest } from '@/lib/docs'
import { siteConfig } from '@/lib/seo/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = getManifest()
  const doneDemos = getDemos({ status: 'done' })

  // 루트(`/`)는 아래에서 별도로 추가하므로, slug가 빈 문서(README)는 제외한다
  const docEntries: MetadataRoute.Sitemap = manifest.docs
    .filter((doc) => doc.slug && doc.slug.length > 0)
    .map((doc) => ({
      url: `${siteConfig.url}${doc.url}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  const demoEntries: MetadataRoute.Sitemap = doneDemos.map((demo) => ({
    url: `${siteConfig.url}/demo/${demo.url}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/demo`, changeFrequency: 'weekly', priority: 0.7 },
    ...docEntries,
    ...demoEntries,
  ]
}
