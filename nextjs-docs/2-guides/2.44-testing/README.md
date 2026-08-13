# Testing

- 공식 문서: [Testing](https://nextjs.org/docs/app/guides/testing)
- 상위 메뉴: [Guides](../README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 단위, 컴포넌트, 통합, E2E, 스냅샷 테스트의 목적을 구분한다.
- 테스트 대상과 신뢰 범위에 맞춰 Cypress, Jest, Playwright, Vitest 중 알맞은 도구를 고른다.
- `async` Server Component를 검사할 때 E2E 테스트가 권장되는 이유를 설명한다.

## 핵심 개념 및 설명

테스트 종류는 서로 경쟁하는 선택지가 아니라 서로 다른 실패를 잡는 계층이다. 작은 함수는 단위 테스트로 빠르게 확인하고, 여러 모듈이 연결되는 지점은 통합 테스트로 검사한다. 사용자가 브라우저에서 수행하는 핵심 흐름은 E2E 테스트로 보장한다.

### 테스트 종류

- **단위 테스트(Unit Testing)**: 함수, 훅, 컴포넌트처럼 독립된 코드 단위를 격리해 검사한다.
- **컴포넌트 테스트(Component Testing)**: React 컴포넌트의 렌더링 결과, props 처리, 사용자 이벤트 반응을 집중적으로 검사한다.
- **통합 테스트(Integration Testing)**: 여러 컴포넌트, 훅, 함수가 함께 동작하는 경계를 검사한다.
- **E2E 테스트(End-to-End Testing)**: 실제 브라우저와 비슷한 환경에서 회원 가입 같은 사용자 흐름 전체를 검사한다.
- **스냅샷 테스트(Snapshot Testing)**: 렌더링 결과를 저장해 두고 이후 결과와 비교한다. 차이가 생기면 의도한 변경인지 검토한다.

### `async` Server Component

`async` Server Component는 React 생태계에서 비교적 새로운 실행 모델이어서 일부 단위·컴포넌트 테스트 도구가 아직 완전히 지원하지 않는다. 동기 Server Component와 Client Component는 단위 테스트할 수 있지만, `async` 컴포넌트는 서버 렌더링과 데이터 요청까지 포함하는 E2E 테스트를 우선한다.

### 도구별 역할

| 도구 | 주된 테스트 범위 | 특징 |
|---|---|---|
| [Cypress](./cypress.md) | E2E, 컴포넌트 | 대화형 러너와 브라우저 기반 디버깅 |
| [Jest](./jest.md) | 단위, 스냅샷 | `next/jest`로 Next.js 설정을 자동 반영 |
| [Playwright](./playwright.md) | E2E | Chromium, Firefox, WebKit을 한 API로 자동화 |
| [Vitest](./vitest.md) | 단위 | Vite 기반의 빠른 실행과 watch 모드 |

네 도구는 서로 대체 가능한 부분이 있으므로 학습 순서는 참고용이다. 프로젝트가 이미 쓰는 생태계, 검사할 범위, CI 환경을 기준으로 고른다.

## 예제 및 데모 설계

- Phase 2에서 순수 함수 단위 테스트, 페이지 컴포넌트 테스트, 홈에서 About으로 이동하는 E2E 테스트를 같은 기능에 작성한다.
- 실패 메시지와 실행 시간을 비교해 각 테스트 계층이 잡아내는 오류와 비용을 기록한다.
- `async` Server Component는 브라우저에서 데이터가 표시되는 흐름으로 검증하고 단위 테스트 결과와 차이를 비교한다.

## 연습 문제

1. 실제 브라우저에서 회원 가입 흐름 전체를 검사하기 알맞은 테스트는 무엇인가?

   1. 단위 테스트
   2. 스냅샷 테스트
   3. E2E 테스트
   4. 정적 타입 검사

   <details><summary>정답 보기</summary>

   **정답: 3**. E2E 테스트는 실제 사용자 시나리오와 비슷한 환경에서 흐름 전체를 검사한다.

   </details>

2. 현재 `async` Server Component에 권장되는 접근은 무엇인가?

   1. 스냅샷만 저장한다.
   2. E2E 테스트를 우선한다.
   3. 테스트하지 않는다.
   4. CSS 검사로 대체한다.

   <details><summary>정답 보기</summary>

   **정답: 2**. 일부 단위 테스트 도구가 비동기 Server Component를 완전히 지원하지 않아 E2E 테스트가 권장된다.

   </details>

## 챕터 요약

- 단위, 컴포넌트, 통합, E2E, 스냅샷 테스트는 서로 다른 범위의 실패를 찾는다.
- 작은 단위는 빠른 테스트로, 핵심 사용자 흐름은 E2E 테스트로 보호한다.
- `async` Server Component는 현재 E2E 테스트를 우선하는 편이 안전하다.
- Cypress와 Playwright는 브라우저 흐름, Jest와 Vitest는 주로 단위 테스트에 쓰인다.
- 도구는 유행보다 프로젝트 환경과 필요한 신뢰 범위에 맞춰 선택한다.
