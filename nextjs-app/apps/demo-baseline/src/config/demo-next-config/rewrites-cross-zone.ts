import { withRelatedProject } from '@vercel/related-projects'
import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모(config/rewrites/cross-zone-proxy)가 소유한다.
// source는 반드시 이 데모 경로 하위로 한정한다.
const BASE = '/zone/baseline/config/rewrites/cross-zone-proxy'

// 업스트림은 cache zone(별도 Next.js 서버)이다. 셸 next.config와 같은 방식으로 host를 정한다.
// 로컬: ZONE_CACHE_URL(기본 localhost:3002). Vercel: Related Projects가 study-cache 배포 host를 주입.
const stripScheme = (url: string) => url.replace(/^https?:\/\//, '')
const scheme = process.env.VERCEL ? 'https' : 'http'
const cacheHost = withRelatedProject({
  projectName: 'study-cache',
  defaultHost: stripScheme(process.env.ZONE_CACHE_URL || 'localhost:3002'),
})

/** 데모 화면이 "어디로 프록시되는가"를 보여 줄 때도 같은 값을 쓴다. */
export const CROSS_ZONE_UPSTREAM = `${scheme}://${cacheHost}`

// destination이 외부 URL(http/https)이면 Next.js가 해당 서버로 요청을 프록시한다.
// 배열 형태라 afterFiles 단계다. source 경로(via-cache, api)에는 page 파일을 두지 않는다.
export const demoConfig: DemoConfigPart = {
  rewrites: [
    // 1) Zone 간 라우팅: /…/via-cache/caching/basic → cache zone의 /zone/cache/caching/basic 페이지
    {
      source: `${BASE}/via-cache/:path*`,
      destination: `${CROSS_ZONE_UPSTREAM}/zone/cache/:path*`,
    },
    // 2) API 프록시: /…/api/og?title=… → cache zone의 OG 이미지 Route Handler (쿼리는 그대로 전달된다)
    {
      source: `${BASE}/api/og`,
      destination: `${CROSS_ZONE_UPSTREAM}/zone/cache/og`,
    },
  ],
}
