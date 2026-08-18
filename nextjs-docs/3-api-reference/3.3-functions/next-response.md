# NextResponse

- 공식 문서: [NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web 표준 `Response` 객체를 확장한 `NextResponse`의 주요 정적 메서드(`json`, `redirect`, `rewrite`, `next`)를 익힌다.
- Proxy(Middleware)에서 요청 체인을 제어하고 헤더/쿠키를 가공하여 다운스트림 Server Component로 전달하는 패턴을 구현한다.
- Route Handler에서 JSON 응답, 쿠키 설정, 상태 코드 조작을 표준화된 방식으로 작성한다.

## 핵심 개념 및 설명

`NextResponse`는 웹 표준 [Response API](https://developer.mozilla.org/docs/Web/API/Response)를 확장하여 Next.js 라우팅 및 Proxy 제어에 특화된 정적 헬퍼 메서드를 제공한다.

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. 요청 헤더를 수정하여 다운스트림 Server Component로 전달
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware', 'hello')

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // 2. 응답 쿠키 설정
  response.cookies.set('user-theme', 'dark', { path: '/' })

  return response
}
```

---

### 정적 메서드 (Static Methods)

| 메서드 | 시그니처 | 설명 |
|---|---|---|
| **`NextResponse.json()`** | `(body: any, init?: ResponseInit) => NextResponse` | JSON 본문과 `content-type: application/json` 헤더를 포함한 응답을 생성 |
| **`NextResponse.redirect()`** | `(url: string \| URL \| NextURL, init?: number \| ResponseInit) => NextResponse` | 지정된 URL로 리다이렉트하는 응답 생성 (기본 상태 코드: 307) |
| **`NextResponse.rewrite()`** | `(destination: string \| URL \| NextURL, init?: ResponseInit) => NextResponse` | 브라우저 주소 표시줄 URL을 유지한 채 다른 대상 경로의 콘텐츠를 서빙 (Proxy 전용) |
| **`NextResponse.next()`** | `(init?: { request?: { headers?: Headers } }) => NextResponse` | Proxy에서 요청 체인을 계속 진행하며, 요청 헤더를 수정해 Server Component로 전달 |

---

### 응답 쿠키 조작 (`response.cookies`)

`NextResponse` 인스턴스의 `cookies` 속성을 통해 브라우저로 전송할 `Set-Cookie` 헤더를 편리하게 설정할 수 있다.

```ts
const response = NextResponse.next()

// 쿠키 설정
response.cookies.set({
  name: 'session_id',
  value: 'abc123xyz',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7일
})

// 쿠키 읽기 및 삭제
const cookie = response.cookies.get('session_id')
response.cookies.delete('old_cookie')
```

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router 및 Proxy(Middleware) 전용 `NextResponse` 도입 |

## 예제 및 데모 설계

- Route Handler(`app/api/data/route.ts`)에서 `NextResponse.json({ message: 'Success' }, { status: 200 })`을 반환하는 기본 API를 구현한다.
- Proxy에서 `NextResponse.next({ request: { headers: newHeaders } })`를 통해 클라이언트 요청에 사용자 ID 헤더(`x-user-id`)를 주입하고, Server Component에서 `headers()`로 이를 읽는 통합 흐름을 검증한다.
- 특정 경로 접근 시 `NextResponse.redirect(new URL('/login', request.url))`로 로그인 페이지로 리다이렉트하는 인증 가드를 테스트한다.

## 연습 문제

1. Proxy(Middleware)에서 요청 체인을 통과시키면서 다운스트림 Server Component가 읽을 수 있도록 새 요청 헤더를 주입하는 올바른 코드는?
   - A. `request.headers.set('x-key', 'val'); return NextResponse.next()`
   - B. `return NextResponse.next({ request: { headers: newHeaders } })`
   - C. `return NextResponse.rewrite({ headers: newHeaders })`
   - D. `return NextResponse.json({ headers: newHeaders })`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `NextResponse.next({ request: { headers: newHeaders } })` 형태로 `request.headers` 옵션을 전달해야 다운스트림 Server Component 및 Route Handler에서 `headers()` API로 수정된 헤더를 읽을 수 있다.
</details>

## 챕터 요약

- `NextResponse`는 `json`, `redirect`, `rewrite`, `next` 등 라우팅 및 Proxy 전용 정적 헬퍼를 제공한다.
- `NextResponse.next({ request: { headers } })`로 Server Component에 커스텀 헤더를 전달할 수 있다.
- `response.cookies`를 통해 간편하게 `Set-Cookie` 헤더를 설정하고 관리한다.
