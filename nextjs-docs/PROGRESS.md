# 학습 진행 트래킹

> 전체 메뉴에 대한 순번·상태를 한 곳에서 확인하기 위한 표입니다. 순번은 각 카테고리·하위그룹 `README.md`와 동일하게 사용합니다 ([ADR 0002](./docs/adr/0002-reorder-learning-sequence.md)).
>
> - **순번**: 실제 디렉토리 뎁스를 반영한 트리 번호 (`1.1`, `3.1.1` 등). Glossary(4)/Community(6)는 참고용 카테고리라 대분류 번호만 사용합니다.
> - **공식 링크**: nextjs.org 공식 문서 링크입니다. 로컬 파일명 기준으로 추정한 링크이므로, 문서를 작성하면서 실제 링크와 다르면 바로 고쳐주세요.
> - **md 상태**: 미작성 / 초안 / 완료 (첫 작성 후 보강이 필요하면 완료 전까지 초안 유지). "완료"는 공식 출처/상위메뉴/학습 목표/핵심 개념 및 설명/예제 및 데모 설계/연습 문제/챕터 요약 6개 섹션이 모두 채워졌을 때만 부여한다 ([CLAUDE.md](./CLAUDE.md) 참고).
> - **데모 상태**: 미착수 / 진행중 / 완료 — Phase 2(문서화 완료 후)까지는 전부 미착수로 유지됩니다.
> - next.config.js 옵션(3.5.1, 65개)처럼 순수 참조형 목록은 그룹 단위로 한 줄로 축약했습니다. 개별 옵션 단위 추적이 필요해지면 그때 행을 펼쳐서 추가하세요.

## 1. Getting Started (기존 순서 유지)

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 1.1 | Installation | [공식](https://nextjs.org/docs/app/getting-started/installation) | 완료 | 미착수 |
| 1.2 | Project Structure | [공식](https://nextjs.org/docs/app/getting-started/project-structure) | 완료 | 미착수 |
| 1.3 | Layouts and Pages | [공식](https://nextjs.org/docs/app/getting-started/layouts-and-pages) | 완료 | 미착수 |
| 1.4 | Linking and Navigating | [공식](https://nextjs.org/docs/app/getting-started/linking-and-navigating) | 완료 | 미착수 |
| 1.5 | Server and Client Components | [공식](https://nextjs.org/docs/app/getting-started/server-and-client-components) | 완료 | 미착수 |
| 1.6 | Fetching Data | [공식](https://nextjs.org/docs/app/getting-started/fetching-data) | 완료 | 미착수 |
| 1.7 | Mutating Data | [공식](https://nextjs.org/docs/app/getting-started/mutating-data) | 완료 | 미착수 |
| 1.8 | Caching | [공식](https://nextjs.org/docs/app/getting-started/caching) | 완료 | 미착수 |
| 1.9 | Revalidating | [공식](https://nextjs.org/docs/app/getting-started/revalidating) | 완료 | 미착수 |
| 1.10 | Error Handling | [공식](https://nextjs.org/docs/app/getting-started/error-handling) | 완료 | 미착수 |
| 1.11 | CSS | [공식](https://nextjs.org/docs/app/getting-started/css) | 완료 | 미착수 |
| 1.12 | Image Optimization | [공식](https://nextjs.org/docs/app/getting-started/images) | 완료 | 미착수 |
| 1.13 | Font Optimization | [공식](https://nextjs.org/docs/app/getting-started/fonts) | 완료 | 미착수 |
| 1.14 | Metadata and OG images | [공식](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) | 완료 | 미착수 |
| 1.15 | Route Handlers | [공식](https://nextjs.org/docs/app/getting-started/route-handlers) | 완료 | 미착수 |
| 1.16 | Proxy | [공식](https://nextjs.org/docs/app/getting-started/proxy) | 완료 | 미착수 |
| 1.17 | Deploying | [공식](https://nextjs.org/docs/app/getting-started/deploying) | 완료 | 미착수 |
| 1.18 | Upgrading | [공식](https://nextjs.org/docs/app/getting-started/upgrading) | 완료 | 미착수 |

## 2. Guides (의존성 기준 재배열)

### 핵심 모델

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.1 | Rendering Philosophy | [공식](https://nextjs.org/docs/app/guides/rendering-philosophy) | 완료 | 미착수 |
| 2.2 | Server and Client Boundary | [공식](https://nextjs.org/docs/app/guides/server-and-client-boundary) | 완료 | 미착수 |
| 2.3 | How Revalidation Works | [공식](https://nextjs.org/docs/app/guides/how-revalidation-works) | 완료 | 미착수 |
| 2.4 | Caching (Previous Model) | [공식](https://nextjs.org/docs/app/guides/caching-without-cache-components) | 완료 | 미착수 |
| 2.5 | Streaming | [공식](https://nextjs.org/docs/app/guides/streaming) | 완료 | 미착수 |

### 캐싱·revalidation 심화

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.6 | ISR | [공식](https://nextjs.org/docs/app/guides/incremental-static-regeneration) | 완료 | 미착수 |
| 2.7 | ISR with Cache Components | [공식](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) | 완료 | 미착수 |
| 2.8 | Migrating to Cache Components | [공식](https://nextjs.org/docs/app/guides/migrating-to-cache-components) | 완료 | 미착수 |
| 2.9 | Adopting Partial Prefetching | [공식](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) | 완료 | 미착수 |
| 2.10 | Authentication with Cache Components | [공식](https://nextjs.org/docs/app/guides/authentication-with-cache-components) | 완료 | 미착수 |
| 2.11 | CDN Caching | [공식](https://nextjs.org/docs/app/guides/cdn-caching) | 완료 | 미착수 |
| 2.12 | CI Build Caching | [공식](https://nextjs.org/docs/app/guides/ci-build-caching) | 완료 | 미착수 |

### 데이터·폼

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.13 | Forms | [공식](https://nextjs.org/docs/app/guides/forms) | 완료 | 미착수 |
| 2.14 | Server Actions | [공식](https://nextjs.org/docs/app/guides/server-actions) | 완료 | 미착수 |
| 2.15 | Client-side data fetching | [공식](https://nextjs.org/docs/app/guides/client-side-data-fetching) | 완료 | 미착수 |
| 2.15.1 | ㄴ SWR | [공식](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr) | 완료 | 미착수 |
| 2.15.2 | ㄴ TanStack Query | [공식](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query) | 완료 | 미착수 |
| 2.16 | Redirecting | [공식](https://nextjs.org/docs/app/guides/redirecting) | 완료 | 미착수 |
| 2.17 | Draft Mode | [공식](https://nextjs.org/docs/app/guides/draft-mode) | 완료 | 미착수 |

### 내비게이션·체감 성능

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.18 | Prefetching | [공식](https://nextjs.org/docs/app/guides/prefetching) | 완료 | 미착수 |
| 2.19 | Optimizing prefetching | [공식](https://nextjs.org/docs/app/guides/optimizing-prefetching) | 완료 | 미착수 |
| 2.20 | Instant navigation | [공식](https://nextjs.org/docs/app/guides/instant-navigation) | 완료 | 미착수 |
| 2.21 | Lazy Loading | [공식](https://nextjs.org/docs/app/guides/lazy-loading) | 완료 | 미착수 |
| 2.22 | Preserving UI state | [공식](https://nextjs.org/docs/app/guides/preserving-ui-state) | 완료 | 미착수 |
| 2.23 | Preventing Flash | [공식](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) | 완료 | 미착수 |
| 2.24 | View transitions | [공식](https://nextjs.org/docs/app/guides/view-transitions) | 완료 | 미착수 |

### 스타일링

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.25 | CSS-in-JS | [공식](https://nextjs.org/docs/app/guides/css-in-js) | 완료 | 미착수 |
| 2.26 | Sass | [공식](https://nextjs.org/docs/app/guides/sass) | 완료 | 미착수 |
| 2.27 | Tailwind CSS v3 | [공식](https://nextjs.org/docs/app/guides/tailwind-v3-css) | 완료 | 미착수 |

### 인증·보안

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.28 | Authentication | [공식](https://nextjs.org/docs/app/guides/authentication) | 초안 | 미착수 |
| 2.29 | Data Security | [공식](https://nextjs.org/docs/app/guides/data-security) | 초안 | 미착수 |
| 2.30 | Content Security Policy | [공식](https://nextjs.org/docs/app/guides/content-security-policy) | 초안 | 미착수 |
| 2.31 | Environment Variables | [공식](https://nextjs.org/docs/app/guides/environment-variables) | 초안 | 미착수 |

### 메타데이터·인터랙션 확장

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.32 | JSON-LD | [공식](https://nextjs.org/docs/app/guides/json-ld) | 초안 | 미착수 |
| 2.33 | Interactive apps | [공식](https://nextjs.org/docs/app/guides/interactive-apps) | 초안 | 미착수 |
| 2.34 | Scripts | [공식](https://nextjs.org/docs/app/guides/scripts) | 초안 | 미착수 |
| 2.35 | MDX | [공식](https://nextjs.org/docs/app/guides/mdx) | 초안 | 미착수 |
| 2.36 | Third Party Libraries | [공식](https://nextjs.org/docs/app/guides/third-party-libraries) | 초안 | 미착수 |

### 앱 아키텍처 패턴

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.37 | Backend for Frontend | [공식](https://nextjs.org/docs/app/guides/backend-for-frontend) | 초안 | 미착수 |
| 2.38 | SPAs | [공식](https://nextjs.org/docs/app/guides/single-page-applications) | 초안 | 미착수 |
| 2.39 | PWAs | [공식](https://nextjs.org/docs/app/guides/progressive-web-apps) | 초안 | 미착수 |
| 2.40 | Offline support | [공식](https://nextjs.org/docs/app/guides/offline-support) | 초안 | 미착수 |
| 2.41 | Internationalization | [공식](https://nextjs.org/docs/app/guides/internationalization) | 초안 | 미착수 |
| 2.42 | Multi-tenant | [공식](https://nextjs.org/docs/app/guides/multi-tenant) | 초안 | 미착수 |
| 2.43 | Multi-zones | [공식](https://nextjs.org/docs/app/guides/multi-zones) | 초안 | 미착수 |

### 테스트·디버깅

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.44 | Testing | [공식](https://nextjs.org/docs/app/guides/testing) | 초안 | 미착수 |
| 2.44.1 | ㄴ Cypress | [공식](https://nextjs.org/docs/app/guides/testing/cypress) | 초안 | 미착수 |
| 2.44.2 | ㄴ Jest | [공식](https://nextjs.org/docs/app/guides/testing/jest) | 초안 | 미착수 |
| 2.44.3 | ㄴ Playwright | [공식](https://nextjs.org/docs/app/guides/testing/playwright) | 초안 | 미착수 |
| 2.44.4 | ㄴ Vitest | [공식](https://nextjs.org/docs/app/guides/testing/vitest) | 초안 | 미착수 |
| 2.45 | Debugging | [공식](https://nextjs.org/docs/app/guides/debugging) | 초안 | 미착수 |
| 2.46 | Development Environment | [공식](https://nextjs.org/docs/app/guides/local-development) | 초안 | 미착수 |
| 2.47 | Memory Usage | [공식](https://nextjs.org/docs/app/guides/memory-usage) | 초안 | 미착수 |
| 2.48 | Instrumentation | [공식](https://nextjs.org/docs/app/guides/instrumentation) | 초안 | 미착수 |
| 2.49 | OpenTelemetry | [공식](https://nextjs.org/docs/app/guides/open-telemetry) | 초안 | 미착수 |

### 빌드·번들링

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.50 | Building | [공식](https://nextjs.org/docs/app/guides/building) | 초안 | 미착수 |
| 2.51 | Package Bundling | [공식](https://nextjs.org/docs/app/guides/package-bundling) | 초안 | 미착수 |
| 2.52 | Custom Server | [공식](https://nextjs.org/docs/app/guides/custom-server) | 초안 | 미착수 |

### 배포·운영

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.53 | Production | [공식](https://nextjs.org/docs/app/guides/production-checklist) | 초안 | 미착수 |
| 2.54 | Self-Hosting | [공식](https://nextjs.org/docs/app/guides/self-hosting) | 초안 | 미착수 |
| 2.55 | Deploying to Platforms | [공식](https://nextjs.org/docs/app/guides/deploying-to-platforms) | 초안 | 미착수 |
| 2.56 | Static Exports | [공식](https://nextjs.org/docs/app/guides/static-exports) | 초안 | 미착수 |
| 2.57 | Public pages | [공식](https://nextjs.org/docs/app/guides/public-static-pages) | 초안 | 미착수 |
| 2.58 | PPR Platform Guide | [공식](https://nextjs.org/docs/app/guides/ppr-platform-guide) | 초안 | 미착수 |

### 분석·기타

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.59 | Analytics | [공식](https://nextjs.org/docs/app/guides/analytics) | 완료 | 미착수 |
| 2.60 | Videos | [공식](https://nextjs.org/docs/app/guides/videos) | 완료 | 미착수 |

### AI 도구

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 2.61 | AI Coding Agents | [공식](https://nextjs.org/docs/app/guides/ai-agents) | 완료 | 미착수 |
| 2.62 | Next.js MCP Server | [공식](https://nextjs.org/docs/app/guides/mcp) | 완료 | 미착수 |

## 3. API Reference (하위 그룹 순서 재배열)

### 3.1 File-system conventions

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.1.1 | layout.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/layout) | 초안 | 미착수 |
| 3.1.2 | page.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/page) | 초안 | 미착수 |
| 3.1.3 | loading.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/loading) | 초안 | 미착수 |
| 3.1.4 | error.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/error) | 초안 | 미착수 |
| 3.1.5 | not-found.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) | 초안 | 미착수 |
| 3.1.6 | template.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/template) | 초안 | 미착수 |
| 3.1.7 | default.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/default) | 초안 | 미착수 |
| 3.1.8 | route.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route) | 초안 | 미착수 |
| 3.1.9 | Route Groups | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) | 초안 | 미착수 |
| 3.1.10 | Dynamic Segments | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) | 초안 | 미착수 |
| 3.1.11 | Parallel Routes | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) | 초안 | 미착수 |
| 3.1.12 | Intercepting Routes | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes) | 초안 | 미착수 |
| 3.1.13 | src | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) | 초안 | 미착수 |
| 3.1.14 | public | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) | 초안 | 미착수 |
| 3.1.15 | mdx-components.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components) | 초안 | 미착수 |
| 3.1.16 | instrumentation.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation) | 초안 | 미착수 |
| 3.1.17 | instrumentation-client.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client) | 초안 | 미착수 |
| 3.1.18 | proxy.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) | 초안 | 미착수 |
| 3.1.19 | forbidden.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden) | 초안 | 미착수 |
| 3.1.20 | unauthorized.js | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized) | 초안 | 미착수 |
| 3.1.21 | Metadata Files | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) | 초안 | 미착수 |
| 3.1.21.1 | ㄴ favicon, icon, apple-icon | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) | 초안 | 미착수 |
| 3.1.21.2 | ㄴ manifest.json | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest) | 초안 | 미착수 |
| 3.1.21.3 | ㄴ opengraph-image / twitter-image | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) | 초안 | 미착수 |
| 3.1.21.4 | ㄴ robots.txt | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) | 초안 | 미착수 |
| 3.1.21.5 | ㄴ sitemap.xml | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) | 초안 | 미착수 |
| 3.1.22 | Route Segment Config | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) | 초안 | 미착수 |
| 3.1.22.1 | ㄴ dynamicParams | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) | 초안 | 미착수 |
| 3.1.22.2 | ㄴ instant | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) | 초안 | 미착수 |
| 3.1.22.3 | ㄴ maxDuration | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration) | 초안 | 미착수 |
| 3.1.22.4 | ㄴ prefetch | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch) | 초안 | 미착수 |
| 3.1.22.5 | ㄴ runtime | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime) | 초안 | 미착수 |
| 3.1.22.6 | ㄴ preferredRegion (deprecated) | [공식](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/preferredRegion) | 초안 | 미착수 |

### 3.2 Components

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.2.1 | Image Component | [공식](https://nextjs.org/docs/app/api-reference/components/image) | 초안 | 미착수 |
| 3.2.2 | Link Component | [공식](https://nextjs.org/docs/app/api-reference/components/link) | 초안 | 미착수 |
| 3.2.3 | Font | [공식](https://nextjs.org/docs/app/api-reference/components/font) | 초안 | 미착수 |
| 3.2.4 | Script Component | [공식](https://nextjs.org/docs/app/api-reference/components/script) | 초안 | 미착수 |
| 3.2.5 | Form Component | [공식](https://nextjs.org/docs/app/api-reference/components/form) | 초안 | 미착수 |

### 3.3 Functions

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.3.1 | useRouter | [공식](https://nextjs.org/docs/app/api-reference/functions/use-router) | 초안 | 미착수 |
| 3.3.2 | usePathname | [공식](https://nextjs.org/docs/app/api-reference/functions/use-pathname) | 초안 | 미착수 |
| 3.3.3 | useParams | [공식](https://nextjs.org/docs/app/api-reference/functions/use-params) | 초안 | 미착수 |
| 3.3.4 | useSearchParams | [공식](https://nextjs.org/docs/app/api-reference/functions/use-search-params) | 초안 | 미착수 |
| 3.3.5 | useSelectedLayoutSegment | [공식](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) | 초안 | 미착수 |
| 3.3.6 | useSelectedLayoutSegments | [공식](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) | 초안 | 미착수 |
| 3.3.7 | useLinkStatus | [공식](https://nextjs.org/docs/app/api-reference/functions/use-link-status) | 초안 | 미착수 |
| 3.3.8 | root-params | [공식](https://nextjs.org/docs/app/api-reference/functions/next-root-params) | 초안 | 미착수 |
| 3.3.9 | fetch | [공식](https://nextjs.org/docs/app/api-reference/functions/fetch) | 초안 | 미착수 |
| 3.3.10 | cookies | [공식](https://nextjs.org/docs/app/api-reference/functions/cookies) | 초안 | 미착수 |
| 3.3.11 | headers | [공식](https://nextjs.org/docs/app/api-reference/functions/headers) | 초안 | 미착수 |
| 3.3.12 | draftMode | [공식](https://nextjs.org/docs/app/api-reference/functions/draft-mode) | 초안 | 미착수 |
| 3.3.13 | cacheLife | [공식](https://nextjs.org/docs/app/api-reference/functions/cacheLife) | 초안 | 미착수 |
| 3.3.14 | cacheTag | [공식](https://nextjs.org/docs/app/api-reference/functions/cacheTag) | 초안 | 미착수 |
| 3.3.15 | unstable_cache | [공식](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) | 초안 | 미착수 |
| 3.3.16 | unstable_noStore | [공식](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore) | 초안 | 미착수 |
| 3.3.17 | revalidatePath | [공식](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) | 초안 | 미착수 |
| 3.3.18 | revalidateTag | [공식](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) | 초안 | 미착수 |
| 3.3.19 | updateTag | [공식](https://nextjs.org/docs/app/api-reference/functions/updateTag) | 초안 | 미착수 |
| 3.3.20 | connection | [공식](https://nextjs.org/docs/app/api-reference/functions/connection) | 초안 | 미착수 |
| 3.3.21 | io | [공식](https://nextjs.org/docs/app/api-reference/functions/io) | 초안 | 미착수 |
| 3.3.22 | after | [공식](https://nextjs.org/docs/app/api-reference/functions/after) | 초안 | 미착수 |
| 3.3.23 | notFound | [공식](https://nextjs.org/docs/app/api-reference/functions/not-found) | 초안 | 미착수 |
| 3.3.24 | forbidden | [공식](https://nextjs.org/docs/app/api-reference/functions/forbidden) | 초안 | 미착수 |
| 3.3.25 | unauthorized | [공식](https://nextjs.org/docs/app/api-reference/functions/unauthorized) | 초안 | 미착수 |
| 3.3.26 | redirect | [공식](https://nextjs.org/docs/app/api-reference/functions/redirect) | 초안 | 미착수 |
| 3.3.27 | permanentRedirect | [공식](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect) | 초안 | 미착수 |
| 3.3.28 | catchError | [공식](https://nextjs.org/docs/app/api-reference/functions/catchError) | 초안 | 미착수 |
| 3.3.29 | refresh | [공식](https://nextjs.org/docs/app/api-reference/functions/refresh) | 초안 | 미착수 |
| 3.3.30 | unstable_rethrow | [공식](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow) | 초안 | 미착수 |
| 3.3.31 | NextRequest | [공식](https://nextjs.org/docs/app/api-reference/functions/next-request) | 초안 | 미착수 |
| 3.3.32 | NextResponse | [공식](https://nextjs.org/docs/app/api-reference/functions/next-response) | 초안 | 미착수 |
| 3.3.33 | ImageResponse | [공식](https://nextjs.org/docs/app/api-reference/functions/image-response) | 초안 | 미착수 |
| 3.3.34 | userAgent | [공식](https://nextjs.org/docs/app/api-reference/functions/userAgent) | 초안 | 미착수 |
| 3.3.35 | generateMetadata | [공식](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) | 초안 | 미착수 |
| 3.3.36 | generateImageMetadata | [공식](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) | 초안 | 미착수 |
| 3.3.37 | generateViewport | [공식](https://nextjs.org/docs/app/api-reference/functions/generate-viewport) | 초안 | 미착수 |
| 3.3.38 | generateStaticParams | [공식](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) | 초안 | 미착수 |
| 3.3.39 | generateSitemaps | [공식](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) | 초안 | 미착수 |
| 3.3.40 | useOffline | [공식](https://nextjs.org/docs/app/api-reference/functions/use-offline) | 초안 | 미착수 |
| 3.3.41 | useReportWebVitals | [공식](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals) | 초안 | 미착수 |

### 3.4 Directives

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.4.1 | use client | [공식](https://nextjs.org/docs/app/api-reference/directives/use-client) | 초안 | 미착수 |
| 3.4.2 | use server | [공식](https://nextjs.org/docs/app/api-reference/directives/use-server) | 초안 | 미착수 |
| 3.4.3 | use cache | [공식](https://nextjs.org/docs/app/api-reference/directives/use-cache) | 초안 | 미착수 |
| 3.4.4 | use cache: private | [공식](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) | 초안 | 미착수 |
| 3.4.5 | use cache: remote | [공식](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote) | 초안 | 미착수 |

### 3.5 Configuration

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.5.1 | next.config.js (65개 옵션, 알파벳순 유지) | [공식](https://nextjs.org/docs/app/api-reference/config/next-config-js) | 초안 | 미착수 |
| 3.5.2 | TypeScript | [공식](https://nextjs.org/docs/app/api-reference/config/typescript) | 초안 | 미착수 |
| 3.5.3 | ESLint | [공식](https://nextjs.org/docs/app/api-reference/config/eslint) | 초안 | 미착수 |

### 3.6 CLI

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.6.1 | create-next-app | [공식](https://nextjs.org/docs/app/api-reference/cli/create-next-app) | 초안 | 미착수 |
| 3.6.2 | next CLI | [공식](https://nextjs.org/docs/app/api-reference/cli/next) | 초안 | 미착수 |

### 3.7 Adapters

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.7.1 | API Reference (개요) | [공식](https://nextjs.org/docs/app/api-reference/adapters/api-reference) | 초안 | 미착수 |
| 3.7.2 | Use Cases | [공식](https://nextjs.org/docs/app/api-reference/adapters/use-cases) | 초안 | 미착수 |
| 3.7.3 | Creating an Adapter | [공식](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter) | 초안 | 미착수 |
| 3.7.4 | Configuration | [공식](https://nextjs.org/docs/app/api-reference/adapters/configuration) | 초안 | 미착수 |
| 3.7.5 | Routing Information | [공식](https://nextjs.org/docs/app/api-reference/adapters/routing-information) | 초안 | 미착수 |
| 3.7.6 | Routing with @next/routing | [공식](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing) | 초안 | 미착수 |
| 3.7.7 | Invoking Entrypoints | [공식](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints) | 초안 | 미착수 |
| 3.7.8 | Runtime Integration | [공식](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration) | 초안 | 미착수 |
| 3.7.9 | Output Types | [공식](https://nextjs.org/docs/app/api-reference/adapters/output-types) | 초안 | 미착수 |
| 3.7.10 | Supporting Immutable Static Assets | [공식](https://nextjs.org/docs/app/api-reference/adapters/immutable-static-assets) | 초안 | 미착수 |
| 3.7.11 | Implementing PPR in an Adapter | [공식](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter) | 초안 | 미착수 |
| 3.7.12 | Testing Adapters | [공식](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters) | 초안 | 미착수 |

### 3.8 ~ 3.9 개별 항목

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 3.8 | Edge Runtime | [공식](https://nextjs.org/docs/app/api-reference/edge) | 초안 | 미착수 |
| 3.9 | Turbopack | [공식](https://nextjs.org/docs/app/api-reference/turbopack) | 초안 | 미착수 |

## 4. Glossary (참고용, 하위 순번 없음)

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 4 | Glossary (전체 용어집, 개별 용어는 문서 내부 섹션으로 관리) | [공식](https://nextjs.org/docs/app/glossary) | 초안 | - |

## 5. Architecture (기존 순서 유지)

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 5.1 | Accessibility | [공식](https://nextjs.org/docs/architecture/accessibility) | 초안 | 미착수 |
| 5.2 | Fast Refresh | [공식](https://nextjs.org/docs/architecture/fast-refresh) | 초안 | 미착수 |
| 5.3 | Next.js Compiler | [공식](https://nextjs.org/docs/architecture/nextjs-compiler) | 초안 | 미착수 |
| 5.4 | Supported Browsers | [공식](https://nextjs.org/docs/architecture/supported-browsers) | 초안 | 미착수 |

## 6. Community (참고용, 하위 순번 없음)

| 순번 | 메뉴 | 공식 링크 | md 상태 | 데모 상태 |
|---|---|---|---|---|
| 6 | Contribution Guide | [공식](https://nextjs.org/docs/community/contribution-guide) | 초안 | - |
| 6 | Rspack | [공식](https://nextjs.org/docs/community/rspack) | 초안 | - |
