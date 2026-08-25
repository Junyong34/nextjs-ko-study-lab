# refresh

- 공식 문서: [refresh](https://nextjs.org/docs/app/api-reference/functions/refresh)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Server Action](../../2-guides/server-actions.md) 내부에서 클라이언트 라우터를 새로고침(Refresh)하도록 지시하는 `refresh` 함수의 역할을 이해한다.
- `refresh`가 Server Action 전용 함수이며 Route Handler나 Client Component에서는 직접 호출할 수 없음을 인지한다.
- 데이터 뮤테이션 완료 후 현재 화면의 Server Component 트리를 최신 상태로 다시 불러오는 동작 원리를 파악한다.
- [`revalidatePath`](./revalidatePath.md) 및 [`updateTag`](./updateTag.md)와의 사용 구분점을 이해한다.

## 핵심 개념 및 설명

`refresh`는 [Server Action](../../2-guides/server-actions.md) 실행 완료 후, 클라이언트 라우터(Client Router)가 현재 페이지의 데이터를 서버로부터 새로고침하도록 요청하는 함수다.

```ts filename="app/actions.ts" switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // 데이터베이스에 글 저장
  await db.post.create({
    data: { title, content },
  })

  // 클라이언트 라우터 새로고침 트리거
  refresh()
}
```

```js filename="app/actions.js" switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  await db.post.create({
    data: { title, content },
  })

  refresh()
}
```

> **알아두면 좋은 점**:
>
> - `refresh()`는 **오직 Server Action 내부에서만 호출**될 수 있다. Route Handler나 Client Component에서 호출하면 런타임 에러가 발생한다.
> - Client Component에서 라우터를 새로고침해야 하는 경우에는 [`useRouter`](./use-router.md) 훅의 `router.refresh()`를 사용해야 한다.

### 시그니처 (Parameters & Returns)

```tsx filename="app/actions.ts"
refresh(): void
```

매개변수를 받지 않으며 반환값이 없다.

### Route Handler에서 호출 시의 에러

```ts filename="app/api/posts/route.ts" switcher
import { refresh } from 'next/cache'

export async function POST() {
  // ❌ Route Handler에서 refresh() 호출 시 런타임 에러 발생
  refresh()
}
```

## 예제 및 데모 설계

- 할 일(Todo) 완료 토글 Server Action에서 `refresh()`를 호출하여 현재 페이지의 목록 상태가 즉시 최신화되는 데모를 구성한다.
- Client Component의 `router.refresh()`와 Server Action의 `refresh()` 동작 일치성을 비교한다.
- Route Handler 내부에서 `refresh()` 호출 시 발생하는 예외를 확인한다.

## 연습 문제

1. `next/cache`의 `refresh()` 함수를 호출할 수 있는 유일한 컨텍스트는?
   - A. Server Action
   - B. Route Handler
   - C. 미들웨어 (`proxy.ts`)
   - D. `next.config.js`

<details><summary>정답 보기</summary>

정답: **A**  
해설: `refresh()`는 Server Action 전용 함수로 설계되어 있어, 액션 실행 후 클라이언트 라우터의 갱신을 지시한다.
</details>

2. Client Component 내부의 이벤트 핸들러에서 라우터를 새로고침하고자 할 때 사용해야 하는 올바른 방법은?
   - A. `next/cache`의 `refresh()` 함수 직접 호출
   - B. `useRouter()` 훅의 `router.refresh()` 메서드 호출
   - C. `window.location.reload()`
   - D. `revalidateTag()` 호출

<details><summary>정답 보기</summary>

정답: **B**  
해설: Client Component에서는 `useRouter()` 훅이 제공하는 `router.refresh()`를 사용하여 클라이언트 사이드 새로고침을 수행한다.
</details>

## 챕터 요약

- `refresh`는 Server Action 내부에서 클라이언트 라우터 새로고침을 지시하는 `next/cache`의 함수다.
- Server Action 전용 함수이며 Route Handler에서는 호출할 수 없다.
- 매개변수가 없으며 단일 서버 왕복 모델에서 화면을 최신화한다.
- Client Component에서는 `useRouter().refresh()`를 사용한다.
