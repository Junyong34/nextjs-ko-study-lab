import { NextRequest, NextResponse } from 'next/server'
import { getCrawlerRules } from '../robots-rules'
import type { CrawlerMode } from '../types'

export const dynamic = 'force-dynamic'

/**
 * Next.js가 app 루트의 robots.ts에서 내부적으로 수행하는 직렬화(resolveRobots,
 * next/dist/build/webpack/loaders/metadata/resolve-route-data.js)를 학습용으로
 * 동일한 규칙으로 재현한다. 실제 robots.ts를 작성할 때는 이 직렬화를 직접 구현할
 * 필요가 없다 — Next.js 런타임이 자동으로 처리한다.
 */
function serializeRobots(data: ReturnType<typeof getCrawlerRules>): string {
  let content = ''
  const rules = Array.isArray(data.rules) ? data.rules : [data.rules]

  for (const rule of rules) {
    const agents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent ?? '*']
    for (const agent of agents) content += `User-Agent: ${agent}\n`

    if (rule.allow) {
      const allow = Array.isArray(rule.allow) ? rule.allow : [rule.allow]
      for (const path of allow) content += `Allow: ${path}\n`
    }
    if (rule.disallow) {
      const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow]
      for (const path of disallow) content += `Disallow: ${path}\n`
    }
    content += '\n'
  }

  if (data.host) content += `Host: ${data.host}\n`
  if (data.sitemap) {
    const sitemap = Array.isArray(data.sitemap) ? data.sitemap : [data.sitemap]
    for (const url of sitemap) content += `Sitemap: ${url}\n`
  }

  return content
}

function isCrawlerMode(value: string | null): value is CrawlerMode {
  return value === 'production' || value === 'staging'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requested = searchParams.get('mode')
  const mode: CrawlerMode = isCrawlerMode(requested) ? requested : 'production'

  const body = serializeRobots(getCrawlerRules(mode))

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Demo-Crawler-Mode': mode,
    },
  })
}
