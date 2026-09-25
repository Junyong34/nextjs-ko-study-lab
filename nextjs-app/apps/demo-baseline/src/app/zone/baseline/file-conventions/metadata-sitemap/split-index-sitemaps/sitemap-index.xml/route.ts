import { siteUrl } from '@study/demos'
import { DEMO_PATH, getSitemapCount } from '../catalog'

/**
 * generateSitemaps()는 분할 파일(sitemap/[id].xml)만 만들고 <sitemapindex>는 만들지 않는다.
 * 검색엔진에 한 URL로 제출하려면 이처럼 Route Handler로 인덱스를 직접 작성한다.
 * 요청 시점 API를 쓰지 않으므로 빌드 때 정적으로 생성한다.
 */
export const dynamic = 'force-static'

export function GET() {
  const entries = Array.from(
    { length: getSitemapCount() },
    (_, id) => `<sitemap>\n<loc>${siteUrl}${DEMO_PATH}/sitemap/${id}.xml</loc>\n</sitemap>`,
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
