Intent: baseline 설정·환경변수·서버 전용 모듈 실습 3개 재구성
Author: Claude
Status: done
Approval: 2026-09-21 대화 승인. 사용자가 baseline zone에서 3개 stub을 지정하고, config 변경(poweredByHeader: false 실제 반영)과 .env 신규 추가 방향을 명시적으로 승인했다. 같은 대화에서 세 데모 모두 구현·검증·done 전환을 완료했다(상세는 plan.md).

## Problem

demos.yaml에서 baseline zone의 stub 3개를 선정했다. 모두 조사 결과 실제 API/설정 동작을 검증하지 않는 시뮬레이션 상태다.

| 대상 | 현재 문제 |
|---|---|
| `config/powered-by-header/hide-x-powered` | 실습화면이 쇼핑몰 로그 UI로, 주제(HTTP 응답 헤더)와 무관. `poweredByHeader: false` 설정 자체가 `next.config.ts`에 없어 검증 대상이 존재하지 않는다. `VerificationFooter`는 props 미전달로 항상 대기 중. |
| `guides/environment-variables/public-vs-server` | 실습화면이 `process.env` 참조 없이 두 값을 하드코딩한 정적 카드. `.env` 파일 자체가 없어 `NEXT_PUBLIC_API_URL`/`PAYMENT_SECRET_KEY`가 실제 환경변수로 존재하지 않는다. 상호작용 요소(버튼) 자체가 없다. |
| `guides/data-security/server-only-guard` | `server-only` import와 Server Action 골격은 실제로 있으나, 검증이 "응답 JSON에 시크릿 원문이 없다"만 확인할 뿐 `server-only`의 핵심 역할(클라이언트 번들 유입 차단)과 무관하다 — `server-only`를 지워도 같은 결과가 나온다. 개념 정리의 예시 파일 경로(`lib/db/orders.ts`)도 실제 파일(`lib/orderSyncSecret.ts`)과 다르다. |

## Proposed outcome

- `powered-by-header`: `nextjs-app/apps/demo-baseline/next.config.ts`에 실제 `poweredByHeader: false`를 반영한다. 실습화면은 클라이언트에서 자기 자신의 응답을 `fetch()`해 `x-powered-by` 헤더가 실제로 없는지 관찰한다(REBUILD).
- `environment-variables/public-vs-server`: demo-baseline에 실제 `.env` 파일을 추가해 `NEXT_PUBLIC_` 접두사 변수와 서버 전용 변수를 정의한다. Server Component와 Client Component가 각각 같은 두 값을 읽어, 서버는 둘 다 보이고 클라이언트는 `NEXT_PUBLIC_` 값만 보이는 것을 나란히 비교한다(REBUILD).
- `server-only-guard`: 기존 Server Action + `server-only` 모듈 골격은 유지하되, 실습화면이 실제 클라이언트 JS 번들 청크를 `fetch()`해 시크릿 문자열이 전혀 포함되지 않았는지 직접 검사하도록 검증 로직을 교체한다. `server-only`가 막는 것이 정확히 "클라이언트 번들 유입"임을 실측으로 증명한다(IMPROVE). 개념 정리의 잘못된 파일 경로 언급도 수정한다.
- 세 항목 모두 완료 기준·런타임 검증·타입/빌드/매니페스트 검증을 마친 뒤에만 `demos.yaml`에서 `done`으로 전환한다.

## Requirements / Design 통합

- `@study/demo-kit`의 4단 표준 컴포넌트(`DemoContainer`/`DemoGuideCard`/`DemoPlaygroundCard`/`ExpectedActualPanel`/`DemoDeepDiveCard`/`DemoResetButton`, 세 데모 모두 `DemoResetButton` 미사용이었으므로 추가)를 재사용한다.
- `config/powered-by-header`: `next.config.ts` 변경은 이 데모의 주제 자체이므로 범위 내. 다른 데모나 셸 설정은 건드리지 않는다.
- `environment-variables/public-vs-server`: 추가하는 `.env` 값은 실제 비밀이 아닌 데모용 문자열임을 명확히 하고(예: `NEXT_PUBLIC_STORE_NAME`, `INTERNAL_ADMIN_EMAIL`), `.env`(커밋 대상, `.env.local` 아님)에 정의한다.
- `server-only-guard`: 새 의존성 추가 없이 브라우저 `fetch()` + 리소스 목록(`performance.getEntriesByType('resource')` 또는 `<script>` 태그 수집)만으로 번들 청크 텍스트를 검사한다.
- 파일당 250줄 제한, 이번 3개 데모 디렉토리 안의 파일만 수정(단, `next.config.ts`와 `.env`는 예외적으로 주제 자체이므로 포함).

## Acceptance criteria

- `powered-by-header`: curl/브라우저 fetch로 실제 응답에 `x-powered-by` 헤더가 없음을 확인 가능.
- `environment-variables`: 서버 렌더 결과와 클라이언트 렌더 결과를 비교했을 때, 서버 전용 값이 클라이언트에서 실제로 `undefined`/미노출임을 확인 가능.
- `server-only-guard`: 실제 클라이언트 JS 번들 청크 전체를 검사해 시크릿 문자열이 없음을 확인. `server-only`를 제거했을 때 이 검증이 실패할 수 있는 구조인지(최소한 개념적으로) 개념 정리에서 설명.
- 세 데모 모두 검증 패널이 조작 전 대기, 조작 후 실측 기준 성공/실패를 반영.
- TypeScript·`next build`·`@study/demos` lint/build 통과.

## Affected users and systems

- 사용자: Next.js 설정(`poweredByHeader`), 환경변수 노출 범위, `server-only` 번들 격리를 처음 실습하는 학습자.
- 시스템: `nextjs-app/apps/demo-baseline/next.config.ts`, `nextjs-app/apps/demo-baseline/.env`(신규), 위 3개 데모 디렉토리, `nextjs-app/packages/demos/demos.yaml`.

## Constraints

- 새 의존성 추가 없음. Next.js 16.3.2 / React 19 기본 API만 사용.
- 이번 3개 데모와 그 주제에 직접 속하는 `next.config.ts`/`.env` 외에는 다른 데모·공통 컴포넌트를 수정하지 않는다.
- `.env`에 추가하는 값은 실제 운영 비밀이 아님을 코드 주석·화면 문구로 명시한다.
