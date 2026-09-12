Spec: 쿠키 삭제와 redirect 실습 3개의 실제 요청 기반 학습
Intent: ./intent.md
Author: Codex
Status: done
Approval: 별도 승인 PR 없이 intent 대화 승인을 근거로 구현·검증·공개까지 진행했다. 검증 결과는 [`plan.md`](./plan.md) 참고.

## Requirements

- R1. 지정된 세 stub을 실제 API로 재구성하고 가이드 → 실습화면 → 검증 → 개념 정리를 연결한다. 기존 4단 구조와 `@study/demo-kit`을 사용한다.
- R2. 쿠키 삭제는 브라우저가 삭제 응답을 적용한 뒤의 별도 서버 요청으로 확인한다. 초기 게스트 상태만으로 삭제 성공을 표시하지 않는다.
- R3. 실제 Server Action 폼과 완료 라우트를 연결한다. JavaScript 활성 내비게이션과 비활성 폼 제출의 HTTP 303 → GET을 구분한다.
- R4. 실제 Route Handler의 307을 통해 POST 메서드와 본문이 유지되는 것을 보여준다. GET 비교는 POST 목표에 불일치이며, GET 보존 자체는 정상 동작이라고 설명한다.
- R5. 관측값이 없으면 대기, 실제 조건이 어긋나면 불일치, 모두 충족되면 성공으로 표시한다. 입력 변경·실패·초기화 후 이전 성공을 무조건 재사용하지 않는다.
- R6. 최초 진입, 정상·실패, 초기화·재실행, 콘솔·런타임·hydration, 실제 요청을 검증한 뒤 해당 항목만 공개한다. 생성 매니페스트는 빌드로 갱신한다.
- R7. 실행 코드와 회귀 테스트는 세 실습 디렉토리 안에 둔다. 새 패키지, 공통 UI 수정, 다른 실습 수정, 설정 변경은 하지 않는다. 파일당 250줄 이내로 분리한다.

## Non-goals

실제 로그인·결제·주문 영속 저장, 서명된 인증 토큰, 중복 주문 전체 방지, 서버 세션 저장소 폐기, 다른 stub 공개, 셸 URL 정책 변경은 다루지 않는다. 예시 회원·상품·확인서는 학습용임을 화면에 명시한다.

## Design

### 공통 화면과 검증

`DemoContainer` 안에 `DemoGuideCard`, `DemoPlaygroundCard`, `ExpectedActualPanel`, `DemoDeepDiveCard`를 순서대로 둔다. `DemoResetButton.onReset`은 각 데모의 실제 초기화 작업을 수행한다. 제목·공식 문서 링크 등 셸 chrome은 중복하지 않는다.

Expected/Actual은 JSX 노드로 전달한다. `ExpectedActualPanel`은 문자열끼리 자동 비교하므로 `isMatched`만 생략하면 대기가 아니라 불일치로 계산될 수 있다. 검증 전에는 `isMatched`를 생략하고, 검증 후에는 명시적 boolean을 전달한다. 공통 패널을 변경하지 않는다.

사용자에게 필요한 요청 방식·쿠키 존재·상품·수량·최종 경로만 표시한다. 요청 식별자는 제출과 응답을 연결하는 내부 검증에 사용하며 과도한 디버깅 패널을 만들지 않는다. `MOCK_PRODUCTS`와 `ProductCard`, 쿠키 페이지의 `MOCK_USER_SESSIONS`를 재사용한다.

### 쿠키 삭제: `functions/cookies/delete-logout`

학습 순서: 실습 준비 → 회원 쿠키 생성 → 삭제 전 검증 실패 → 로그아웃 → 새 서버 요청의 쿠키 부재 확인 → 초기화·재실행.

- 전용 쿠키 이름은 `study-cookies-delete-logout-session`, 값은 `demo-vip`, path는 `/zone/baseline/functions/cookies/delete-logout`이다. `httpOnly`, `sameSite: lax`를 사용하고 운영 HTTPS에서는 `secure`를 적용한다. 다른 데모의 쿠키를 읽거나 지우지 않는다.
- `actions.ts`에 읽기·생성·삭제 Server Action을 둔다. 삭제는 생성 때와 동일한 이름·path를 사용한다. 삭제 전에 실습 쿠키가 있었는지 반환할 수 있지만, 이 응답을 브라우저 삭제 결과로 간주하지 않는다.
- 생성·삭제 액션이 끝나면 클라이언트가 읽기 액션을 별도 호출한다. 검증 버튼도 새 읽기 요청을 수행한다.
- 이번 실행에서 생성 후 서버 확인을 마쳤고, 해당 쿠키가 있는 상태에서 삭제 액션을 수행했으며, 검증 요청에서 쿠키가 없을 때만 성공한다.
- 최초·재진입 시 전용 쿠키 삭제와 별도 읽기를 마칠 때까지 준비 중으로 표시한다. 실패하면 조작을 열거나 게스트라고 단정하지 않고 재시도를 제공한다. 개발 모드 effect 재실행으로 늦은 초기화가 사용자 조작을 덮지 않게 한다.
- 생성·삭제·검증·초기화 중에는 조작을 직렬화한다. 새 조작은 이전 검증을 비운다. 초기화는 실제 쿠키 부재를 확인한 뒤 이력과 결과를 초기 상태로 돌린다.
- 개념 정리는 Server Action → Set-Cookie 만료 지시 → 브라우저 적용 → 다음 요청 순서로 설명한다. 만료 헤더가 반드시 `Max-Age=0`이라고 단정하지 않는다.

### Server Action: `functions/redirect/action-303`

학습 순서: 상품·수량 제출 → 서버 입력 검증 → 완료 라우트 이동 → 저장된 확인서 대조 → JS 비활성 제출과 303 비교.

- 서버에서 렌더링되는 실제 form과 submit 버튼을 사용한다. JS 없이 제출할 수 있도록 필수 입력·오류·결과·초기화의 핵심 흐름을 클라이언트 effect에 의존시키지 않는다.
- 서버는 허용된 예시 상품과 정수 수량 1~10을 검증한다. 잘못된 입력은 서버가 거부하고 완료 라우트로 이동하지 않는다. 이전 확인서를 새 성공으로 표시하지 않는다.
- 정상 제출에서는 새 무작위 `receiptId`와 검증된 상품·수량·발급 시각을 전용 HttpOnly JSON 쿠키 `study-redirect-action-303-receipt`에 저장한다. path는 해당 실습 경로, 보관 시간은 10분이며 같은 이름/path로 초기화한다.
- 메모리 Map 대신 쿠키를 사용하여 서버 인스턴스가 바뀌어도 확인서를 읽을 수 있게 한다. 이 확인서는 인증·위변조 방지 수단이 아니다. 새 secret이나 서명 시스템을 추가하지 않는다.
- 저장 후 실제 `redirect()`로 실습 내부 `complete` 라우트에 이동한다. `redirect()`를 일반 try/catch의 try 안에서 삼키지 않는다.
- 완료 페이지는 쿠키의 형식·유효 기간·허용 상품·수량과 URL의 receiptId 일치를 서버에서 검사한다. 임의 URL, 누락·만료·형식 오류 쿠키, id 불일치는 실패한다.
- 검증 제목은 저장된 확인서와 완료 경로의 일치로 한정한다. 유효 확인서가 있는 완료 URL 재방문·새로고침은 기존 확인서 재조회이며 새 제출·redirect가 발생했다고 표시하지 않는다. HTTP 동작은 Network에서 별도로 관찰한다.
- 초기화는 확인서 쿠키를 삭제하고 시작 라우트로 이동한다. JS on에서는 `DemoResetButton`에 연결하고 JS off에서도 동작하는 서버 form 제출 경로를 함께 제공한다. 시작 페이지는 이전 확인서가 남아 있어도 새 실습의 대기 상태로 표시한다.
- JS on에서는 설치 16.3.2의 fetch action 응답 200/`x-action-redirect`와 내비게이션을 관찰한다. JS off에서는 native POST의 303/Location과 뒤따르는 GET을 확인한다. UI에 상수 303을 실제 측정값으로 출력하지 않는다.

### Route Handler: `functions/redirect/handler-307`

학습 순서: 상품·수량 POST → 이전 접수 주소의 307 → 새 접수 주소의 POST·본문 관찰 → GET 비교 → 초기화.

- `submit/route.ts`와 `receipt/route.ts`에 실제 GET/POST 핸들러를 둔다. submit의 POST는 상대 receipt 주소로 `redirect()`만 수행한다. 서버가 본문을 대신 재전송하지 않는다.
- GET 비교에서는 query를 전달한다. receipt는 실제 메서드와 JSON 본문 또는 query에서 읽은 상품·수량·requestId, 입력 출처를 응답한다. 잘못된 JSON·상품·수량·누락 식별자는 400으로 거부한다. 응답은 `no-store`로 둔다.
- 실행 직전 상품·수량·메서드·requestId를 고정한다. 실제 응답은 제출 당시 값과 비교하며, 진행 중 입력 변경이 마지막 요청의 기대값을 바꾸지 않게 한다.
- POST 성공은 최종 응답 성공, `response.redirected`, 정확한 동일 origin/receipt 경로, 수신 POST, 본문 출처, 상품·수량·requestId 일치를 모두 요구한다.
- GET의 정상 응답은 POST 학습 목표에는 불일치다. “307은 GET을 POST로 바꾸지 않는다”는 이유를 함께 표시한다. 네트워크 실패와 혼동하지 않는다.
- fetch의 최종 응답 상태를 표시하고 중간 307은 Network에서 확인하도록 안내한다. 브라우저의 manual redirect 응답에서 307을 읽을 수 있다고 가정하지 않는다.
- 새 요청·초기화·unmount 때 이전 요청을 취소하고 세대 번호로 늦은 success/catch/finally를 무시한다. 초기화는 요청 중에도 가능하며 이전 결과가 다시 나타나지 않는다.

## Acceptance criteria

| ID | 입력·행동 | 관찰 결과 |
|---|---|---|
| A1 | 세 페이지 첫 진입 | 4단 순서, 검증 대기, 조작 전 성공 없음 |
| A2 | 쿠키 생성 후 삭제 없이 검증 | 실제 쿠키 존재와 불일치 |
| A3 | 생성·로그아웃 후 검증 | 별도 요청의 부재와 성공; Network에 실제 생성·만료 응답 |
| A4 | 초기 게스트 또는 수동 쿠키 삭제 후 검증 | 필요한 생성·삭제 이력이 없어 성공하지 않음 |
| A5 | 쿠키 초기화·재생성, 요청 실패 | 이전 성공 해제; 다른 실습 쿠키 보존; 실패를 게스트로 처리하지 않음 |
| A6 | 정상 Action 제출, JS on | 실제 서버 처리, 완료 이동, 확인서 일치, 200/action redirect 관찰 |
| A7 | 같은 Action form, JS off | native POST 303 + Location → GET, 서버 렌더 결과 확인 |
| A8 | 잘못된 수량/상품, 임의 완료 URL/id | 완료 성공 없음, 서버 오류 또는 불일치 |
| A9 | 완료 새로고침·초기화·재제출 | 기존 확인서 재조회와 신규 제출 구분, 삭제 후 옛 URL 실패, 신규 receiptId |
| A10 | Handler POST | 중간 307/Location, 최종 POST·본문 일치, 자동 검증 성공 |
| A11 | Handler GET 비교 | GET/query 수신, POST 목표 불일치와 정확한 이유 |
| A12 | Handler 잘못된 JSON·상품·수량 | 서버 400, 성공 배지 없음 |
| A13 | 요청 중 초기화·재요청·입력 변경 | 늦은 응답이 새 상태를 덮지 않고 제출 snapshot 기준 판정 |
| A14 | 네트워크 실패 후 복구 | 오류 표시, 재실행 정상, 가짜 응답값 없음 |
| A15 | 셸·직접 zone, desktop·390px | 가이드 수행 가능, iframe 내부 이동, 콘솔·hydration 오류 없음 |
| A16 | 대상 검증 및 공개 전환 | YAML 정확히 3개 done, 생성 manifest 일치, 등록 검사·타입·빌드 결과 기록 |

## Open questions

제품 범위를 바꾸는 미해결 질문은 없다. 실제 브라우저·빌드 통과 여부는 구현 후 확인한다. ESLint 설정·직접 의존성·baseline lint script가 현재 없어 ESLint 통과를 약속하지 않으며 새 설치 없이 확인 가능한 검사와 이 제한을 구분해 보고한다.
