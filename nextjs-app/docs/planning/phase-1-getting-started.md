# Phase 1. Getting Started 데모 상세 기획서 (28개 데모)

- 대상 카테고리: `1-getting-started` (총 18편 중 데모 대상 14편)
- 총 예상 데모 수: **28개** (`demo-baseline`: 24개, `demo-cache-components`: 4개)
- 상위 로드맵: [데모 계획 README.md](./README.md)

---

## 목차별 데모 상세 정의

### 1.3 [Layouts and Pages](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/layouts-and-pages.md) (3개 데모)
1. **`/demo/layouts-and-pages/nested-layouts` (Zone: baseline)**
   - **이커머스 시나리오**: 쇼핑몰 상단 GNB와 카테고리 사이드바(중첩 레이아웃) 내에서 상품 목록 및 상세 페이지 전환
   - **체험 절차**: 1) 카테고리(신발 -> 의류) 클릭 -> 2) 사이드바는 유지되고 우측 콘텐츠 영역만 부분 렌더링 관찰
   - **검증 패널**: 상단 GNB 렌더 타임스탬프 고정 및 자식 세그먼트만 갱신 확인
2. **`/demo/layouts-and-pages/template-lifecycle` (Zone: baseline)**
   - **이커머스 시나리오**: 상품 후기 작성 모달/폼에서 `template.tsx`를 적용하여 페이지 이동 시 폼 입력값 자동 초기화 및 리마운트 관찰
   - **체험 절차**: 1) 텍스트 입력 -> 2) 탭 이동 -> 3) 컴포넌트 재생성으로 입력창 리셋 및 진입 애니메이션 관찰
   - **검증 패널**: `template` 인스턴스 ID 변경 및 마운트 횟수 카운터 증가
3. **`/demo/layouts-and-pages/route-groups-layouts` (Zone: baseline)**
   - **이커머스 시나리오**: `(shop)` 상점용 GNB 레이아웃 vs `(auth)` 로그인/회원가입 미니멀 레이아웃 다중 분리
   - **체험 절차**: 1) 상점 페이지 이동 -> 2) 로그인 페이지 이동 -> 3) URL에 `(auth)` 노출 없이 루트 레이아웃 완전 교체 확인
   - **검증 패널**: 현재 적용된 Root Layout 식별자 표시

---

### 1.4 [Linking and Navigating](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/linking-and-navigating.md) (2개 데모)
1. **`/demo/linking-and-navigating/soft-navigation` (Zone: baseline)**
   - **이커머스 시나리오**: 카테고리 탭 간 `<Link>` 이동 시 전체 페이지 리로드 없는 소프트 네비게이션 및 스크롤 위치 보존
   - **체험 절차**: 1) 상품 목록 스크롤 다운 -> 2) 링크 클릭 -> 3) `scroll={false}` 설정에 따른 스크롤 위치 유지 대조
   - **검증 패널**: 브라우저 하드 리로드 발생 여부(0회) 및 페이지 전환 시간(<50ms)
2. **`/demo/linking-and-navigating/router-prefetch` (Zone: baseline)**
   - **이커머스 시나리오**: `useRouter`를 활용한 프로그래밍 방식 필터 이동 및 `router.prefetch()` 네트워크 사전 요청 관찰
   - **체험 절차**: 1) [특가 상품 프리패치] 버튼 클릭 -> 2) 네트워크 탭 사전 로드 확인 -> 3) [이동] 클릭 시 즉시 렌더링
   - **검증 패널**: 프리패치 완료 상태 뱃지 및 즉각 전환 확인

---

### 1.5 [Server and Client Components](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/server-and-client-components.md) (2개 데모)
1. **`/demo/server-client-components/composition` (Zone: baseline)**
   - **이커머스 시나리오**: 서버에서 렌더링된 무거운 상품 상세 스펙(RSC)에 클라이언트 인터랙션 위시리스트 하트 버튼(RCC) 합성
   - **체험 절차**: 1) 상품 스펙 로드 확인(서버 타임스탬프) -> 2) 하트 버튼 클릭 시 클라이언트 로컬 상태만 즉각 토글
   - **검증 패널**: 번들에 포함된 클라이언트 JS 크기 절감량 및 RSC 페이로드 분리 검증
2. **`/demo/server-client-components/serialization` (Zone: baseline)**
   - **이커머스 시나리오**: 직렬화 불가능한 함수/클래스 인스턴스 대신 평탄한 JSON 직렬화 데이터를 넘기는 안전한 Props 전달 패턴
   - **체험 절차**: 1) 유효한 상품 Props 전달 -> 2) 서버 액션 함수 전달 시 직렬화 경계 통과 확인
   - **검증 패널**: 직렬화된 Props 트리 뷰 및 에러 없는 바운더리 검증

---

### 1.6 [Fetching Data](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/fetching-data.md) (2개 데모)
1. **`/demo/fetching-data/parallel-fetching` (Zone: baseline)**
   - **이커머스 시나리오**: 상품 정보(1s)와 추천 목록(1.5s)을 `Promise.all`로 병렬 패칭하여 직렬 Waterfall(2.5s -> 1.5s) 해소
   - **체험 절차**: 1) 직렬 패칭 실행 -> 2) 병렬 패칭 실행 -> 3) 소요 시간 및 타임라인 차트 비교
   - **검증 패널**: 직렬 2500ms vs 병렬 1500ms 소요 시간 비교 검증
2. **`/demo/fetching-data/use-promise-streaming` (Zone: baseline)**
   - **이커머스 시나리오**: Server Component에서 시작한 상품 리뷰 fetch Promise를 Client Component로 전달하고 React 19 `use(promise)`로 스트리밍 unwrap
   - **체험 절차**: 1) 페이지 진입 시 상품 본문 즉시 표시 -> 2) 하단 리뷰 영역 Suspense 스켈레톤 -> 3) `use()`를 통해 리뷰 로드 완료
   - **검증 패널**: Suspense fallback 표시 후 unwrap된 데이터 렌더 확인

---

### 1.7 [Mutating Data](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/mutating-data.md) (2개 데모)
1. **`/demo/mutating-data/server-action-revalidate` (Zone: baseline)**
   - **이커머스 시나리오**: 장바구니 수량 증가 Server Action 호출 후 `revalidatePath('/cart')`로 서버 장바구니 합계 동기화
   - **체험 절차**: 1) 수량 [+] 버튼 클릭 -> 2) 서버 액션 처리 -> 3) 총 결제 금액 자동 갱신
   - **검증 패널**: 서버 DB 수량값과 화면 표시 수량 일치 검증
2. **`/demo/mutating-data/optimistic-cart` (Zone: baseline)**
   - **이커머스 시나리오**: 네트워크 지연(1s) 상황에서도 `useOptimistic`을 적용하여 클릭 즉시 장바구니 뱃지와 총액이 변경되는 낙관적 UI
   - **체험 절차**: 1) [장바구니 담기] 클릭 -> 2) 0ms 즉시 뱃지 1 증가 -> 3) 1s 뒤 서버 확정 응답 도착
   - **검증 패널**: 낙관적 상태(Optimistic: true) -> 확정 상태(Confirmed: true) 상태 전이 로그

---

### 1.8 [Caching](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/caching.md) (2개 데모)
1. **`/demo/caching/basic` (Zone: cache - 완료)**
   - **이커머스 시나리오**: `use cache` 기본 동작 및 `cacheTag('caching-basic:data')` 타임스탬프 고정
   - **체험 절차**: 1) 새로고침 -> 2) 캐시 ID 및 시각 유지 확인
   - **검증 패널**: ExpectedActualPanel 캐시 ID 일치 검증
2. **`/demo/caching/revalidate-tag` (Zone: cache - 완료)**
   - **이커머스 시나리오**: Server Action을 통한 `revalidateTag('caching-basic:data')` 온디맨드 즉시 캐시 갱신
   - **체험 절차**: 1) [캐시 무효화] 버튼 클릭 -> 2) 캐시 ID 새로 발급 및 갱신 확인
   - **검증 패널**: 새로운 Cache ID 및 시각 갱신 검증

---

### 1.9 [Revalidating](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/revalidating.md) (2개 데모)
1. **`/demo/revalidating/time-based-isr` (Zone: cache)**
   - **이커머스 시나리오**: `cacheLife('seconds')`를 적용한 10초 주기 시간 기반 재검증 (Stale-While-Revalidate)
   - **체험 절차**: 1) 10초 이내 새로고침(캐시 유지) -> 2) 10초 후 새로고침(백그라운드 갱신 트리거) -> 3) 다음 새로고침 시 갱신 데이터 노출
   - **검증 패널**: Stale 상태 감지 및 Revalidation 타임라인 로그
2. **`/demo/revalidating/tag-vs-path` (Zone: cache)**
   - **이커머스 시나리오**: `revalidateTag` (특정 상품 캐시만 선택 무효화) vs `revalidatePath` (해당 라우트 전체 무효화) 영향도 대조
   - **체험 절차**: 1) [태그 무효화] 클릭 (관련 상품만 갱신) -> 2) [경로 무효화] 클릭 (상단 배너/사이드바까지 전체 갱신)
   - **검증 패널**: 무효화된 캐시 엔트리 수 비교 (1개 vs 전체)

---

### 1.10 [Error Handling](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/error-handling.md) (2개 데모)
1. **`/demo/error-handling/segment-error` (Zone: baseline)**
   - **이커머스 시나리오**: 결제 승인 API 실패 시 전체 앱이 깨지지 않고 결제 박스만 `error.tsx` 바운더리로 격리
   - **체험 절차**: 1) [강제 결제 오류 발생] 클릭 -> 2) 결제 컴포넌트만 에러 UI로 전환 -> 3) [다시 시도(reset)] 클릭 시 정상 복구
   - **검증 패널**: 상단 GNB/장바구니 정상 유지 및 에러 바운더리 트리거 확인
2. **`/demo/error-handling/global-error` (Zone: baseline)**
   - **이커머스 시나리오**: 루트 레이아웃 레벨 치명적 오류 발생 시 `global-error.tsx` 전역 폴백 화면 렌더링
   - **체험 절차**: 1) 루트 에러 발생 버튼 클릭 -> 2) 전역 에러 페이지 전환 -> 3) [홈으로 돌아가기] 클릭 복구
   - **검증 패널**: Global Error Boundary 포착 로그

---

### 1.11 [CSS](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/css.md) (2개 데모)
1. **`/demo/css/tailwind-v4` (Zone: baseline)**
   - **이커머스 시나리오**: Tailwind CSS v4 `@theme inline` oklch 토큰 기반 상품 카드 반응형 스타일 및 테마 전환
   - **체험 절차**: 1) 다크모드/라이트모드 토글 -> 2) 상품 뱃지 hover/focus 상태 전환 관찰
   - **검증 패널**: 적용된 CSS 변수 및 클래스 실시간 인스펙터
2. **`/demo/css/css-modules` (Zone: baseline)**
   - **이커머스 시나리오**: CSS Modules (`.module.css`)를 활용한 컴포넌트 단위 스코프 스타일 격리 및 클래스명 해시 확인
   - **체험 절차**: 1) 중복 클래스명을 가진 두 개의 위젯 렌더 -> 2) 스타일 충돌 없는 격리 확인
   - **검증 패널**: 생성된 유니크 CSS 클래스명 해시 확인

---

### 1.12 [Image Optimization](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/images.md) (3개 데모)
1. **`/demo/images/responsive-sizes` (Zone: baseline)**
   - **이커머스 시나리오**: 상품 갤러리 `next/image`의 `fill` 속성과 `sizes="(max-width: 768px) 100vw, 50vw"` 반응형 로딩
   - **체험 절차**: 1) 뷰포트 너비 슬라이더 조절 -> 2) 다운로드되는 이미지 srcSet 및 실제 크기(px) 변경 관찰
   - **검증 패널**: 최적화된 이미지 URL (`/_next/image?url=...&w=...`) 및 용량 절감률
2. **`/demo/images/blur-placeholder` (Zone: baseline)**
   - **이커머스 시나리오**: 저용량 Base64 블러 데이터(`placeholder="blur"`) 적용으로 이미지 로딩 중 매끄러운 UX 제공
   - **체험 절차**: 1) 네트워크 3G 시뮬레이션 -> 2) 블러 이미지 표시 -> 3) 원본 고화질 이미지 전환 관찰
   - **검증 패널**: 이미지 로드 완료 시점 및 Layout Shift 발생 0px 검증
3. **`/demo/images/priority-lcp` (Zone: baseline)**
   - **이커머스 시나리오**: 메인 프로모션 히어로 배너에 `priority` 적용 시 LCP 사전 로드(`<link rel="preload">`) 태그 생성 관찰
   - **체험 절차**: 1) priority=false vs true 대조 -> 2) HTML 헤더의 preload 링크 태그 유무 확인
   - **검증 패널**: LCP 로딩 시간 단축 비교

---

### 1.13 [Font Optimization](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/fonts.md) (2개 데모)
1. **`/demo/fonts/google-variable` (Zone: baseline)**
   - **이커머스 시나리오**: `next/font/google`을 활용한 Inter/Geist 가변 폰트 셀프 호스팅 및 CLS(0.00) 방지
   - **체험 절차**: 1) 외부 CDN 폰트 vs next/font 전환 -> 2) 폰트 로드 시 텍스트 떨림(FOUT/FOIT) 제로 확인
   - **검증 패널**: 폰트 파일 요청 도메인(동일 오리진) 및 Layout Shift 측정값
2. **`/demo/fonts/local-font` (Zone: baseline)**
   - **이커머스 시나리오**: 커스텀 브랜드 로컬 폰트(`next/font/local`) 가변 굵기(100~900) 매핑 및 CSS 변수 연동
   - **체험 절차**: 1) 폰트 굵기 슬라이더 조절 -> 2) 렌더링 스타일 실시간 변경
   - **검증 패널**: 로컬 폰트 `@font-face` 생성 속성 확인

---

### 1.14 [Metadata and OG images](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/metadata-and-og-images.md) (2개 데모)
1. **`/demo/metadata/dynamic-seo` (Zone: baseline)**
   - **이커머스 시나리오**: 상품 상세 `generateMetadata`를 통한 동적 타이틀, 설명, Canonical URL, OpenGraph 메타태그 출력
   - **체험 절차**: 1) 상품 선택 변경 -> 2) `<head>` 메타태그 실시간 변경 확인
   - **검증 패널**: 카카오톡/페이스북 SNS 공유 프리뷰 카드 렌더링
2. **`/demo/metadata/image-response-og` (Zone: baseline)**
   - **이커머스 시나리오**: `ImageResponse`를 활용하여 상품명, 실시간 할인율, 가격이 합성된 동적 1200x630 OG PNG 이미지 생성
   - **체험 절차**: 1) 할인율(30% -> 50%) 변경 -> 2) 실시간 생성된 OG 이미지 캔버스 확인
   - **검증 패널**: 생성된 PNG 이미지 버퍼 미리보기

---

### 1.15 [Route Handlers](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/route-handlers.md) (2개 데모)
1. **`/demo/route-handlers/rest-api` (Zone: baseline)**
   - **이커머스 시나리오**: `/api/products` 엔드포인트의 GET(필터 검색) 및 POST(신규 상품 등록) REST API 인터랙티브 테스트
   - **체험 절차**: 1) GET 요청 전송 (JSON 응답 확인) -> 2) POST 요청으로 상품 추가 -> 3) 201 Created 응답 확인
   - **검증 패널**: HTTP 상태 코드, 요청/응답 헤더, Response JSON 뷰어
2. **`/demo/route-handlers/cookies-headers` (Zone: baseline)**
   - **이커머스 시나리오**: Route Handler 내에서 `NextResponse`를 통한 인증 쿠키 발급 및 `Set-Cookie` 헤더 제어
   - **체험 절차**: 1) 로그인 API 호출 -> 2) 응답 헤더의 `Set-Cookie: auth_token=...; HttpOnly` 확인
   - **검증 패널**: 설정된 쿠키 및 보안 플래그 검증

---

### 1.16 [Proxy](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/1-getting-started/proxy.md) (1개 데모)
1. **`/demo/proxy/gateway-handler` (Zone: baseline)**
   - **이커머스 시나리오**: 레거시 PG사 결제 API를 중계하는 보안 프록시 라우트 핸들러 (CORS 우회 및 내부 API 키 마스킹)
   - **체험 절차**: 1) [프록시 결제 요청] 클릭 -> 2) 클라이언트에 노출되지 않은 서버 전용 시크릿 키가 결합되어 결제 서버 통신 완료
   - **검증 패널**: 클라이언트 요청 헤더 vs 중계된 서버 헤더 마스킹 대조
