# intent/ 폴더 규칙

사소한 오타·문구 수정을 제외한 변경은 코드를 만지기 전에 `intent → spec → plan`으로 먼저 합의한다. 작은 변경은 아래 통합 양식을 허용한다. [The AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)의 다섯 필드 intent 포맷과 단계별 산출물 흐름을 따른다. 브랜치 이름, PR 구성, 상태 관리와 간소화 예외는 이 저장소의 운영 규칙이다.

> **AI는 이 폴더 아래 문서를 자동으로 읽지 않는다.** 작업을 시작하기 전에 관련 `intent/<슬러그>/` 폴더를 직접 읽어야 한다. 루트 [`AGENTS.md`](../AGENTS.md#intent-기반-작업-흐름-intentspecplan)는 이 문서를 읽도록 안내하며, 상세 운영 규칙은 이 문서에서 관리한다.

새 작업을 시작하기 전에 [`intent/_example/`](./_example/intent.md)를 형식 참고용으로 먼저 읽는다. 실제 백로그 항목이 아니라 작성 방식을 보여주는 샘플이다.

## 구조

```
intent/
  README.md            # 이 파일 — 폴더 규칙, 기록별 기준과 작업 인덱스
  _templates/           # 새 슬러그 만들 때 복사해서 쓰는 템플릿
    intent.md
    spec.md
    plan.md
  _example/             # 작성 형식 샘플 (실제 작업 아님)
    intent.md
    spec.md
    plan.md
  기능-슬러그/           # 변경 하나당 폴더 하나 (예: ship-tracking)
    intent.md           # 왜 만드나 — PO 승인
    spec.md             # 무엇을 어떤 요구·설계로 — PO 승인
    plan.md             # 어디를 어떤 순서로, 무엇으로 검증 — 개발자 승인
```

## 규칙

1. **기본은 폴더당 intent·spec·plan 하나씩이다.** 작은 변경은 아래 통합 양식을 따른다. spec이 여러 개 필요할 정도로 범위가 커지면 intent를 나눈다.
2. **PR 하나는 하나의 승인 목적을 갖는다.** 주요 산출물과 함께 인덱스, 상태, 관련 문서의 동기화 변경을 포함할 수 있다. 승인자의 검토 후 머지한 기록이 승인 근거다.
3. 요청을 다루는 기존 작업이 없으면 `_example/`을 형식 참고용으로 읽고 `_templates/`를 `intent/<슬러그>/`로 복사해 `intent.md`부터 작성한 뒤 진행 여부를 사용자에게 확인한다. 이후 단계의 빈 템플릿은 `draft`로 두며 승인된 요구사항으로 취급하지 않는다. 읽기 전용 조사·검토는 승인 전에 가능하지만, 구현은 plan 승인 후 시작한다.
4. 작업 시작 시 폴더의 문서뿐 아니라 상태와 승인 기록을 확인한다. 파일이 있다는 이유만으로 다음 단계로 진행하지 않는다.

## 관련 문서 탐색

1. 사용자가 지정한 슬러그·문서를 우선 확인하고, 아래 작업 인덱스의 관련 기능·코드 경로로 후보를 찾는다.
2. 후보가 없거나 관련성이 불명확하면 `rg` 등으로 `intent/` 본문을 검색한다. 요청의 기능명뿐 아니라 라우트·컴포넌트명·파일 경로도 단서로 사용한다. `_templates/`, `_example/`은 실제 작업 후보에서 제외한다.
3. 관련 폴더의 모든 문서와 승인 기록을 읽고 현재 코드·운영 문서·ADR과 대조한다. 관련 후보가 여러 개면 요청 범위와 후속 작업 연결을 확인한다. 모든 intent를 매번 정독하지 않는다.
4. 기존 작업이 새 요청을 다루는지 판단한다. 완료된 intent는 과거 결정의 근거로 사용하며 새 요구사항은 새 슬러그로 만든다. 미승인 초안이나 이전 버전의 승인을 구현 근거로 사용하지 않는다.

## 단계와 승인

PO는 요구사항을 결정하는 사용자 또는 제품 책임자이며, 개발자는 구현·검증 계획을 승인하는 사람이다. 한 사람이 두 역할을 맡을 수 있다. AI가 작성한 문서를 AI가 스스로 승인하지 않는다.

각 브랜치는 앞 단계가 기본 브랜치에 머지된 뒤 최신 기본 브랜치에서 만든다.

| 브랜치 | 주요 산출물 | 승인자 | 다음 단계 진입 조건 |
|---|---|---|---|
| `intent/슬러그` | 문제·목표·범위를 담은 intent | PO | intent 검토 후 PR 머지 |
| `spec/슬러그` | 요구사항·설계·완료 기준을 담은 spec | PO | 구현을 막는 질문 해결 후 PR 머지 |
| `plan/슬러그` | 변경 파일·순서·검증·되돌리기 계획 | 개발자 | plan 검토 후 PR 머지 |
| `feature/슬러그` | 구현, 테스트, 검증 결과와 관련 문서 갱신 | 개발자, 요구사항 변경 시 PO도 검토 | 완료 기준과 필수 검증 충족 후 PR 머지 |

작은 변경은 PO가 통합 intent의 요구사항·설계·완료 기준까지 승인하면 `spec/슬러그`를 생략하고 `plan/슬러그`로 진행한다.

## 상태와 변경 관리

- 각 문서의 `Status`는 `draft`(검토 중), `approved`(해당 버전 승인), `done`(작업 완료)을 사용한다. `Approval`에는 승인 PR 링크를 기록한다. 승인자가 검토한 PR에 `approved`와 해당 PR 링크를 반영하되, **단계 진입 승인은 머지 전에는 효력이 없다.** 상태 문자열만으로 승인을 판단하지 않는다.
- 작업 인덱스의 Status는 문서별 상태와 구분한다. plan 승인 전은 `draft`, plan 승인 후 구현·검증 중은 `approved`, 구현 PR 머지 후는 `done`이다. 인덱스는 각 단계 PR에서 함께 갱신한다.
- 승인된 범위·요구사항·설계·완료 기준을 바꾸면 해당 문서와 영향받는 후속 문서를 `draft`로 되돌린다. `Approval`에 기존 기록이 이전 버전의 승인임을 표시하고, 변경 이유와 재승인 PR을 기록한다. 재승인 전에는 변경된 내용의 구현을 진행하지 않는다. 완료된 작업의 새 요구사항은 새 슬러그로 만든다.
- 예외적으로, 이미 plan이 승인된 작업에서 승인 범위 안의 구현 순서·파일 등만 달라지면 개발자가 변경 plan을 승인한 뒤 진행하고, plan과 구현을 같은 커밋에 반영한다. 승인 근거는 PR의 검토 기록 또는 명시적 승인 메시지 링크와 대상 커밋으로 남긴다. 요구사항까지 바뀌면 앞 항목의 재승인 절차를 따른다.
- 의미가 달라지지 않는 오타·링크 수정과 검증 결과 기록은 상태를 되돌리지 않는다.
- `done`은 완료 기준 충족, 필수 검증 통과, 관련 운영·설계 문서 갱신, 구현 PR 머지를 모두 만족해야 한다. 검증을 못 했으면 이유와 남은 작업을 기록하고 `approved`로 유지한다. 구현 PR에 해당 폴더의 문서와 인덱스의 `done` 변경을 포함하되 머지 시점부터 유효하다.
- 보류·반려된 초안은 `draft`를 유지하고 인덱스 비고에 결정과 PR 링크를 남긴다. 재개 지시 전에는 다음 단계로 진행하지 않는다.

## 샘플 변형 규칙

`_templates/`와 `_example/`은 출발점이지 고정 양식이 아니다. 작업 종류·규모에 맞춰 아래처럼 변형해도 된다. 단, **intent → spec → plan의 관심사 분리(왜 / 무엇을 / 어떻게)는 유지**한다.

- **작은 범위 변경** (설계 결정이 거의 없는 버그 픽스, 단순 UI 조정 등): `spec.md`를 따로 만들지 않고 `intent.md`에 `Requirements`, `Design`, `Acceptance criteria`를 모두 옮겨 통합할 수 있다. `plan.md`는 남기고 상단 `Spec`을 `./intent.md#requirements`로 바꾼다. 인덱스의 Spec 칸도 그 절을 연결한다. 복사한 빈 `spec.md`는 제거한다.
- **조사·리서치성 작업**: `plan.md`에 결과물의 위치·형식을 적고, `Verification`에는 출처의 신뢰성·최신성 확인과 핵심 주장 교차 검증 기준을 남긴다.
- **문서 전용 변경** (`nextjs-docs/` 등 콘텐츠 수정): `## Affected users and systems`의 시스템 항목을 생략하거나 "해당 없음"으로 적어도 된다.
- **범위가 넓어 spec이 여러 개 필요해 보이는 경우**: spec을 쪼개지 말고 규칙 1에 따라 intent 자체를 슬러그 단위로 나눈다.
- 각 문서의 소제목은 필요에 따라 추가·삭제·이름 변경이 가능하지만, `intent.md`의 Problem/Proposed outcome, `spec.md`의 Requirements/Acceptance criteria, `plan.md`의 Steps/Verification은 어떤 이름으로든 반드시 포함한다. 통합 양식에서는 spec의 필수 항목을 intent 안에 보존한다.

## Source of truth

| 기록 | 기준으로 삼는 내용 | 함께 갱신할 때 |
|---|---|---|
| `AGENTS.md` / 이 README | 필수 진입 지침 / 상세 운영 규칙 | 상세 규칙은 이 README에서 관리하고, 진입 지침이 달라질 때만 AGENTS.md도 갱신한다 |
| 승인된 intent / spec / plan | 진행 중 변경의 목적 / 요구사항·설계 / 구현·검증 방법 | 변경 범위에 따라 재승인한다. 통합 양식의 spec 역할은 intent가 맡는다 |
| 기존 `nextjs-app/docs/`, ADR, 디렉토리별 작업 규칙 | 현재 운영·설계 기준과 제약 | 변경이 이 기준에 영향을 주면 대상 문서를 plan에 포함하고 구현 PR에서 갱신한다 |
| 코드·테스트·검증 결과 | 실제 구현과 확인된 동작 | 문서와 다르면 차이를 기록한다. 구현 사실만으로 요구사항을 바꾸거나 완료로 처리하지 않는다 |
| PR 검토·머지 기록 | 승인자와 승인 대상 버전 | 문서의 Approval과 연결한다. Issue 등에는 원본 문서나 PR 링크를 남긴다 |

spec이 기존 ADR이나 작업 규칙과 충돌하면 임의로 덮어쓰지 않는다. 변경할 기준 문서와 이유를 spec에 명시하고 책임자의 승인을 받은 뒤 함께 갱신한다. 아래 인덱스는 탐색용 요약이며, 상태가 어긋나면 승인·머지 기록을 확인해 바로잡는다.

## 작업 인덱스

`_templates/`, `_example/`은 등록하지 않는다. 실제 작업 슬러그만 등록하며 비고에는 보류·반려·재승인 대기 등 필요한 진행 상황을 적는다.

새 슬러그를 만들 때 인덱스에 등록하고, 대상 범위가 바뀌면 같은 PR에서 갱신한다.

- **관련 기능**: 사용자가 부르는 기능명과 검색에 유용한 용어를 적는다(예: 데모 허브, 공개 상태, `?run=`).
- **관련 코드 경로**: 저장소 루트 기준 파일 또는 디렉토리를 적는다. 문서 작업은 대상 문서 경로를 적고, 아직 미정이면 `미정`으로 표시한 뒤 plan 작성 시 확정한다.
- **비고**: 진행 상황 외에 선행·후속 intent가 있으면 해당 폴더 링크를 남긴다.

| 슬러그 | 관련 기능 | 관련 코드 경로 | 작업 Status | Intent | Spec | Plan | 비고 |
|---|---|---|---|---|---|---|---|
| `demo-learning-fidelity` | Form, 병렬 라우트, ARIA 폼, CSRF, Turbopack 실습의 실제 동작과 검증 개선 | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/` 아래 대상 5개 라우트 | approved | [`intent.md`](./demo-learning-fidelity/intent.md) | [`spec.md`](./demo-learning-fidelity/spec.md) | [`plan.md`](./demo-learning-fidelity/plan.md) | 사용자 승인 및 intent PR 3·spec PR 4 머지, plan PR 5 머지 후 구현 시작 |
| `ga-custom-events` | GA4 커스텀 이벤트 3종 (`learning_complete`, `demo_click`, `github_star_click`) | `nextjs-app/apps/shell/src/lib/analytics.ts`, `nextjs-app/packages/docs-render` | done | [`intent.md`](./ga-custom-events/intent.md) | [`intent.md#requirements`](./ga-custom-events/intent.md#requirements) | [`plan.md`](./ga-custom-events/plan.md) | 구현 및 검증 완료 |
| `search-favicon-parity` | 구글 검색 결과 사이트 아이콘, 파비콘, apple-touch-icon | `nextjs-app/apps/shell/src/app/apple-icon.tsx`, `nextjs-app/apps/shell/src/app/icon.svg` | done | [`intent.md`](./search-favicon-parity/intent.md) | [`intent.md#requirements`](./search-favicon-parity/intent.md#requirements) | [`plan.md`](./search-favicon-parity/plan.md) | 로컬 검증 후 main 병합. 배포 후 프로덕션 아이콘·구글 검색 결과 반영은 사후 관찰 |
