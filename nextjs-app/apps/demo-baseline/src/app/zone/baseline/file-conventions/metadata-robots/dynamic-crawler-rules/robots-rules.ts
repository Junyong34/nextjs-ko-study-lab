import type { MetadataRoute } from 'next'
import type { CrawlerMode } from './types'

/**
 * 이 함수를 그대로 `app/robots.ts`의 default export로 옮기면 Next.js가 반환값을
 * 실제 `/robots.txt` 텍스트로 직렬화해 서빙한다. robots.ts는 app 디렉터리 "루트"에
 * 있을 때만 특수 파일로 인식되므로, 이 데모 안(중첩 경로)에서는 라우팅되지 않는다.
 */
export function getCrawlerRules(mode: CrawlerMode): MetadataRoute.Robots {
  if (mode === 'staging') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: 'https://staging.study-lab.example.com/sitemap.xml',
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/account/'],
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
