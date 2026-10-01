import type { NextConfig } from 'next'
import { withRelatedProject } from '@vercel/related-projects'

// 로컬: PUBLIC_ORIGIN(.env.local) 기본값. Vercel: Related Projects가 셸의 배포 host를 자동 주입.
const publicOrigin = withRelatedProject({
  projectName: 'study-shell',
  defaultHost: process.env.PUBLIC_ORIGIN ?? 'localhost:3000',
})

const nextConfig: NextConfig = {
  // 워커별 독립 dev 서버용(.next 락 충돌 방지). 지정하지 않으면 기본 .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  cacheComponents: true, // Next.js 16 최상위 옵션
  assetPrefix: '/demo-static/cache',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: [publicOrigin],
    },
  },
  // functions/cache-life/custom-profile 데모 전용 커스텀 cacheLife 프로필.
  // next 16.3.2부터 cacheLife는 top-level 옵션이다 (experimental.cacheLife는 폐기되어 경고와 함께 이관될 뿐이다).
  // 키 이름에 데모 접두사(functions-cache-life-custom-profile:)를 붙여 같은 zone의 다른 cacheLife
  // 프로필과 충돌하지 않게 한다 (apps/AGENTS.md 8항).
  cacheLife: {
    'functions-cache-life-custom-profile:restock-alert': {
      stale: 20, // 20초: 클라이언트가 서버 확인 없이 즉시 재사용하는 시간
      revalidate: 45, // 45초: 이 시점 이후 요청부터 백그라운드로 새로 계산
      expire: 240, // 240초(4분): 트래픽이 없으면 이 시점 이후 완전 만료되어 동기 재계산
    },
    // config/cache-life/custom-presets 데모 전용 전역 프리셋 3종(짧은/중간/긴 수명).
    // 내장 프리셋 이름(default/seconds/minutes/hours/days/weeks/max)과 겹치면 내장 값을 덮어쓰므로
    // 반드시 데모 접두사(config-cache-life-custom-presets:)를 붙인 새 이름만 쓴다.
    // expire는 300초 이상으로 둔다: 300초 미만이면 next dev가 요청마다 백그라운드 재계산해 revalidate 주기가 관측되지 않는다.
    'config-cache-life-custom-presets:short': { stale: 10, revalidate: 20, expire: 300 },
    'config-cache-life-custom-presets:medium': { stale: 30, revalidate: 50, expire: 300 },
    'config-cache-life-custom-presets:long': { stale: 60, revalidate: 120, expire: 900 },
  },
}

export default nextConfig
