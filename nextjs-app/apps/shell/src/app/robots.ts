import type { MetadataRoute } from 'next'
import { disallowedCrawlPaths, siteConfig } from '@/lib/seo/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...disallowedCrawlPaths],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
