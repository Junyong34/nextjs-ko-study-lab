# layout.js

- 공식 문서: [layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 라우트 세그먼트 사이에서 UI를 공유하고 상태를 보존하는 `layout.js`의 역할을 설명한다.
- 루트 layout의 필수 계약과 `children`, `params`, `LayoutProps` 사용법을 구분한다.
- layout이 재렌더링되지 않는 특성 때문에 생기는 요청·URL 접근 제약을 다룬다.

## 핵심 개념 및 설명

`layout` 파일은 Next.js 애플리케이션에서 레이아웃을 정의하는 데 사용된다.

```tsx filename="app/dashboard/layout.tsx" switcher
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

```jsx filename="app/dashboard/layout.js" switcher
export default function DashboardLayout({ children }) {
  return <section>{children}</section>
}
```

[컴포넌트 계층 구조](../../1-getting-started/project-structure.md#component-hierarchy)에서 `layout.js`는 라우트 세그먼트의 가장 바깥쪽 컴포넌트이다. 이는 `template.js`,`error.js`,`loading.js`,`not-found.js` 및 `page.js`를 래핑한다.

**루트 레이아웃**은 루트 `app` 디렉터리의 최상위 레이아웃이다.`<html>` 및 `<body>` 태그와 기타 전역적으로 공유되는 UI를 정의하는 데 사용된다.

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
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

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

<a id="reference"></a>
### 참조

<a id="props"></a>
#### prop

<a id="children-required"></a>
##### `children`(필수)

레이아웃 컴포넌트는 `children` prop을 허용하고 사용해야 한다. 렌더링하는 동안 `children`는 레이아웃이 래핑되는 라우트 세그먼트로 채워진다. 이는 주로 하위 [레이아웃](page.md)(존재하는 경우) 또는 [페이지](page.md)의 컴포넌트가 되지만 해당하는 경우 [로드 중](loading.md) 또는 [오류](../../1-getting-started/error-handling.md)와 같은 다른 특수 파일일 수도 있다.

<a id="params-optional"></a>
##### `params`(옵션)

루트 세그먼트부터 해당 레이아웃까지 [다이나믹 라우트 매개변수](dynamic-routes.md) 객체를 포함하는 객체로 확인되는 Promise이다.

```tsx filename="app/dashboard/[team]/layout.tsx" switcher
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params
}
```

```jsx filename="app/dashboard/[team]/layout.js" switcher
export default async function Layout({ children, params }) {
  const { team } = await params
}
```

| 예시 경로 | URL | `params` |
| --------------------------------- | -------------- | ---------------------------------- |
| `app/dashboard/[team]/layout.js` | `/dashboard/1` | `Promise<{ team: '1' }>` |
| `app/shop/[tag]/[item]/layout.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |
| `app/blog/[...slug]/layout.js` | `/blog/1/2` | `Promise<{ slug: ['1', '2'] }>` |

- `params` prop은 Promise이기 때문이다. 값에 접근하려면 `async/await` 또는 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용해야 한다.
  - 버전 14 이하에서는 `params`가 동기식 prop이었다. 이전 버전과의 호환성을 돕기 위해 Next.js 15에서는 여전히 동기적으로 액세스할 수 있지만 이 동작은 앞으로 더 이상 사용되지 않는다.

<a id="layout-props-helper"></a>
#### 레이아웃 prop 도우미

`LayoutProps`로 레이아웃을 입력하면 강력한 형식의 `params`와 디렉터리 구조에서 유추되는 명명된 슬롯을 얻을 수 있다.`LayoutProps`는 전역에서 사용할 수 있는 도우미이다.

```tsx filename="app/dashboard/layout.tsx"
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}


    </section>
  )
}
```

> **알아두면 좋은 점**:
>
> - `next dev`,`next build` 또는 `next typegen` 중에 유형이 생성된다.
> - 유형 생성 후 `LayoutProps`도우미를 전역적으로 사용할 수 있다. 수입할 필요는 없다.

<a id="root-layout"></a>
#### 루트 레이아웃

`app` 디렉터리에는 **반드시** 루트 `app` 디렉터리의 최상위 레이아웃인 **루트 레이아웃**이 포함되어야 한다. 일반적으로 루트 레이아웃은 `app/layout.js`이다.

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

- 루트 레이아웃은 **반드시**`<html>` 및 `<body>` 태그를 정의해야 한다.
  - `<title>` 및 `<meta>`와 같은 `<head>` 태그를 루트 레이아웃에 수동으로 추가하면 **안 된다**. 대신 `<head>` 요소 스트리밍 및 중복 제거와 같은 고급 요구 사항을 자동으로 처리하는 [메타데이터 API](../../1-getting-started/metadata-and-og-images.md)를 사용해야 한다.
- **여러 루트 레이아웃**을 만들 수 있다. 위에 `layout.js`가 없는 레이아웃은 루트 레이아웃이다. 두 가지 일반적인 접근 방식:
  - `app/(shop)/layout.js` 및 `app/(marketing)/layout.js`와 같은 [라우트 그룹](route-groups.md) 사용
  - `app/layout.js`를 생략하면 `app/dashboard/layout.js` 및 `app/blog/layout.js`와 같은 하위 디렉터리의 레이아웃이 각각 해당 디렉터리의 루트 레이아웃이 된다.
  - **여러 루트 레이아웃에 걸쳐** 탐색하면 **전체 페이지 로드**가 발생한다(클라이언트 측 탐색과 반대).
- 예를 들어 `app/[lang]/layout.js`를 사용하여 [국제화](../../2-guides/internationalization.md)를 구현할 때 루트 레이아웃은 **다이나믹 세그먼트** 아래에 있을 수 있다. 루트 레이아웃 앞의 다이나믹 세그먼트는 **루트 매개변수**이며 [`next/root-params`](../3.3-functions/next-root-params.md)를 사용하여 모든 Server Component에서 읽을 수 있다.

<a id="caveats"></a>
### 주의사항

<a id="request-object"></a>
#### 요청 객체

불필요한 서버 요청을 피하기 위해 탐색 중에 레이아웃이 클라이언트에 캐시된다.

[레이아웃](layout.md)은 다시 렌더링되지 않는다. 페이지 간을 탐색할 때 불필요한 계산을 피하기 위해 캐시하고 재사용할 수 있다. 레이아웃이 원시 요청에 액세스하지 못하도록 제한함으로써 Next.js는 성능에 부정적인 영향을 미칠 수 있는 레이아웃 내에서 잠재적으로 느리거나 비용이 많이 드는 사용자 코드의 실행을 방지할 수 있다.

요청 객체에 접근하려면 [Server Component](../../1-getting-started/server-and-client-components.md) 및 함수에서 [`headers`](../3.3-functions/headers.md) 및 [`cookies`](../3.3-functions/cookies.md) API를 사용할 수 있다.

```tsx filename="app/shop/layout.tsx" switcher
import { cookies } from 'next/headers'

export default async function Layout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

```jsx filename="app/shop/layout.js" switcher
import { cookies } from 'next/headers'

export default async function Layout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

<a id="query-params"></a>
#### 쿼리 매개변수

레이아웃은 탐색 시 다시 렌더링되지 않으므로 그렇지 않으면 오래될 수 있는 검색 매개변수에 액세스할 수 없다.

업데이트된 쿼리 매개변수에 액세스하려면 페이지 [`searchParams`](page.md#searchparams-optional) prop을 사용하거나 [`useSearchParams`](../3.3-functions/use-search-params.md) 후크를 사용하여 Client Component 내에서 읽을 수 있다. Client Component는 탐색 시 다시 렌더링되므로 최신 쿼리 매개변수에 액세스할 수 있다.

```tsx filename="app/ui/search.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  return '...'
}
```

```jsx filename="app/ui/search.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  return '...'
}
```

```tsx filename="app/shop/layout.tsx" switcher
import Search from '@/app/ui/search'

export default function Layout({ children }) {
  return (
    <>
      <Search />
      {children}
    </>
  )
}
```

```jsx filename="app/shop/layout.js" switcher
import Search from '@/app/ui/search'

export default function Layout({ children }) {
  return (
    <>
      <Search />
      {children}
    </>
  )
}
```

<a id="pathname"></a>
#### 경로명

레이아웃은 탐색 시 다시 렌더링되지 않으므로 그렇지 않으면 오래될 수 있는 경로 이름에 액세스하지 않는다.

현재 경로 이름에 액세스하려면 [`usePathname`](../3.3-functions/use-pathname.md) 후크를 사용하여 Client Component 내에서 읽을 수 있다. 탐색 중에 Client Component가 다시 렌더링되므로 최신 경로 이름에 액세스할 수 있다.

```tsx filename="app/ui/breadcrumbs.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

// 단순화된 탐색경로 논리
export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/')

  return (
    <nav>
      {segments.map((segment, index) => (
        <span key={index}>
          {' > '}
          {segment}
        </span>
      ))}
    </nav>
  )
}
```

```jsx filename="app/ui/breadcrumbs.js" switcher
'use client'

import { usePathname } from 'next/navigation'

// 단순화된 탐색경로 논리
export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/')

  return (
    <nav>
      {segments.map((segment, index) => (
        <span key={index}>
          {' > '}
          {segment}
        </span>
      ))}
    </nav>
  )
}
```

```tsx filename="app/docs/layout.tsx" switcher
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'

export default function Layout({ children }) {
  return (
    <>
      <Breadcrumbs />
      <main>{children}</main>
    </>
  )
}
```

```jsx filename="app/docs/layout.js" switcher
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'

export default function Layout({ children }) {
  return (
    <>
      <Breadcrumbs />
      <main>{children}</main>
    </>
  )
}
```

<a id="interaction-with-loadingjs"></a>
#### `loading.js`와의 상호 작용

`loading.js`는 [컴포넌트 계층](../../1-getting-started/project-structure.md#component-hierarchy)에서 `layout.js` 아래에 있기 때문에 레이아웃 자체에서 캐시되지 않은 데이터 액세스 또는 런타임 데이터 액세스에 대한 대체를 표시할 수 없다(예: [`cookies()`](../3.3-functions/cookies.md), [`headers()`](../3.3-functions/headers.md) 호출). 캐시되지 않은 가져오기를 수행한다.

동작은 [Cache Components](../../1-getting-started/caching.md) 활성화 여부에 따라 달라진다.

- **Cache Components 없음:** 레이아웃 렌더링이 완료될 때까지 탐색이 차단되며 `loading.js` 대체가 표시되지 않는다.
- **Cache Components 포함:**`loading.js`는 특수 prefetch 마커가 아닌 일반 `<Suspense>` 경계로 처리된다. 레이아웃의 캐시되지 않은 데이터 또는 런타임 데이터 액세스는 자체 `<Suspense>` 경계에 명시적으로 래핑되어야 한다. 그렇지 않으면 Next.js가 빌드 시점 오류를 안내한다. static shell은 즉시 스트리밍되고, 캐시되지 않은 콘텐츠는 확인되는 대로 교체된다.

두 경우 모두 즉각적인 탐색을 보장하려면 다음 중 하나를 수행한다.

- 폴백을 사용하여 자체 `<Suspense>` 경계에 있는 레이아웃의 런타임 데이터 액세스를 래핑한다.
- `layout.js`에서 가져오는 캐시되지 않은 데이터를 `loading.js`가 대체를 표시할 수 있는 `page.js`로 이동한다.

```tsx filename="app/dashboard/layout.tsx" switcher highlight={8-10}
import { Suspense } from 'react'
import { NavSkeleton } from './nav-skeleton'
import { DashboardNav } from './dashboard-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <DashboardNav />
      </Suspense>
      <main>{children}</main>
    </>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher highlight={8-10}
import { Suspense } from 'react'
import { NavSkeleton } from './nav-skeleton'
import { DashboardNav } from './dashboard-nav'

export default function Layout({ children }) {
  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <DashboardNav />
      </Suspense>
      <main>{children}</main>
    </>
  )
}
```

<a id="fetching-data"></a>
#### 데이터 가져오기

레이아웃은 데이터를 `children`로 전달할 수 없다. 그러나 경로에서 동일한 데이터를 두 번 이상 가져올 수 있으며 React [`cache`](https://react.dev/reference/react/cache)를 사용하여 성능에 영향을 주지 않고 요청의 중복을 제거할 수 있다.

또는 Next.js에서 [`fetch`](../3.3-functions/fetch.md)를 사용하면 요청이 자동으로 중복 제거된다.

```tsx filename="app/lib/data.ts" switcher
export async function getUser(id: string) {
  const res = await fetch(`https://.../users/${id}`)
  return res.json()
}
```

```tsx filename="app/dashboard/layout.tsx" switcher
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Layout({ children }) {
  const user = await getUser('1')

  return (
    <>
      <nav>

        <UserName user={user.name} />
      </nav>
      {children}
    </>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Layout({ children }) {
  const user = await getUser('1')

  return (
    <>
      <nav>

        <UserName user={user.name} />
      </nav>
      {children}
    </>
  )
}
```

```tsx filename="app/dashboard/page.tsx" switcher
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Page() {
  const user = await getUser('1')

  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Page() {
  const user = await getUser('1')

  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  )
}
```

<a id="accessing-child-segments"></a>
#### 하위 세그먼트에 액세스

레이아웃은 자체 아래의 라우트 세그먼트에 접근할 수 없다. 모든 라우트 세그먼트에 액세스하려면 Client Component에서 [`useSelectedLayoutSegment`](../3.3-functions/use-selected-layout-segment.md) 또는 [`useSelectedLayoutSegments`](../3.3-functions/use-selected-layout-segments.md)를 사용할 수 있다.

```tsx filename="app/ui/nav-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function NavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // 링크 활성 여부에 따라 스타일 변경
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/ui/nav-link.js" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function NavLinks({ slug, children }) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```tsx filename="app/blog/layout.tsx" switcher
import { NavLink } from './nav-link'
import getPosts from './get-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <NavLink slug={post.slug}>{post.title}</NavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

```jsx filename="app/blog/layout.js" switcher
import { NavLink } from './nav-link'
import getPosts from './get-posts'

export default async function Layout({ children }) {
  const featuredPosts = await getPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <NavLink slug={post.slug}>{post.title}</NavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

<a id="examples"></a>
### 예제

<a id="metadata"></a>
#### 메타데이터

[`metadata` 객체](../3.3-functions/generate-metadata.md#the-metadata-object) 또는 [`generateMetadata` 함수](../3.3-functions/generate-metadata.md#generatemetadata-function)를 사용하여 `title` 및 `meta`와 같은 `<head>`HTML 요소를 수정할 수 있다.

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return '...'
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: 'Next.js',
}

export default function Layout({ children }) {
  return '...'
}
```

> **알아두면 좋은 점**: `<title>` 및 `<meta>`와 같은 `<head>` 태그를 루트 레이아웃에 수동으로 추가하면 **안 된다**. 대신 `<head>` 요소 스트리밍 및 중복 제거와 같은 고급 요구 사항을 자동으로 처리하는 [메타데이터 API](../3.3-functions/generate-metadata.md)를 사용한다.

<a id="active-nav-links"></a>
#### 활성 탐색 링크

[`usePathname`](../3.3-functions/use-pathname.md) 후크를 사용하여 탐색 링크가 활성화되어 있는지 확인할 수 있다.

`usePathname`는 클라이언트 후크이므로 레이아웃으로 가져올 수 있는 Client Component로 탐색 링크를 추출해야 한다.

```tsx filename="app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

```jsx filename="app/ui/nav-links.js" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

```tsx filename="app/layout.tsx" switcher
import { NavLinks } from '@/app/ui/nav-links'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavLinks />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { NavLinks } from '@/app/ui/nav-links'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavLinks />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

<a id="displaying-content-based-on-params"></a>
#### `params`를 기반으로 콘텐츠 표시

[다이나믹 라우트 세그먼트](dynamic-routes.md)를 사용하면 `params` prop을 기반으로 특정 콘텐츠를 표시하거나 가져올 수 있다.

```tsx filename="app/dashboard/layout.tsx" switcher
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params

  return (
    <section>
      <header>
        <h1>Welcome to {team}'s Dashboard</h1>
      </header>
      <main>{children}</main>
    </section>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
export default async function DashboardLayout({ children, params }) {
  const { team } = await params

  return (
    <section>
      <header>
        <h1>Welcome to {team}'s Dashboard</h1>
      </header>
      <main>{children}</main>
    </section>
  )
}
```

<a id="reading-params-in-client-components"></a>
#### Client Component에서 `params` 읽기

Client Component(`async` 일 수 없음)에서 `params`를 사용하려면 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용하여 Promise를 읽을 수 있다.

```tsx filename="app/page.tsx" switcher
'use client'

import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
}
```

```js filename="app/page.js" switcher
'use client'

import { use } from 'react'

export default function Page({ params }) {
  const { slug } = use(params)
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| ------------ | --------------------------------------------------------------------------------------------- |
| `v15.0.0-RC` | `params`는 이제 Promise이다. [codemod](../../2-guides/2.64-upgrading/codemods.md#150)를 사용할 수 있다. |
| `v13.0.0` | `layout`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 대시보드 공통 내비게이션을 `layout.tsx`에 두고 page 이동 뒤에도 입력 상태가 유지되는지 확인한다.
- 다이나믹 `[team]` layout에서 `await params`와 `LayoutProps` 타입 추론을 비교한다.
- layout의 runtime 데이터 접근을 자체 `<Suspense>`로 감싼 경우와 그렇지 않은 경우의 내비게이션을 비교한다.

## 연습 문제

1. root layout이 반드시 반환해야 하는 태그는?
   - A. `<head>`와 `<main>`
   - B. `<html>`과 `<body>`
   - C. `<title>`과 `<meta>`

<details><summary>정답 보기</summary>

정답: B. root layout은 `<html>`과 `<body>`를 정의해야 한다.
</details>

2. 내비게이션 뒤 최신 query string을 읽는 적절한 방법은?
   - A. layout의 `searchParams` prop
   - B. Client Component의 `useSearchParams`
   - C. raw Request prop

<details><summary>정답 보기</summary>

정답: B. layout은 재렌더링되지 않으므로 Client Component에서 훅을 사용한다.
</details>

## 챕터 요약

- `layout.js`는 세그먼트의 공유 UI와 상태를 보존한다.
- root layout은 필수이며 `<html>`과 `<body>`를 정의한다.
- `params`는 Promise이고 `LayoutProps`로 타입을 생성할 수 있다.
- 최신 pathname과 query params는 Client Component에서 읽는다.
- layout의 runtime 데이터는 자체 Suspense boundary로 감싼다.
