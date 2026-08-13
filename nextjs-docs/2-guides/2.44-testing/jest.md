# Jest

- 공식 문서: [Jest](https://nextjs.org/docs/app/guides/testing/jest)
- 상위 메뉴: [Testing](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `next/jest`와 React Testing Library로 Next.js 단위 테스트 환경을 구성한다.
- 경로 별칭, DOM matcher, 환경 변수처럼 프로젝트별 설정을 연결한다.
- 동기 컴포넌트 테스트와 `async` Server Component E2E 테스트를 구분한다.

## 핵심 개념 및 설명

Jest와 React Testing Library는 단위 테스트와 스냅샷 테스트에 자주 함께 쓰인다.

> **알아두면 좋은 점**: Jest는 현재 `async` Server Component를 지원하지 않는다. 동기 Server Component와 Client Component는 단위 테스트할 수 있지만 `async` 컴포넌트는 E2E 테스트를 권장한다.

### 빠른 시작과 수동 설정

```bash
pnpm create next-app --example with-jest with-jest-app
```

기존 프로젝트에서는 필요한 패키지를 설치하고 `pnpm create jest@latest`로 기본 설정을 만든다.

```bash
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
pnpm create jest@latest
```

`next/jest`는 Next.js Compiler transform, CSS·이미지·`next/font` mock, `.env` 로드, `node_modules`와 `.next` 제외, `next.config.js` 로드를 자동 구성한다.

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

환경 변수 자체를 테스트한다면 별도 setup 스크립트나 `jest.config.ts`에서 직접 불러온다.

### 경로 별칭과 DOM matcher

`tsconfig.json`이나 `jsconfig.json`의 경로 별칭은 Jest의 `moduleNameMapper`에도 맞춰야 한다.

```ts
moduleNameMapper: {
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

`jest.setup.ts`에서 `@testing-library/jest-dom`을 불러오면 `toBeInTheDocument()` 같은 matcher를 쓸 수 있다.

```ts
import '@testing-library/jest-dom'
```

> **알아두면 좋은 점**: `@testing-library/jest-dom` v6에서 `extend-expect`가 제거됐다. v6 이상은 `@testing-library/jest-dom`을 직접 import한다.

### 첫 테스트와 스냅샷

```tsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('제목을 렌더링한다', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
```

스냅샷은 예상하지 못한 렌더링 변경을 찾는 보조 수단이다. 변경된 스냅샷을 무조건 갱신하지 말고 의도한 결과인지 검토한다.

```tsx
const { container } = render(<Page />)
expect(container).toMatchSnapshot()
```

`package.json`에는 일반 실행과 watch 실행을 나눈다.

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### 추가 자료

| 자료 | 링크 |
|---|---|
| Next.js Jest 예제 | [GitHub](https://github.com/vercel/next.js/tree/canary/examples/with-jest) |
| Jest 문서 | [공식 문서](https://jestjs.io/docs/getting-started) |
| React Testing Library 문서 | [공식 문서](https://testing-library.com/docs/react-testing-library/intro/) |
| Testing Playground | [도구 열기](https://testing-playground.com/) |

## 예제 및 데모 설계

- Phase 2에서 홈 페이지의 접근 가능한 제목을 role 기반 쿼리로 검사한다.
- 경로 별칭으로 불러온 컴포넌트가 Jest에서도 해석되는지 확인한다.
- 의도적으로 마크업을 변경해 단위 assertion과 스냅샷 실패 메시지를 비교한다.

## 연습 문제

1. `next/jest`가 자동 구성하는 항목이 아닌 것은 무엇인가?

   1. Next.js Compiler transform
   2. 스타일시트와 이미지 import mock
   3. E2E 브라우저 실행
   4. `.next` 테스트 탐색 제외

   <details><summary>정답 보기</summary>

   **정답: 3**. Jest 구성은 단위 테스트 환경을 마련하며 실제 E2E 브라우저를 실행하지 않는다.

   </details>

2. `tsconfig.json`의 경로 별칭을 Jest에서 쓰려면 무엇을 맞춰야 하는가?

   1. `moduleNameMapper`
   2. `baseURL`
   3. `webServer`
   4. `pageExtensions`

   <details><summary>정답 보기</summary>

   **정답: 1**. TypeScript의 paths와 같은 경로를 `moduleNameMapper`에 매핑한다.

   </details>

## 챕터 요약

- Jest와 React Testing Library는 단위 테스트와 스냅샷 테스트에 자주 함께 쓰인다.
- `next/jest`는 Next.js에 필요한 transform, mock, 환경 설정을 자동 구성한다.
- 경로 별칭은 `moduleNameMapper`, DOM matcher는 setup 파일에서 연결한다.
- 스냅샷 차이는 자동 승인하지 말고 의도한 UI 변경인지 확인한다.
- `async` Server Component는 현재 Jest 대신 E2E 테스트를 우선한다.
