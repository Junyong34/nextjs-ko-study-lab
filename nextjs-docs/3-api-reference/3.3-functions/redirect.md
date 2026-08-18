# redirect

- 공식 문서: [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 사용자를 다른 내부 또는 외부 URL로 리다이렉트하는 `redirect` 함수의 동작 방식과 사용법을 익힌다.
- 기본 임시 리다이렉트 상태코드인 HTTP 307과 전통적인 302 상태코드의 차이점(HTTP 메서드 보존)을 이해한다.
- Server Component, Client Component, Server Action, Route Handler 등 다양한 컨텍스트에서의 동작 차이를 구분한다.
- `redirect`가 예외를 던지는 특성으로 인해 `try/catch` 블록 외부에서 호출되어야 하는 규칙을 적용한다.

## 핵심 개념 및 설명

`redirect` 함수는 사용자를 다른 URL로 이동시킬 때 사용하는 내장 유틸리티다.

[Server Component](../../1-getting-started/server-and-client-components.md), [Client Component](../../1-getting-started/server-and-client-components.md)(렌더링 도중), [Route Handler](../3.1-file-conventions/route.md), [Server Function](../../1-getting-started/mutating-data.md)에서 호출할 수 있다.

```tsx filename="app/team/[id]/page.tsx" switcher
import { redirect } from 'next/navigation'

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const team = await fetchTeam(id)

  if (!team) {
    redirect('/login') // 로그인 페이지로 즉시 리다이렉트
  }

  return <div>팀 정보: {team.name}</div>
}
```

```jsx filename="app/team/[id]/page.js" switcher
import { redirect } from 'next/navigation'

export default async function TeamPage({ params }) {
  const { id } = await params
  const team = await fetchTeam(id)

  if (!team) {
    redirect('/login')
  }

  return <div>팀 정보: {team.name}</div>
}
```

> **알아두면 좋은 점**:
>
> - `redirect`는 내부적으로 `NEXT_REDIRECT` 특수 에러를 던져 현재 세그먼트의 렌더링을 즉시 중단한다. 따라서 `try/catch` 블록 내부에서 호출하면 에러가 가로채져 리다이렉트가 동작하지 않으므로, 반드시 `try/catch` **외부**에서 호출해야 한다.
> - 영구 리다이렉트(HTTP 308)가 필요한 경우 [`permanentRedirect`](./permanentRedirect.md)를 사용한다.
> - Client Component의 클릭 이벤트 핸들러 내부에서는 `redirect()` 대신 [`useRouter`](./use-router.md)의 `router.push()` 또는 `router.replace()`를 사용해야 한다.

### 매개변수 (Parameters)

```tsx
redirect(path: string, type?: 'replace' | 'push'): void
```

- `path`: 이동할 대상 URL 문자열이다. 상대 경로(`/login`) 또는 외부 절대 URL(`https://example.com`)을 모두 지원한다.
- `type` (선택 사항): 브라우저 히스토리 스택에 쌓을지(`'push'`) 아니면 현재 URL을 교체할지(`'replace'`)를 지정한다.
  - **Server Action**: 기본값이 `'push'`로 동작한다.
  - **기타 모든 컨텍스트**: 기본값이 `'replace'`로 동작한다.
  - `RedirectType` 열거형(`RedirectType.replace`, `RedirectType.push`)을 사용할 수도 있다.

### HTTP 상태코드: 307 vs 302

`redirect()`는 기본적으로 `307 Temporary Redirect` 상태코드를 반환한다:

- **302 Temporary Redirect**: 브라우저에 따라 `POST` 요청을 `GET`으로 임의 변경하는 문제가 있었다.
- **307 Temporary Redirect**: 리다이렉트 시 원래의 HTTP 요청 메서드(`POST`, `GET` 등)를 그대로 유지한다.
- **Server Action 예외**: 점진적 향상(Progressive Enhancement) 폼 제출 시에는 브라우저가 `GET`으로 후속 요청을 보내도록 `303 See Other`를 반환하며, 클라이언트 자바스크립트가 활성화된 환경에서는 브라우저 전체 새로고침 없이 클라이언트 사이드 SPA 네비게이션으로 처리된다.

### 예제

#### Server Action에서 처리 후 리다이렉트

```ts filename="app/actions.ts" switcher
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  let postId: string

  try {
    const post = await db.post.create({
      data: { title: formData.get('title') as string },
    })
    postId = post.id
  } catch (error) {
    return { error: '게시물 생성에 실패했습니다' }
  }

  // ⭕ try/catch 블록 바깥에서 redirect 호출
  redirect(`/posts/${postId}`)
}
```

```js filename="app/actions.js" switcher
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData) {
  let postId

  try {
    const post = await db.post.create({
      data: { title: formData.get('title') },
    })
    postId = post.id
  } catch (error) {
    return { error: '게시물 생성에 실패했습니다' }
  }

  redirect(`/posts/${postId}`)
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `redirect` 도입 |

## 예제 및 데모 설계

- Server Component에서 인증 세션 확인 후 세션이 없을 때 `/login`으로 307 리다이렉트되는 흐름을 구성한다.
- Server Action에서 글 등록 후 상세 페이지로 리다이렉트될 때 클라이언트 네비게이션으로 부드럽게 화면이 전환되는지 확인한다.
- `try/catch` 블록 내부에 `redirect()`를 배치했을 때 발생하는 리다이렉트 누락 현상과 외부로 이동했을 때의 정상 동작을 비교 검증한다.

## 연습 문제

1. `redirect()` 함수가 기본적으로 반환하는 HTTP 임시 리다이렉트 상태코드는?
   - A. 301
   - B. 302
   - C. 307
   - D. 308

<details><summary>정답 보기</summary>

정답: **C**  
해설: Next.js의 `redirect()`는 요청 메서드를 보존하는 `307 Temporary Redirect` 상태코드를 기본값으로 사용한다.
</details>

2. `redirect()`를 사용할 때 권장되는 코드 배치 규칙은?
   - A. 반드시 `try/catch`의 `try` 블록 내부에서 호출해야 한다.
   - B. `NEXT_REDIRECT` 예외가 차단되지 않도록 `try/catch` 블록 바깥에서 호출해야 한다.
   - C. `return await redirect()` 형태로 비동기 호출해야 한다.
   - D. `next.config.js` 내부에서만 호출해야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `redirect()`는 프레임워크가 가로채야 하는 특수 예외를 던지므로 `catch` 문에 잡히지 않도록 `try/catch` 블록 외부에서 실행해야 한다.
</details>

## 챕터 요약

- `redirect`는 사용자를 다른 내부 또는 외부 URL로 이동시키는 `next/navigation`의 함수다.
- 기본적으로 HTTP 307 상태코드를 사용하여 요청 메서드를 보존한다.
- Server Component, Client Component(렌더링 중), Route Handler, Server Action에서 사용할 수 있다.
- Server Action에서는 기본적으로 `'push'`(히스토리 추가)로, 그 외에는 `'replace'`(히스토리 교체)로 동작한다.
- 예외 전파 특성상 `try/catch` 블록 외부에서 호출해야 한다.
