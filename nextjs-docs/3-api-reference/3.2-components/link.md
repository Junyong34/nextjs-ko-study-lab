# Link Component

- 공식 문서: [Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- 상위 메뉴: [Components](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `<Link>` 컴포넌트가 HTML `<a>` 태그를 확장해 제공하는 [프리페치](../../1-getting-started/linking-and-navigating.md)와 클라이언트 사이드 내비게이션의 동작 원리를 설명한다.
- `href`, `replace`, `scroll`, `prefetch`, `onNavigate`, `transitionTypes` props를 상황에 맞게 구분해 사용한다.
- `prefetch` 값(`"auto"`/`null`, `true`, `false`)에 따른 프리페치 범위 차이와 Partial Prefetching 활성화 시 동작 변화를 이해한다.
- `usePathname`, Proxy 재작성(rewrite) 시나리오에서 `<Link>`를 안전하게 조합하는 방법을 익힌다.

## 핵심 개념 및 설명

### Link 컴포넌트란

`<Link>`는 HTML `<a>` 엘리먼트를 확장해 라우트 간 [프리페치](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching)와 클라이언트 사이드 내비게이션을 제공하는 React 컴포넌트다. Next.js에서 라우트 사이를 이동하는 기본적인 방법이다.

기본 사용법:

```tsx
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

### Props

`<Link>` 컴포넌트에 전달할 수 있는 props는 다음과 같다.

| Prop | 예시 | 타입 | 필수 여부 |
| --- | --- | --- | --- |
| href | href="/dashboard" | String 또는 Object | Yes |
| replace | replace={false} | Boolean | - |
| scroll | scroll={false} | Boolean | - |
| prefetch | prefetch={false} | Boolean 또는 null | - |
| onNavigate | onNavigate={(e) => {}} | Function | - |
| transitionTypes | transitionTypes={['slide-in']} | string[] | - |

> **알아두면 좋은 점**: `className`이나 `target="_blank"` 같은 `<a>` 태그 속성도 `<Link>`에 props로 전달할 수 있으며, 그대로 내부의 `<a>` 엘리먼트에 전달된다.

#### href (필수)

이동할 경로 또는 URL이다.

```tsx
import Link from 'next/link'

// /about?name=test 로 이동한다
export default function Page() {
  return (
    <Link
      href={{
        pathname: '/about',
        query: { name: 'test' },
      }}
    >
      About
    </Link>
  )
}
```

#### replace

**기본값은 `false`다.** `true`로 설정하면 `next/link`는 새 URL을 [브라우저 히스토리](https://developer.mozilla.org/docs/Web/API/History_API) 스택에 추가하는 대신 현재 히스토리 상태를 교체한다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

#### scroll

**기본값은 `true`다.** Next.js에서 `<Link>`의 기본 스크롤 동작은 브라우저의 뒤로/앞으로 가기 탐색 방식과 비슷하게 **스크롤 위치를 유지하는 것**이다. 새 [Page](../3.1-file-conventions/page.md)로 이동할 때, 그 Page가 뷰포트 안에 보이는 상태라면 스크롤 위치는 그대로 유지된다. 다만 Page가 뷰포트 안에 보이지 않는 상태라면 Next.js는 첫 Page 엘리먼트로 스크롤을 이동시킨다.

`scroll={false}`로 설정하면 Next.js는 첫 Page 엘리먼트로 스크롤을 이동시키려 하지 않는다.

> **알아두면 좋은 점**: Next.js는 스크롤 동작을 관리하기 전에 `scroll: false` 여부를 먼저 확인한다. 스크롤이 활성화돼 있다면 내비게이션과 관련된 DOM 노드를 찾아 각 최상위 엘리먼트를 검사한다. `sticky`나 `fixed`로 위치가 고정된 엘리먼트, `getBoundingClientRect`로 계산했을 때 보이지 않는 엘리먼트처럼 스크롤이 불가능하거나 렌더링된 HTML이 없는 엘리먼트는 모두 건너뛴다. 이후 뷰포트 안에서 보이는 스크롤 가능한 엘리먼트를 찾을 때까지 형제 엘리먼트를 계속 탐색한다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

#### prefetch

프리페치는 `<Link />` 컴포넌트가 사용자의 뷰포트에 들어올 때(처음 로드되거나 스크롤로 진입할 때) 일어난다. Next.js는 클라이언트 사이드 내비게이션 성능을 높이기 위해 `href`로 지정된 라우트와 그 데이터를 백그라운드에서 미리 불러온다. 프리페치된 데이터가 만료된 상태에서 사용자가 `<Link />`에 마우스를 올리면, Next.js는 다시 프리페치를 시도한다. **프리페치는 프로덕션 환경에서만 활성화된다.**

`prefetch` prop에는 다음 값을 전달할 수 있다.

- **`"auto"` 또는 `null`(기본값)**: 라우트가 정적인지 동적인지에 따라 프리페치 동작이 달라진다. 정적 라우트는 모든 데이터를 포함해 전체 라우트를 프리페치한다. 동적 라우트는 [`loading.js`](../3.1-file-conventions/loading.md) 바운더리가 있는 가장 가까운 세그먼트까지만 부분적으로 프리페치한다.
- **`true`**: 정적·동적 라우트 모두 전체 라우트를 프리페치한다. [Partial Prefetching](../3.5-config/3.5.1-next-config-js/partialPrefetching.md)이 활성화된 경우, 프리페치에는 [App Shell](https://nextjs.org/docs/app/glossary#app-shell)과 링크의 URL 데이터에 의존하는 캐시된 콘텐츠가 포함된다. 자세한 내용은 [Optimizing prefetching](../../2-guides/optimizing-prefetching.md)을 참고한다.
- **`false`**: 뷰포트 진입 시와 마우스 오버 시 모두 프리페치가 일어나지 않는다.

> **Partial Prefetching이 활성화된 경우**([`partialPrefetching: true`](../3.5-config/3.5.1-next-config-js/partialPrefetching.md)): 기본 동작이 달라진다. `auto`는 전체 페이지 대신 라우트별 [App Shell](https://nextjs.org/docs/app/glossary#app-shell)(라우트의 정적·캐시된 콘텐츠)을 프리페치한다. 전체 동작 변화는 [Adopting Partial Prefetching](../../2-guides/adopting-partial-prefetching.md)을 참고한다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

#### onNavigate

클라이언트 사이드 내비게이션 중에 호출되는 이벤트 핸들러다. 핸들러는 `preventDefault()` 메서드를 포함한 이벤트 객체를 받으므로, 필요하다면 내비게이션을 취소할 수 있다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // SPA 내비게이션 중에만 실행된다
        console.log('Navigating...')

        // 필요하다면 내비게이션을 막을 수 있다
        // e.preventDefault()
      }}
    >
      Dashboard
    </Link>
  )
}
```

> **알아두면 좋은 점**: `onClick`과 `onNavigate`는 비슷해 보이지만 목적이 다르다. `onClick`은 모든 클릭 이벤트에서 실행되지만, `onNavigate`는 클라이언트 사이드 내비게이션이 일어날 때만 실행된다. 주요 차이는 다음과 같다.
>
> - 수정 키(`Ctrl`/`Cmd` + 클릭)를 사용하면 `onClick`은 실행되지만 `onNavigate`는 실행되지 않는다. Next.js가 새 탭을 여는 기본 내비게이션을 막지 않기 때문이다.
> - 외부 URL은 클라이언트 사이드·동일 출처 내비게이션에만 해당하는 `onNavigate`를 실행시키지 않는다.
> - `download` 속성이 있는 링크는 `onClick`과는 동작하지만 `onNavigate`와는 동작하지 않는다. 브라우저가 해당 링크 URL을 다운로드로 처리하기 때문이다.

#### transitionTypes

내비게이션에 적용할 전환 타입(transition type) 목록이다. 이 타입들은 내비게이션 전환 내부에서 [`React.addTransitionType`](https://react.dev/reference/react/addTransitionType)에 전달되며, [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) 컴포넌트가 내비게이션 종류에 따라 다른 애니메이션을 적용할 수 있게 한다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" transitionTypes={['slide-in']}>
      About
    </Link>
  )
}
```

### 사용 예시

`<Link>` 컴포넌트를 다양한 상황에서 어떻게 사용하는지 살펴본다.

#### 동적 라우트 세그먼트로 링크하기

[동적 세그먼트](../3.1-file-conventions/page.md)로 링크할 때는 [템플릿 리터럴과 문자열 삽입](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)을 사용해 링크 목록을 생성할 수 있다. 예를 들어 블로그 글 목록을 생성하는 경우다.

```tsx
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

#### 활성 링크 확인하기

[`usePathname()`](../3.3-functions/use-pathname.md)을 사용하면 링크가 활성 상태인지 확인할 수 있다. 예를 들어 현재 `pathname`이 링크의 `href`와 일치하는지 확인해 활성 링크에 클래스를 추가할 수 있다.

```tsx
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

#### id로 스크롤 이동하기

내비게이션 시 특정 `id`로 스크롤을 이동시키고 싶다면, URL 뒤에 `#` 해시 링크를 붙이거나 `href` prop에 해시 링크를 바로 전달하면 된다. `<Link>`가 `<a>` 엘리먼트로 렌더링되기 때문에 가능한 동작이다.

```tsx
<Link href="/dashboard#settings">Settings</Link>

// 출력 결과
<a href="/dashboard#settings">Settings</a>
```

> **알아두면 좋은 점**: 내비게이션 시 [Page](../3.1-file-conventions/page.md)가 뷰포트 안에 보이지 않는 상태라면 Next.js는 그 Page로 스크롤을 이동시킨다.

#### push 대신 URL 교체하기

`Link` 컴포넌트의 기본 동작은 새 URL을 `history` 스택에 `push`하는 것이다. 다음 예시처럼 `replace` prop을 사용하면 새 항목을 추가하지 않게 할 수 있다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" replace>
      About us
    </Link>
  )
}
```

#### 페이지 맨 위로 스크롤 이동 비활성화하기

Next.js에서 `<Link>`의 기본 스크롤 동작은 브라우저의 뒤로/앞으로 가기 탐색 방식과 비슷하게 **스크롤 위치를 유지하는 것**이다. 새 [Page](../3.1-file-conventions/page.md)로 이동할 때, 그 Page가 뷰포트 안에 보이는 상태라면 스크롤 위치는 그대로 유지된다.

다만 Page가 뷰포트 안에 보이지 않는 상태라면 Next.js는 첫 Page 엘리먼트로 스크롤을 이동시킨다. 이 동작을 비활성화하려면 `<Link>` 컴포넌트에 `scroll={false}`를, 또는 `router.push()`나 `router.replace()`에 `scroll: false`를 전달한다.

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/#hashid" scroll={false}>
      맨 위로 스크롤 이동을 비활성화한다
    </Link>
  )
}
```

`router.push()`나 `router.replace()`를 사용하는 경우:

```tsx
// useRouter
import { useRouter } from 'next/navigation'

const router = useRouter()

router.push('/dashboard', { scroll: false })
```

#### sticky 헤더와 스크롤 오프셋

Next.js는 스크롤 대상을 찾을 때 `sticky`나 `fixed`로 위치가 고정된 엘리먼트를 건너뛰기 때문에, 내비게이션 이후 콘텐츠가 sticky 헤더 뒤에 가려질 수 있다. 예를 들어 레이아웃에 sticky 헤더가 있는 경우다.

```tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 h-16 bg-white">
          {/* Navigation */}
        </header>
        {children}
      </body>
    </html>
  )
}
```

스크롤 컨테이너에 [`scroll-padding-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top)을 사용해 헤더 높이를 보정할 수 있다.

```css
html {
  scroll-padding-top: 64px; /* sticky 헤더의 높이와 맞춘다 */
}
```

이 값은 스크롤 기반 위치 지정을 오프셋하는 브라우저 CSS 속성이다. Next.js가 네이티브 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) API를 사용하는 모든 경우(해시 프래그먼트(`#id`) 내비게이션 포함)에 적용된다. 전역 오프셋을 설정하는 대신, 개별 대상 엘리먼트에 [`scroll-margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top)을 사용할 수도 있다.

#### Proxy에서 링크 프리페치하기

인증이나 사용자를 다른 페이지로 재작성(rewrite)하는 그 외의 목적으로 [Proxy](../3.1-file-conventions/proxy.md)를 사용하는 경우가 많다. Proxy로 재작성된 링크를 `<Link />` 컴포넌트가 올바르게 프리페치하려면, 표시할 URL과 프리페치할 URL을 모두 Next.js에 알려줘야 한다. Proxy에 불필요한 요청을 보내지 않고 올바른 프리페치 라우트를 알기 위해 필요한 절차다.

예를 들어 인증된 사용자와 방문자 뷰가 모두 있는 `/dashboard` 라우트를 제공하려면, Proxy에서 다음과 같이 올바른 페이지로 사용자를 리다이렉트할 수 있다.

```tsx
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const nextUrl = request.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (request.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', request.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', request.url))
    }
  }
}
```

이 경우 `<Link />` 컴포넌트에서는 다음 코드를 사용해야 한다.

```tsx
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // 사용자 정의 인증 훅

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

#### 내비게이션 막기

폼에 저장하지 않은 변경 사항이 있는 경우처럼 특정 조건에서 내비게이션을 막고 싶다면 `onNavigate` prop을 사용할 수 있다. 폼을 편집하는 동안 앱의 모든 링크에서 내비게이션을 막는 것처럼 여러 컴포넌트에 걸쳐 내비게이션 차단이 필요하다면, React Context로 이 차단 상태를 깔끔하게 공유할 수 있다. 먼저 내비게이션 차단 상태를 추적하는 Context를 만든다.

```tsx
'use client'

import { createContext, useState, useContext } from 'react'

interface NavigationBlockerContextType {
  isBlocked: boolean
  setIsBlocked: (isBlocked: boolean) => void
}

export const NavigationBlockerContext =
  createContext<NavigationBlockerContextType>({
    isBlocked: false,
    setIsBlocked: () => {},
  })

export function NavigationBlockerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBlocked, setIsBlocked] = useState(false)

  return (
    <NavigationBlockerContext.Provider value={{ isBlocked, setIsBlocked }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
```

Context를 사용하는 폼 컴포넌트를 만든다.

```tsx
'use client'

import { useNavigationBlocker } from '../contexts/navigation-blocker'

export default function Form() {
  const { setIsBlocked } = useNavigationBlocker()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setIsBlocked(false)
      }}
      onChange={() => setIsBlocked(true)}
    >
      <input type="text" name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

내비게이션을 막는 커스텀 Link 컴포넌트를 만든다.

```tsx
'use client'

import Link from 'next/link'
import { useNavigationBlocker } from '../contexts/navigation-blocker'

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function CustomLink({ children, ...props }: CustomLinkProps) {
  const { isBlocked } = useNavigationBlocker()

  return (
    <Link
      onNavigate={(e) => {
        if (
          isBlocked &&
          !window.confirm('You have unsaved changes. Leave anyway?')
        ) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
```

내비게이션 컴포넌트를 만든다.

```tsx
'use client'

import { CustomLink as Link } from './custom-link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

마지막으로 루트 레이아웃을 `NavigationBlockerProvider`로 감싸고, 페이지에서 이 컴포넌트들을 사용한다.

```tsx
import { NavigationBlockerProvider } from './contexts/navigation-blocker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
      </body>
    </html>
  )
}
```

이제 `Nav`와 `Form` 컴포넌트를 페이지에서 사용한다.

```tsx
import Nav from './components/nav'
import Form from './components/form'

export default function Page() {
  return (
    <div>
      <Nav />
      <main>
        <h1>Welcome to the Dashboard</h1>
        <Form />
      </main>
    </div>
  )
}
```

`CustomLink`를 사용해 다른 곳으로 이동하려는 사용자가 있고 폼에 저장하지 않은 변경 사항이 있다면, 나가기 전에 확인을 요청받는다.

### 버전 히스토리

| 버전 | 변경 사항 |
| --- | --- |
| v16.2.0 | `transitionTypes` prop이 추가되었다. |
| v15.4.0 | 기본 프리페치 동작의 별칭으로 `auto`가 추가되었다. |
| v15.3.0 | `onNavigate` API가 추가되었다. |
| v13.0.0 | 더 이상 자식 `<a>` 태그가 필요하지 않다. 코드베이스를 자동으로 갱신하는 codemod가 제공된다. |
| v10.0.0 | 동적 라우트를 가리키는 `href` props가 자동으로 해석되어 더 이상 `as` prop이 필요하지 않다. |
| v8.0.0 | 프리페치 성능이 개선되었다. |
| v1.0.0 | `next/link`가 도입되었다. |

## 예제 및 데모 설계

- Phase 2에서 정적 라우트와 동적 라우트를 오가는 내비게이션 메뉴를 구현한다.
- `prefetch` 값을 `"auto"`/`true`/`false`로 바꿔가며 네트워크 탭에서 프리페치 범위 차이를 관찰한다.
- `usePathname`으로 활성 링크를 표시하고, sticky 헤더와 `scroll-padding-top` 보정을 함께 적용한다.
- 저장하지 않은 폼 변경 사항이 있을 때 `onNavigate`로 내비게이션을 막는 예제를 구현한다.

## 연습 문제

1. `prefetch` prop을 지정하지 않았을 때(기본값 `"auto"`/`null`) 정적 라우트와 동적 라우트의 프리페치 범위 차이로 올바른 것은?

   <details><summary>정답 보기</summary>

   정적 라우트는 모든 데이터를 포함한 전체 라우트가 프리페치되고, 동적 라우트는 가장 가까운 `loading.js` 바운더리까지만 부분적으로 프리페치된다. 프리페치는 프로덕션 환경에서만 동작한다.

   </details>

2. `<Link href="/dashboard" scroll={false}>`로 설정했을 때 벌어지는 일은?

   <details><summary>정답 보기</summary>

   대상 Page가 뷰포트 안에 보이지 않더라도 Next.js가 첫 Page 엘리먼트로 스크롤을 이동시키지 않는다. 기본값(`scroll={true}`)에서는 Page가 보이지 않을 때 맨 위로 스크롤이 이동한다.

   </details>

3. Proxy에서 `/dashboard` 요청을 `/auth/dashboard` 또는 `/public/dashboard`로 재작성(rewrite)할 때, `<Link as="/dashboard" href={path}>`처럼 `as`와 `href`를 함께 쓰는 이유는?

   <details><summary>정답 보기</summary>

   사용자에게 보여줄 URL(`as="/dashboard"`)과 실제로 프리페치할 URL(`href={path}`)을 각각 Next.js에 알려줘야, Proxy에 불필요한 요청을 보내지 않고도 올바른 라우트를 프리페치할 수 있기 때문이다.

   </details>

## 챕터 요약

- `<Link>`는 `<a>` 태그를 확장해 프리페치와 클라이언트 사이드 내비게이션을 제공하는 Next.js의 기본 라우팅 컴포넌트다.
- `href`(필수), `replace`, `scroll`, `prefetch`, `onNavigate`, `transitionTypes` 6개 prop으로 이동 방식과 프리페치·스크롤 동작을 세밀하게 제어할 수 있다.
- `prefetch`는 `"auto"`/`null`(정적은 전체, 동적은 `loading.js` 바운더리까지), `true`(전체, Partial Prefetching 시 App Shell 포함), `false`(비활성화) 세 가지로 동작한다.
- 활성 링크 표시(`usePathname`), sticky 헤더 스크롤 보정(`scroll-padding-top`), Proxy 재작성 시 `as`+`href` 조합, `onNavigate` 기반 내비게이션 차단 등 실전 패턴을 다룬다.
- v13.0.0부터 자식 `<a>` 태그가 필요 없어졌고, v15.3.0의 `onNavigate`와 v16.2.0의 `transitionTypes`까지 계속 API가 확장되어 왔다.
