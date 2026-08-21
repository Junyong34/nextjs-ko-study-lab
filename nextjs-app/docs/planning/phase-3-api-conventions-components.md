# Phase 3. File Conventions & Components 데모 상세 기획서 (53개 데모)

- 대상 카테고리: `3.1-file-conventions` (26편 중 26편) & `3.2-components` (5편 중 5편)
- 총 예상 데모 수: **53개** (`demo-baseline`: 53개)
- 상위 로드맵: [데모 계획 README.md](./README.md)

---

## 1. File Conventions (26편, 41개 데모)

### 라우팅 & 레이아웃 특수 파일
- **3.1.1 [layout.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/layout.md)** (3개): 1) 루트/중첩 레이아웃, 2) 클라이언트 상태 보존, 3) 동적 `[category]/layout.tsx`
- **3.1.2 [page.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/page.md)** (2개): 1) 정적/동적 세그먼트 렌더링, 2) React 19 `use(params)` & `use(searchParams)` 언래핑
- **3.1.3 [loading.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/loading.md)** (2개): 1) 상품 상세 스켈레톤 자동 래핑, 2) 중첩 라우트 세그먼트 로딩
- **3.1.4 [error.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/error.md)** (2개): 1) 결제 세그먼트 에러 캡처, 2) `reset()` 컴포넌트 재시도 복구
- **3.1.5 [not-found.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/not-found.md)** (2개): 1) 미등록 상품 ID 요청 404, 2) `notFound()` 프로그래밍 트리거
- **3.1.6 [template.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/template.md)** (2개): 1) 페이지 이동 시 컴포넌트 인스턴스 재생성, 2) 진입 애니메이션 및 폼 리셋
- **3.1.7 [default.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/default.md)** (2개): 1) Parallel Routes 미매칭 시 default.js 렌더링, 2) 새로고침 시 슬롯 복구
- **3.1.8 [route.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/route.md)** (3개): 1) REST GET/POST API, 2) Webhook 서명 검증, 3) SSE 실시간 재고 스트리밍
- **3.1.9 [Route Groups](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/route-groups.md)** (2개): 1) URL 영향 없는 그룹 분리, 2) 상점용 vs 관리자용 다중 루트 레이아웃
- **3.1.10 [Dynamic Segments](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/dynamic-routes.md)** (3개): 1) `[id]` 단일, 2) `[...slug]` Catch-all, 3) `[[...slug]]` Optional Catch-all
- **3.1.11 [Parallel Routes](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/parallel-routes.md)** (3개): 1) `@analytics` / `@team` 다중 슬롯 병렬 렌더링, 2) 권한별 조건부 분기, 3) 독립 탭 네비게이션
- **3.1.12 [Intercepting Routes](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/intercepting-routes.md)** (2개): 1) 상품 목록 모달 인터셉트 `(..)products/[id]`, 2) 직접 진입 시 전체 독립 페이지
- **3.1.15 [mdx-components.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/mdx-components.md)** (1개): 글로벌 MDX 스타일 및 커스텀 컴포넌트 매핑
- **3.1.16 [instrumentation.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/instrumentation.md)** (1개): 서버 부팅 register() 훅 로그
- **3.1.17 [instrumentation-client.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/instrumentation-client.md)** (1개): 클라이언트 런타임 성능 측정 훅
- **3.1.18 [proxy.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/proxy.md)** (1개): 내부 마이크로서비스 API 프록시 라우팅
- **3.1.19 [forbidden.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/forbidden.md)** (1개): 비관리자 권한 차단 403 화면
- **3.1.20 [unauthorized.js](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/unauthorized.md)** (1개): 미인증 세션 401 로그인 요구 화면

### 메타데이터 & Route Segment Config
- **3.1.21.1 [app-icons](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md)** (1개): icon.tsx / apple-icon.tsx 동적 파비콘 생성
- **3.1.21.2 [manifest.json](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md)** (1개): manifest.ts 동적 매니페스트 출력
- **3.1.21.3 [opengraph-image](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md)** (2개): 동적 OG 이미지 생성 및 ImageResponse 실시간 할인율 렌더링
- **3.1.21.4 [robots.txt](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.21-metadata/robots.md)** (1개): robots.ts 동적 크롤링 규칙 생성
- **3.1.21.5 [sitemap.xml](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.21-metadata/sitemap.md)** (2개): 동적 sitemap.xml 생성 및 generateSitemaps 대규모 인덱스 분할
- **3.1.22.1 [dynamicParams](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/dynamicParams.md)** (1개): true(동적 생성) vs false(미등록 상품 404 리턴)
- **3.1.22.2 [instant](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/instant.md)** (1개): 세그먼트 즉시 프리패칭 캐시 동작 관찰
- **3.1.22.3 [maxDuration](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/maxDuration.md)** (1개): 주문 정산 배치 함수 실행 시간 제한
- **3.1.22.4 [prefetch](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/prefetch.md)** (1개): 세그먼트 레벨 프리패칭 제어
- **3.1.22.5 [runtime](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/runtime.md)** (2개): nodejs vs edge 런타임 응답 속도 및 사용 가능 API 대조

---

## 2. Components (5편, 12개 데모)

- **3.2.1 [Image Component](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.2-components/image.md)** (3개): 1) responsive fill & sizes, 2) placeholder='blur', 3) quality & priority
- **3.2.2 [Link Component](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.2-components/link.md)** (2개): 1) 기본 소프트 네비게이션 & scroll 제어, 2) prefetch 옵션 대조
- **3.2.3 [Font](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.2-components/font.md)** (2개): 1) Google Fonts 가변 폰트 CSS 변수, 2) 로컬 폰트 fallback 매핑
- **3.2.4 [Script Component](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.2-components/script.md)** (2개): 1) 로드 전략(beforeInteractive/afterInteractive/lazyOnload), 2) 외부 PG사 결제 SDK onLoad 핸들링
- **3.2.5 [Form Component](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/3.2-components/form.md)** (3개): 1) GET 검색 searchParams 자동 동기화, 2) POST Server Action 바인딩, 3) 폼 제출 pending 상태
