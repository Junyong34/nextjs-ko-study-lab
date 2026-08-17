# proxy.js

- 공식 문서: [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- route 렌더링 전 요청을 rewrite·redirect·header·response로 처리한다.
- proxy 함수, `config.matcher`, request와 event 계약을 이해한다.
- Proxy의 실행 경계와 적합하지 않은 용도를 구분한다.

## 핵심 개념 및 설명

> **참고**:`middleware` 파일 규칙은 더 이상 사용되지 않으며 이름이 `proxy`로 변경되었다. 자세한 내용은 [프록시로 마이그레이션](#migration-to-proxy)을 참조한다.

`proxy.js|ts` 파일은 [프록시](../../1-getting-started/proxy.md)를 작성하고 요청이 완료되기 전에 서버에서 코드를 실행하는 데 사용된다. 그런 다음 들어오는 요청에 따라 요청 또는 응답 헤더를 다시 작성, 리디렉션, 수정하거나 직접 응답하여 응답을 수정할 수 있다.

프록시는 경로가 렌더링되기 전에 실행된다. 인증, 로깅 또는 리디렉션 처리와 같은 사용자 지정 서버 측 논리를 구현하는 데 특히 유용하다.

> **알아두면 좋은 점**:
>
> 프록시는 렌더링 코드와 별도로 호출되어야 하며 빠른 리디렉션/다시 쓰기 처리를 위해 CDN에 배포되는 최적화된 경우에는 공유 모듈이나 전역에 의존해서는 안 된다.
>
> 프록시에서 애플리케이션으로 정보를 전달하려면 [headers](#setting-headers), [cookies](#using-cookies), [rewrites](../3.3-functions/next-response.md#rewrite), [redirects](../3.3-functions/next-response.md#redirect) 또는 URL을 사용한다.

`proxy.ts`(또는 `.js`) 파일을 프로젝트 루트 또는 해당하는 경우 `src` 내부에 생성하여 `pages` 또는 `app`와 동일한 레벨에 위치하도록 한다.

[`pageExtensions`](../3.5-config/3.5.1-next-config-js/pageExtensions.md)를 예를 들어 `.page.ts` 또는 `.page.js`로 사용자 정의한 경우 이에 따라 파일 이름을 `proxy.page.ts` 또는 `proxy.page.js`로 지정한다.

```tsx filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 내부에서 `await`를 사용하는 경우 이 함수는 `async`로 표시될 수 있다.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

// 내부에서 `await`를 사용하는 경우 이 함수는 `async`로 표시될 수 있다.
export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

<a id="exports"></a>
### 내보내기

<a id="proxy-function"></a>
#### 프록시 기능

파일은 단일 함수를 기본 내보내기로 내보내거나 `proxy`라는 이름으로 내보내야 한다. 동일한 파일의 여러 프록시는 지원되지 않는다.

```js filename="proxy.js"
// 기본 내보내기의 예
export default function proxy(request) {
  // 프록시 로직
}
```

<a id="config-object-optional"></a>
#### 구성 객체(선택사항)

선택적으로 구성 객체를 프록시 기능과 함께 내보낼 수 있다. 이 객체에는 프록시가 적용되는 경로를 지정하는 [matcher](#matcher)가 포함되어 있다.

<a id="matcher"></a>
#### 일치자

`matcher` 옵션을 사용하면 프록시가 실행될 특정 경로를 대상으로 지정할 수 있다.

`matcher`가 없으면 프록시는 정적 파일(`_next/static`), 이미지 최적화(`_next/image`) 및 `public/` 폴더의 자산을 포함하여 **모든 요청**에 대해 실행된다. 이러한 경로를 제외하려면 [부정 일치 패턴](#negative-matching)을 사용하는 것이 좋다. 그렇지 않으면 인증 로직이나 리디렉션이 의도치 않게 CSS, JS 또는 이미지 로드를 차단할 수 있다.

여러 가지 방법으로 경로를 지정할 수 있다.

- 단일 경로의 경우:`'/about'`와 같이 문자열을 직접 사용하여 경로를 정의한다.
- 다중 경로의 경우: 배열을 사용하여 `matcher: ['/about', '/contact']`와 같이 `/about` 및 `/contact` 모두에 프록시를 적용하는 다중 경로를 나열한다.

```js filename="proxy.js"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

또한 `matcher` 옵션은 정규식을 사용하여 복잡한 경로 지정을 지원한다. 예를 들어 정규식 일치자를 사용하여 특정 경로를 제외할 수 있다.

```js filename="proxy.js"
export const config = {
  matcher: [
    // API 경로, 정적 파일, 이미지 최적화 및 .png 파일 제외
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
```

이를 통해 포함하거나 제외할 경로를 정확하게 제어할 수 있다.

`matcher` 옵션은 다음 키가 있는 객체 배열을 허용한다.

- `source`: 요청 경로를 일치시키는 데 사용되는 경로 또는 패턴이다. 직접 경로 일치를 위한 문자열이거나 더 복잡한 일치를 위한 패턴일 수 있다.
- `locale`(선택 사항):`false`로 설정된 경우 경로 일치에서 로케일 기반 라우팅을 무시하는 부울이다.
- `has`(선택 사항): 헤더, 쿼리 매개변수 또는 쿠키와 같은 특정 요청 요소의 존재 여부를 기반으로 조건을 지정한다.
- `missing`(선택 사항): 헤더 또는 쿠키 누락과 같은 특정 요청 요소가 없는 조건에 중점을 둡니다.

```js filename="proxy.js"
export const config = {
  matcher: [
    {
      source: '/api/:path*',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```

`source` 경로 패턴:

1. `/`로 시작해야 한다.
2. 명명된 매개변수를 포함할 수 있다.`/about/:path`는 `/about/a` 및 `/about/b`와 일치하지만 `/about/a/c`와 일치하지 않는다.
3. 명명된 매개변수에 수정자를 가질 수 있다(`:`로 시작):`*`가 _0 이상_이므로 `/about/:path*`는 `/about/a/b/c`와 일치한다.`?`는 _0 또는 1_이고 `+`는 _1 이상_이다.
4. 괄호 안에 정규 표현식을 사용할 수 있다:`/about/(.*)`는 `/about/:path*`와 동일하다.
5. 경로의 시작 부분에 고정된다.`/about`는 `/about` 및 `/about/team`와 일치하지만 `/blog/about`와 일치하지 않는다.

[path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) 문서에 대한 자세한 내용을 읽어본다.

> **알아두면 좋은 점**:
>
> - `matcher` 값은 빌드 시 정적으로 분석될 수 있도록 상수여야 한다. 변수와 같은 동적 값은 무시된다.
> - 이전 버전과의 호환성을 위해 Next.js는 항상 `/public`를 `/public/index`로 간주한다. 따라서 `/public/:path`의 매처가 매칭된다.

<a id="params"></a>
### 매개변수

Next.js는 두 개의 인수 [`request`](#request) 및 [`event`](#event)를 순서대로 사용하여 프록시 함수를 호출한다. 사용하는 인수만 선언한다.

<a id="request"></a>
#### `request`

첫 번째 매개변수는 들어오는 HTTP 요청을 나타내는 `NextRequest`의 인스턴스이다.

```tsx filename="proxy.ts" switcher
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 프록시 논리가 여기에 표시된다.
}
```

```js filename="proxy.js" switcher
export function proxy(request) {
  // 프록시 논리가 여기에 표시된다.
}
```

<a id="event"></a>
#### `event`

두 번째 매개변수는 `NextFetchEvent`의 인스턴스이다. 이는 Promise가 확정될 때까지 프록시 호출을 유지하여 응답이 전송된 후 로깅이나 분석과 같은 백그라운드 작업을 완료할 수 있도록 하는 단일 메서드 `waitUntil(promise)`를 노출한다. 전체 예는 [`waitUntil` 및 `NextFetchEvent`](#waituntil-and-nextfetchevent)를 참조한다.

```tsx filename="proxy.ts" switcher
import type { NextFetchEvent, NextRequest } from 'next/server'

export function proxy(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://example.com/log', {
      method: 'POST',
      body: JSON.stringify({ pathname: request.nextUrl.pathname }),
    })
  )
}
```

```js filename="proxy.js" switcher
export function proxy(request, event) {
  event.waitUntil(
    fetch('https://example.com/log', {
      method: 'POST',
      body: JSON.stringify({ pathname: request.nextUrl.pathname }),
    })
  )
}
```

<a id="nextproxy-type"></a>
#### `NextProxy` 유형

약어를 선호한다면 `NextProxy` 유형을 사용할 수 있다.`request`(`NextRequest`) 및 `event`(`NextFetchEvent`)에 대한 매개변수 유형을 자동으로 추론한다.

```tsx filename="proxy.ts"
import type { NextProxy } from 'next/server'

export const proxy: NextProxy = (request, event) => {
  event.waitUntil(Promise.resolve())
  return Response.json({ pathname: request.nextUrl.pathname })
}
```

> **알아두면 좋은 점**:
>
> - `NextRequest`는 Next.js Proxy에서 들어오는 HTTP 요청을 나타내는 유형인 반면, [`NextResponse`](#nextresponse)는 HTTP 응답을 조작하고 다시 보내는 데 사용되는 클래스이다.

<a id="nextresponse"></a>
### 다음응답

`NextResponse`API를 사용하면 다음을 수행할 수 있다.

- `redirect` 다른 URL로 들어오는 요청
- `rewrite` 주어진 URL을 표시하여 응답
- API 경로,`getServerSideProps` 및 `rewrite` 대상에 대한 요청 헤더 설정
- 응답 쿠키 설정
- 응답 헤더 설정

프록시에서 응답을 생성하려면 다음을 수행할 수 있다.

1. `rewrite`를 응답을 생성하는 경로([페이지](page.md) 또는 [Route Handler](route.md))에 연결
2. `NextResponse`를 직접 반환한다. [응답 생성](#producing-a-response)을 참조한다.

> **알아두면 좋은 점**: 리디렉션의 경우 `NextResponse.redirect` 대신 `Response.redirect`를 사용할 수도 있다.

<a id="execution-order"></a>
### 실행 순서

**프로젝트의 모든 경로**에 대해 프록시가 호출된다. 따라서 [matchers](#matcher)를 사용하여 특정 경로를 정확하게 타겟팅하거나 제외하는 것이 중요하다. 실행 순서는 다음과 같다.

1. `next.config.js`의 `headers`
2. `next.config.js`의 `redirects`
3. 프록시(`rewrites`,`redirects` 등)
4. `next.config.js`의 `beforeFiles`(`rewrites`)
5. 파일 시스템 경로(`public/`,`_next/static/`,`pages/`,`app/` 등)
6. `next.config.js`의 `afterFiles`(`rewrites`)
7. 다이나믹 라우트(`/blog/[slug]`)
8. `next.config.js`의 `fallback`(`rewrites`)

> **알아두면 좋은 점**: [Server Function](../3.4-directives/use-server.md)은 이 체인에서 별도의 경로가 아니다. 이는 사용되는 경로에 대한 POST 요청으로 처리되므로 경로를 제외하는 프록시 매처는 해당 경로에 대한 Server Function 호출도 건너뛴다.
>
> Server Function을 다른 경로로 이동하는 매처 변경 또는 리팩터링은 자동으로 프록시 적용 범위를 제거할 수 있다. 프록시에만 의존하기보다는 항상 각 Server Function 내에서 인증 및 권한 부여를 확인한다. 권장 패턴은 [데이터 보안 가이드](../../2-guides/data-security.md#authentication-and-authorization)를 참조한다.

<a id="runtime"></a>
### 실행 시간

프록시는 기본적으로 Node.js 런타임을 사용한다. [`runtime`](3.1.22-route-segment-config/runtime.md) 구성 옵션은 프록시 파일에서 사용할 수 없다. 프록시에서 `runtime` 구성 옵션을 설정하면 오류가 발생한다.

<a id="advanced-proxy-flags"></a>
### 고급 프록시 플래그

Next.js의 `v13.1`에는 고급 사용 사례를 처리하기 위해 프록시용으로 두 개의 추가 플래그 `skipProxyUrlNormalize`(이전 `skipMiddlewareUrlNormalize`) 및 `skipTrailingSlashRedirect`가 도입되었다.

`skipTrailingSlashRedirect`는 후행 슬래시를 추가하거나 제거하기 위해 Next.js 리디렉션을 비활성화한다. 이를 통해 프록시 내부의 사용자 지정 처리를 통해 일부 경로에 대해서는 후행 슬래시를 유지하고 다른 경로에는 후행 슬래시를 유지할 수 없으므로 증분 마이그레이션이 더 쉬워질 수 있다.

```js filename="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```js filename="proxy.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function proxy(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // 후행 슬래시 처리 적용
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
    )
  }
}
```

`skipProxyUrlNormalize`를 사용하면 Next.js에서 URL 정규화를 비활성화하여 직접 방문과 클라이언트 전환을 동일하게 처리할 수 있다. 일부 고급 사례에서는 이 옵션을 사용하여 원래 URL을 사용하여 모든 권한을 제공한다.

```js filename="next.config.js"
module.exports = {
  skipProxyUrlNormalize: true,
}
```

```js filename="proxy.js"
export default async function proxy(req) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log(pathname)
  // 이제 플래그를 사용하여 /_next/data/build-id/hello.json
  // 플래그가 없으면 /hello로 정규화된다.
}
```

<a id="examples"></a>
### 예제

<a id="conditional-statements"></a>
#### 조건문

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

<a id="using-cookies"></a>
#### 쿠키 사용

쿠키는 일반 헤더이다.`Request`에서는 `Cookie` 헤더에 저장된다.`Response`에서는 `Set-Cookie` 헤더에 있다. Next.js는 `NextRequest` 및 `NextResponse`의 `cookies` 확장을 통해 이러한 쿠키에 액세스하고 조작하는 편리한 방법을 제공한다.

1. 들어오는 요청의 경우 `cookies`에는 `get`,`getAll`,`set` 및 `delete` 쿠키와 같은 방법이 제공된다.`has`로 쿠키의 존재를 확인하거나 `clear`로 모든 쿠키를 제거할 수 있다.
2. 나가는 응답의 경우 `cookies`에는 `get`,`getAll`,`set` 및 `delete` 메서드가 있다.

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 들어오는 요청에 "Cookie:nextjs=fast" 헤더가 있다고 가정한다.
  // `RequestCookies` API를 사용하여 요청에서 쿠키 가져오기
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` API를 사용하여 응답에 쿠키 설정
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 나가는 응답에는 `Set-Cookie:vercel=fast;path=/` 헤더가 있다.

  return response
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  // 들어오는 요청에 "Cookie:nextjs=fast" 헤더가 있다고 가정한다.
  // `RequestCookies` API를 사용하여 요청에서 쿠키 가져오기
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` API를 사용하여 응답에 쿠키 설정
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 나가는 응답에는 `Set-Cookie:vercel=fast;path=/` 헤더가 있다.

  return response
}
```

<a id="setting-headers"></a>
#### 헤더 설정

`NextResponse`API를 사용하여 요청 및 응답 헤더를 설정할 수 있다(_request_ 헤더 설정은 Next.js v13.0.0부터 가능하다).

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 요청 헤더를 복제하고 새 헤더 `x-hello-from-proxy1`을 설정한다.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-proxy1', 'hello')

  // NextResponse.next에서 헤더를 접근할 수도 있다.
  const response = NextResponse.next({
    request: {
      // 새로운 요청 헤더
      headers: requestHeaders,
    },
  })

  // 새로운 응답 헤더 'x-hello-from-proxy2'를 설정한다.
  response.headers.set('x-hello-from-proxy2', 'hello')
  return response
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  // 요청 헤더를 복제하고 새 헤더 `x-hello-from-proxy1`을 설정한다.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-proxy1', 'hello')

  // NextResponse.next에서 헤더를 접근할 수도 있다.
  const response = NextResponse.next({
    request: {
      // 새로운 요청 헤더
      headers: requestHeaders,
    },
  })

  // 새로운 응답 헤더 'x-hello-from-proxy2'를 설정한다.
  response.headers.set('x-hello-from-proxy2', 'hello')
  return response
}
```

스니펫은 다음을 사용한다.

- `NextResponse.next({ request: { headers: requestHeaders } })`-`requestHeaders`를 업스트림에서 사용할 수 있도록 함
- **아님**`requestHeaders`를 클라이언트가 사용할 수 있게 만드는 `NextResponse.next({ headers: requestHeaders })`

[프록시의 NextResponse 헤더](../3.3-functions/next-response.md#next)에서 자세히 살펴본다.

> **알아두면 좋은 점**: 백엔드 웹 서버 구성에 따라 [431 요청 헤더 필드가 너무 큼](https://developer.mozilla.org/docs/Web/HTTP/Status/431) 오류가 발생할 수 있으므로 큰 헤더를 설정하지 않는다.

<a id="rsc-requests-and-rewrites"></a>
##### RSC 요청 및 재작성

RSC 요청 중에 Next.js는 프록시의 `request` 인스턴스에서 내부 Flight 헤더를 제거한다. 예를 들어 `rsc`,`next-router-state-tree` 및 `next-router-prefetch`와 같은 헤더는 `request.headers`를 통해 노출되지 않는다. 이는 HTML 요청과 RSC 요청을 모두 정렬해야 하기 때문에 실수로 RSC 요청을 다르게 처리하는 것을 방지하기 위한 것이다.

`NextResponse.rewrite()`를 사용하면 Next.js는 필수 RSC 재작성 헤더 업스트림을 자동으로 전파한다.

`NextResponse.rewrite()` 대신 `fetch()`를 사용하여 사용자 정의 재작성 논리를 구현하는 경우 수동으로 전달하지 않으면 RSC 헤더가 누락될 수 있다.

사용자 정의 `fetch` 재작성 설정의 경우 `next.config.js`에서 `skipProxyUrlNormalize`를 활성화하여 재작성 논리가 제공된 요청 객체에서 필요한 URL 모양과 RSC 헤더를 수신할 수도 있다.

```js filename="next.config.js"
module.exports = {
  skipProxyUrlNormalize: true,
}
```

<a id="cors"></a>
#### CORS

[단순](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) 및 [사전 실행](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests) 요청을 포함하여 원본 간 요청을 허용하도록 프록시에서 CORS 헤더를 설정할 수 있다.

```tsx filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function proxy(request: NextRequest) {
  // 요청의 출처를 확인한다.
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // 실행 전 요청 처리
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // 간단한 요청 처리
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

```jsx filename="proxy.js" switcher
import { NextResponse } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function proxy(request) {
  // 요청의 출처를 확인한다.
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // 실행 전 요청 처리
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // 간단한 요청 처리
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

> **알아두면 좋은 점**: [Route Handler](route.md#cors)에서 개별 경로에 대한 CORS 헤더를 구성할 수 있다.

<a id="producing-a-response"></a>
#### 응답 생성

`Response` 또는 `NextResponse` 인스턴스를 반환하여 프록시에서 직접 응답할 수 있다. ([Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-proxy)부터 사용 가능)

```ts filename="proxy.ts" switcher
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// `/api/`로 시작하는 경로로 프록시를 제한한다.
export const config = {
  matcher: '/api/:function*',
}

export function proxy(request: NextRequest) {
  // 요청을 확인하려면 인증 기능을 호출한다.
  if (!isAuthenticated(request)) {
    // 오류 메시지를 나타내는 JSON으로 응답
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```js filename="proxy.js" switcher
import { isAuthenticated } from '@lib/auth'

// `/api/`로 시작하는 경로로 프록시를 제한한다.
export const config = {
  matcher: '/api/:function*',
}

export function proxy(request) {
  // 요청을 확인하려면 인증 기능을 호출한다.
  if (!isAuthenticated(request)) {
    // 오류 메시지를 나타내는 JSON으로 응답
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

<a id="negative-matching"></a>
#### 네거티브 매칭

`matcher` 구성은 전체 정규식을 허용하므로 부정 예측 또는 문자 일치와 같은 일치가 지원된다. 특정 경로를 제외한 모든 경로와 일치하는 부정 예측의 예는 여기에서 볼 수 있다.

```js filename="proxy.js"
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

`missing` 또는 `has` 어레이를 사용하거나 두 가지를 조합하여 특정 요청에 대해 프록시를 우회할 수도 있다.

```js filename="proxy.js"
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}
```

> **알아두면 좋은 점**:
>
> `_next/data`가 부정 일치 패턴에서 제외되는 경우에도 `_next/data` 경로에 대해 프록시가 계속 호출된다. 이는 페이지를 보호하지만 해당 데이터 경로를 보호하는 것을 잊어버리는 우발적인 보안 문제를 방지하기 위한 의도적인 동작이다.

```js filename="proxy.js"
export const config = {
  matcher:
    '/((?!api|_next/data|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}

// 제외되었음에도 불구하고 프록시는 /_next/data/* 경로에 대해 계속 실행된다.
```

<a id="waituntil-and-nextfetchevent"></a>
#### `waitUntil` 및 `NextFetchEvent`

`NextFetchEvent` 객체는 기본 [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) 객체를 확장하고 [`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) 메서드를 포함한다.

`waitUntil()` 메서드는 Promise를 인수로 사용하고 Promise가 확정될 때까지 프록시의 수명을 연장한다. 이는 백그라운드에서 작업을 수행하는 데 유용하다.

```ts filename="proxy.ts"
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export function proxy(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )

  return NextResponse.next()
}
```

<a id="unit-testing-experimental"></a>
#### 단위 테스트(실험적)

Next.js 15.1부터 `next/experimental/testing/server` 패키지에는 단위 테스트 프록시 파일을 지원하는 유틸리티가 포함되어 있다. 단위 테스트 프록시는 원하는 경로에서만 실행되고 코드가 프로덕션에 도달하기 전에 사용자 지정 라우팅 논리가 의도한 대로 작동하는지 확인하는 데 도움이 될 수 있다.

`unstable_doesProxyMatch` 함수를 사용하여 제공된 URL, 헤더 및 쿠키에 대해 프록시가 실행되는지 여부를 확인할 수 있다.

```js
import { unstable_doesProxyMatch } from 'next/experimental/testing/server'

expect(
  unstable_doesProxyMatch({
    config,
    nextConfig,
    url: '/test',
  })
).toEqual(false)
```

전체 프록시 기능도 테스트할 수 있다.

```js
import { isRewrite, getRewrittenUrl } from 'next/experimental/testing/server'

const request = new NextRequest('https://nextjs.org/docs')
const response = await proxy(request)
expect(isRewrite(response)).toEqual(true)
expect(getRewrittenUrl(response)).toEqual('https://other-domain.com/docs')
// 응답이 리디렉션인 경우 getRedirectUrl을 사용할 수도 있다.
```

<a id="platform-support"></a>
### 플랫폼 지원

| 배포 옵션 | 지원됨 |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js 서버](../../1-getting-started/deploying.md#nodejs-server) | 예 |
| [도커 컨테이너](../../1-getting-started/deploying.md#docker) | 예 |
| [정적 내보내기](../../1-getting-started/deploying.md#static-export) | 아니요 |
| [어댑터](../../1-getting-started/deploying.md#adapters) | 플랫폼별 |

Next.js를 자체 호스팅할 때 [프록시 구성](../../2-guides/self-hosting.md#proxy) 방법을 살펴본다.

<a id="migration-to-proxy"></a>
### 프록시로 마이그레이션

<a id="why-the-change"></a>
#### 변화하는 이유

`middleware`의 이름을 바꾼 이유는 "미들웨어"라는 용어가 종종 Express.js 미들웨어와 혼동되어 그 목적을 잘못 해석할 수 있기 때문이다. 또한 미들웨어는 성능이 뛰어나므로 사용을 장려할 수 있다. 그러나 이 기능은 최후의 수단으로 사용하는 것이 좋다.

Next.js는 개발자가 미들웨어 없이 목표를 달성할 수 있도록 더 나은 인체공학적 기능을 갖춘 더 나은 API를 제공하기 위해 앞으로 나아가고 있다. 이것이 `middleware`의 이름이 변경된 이유이다.

<a id="why-proxy"></a>
#### 왜 "프록시"인가?

프록시라는 이름은 미들웨어가 무엇을 할 수 있는지를 명확하게 해줍니다. "프록시"라는 용어는 앱 앞의 네트워크 경계를 의미하며, 이것이 이 기능의 작동 방식이다. 애플리케이션의 기본 런타임 외부에서 실행될 수 있으며 요청이 앱에 도달하기 전에 처리할 수 있다. 이러한 특성은 "프록시"라는 용어와 더 잘 어울리며 기능에 대한 보다 명확한 목적을 제공한다.

<a id="how-to-migrate"></a>
#### 마이그레이션 방법

다른 옵션이 없는 한 사용자는 미들웨어에 의존하지 않는 것이 좋다. 우리의 목표는 미들웨어 없이도 목표를 달성할 수 있도록 더 나은 인체공학적 API를 제공하는 것이다.

"미들웨어"라는 용어는 종종 사용자를 Express.js 미들웨어와 혼동하여 오용을 조장할 수 있다. 방향을 명확히 하기 위해 파일 규칙의 이름을 "프록시"로 변경했다. 이는 우리가 미들웨어에서 벗어나 과부하된 기능을 분해하고 프록시의 목적을 명확하게 만들고 있음을 강조한다.

Next.js는 `middleware.ts`에서 `proxy.ts`로 마이그레이션하기 위한 codemod를 제공한다. 다음 명령을 실행하여 마이그레이션할 수 있다.

```bash
npx @next/codemod@canary middleware-to-proxy .
```

codemod는 파일 이름과 함수 이름을 `middleware`에서 `proxy`로 바꿉니다.

```diff
// middleware.ts -> Proxy.ts

- export function middleware() {
+ export function proxy() {
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | --------------------------------------------------------------------------------------------- |
| `v16.0.0` | 미들웨어는 더 이상 사용되지 않으며 이름이 Proxy로 변경되었다. 프록시는 Node.js 런타임으로 기본 설정된다. |
| `v15.5.0` | 미들웨어는 이제 Node.js 런타임(안정적)을 사용할 수 있다. |
| `v15.2.0` | 미들웨어는 이제 Node.js 런타임을 사용할 수 있다(실험적) |
| `v13.1.0` | 고급 미들웨어 플래그가 추가되었다. |
| `v13.0.0` | 미들웨어는 요청 헤더, 응답 헤더를 수정하고 응답을 보낼 수 있다. |
| `v12.2.0` | 미들웨어가 안정적이다. [업그레이드 가이드](https://nextjs.org/docs/messages/middleware-upgrade-guide)를 참조한다. |
| `v12.0.9` | Edge 런타임에서 절대 URL 적용([PR](https://github.com/vercel/next.js/pull/33410)) |
| `v12.0.0` | 미들웨어(베타) 추가됨 |

## 예제 및 데모 설계

- Phase 2에서 locale redirect, protected path matcher, response header 추가를 구현한다.
- static asset과 prefetch 요청이 matcher에서 제외되는지 request log로 확인한다.
- `waitUntil()`로 비차단 audit log를 기록한다.

## 연습 문제

1. Proxy 파일의 옛 이름은?
   - A. middleware
   - B. gateway
   - C. interceptor

<details><summary>정답 보기</summary>

정답: A. Next.js 16에서는 `proxy` 명칭을 사용한다.
</details>

2. `matcher`에 필요한 특성은?
   - A. runtime마다 임의 계산한다.
   - B. 정적 분석 가능한 상수다.
   - C. Client Component에서 export한다.

<details><summary>정답 보기</summary>

정답: B. build가 matcher를 정적으로 분석할 수 있어야 한다.
</details>

## 챕터 요약

- Proxy는 route 렌더링 전에 요청을 처리한다.
- `middleware` 명칭은 deprecated되었다.
- 함수 하나와 선택적 정적 `config`를 export한다.
- renderer와 분리될 수 있어 global state를 공유하지 않는다.
- 빠른 rewrite·redirect·header 결정에 집중한다.
