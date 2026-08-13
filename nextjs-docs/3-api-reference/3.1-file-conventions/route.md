# route.js

- 공식 문서: [route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web Request/Response API로 Route Handler를 작성한다.
- 지원 HTTP 메서드와 caching·라우트 충돌 규칙을 이해한다.
- `NextRequest`, `RouteContext`, CORS와 webhook 사용 사례를 다룬다.

## 핵심 개념 및 설명

Route Handler를 사용하면 웹 [요청](https://developer.mozilla.org/docs/Web/API/Request) 및 [응답](https://developer.mozilla.org/docs/Web/API/Response) API를 사용하여 지정된 경로에 대한 사용자 정의 요청 핸들러를 생성할 수 있다.

```ts filename="route.ts" switcher
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

```js filename="route.js" switcher
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

<a id="reference"></a>
### 참조

<a id="http-methods"></a>
#### HTTP 메소드

**경로** 파일을 사용하면 특정 경로에 대한 사용자 정의 요청 처리기를 생성할 수 있다. 다음 [HTTP 방법](https://developer.mozilla.org/docs/Web/HTTP/Methods)이 지원된다:`GET`,`POST`,`PUT`,`PATCH`,`DELETE`,`HEAD` 및 `OPTIONS`.

```ts filename="route.ts" switcher
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// 'OPTIONS'가 정의되지 않은 경우 Next.js는 자동으로 'OPTIONS'를 구현하고 Route Handler에 정의된 다른 메서드에 따라 적절한 응답 'Allow' 헤더를 설정한다.
export async function OPTIONS(request: Request) {}
```

```js filename="route.js" switcher
export async function GET(request) {}

export async function HEAD(request) {}

export async function POST(request) {}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

// 'OPTIONS'가 정의되지 않은 경우 Next.js는 자동으로 'OPTIONS'를 구현하고 Route Handler에 정의된 다른 메서드에 따라 적절한 응답 'Allow' 헤더를 설정한다.
export async function OPTIONS(request) {}
```

<a id="parameters"></a>
#### 매개변수

<a id="request-optional"></a>
##### `request`(옵션)

`request` 객체는 웹 [요청](https://developer.mozilla.org/docs/Web/API/Request) API의 확장인 [NextRequest](../3.3-functions/next-request.md) 객체이다.`NextRequest`는 `cookies` 및 확장되고 구문 분석된 URL 객체 `nextUrl`에 쉽게 액세스하는 것을 포함하여 수신 요청에 대한 추가 제어를 제공한다.

```ts filename="route.ts" switcher
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl
}
```

```js filename="route.js" switcher
export async function GET(request) {
  const url = request.nextUrl
}
```

<a id="context-optional"></a>
##### `context`(옵션)

- **`params`**: 현재 경로에 대한 [다이나믹 라우트 매개변수](dynamic-routes.md)를 포함하는 객체로 확인되는 Promise이다.

```ts filename="app/dashboard/[team]/route.ts" switcher
export async function GET(
  request: Request,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team } = await params
}
```

```js filename="app/dashboard/[team]/route.js" switcher
export async function GET(request, { params }) {
  const { team } = await params
}
```

| 예 | URL | `params` |
| -------------------------------- | -------------- | ---------------------------------- |
| `app/dashboard/[team]/route.js` | `/dashboard/1` | `Promise<{ team: '1' }>` |
| `app/shop/[tag]/[item]/route.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |
| `app/blog/[...slug]/route.js` | `/blog/1/2` | `Promise<{ slug: ['1', '2'] }>` |

<a id="route-context-helper"></a>
#### Route Context 도우미

`RouteContext`를 사용하여 Route Handler 컨텍스트를 입력하면 경로 리터럴에서 강력한 형식의 `params`를 얻을 수 있다.`RouteContext`는 전역에서 사용할 수 있는 도우미이다.

```ts filename="app/users/[id]/route.ts"
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> **알아두면 좋은 점**:
>
> - `next dev`,`next build` 또는 `next typegen` 중에 유형이 생성된다.
> - 유형 생성 후 `RouteContext`도우미를 전역적으로 사용할 수 있다. 수입할 필요는 없다.

<a id="examples"></a>
### 예제

<a id="cookies"></a>
#### 쿠키

`next/headers`에서 [`cookies`](../3.3-functions/cookies.md)를 사용하여 쿠키를 읽거나 설정할 수 있다.

```ts filename="route.ts" switcher
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')
  const c = cookieStore.delete('c')
}
```

```js filename="route.js" switcher
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = await cookies()

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')
  const c = cookieStore.delete('c')
}
```

또는 [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) 헤더를 사용하여 새 `Response`를 반환할 수 있다.

```ts filename="app/api/route.ts" switcher
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

```js filename="app/api/route.js" switcher
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

기본 웹 API를 사용하여 요청([`NextRequest`](../3.3-functions/next-request.md))에서 쿠키를 읽을 수도 있다.

```ts filename="app/api/route.ts" switcher
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {
  const token = request.cookies.get('token')
}
```

<a id="headers"></a>
#### 헤더

`next/headers`에서 [`headers`](../3.3-functions/headers.md)를 사용하여 헤더를 읽을 수 있다.

```ts filename="route.ts" switcher
import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const headersList = await headers()
  const referer = headersList.get('referer')
}
```

```js filename="route.js" switcher
import { headers } from 'next/headers'

export async function GET(request) {
  const headersList = await headers()
  const referer = headersList.get('referer')
}
```

이 `headers` 인스턴스는 읽기 전용이다. 헤더를 설정하려면 새 `headers`를 사용하여 새 `Response`를 반환해야 한다.

```ts filename="app/api/route.ts" switcher
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

```js filename="app/api/route.js" switcher
import { headers } from 'next/headers'

export async function GET(request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

기본 웹 API를 사용하여 요청([`NextRequest`](../3.3-functions/next-request.md))에서 헤더를 읽을 수도 있다.

```ts filename="app/api/route.ts" switcher
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {
  const requestHeaders = new Headers(request.headers)
}
```

<a id="revalidating-cached-data"></a>
#### 캐시된 데이터 revalidate

`revalidate` 라우트 세그먼트 구성 옵션을 사용하여 [캐시된 데이터를 revalidate](../../2-guides/incremental-static-regeneration.md)할 수 있다.

```ts filename="app/posts/route.ts" switcher
export const revalidate = 60

export async function GET() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()

  return Response.json(posts)
}
```

```js filename="app/posts/route.js" switcher
export const revalidate = 60

export async function GET() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()

  return Response.json(posts)
}
```

<a id="redirects"></a>
#### 리디렉션

```ts filename="app/api/route.ts" switcher
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

```js filename="app/api/route.js" switcher
import { redirect } from 'next/navigation'

export async function GET(request) {
  redirect('https://nextjs.org/')
}
```

<a id="dynamic-route-segments"></a>
#### 다이나믹 라우트 세그먼트

Route Handler는 [다이나믹 세그먼트](dynamic-routes.md)를 사용하여 동적 데이터에서 요청 처리기를 생성할 수 있다.

```ts filename="app/items/[slug]/route.ts" switcher
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params // 'a', 'b' 또는 'c'
}
```

```js filename="app/items/[slug]/route.js" switcher
export async function GET(request, { params }) {
  const { slug } = await params // 'a', 'b' 또는 'c'
}
```

| 라우트 | 예시 URL | `params` |
| --------------------------- | ----------- | ------------------------ |
| `app/items/[slug]/route.js` | `/items/a` | `Promise<{ slug: 'a' }>` |
| `app/items/[slug]/route.js` | `/items/b` | `Promise<{ slug: 'b' }>` |
| `app/items/[slug]/route.js` | `/items/c` | `Promise<{ slug: 'c' }>` |

<a id="static-generation-with-generatestaticparams"></a>
##### `generateStaticParams`를 사용한 정적 생성

다이나믹 라우트 핸들러와 함께 [`generateStaticParams`](../3.3-functions/generate-static-params.md)를 사용하여 빌드 시 지정된 매개변수에 대한 응답을 정적으로 생성하는 동시에 요청 시 다른 매개변수를 동적으로 처리할 수 있다.

[Cache Components](../../1-getting-started/caching.md)를 사용하는 경우 `generateStaticParams`와 `use cache`를 결합하여 prerendering된 매개변수와 런타임 매개변수 모두에 대한 데이터 캐싱을 활성화할 수 있다.

예시와 세부정보는 [Route Handler를 사용하여 StaticParams 생성](../3.3-functions/generate-static-params.md#with-route-handlers) 문서를 참조한다.

<a id="url-query-parameters"></a>
#### URL 쿼리 매개변수

Route Handler에 전달된 요청 객체는 `NextRequest` 인스턴스이며, 여기에는 쿼리 매개변수를 보다 쉽게 ​​처리하기 위한 방법과 같은 [일부 추가 편의 메서드](../3.3-functions/next-request.md#nexturl)가 포함되어 있다.

```ts filename="app/api/search/route.ts" switcher
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // 쿼리는 /api/search?query=hello에 대해 "hello"이다.
}
```

```js filename="app/api/search/route.js" switcher
export function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // 쿼리는 /api/search?query=hello에 대해 "hello"이다.
}
```

<a id="streaming"></a>
#### 스트리밍

스트리밍은 일반적으로 AI 생성 콘텐츠를 위해 OpenAI와 같은 LLM(대형 언어 모델)과 함께 사용된다. [AI SDK](https://sdk.vercel.ai/docs/introduction)에 대해 자세히 살펴본다.

```ts filename="app/api/chat/route.ts" switcher
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

```js filename="app/api/chat/route.js" switcher
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

이러한 추상화는 웹 API를 사용하여 스트림을 생성한다. 기본 웹 API를 직접 사용할 수도 있다.

```ts filename="app/api/route.ts" switcher
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

```js filename="app/api/route.js" switcher
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

<a id="request-body"></a>
#### 요청 본문

표준 웹 API 방법을 사용하여 `Request` 본문을 읽을 수 있다.

```ts filename="app/items/route.ts" switcher
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

```js filename="app/items/route.js" switcher
export async function POST(request) {
  const res = await request.json()
  return Response.json({ res })
}
```

<a id="request-body-formdata"></a>
#### 요청 본문 FormData

`request.formData()` 함수를 사용하여 `FormData`를 읽을 수 있다.

```ts filename="app/items/route.ts" switcher
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

```js filename="app/items/route.js" switcher
export async function POST(request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

`formData` 데이터는 모두 문자열이므로 [`zod-form-data`](https://www.npmjs.com/zod-form-data)를 사용하여 요청을 검증하고 원하는 형식(예:`number`)으로 데이터를 검색할 수 있다.

<a id="cors"></a>
#### CORS

표준 웹 API 메서드를 사용하여 특정 Route Handler에 대한 CORS 헤더를 설정할 수 있다.

```ts filename="app/api/route.ts" switcher
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

> **알아두면 좋은 점**:
>
> - 여러 Route Handler에 CORS 헤더를 추가하려면 [프록시](proxy.md#cors) 또는 [`next.config.js` 파일](../3.5-config/3.5.1-next-config-js/headers.md#cors)을 사용할 수 있다.

<a id="webhooks"></a>
#### 웹훅

Route Handler를 사용하여 타사 서비스로부터 웹후크를 수신할 수 있다.

```ts filename="app/api/route.ts" switcher
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // 웹훅 페이로드 처리
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

```js filename="app/api/route.js" switcher
export async function POST(request) {
  try {
    const text = await request.text()
    // 웹훅 페이로드 처리
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

특히 페이지 라우터를 사용하는 API 경로와 달리 추가 구성을 사용하기 위해 `bodyParser`를 사용할 필요가 없다.

<a id="non-ui-responses"></a>
#### 비 UI 응답

Route Handler를 사용하여 UI가 아닌 콘텐츠를 반환할 수 있다. [`sitemap.xml`](3.1.21-metadata/sitemap.md#generating-a-sitemap-using-code-js-ts), [`robots.txt`](3.1.21-metadata/robots.md#generate-a-robots-file), [`app icons`](3.1.21-metadata/app-icons.md#generate-icons-using-code-js-ts-tsx) 및 [오픈 그래프 이미지](3.1.21-metadata/opengraph-image.md)는 모두 기본적으로 지원된다.

```ts filename="app/rss.xml/route.ts" switcher
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

```js filename="app/rss.xml/route.js" switcher
export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`)
}
```

<a id="segment-config-options"></a>
#### 세그먼트 구성 옵션

Route Handler는 페이지 및 레이아웃과 동일한 [라우트 세그먼트 구성](3.1.22-route-segment-config/README.md)을 사용한다.

```ts filename="app/items/route.ts" switcher
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto' // 더 이상 사용되지 않음
```

```js filename="app/items/route.js" switcher
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto' // 더 이상 사용되지 않음
```

자세한 내용은 [API 참조](3.1.22-route-segment-config/README.md)를 확인한다.

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `v15.0.0-RC` | `context.params`는 이제 Promise이다. [codemod](../../2-guides/2.64-upgrading/codemods.md#150)를 사용할 수 있다. |
| `v15.0.0-RC` | `GET` 핸들러의 기본 캐싱이 정적에서 동적으로 변경되었다. |
| `v13.2.0` | Route Handler가 도입되었다. |

## 예제 및 데모 설계

- Phase 2에서 `/api/posts/[id]`의 GET/POST와 `RouteContext`를 구현한다.
- 허용하지 않은 메서드의 405, CORS header, webhook signature 실패를 응답 로그로 검증한다.
- 정적 GET과 요청 데이터에 의존하는 GET의 caching 차이를 비교한다.

## 연습 문제

1. `route.js`와 같은 세그먼트에 함께 둘 수 없는 파일은?
   - A. `layout.js`
   - B. `page.js`
   - C. `loading.js`

<details><summary>정답 보기</summary>

정답: B. 한 세그먼트가 UI와 HTTP endpoint를 동시에 소유할 수 없다.
</details>

2. Route Handler가 지원하지 않는 HTTP 메서드의 기본 응답은?
   - A. 200
   - B. 404
   - C. 405

<details><summary>정답 보기</summary>

정답: C. `405 Method Not Allowed`가 반환된다.
</details>

## 챕터 요약

- `route.js`는 Web API 기반 HTTP handler를 정의한다.
- `params`는 Promise이고 `RouteContext`로 타입화할 수 있다.
- `page.js`와 같은 세그먼트에 공존하지 못한다.
- GET도 명시적인 전략 없이는 다이나믹이다.
- API, webhook, CORS, 비-UI 응답에 사용할 수 있다.
