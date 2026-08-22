import fs from 'fs'
import path from 'path'
import { allRemainingSpecs } from './generate-all-phase2-3-demos'
import { phase4And5Specs } from './generate-phase-4-5-demos'

const BASE_DIR = '/Users/devpark/workspace/devpark/nextjs-ko-study-lab-phase-1/nextjs-app'
const DEMOS_YAML = path.join(BASE_DIR, 'packages/demos/demos.yaml')

// Base Phase 1 items
const baseDemos = [
  { url: 'server-actions/basic', title: 'Server Actions 기본 폼 처리 및 상태 변경', doc: '2-guides/2.14-server-actions.md', zone: 'baseline' },
  { url: 'caching/basic', title: 'use cache 기본 동작 및 revalidateTag 무효화', doc: '1-getting-started/caching.md', zone: 'cache' },
  { url: 'layouts-and-pages/nested-layouts', title: '쇼핑몰 GNB 및 사이드바 중첩 레이아웃 (Partial Rendering)', doc: '1-getting-started/layouts-and-pages.md', zone: 'baseline' },
  { url: 'layouts-and-pages/template-lifecycle', title: 'template.tsx 생명주기 및 인스턴스 재생성', doc: '1-getting-started/layouts-and-pages.md', zone: 'baseline' },
  { url: 'layouts-and-pages/route-groups-layouts', title: 'Route Groups를 활용한 다중 루트 레이아웃 분리', doc: '1-getting-started/layouts-and-pages.md', zone: 'baseline' },
  { url: 'linking-and-navigating/soft-navigation', title: 'Link vs a 소프트 네비게이션 및 스크롤 제어', doc: '1-getting-started/linking-and-navigating.md', zone: 'baseline' },
  { url: 'linking-and-navigating/router-prefetch', title: 'useRouter 프로그래밍 네비게이션 및 prefetch 최적화', doc: '1-getting-started/linking-and-navigating.md', zone: 'baseline' },
  { url: 'server-client-components/composition', title: 'Server & Client Components 합성 및 경계 분리', doc: '1-getting-started/server-and-client-components.md', zone: 'baseline' },
  { url: 'server-client-components/serialization', title: 'Props 직렬화(Serialization) 및 전달 경계 검증', doc: '1-getting-started/server-and-client-components.md', zone: 'baseline' },
  { url: 'fetching-data/parallel-fetching', title: 'Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조', doc: '1-getting-started/fetching-data.md', zone: 'baseline' },
  { url: 'fetching-data/use-promise-streaming', title: 'React 19 use(Promise) & Suspense 스트리밍 패칭', doc: '1-getting-started/fetching-data.md', zone: 'baseline' },
  { url: 'mutating-data/server-action-revalidate', title: 'Server Action 데이터 변경 및 revalidatePath 동기화', doc: '1-getting-started/mutating-data.md', zone: 'baseline' },
  { url: 'mutating-data/optimistic-cart', title: 'React 19 useOptimistic 낙관적 장바구니 UI', doc: '1-getting-started/mutating-data.md', zone: 'baseline' },
  { url: 'revalidating/time-based-isr', title: 'cacheLife 시간 기반 캐시 수명 및 SWR 재검증', doc: '1-getting-started/revalidating.md', zone: 'cache' },
  { url: 'revalidating/tag-vs-path', title: 'revalidateTag(정밀 무효화) vs revalidatePath(경로 무효화)', doc: '1-getting-started/revalidating.md', zone: 'cache' },
  { url: 'error-handling/segment-error', title: 'error.tsx 세그먼트 에러 바운더리 격리 및 복구', doc: '1-getting-started/error-handling.md', zone: 'baseline' },
  { url: 'error-handling/global-error', title: '예상된 에러 vs 예외 vs global-error 계층 처리', doc: '1-getting-started/error-handling.md', zone: 'baseline' },
  { url: 'css/tailwind-v4', title: 'Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일', doc: '1-getting-started/css.md', zone: 'baseline' },
  { url: 'css/css-modules', title: 'CSS Modules 스코프 격리 및 해시 클래스 충돌 방지', doc: '1-getting-started/css.md', zone: 'baseline' },
  { url: 'images/image-optimization', title: 'next/image 자동 WebP 변환 및 CLS 방지 최적화', doc: '1-getting-started/images.md', zone: 'baseline' },
  { url: 'fonts/font-optimization', title: 'next/font 자동 셀프호스팅 및 Zero CLS 폰트 로딩', doc: '1-getting-started/fonts.md', zone: 'baseline' },
  { url: 'metadata-and-og-images/static-and-dynamic-metadata', title: 'generateMetadata 동적 메타데이터 & 소셜 공유 미리보기', doc: '1-getting-started/metadata-and-og-images.md', zone: 'baseline' },
  { url: 'metadata-and-og-images/opengraph-image', title: 'opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse)', doc: '1-getting-started/metadata-and-og-images.md', zone: 'baseline' },
  { url: 'route-handlers/rest-api-crud', title: 'REST API Route Handler (GET, POST, PATCH, DELETE)', doc: '1-getting-started/route-handlers.md', zone: 'baseline' },
  { url: 'route-handlers/streaming-sse', title: 'ReadableStream 기반 Server-Sent Events(SSE) 스트리밍', doc: '1-getting-started/route-handlers.md', zone: 'baseline' },
  { url: 'proxy/rewrite-and-headers', title: 'Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입', doc: '1-getting-started/proxy.md', zone: 'baseline' },
  { url: 'guides/streaming-nested', title: '중첩 Suspense 점진적 청크 스트리밍', doc: '2-guides/streaming.md', zone: 'baseline' },
  { url: 'guides/server-actions-advanced', title: 'Server Action 폼 검증 및 useActionState 실시간 할인', doc: '2-guides/server-actions.md', zone: 'baseline' },
  { url: 'guides/swr-polling', title: 'SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신', doc: '2-guides/2.15-client-side-data-fetching/swr.md', zone: 'baseline' },
  { url: 'guides/lazy-loading-chart', title: 'next/dynamic 지연 로딩 & 클라이언트 번들 최적화', doc: '2-guides/lazy-loading.md', zone: 'baseline' },
  { url: 'guides/auth-session', title: 'Next.js 인증 & 세션 기반 역할 분기 (RBAC)', doc: '2-guides/authentication.md', zone: 'baseline' },
  { url: 'file-conventions/parallel-routes', title: 'Parallel Routes (@slots) 다중 슬롯 병렬 렌더링', doc: '3-api-reference/3.1-file-conventions/parallel-routes.md', zone: 'baseline' },
  { url: 'file-conventions/intercepting-routes', title: 'Intercepting Routes ((..)segment) 라우트 인터셉트', doc: '3-api-reference/3.1-file-conventions/intercepting-routes.md', zone: 'baseline' },
  { url: 'components/form-component', title: 'Next.js 빌트인 <Form> 컴포넌트 & GET 검색 동기화', doc: '3-api-reference/3.2-components/form.md', zone: 'baseline' },
  { url: 'architecture/fast-refresh-boundary', title: 'React Fast Refresh & 핫 모듈 리로딩 (HMR) 상태 보존', doc: '5-architecture/fast-refresh.md', zone: 'baseline' },
]

const combined = [...baseDemos]
const seen = new Set(baseDemos.map(d => d.url))

for (const demo of allRemainingSpecs) {
  if (!seen.has(demo.url)) {
    seen.add(demo.url)
    combined.push({
      url: demo.url,
      title: demo.title.replace(/"/g, "'"),
      doc: demo.doc,
      zone: demo.zone
    })
  }
}

for (const demo of phase4And5Specs) {
  if (!seen.has(demo.url)) {
    seen.add(demo.url)
    combined.push({
      url: demo.url,
      title: demo.title.replace(/"/g, "'"),
      doc: demo.doc,
      zone: demo.zone
    })
  }
}

let yamlOut = ''
for (const item of combined) {
  yamlOut += `- url: ${item.url}
  title: "${item.title.replace(/"/g, "'")}"
  doc: ${item.doc}
  zone: ${item.zone}
  status: done

`
}

fs.writeFileSync(DEMOS_YAML, yamlOut.trim() + '\n')
console.log(`Generated clean demos.yaml with ${combined.length} total demos across all phases!`)
