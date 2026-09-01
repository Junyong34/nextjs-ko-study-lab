import type { NextConfig } from 'next'
import { withRelatedProject } from '@vercel/related-projects'

// 로컬: PUBLIC_ORIGIN(.env.local) 기본값. Vercel: Related Projects가 셸의 배포 host를 자동 주입.
const publicOrigin = withRelatedProject({
  projectName: 'study-shell',
  defaultHost: process.env.PUBLIC_ORIGIN ?? 'localhost:3000',
})

const nextConfig: NextConfig = {
  assetPrefix: '/demo-static/baseline',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: [publicOrigin],
    },
    taint: true,
  },
}

export default nextConfig
