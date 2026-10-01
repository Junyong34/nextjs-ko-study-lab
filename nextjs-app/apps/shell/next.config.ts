import type { NextConfig } from 'next'
import path from 'node:path'
import { withRelatedProject } from '@vercel/related-projects'

// 로컬: ZONE_*_URL(.env.local)의 host를 기본값으로 사용.
// Vercel: Related Projects(vercel.json)가 배포 환경(preview/production)에 맞는 host를 자동 주입.
const stripScheme = (url: string) => url.replace(/^https?:\/\//, '')
const scheme = process.env.VERCEL ? 'https' : 'http'

const baselineHost = withRelatedProject({
  projectName: 'study-baseline',
  defaultHost: stripScheme(process.env.ZONE_BASELINE_URL || 'localhost:3001'),
})
const cacheHost = withRelatedProject({
  projectName: 'study-cache',
  defaultHost: stripScheme(process.env.ZONE_CACHE_URL || 'localhost:3002'),
})

const zones: Record<string, string> = {
  baseline: `${scheme}://${baselineHost}`,
  cache: `${scheme}://${cacheHost}`,
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../../'),
  transpilePackages: ['@study/ui', '@study/docs-render', '@study/demos', '@study/docs'],
  async rewrites() {
    return {
      // Vercel이 segment prefetch 경로를 변환하기 전에 소유 zone으로 전달한다.
      // afterFiles에서는 셸과 zone이 같은 전송 접미사를 두 번 붙일 수 있다.
      beforeFiles: Object.entries(zones).map(([slug, url]) => ({
        source: `/zone/${slug}/:path*`,
        destination: `${url}/zone/${slug}/:path*`,
      })),
      afterFiles: Object.entries(zones).map(([slug, url]) => ({
        source: `/demo-static/${slug}/:path*`,
        destination: `${url}/demo-static/${slug}/:path*`,
      })),
      fallback: [],
    }
  },
}

export default nextConfig
