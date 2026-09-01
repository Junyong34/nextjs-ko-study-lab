---
status: accepted
date: 2026-08-26
updated: 2026-08-27
---

# 학습 기록 기능 구현 계획

학습 기록의 제품·도메인 계약은 [학습 기록 기능 설계](../16-learning-progress-design.md)와 [ADR 0008](../adr/0008-shell-owned-client-learning-progress.md)에 따른다. 이 문서는 확정된 계약을 현재 셸 구조에 안전하게 옮기는 실행 순서와 완료 기준을 정의한다.

## 0. 구현 현황 (2026-08-27 기준)

작업 트리에 Phase 0~5의 코드가 모두 반영되어 있다. 아래는 이 문서를 최신화하며 실제로 실행한 검증 결과다.

| 검증 | 명령 | 결과 |
|---|---|---|
| 셸 타입 검사 | `pnpm --filter @study/shell check-types` | 통과 (오류 없음) |
| manifest·데모 계약 | `pnpm test:manifest` | 통과 — 데모 241건 전부 유효 |
| Tier 1 계약 테스트 | `pnpm test:tier1` | 통과 — 122건 (학습 기록 inventory/상태/저장소 10건, 셸 favicon 계약 2건 포함) |

미실행 항목: 새로고침 유지·다른 탭 반영·Drawer 키보드 트랩 등 브라우저 수동 시나리오는 이번 갱신에서 실행하지 않았다 (Phase 5, Phase 6 참고). 아래 각 Phase 절에 실제 확인 근거를 덧붙였다.

Phase 4에서 미정으로 남겨뒀던 레이아웃 경계 방식은 **옵션 2(레이아웃에 화면 유형을 전달해 조건부 렌더링)**로 확정됐다 — `apps/shell/src/components/layout/AppFrame.tsx`가 `usePathname()`으로 `/study-progress`를 판별해 `DocTree`와 `max-w` 폭을 조건부로 바꾼다. 이 문서가 추천했던 옵션 1(route group 분리)은 채택되지 않았다.

이 작업 트리에는 학습 기록과 무관한 디자인 변경 하나가 함께 들어 있다: 셸 favicon(`apps/shell/src/app/icon.svg`)이 삼각형 로고에서 64×64 라운드 사각형 배경의 책·코드 심볼로 교체됐고, `20-shell-favicon-contract.test.ts`로 계약이 고정됐다. 이 변경은 이 계획의 범위 밖이며 학습 기록 Phase 진행과는 독립적이다.

## 1. 구현 범위

### 포함

- 문서·데모 완료 표시와 해제
- 셸 소유 클라이언트 상태
- `study_learning_progress` localStorage 저장·복원
- 잘못된 데이터·저장 불가 환경·여러 탭 처리
- 전역 플로팅 버튼과 학습 기록 Drawer
- `/study-progress` 전용 기록 화면
- 문서·데모 탭, 탭별 완료 수, 전체·완료·미완료·카테고리·검색 필터
- 기존 피드백 트리거 재사용
- 단위·통합·브라우저 수준 검증

### 제외

- 서버 API, 데이터베이스, 인증
- 데모 앱 내부의 학습 기록 코드
- 방문 이력과 다음 학습 추천
- 완료율과 카테고리 집계
- 학습 노트·시간 측정·복습 시스템

## 2. 모듈 경계

구현 시 책임을 다음처럼 나눈다. 상태·원본 조회·표현을 한 파일에 합치지 않는다.

아래는 계획 당시 제안한 경계를 실제 구현 결과로 갱신한 트리다.

```text
apps/shell/src/
├─ lib/learning-progress/
│  ├─ constants.ts       # study_learning_progress, 현재 저장 버전
│  ├─ types.ts           # 저장 모델·뷰 모델
│  ├─ inventory.ts       # 문서·done 데모 현재 목록 계산
│  ├─ storage.ts         # 읽기·쓰기·검증·storage 이벤트
│  └─ state.ts           # 토글·초기화·현재 목록 정규화
├─ components/layout/
│  └─ AppFrame.tsx       # (신규) DocTree·본문 폭을 화면 유형별로 조건부 렌더링 — Phase 4 옵션 2
├─ components/learning-progress/
│  ├─ LearningProgressProvider.tsx
│  ├─ LearningCompletionControl.tsx
│  ├─ LearningProgressTrigger.tsx
│  ├─ LearningProgressDrawer.tsx
│  ├─ LearningProgressNotice.tsx
│  ├─ LearningProgressChecklist.tsx  # (신규) 탭·필터·검색을 가진 체크리스트 뷰, Drawer와 전용 화면이 공유
│  └─ LearningProgressList.tsx       # (신규) 필터링된 항목 렌더링
└─ app/
   └─ study-progress/
      ├─ page.tsx
      └─ components/
         └─ LearningProgressScreen.tsx
```

계획에는 없었지만 카드의 완료 상태 표시를 위해 `packages/ui/src/learning/`(`LearningCompletionStatus.tsx`)도 추가됐다. 이 컴포넌트는 표시만 하고 토글 로직을 갖지 않으므로 "카드처럼 재사용할 수 있는 표현만 `@study/ui`로 옮긴다"는 원칙을 지킨다. 데모 앱(`apps/demo-baseline`, `apps/demo-cache-components`)은 여전히 학습 기록 패키지에 의존하지 않는다.

## 3. 단계별 실행 순서

### Phase 0 — 계약·원본 어댑터 확정 (완료)

- `docs-manifest.tree`에서 실제 학습 문서 후보를 추출한다.
- 루트와 `README.md` 계열 카테고리 홈을 제외한다.
- `demos.yaml`에서 `status: done` 데모만 가져온다.
- 문서의 canonical key는 `path`, 데모의 canonical key는 `url`로 고정한다.
- 데모 `doc` 연결과 카테고리 파생 규칙을 순수 함수로 만든다.

완료 기준:

- 문서·데모 원본을 입력하면 동일한 inventory 결과가 나온다.
- README·랜딩·미공개 데모가 inventory에 들어오지 않는다.
- 문서 제목 변경과 식별자 변경의 결과가 테스트로 고정된다.

**구현 확인:** `lib/learning-progress/inventory.ts`의 `createLearningInventory()`가 `getManifest()`·`getDemos()`를 입력받아 사용된다 (`app/layout.tsx`). `18-learning-progress-inventory.test.ts` 4건이 사이드바 문서만 포함(랜딩·README 제외), `done` 데모만 연결, 제목 변경 시 key 유지, 경로 변경 시 새 항목 처리, 트리 중복 시 canonical path당 한 항목을 각각 검증하며 모두 통과한다.

### Phase 1 — 저장 모델과 상태 모듈 (완료)

- `version`, `documents`, `demos`, `updatedAt` 저장 포맷을 구현한다.
- 완료 항목만 저장하고, 없는 항목은 미완료로 해석한다.
- 체크·체크 해제·전체 초기화 연산을 만든다.
- 런타임 검증 실패 시 빈 상태로 복구한다.
- 현재 inventory에 없는 기록은 읽기 모델에서 무시하되 원본 저장 데이터는 보존한다.
- localStorage 접근 실패 시 메모리 상태로 동작하도록 한다.
- `storage` 이벤트로 다른 탭의 유효한 변경을 반영한다.

완료 기준:

- 저장 모듈만으로 빈 값·잘못된 JSON·잘못된 버전·토글·초기화를 검증할 수 있다.
- 문서와 데모 상태가 서로 전파되지 않는다.
- 저장 실패가 예외를 화면까지 전파하지 않는다.

**구현 확인:** `lib/learning-progress/{constants,types,storage,state}.ts`가 계획된 파일 경계 그대로 구현됐다. 저장 키는 `study_learning_progress`, 버전은 `1`이다. `19-learning-progress-state.test.ts` 5건이 문서·데모 독립 토글과 해제 시 레코드 삭제, 전체 초기화, 빈 값·잘못된 JSON·잘못된 버전의 빈 상태 복구, 접근·쓰기 실패 시 예외 미전파를 검증하며 모두 통과한다. `storage` 이벤트를 통한 다른 탭 반영 코드는 존재하지만 실제 다른 탭 간 브라우저 시나리오는 아직 수동으로 확인하지 않았다.

### Phase 2 — 셸 상태 연결 (완료)

- 셸의 클라이언트 경계에 Provider 또는 동등한 상태 접근 표면을 추가한다.
- 서버 렌더링 시 localStorage를 읽지 않도록 한다.
- hydration 이후 저장 상태를 읽고 화면을 갱신한다.
- 문서·데모 상세 화면이 동일한 상태 접근 표면을 사용하게 한다.

완료 기준:

- 새로고침 후 완료 표시가 복원된다.
- 직접 데모 URL 접근, 문서에서 데모 접근, 데모 색인 접근이 같은 데모 상태를 공유한다.
- 저장 데이터가 없어도 hydration 경고 없이 기본 화면이 그려진다.

**구현 확인:** `LearningProgressProvider`가 `app/layout.tsx`에서 `Header`·`AppFrame`·`Footer`·`LearningProgressTrigger`를 감싸 셸 전체가 같은 상태 접근 표면을 공유한다. `DemoIndexClient`, 문서 상세(`[...slug]/page.tsx`), 데모 뷰어(`DemoViewer.tsx`), 문서별 데모 허브(`LearningDocDemoHub.tsx`)가 모두 `useLearningProgress()`/전달된 완료 여부를 통해 같은 inventory 키(`document.path`, `demo.url`)를 참조한다. 새로고침 후 복원과 hydration 경고 여부는 브라우저에서 직접 확인하지 않았다 — `check-types` 통과와 코드 경로만으로 간접 확인했다.

### Phase 3 — 공통 완료 표시와 기존 화면 연결 (완료)

- 문서 상세 페이지에 완료 표시를 추가한다.
- 데모 독립 열람 셸 chrome에 완료 표시를 추가한다.
- 카드에는 상태만 표시하고 링크와 체크 컨트롤을 충돌시키지 않는다.
- 문구를 `학습 완료로 표시` 기준으로 통일한다.

완료 기준:

- 문서 완료 표시가 문서 하나만 바꾼다.
- 데모 완료 표시가 데모 하나만 바꾼다.
- 문서 완료와 연결 데모 완료가 자동으로 묶이지 않는다.

**구현 확인:** `LearningCompletionControl`이 문서 상세(`kind="document"`, `itemKey={doc.path}`)와 데모 뷰어(`kind="demo"`, `itemKey={demo.url}`)에 독립적으로 붙어 있고, `state.ts`의 토글이 `document`/`demo` 네임스페이스를 분리해 저장한다 — `19-learning-progress-state.test.ts`의 "문서와 데모를 독립적으로 토글" 테스트가 이를 고정한다. 문구는 "이 문서를/이 데모를 학습 완료로 표시"로 통일됐다. 카드(`DemoIndexCard`, `LearningDocDemoHub`)는 `LearningCompletionStatus`로 상태만 표시하고 체크 컨트롤을 갖지 않아 링크 클릭 영역과 충돌하지 않는다.

### Phase 4 — Drawer와 전체 기록 화면 (완료, 레이아웃 결정 확정)

- 모든 셸 주요 화면에 플로팅 트리거를 배치한다.
- Drawer를 메뉴형으로 구현한다.
- `/study-progress`를 문서 사이드바 밖의 전용 화면으로 만든다.
- 문서·데모 탭별 `완료 / 전체` 수와 전체·완료·미완료·카테고리·검색 필터를 연결한다.
- 기본 필터는 전체로 둔다.
- 퍼센트 기반 진행률·추천·최근 학습을 렌더링하지 않는다.
- 전체 초기화와 확인 대화상자를 Drawer와 전체 기록 화면에 추가한다.

~~현재 `apps/shell/src/app/layout.tsx`가 `DocTree`를 전역으로 그리는 구조이므로, `/study-progress`에서 문서 트리를 제거하려면 다음 중 하나를 구현 단계에서 선택한다.~~

1. 학습 화면과 시스템 화면을 route group별 layout으로 분리
2. 셸 레이아웃에 화면 유형을 전달해 `DocTree`와 문서 목차를 조건부로 렌더링

~~추천은 1번이다. 문서 콘텐츠 화면과 개인 상태 화면의 경계를 라우팅 구조에 남길 수 있다.~~

**결정 (2026-08-27):** 옵션 2로 확정했다. `components/layout/AppFrame.tsx`가 `usePathname()`으로 `pathname === '/study-progress'`를 판별해 `DocTree` 렌더링 여부와 컨테이너 폭(`max-w-6xl` vs `max-w-[90rem]`)을 조건부로 바꾼다. route group 분리(옵션 1) 대신 단일 레이아웃에서 조건부 렌더링을 선택했으므로, `LearningProgressProvider`·`Header`·`Footer`·`LearningProgressTrigger`를 route group마다 중복해서 감쌀 필요가 없다. 단, 화면 유형 판별이 경로 문자열 비교에 묶여 있으므로 `/study-progress`가 하위 경로로 확장되면 `AppFrame`의 판별 조건도 함께 넓혀야 한다.

완료 기준:

- Drawer의 공식 진입점이 동작한다. — `LearningProgressTrigger`가 레이아웃에 전역으로 배치되어 모든 화면에서 접근 가능하다.
- `/study-progress`가 문서 트리에 표시되지 않는다. — `AppFrame`이 해당 경로에서 `DocTree`를 렌더링하지 않는다.
- 문서와 데모 탭이 서로 독립적으로 필터링된다. — `LearningProgressChecklist`가 탭 전환 시 카테고리 필터를 초기화하고 각 탭의 `sourceItems`를 분리해서 필터링한다.
- 선택 탭의 완료 수가 현재 inventory만 기준으로 계산된다. — 상태·카테고리·검색 필터와 무관하게 `완료 / 전체`를 표시한다.
- 작은 화면과 키보드 조작에서 Drawer가 usable하다. — 포커스 트랩·`Escape`·오버레이 클릭 닫기 코드는 구현됐으나, 실제 브라우저·키보드 수동 검증은 아직 실행하지 않았다.

### Phase 5 — 저장 예외·피드백·접근성 보강 (코드 완료, 브라우저 검증 남음)

- 저장 불가 안내를 Drawer 또는 페이지에 표시한다.
- 잘못된 저장 데이터 복구 안내를 추가한다.
- 기존 `FeedbackTrigger`를 Drawer 하단에 재사용한다.
- 포커스 이동·복원, `Escape`, 오버레이 닫기, 라벨과 상태 전달을 검증한다.

완료 기준:

- localStorage를 차단해도 페이지 조작이 중단되지 않는다. — `storage.ts`가 접근·쓰기 실패를 흡수하고 `LearningProgressNotice`가 `unavailable` 상태를 안내한다 (테스트로 확인).
- 기존 피드백 mailto 흐름이 학습 기록 상태를 변경하지 않는다. — `LearningProgressDrawer`는 기존 `FeedbackTrigger`를 그대로 렌더링만 하며 학습 기록 상태를 참조하지 않는다.
- 키보드만으로 기록 변경과 Drawer 닫기가 가능하다. — `Escape` 핸들러와 `Tab` 포커스 트랩, 닫을 때 트리거로 포커스 복원 코드가 있다. **실제 키보드·스크린리더 브라우저 검증은 아직 실행하지 않았다.**

전체 초기화 버튼 자체는 `DESIGN.md` 3절의 "파괴적 동작 → red" 규칙대로 red 계열로 표시된다. 다만 확인 대화상자는 `window.confirm()` 네이티브 대화상자로 구현했다 — "확인 대화상자를 추가한다" 요건은 충족하지만, 셸의 다른 오버레이(Drawer, 모달)와 달리 커스텀 dialog가 아니다. 시각적 통일이 필요하면 별도 후속 작업으로 다룬다.

### Phase 6 — 회귀 검증과 문서 동기화 (자동 검증 완료, 브라우저 검증 남음)

- 상태·inventory 순수 함수 테스트를 추가한다.
- 셸 타입 검사와 빌드를 실행한다.
- 기존 manifest·데모 계약 테스트를 실행한다.
- 브라우저에서 새로고침·두 탭·문서/데모 독립성·초기화를 확인한다.
- 설계 문서의 경로·키·문구와 구현 결과를 대조한다.

권장 검증 명령:

```text
pnpm --filter @study/shell check-types
pnpm --filter @study/shell build
pnpm test:manifest
pnpm test:tier1
```

**실행 결과 (2026-08-27):** 위 네 명령을 모두 실행했다. `check-types`는 오류 없이 종료했고, `build`는 `/study-progress`를 포함한 라우트를 성공적으로 생성했다 (`packages/demos`의 동적 파일시스템 접근 경고는 기존부터 있던 것으로 이번 변경과 무관하다). `test:manifest`는 데모 241건을 전부 유효하다고 확인했다. `test:tier1`은 22개 스위트 122건을 전부 통과했고, 그중 학습 기록 inventory 4건·상태 5건·저장소 3건, 셸 favicon 계약 2건이 이번에 추가된 항목이다.

브라우저 검증은 아직 실행하지 않았다 — 새로고침 후 복원, 다른 탭 간 반영, Drawer의 키보드 트랩·포커스 복원, `/study-progress` 필터 조합, 전체 초기화 확인 대화상자는 다음 세션에서 실제 브라우저로 확인해야 한다.

## 4. 핵심 시나리오 체크리스트

- 첫 방문에서 모든 대상이 미완료다.
- 문서 상세에서 문서만 완료로 표시된다.
- 데모 독립 열람에서 데모만 완료로 표시된다.
- `/study-progress`에서 같은 표시를 해제할 수 있다.
- 새로고침 후 상태가 유지된다.
- 다른 탭의 변경이 반영된다.
- 잘못된 저장 데이터가 빈 상태로 복구된다.
- 저장이 차단된 환경에서 화면은 계속 사용할 수 있다.
- 원본에 없는 기록은 목록에 나타나지 않는다.
- Drawer와 전체 화면에 선택 탭의 `완료 / 전체` 수가 보이고, 퍼센트 기반 진행률·추천 문구는 없다.
- 전체 초기화 후 모든 항목이 미완료다.
- 기존 `study_demo_list_context`와 학습 기록 키가 충돌하지 않는다.

위 항목 중 저장·상태·inventory·키 네임스페이스 관련 항목(빈 값 복구, 저장 차단 시 동작, 원본 미포함 기록 제외, 키 충돌 없음, 문서/데모 독립 초기화)은 Phase 0~1의 단위 테스트로 확인했다. 탭별 완료 수는 현재 inventory만으로 계산하는 단위 테스트와 `LearningProgressChecklist` 코드 경로로 확인한다. 새로고침 유지와 다른 탭 반영은 코드상 존재하지만 실제 브라우저에서 아직 재현하지 않았다.

## 5. 작업 순서상 주의점

- 현재 작업 트리에 있는 데모·셸 레이아웃 변경을 덮어쓰지 않고, 실제 기준선에서 route layout 경계를 먼저 확인한다.
- 데모 앱에 학습 기록 의존성을 추가하지 않는다.
- `docs-manifest`와 `demos.yaml`을 복제하거나 별도 학습 목록 파일을 만들지 않는다.
- 전체 수치나 추천 UI가 이전 설계에서 다시 유입되지 않도록 정적 문구와 화면 캡처로 확인한다.
- 같은 작업 트리의 셸 favicon 교체(`icon.svg`, `20-shell-favicon-contract.test.ts`)는 이 계획과 무관한 병행 변경이다. 이 문서의 Phase 진행 상황을 판단할 때 혼동하지 않는다.
