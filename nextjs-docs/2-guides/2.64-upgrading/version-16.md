# Version 16

- 공식 문서: [Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- 상위 메뉴: [Upgrading](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 15에서 16으로 올릴 때 codemod와 AI 코딩 에이전트를 활용하는 절차를 확인한다.
- Turbopack 기본화, `middleware`에서 `proxy`로의 전환, 비동기 Request API 완전 적용 같은 주요 Breaking Change를 코드에 반영한다.
- `revalidateTag`·`updateTag`·`refresh`, `cacheComponents`처럼 새로 도입되거나 stable이 된 캐싱 API의 사용 시점을 구분한다.

## 핵심 개념 및 설명

### AI 에이전트로 업그레이드하기 (권장)

AI 코딩 에이전트는 업그레이드의 기계적인 부분을 실행하고, diff를 검사하고, 후속 오류를 고치고, 앱을 검증할 수 있다. [AI Coding Agents 가이드](../ai-agents.md)에 있는 프롬프트는 에이전트에게 다음을 지시한다.

- 코드를 고치기 전에 `AGENTS.md`가 버전에 맞는 Next.js 문서를 가리키는지 확인하고, 없거나 오래됐다면 먼저 갱신한다.
- Next.js 16 업그레이드 가이드를 마이그레이션의 기준으로 삼고, 준비되면 codemod를 실행한다.
- 폭넓은 변경을 하기 전에 업그레이드 계획을 사용자에게 설명하고, 프로젝트 고유의 판단이 필요하거나 변경이 파괴적이거나 자격 증명이 없는 경우가 아니면 계속 진행한다.
- 업그레이드 범위를 벗어나지 않게 유지하고, diff를 검사하고, 관련 검사를 실행하고, 남은 Breaking Change를 고친다.
- 업그레이드 후에는 `next-dev-loop` 스킬(또는 `next dev`, 브라우저, 빌드 검사)로 런타임 동작을 검증하고, 무엇이 바뀌었고 무엇을 검증했는지 요약한다.

### 또는 수동으로 업그레이드하기

수동 업그레이드는 다음 순서를 따른다.

1. 지금 어시스턴트를 쓰거나 앞으로 에이전트 작업의 근거가 될 문서가 필요하다면 [AI 에이전트 문서 준비하기](#ai-에이전트-문서-준비하기)를 먼저 실행한다.
2. [업그레이드 codemod를 실행한다](#codemod-사용하기).
3. codemod를 실행하지 않으려면 [패키지를 수동으로 설치한다](#패키지-수동-설치하기).
4. 아래 Breaking Change를 차례로 확인하고, 관련 검사를 실행하고, 남은 문제를 고친다.

### AI 에이전트 문서 준비하기

업그레이드를 시작하기 전에 프로젝트에 버전에 맞는 문서를 준비할 수 있다. 자세한 설정은 [AI Coding Agents 가이드](../ai-agents.md)를 참고한다.

```bash
npx @next/codemod@canary agents-md
```

업그레이드 후에는 `AGENTS.md`가 설치된 Next.js 버전의 문서를 가리키는지 확인한다. Next.js 16.2 이상에서는 `node_modules/next/dist/docs/`에 내장된 문서를 가리켜야 한다. 업그레이드 전 설정이 `.next-docs/`에 문서를 내려받았다면 `AGENTS.md`가 내장 문서를 가리키도록 갱신한 뒤, 참조하는 곳이 없어지면 `.next-docs/`를 삭제한다.

관리되는 블록은 다음과 같은 형태다.

```md
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

### codemod 사용하기

Next.js 16으로 올리려면 `upgrade` [codemod](./codemods.md)를 사용한다.

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

이 codemod는 다음을 할 수 있다.

- `next.config.js`를 새 `turbopack` 설정 형태로 갱신한다.
- `next lint`에서 ESLint CLI로 옮긴다.
- deprecated된 `middleware` 규칙을 `proxy`로 옮긴다.
- stable이 된 API에서 `unstable_` 접두사를 뗀다.
- 페이지와 레이아웃에서 `experimental_ppr` Route Segment Config를 제거한다.

`upgrade` codemod는 모든 마이그레이션 변환을 실행하지 않는다. Next.js 15의 호환 기간에 쓰던 동기 `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` 접근이 아직 남아 있다면 비동기 Request API codemod도 실행한다.

```bash
npx @next/codemod@canary next-async-request-api .
```

### 패키지 수동 설치하기

직접 설치하려면 최신 Next.js와 React 버전을 설치한다.

```bash
pnpm add next@latest react@latest react-dom@latest
```

TypeScript를 사용한다면 `@types/react`, `@types/react-dom`도 최신 버전으로 올린다.

### Node.js 런타임과 브라우저 지원

| 요구 사항 | 변경 내용 / 세부 사항 |
| --- | --- |
| Node.js 20.9+ | 최소 버전이 20.9.0(LTS)으로 올랐다. Node.js 18은 더 이상 지원하지 않는다 |
| TypeScript 5+ | 최소 버전이 5.1.0으로 올랐다 |
| 브라우저 | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |

### Turbopack 기본화

**Next.js 16**부터 Turbopack이 stable이며 `next dev`, `next build`에서 기본적으로 사용된다. 이전에는 `--turbopack` 또는 `--turbo` 플래그로 켜야 했다.

```json
// package.json — Before
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

이제는 플래그가 필요 없다.

```json
// package.json — After
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

프로젝트에 [커스텀 `webpack`](../../3-api-reference/3.5-config/3.5.1-next-config-js/webpack.md) 설정이 있는 상태로 `next build`(기본적으로 Turbopack 사용)를 실행하면, 잘못된 설정 문제를 막기 위해 빌드가 **실패**한다. 대응 방법은 세 가지다.

- `next build --turbopack`으로 Turbopack을 그대로 사용하고 `webpack` 설정을 무시한다.
- `webpack` 설정을 Turbopack과 호환되는 옵션으로 옮긴다.
- `--webpack` 플래그로 Turbopack을 사용하지 않고 Webpack으로 빌드한다.

> **알아두면 좋은 점**: `webpack` 설정을 직접 정의하지 않았는데도 빌드가 실패한다면, 플러그인이 `webpack` 옵션을 추가하고 있을 가능성이 높다.

#### Turbopack 사용에서 빠져나오기

Webpack을 계속 써야 한다면 `--webpack` 플래그로 빠져나올 수 있다. 예를 들어 개발에는 Turbopack을, 프로덕션 빌드에는 Webpack을 쓸 수 있다.

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

개발과 프로덕션 모두 Turbopack을 쓰는 것을 권장한다.

#### Turbopack 설정 위치

`experimental.turbopack` 설정이 experimental에서 벗어났다.

```ts
// next.config.ts — Next.js 15, experimental.turbopack
const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      // options
    },
  },
}
```

이제 최상위 `turbopack` 옵션으로 쓴다.

```ts
// next.config.ts — Next.js 16, 최상위 turbopack
const nextConfig: NextConfig = {
  turbopack: {
    // options
  },
}
```

[`Turbopack` 설정 옵션](../../3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md)을 다시 확인한다. **Next.js 16**은 고급 webpack 로더 조건, `debugIds` 같은 새 옵션도 함께 도입했다.

#### Resolve alias fallback

일부 프로젝트에서는 클라이언트 코드가 Node.js 네이티브 모듈을 포함한 파일을 import해 `Module not found: Can't resolve 'fs'` 같은 에러가 발생할 수 있다. 가장 좋은 해법은 클라이언트 번들이 이런 모듈을 참조하지 않도록 코드를 리팩터링하는 것이다. 불가능하다면 Webpack의 `resolve.fallback`처럼 Turbopack의 `turbopack.resolveAlias`로 에러를 잠재울 수 있다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      fs: {
        browser: './empty.ts', // 이 방법 대신 import를 고치는 편을 권장한다
      },
    },
  },
}
```

#### Sass `node_modules` import

Turbopack은 `node_modules`의 Sass 파일 import를 완전히 지원한다. Webpack이 허용했던 legacy tilde(`~`) 접두사는 Turbopack에서 지원하지 않는다.

```scss
/* Webpack */
@import '~bootstrap/dist/css/bootstrap.min.css';

/* Turbopack */
@import 'bootstrap/dist/css/bootstrap.min.css';
```

import를 바꿀 수 없다면 `turbopack.resolveAlias`에 `'~*': '*'` 규칙을 추가해 우회할 수 있다.

#### Turbopack 파일 시스템 캐싱

Turbopack은 컴파일러 아티팩트를 실행 사이 디스크에 저장해 재시작 후 컴파일 속도를 크게 높인다. `next dev`와 `next build` 모두 `experimental.turbopackFileSystemCacheForDev`, `experimental.turbopackFileSystemCacheForBuild`를 통해 파일 시스템 캐싱이 기본적으로 켜져 있다. 설정이나 끄는 방법은 [`turbopackFileSystemCache`](../../3-api-reference/3.5-config/3.5.1-next-config-js/turbopackFileSystemCache.md)를 참고한다.

### 비동기 Request API (Breaking Change)

Version 15는 [비동기 Request API](./version-15.md)를 Breaking Change로 도입하면서 **임시** 동기 호환을 함께 제공했다. **Next.js 16**부터는 동기 접근이 완전히 제거되어, 이 API들은 비동기로만 접근할 수 있다.

- [`cookies`](../../3-api-reference/3.3-functions/cookies.md)
- [`headers`](../../3-api-reference/3.3-functions/headers.md)
- [`draftMode`](../../3-api-reference/3.3-functions/draft-mode.md)
- [`layout.js`](../../3-api-reference/3.1-file-conventions/layout.md), [`page.js`](../../3-api-reference/3.1-file-conventions/page.md), [`route.js`](../../3-api-reference/3.1-file-conventions/route.md), [`default.js`](../../3-api-reference/3.1-file-conventions/default.md), [`opengraph-image`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md), [`twitter-image`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md), [`icon`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md), [`apple-icon`](../../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md)의 `params`
- [`page.js`](../../3-api-reference/3.1-file-conventions/page.md)의 `searchParams`

비동기 Request-time API로 옮기는 codemod가 있다.

#### 비동기 Request-time API로 타입 마이그레이션하기

비동기 `params`, `searchParams`로 옮기는 것을 돕기 위해 [`npx next typegen`](../../3-api-reference/3.6-cli/next.md)을 실행하면 전역에서 쓸 수 있는 타입 헬퍼가 자동으로 생성된다.

- [`PageProps`](../../3-api-reference/3.1-file-conventions/page.md)
- [`LayoutProps`](../../3-api-reference/3.1-file-conventions/layout.md)
- [`RouteContext`](../../3-api-reference/3.1-file-conventions/route.md)

> **알아두면 좋은 점**: `typegen`은 Next.js 15.5에서 도입됐다.

이 헬퍼로 새 비동기 API 패턴을 완전한 타입 안전성과 함께 적용할 수 있다.

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

이 방식은 `slug`를 포함한 `props.params`와 `searchParams`에 페이지 안에서 바로 타입 안전하게 접근할 수 있게 해준다.

### icon, open-graph Image의 비동기 매개변수 (Breaking Change)

`opengraph-image`, `twitter-image`, `icon`, `apple-icon`의 이미지 생성 함수에 전달되는 props가 이제 Promise다.

이전 버전에서는 `Image`(이미지 생성 함수)와 `generateImageMetadata`가 모두 동기 `params` 객체를 받았고, `generateImageMetadata`가 반환한 `id`는 이미지 생성 함수에 문자열로 전달됐다.

```js
// app/shop/[slug]/opengraph-image.js — Next.js 15, 동기 params·id 접근
export function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

export default function Image({ params, id }) {
  const slug = params.slug
  const imageId = id // string
}
```

[비동기 Request API](#비동기-request-api-breaking-change) 변경에 맞춰, **Next.js 16**부터 이미지 생성 함수는 `params`와 `id`를 Promise로 받는다. `generateImageMetadata`는 계속 동기 `params`를 받는다.

```js
// app/shop/[slug]/opengraph-image.js — Next.js 16, 비동기 params·id 접근
export async function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

export default async function Image({ params, id }) {
  const { slug } = await params // params가 이제 비동기다
  const imageId = await id // generateImageMetadata를 쓸 때 id는 Promise<string>이다
}
```

### `sitemap`의 비동기 `id` 매개변수 (Breaking Change)

이전에는 [`generateSitemaps`](../../3-api-reference/3.3-functions/generate-sitemaps.md)가 반환한 `id` 값이 `sitemap` 생성 함수에 그대로 전달됐다.

```js
// app/product/sitemap.js
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// Next.js 15, 동기 id 접근
export default async function sitemap({ id }) {
  const start = id * 50000 // id는 number다
}
```

**Next.js 16**부터 `sitemap` 생성 함수는 `id`를 Promise로 받는다.

```js
// app/product/sitemap.js
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// Next.js 16, 비동기 id 접근
export default async function sitemap({ id }) {
  const resolvedId = await id // id는 이제 Promise<string>이다
  const start = Number(resolvedId) * 50000
}
```

### React 19.2

**Next.js 16**의 App Router는 최신 React [Canary 릴리스](https://react.dev/blog/2023/05/03/react-canaries)를 사용하며, 여기에는 새로 릴리스된 React 19.2 기능과 점진적으로 stable화되고 있는 다른 기능이 포함된다.

- **[View Transitions](https://react.dev/reference/react/ViewTransition)**: Transition이나 내비게이션 안에서 업데이트되는 요소에 애니메이션을 적용한다.
- **[`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)**: Effect 안의 비반응형 로직을 재사용 가능한 Effect Event 함수로 분리한다.
- **[Activity](https://react.dev/reference/react/Activity)**: 상태를 유지하고 Effect를 정리하면서 `display: none`으로 UI를 숨겨 "백그라운드 활동"을 렌더링한다.

자세한 내용은 [React 19.2 발표](https://react.dev/blog/2025/10/01/react-19-2)에서 확인한다.

### React Compiler 지원

React Compiler의 1.0 릴리스에 맞춰 **Next.js 16**에서 React Compiler 내장 지원이 stable이 됐다. React Compiler는 코드를 수동으로 바꾸지 않아도 컴포넌트를 자동으로 메모이제이션해 불필요한 리렌더링을 줄여준다.

`reactCompiler` 설정이 `experimental`에서 stable로 승격됐다. 다양한 애플리케이션 유형에서 빌드 성능 데이터를 계속 수집하고 있어 기본적으로는 켜져 있지 않다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
}
```

React Compiler 플러그인의 최신 버전을 설치한다.

```bash
pnpm add -D babel-plugin-react-compiler
```

> **알아두면 좋은 점**: React Compiler가 Babel에 의존하므로, 이 옵션을 켜면 개발과 빌드의 컴파일 시간이 늘어날 수 있다.

### 캐싱 API

#### `revalidateTag`

[`revalidateTag`](../../3-api-reference/3.3-functions/revalidateTag.md)는 이제 [`cacheLife`](../../3-api-reference/3.3-functions/cacheLife.md) 프로필을 지정하는 두 번째 인자를 요구한다. 인자 하나만 쓰는 방식은 deprecated됐고 TypeScript 에러를 낸다.

```ts
// Before
revalidateTag('posts')

// After
revalidateTag('posts', 'max')
```

stale-while-revalidate가 아니라 즉시 만료가 필요하다면 Server Actions에서 [`updateTag`](../../3-api-reference/3.3-functions/updateTag.md)를 대신 사용한다.

```ts
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updateArticle(articleId: string) {
  // 게시글 데이터를 stale로 표시 — 독자는 revalidate되는 동안 stale 데이터를 본다
  revalidateTag(`article-${articleId}`, 'max')
}
```

블로그 게시글, 상품 카탈로그, 문서처럼 갱신이 조금 늦어도 괜찮은 콘텐츠에는 `revalidateTag`를 사용한다. 사용자는 새 데이터가 백그라운드에서 로드되는 동안 stale 콘텐츠를 받는다.

#### `updateTag`

[`updateTag`](../../3-api-reference/3.3-functions/updateTag.md)는 **read-your-writes** 시맨틱을 제공하는 새로운 Server Actions 전용 API로, 사용자가 변경을 가하면 stale 데이터가 아니라 변경된 내용이 UI에 즉시 반영된다.

같은 요청 안에서 데이터를 만료시키고 즉시 새로고침해서 이를 구현한다.

```ts
// app/actions.ts
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)

  // 캐시를 만료시키고 즉시 새로고침 — 사용자는 변경 사항을 바로 본다
  updateTag(`user-${userId}`)
}
```

폼, 사용자 설정처럼 사용자가 자신의 변경을 즉시 확인하길 기대하는 인터랙티브 기능에 적합하다.

#### `refresh`

[`refresh`](../../3-api-reference/3.3-functions/refresh.md)는 Server Action 안에서 클라이언트 라우터를 새로고침할 수 있게 해준다.

```ts
// app/actions.ts
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId)

  // 헤더에 표시되는 알림 수를 새로고침한다
  refresh()
}
```

액션을 실행한 뒤 클라이언트 라우터를 새로고침해야 할 때 사용한다.

#### `cacheLife`와 `cacheTag`

[`cacheLife`](../../3-api-reference/3.3-functions/cacheLife.md)와 [`cacheTag`](../../3-api-reference/3.3-functions/cacheTag.md)가 stable이 되면서 `unstable_` 접두사가 더 이상 필요 없다.

```ts
// Before
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

// After
import { cacheLife, cacheTag } from 'next/cache'
```

### 라우팅과 내비게이션 개선

**Next.js 16**은 라우팅과 내비게이션 시스템을 전면 개편해 페이지 전환을 더 가볍고 빠르게 만들었다. Next.js가 내비게이션 데이터를 prefetch하고 캐시하는 방식이 다음처럼 바뀐다.

- **레이아웃 중복 제거**: 공유 레이아웃을 가진 여러 URL을 prefetch할 때, 레이아웃은 한 번만 내려받는다.
- **증분 prefetch**: Next.js는 캐시에 없는 부분만 prefetch하며, 페이지 전체를 다시 가져오지 않는다.

이 변경은 코드 수정이 필요 없으며 모든 앱의 성능을 개선하도록 설계됐다. 다만 개별 prefetch 요청 수는 늘고 전체 전송량은 훨씬 줄어들 수 있다. 대부분의 애플리케이션에는 이 트레이드오프가 적절하다고 보지만, 요청 수 증가가 문제라면 GitHub issue나 discussion으로 알릴 수 있다.

### Partial Prerendering (PPR)

**Next.js 16**은 실험적인 **Partial Prerendering (PPR)** 플래그와 관련 설정(라우트 세그먼트의 `experimental_ppr` 포함)을 제거한다. **Next.js 16**부터는 [`cacheComponents`](../../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md) 설정으로 PPR을 켤 수 있다.

```js
// next.config.js
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

**Next.js 16**의 PPR은 **Next.js 15** canary와 동작 방식이 다르다. 지금 PPR을 쓰고 있다면 현재 쓰는 Next.js 15 canary에 머무른다. 마이그레이션 패턴은 [Migrating to Cache Components](../migrating-to-cache-components.md)를 참고한다.

```js
// next.config.js
const nextConfig = {
  // 지금 PPR을 쓰고 있다면
  // 현재 Next.js 15 canary에 머무른다
  experimental: {
    ppr: true,
  },
}

module.exports = nextConfig
```

### `middleware`에서 `proxy`로

`middleware` 파일명은 deprecated됐고, 네트워크 경계와 라우팅에 집중한다는 점을 명확히 하기 위해 `proxy`로 이름이 바뀌었다.

`proxy`에서는 `edge` 런타임을 지원하지 **않는다**. `proxy`의 런타임은 `nodejs`이며 설정할 수 없다. `edge` 런타임을 계속 쓰려면 `middleware`를 그대로 사용한다. `edge` 런타임에 대한 안내는 이후 마이너 릴리스에서 다룬다.

```bash
# middleware 파일 이름을 바꾼다
mv middleware.ts proxy.ts
# 또는
mv middleware.js proxy.js
```

named export `middleware`도 deprecated됐다. 함수 이름을 `proxy`로 바꾼다.

```ts
// proxy.ts
export function proxy(request: Request) {}
```

기본 export를 쓰고 있더라도 함수 이름을 `proxy`로 바꾸는 것을 권장한다.

`middleware`라는 이름이 들어간 설정 플래그도 함께 이름이 바뀐다. 예를 들어 `skipMiddlewareUrlNormalize`는 `skipProxyUrlNormalize`가 됐다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  skipProxyUrlNormalize: true,
}
```

Version 16 [codemod](./codemods.md)가 이 플래그들도 함께 갱신할 수 있다.

### `next/image` 변경

#### 쿼리 문자열이 있는 로컬 이미지 (Breaking Change)

열거 공격(enumeration attack)을 막기 위해, 쿼리 문자열이 있는 로컬 이미지 소스는 이제 `images.localPatterns.search` 설정이 필요하다.

```tsx
// app/page.tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="/assets/photo?v=1" alt="Photo" width="100" height="100" />
}
```

로컬 이미지에 쿼리 문자열을 써야 한다면 설정에 패턴을 추가한다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}
```

#### `minimumCacheTTL` 기본값 (Breaking Change)

`images.minimumCacheTTL`의 기본값이 `60초`에서 `4시간`(14400초)으로 바뀌었다. `cache-control` 헤더가 없는 이미지는 60초마다 revalidation이 일어나 CPU 사용량과 비용이 늘었는데, 대부분의 이미지는 자주 바뀌지 않으므로 기본값을 4시간으로 늘려 더 안정적인 캐시를 제공하면서도 필요하면 하루 몇 번씩은 갱신되게 한다. 이전 동작이 필요하면 값을 더 낮게(예: 다시 `60`초로) 바꾼다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

#### `imageSizes` 기본값 (Breaking Change)

기본 `images.imageSizes` 배열에서 `16` 값이 제거됐다. 요청 분석 결과 16픽셀 너비 이미지를 실제로 제공하는 프로젝트는 거의 없었고, `devicePixelRatio: 2` 환경에서는 흐릿함을 막기 위해 실제로 32px 이미지를 가져오기 때문에, 이 설정을 없애면 `next/image`가 브라우저에 보내는 `srcset` 속성의 크기가 줄어든다. 16px 이미지를 지원해야 한다면 배열에 값을 다시 추가한다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

#### `qualities` 기본값 (Breaking Change)

`images.qualities`의 기본값이 모든 품질을 허용하던 것에서 `[75]`만 허용하도록 바뀌었다. 여러 품질 단계를 지원해야 한다면 배열에 값을 추가한다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    qualities: [50, 75, 100],
  },
}
```

`images.qualities` 배열에 없는 `quality` prop 값을 지정하면 배열에서 가장 가까운 값으로 보정된다. 예를 들어 위 설정에서 `quality` prop이 80이면 75로 보정된다.

#### 로컬 IP 제한 (Breaking Change)

새로운 보안 제한이 기본적으로 로컬 IP 최적화를 막는다. 사설망(private network)에서만 `images.dangerouslyAllowLocalIP`를 `true`로 설정한다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // 사설망에서만 사용한다
  },
}
```

split-horizon DNS를 쓰는 VPC에서 Next.js를 호스팅하며 400 Bad Request가 발생할 때 필요할 수 있다. SSRF 위험을 이해한 뒤에만 켠다.

#### 최대 리다이렉트 수 (Breaking Change)

`images.maximumRedirects`의 기본값이 무제한에서 최대 3회로 바뀌었다.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    maximumRedirects: 0, // 리다이렉트 비허용
    // 또는
    maximumRedirects: 5, // 예외적인 경우 늘리기
  },
}
```

#### `next/legacy/image` 컴포넌트 (deprecated)

`next/legacy/image` 컴포넌트는 deprecated됐다. `next/image`를 사용한다.

```js
// Before
import Image from 'next/legacy/image'

// After
import Image from 'next/image'
```

#### `images.domains` 설정 (deprecated)

`images.domains` 설정은 deprecated됐다.

```js
// next.config.js — images.domains는 deprecated됐다
module.exports = {
  images: {
    domains: ['example.com'],
  },
}
```

보안을 강화하려면 `images.remotePatterns`를 대신 사용한다.

```js
// next.config.js — images.remotePatterns를 대신 사용한다
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}
```

### 동시에 실행되는 `dev`와 `build`

`next dev`와 `next build`는 이제 서로 다른 출력 디렉터리를 사용해 동시에 실행할 수 있다. `next dev` 명령은 `.next/dev`로 출력한다. 추가로, 같은 프로젝트에서 `next dev`나 `next build`가 여러 개 동시에 실행되는 것을 막는 lockfile 메커니즘이 도입됐다. [Turbopack tracing 명령](../local-development.md)은 다음과 같이 바뀐다.

```bash
pnpm next internal trace .next-profiles/trace-turbopack.bin
```

### Parallel Routes의 `default.js` 요구사항

모든 [Parallel Routes](../../3-api-reference/3.1-file-conventions/parallel-routes.md) 슬롯은 이제 명시적인 `default.js` 파일을 요구한다. 없으면 빌드가 실패한다. 이전 동작을 유지하려면 `notFound()`를 호출하거나 `null`을 반환하는 [`default.js`](../../3-api-reference/3.1-file-conventions/default.md) 파일을 만든다.

```tsx
// app/@modal/default.tsx
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

또는 `null`을 반환한다.

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

### ESLint Flat Config

`@next/eslint-plugin-next`는 legacy config 지원을 없앨 ESLint v10에 맞춰 이제 기본적으로 ESLint Flat Config 형식을 사용한다. [`@next/eslint-plugin-next`](../../3-api-reference/3.5-config/eslint.md) API 레퍼런스를 다시 확인한다. legacy `.eslintrc` 형식을 쓰고 있다면 [ESLint 마이그레이션 가이드](https://eslint.org/docs/latest/use/configure/migration-guide)를 따라 flat config로 옮기는 것을 고려한다.

### 스크롤 동작 오버라이드

**이전 버전의 Next.js**에서는 `<html>` 요소에 전역으로 `scroll-behavior: smooth`를 CSS로 설정했다면, Next.js가 SPA 라우트 전환 중 다음처럼 이 값을 오버라이드했다.

1. `scroll-behavior`를 임시로 `auto`로 설정한다.
2. 내비게이션을 실행한다(즉시 맨 위로 스크롤됨).
3. 원래 `scroll-behavior` 값을 되돌린다.

이 방식은 페이지 안 내비게이션에 smooth scrolling을 켜 두어도 페이지 이동만큼은 항상 즉각적으로 느껴지게 했지만, 특히 내비게이션이 시작될 때마다 이 조작의 비용이 클 수 있었다. **Next.js 16**에서는 이 동작이 바뀌어, 기본적으로 Next.js가 내비게이션 중 `scroll-behavior` 설정을 더 이상 **오버라이드하지 않는다**. Next.js가 이 오버라이드를 수행하길 원한다면(이전 버전의 기본 동작) `<html>` 요소에 `data-scroll-behavior="smooth"` 속성을 추가한다.

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
```

### 성능 개선

`next dev`, `next start` 명령의 성능이 크게 개선됐고, 더 명확한 포맷, 나은 에러 메시지, 향상된 성능 지표로 터미널 출력도 개선됐다.

**Next.js 16**은 `next build` 출력에서 `size`와 `First Load JS` 지표를 제거했다. React Server Component를 쓰는 서버 주도 아키텍처에서는 이 지표가 부정확했고, Turbopack과 Webpack 구현 모두 Client Component 페이로드를 계산하는 방식이 서로 달라 문제가 있었다. 실제 라우트 성능을 측정하는 가장 효과적인 방법은 Core Web Vitals와 다운로드 리소스 크기에 초점을 맞춘 [Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)나 Vercel Analytics 같은 도구다.

#### `next dev` 설정 로드

이전 버전에서는 개발 중 Next 설정 파일이 두 번 로드됐다 — `next dev` 명령을 실행할 때, 그리고 `next dev` 명령이 Next.js 서버를 시작할 때. `next dev` 명령 자체는 서버를 시작하는 데 설정 파일이 필요하지 않으므로 비효율적이었다.

이 변경의 한 가지 결과로, Next.js 설정 파일에서 `process.argv`가 `'dev'`를 포함하는지 확인하며 `next dev` 실행 여부를 판단하던 코드는 이제 `false`를 반환한다.

> **알아두면 좋은 점**: `typegen`, `build` 명령은 여전히 `process.argv`에 나타난다.

`next dev`에서 부수 효과를 실행하는 플러그인이라면 `NODE_ENV`가 `development`인지 확인하는 것으로 충분할 수 있다.

```js
// next.config.js
import { startServer } from 'docs-lib/dev-server'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  startServer()
}

const nextConfig = {
  /* Your config options */
}

module.exports = nextConfig
```

또는 설정이 로드되는 [`phase`](../../3-api-reference/3.5-config/3.5.1-next-config-js/README.md)를 확인한다.

### Build Adapters API (alpha)

[Build Adapters RFC](https://github.com/vercel/next.js/discussions/77740)에 따라 Build Adapters API의 첫 alpha 버전이 제공된다. Build Adapters는 빌드 프로세스에 연결되는 커스텀 어댑터를 만들 수 있게 해주며, 배포 플랫폼과 커스텀 빌드 통합이 Next.js 설정을 바꾸거나 빌드 출력을 처리할 수 있게 한다.

```js
// next.config.js
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
}

module.exports = nextConfig
```

`adapterPath`는 16.2.0에서 stable한 최상위 옵션으로 승격됐다. 현재 API 레퍼런스는 [`adapterPath`](../../3-api-reference/3.5-config/3.5.1-next-config-js/adapterPath.md)를 참고한다.

### 최신 Sass API

`sass-loader`가 v16으로 올라 최신 Sass 문법과 새 기능을 지원한다.

### 제거된 기능

이전에 deprecated됐던 다음 기능들이 이번 버전에서 제거됐다.

#### AMP 지원

AMP 도입률이 크게 줄었고 이 기능을 유지하는 것이 프레임워크에 복잡도를 더한다. 모든 AMP API와 설정이 제거됐다.

- Next 설정 파일의 `amp` 설정
- `next/amp`의 훅 import와 사용(`useAmp`)

```js
// Removed
import { useAmp } from 'next/amp'

// Removed
export const config = { amp: true }
```

- 페이지의 `export const config = { amp: true }`

```js
// next.config.js
const nextConfig = {
  // Removed
  amp: {
    canonicalBase: 'https://example.com',
  },
}
```

AMP가 사용 사례에 여전히 필요한지 검토한다. 이제 대부분의 성능 이점은 Next.js에 내장된 최적화와 최신 웹 표준으로도 얻을 수 있다.

#### `next lint` 명령

`next lint` 명령이 제거됐다. Biome나 ESLint를 직접 사용한다. `next build`는 더 이상 린트를 실행하지 않는다. 마이그레이션을 자동화하는 codemod가 있다.

```bash
pnpm dlx @next/codemod@canary next-lint-to-eslint-cli .
```

Next.js 설정 파일의 `eslint` 옵션도 함께 제거됐다.

```js
// next.config.mjs
const nextConfig = {
  // No longer supported
  // eslint: {},
}
```

#### 런타임 설정

`serverRuntimeConfig`와 `publicRuntimeConfig`가 제거됐다. 대신 환경 변수를 사용한다.

```js
// next.config.js — Next.js 15
module.exports = {
  serverRuntimeConfig: {
    dbUrl: process.env.DATABASE_URL,
  },
  publicRuntimeConfig: {
    apiUrl: '/api',
  },
}
```

```tsx
// pages/index.tsx — Next.js 15
import getConfig from 'next/config'

export default function Page() {
  const { publicRuntimeConfig } = getConfig()
  return <p>API URL: {publicRuntimeConfig.apiUrl}</p>
}
```

**Next.js 16**에서는 서버 전용 값을 Server Component에서 환경 변수로 직접 읽는다.

```tsx
// app/page.tsx
async function fetchData() {
  const dbUrl = process.env.DATABASE_URL
  // 서버 쪽 작업에만 사용한다
  return await db.query(dbUrl, 'SELECT * FROM users')
}

export default async function Page() {
  const data = await fetchData()
  return <div>{/* render data */}</div>
}
```

> **알아두면 좋은 점**: 민감한 서버 값이 실수로 Client Component에 전달되지 않도록 [taint API](../../3-api-reference/3.5-config/3.5.1-next-config-js/taint.md)를 사용할 수 있다.

클라이언트에서 접근해야 하는 값에는 `NEXT_PUBLIC_` 접두사를 사용한다.

```bash
# .env.local
NEXT_PUBLIC_API_URL="/api"
```

```tsx
// app/components/client-component.tsx
'use client'

export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return <p>API URL: {apiUrl}</p>
}
```

환경 변수를 빌드 시점에 번들링하지 않고 런타임에 읽으려면 `process.env`를 읽기 전에 [`connection()`](../../3-api-reference/3.3-functions/connection.md) 함수를 사용한다.

```tsx
// app/page.tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  const config = process.env.RUNTIME_CONFIG
  return <p>{config}</p>
}
```

자세한 내용은 [환경 변수](../environment-variables.md) 가이드를 참고한다.

#### `devIndicators` 옵션

[`devIndicators`](../../3-api-reference/3.5-config/3.5.1-next-config-js/devIndicators.md)에서 다음 옵션이 제거됐다.

- `appIsrStatus`
- `buildActivity`
- `buildActivityPosition`

인디케이터 자체는 계속 제공된다.

#### `experimental.dynamicIO`와 `experimental.useCache`

`experimental.dynamicIO`, `experimental.useCache` 플래그가 제거됐다.

```js
// next.config.js — Before: experimental.useCache
module.exports = {
  experimental: {
    useCache: true,
  },
}
```

```js
// next.config.js — Before: experimental.dynamicIO
module.exports = {
  experimental: {
    dynamicIO: true,
  },
}
```

이 플래그들을 실제로 사용하고 있었다면 최상위 [`cacheComponents`](../../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)로 옮긴다.

```ts
// next.config.ts — After
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

Cache Components를 적극적으로 채택하지 않았다면 플래그를 그냥 제거한다. `cacheComponents`를 켜는 것은 단순한 이름 변경이 아니다 — `<Suspense>` 밖에서 캐시되지 않은 데이터에 대해 빌드 에러가 발생할 수 있으며 Cache Components 모델을 함께 채택해야 한다. 전체 마이그레이션 경로는 [Migrating to Cache Components](../migrating-to-cache-components.md)를 참고한다.

#### `unstable_rootParams`

`unstable_rootParams` 함수가 제거됐다. 대신 [`next/root-params`](../../3-api-reference/3.3-functions/next-root-params.md)를 사용한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- Next.js 15 프로젝트에 `upgrade` codemod를 실행하고, `package.json` 스크립트에서 `--turbopack` 플래그가 사라지는 diff와 실제 빌드 결과를 확인한다.
- `middleware.ts`를 `proxy.ts`로 옮기고 함수 이름을 `proxy`로 바꾼 뒤, `edge` 런타임을 지정했을 때 발생하는 에러를 화면으로 보여준다.
- `revalidateTag('tag')`처럼 인자 하나만 쓰는 호출과 `revalidateTag('tag', 'max')` 호출을 나란히 두고 TypeScript 에러 여부를 비교한다.
- `next/image`에 로컬 이미지를 쿼리 문자열과 함께 사용했을 때 `localPatterns.search` 설정 전후로 렌더링 결과가 어떻게 달라지는지 보여준다.

## 연습 문제

1. Next.js 16에서 `proxy`가 지원하는 런타임은 무엇인가?
   - A. `nodejs`만 지원하며 설정할 수 없다
   - B. `edge`와 `nodejs`를 모두 설정에서 선택할 수 있다
   - C. `edge`만 지원한다

   <details><summary>정답 보기</summary>

   정답: A. `proxy`의 런타임은 `nodejs`로 고정되어 있으며 설정할 수 없다. `edge` 런타임이 필요하면 `middleware`를 계속 사용해야 한다.

   </details>

2. Next.js 16에서 `revalidateTag`를 인자 하나만으로 호출하면 어떻게 되는가?
   - A. deprecated된 형태로 TypeScript 에러가 발생하며, 두 번째 인자로 `cacheLife` 프로필을 지정해야 한다
   - B. 아무 변경 없이 이전과 동일하게 동작한다
   - C. 런타임에서만 경고가 출력되고 타입 검사는 통과한다

   <details><summary>정답 보기</summary>

   정답: A. `revalidateTag`는 `cacheLife` 프로필을 지정하는 두 번째 인자를 요구하며, 인자 하나만 쓰는 형태는 TypeScript 에러를 낸다.

   </details>

3. Next.js 16에서 Partial Prerendering(PPR)을 켜는 방법은 무엇인가?
   - A. 최상위 `cacheComponents` 설정을 사용한다
   - B. `experimental.ppr` 플래그를 그대로 사용한다
   - C. 라우트 세그먼트에 `experimental_ppr`을 추가한다

   <details><summary>정답 보기</summary>

   정답: A. Next.js 16은 실험적 PPR 플래그와 `experimental_ppr` Route Segment Config를 제거했고, 대신 `cacheComponents` 설정으로 PPR을 켠다.

   </details>

## 챕터 요약

- Next.js 16은 AI 에이전트 프롬프트 또는 `upgrade` codemod로 올릴 수 있으며, Node.js 20.9+와 TypeScript 5+가 최소 요구 사항이다.
- Turbopack이 `next dev`·`next build`의 기본값이 됐고, 커스텀 `webpack` 설정이 있으면 별도 조치 없이는 빌드가 실패한다.
- Next.js 15의 임시 동기 Request API 호환이 완전히 제거됐고, `opengraph-image`·`icon`·`sitemap`의 `params`/`id`도 비동기로 바뀌었다.
- `revalidateTag`는 두 번째 인자가 필수이며, `updateTag`·`refresh`·stable이 된 `cacheLife`/`cacheTag`가 캐싱 API를 보강한다.
- `middleware`는 `proxy`로 이름이 바뀌고 `edge` 런타임을 지원하지 않으며, PPR은 `cacheComponents`로 옮겨졌다.
- `next/image`의 여러 기본값(로컬 IP, 리다이렉트 수, 캐시 TTL, 이미지 크기·품질)이 보안과 성능을 이유로 바뀌었다.
- AMP, `next lint`, `serverRuntimeConfig`/`publicRuntimeConfig`, `experimental.dynamicIO`/`useCache`, `unstable_rootParams`가 제거됐다.
