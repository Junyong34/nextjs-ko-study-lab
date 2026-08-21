# Mutating Data

- 공식 문서: [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Server Function(Server Action)이 무엇이고 `'use server'`로 어떻게 정의하는지 설명할 수 있다.
- 폼의 `action`/`formAction`, 이벤트 핸들러 두 가지 방식으로 Server Function을 호출할 수 있다.
- 변경 후 UI를 갱신하는 세 가지 방법(`refresh`, `revalidatePath`/`revalidateTag`, `redirect`)을 구분할 수 있다.
- Server Function 안에서 쿠키를 다루고, 대기 상태(`useActionState`)를 보여줄 수 있다.

## 핵심 개념 및 설명

Next.js에서는 [React Server Functions](https://react.dev/reference/rsc/server-functions)로 데이터를 변경(mutate)할 수 있다. 이 문서는 Server Function을 [만들고](#server-function-만들기) [호출하는](#server-function-호출하기) 방법을 다룬다. Next.js 특화 동작(단일 라운드트립 응답, 순차 디스패치, 보안, 배포)은 [Server Actions and Mutations](../2-guides/server-actions.md)를 참고한다.

### Server Function이란?

**Server Function**은 서버에서 실행되는 비동기 함수다. 클라이언트에서 네트워크 요청으로 호출하기 때문에 반드시 비동기여야 한다.

`action`이나 mutation 컨텍스트에서는 **Server Action**이라고도 부른다.

관례상 Server Action은 [`startTransition`](https://react.dev/reference/react/startTransition)과 함께 쓰이는 비동기 함수다. 다음 경우엔 자동으로 그렇게 된다.

- `<form>`의 `action` prop에 전달됐을 때
- `<button>`의 `formAction` prop에 전달됐을 때

action이 호출되면, Next.js는 갱신된 UI와 새 데이터를 한 번의 서버 라운드트립으로 반환할 수 있다.

내부적으로 action은 `POST` 메서드를 쓰며, 이 메서드로만 호출할 수 있다.

Server Function은 애플리케이션 UI뿐 아니라 직접적인 POST 요청으로도 도달할 수 있다. 그러니 모든 Server Function 안에서 항상 인증·인가를 검증해야 한다. 권장 패턴은 [Data Security 가이드](../2-guides/data-security.md#authentication-and-authorization)를 참고한다.

> **알아두면 좋은 점**: Server Action은 폼 제출과 mutation을 다루는 특정 방식으로 쓰인 Server Function이다. Server Function은 더 넓은 개념이다.

### Server Function 만들기

Server Function은 [`use server`](https://react.dev/reference/rsc/use-server) 지시어로 정의한다. **비동기** 함수 맨 위에 지시어를 붙여 그 함수를 Server Function으로 마킹할 수도 있고, 별도 파일 맨 위에 붙여 그 파일의 모든 export를 마킹할 수도 있다.

```tsx filename="app/lib/actions.ts"
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // 데이터 변경
  // 캐시 revalidation
}

export async function deletePost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')

  // 이 리소스의 소유자인지 삭제 전에 검증
  // 데이터 변경
  // 캐시 revalidation
}
```

#### Server Components

Server Component 안에서 함수 본문 맨 위에 `"use server"` 지시어를 추가하면 Server Function을 인라인으로 정의할 수 있다.

```tsx filename="app/page.tsx"
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }

  return <></>
}
```

> **알아두면 좋은 점**: Server Component는 기본적으로 progressive enhancement를 지원한다. 즉 JavaScript가 아직 로드되지 않았거나 비활성화된 상태에서도 Server Action을 호출하는 폼은 제출된다.

#### Client Components

Client Component 안에서 Server Function을 정의할 수는 없다. 다만 맨 위에 `"use server"` 지시어가 있는 파일에서 import하면 Client Component에서도 호출할 수 있다.

```tsx filename="app/actions.ts"
'use server'

export async function createPost() {}
```

```tsx filename="app/ui/button.tsx"
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

> **알아두면 좋은 점**: Client Component에서는, JavaScript가 아직 로드되지 않았어도 Server Action을 호출하는 폼 제출이 큐에 쌓이고 hydration이 우선적으로 처리된다. hydration이 끝나면 브라우저는 폼 제출 시 새로고침하지 않는다.

#### action을 prop으로 전달하기

Client Component에 action을 prop으로도 전달할 수 있다.

```tsx filename="app/client-component.tsx"
<ClientComponent updateItemAction={updateItem} />
```

```tsx filename="app/client-component.tsx"
'use client'

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

### Server Function 호출하기

Server Function을 호출하는 주된 방법은 두 가지다.

1. Server/Client Component 안의 [폼](#폼)
2. Client Component의 [이벤트 핸들러](#이벤트-핸들러)와 [useEffect](#useeffect)

> **알아두면 좋은 점**: Server Function은 서버 사이드 mutation을 위해 설계됐다. 클라이언트는 현재 한 번에 하나씩 순서대로 디스패치하고 기다린다. 이는 구현 세부사항이라 나중에 바뀔 수 있다. 병렬 데이터 fetching이 필요하면 Server Component에서 [데이터 fetching](./fetching-data.md)을 쓰거나, 하나의 Server Function이나 [Route Handler](../2-guides/backend-for-frontend.md#manipulating-data) 안에서 병렬 작업을 수행한다.

#### 폼

React는 HTML [`<form>`](https://react.dev/reference/react-dom/components/form) 엘리먼트를 확장해서 `action` prop으로 Server Function을 호출할 수 있게 한다.

폼에서 호출되면, 함수는 자동으로 [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) 객체를 받는다. 네이티브 [`FormData` 메서드](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods)로 데이터를 꺼낼 수 있다.

```tsx filename="app/ui/form.tsx"
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```tsx filename="app/actions.ts"
'use server'

import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // 데이터 변경
  // 캐시 revalidation
}
```

#### 이벤트 핸들러

Client Component에서는 `onClick` 같은 이벤트 핸들러로 Server Function을 호출할 수 있다.

```tsx filename="app/like-button.tsx"
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

## 예시

### 대기 상태 보여주기

Server Function을 실행하는 동안, React의 [`useActionState`](https://react.dev/reference/react/useActionState) 훅으로 로딩 인디케이터를 보여줄 수 있다. 이 훅은 `pending` boolean을 반환한다.

```tsx filename="app/ui/button.tsx"
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

대기 피드백, optimistic UI, transition, 에러 처리를 포함한 반응성 있는 인터랙션의 더 깊은 설명은 [Building interactive apps 가이드](../2-guides/interactive-apps.md)를 참고한다.

> **알아두면 좋은 점**: **실험적인** [`useOffline`](../2-guides/offline-support.md) 설정을 켜면, 연결이 끊겨 중단된 Server Action이 대기 상태를 유지하다가 네트워크가 돌아오면 이어서 완료된다.

### 데이터 새로고침하기

mutation 이후, 최신 데이터를 보여주기 위해 현재 페이지를 새로고침하고 싶을 때가 있다. Server Action 안에서 `next/cache`의 [`refresh`](../3-api-reference/3.3-functions/refresh.md)를 호출하면 된다.

```tsx filename="app/lib/actions.ts"
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // 데이터 변경
  // ...

  refresh()
}
```

이는 클라이언트 라우터를 새로고침해서 UI가 최신 상태를 반영하게 한다. `refresh()`는 태그가 붙은 데이터를 revalidate하지 않는다. 태그된 데이터를 revalidate하려면 [`updateTag`](../3-api-reference/3.3-functions/updateTag.md)나 [`revalidateTag`](../3-api-reference/3.3-functions/revalidateTag.md)를 쓴다.

### 데이터 revalidate하기

mutation을 수행한 뒤, Server Function 안에서 [`revalidatePath`](../3-api-reference/3.3-functions/revalidatePath.md)나 [`revalidateTag`](../3-api-reference/3.3-functions/revalidateTag.md)를 호출해서 Next.js 캐시를 revalidate하고 갱신된 데이터를 보여줄 수 있다.

```tsx filename="app/lib/actions.ts"
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // 데이터 변경
  // ...

  revalidatePath('/posts')
}
```

### mutation 이후 리다이렉트하기

mutation 이후 사용자를 다른 페이지로 리다이렉트하고 싶을 때가 있다. Server Function 안에서 [`redirect`](../3-api-reference/3.3-functions/redirect.md)를 호출하면 된다.

```tsx filename="app/lib/actions.ts"
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // 데이터 변경
  // ...

  revalidatePath('/posts')
  redirect('/posts')
}
```

`redirect`를 호출하면 프레임워크가 처리하는 [제어 흐름 예외를 던진다](../3-api-reference/3.3-functions/redirect.md#behavior). 그 뒤의 코드는 실행되지 않는다. 최신 데이터가 필요하면 그 전에 `revalidatePath`나 `revalidateTag`를 호출한다.

### 쿠키

[`cookies`](../3-api-reference/3.3-functions/cookies.md) API로 Server Action 안에서 쿠키를 `get`, `set`, `delete`할 수 있다.

Server Action에서 쿠키를 [설정하거나 삭제](../3-api-reference/3.3-functions/cookies.md)하면, Next.js는 현재 페이지와 그 레이아웃을 서버에서 다시 렌더링해서 **UI가 새 쿠키 값을 반영**하게 한다.

> **알아두면 좋은 점**: 서버 갱신은 현재 React 트리에 적용되어, 필요에 따라 컴포넌트를 다시 렌더링·마운트·언마운트한다. 다시 렌더링되는 컴포넌트의 클라이언트 상태는 보존되고, 의존성이 바뀐 effect는 다시 실행된다.

```tsx filename="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // 쿠키 가져오기
  cookieStore.get('name')?.value

  // 쿠키 설정하기
  cookieStore.set('name', 'Delba')

  // 쿠키 삭제하기
  cookieStore.delete('name')
}
```

### `useEffect`

컴포넌트가 마운트되거나 의존성이 바뀔 때 Server Action을 호출하려면 React [`useEffect`](https://react.dev/reference/react/useEffect) 훅을 쓸 수 있다. 전역 이벤트에 의존하거나 자동으로 트리거되어야 하는 mutation에 유용하다. 예를 들어 앱 단축키를 위한 `onKeyDown`, 무한 스크롤을 위한 intersection observer 훅, 또는 조회수를 갱신하기 위해 컴포넌트가 마운트될 때.

```tsx filename="app/view-count.tsx"
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  // isPending으로 사용자에게 피드백을 줄 수 있다
  return <p>Total Views: {views}</p>
}
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 폼 제출로 Server Function을 호출하고, `revalidatePath`로 목록이 즉시 갱신되는 것을 보여준다.
- 사용자가 확인할 화면과 상호작용: JavaScript를 끈 상태에서도 폼 제출이 동작하는지(progressive enhancement) 확인, `useActionState`로 만든 대기 상태 UI 확인.
- 예제에서 관찰할 결과: `revalidatePath` 호출 전/후 목록 데이터가 갱신되는 타이밍, `redirect` 호출 이후 코드가 실행되지 않는 것.

## 연습 문제

**Q1. (단일 선택) Server Function을 Client Component 안에서 직접 정의할 수 있는가?**

1. 가능하다, `'use server'`를 컴포넌트 함수 위에 붙이면 된다.
2. 불가능하다, `'use server'` 파일에서 import해야 한다.
3. 가능하다, 단 `async` 키워드는 필요 없다.
4. Server Component에서만 애초에 필요 없는 개념이다.

<details>
<summary>정답 보기</summary>

**정답: 2** — Client Component 안에서는 Server Function을 정의할 수 없다. `"use server"`가 파일 맨 위에 있는 별도 파일에서 import해서 호출해야 한다.

</details>

**Q2. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] `redirect()`를 호출한 뒤의 코드는 계속 실행된다.
- [ ] Server Action은 내부적으로 `POST` 메서드만 사용해 호출된다.
- [ ] Server Action에서 쿠키를 설정하면 Next.js가 현재 페이지와 레이아웃을 다시 렌더링한다.
- [ ] `refresh()`는 태그가 붙은 데이터를 revalidate한다.

<details>
<summary>정답 보기</summary>

**정답: 2, 3** — `redirect()`는 제어 흐름 예외를 던져 이후 코드를 실행하지 않으며, `refresh()`는 태그 revalidation과 무관하게 클라이언트 라우터만 새로고침한다.

</details>

**Q3. (단일 선택) mutation 후 특정 경로의 캐시된 데이터를 태그와 무관하게 무효화하고 싶을 때 쓰는 함수는?**

1. `refresh()`
2. `redirect()`
3. `revalidatePath()`
4. `useActionState()`

<details>
<summary>정답 보기</summary>

**정답: 3** — `revalidatePath`는 어떤 태그가 연관되어 있는지 몰라도 특정 라우트 경로의 캐시된 데이터를 revalidate한다.

</details>

## 요약

- Server Function은 `'use server'`로 정의하는 서버에서 실행되는 비동기 함수이며, 폼 mutation 맥락에서는 Server Action이라고 부른다.
- Client Component에서 Server Function을 직접 정의할 수는 없지만, `"use server"` 파일에서 import해 폼이나 이벤트 핸들러로 호출할 수 있다.
- mutation 이후 UI를 갱신하는 방법은 `refresh()`(라우터만 새로고침), `revalidatePath`/`revalidateTag`(캐시 revalidation), `redirect()`(다른 페이지로 이동) 세 가지다.
- Server Action에서 쿠키를 설정·삭제하면 Next.js가 현재 페이지와 레이아웃을 다시 렌더링해 UI에 반영한다.
- `useActionState`로 대기 상태를 보여주고, `useEffect`로 마운트 시점이나 의존성 변화에 맞춰 Server Action을 자동으로 트리거할 수 있다.
