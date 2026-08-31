import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  assetPrefix: '/demo-static/baseline',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.PUBLIC_ORIGIN ?? 'localhost:3000'],
    },
    taint: true,
  },
}

export default nextConfig
