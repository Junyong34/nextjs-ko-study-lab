# page.js

- 공식 문서: [page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `page.js`가 라우트를 공개하고 고유 UI를 정의하는 규칙을 이해한다.
- Promise인 `params`와 `searchParams`의 타입과 렌더링 영향을 구분한다.
- `PageProps`와 Server/Client Component에서의 접근법을 적용한다.

## 핵심 개념 및 설명

`page` 파일을 사용하면 경로에 **고유한** UI를 정의할 수 있다. 기본적으로 파일에서 컴포넌트를 내보내는 페이지를 만들 수 있다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <h1>My Page</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params, searchParams }) {
  return <h1>My Page</h1>
}
```

<a id="good-to-know"></a>
### 알아두면 좋은 점

- `.js`,`.jsx` 또는 `.tsx` 파일 확장자를 `page`에 사용할 수 있다.
- `page`는 항상 경로 하위 트리의 **리프**이다.
- 라우트 세그먼트를 **공개적으로 액세스**하려면 `page` 파일이 필요하다.
- 페이지는 기본적으로 [Server Component](https://react.dev/reference/rsc/server-components)이지만 [Client Component](https://react.dev/reference/rsc/use-client)로 설정할 수 있다.
- [컴포넌트 계층 구조](../../1-getting-started/project-structure.md#component-hierarchy)에서 `page.js`는 가장 안쪽 파일 규칙이다. 동일한 세그먼트에서 `loading.js`(서스펜스 경계),`error.js`(오류 경계),`template.js` 및 `layout.js`로 래핑된다.

<a id="reference"></a>
### 참조

<a id="props"></a>
#### prop

<a id="params-optional"></a>
##### `params`(옵션)

루트 세그먼트부터 해당 페이지까지 [다이나믹 라우트 매개변수](dynamic-routes.md)를 포함하는 객체로 확인되는 Promise이다.

```tsx filename="app/shop/[slug]/page.tsx" switcher
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

```jsx filename="app/shop/[slug]/page.js" switcher
export default async function Page({ params }) {
  const { slug } = await params
}
```

| 예시 경로 | URL | `params` |
| ------------------------------------ | ----------- | --------------------------------------- |
| `app/shop/[slug]/page.js` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[category]/[item]/page.js` | `/shop/1/2` | `Promise<{ category: '1', item: '2' }>` |
| `app/shop/[...slug]/page.js` | `/shop/1/2` | `Promise<{ slug: ['1', '2'] }>` |

- `params`prop은 promise이므로 값에 액세스하려면 `async/await` 또는 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용해야 한다.
  - 버전 14 이하에서는 `params`가 동기식 prop이었다. 이전 버전과의 호환성을 돕기 위해 Next.js 15에서는 여전히 동기적으로 액세스할 수 있지만 이 동작은 앞으로 더 이상 사용되지 않는다.

<a id="searchparams-optional"></a>
##### `searchParams`(옵션)

현재 URL의 [검색 매개변수](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters)를 포함하는 객체로 확인되는 Promise이다. 예를 들어:

```tsx filename="app/shop/page.tsx" switcher
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

```jsx filename="app/shop/page.js" switcher
export default async function Page({ searchParams }) {
  const filters = (await searchParams).filters
}
```

Client Component **페이지**는 React의 [`use`](https://react.dev/reference/react/use) 후크를 사용하여 `searchParams`에 액세스할 수도 있다.

```tsx filename="app/shop/page.tsx" switcher
'use client'
import { use } from 'react'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = use(searchParams).filters
}
```

```jsx filename="app/page.jsx" switcher
'use client'
import { use } from 'react'

export default function Page({ searchParams }) {
  const filters = use(searchParams).filters
}
```

| 예시 URL | `searchParams` |
| --------------- | ----------------------------- |
| `/shop?a=1` | `Promise<{ a: '1' }>` |
| `/shop?a=1&b=2` | `Promise<{ a: '1', b: '2' }>` |
| `/shop?a=1&a=2` | `Promise<{ a: ['1', '2'] }>` |

- `searchParams` prop은 Promise이기 때문이다. 값에 접근하려면 `async/await` 또는 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용해야 한다.
  - 버전 14 이하에서는 `searchParams`가 동기식 prop이었다. 이전 버전과의 호환성을 돕기 위해 Next.js 15에서는 여전히 동기적으로 액세스할 수 있지만 이 동작은 앞으로 더 이상 사용되지 않는다.
- `searchParams`는 값을 미리 알 수 없는 **[요청 시점 API](../../4-glossary/README.md#request-time-apis)**이다. 이를 사용하면 요청 시 페이지가 **[다이나믹 렌더링](../../4-glossary/README.md#dynamic-rendering)**으로 선택된다.
- [Cache Components](../../1-getting-started/caching.md)를 사용하면 컴포넌트 트리에서 `searchParams`에 액세스하여 prerendering할 수 있는 페이지의 양이 결정된다. [static shell 최대화](../../1-getting-started/caching.md#maximizing-the-static-shell)를 참조한다.
- `searchParams`는 `URLSearchParams` 인스턴스가 아닌 일반 JavaScript 객체이다.

<a id="page-props-helper"></a>
#### 페이지 prop 도우미

`PageProps`로 페이지를 입력하여 경로 리터럴에서 강력한 형식의 `params` 및 `searchParams`를 얻을 수 있다.`PageProps`는 전역에서 사용할 수 있는 도우미이다.

```tsx filename="app/blog/[slug]/page.tsx"
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

> **알아두면 좋은 점**:
>
> - 리터럴 경로(예:`'/blog/[slug]'`)를 사용하면 `params`에 대한 자동 완성 및 엄격한 키가 활성화된다.
> - 정적 경로는 `params`를 `{}`로 확인한다.
> - 유형은 `next dev`,`next build` 또는 `next typegen`를 사용하여 생성된다.
> - 유형 생성 후 `PageProps`도우미를 전역적으로 사용할 수 있다. 수입할 필요는 없다.

<a id="examples"></a>
### 예제

<a id="displaying-content-based-on-params"></a>
#### `params`를 기반으로 콘텐츠 표시

[다이나믹 라우트 세그먼트](dynamic-routes.md)를 사용하면 `params` prop을 기반으로 페이지의 특정 콘텐츠를 표시하거나 가져올 수 있다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default async function Page({ params }) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

<a id="handling-filtering-with-searchparams"></a>
#### `searchParams`를 사용한 필터링 처리

`searchParams` prop을 사용하여 URL의 쿼리 문자열을 기반으로 필터링, 페이지 매김 또는 정렬을 처리할 수 있다.

```tsx filename="app/shop/page.tsx" switcher
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams

  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

```jsx filename="app/shop/page.js" switcher
export default async function Page({ searchParams }) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams

  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

<a id="reading-searchparams-and-params-in-client-components"></a>
#### Client Component에서 `searchParams` 및 `params` 읽기

Client Component(`async` 일 수 없음)에서 `searchParams` 및 `params`를 사용하려면 React의 [`use`](https://react.dev/reference/react/use) 함수를 사용하여 Promise를 읽을 수 있다.

```tsx filename="app/page.tsx" switcher
'use client'

import { use } from 'react'

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)
  const { query } = use(searchParams)
}
```

```js filename="app/page.js" switcher
'use client'

import { use } from 'react'

export default function Page({ params, searchParams }) {
  const { slug } = use(params)
  const { query } = use(searchParams)
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `v15.0.0-RC` | `params` 및 `searchParams`는 이제 Promise이다. [codemod](../../2-guides/2.64-upgrading/codemods.md#150)를 사용할 수 있다. |
| `v13.0.0` | `page`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 `/products/[slug]?sort=asc` page를 만들고 `params`와 `searchParams` 결과를 나란히 표시한다.
- `searchParams` 접근 위치를 Suspense 안팎으로 옮겨 static shell 범위를 비교한다.
- Client Component page에서 `use(params)`를 사용하는 예제를 추가한다.

## 연습 문제

1. 라우트 세그먼트를 공개적으로 접근 가능하게 만드는 파일은?
   - A. `layout.js`
   - B. `page.js`
   - C. `template.js`

<details><summary>정답 보기</summary>

정답: B. 세그먼트에는 공개 UI를 위한 page 파일이 필요하다.
</details>

2. `searchParams`에 대한 설명으로 맞는 것은?
   - A. `URLSearchParams` 인스턴스다.
   - B. 빌드 때 항상 결정된다.
   - C. Promise로 전달되는 Request-time API다.

<details><summary>정답 보기</summary>

정답: C. 요청마다 달라질 수 있어 다이나믹 렌더링에 영향을 준다.
</details>

## 챕터 요약

- `page.js`는 라우트의 고유 UI와 공개 접근 지점을 정의한다.
- page는 같은 세그먼트 컴포넌트 계층의 가장 안쪽에 있다.
- `params`와 `searchParams`는 Promise다.
- `searchParams` 사용은 요청 시점 렌더링에 영향을 준다.
- `PageProps`는 route literal에서 전역 타입을 생성한다.
