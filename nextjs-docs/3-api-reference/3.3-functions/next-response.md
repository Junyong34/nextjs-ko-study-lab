# NextResponse

- 공식 문서: [NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web 표준 Response API를 확장하여 Next.js 서버 응답을 손쉽게 구성하는 `NextResponse` 클래스의 역할을 이해한다.
- `NextResponse.json()`, `NextResponse.redirect()`, `NextResponse.rewrite()`, `NextResponse.next()`의 용도와 차이점을 파악한다.
- 응답 쿠키(`response.cookies`)를 설정 및 삭제하는 메서드를 익힌다.
- 미들웨어(Proxy) 환경에서 안전하게 요청 헤더를 업스트림으로 전달하는 모범 사례를 적용한다.

## 핵심 개념 및 설명

`NextResponse`는 표준 [Web Response API](https://developer.mozilla.org/docs/Web/API/Response)를 상속받아 [Route Handler](../3.1-file-conventions/route.md)와 [미들웨어(Proxy)](../3.1-file-conventions/proxy.md)에서 간편하게 HTTP 응답을 생성하고 라우팅 흐름을 제어할 수 있도록 확장한 클래스다.

```ts filename="app/api/user/route.ts" switcher
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ id: '1', name: '홍길동' }, { status: 200 })
}
```

```js filename="app/api/user/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ id: '1', name: '홍길동' }, { status: 200 })
}
```

### 주요 정적 메서드 (Static Methods)

#### 1. `NextResponse.json(body, init?)`

JSON 본문과 함께 상태코드 및 응답 헤더를 가진 HTTP 응답을 생성한다.

#### 2. `NextResponse.redirect(url, status?)`

지정된 URL로 브라우저를 이동시키는 리다이렉트 응답을 반환한다:

```ts
import { NextResponse } from 'next/server'

const loginUrl = new URL('/login', request.url)
loginUrl.searchParams.set('from', request.nextUrl.pathname)
return NextResponse.redirect(loginUrl)
```

#### 3. `NextResponse.rewrite(url, init?)`

브라우저 주소창의 URL은 그대로 유지한 채, 서버 내부적으로 다른 대상 URL이나 외부 리소스로 요청을 프록시(재작성)하여 응답을 반환한다:

```ts
return NextResponse.rewrite(new URL('/proxy-destination', request.url))
```

#### 4. `NextResponse.next(options?)`

미들웨어에서 라우팅 체인을 계속 진행하도록 허용한다. 업스트림 페이지나 Route Handler로 새로운 요청 헤더를 주입할 수 있다:

```ts
const newHeaders = new Headers(request.headers)
newHeaders.set('x-user-id', 'user_123')

return NextResponse.next({
  request: {
    headers: newHeaders, // 업스트림 컴포넌트로 안전하게 헤더 전달
  },
})
```

### `cookies` 제어 인터페이스

응답의 `Set-Cookie` 헤더를 다루기 위한 메서드를 제공한다:

- `response.cookies.set('name', 'value', options?)`
- `response.cookies.get('name')`
- `response.cookies.getAll()`
- `response.cookies.has('name')`
- `response.cookies.delete('name')`

```ts
const response = NextResponse.next()
response.cookies.set('theme', 'dark', { httpOnly: true, path: '/' })
return response
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `NextResponse` 도입 |

## 예제 및 데모 설계

- Route Handler에서 `NextResponse.json()`을 통해 상태코드 400, 404, 500 에러 응답을 정형화하는 데모를 설계한다.
- 미들웨어에서 특정 경로 접근 시 `NextResponse.rewrite()`를 사용하여 A/B 테스팅 경로로 내부 라우팅을 분기하는 시나리오를 구성한다.
- `response.cookies.set()`을 통해 인증 쿠키를 발급하는 로그인 API 엔드포인트를 구현한다.

## 연습 문제

1. 브라우저 주소창의 URL은 변경하지 않은 채 내부적으로 다른 경로의 콘텐츠를 렌더링(프록시)하고자 할 때 사용하는 메서드는?
   - A. `NextResponse.redirect()`
   - B. `NextResponse.rewrite()`
   - C. `NextResponse.json()`
   - D. `NextResponse.next()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `NextResponse.rewrite()`는 클라이언트 주소창의 URL을 유지하면서 서버 내부적으로 요청 대상을 재작성(Rewrite)하여 응답한다.
</details>

2. 미들웨어에서 업스트림 Server Component로 사용자 식별 헤더를 전달하기 위한 올바른 방식은?
   - A. `NextResponse.next({ headers: newHeaders })`
   - B. `NextResponse.next({ request: { headers: newHeaders } })`
   - C. `request.headers.set('x-user', id)`
   - D. `NextResponse.redirect()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `NextResponse.next({ request: { headers: newHeaders } })`를 통해 클라이언트에게 노출하지 않고 안전하게 업스트림 서버 컴포넌트로만 헤더를 주입할 수 있다.
</details>

## 챕터 요약

- `NextResponse`는 Web 표준 Response를 확장한 Next.js의 응답 클래스다.
- `json()`, `redirect()`, `rewrite()`, `next()` 등의 정적 헬퍼를 제공한다.
- `response.cookies`를 통해 간편하게 `Set-Cookie` 헤더를 조작한다.
- `rewrite()`는 주소창 변경 없는 내부 프록시를, `redirect()`는 주소창 이동을 수행한다.
- 미들웨어에서 헤더를 업스트림으로 전달할 때는 `{ request: { headers } }` 옵션을 사용한다.
