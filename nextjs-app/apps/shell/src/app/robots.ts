import type { MetadataRoute } from 'next'
import { disallowedCrawlPaths, siteConfig } from '@/lib/seo/config'
import { isPublicIndexingAllowed } from '@/lib/seo/indexability'

export default function robots(): MetadataRoute.Robots {
  if (!isPublicIndexingAllowed()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...disallowedCrawlPaths],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
