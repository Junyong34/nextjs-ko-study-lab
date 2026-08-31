# 데모 검증 인벤토리 — B06–B10 (데모 51–100)

[전체 인덱스](./demo-verification-inventory.md)로 돌아가기. 이 문서는 데모 51-100번(B06-B10)의 상세 기록만 담는다. 전체 집계와 데모 목록 요약표는 인덱스 문서를 참고한다.

## 데모별 상세 기록

### 51. guides/redirecting/order-complete — Server Action 내 redirect()를 통한 주문 완료 화면 이동
- **기본 정보**: zone: `baseline`, 근거: `2-guides/redirecting.md`, 진입점: `.../guides/redirecting/order-complete/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: Step 1 결제 버튼 클릭 시 실제 `redirect()` 없이 문자열 상태만 갱신됨 (`D02`).
- **검증 항목**: (1) `next/navigation` `redirect()` 호출 (`fail`), (2) 303/307 리다이렉트 발생 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 Server Action 내 `redirect('/zone/baseline/...')` 실행 및 리다이렉트 경로 검증 패널 연결 필요.

---

### 52. guides/draft-mode/preview-toggle — 미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키
- **기본 정보**: zone: `baseline`, 근거: `2-guides/draft-mode.md`, 진입점: `.../guides/draft-mode/preview-toggle/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 토글 끄기.
- **가이드 실행**: 토글 버튼 클릭 시 `useState(false)`만 반전되고 `draftMode().enable()`이나 쿠키 설정이 없음 (`D02`).
- **검증 항목**: (1) `draftMode()` 활성화 (`fail`), (2) `__prerender_bypass` 쿠키 생성 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01, G03), 데모(예, high, D02, D03), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: Route Handler를 통한 실제 Draft Mode 활성화/비활성화 및 쿠키 검증으로 개선.

---

### 53. guides/prefetching/viewport-vs-hover — 뷰포트 진입 자동 prefetch vs prefetch={false} 호버 시점 패칭
- **기본 정보**: zone: `baseline`, 근거: `2-guides/prefetching.md`, 진입점: `.../guides/prefetching/viewport-vs-hover/page.tsx`, 대표후보: 외부 도구·환경 확인, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 마우스 호버 시 실제 `<Link>` 프리페치가 아니라 `div onMouseEnter`로 가짜 로그가 쌓임 (`D02`).
- **검증 항목**: (1) `<Link prefetch={false}>` 실제 렌더링 (`fail`), (2) Network 패널 프리페치 요청 발생 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01, G02), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 Next.js Link 태그를 배치하고 개발/프로덕션 프리페치 차이를 명시.

---

### 54. file-conventions/layout/root-and-nested — 루트 레이아웃(Root Layout) 및 카테고리 중첩 레이아웃
- **기본 정보**: zone: `baseline`, 근거: `3-api-reference/3.1-file-conventions/layout.md`, 진입점: `.../file-conventions/layout/root-and-nested/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 탭 초기화.
- **가이드 실행**: 중첩 라우트 폴더가 없고 단일 컴포넌트 안에서 `useState` 탭으로 레이아웃을 흉내 냄 (`D02`).
- **검증 항목**: (1) 실제 중첩 `layout.tsx` 파일 분리 (`fail`), (2) 탭 전환 시 상위 레이아웃 상태 보존 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: `category/[slug]` 서브 라우트 구조로 실제 중첩 레이아웃 파일 분리 필요.

---

### 55. file-conventions/loading/skeleton-boundary — loading.tsx 스켈레톤 UI 자동 래핑 및 Suspense
- **기본 정보**: zone: `baseline`, 근거: `3-api-reference/3.1-file-conventions/loading.md`, 진입점: `.../file-conventions/loading/skeleton-boundary/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 상위 복귀.
- **가이드 실행**: `slow-catalog` 진입 시 `loading.tsx`가 1.2초간 정상 노출되고 본문으로 전환됨 (실행 정상).
- **검증 항목**: (1) `slow-catalog/loading.tsx` 정상 동작 (`pass`), (2) 1.2초 지연 후 본문 스트리밍 완료 (`pass`), (3) 검증 패널 연동 (`fail` - props 미전달).
- **수정 판정**: 가이드(아니오, none), 데모(아니오, none), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: **골든 샘플 후보**. 데모 서브 라우트 구현은 완벽하나 검증 패널에 진입/스트리밍 완료 상태 전달 필요.

---

### 56. file-conventions/not-found/missing-product-404 — not-found.tsx 및 notFound() 프로그래밍 404 트리거
- **기본 정보**: zone: `baseline`, 근거: `3-api-reference/3.1-file-conventions/not-found.md`, 진입점: `.../file-conventions/not-found/missing-product-404/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 목록 복귀.
- **가이드 실행**: `/items/PROD-101`(정상) 및 `/items/PROD-999` 진입 시 `not-found.tsx`가 정상 마운트됨 (실행 정상).
- **검증 항목**: (1) `notFound()` 404 바운더리 렌더링 (`pass`), (2) Next 15+ `await params` 준수 (`pass`), (3) 메인 검증 패널 연동 (`fail` - props 미전달).
- **수정 판정**: 가이드(아니오, none), 데모(아니오, none), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: **골든 샘플 후보**. dynamic route와 not-found.tsx가 모범 구현되어 있음. 메인 페이지 검증 패널 연동만 보강.

---

### 57. components/image/responsive-sizes — next/image responsive fill & sizes 속성 반응형 로딩
- **기본 정보**: zone: `baseline`, 근거: `3-api-reference/3.2-components/image.md`, 진입점: `.../components/image/responsive-sizes/page.tsx`, 대표후보: 외부 도구·환경 확인, 결과: `mismatch`, 초기화: 뷰포트 초기화.
- **가이드 실행**: `next/image` 없이 `useState` 버튼으로 "42 KB (WebP)" 하드코딩 텍스트만 표시 (`D02`, `V01`).
- **검증 항목**: (1) `next/image` 컴포넌트 렌더링 (`fail`), (2) `sizes` 속성 기반 `srcset` 생성 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01, G02), 데모(예, high, D02, D03), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 `next/image`를 사용하고 컨테이너 너비 변화에 따른 `currentSrc`를 관찰하도록 재구현.

---

### 58. guides/rendering-philosophy/hydration-boundary — 하이드레이션 경계와 번들 격리
- **기본 정보**: zone: `baseline`, 근거: `2-guides/rendering-philosophy.md`, 진입점: `.../guides/rendering-philosophy/hydration-boundary/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 버튼 클릭 시 `setMounted(true)`로 텍스트만 바꿈 (`D02`).
- **검증 항목**: (1) 서버 HTML vs 클라이언트 인터랙션 분리 (`fail`), (2) 번들 크기 격리 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 실제 서버 컴포넌트 트리와 하위 `'use client'` 인터랙티브 슬롯으로 물리적 분리.

---

### 59. guides/server-and-client-boundary/props-serialization — Props 직렬화 경계 및 안전한 전달
- **기본 정보**: zone: `baseline`, 근거: `2-guides/server-and-client-boundary.md`, 진입점: `.../guides/server-and-client-boundary/props-serialization/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 클라이언트 컴포넌트 내부에서 `const data = {...}`를 선언해 `JSON.stringify` 출력 (`D02`).
- **검증 항목**: (1) Server-to-Client props 전달 (`fail`), (2) 함수/비직렬화 객체 전달 시 빌드 에러 검증 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 서버 컴포넌트(`page.tsx`)에서 직렬화 가능한 props를 클라이언트 컴포넌트로 전달하는 구조로 개편.

---

### 60. guides/how-revalidation-works/ondemand-sync — 온디맨드 캐시 무효화 및 즉시 동기화
- **기본 정보**: zone: `cache`, 근거: `2-guides/how-revalidation-works.md`, 진입점: `.../guides/how-revalidation-works/ondemand-sync/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 버튼 클릭 시 Server Action이 `revalidateTag('products', 'max')`를 호출하나 타깃 함수에 `'use cache'`가 없음 (`D02`).
- **검증 항목**: (1) `revalidateTag` 호출 (`pass`), (2) 실제 Cache Components 캐시 만료 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(아니오, none), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: `getCachedProducts()`에 실제 `'use cache'`와 `cacheTag('products')`를 부착하여 정합성 완성.

---

### 61. guides/caching-legacy/segment-revalidate — Route Segment revalidate 설정
- **기본 정보**: zone: `baseline`, 근거: `2-guides/caching-without-cache-components.md`, 진입점: `.../guides/caching-legacy/segment-revalidate/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: `SegmentRevalidateDemo.tsx`는 단순 수량 증감 및 mock 로그 출력만 수행 (`D02`).
- **검증 항목**: (1) `export const revalidate = 10` 설정 (`fail`), (2) 10초 주기 ISR 캐시 갱신 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01, G02), 데모(예, high, D02, D03), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 실제 세그먼트 레벨 `revalidate` 설정이 적용된 페이지로 전면 재작성.

---

### 62. guides/isr/revalidate-path-sync — revalidatePath를 통한 라우트 전체 즉시 동기화
- **기본 정보**: zone: `baseline`, 근거: `2-guides/incremental-static-regeneration.md`, 진입점: `.../guides/isr/revalidate-path-sync/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: `executeRevalidatePathAction`이 실제 `revalidatePath(targetPath)`를 정상 호출함 (실행 정상).
- **검증 항목**: (1) `revalidatePath` 호출 (`pass`), (2) 하위 세그먼트 일괄 만료 결과 반환 (`pass`), (3) 검증 패널 연동 (`fail` - props 미전달).
- **수정 판정**: 가이드(아니오, none), 데모(아니오, none), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: Server Action 자체는 완성되어 있으므로 검증 패널에 무효화 경로 및 세그먼트 목록 연결.

---

### 63. guides/isr-cache-components/precision-tag-purge — 초정밀 온디맨드 태그 무효화 (cacheTag)
- **기본 정보**: zone: `cache`, 근거: `2-guides/incremental-static-regeneration-cache-components.md`, 진입점: `.../guides/isr-cache-components/precision-tag-purge/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 버튼 클릭 시 `useState`로 문자열만 저장 (`D02`).
- **검증 항목**: (1) `cacheTag('product-101')` 선언 (`fail`), (2) `revalidateTag()` 호출 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 `'use cache'` 함수 2개에 각각 다른 `cacheTag`를 부여하고 타깃 태그만 무효화되는 데모로 재구현.

---

### 64. guides/migrating-cache-components/cache-key-compare — 캐시 키 생성 방식 비교 (수동 vs 자동)
- **기본 정보**: zone: `cache`, 근거: `2-guides/migrating-to-cache-components.md`, 진입점: `.../guides/migrating-cache-components/cache-key-compare/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 기본값 선택.
- **가이드 실행**: 옵션 변경 시 브라우저 JS 비트시프트 연산으로 AST 가짜 해시 생성 (`D02`).
- **검증 항목**: (1) 수동 키 직렬화 대조 (`pass`), (2) Next 16 AST 자동 해시 메커니즘 (`fail` - JS pseudo hash), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(아니오, none), 데모(예, medium, D02), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: UI 레이아웃은 훌륭함. Next 16 컴파일러 AST 해싱 원리를 정확히 안내하고 검증 패널에 직렬화 키 비교값 연결.

---

### 65. guides/auth-cache-components/private-cache-user — 개인화 사용자별 Private 캐시 격리
- **기본 정보**: zone: `cache`, 근거: `2-guides/authentication-with-cache-components.md`, 진입점: `.../guides/auth-cache-components/private-cache-user/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: user_A 선택.
- **가이드 실행**: `actions.ts`에 `'use cache'`가 없고 사용자별 하드코딩 객체를 반환 (`D02`).
- **검증 항목**: (1) 사용자 세션별 독립 캐시 키 분리 (`fail`), (2) 캐시 오염 방지 검증 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 실제 `'use cache'` 함수에 사용자 ID를 인자로 넘겨 인자별 자동 캐시 분리 실습으로 재작성.

---

### 66. guides/tanstack-query/ssr-hydration — TanStack Query prefetchQuery 서버 하이드레이션
- **기본 정보**: zone: `baseline`, 근거: `2-guides/2.15-client-side-data-fetching/tanstack-query.md`, 진입점: `.../guides/tanstack-query/ssr-hydration/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 카테고리 전체.
- **가이드 실행**: TanStack Query 임포트 없이 `useState`로 쿼리 상태를 모사하며 "0ms Zero Spinner" 주장 (`D02`, `V01`).
- **검증 항목**: (1) `HydrationBoundary` 및 `prefetchQuery` 사용 (`fail`), (2) 0ms 측정 근거 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 실제 QueryClient의 `prefetchQuery` + `<HydrationBoundary>` 구조로 전면 교체.

---

### 67. guides/redirecting/session-expired — 세션 만료 시 returnUrl과 함께 로그인 리다이렉트
- **기본 정보**: zone: `baseline`, 근거: `2-guides/redirecting.md`, 진입점: `.../guides/redirecting/session-expired/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 버튼 클릭 시 '307 Redirect 발동' 텍스트만 변경됨 (`D02`).
- **검증 항목**: (1) Server Action `redirect()` 호출 (`fail`), (2) URL 쿼리스트링 `returnUrl` 바인딩 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 Server Action에서 `redirect('/login?returnUrl=...')`을 실행하고 브라우저 URL 이동 검증.

---

### 68. guides/draft-mode/bypass-cookie — Bypass 쿠키 검증 및 CMS 초안 렌더링
- **기본 정보**: zone: `baseline`, 근거: `2-guides/draft-mode.md`, 진입점: `.../guides/draft-mode/bypass-cookie/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 토글 끄기.
- **가이드 실행**: `useState(false)` 토글로 UI 가격 텍스트만 바꿈 (`D02`).
- **검증 항목**: (1) `draftMode()` 쿠키 우회 검증 (`fail`), (2) CMS 초안 데이터 렌더링 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 쿠키 스토어의 `__prerender_bypass` 쿠키 유무에 따른 서버 렌더링 분기 데모로 개선.

---

### 69. guides/prefetching/custom-prefetch-false — prefetch={false} 명시적 프리패치 차단
- **기본 정보**: zone: `baseline`, 근거: `2-guides/prefetching.md`, 진입점: `.../guides/prefetching/custom-prefetch-false/page.tsx`, 대표후보: 외부 도구·환경 확인, 결과: `mismatch`, 초기화: prefetch={false} 선택.
- **가이드 실행**: `<Link prefetch={prefetchMode}>`를 렌더링하나 호버 시 가짜 로그를 추가 (`D02`).
- **검증 항목**: (1) `<Link prefetch={false}>` 렌더링 (`pass`), (2) 호버 시점 온디맨드 프리페치 확인 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, medium, G02), 데모(예, medium, D02), 검증(예, high, V01, V05), 개념(예, medium, C03).
- **종합 메모**: 브라우저 Network 탭에서 RSC 페이로드 수신 여부를 확인하는 안내와 검증 패널 연결.

---

### 70. guides/optimizing-prefetching/bandwidth-saver — 대규모 카탈로그 대역폭 절약 최적화
- **기본 정보**: zone: `baseline`, 근거: `2-guides/optimizing-prefetching.md`, 진입점: `.../guides/optimizing-prefetching/bandwidth-saver/page.tsx`, 대표후보: 산출물·설정 확인, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: 조작 요소 없는 정적 카드에 "95% 대역폭 절감" 텍스트만 표시 (`D01`, `D03`, `V01`).
- **검증 항목**: (1) 프리페치 최적화 전후 대역폭 측정 (`fail`), (2) 조작 인터랙션 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D01, D03), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 100개 상품 링크 목록에서 기본 프리페치 vs `prefetch={false}` 호버 프리페치의 실제 요청 수 비교 실습으로 전면 재설계.

---

### 71. guides/instant-navigation/loading-skeleton — Instant Navigation loading.tsx 스켈레톤 전환
- **기본 정보**: zone: `baseline`, 근거: `2-guides/instant-navigation.md`, 진입점: `.../guides/instant-navigation/loading-skeleton/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: [홈] 선택.
- **가이드 실행**: `useState`로 문자열 세그먼트명만 바꿈 (`D02`).
- **검증 항목**: (1) 실제 Instant Navigation 라우트 이동 (`fail`), (2) `loading.tsx` 스켈레톤 노출 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 실제 서브 라우트 간 `Link` 이동 및 스켈레톤 전환 데모로 재작성.

---

### 72. guides/instant-navigation/router-cache-back — Router Cache를 통한 뒤로가기 0ms 즉각 복구
- **기본 정보**: zone: `baseline`, 근거: `2-guides/instant-navigation.md`, 진입점: `.../guides/instant-navigation/router-cache-back/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 최신 단계 선택.
- **가이드 실행**: `useRouter`를 임포트했으나 `router.back()` 대신 로컬 배열 인덱스만 조작하고 "0ms 즉각 복구" 하드코딩 (`D02`, `V01`).
- **검증 항목**: (1) 실제 브라우저 히스토리 `router.back()` 호출 (`fail`), (2) Router Cache 적중 시 서버 요청 0건 검증 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, high, C01).
- **종합 메모**: 실제 3개 서브 페이지를 이동한 뒤 브라우저 뒤로가기 버튼/`router.back()`을 실행하여 Router Cache를 실증하도록 개편.

---

### 73. guides/lazy-loading/modal-dynamic — 결제 모달 next/dynamic 지연 로드
- **기본 정보**: zone: `baseline`, 근거: `2-guides/lazy-loading.md`, 진입점: `.../guides/lazy-loading/modal-dynamic/page.tsx`, 대표후보: 전후 변화, 결과: `mismatch`, 초기화: 모달 닫기.
- **가이드 실행**: `next/dynamic` 없이 `useState(false)` boolean 조건문으로 모달 표시 (`D02`).
- **검증 항목**: (1) `dynamic(() => import('./PaymentModal'))` 적용 (`fail`), (2) 클릭 시점 JS 번들 청크 다운로드 확인 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 별도 분리된 대용량 모달 컴포넌트를 `next/dynamic`으로 지연 로드하는 실습으로 개선.

---

### 74. guides/preserving-ui-state/drawer-open — 카테고리 전환 시 장바구니 Drawer 열림 유지
- **기본 정보**: zone: `baseline`, 근거: `2-guides/preserving-ui-state.md`, 진입점: `.../guides/preserving-ui-state/drawer-open/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 드로어 열림.
- **가이드 실행**: 카테고리 전환 라우트 없이 단순 드로어 열림/닫힘 토글 버튼만 있음 (`D02`).
- **검증 항목**: (1) 레이아웃 레벨 드로어 상태 보존 (`fail`), (2) 페이지 네비게이션 시 드로어 유지 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 레이아웃에 드로어를 두고 하위 서브 페이지 이동 시에도 드로어가 닫히지 않는 Partial Rendering 데모로 재구성.

---

### 75. guides/preserving-ui-state/scroll-retention — searchParams 필터 스크롤 위치 보존
- **기본 정보**: zone: `baseline`, 근거: `2-guides/preserving-ui-state.md`, 진입점: `.../guides/preserving-ui-state/scroll-retention/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: [최신순] 선택.
- **가이드 실행**: URL 변경 없이 `useState`로 정렬 문자열만 변경 (`D02`).
- **검증 항목**: (1) `router.push('?sort=...', { scroll: false })` 실행 (`fail`), (2) 스크롤 위치 고정 검증 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: 긴 목록 페이지에서 searchParams 변경 시 `scroll: false` 옵션에 따른 스크롤 유지 데모로 재구현.

---

### 76. guides/preventing-flash/darkmode-script — 다크모드 SSR 인라인 스크립트 FOUC 방지
- **기본 정보**: zone: `baseline`, 근거: `2-guides/preventing-flash-before-hydration.md`, 진입점: `.../guides/preventing-flash/darkmode-script/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 다크 테마 선택.
- **가이드 실행**: `useState` 테마 토글 및 인라인 스크립트 텍스트 출력 (`D02`).
- **검증 항목**: (1) HTML `<head>` 내 차단 인라인 스크립트 실행 (`fail`), (2) FOUC 방지 검증 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: `layout.tsx`의 `<head>`에 테마 주입 스크립트를 삽입하고 새로고침 시 깜빡임 없는 테마 적용 실습으로 개편.

---

### 77. guides/view-transitions/zoom-card — View Transitions 이미지 확대 애니메이션
- **기본 정보**: zone: `baseline`, 근거: `2-guides/view-transitions.md`, 진입점: `.../guides/view-transitions/zoom-card/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 썸네일 뷰 선택.
- **가이드 실행**: CSS height 트랜지션 클래스만 토글 (`D02`).
- **검증 항목**: (1) `document.startViewTransition()` 또는 React 19 View Transitions 호출 (`fail`), (2) `view-transition-name` 바인딩 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: React 19 / 브라우저 View Transitions API를 호출하는 실제 애니메이션 데모로 개선.

---

### 78. guides/css-in-js/style-registry — Style Registry를 통한 CSS-in-JS SSR 스타일 주입
- **기본 정보**: zone: `baseline`, 근거: `2-guides/css-in-js.md`, 진입점: `.../guides/css-in-js/style-registry/page.tsx`, 대표후보: 산출물·설정 확인, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: `<style>` 태그 문자열만 정적으로 렌더링 (`D01`, `D02`, `D03`).
- **검증 항목**: (1) `useServerInsertedHTML` 스타일 레지스트리 래퍼 동작 (`fail`), (2) SSR HTML 내 스타일 태그 주입 확인 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D01, D02), 검증(예, high, V01, V05), 개념(예, medium, C01).
- **종합 메모**: `useServerInsertedHTML` 훅을 사용한 실제 StyleRegistry 클라이언트 컴포넌트 실습으로 작성.

---

### 79. guides/sass/promotions-theme — Sass 변수/mixin 활용 프로모션 스타일링
- **기본 정보**: zone: `baseline`, 근거: `2-guides/sass.md`, 진입점: `.../guides/sass/promotions-theme/page.tsx`, 대표후보: 화면 관찰, 결과: `mismatch`, 초기화: 새 URL.
- **가이드 실행**: **중대 오류 — 61번 데모(`SegmentRevalidateDemo.tsx`) 코드가 그대로 복제되어 주문 수량 카운터가 노출됨** (`D01`, `D02`, `D03`).
- **검증 항목**: (1) Sass `.scss` / `.module.scss` 변수/mixin 스타일링 적용 (`fail`), (2) 가이드와 일치하는 테마 조작 (`fail`), (3) 검증 패널 연동 (`fail`).
- **수정 판정**: 가이드(예, high, G01), 데모(예, high, D01, D02, D03), 검증(예, high, V01, V05), 개념(예, high, C02).
- **종합 메모**: **긴급 전면 재작성 대상**. 복제된 잘못된 컴포넌트를 제거하고 실제 `.module.scss`를 활용한 Sass 테마 실습으로 교체.

---

### 80. guides/authentication/middleware-guard — Proxy/Middleware 기반 라우트 보호 가드
- **기본 정보**: zone: `baseline`, 근거: `2-guides/authentication.md`, 진입점: `.../guides/authentication/middleware-guard/page.tsx`, 대표후보: 값 비교, 결과: `mismatch`, 초기화: 쿠키 초기화.
- **가이드 실행**: `actions.ts`가 실제 `next/headers` `await cookies()`를 사용해 `auth_token`을 토글하고 경로 검사를 수행함. 단, 실제 미들웨어 요청 가로채기가 아닌 Server Action 내부 로직으로 판정함 (`D02`).
- **검증 항목**: (1) `cookies()` 조작 및 읽기 (`pass`), (2) 307 임시 리다이렉트 판정 결과 반환 (`pass`), (3) 미들웨어 런타임 가로채기 (`fail`), (4) 검증 패널 연동 (`fail` - props 미전달).
- **수정 판정**: 가이드(아니오, none), 데모(예, medium, D02), 검증(예, high, V01, V05), 개념(아니오, none).
- **종합 메모**: `actions.ts`의 쿠키 제어 로직은 매우 견고함. 실제 보호 라우트 네비게이션 시 미들웨어 가드가 동작하도록 개선하고 검증 패널에 `status`와 `decision` 연결.

---

---

### 81. guides/authentication/middleware-guard — Proxy/Middleware 기반 라우트 보호 가드

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/authentication.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/authentication/middleware-guard/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 / 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 또는 쿠키 토글로 초기화 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 현재 인증 쿠키 상태((없음)) 확인 | 초기 쿠키 상태 `(없음)` 확인 | 실습 영역 | 예 | 정상 렌더링 |
| 2 | [쿠키 토글] 버튼 클릭으로 auth_token=valid 발급 | `[쿠키 토글]` 클릭 | 실습 영역 | 예 | Server Action으로 쿠키 주입 |
| 3 | 미들웨어 가드 통과 및 보호 구역 인가 상태 관찰 | `/admin`, `/mypage/orders`, `/catalog` 선택 | 실습 영역 | 예 | 가상 판정 결과 출력 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 미들웨어 가드 실행 | 실제 Next.js `middleware.ts` 엣지 가드 인터셉트 | Server Action(`testMiddlewareRouteAccess`) 모사 실행 | 외부 도구·환경 확인 | 소스 코드 | `actions.ts` | 예 | fail |
| 2 | 검증 푸터 연동 | 쿠키 토글 및 라우트 판정 결과 실시간 반영 | props 누락으로 "인터랙션 대기 중" 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |
| 3 | 0ms 에지 차단 문구 | 실측 근거 제시 | 실측 없는 "0ms 에지 레벨" 과장 표현 | 값 비교 | 가이드 | `page.tsx` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 명확 |
| 데모 예제 | 예 | medium | D02, D03 | 실제 미들웨어 라우트 가드 및 리다이렉트 응답 헤더 신호 연동 |
| 검증 | 예 | high | V01, V03, V05 | `page.tsx`에서 `isMatched`, `actual` 상태 전달 |
| 개념 정리 | 예 | low | C01 | "0ms 에지 레벨" 단정 문구 조정 |

#### 증거 파일 및 종합 메모
- 소스: `actions.ts`, `MiddlewareGuardDemo.tsx`, `VerificationFooter.tsx`
- 종합 메모: Server Action 기반 쿠키 제어 구조는 완성도가 높으나, 검증 푸터 바인딩 누락 및 실제 `middleware.ts` 연동 부재.

---

### 82. guides/authentication/rsc-user-profile — Server Component 세션 프로필 렌더링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/authentication.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/authentication/rsc-user-profile/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 서버 렌더링 회원명(홍길동 VIP) 및 적립금(15,200 P) 확인 | 초기 프로필 카드 확인 | 실습 영역 | 예 | 서버 쿠키 기반 렌더링 |
| 2 | [VIP 세션] 또는 [일반 회원] 버튼 선택으로 세션 전환 | `[VIP 세션]` / `[일반 회원]` 클릭 | 실습 영역 | 예 | 클라이언트 `setProfile`로 덮어씀 |
| 3 | 쿠폰(3장) 및 등급 혜택의 100% 서버 사이드 렌더링 관찰 | 프로필 변경 결과 관찰 | 실습 영역 | 아니오 | 클라이언트 상태로 RSC 모사 (`D02`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | RSC 기반 프로필 렌더링 | 세션 전환 시 서버 컴포넌트 재렌더링 | `RscUserProfileDemo.tsx` 클라이언트 `useState`로 하드코딩 변경 | 값 비교 | 소스 코드 | `RscUserProfileDemo.tsx` | 예 | fail |
| 2 | 0 KB Client Bundle 주장 | 순수 RSC로 번들 JS 0 KB 달성 | `'use client'` 컴포넌트 내부에서 "Zero JS" 배지 표시 | 산출물·설정 확인 | 소스 코드 | `RscUserProfileDemo.tsx` | 예 | fail |
| 3 | 검증 푸터 연동 | 세션 변경 결과 반영 | props 누락으로 "인터랙션 대기 중" 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 클라이언트 상태 변이가 아닌 Server Action 후 router.refresh() 관찰로 수정 |
| 데모 예제 | 예 | high | D02, D03 | `setProfile` 로컬 상태 모사 제거, 서버 재검증을 통한 순수 RSC 렌더링 구현 |
| 검증 | 예 | high | V01, V03, V05 | 세션 등급 및 적립금 검증 패널 연동 |
| 개념 정리 | 예 | high | C01, C02 | 클라이언트 컴포넌트 내부의 "0 KB Client Bundle (Zero JS)" 모순 수정 |

#### 증거 파일 및 종합 메모
- 소스: `RscUserProfileDemo.tsx:19-49`
- 종합 메모: RSC 보안 프로필 조회라는 취지에 맞게 RCC `useState` 오버라이드를 제거하고 `router.refresh()` 패턴으로 재설계 필요.

---

### 83. guides/data-security/server-only-guard — server-only 패키지를 통한 클라이언트 번들 유출 차단

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/data-security.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/data-security/server-only-guard/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 동기화 수량 조정 | `[+]` 클릭 | 실습 영역 | 예 | 로컬 카운트 증가 |
| 3 | [동작 실행] 클릭으로 안전한 서버 API 호출 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 실제 서버 호출 없이 `addLog`만 실행 (`D02`, `D03`) |
| 4 | 서버 전용 모듈 보안 경계 및 동기화 성공 로그 관찰 | 로그 관찰 | 실습 영역 | 아니오 | 범용 보일러플레이트 텍스트 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `server-only` 패키지 동작 | 서버 모듈의 클라이언트 import 차단 빌드 검증 | `server-only` import 없는 범용 상품/수량 더미 컴포넌트 | 산출물·설정 확인 | 소스 코드 | `ServerOnlyGuardDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 보안 경계 검증 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | `server-only` 모듈 참조 실패 시나리오 및 서버 액션 데이터 보호 절차로 전면 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 상품/수량 보일러플레이트 폐기, 실제 `server-only` 모듈 및 시크릿 키 격리 시연 구현 |
| 검증 | 예 | high | V01, V03, V05 | 클라이언트 번들 내 시크릿 유출 0% 및 서버 모듈 정상 동작 검증 패널 연결 |
| 개념 정리 | 예 | low | C03 | Next.js 빌드 타임 `server-only` 가드 에러 스펙 명시 |

#### 증거 파일 및 종합 메모
- 소스: `ServerOnlyGuardDemo.tsx` (102줄 범용 템플릿)
- 종합 메모: 범용 상품/수량 템플릿으로 생성된 가짜 데모로 전면 재구현 필수.

---

### 84. guides/data-security/react-taint-api — React experimental_taintObjectReference 비밀키 보호

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/data-security.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/data-security/react-taint-api/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 버튼으로 주문 수량 증정 | `[+]` 클릭 | 실습 영역 | 예 | 로컬 카운트 증가 |
| 3 | [동작 실행] 클릭으로 Taint 검증 트랜잭션 수행 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | Taint API 호출 없는 로컬 `addLog` (`D02`) |
| 4 | 민감 데이터 클라이언트 전달 차단 및 안전한 처리 관찰 | 로그 관찰 | 실습 영역 | 아니오 | 단순 문자열 로그 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | React Taint API 동작 | `experimental_taintObjectReference` / `experimental_taintUniqueValue` 검증 | Taint API 코드 0줄, 83번과 동일한 범용 템플릿 | 산출물·설정 확인 | 소스 코드 | `ReactTaintDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | Taint 예외 차단 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | Taint 객체/고유값 전달 시 런타임 예외 발생 절차로 수정 |
| 데모 예제 | 예 | high | D02, D03 | React Taint API를 사용한 실제 서버/클라이언트 경계 차단 데모로 전면 재작성 |
| 검증 | 예 | high | V01, V03, V05 | Taint 에러 포착 및 방어 상태 검증 패널 바인딩 |
| 개념 정리 | 예 | medium | C03 | `experimental.taint: true` Next.js 설정 요구사항 명시 |

#### 증거 파일 및 종합 메모
- 소스: `ReactTaintDemo.tsx`
- 종합 메모: 83번과 동일한 범용 보일러플레이트 복제본으로 재구현 대상.

---

### 85. guides/content-security-policy/nonce-injection — Middleware Nonce 기반 CSP 헤더 주입

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/content-security-policy.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/content-security-policy/nonce-injection/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조절 버튼 조작 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 Nonce 기반 보안 요청 전송 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | CSP/Nonce 관련 동작 전무 (`D02`, `D03`) |
| 4 | CSP Nonce 헤더 검증 및 악성 스크립트 차단 상태 관찰 | CSP 헤더 관찰 | 실습 영역 | 아니오 | 단순 텍스트 로그 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | CSP Nonce 주입 동작 | `headers()`의 `x-nonce` 및 `<script nonce="...">` 일치 검증 | CSP 헤더 및 Nonce 주입 코드 전무 (범용 템플릿) | 외부 도구·환경 확인 | 소스 코드 | `CspNonceDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | CSP 검증 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | CSP 헤더 및 Nonce 일치 인라인 스크립트 실행 관찰 절차로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 서버 컴포넌트에서 `headers()` 읽어 실제 Nonce 및 CSP 정책 렌더링 구현 |
| 검증 | 예 | high | V01, V03, V05 | Nonce 토큰 일치 여부 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | CSP Nonce 동작 메커니즘 정리 |

#### 증거 파일 및 종합 메모
- 소스: `CspNonceDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 86. guides/environment-variables/public-vs-server — NEXT_PUBLIC_ vs 서버 환경변수 노출 범위

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/environment-variables.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/environment-variables/public-vs-server/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 클라이언트 공개 환경변수(NEXT_PUBLIC_API_URL) 점검 및 서버 전용 비밀 환경변수(DB_SECRET_KEY) 격리 상태 검사 | 화면 카드 확인 | 실습 영역 | 예 | 정적 카드 노출 |
| 2 | 클라이언트 번들 분석을 통한 비밀키 노출 방지 관찰 | 번들 분석 관찰 | 실습 영역 | 아니오 | 정적 하드코딩 텍스트만 존재 (`D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 환경변수 노출 범위 대조 | 실제 `process.env.NEXT_PUBLIC_*` 및 서버 시크릿 undefined 확인 | 하드코딩된 문자열 "https://api.shop.com", "sk_live_***" | 값 비교 | 소스 코드 | `EnvVariablesDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 환경변수 평가 결과 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 클라이언트/서버 환경변수 실시간 평가 절차로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 클라이언트/서버에서 각각 `process.env`를 평가하여 노출 여부를 동적으로 대조 |
| 검증 | 예 | high | V01, V03, V05 | 평가된 클라이언트/서버 환경변수 값을 검증 패널에 바인딩 |
| 개념 정리 | 예 | low | C01 | 빌드 타임 인라인 치환 메커니즘 정리 |

#### 증거 파일 및 종합 메모
- 소스: `EnvVariablesDemo.tsx:8-12`
- 종합 메모: 17줄짜리 정적 UI 카드. 실제 환경변수 읽기 코드로 전환 필요.

---

### 87. guides/environment-variables/runtime-env — process.env 런타임 환경변수 동적 참조

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/environment-variables.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/environment-variables/runtime-env/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 테스트 수량 조절 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 런타임 환경변수 기반 요청 실행 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 런타임 env 참조 없는 더미 로그 (`D02`) |
| 4 | 실시간 런타임 환경변수 반영 및 API 통신 성공 로그 관찰 | 로그 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 런타임 `process.env` 참조 | 요청 시점 동적 서버 환경변수 반환 | 범용 상품/수량 더미 컴포넌트 | 값 비교 | 소스 코드 | `RuntimeEnvDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 런타임 환경변수 검증 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 런타임 환경변수 조회 및 동적 서버 액션 실행 절차로 수정 |
| 데모 예제 | 예 | high | D02, D03 | Server Action / RSC에서 실제 동적 `process.env` 값을 읽어 클라이언트에 전달하는 실습 구현 |
| 검증 | 예 | high | V01, V03, V05 | 런타임 엔드포인트 값 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | Node.js 런타임 환경변수 동적 참조 원리 설명 |

#### 증거 파일 및 종합 메모
- 소스: `RuntimeEnvDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 88. guides/json-ld/product-schema — Schema.org Product 구조화 데이터 (JSON-LD)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/json-ld.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/json-ld/product-schema/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 주입된 Schema.org Product 구조화 데이터 확인 및 상품 가격(129,000 KRW) 및 재고(InStock) 필드 검사 | `<pre>` 코드 블록 확인 | 실습 영역 | 예 | 화면에는 '149000' 표시 (가이드 불일치 `G01`) |
| 2 | 검색 엔진 리치 스니펫 유효성 및 SEO 마크업 관찰 | `<head>` 주입 확인 | 실습 영역 | 아니오 | 실제 `<head>` 스크립트 미주입 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | JSON-LD 스크립트 주입 | `<script type="application/ld+json">` 렌더링 | 단순 `<pre>` 태그 내 JSON 문자열 출력 | 산출물·설정 확인 | 소스 코드 | `JsonLdProductDemo.tsx` | 예 | fail |
| 2 | 가격 데이터 일치 | 가이드 문구 129,000 KRW | 컴포넌트 코드 price: '149000' | 값 비교 | 소스 코드 | `JsonLdProductDemo.tsx` | 예 | fail |
| 3 | 검증 푸터 연동 | SEO 스키마 유효성 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 상품 가격(149,000원) 및 실제 JSON-LD 태그 관찰로 문구 통일 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `<script type="application/ld+json" dangerouslySetInnerHTML={{...}} />` 렌더링 및 동적 상품 데이터 주입 구현 |
| 검증 | 예 | high | V01, V03, V05 | JSON-LD 파싱 객체 및 스키마 검증 패널 연동 |
| 개념 정리 | 예 | low | C01 | 구글 검색 리치 스니펫 가이드라인 정리 |

#### 증거 파일 및 종합 메모
- 소스: `JsonLdProductDemo.tsx:8`
- 종합 메모: 17줄짜리 단순 JSON 표시기. 실제 JSON-LD 스크립트 태그 렌더링 데모로 개편 필요.

---

### 89. guides/interactive-apps/multi-filter-widget — 다중 필터/정렬/장바구니 복합 인터랙티브 위젯

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/interactive-apps.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/interactive-apps/multi-filter-widget/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 / 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 다중 필터 위젯(카테고리/가격/정렬) 옵션 확인 | 태그 버튼 4개 확인 | 실습 영역 | 예 | 무료배송 등 4개 버튼 |
| 2 | 카테고리 및 가격 필터 조합 선택 | 태그 버튼 클릭 | 실습 영역 | 예 | 로컬 문자열 배열 토글 |
| 3 | 브라우저 URL 쿼리 스트링 갱신 및 필터링 결과 관찰 | URL 변경 관찰 | 브라우저 URL | 아니오 | URL searchParams 변경 전혀 없음 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | URL searchParams 동기화 | `useSearchParams` / `useRouter`를 통한 쿼리스트링 동기화 | 로컬 `useState<string[]>` 단순 토글 (URL 무반응) | 전후 변화 | 소스 코드 | `MultiFilterWidgetDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | URL 쿼리 파라미터 상태 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 태그 필터 라벨 및 쿼리 파라미터 안내로 일치 |
| 데모 예제 | 예 | high | D02, D03 | `useSearchParams`, `useRouter`, `usePathname`을 활용한 실시간 URL 쿼리 스트링 동기화 구현 |
| 검증 | 예 | high | V01, V03, V05 | URL 쿼리스트링 실시간 파싱값 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | shallow routing 및 URL 상태 관리 베스트 프랙티스 기술 |

#### 증거 파일 및 종합 메모
- 소스: `MultiFilterWidgetDemo.tsx`
- 종합 메모: 21줄짜리 로컬 `useState` 모사. Next.js URL SearchParams 동기화 로직으로 완성도 제고 필요.

---

### 90. guides/scripts/strategy-order — next/script strategy 로드 순서 최적화

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/scripts.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/scripts/strategy-order/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [beforeInteractive]: 보안/결제 모듈 최우선 로드 확인 및 [afterInteractive]: 기본 분석 도구(GA) 실행 점검 | 텍스트 박스 확인 | 실습 영역 | 예 | 정적 텍스트 3줄 |
| 2 | [lazyOnload]: 채팅봇 등 부가 기능 지연 로딩 관찰 | 텍스트 관찰 | 실습 영역 | 아니오 | 실제 `<Script>` 태그 실행 없음 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next/script` 3대 전략 실행 | `beforeInteractive`, `afterInteractive`, `lazyOnload` 실제 로딩 순서 계측 | `next/script` 미사용, 정적 `<div>` 텍스트 3줄 | 외부 도구·환경 확인 | 소스 코드 | `ScriptStrategyDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 스크립트 실행 타임라인 반영 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 스크립트 로드 타임라인 계측 절차로 보강 |
| 데모 예제 | 예 | high | D02, D03 | `next/script` 컴포넌트를 전략별로 배치하고 `onLoad`/`onReady` 타임스탬프를 실측하는 데모로 구현 |
| 검증 | 예 | high | V01, V03, V05 | 전략별 스크립트 로드 완료 시각 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | Next.js 스크립트 로딩 전략별 LCP 영향 요약 |

#### 증거 파일 및 종합 메모
- 소스: `ScriptStrategyDemo.tsx` (12줄 정적 UI)
- 종합 메모: 실제 `next/script` 로드 이벤트 기반 실측형 데모로 전환 필요.

---

### 91. guides/scripts/pg-sdk-onload — 외부 PG사 결제 SDK onLoad 이벤트 핸들링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/scripts.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/scripts/pg-sdk-onload/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 결제 SDK 상태([확인] PG사 결제 모듈 준비 완료 (onLoad)) 점검 | 상태 텍스트 확인 | 실습 영역 | 예 | `useState(true)`로 즉시 완료 표시 |
| 2 | [안전 결제창 열기] 버튼 클릭 | `[안전 결제창 열기]` 클릭 | 실습 영역 | 아니오 | 버튼에 `onClick` 핸들러 없음 (`D01`) |
| 3 | 결제 모듈 안전 호출 및 런타임 에러 방지 관찰 | 결제창 관찰 | 실습 영역 | 아니오 | 아무 동작 일어나지 않음 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `next/script` onLoad 이벤트 | 외부 스크립트 다운로드 후 `onLoad` 콜백 트리거 | `<Script>` 태그 없음, `useState(true)` 하드코딩 | 전후 변화 | 소스 코드 | `PgSdkOnloadDemo.tsx` | 예 | fail |
| 2 | 버튼 인터랙션 핸들러 | 결제창 모달/로그 트리거 | `<button>` 태그에 `onClick` 없음 | 화면 관찰 | 소스 코드 | `PgSdkOnloadDemo.tsx` | 예 | fail |
| 3 | 검증 푸터 연동 | SDK 로드 상태 및 결제 트리거 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 결제 SDK 로딩 중 -> 완료 단계 관찰로 보강 |
| 데모 예제 | 예 | high | D01, D02, D03 | `<Script src="..." onLoad={...} />` 실제 주입 및 버튼 클릭 이벤트 구현 |
| 검증 | 예 | high | V01, V03, V05 | `sdkReady` 및 결제 다이얼로그 호출 여부 검증 패널 연동 |
| 개념 정리 | 예 | low | C01 | 외부 SDK 로딩 안전성 패턴 정리 |

#### 증거 파일 및 종합 메모
- 소스: `PgSdkOnloadDemo.tsx:8` (`<button>` 태그에 `onClick` 누락)
- 종합 메모: 14줄짜리 미완성 컴포넌트.

---

### 92. guides/mdx/product-tech-doc — 상품 기술 문서 MDX 렌더링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/mdx.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/mdx/product-tech-doc/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 수량 조작 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 MDX 연동 API 호출 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | MDX 렌더링 없는 더미 로그 (`D02`) |
| 4 | MDX 마크다운 구문 분석 및 리치 텍스트 렌더링 관찰 | MDX 문서 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | MDX 컴파일 및 렌더링 | 실제 `.mdx` 파일 파싱 및 리치 텍스트 HTML 렌더링 | MDX 관련 코드 0줄, 범용 상품/수량 더미 컴포넌트 | 화면 관찰 | 소스 코드 | `MdxTechDocDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | MDX 렌더링 완료 상태 전달 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | MDX 기술 사양 문서 열람 및 마크다운 컴파일 확인 절차로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 MDX 컴포넌트 렌더링 데모로 전면 재구현 |
| 검증 | 예 | high | V01, V03, V05 | MDX 헤딩, 코드블록 렌더링 상태 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `@next/mdx` 파이프라인 개념 정리 |

#### 증거 파일 및 종합 메모
- 소스: `MdxTechDocDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 93. guides/mdx/custom-component-slot — MDX 내 인터랙티브 장바구니 버튼 합성

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/mdx.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/mdx/custom-component-slot/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | MDX 본문 내 주입된 구매 컴포넌트 (<BuyButton />) 확인 | 박스 UI 확인 | 실습 영역 | 예 | 정적 박스 |
| 2 | [라이브 테마 토글] 클릭 | `[라이브 테마 토글]` 클릭 | 실습 영역 | 예 | 버튼 문구가 장바구니 담김으로 변경 (`G01`) |
| 3 | 마크다운 내 클라이언트 상태 변경 및 장바구니 담김 관찰 | 상태 변경 관찰 | 실습 영역 | 아니오 | MDX 없는 단순 `useState` (`D02`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | MDX 컴포넌트 슬롯 합성 | 정적 MDX 내 `<BuyButton />` RCC 주입 | MDX 파서 없음, 단순 `useState(false)` 카드 | 화면 관찰 | 소스 코드 | `MdxCustomSlotDemo.tsx` | 예 | fail |
| 2 | 버튼 라벨 일치 | 장바구니 구매 버튼 | 버튼 라벨이 "라이브 테마 토글"로 오기됨 | 화면 관찰 | 소스 코드 | `MdxCustomSlotDemo.tsx:9` | 예 | fail |
| 3 | 검증 푸터 연동 | 슬롯 컴포넌트 인터랙션 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 버튼 라벨 오기("라이브 테마 토글" -> "구매하기") 수정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 마크다운 본문 내 커스텀 React 컴포넌트 매핑 합성 구현 |
| 검증 | 예 | high | V01, V03, V05 | 컴포넌트 슬롯 마운트 및 클릭 상태 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | MDX components 매핑 원리 정리 |

#### 증거 파일 및 종합 메모
- 소스: `MdxCustomSlotDemo.tsx:9` (`라이브 테마 토글` 버튼 라벨 버그)
- 종합 메모: 14줄짜리 목업 코드.

---

### 94. guides/third-party-libraries/google-analytics — @next/third-parties Google Analytics 최적화

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/third-party-libraries.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/third-party-libraries/google-analytics/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | GA4 이벤트 전송 없는 더미 로그 (`D02`) |
| 3 | GA4 측정 ID(G-XXXXXXXX) 및 이벤트 페이로드 전송 관찰 | GA 전송 관찰 | Network | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `@next/third-parties/google` 통합 | `<GoogleAnalytics gaId="..." />` 및 `sendGAEvent` 실행 | 패키지 미사용, 범용 상품/수량 더미 컴포넌트 | 외부 도구·환경 확인 | 소스 코드 | `ThirdPartyGaDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | GA4 이벤트 발송 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | GA4 컴포넌트 주입 및 커스텀 전자상거래 이벤트 발송 관찰로 개편 |
| 데모 예제 | 예 | high | D02, D03 | `@next/third-parties/google` 컴포넌트 주입 및 `sendGAEvent` 로그 시각화 구현 |
| 검증 | 예 | high | V01, V03, V05 | GA 측정 ID 및 전송 이벤트 페이로드 검증 패널 연결 |
| 개념 정리 | 예 | low | C01 | `0ms 지연 없이 추적` 과장 문구 정리 |

#### 증거 파일 및 종합 메모
- 소스: `ThirdPartyGaDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 95. guides/third-party-libraries/youtube-embed — @next/third-parties YouTube 최적화 임베드

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/third-party-libraries.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/third-party-libraries/youtube-embed/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | YouTube 라이트 플레이어 썸네일 포스터 확인 및 재생 버튼 클릭으로 비디오 로드 트리거 | 검은 박스 클릭 | 실습 영역 | 예 | 텍스트가 '스트리밍 재생 중...'으로 변경 |
| 2 | 온디맨드 iframe 주입 및 0 KB 초기 JS 절감 관찰 | iframe 관찰 | 실습 영역/DOM | 아니오 | 실제 iframe 및 `@next/third-parties` 없음 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `<YouTubeEmbed />` 라이트 임베드 | 클릭 시점에 실제 YouTube iframe 온디맨드 로드 | 검은 `<div>`의 `useState(false)` 텍스트 토글 | 전후 변화 | 소스 코드 | `ThirdPartyYoutubeDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | iframe 마운트 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 라이트 임베드 클릭 전후 네트워크/DOM 변화 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | `@next/third-parties/google`의 `<YouTubeEmbed videoid="..." />` 실제 적용 |
| 검증 | 예 | high | V01, V03, V05 | 포스터 상태 및 온디맨드 iframe 마운트 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 라이트 임베드의 LCP/번들 최적화 효과 기술 |

#### 증거 파일 및 종합 메모
- 소스: `ThirdPartyYoutubeDemo.tsx:11-13`
- 종합 메모: 17줄짜리 가짜 플레이어. 실제 `@next/third-parties` 라이브러리 적용 필요.

---

### 96. guides/bff/order-aggregation — Route Handler를 통한 레거시 주문/재고 API 취합 (BFF)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/backend-for-frontend.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/bff/order-aggregation/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | BFF 통합 전 마이크로서비스 개별 호출 오버헤드 점검 | 안내 텍스트 점검 | 실습 영역 | 예 | 사전 설명 |
| 2 | [BFF 통합 주문 조회 API 호출 (/api/bff/order)] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | `setAggregated(true)` 실행 |
| 3 | 단일 응답 JSON으로 통합된 주문·회원·배송 데이터 관찰 | 결과 박스 관찰 | 실습 영역 | 아니오 | 실제 API 호출 없이 하드코딩 텍스트 노출 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Route Handler BFF 집계 통신 | `fetch('/api/bff/order')`를 통한 MSA 병렬 집계 결과 수신 | `fetch` 요청 0건, `setAggregated(true)` 하드코딩 텍스트 | 값 비교 | 소스 코드 | `BffAggregationDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 집계 페이로드 대조 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 HTTP 통신 및 Network 탭 1회 요청 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 BFF Route Handler (`/api/bff/order`) 구현 및 `Promise.all` 집계 통신 연결 |
| 검증 | 예 | high | V01, V03, V05 | 수신된 3개 서비스 통합 JSON 페이로드 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | BFF 패턴의 네트워크 RTT 감축 이점 기술 |

#### 증거 파일 및 종합 메모
- 소스: `BffAggregationDemo.tsx:10-16`
- 종합 메모: 20줄짜리 하드코딩 모사. 실제 Route Handler 엔드포인트와 연동 필요.

---

### 97. guides/bff/response-shaping — 모바일 앱 최적화 응답 가공 (Response Shaping)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/backend-for-frontend.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/bff/response-shaping/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 원본 백엔드 응답(50개 필드, 120 KB) 페이로드 분석 및 BFF 응답 셰이핑 적용 후(6개 필드, 10 KB) 대조 | 카드 2개 대조 | 실습 영역 | 예 | 정적 카드 노출 (UI엔 4개 필드, 2 KB로 표기되어 불일치 `G01`, `C02`) |
| 2 | 92% 네트워크 전송량 절감 및 JSON 파싱 속도 개선 관찰 | 수치 관찰 | 실습 영역 | 아니오 | 실측 데이터 없는 정적 텍스트 (`D03`, `C01`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Response Shaping 페이로드 감축 실측 | 원본 대비 정제 JSON 바이트 및 파싱 시간 측정 | 하드코딩 정적 카드, 수치 불일치(가이드: 6개/10KB, UI: 4개/2KB) | 값 비교 | 소스 코드 | `BffResponseShapingDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 셰이핑 전후 비교 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실습 카드 표기(필드 수, 용량)와 가이드 문구 통일 |
| 데모 예제 | 예 | high | D02, D03 | 실제 원본 JSON 객체를 셰이핑 함수로 가공하고 바이트 크기를 실측하는 인터랙티브 UI 구현 |
| 검증 | 예 | high | V01, V03, V05 | 원본/가공 페이로드 크기 및 절감율 검증 패널 바인딩 |
| 개념 정리 | 예 | medium | C01, C02 | 92% 단정 수치 대신 실제 계산식과 페이로드 슬림화 원리 기술 |

#### 증거 파일 및 종합 메모
- 소스: `BffResponseShapingDemo.tsx` (17줄 정적 카드)
- 종합 메모: 실측 가능한 데이터 가공 비교기로 개편 필요.

---

### 98. guides/pwas/app-install-prompt — 홈 화면 추가 PWA 프롬프트 및 manifest

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/progressive-web-apps.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/pwas/app-install-prompt/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [앱 홈화면에 설치] 클릭 | 초기 상태 점검 | 실습 영역 | 예 | 매니페스트 감지 텍스트 |
| 2 | [[확인] 홈 화면에 추가되었습니다 쇼핑몰 앱 홈 화면에 설치하기] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 버튼 텍스트 변경 (`G01` 깨진 라벨) |
| 3 | 홈 화면 추가 완료 상태 전환 및 오프라인 지원 관찰 | 완료 상태 관찰 | 실습 영역 | 아니오 | `beforeinstallprompt` 없는 단순 `useState` (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | PWA 설치 프롬프트 이벤트 | `beforeinstallprompt` 이벤트 캡처 및 `prompt()` 트리거 | 브라우저 PWA 이벤트 바인딩 0줄, 단순 `setInstalled(true)` | 전후 변화 | 소스 코드 | `PwaInstallPromptDemo.tsx` | 예 | fail |
| 2 | 가이드 2단계 라벨 | 명확한 조작 버튼 라벨 | 깨진 텍스트 "[[확인] 홈 화면에 추가되었습니다 쇼핑몰 앱...]" | 화면 관찰 | 가이드 | `page.tsx:21` | 예 | fail |
| 3 | 검증 푸터 연동 | PWA 설치 및 매니페스트 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 2단계 깨진 버튼 라벨 문구 수정 |
| 데모 예제 | 예 | high | D02, D03 | `window.addEventListener('beforeinstallprompt')` 및 매니페스트 메타데이터 검증 로직 구현 |
| 검증 | 예 | high | V01, V03, V05 | PWA 설치 가능 여부 및 매니페스트 파싱 결과 검증 패널 연결 |
| 개념 정리 | 예 | low | C01 | Next.js App Router `manifest.ts` / `manifest.json` 규칙 정리 |

#### 증거 파일 및 종합 메모
- 소스: `page.tsx:21` (가이드 라벨 오기), `PwaInstallPromptDemo.tsx` (14줄짜리 모사)
- 종합 메모: PWA 이벤트 리스너 및 매니페스트 검증 기능으로 보강 필요.

---

### 99. guides/i18n/subpath-routing — /[lang]/products 다국어 서브패스 라우팅

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/internationalization.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/i18n/subpath-routing/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 기본 한국어 경로([/ko/shop]) 활성화 상태 확인 | 초기 버튼 확인 | 실습 영역 | 예 | `/ko/shop` 활성 스타일 |
| 2 | [/en/shop] 또는 [/ja/shop] 언어 전환 버튼 클릭 | `[/en/shop]` 클릭 | 실습 영역 | 예 | 클라이언트 state `en` 변경 |
| 3 | URL 서브패스 변경 및 현지화된 라우팅 구조 관찰 | URL 서브패스 관찰 | 브라우저 URL | 아니오 | 실제 라우트 이동 없이 단순 텍스트 변경 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `[lang]` 서브패스 라우팅 | 실제 Next.js `[lang]` 라우트 세그먼트 이동 | `useState('ko')`로 화면 텍스트만 치환 (URL 고정) | 화면 관찰 | 소스 코드 | `I18nSubpathDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 현재 언어 세그먼트 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 서브패스 라우트 전환 및 URL 변경 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `[lang]` 하위 라우트 또는 `<Link href="/zone/baseline/.../[lang]/...">` 이동 구현 |
| 검증 | 예 | high | V01, V03, V05 | 현재 감지된 언어 세그먼트 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | Next.js 미들웨어 i18n 리라이트 및 `[lang]` 세그먼트 아키텍처 설명 |

#### 증거 파일 및 종합 메모
- 소스: `I18nSubpathDemo.tsx` (18줄 단순 `useState`)
- 종합 메모: 실제 라우터 네비게이션이 동작하는 i18n 서브패스 구조로 재구현 필요.

---

### 100. guides/i18n/dictionary-translation — 서버 사이드 사전 JSON 번역 렌더링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/internationalization.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/i18n/dictionary-translation/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [한국어 사전] 적용 텍스트(환영합니다, 결제하기, 무료 배송) 확인 | ko 텍스트 확인 | 실습 영역 | 예 | 환영합니다 등 출력 |
| 2 | [English Dict] 버튼 클릭으로 영어 사전 전환 | `[English Dict]` 클릭 | 실습 영역 | 예 | en 텍스트로 전환 |
| 3 | Welcome, Checkout, Free Shipping 번역 즉시 갱신 관찰 | 번역 갱신 관찰 | 실습 영역 | 아니오 | 0 KB 번들 RSC 사전이 아닌 RCC 번들에 사전 전체 하드코딩 (`D02`, `C02`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 서버 사이드 사전 동적 import | RSC에서 `getDictionary(lang)`로 온디맨드 JSON 로드 | RCC 컴포넌트 내부에 `dict = { ko: {...}, en: {...} }` 전체 번들링 | 값 비교 | 소스 코드 | `I18nDictionaryDemo.tsx:5-8` | 예 | fail |
| 2 | 0 KB 클라이언트 번들 사양 | 클라이언트에 번역 사전 미포함 | 클라이언트 JS 번들에 모든 언어 사전 포함되어 사양과 정반대 | 산출물·설정 확인 | 소스 코드 | `I18nDictionaryDemo.tsx` | 예 | fail |
| 3 | 검증 푸터 연동 | 번역 맵 및 로드된 사전 크기 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 서버 컴포넌트 사전 로딩 및 페이지 갱신 절차로 수정 |
| 데모 예제 | 예 | high | D02, D03 | `getDictionary()` 함수를 통한 실제 RSC 사전 비동기 로드 및 서버 렌더링 구현 |
| 검증 | 예 | high | V01, V03, V05 | 로드된 언어 사전 키-값 매핑 검증 패널 바인딩 |
| 개념 정리 | 예 | high | C01, C02 | 클라이언트 컴포넌트 하드코딩 사전 모순 해결 |

#### 증거 파일 및 종합 메모
- 소스: `I18nDictionaryDemo.tsx:5-8` (RCC 번들 내 하드코딩 사전)
- 종합 메모: 서버 사전 동적 로딩이라는 핵심 개념과 실제 코드가 정반대로 구현된 중대 결함.

---

## B06-B10 공통 발견

### B06 공통 발견 (51–60)

- **파일 컨벤션 골든 샘플 후보**: 55번(`file-conventions/loading/skeleton-boundary`)과 56번(`file-conventions/not-found/missing-product-404`)은 실제 `loading.tsx` 및 `not-found.tsx` 파일 컨벤션이 충실히 구현되어 있으며, 검증 패널 연결만 추가하면 `verified` 전환 유력.
- **기능 모사 및 서버 경계 미분리(`D02`)**: 51번(`redirect`), 52번(`draftMode`), 53번(프리패치), 57번(`next/image`), 58번(하이드레이션), 59번(직렬화)이 실제 Next.js API 미호출.

### B07 공통 발견 (61–70)

- **과장된 정량 지표 표기(`C01`, `V01`)**: 64번(AST 해시 비트시프트 모사), 66번("0ms Zero Spinner"), 70번("95% 대역폭 절감") 등 측정 근거 없는 수치 주장 정비 필요.
- **모범 구현**: 62번(`isr/revalidate-path-sync`)은 실제 `revalidatePath` Server Action을 구현하여 검증 패널 바인딩만 보강하면 됨.

### B08 공통 발견 (71–80)

- **중대 복제 결함(`D01`, `D03`)**: 79번(`guides/sass/promotions-theme`)이 61번 데모(`SegmentRevalidateDemo.tsx`) 코드를 그대로 복제하여 Sass 실습과 무관한 주문 카운터가 표시됨 (P1 긴급 재구현 대상).
- **네비게이션/상태 보존 모사(`D02`)**: 71, 72, 74, 75번이 Next.js 라우터 이동 없이 로컬 `useState`로만 상태를 변경함.

### B09 공통 발견 (81–90)

- **범용 템플릿 복제 문제(`D01`, `D02`, `D03`)**: 83번(`server-only`), 84번(`react-taint`), 85번(`csp-nonce`), 87번(`runtime-env`) 4개 데모가 동일한 '상품 선택/수량 변경/로그 추가' 102줄 범용 보일러플레이트로 복제되어 있어 전면 재구현 필수.
- **정적 UI 모사**: 86번(`env-variables`), 88번(`json-ld`), 90번(`scripts`)이 15줄 내외의 정적 문자열 카드만 표시함.

### B10 공통 발견 (91–100)

- **서드파티 및 BFF 모사(`D02`)**: 94번(Google Analytics), 95번(YouTube Embed), 96번(BFF 집계), 97번(Response Shaping)이 패키지나 API 엔드포인트 없이 텍스트로만 모사됨.
- **핸들러 누락 버그(`D01`)**: 91번(`pg-sdk-onload`) `<button>`에 `onClick` 핸들러 누락, 93번 버튼 라벨 오기.

## 코드 수정 반영 (2026-08-29, Claude 세션)

위 감사에서 발견된 문제 중 아래 39개 데모의 소스 코드를 실제로 수정했다. 모든 수정은 로컬 `useState` 모사를 제거하고 실제 Next.js API(Server Action, Route Handler, `use cache`, `draftMode()`, `redirect()`, `next/dynamic`, `next/script`, View Transitions API, `useServerInsertedHTML` 등)로 교체하는 방식이며, `curl` 상태 코드 확인 + `agent-browser`를 이용한 실제 클릭/네비게이션 테스트로 개별 검증했다. `tsc --noEmit`은 두 앱 모두 통과했다.

**수정 완료(39개)**: 51, 52, 53, 54, 55(검증 결과 원래도 정상— 수정 불필요로 재확인), 56(상동), 57, 58, 59, 60, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80/81(동일 URL 중복 기재), 82, 83, 84, 85, 87, 88, 89, 90, 91, 96, 97

**주요 사례**:
- 80/81 `middleware-guard`: `proxy.ts` 쿠키명 불일치(`study_auth_session` vs 실제 `auth_token`) 수정 + 실제 307 리다이렉트 로직 추가. `fetch` + `response.redirected`로 실측 검증.
- 84 `react-taint-api`: `next.config.ts`에 `experimental.taint: true` 추가 후 실제 `experimental_taintUniqueValue` 호출 — 위험한 시도 클릭 시 React가 실제 런타임 에러로 유출을 차단하는 것까지 확인.
- 85 `csp-nonce`: `proxy.ts`가 매 요청 실제 nonce를 발급해 CSP 헤더 주입, nonce 일치 스크립트는 실행(true)·불일치 스크립트는 실제 차단(false)됨을 확인.
- 63/65/64 (cache 존): `'use cache'` + `cacheTag`로 인자별 자동 캐시 분리를 cacheId 실측으로 증명(예: VIP↔VVIP 전환 시 cacheId 변경, 동일 조합 복귀 시 재사용 확인).
- 96 `bff-order-aggregation`: 실제 Route Handler가 `Promise.all`로 3개 지연 함수를 병렬 호출, 실측 소요시간(약 220ms)이 순차 합산(약 550ms)보다 짧음을 확인.
- 97 `response-shaping`: `TextEncoder`로 원본/정제 페이로드의 실제 바이트 크기를 측정(고정 수치 제거).

**이번 세션에서 다루지 않은 항목(새 인프라 필요, 백로그)**: 66(`@tanstack/react-query` 미설치), 79(`sass` 패키지 미설치), 86(`.env` 파일이 `.gitignore`로 커밋되지 않아 다른 학습자에게 재현 불가), 92·93(MDX 렌더링 파이프라인 부재), 94·95(`@next/third-parties` 미설치), 98(PWA manifest 연동 구조 필요), 99·100(다국어 사전/라우팅 구조 신규 설계 필요).

전수 재검증(Playwright 기반 정식 감사)은 이번 세션 범위 밖이며 후속 작업으로 남는다. 위 표의 `실행 결과` 컬럼과 상세 기록은 감사 시점(2026-08-28) 기준이므로 이번 코드 수정 이후에는 최신이 아니다.
