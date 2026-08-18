# usePathname

- 공식 문서: [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md)에서 현재 URL의 **pathname** 문자열을 읽는 `usePathname` 훅의 사용법을 익힌다.
- Server Component에서 URL을 직접 읽지 못하도록 제한한 설계 배경과 레이아웃 상태 보존 원리를 이해한다.
- `cacheComponents` 활성화 시 정적 라우트와 다이나믹 파라미터 환경에서 `Suspense` 경계가 필요한 조건을 설명한다.
- rewrites 또는 [Proxy](../3.1-file-conventions/proxy.md) 사용 시 발생할 수 있는 hydration mismatch 방지 패턴을 적용한다.

## 핵심 개념 및 설명

`usePathname`은 현재 URL의 **pathname**(경로명)을 읽을 수 있게 해주는 **Client Component** 전용 훅이다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>현재 경로명: {pathname}</p>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>현재 경로명: {pathname}</p>
}
```

`usePathname`은 의도적으로 Client Component 사용을 요구한다. Client Component는 성능 최적화를 저해하는 것이 아니라, [Server Component](../../1-getting-started/server-and-client-components.md) 아키텍처의 필수적인 구성 요소다.

예를 들어 `usePathname`을 사용하는 Client Component는 초기 페이지 로드 시 HTML로 렌더링된다. 이후 새로운 라우트로 이동할 때 이 컴포넌트를 서버에서 다시 가져올 필요 없이, 클라이언트 번들에 포함된 컴포넌트가 현재 상태에 맞게 재렌더링된다.

> **알아두면 좋은 점**:
>
> - Server Component에서 현재 URL을 직접 읽는 것은 지원되지 않는다. 이는 페이지 내비게이션 간에 레이아웃 상태를 보존하기 위해 의도된 설계다.
> - 정적으로 prerender되는 페이지에서 `next.config`의 [rewrites](../3.5-config/3.5.1-next-config-js/rewrites.md)나 [Proxy](../3.1-file-conventions/proxy.md)를 사용하는 경우, `usePathname()`으로 읽은 값이 서버 렌더링 시점과 클라이언트 라우팅 이후에 달라져 hydration mismatch 오류가 발생할 수 있다.

### Pages Router와의 호환성

`usePathname`을 사용하는 컴포넌트를 Pages Router 라우트 내부에서 가져와 사용하는 경우, 라우터가 아직 초기화되지 않은 시점(예: `getStaticPaths`의 fallback 라우트 또는 자동 정적 최적화 중)에는 `null`을 반환할 수 있다. 프로젝트에 `app`과 `pages` 디렉토리가 모두 포함되어 있으면 Next.js가 `usePathname`의 반환 타입을 자동으로 조정한다.

### 매개변수 (Parameters)

```tsx
const pathname = usePathname()
```

`usePathname`은 어떠한 매개변수도 받지 않는다.

### 반환값 (Returns)

현재 URL의 pathname 문자열을 반환한다.

| URL | 반환값 |
|---|---|
| `/` | `'/'` |
| `/dashboard` | `'/dashboard'` |
| `/dashboard?v=2` | `'/dashboard'` |
| `/blog/hello-world` | `'/blog/hello-world'` |

쿼리 파라미터(`?v=2` 등)나 해시는 포함되지 않으며, 오직 경로명 문자열만 반환된다.

### 동작 방식 (Behavior)

#### Cache Components 및 `Suspense` 경계

[`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md)가 활성화되어 있을 때, `usePathname`은 prerender 중에 경로명을 확인할 수 있는지 여부에 따라 [`Suspense`](https://react.dev/reference/react/Suspense) 경계를 요구할 수 있다.

- **정적 라우트 및 [`generateStaticParams`](./generate-static-params.md)가 적용된 라우트**: 빌드 시점에 다이나믹 params를 포함한 모든 라우트 세그먼트가 알려져 있다. prerender 중에 pathname을 확정할 수 있으므로 `usePathname`은 서버에서 바로 해석되며 별도의 `Suspense` 경계가 필요하지 않다.
- **`generateStaticParams`에 포함되지 않은 다이나믹 params 라우트**: 요청 시점까지 param 값을 알 수 없는 fallback param이다. prerender 중에 pathname을 확정할 수 없으므로 `usePathname`이 suspend된다. 이때 빌드 오류를 방지하고 prerender 중에 fallback을 렌더링할 수 있도록 해당 컴포넌트(또는 상위 컴포넌트)를 `Suspense` 경계로 감싸야 한다.

이는 `usePathname`을 호출하는 컴포넌트 자체가 정적이더라도 동일하게 적용된다. 예를 들어 레이아웃에 배치된 활성 링크 사이드바는 알 수 없는 다이나믹 param을 가진 하위 페이지에서 suspend된다. 레이아웃의 나머지 영역을 prerender 상태로 유지하려면 `usePathname`을 호출하는 컴포넌트를 fallback이 지정된 `Suspense` 경계로 감싼다.

### 예제

#### 1. 라우트 변경 감지 및 활성 내비게이션 스타일링

`usePathname`과 `useSearchParams`를 함께 사용하여 라우트 변경 시점에 필요한 작업을 수행하거나 활성 링크를 표시할 수 있다.

```tsx filename="app/components/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4">
      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'font-bold text-blue-600' : 'text-gray-600'}
      >
        대시보드
      </Link>
      <Link
        href="/settings"
        className={pathname === '/settings' ? 'font-bold text-blue-600' : 'text-gray-600'}
      >
        설정
      </Link>
    </nav>
  )
}
```

```jsx filename="app/components/nav-links.js" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4">
      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'font-bold text-blue-600' : 'text-gray-600'}
      >
        대시보드
      </Link>
      <Link
        href="/settings"
        className={pathname === '/settings' ? 'font-bold text-blue-600' : 'text-gray-600'}
      >
        설정
      </Link>
    </nav>
  )
}
```

#### 2. Rewrites 환경에서 Hydration Mismatch 방지

페이지가 prerender될 때 HTML은 소스 pathname을 기준으로 생성된다. 이후 `next.config`의 rewrite나 `Proxy`를 통해 해당 페이지에 도달하면 브라우저 URL이 달라져 클라이언트에서 읽는 pathname과 불일치할 수 있다.

이를 방지하기 위해 클라이언트 pathname에 의존하는 UI를 작게 격리하고, 마운트된 이후에 업데이트하는 방식을 사용한다:

```tsx filename="app/components/pathname-badge.tsx" switcher
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PathnameBadge() {
  const pathname = usePathname()
  const [clientPathname, setClientPathname] = useState('')

  useEffect(() => {
    setClientPathname(pathname)
  }, [pathname])

  return (
    <p>
      현재 경로: <span>{clientPathname}</span>
    </p>
  )
}
```

```jsx filename="app/components/pathname-badge.js" switcher
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PathnameBadge() {
  const pathname = usePathname()
  const [clientPathname, setClientPathname] = useState('')

  useEffect(() => {
    setClientPathname(pathname)
  }, [pathname])

  return (
    <p>
      현재 경로: <span>{clientPathname}</span>
    </p>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `usePathname` 도입 |

## 예제 및 데모 설계

- 헤더 내비게이션 바에서 `usePathname`을 활용해 현재 활성화된 메뉴 항목의 스타일을 실시간으로 변경하는 데모를 설계한다.
- 다이나믹 라우트(`[category]/[id]`)에서 `generateStaticParams` 유무에 따른 `Suspense` 경계 필요 여부를 확인한다.
- 쿼리 스트링이 붙은 URL(`/products?sort=asc`) 접근 시 `usePathname`의 반환값에 쿼리 스트링이 제외되고 순수 경로명만 추출되는지 검증한다.

## 연습 문제

1. `usePathname()`이 반환하는 값에 대한 설명으로 올바른 것은?
   - A. 프로토콜과 호스트명을 포함한 전체 URL 문자열 (예: `https://example.com/blog`)
   - B. 쿼리 스트링을 제외한 현재 URL의 경로명 문자열 (예: `/dashboard`)
   - C. 쿼리 파라미터 객체 (예: `{ sort: 'asc' }`)
   - D. 다이나믹 세그먼트 매개변수 객체

<details><summary>정답 보기</summary>

정답: **B**  
해설: `usePathname()`은 쿼리 파라미터나 도메인을 제외한 순수 pathname 문자열만 반환한다.
</details>

2. Server Component에서 `usePathname`을 직접 호출할 수 없는 기술적 배경은?
   - A. Server Component는 React 훅 자체를 지원하지 않기 때문만이다.
   - B. 페이지 내비게이션 시 레이아웃 상태를 보존하고 불필요한 서버 재렌더링을 방지하기 위함이다.
   - C. Next.js 16부터 지원이 중단되었기 때문이다.
   - D. 브라우저 쿠키 보안 정책 때문이다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js App Router는 레이아웃이 내비게이션 간에 다시 렌더링되지 않고 캐시 및 재사용되도록 설계되어 있으며, URL 변경에 따른 반응은 Client Component에서 처리하도록 격리되어 있다.
</details>

## 챕터 요약

- `usePathname`은 Client Component에서 현재 URL의 경로명(pathname) 문자열을 읽을 때 사용하는 훅이다.
- 쿼리 매개변수(`?query=value`)는 반환하지 않으며 오직 경로 경로만 반환한다.
- Server Component에서는 레이아웃 상태 보존 원칙에 따라 URL을 직접 읽지 않는다.
- `cacheComponents` 환경에서 빌드 시점에 경로가 확정되지 않는 다이나믹 라우트는 `Suspense` 경계로 감싸야 한다.
- rewrite가 적용된 환경에서는 초기 hydration mismatch를 방지하기 위해 마운트 후 상태를 갱신하는 패턴을 적용할 수 있다.
