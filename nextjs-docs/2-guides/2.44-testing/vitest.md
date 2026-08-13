# Vitest

- 공식 문서: [Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- 상위 메뉴: [Testing](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Vitest와 React Testing Library로 Next.js 단위 테스트 환경을 구성한다.
- TypeScript 경로 별칭과 `jsdom` 환경을 설정한다.
- Vitest로 검사할 컴포넌트와 E2E 테스트로 넘길 대상을 구분한다.

## 핵심 개념 및 설명

Vitest는 React Testing Library와 함께 컴포넌트 단위 테스트에 사용할 수 있는 Vite 기반 테스트 러너다.

> **알아두면 좋은 점**: Vitest는 현재 `async` Server Component를 지원하지 않는다. 동기 Server Component와 Client Component는 단위 테스트할 수 있지만 `async` 컴포넌트에는 E2E 테스트를 사용한다.

### 빠른 시작

```bash
pnpm create next-app --example with-vitest with-vitest-app
```

### 수동 설정

TypeScript 프로젝트는 경로 별칭 플러그인까지 설치한다.

```bash
# TypeScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# JavaScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```ts
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})
```

`package.json`에 `"test": "vitest"`를 추가한다. 기본 실행은 파일 변경을 감지하는 watch 모드다.

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### 첫 단위 테스트

테스트할 페이지를 만든다.

```tsx
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

```tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(
    screen.getByRole('heading', { level: 1, name: 'Home' })
  ).toBeDefined()
})
```

role과 접근 가능한 이름으로 요소를 찾으면 구현 세부 클래스보다 사용자가 인식하는 UI를 검사할 수 있다.

> **알아두면 좋은 점**: 예제처럼 루트 `__tests__` 폴더를 써도 되고 테스트 파일을 App Router 코드 가까이에 배치해도 된다.

### 테스트 실행

`pnpm test`로 Vitest를 실행한다. 기본 watch 모드에서는 파일 변경을 감지해 관련 테스트를 다시 실행한다.

### 추가 자료

| 자료 | 링크 |
|---|---|
| Next.js Vitest 예제 | [GitHub](https://github.com/vercel/next.js/tree/canary/examples/with-vitest) |
| Vitest 문서 | [공식 문서](https://vitest.dev/guide/) |
| React Testing Library 문서 | [공식 문서](https://testing-library.com/docs/react-testing-library/intro/) |

## 예제 및 데모 설계

- Phase 2에서 홈 페이지와 작은 Client Component를 `jsdom`에 렌더링한다.
- `vite-tsconfig-paths`를 켜고 끄면서 `@/` 별칭 import의 성공 여부를 비교한다.
- 같은 화면의 `async` Server Component 영역은 Playwright E2E 테스트로 분리한다.

## 연습 문제

1. 브라우저 DOM을 흉내 내는 Vitest 테스트 환경은 무엇인가?

   1. `node-terminal`
   2. `jsdom`
   3. `webServer`
   4. `edge`

   <details><summary>정답 보기</summary>

   **정답: 2**. React Testing Library로 DOM을 검사할 때 `jsdom` 환경을 사용한다.

   </details>

2. Vitest 단위 테스트보다 E2E 테스트가 권장되는 대상은 무엇인가?

   1. 순수 덧셈 함수
   2. 동기 Client Component
   3. `async` Server Component
   4. 정적 문자열 상수

   <details><summary>정답 보기</summary>

   **정답: 3**. 현재 Vitest는 `async` Server Component를 지원하지 않는다.

   </details>

## 챕터 요약

- Vitest와 React Testing Library를 함께 사용해 Next.js 컴포넌트를 단위 테스트할 수 있다.
- `jsdom`은 브라우저 없이 DOM 환경을 제공한다.
- TypeScript 경로 별칭은 `vite-tsconfig-paths`로 연결할 수 있다.
- 테스트 파일은 `__tests__` 또는 대상 코드 가까이에 배치할 수 있다.
- `async` Server Component는 Vitest 대신 E2E 테스트로 검증한다.
