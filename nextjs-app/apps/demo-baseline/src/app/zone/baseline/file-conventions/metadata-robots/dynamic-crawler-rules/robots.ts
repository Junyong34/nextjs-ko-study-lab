import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/account/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/products/', '/catalog/'],
        disallow: ['/private/'],
      },
    ],
    sitemap: 'https://study-lab.example.com/sitemap.xml',
    host: 'https://study-lab.example.com',
  }
}
