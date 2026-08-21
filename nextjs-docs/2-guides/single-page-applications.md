# SPAs

- 공식 문서: [SPAs](https://nextjs.org/docs/app/guides/single-page-applications)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 엄격한 SPA와 Next.js App Router의 SPA 같은 내비게이션을 구분한다.
- 서버에서 시작한 Promise를 Client Component에서 `use()`로 읽어 waterfall을 줄인다.
- 브라우저 전용 컴포넌트, shallow routing, 낙관적 mutation 패턴을 적용한다.
- 정적 export의 장점과 서버 기능 제한을 판단한다.

## 핵심 개념 및 설명

Next.js는 클라이언트 내비게이션과 데이터 fetching으로 Single-Page Application(SPA)을 만들 수 있다. 한 앱에서 클라이언트와 서버 패턴을 함께 쓸 수 있고, 기존 SPA도 전체를 다시 쓰지 않고 점진적으로 옮길 수 있다.

### SPA란 무엇인가

이 문서에서 엄격한 SPA는 다음 두 조건을 만족한다.

- **Client-side rendering(CSR)**: 하나의 HTML 파일을 받고 모든 라우트, 화면 전환, 데이터 fetching을 브라우저 JavaScript가 처리한다.
- **전체 페이지 reload 없음**: 경로마다 새 문서를 요청하지 않고 JavaScript가 현재 DOM을 바꾸고 필요한 데이터를 가져온다.

엄격한 SPA는 상호작용 전에 많은 JavaScript를 내려받아야 할 수 있고 클라이언트 데이터 waterfall을 관리하기 어렵다.

### SPA에 Next.js를 사용하는 이유

Next.js는 JavaScript 번들을 자동으로 코드 분할하고 라우트마다 HTML 진입점을 만들 수 있다. 클라이언트가 불필요한 코드를 받지 않아 번들이 작아지고 페이지가 빨리 열린다. [`<Link>`](../3-api-reference/3.2-components/link.md)는 라우트를 자동 prefetch해 SPA 같은 빠른 전환을 제공하면서 현재 상태를 공유 가능한 URL에 보존한다.

처음에는 모든 것을 클라이언트에서 렌더링하는 [정적 사이트](./static-exports.md)나 엄격한 SPA로 시작할 수 있다. 필요해지면 [Server Component](../1-getting-started/server-and-client-components.md), [Server Action](./server-actions.md) 같은 서버 기능을 점진적으로 추가한다.

### 일반적인 SPA 패턴 만들기

#### Context Provider에서 React `use` 사용하기

Server Component에서 데이터를 요청하고 Promise를 기다리지 않은 채 Client Component에 넘길 수 있다. Client Component는 렌더링 중 `await`할 수 없으므로 React `use()`로 Promise를 푼다. 서버에서 요청을 먼저 시작하면 응답을 바로 스트리밍하고 클라이언트 waterfall을 피할 수 있다.

```tsx filename="app/layout.tsx"
export default function RootLayout({ children }: LayoutProps<'/'>) {
  const userPromise = getUser() // 여기서 기다리지 않는다.
  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

Provider는 Promise를 Context로 전달하고 소비자는 `use()`로 읽는다.

```tsx filename="app/profile.tsx"
'use client'

import { use } from 'react'
import { useUser } from './user-provider'

export function Profile() {
  const user = use(useUser())
  return <p>{user.name}</p>
}
```

소비자를 `<Suspense>`로 감싸면 Promise가 준비되는 동안 fallback을 보여준다. 스트리밍된 prerender HTML은 JavaScript가 모두 로드되기 전에도 보인다. 한 요청에서 여러 컴포넌트가 같은 데이터를 읽는다면 `getUser`를 [React `cache`](../1-getting-started/fetching-data.md)로 감싸 호출을 공유한다. focus revalidation, polling, mutation, 요청 중복 제거가 필요하면 [클라이언트 데이터 fetching](./2.15-client-side-data-fetching/README.md)의 SWR나 TanStack Query를 사용한다.

> **알아두면 좋은 점**: 트리 높은 곳에서 만든 Promise를 다시 가져오면 그 Promise를 만든 Server Component가 다시 실행된다. 일부 하위 트리만 필요한 데이터라면 Provider를 root layout이 아니라 해당 하위 트리에 둔다.

#### 브라우저에서만 컴포넌트 렌더링하기

Client Component도 `next build` 중 prerender된다. `window`나 `document`에 의존하는 라이브러리는 [`next/dynamic`](./lazy-loading.md)과 `ssr: false`로 브라우저에서만 불러올 수 있다.

```tsx filename="app/ui/sort-products.tsx"
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(() => import('./component'), {
  ssr: false,
})
```

브라우저 API의 존재를 `useEffect`에서 확인하고, 마운트 전에는 `null`이나 prerender 가능한 loading 상태를 반환할 수도 있다.

#### 클라이언트 shallow routing

파일 시스템 라우팅 없이 URL 상태만 바꿔야 하면 `window.history.pushState`와 `replaceState`를 사용할 수 있다. 두 API는 Next.js Router와 통합되므로 [`usePathname`](../3-api-reference/3.3-functions/use-pathname.md)과 [`useSearchParams`](../3-api-reference/3.3-functions/use-search-params.md)에도 변경이 반영된다.

```tsx filename="app/ui/sort-products.tsx"
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const next = new URLSearchParams(searchParams.toString())
    next.set('sort', sortOrder)
    window.history.pushState(null, '', `?${next.toString()}`)
  }

  return <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
}
```

#### Server Action으로 데이터 mutation하기

Client Component는 Server Action을 호출해 서버에서 mutation할 수 있다. `useTransition`은 실행 중 상태를 표시하고, `useOptimistic`은 서버 응답 전에 새 상태를 보여주며, `useActionState`는 Action 결과와 pending 상태를 관리한다.

낙관적 UI와 서버가 같은 다음 상태를 계산하려면 순수 reducer를 공유한다.

```ts filename="app/todos-reducer.ts"
export function applyAction(todos: Todo[], action: TodoAction): Todo[] {
  if (action.type === 'toggle') {
    return todos.map((todo) =>
      todo.id === action.id ? { ...todo, done: !todo.done } : todo
    )
  }
  return todos
}
```

Client Component는 같은 reducer를 `useOptimistic`에 전달하고 transition 안에서 낙관적 변경과 Action dispatch를 함께 실행한다. 화면은 즉시 바뀌며 `useActionState`의 pending 값으로 서버 동기화 상태를 표시한다. 더 자세한 상호작용 패턴은 [Interactive apps](./interactive-apps.md)를 참고한다.

### 정적 export 선택 사항

정적 export는 라우트별 HTML을 만든다. 하나의 `index.html`과 큰 번들만 보내는 엄격한 SPA보다 콘텐츠를 빨리 보여주면서 클라이언트 전환은 SPA처럼 유지할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = { output: 'export' }
export default nextConfig
```

`next build`는 HTML, CSS, JavaScript 자산을 `out`에 만든다.

> **참고**: 정적 export에서는 Next.js 서버 기능을 사용할 수 없다. [Static Exports](./static-exports.md)의 지원하지 않는 기능을 확인한다.

### 기존 프로젝트를 Next.js로 마이그레이션하기

Create React App이나 Vite 프로젝트는 [Create React App에서 마이그레이션](./2.63-migrating/from-create-react-app.md)하거나 [Vite에서 마이그레이션](./2.63-migrating/from-vite.md)하는 절차로 Next.js에 점진적으로 옮길 수 있다. Pages Router 기반 SPA도 [App Router 마이그레이션](./2.63-migrating/app-router-migration.md)을 따라 단계적으로 도입할 수 있다.

#### [Client-side data fetching](./2.15-client-side-data-fetching/README.md)

Client Component에서 라이브러리로 데이터를 가져오고 Server Component의 초기 데이터와 서버·클라이언트 캐시를 조율한다.

#### [Interactive apps](./interactive-apps.md)

Server Function, transition, 낙관적 UI, pending 피드백으로 반응성 있는 상호작용을 만든다.

#### [Server Actions](./server-actions.md)

단일 왕복 응답, 순차 디스패치, 보안, 캐시 통합을 이해한다.

#### [Forms](./forms.md)

React Server Action으로 폼을 작성한다.

#### [Streaming](./streaming.md)

데이터가 준비되는 순서대로 UI를 점진적으로 렌더링한다.

#### [Static Exports](./static-exports.md)

정적 사이트나 SPA로 시작한 뒤 필요하면 서버 기능을 사용하는 형태로 확장한다.

## 예제 및 데모 설계

- Phase 2에서 서버가 시작한 사용자 Promise를 Context와 `use()`로 읽는 프로필 화면을 만든다.
- 브라우저 API 의존 컴포넌트의 `ssr: false` 전후 빌드 결과를 비교한다.
- 정렬 값을 `pushState`로 바꾸고 `useSearchParams`와 뒤로 가기가 동기화되는지 확인한다.
- 할 일 mutation에서 낙관적 상태, pending 표시, 서버 실패 시 복구 흐름을 관찰한다.

## 연습 문제

1. 서버에서 시작한 Promise를 Client Component 렌더링에서 푸는 API는 무엇인가?

   - A. `use()`
   - B. `useEffect()`만 사용
   - C. `redirect()`

   <details><summary>정답 보기</summary>

   정답: A. Client Component는 Promise를 `use()`로 읽으며 준비될 때까지 suspend한다.

   </details>

2. `window`에 의존하는 컴포넌트를 브라우저에서만 불러오는 설정은 무엇인가?

   - A. `dynamic(..., { ssr: false })`
   - B. `output: 'export'`
   - C. `cacheComponents: true`

   <details><summary>정답 보기</summary>

   정답: A. `next/dynamic`의 `ssr: false`가 해당 Client Component의 prerender를 끈다.

   </details>

3. 정적 export에 대한 설명으로 맞는 것은 무엇인가?

   - A. 라우트마다 HTML을 만들 수 있지만 서버 기능은 제한된다.
   - B. 모든 라우트에 하나의 HTML만 만든다.
   - C. Server Action을 별도 설정 없이 지원한다.

   <details><summary>정답 보기</summary>

   정답: A. 정적 자산만 배포하므로 라우트별 HTML의 이점은 얻지만 런타임 서버 기능은 사용할 수 없다.

   </details>

## 챕터 요약

- Next.js는 SPA 같은 클라이언트 전환과 라우트별 코드 분할·HTML을 함께 제공한다.
- 서버에서 Promise를 먼저 시작하고 `use()`로 읽으면 클라이언트 waterfall을 줄일 수 있다.
- 브라우저 전용 렌더링과 shallow routing은 기존 SPA 패턴을 점진적으로 옮기는 도구다.
- transition과 낙관적 상태는 Server Action mutation을 즉각적으로 느끼게 한다.
- 정적 export는 빠른 정적 배포를 제공하지만 Next.js 서버 기능을 지원하지 않는다.
