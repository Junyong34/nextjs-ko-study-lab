# Phase 2. Guides 데모 상세 기획서 (69개 데모)

- 대상 카테고리: `2-guides` (총 73편 중 데모 대상 40편)
- 총 예상 데모 수: **69개** (`demo-baseline`: 54개, `demo-cache-components`: 13개, `demo-export`: 2개)
- 상위 로드맵: [데모 계획 README.md](./README.md)

---

## 주요 그룹별 목차 및 데모 정의

### 1. 핵심 렌더링 & 캐싱 모델
- **2.1 [Rendering Philosophy](../../../nextjs-docs/2-guides/rendering-philosophy.md)** (2개): 서버 렌더링 vs 클라이언트 렌더링 생명주기 및 하이드레이션 시점 대조
- **2.2 [Server and Client Boundary](../../../nextjs-docs/2-guides/server-and-client-boundary.md)** (2개): 'use client' 하위 자동 번들링 및 Server Component 슬롯(children) 주입 패턴
- **2.3 [How Revalidation Works](../../../nextjs-docs/2-guides/how-revalidation-works.md)** (2개, Zone: cache): stale-while-revalidate 백그라운드 갱신 및 온디맨드 시차 관찰
- **2.4 [Caching (Previous Model)](../../../nextjs-docs/2-guides/caching-without-cache-components.md)** (2개): Next 14 레거시 fetch cache vs Route Segment revalidate
- **2.5 [Streaming](../../../nextjs-docs/2-guides/streaming.md)** (2개): 상품 상세 즉시 렌더 + 구매 후기/추천 Suspense 점진적 청크 스트리밍

### 2. 캐싱·revalidation 심화
- **2.6 [ISR](../../../nextjs-docs/2-guides/incremental-static-regeneration.md)** (2개): 60초 주기 상품 상세 ISR 및 revalidatePath 즉시 갱신
- **2.7 [ISR with Cache Components](../../../nextjs-docs/2-guides/incremental-static-regeneration-cache-components.md)** (2개, Zone: cache): use cache + cacheLife('hours') 및 cacheTag 초정밀 온디맨드 무효화
- **2.8 [Migrating to Cache Components](../../../nextjs-docs/2-guides/migrating-to-cache-components.md)** (2개, Zone: cache): unstable_cache -> use cache 전환 대조
- **2.9 [Adopting Partial Prefetching](../../../nextjs-docs/2-guides/adopting-partial-prefetching.md)** (1개): 링크 호버 시 정적 셸만 사전 패칭
- **2.10 [Authentication with Cache Components](../../../nextjs-docs/2-guides/authentication-with-cache-components.md)** (2개, Zone: cache): 정적 캐시 상품 레이아웃 + Context use(UserContext) 클라이언트 세션 스트리밍

### 3. 데이터·폼 & 클라이언트 패칭
- **2.13 [Forms](../../../nextjs-docs/2-guides/forms.md)** (2개): useActionState 필드 에러 표시 및 useFormStatus pending 스피너
- **2.14 [Server Actions](../../../nextjs-docs/2-guides/server-actions.md)** (3개): 1) 기본 폼 처리(완료), 2) startTransition 프로그래밍 호출, 3) useOptimistic 장바구니
- **2.15.1 [SWR](../../../nextjs-docs/2-guides/2.15-client-side-data-fetching/swr.md)** (2개): 실시간 배송 조회 자동 폴링 및 mutate() 낙관적 갱신
- **2.15.2 [TanStack Query](../../../nextjs-docs/2-guides/2.15-client-side-data-fetching/tanstack-query.md)** (2개): 상품 목록 무한 스크롤(useInfiniteQuery) 및 prefetchQuery 서버 하이드레이션
- **2.16 [Redirecting](../../../nextjs-docs/2-guides/redirecting.md)** (2개): 결제 성공 redirect('/order/complete') 및 세션 만료 redirect(with returnUrl)
- **2.17 [Draft Mode](../../../nextjs-docs/2-guides/draft-mode.md)** (2개): 미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키 확인

### 4. 내비게이션 & 체감 성능
- **2.18 [Prefetching](../../../nextjs-docs/2-guides/prefetching.md)** (2개): 뷰포트 진입 자동 prefetch vs prefetch={false} 호버 시점 패칭
- **2.19 [Optimizing prefetching](../../../nextjs-docs/2-guides/optimizing-prefetching.md)** (1개): 대규모 카탈로그에서 불필요한 prefetch 차단 및 대역폭 최적화
- **2.20 [Instant navigation](../../../nextjs-docs/2-guides/instant-navigation.md)** (2개): loading.tsx 스켈레톤 및 Router Cache 뒤로가기 즉각 렌더링
- **2.21 [Lazy Loading](../../../nextjs-docs/2-guides/lazy-loading.md)** (2개): next/dynamic 무거운 매출 차트 및 결제 모달 동적 import
- **2.22 [Preserving UI state](../../../nextjs-docs/2-guides/preserving-ui-state.md)** (2개): 카테고리 전환 시 장바구니 Drawer 열림 유지 및 searchParams 필터 스크롤 보존
- **2.23 [Preventing Flash](../../../nextjs-docs/2-guides/preventing-flash-before-hydration.md)** (1개): 다크모드 SSR 인라인 스크립트 FOUC 방지
- **2.24 [View transitions](../../../nextjs-docs/2-guides/view-transitions.md)** (1개): 썸네일 -> 상세 이미지 View Transitions 확대 애니메이션

### 5. 스타일링, 보안 및 확장 패턴
- **2.25 [CSS-in-JS](../../../nextjs-docs/2-guides/css-in-js.md)** (1개): Style Registry를 통한 CSS-in-JS SSR 스타일 주입
- **2.26 [Sass](../../../nextjs-docs/2-guides/sass.md)** (1개): Sass 변수/mixin 활용 프로모션 배너 스타일링
- **2.28 [Authentication](../../../nextjs-docs/2-guides/authentication.md)** (3개): 1) 쿠키 세션 로그인/로그아웃, 2) Middleware 가드, 3) RSC 세션 렌더링
- **2.29 [Data Security](../../../nextjs-docs/2-guides/data-security.md)** (2개): server-only 번들 차단 및 React Taint API 비밀 키 노출 방지
- **2.30 [Content Security Policy](../../../nextjs-docs/2-guides/content-security-policy.md)** (1개): Middleware Nonce 기반 CSP 헤더 주입 검증
- **2.31 [Environment Variables](../../../nextjs-docs/2-guides/environment-variables.md)** (2개): NEXT_PUBLIC_ vs 서버 환경변수 노출 범위 비교
- **2.32 [JSON-LD](../../../nextjs-docs/2-guides/json-ld.md)** (1개): Schema.org Product 구조화 데이터 스크립트 출력
- **2.33 [Interactive apps](../../../nextjs-docs/2-guides/interactive-apps.md)** (1개): 다중 필터/정렬/장바구니 복합 인터랙티브 위젯
- **2.34 [Scripts](../../../nextjs-docs/2-guides/scripts.md)** (2개): next/script strategy 로드 순서 및 외부 PG사 SDK onLoad
- **2.35 [MDX](../../../nextjs-docs/2-guides/mdx.md)** (2개): 상품 기술 문서 MDX 렌더링 및 내부 커스텀 이커머스 컴포넌트 합성
- **2.36 [Third Party Libraries](../../../nextjs-docs/2-guides/third-party-libraries.md)** (2개): @next/third-parties Google Analytics 및 YouTube 최적화

### 6. 앱 아키텍처 패턴 & 운영
- **2.37 [Backend for Frontend](../../../nextjs-docs/2-guides/backend-for-frontend.md)** (2개): Route Handler를 통한 레거시 주문/재고 API 취합 가공 (BFF)
- **2.39 [PWAs](../../../nextjs-docs/2-guides/progressive-web-apps.md)** (1개): 쇼핑몰 홈 화면 추가(PWA) 프롬프트 및 웹 매니페스트 검증
- **2.41 [Internationalization](../../../nextjs-docs/2-guides/internationalization.md)** (2개): 다국어 서브패스 라우팅 (/[lang]/products) 및 사전 JSON 번역
- **2.42 [Multi-tenant](../../../nextjs-docs/2-guides/multi-tenant.md)** (2개): 요청 서브도메인 기반 테넌트 분기 및 브랜드 테마/로고 동적 렌더링
- **2.43 [Multi-zones](../../../nextjs-docs/2-guides/multi-zones.md)** (2개): 셸에서 데모 zone으로의 rewrites 라우팅 및 독립 번들 로드 검증
- **2.48 [Instrumentation](../../../nextjs-docs/2-guides/instrumentation.md)** (1개): 서버 부팅 register() 실행 로그
- **2.49 [OpenTelemetry](../../../nextjs-docs/2-guides/open-telemetry.md)** (1개): Trace ID 발급 및 서버 컴포넌트 렌더링 Span 관찰
- **2.56 [Static Exports](../../../nextjs-docs/2-guides/static-exports.md)** (2개, Zone: export): output: 'export' 빌드 산출물 및 클라이언트 라우팅 검증
- **2.57 [Public pages](../../../nextjs-docs/2-guides/public-static-pages.md)** (1개): 이용약관 정적 SSG 페이지 생성 및 캐시 검증
- **2.59 [Analytics](../../../nextjs-docs/2-guides/analytics.md)** (1개): 페이지 전환 및 상품 클릭 커스텀 이벤트 비콘 전송
- **2.60 [Videos](../../../nextjs-docs/2-guides/videos.md)** (1개): 상품 홍보 영상 지연 로딩 및 뷰포트 자동 재생
