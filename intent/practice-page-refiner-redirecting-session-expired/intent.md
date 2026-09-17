Intent: 세션 만료 리다이렉트 실습 stub의 검증 흐름 재구성 및 공개
Author: Claude
Status: done
Approval: 2026-09-18 현재 대화에서 사용자가 practice-page-refiner-forms-two 2건과 함께 이 3번째 stub 대상을 직접 선택("guides/redirecting/session-expired (권장)")하여 승인. main에서 구현·검증·커밋만 진행하며 PR/push 절차는 사용자 지시로 생략.

## Problem

`guides/redirecting/session-expired`는 demos.yaml에서 stub이다. 코드 검토 결과:

- actions.ts의 `expireSessionAction`은 실제 `'use server'` 함수에서 `redirect()`를 호출해 307을 발생시키므로 이 부분은 진짜다.
- 그러나 `VerificationFooter`는 `page.tsx`에서 어떤 props도 전달받지 않는다(`<VerificationFooter />`). 컴포넌트 내부 기본값 로직상 `isMatched`는 항상 `undefined`로 남아, 사용자가 버튼을 클릭해 실제로 redirect가 일어나도 검증 패널은 영원히 "상호작용 대기 중"만 표시한다 — forms-two intent에서 지적된 "검증: 관측값 미전달" 패턴과 동일하다.
- `DemoDeepDiveCard` 설명은 쿠키 기반 세션 검사, 미들웨어 역할 분담, open-redirect 방어 등 실제 구현에 없는 내용을 다수 주장한다.
- 가이드 1단계("현재 상태(결제 진행 중) 및 세션 유효성 확인")는 실습화면에 세션 유효성을 보여주는 요소가 없어 실제 조작과 어긋난다.

이 페이지는 브라우저에서 실제 Server Action 호출과 307 redirect, `returnUrl` 쿼리 전이를 관찰할 수 있어 EXPLANATION보다 REBUILD가 적합하다. 기존 4단 구성과 공통 컴포넌트는 유지한다.

## Proposed outcome

- 사용자가 [세션 만료] 버튼을 클릭 → 실제 Server Action이 `redirect('/login?returnUrl=...')`를 호출 → 브라우저가 실제로 `/login` 서브 라우트로 이동하고 `returnUrl` 쿼리 파라미터가 보존됨을 관찰한다.
- 검증 패널은 실제 이동 전(대기) / 이동 후 `returnUrl` 쿼리 값 일치(성공) / 불일치(실패)를 구체적인 관측값으로 판정한다.
- `DemoResetButton`으로 초기화 후 같은 흐름을 재실행할 수 있다.
- 개념 정리는 구현에 실제로 존재하는 것(Server Action `redirect()`, 307, `returnUrl` 쿼리 인코딩)만 설명하고, 미들웨어·쿠키 세션 등 구현에 없는 내용은 "이 데모에서 다루지 않음"으로 명시하거나 제거한다.
- 검증 통과 후 `demos.yaml`의 이 항목만 `done`으로 바꾸고 매니페스트를 재생성한다.

## Affected users and systems

- 사용자: Next.js `redirect()`와 인증 가드 패턴을 학습하는 사용자.
- 시스템: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/redirecting/session-expired/`(및 `login/` 서브 라우트), `nextjs-app/packages/demos/demos.yaml`, 생성 매니페스트.

## Constraints

- 사용자 지시: main에서 작업하고 커밋만 한다. 새 브랜치·PR·push 없음.
- 구현 범위: 지정된 실습 디렉토리 하나. `practice-page-refiner-forms-two`의 두 디렉토리는 건드리지 않는다(별도 intent가 소유).
- Next.js 16.3.2 / React 19, 신규 의존성 없음, 파일당 250줄 이하.
- `DemoContainer`/`DemoGuideCard`/`DemoPlaygroundCard`/`ExpectedActualPanel`/`DemoDeepDiveCard`/`DemoResetButton` 재사용.
- 실제 쿠키·세션 저장소를 새로 구축하지 않는다. "세션 만료"는 버튼 클릭으로 트리거되는 실제 Server Action 호출 자체이며, 화면에 이 데모가 보여주는 범위(트리거→redirect→returnUrl)를 명시한다.
- 상태가 변했다는 이유만으로 검증 성공을 만들지 않는다. 실제 이동 후 URL/쿼리 값과 기대값을 비교한다.

## Requirements (spec 통합)

1. 실제 Server Action(`actions.ts`)에서 `redirect()`를 호출하고, 클라이언트는 실제 이동 결과(쿼리 파라미터 포함)를 관측한다.
2. `login/page.tsx`는 `searchParams`로 받은 `returnUrl`을 화면에 그대로 노출해 검증 가능한 관측값으로 제공한다.
3. `VerificationFooter`는 page.tsx로부터 실제 관측값(이동 여부, `returnUrl` 값)을 props로 전달받아 판정한다. 전달 없이 항상 대기 상태로 남는 현재 구조를 제거한다.
4. 가이드 스텝은 실습화면에 실제로 존재하는 조작(버튼 클릭 → redirect → returnUrl 확인)만 설명한다.
5. `DemoDeepDiveCard`는 구현에 있는 내용만 설명하고, 없는 기능(미들웨어, 쿠키 세션 검사 등)은 "이 데모에서 다루지 않음"으로 범위를 명시하거나 삭제한다.
6. 초기화 후 동일 흐름을 재실행할 수 있어야 한다.

## Acceptance criteria

- [ ] [세션 만료] 클릭 → 실제 POST/Server Action 호출 → `/login?returnUrl=...`로 실제 이동 확인.
- [ ] `returnUrl` 쿼리 값이 로그인 페이지에 실제로 표시됨을 확인.
- [ ] 검증 패널이 이동 전(대기)과 이동 후(성공/관측값 표시)를 구분하며, 초기화 후 대기로 복귀.
- [ ] 콘솔·런타임·hydration 오류 확인, 타입·빌드·매니페스트 검사 수행.
- [ ] 완료 증거 확보 후 해당 항목만 `done`으로 변경, main에서 커밋.

## Open questions

없음. 사용자가 이 대화에서 대상 선택과 진행을 직접 승인했다.
