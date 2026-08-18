# notFound

- 공식 문서: [notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 리소스가 존재하지 않을 때 Next.js의 404 UI를 렌더링하도록 예외를 던지는 `notFound` 함수의 동작 원리를 이해한다.
- `return notFound()`가 필요 없는 `never` 반환 타입 특성과 TypeScript 타입 축소(Narrowing) 방식을 파악한다.
- [`not-found.tsx`](../3.1-file-conventions/not-found.md) 경계 파일 및 `<meta name="robots" content="noindex" />` 자동 주입 특성을 확인한다.
- Suspense 스트리밍 도중 `notFound()` 호출 시의 소프트 404 렌더링과 Route Handler에서의 HTTP 404 응답 처리를 구현한다.

## 핵심 개념 및 설명

`notFound()`는 내부적으로 `NEXT_HTTP_ERROR_FALLBACK;404` 예외를 던져 현재 세그먼트의 렌더링을 즉시 중단하고 가장 가까운 [`not-found.tsx`](../3.1-file-conventions/not-found.md) 경계 UI를 렌더링하게 만드는 함수다.

검색 엔진에 잘못된 빈 페이지가 노출되지 않도록 Next.js는 자동으로 `<meta name="robots" content="noindex" />` 태그를 주입한다.

`notFound()`는 [Server Component](../../1-getting-started/server-and-client-components.md), [Server Function](../../1-getting-started/mutating-data.md), [Route Handler](../3.1-file-conventions/route.md)에서 사용할 수 있다.

```tsx filename="app/user/[id]/page.tsx" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound() // 예외를 던져 404 페이지로 전환 (return 불필요)
  }

  // user는 여기서 항상 정의된(defined) 타입으로 좁혀진다
  return <div>사용자 프로필: {user.name}</div>
}
```

```jsx filename="app/user/[id]/page.js" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  return <div>사용자 프로필: {user.name}</div>
}
```

> **알아두면 좋은 점**:
>
> - `notFound()`는 함수 실행을 중단하는 예외를 던지므로 `return notFound()`처럼 `return`문을 작성할 필요가 없다. TypeScript는 이를 `never` 타입으로 인식하여 조건문 아래의 타입을 자동으로 좁혀준다.
> - `try/catch` 블록으로 `notFound()`를 감싸면 예외가 가로채져 404 UI가 렌더링되지 않는다. 에러 로깅 후 전파가 필요하다면 [`unstable_rethrow`](./unstable_rethrow.md)를 사용해야 한다.
> - 비동기 Promise를 `await`하지 않고 방치한 채 내부에서 `notFound()`를 부르면 `unhandledRejection` 에러가 발생하므로 반드시 렌더링 경로에서 `await`해야 한다.

### Suspense 스트리밍 중 호출 시 동작

`<Suspense>` 경계 내부에서 비동기 데이터를 가져오다가 `notFound()`가 호출되면, 이미 상위 레이아웃과 쉘이 `200 OK`로 스트리밍되기 시작했더라도 해당 서스펜스 영역만 가장 가까운 `not-found.tsx` 컴포넌트로 대체된다.

```tsx filename="app/blog/[slug]/page.tsx"
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

async function Article({ slug }: { slug: string }) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (res.status === 404) {
    notFound() // 가장 가까운 not-found.tsx로 대체
  }
  const post = await res.json()
  return <article>{post.title}</article>
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main>
      <h1>블로그</h1>
      <Suspense fallback={<p>글 불러오는 중...</p>}>
        <Article slug={slug} />
      </Suspense>
    </main>
  )
}
```

### Route Handler에서의 404 응답

Route Handler 내부에서 `notFound()`를 호출하면 클라이언트에게 실제 HTTP `404 Not Found` 응답 상태코드가 반환된다:

```tsx filename="app/api/posts/[slug]/route.ts"
import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (!res.ok) {
    notFound() // 클라이언트에 404 상태코드 응답
  }
  return NextResponse.json(await res.json())
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `notFound` 도입 |

## 예제 및 데모 설계

- 존재하지 않는 상품 ID로 접근 시 `app/products/[id]/not-found.tsx`에 정의된 전용 404 UI가 렌더링되는지 확인한다.
- `try/catch` 블록으로 데이터를 감싸되 `unstable_rethrow`를 활용해 `notFound()` 예외가 차단되지 않고 상위로 전파되는지 검증한다.
- Route Handler에서 `notFound()` 호출 시 Postman이나 브라우저에서 실제 404 상태코드가 반환되는지 확인한다.

## 연습 문제

1. `notFound()` 함수에 대한 설명으로 옳지 **않은** 것은?
   - A. `next/navigation`에서 import하여 사용한다.
   - B. 호출 시 예외를 던지므로 `return notFound()`를 작성할 필요가 없다.
   - C. 검색 엔진 색인을 유도하기 위해 `<meta name="robots" content="index, follow" />`를 주입한다.
   - D. 가장 가까운 `not-found.tsx` 컴포넌트를 화면에 렌더링한다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: Next.js는 404 페이지가 검색 결과에 색인되지 않도록 `<meta name="robots" content="noindex" />` 태그를 자동으로 삽입한다.
</details>

2. `notFound()`를 일반 `try/catch` 블록으로 감쌌을 때 발생하는 문제는?
   - A. 즉시 500 인터널 서버 에러가 발생한다.
   - B. `catch` 블록이 `notFound()`의 특수 예외를 가로채어 404 화면이 렌더링되지 않는다.
   - C. 브라우저가 무한 새로고침된다.
   - D. 아무런 문제 없이 정상 렌더링된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `notFound()`는 내부적으로 특수 예외를 던져 프레임워크에 404 상태를 알리므로, 무분별한 `try/catch`로 예외를 삼키면 404 UI 렌더링이 가로막힌다.
</details>

## 챕터 요약

- `notFound()`는 404 Not Found 화면을 띄우기 위해 특수 예외를 던지는 함수다.
- `never` 반환 타입 덕분에 TypeScript 조건문 아래에서 데이터 타입이 안전하게 좁혀진다.
- 검색 엔진 노출을 막기 위해 `noindex` 메타 태그가 자동 주입된다.
- `<Suspense>` 스트리밍 중 호출되면 해당 경계 영역만 `not-found.tsx` UI로 치환된다.
- Route Handler에서 호출 시 클라이언트에 HTTP 404 상태코드를 반환한다.
