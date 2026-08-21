# Phase 5. Config, Edge & Architecture 데모 상세 기획서 (29개 데모)

- 대상 카테고리: `3.5-config` (18편), `3.8-edge` (1편), `5-architecture` (1편) (총 25편)
- 총 예상 데모 수: **29개** (`demo-baseline`: 11개, `demo-cache-components`: 16개, `demo-export`: 2개)
- 상위 로드맵: [데모 계획 README.md](./README.md)

---

## 1. next.config.ts 런타임 설정 (18편, 25개 데모)

### 라우팅 & 리소스 서빙
- **`basePath.md`** (1개): basePath: '/shop' 설정 시 전체 라우트 및 정적 자산 경로 접두사 동작 관찰
- **`assetPrefix.md`** (1개): CDN 정적 자산 서빙을 위한 assetPrefix 적용 시 _next/static URL 변환 검증
- **`redirects.md`** (2개): 정규식 redirects 라우팅 및 와일드카드/헤더 기반 조건부 리다이렉트
- **`rewrites.md`** (2개): Multi-Zones 라우팅을 위한 zone 간 rewrites 및 외부 API 프록시 rewrites
- **`headers.md`** (1개): CORS, X-Frame-Options 등 전역 보안 응답 헤더 일괄 주입
- **`trailingSlash.md`** (1개): trailingSlash 설정에 따른 끝 슬래시 강제 리다이렉트
- **`images.md`** (2개): remotePatterns 외부 이미지 도메인 허용 및 AVIF/WebP 포맷 자동 변환
- **`logging.md`** (1개): logging.fetches.fullUrl 패치 URL 콘솔 상세 로깅
- **`devIndicators.md`** (1개): 정적/동적 렌더링 상태 개발 뱃지 제어
- **`env.md`** (1개): env 필드를 통한 빌드 타임 환경변수 주입
- **`crossOrigin.md`** (1개): anonymous vs use-credentials 스크립트 태그 속성
- **`poweredByHeader.md`** (1개): X-Powered-By 헤더 은닉

### 캐시 & 컴파일러 설정 (Zone: cache & export)
- **`cacheComponents.md`** (1개, Zone: cache): cacheComponents: true 활성화 시 use cache 동작
- **`cacheLife.md`** (1개, Zone: cache): custom cacheLife 프로파일 정의 및 함수 바인딩
- **`cacheHandlers.md`** (1개, Zone: cache): 커스텀 Redis/메모리 캐시 핸들러 연동
- **`expireTime.md`** (1개, Zone: cache): ISR 메모리 캐시 보존 기간 제어
- **`staleTimes.md`** (1개, Zone: cache): staleTimes 클라이언트 라우터 캐시 시간 튜닝
- **`output.md`** (2개, Zone: export): output: 'standalone' vs 'export' 빌드 산출물 대조

---

## 2. Edge Runtime & Architecture (2편, 4개 데모)

- **3.8 [Edge Runtime](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/3-api-reference/edge.md)** (2개):
  1) V8 경량 실행 및 글로벌 Web APIs(fetch, Crypto, Streams) 검증
  2) Node.js 전용 모듈(fs, child_process) 접근 불가 제한점 실증
- **5.1 [Accessibility](file:///Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-docs/5-architecture/accessibility.md)** (2개):
  1) 결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원 검증
  2) 모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기 검증
