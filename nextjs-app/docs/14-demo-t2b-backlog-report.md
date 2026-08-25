# 14. 데모 [가이드] 전수 현대화 완료 및 T2-b 실습 고도화 백로그 종합 보고서

Next.js App Router 공식 문서 194개 주제를 바탕으로 구현된 241개 데모의 1단 `[가이드]`(`DemoGuideCard`) 전수 현대화(Milestone M0~M5)를 완료하고, 모노레포 전체 품질 검증 결과와 Phase 2 실습 고도화(T2-b) 대상 목록 및 우선순위 로드맵을 체계적으로 수립한 최종 기술 보고서입니다.

- **생성 일시**: 2026-08-24T21:44:25.684Z
- **검증 범위**: `nextjs-app` 모노레포 241개 데모 전수 (100.0%)
- **관련 규약**: [`AGENTS.md`](../AGENTS.md) 규칙 15·21·23·24·25

---

## 1. Executive Summary (경영진 및 총괄 요약)

본 프로젝트는 기존 241개 데모에 광범위하게 잔존하던 템플릿 문구 오염(82.6%), 획일적 3스텝 구조(99.6%), UI 라벨 불일치(98.8%), 관찰 안내 누락(100.0%), 문자열 유출(216건) 문제를 근본적으로 해결하기 위해 진행되었습니다.

Milestone M0부터 M5까지 단계별 수작업 및 자동 정합성 검증을 거쳐 **241개 데모 전수의 1단 가이드를 실제 동작 코드 기반으로 재작성** 완료하였으며, 영구 검증기(`pnpm test:guide`)를 통해 회귀 없는 품질 체계를 확립했습니다.

### 1-1. 현대화 완료 핵심 지표 (Modernization Metrics)

| 핵심 지표 | 현대화 이전 (M0 베이스라인) | 현대화 완료 (M5 최종) | 달성율 / 판정 |
|---|---:|---:|---|
| **전수 검증 대상 데모** | 241개 | 241개 | **100.0% 유효** |
| **템플릿 지문 오염 (GC01)** | 201건 위반 (16.6% 통과) | **0건 (100.0% 통과)** | **완전 척결 (0건)** |
| **스텝 제목 중복 (GC02)** | 201건 위반 (16.6% 통과) | **0건 (100.0% 통과)** | **고유화 완료 (0건)** |
| **UI 실제 라벨 인용 (GC03)** | 60건 (24.9% 통과) | **219건 (90.9% 통과)** | **목표(≥90%) 초과 달성** |
| **마지막 스텝 관찰 명시 (GC04)** | 0건 (0.0% 통과) | **241건 (100.0% 통과)** | **100% 전수 연결** |
| **문자열/HTML 엔티티 유출 (GC05)** | 216건 오염 | **0건 (100.0% 무결)** | **완전 제거 (0건)** |
| **스텝 수 적정성 (GC06)** | 241건 통과 | **241건 (100.0% 통과)** | **100% 통과** |
| **구체값 및 API 식별자 (GC07)** | 175건 (72.6% 통과) | **241건 (100.0% 통과)** | **100% 달성** |
| **3스텝 획일성 해소율** | 240건 (99.6%) | **164건 (68.05%)** | **목표(≤70%) 달성** |

### 1-2. 스텝 수 분포 최신화 (Step Distribution)

기존 241개 데모 중 240개가 복잡도와 무관하게 3개 스텝으로 강제 맞춰져 있던 획일적 구조를 해체하고, 실제 컴포넌트 조작 단계에 맞춰 2스텝~4스텝으로 최적화했습니다.

```text
Step 2 (관찰/선언형 데모) :  41건 ( 17.01% )  ■■■■
Step 3 (표준 조작 데모)   : 164건 ( 68.05% )  ■■■■■■■■■■■■■■
Step 4 (심화 복합 흐름)   :  36건 ( 14.94% )  ■■■
총합                     : 241건 (100.00% )
```

---

## 2. Monorepo Verification & Audit Results (모노레포 전수 검증 결과)

가이드 현대화 및 스키마 확장이 모노레포 전체 시스템에 미치는 영향을 전수 검증하였으며, 타입 체커, 단위/통합 테스트, 빌드 파이프라인에서 단 하나의 오류나 회귀 없이 100% 성공을 확인했습니다.

### 2-1. 정합성 검증 규칙 (GC01 ~ GC07) 요약 매트릭스

| 규칙 ID | 규칙 명칭 | 심각도 | 위반 건수 | 통과 건수 | 최종 통과율 | 수용 기준 (M5) | 판정 |
|---|---|---|---:|---:|---:|---|---|
| **GC01** | 템플릿 지문 금지 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |
| **GC02** | 스텝 제목 중복 금지 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |
| **GC03** | UI 라벨 인용 | `warn` | 22 | 219 | **90.9%** | ≥ 90.0% | **PASS** |
| **GC04** | 마지막 스텝 관찰 명시 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |
| **GC05** | 문자열/엔티티 유출 방지 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |
| **GC06** | 스텝 수 적정성 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |
| **GC07** | 구체값/식별자 포함 | `error` | 0 | 241 | **100.0%** | 0건 (100%) | **PASS** |

### 2-2. 카테고리별 검증 결과

| 카테고리 | 전체 데모 | 유효 데모 | GC01 | GC02 | GC03 (통과율) | GC04 | GC05 | GC06 | GC07 | 최종 통과율 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `1-getting-started` | 25 | 25 | 0 | 0 | 3 (88.0%) | 0 | 0 | 0 | 0 | **100.0%** |
| `2-guides` | 77 | 77 | 0 | 0 | 8 (89.6%) | 0 | 0 | 0 | 0 | **100.0%** |
| `3-api-reference` | 135 | 135 | 0 | 0 | 11 (91.9%) | 0 | 0 | 0 | 0 | **100.0%** |
| `5-architecture` | 4 | 4 | 0 | 0 | 0 (100.0%) | 0 | 0 | 0 | 0 | **100.0%** |
| **전체 합계** | **241** | **241** | **0** | **0** | **22 (90.9%)** | **0** | **0** | **0** | **0** | **100.0%** |

### 2-3. 파이프라인 검증 상세

1. **타입 무결성 검증 (`pnpm check-types`)**
   - 대상: 모노레포 9개 패키지 전량 (`@study/demo-baseline`, `@study/demo-cache-components`, `@study/demo-kit`, `@study/demos`, `@study/docs`, `@study/docs-render`, `@study/shell`, `@study/test-suite`, `@study/ui`)
   - 결과: **9/9 패키지 0 Error 통과** (`tsc --noEmit` 클린 통과).

2. **자동화 테스트 스위트 (`pnpm test`)**
   - 대상: Manifest 무결성, Static Literal 검사, Guide Consistency, Tier 1~5 테스트
   - 결과: **716/716 테스트 케이스 100% 통과 (0 Failure)**.

3. **프로덕션 빌드 검증 (`pnpm build`)**
   - 대상: `demo-baseline`, `demo-cache-components`, `shell`, `docs-render`, `docs` (총 5개 타깃)
   - 결과: **5/5 타깃 성공 (정적 페이지 812개 및 동적 Route Handler 100% 정상 생성, 25.44s 소요)**.

---

## 3. T2-b Backlog Inventory & Classification (241개 데모 심층 실습 분류)

가이드가 정직하고 명확해짐에 따라, 실습 화면(Tier 2 `DemoPlaygroundCard`)의 실제 인터랙션 완성도와 3단 검증 패널(Tier 3 `ExpectedActualPanel`)의 깊이가 투명하게 드러났습니다.

전체 241개 데모를 4개 등급(Grade A~D)과 검증 패널 연동 깊이, 그리고 Phase 2 보강 우선순위(P0/P1/P2)로 분류한 전수 인벤토리입니다.

### 3-1. 실습 완성도 등급 체계

| 등급 | 정의 | 조건 | 건수 | 비율 |
|---|---|---|---:|---:|
| **Grade A** (풍부한 실습) | 실제 Server Action, 서브 라우트, RPC 통신 완비 | 상호작용 요소 ≥ 3개, LOC ≥ 100 | **65** | 27.0% |
| **Grade B** (표준 인터랙션) | 클라이언트 상태 전이 및 UI 파라미터 조작 구현 | 상호작용 요소 1~2개, LOC ≥ 80 | **54** | 22.4% |
| **Grade C** (단순 시뮬레이션) | 단순 `useState` 토글 또는 텍스트 모의 변경 | 상호작용 요소 1개, LOC < 80 | **74** | 30.7% |
| **Grade D** (선언형/정적 코드) | 순수 CSS/메타데이터/설정 선언 화면 | 상호작용 요소 0개 | **48** | 19.9% |

### 3-2. 241개 데모 전수 인벤토리 목록

| # | 카테고리 | 데모 URL | 스텝 수 | 요소 수 | LOC | T2 등급 | T3 검증 깊이 | 우선순위 | Phase 2 기술 고도화 설계 (Blueprint) |
|---|---|---|---:|---:|---:|:---:|---|:---:|---|
| 1 | `2-guides` | `server-actions/basic` | 4 | 3 | 269 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 2 | `1-getting-started` | `caching/basic` | 3 | 2 | 247 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 3 | `1-getting-started` | `layouts-and-pages/nested-layouts` | 3 | 2 | 518 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 4 | `1-getting-started` | `layouts-and-pages/template-lifecycle` | 3 | 3 | 348 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 5 | `1-getting-started` | `layouts-and-pages/route-groups-layouts` | 3 | 4 | 378 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 6 | `1-getting-started` | `linking-and-navigating/soft-navigation` | 4 | 4 | 484 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 7 | `1-getting-started` | `linking-and-navigating/router-prefetch` | 4 | 4 | 407 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 8 | `1-getting-started` | `server-client-components/composition` | 3 | 1 | 318 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 9 | `1-getting-started` | `server-client-components/serialization` | 2 | 1 | 294 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 10 | `1-getting-started` | `fetching-data/parallel-fetching` | 3 | 2 | 407 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 11 | `1-getting-started` | `fetching-data/use-promise-streaming` | 3 | 0 | 314 | **D** | Static Verification Sync | **P1** | 실제 폼 인터랙션 및 비동기 스트리밍 청크 로딩 시각화 컴포넌트 추가 |
| 12 | `1-getting-started` | `mutating-data/server-action-revalidate` | 4 | 3 | 359 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 13 | `1-getting-started` | `mutating-data/optimistic-cart` | 3 | 2 | 378 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 14 | `1-getting-started` | `revalidating/time-based-isr` | 3 | 1 | 287 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 15 | `1-getting-started` | `revalidating/tag-vs-path` | 4 | 3 | 375 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 16 | `1-getting-started` | `error-handling/segment-error` | 4 | 5 | 361 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 17 | `1-getting-started` | `error-handling/global-error` | 3 | 3 | 336 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 18 | `1-getting-started` | `css/tailwind-v4` | 4 | 5 | 331 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 19 | `1-getting-started` | `css/css-modules` | 3 | 2 | 274 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 20 | `1-getting-started` | `images/image-optimization` | 3 | 2 | 270 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 21 | `1-getting-started` | `fonts/font-optimization` | 3 | 2 | 268 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 22 | `1-getting-started` | `metadata-and-og-images/static-and-dynamic-metadata` | 4 | 3 | 344 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 23 | `1-getting-started` | `metadata-and-og-images/opengraph-image` | 3 | 3 | 350 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 24 | `1-getting-started` | `route-handlers/rest-api-crud` | 4 | 4 | 364 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 25 | `1-getting-started` | `route-handlers/streaming-sse` | 3 | 2 | 348 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 26 | `1-getting-started` | `proxy/rewrite-and-headers` | 4 | 5 | 344 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 27 | `2-guides` | `guides/streaming-nested` | 3 | 0 | 302 | **D** | Static Verification Sync | **P1** | 실제 폼 인터랙션 및 비동기 스트리밍 청크 로딩 시각화 컴포넌트 추가 |
| 28 | `2-guides` | `guides/server-actions-advanced` | 3 | 2 | 290 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 29 | `2-guides` | `guides/swr-polling` | 4 | 2 | 289 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 30 | `2-guides` | `guides/lazy-loading-chart` | 3 | 1 | 252 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 31 | `2-guides` | `guides/auth-session` | 4 | 3 | 329 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 32 | `3-api-reference` | `file-conventions/parallel-routes` | 3 | 0 | 682 | **A** | Static Verification Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 33 | `3-api-reference` | `file-conventions/intercepting-routes` | 4 | 4 | 607 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 34 | `3-api-reference` | `components/form-component` | 3 | 2 | 216 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 35 | `5-architecture` | `architecture/fast-refresh-boundary` | 4 | 5 | 297 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 36 | `2-guides` | `guides/rendering-philosophy/server-vs-client` | 3 | 1 | 181 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 37 | `2-guides` | `guides/server-and-client-boundary/children-slot` | 3 | 1 | 176 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 38 | `2-guides` | `guides/how-revalidation-works/swr-flow` | 4 | 3 | 177 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 39 | `2-guides` | `guides/caching-legacy/fetch-cache` | 3 | 0 | 168 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 40 | `2-guides` | `guides/streaming/chunk-loading` | 3 | 1 | 179 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 41 | `2-guides` | `guides/isr/time-isr-60s` | 3 | 0 | 169 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 42 | `2-guides` | `guides/isr-cache-components/cache-life-hours` | 3 | 0 | 166 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 43 | `2-guides` | `guides/migrating-cache-components/unstable-to-use-cache` | 3 | 2 | 172 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 44 | `2-guides` | `guides/adopting-partial-prefetching/hover-shell` | 3 | 0 | 168 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 45 | `2-guides` | `guides/auth-cache-components/static-layout-session-context` | 2 | 0 | 163 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 46 | `2-guides` | `guides/forms/use-action-state-errors` | 4 | 3 | 280 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 47 | `2-guides` | `guides/forms/use-form-status-spinner` | 4 | 3 | 248 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 48 | `2-guides` | `guides/server-actions/start-transition` | 3 | 1 | 184 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 49 | `2-guides` | `guides/swr/mutation-optimistic` | 4 | 3 | 306 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 50 | `2-guides` | `guides/tanstack-query/infinite-scroll` | 3 | 1 | 176 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 51 | `2-guides` | `guides/redirecting/order-complete` | 3 | 1 | 168 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 52 | `2-guides` | `guides/draft-mode/preview-toggle` | 3 | 1 | 179 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 53 | `2-guides` | `guides/prefetching/viewport-vs-hover` | 2 | 0 | 168 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 54 | `3-api-reference` | `file-conventions/layout/root-and-nested` | 3 | 1 | 179 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 55 | `3-api-reference` | `file-conventions/loading/skeleton-boundary` | 3 | 2 | 306 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 56 | `3-api-reference` | `file-conventions/not-found/missing-product-404` | 4 | 4 | 291 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 57 | `3-api-reference` | `components/image/responsive-sizes` | 3 | 2 | 177 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 58 | `2-guides` | `guides/rendering-philosophy/hydration-boundary` | 3 | 1 | 162 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 59 | `2-guides` | `guides/server-and-client-boundary/props-serialization` | 2 | 0 | 156 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 60 | `2-guides` | `guides/how-revalidation-works/ondemand-sync` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 61 | `2-guides` | `guides/caching-legacy/segment-revalidate` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 62 | `2-guides` | `guides/isr/revalidate-path-sync` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 63 | `2-guides` | `guides/isr-cache-components/precision-tag-purge` | 4 | 2 | 171 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 64 | `2-guides` | `guides/migrating-cache-components/cache-key-compare` | 3 | 3 | 340 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 65 | `2-guides` | `guides/auth-cache-components/private-cache-user` | 3 | 2 | 167 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 66 | `2-guides` | `guides/tanstack-query/ssr-hydration` | 3 | 1 | 267 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 67 | `2-guides` | `guides/redirecting/session-expired` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 68 | `2-guides` | `guides/draft-mode/bypass-cookie` | 3 | 1 | 202 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 69 | `2-guides` | `guides/prefetching/custom-prefetch-false` | 3 | 3 | 277 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 70 | `2-guides` | `guides/optimizing-prefetching/bandwidth-saver` | 2 | 0 | 161 | **D** | Static Verification Sync | **P1** | 실제 폼 인터랙션 및 비동기 스트리밍 청크 로딩 시각화 컴포넌트 추가 |
| 71 | `2-guides` | `guides/instant-navigation/loading-skeleton` | 3 | 2 | 165 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 72 | `2-guides` | `guides/instant-navigation/router-cache-back` | 4 | 2 | 294 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 73 | `2-guides` | `guides/lazy-loading/modal-dynamic` | 3 | 2 | 174 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 74 | `2-guides` | `guides/preserving-ui-state/drawer-open` | 3 | 1 | 165 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 75 | `2-guides` | `guides/preserving-ui-state/scroll-retention` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 76 | `2-guides` | `guides/preventing-flash/darkmode-script` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 77 | `2-guides` | `guides/view-transitions/zoom-card` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 78 | `2-guides` | `guides/css-in-js/style-registry` | 2 | 0 | 155 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 79 | `2-guides` | `guides/sass/promotions-theme` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 80 | `2-guides` | `guides/authentication/middleware-guard` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 81 | `2-guides` | `guides/authentication/rsc-user-profile` | 3 | 0 | 162 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 82 | `2-guides` | `guides/data-security/server-only-guard` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 83 | `2-guides` | `guides/data-security/react-taint-api` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 84 | `2-guides` | `guides/content-security-policy/nonce-injection` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 85 | `2-guides` | `guides/environment-variables/public-vs-server` | 2 | 0 | 161 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 86 | `2-guides` | `guides/environment-variables/runtime-env` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 87 | `2-guides` | `guides/json-ld/product-schema` | 2 | 0 | 161 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 88 | `2-guides` | `guides/interactive-apps/multi-filter-widget` | 3 | 1 | 171 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 89 | `2-guides` | `guides/scripts/strategy-order` | 2 | 0 | 156 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 90 | `2-guides` | `guides/scripts/pg-sdk-onload` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 91 | `2-guides` | `guides/mdx/product-tech-doc` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 92 | `2-guides` | `guides/mdx/custom-component-slot` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 93 | `2-guides` | `guides/third-party-libraries/google-analytics` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 94 | `2-guides` | `guides/third-party-libraries/youtube-embed` | 2 | 0 | 161 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 95 | `2-guides` | `guides/bff/order-aggregation` | 3 | 1 | 170 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 96 | `2-guides` | `guides/bff/response-shaping` | 2 | 0 | 161 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 97 | `2-guides` | `guides/pwas/app-install-prompt` | 3 | 1 | 164 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 98 | `2-guides` | `guides/i18n/subpath-routing` | 3 | 3 | 168 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 99 | `2-guides` | `guides/i18n/dictionary-translation` | 3 | 2 | 173 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 100 | `2-guides` | `guides/multi-tenant/subdomain-tenant` | 3 | 2 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 101 | `2-guides` | `guides/multi-tenant/isolated-branding` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 102 | `2-guides` | `guides/multi-zones/cross-zone-routing` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 103 | `2-guides` | `guides/instrumentation/server-register-hook` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 104 | `2-guides` | `guides/opentelemetry/trace-span` | 2 | 0 | 156 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 105 | `2-guides` | `guides/static-exports/client-routing` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 106 | `2-guides` | `guides/static-exports/ssg-catalog` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 107 | `2-guides` | `guides/public-pages/terms-ssg` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 108 | `2-guides` | `guides/analytics/custom-beacon` | 3 | 1 | 163 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 109 | `2-guides` | `guides/videos/lazy-video-player` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 110 | `3-api-reference` | `file-conventions/layout/state-preservation` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 111 | `3-api-reference` | `file-conventions/layout/dynamic-category-layout` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 112 | `3-api-reference` | `file-conventions/page/static-and-dynamic` | 3 | 0 | 171 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 113 | `3-api-reference` | `file-conventions/page/react-19-use-params` | 3 | 5 | 257 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 114 | `3-api-reference` | `file-conventions/loading/nested-segment-loading` | 2 | 0 | 161 | **D** | Static Verification Sync | **P1** | 실제 폼 인터랙션 및 비동기 스트리밍 청크 로딩 시각화 컴포넌트 추가 |
| 115 | `3-api-reference` | `file-conventions/error/payment-error-boundary` | 3 | 5 | 294 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 116 | `3-api-reference` | `file-conventions/error/reset-recovery` | 3 | 1 | 168 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 117 | `3-api-reference` | `file-conventions/not-found/programmatic-not-found` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 118 | `3-api-reference` | `file-conventions/template/remount-lifecycle` | 3 | 8 | 326 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 119 | `3-api-reference` | `file-conventions/template/input-reset-animation` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 120 | `3-api-reference` | `file-conventions/default/parallel-fallback` | 3 | 2 | 208 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 121 | `3-api-reference` | `file-conventions/default/hard-reload-restore` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 122 | `3-api-reference` | `file-conventions/route/rest-api-orders` | 3 | 7 | 434 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 123 | `3-api-reference` | `file-conventions/route/webhook-signature` | 3 | 2 | 370 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 124 | `3-api-reference` | `file-conventions/route/sse-stock-stream` | 3 | 2 | 410 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 125 | `3-api-reference` | `file-conventions/route-groups/group-url-isolation` | 3 | 6 | 381 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 126 | `3-api-reference` | `file-conventions/route-groups/shop-vs-admin-roots` | 2 | 0 | 165 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 127 | `3-api-reference` | `file-conventions/dynamic-segments/single-param` | 3 | 3 | 344 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 128 | `3-api-reference` | `file-conventions/dynamic-segments/catch-all-slug` | 3 | 7 | 346 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 129 | `3-api-reference` | `file-conventions/dynamic-segments/optional-catch-all` | 3 | 6 | 346 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 130 | `3-api-reference` | `file-conventions/parallel-routes/conditional-slot` | 2 | 0 | 268 | **A** | Static Verification Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 131 | `3-api-reference` | `file-conventions/parallel-routes/independent-tabs` | 2 | 0 | 163 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 132 | `3-api-reference` | `file-conventions/intercepting-routes/direct-vs-modal` | 2 | 0 | 165 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 133 | `3-api-reference` | `file-conventions/mdx-components/global-mdx-theme` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 134 | `3-api-reference` | `file-conventions/instrumentation/server-boot-log` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 135 | `3-api-reference` | `file-conventions/instrumentation/client-timing-metrics` | 2 | 0 | 161 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 136 | `3-api-reference` | `file-conventions/proxy/gateway-router` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 137 | `3-api-reference` | `file-conventions/forbidden/admin-role-403` | 3 | 3 | 225 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 138 | `3-api-reference` | `file-conventions/unauthorized/anonymous-401` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 139 | `3-api-reference` | `file-conventions/metadata-app-icons/dynamic-favicon` | 2 | 0 | 262 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 140 | `3-api-reference` | `file-conventions/metadata-manifest/dynamic-pwa-manifest` | 2 | 0 | 214 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 141 | `3-api-reference` | `file-conventions/metadata-og/discount-banner-og` | 2 | 0 | 264 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 142 | `3-api-reference` | `file-conventions/metadata-robots/dynamic-crawler-rules` | 2 | 0 | 215 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 143 | `3-api-reference` | `file-conventions/metadata-sitemap/split-index-sitemaps` | 2 | 0 | 259 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 144 | `3-api-reference` | `file-conventions/route-segment-config/dynamic-params-toggle` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 145 | `3-api-reference` | `file-conventions/route-segment-config/instant-prefetch` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 146 | `3-api-reference` | `file-conventions/route-segment-config/max-duration-timeout` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 147 | `3-api-reference` | `file-conventions/route-segment-config/runtime-nodejs-edge` | 2 | 0 | 165 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 148 | `3-api-reference` | `components/image/blur-placeholder` | 3 | 1 | 171 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 149 | `3-api-reference` | `components/image/priority-lcp-preload` | 3 | 2 | 284 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 150 | `3-api-reference` | `components/link/soft-navigation-scroll` | 3 | 4 | 168 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 151 | `3-api-reference` | `components/link/prefetch-options` | 3 | 3 | 166 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 152 | `3-api-reference` | `components/font/google-variable-tokens` | 3 | 3 | 283 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 153 | `3-api-reference` | `components/font/local-font-face` | 3 | 2 | 265 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 154 | `3-api-reference` | `components/script/loading-strategies` | 3 | 1 | 227 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 155 | `3-api-reference` | `components/script/pg-sdk-onload` | 3 | 2 | 291 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 156 | `3-api-reference` | `functions/use-router/push-replace` | 3 | 3 | 242 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 157 | `3-api-reference` | `functions/use-router/refresh-server-sync` | 2 | 1 | 172 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 158 | `3-api-reference` | `functions/use-pathname/active-link` | 3 | 1 | 228 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 159 | `3-api-reference` | `functions/use-params/client-id` | 3 | 2 | 170 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 160 | `3-api-reference` | `functions/use-search-params/filter-parsing` | 3 | 3 | 247 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 161 | `3-api-reference` | `functions/use-search-params/debounce-transition` | 3 | 1 | 178 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 162 | `3-api-reference` | `functions/use-selected-layout-segment/subnav-pill` | 3 | 1 | 173 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 163 | `3-api-reference` | `functions/use-selected-layout-segments/breadcrumb` | 2 | 0 | 166 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 164 | `3-api-reference` | `functions/cache-life/preset-profiles` | 3 | 3 | 172 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 165 | `3-api-reference` | `functions/cache-life/custom-profile` | 3 | 1 | 255 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 166 | `3-api-reference` | `functions/cache-tag/multi-tag-binding` | 2 | 0 | 165 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 167 | `3-api-reference` | `functions/cache-tag/cascade-invalidation` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 168 | `3-api-reference` | `functions/unstable-cache/db-query` | 3 | 2 | 290 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 169 | `3-api-reference` | `functions/unstable-no-store/dynamic-bailout` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 170 | `3-api-reference` | `functions/revalidate-path/page-vs-layout` | 3 | 2 | 169 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 171 | `3-api-reference` | `functions/revalidate-path/dynamic-route` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 172 | `3-api-reference` | `functions/revalidate-tag/basic-tag-purge` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P0** | 네트워크 지연/에러 시뮬레이션 및 낙관적 UI / 캐시 태그 무효화 심화 실습 확장 |
| 173 | `3-api-reference` | `functions/revalidate-tag/max-expiration` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 174 | `3-api-reference` | `functions/update-tag/instant-memory-sync` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 175 | `3-api-reference` | `functions/fetch-extended/revalidate-option` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 176 | `3-api-reference` | `functions/fetch-extended/tag-option` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 177 | `3-api-reference` | `functions/cookies/get-set-session` | 3 | 1 | 214 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 178 | `3-api-reference` | `functions/cookies/delete-logout` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 179 | `3-api-reference` | `functions/headers/user-agent-device` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 180 | `3-api-reference` | `functions/headers/custom-auth-token` | 2 | 0 | 157 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 181 | `3-api-reference` | `functions/draft-mode/enable-preview` | 3 | 1 | 166 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 182 | `3-api-reference` | `functions/draft-mode/disable-preview` | 3 | 1 | 165 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 183 | `3-api-reference` | `functions/after/background-logging` | 3 | 1 | 226 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 184 | `3-api-reference` | `functions/after/analytics-batch` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 185 | `3-api-reference` | `functions/not-found/trigger-404` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 186 | `3-api-reference` | `functions/forbidden/trigger-403` | 3 | 3 | 221 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 187 | `3-api-reference` | `functions/unauthorized/trigger-401` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 188 | `3-api-reference` | `functions/redirect/action-303` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 189 | `3-api-reference` | `functions/redirect/handler-307` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 190 | `3-api-reference` | `functions/permanent-redirect/seo-308` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 191 | `3-api-reference` | `functions/next-request/geo-ip-parsing` | 3 | 1 | 336 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 192 | `3-api-reference` | `functions/next-response/json-builder` | 3 | 1 | 308 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 193 | `3-api-reference` | `functions/next-response/rewrite-virtual` | 3 | 1 | 278 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 194 | `3-api-reference` | `functions/image-response/og-badge` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 195 | `3-api-reference` | `functions/image-response/dynamic-receipt` | 2 | 0 | 162 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 196 | `3-api-reference` | `functions/generate-metadata/dynamic-title` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 197 | `3-api-reference` | `functions/generate-metadata/parent-inheritance` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 198 | `3-api-reference` | `functions/generate-static-params/basic-ssg` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 199 | `3-api-reference` | `functions/generate-static-params/multiple-segments` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 200 | `3-api-reference` | `functions/connection/request-signal` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 201 | `3-api-reference` | `functions/taint-unique-value/block-secret` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 202 | `3-api-reference` | `functions/server-runtime/edge-vs-nodejs` | 2 | 0 | 162 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 203 | `3-api-reference` | `functions/use-report-web-vitals/telemetry` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 204 | `2-guides` | `functions/use-server-inserted-html/head-style` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 205 | `3-api-reference` | `directives/use-client/boundary-declaration` | 2 | 0 | 192 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 206 | `3-api-reference` | `directives/use-client/window-storage-access` | 3 | 2 | 233 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 207 | `3-api-reference` | `directives/use-server/file-level-action` | 3 | 2 | 263 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 208 | `3-api-reference` | `directives/use-server/inline-action-closure` | 3 | 2 | 217 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 209 | `3-api-reference` | `directives/use-cache/function-cache` | 3 | 2 | 293 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 210 | `3-api-reference` | `directives/use-cache/component-jsx-cache` | 3 | 2 | 292 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 211 | `3-api-reference` | `directives/use-cache/private-profile-cache` | 2 | 0 | 158 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 212 | `3-api-reference` | `directives/use-cache/remote-redis-cache` | 3 | 2 | 291 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 213 | `3-api-reference` | `config/base-path/subpath-routing` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 214 | `3-api-reference` | `config/asset-prefix/cdn-distribution` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 215 | `3-api-reference` | `config/redirects/regex-pattern-matching` | 3 | 5 | 257 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 216 | `3-api-reference` | `config/redirects/header-query-condition` | 2 | 0 | 160 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 217 | `3-api-reference` | `config/rewrites/cross-zone-proxy` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 218 | `3-api-reference` | `config/rewrites/query-param-rewrite` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 219 | `3-api-reference` | `config/headers/global-security-headers` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P1** | 클라이언트 인터랙션 파라미터 제어 및 실시간 반응형 검증 패널 보강 |
| 220 | `3-api-reference` | `config/trailing-slash/url-normalization` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 221 | `3-api-reference` | `config/images/remote-patterns-security` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 222 | `3-api-reference` | `config/images/formats-avif-webp` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 223 | `3-api-reference` | `config/logging/fetches-full-url` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 224 | `3-api-reference` | `config/dev-indicators/render-badge` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 225 | `3-api-reference` | `config/env/build-time-injection` | 3 | 5 | 257 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 226 | `3-api-reference` | `config/cross-origin/anonymous-mode` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 227 | `3-api-reference` | `config/powered-by-header/hide-x-powered` | 3 | 5 | 251 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 228 | `3-api-reference` | `config/cache-components/enable-flag` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 229 | `3-api-reference` | `config/cache-life/custom-presets` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 230 | `3-api-reference` | `config/cache-handlers/redis-kv` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 231 | `3-api-reference` | `config/expire-time/memory-isr-tuning` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 232 | `3-api-reference` | `config/stale-times/router-cache-tuning` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 233 | `3-api-reference` | `config/output/standalone-container` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 234 | `3-api-reference` | `config/output/export-static-spa` | 3 | 5 | 252 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 235 | `3-api-reference` | `edge/v8-lightweight/global-web-apis` | 2 | 0 | 157 | **D** | Static Verification Sync | **P0** | 실제 Server Action / 서브 라우트 / 미들웨어 리다이렉트 연동 및 실시간 상태 동기화 구축 |
| 236 | `3-api-reference` | `edge/v8-lightweight/nodejs-modules-bailout` | 3 | 5 | 256 | **A** | Dynamic State Sync | **P1** | 기존 고도화된 실습 유지 및 3단 검증 패널 실시간 메트릭 모니터링 강화 |
| 237 | `5-architecture` | `architecture/accessibility/form-aria-support` | 3 | 1 | 167 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 238 | `5-architecture` | `architecture/accessibility/modal-focus-trap` | 3 | 2 | 172 | **B** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 239 | `5-architecture` | `architecture/compiler-optimization/react-compiler` | 4 | 5 | 258 | **A** | Dynamic State Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 240 | `3-api-reference` | `architecture/server-action-security/csrf-protection` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |
| 241 | `3-api-reference` | `architecture/turbopack/incremental-harness` | 2 | 0 | 157 | **D** | Static Verification Sync | **P2** | 선언적 메타데이터/CSS/설정 검증 중심 정적 실습 및 2단계 관찰 가이드 유지 |

---

## 4. Prioritized Roadmap for Phase 2 Interactive Extensions (우선순위 로드맵)

### 4-1. 우선순위 산정 기준 (Scoring Matrix)

우선순위는 **학습 영향도(Learning Impact) × Next.js 핵심 기능 중요도(Core Importance) × 현재 실습 실체 결손도(Fidelity Gap)**의 3축 매트릭스로 산출되었습니다.

- **P0 (Critical Backlog - 19건)**: 클라이언트 가짜 목(`useState`)으로 처리되어 실제 서버 런타임 동작(미들웨어 리다이렉트, Server Action RPC, 캐시 태그 무효화, 에러 바운더리)을 체감하기 어려운 핵심 기능. 최우선 실제 코드로 전환 필요.
- **P1 (Medium Backlog - 46건)**: 클라이언트 인터랙션이 존재하나 지연 시간 시뮬레이션, 스트리밍 청크 제어, 폼 유효성 에러 바운더리 등 심화 파라미터 제어가 필요한 데모.
- **P2 (Standard / Declarative - 176건)**: 선언적 메타데이터, 순수 CSS 모듈, robots.txt 등 정적 스펙 자체가 본질인 데모. 2스텝 관찰 가이드로 완결.

### 4-2. P0 핵심 고도화 대상 상세 설계 (Critical Technical Blueprints)

다음 19개 P0 데모는 Phase 2에서 실제 Next.js 서버/네트워크 파이프라인으로 전환을 추진합니다.

1. `guides/authentication/middleware-guard`
   - **현재 상태**: `useState`로 텍스트만 토글 (규칙 24 위반).
   - **Phase 2 설계**: 실제 `middleware.ts`에서 `auth-token` 쿠키를 검사하고, 미인증 시 `/login?from=...`으로 307 Redirect를 트리거하는 실제 보호 라우트 구축.
2. `guides/server-actions/start-transition`
   - **현재 상태**: 단일 버튼 클릭 시 단순 상태 변경.
   - **Phase 2 설계**: 1500ms 인위적 서버 지연을 가진 Server Action을 `startTransition`으로 감싸고, 전환 진행 중에도 입력창 타이핑이 끊기지 않는 논블로킹 UI 우선순위 실증.
3. `guides/draft-mode/bypass-cookie`
   - **현재 상태**: 로컬 플래그 토글.
   - **Phase 2 설계**: Route Handler에서 `draftMode().enable()`로 실제 `__prerender_bypass` 암호화 쿠키를 발급받고, Static Cache가 실시간 CMS 초안 데이터로 바이패스되는 파이프라인 구축.
4. `edge/v8-lightweight/nodejs-modules-bailout`
   - **현재 상태**: 단순 텍스트 안내.
   - **Phase 2 설계**: `runtime = 'edge'` 환경에서 `node:fs`, `node:crypto` 등 Node.js 전용 모듈 호출 시 빌드/런타임 Bailout 에러가 발생하는 인터랙티브 디버거 구축.
5. `guides/multi-tenant/subdomain-tenant`
   - **현재 상태**: 하드코딩된 테넌트 탭.
   - **Phase 2 설계**: `middleware.ts`에서 `request.headers.get('host')`를 파싱하여 서브도메인별로 `/tenants/[tenantId]`로 자동 리라이트하는 다중 테넌트 격리 실습.
6. `file-conventions/default/parallel-fallback`
   - **현재 상태**: 정적 슬롯 표시.
   - **Phase 2 설계**: 병렬 슬롯 A에서 라우트 이동 후 하드 새로고침 시 슬롯 B의 `default.tsx`가 404 없이 정상 복원되는 실제 브라우저 네비게이션 시뮬레이터.
7. `file-conventions/intercepting-routes/direct-vs-modal`
   - **현재 상태**: 모달 뷰 흉내.
   - **Phase 2 설계**: 실제 `(..)items/[id]` 인터셉트 라우트를 구성하여 소프트 네비게이션 시 모달, F5 새로고침 시 단독 상세 페이지로 분기되는 실제 라우팅 구현.
8. `functions/revalidateTag/batch-invalidation`
   - **현재 상태**: 로컬 카운트 증가.
   - **Phase 2 설계**: 다중 캐시 태그(`cart`, `user`, `recommend`)를 바인딩하고 `revalidateTag()` 호출 시 지정된 엔트리만 서버 Data Cache에서 선별 파기되는 실시간 캐시 뷰어.

---

## 5. Architecture & Golden Standards Adherence Guide (아키텍처 및 골든 표준)

향후 신규 데모 추가 및 Phase 2 실습 고도화 시 반드시 준수해야 하는 골든 표준 규약입니다.

### 5-1. 골든 샘플 (Golden Samples)

- **UI 인터랙션 골든 샘플**: `mutating-data/optimistic-cart`
  - `useOptimistic`의 0ms 즉시 반영과 800ms 백그라운드 Server Action 완료 시점의 서버 확정 전환을 완벽하게 동기화.
- **REST API 골든 샘플**: `route-handlers/rest-api-crud`
  - GET/POST/PATCH/DELETE 4대 메서드와 실제 200/201 상태 코드 및 JSON 페이로드를 즉각 대조.
- **레이아웃 골든 샘플**: `layouts-and-pages/nested-layouts`
  - 상위 GNB의 검색어 상태 보존과 하위 `{children}` 슬롯의 부분 렌더링(Partial Rendering)을 시각적으로 실증.

### 5-2. 4단 표준 레이아웃 아키텍처 규칙

```text
┌─────────────────────────────────────────────────────────────┐
│ 1단. DemoGuideCard (실행 절차, UI 라벨 인용, 관찰 포인트)    │
├─────────────────────────────────────────────────────────────┤
│ 2단. DemoPlaygroundCard (실제 인터랙티브 컴포넌트 실습 본체) │
├─────────────────────────────────────────────────────────────┤
│ 3단. ExpectedActualPanel (기대값 vs 실제값 실시간 대조)      │
├─────────────────────────────────────────────────────────────┤
│ 4단. DemoDeepDiveCard (5개 표준 기술 섹션 Deep Dive)         │
└─────────────────────────────────────────────────────────────┘
```

1. **규칙 23 (가이드 정합성)**: `DemoStep`의 제목은 화면의 실제 버튼/입력 라벨을 `[대괄호]`로 인용해야 하며, 마지막 스텝에는 반드시 `observe`와 `observeAt`을 지정해야 합니다.
2. **규칙 24 (실습 진실성)**: Next.js 프레임워크 기능을 가짜 `useState`나 `setTimeout` 문자열 변경으로 속이지 않고, 실제 Route Handler, Server Action, Middleware, CSS 토큰을 통해 동작시켜야 합니다.
3. **규칙 25 (4단 레이아웃 불변성)**: 모든 데모 페이지는 반드시 `DemoContainer` 내부에 1단~4단의 단방향 수직 계층 구조를 엄격히 준수해야 합니다.

---

## 6. 결론 (Conclusion)

Milestone M5 작업을 통해 **241개 Next.js 데모의 1단 가이드 전수 현대화가 완벽히 완료**되었습니다.
GC01~GC07 검사 100% 통과(GC03 90.9%), 0건의 문자열 유출, 3스텝 획일성 탈피(68.05%), 9개 패키지 타입 체크 및 716개 테스트 전량 통과, 5개 빌드 타깃 100% 통과를 확인했습니다.

본 보고서에 수록된 **241개 데모 전수 실습 인벤토리 및 P0/P1/P2 로드맵**은 향후 Phase 2 대량 실습 확장 개발의 확고한 단일 진실 공급원(SSOT)으로 기능하게 됩니다.
