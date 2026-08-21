import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true, // Next.js 16 최상위 옵션
  assetPrefix: '/demo-static/cache',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.PUBLIC_ORIGIN ?? 'localhost:3000'],
    },
  },
}

export default nextConfig
