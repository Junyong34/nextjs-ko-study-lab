Intent: 캐시 실습 3개(cacheTag·revalidateTag·revalidatePath)의 실제 동작·검증 재구성
Author: Codex (초안), JunYong 대화 승인으로 범위 축소·진행
Status: done
Approval: 2026-09-21 대화 승인. 원래 초안은 폼 2개를 포함한 5개 대상이었으나, `guides/forms/use-action-state-errors`·`guides/forms/use-form-status-spinner`는 `practice-page-refiner-forms-two` intent(2026-09-17/18, done)에서 이미 실제 Server Action 연동으로 재구성되어 `demos.yaml`에서 `done` 전환이 끝났다. 이번 intent는 그 두 항목을 범위에서 제외하고, 남은 캐시 관련 `stub` 3개만 대상으로 좁혀 사용자가 이 대화에서 진행을 직접 승인했다(선례: forms-two·session-expired·cookies-redirect와 동일한 대화 승인 방식). 2026-09-21 같은 대화에서 `practice-page-refiner` 스킬(사용자가 3회 직접 실행)로 세 데모 모두 구현·검증을 완료하고 `demos.yaml`을 `done`으로 전환했다 — 상세는 [`plan.md`](./plan.md) 참고.

## Problem

다음 `stub` 실습은 화면상으로는 동작해 보이지만, 학습자가 가이드대로 조작해도 제목이 약속한 Next.js 동작을 실제로 확인할 수 없다.

| 데모 | 현재 문제 | 학습상 영향 |
|---|---|---|
| `functions/cache-tag/multi-tag-binding` | 태그 이름을 고정 문자열로 렌더링할 뿐 `'use cache'`와 `cacheTag()` 호출, 태그 무효화가 없다. | 한 캐시 항목에 여러 태그를 연결하는 이유와 무효화 범위를 관찰할 수 없다. |
| `functions/revalidate-tag/basic-tag-purge` | Server Action은 존재하지만, 태그가 붙은 캐시 항목 없이 액션 응답만 표시한다. 초기·갱신 재고도 고정값 또는 임의 변동으로 만들며 검증 패널은 관측값을 받지 않는다. | `revalidateTag(tag, 'max')`가 태그를 stale로 표시하고 다음 방문에서 재검증한다는 과정을 확인할 수 없다. |
| `functions/revalidate-path/page-vs-layout` | 실제 라우트 트리 대신 `/shop`과 가상의 하위 경로 목록을 서버에서 계산해 `PURGED` 상태로 반환한다. | `page`와 `layout`이 실제 파일 시스템 라우트의 어느 범위에 영향을 주는지 배울 수 없다. |

근거는 각 데모의 `page.tsx`, 실습 컴포넌트, `VerificationFooter.tsx`와 Next.js 16.3.2 번들 공식 문서다. `demos.yaml`의 `stub`은 코드 존재가 아니라 공개 전 상태이므로, 현재 구현만으로 공개 완료를 뜻하지 않는다.

## Proposed outcome

각 페이지를 가이드 → 실제 실습 → 실제 상태 기반 검증 → 방금 한 행동과 연결된 개념 정리의 4단 학습 도구로 다시 구성한다.

- `cacheTag`: 하나의 캐시된 상품 상세 데이터에 여러 태그를 등록하고, 관련 데이터 변경 뒤 해당 태그를 갱신했을 때 새 데이터가 읽히는 것을 확인한다.
- `revalidateTag`: 태그를 stale로 표시한 액션과 그 뒤 실제 경로를 다시 방문해 관찰한 서버 렌더 값을 분리해 보여 준다.
- `revalidatePath`: 데모 안에 실제 중첩 라우트와 `layout.tsx`를 두고, page 대상과 layout 대상의 다음 방문 범위를 실제 렌더 식별값으로 비교한다.

세 항목은 완료 기준·런타임 검증·매니페스트 생성을 모두 충족한 뒤에만 `demos.yaml`에서 `done`으로 전환한다.

## Requirements / Spec 통합

- 캐시 함수는 `'use cache'` + `cacheTag(...)`로 정의하고, 태그 이름은 `데모슬러그:설명` 접두사 규칙(`nextjs-app/apps/AGENTS.md` 8항)을 따른다.
- Server Action은 `revalidateTag(tag, 'max')` / `revalidatePath(path, scope)`를 실제로 호출하고, 그 대상이 되는 캐시 항목·라우트가 실존해야 한다.
- 검증 패널(`ExpectedActualPanel`)의 `isMatched`는 상수로 고정하지 않고 조작 전/후 실측값(캐시 식별자, 재고값, 라우트 스냅샷)으로 계산한다.
- `revalidatePath` 데모는 실제 파일 시스템 서브 라우트(`items/[id]`, `category/[slug]`)와 공유 `layout.tsx`를 신설해 No-Simulation 원칙(`nextjs-app/apps/AGENTS.md` 10항)을 지킨다.
- 재사용 자산: `@study/demo-kit`의 `DemoContainer`/`DemoGuideCard`/`DemoPlaygroundCard`/`ExpectedActualPanel`/`DemoDeepDiveCard`/`DemoResetButton`(세 데모 모두 미사용이었으므로 이번에 추가). 새 의존성 추가 없음.

## Acceptance criteria

- 세 데모 모두 실제 Next.js 캐시/라우팅 API 호출과 그 결과가 화면에서 인과관계로 연결된다(호출 전/후 값이 실측으로 달라짐).
- 검증 패널이 조작 전에는 대기, 정상 조작 후에는 성공, 잘못된 상태에서는 실패를 정확히 반영한다.
- 가이드·개념정리 텍스트가 실제 구현된 버튼·라우트·태그명과 일치한다(가상 시나리오 서술 제거).
- TypeScript·ESLint·`next build`·`@study/demos` lint/build(매니페스트 재생성) 통과.
- 위 기준을 모두 충족한 뒤에만 `demos.yaml`의 세 항목을 `stub → done`으로 전환한다.

## Affected users and systems

- 사용자: Cache Components(`'use cache'`, `cacheTag`, `revalidateTag`, `revalidatePath`)를 처음 실습하는 학습자
- 시스템: `nextjs-app/apps/demo-cache-components`의 `cacheTag`·`revalidateTag`·`revalidatePath` 데모 3개, `nextjs-app/packages/demos/demos.yaml`, 생성 매니페스트(`demos-manifest.json`)

## Constraints

- 반드시 지킬 것: Next.js 16.3.2·React 19의 번들 공식 문서와 `next-devtools` 런타임 정보를 기준으로 구현한다. 새 의존성을 추가하지 않는다.
- 반드시 지킬 것: `DemoContainer`, `DemoGuideCard`, `DemoPlaygroundCard`, `ExpectedActualPanel`, `DemoDeepDiveCard`, `DemoResetButton`을 우선 사용하고 파일당 250줄 제한을 지킨다.
- 반드시 지킬 것: 폼 제출·서버 응답·캐시 태그·무효화를 로컬 React 상태나 고정 성공 문구로 흉내 내지 않는다. 예시 상품 데이터는 사용할 수 있으나 예시임을 드러낸다.
- 반드시 지킬 것: `revalidateTag(tag)` 단일 인수의 사용을 새로 도입하지 않는다. Next.js 16.3.2 권장 시그니처와 `updateTag`의 읽기-직후-쓰기 의미를 구분한다.
- 반드시 지킬 것: `revalidatePath`의 대상은 실제 데모 내부 파일 시스템 경로로 한정한다. 가상의 경로 목록이나 수동 `PURGED` 계산을 무효화 범위의 증거로 사용하지 않는다.
- 범위 밖: 다른 데모의 전면 개편, 새 데이터베이스·외부 결제 API·새 패키지 도입, 모든 `stub` 데모의 일괄 공개 전환

## Open questions (plan.md에서 확정)

- cacheTag 데모에서 사용자 변경 직후 최신 값을 보여줄 때 `updateTag`까지 도입할지, `revalidateTag`만으로 범위를 한정할지는 plan.md에서 결정한다. stale-while-revalidate 자체는 이 페이지의 성공 조건으로 주장하지 않는다.
- `revalidatePath`의 정확한 `page`/`layout` 스코프 의미는 구현 단계에서 `next-devtools` MCP로 교차 검증한 뒤 가이드 문구를 확정한다.
- 서버 재시작 시 초기화되는 데모 전용 예시 데이터는 실제 운영 주문 데이터가 아님을 화면과 개념 정리에 명시한다.
