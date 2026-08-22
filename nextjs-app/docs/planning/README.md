# 데모 개발 페이즈별 그룹핑 및 실행 로드맵 (Planning Roadmap)

- 작성일: 2026-08-21
- 상위 기획: [08. 전체 목차 데모 기획 및 판정 매트릭스](../08-demo-planning-matrix.md)
- 근거 결정: [ADR 0007 이커머스 도메인 및 데모 단계화](../adr/0007-ecommerce-domain-and-demo-phasing.md)

---

## 1. 개요

전체 264편의 학습 문서 중 **데모 제작 대상 148편(총 241개 데모)**을 기능적 응집도와 학습 난이도에 따라 **5개 작업 페이즈(Phase)**로 분할하여 관리합니다.

각 페이즈 문서에는 각 목차별 데모의 URL, 소속 Zone, 이커머스 시나리오, 3단계 체험 절차 및 기대/실제 검증 기준이 상세히 정의되어 있습니다.

---

## 2. 페이즈 분할 목록

| 페이즈 | 대상 영역 | 문서 수 | 데모 수 | 주요 담당 기능 | 상세 문서 |
|---|---|---:|---:|---|---|
| **Phase 1** | **1. Getting Started** | 14편 | 25개 | App Router 기본 골격, 렌더링 합성, 라우팅 기초, 폼 및 기본 캐싱 | [phase-1-getting-started.md](./phase-1-getting-started.md) |
| **Phase 2** | **2. Guides** | 45편 | 77개 | 렌더링 심화, 스트리밍, ISR/use cache 심화, 인증/보안, SWR/TanStack Query | [phase-2-guides.md](./phase-2-guides.md) |
| **Phase 3** | **3.1 File Conventions & 3.2 Components** | 32편 | 54개 | 라우트 세그먼트 파일(layout, page, loading, error, slots) 및 빌트인 컴포넌트(Image, Form, Link) | [phase-3-api-conventions-components.md](./phase-3-api-conventions-components.md) |
| **Phase 4** | **3.3 Functions & 3.4 Directives** | 35편 | 54개 | 대표 네비게이션 훅(useRouter, useSearchParams), 캐시 함수(cacheTag, revalidateTag), use client/server/cache | [phase-4-api-functions-directives.md](./phase-4-api-functions-directives.md) |
| **Phase 5** | **3.5 Config, 3.8 Edge & 5. Architecture** | 22편 | 31개 | next.config.ts 런타임 설정(rewrites, redirects, images), Edge Runtime, SWC/Turbopack, 접근성(a11y) | [phase-5-api-config-architecture.md](./phase-5-api-config-architecture.md) |
| **합계** | **전체 5개 페이즈** | **148편** | **241개** | **이커머스 통합 플랫폼 실무 데모** | - |

---

## 3. 진행 워크플로우 (한 목차별 완료 루프)

각 페이즈 내에서 목차를 진행할 때는 아래의 **3단계 체크포인트 루프**를 엄격히 준수합니다:

```text
[목차 선택]
    ↓
1. 체크포인트 ①: 개념 핵심 요약 및 보완 해설 초안 검토 (사용자 이해 승인)
    ↓
2. 체크포인트 ②: 데모 화면/컴포넌트 개발 & 로컬 테스트 (ExpectedActualPanel 검증)
    ↓
3. 체크포인트 ③: demos.yaml 등록 (status: done) 및 사용자 최종 확인
    ↓
[다음 목차로 이동]
```

---

## 4. 컴포넌트 개발 & MCP 활용 원칙

1. **Next.js MCP(`next-devtools`) 상시 검증**:
   - 데모 개발 전/중에 `next-devtools` MCP(`nextjs_docs`, `nextjs_index`, `nextjs_call`)를 호출하여 `next@16.3.1` 공식 스펙 및 올바른 API 시그니처를 교차 검증합니다.
2. **단일 파일 250줄 제한 및 모듈별 분리**:
   - `page.tsx`: 100~150줄 내외의 고수준 조합 및 레이아웃 조립만 담당.
   - `actions.ts`: Server Actions 함수 분리.
   - `types.ts`: 비즈니스/아이템 데이터 인터페이스 분리.
   - `components/*.tsx`: 개별 위젯, 입력 폼, 리스트 아이템 컴포넌트 단위로 분리.
   - `hooks/*.ts`: 복잡한 클라이언트 상태 로직 분리.
3. **`@study/demo-kit` 재사용 극대화**:
   - `DemoContainer`, `ExpectedActualPanel`, `DemoResetButton`을 필수로 사용하여 중복 코드를 제거하고, 간결하고 유지보수하기 쉬운 데모 코드를 작성합니다.

