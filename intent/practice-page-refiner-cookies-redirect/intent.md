Intent: 쿠키 삭제와 redirect 실습 3개의 실제 요청 기반 학습 재구성
Author: Codex
Status: done
Approval: 2026-09-12 이 대화에서 사용자 "승인" (intent 내용 승인). 별도 승인 PR 없이 이 대화 승인을 근거로 구현·검증·공개까지 진행했다.

승인 대상 원문 SHA-256: `f4dee1b8f525efb5aff206619a4e4b387c884508b4b086691a2862a089987190`. 구현·검증 결과는 [`plan.md`](./plan.md)의 Verification results에 기록한다.

## Problem

학습자가 가이드대로 조작해도 쿠키 삭제나 리다이렉트 요청이 발생하지 않는다. 다음 세 항목은 조사 시점에 모두 `demos.yaml`의 `stub`이며, 기존 `practice-page-refiner-forms-cache` 초안의 대상과 겹치지 않는다.

| 대상 URL (셸 기준) | 제목 | 주제 | 판정 |
|---|---|---|---|
| `/demo/functions/cookies/delete-logout` | cookies().delete() 세션 파기 및 로그아웃 | cookies | REBUILD |
| `/demo/functions/redirect/action-303` | Server Action 내 redirect() (303 See Other) | Server Action redirect | REBUILD |
| `/demo/functions/redirect/handler-307` | Route Handler 내 redirect() (307 Temporary Redirect) | Route Handler redirect | REBUILD |

### 기존 페이지 평가

아래는 코드와 공식 문서를 대조한 정적 평가다. 브라우저에서 실행한 결과가 아니다. 코드 경로는 `nextjs-app/apps/demo-baseline/src/app/zone/baseline/` 기준이다.

| 대상 | 가이드 | 실습화면 | 검증 | 개념 정리 |
|---|---|---|---|---|
| `functions/cookies/delete-logout` | 수정 필요: 실제로 없는 Server Action 호출과 특정 만료 헤더를 관찰하도록 안내 | 수정 필요: `CookiesDeleteDemo.tsx:5-11`에서 React 상태만 변경 | 수정 필요: `page.tsx:43`이 검증 컴포넌트에 실제 상태를 전달하지 않음 | 수정 필요: 구현에 없는 로그인 경로 이동을 설명하고 쿠키 삭제를 세션 전체 무효화처럼 과장 |
| `functions/redirect/action-303` | 수정 필요: 실제 요청·이동과 연결되지 않은 안내 | 수정 필요: `RedirectAction303Demo.tsx:80`에서 성공 로그만 추가. Server Action·완료 라우트 없음 | 수정 필요: `page.tsx:43`에서 실제 관측값을 전달하지 않음 | 수정 필요: JavaScript 사용 여부에 따른 동작 차이를 생략하고 중복 결제를 원천 차단한다고 주장 |
| `functions/redirect/handler-307` | 수정 필요: 요청이 없는 화면에서 HTTP 307·메서드·본문 보존 관찰을 요구 | 수정 필요: `RedirectHandler307Demo.tsx:80`에서 성공 로그만 추가. `route.ts` 없음 | 수정 필요: `page.tsx:43`에서 실제 응답을 전달하지 않음 | 수정 필요: 실습에 없는 엔드포인트 이동을 수행한 것처럼 설명 |

세 검증 컴포넌트는 무인자로 호출돼 대기 안내 문자열과 `isMatched: undefined`를 전달한다. 공통 `ExpectedActualPanel.tsx:31-38`은 서로 다른 기대·실제 문자열을 자동 비교하므로 최종 배지는 불일치로 계산된다. 실제 관측 없이 대기 안내와 불일치 판정이 함께 표시되는 구조다. 버튼만으로 검증 성공한다고 평가한 것이 아니다. 내부의 범용 로그 개수·상태코드 판정도 학습 대상의 실제 관측을 검증하지 못하므로 대상별 조건으로 교체해야 한다.

## Proposed outcome

사용자가 가이드 → 실제 요청 → 관측값과 기대값 비교 → 방금 수행한 행동의 개념 정리를 따라갈 수 있게 한다. 세 주제 모두 브라우저 조작과 개발자 도구로 관찰할 수 있으므로 설명형 전환보다 실제 기능 재구성이 적합하다.

### 학습 목표와 시나리오

1. **쿠키 삭제**: 예시 회원 쿠키 생성 → 서버가 읽은 쿠키 존재 확인 → 실제 Server Action의 `(await cookies()).delete(...)` 실행 → 다음 요청에서 쿠키가 사라진 것을 확인한다. 화면만 게스트로 바꾸는 것과 브라우저 쿠키를 삭제하는 것의 차이를 이해한다. 예시 세션임을 표시하고 실제 인증·서버 세션 저장소 무효화를 구현했다고 주장하지 않는다.
2. **Server Action redirect**: 예시 상품과 수량 제출 → 실제 Server Action의 입력 검증 → 유효할 때만 `redirect()`로 실습 내부 주문 결과 라우트 이동 → 서버가 받은 주문 정보를 대조한다. JavaScript가 있을 때의 클라이언트 내비게이션과 progressive enhancement 폼 제출의 HTTP 303을 구분한다. 303 자체의 관찰은 JavaScript 비활성화 제출에서도 검증한다. PRG가 모든 중복 주문을 막는다고 설명하지 않는다.
3. **Route Handler redirect**: 예시 상품과 수량을 POST로 전송 → 실제 `route.ts`에서 `redirect()` 실행 → 목적지 핸들러가 읽은 메서드와 본문을 표시한다. Network의 중간 307·Location과 최종 응답을 구분해 확인한다. 최종 200 응답만으로 307을 검증했다고 하지 않는다. GET 비교에서는 본문이 전달되지 않는 차이를 관찰한다.

### 재사용 자산

| 영역 | 사용할 기존 자산 |
|---|---|
| 전체 조립 | `DemoContainer` |
| 가이드 | `DemoGuideCard` |
| 실습화면 | `DemoPlaygroundCard` |
| 검증 | `ExpectedActualPanel` |
| 개념 정리 | `DemoDeepDiveCard` |
| 초기화 | `DemoResetButton`의 `onReset`에 실제 초기화 연결 |

`packages/demo-kit/src/ecommerce`의 `ProductCard`, `CartSummary`, `DeliveryTracker`, `mockData`를 확인했다. 주문 실습은 `MOCK_PRODUCTS`와 `ProductCard`를 재사용할 수 있다. 쿠키 실습의 예시 프로필에는 `MOCK_USER_SESSIONS`를 사용할 수 있다. 장바구니 합계와 배송 상태는 이번 학습 목표가 아니므로 `CartSummary`·`DeliveryTracker`를 추가할 필요가 없다. 공통 패키지를 수정하지 않는다.

### 완료 시 확인할 학습 결과

- 쿠키: 삭제 전에는 삭제 완료 검증이 실패하고, 삭제 후 별도 서버 요청에서 부재가 확인되면 성공한다. 초기화 후 쿠키 생성·삭제를 다시 실행할 수 있다.
- Action: 잘못된 수량은 서버에서 거부되고 성공 라우트로 이동하지 않는다. 정상 제출에서만 서버가 받은 상품·수량과 목적지가 일치한다. 완료 URL 직접 진입만으로 실제 주문 제출까지 검증됐다고 표시하지 않는다.
- Handler: POST의 실제 수신 메서드·상품·수량을 기대값과 대조한다. GET으로 변경하면 POST 보존 조건은 실패한다. 잘못된 입력의 오류 응답과 초기화·재실행도 확인한다.
- 각 실습의 초기 진입, 모든 가이드 행동, 성공·실패, 초기화, 콘솔·런타임·hydration 오류를 실제 브라우저에서 확인한다.
- 대상 정적 검사와 빌드를 수행하고 기존 오류·환경 차단·미실행 항목을 구분한다. baseline에는 독립 `lint` script가 없으므로 spec/plan에서 저장소에 실제 존재하는 검사 수단을 확정한다.
- 검증을 마친 항목만 `demos.yaml`에서 `done`으로 바꾸고 `pnpm --filter @study/demos build`로 매니페스트를 생성한다. 등록 lint·`pnpm test:manifest`와 셸 직접 진입도 확인한다.

## Affected users and systems

- 사용자: 쿠키와 서버 리다이렉트를 처음 실습하는 Next.js 학습자
- 실행 코드: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/functions/cookies/delete-logout/`, `functions/redirect/action-303/`, `functions/redirect/handler-307/`의 세 디렉토리
- 공개 메타데이터: `nextjs-app/packages/demos/demos.yaml`의 대상 세 항목과 생성 `demos-manifest.json`
- 작업 기록: 이 intent 폴더와 `intent/README.md` 작업 인덱스

## Constraints

- Next.js 16.3.2·React 19, 기존 설치 패키지만 사용한다. 새 의존성을 추가하지 않는다.
- 실제 Server Action, Route Handler, 파일 시스템 라우트와 쿠키 API를 사용한다. 지연 함수나 로컬 상태로 학습 대상 메커니즘을 흉내 내지 않는다.
- 실행 코드 변경은 지정한 세 실습 디렉토리 안으로 한정한다. 리다이렉트 목적지와 쿠키 이름도 실습별로 분리한다. 실습의 URL 변화는 iframe 안에서만 일어난다.
- 4단 레이아웃과 공통 컴포넌트, 파일당 250줄 제한을 지킨다. 구조를 다시 만드는 이유는 스타일 취향이 아니라 학습 대상 API의 부재와 검증 연결 결함이다.
- 생성 매니페스트는 직접 편집하지 않는다. 다른 stub이나 기존 폼·캐시 초안을 변경하지 않는다.
- 이 문서는 구현 승인이 아니다. intent/spec/plan 승인 절차와 공개 상태 변경 절차를 따른다. 코드가 존재하거나 초안이 작성됐다는 이유로 `done`을 부여하지 않는다.

## Sources and investigation evidence

- `next-devtools.nextjs_docs(project_path: nextjs-app/apps/demo-baseline)`가 실제 설치 `16.3.2`와 번들 문서 경로를 확인했다. 저장소 루트 호출의 미설치 응답은 모노레포 해석 문제였으며 업그레이드가 필요한 상태로 취급하지 않았다.
- 설치 버전 공식 원문: `nextjs-app/apps/demo-baseline/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md`, `redirect.md`.
- 공식 URL: [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies), [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect). 이번 스펙 대조는 최신 웹페이지가 아니라 위 설치 버전 번들 원문을 사용했다.
- `cookies`는 비동기 API이며 삭제는 Server Function/Route Handler에서 수행한다. 만료 헤더를 반드시 `Max-Age=0`으로 고정해 설명하지 않는다.
- `redirect.md`는 JavaScript가 있으면 Server Action이 client-side navigation을 수행하고, progressive enhancement 폼 제출에서는 HTTP 303을 반환한다고 명시한다. 일반 Route Handler의 307은 요청 메서드를 보존한다.
- 설치 `next/dist/server/app-render/action-handler.js:892-906`도 fetch action의 200 응답과 `x-action-redirect`, 일반 폼의 303과 `Location`을 구분한다. 따라서 JavaScript 활성 제출에 일률적으로 303을 요구하는 검증은 만들지 않는다.
- `nextjs_index`에서 3000·3002만 탐지했다. `nextjs_call(3000, get_project_metadata)`로 셸 경로를 확인했다. baseline(3001)과 대상 페이지 런타임은 이번 조사에서 검증하지 않았다.
- 외부 라이브러리를 도입하지 않아 context7 대조 대상은 없다.
- 서브에이전트 3개가 각 페이지를 독립적으로 정적 조사했고 주 작업자가 공식 문서와 공통 자산을 대조했다.

## Open questions

- 구현을 막는 제품 요구 질문은 없다. 303 관찰 환경, 쿠키 초기화 범위, 주문 결과 보관 방식은 [spec 초안](./spec.md)과 [plan 초안](./plan.md)에 구체화했다. 이 후속 문서는 아직 승인되지 않았다.
- 후보 선정·정적 평가·문서 초안을 작성했다. 구현, YAML 상태 변경, 브라우저 검증, 타입 검사, ESLint 검사, 빌드, 커밋·PR 병합은 수행하지 않았다.
