# NextRequest

- 공식 문서: [NextRequest](https://nextjs.org/docs/app/api-reference/functions/next-request)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web 표준 `Request` 객체를 확장한 `NextRequest`의 추가 속성과 편의 메서드를 이해한다.
- `nextUrl`을 활용하여 URL, 쿼리 파라미터(`searchParams`), 경로명을 정밀하게 파싱하고 조작한다.
- `cookies`, `ip`, `geo` 등 Next.js 전용 속성을 활용해 Proxy(Middleware) 및 Route Handler를 구현한다.

## 핵심 개념 및 설명

`NextRequest`는 표준 [Web Request API](https://developer.mozilla.org/docs/Web/API/Request)를 확장하여 Next.js 전용 편의 메서드와 속성을 추가한 객체다. 주로 **Proxy(Middleware)**와 **Route Handler**의 요청 인자로 전달된다.

```ts filename="middleware.ts"
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. nextUrl을 통한 쿼리 파라미터 확인
  const query = request.nextUrl.searchParams.get('query')

  // 2. 쿠키 읽기
  const token = request.cookies.get('token')?.value

  // 3. 지리 정보 및 IP 확인
  const country = request.geo?.country || 'US'
  const ip = request.ip

  return NextResponse.next()
}
```

---

### `NextRequest` 속성 레퍼런스

| 속성명 | 타입 | 설명 |
|---|---|---|
| **`nextUrl`** | `NextURL` | Next.js 전용 속성(`basePath`, `pathname`, `searchParams` 등)이 포함된 확장 `URL` 객체 |
| **`cookies`** | `RequestCookies` | 요청에 포함된 HTTP Cookie를 조회/조작할 수 있는 전용 맵 객체 (`get`, `getAll`, `has`, `set`, `delete`) |
| **`ip`** | `string \| undefined` | 요청을 보낸 클라이언트의 IP 주소 (배포 플랫폼 연동 시 제공) |
| **`geo`** | `Geo \| undefined` | 클라이언트의 지리적 위치 정보 객체 (`city`, `country`, `region`, `latitude`, `longitude`) |

---

### `nextUrl` 속성 세부 명세

`request.nextUrl`은 표준 `URL` 객체를 상속하며 다음과 같은 추가 속성을 제공한다.

```ts
request.nextUrl.pathname // '/blog/article-1'
request.nextUrl.searchParams // URLSearchParams { 'page' => '2' }
request.nextUrl.basePath // '/custom-base' (next.config.js 설정 값)
```

- **클론 및 변형**: `request.nextUrl.clone()`을 사용하여 특정 쿼리나 경로를 수정한 뒤 `NextResponse.rewrite()`나 `NextResponse.redirect()`의 대상 URL로 전달할 수 있다.

```ts
const url = request.nextUrl.clone()
url.pathname = '/maintenance'
return NextResponse.rewrite(url)
```

---

### `cookies` 메서드 명세

| 메서드 | 시그니처 | 설명 |
|---|---|---|
| `get(name)` | `(name: string) => RequestCookie \| undefined` | 이름에 해당하는 쿠키 객체(`{ name, value }`)를 반환 |
| `getAll()` | `() => RequestCookie[]` | 모든 쿠키의 배열을 반환 |
| `has(name)` | `(name: string) => boolean` | 해당 이름의 쿠키 존재 여부 반환 |
| `set(name, value)` | `(name: string, value: string) => RequestCookies` | 요청 객체 내에 쿠키 값을 설정 |
| `delete(name)` | `(name: string) => boolean` | 요청 객체 내에서 쿠키 삭제 |

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router 및 Proxy(Middleware) 전용 `NextRequest` 안정화 |

## 예제 및 데모 설계

- Route Handler(`app/api/user/route.ts`)에서 `NextRequest`의 `request.nextUrl.searchParams`를 읽어 필터링된 응답을 반환하는 API를 구성한다.
- `request.cookies.get('session')`을 조회하여 인증 토큰 유무에 따라 다른 응답을 분기 처리한다.

## 연습 문제

1. `NextRequest` 객체에서 URL 쿼리 파라미터 `page` 값을 읽는 가장 권장되는 방법은?
   - A. `request.params.page`
   - B. `request.nextUrl.searchParams.get('page')`
   - C. `new URL(request.url).query.page`
   - D. `request.query.page`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `NextRequest`의 `nextUrl.searchParams`는 웹 표준 `URLSearchParams` 인스턴스이므로 `.get('key')` 메서드를 통해 안전하게 읽을 수 있다.
</details>

## 챕터 요약

- `NextRequest`는 표준 Web Request에 `nextUrl`, `cookies`, `ip`, `geo`를 확장한 객체다.
- Proxy 및 Route Handler에서 요청 정보를 파싱하고 재작성(rewrite)할 때 핵심 도구로 사용된다.
