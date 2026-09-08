# Codemods

- 공식 문서: [Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
- 상위 메뉴: [Upgrading](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `@next/codemod`의 실행 방법과 옵션을 구분한다.
- Next.js 버전별 codemod가 바꾸는 API와 파일 규칙을 확인한다.
- 자동 변환 뒤에 사람이 검토해야 하는 변경을 설명한다.

## 핵심 개념 및 설명

### 사용 방법

터미널에서 프로젝트 폴더로 이동한(`cd`) 뒤 다음을 실행한다.

```bash
npx @next/codemod <transform> <path>
```

`<transform>`과 `<path>`를 적절한 값으로 바꾼다.

- `transform` - 변환 이름
- `path` - 변환할 파일 또는 디렉터리
- `--dry` 실제로 코드를 바꾸지 않고 드라이런만 한다
- `--print` 비교를 위해 변경된 결과를 출력한다

### Upgrade

codemod를 자동으로 실행하면서 Next.js, React, React DOM을 함께 갱신해 애플리케이션을 올린다.

```bash
npx @next/codemod upgrade [revision]
```

#### Options

- `revision`(선택): 업그레이드 유형(`patch`, `minor`, `major`), NPM dist 태그(`latest`, `canary`, `rc` 등), 정확한 버전(`15.0.0` 등)을 지정한다. 생략하면 stable 버전 기준 `minor`가 기본값이다.
- `--verbose`: 업그레이드 과정에서 더 자세한 출력을 보여준다.
- `-y, --yes`: 모든 대화형 프롬프트를 건너뛰고 기본값(React 18 초과로 업그레이드, Turbopack 활성화, 권장 codemod 전체 적용, React를 올릴 때 React 19 codemod 실행)을 그대로 적용한다. 표준 입력이 TTY가 아닌 환경(CI, AI 코딩 에이전트, 그 밖의 비대화형 셸)에서는 자동으로 켜지므로 보통 명시적으로 지정할 필요가 없다.

예를 들면 다음과 같다.

```bash
# 최신 patch로 올린다 (예: 16.0.7 -> 16.0.8)
npx @next/codemod upgrade patch

# 최신 minor로 올린다 (예: 15.3.7 -> 15.4.8). 기본값이다.
npx @next/codemod upgrade minor

# 최신 major로 올린다 (예: 15.5.7 -> 16.0.7)
npx @next/codemod upgrade major

# 특정 버전으로 올린다
npx @next/codemod upgrade 16

# canary 릴리스로 올린다
npx @next/codemod upgrade canary

# 에이전트나 CI에서 실행: 모든 프롬프트를 건너뛴다
npx @next/codemod upgrade canary --yes
```

> **알아두면 좋은 점**:
>
> - 지정한 버전이 현재 버전과 같거나 낮으면 아무 변경 없이 종료한다.
> - 업그레이드 중에는 적용할 Next.js codemod를 고르거나, React를 올릴 때 React 19 codemod를 실행할지 확인하는 프롬프트가 나타날 수 있다.
> - AI 코딩 에이전트나 CI에서 호출되면(표준 입력이 TTY가 아닌 모든 환경) 프롬프트 없이 비대화형으로 실행되며 모든 기본값을 적용한다. 터미널에서도 이 동작을 강제하려면 `--yes`를 지정한다.

### Codemods

#### 16.3

##### Opt every route out of Cache Components validation

###### `cache-components-instant-false`

```bash
npx @next/codemod@canary cache-components-instant-false ./app
```

아직 `instant`를 export하지 않는 `app` 디렉터리의 모든 `{page,layout,default}` 파일에 `export const instant = false`를 추가한다. 이를 통해 [`cacheComponents`](../../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)를 켠 뒤 라우트마다 이 opt-out을 하나씩 제거해 나갈 수 있다. Client Component(`"use client"`)와 이미 `instant`를 선언한 파일은 건너뛴다.

> **알아두면 좋은 점**: `src/` 프로젝트라면 `./src/app`을 전달한다. 경로가 잘못되면 실패하지 않고 `0 ok`로 보고되므로 대상 파일 수를 확인한다.

```tsx
// app/page.tsx
+ // TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
+ // See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
+ export const instant = false
+
  export default function Page() {
    return <h1>Hello</h1>
  }
```

전체 채택 경로는 [Migrating to Cache Components](../migrating-to-cache-components.md) 가이드를 참고한다.

##### Remove `prefetch = 'partial'` Route Segment Config after enabling Partial Prefetching

###### `remove-partial-prefetch`

```bash
npx @next/codemod@canary remove-partial-prefetch ./app
```

`app` 디렉터리의 `{page,layout}` 파일에서 `export const prefetch = 'partial'`을 제거한다. 이를 통해 [`partialPrefetching`](../../3-api-reference/3.5-config/3.5.1-next-config-js/partialPrefetching.md)을 전역으로 켠 뒤 더 이상 필요 없어진 라우트별 opt-in을 지울 수 있다. `'partial'` 값만 제거하며 `prefetch = 'force-disabled'` 같은 다른 값은 그대로 둔다.

> **알아두면 좋은 점**: `src/` 프로젝트라면 `./src/app`을 전달한다. 경로가 잘못되면 실패하지 않고 `0 ok`로 보고되므로 대상 파일 수를 확인한다.

```tsx
// app/products/[slug]/page.tsx
- export const prefetch = 'partial'
```

전체 채택 경로는 [Adopting Partial Prefetching](../adopting-partial-prefetching.md) 가이드를 참고한다.

#### 16.0

##### Remove `experimental_ppr` Route Segment Config from App Router pages and layouts

###### `remove-experimental-ppr`

```bash
npx @next/codemod@latest remove-experimental-ppr .
```

App Router 페이지와 레이아웃에서 `experimental_ppr` Route Segment Config를 제거한다.

```tsx
// app/page.tsx
- export const experimental_ppr = true;
```

##### Remove `unstable_` prefix from stabilized API

###### `remove-unstable-prefix`

```bash
npx @next/codemod@latest remove-unstable-prefix .
```

안정화된 API에서 `unstable_` 접두사를 뺀다. 예를 들면 다음과 같다.

```ts
import { unstable_cacheTag as cacheTag } from 'next/cache'

cacheTag()
```

다음처럼 바뀐다.

```ts
import { cacheTag } from 'next/cache'

cacheTag()
```

##### Migrate from deprecated `middleware` convention to `proxy`

###### `middleware-to-proxy`

```bash
npx @next/codemod@latest middleware-to-proxy .
```

deprecated된 `middleware` 컨벤션을 쓰던 프로젝트를 `proxy` 컨벤션으로 옮긴다.

- `middleware.<extension>`을 `proxy.<extension>`으로 바꾼다(예: `middleware.ts` → `proxy.ts`)
- named export `middleware`를 `proxy`로 바꾼다
- Next.js 설정의 `experimental.middlewarePrefetch`를 `experimental.proxyPrefetch`로 바꾼다
- Next.js 설정의 `experimental.middlewareClientMaxBodySize`를 `experimental.proxyClientMaxBodySize`로 바꾼다
- Next.js 설정의 `experimental.externalMiddlewareRewritesResolve`를 `experimental.externalProxyRewritesResolve`로 바꾼다
- Next.js 설정의 `skipMiddlewareUrlNormalize`를 `skipProxyUrlNormalize`로 바꾼다

예를 들면 다음과 같다.

```ts
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}
```

다음처럼 바뀐다.

```ts
// proxy.ts
import { NextResponse } from 'next/server'

export function proxy() {
  return NextResponse.next()
}
```

##### Migrate from `next lint` to ESLint CLI

###### `next-lint-to-eslint-cli`

```bash
npx @next/codemod@canary next-lint-to-eslint-cli .
```

`next lint`를 쓰던 프로젝트를 로컬 ESLint 설정을 쓰는 ESLint CLI로 옮긴다.

- Next.js 권장 설정이 담긴 `eslint.config.mjs` 파일을 만든다
- `package.json` 스크립트를 `next lint` 대신 `eslint .`을 쓰도록 갱신한다
- 필요한 ESLint 의존성을 `package.json`에 추가한다
- 기존 ESLint 설정이 있으면 유지한다

예를 들면 다음과 같다.

```json
// package.json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

다음처럼 바뀐다.

```json
// package.json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

그리고 다음 파일을 만든다.

```js
// eslint.config.mjs
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
```

#### 15.0

##### Transform App Router Route Segment Config `runtime` value from `experimental-edge` to `edge`

###### `app-dir-runtime-config-experimental-edge`

> **알아두면 좋은 점**: 이 codemod는 App Router 전용이다.

```bash
npx @next/codemod@latest app-dir-runtime-config-experimental-edge .
```

[Route Segment Config `runtime`](../../3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/runtime.md) 값 `experimental-edge`를 `edge`로 바꾼다. 예를 들면 다음과 같다.

```ts
export const runtime = 'experimental-edge'
```

다음처럼 바뀐다.

```ts
export const runtime = 'edge'
```

##### Migrate to async Dynamic APIs

다이나믹 렌더링을 선택했던 API 중 이전에는 동기 접근을 지원했던 것들이 이제 비동기다. 이 Breaking Change는 [업그레이드 가이드](./version-15.md)에서 더 자세히 다룬다.

###### `next-async-request-api`

```bash
npx @next/codemod@latest next-async-request-api .
```

이제 비동기가 된 다이나믹 API(`next/headers`의 `cookies()`, `headers()`, `draftMode()`)를 적절히 `await`하거나 필요하면 `React.use()`로 감싸도록 바꾼다. 자동 마이그레이션이 불가능하면 TypeScript 파일에는 typecast를, 그 외에는 사람이 검토해야 한다는 주석을 추가한다.

예를 들면 다음과 같다.

```ts
import { cookies, headers } from 'next/headers'
const token = cookies().get('token')

function useToken() {
  const token = cookies().get('token')
  return token
}

export default function Page() {
  const name = cookies().get('name')
}

function getHeader() {
  return headers().get('x-foo')
}
```

다음처럼 바뀐다.

```ts
import { use } from 'react'
import {
  cookies,
  headers,
  type UnsafeUnwrappedCookies,
  type UnsafeUnwrappedHeaders,
} from 'next/headers'
const token = (cookies() as unknown as UnsafeUnwrappedCookies).get('token')

function useToken() {
  const token = use(cookies()).get('token')
  return token
}

export default async function Page() {
  const name = (await cookies()).get('name')
}

function getHeader() {
  return (headers() as unknown as UnsafeUnwrappedHeaders).get('x-foo')
}
```

페이지·라우트 엔트리(`page.js`, `layout.js`, `route.js`, `default.js`)의 `params`나 `searchParams` prop, 또는 `generateMetadata`·`generateViewport` API에서 속성 접근을 감지하면, 호출부를 동기에서 비동기 함수로 바꾸고 속성 접근에 `await`를 붙이려고 시도한다. 비동기로 바꿀 수 없는 경우(Client Component 등)에는 `React.use`로 Promise를 풀어낸다.

예를 들면 다음과 같다.

```tsx
// page.tsx
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { value } = searchParams
  if (value === 'foo') {
    // ...
  }
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  return {
    title: `My Page - ${slug}`,
  }
}
```

다음처럼 바뀐다.

```tsx
// page.tsx
export default async function Page(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const { value } = searchParams
  if (value === 'foo') {
    // ...
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  return {
    title: `My Page - ${slug}`,
  }
}
```

> **알아두면 좋은 점**: 이 codemod가 수동 개입이 필요할 만한 지점을 찾았지만 정확한 수정 방법을 판단할 수 없으면, 주석이나 typecast를 코드에 추가해 수동으로 갱신해야 함을 알린다. 이 주석에는 **@next/codemod** 접두사가, typecast에는 `UnsafeUnwrapped` 접두사가 붙는다. 이 주석을 명시적으로 지우기 전까지는 빌드가 에러를 낸다.

##### Replace `geo` and `ip` properties of `NextRequest` with `@vercel/functions`

###### `next-request-geo-ip`

```bash
npx @next/codemod@latest next-request-geo-ip .
```

`@vercel/functions`를 설치하고 `NextRequest`의 `geo`, `ip` 속성을 그에 대응하는 `@vercel/functions` 기능으로 바꾼다.

예를 들면 다음과 같다.

```ts
import type { NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const { geo, ip } = req
}
```

다음처럼 바뀐다.

```ts
import type { NextRequest } from 'next/server'
import { geolocation, ipAddress } from '@vercel/functions'

export function GET(req: NextRequest) {
  const geo = geolocation(req)
  const ip = ipAddress(req)
}
```

#### 14.0

##### Migrate `ImageResponse` imports

###### `next-og-import`

```bash
npx @next/codemod@latest next-og-import .
```

[Dynamic OG Image Generation](../../1-getting-started/metadata-and-og-images.md)을 쓰기 위한 import를 `next/server`에서 `next/og`로 옮긴다. 예를 들면 다음과 같다.

```ts
import { ImageResponse } from 'next/server'
```

다음처럼 바뀐다.

```ts
import { ImageResponse } from 'next/og'
```

##### Use `viewport` export

###### `metadata-to-viewport-export`

```bash
npx @next/codemod@latest metadata-to-viewport-export .
```

특정 viewport 메타데이터를 `viewport` export로 옮긴다. 예를 들면 다음과 같다.

```ts
export const metadata = {
  title: 'My App',
  themeColor: 'dark',
  viewport: {
    width: 1,
  },
}
```

다음처럼 바뀐다.

```ts
export const metadata = {
  title: 'My App',
}

export const viewport = {
  width: 1,
  themeColor: 'dark',
}
```

#### 13.2

##### Use Built-in Font

###### `built-in-next-font`

```bash
npx @next/codemod@latest built-in-next-font .
```

`@next/font` 패키지를 제거하고 `@next/font` import를 내장 `next/font`로 바꾼다. 예를 들면 다음과 같다.

```ts
import { Inter } from '@next/font/google'
```

다음처럼 바뀐다.

```ts
import { Inter } from 'next/font/google'
```

#### 13.0

##### Rename Next Image Imports

###### `next-image-to-legacy-image`

```bash
npx @next/codemod@latest next-image-to-legacy-image .
```

기존 Next.js 10, 11, 12 애플리케이션의 `next/image` import를 Next.js 13의 `next/legacy/image`로 안전하게 바꾼다. `next/future/image`도 `next/image`로 바꾼다.

예를 들면 다음과 같다.

```js
// pages/index.js
import Image1 from 'next/image'
import Image2 from 'next/future/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

다음처럼 바뀐다.

```js
// pages/index.js
// 'next/image'는 'next/legacy/image'가 된다
import Image1 from 'next/legacy/image'
// 'next/future/image'는 'next/image'가 된다
import Image2 from 'next/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

##### Migrate to the New Image Component

###### `next-image-experimental`

```bash
npx @next/codemod@latest next-image-experimental .
```

`next/legacy/image`에서 새 `next/image`로 인라인 스타일을 추가하고 쓰지 않는 prop을 제거하며 위험을 감수하고(dangerously) 옮긴다.

- `layout` prop을 제거하고 `style`을 추가한다.
- `objectFit` prop을 제거하고 `style`을 추가한다.
- `objectPosition` prop을 제거하고 `style`을 추가한다.
- `lazyBoundary` prop을 제거한다.
- `lazyRoot` prop을 제거한다.

##### Remove `<a>` Tags From Link Components

###### `new-link`

```bash
npx @next/codemod@latest new-link .
```

[Link 컴포넌트](../../3-api-reference/3.2-components/link.md) 안의 `<a>` 태그를 제거한다. 예를 들면 다음과 같다.

```jsx
<Link href="/about">
  <a>About</a>
</Link>
// 다음처럼 바뀐다
<Link href="/about">
  About
</Link>

<Link href="/about">
  <a onClick={() => console.log('clicked')}>About</a>
</Link>
// 다음처럼 바뀐다
<Link href="/about" onClick={() => console.log('clicked')}>
  About
</Link>
```

#### 11

##### Migrate from CRA

###### `cra-to-next`

```bash
npx @next/codemod cra-to-next
```

Create React App 프로젝트를 Next.js로 옮기며, 동작을 맞추기 위한 Pages Router와 필요한 설정을 만든다. SSR 중 `window` 사용으로 호환성이 깨지지 않도록 처음에는 클라이언트 사이드 전용 렌더링을 활용하며, 이후 Next.js 고유 기능을 점진적으로 채택하도록 매끄럽게 켤 수 있다.

이 변환에 대한 피드백은 [이 discussion](https://github.com/vercel/next.js/discussions/25858)에서 공유할 수 있다.

#### 10

##### Add React imports

###### `add-missing-react-import`

```bash
npx @next/codemod add-missing-react-import
```

새 [React JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)이 동작하도록, `React`를 import하지 않은 파일에 import를 추가한다.

예를 들면 다음과 같다.

```js
// my-component.js
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

다음처럼 바뀐다.

```js
// my-component.js
import React from 'react'
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

#### 9

##### Transform Anonymous Components into Named Components

###### `name-default-component`

```bash
npx @next/codemod name-default-component
```

**버전 9 이상.**

[Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)가 동작하도록 익명 컴포넌트를 이름 있는 컴포넌트로 바꾼다.

예를 들면 다음과 같다.

```js
// my-component.js
export default function () {
  return <div>Hello World</div>
}
```

다음처럼 바뀐다.

```js
// my-component.js
export default function MyComponent() {
  return <div>Hello World</div>
}
```

컴포넌트는 파일 이름을 기준으로 camelCase 이름을 갖게 되며, 화살표 함수에도 동작한다.

#### 8

> **알아두면 좋은 점**: 내장 AMP 지원과 이 codemod는 Next.js 16에서 제거됐다.

##### Transform AMP HOC into page config

###### `withamp-to-config`

```bash
npx @next/codemod withamp-to-config
```

`withAmp` HOC를 Next.js 9 페이지 설정으로 바꾼다. 예를 들면 다음과 같다.

```js
// Before
import { withAmp } from 'next/amp'

function Home() {
  return <h1>My AMP Page</h1>
}

export default withAmp(Home)
```

```js
// After
export default function Home() {
  return <h1>My AMP Page</h1>
}

export const config = {
  amp: true,
}
```

#### 6

##### Use `withRouter`

###### `url-to-withrouter`

```bash
npx @next/codemod url-to-withrouter
```

최상위 페이지에 자동으로 주입되던 deprecated `url` 속성을, `withRouter`가 주입하는 `router` 속성으로 바꾼다. 자세한 내용은 [https://nextjs.org/docs/messages/url-deprecated](https://nextjs.org/docs/messages/url-deprecated)에서 확인한다.

예를 들면 다음과 같다.

```js
// Before
import React from 'react'
export default class extends React.Component {
  render() {
    const { pathname } = this.props.url
    return <div>Current pathname: {pathname}</div>
  }
}
```

```js
// After
import React from 'react'
import { withRouter } from 'next/router'
export default withRouter(
  class extends React.Component {
    render() {
      const { pathname } = this.props.router
      return <div>Current pathname: {pathname}</div>
    }
  }
)
```

이는 한 가지 사례일 뿐이며, 변환되는(그리고 테스트된) 모든 사례는 [`__testfixtures__` 디렉터리](https://github.com/vercel/next.js/tree/canary/packages/next-codemod/transforms/__testfixtures__/url-to-withrouter)에서 찾을 수 있다.

### 변환 뒤 검토

codemod는 정해진 패턴만 바꾼다. diff를 확인하고 TypeScript 검사, 린트, 테스트, 주요 화면 확인을 실행한다. 특히 비동기 Dynamic API, `proxy`로 바뀌는 파일 규칙, 스타일을 추가하는 이미지 변환, 자동으로 처리하지 못한 주석은 사람이 의도에 맞는지 검토한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 샘플 저장소에서 `--dry`, `--print`, 실제 변환을 차례로 실행하고 diff를 비교한다.
- `next-og-import`, `new-link`, `next-async-request-api` 변환 전후를 코드 리뷰 방식으로 확인한다.

## 연습 문제

1. 파일을 바꾸지 않고 codemod 대상만 확인하는 옵션은 무엇인가?
   - A. `--dry`
   - B. `--print`
   - C. `--force`

   <details><summary>정답 보기</summary>

   정답: A. `--dry`는 실제 파일을 수정하지 않는다. `--print`는 변환 결과를 출력한다.

   </details>

2. `next-og-import`이 바꾸는 import 경로는 무엇인가?
   - A. `next/server`에서 `next/og`
   - B. `next/image`에서 `next/legacy/image`
   - C. `next/router`에서 `next/navigation`

   <details><summary>정답 보기</summary>

   정답: A. `ImageResponse` import를 `next/og`로 바꾼다.

   </details>

## 챕터 요약

- codemod는 반복적인 API와 파일 규칙 변경을 자동화하지만 검증을 대신하지 않는다.
- `upgrade`는 버전 전환에 필요한 변환을, 개별 변환은 특정 변경을 적용한다.
- 16에서는 Cache Components와 `proxy`, 15에서는 비동기 Dynamic API, 14에서는 `next/og`와 viewport 변경을 다룬다.
- 변환 결과의 diff와 남은 주석을 확인한 뒤 타입 검사, 린트, 테스트를 실행한다.
