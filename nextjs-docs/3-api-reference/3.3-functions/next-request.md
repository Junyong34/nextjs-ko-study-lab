# NextRequest

- 공식 문서: [NextRequest](https://nextjs.org/docs/app/api-reference/functions/next-request)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web 표준 Request API를 확장하여 Next.js 특화 편의 기능을 제공하는 `NextRequest` 객체의 역할을 이해한다.
- `request.cookies`를 통한 간편한 쿠키 조회, 설정, 삭제 인터페이스를 습득한다.
- `request.nextUrl`을 활용하여 URL 파싱(`pathname`, `searchParams`, `basePath`)을 처리하는 방법을 익힌다.
- Route Handler 및 미들웨어(Proxy)에서 들어오는 HTTP 요청을 효과적으로 가공한다.

## 핵심 개념 및 설명

`NextRequest`는 표준 [Web Request API](https://developer.mozilla.org/docs/Web/API/Request)를 상속 및 확장한 클래스로, Next.js의 [Route Handler](../3.1-file-conventions/route.md)와 [미들웨어(Proxy)](../3.1-file-conventions/proxy.md)에서 전달받는 요청 인스턴스다.

```ts filename="app/api/hello/route.ts" switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name') || 'Guest'
  const token = request.cookies.get('auth-token')?.value

  return NextResponse.json({ message: `안녕하세요, ${name}님`, hasToken: !!token })
}
```

```js filename="app/api/hello/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const name = request.nextUrl.searchParams.get('name') || 'Guest'
  const token = request.cookies.get('auth-token')?.value

  return NextResponse.json({ message: `안녕하세요, ${name}님`, hasToken: !!token })
}
```

### `cookies` 인터페이스

인입 요청의 쿠키를 다루기 위한 다양한 헬퍼 메서드를 제공한다:

- `get(name)`: 이름이 일치하는 쿠키 객체(`{ name, value, path }`)를 반환한다.
- `getAll(name?)`: 특정 이름 또는 모든 쿠키의 배열을 반환한다.
- `set(name, value)`: 요청 객체에 쿠키를 설정한다.
- `delete(name)`: 해당 쿠키를 삭제한다.
- `has(name)`: 쿠키 존재 여부를 불리언으로 반환한다.
- `clear()`: 요청의 모든 쿠키를 제거한다.

### `nextUrl` 확장 프로퍼티

표준 `URL` API를 확장하여 Next.js 전용 메타데이터를 제공한다:

- `pathname`: 현재 경로 문자열 (예: `'/home'`).
- `searchParams`: URL 쿼리 파라미터를 다루는 `URLSearchParams` 객체.
- `basePath`: `next.config.js`에 정의된 라우트의 베이스 경로.
- `buildId`: Next.js 애플리케이션의 고유 빌드 식별자.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `ip` 및 `geo` 프로퍼티 제거 |
| `v13.0.0` | App Router에 `NextRequest` 도입 |

## 예제 및 데모 설계

- Route Handler에서 `request.nextUrl.searchParams`를 읽어 페이지네이션 및 필터링 쿼리를 파싱하는 데모를 설계한다.
- `request.cookies.get('session')`을 통해 인증 여부를 분기하는 API 엔드포인트를 구현한다.
- Web 표준 `Request`와 `NextRequest`의 편의 메서드 차이를 확인한다.

## 연습 문제

1. `NextRequest` 객체에서 URL의 쿼리 스트링 매개변수(`?search=nextjs`)를 읽는 가장 권장되는 방법은?
   - A. `request.query.search`
   - B. `request.nextUrl.searchParams.get('search')`
   - C. `request.params.search`
   - D. `request.body.search`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `NextRequest`는 `request.nextUrl.searchParams`를 통해 손쉽게 URL 쿼리 매개변수에 접근할 수 있다.
</details>

2. `NextRequest`의 `cookies` 메서드 중 특정 쿠키의 존재 여부를 boolean 값으로 확인하는 메서드는?
   - A. `request.cookies.check(name)`
   - B. `request.cookies.has(name)`
   - C. `request.cookies.exists(name)`
   - D. `request.cookies.isSet(name)`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `request.cookies.has(name)` 메서드를 통해 쿠키 존재 여부를 불리언으로 반환받을 수 있다.
</details>

## 챕터 요약

- `NextRequest`는 Web 표준 Request를 확장한 Next.js의 요청 객체다.
- Route Handler 및 미들웨어의 인자로 제공된다.
- `request.cookies`를 통해 간편하게 쿠키를 조회/조작한다.
- `request.nextUrl`을 통해 `pathname`, `searchParams`, `basePath`에 손쉽게 접근한다.
