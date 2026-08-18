# useRouter

- 공식 문서: [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Client Component](../../1-getting-started/server-and-client-components.md) 내부에서 프로그래밍 방식으로 라우트를 전환하는 `useRouter` 훅의 사용법을 익힌다.
- `push`, `replace`, `refresh`, `prefetch`, `back`, `forward` 메서드의 동작 방식과 차이점을 이해한다.
- `bfcacheId` 식별자를 활용해 뒤로 가기/앞으로 가기 상태 보존과 신규 내비게이션 상태 초기화를 제어하는 방법을 설명한다.
- Pages Router의 `next/router`에서 App Router의 `next/navigation`으로 전환할 때 달라진 패턴(이벤트 리스너 대체 등)을 적용한다.

## 핵심 개념 및 설명

`useRouter` 훅을 사용하면 [Client Component](../../1-getting-started/server-and-client-components.md) 내부에서 프로그래밍 방식으로 라우트를 변경할 수 있다.

> **권장 사항**: 특별히 `useRouter`를 사용해야 하는 요구사항이 없다면 내비게이션에는 [`<Link>` 컴포넌트](../3.2-components/link.md)를 사용하는 것을 권장한다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

### `useRouter()` 인스턴스 메서드 및 속성

- `router.push(href: string, { scroll?: boolean, transitionTypes?: string[] })`: 지정한 라우트로 클라이언트 측 내비게이션을 수행한다. 브라우저의 히스토리 스택에 새 항목을 추가한다. 선택적 옵션인 `transitionTypes`는 내비게이션 Transition 내부에서 [`React.addTransitionType`](https://react.dev/reference/react/addTransitionType)으로 전달된다.
- `router.replace(href: string, { scroll?: boolean, transitionTypes?: string[] })`: 브라우저 히스토리 스택에 새 항목을 추가하지 않고 지정한 라우트로 클라이언트 측 내비게이션을 수행한다.
- `router.refresh()`: 현재 라우트를 새로고침한다. 서버에 새 요청을 보내고, 데이터 요청을 다시 가져오며, Server Component를 다시 렌더링한다. 클라이언트는 영향을 받지 않은 클라이언트 측 React 상태(`useState` 등)나 브라우저 상태(스크롤 위치 등)를 잃지 않고 업데이트된 React Server Component 페이로드를 병합한다. 이 작업은 현재 라우트에 대한 [Client Cache](../../4-glossary/README.md)를 비우지만, 서버 측 캐시를 무효화하지는 않는다. 서버 측 캐시 데이터를 무효화하려면 [`revalidatePath`](./revalidatePath.md) 또는 [`revalidateTag`](./revalidateTag.md)를 사용한다.
- `router.prefetch(href: string, options?: { onInvalidate?: () => void })`: 더 빠른 클라이언트 측 전환을 위해 지정한 라우트를 [prefetch](../../1-getting-started/linking-and-navigating.md#prefetching)한다. 선택적 `onInvalidate` 콜백은 prefetch된 데이터가 오래되어 무효화될 때 호출된다.
- `router.back()`: 브라우저 히스토리 스택의 이전 라우트로 이동한다.
- `router.forward()`: 브라우저 히스토리 스택의 다음 라우트로 이동한다.
- `router.bfcacheId`: 현재 라우트 세그먼트에 한정된 불투명(opaque) 문자열 식별자다. 둘러싼 세그먼트가 `push` 또는 `replace` 내비게이션에 의해 새로 생성될 때 변경되며, 뒤로 가기/앞으로 가기 내비게이션, `router.refresh()`, 검색 매개변수나 해시 전용 내비게이션 시에는 동일하게 유지된다.

> **알아두면 좋은 점**:
>
> - 신뢰할 수 없거나 검증되지 않은 URL을 `router.push`나 `router.replace`에 전달해서는 안 된다. 예를 들어 `javascript:` URL을 전달하면 페이지 컨텍스트에서 실행되어 XSS(Cross-Site Scripting) 취약점이 발생할 수 있다.
> - `<Link>` 컴포넌트는 뷰포트에 표시되는 라우트를 자동으로 prefetch한다.
> - `fetch` 요청이 캐시되어 있는 경우 `refresh()`를 호출해도 동일한 결과를 생성할 수 있다. `cookies` 및 `headers`와 같은 요청 시점 API도 응답을 변경할 수 있다.
> - `onInvalidate` 콜백은 prefetch 요청당 최대 한 번 호출된다. 업데이트된 라우트 데이터를 위해 새 prefetch를 트리거할 시점을 알리는 신호 역할을 한다.

### `next/router`에서의 마이그레이션

- App Router를 사용할 때 `useRouter` 훅은 `next/router`가 아니라 `next/navigation`에서 임포트해야 한다.
- `pathname` 문자열은 제거되었으며 [`usePathname()`](./use-pathname.md)으로 대체되었다.
- `query` 객체는 제거되었으며 [`useSearchParams()`](./use-search-params.md)로 대체되었다.
- `router.events`는 다른 클라이언트 훅의 조합으로 대체되었다.

### 예제

#### 1. Router 이벤트 리스너 대체

`usePathname` 및 `useSearchParams`와 같은 다른 Client Component 훅을 조합하여 페이지 변경을 감지할 수 있다.

```jsx filename="app/components/navigation-events.js"
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(`현재 URL: ${url}`)
  }, [pathname, searchParams])

  return null
}
```

이 컴포넌트를 루트 레이아웃에 임포트하여 사용할 수 있다:

```jsx filename="app/layout.js" highlight={2,10-12}
import { Suspense } from 'react'
import { NavigationEvents } from './components/navigation-events'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
```

> **알아두면 좋은 점**: `useSearchParams()`는 prerender 중에 가장 가까운 `Suspense` 경계까지 클라이언트 측 렌더링을 유발하므로, `<NavigationEvents>`는 반드시 [`Suspense` 경계](../3.1-file-conventions/loading.md)로 감싸야 한다.

#### 2. 상단 스크롤 비활성화 (`scroll: false`)

기본적으로 Next.js는 새 라우트로 이동할 때 페이지 최상단으로 스크롤한다. `router.push()` 또는 `router.replace()`에 `scroll: false` 옵션을 전달하여 이 동작을 비활성화할 수 있다.

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard (스크롤 유지)
    </button>
  )
}
```

#### 3. `bfcacheId`를 사용한 컴포넌트 상태 리셋 제어

`cacheComponents`가 활성화되어 있을 때 App Router는 React `<Activity>`를 사용해 내비게이션 간 Client Component 상태를 보존한다. 컴포넌트에 `bfcacheId`를 `key`로 지정하면 새로운 내비게이션에서는 상태를 초기화하면서도, 브라우저 뒤로 가기/앞으로 가기 시에는 이전 상태를 그대로 복원할 수 있다.

```tsx filename="app/example/page.tsx"
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const { bfcacheId } = useRouter()
  return <form key={bfcacheId}>{/* 폼 필드 */}</form>
}
```

> **알아두면 좋은 점**: `bfcacheId` 대신 이벤트 핸들러(예: `onSubmit`)에서 명시적으로 상태를 초기화하거나 데이터에서 파생된 키(예: 서버에서 전달된 초안 ID)를 사용하는 편이 낫다. `bfcacheId`는 기존 코드베이스를 마이그레이션할 때 등 필요한 경우에만 제한적으로 사용한다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.4.0` | `router.prefetch`에 선택적 `onInvalidate` 콜백 지원 추가 |
| `v13.0.0` | `next/navigation`의 `useRouter` 도입 |

## 예제 및 데모 설계

- 버튼 클릭 이벤트 핸들러에서 조건부로 `router.push('/dashboard')` 및 `router.replace('/login')`를 실행하는 시나리오를 구성한다.
- 폼 입력 후 완료 화면 이동 시 `router.push`와 `scroll: false` 옵션을 적용해 스크롤 위치 보존 여부를 확인한다.
- `usePathname`과 `useSearchParams`를 결합한 전역 내비게이션 이벤트 로거 컴포넌트를 레이아웃에 `<Suspense>`와 함께 배치한다.

## 연습 문제

1. `useRouter`의 `router.refresh()` 메서드에 대한 설명으로 올바른 것은?
   - A. 서버 측 데이터 캐시(`revalidateTag` 등)를 완전히 무효화한다.
   - B. 현재 라우트의 Client Cache를 비우고 Server Component를 다시 렌더링하지만, 영향을 받지 않은 클라이언트 상태(`useState` 등)는 유지한다.
   - C. 브라우저 전체 새로고침(`window.location.reload()`)과 동일하게 동작한다.
   - D. `next/router`에서만 사용할 수 있으며 App Router에서는 지원되지 않는다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `router.refresh()`는 서버에 새 요청을 보내고 Client Cache를 비우지만, 브라우저 상태나 클라이언트 React 상태(`useState` 등)를 잃지 않고 Server Component 페이로드를 병합한다. 서버 측 영구 캐시 무효화는 `revalidatePath`/`revalidateTag`를 사용해야 한다.
</details>

2. App Router에서 `useRouter`를 사용할 때 `pathname`과 쿼리 문자열을 읽는 올바른 방법은?
   - A. `router.pathname`과 `router.query`를 직접 읽는다.
   - B. `usePathname()`과 `useSearchParams()` 훅을 각각 임포트하여 사용한다.
   - C. `useRouter({ includeQuery: true })` 옵션을 전달한다.
   - D. `window.location` 객체만 사용해야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: App Router의 `next/navigation`에서 `useRouter`의 `pathname`과 `query` 속성은 제거되었으며, 각각 `usePathname()`과 `useSearchParams()` 전용 훅으로 분리되었다.
</details>

## 챕터 요약

- `useRouter`는 Client Component에서 프로그래밍 방식의 내비게이션을 수행할 때 사용하며, `next/navigation`에서 임포트한다.
- `push`는 히스토리 스택에 추가하고 `replace`는 현재 항목을 대체하며, `scroll: false`로 스크롤 이동을 비활성화할 수 있다.
- `refresh()`는 클라이언트 상태를 유지하면서 Server Component 및 최신 데이터를 다시 가져와 병합한다.
- `pathname`과 `query`는 각각 `usePathname()`과 `useSearchParams()` 전용 훅을 통해 읽어야 한다.
- `bfcacheId`를 컴포넌트 키로 전달하면 새 내비게이션에서는 상태를 리셋하고 뒤로 가기 시에는 상태를 복원할 수 있다.
