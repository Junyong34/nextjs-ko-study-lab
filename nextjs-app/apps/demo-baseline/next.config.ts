import type { NextConfig } from 'next'
import { withRelatedProject } from '@vercel/related-projects'
import createMDX from '@next/mdx'
import {
  REACT_COMPILER_SETTINGS,
  USE_TURBOPACK_RUST_REACT_COMPILER,
} from './src/config/react-compiler-settings'
import { demoEnv, demoHeaders, demoRedirects, demoRewrites } from './src/config/demo-next-config'

// 로컬: PUBLIC_ORIGIN(.env.local) 기본값. Vercel: Related Projects가 셸의 배포 host를 자동 주입.
const publicOrigin = withRelatedProject({
  projectName: 'study-shell',
  defaultHost: process.env.PUBLIC_ORIGIN ?? 'localhost:3000',
})

const nextConfig: NextConfig = {
  // guides/mdx·mdx-components 데모용. md/mdx 파일도 페이지·모듈로 취급한다(src 안에 해당 확장자 파일이 생기는 곳은 그 데모들뿐).
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // 워커별 독립 dev 서버용(.next 락 충돌 방지). 지정하지 않으면 기본 .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  assetPrefix: '/demo-static/baseline',
  images: { unoptimized: true },
  // config/powered-by-header/hide-x-powered 데모의 실제 검증 대상.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader
  poweredByHeader: false,
  reactCompiler: REACT_COMPILER_SETTINGS,
  // config/* 데모의 실제 검증 대상. 데모별 조각은 src/config/demo-next-config/에서 합친다.
  env: demoEnv,
  redirects: async () => demoRedirects,
  rewrites: async () => demoRewrites,
  headers: async () => demoHeaders,
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

// Turbopack에서는 remark/rehype 플러그인을 문자열 이름으로만 지정할 수 있다.
const withMDX = createMDX({})

export default withMDX(nextConfig)
