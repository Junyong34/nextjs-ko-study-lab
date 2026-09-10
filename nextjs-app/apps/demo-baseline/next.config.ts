import type { NextConfig } from 'next'
import { withRelatedProject } from '@vercel/related-projects'
import {
  REACT_COMPILER_SETTINGS,
  USE_TURBOPACK_RUST_REACT_COMPILER,
} from './src/config/react-compiler-settings'

// 로컬: PUBLIC_ORIGIN(.env.local) 기본값. Vercel: Related Projects가 셸의 배포 host를 자동 주입.
const publicOrigin = withRelatedProject({
  projectName: 'study-shell',
  defaultHost: process.env.PUBLIC_ORIGIN ?? 'localhost:3000',
})

const nextConfig: NextConfig = {
  assetPrefix: '/demo-static/baseline',
  images: { unoptimized: true },
  reactCompiler: REACT_COMPILER_SETTINGS,
  experimental: {
    turbopackRustReactCompiler: USE_TURBOPACK_RUST_REACT_COMPILER,
    serverActions: {
      allowedOrigins: [publicOrigin],
    },
    taint: true,
    // forbidden()/unauthorized() 및 forbidden.tsx/unauthorized.tsx 파일 컨벤션에 필요한 experimental 플래그.
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts
    authInterrupts: true,
  },
}

export default nextConfig
