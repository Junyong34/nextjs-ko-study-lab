# Guides

> Next.js 공식 문서의 **Guides** 메뉴를 주제별 학습 문서로 확장하기 위한 설계용 목차입니다.

- 공식 문서: [Guides](https://nextjs.org/docs/app/guides)
- 상위 목차: [Next.js 학습 문서](../README.md)

## 학습 순서

> 공식 사이드바는 알파벳순이지만, 학습 순서는 의존성·난이도 기준으로 재배열했습니다 ([ADR 0002](../docs/adr/0002-reorder-learning-sequence.md)).

### 핵심 모델 (렌더링·캐싱의 기본 개념)

- 2.1 [Rendering Philosophy](./rendering-philosophy.md)
- 2.2 [Server and Client Boundary](./server-and-client-boundary.md)
- 2.3 [How Revalidation Works](./how-revalidation-works.md)
- 2.4 [Caching (Previous Model)](./caching-without-cache-components.md)
- 2.5 [Streaming](./streaming.md)

### 캐싱·재검증 심화

- 2.6 [ISR](./incremental-static-regeneration.md)
- 2.7 [ISR with Cache Components](./incremental-static-regeneration-cache-components.md)
- 2.8 [Migrating to Cache Components](./migrating-to-cache-components.md)
- 2.9 [Adopting Partial Prefetching](./adopting-partial-prefetching.md)
- 2.10 [Authentication with Cache Components](./authentication-with-cache-components.md)
- 2.11 [CDN Caching](./cdn-caching.md)
- 2.12 [CI Build Caching](./ci-build-caching.md)

### 데이터·폼

- 2.13 [Forms](./forms.md)
- 2.14 [Server Actions](./server-actions.md)
- 2.15 [Client-side data fetching](./2.15-client-side-data-fetching/README.md)
- 2.16 [Redirecting](./redirecting.md)
- 2.17 [Draft Mode](./draft-mode.md)

### 내비게이션·체감 성능

- 2.18 [Prefetching](./prefetching.md)
- 2.19 [Optimizing prefetching](./optimizing-prefetching.md)
- 2.20 [Instant navigation](./instant-navigation.md)
- 2.21 [Lazy Loading](./lazy-loading.md)
- 2.22 [Preserving UI state](./preserving-ui-state.md)
- 2.23 [Preventing Flash](./preventing-flash-before-hydration.md)
- 2.24 [View transitions](./view-transitions.md)

### 스타일링

- 2.25 [CSS-in-JS](./css-in-js.md)
- 2.26 [Sass](./sass.md)
- 2.27 [Tailwind CSS v3](./tailwind-v3-css.md)

### 인증·보안

- 2.28 [Authentication](./authentication.md)
- 2.29 [Data Security](./data-security.md)
- 2.30 [Content Security Policy](./content-security-policy.md)
- 2.31 [Environment Variables](./environment-variables.md)

### 메타데이터·인터랙션 확장

- 2.32 [JSON-LD](./json-ld.md)
- 2.33 [Interactive apps](./interactive-apps.md)
- 2.34 [Scripts](./scripts.md)
- 2.35 [MDX](./mdx.md)
- 2.36 [Third Party Libraries](./third-party-libraries.md)

### 앱 아키텍처 패턴

- 2.37 [Backend for Frontend](./backend-for-frontend.md)
- 2.38 [SPAs](./single-page-applications.md)
- 2.39 [PWAs](./progressive-web-apps.md)
- 2.40 [Offline support](./offline-support.md)
- 2.41 [Internationalization](./internationalization.md)
- 2.42 [Multi-tenant](./multi-tenant.md)
- 2.43 [Multi-zones](./multi-zones.md)

### 테스트·디버깅

- 2.44 [Testing](./2.44-testing/README.md)
- 2.45 [Debugging](./debugging.md)
- 2.46 [Development Environment](./local-development.md)
- 2.47 [Memory Usage](./memory-usage.md)
- 2.48 [Instrumentation](./instrumentation.md)
- 2.49 [OpenTelemetry](./open-telemetry.md)

### 빌드·번들링

- 2.50 [Building](./building.md)
- 2.51 [Package Bundling](./package-bundling.md)
- 2.52 [Custom Server](./custom-server.md)

### 배포·운영

- 2.53 [Production](./production-checklist.md)
- 2.54 [Self-Hosting](./self-hosting.md)
- 2.55 [Deploying to Platforms](./deploying-to-platforms.md)
- 2.56 [Static Exports](./static-exports.md)
- 2.57 [Public pages](./public-static-pages.md)
- 2.58 [PPR Platform Guide](./ppr-platform-guide.md)

### 분석·기타

- 2.59 [Analytics](./analytics.md)
- 2.60 [Videos](./videos.md)

### AI 도구

- 2.61 [AI Coding Agents](./ai-agents.md)
- 2.62 [Next.js MCP Server](./mcp.md)

### 마이그레이션·업그레이드

- 2.63 [Migrating](./2.63-migrating/README.md)
- 2.64 [Upgrading](./2.64-upgrading/README.md)

## 문서 작성 규칙

- 각 가이드는 문제 상황, 선택 기준, 예제, 시각적 확인 방법 순으로 설계합니다.
- 위 순번은 테마 그룹 단위로 재배열한 학습 순서입니다. 그룹 내부에서 항목 간 뚜렷한 선후 관계가 없는 경우(예: Testing, Migrating, Upgrading 하위 항목)는 공식 문서 순서를 유지합니다.
