# updateTag

- 공식 문서: [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [Server Action](../../2-guides/2.14-server-actions.md) 내부에서 특정 캐시 태그를 즉시 만료시키는 `updateTag` 함수의 역할을 이해한다.
- 사용자가 데이터를 수정한 직후 변경 사항을 즉시 확인할 수 있도록 지원하는 **Read-your-own-writes** 패턴을 구현한다.
- `updateTag`와 [`revalidateTag`](./revalidateTag.md)의 동작 차이(동기적 즉시 만료 vs 백그라운드 SWR 갱신)를 구분한다.
- `updateTag`가 Server Action 전용 함수이며 Route Handler에서는 `revalidateTag`를 사용해야 하는 제약 조건을 파악한다.

## 핵심 개념 및 설명

`updateTag`는 [Server Action](../../2-guides/2.14-server-actions.md) 내부에서 특정 캐시 태그가 지정된 데이터를 온디맨드로 업데이트할 수 있게 해주는 함수다.

사용자가 게시물을 작성하거나 상태를 수정한 직후, 오래된(stale) 캐시가 아닌 최신 변경 결과를 즉시 확인해야 하는 **Read-your-own-writes** 시나리오를 위해 설계되었다.

### 실행 환경 및 제약 조건 (Usage)

`updateTag`는 **오직 [Server Action](../../2-guides/2.14-server-actions.md) 내부에서만 호출**될 수 있다. Route Handler, Client Component, 기타 컨텍스트에서 호출할 경우 에러가 발생한다.

Route Handler나 웹훅 컨텍스트에서 캐시 태그를 무효화해야 하는 경우에는 [`revalidateTag`](./revalidateTag.md)를 사용해야 한다.

> **알아두면 좋은 점**:
> `updateTag`는 지정한 태그의 캐시 데이터를 즉시 만료시킨다. 다음 요청은 오래된 콘텐츠를 캐시에서 서빙하지 않고 새 데이터를 가져올 때까지 기다리므로, 사용자가 변경 사항을 지연 없이 즉각적으로 볼 수 있다.

### 매개변수 (Parameters)

```tsx
updateTag(tag: string): void
```

- `tag`: 업데이트하려는 데이터와 연결된 캐시 태그 문자열(최대 256자, 대소문자 구분).

### `updateTag`와 `revalidateTag`의 차이점

| 특성 | `updateTag` | `revalidateTag` |
|---|---|---|
| **호출 가능 컨텍스트** | **Server Action 전용** | Server Action 및 Route Handler |
| **다음 요청 동작** | **새 데이터가 준비될 때까지 대기 (즉시 만료)** | 이전 캐시를 먼저 서빙하고 백그라운드 갱신 (`profile="max"`) |
| **주요 사용 사례** | 폼 제출, 결제, 상태 변경 등 즉각 반영 필요 시 | CMS 글 발행 웹훅, 카탈로그 동기화, 주기적 백그라운드 갱신 |

### 예제

#### Server Action에서 Read-Your-Own-Writes 구현

```ts filename="app/actions.ts" switcher
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // 데이터베이스에 글 저장
  const post = await db.post.create({
    data: { title, content },
  })

  // 관련 캐시 태그 즉시 만료
  // 'posts' 태그: 전체 글 목록 페이지에 영향
  updateTag('posts')
  // `post-${id}` 태그: 개별 글 상세 페이지에 영향
  updateTag(`post-${post.id}`)

  // 새 글 상세 페이지로 이동 (사용자는 캐시가 아닌 최신 데이터를 즉시 보게 됨)
  redirect(`/posts/${post.id}`)
}
```

```js filename="app/actions.js" switcher
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const post = await db.post.create({
    data: { title, content },
  })

  updateTag('posts')
  updateTag(`post-${post.id}`)

  redirect(`/posts/${post.id}`)
}
```

#### Route Handler에서 호출 시의 에러 처리

```ts filename="app/api/posts/route.ts" switcher
import { revalidateTag, updateTag } from 'next/cache'

export async function POST() {
  // ❌ Route Handler에서 updateTag 호출 시 에러 발생
  // updateTag('posts')

  // ⭕ Route Handler에서는 revalidateTag를 사용해야 한다
  revalidateTag('posts', 'max')
  return Response.json({ success: true })
}
```

## 예제 및 데모 설계

- 폼 제출 Server Action에서 `updateTag('todos')`를 호출하고, 완료 직후 목록 페이지로 리다이렉트되었을 때 새 항목이 즉시 노출되는지 확인한다.
- Route Handler 내부에서 `updateTag()`를 호출했을 때 발생하는 런타임 예외를 확인하고 `revalidateTag()`로 수정하는 검증을 수행한다.
- `updateTag` 호출 시 클라이언트 라우터 캐시가 즉시 우회되는지 테스트한다.

## 연습 문제

1. `updateTag` 함수를 호출할 수 있는 유일한 컨텍스트는?
   - A. Client Component의 이벤트 핸들러
   - B. Server Action
   - C. Route Handler (GET/POST)
   - D. `middleware.ts` (Proxy)

<details><summary>정답 보기</summary>

정답: **B**  
해설: `updateTag`는 Server Action 전용 함수로 설계되었으며, Route Handler나 다른 컨텍스트에서는 사용할 수 없다.
</details>

2. `updateTag`가 `revalidateTag(..., 'max')`와 구별되는 주된 동작 특성은?
   - A. 백그라운드에서 조용히 갱신하며 이전 캐시를 계속 보여준다.
   - B. 캐시를 즉시 만료시켜 다음 요청에서 반드시 새 데이터를 동기적으로 조회하여 반환한다.
   - C. 전체 데이터베이스를 초기화한다.
   - D. 클라이언트 번들 크기를 줄인다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `updateTag`는 캐시 항목을 즉시 만료시켜 다음 요청이 이전 캐시를 서빙하지 않고 새 데이터를 받아오도록 보장하여 변경 사항의 즉각적인 반영을 가능하게 한다.
</details>

## 챕터 요약

- `updateTag`는 Server Action 내부에서 특정 캐시 태그의 데이터를 즉시 만료시키는 함수다.
- 사용자의 수정 작업 직후 최신 결과를 바로 보여주어야 하는 Read-your-own-writes 패턴에 사용된다.
- Route Handler에서는 사용할 수 없으며 대신 `revalidateTag`를 사용해야 한다.
- `updateTag` 호출 시 다음 요청은 이전 캐시를 반환하지 않고 새 데이터를 기다려 가져온다.
- `cacheTag` 또는 `fetch`의 `next.tags`로 지정된 태그를 인자로 받는다.
