# nextjs-app 설계 문서

Phase 2 착수 **전**에 합의한 조사·설계 결과입니다. 아직 실행 코드는 없습니다.

## 설계 문서

| # | 문서 | 내용 |
|---|---|---|
| 01 | [프로젝트 구성 방법 및 절차](./01-project-setup.md) | 워크스페이스 뼈대 → zone 생성 반복 절차 → 로컬 실행 → 첫 배포 검증. zone 추가 체크리스트 |
| 02 | [모노레포 구성 방식 조사와 선택](./02-monorepo-options.md) | 후보 6가지 비교, pnpm + Turborepo 선택 근거, 기각 사유, 재검토 조건 |
| 03 | [결합 구조 설계](./03-composition-architecture.md) | zone 배분, 라우팅 계약, 데모 지시자 파이프라인, 내비게이션, 함정 목록 |

## ADR

| # | 결정 |
|---|---|
| [0001](./adr/0001-config-axis-as-app-boundary.md) | 전역 설정 충돌을 앱 경계로 삼고 Multi-Zones로 결합한다 |
| [0002](./adr/0002-pnpm-turborepo-catalog-pinning.md) | pnpm workspaces + Turborepo, 기준 버전은 catalog에 정확 고정 |
| [0003](./adr/0003-demo-directive-in-markdown.md) | 문서와 데모는 md 본문의 `demo` 코드펜스 지시자로 잇는다 |

## 용어

- [데모 사이트 컨텍스트](../CONTEXT.md) — zone, 셸, 설정 축, 데모 지시자, 기준 버전
- [Context Map](../../CONTEXT-MAP.md) — 학습 문서 컨텍스트와의 관계

## 읽는 순서

처음 보는 사람은 **02 → 03 → 01** 순서를 권합니다. 왜 이렇게 나눴는지(02), 어떻게 합쳐지는지(03)를 이해한 뒤 절차(01)를 보면 각 단계의 이유가 이미 설명돼 있습니다.
