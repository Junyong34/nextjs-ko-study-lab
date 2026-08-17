# Form Component

- 공식 문서: [Form Component](https://nextjs.org/docs/app/api-reference/components/form)
- 상위 메뉴: [Components](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `next/form`의 `Form` 컴포넌트가 일반 `<form>`을 확장해 제공하는 세 가지 기능(로딩 UI prefetch, 클라이언트 사이드 내비게이션, progressive enhancement)을 설명한다.
- `action`에 문자열을 전달할 때와 함수(Server Action)를 전달할 때 동작과 사용 가능한 props가 어떻게 달라지는지 구분한다.
- `key`, `onSubmit`, `method`/`encType`/`target`, `<input type="file">` 등에서 `Form`이 일반 `<form>`과 다르게 동작하는 주의할 점을 파악한다.

## 핵심 개념 및 설명

### Form 컴포넌트란

`<Form>` 컴포넌트는 HTML `<form>` 엘리먼트를 확장해 다음 기능을 제공한다.

- **prefetching**: `Form`이 뷰포트에 보이면 `loading.js` 같은 로딩 UI를 미리 [prefetch](../../1-getting-started/linking-and-navigating.md#prefetching)한다.
- **클라이언트 사이드 내비게이션**: 제출 시 전체 페이지를 새로고침하는 대신, 공유 레이아웃과 클라이언트 상태를 유지한 채 새 페이지로 이동한다.
- **progressive enhancement**: JavaScript가 아직 로드되지 않았더라도 서버 사이드 내비게이션으로 폼 제출이 동작한다.

```tsx
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

### action이 문자열일 때와 함수일 때

`Form`에 전달하는 `action` prop의 타입에 따라 동작 방식과 사용 가능한 props가 달라진다.

- `action`이 **문자열**이면, `Form`은 **GET** 메서드로 폼을 제출하는 것처럼 동작한다. 경로는 폼 데이터가 쿼리 파라미터로 인코딩되어 URL에 합쳐지며, 예를 들어 `<Form action="/search">`를 제출하면 `/search?query=abc`로 이동한다. 이동하기 전에도 [`prefetch`](#action이-문자열일-때-props)가 되어 로딩 UI를 미리 가져오고, 이동 자체도 클라이언트 사이드 내비게이션으로 처리된다.
- `action`이 **함수**(Server Function/Server Action)이면, `Form`은 [React의 form action](https://react.dev/reference/react-dom/components/form#props)처럼 동작한다. 제출이 이루어지는 시점에 어떤 요청이 갈지 미리 알 수 없으므로, 문자열 `action`에서만 쓰는 `replace`·`scroll`·`prefetch` props는 무시된다.

#### action이 문자열일 때 Props

| Prop | 예시 | 타입 | 필수 여부 |
| --- | --- | --- | --- |
| `action` | `action="/search"` | `string` | 필수 |
| `replace` | `replace={false}` | `boolean` | - |
| `scroll` | `scroll={true}` | `boolean` | - |
| `prefetch` | `prefetch={true}` | `boolean` | - |

- **`action`**: 이동할 대상 경로 또는 URL을 지정하는 문자열이다. 빈 문자열 `""`은 폼 데이터로 갱신된 쿼리 파라미터와 함께 동일한 라우트로 이동한다.
- **`replace`**: 브라우저 히스토리 스택에 새 URL을 추가하는 대신 현재 히스토리 상태를 대체할지 정한다. 기본값은 `false`다.
- **`scroll`**: 이동 시 스크롤 동작을 제어한다. 기본값은 `true`로, 새 라우트의 맨 위로 스크롤하며 뒤로/앞으로 가기에서는 스크롤 위치를 유지한다.
- **`prefetch`**: 뷰포트에 폼이 보일 때 경로를 prefetch할지 정한다. 기본값은 `true`다.

#### action이 함수일 때 Props

| Prop | 타입 | 필수 여부 |
| --- | --- | --- |
| `action` | `function` | 필수 |

> **알아두면 좋은 점**: `action`이 함수일 때는 `replace`와 `scroll` prop이 무시된다.

### 주의할 점

- `formAction` prop이 설정된 `<button>` 또는 `<input type="submit">`은 `action` prop을 오버라이드한다. 이때는 [`basePath`](../3.5-config/3.5.1-next-config-js/basePath.md)를 고려해야 한다.
- `Form`은 [`key`](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) prop을 지원하지 않는다. 폼을 다시 마운트하거나 상태를 초기화하고 싶다면 `useState`나 `key`를 지원하는 다른 방식을 고려한다.
- `onSubmit`을 사용해 제출을 처리할 수 있지만, `event.preventDefault()`를 호출하면 문자열 `action`으로 지정한 경로로 이동하는 `Form`의 prefetch·내비게이션 동작이 무효화된다.
- `method`, `encType`, `target`은 지원하지 않는다. 대신 각각 `formMethod`, `formEncType`, `formTarget`으로 대체하며, 이 props는 `<button>`이나 `<input type="submit">`에서 오버라이드해서 사용할 수 있다. 이 props를 사용하면 `Form`은 네이티브 브라우저 동작으로 폴백한다.
- `<input type="file">`을 사용할 때 `action`이 문자열이면 브라우저는 파일 이름 대신 파일 객체를 전송한다.

### 사용 예시

#### 검색 결과 페이지로 이동하는 검색 폼

경로를 `action`으로 받아 검색 결과 페이지로 이동하는 검색 폼을 만들 수 있다.

```tsx
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

> **알아두면 좋은 점**: `action`에 빈 문자열 `""`을 전달하면 폼 데이터로 갱신된 쿼리 파라미터와 함께 동일한 라우트로 이동한다.

대상 페이지는 [`searchParams`](../3.1-file-conventions/page.md) prop으로 쿼리 파라미터를 받아 검색 결과를 렌더링한다.

```tsx
import { getSearchResults } from '@/lib/search'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>
}) {
  const { query } = await searchParams
  const results = await getSearchResults(query)

  return <div>...</div>
}
```

`Form`이 보이는 순간 `SearchPage`용 [`loading.js`](../3.1-file-conventions/loading.md) 파일이 prefetch되므로, 사용자가 폼을 제출하면 새 페이지로 이동하는 동안 로딩 UI가 즉시 나타난다.

```tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

prefetch되지 않는 경우를 대비해, [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)로 제출 중 대기 상태를 보여줄 수도 있다.

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export default function SearchButton() {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? 'Searching...' : 'Search'}</button>
  )
}
```

이 버튼을 검색 페이지에서 사용한다.

```tsx
import Form from 'next/form'
import { SearchButton } from '@/ui/search-button'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <SearchButton />
    </Form>
  )
}
```

#### Server Action을 사용한 데이터 변경

`action`에 함수를 전달하면 데이터 변경(mutation)을 수행할 수 있다.

```tsx
import Form from 'next/form'
import { createPost } from '@/posts/actions'

export default function Page() {
  return (
    <Form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

> **알아두면 좋은 점**: `action`이 함수일 때는 실제로 어떤 요청이 갈지 사전에 알 수 없으므로, `Form`은 대상 경로를 prefetch하지 않는다.

Server Function은 [Server Function](../../1-getting-started/mutating-data.md)으로 정의하며, 아래처럼 성공 시 `redirect`로 새 페이지로 이동시킬 수 있다.

```tsx
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // 게시물 생성
  const id = await createPostInDb(formData)
  // 새로 생성된 게시물 페이지로 리다이렉트
  redirect(`/posts/${id}`)
}
```

리다이렉트 대상 페이지는 [`params`](../3.1-file-conventions/page.md) prop으로 라우트 세그먼트 값을 받는다.

```tsx
import { getPost } from '@/posts/data'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <div>{post.title}</div>
}
```

더 많은 예제는 [Mutating data](../../1-getting-started/mutating-data.md) 문서를 참고한다.

## 예제 및 데모 설계

- Phase 2에서 문자열 `action`으로 검색어를 쿼리 파라미터에 담아 결과 페이지로 이동하는 검색 폼을 구현한다.
- `loading.js`를 배치해 `Form`이 뷰포트에 들어올 때 prefetch가 일어나는지, 제출 시 로딩 UI가 즉시 나타나는지 비교한다.
- `useFormStatus`로 제출 대기 상태를 표시하는 버튼을 구현해, prefetch가 되지 않는 경우의 대체 UX를 확인한다.
- Server Action을 `action`으로 전달해 게시물을 생성하고, 생성 후 `redirect`로 상세 페이지로 이동하는 데이터 변경 예제를 구현한다.

## 연습 문제

1. `<Form action="/search">`와 `<Form action={createPost}>`의 동작 차이로 옳은 것은?

   <details><summary>정답 보기</summary>

   문자열 `action`은 GET 방식 폼 제출처럼 동작해 폼 데이터를 쿼리 파라미터로 URL에 인코딩하고, 이동 전에 대상 경로를 prefetch한다. 함수 `action`은 React의 form action(Server Function)으로 동작하며, 어떤 요청이 갈지 미리 알 수 없어 prefetch되지 않는다.

   </details>

2. `action`에 함수를 전달했을 때 `replace`와 `scroll` prop을 함께 사용하면 어떻게 되는가?

   <details><summary>정답 보기</summary>

   두 prop 모두 무시된다. `replace`와 `scroll`은 문자열 `action`에서 이동 대상 경로를 미리 알 수 있을 때만 의미가 있는 prop이기 때문이다.

   </details>

3. `Form`에서 `onSubmit` 핸들러 안에서 `event.preventDefault()`를 호출하면 어떤 문제가 생길 수 있는가?

   <details><summary>정답 보기</summary>

   `preventDefault()`가 기본 제출 동작을 막으면, 문자열 `action`으로 지정한 경로로 이동하는 `Form`의 prefetch·클라이언트 사이드 내비게이션 동작이 함께 무효화된다.

   </details>

## 챕터 요약

- `Form`은 `<form>`을 확장해 prefetch, 클라이언트 사이드 내비게이션, progressive enhancement를 제공한다.
- `action`이 문자열이면 GET 방식 이동처럼 동작하며 `replace`·`scroll`·`prefetch` props를 사용할 수 있고, 함수이면 Server Function으로 동작하며 이 세 props는 무시된다.
- `formAction`으로 `action`을 오버라이드할 때는 `basePath`를 고려해야 하며, `key` prop은 지원하지 않는다.
- `method`/`encType`/`target`은 지원하지 않고 `formMethod`/`formEncType`/`formTarget`으로 대체하며, `onSubmit`에서 `preventDefault()`를 쓰면 `Form`의 내비게이션 최적화가 무효화된다.
- 검색 폼(문자열 action)과 데이터 변경 폼(함수 action) 두 가지 대표 패턴을 통해 각각의 사용 시나리오를 익힐 수 있다.
