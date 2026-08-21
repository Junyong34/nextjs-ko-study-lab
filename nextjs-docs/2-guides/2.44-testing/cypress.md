# Cypress

- 공식 문서: [Cypress](https://nextjs.org/docs/app/guides/testing/cypress)
- 상위 메뉴: [Testing](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 프로젝트에 Cypress를 빠른 시작 또는 수동 방식으로 구성한다.
- E2E 테스트와 컴포넌트 테스트의 실행 조건과 한계를 구분한다.
- 대화형 실행과 CI용 headless 실행을 각각 설정한다.

## 핵심 개념 및 설명

Cypress는 E2E 테스트와 컴포넌트 테스트를 지원하는 테스트 러너다.

> **경고**: Cypress `13.6.3` 미만은 `moduleResolution: "bundler"`를 사용하는 TypeScript 5를 지원하지 않는다. 이 문제는 `13.6.3`부터 해결됐다.

### 빠른 시작

공식 예제로 새 프로젝트를 만들 수 있다.

```bash
pnpm create next-app --example with-cypress with-cypress-app
```

### 수동 설정

기존 프로젝트에는 개발 의존성을 설치하고 실행 스크립트를 추가한다.

```bash
pnpm add -D cypress
```

```json filename="package.json"
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

`pnpm cypress:open`을 처음 실행하면 E2E Testing과 Component Testing 중 필요한 구성을 선택할 수 있다. Cypress가 `cypress.config.js`와 `cypress` 폴더를 만든다.

```bash filename="package.json"
pnpm cypress:open
```

### E2E 테스트

E2E 모드는 실행 중인 Next.js 서버에 접속한다. 실제 배포 동작과 가까운 조건을 만들려면 `next build`와 `next start`로 프로덕션 빌드를 실행한 뒤 테스트한다.

홈과 About 페이지를 먼저 만든다.

```tsx filename="app/page.js"
// app/page.tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```tsx filename="app/about/page.js"
// app/about/page.tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

```ts filename="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

```ts filename="cypress/e2e/app.cy.js"
describe('Navigation', () => {
  it('should navigate to the about page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('a[href*="about"]').click()
    cy.url().should('include', '/about')
    cy.get('h1').contains('About')
  })
})
```

> **알아두면 좋은 점**:
>
> - `cypress.config.js`에 `baseUrl: 'http://localhost:3000'`을 지정하면 `cy.visit('/')`처럼 쓸 수 있다.
> - `start-server-and-test`를 사용하면 서버 시작과 Cypress 실행을 한 스크립트로 묶을 수 있다. 코드가 바뀌면 프로덕션 빌드를 다시 만들어야 한다.

#### E2E 테스트 실행

`pnpm build && pnpm start`로 프로덕션 서버를 실행하고 다른 터미널에서 `pnpm cypress:open`을 실행한다. 공식 문서는 실제 앱 동작에 더 가까운 프로덕션 코드를 대상으로 테스트할 것을 권장한다.

### 컴포넌트 테스트

컴포넌트 테스트는 앱 전체를 번들링하거나 Next.js 서버를 띄우지 않고 특정 컴포넌트만 마운트한다.

```ts filename="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```tsx filename="cypress/component/about.cy.tsx"
import Page from '../../app/page'

describe('<Page />', () => {
  it('홈 콘텐츠를 렌더링한다', () => {
    cy.mount(<Page />)
    cy.get('h1').contains('Home')
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

> **알아두면 좋은 점**:
>
> - Cypress 컴포넌트 테스트는 현재 `async` Server Component를 지원하지 않으므로 E2E 테스트를 사용한다.
> - Next.js 서버가 없기 때문에 서버에 의존하는 `<Image />` 같은 기능은 별도 구성 없이 동작하지 않을 수 있다.

#### 컴포넌트 테스트 실행

`pnpm cypress:open`을 실행하고 Component Testing suite를 선택한다.

### CI에서 실행하기

`cypress open`은 대화형 개발에, `cypress run`은 headless CI 실행에 적합하다.

```json filename="package.json"
{
  "scripts": {
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

### 추가 자료

| 자료 | 링크 |
|---|---|
| Next.js Cypress 예제 | [GitHub](https://github.com/vercel/next.js/tree/canary/examples/with-cypress) |
| Cypress CI 문서 | [공식 문서](https://docs.cypress.io/guides/continuous-integration/introduction) |
| Cypress GitHub Actions 가이드 | [공식 문서](https://on.cypress.io/github-actions) |
| 공식 Cypress GitHub Action | [GitHub](https://github.com/cypress-io/github-action) |
| Cypress Discord | [Discord](https://discord.com/invite/cypress) |

## 예제 및 데모 설계

- Phase 2에서 홈과 About 페이지를 만들고 링크 이동을 E2E 테스트한다.
- 같은 홈 페이지를 컴포넌트 테스트로 마운트해 링크 존재까지만 검사한다.
- 로컬에서는 대화형 러너로 실패 화면을 확인하고 CI에서는 headless 스크립트를 실행한다.

## 연습 문제

1. CI에서 Cypress를 대화형 창 없이 실행하는 명령은 무엇인가?

   1. `cypress open`
   2. `cypress run`
   3. `next test`
   4. `cypress dev`

   <details><summary>정답 보기</summary>

   **정답: 2**. `cypress run`은 headless 실행에 맞춰져 있다.

   </details>

2. 컴포넌트 테스트보다 E2E 테스트가 알맞은 대상을 모두 고르시오.

   1. `async` Server Component
   2. 페이지 간 실제 내비게이션
   3. 단일 동기 컴포넌트의 제목 렌더링
   4. 서버가 있어야 동작하는 기능

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 4**. 비동기 Server Component, 전체 내비게이션, 서버 의존 기능은 실행 중인 앱을 검사하는 E2E 테스트가 적합하다.

   </details>

## 챕터 요약

- Cypress는 E2E 테스트와 컴포넌트 테스트를 모두 지원한다.
- E2E 테스트는 실행 중인 Next.js 서버가 필요하며 프로덕션 빌드 대상으로 돌리는 편이 좋다.
- 컴포넌트 테스트는 빠르지만 `async` Server Component와 일부 서버 의존 기능에 한계가 있다.
- `baseUrl`과 `start-server-and-test`로 반복 실행 구성을 단순화할 수 있다.
- 개발 중에는 `cypress open`, CI에서는 `cypress run`을 사용한다.
