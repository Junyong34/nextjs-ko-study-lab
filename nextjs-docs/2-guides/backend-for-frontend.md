# Backend for Frontend

- 공식 문서: [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js의 Backend for Frontend(BFF) 역할과 완전한 백엔드의 차이를 설명한다.
- Route Handler와 `proxy`, `rewrites`를 요청 처리 목적에 맞게 선택한다.
- 공개 endpoint의 입력·오류·헤더·인증·속도 제한을 안전하게 다룬다.
- Server Component와 Server Action에서 Route Handler를 우회해야 하는 경우를 구분한다.

## 핵심 개념 및 설명

Next.js는 HTTP 요청을 받아 HTML뿐 아니라 JSON, XML, 이미지, 파일, 일반 텍스트를 반환하는 BFF 패턴을 지원한다. 데이터 소스에 접근하거나 원격 데이터를 바꾸는 부수 효과도 수행할 수 있다. 새 프로젝트에서는 `create-next-app --api`로 `app/route.ts` 예제를 포함할 수 있다.

> **알아두면 좋은 점**: Next.js의 백엔드 기능은 완전한 백엔드를 대체하지 않는다. 공개적으로 접근 가능하고 모든 HTTP 요청과 콘텐츠 유형을 다루는 API 계층이다. App Router에서는 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)와 [`proxy`](../3-api-reference/3.1-file-conventions/proxy.md)를 사용한다.

### 공개 endpoint

`route.ts` 또는 `route.js`는 모든 클라이언트가 접근할 수 있는 공개 HTTP endpoint를 만든다.

```ts
export function GET(request: Request) {}
```

예외가 날 수 있는 작업은 `try/catch`로 다루되 민감한 내부 정보를 오류 응답에 노출하지 않는다. 접근을 제한하려면 [Authentication](./authentication.md)의 인증과 인가를 endpoint 안에서 확인한다.

```ts
export async function POST(request: Request) {
  try {
    await submit(request)
    return new Response(null, { status: 204 })
  } catch {
    return new Response('Unexpected error', { status: 500 })
  }
}
```

### 콘텐츠 유형

Next.js는 [`sitemap.xml`](../3-api-reference/3.1-file-conventions/3.1.21-metadata/sitemap.md), [Open Graph 이미지](../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md), [아이콘](../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md), [`manifest.json`](../3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md), [`robots.txt`](../3-api-reference/3.1-file-conventions/3.1.21-metadata/robots.md) 같은 공통 endpoint에 파일 규칙을 제공한다. `llms.txt`, `rss.xml`, `.well-known` 같은 사용자 정의 형식은 Route Handler로 만든다. 마크업을 생성할 때 입력을 정제해야 한다.

#### 콘텐츠 협상

요청의 `Accept` 헤더와 일치하는 [`rewrites`](../3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md)를 두면 하나의 URL에서 HTML과 Markdown처럼 서로 다른 표현을 제공할 수 있다. 응답에 `Vary: Accept`를 설정해야 공유 캐시가 두 형식을 섞지 않는다. `generateStaticParams`를 함께 사용하면 형식별 결과를 빌드 시점에 prerender할 수 있다.

```js
module.exports = {
  async rewrites() {
    return [{
      source: '/docs/:slug*',
      destination: '/docs/md/:slug*',
      has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
    }]
  },
}
```

> **알아두면 좋은 점**: rewrite 대상 Route Handler도 직접 접근할 수 있다. 직접 요청을 막아야 하면 예상한 `Accept` 헤더가 없는 요청을 `proxy`에서 차단한다. 더 복잡한 협상도 `proxy`에서 처리할 수 있다.

#### 요청 payload 읽기

요청 본문은 `.json()`, `.formData()`, `.text()`로 읽는다. `GET`과 `HEAD` 요청에는 본문이 없으며, 본문 스트림은 한 번만 읽을 수 있다. 두 번 필요하면 읽기 전에 `request.clone()`을 만든다.

> **알아두면 좋은 점**: 데이터를 다른 시스템에 전달하기 전에 검증한다.

### 데이터 조작

Route Handler는 여러 데이터 소스를 변환·필터링·집계해 프런트엔드에서 내부 시스템을 숨길 수 있다. 무거운 계산을 서버로 옮기면 클라이언트의 배터리와 데이터 사용량도 줄일 수 있다.

> **알아두면 좋은 점**: 위치처럼 민감한 값을 URL에 넣지 않으려고 `POST`를 선택할 수 있다. `GET` URL은 캐시나 로그에 남을 수 있다.

### 백엔드로 프록시하기

catch-all Route Handler에서 요청을 복제해 검증한 뒤 다른 백엔드로 전달할 수 있다. 단순한 경로 전달이라면 `next.config.js`의 `rewrites`가 더 간결하다.

```ts
export async function POST(request: Request, { params }) {
  const isValid = await isValidRequest(request.clone())
  if (!isValid) return new Response(null, { status: 400 })

  const { slug } = await params
  return fetch(new Request(new URL(slug.join('/'), 'https://api.example.com'), request))
}
```

### NextRequest와 NextResponse

Next.js는 Web API의 `Request`와 `Response`를 [`NextRequest`](../3-api-reference/3.3-functions/next-request.md)와 [`NextResponse`](../3-api-reference/3.3-functions/next-response.md)로 확장한다. 두 타입 모두 쿠키를 다룰 수 있다. [`NextRequest.nextUrl`](../3-api-reference/3.3-functions/next-request.md)은 pathname과 search params를 파싱해 제공하고, `NextResponse`는 `next()`, `json()`, `redirect()`, `rewrite()`를 제공한다.

### webhook과 callback URL

Route Handler는 CMS 변경 webhook을 받아 `revalidateTag`를 호출하거나, 외부 인증 흐름의 callback을 확인하고 redirect할 수 있다. webhook secret과 필수 파라미터를 검증한다. 사용자 입력으로 redirect 목적지를 만들 때는 현재 origin과 같은지 확인해 open redirect를 막는다.

### redirect

Route Handler에서도 [`redirect`](../3-api-reference/3.3-functions/redirect.md)와 [`permanentRedirect`](../3-api-reference/3.3-functions/permanentRedirect.md)를 사용할 수 있다.

```ts
import { redirect } from 'next/navigation'

export async function GET() {
  redirect('https://nextjs.org/')
}
```

### Proxy

프로젝트에는 `proxy` 파일을 하나만 둘 수 있고 `config.matcher`로 적용 경로를 정한다. `proxy`는 라우트에 도달하기 전에 인증 실패 응답, rewrite, redirect를 만들 수 있다.

```ts
export const config = { matcher: '/api/:function*' }

export function proxy(request: Request) {
  if (!isAuthenticated(request)) {
    return Response.json({ message: 'authentication failed' }, { status: 401 })
  }
}
```

### 보안

#### 헤더 다루기

[`NextResponse.next({ request: { headers } })`](../3-api-reference/3.3-functions/next-response.md)의 헤더는 업스트림 서버 요청을 바꾸며 클라이언트에 노출하지 않는다. 반대로 `Response`나 `NextResponse`의 응답 헤더는 브라우저에 보인다. 들어온 요청 헤더를 응답에 그대로 복사하지 않는다.

#### 속도 제한

코드에서 속도 제한을 구현하고 호스팅 제공자의 제한 기능도 함께 활성화할 수 있다. 제한을 넘으면 `429`를 반환한다.

#### payload 검증

들어오는 요청을 신뢰하지 않는다. 콘텐츠 유형과 크기를 검사하고, XSS에 대비해 입력을 정제하며, 서버 자원을 보호할 timeout을 둔다. 사용자 정적 자산은 전용 저장소에 브라우저에서 직접 올리고 URI만 보관하는 편이 요청 크기를 줄인다.

#### 보호 자원 접근

자원을 내주기 전에 자격 증명과 권한을 확인한다. `proxy`만으로 인증과 인가를 대신하지 않는다. 응답과 로그에서 민감하거나 불필요한 값을 제거하고 자격 증명과 API 키를 주기적으로 교체한다.

### preflight 요청

브라우저는 [CORS](../3-api-reference/3.1-file-conventions/route.md) 허용 여부를 묻기 위해 `OPTIONS` preflight 요청을 보낸다. `OPTIONS`를 정의하지 않으면 Next.js가 다른 handler 메서드를 기준으로 `Allow` 헤더를 설정해 자동 응답한다.

### 라이브러리 패턴

커뮤니티 라이브러리는 method와 pathname을 읽는 factory로 Route Handler나 `proxy`를 제공할 수 있다.

```ts
const handler = createHandler({ /* 라이브러리 옵션 */ })
export const GET = handler
export { handler as POST }
```

> **알아두면 좋은 점**: 서드 파티 라이브러리는 `proxy`를 여전히 `middleware`라고 부를 수 있다.

### 더 많은 예제

[Route Handler API](../3-api-reference/3.1-file-conventions/route.md)에는 쿠키, 헤더, 스트리밍 예제가 있고 [`proxy` API](../3-api-reference/3.1-file-conventions/proxy.md)에는 negative matching 등 추가 예제가 있다.

### 주의사항

#### Server Components

Server Component는 Route Handler를 거치지 말고 데이터 소스에서 직접 가져온다. 빌드 시 prerender하는 Server Component가 자체 Route Handler를 호출하면 수신할 서버가 없어 빌드가 실패한다. 요청 시 렌더링하더라도 불필요한 HTTP 왕복으로 느려진다. 브라우저 전용 API에 의존하거나 자주 polling하는 데이터라면 [클라이언트 데이터 fetching](./2.15-client-side-data-fetching/README.md)을 고려한다.

#### Server Actions

[Server Action](./server-actions.md)의 주목적은 프런트엔드에서 데이터를 mutation하는 것이다. 클라이언트 디스패치는 순차 실행되므로 데이터 fetching에 사용하면 waterfall이 생긴다.

#### export 모드

[정적 `export`](./static-exports.md)에는 Next.js 런타임 서버가 없다. `'force-static'`으로 설정한 `GET` Route Handler만 정적 HTML, JSON, TXT 같은 파일 생성에 사용할 수 있다.

#### 배포 환경

호스트가 Route Handler를 lambda 함수로 배포하면 요청 사이에서 메모리를 공유할 수 없고 파일 시스템 쓰기가 제한될 수 있다. 긴 작업은 timeout으로 종료될 수 있으며, 응답 뒤 연결이 닫히므로 WebSocket도 동작하지 않는다.

### API Reference

- [route.js](../3-api-reference/3.1-file-conventions/route.md)
- [proxy.js](../3-api-reference/3.1-file-conventions/proxy.md)
- [rewrites](../3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md)

## 예제 및 데모 설계

- Phase 2에서 `/api/weather` Route Handler가 입력을 검증하고 외부 API 응답을 정규화하는 BFF를 만든다.
- 같은 `/docs/[slug]` 요청이 `Accept` 헤더에 따라 HTML 또는 Markdown을 반환하고 `Vary`가 설정되는지 확인한다.
- 잘못된 payload, 인증 누락, 속도 제한 초과, open redirect 입력의 상태 코드를 비교한다.
- Server Component의 직접 데이터 접근과 Route Handler 경유 요청의 네트워크 왕복을 나란히 관찰한다.

## 연습 문제

1. Server Component가 같은 앱의 데이터를 읽는 기본 방법은 무엇인가?

   - A. 자체 Route Handler를 HTTP로 호출한다.
   - B. 데이터 소스에서 직접 가져온다.
   - C. Server Action을 데이터 fetching에 사용한다.

   <details><summary>정답 보기</summary>

   정답: B. 자체 Route Handler는 빌드 시 실패할 수 있고 요청 시에도 불필요한 HTTP 왕복을 만든다.

   </details>

2. `Accept`에 따라 같은 URL의 응답 표현이 달라질 때 필요한 응답 헤더는 무엇인가?

   - A. `Vary: Accept`
   - B. `Allow: GET`
   - C. `Content-Length: 0`

   <details><summary>정답 보기</summary>

   정답: A. 공유 캐시가 `Accept`별 응답을 구분하도록 알린다.

   </details>

3. 요청 본문을 두 번 읽어야 할 때 알맞은 처리는 무엇인가?

   - A. 같은 `Request`에서 `.text()`를 두 번 호출한다.
   - B. 읽기 전에 `request.clone()`을 만든다.
   - C. `GET`으로 바꿔 본문을 보낸다.

   <details><summary>정답 보기</summary>

   정답: B. 요청 본문 스트림은 한 번만 읽을 수 있으므로 복제본이 필요하다.

   </details>

## 챕터 요약

- Next.js의 BFF는 공개 HTTP endpoint를 제공하는 API 계층이지 완전한 백엔드 대체물이 아니다.
- Route Handler는 콘텐츠 반환·webhook·callback·백엔드 프록시에 사용할 수 있다.
- 입력, 오류, 헤더, 인증, 인가, 속도 제한을 endpoint마다 검증해야 한다.
- Server Component는 자체 Route Handler가 아니라 데이터 소스에 직접 접근한다.
- 런타임과 배포 환경의 제약을 확인하고 `proxy`, `rewrites`, Route Handler를 선택한다.
