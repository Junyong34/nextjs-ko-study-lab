# Playwright

- 공식 문서: [Playwright](https://nextjs.org/docs/app/guides/testing/playwright)
- 상위 메뉴: [Testing](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 프로젝트에 Playwright를 구성하고 첫 E2E 테스트를 작성한다.
- Chromium, Firefox, WebKit에서 같은 사용자 흐름을 검증한다.
- 로컬 서버와 CI 환경에 맞는 실행 방식을 설정한다.

## 핵심 개념 및 설명

Playwright는 하나의 API로 Chromium, Firefox, WebKit을 자동화하는 E2E 테스트 프레임워크다.

### 빠른 시작과 수동 설정

```bash
pnpm create next-app --example with-playwright with-playwright-app
```

기존 프로젝트에서는 설치 마법사가 `playwright.config.ts`를 비롯한 기본 파일을 만든다.

```bash
pnpm create playwright
```

### 내비게이션 E2E 테스트

테스트는 브라우저에서 홈을 열고 About 링크를 누른 뒤 URL과 제목을 검사한다.

```ts
import { test, expect } from '@playwright/test'

test('About 페이지로 이동한다', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.click('text=About')
  await expect(page).toHaveURL('http://localhost:3000/about')
  await expect(page.locator('h1')).toContainText('About')
})
```

> **알아두면 좋은 점**: `playwright.config.ts`에 `baseURL: 'http://localhost:3000'`을 지정하면 `page.goto('/')`와 상대 URL assertion을 사용할 수 있다.

### 서버 실행과 CI

실제 서비스에 가까운 조건으로 검사하려면 `npm run build`와 `npm run start`로 서버를 실행하고 다른 터미널에서 테스트한다.

```bash
npx playwright test
```

`webServer` 설정을 사용하면 Playwright가 서버를 시작하고 준비될 때까지 기다릴 수 있다.

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

CI에서는 기본적으로 headless 모드로 실행한다. 러너에 브라우저 의존성이 없다면 먼저 설치한다.

```bash
npx playwright install-deps
npx playwright test
```

### 추가 자료

| 자료 | 링크 |
|---|---|
| Next.js Playwright 예제 | [GitHub](https://github.com/vercel/next.js/tree/canary/examples/with-playwright) |
| Playwright CI 문서 | [공식 문서](https://playwright.dev/docs/ci) |
| Playwright Discord | [Discord](https://discord.com/invite/playwright-807756831384403968) |

## 예제 및 데모 설계

- Phase 2에서 홈에서 About으로 이동하는 흐름을 세 브라우저 프로젝트에서 실행한다.
- `webServer`가 프로덕션 서버를 준비한 뒤 테스트를 시작하는지 로그로 확인한다.
- URL, 제목, 접근 가능한 링크 중 하나를 일부러 바꿔 trace와 실패 화면을 분석한다.

## 연습 문제

1. Playwright가 하나의 API로 기본 지원하는 브라우저 엔진을 모두 고르시오.

   1. Chromium
   2. Firefox
   3. WebKit
   4. Servo

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 3**. Playwright는 Chromium, Firefox, WebKit을 자동화한다.

   </details>

2. 테스트 전에 서버를 자동으로 시작하고 준비 상태를 기다리는 설정은 무엇인가?

   1. `moduleNameMapper`
   2. `webServer`
   3. `setupFilesAfterEnv`
   4. `coverageProvider`

   <details><summary>정답 보기</summary>

   **정답: 2**. `webServer`가 지정한 명령을 실행하고 URL이 준비될 때까지 기다린다.

   </details>

## 챕터 요약

- Playwright는 Chromium, Firefox, WebKit에서 E2E 흐름을 검사한다.
- 빠른 시작 예제나 설치 마법사로 기본 구성을 만들 수 있다.
- `baseURL`은 테스트의 반복되는 호스트 주소를 줄인다.
- `webServer`는 서버 시작과 준비 대기를 테스트 실행에 연결한다.
- CI에서는 브라우저 의존성을 설치하고 headless 모드로 실행한다.
