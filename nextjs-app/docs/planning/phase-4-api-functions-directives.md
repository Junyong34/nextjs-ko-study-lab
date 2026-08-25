# Phase 4. Functions & Directives 데모 상세 기획서 (63개 데모)

- 대상 카테고리: `3.3-functions` (41편 중 29편) & `3.4-directives` (5편 중 5편)
- 총 예상 데모 수: **63개** (`demo-baseline`: 43개, `demo-cache-components`: 20개)
- 상위 로드맵: [데모 계획 README.md](./README.md)

---

## 1. Functions (29편, 55개 데모)

### 핵심 대표 네비게이션 훅 (4편, 6개 데모)
- **3.3.1 [useRouter](../../../nextjs-docs/3-api-reference/3.3-functions/use-router.md)** (2개): push/replace/back 이동 및 `router.refresh()` 서버 상태 강제 동기화
- **3.3.2 [usePathname](../../../nextjs-docs/3-api-reference/3.3-functions/use-pathname.md)** (1개): 활성 카테고리 네비게이션 링크 하이라이트
- **3.3.3 [useParams](../../../nextjs-docs/3-api-reference/3.3-functions/use-params.md)** (1개): Client Component에서 동적 `[category]/[id]` 파라미터 추출
- **3.3.4 [useSearchParams](../../../nextjs-docs/3-api-reference/3.3-functions/use-search-params.md)** (2개): URL 필터 쿼리 파싱 및 useTransition 연동 디바운스 검색어 동기화

### 캐시 & Revalidation 함수 (8편, 13개 데모, Zone: cache)
- **3.3.13 [cacheLife](../../../nextjs-docs/3-api-reference/3.3-functions/cacheLife.md)** (2개): built-in 프로파일 수명 주기 및 custom cacheLife 프로파일 바인딩
- **3.3.14 [cacheTag](../../../nextjs-docs/3-api-reference/3.3-functions/cacheTag.md)** (2개): 다중 태그 부여 및 태그 만료 시 연관 캐시 동시 무효화
- **3.3.15 [unstable_cache](../../../nextjs-docs/3-api-reference/3.3-functions/unstable_cache.md)** (1개): 외부 ORM/DB 조회 함수 캐싱 및 태그 무효화
- **3.3.16 [unstable_noStore](../../../nextjs-docs/3-api-reference/3.3-functions/unstable_noStore.md)** (1개): 동적 렌더링 명시적 Bailout
- **3.3.17 [revalidatePath](../../../nextjs-docs/3-api-reference/3.3-functions/revalidatePath.md)** (2개): 페이지 경로 vs 레이아웃 레벨 일괄 무효화
- **3.3.18 [revalidateTag](../../../nextjs-docs/3-api-reference/3.3-functions/revalidateTag.md)** (2개): 기본 무효화 vs max 즉시 만료
- **3.3.19 [updateTag](../../../nextjs-docs/3-api-reference/3.3-functions/updateTag.md)** (1개): 서버 라운드트립 없는 캐시 엔트리 즉시 메모리 갱신
- **3.3.9 [fetch](../../../nextjs-docs/3-api-reference/3.3-functions/fetch.md)** (2개): Next 확장 fetch 옵션(revalidate, tags) 및 no-store 오버라이드

### 서버 컨텍스트 & 제어 흐름 함수 (17편, 36개 데모)
- **3.3.10 [cookies](../../../nextjs-docs/3-api-reference/3.3-functions/cookies.md)** (2개): RSC 세션 쿠키 읽기 및 Server Action 세션 발급/삭제
- **3.3.11 [headers](../../../nextjs-docs/3-api-reference/3.3-functions/headers.md)** (2개): User-Agent 기기 식별 및 커스텀 인증 헤더 파싱
- **3.3.12 [draftMode](../../../nextjs-docs/3-api-reference/3.3-functions/draft-mode.md)** (2개): 특가 상품 미리보기 활성화/비활성화 및 Bypass 쿠키 검증
- **3.3.22 [after](../../../nextjs-docs/3-api-reference/3.3-functions/after.md)** (2개): 주문 완료 후 백그라운드 집계 실행 및 응답 지연 제로 실증
- **3.3.23 [notFound](../../../nextjs-docs/3-api-reference/3.3-functions/not-found.md)** (1개): notFound() 호출을 통한 404 트리거
- **3.3.24 [forbidden](../../../nextjs-docs/3-api-reference/3.3-functions/forbidden.md)** (1개): forbidden() 호출을 통한 403 트리거
- **3.3.25 [unauthorized](../../../nextjs-docs/3-api-reference/3.3-functions/unauthorized.md)** (1개): unauthorized() 호출을 통한 401 트리거
- **3.3.26 [redirect](../../../nextjs-docs/3-api-reference/3.3-functions/redirect.md)** (2개): Server Action 303 리다이렉트 vs Route Handler 307 리다이렉트
- **3.3.27 [permanentRedirect](../../../nextjs-docs/3-api-reference/3.3-functions/permanentRedirect.md)** (1개): 영구 URL 변경을 위한 308 permanentRedirect
- **3.3.31 [NextRequest](../../../nextjs-docs/3-api-reference/3.3-functions/next-request.md)** (1개): IP, Geo, Cookies, NextUrl 파싱
- **3.3.32 [NextResponse](../../../nextjs-docs/3-api-reference/3.3-functions/next-response.md)** (2개): JSON 응답 생성 및 NextResponse.rewrite() 가상 라우팅
- **3.3.33 [ImageResponse](../../../nextjs-docs/3-api-reference/3.3-functions/image-response.md)** (2개): JSX -> PNG 동적 이미지 생성 및 가격표 배너 렌더링
- **3.3.35 [generateMetadata](../../../nextjs-docs/3-api-reference/3.3-functions/generate-metadata.md)** (2개): 동적 상품 SEO 메타태그 생성 및 부모 메타데이터 상속
- **3.3.38 [generateStaticParams](../../../nextjs-docs/3-api-reference/3.3-functions/generate-static-params.md)** (2개): 인기 상품 사전 SSG 빌드 생성 및 다중 파라미터 조합

---

## 2. Directives (5편, 8개 데모)

- **3.4.1 [use client](../../../nextjs-docs/3-api-reference/3.4-directives/use-client.md)** (2개): 클라이언트 경계 선언, 브라우저 이벤트 바인딩 및 Window API 접근
- **3.4.2 [use server](../../../nextjs-docs/3-api-reference/3.4-directives/use-server.md)** (2개): 파일 모듈 Server Action vs 인라인 Server Action 클로저
- **3.4.3 [use cache](../../../nextjs-docs/3-api-reference/3.4-directives/use-cache.md)** (2개, Zone: cache): 함수 단위 캐싱 vs 컴포넌트 JSX 렌더 결과 캐싱
- **3.4.4 [use cache: private](../../../nextjs-docs/3-api-reference/3.4-directives/use-cache-private.md)** (1개, Zone: cache): 개인화 주문 내역 private 캐시 격리
- **3.4.5 [use cache: remote](../../../nextjs-docs/3-api-reference/3.4-directives/use-cache-remote.md)** (1개, Zone: cache): 원격 Redis/KV 분산 캐시 계층 연동
