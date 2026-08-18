# useSearchParams

- 공식 문서: [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md)에서 현재 URL의 **쿼리 문자열(query string)**을 읽는 `useSearchParams` 훅의 사용법을 익힌다.
- `ReadonlyURLSearchParams` 인터페이스가 제공하는 읽기 전용 메서드(`get`, `has`, `getAll` 등)를 활용한다.
- prerender 환경에서 `useSearchParams` 호출 시 발생하는 클라이언트 측 렌더링 전환 특성과 `<Suspense>` 경계의 필수성을 이해한다.
- 개발 환경(`next dev`)과 프로덕션 빌드(`next build`) 시의 Suspense 처리 차이점을 파악한다.
- Page의 `searchParams` prop과 Layout에서 쿼리 파라미터에 접근할 때의 아키텍처적 차이를 설명한다.
- `useRouter` 및 `<Link>`와 결합하여 기존 쿼리 파라미터를 유지하면서 새 값을 업데이트하는 패턴을 적용한다.

## 핵심 개념 및 설명

`useSearchParams`는 현재 URL의 **쿼리 문자열(query string)**을 읽을 수 있게 해주는 **Client Component** 전용 훅이다.

이 훅은 Web 표준 [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) 인터페이스의 **읽기 전용(read-only)** 버전을 반환한다.

```tsx filename="app/dashboard/search-bar.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>검색어: {search}</>
}
```

```jsx filename="app/dashboard/search-bar.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>검색어: {search}</>
}
```

### 매개변수 (Parameters)

```tsx
const searchParams = useSearchParams()
```

`useSearchParams`는 어떠한 인자도 받지 않는다.

### 반환값 (Returns)

URL의 쿼리 문자열을 읽을 수 있는 유틸리티 메서드를 포함한 `ReadonlyURLSearchParams` 인스턴스를 반환한다:

- [`URLSearchParams.get()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get): 지정한 파라미터의 첫 번째 값을 반환한다.

  | URL | `searchParams.get("a")` |
  |---|---|
  | `/dashboard?a=1` | `'1'` |
  | `/dashboard?a=` | `''` |
  | `/dashboard?b=3` | `null` |
  | `/dashboard?a=1&a=2` | `'1'` (모든 값을 가져오려면 `getAll()` 사용) |

- [`URLSearchParams.has()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has): 해당 파라미터가 존재하는지 여부를 불리언(`boolean`)으로 반환한다.

  | URL | `searchParams.has("a")` |
  |---|---|
  | `/dashboard?a=1` | `true` |
  | `/dashboard?b=3` | `false` |

- 기타 읽기 전용 메서드: `getAll()`, `keys()`, `values()`, `entries()`, `forEach()`, `toString()` 등을 지원한다.

> **알아두면 좋은 점 (Server Component와의 관계)**:
>
> - `useSearchParams`는 [Client Component](../../1-getting-started/server-and-client-components.md) 훅이며, [부분 렌더링](../../1-getting-started/linking-and-navigating.md#client-side-transitions) 중 오래된 값이 유지되는 것을 방지하기 위해 [Server Component](../../1-getting-started/server-and-client-components.md)에서는 지원되지 않는다.
> - Server Component에서 쿼리 파라미터에 따라 데이터를 가져오려면 Page 컴포넌트의 [`searchParams` prop](../3.1-file-conventions/3.1.1-routing/page.md#searchparams-optional)을 읽는 것이 권장된다. 읽어온 값을 해당 Page 내의 하위 컴포넌트(Server 또는 Client)로 props로 전달할 수 있다.
> - 애플리케이션에 `/pages` 디렉토리가 공존하는 경우, `getServerSideProps`를 사용하지 않는 페이지의 prerender 도중에는 쿼리 파라미터를 알 수 없으므로 마이그레이션 호환성을 위해 `ReadonlyURLSearchParams | null`을 반환할 수 있다.

---

### 동작 방식 (Behavior)

#### 1. Prerendering 및 `Suspense` 경계

라우트가 prerender될 때 `useSearchParams`를 호출하면 가장 가까운 [`Suspense` 경계](../3.1-file-conventions/3.1.1-routing/loading.md)까지의 Client Component 트리가 클라이언트 측에서 렌더링된다.

이를 통해 쿼리 파라미터를 사용하는 동적 부분만 클라이언트 렌더링으로 넘기고, 라우트의 나머지 정적 영역은 서버에서 미리 prerender하여 초기 HTML로 전송할 수 있다.

```tsx filename="app/dashboard/page.tsx" switcher
import { Suspense } from 'react'
import SearchBar from './search-bar'

function SearchBarFallback() {
  return <div>검색창 불러오는 중...</div>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>대시보드</h1>
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { Suspense } from 'react'
import SearchBar from './search-bar'

function SearchBarFallback() {
  return <div>검색창 불러오는 중...</div>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>대시보드</h1>
    </>
  )
}
```

> **알아두면 좋은 점 (개발 모드 vs 프로덕션 빌드)**:
>
> - **개발 환경(`next dev`)**: 라우트가 온디맨드로 렌더링되므로 `useSearchParams`가 suspend되지 않아 `<Suspense>` 없이도 정상 동작하는 것처럼 보일 수 있다.
> - **프로덕션 빌드(`next build`)**: Client Component에서 `useSearchParams`를 호출하는 정적 페이지는 반드시 `<Suspense>` 경계로 감싸야 한다. 그렇지 않으면 `Missing Suspense boundary with useSearchParams` 에러와 함께 **빌드가 실패**한다.
> - 라우트 전체를 다이나믹 렌더링하고자 한다면 Server Component에서 [`connection()`](./connection.md)을 먼저 호출하여 들어오는 요청을 대기하도록 설정한다.
> - Server Component Page에서는 `searchParams` prop을 Client Component에 직접 전달하고 React의 `use()`로 풀어서(unwrap) 사용할 수도 있다. 다만 이 역시 suspend를 유발하므로 해당 Client Component를 `<Suspense>` 경계로 감싸야 한다.

#### 2. 다이나믹 렌더링 (Dynamic Rendering)

라우트가 다이나믹 렌더링되는 경우, `useSearchParams`는 초기 서버 렌더링 시점에도 서버에서 바로 사용 가능하다.

```tsx filename="app/dashboard/page.tsx" switcher
import { connection } from 'next/server'
import SearchBar from './search-bar'

export default async function Page() {
  await connection()
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>대시보드</h1>
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { connection } from 'next/server'
import SearchBar from './search-bar'

export default async function Page() {
  await connection()
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>대시보드</h1>
    </>
  )
}
```

> **알아두면 좋은 점 (다이나믹 렌더링 설정 방식)**:
>
> - 이전에는 페이지 상단에 `export const dynamic = 'force-dynamic'`을 선언하여 강제 다이나믹 렌더링을 설정했다.
> - Next.js 15부터는 다이나믹 렌더링을 들어오는 요청과 의미론적으로 명확히 연결해주는 [`connection()`](./connection.md) 함수 사용을 권장한다.

#### 3. Server Component에서의 쿼리 파라미터 접근

- **Page (Server Component)**: [`searchParams` prop](../3.1-file-conventions/3.1.1-routing/page.md#searchparams-optional)을 통해 최신 쿼리 파라미터를 읽을 수 있다.
- **Layout (Server Component)**: `searchParams` prop을 **받지 않는다**. 레이아웃은 내비게이션 간에 재렌더링되지 않으므로 오래된(stale) 쿼리 값을 갖는 문제를 방지하기 위함이다. 레이아웃 하위에서 쿼리 파라미터를 읽으려면 Client Component로 분리하여 `useSearchParams`를 사용해야 한다.

---

### 예제: 쿼리 파라미터 업데이트 패턴

`useRouter` 또는 [`<Link>`](../3.2-components/link.md)와 `URLSearchParams`를 조합하여 기존 쿼리 파라미터를 유지하면서 특정 키/값을 변경할 수 있다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SortControls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex gap-2">
      <p>정렬 기준:</p>
      <button
        type="button"
        onClick={() => {
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        오름차순 (useRouter)
      </button>

      <Link href={pathname + '?' + createQueryString('sort', 'desc')}>
        내림차순 (Link)
      </Link>
    </div>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SortControls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex gap-2">
      <p>정렬 기준:</p>
      <button
        type="button"
        onClick={() => {
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        오름차순 (useRouter)
      </button>

      <Link href={pathname + '?' + createQueryString('sort', 'desc')}>
        내림차순 (Link)
      </Link>
    </div>
  )
}
```

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `useSearchParams` 도입 |

## 예제 및 데모 설계

- 검색어 입력창에서 엔터 입력 시 `search` 쿼리 파라미터를 추가하고, `useSearchParams().get('search')`로 목록을 필터링하는 데모를 설계한다.
- 정적 빌드 환경에서 `useSearchParams`를 포함하는 컴포넌트를 `<Suspense>`로 감쌌을 때의 fallback 렌더링 동작을 확인한다.
- `searchParams.set()`을 활용해 기존 필터 조건을 유지하면서 페이징(`page=2`) 파라미터만 업데이트하는 유틸 함수를 검증한다.

## 연습 문제

1. `useSearchParams`를 정적으로 prerender되는 라우트의 Client Component에서 사용할 때 필수적인 작업은?
   - A. `next.config.js`에 `useSearchParams: true` 설정 추가
   - B. 해당 Client Component를 `<Suspense>` 경계로 감싸기
   - C. `useSearchParams({ async: true })` 형태로 호출
   - D. 컴포넌트를 Server Component로 변경

<details><summary>정답 보기</summary>

정답: **B**  
해설: 정적으로 prerender되는 페이지에서 `useSearchParams`를 사용할 경우, 가장 가까운 `Suspense` 경계까지 클라이언트 측 렌더링으로 전환되므로 프로덕션 빌드 에러(`Missing Suspense boundary`)를 방지하고 폴백을 제공하기 위해 `<Suspense>` 경계로 감싸야 한다.
</details>

2. Server Component Layout에서 `searchParams` prop을 직접 제공하지 않는 주된 이유는?
   - A. URL 인코딩 파싱 오버헤드를 줄이기 위해
   - B. 레이아웃은 내비게이션 간 재렌더링되지 않으므로 오래된(stale) 쿼리 파라미터가 유지되는 문제를 방지하기 위해
   - C. Next.js가 레이아웃에서 쿼리 파라미터 사용을 금지했기 때문
   - D. HTTP 헤더 크기 제한 때문

<details><summary>정답 보기</summary>

정답: **B**  
해설: App Router의 레이아웃은 페이지 전환 시 불필요하게 재렌더링되지 않고 캐시/재사용되므로, 최신 쿼리 파라미터는 Page prop이나 Client Component의 `useSearchParams`에서 읽도록 설계되어 있다.
</details>

## 챕터 요약

- `useSearchParams`는 Client Component에서 URL의 쿼리 스트링을 읽기 전용(`ReadonlyURLSearchParams`)으로 읽어오는 훅이다.
- `get()`, `has()`, `getAll()` 등의 표준 메서드를 통해 파라미터 값에 접근할 수 있다.
- 정적 prerender 환경에서는 `next build` 시 빌드 실패를 방지하기 위해 반드시 `<Suspense>` 경계로 감싸야 한다.
- 다이나믹 렌더링 환경([`connection()`](./connection.md) 호출 등)에서는 초기 서버 렌더링 시에도 즉시 값을 사용할 수 있다.
- Server Component에서는 Page의 `searchParams` prop을 사용하며, Layout은 오래된 쿼리 값 유지를 방지하기 위해 쿼리 파라미터를 직접 전달받지 않는다.
