# TanStack Query

- 공식 문서: [TanStack Query](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query)
- 상위 메뉴: [Client-side data fetching](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- App Router에 `QueryClientProvider`를 안전하게 구성할 수 있다.
- `useQuery`와 `useSuspenseQuery`의 로딩·오류 처리를 구분할 수 있다.
- Server Component에서 pending query를 dehydration해 초기 데이터를 제공할 수 있다.
- Cache Components와 함께 hydration timestamp와 서버 tag를 일관되게 관리할 수 있다.

## 핵심 개념 및 설명

### TanStack Query로 클라이언트 데이터 fetching

TanStack Query는 Client Component 데이터 fetching, Server Component 초기 데이터, 브라우저 mutation과 캐시된 서버 데이터의 조정을 담당한다. 먼저 [Client-side data fetching](./README.md)에서 패턴을 선택한다.

### provider 설정

사용 라우트를 `QueryClientProvider`로 감싼다. 서버 렌더링마다 새 `QueryClient`를 만들고 브라우저에서는 하나를 재사용해 요청 간 서버 상태는 격리하고 브라우저 캐시는 유지한다.

```tsx filename="app/products/providers.tsx"
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') return new QueryClient()
  browserQueryClient ??= new QueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
```

데이터를 공유하는 가장 가까운 layout에서 provider를 렌더링한다.

### 클라이언트에서 데이터 가져오기

초기 화면이 hydration 뒤 요청을 기다려도 되면 `useQuery`로 컴포넌트 자체의 로딩과 오류 상태를 그린다. `enabled`는 입력이 준비될 때까지 요청을 늦춘다.

```tsx filename="app/products/layout.tsx"
'use client'

import { useQuery } from '@tanstack/react-query'

export function ProductAutocomplete({ query }: { query: string }) {
  const { data = [], error, isPending } = useQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  })
  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isPending) return <p>Loading products...</p>
  return <pre>{JSON.stringify(data)}</pre>
}
```

### 클라이언트 데이터에 Suspense 사용

가까운 Suspense boundary가 로딩 UI를 정의해야 하면 `useSuspenseQuery`를 사용한다. 상호작용 shell은 boundary 밖에 둔다. 초기 요청 오류는 가까운 error boundary로 전파된다. 데이터가 생긴 뒤 같은 query를 refetch할 때는 기존 값을 계속 렌더링하고 `isFetching`으로 백그라운드 피드백을 줄 수 있다.

```tsx filename="app/product-autocomplete.tsx"
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

function ProductResults({ query }: { query: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
  })
  return <pre>{JSON.stringify(data)}</pre>
}
```

> **알아두면 좋은 점**: 한 컴포넌트의 여러 `useSuspenseQuery`는 순차 실행된다. 독립 query를 형제 컴포넌트로 나누거나 `useSuspenseQueries`를 사용한다.

### Server Component에서 초기 데이터 제공

초기 렌더링에 데이터가 필요하면 Server Component가 query를 prefetch하고 `<HydrationBoundary>`로 넘긴다. TanStack Query 5.40.0 이상은 pending query를 dehydration할 수 있다. `prefetchQuery`를 await하지 않으면 렌더링 전체를 막지 않고 읽는 컴포넌트만 suspend한다.

```tsx filename="app/product-autocomplete.tsx"
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

function ProductData({ id }: { id: string }) {
  const queryClient = new QueryClient()
  void queryClient.prefetchQuery({
    ...productCache.options(id),
    queryFn: () => getProduct(id),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient, {
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    })}>
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

서버와 Client Component는 같은 query key를 사용해야 한다. key와 options를 하나의 계약 객체로 정의한다. 브라우저에서 실행되는 기본 `queryFn`은 상대 URL의 Route Handler를 호출하고, 서버 prefetch에서는 Server Function을 override한다. `staleTime`은 hydration 직후 불필요한 refetch를 막는다.

### Cache Components로 서버 제공 데이터 캐싱

`cacheComponents`를 활성화하고 서버 읽기에 `'use cache'`, `cacheLife`, `cacheTag`를 적용한다. TanStack Query의 `staleTime`은 별도 브라우저 캐시 정책이므로 `cacheLife`와 같을 필요가 없다.

Cache Components는 Client Component도 prerender한다. 초기 렌더링에 필요한 query는 Suspense 뒤에 둔다. 활성 query 상태를 만드는 동안 TanStack Query가 현재 시간을 읽을 수 있으므로 boundary가 없으면 current-time prerender 오류가 날 수 있다.

> **알아두면 좋은 점**: Cache Components prerender 중 `dehydrate()`는 현재 시간을 읽는다. 캐시된 초기 데이터에는 아래의 prerender 가능한 hydration helper를 사용한다.

### mutation 뒤 서버와 클라이언트 캐시 조정

`useMutation`의 `onMutate`에서 진행 중 query를 취소하고 이전 값을 저장한 뒤 낙관적 값을 설정한다. 실패하면 `onError`에서 이전 값을 복원한다.

```tsx filename="app/products/[id]/page.tsx"
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function MarkReadButton() {
  const client = useQueryClient()
  const queryKey = activityCache.key
  const markRead = useMutation({
    mutationFn: markActivityReadAction,
    onMutate: async () => {
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData(queryKey)
      client.setQueryData(queryKey, { count: 0 })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      client.setQueryData(queryKey, context?.previous)
    },
  })
  return <button onClick={() => markRead.mutate()}>Mark read</button>
}
```

Server Action은 데이터베이스를 갱신하고 `updateTag`로 같은 계약의 서버 tag를 만료한다. 낙관적 query는 현재 화면을, tag는 다음 서버 읽기를 갱신한다.

> **알아두면 좋은 점**: 즉시 반영해야 하는 캐시된 서버 읽기를 Action이 변경할 때 `updateTag`를 사용한다. 캐시되지 않은 읽기에는 tag가 없다.

### prerender 가능한 hydration 상태 만들기

Cache Components에서 일반 `dehydrate()`가 prerender 중 `Date.now()`를 읽으면 current-time 오류가 발생한다. 대신 timestamp 읽기만 `'use cache'`로 캐시하고 데이터와 같은 tag를 부여한다. mutation이 tag를 무효화하면 데이터와 timestamp가 함께 전진해 다음 내비게이션의 `<HydrationBoundary>`가 브라우저 query를 덮어쓴다.

```tsx filename="app/lib/hydrate.ts"
import { cacheLife, cacheTag } from 'next/cache'

async function getHydrationUpdatedAt(tags: string[]) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}
```

helper는 데이터를 `QueryClient#setQueryData(..., { updatedAt })`에 넣고 수동으로 `DehydratedState`를 만든다. 데이터를 소유한 세그먼트에서 helper를 await한 뒤 `<HydrationBoundary>`에 전달한다.

> **알아두면 좋은 점**: hydration timestamp는 데이터가 바뀔 때 함께 증가해야 한다. 이 helper는 같은 tag로 갱신되는 데이터에 적합하다. 시간 기반 데이터라면 데이터와 timestamp를 하나의 캐시된 snapshot에서 파생한다.

## 예제 및 데모 설계

- Phase 2에서 상품 검색과 알림 카운터를 TanStack Query로 구현한다.
- 서버 렌더마다 query client가 격리되는지 요청 ID 로그로 확인한다.
- pending query dehydration과 await한 prefetch의 스트리밍 차이를 비교한다.
- 일반 `dehydrate()`와 prerender 가능한 helper의 빌드 결과를 대조한다.

## 연습 문제

1. 서버 렌더링에서 `QueryClient`를 어떻게 생성해야 하는가?

   - A. 모든 요청이 하나를 공유한다.
   - B. 서버 렌더마다 새로 만든다.
   - C. 만들지 않는다.

   <details><summary>정답 보기</summary>

   정답: B. 요청 간 서버 캐시 상태가 섞이지 않도록 격리한다.

   </details>

2. hydration 직후 refetch를 일정 시간 막는 옵션은 무엇인가?

   - A. `staleTime`
   - B. `enabled`
   - C. `onError`

   <details><summary>정답 보기</summary>

   정답: A. hydration된 데이터를 지정 시간 동안 신선하게 본다.

   </details>

3. Cache Components에서 데이터와 hydration timestamp가 함께 갱신되려면 무엇을 공유해야 하는가?

   - A. CSS 파일
   - B. cache tag
   - C. 브라우저 탭

   <details><summary>정답 보기</summary>

   정답: B. 같은 tag의 무효화로 데이터와 timestamp를 함께 전진시킨다.

   </details>

## 챕터 요약

- 서버는 렌더마다 새 query client를, 브라우저는 재사용할 query client를 쓴다.
- `useQuery`는 인라인 상태를, `useSuspenseQuery`는 boundary 기반 로딩을 제공한다.
- pending query를 dehydration하면 서버가 초기 데이터를 스트리밍할 수 있다.
- query key와 서버 tag를 공유 계약으로 맞춰 mutation을 조정한다.
- Cache Components에서는 데이터와 같은 tag를 가진 hydration timestamp를 사용한다.
