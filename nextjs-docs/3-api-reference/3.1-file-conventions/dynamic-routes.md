# Dynamic Segments

- 공식 문서: [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 단일·catch-all·optional catch-all 다이나믹 세그먼트를 설계한다.
- Promise `params`를 Server/Client Component에서 안전하게 읽는다.
- Cache Components와 `generateStaticParams`의 관계를 이해한다.

## 핵심 개념 및 설명

URL 경로는 일련의 라우트 세그먼트이다. App Router에서 세그먼트는 **정적**(정확히 일치하는 리터럴 값) 또는 **동적**(URL에서 값을 캡처하는 자리 표시자)일 수 있다. 세그먼트 값을 미리 모르는 경우 다이나믹 세그먼트를 정의하여 동적 데이터에서 경로를 생성한다. Next.js는 요청 시 채워지거나 빌드 시 미리 렌더링된 `params`prop 경로를 통해 캡처된 값을 페이지에 전달한다.

> **알아두면 좋은 점**: 다이나믹 세그먼트는 경로 매개변수, 경로 매개변수 또는 URL 매개변수라고도 한다.

<a id="convention"></a>
### 규칙

다이나믹 세그먼트는 폴더 이름을 대괄호(`[folderName]`)로 묶어 생성할 수 있다. 예를 들어, 블로그에는 다음 경로 `app/blog/[slug]/page.js`가 포함될 수 있다. 여기서 `[slug]`는 블로그 게시물의 다이나믹 세그먼트이다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default async function Page({ params }) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

다이나믹 세그먼트는 `params` prop으로 [`layout`](layout.md), [`page`](page.md), [`route`](route.md)에 전달된다. [`generateMetadata`](../3.3-functions/generate-metadata.md#generatemetadata-function) 기능.

| 라우트 | 예시 URL | `params` |
| ------------------------- | ----------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a` | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b` | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c` | `{ slug: 'c' }` |

[루트 레이아웃](layout.md#root-layout) 앞에 나타나는 다이나믹 세그먼트는 **루트 매개변수**이며, [`next/root-params`](../3.3-functions/next-root-params.md)가 있는 모든 Server Component에서 추가로 읽을 수 있다.

<a id="in-client-components"></a>
#### Client Component에서

Client Component **페이지**에서 [`use`](https://react.dev/reference/react/use) API를 사용하여 props의 다이나믹 세그먼트에 액세스할 수 있다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
'use client'
import { use } from 'react'

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <div>
      <p>{slug}</p>
    </div>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
'use client'
import { use } from 'react'

export default function BlogPostPage({ params }) {
  const { slug } = use(params)

  return (
    <div>
      <p>{slug}</p>
    </div>
  )
}
```

또는 Client Component는 [`useParams`](../3.3-functions/use-params.md) 후크를 사용하여 Client Component 트리의 어느 곳에서나 `params`에 액세스할 수 있다.

<a id="catch-all-segments"></a>
#### 포괄 세그먼트

다이나믹 세그먼트는 괄호 `[...folderName]` 안에 줄임표를 추가하여 **포괄적인** 후속 세그먼트로 확장될 수 있다.

예를 들어,`app/shop/[...slug]/page.js`는 `/shop/clothes`와 일치하지만 `/shop/clothes/tops`,`/shop/clothes/tops/t-shirts` 등과도 일치한다.

| 라우트 | 예시 URL | `params` |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a` | `{ slug: ['a'] }` |
| `app/shop/[...slug]/page.js` | `/shop/a/b` | `{ slug: ['a', 'b'] }` |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

<a id="optional-catch-all-segments"></a>
#### 선택적 포괄 세그먼트

이중 대괄호 안에 매개변수(`[[...folderName]]`)를 포함하면 포괄 세그먼트를 **선택 사항**으로 만들 수 있다.

예를 들어,`app/shop/[[...slug]]/page.js`는 `/shop/clothes`,`/shop/clothes/tops`,`/shop/clothes/tops/t-shirts` 외에도 `/shop`와 **또한** 일치한다.

**catch-all**과 **선택적 catch-all** 세그먼트의 차이점은 선택사항을 사용하면 매개변수가 없는 경로도 일치한다는 것이다(위 예에서는 `/shop`).

| 라우트 | 예시 URL | `params` |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop` | `{ slug: undefined }` |
| `app/shop/[[...slug]]/page.js` | `/shop/a` | `{ slug: ['a'] }` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b` | `{ slug: ['a', 'b'] }` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

<a id="typescript"></a>
#### TypeScript

TypeScript를 사용할 때 구성된 라우트 세그먼트에 따라 `params`에 대한 유형을 추가할 수 있다. [`PageProps<'/route'>`](page.md#page-props-helper), [`LayoutProps<'/route'>`](layout.md#layout-props-helper) 또는 [`RouteContext<'/route'>`](route.md#route-context-helper)를 사용하여 `params`를 입력한다. 각각 `page`,`layout` 및 `route`.

경로 `params` 값은 해당 값이 런타임까지 알려지지 않기 때문에 `string`,`string[]` 또는 `undefined`(선택적 catch-all 세그먼트의 경우)로 입력된다. 사용자는 주소 표시줄에 어떤 URL이든 입력할 수 있으며 이러한 광범위한 유형은 애플리케이션 코드가 이러한 가능한 모든 경우를 처리하는 데 도움이 된다.

| 라우트 | `params` 유형 정의 |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js` | `{ slug: string }` |
| `app/shop/[...slug]/page.js` | `{ slug: string[] }` |
| `app/shop/[[...slug]]/page.js` | `{ slug?: string[] }` |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

`params`가 알려진 언어 코드 세트가 있는 `[locale]` 매개변수와 같이 고정된 수의 유효한 값만 가질 수 있는 경로에서 작업하는 경우 런타임 유효성 검사를 사용하여 사용자가 입력할 수 있는 잘못된 매개변수를 처리하고 애플리케이션의 나머지 부분이 알려진 세트의 더 좁은 유형으로 작동하도록 할 수 있다.

```tsx filename="/app/[locale]/page.tsx"
import { notFound } from 'next/navigation'
import type { Locale } from '@i18n/types'
import { isValidLocale } from '@i18n/utils'

function assertValidLocale(value: string): asserts value is Locale {
  if (!isValidLocale(value)) notFound()
}

export default async function Page(props: PageProps<'/[locale]'>) {
  const { locale } = await props.params // 로케일은 문자열로 입력된다.
  assertValidLocale(locale)
  // 로케일은 이제 로케일로 입력된다.
}
```

<a id="behavior"></a>
### 동작

- `params` prop은 Promise이기 때문이다. 값에 접근하려면 `async`/`await` 또는 React의 use 함수를 사용해야 한다.
  - 버전 14 이하에서는 `params`가 동기식 prop이었다. 이전 버전과의 호환성을 돕기 위해 Next.js 15에서는 여전히 동기적으로 액세스할 수 있지만 이 동작은 앞으로 더 이상 사용되지 않는다.

<a id="with-cache-components"></a>
#### Cache Components 포함

다이나믹 라우트 세그먼트와 함께 [Cache Components](../../1-getting-started/caching.md)를 사용할 때 매개변수를 처리하는 방법은 [`generateStaticParams`](../3.3-functions/generate-static-params.md) 사용 여부에 따라 달라진다.

`generateStaticParams`가 없으면 prerendering 중에 매개변수 값을 알 수 없으므로 매개변수 런타임 데이터가 생성된다. fallback UI를 제공하려면 `<Suspense>` 경계에서 매개변수 액세스를 래핑해야 한다.

`generateStaticParams`를 사용하면 빌드 시 사용할 수 있는 샘플 매개변수 값을 제공할 수 있다. 빌드 프로세스에서는 동적 콘텐츠 및 기타 런타임 API가 올바르게 처리되었는지 확인한 다음 샘플에 대한 정적 HTML 파일을 생성한다. 런타임 매개변수로 렌더링된 페이지는 첫 번째 요청이 성공한 후 디스크에 저장된다.

아래 섹션에서는 두 패턴을 모두 보여준다.

<a id="without-generatestaticparams"></a>
##### `generateStaticParams` 없이

모든 매개변수는 런타임 데이터이다. 매개변수 액세스는 Suspense 폴백 UI로 래핑되어야 한다. Next.js는 빌드 시 static shell을 생성하고 각 요청마다 콘텐츠가 로드된다.

> **알아두면 좋은 점**:
>
> - 페이지 수준 fallback UI에는 [`loading.tsx`](loading.md)를 사용할 수도 있다.
> - 레이아웃에서는 최상위 수준에서 `params`를 기다리지 않는다. 이렇게 하면 레이아웃이 prerendering되지 않는다. 대신, 이를 필요로 하는 컴포넌트에 params Promise를 전달하고 거기서 기다린다. 예제는 [static shell 최대화](../../1-getting-started/caching.md#maximizing-the-static-shell)를 참조한다.

```tsx filename="app/blog/[slug]/page.tsx"
import { Suspense } from 'react'

export default function Page({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <div>
      <h1>Blog Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(({ slug }) => (
          <Content slug={slug} />
        ))}
      </Suspense>
    </div>
  )
}

async function Content({ slug }: { slug: string }) {
  const res = await fetch(`https://api.vercel.app/blog/${slug}`)
  const post = await res.json()

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  )
}
```

<a id="with-generatestaticparams"></a>
##### `generateStaticParams` 사용

빌드 시 페이지를 미리 렌더링하려면 매개변수를 미리 제공한다. 필요에 따라 모든 경로 또는 하위 집합을 미리 렌더링할 수 있다.

빌드 프로세스 중에 HTML 결과를 수집하기 위해 각 샘플 매개변수를 사용하여 경로가 실행된다. 동적 콘텐츠 또는 런타임 데이터에 잘못 액세스하면 빌드가 실패한다.

```tsx filename="app/blog/[slug]/page.tsx" highlight={3-5,8,19}
import { Suspense } from 'react'

export async function generateStaticParams() {
  return [{ slug: '1' }, { slug: '2' }, { slug: '3' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  return (
    <div>
      <h1>Blog Post</h1>
      <Content slug={slug} />
    </div>
  )
}

async function Content({ slug }: { slug: string }) {
  const post = await getPost(slug)
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  )
}

async function getPost(slug: string) {
  'use cache'
  const res = await fetch(`https://api.vercel.app/blog/${slug}`)
  return res.json()
}
```

빌드 시점 유효성 검사에는 샘플 매개변수로 실행되는 코드 경로만 포함된다. 경로에 샘플에 없는 특정 매개변수 값에 대한 런타임 API에 액세스하는 조건부 논리가 있는 경우 해당 분기는 빌드 시 검증되지 않는다.

```tsx filename="app/blog/[slug]/page.tsx"
import { cookies } from 'next/headers'

export async function generateStaticParams() {
  return [{ slug: 'public-post' }, { slug: 'hello-world' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  if (slug.startsWith('private-')) {
    // 이 분기는 빌드 시 실행되지 않는다.
    // 'private-*' 슬러그에 대한 런타임 요청 시 오류가 발생한다.
    return <PrivatePost slug={slug} />
  }

  return <PublicPost slug={slug} />
}

async function PrivatePost({ slug }: { slug: string }) {
  const token = (await cookies()).get('token')
  // ... fetch and render private post using token for auth
}
```

`generateStaticParams`에서 반환되지 않은 런타임 매개변수의 경우 첫 번째 요청 중에 유효성 검사가 발생한다. 위의 예에서 `private-`로 시작하는 슬러그에 대한 요청은 `PrivatePost`가 Suspense 경계 없이 `cookies()`에 액세스하기 때문에 실패한다. 조건 분기에 도달하지 않은 다른 런타임 매개변수는 성공적으로 렌더링되고 후속 요청을 위해 디스크에 저장된다.

이 문제를 해결하려면 `PrivatePost`를 Suspense로 래핑한다.

```tsx filename="app/blog/[slug]/page.tsx" highlight={13-15}
import { Suspense } from 'react'
import { cookies } from 'next/headers'

export async function generateStaticParams() {
  return [{ slug: 'public-post' }, { slug: 'hello-world' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  if (slug.startsWith('private-')) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivatePost slug={slug} />
      </Suspense>
    )
  }

  return <PublicPost slug={slug} />
}

async function PrivatePost({ slug }: { slug: string }) {
  const token = (await cookies()).get('token')
  // ... fetch and render private post using token for auth
}
```

<a id="examples"></a>
### 예제

<a id="with-generatestaticparams-1"></a>
#### `generateStaticParams` 사용

[`generateStaticParams`](../3.3-functions/generate-static-params.md) 기능을 사용하면 요청 시 주문형 대신 빌드 시 경로를 [정적으로 생성](../../4-glossary/README.md#prerendering)할 수 있다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

`generateStaticParams` 함수 내에서 `fetch`를 사용하면 요청이 [자동으로 중복 제거](../../4-glossary/README.md#memoization)된다. 이를 통해 동일한 데이터 레이아웃, 페이지 및 기타 `generateStaticParams` 기능에 대한 다중 네트워크 호출을 방지하여 빌드 시점을 단축한다.

<a id="dynamic-get-route-handlers-with-generatestaticparams"></a>
#### `generateStaticParams`를 사용한 다이나믹 GET Route Handler

`generateStaticParams`는 또한 동적 [Route Handler](route.md)와 함께 작동하여 빌드 시 API 응답을 정적으로 생성한다.

```ts filename="app/api/posts/[id]/route.ts" switcher
export async function generateStaticParams() {
  const posts: { id: number }[] = await fetch(
    'https://api.vercel.app/blog'
  ).then((res) => res.json())

  return posts.map((post) => ({
    id: `${post.id}`,
  }))
}

export async function GET(
  request: Request,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params
  const res = await fetch(`https://api.vercel.app/blog/${id}`)

  if (!res.ok) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await res.json()
  return Response.json(post)
}
```

```js filename="app/api/posts/[id]/route.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    id: `${post.id}`,
  }))
}

export async function GET(request, { params }) {
  const { id } = await params
  const res = await fetch(`https://api.vercel.app/blog/${id}`)

  if (!res.ok) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await res.json()
  return Response.json(post)
}
```

이 예에서는 `generateStaticParams`에서 반환된 모든 블로그 게시물 ID에 대한 Route Handler가 빌드 시 정적으로 생성된다. 다른 ID에 대한 요청은 요청 시 동적으로 처리된다.

## 예제 및 데모 설계

- Phase 2에서 `[slug]`, `[...slug]`, `[[...slug]]`가 만드는 URL과 params를 표로 출력한다.
- locale params를 runtime validation하고 잘못된 값은 `notFound()`로 처리한다.
- `generateStaticParams` 유무에 따른 build 결과와 Suspense 요구를 비교한다.

## 연습 문제

1. `/shop` 자체와 모든 하위 경로를 함께 매칭하는 폴더는?
   - A. `[slug]`
   - B. `[...slug]`
   - C. `[[...slug]]`

<details><summary>정답 보기</summary>

정답: C. optional catch-all은 parameter 없는 base route도 매칭한다.
</details>

## 챕터 요약

- `[slug]`는 단일 다이나믹 세그먼트를 캡처한다.
- `[...slug]`와 `[[...slug]]`는 여러 세그먼트를 배열로 받는다.
- `params`는 Promise다.
- 제한된 값은 runtime validation으로 좁힌다.
- Cache Components에서는 prerender 가능 여부에 맞춰 Suspense와 sample params를 설계한다.
