import type { NextConfig } from 'next'
import { withRelatedProject } from '@vercel/related-projects'

// 로컬: PUBLIC_ORIGIN(.env.local) 기본값. Vercel: Related Projects가 셸의 배포 host를 자동 주입.
const publicOrigin = withRelatedProject({
  projectName: 'study-shell',
  defaultHost: process.env.PUBLIC_ORIGIN ?? 'localhost:3000',
})

const nextConfig: NextConfig = {
  cacheComponents: true, // Next.js 16 최상위 옵션
  assetPrefix: '/demo-static/cache',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: [publicOrigin],
    },
  },
  // functions/cache-life/custom-profile 데모 전용 커스텀 cacheLife 프로필.
  // next 16.3.2부터 cacheLife는 top-level 옵션이다 — experimental.cacheLife는 폐기(deprecated)되어
  // "has been moved to `cacheLife`" 경고와 함께 자동 이관될 뿐이다
  // (출처: node_modules/next/dist/server/config.js의
  // `warnOptionHasBeenMovedOutOfExperimental(result, 'cacheLife', 'cacheLife', ...)`).
  // 키 이름에 데모 접두사(functions-cache-life-custom-profile:)를 붙여 같은 zone의 다른 cacheLife
  // 프로필과 충돌하지 않게 한다 (apps/AGENTS.md 8항).
  cacheLife: {
    'functions-cache-life-custom-profile:breaking-news': {
      stale: 30, // 클라이언트: 최소 30초 강제 (공식 문서 stale 하한)
      revalidate: 4, // 서버: 4초 지나면 다음 요청에서 백그라운드 재생성
      expire: 20, // 20초 동안 요청이 없으면 완전 만료 → 다음 요청은 동기 재계산 대기
    },
  },
}

export default nextConfig
