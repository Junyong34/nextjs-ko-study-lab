# Version 15

- 공식 문서: [Version 15](https://nextjs.org/docs/app/guides/upgrading/version-15)
- 상위 메뉴: [Upgrading](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 14에서 15로 올릴 때 필요한 codemod와 패키지 갱신 절차를 확인한다.
- `cookies`, `headers`, `draftMode`, `params`, `searchParams`가 비동기 API로 바뀐 영향을 코드에 반영한다.
- `fetch`와 Route Handler의 캐시 기본값, Client Cache 동작 변경이 라우트에 미치는 영향을 파악한다.

## 핵심 개념 및 설명

### Next.js 14에서 15로 업그레이드하기

`upgrade` codemod로 Next.js 15로 올릴 수 있다.

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

직접 올리려면 선호하는 패키지 관리 도구로 최신 Next.js와 React 버전을 설치한다.

```bash
pnpm add next@latest react@latest react-dom@latest eslint-config-next@latest
```

> **알아두면 좋은 점**: peer dependency 경고가 보이면 `react`, `react-dom`을 권장 버전으로 올리거나 `--force`, `--legacy-peer-deps` 플래그로 경고를 무시할 수 있다. Next.js 15와 React 19가 모두 stable이 되면 이 조치는 필요 없어진다.

### React 19

- `react`, `react-dom`의 최소 버전이 19로 올랐다.
- `useFormState`는 `useActionState`로 대체됐다. `useFormState`는 React 19에서도 여전히 쓸 수 있지만 deprecated 상태이며 이후 릴리스에서 제거된다. `pending` 상태를 직접 읽는 속성 등이 추가된 `useActionState`를 권장한다. [자세히 보기](https://react.dev/reference/react/useActionState).
- `useFormStatus`에 `data`, `method`, `action` 키가 추가됐다. React 19를 쓰지 않으면 `pending` 키만 사용할 수 있다. [자세히 보기](https://react.dev/reference/react-dom/hooks/useFormStatus).
- 자세한 내용은 [React 19 업그레이드 가이드](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)를 참고한다.

> **알아두면 좋은 점**: TypeScript를 사용한다면 `@types/react`, `@types/react-dom`도 최신 버전으로 올린다.

### 비동기 Request API (Breaking Change)

요청 정보에 의존하던 이전의 동기 Request-time API가 이제 **비동기**로 바뀐다.

- [`cookies`](../../3-api-reference/3.3-functions/cookies.md)
- [`headers`](../../3-api-reference/3.3-functions/headers.md)
- [`draftMode`](../../3-api-reference/3.3-functions/draft-mode.md)
- [`layout.js`](../../3-api-reference/3.1-file-conventions/layout.md), [`page.js`](../../3-api-reference/3.1-file-conventions/page.md), [`route.js`](../../3-api-reference/3.1-file-conventions/route.md), [`default.js`](../../3-api-reference/3.1-file-conventions/default.md), [`opengraph-image`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md), [`twitter-image`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md), [`icon`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md), [`apple-icon`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md)의 `params`
- [`page.js`](../../3-api-reference/3.1-file-conventions/page.md)의 `searchParams`

마이그레이션 부담을 줄이는 codemod가 있으며, 이 API들은 마이그레이션 기간 동안만 임시로 동기 접근도 지원한다.

#### `cookies`, `headers`, `draftMode`

권장하는 방식은 `await`로 값을 가져오는 것이다.

```ts
import { cookies } from 'next/headers'

// Before
const cookieStore = cookies()
const token = cookieStore.get('token')

// After
const cookieStore = await cookies()
const token = cookieStore.get('token')
```

`headers`, `draftMode`도 같은 방식으로 바뀐다 — `await headers()`, `await draftMode()`로 호출한다. 마이그레이션 기간에는 `UnsafeUnwrappedCookies`, `UnsafeUnwrappedHeaders`, `UnsafeUnwrappedDraftMode` 타입으로 감싸 임시로 동기 접근을 유지할 수 있지만, 개발 모드에서 경고가 출력된다.

```ts
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'

// 임시 동기 접근 — 개발 모드에서 경고가 출력된다
const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies
const token = cookieStore.get('token')
```

#### `params`와 `searchParams`

`Layout`, `Page`, `generateMetadata`가 받는 `params`(그리고 `Page`의 `searchParams`)는 이제 Promise 타입이다. Server Component에서는 `await`로 값을 꺼낸다.

```tsx
// app/layout.tsx — Before
type Params = { slug: string }

export function generateMetadata({ params }: { params: Params }) {
  const { slug } = params
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = params
}

// app/layout.tsx — After
type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = await params
}
```

`'use client'` 컴포넌트처럼 동기 함수로 남겨야 하는 곳에서는 React의 `use()`로 Promise를 풀어낸다.

```tsx
'use client'

import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: { params: Params; searchParams: SearchParams }) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

Route Handler의 두 번째 인자로 오는 `params`도 동일하게 Promise로 바뀐다.

```ts
// app/api/route.ts
type Params = Promise<{ slug: string }>

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params
  const slug = params.slug
}
```

### `runtime` 설정 (Breaking Change)

[Route Segment Config](../../3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/README.md)의 `runtime`은 이전에는 `edge` 외에 `experimental-edge` 값도 지원했다. 두 값이 같은 대상을 가리키므로 옵션을 단순화하기 위해 이제 `experimental-edge`를 쓰면 에러가 발생한다. `runtime` 설정을 `edge`로 바꾸면 해결되며, 이를 자동화하는 codemod가 있다.

### `fetch` 요청

[`fetch` 요청](../../3-api-reference/3.3-functions/fetch.md)은 더 이상 기본적으로 캐시되지 않는다. 특정 요청만 캐시하려면 `cache: 'force-cache'` 옵션을 전달한다.

```js
// app/layout.js
export default async function RootLayout() {
  const a = await fetch('https://...') // 캐시되지 않음
  const b = await fetch('https://...', { cache: 'force-cache' }) // 캐시됨
}
```

레이아웃이나 페이지의 모든 `fetch` 요청을 캐시하려면 `export const fetchCache = 'default-cache'` 세그먼트 설정을 사용한다. 개별 `fetch` 요청에 `cache` 옵션을 지정하면 그 값이 우선한다.

### Route Handlers

[Route Handlers](../../3-api-reference/3.1-file-conventions/route.md)의 `GET` 함수도 더 이상 기본적으로 캐시되지 않는다. `GET` 메서드를 캐시에 포함하려면 Route Handler 파일에 `export const dynamic = 'force-static'` 같은 라우트 설정 옵션을 사용한다.

### Client Cache

`<Link>`나 `useRouter`로 페이지 사이를 이동할 때, [page](../../3-api-reference/3.1-file-conventions/page.md) 세그먼트는 더 이상 Client Cache에서 재사용되지 않는다. 다만 브라우저의 뒤로·앞으로 가기 내비게이션과 공유 레이아웃에서는 여전히 재사용된다. [`staleTimes`](../../3-api-reference/3.5-config/3.5.1-next-config-js/staleTimes.md) 설정으로 page 세그먼트를 다시 캐시에 포함할 수 있다.

```js
// next.config.js
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
```

[레이아웃](../../3-api-reference/3.1-file-conventions/layout.md)과 로딩 상태는 내비게이션 중에도 여전히 캐시되어 재사용된다.

### `next/font`

`@next/font` 패키지가 제거되고 내장 [`next/font`](../../3-api-reference/3.2-components/font.md)로 대체됐다. import 이름을 안전하게 바꾸는 codemod가 있다.

```js
// app/layout.js — Before
import { Inter } from '@next/font/google'

// After
import { Inter } from 'next/font/google'
```

### `bundlePagesRouterDependencies`

`experimental.bundlePagesExternals`가 stable이 되면서 `bundlePagesRouterDependencies`로 이름이 바뀌었다.

```js
// next.config.js
const nextConfig = {
  // Before
  experimental: {
    bundlePagesExternals: true,
  },

  // After
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

### `serverExternalPackages`

`experimental.serverComponentsExternalPackages`가 stable이 되면서 `serverExternalPackages`로 이름이 바뀌었다.

```js
// next.config.js
const nextConfig = {
  // Before
  experimental: {
    serverComponentsExternalPackages: ['package-name'],
  },

  // After
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```

### Speed Insights

Next.js 15에서는 Speed Insights의 자동 계측이 제거됐다. 계속 사용하려면 [Vercel Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart) 가이드를 따른다.

### `NextRequest` Geolocation

호스팅 제공자가 제공하는 값이므로 `NextRequest`의 `geo`, `ip` 속성이 제거됐다. 이 마이그레이션을 자동화하는 codemod가 있다. Vercel을 사용한다면 [`@vercel/functions`](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package)의 `geolocation`, `ipAddress` 함수를 대신 사용할 수 있다.

```ts
// middleware.ts
import { geolocation } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { city } = geolocation(request)
}
```

```ts
// middleware.ts
import { ipAddress } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const ip = ipAddress(request)
}
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- Next.js 14 프로젝트에서 `upgrade` codemod를 실행하고, `cookies`·`headers`·`params`를 동기 → 비동기 방식으로 바꾼 전후 화면을 비교한다.
- 같은 라우트에서 `fetch` 캐시 옵션을 켜고 끈 상태의 응답 시간과 데이터 최신성을 비교한다.
- `<Link>` 내비게이션에서 `staleTimes` 설정 전후로 page 세그먼트 재사용 여부를 확인한다.

## 연습 문제

1. Next.js 15에서 `cookies()`를 기존처럼 동기로 호출하면 어떻게 되는가?
   - A. `await`로 바꿔야 하며, 마이그레이션 기간에만 `UnsafeUnwrappedCookies` 타입으로 임시 동기 접근을 유지할 수 있다
   - B. 아무 변경 없이 동일하게 동작한다
   - C. 빌드 시점에 항상 에러가 발생한다

   <details><summary>정답 보기</summary>

   정답: A. `cookies`, `headers`, `draftMode`는 비동기 API로 바뀌었고, 마이그레이션 기간에만 `UnsafeUnwrapped*` 타입으로 임시 동기 접근을 유지할 수 있다.

   </details>

2. Next.js 15에서 `fetch` 요청의 기본 캐시 동작은 무엇인가?
   - A. 기본적으로 캐시되지 않으며, `cache: 'force-cache'`로 opt-in해야 한다
   - B. 기본적으로 캐시되며, `cache: 'no-store'`로 opt-out해야 한다
   - C. Route Handler에서만 캐시되고 나머지는 캐시되지 않는다

   <details><summary>정답 보기</summary>

   정답: A. Next.js 15부터 `fetch` 요청은 기본적으로 캐시되지 않는다.

   </details>

3. `experimental.serverComponentsExternalPackages`를 대신하는 stable 설정 키는 무엇인가?
   - A. `serverExternalPackages`
   - B. `bundlePagesRouterDependencies`
   - C. `transpilePackages`

   <details><summary>정답 보기</summary>

   정답: A. `experimental.serverComponentsExternalPackages`는 stable이 되면서 `serverExternalPackages`로 이름이 바뀌었다.

   </details>

## 챕터 요약

- Next.js 15는 `upgrade` codemod 또는 수동 설치로 올리며, React 19가 최소 버전이다.
- `cookies`, `headers`, `draftMode`, `params`, `searchParams`가 비동기 API로 바뀌었고, 임시 동기 접근은 마이그레이션 기간에만 허용된다.
- `fetch`와 Route Handler의 `GET`은 더 이상 기본적으로 캐시되지 않으며, `staleTimes`로 Client Cache의 page 세그먼트 재사용을 되돌릴 수 있다.
- `bundlePagesRouterDependencies`, `serverExternalPackages`가 stable 옵션으로 이름이 바뀌었다.
- `@next/font`는 내장 `next/font`로, `NextRequest`의 `geo`/`ip`는 `@vercel/functions`로 대체됐다.
