# useSelectedLayoutSegments

- 공식 문서: [useSelectedLayoutSegments](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md)에서 해당 레이아웃 하위의 **모든 활성 라우트 세그먼트 배열**을 읽는 `useSelectedLayoutSegments` 훅의 역할을 이해한다.
- 브레드크럼(Breadcrumbs)과 같은 다계층 내비게이션 UI를 구현할 때 세그먼트 목록을 활용하는 방법을 습득한다.
- [Route Groups](../3.1-file-conventions/route-groups.md) 괄호 표기(`(group)`) 및 Catch-all 라우트(`[...slug]`)가 배열에 포함되는 형태를 이해하고 필터링 처리한다.
- [Parallel Routes](../3.1-file-conventions/parallel-routes.md) 슬롯(`parallelRoutesKey`) 인자 사용법과 `Suspense` 경계 적용 원리를 설명한다.

## 핵심 개념 및 설명

`useSelectedLayoutSegments`는 이 훅이 호출된 레이아웃 **아래의 모든 활성 라우트 세그먼트 목록**을 문자열 배열(`string[]`)로 읽을 수 있는 **Client Component** 전용 훅이다.

루트 레이아웃이나 상위 레이아웃에서 하위 경로 전체의 구조를 파악하여 브레드크럼(경로 이동 경로 표시)을 생성할 때 매우 유용하다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

> **알아두면 좋은 점**:
>
> - `useSelectedLayoutSegments`는 Client Component 훅이고 레이아웃은 기본적으로 Server Component이므로, 일반적으로 레이아웃에 임포트되는 별도의 Client Component 내부에서 호출한다.
> - 반환되는 세그먼트 배열에는 [Route Groups](../3.1-file-conventions/route-groups.md) 세그먼트(예: `(marketing)`)가 포함될 수 있다. UI에 노출하고 싶지 않다면 `segments.filter(segment => !segment.startsWith('('))` 형태로 제거한다.
> - Catch-all 라우트(`[...slug]`)의 경우 매칭된 경로들이 배열 내에 개별 원소가 아닌 결합된 단일 문자열(`'a/b/c'`)로 반환된다. 예를 들어 `app/layout.js`에서 `/blog/a/b/c` 방문 시 `['blog', 'a/b/c']`가 반환된다.

### 매개변수 (Parameters)

```tsx
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

`useSelectedLayoutSegments`는 선택적으로 `parallelRoutesKey` 문자열을 인자로 전달받아 특정 [Parallel Routes](../3.1-file-conventions/parallel-routes.md) 슬롯 내부의 하위 세그먼트 목록을 읽을 수 있다.

### 반환값 (Returns)

호출된 레이아웃 하위의 활성 세그먼트들이 순서대로 담긴 문자열 배열(`string[]`)을 반환한다. 하위 세그먼트가 없으면 빈 배열(`[]`)을 반환한다.

| 레이아웃 위치 | 방문 URL | 반환 세그먼트 배열 |
|---|---|---|
| `app/layout.js` | `/` | `[]` |
| `app/layout.js` | `/dashboard` | `['dashboard']` |
| `app/layout.js` | `/dashboard/settings` | `['dashboard', 'settings']` |
| `app/dashboard/layout.js` | `/dashboard` | `[]` |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']` |

Catch-all 라우트(`[...slug]`)의 경우:

| 레이아웃 위치 | 방문 URL | 반환 세그먼트 배열 |
|---|---|---|
| `app/layout.js` | `/blog/a/b/c` | `['blog', 'a/b/c']` |
| `app/blog/layout.js` | `/blog/a/b/c` | `['a/b/c']` |

### 동작 방식 (Behavior)

#### Cache Components 및 `Suspense` 경계

[`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화되어 있을 때:

- 정적 라우트나 `generateStaticParams`로 확정된 라우트는 서버에서 즉시 계산되어 `Suspense` 경계가 필요 없다.
- 빌드 시점에 결정되지 않는 fallback params가 포함된 경우 `useSelectedLayoutSegments`가 suspend되므로, 상위에 fallback이 지정된 `<Suspense>` 경계를 배치해야 레이아웃의 나머지 영역이 온전히 prerender된다.

### 예제

#### 브레드크럼(Breadcrumbs) 네비게이션 구현

상위 레이아웃에서 현재 경로의 모든 세그먼트를 순회하며 링크가 포함된 브레드크럼 목록을 동적으로 구성할 수 있다.

```tsx filename="app/components/breadcrumbs.tsx" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

export function Breadcrumbs() {
  const segments = useSelectedLayoutSegments()
  // 라우트 그룹((marketing), (shop) 등) 제외 필터링
  const filteredSegments = segments.filter((s) => !s.startsWith('('))

  return (
    <nav aria-label="Breadcrumb" className="p-4 bg-gray-50 border-b">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:underline">홈</Link>
        </li>
        {filteredSegments.map((segment, index) => {
          const href = `/${filteredSegments.slice(0, index + 1).join('/')}`
          const isLast = index === filteredSegments.length - 1

          return (
            <li key={href} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-gray-900">{segment}</span>
              ) : (
                <Link href={href} className="hover:underline">{segment}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

```jsx filename="app/components/breadcrumbs.js" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

export function Breadcrumbs() {
  const segments = useSelectedLayoutSegments()
  const filteredSegments = segments.filter((s) => !s.startsWith('('))

  return (
    <nav aria-label="Breadcrumb" className="p-4 bg-gray-50 border-b">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:underline">홈</Link>
        </li>
        {filteredSegments.map((segment, index) => {
          const href = `/${filteredSegments.slice(0, index + 1).join('/')}`
          const isLast = index === filteredSegments.length - 1

          return (
            <li key={href} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-gray-900">{segment}</span>
              ) : (
                <Link href={href} className="hover:underline">{segment}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

이 컴포넌트를 루트 레이아웃에 배치한다:

```tsx filename="app/layout.tsx" switcher
import { Breadcrumbs } from './components/breadcrumbs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Breadcrumbs />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `useSelectedLayoutSegments` 도입 |

## 예제 및 데모 설계

- 중첩 라우트(`/dashboard/analytics/users/retention`)에서 루트 레이아웃과 서브 레이아웃 각각에서 반환되는 세그먼트 배열의 길이 및 구성을 비교하는 데모를 설계한다.
- `(marketing)`과 같은 Route Groups가 포함된 경로에서 필터링 전후의 배열 출력을 확인한다.
- `app/layout.tsx`에서 브레드크럼 UI를 렌더링하고 각 경로 클릭 시 올바른 URL로 내비게이션되는지 검증한다.

## 연습 문제

1. 루트 레이아웃 `app/layout.js`에서 `useSelectedLayoutSegments()`를 호출했을 때, 브라우저가 `/dashboard/settings/profile`에 접근 중이라면 반환값은?
   - A. `'profile'`
   - B. `['dashboard', 'settings', 'profile']`
   - C. `['settings', 'profile']`
   - D. `['dashboard/settings/profile']`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 루트 레이아웃 기준 하위의 모든 활성 세그먼트가 배열 형태인 `['dashboard', 'settings', 'profile']`로 반환된다.
</details>

2. `useSelectedLayoutSegments` 반환값에서 Route Groups(예: `(admin)`)를 브레드크럼 UI에서 제외하고자 할 때 권장되는 방식은?
   - A. `next.config.js`에서 라우트 그룹 비활성화
   - B. `segments.filter(segment => !segment.startsWith('('))`와 같이 배열 필터링 적용
   - C. `useSelectedLayoutSegments({ excludeGroups: true })` 옵션 전달
   - D. Server Component로만 라우트 그룹 감싸기

<details><summary>정답 보기</summary>

정답: **B**  
해설: 반환된 세그먼트 배열에 포함된 Route Groups 괄호 명칭은 자바스크립트의 `filter` 메서드를 사용해 간편하게 걸러낼 수 있다.
</details>

## 챕터 요약

- `useSelectedLayoutSegments`는 호출된 레이아웃 하위의 모든 활성 라우트 세그먼트를 문자열 배열로 반환하는 Client Component 훅이다.
- 하위 세그먼트가 존재하지 않으면 빈 배열(`[]`)을 반환한다.
- 다계층 브레드크럼(Breadcrumbs) 컴포넌트 구현에 핵심적으로 활용된다.
- Route Groups(`(group)`) 이름도 배열에 포함되므로 UI 필요에 따라 `filter`로 제외 처리할 수 있다.
- Catch-all 세그먼트는 배열 내 하나의 원소에 슬래시로 묶인 결합 문자열로 반환된다.
