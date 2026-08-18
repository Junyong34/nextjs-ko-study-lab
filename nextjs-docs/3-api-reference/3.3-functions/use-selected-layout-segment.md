# useSelectedLayoutSegment

- 공식 문서: [useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md)에서 해당 레이아웃의 **한 단계 아래(one level below)** 활성 라우트 세그먼트를 읽는 `useSelectedLayoutSegment` 훅의 역할을 이해한다.
- 탭이나 사이드바 내비게이션 UI에서 활성 세그먼트에 따라 동적으로 스타일을 적용하는 방법을 습득한다.
- [Parallel Routes](../3.1-file-conventions/parallel-routes.md) 슬롯(`parallelRoutesKey`) 및 Catch-all 라우트에서의 반환값 특성을 설명한다.
- `cacheComponents` 활성화 시 prerender 시점에 세그먼트가 확정되지 않는 다이나믹 라우트에서의 `Suspense` 경계 필요성을 이해한다.

## 핵심 개념 및 설명

`useSelectedLayoutSegment`는 이 훅이 호출된 레이아웃 기준 **한 단계 바로 아래**에 위치한 활성 라우트 세그먼트를 읽을 수 있는 **Client Component** 전용 훅이다.

상위 레이아웃 내에서 하위 라우트 세그먼트의 활성화 상태에 따라 탭 스타일이나 브레드크럼을 변경할 때 유용하다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>현재 활성 세그먼트: {segment}</p>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>현재 활성 세그먼트: {segment}</p>
}
```

> **알아두면 좋은 점**:
>
> - `useSelectedLayoutSegment`는 Client Component 훅이고 레이아웃은 기본적으로 Server Component이므로, 일반적으로 레이아웃 내부로 임포트되는 별도의 Client Component 안에서 호출한다.
> - 이 훅은 바로 한 단계 아래의 세그먼트만 반환한다. 모든 하위 활성 세그먼트 트리를 배열로 가져오려면 [`useSelectedLayoutSegments`](./use-selected-layout-segments.md)를 사용한다.
> - [Catch-all 라우트](../3.1-file-conventions/dynamic-routes.md#catch-all-segments)(`[...slug]`)의 경우 매칭된 세그먼트들이 슬래시(`/`)로 결합된 단일 문자열(예: `'a/b/c'`)로 반환된다.

### 매개변수 (Parameters)

```tsx
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment`는 선택적으로 `parallelRoutesKey` 문자열을 인자로 받을 수 있다. 이를 통해 특정 [Parallel Routes](../3.1-file-conventions/parallel-routes.md) 슬롯(`@slot`) 내부의 활성 세그먼트를 읽을 수 있다.

### 반환값 (Returns)

활성 세그먼트 문자열을 반환하며, 한 단계 아래에 활성 세그먼트가 없으면 `null`을 반환한다.

| 레이아웃 위치 | 방문 URL | 반환 세그먼트 |
|---|---|---|
| `app/layout.js` | `/` | `null` |
| `app/layout.js` | `/dashboard` | `'dashboard'` |
| `app/dashboard/layout.js` | `/dashboard` | `null` |
| `app/dashboard/layout.js` | `/dashboard/settings` | `'settings'` |
| `app/dashboard/layout.js` | `/dashboard/analytics` | `'analytics'` |
| `app/dashboard/layout.js` | `/dashboard/analytics/monthly` | `'analytics'` |

Catch-all 라우트(`[...slug]`)의 경우:

| 레이아웃 위치 | 방문 URL | 반환 세그먼트 |
|---|---|---|
| `app/blog/layout.js` | `/blog/a/b/c` | `'a/b/c'` |

### 동작 방식 (Behavior)

#### Cache Components 및 `Suspense` 경계

[`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화되어 있을 때, `useSelectedLayoutSegment`는 prerender 중에 세그먼트를 확인할 수 있는지 여부에 따라 [`Suspense`](https://react.dev/reference/react/Suspense) 경계를 요구할 수 있다.

- **정적 라우트 및 `generateStaticParams`가 적용된 라우트**: 빌드 시점에 세그먼트를 확정할 수 있으므로 `Suspense` 경계 없이 서버에서 바로 해석된다.
- **알 수 없는 다이나믹 fallback params 라우트**: prerender 시점에 세그먼트를 알 수 없어 컴포넌트가 suspend된다. 레이아웃의 나머지 정적 영역을 prerender 상태로 보존하려면 해당 훅을 사용하는 컴포넌트를 fallback이 지정된 `Suspense` 경계로 감싸야 한다.

### 예제

#### 활성 링크(Active Link) 컴포넌트 구현

블로그 사이드바나 대시보드 탭 메뉴에서 현재 활성화된 글/메뉴를 강조 표시하는 컴포넌트를 구성할 수 있다.

```tsx filename="app/blog/blog-nav-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  // `/blog/hello-world`로 이동하면 segment는 'hello-world'가 됨
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/blog/blog-nav-link.js" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function BlogNavLink({ slug, children }) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}
    >
      {children}
    </Link>
  )
}
```

이 Client Component를 Server Component인 상위 레이아웃에서 임포트하여 사용한다:

```tsx filename="app/blog/layout.tsx" switcher
import BlogNavLink from './blog-nav-link'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const posts = [
    { id: '1', slug: 'nextjs-16', title: 'Next.js 16 업데이트' },
    { id: '2', slug: 'app-router', title: 'App Router 심화' },
  ]

  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">
        {posts.map((post) => (
          <div key={post.id}>
            <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
```

```jsx filename="app/blog/layout.js" switcher
import BlogNavLink from './blog-nav-link'

export default function BlogLayout({ children }) {
  const posts = [
    { id: '1', slug: 'nextjs-16', title: 'Next.js 16 업데이트' },
    { id: '2', slug: 'app-router', title: 'App Router 심화' },
  ]

  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">
        {posts.map((post) => (
          <div key={post.id}>
            <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `useSelectedLayoutSegment` 도입 |

## 예제 및 데모 설계

- 대시보드 레이아웃(`app/dashboard/layout.tsx`) 하위에서 `/dashboard/settings`, `/dashboard/analytics` 이동 시 활성 탭이 하이라이트되는 데모를 구성한다.
- `/dashboard` 최상위 인덱스 페이지 접근 시 `useSelectedLayoutSegment()`가 `null`을 반환하는지 확인한다.
- Parallel Routes 슬롯(`@modal`, `@analytics`)에서 `parallelRoutesKey`를 넘겨 해당 슬롯 내부 세그먼트를 읽어오는 시나리오를 설계한다.

## 연습 문제

1. 레이아웃 `app/dashboard/layout.js` 내부에서 호출된 `useSelectedLayoutSegment()`가 URL `/dashboard/analytics/monthly`에 접근했을 때 반환하는 값은?
   - A. `'dashboard'`
   - B. `'analytics'`
   - C. `'monthly'`
   - D. `['analytics', 'monthly']`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `useSelectedLayoutSegment()`는 해당 레이아웃 기준 바로 **한 단계 아래**의 세그먼트(`analytics`)만 반환한다.
</details>

2. 레이아웃 `app/blog/layout.js` 하위에 Catch-all 라우트 `app/blog/[...slug]/page.js`가 있고 URL `/blog/tech/next/react`에 접근했을 때 반환값은?
   - A. `['tech', 'next', 'react']`
   - B. `'tech/next/react'`
   - C. `'tech'`
   - D. `null`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Catch-all 라우트의 경우 일치하는 모든 세그먼트가 슬래시로 결합된 단일 문자열(`'tech/next/react'`)로 반환된다.
</details>

## 챕터 요약

- `useSelectedLayoutSegment`는 호출된 레이아웃 기준 한 단계 아래의 활성 라우트 세그먼트 문자열을 반환한다.
- 하위 세그먼트가 없는 경우 `null`을 반환하며, 탭 내비게이션 활성 상태 표시 등에 주로 활용된다.
- Catch-all 세그먼트는 경로가 슬래시로 결합된 단일 문자열로 반환된다.
- Parallel Routes 슬롯의 활성 세그먼트는 `parallelRoutesKey` 인자를 통해 조회할 수 있다.
- Server Component인 레이아웃에 직접 넣지 않고, 별도의 Client Component로 분리하여 레이아웃에 포함시키는 구조를 사용한다.
