import type { NextConfig } from 'next'
import path from 'node:path'

const baselineUrl = process.env.ZONE_BASELINE_URL || 'http://localhost:3001'
const cacheUrl = process.env.ZONE_CACHE_URL || 'http://localhost:3002'

const zones: Record<string, string> = {
  baseline: baselineUrl,
  cache: cacheUrl,
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../../'),
  transpilePackages: ['@study/ui', '@study/docs-render', '@study/demos', '@study/docs'],
  async rewrites() {
    return [
      ...Object.entries(zones).map(([slug, url]) => ({
        source: `/zone/${slug}/:path*`,
        destination: `${url}/zone/${slug}/:path*`,
      })),
      ...Object.entries(zones).map(([slug, url]) => ({
        source: `/demo-static/${slug}/:path*`,
        destination: `${url}/demo-static/${slug}/:path*`,
      })),
    ]
  },
}

export default nextConfig
