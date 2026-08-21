# SWR

- 공식 문서: [SWR](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr)
- 상위 메뉴: [Client-side data fetching](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `useSWR`의 key와 fetcher로 클라이언트 데이터를 가져올 수 있다.
- 인라인 상태와 Suspense 로딩을 구분해 적용할 수 있다.
- Server Component의 Promise를 `<SWRConfig fallback>`으로 제공할 수 있다.
- `mutate`와 서버 cache tag를 함께 갱신하고 실패 시 롤백할 수 있다.

## 핵심 개념 및 설명

### SWR로 클라이언트 데이터 fetching

SWR은 Client Component에서 데이터를 가져오고, Server Component의 초기 데이터를 이어받고, 브라우저 mutation과 캐시된 서버 데이터를 조정한다. 먼저 [Client-side data fetching](./README.md)에서 적절한 패턴을 선택한다.

### 클라이언트에서 데이터 가져오기

초기 화면이 hydration 뒤 브라우저 요청을 기다려도 되면 `useSWR`로 인라인 로딩·오류 상태를 렌더링한다. 조건부 key는 상호작용 입력이 생길 때까지 요청을 늦춘다.

```tsx filename="app/product-autocomplete.tsx"
'use client'

import useSWR from 'swr'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  const { data = [], error, isLoading } = useSWR(
    query ? `/api/products?query=${encodeURIComponent(query)}` : null,
    fetcher
  )
  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isLoading) return <p>Loading products...</p>
  return <ul>{data.map((p: { id: string; name: string }) => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### 클라이언트 데이터에 Suspense 사용

가까운 Suspense boundary가 로딩 UI를 담당해야 하면 `suspense: true`를 쓴다. 상호작용 shell은 boundary 밖에 두어 결과를 불러오는 동안에도 사용할 수 있게 한다.

```tsx filename="app/product-autocomplete.tsx"
'use client'

import { Suspense } from 'react'
import useSWR from 'swr'

export function Search({ query }: { query: string }) {
  return <Suspense fallback={<p>Loading products...</p>}><Results query={query} /></Suspense>
}

function Results({ query }: { query: string }) {
  const { data } = useSWR(`/api/products?query=${encodeURIComponent(query)}`, fetcher, {
    suspense: true,
  })
  return <pre>{JSON.stringify(data)}</pre>
}
```

조건 없는 key에서는 Suspense가 끝난 뒤 `data`가 정의된다. 초기 요청 오류는 가장 가까운 error boundary가 처리한다. `isLoading`은 표시할 데이터 없이 요청 중일 때만 참이고, `isValidating`은 백그라운드 revalidation을 포함해 요청 중이면 참이다. 같은 key를 다시 검증할 때는 기존 데이터를 유지하므로 `isValidating`으로 갱신 피드백을 표시한다.

> **알아두면 좋은 점**: 형제 컴포넌트의 독립 Suspense 읽기는 병렬로 시작할 수 있지만 한 컴포넌트 안의 여러 Suspense 읽기는 순차 실행된다.

### Server Component에서 초기 데이터 제공

초기 렌더링에 데이터가 필요하면 SWR 2.3.0과 React 19에서 `<SWRConfig fallback>`에 서버의 Promise를 전달할 수 있다. provider는 데이터를 소유한 라우트 세그먼트 가까이에 둔다.

```tsx filename="app/products/[id]/page.tsx"
import { Suspense } from 'react'
import { SWRConfig } from 'swr'

function ProductData({ id }: { id: string }) {
  return (
    <SWRConfig value={{ fallback: { [productCache.key(id)]: getProduct(id) } }}>
      <ProductView id={id} />
    </SWRConfig>
  )
}
```

fallback과 `useSWR`는 정확히 같은 key를 사용해야 한다. React는 await하지 않은 Promise를 RSC Payload로 전달하고, 해당 key를 읽는 컴포넌트만 데이터가 준비될 때까지 suspend한다.

> **알아두면 좋은 점**: fallback key와 `useSWR` key가 다르면 SWR은 fallback을 무시하고 클라이언트에서 요청한다.

fallback은 초기값이며 SWR은 기본적으로 이를 오래된 데이터로 보고 hydration 뒤 브라우저 revalidation을 시작한다. `revalidateIfStale: false`는 캐시 값이 있는 모든 mount에서 revalidation을 건너뛴다. 시간 기반 신선도 창은 제공하지 않으며 focus, 재연결, 폴링, `mutate`는 여전히 key를 revalidate할 수 있다. 브라우저가 호출할 key는 같은 서버 읽기를 사용하는 `GET` Route Handler를 가리킬 수 있다.

### Cache Components로 서버 제공 데이터 캐싱

`cacheComponents`를 활성화한 뒤 서버 읽기에 `'use cache'`, `cacheLife`, `cacheTag`를 적용한다.

```tsx filename="app/products/[id]/data.ts"
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)
  return db.product.findUnique({ where: { id } })
}
```

`stale`은 prefetch한 RSC Payload의 클라이언트 재사용 기간을, `revalidate`와 `expire`는 서버 캐시를 제어한다. SWR 브라우저 캐시는 별도이므로 SWR revalidation 옵션과 `cacheLife`가 같을 필요는 없다. key와 tag를 서버·클라이언트 모두 import 가능한 계약 객체에 모을 수 있다.

### mutation 뒤 서버와 클라이언트 캐시 조정

`mutate`에 쓰기 함수, `optimisticData`, `rollbackOnError`를 제공하면 브라우저 값을 즉시 바꾸고 실패 시 되돌릴 수 있다.

```tsx filename="app/activity/mark-read-button.tsx"
'use client'

import { useSWRConfig } from 'swr'

export function MarkReadButton() {
  const { mutate } = useSWRConfig()
  return <button onClick={() => mutate(activityCache.key, async () => {
    await markActivityReadAction()
    return { count: 0 }
  }, {
    optimisticData: { count: 0 },
    revalidate: false,
    rollbackOnError: true,
    throwOnError: false,
  })}>Mark read</button>
}
```

Server Action은 저장소를 갱신하고 `updateTag(activityCache.tag(userId))`를 호출한다. SWR 낙관적 값은 현재 화면을 바꾸고, `updateTag`는 다음 캐시된 서버 읽기가 새 값을 반환하게 한다.

> **알아두면 좋은 점**: 즉시 보여야 하는 캐시된 읽기를 Server Action이 변경하면 `updateTag`를 호출한다. 캐시되지 않은 읽기에는 갱신할 서버 tag가 없다.

## 예제 및 데모 설계

- Phase 2에서 상품 자동완성과 읽지 않은 알림 카운터를 구현한다.
- 조건부 key, 인라인 로딩, Suspense를 전환해 네트워크 시작 시점을 비교한다.
- 서버 fallback key를 일부러 다르게 만들어 중복 브라우저 요청을 관찰한다.
- 실패하는 Action에서 `rollbackOnError`가 이전 카운터를 복원하는지 확인한다.

## 연습 문제

1. SWR 요청을 입력이 생길 때까지 늦추는 방법은 무엇인가?

   - A. key에 `null`을 사용한다.
   - B. fetcher를 두 번 호출한다.
   - C. `cacheLife`를 없앤다.

   <details><summary>정답 보기</summary>

   정답: A. 조건부 key가 `null`이면 요청을 시작하지 않는다.

   </details>

2. 서버 fallback을 소비하려면 무엇이 일치해야 하는가?

   - A. CSS 클래스
   - B. fallback key와 `useSWR` key
   - C. 컴포넌트 파일명

   <details><summary>정답 보기</summary>

   정답: B. 같은 캐시 정체성을 사용해야 서버 값이 연결된다.

   </details>

3. 낙관적 쓰기 실패 시 이전 값을 복원하는 옵션은 무엇인가?

   - A. `suspense`
   - B. `rollbackOnError`
   - C. `refreshInterval`

   <details><summary>정답 보기</summary>

   정답: B. `rollbackOnError`가 mutation 전 값을 복원한다.

   </details>

## 챕터 요약

- 조건부 SWR key로 클라이언트 요청 시작 시점을 제어한다.
- 인라인 상태와 Suspense는 로딩 UI의 책임 위치가 다르다.
- `<SWRConfig fallback>`과 `useSWR`는 정확히 같은 key를 사용해야 한다.
- SWR 브라우저 캐시와 Next.js 서버 캐시는 독립적으로 신선도를 관리한다.
- `mutate`와 `updateTag`를 조합해 현재 화면과 다음 서버 읽기를 함께 갱신한다.
