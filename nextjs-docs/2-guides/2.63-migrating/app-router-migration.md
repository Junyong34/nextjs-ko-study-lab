# App Router

- 공식 문서: [App Router](https://nextjs.org/docs/app/guides/migrating/app-router-migration)
- 상위 메뉴: [Migrating](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 12에서 13으로 올릴 때 필요한 Node.js, Next.js, ESLint 변경을 적용한다.
- `pages`와 `app` 디렉터리를 함께 유지하며 화면을 점진적으로 옮긴다.
- 페이지, 라우팅 훅, 데이터 fetching, API Route, 스타일의 이전 규칙을 구분한다.

## 핵심 개념 및 설명

### 업그레이드

#### Node.js Version

최소 Node.js 버전은 `v18.17`이다. 자세한 내용은 [Node.js 문서](https://nodejs.org/docs/latest-v18.x/api/)를 참고한다.

#### Next.js Version

Next.js 13으로 올리려면 사용하는 패키지 관리 도구로 다음 명령을 실행한다.

```bash
pnpm add next@latest react@latest react-dom@latest
```

#### ESLint Version

ESLint를 사용한다면 ESLint 버전도 올려야 한다.

```bash
pnpm add -D eslint-config-next@latest
```

> **알아두면 좋은 점**: ESLint 변경을 반영하려면 VS Code의 ESLint 서버를 다시 시작해야 할 수 있다. Command Palette(Mac은 `cmd+shift+p`, Windows는 `ctrl+shift+p`)를 열어 `ESLint: Restart ESLint Server`를 검색한다.

### 다음 단계

업그레이드를 마쳤다면 다음 단계를 참고한다.

- [새 기능 올리기](#새-기능-올리기): 개선된 Image, Link 컴포넌트 같은 새 기능으로 올리는 안내다.
- [`pages`에서 `app` 디렉터리로 옮기기](#pages에서-app으로-옮기기): `pages`에서 `app` 디렉터리로 점진적으로 옮기는 단계별 안내다.

### 새 기능 올리기

Next.js 13은 새 기능과 컨벤션을 가진 새 [App Router](../../README.md)를 도입했다. 새 라우터는 `app` 디렉터리에서 쓸 수 있으며 `pages` 디렉터리와 공존한다.

Next.js 13으로 올린다고 App Router를 반드시 써야 하는 것은 **아니다**. 개선된 [`<Image>` 컴포넌트](#image-component), [`<Link>` 컴포넌트](#link-component), [`<Script>` 컴포넌트](#script-component), [Font Optimization](#font-optimization)처럼 두 디렉터리에서 쓸 수 있는 새 기능은 `pages`를 계속 쓰면서도 채택할 수 있다.

#### `<Image>` Component

Next.js 12의 `next/future/image`에 있던 적은 클라이언트 JavaScript, 쉬운 스타일 확장, 접근성 개선, 브라우저 기본 지연 로딩 동작이 Next.js 13에서는 `next/image`의 기본값이 됐다. 기존 동작을 그대로 유지하려면 `next-image-to-legacy-image` codemod로 import를 `next/legacy/image`로 바꾼다. 새 동작으로 옮기는 `next-image-experimental`은 인라인 스타일을 추가하고 사용하지 않는 prop을 제거하므로 동작이 달라질 수 있다. 이 변환은 먼저 legacy 변환을 실행해야 한다.

#### `<Link>` Component

`<Link>` 안에 `<a>`를 직접 넣을 필요가 없다. 이 동작은 [버전 12.2](https://nextjs.org/blog/next-12-2)에서 실험적 옵션으로 추가됐고 이제 기본값이 됐다. Next.js 13의 `<Link>`는 항상 내부적으로 `<a>`를 렌더링하고, 해당 태그로 prop을 전달할 수 있다. `new-link` codemod로 기존 형식을 바꿀 수 있다.

```tsx
import Link from 'next/link'

// Next.js 12: <a>를 자식으로 넣지 않으면 제외된다
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: <Link>가 내부적으로 항상 <a>를 렌더링한다
<Link href="/about">
  About
</Link>
```

#### `<Script>` Component

[`next/script`](../../3-api-reference/3.2-components/script.md)의 동작이 `pages`와 `app` 모두를 지원하도록 갱신됐지만, 매끄러운 이전을 위해 몇 가지를 바꿔야 한다.

- 이전에 `_document.js`에 두었던 `beforeInteractive` 스크립트는 `app/layout.tsx` 같은 [Root Layout](../../3-api-reference/3.1-file-conventions/layout.md)으로 옮긴다.
- 실험적 `worker` 전략은 `app`에서 아직 동작하지 않으므로, 이 전략을 쓰던 스크립트는 제거하거나 `lazyOnload` 같은 다른 전략으로 바꿔야 한다.
- `onLoad`, `onReady`, `onError` 핸들러는 Server Component에서 동작하지 않으므로 [Client Component](../../1-getting-started/server-and-client-components.md)로 옮기거나 완전히 제거한다.

#### Font Optimization

이전에는 Next.js가 폰트 CSS를 인라인하는 방식으로 폰트 최적화를 도왔다. Version 13은 새 [`next/font`](../../3-api-reference/3.2-components/font.md) 모듈을 도입해, 뛰어난 성능과 프라이버시를 유지하면서 폰트 로딩 경험을 커스터마이즈할 수 있게 한다. `next/font`는 `pages`와 `app` 디렉터리 모두에서 지원한다.

CSS 인라인 방식은 `pages`에서는 계속 동작하지만 `app`에서는 동작하지 않는다. 대신 `next/font`를 사용해야 한다.

### `pages`에서 `app`으로 옮기기

App Router로 옮기는 것은 Next.js가 기반으로 삼는 Server Component, Suspense 같은 React 기능을 처음 써보는 경험일 수 있다. [특수 파일](../../3-api-reference/3.1-file-conventions/README.md), [레이아웃](../../3-api-reference/3.1-file-conventions/layout.md) 같은 새 Next.js 기능과 결합되면, 마이그레이션에는 새 개념·멘탈 모델·동작 변화를 배우는 과정이 함께 따른다.

이런 변화를 한 번에 배우는 대신, 이전을 더 작은 단계로 나누는 것을 권장한다. `app` 디렉터리는 `pages` 디렉터리와 동시에 동작하도록 의도적으로 설계되어 있어 페이지 단위로 점진적으로 옮길 수 있다.

- `app` 디렉터리는 중첩 라우트와 레이아웃을 지원한다.
- 중첩 폴더로 라우트를 정의하고, 특수 `page.js` 파일로 라우트 세그먼트를 공개적으로 접근 가능하게 만든다.
- [특수 파일 규칙](../../3-api-reference/3.1-file-conventions/README.md)으로 각 라우트 세그먼트의 UI를 만든다. 가장 흔한 특수 파일은 `page.js`와 `layout.js`다. `page.js`는 라우트별 UI를, `layout.js`는 여러 라우트가 공유하는 UI를 만든다. 특수 파일에는 `.js`, `.jsx`, `.tsx`를 쓸 수 있다.
- 컴포넌트, 스타일, 테스트 파일 등은 `app` 안에 함께 둘 수 있다.
- `getServerSideProps`, `getStaticProps` 같은 데이터 fetching 함수는 `app` 안의 [새 API](../../1-getting-started/fetching-data.md)로 대체됐다. `getStaticPaths`는 [`generateStaticParams`](../../3-api-reference/3.3-functions/generate-static-params.md)로 대체됐다.
- `pages/_app.js`와 `pages/_document.js`는 `app/layout.js` 하나의 Root Layout으로 대체됐다.
- `pages/_error.js`는 더 세분화된 `error.js` 특수 파일로 대체됐다.
- `pages/404.js`는 [`not-found.js`](../../3-api-reference/3.1-file-conventions/not-found.md) 파일로 대체됐다.
- `pages/api/*` API Route는 [`route.js`](../../3-api-reference/3.1-file-conventions/route.md)(Route Handler) 특수 파일로 대체됐다.

#### 1단계: `app` 디렉터리 만들기

최신 Next.js 버전(13.4 이상 필요)으로 올린다.

```bash
pnpm add next@latest
```

그 뒤 프로젝트 루트(또는 `src/` 디렉터리)에 새 `app` 디렉터리를 만든다.

#### 2단계: Root Layout 만들기

`app` 디렉터리 안에 새 `app/layout.tsx` 파일을 만든다. 이것이 `app` 안 모든 라우트에 적용되는 [Root Layout](../../3-api-reference/3.1-file-conventions/layout.md)이다.

```tsx
// app/layout.tsx
export default function RootLayout({
  // 레이아웃은 children prop을 받아야 한다.
  // 여기에 중첩 레이아웃이나 페이지가 채워진다
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- `app` 디렉터리에는 Root Layout이 **반드시** 있어야 한다.
- Next.js가 자동으로 만들지 않으므로 Root Layout은 `<html>`, `<body>` 태그를 직접 정의해야 한다.
- Root Layout은 `pages/_app.tsx`와 `pages/_document.tsx` 파일을 대체한다.
- 레이아웃 파일에는 `.js`, `.jsx`, `.tsx` 확장자를 쓸 수 있다.

`<head>` HTML 요소를 관리하려면 [내장 SEO 지원](../../1-getting-started/metadata-and-og-images.md)을 사용한다.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

##### `_document.js`와 `_app.js` 옮기기

기존 `_app`이나 `_document` 파일이 있다면 그 내용(예: 전역 스타일)을 Root Layout(`app/layout.tsx`)으로 복사할 수 있다. `app/layout.tsx`의 스타일은 `pages/*`에 적용되지 **않는다**. `pages/*` 라우트가 깨지지 않도록 이전 중에는 `_app`/`_document`를 유지해야 하며, 완전히 옮긴 뒤에는 안전하게 지울 수 있다.

React Context Provider를 쓰고 있다면 [Client Component](../../1-getting-started/server-and-client-components.md)로 옮겨야 한다.

##### `getLayout()` 패턴을 레이아웃으로 옮기기 (선택)

Next.js는 `pages` 디렉터리에서 페이지별 레이아웃을 구현하려고 Page 컴포넌트에 속성을 추가하는 방식을 권장했다. 이 패턴은 `app` 디렉터리의 [중첩 레이아웃](../../3-api-reference/3.1-file-conventions/layout.md) 내장 지원으로 대체할 수 있다.

전후 예시:

```js
// components/DashboardLayout.js — Before
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```

```js
// pages/dashboard/index.js — Before
import DashboardLayout from '../components/DashboardLayout'

export default function Page() {
  return <p>My Page</p>
}

Page.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}
```

`pages/dashboard/index.js`의 `Page.getLayout` 속성을 지우고 [4단계(페이지 옮기기)](#4단계-페이지-옮기기)의 절차를 따른다.

```js
// app/dashboard/page.js — After
export default function Page() {
  return <p>My Page</p>
}
```

`DashboardLayout`의 내용을 새 Client Component로 옮겨 `pages` 디렉터리와 같은 동작을 유지한다.

```js
// app/dashboard/DashboardLayout.js — After
'use client' // 이 지시어는 모든 import보다 앞, 파일 맨 위에 있어야 한다

// Client Component다
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```

새 `layout.js` 파일에서 `DashboardLayout`을 `app` 디렉터리로 import한다.

```js
// app/dashboard/layout.js — After
import DashboardLayout from './DashboardLayout'

// Server Component다
export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```

클라이언트로 보내는 컴포넌트 JavaScript 양을 줄이려면, `DashboardLayout.js`(Client Component)의 인터랙티브하지 않은 부분을 `layout.js`(Server Component)로 점진적으로 옮길 수 있다.

#### 3단계: `next/head` 옮기기

`pages` 디렉터리에서는 `next/head`의 React 컴포넌트로 `title`, `meta` 같은 `<head>` HTML 요소를 관리한다. `app` 디렉터리에서는 `next/head`가 새 [내장 SEO 지원](../../1-getting-started/metadata-and-og-images.md)으로 대체된다.

```tsx
// pages/index.tsx — Before
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```

```tsx
// app/page.tsx — After
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return '...'
}
```

전체 메타데이터 옵션은 [`generateMetadata`](../../3-api-reference/3.3-functions/generate-metadata.md)에서 확인한다.

#### 4단계: 페이지 옮기기

- [`app` 디렉터리](../../README.md)의 페이지는 기본적으로 [Server Component](../../1-getting-started/server-and-client-components.md)다. `pages`에서는 페이지가 [Client Component](../../1-getting-started/server-and-client-components.md)라는 점과 다르다.
- `app`에서는 [데이터 fetching](../../1-getting-started/fetching-data.md)이 바뀌었다. `getServerSideProps`, `getStaticProps`, `getInitialProps`는 더 단순한 API로 대체됐다.
- `app` 디렉터리는 중첩 폴더로 라우트를 정의하고, 특수 `page.js` 파일로 라우트 세그먼트를 공개적으로 접근 가능하게 만든다.

| `pages` 디렉터리 | `app` 디렉터리 | 라우트 |
| --- | --- | --- |
| `index.js` | `page.js` | `/` |
| `about.js` | `about/page.js` | `/about` |
| `blog/[slug].js` | `blog/[slug]/page.js` | `/blog/post-1` |

페이지 이전은 두 단계로 나누는 것을 권장한다.

- 1단계: 기본 export된 Page 컴포넌트를 새 Client Component로 옮긴다.
- 2단계: 새 Client Component를 `app` 디렉터리의 새 `page.js` 파일에서 import한다.

> **알아두면 좋은 점**: 이 방식이 가장 쉬운 마이그레이션 경로다. `pages` 디렉터리와 가장 비슷한 동작을 유지하기 때문이다.

**1단계: 새 Client Component 만들기**

- `app` 디렉터리 안에 Client Component를 export하는 새 파일(예: `app/home-page.tsx`)을 만든다. Client Component를 정의하려면 파일 맨 위(모든 import보다 앞)에 `'use client'` 지시어를 추가한다.
  - Pages Router와 비슷하게, 첫 페이지 로드에서 Client Component를 정적 HTML로 prerender하는 [최적화 단계](../../1-getting-started/server-and-client-components.md)가 있다.
- `pages/index.js`에서 기본 export된 페이지 컴포넌트를 `app/home-page.tsx`로 옮긴다.

```tsx
// app/home-page.tsx
'use client'

// Client Component다(pages 디렉터리의 컴포넌트와 같다)
// props로 데이터를 받고, state와 effect에 접근할 수 있으며,
// 첫 페이지 로드 중 서버에서 prerender된다.
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**2단계: 새 페이지 만들기**

- `app` 디렉터리 안에 새 `app/page.tsx` 파일을 만든다. 기본적으로 Server Component다.
- `home-page.tsx` Client Component를 이 페이지에서 import한다.
- `pages/index.js`에서 데이터를 가져오고 있었다면, 데이터 fetching 로직을 새 [데이터 fetching API](../../1-getting-started/fetching-data.md)를 사용해 Server Component 안으로 직접 옮긴다. 자세한 내용은 [6단계](#6단계-데이터-fetching-방식-옮기기)를 참고한다.

  ```tsx
  // app/page.tsx
  // Client Component를 import한다
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // Server Component에서 데이터를 직접 가져온다
    const recentPosts = await getPosts()
    // 가져온 데이터를 Client Component로 전달한다
    return <HomePage recentPosts={recentPosts} />
  }
  ```

- 이전 페이지가 `useRouter`를 사용했다면 새 라우팅 훅으로 갱신해야 한다. [자세히 보기](#5단계-라우팅-훅-옮기기).
- 개발 서버를 실행하고 `http://localhost:3000`에 방문한다. `app` 디렉터리를 통해 제공되는 기존 index 라우트가 보인다.

#### 5단계: 라우팅 훅 옮기기

`app` 디렉터리의 새 동작을 지원하는 새 라우터가 추가됐다. `app`에서는 `next/navigation`에서 가져오는 세 가지 새 훅 — [`useRouter()`](../../3-api-reference/3.3-functions/use-router.md), [`usePathname()`](../../3-api-reference/3.3-functions/use-pathname.md), [`useSearchParams()`](../../3-api-reference/3.3-functions/use-search-params.md) — 를 사용해야 한다.

- 새 `useRouter` 훅은 `next/navigation`에서 가져오며, `pages`의 `useRouter`(이 훅은 `next/router`에서 가져온다)와 동작이 다르다.
  - `next/router`에서 가져오는 `useRouter` 훅은 `app` 디렉터리에서 지원하지 않지만, `pages` 디렉터리에서는 계속 쓸 수 있다.
- 새 `useRouter`는 `pathname` 문자열을 반환하지 않는다. 대신 별도의 `usePathname` 훅을 사용한다.
- 새 `useRouter`는 `query` 객체를 반환하지 않는다. 검색 파라미터와 다이나믹 라우트 파라미터가 이제 분리됐다. `useSearchParams`와 `useParams` 훅을 사용한다.
- `useSearchParams`와 `usePathname`을 함께 써서 페이지 변경을 감지할 수 있다.
- 이 새 훅들은 Client Component에서만 지원한다. Server Component에서는 쓸 수 없다.

```tsx
// app/example-client-component.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

추가로 새 `useRouter` 훅에는 다음과 같은 변경도 있다.

- `isFallback`이 제거됐다. `fallback`이 [대체됐기](#fallback-대체하기) 때문이다.
- `locale`, `locales`, `defaultLocales`, `domainLocales` 값이 제거됐다. `app` 디렉터리에서는 내장 i18n 기능이 더 이상 필요하지 않기 때문이다. [i18n 더 알아보기](../internationalization.md).
- `basePath`가 제거됐다. 대안은 `useRouter`의 일부로 제공되지 않으며, 아직 구현되지 않았다.
- `asPath`가 제거됐다. `as` 개념이 새 라우터에서 없어졌기 때문이다.
- `isReady`가 제거됐다. 더 이상 필요하지 않기 때문이다. prerendering 중 [`useSearchParams()`](../../3-api-reference/3.3-functions/use-search-params.md) 훅을 쓰는 컴포넌트는 prerendering 단계를 건너뛰고 런타임에 클라이언트에서 렌더링된다.
- `route`가 제거됐다. `usePathname`이나 `useSelectedLayoutSegments()`가 대안이다.

##### `pages`와 `app` 사이에 컴포넌트 공유하기

`pages`와 `app` 라우터 사이에서 컴포넌트를 호환되게 유지하려면 `next/compat/router`의 `useRouter` 훅을 참고한다. 이는 `pages` 디렉터리의 `useRouter` 훅이지만, 두 라우터 사이에 컴포넌트를 공유하는 동안 쓰도록 만들어졌다. `app` 라우터에서만 쓸 준비가 되면 `next/navigation`의 새 `useRouter`로 갱신한다.

#### 6단계: 데이터 fetching 방식 옮기기

`pages` 디렉터리는 `getServerSideProps`와 `getStaticProps`로 페이지 데이터를 가져온다. `app` 디렉터리에서는 이 데이터 fetching 함수들이 [`fetch()`](../../3-api-reference/3.3-functions/fetch.md)와 `async` React Server Component 위에 지은 [더 단순한 API](../../1-getting-started/fetching-data.md)로 대체된다.

```tsx
// app/page.tsx
export default async function Page() {
  // 이 요청에 Next.js Data Cache를 적용한다.
  // 캐시된 응답은 여러 요청에서 재사용되고 필요에 따라 revalidate된다.
  // getStaticProps와 비슷하다.
  const cachedData = await fetch('https://...', { cache: 'force-cache' })

  // 이 요청은 캐시하지 않는다.
  // Next.js는 매 요청마다 데이터 소스에서 가져온다.
  // 기본 fetch 동작이며, getServerSideProps와 비슷하다.
  const uncachedData = await fetch('https://...', { cache: 'no-store' })

  // 이 요청은 캐시하되 최소 10초마다 revalidate한다.
  // revalidate 옵션이 있는 getStaticProps와 비슷하다.
  const revalidatedData = await fetch('https://...', {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

##### 서버 사이드 렌더링(`getServerSideProps`)

`pages` 디렉터리에서는 `getServerSideProps`로 서버에서 데이터를 가져와 파일의 기본 export 컴포넌트로 prop을 전달한다. 페이지의 초기 HTML은 서버에서 prerender된 뒤 브라우저에서 hydrate돼 인터랙티브해진다.

```js
// pages/dashboard.js — `pages` 디렉터리
export async function getServerSideProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

App Router에서는 [Server Component](../../1-getting-started/server-and-client-components.md)를 사용해 데이터 fetching을 React 컴포넌트 안에 함께 둘 수 있다. 이렇게 하면 서버에서 렌더링된 HTML은 유지하면서 클라이언트로 보내는 JavaScript는 줄어든다.

`cache` 옵션을 `no-store`로 설정하면 가져온 데이터를 [절대 캐시하지 않도록](../../1-getting-started/fetching-data.md) 지시할 수 있다. `pages` 디렉터리의 `getServerSideProps`와 비슷하다.

```tsx
// app/dashboard/page.tsx — `app` 디렉터리
// 이 함수는 이름을 자유롭게 지을 수 있다
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

##### 요청 객체 접근하기

`pages` 디렉터리에서는 Node.js HTTP API를 바탕으로 요청 기반 데이터를 가져올 수 있다. 예를 들어 `getServerSideProps`에서 `req` 객체를 받아 요청의 쿠키와 헤더를 읽을 수 있다.

```js
// pages/index.js — `pages` 디렉터리
export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization']
  const theme = req.cookies['theme']

  return { props: { /* ... */ } }
}

export default function Page(props) {
  return /* ... */
}
```

`app` 디렉터리는 요청 데이터를 가져오는 새 읽기 전용 함수를 제공한다.

- [`headers`](../../3-api-reference/3.3-functions/headers.md): Web Headers API를 바탕으로 하며, [Server Component](../../1-getting-started/server-and-client-components.md) 안에서 요청 헤더를 가져올 때 쓴다.
- [`cookies`](../../3-api-reference/3.3-functions/cookies.md): Web Cookies API를 바탕으로 하며, Server Component 안에서 쿠키를 가져올 때 쓴다.

```tsx
// app/page.tsx — `app` 디렉터리
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = (await headers()).get('authorization')

  return '...'
}

export default async function Page() {
  // Server Component 안에서 직접, 또는 데이터 fetching 함수 안에서
  // cookies나 headers를 쓸 수 있다
  const theme = (await cookies()).get('theme')
  const data = await getData()
  return '...'
}
```

##### 정적 사이트 생성(`getStaticProps`)

`pages` 디렉터리에서는 `getStaticProps` 함수로 빌드 시점에 페이지를 prerender한다. 이 함수는 외부 API나 데이터베이스에서 데이터를 가져와 빌드되는 동안 페이지 전체에 전달할 수 있다.

```js
// pages/index.js — `pages` 디렉터리
export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

`app` 디렉터리에서는 [`fetch()`](../../3-api-reference/3.3-functions/fetch.md)로 데이터를 가져올 때 기본값이 `cache: 'force-cache'`라서 수동으로 무효화하기 전까지 요청 데이터가 캐시된다. `pages` 디렉터리의 `getStaticProps`와 비슷하다.

```js
// app/page.js — `app` 디렉터리
// 이 함수는 이름을 자유롭게 지을 수 있다
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return projects
}

export default async function Index() {
  const projects = await getProjects()

  return projects.map((project) => <div>{project.name}</div>)
}
```

##### 다이나믹 경로(`getStaticPaths`)

`pages` 디렉터리에서는 `getStaticPaths` 함수로 빌드 시점에 prerender할 다이나믹 경로를 정의한다.

```js
// pages/posts/[id].js — `pages` 디렉터리
import PostLayout from '@/components/post-layout'

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

`app` 디렉터리에서는 `getStaticPaths`가 [`generateStaticParams`](../../3-api-reference/3.3-functions/generate-static-params.md)로 대체된다.

[`generateStaticParams`](../../3-api-reference/3.3-functions/generate-static-params.md)는 `getStaticPaths`와 비슷하게 동작하지만, 라우트 파라미터를 반환하는 더 단순한 API를 가지고 있고 [레이아웃](../../3-api-reference/3.1-file-conventions/layout.md) 안에서도 쓸 수 있다. `generateStaticParams`의 반환 형태는 중첩된 `param` 객체의 배열이나 해석된 경로 문자열이 아니라, 세그먼트로 이루어진 배열이다.

```js
// app/posts/[id]/page.js — `app` 디렉터리
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${(await params).id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

`app` 디렉터리의 새 모델에는 `getStaticPaths`보다 `generateStaticParams`라는 이름이 더 적합하다. `get` 접두사는 더 설명적인 `generate`로 바뀌었는데, `getStaticProps`와 `getServerSideProps`가 더 이상 필요 없어진 지금 이 접두사가 홀로 있어도 더 잘 어울린다. `Paths` 접미사는 `Params`로 바뀌었는데, 여러 다이나믹 세그먼트가 있는 중첩 라우팅에 더 적합한 표현이기 때문이다.

##### `fallback` 대체하기

`pages` 디렉터리에서는 `getStaticPaths`가 반환하는 `fallback` 속성으로 빌드 시점에 prerender되지 않은 페이지의 동작을 정의한다. 이 속성을 `true`로 설정하면 페이지가 생성되는 동안 fallback 페이지를 보여주고, `false`로 설정하면 404 페이지를 보여주며, `blocking`으로 설정하면 요청 시점에 페이지를 생성한다.

```js
// pages/posts/[id].js — `pages` 디렉터리
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  // ...
}

export default function Post({ post }) {
  return /* ... */
}
```

`app` 디렉터리에서는 [`dynamicParams` 설정](../../3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/dynamicParams.md)이 [`generateStaticParams`](../../3-api-reference/3.3-functions/generate-static-params.md) 밖의 params를 어떻게 처리할지 제어한다.

- **`true`**(기본값): `generateStaticParams`에 포함되지 않은 다이나믹 세그먼트는 필요할 때 생성된다.
- **`false`**: `generateStaticParams`에 포함되지 않은 다이나믹 세그먼트는 404를 반환한다.

이는 `pages` 디렉터리의 `getStaticPaths`가 가진 `fallback: true | false | 'blocking'` 옵션을 대체한다. `fallback: 'blocking'` 옵션은 `dynamicParams`에 포함되지 않는데, 스트리밍에서는 `'blocking'`과 `true`의 차이가 거의 없기 때문이다.

```js
// app/posts/[id]/page.js — `app` 디렉터리
export const dynamicParams = true

export async function generateStaticParams() {
  return [
    /* ... */
  ]
}

async function getPost(params) {
  /* ... */
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return /* ... */
}
```

[`dynamicParams`](../../3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/dynamicParams.md)를 `true`(기본값)로 설정하면, 아직 생성되지 않은 라우트 세그먼트가 요청되었을 때 서버에서 렌더링되고 캐시된다.

##### 증분 정적 재생성(`getStaticProps`의 `revalidate`)

`pages` 디렉터리에서는 `getStaticProps` 함수에 `revalidate` 필드를 추가해 일정 시간이 지난 뒤 페이지를 자동으로 다시 생성할 수 있다.

```js
// pages/index.js — `pages` 디렉터리
export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

`app` 디렉터리에서는 [`fetch()`](../../3-api-reference/3.3-functions/fetch.md)로 데이터를 가져올 때 `revalidate`를 쓸 수 있다. 지정한 초만큼 요청을 캐시한다.

```js
// app/page.js — `app` 디렉터리
async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

##### API Routes

API Route는 변경 없이 `pages/api` 디렉터리에서 계속 동작한다. 다만 `app` 디렉터리에서는 [Route Handlers](../../3-api-reference/3.1-file-conventions/route.md)로 대체됐다.

Route Handlers는 Web [`Request`](https://developer.mozilla.org/docs/Web/API/Request)와 [`Response`](https://developer.mozilla.org/docs/Web/API/Response) API를 사용해 특정 라우트의 커스텀 요청 핸들러를 만들 수 있게 해준다.

```ts
// app/api/route.ts
export async function GET(request: Request) {}
```

> **알아두면 좋은 점**: 클라이언트에서 외부 API를 호출하려고 API Route를 썼다면, 이제는 [Server Component](../../1-getting-started/server-and-client-components.md)에서 안전하게 데이터를 가져오는 방식을 대신 쓸 수 있다. 자세한 내용은 [데이터 fetching](../../1-getting-started/fetching-data.md)을 참고한다.

##### Single-Page Applications

Single-Page Application(SPA)에서 동시에 마이그레이션하는 중이라면 [SPA 가이드](../single-page-applications.md)를 참고한다.

#### 7단계: 스타일링 적용하기

`pages` 디렉터리에서는 전역 스타일시트를 `pages/_app.js`에서만 가져올 수 있었다. `app` 디렉터리에서는 이 제한이 없어져 전역 스타일을 모든 레이아웃, 페이지, 컴포넌트에 추가할 수 있다.

- [CSS Modules](../../1-getting-started/css.md)
- [Tailwind CSS](../../1-getting-started/css.md)
- [Global Styles](../../1-getting-started/css.md)
- [CSS-in-JS](../css-in-js.md)
- [External Stylesheets](../../1-getting-started/css.md)
- [Sass](../sass.md)

##### Tailwind CSS

Tailwind CSS를 쓴다면 `tailwind.config.js` 파일에 `app` 디렉터리를 추가해야 한다.

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- 이 줄을 추가한다
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

`app/layout.js` 파일에서 전역 스타일도 import해야 한다.

```js
// app/layout.js
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

[Tailwind CSS로 스타일링하기](../../1-getting-started/css.md)에서 더 알아본다.

### 두 라우터 함께 쓰기

서로 다른 Next.js 라우터가 제공하는 라우트 사이를 이동하면 hard navigation이 발생한다. `next/link`의 자동 prefetch는 라우터를 가로질러 실행되지 않는다.

대신 App Router와 Pages Router 사이의 [내비게이션을 최적화](https://vercel.com/guides/optimizing-hard-navigations)해서 prefetch되고 빠른 페이지 전환을 유지할 수 있다.

기능이 deprecated될 때 코드베이스를 갱신하려면 [Codemods](../2.64-upgrading/codemods.md)를 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `pages`와 `app`에 서로 다른 상품 라우트를 두고, Root Layout과 중첩 레이아웃의 적용 범위를 확인한다.
- `getServerSideProps`, `getStaticProps`, `getStaticPaths` 예제를 각각 `fetch`, `generateStaticParams`, `dynamicParams`로 바꾼 뒤 응답과 404 동작을 비교한다.
- `next/router`와 `next/navigation` 훅의 반환값 차이를 화면에서 확인한다.

## 연습 문제

1. `pages`에서 `app`으로 점진적으로 옮기는 동안 유지해야 하는 파일은 무엇인가?
   - A. `pages/_app`과 `pages/_document`
   - B. `pages/404`만
   - C. `next/head`만

   <details><summary>정답 보기</summary>

   정답: A. `app/layout.tsx`의 스타일은 `pages/*`에 적용되지 않으므로, 모든 라우트를 옮길 때까지 두 파일을 유지한다.

   </details>

2. `getStaticPaths`의 `fallback` 동작을 대체하는 설정은 무엇인가?
   - A. `dynamicParams`
   - B. `dynamic`
   - C. `revalidate`

   <details><summary>정답 보기</summary>

   정답: A. `dynamicParams`의 `true`는 필요할 때 생성하고, `false`는 404를 반환한다.

   </details>

## 챕터 요약

- App Router는 `pages`와 함께 둘 수 있으므로 페이지 단위로 옮긴다.
- Root Layout, Metadata, 중첩 레이아웃이 `_app`, `_document`, `next/head`, `getLayout` 패턴을 대체한다.
- 페이지는 기본적으로 Server Component이며, 이전 중에는 Client Component로 먼저 분리하는 경로가 가장 비슷하다.
- `fetch`, `generateStaticParams`, `dynamicParams`, Route Handler가 기존 데이터 함수와 API Route의 역할을 나눈다.
- 서로 다른 라우터 사이 이동은 hard navigation이며 자동 `prefetch`가 라우터를 넘지 않는다.
