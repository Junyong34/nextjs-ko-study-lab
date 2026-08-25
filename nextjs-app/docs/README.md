# nextjs-app 설계 문서

Phase 2의 아키텍처 조사·설계 결과 및 ADR 기록입니다. 멀티 존 스켈레톤 및 컴포넌트 디렉토리 리팩토링이 완료되어 현재 코드베이스와 정합성을 유지합니다.

## 설계 문서

| # | 문서 | 내용 |
|---|---|---|
| 01 | [프로젝트 구성 방법 및 절차](./01-project-setup.md) | 워크스페이스 뼈대 → zone 생성 반복 절차 → 로컬 실행 → 첫 배포 검증. zone 추가 체크리스트 |
| 02 | [모노레포 구성 방식 조사와 선택](./02-monorepo-options.md) | 후보 6가지 비교, pnpm + Turborepo 선택 근거, 기각 사유, 재검토 조건 |
| 03 | [결합 구조 설계](./03-composition-architecture.md) | zone 배분, 라우팅 계약, 데모 지시자 파이프라인, 내비게이션, 함정 목록 |
| 04 | [설계 실현 가능성 검증](./04-feasibility-verification.md) | 01~03의 사실 주장을 `next@16.3.1` 1차 출처와 대조한 결과. **판정과 수정 내역** |
| 05 | [남은 설계 질문](./05-open-questions.md) | 아직 안 정한 것들. 착수 전에 정할 것과 진행하며 정해도 될 것 |
| 06 | [화면 구성과 UI 설계](./06-ui-and-screen-design.md) | 페이지 타입 5종, 랜딩·문서 페이지 구성, 헤더·검색 UI, UI 기반, 디자인 토큰 |
| 07 | [코드베이스 심층 분석 및 데이터 흐름 가이드](./07-codebase-deep-dive-guide.md) | 모노레포 파일 토폴로지, YAML 파이프라인, 패키지 격리 정책(규칙 17), 셸/데모 뼈대 네비게이션 |
| 08 | [전체 목차 데모 기획 및 판정 매트릭스](./08-demo-planning-matrix.md) | 264편 전체 1차 필터링, 예상 데모 수 산출, 4대 이커머스 시나리오 매핑, 대체 설명 가이드 |
| 09 | [데모 표준 구조 및 4단 레이아웃 패턴](./09-demo-standard-and-layout-pattern.md) | 실제 Next.js 파일 컨벤션/라우팅 원칙(No-Simulation) 및 fieldset 4단 표준 템플릿 |
| 10 | [Vercel 배포 계획](./10-vercel-deployment-plan.md) | zone당 프로젝트 분리, Related Projects로 `ZONE_*_URL`/`PUBLIC_ORIGIN` 프리뷰 문제 해결, Ignored Build Step·원격 캐시·첫 배포 검증 절차 |
| 14 | [가이드 정합성 감사 보고서](./14-demo-guide-audit-report.md) | GC01~GC07 규칙별 감사 수치와 카테고리 분포. `pnpm test:guide-audit`로 **자동 재생성**됨 |
| 14-T2b | [T2-b 실습 고도화 백로그 보고서](./14-demo-t2b-backlog-report.md) | 가이드 전수 현대화(M0~M5) 완료 보고와 T2-b 대상 241건 우선순위 로드맵. `scripts/generate-t2b-report.ts`로 **자동 재생성**됨 |

## ADR

| # | 결정 |
|---|---|
| [0001](./adr/0001-config-axis-as-app-boundary.md) | 전역 설정 충돌을 앱 경계로 삼고 Multi-Zones로 결합한다 |
| [0002](./adr/0002-pnpm-turborepo-catalog-pinning.md) | pnpm workspaces + Turborepo, 기준 버전은 catalog에 정확 고정 |
| [0003](./adr/0003-demo-directive-in-markdown.md) | 문서와 데모는 md 본문의 `demo` 코드펜스 지시자로 잇는다 *(0004가 범위를 좁힘)* |
| [0004](./adr/0004-demo-list-as-source-of-truth.md) | 데모의 원본은 `demos.yaml`이고, 본문 지시자는 임베드 위치만 정한다 |
| [0005](./adr/0005-hide-zone-from-learner-url.md) | 학습자 URL에서 zone을 감추고, 데모 앱 경로는 `/zone/*`으로 분리한다 |
| [0006](./adr/0006-shadcn-ui-as-ui-foundation.md) | UI 기반은 shadcn/ui로 하고, 문서 프레임워크는 쓰지 않는다 *(0003의 지시자 렌더 결과를 링크 카드로 바꿈)* |
| [0007](./adr/0007-ecommerce-domain-and-demo-phasing.md) | 데모는 이커머스 통합 컨셉과 하이브리드 플레이그라운드 구조를 따르고, 4단계 판정과 3단계 체크포인트로 검증한다 |

## 용어

- [데모 사이트 컨텍스트](../CONTEXT.md) — zone, 셸, 설정 축, 데모 지시자, 기준 버전
- [Context Map](../../CONTEXT-MAP.md) — 학습 문서 컨텍스트와의 관계

## 읽는 순서

처음 보는 사람은 **02 → 03 → 06 → 01** 순서를 권합니다. 왜 이렇게 나눴는지(02), 어떻게 합쳐지는지(03), 무엇이 그려지는지(06)를 이해한 뒤 절차(01)를 보면 각 단계의 이유가 이미 설명돼 있습니다.

04는 01~03을 `next@16.3.1` 소스·동봉 문서와 대조한 검증 기록입니다. **지적된 내용은 01~03에 이미 반영돼 있으므로** 착수하려는 사람이 따로 읽을 필요는 없습니다. 무엇이 왜 그렇게 정해졌는지 근거를 확인할 때 보세요.
