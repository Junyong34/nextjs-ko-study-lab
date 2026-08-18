# cookies

- 공식 문서: [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- HTTP 요청 쿠키를 읽고 쓰는 `cookies` 비동기 함수의 사용법을 익힌다.
- Next.js 15부터 적용된 `await cookies()` 비동기 접근 모델을 이해한다.
- Server Component(읽기 전용)와 Server Function / Route Handler(읽기/쓰기/삭제 지원) 간의 권한 및 동작 차이를 파악한다.
- `get`, `getAll`, `has`, `set`, `delete` 메서드와 `httpOnly`, `secure`, `sameSite` 등 주요 쿠키 옵션을 설정한다.

## 핵심 개념 및 설명

`cookies`는 Server Component에서 인입된 HTTP 요청 쿠키를 읽거나, Server Function 및 Route Handler에서 응답 쿠키를 읽고 쓸 수 있게 해주는 **비동기(async)** 함수다.

```tsx filename="app/page.tsx" switcher
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return <div>현재 테마: {theme?.value}</div>
}
```

```jsx filename="app/page.js" switcher
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return <div>현재 테마: {theme?.value}</div>
}
```

> **알아두면 좋은 점**:
>
> - `cookies()`는 **비동기 함수**이므로 반드시 `await` 키워드를 사용해야 한다.
> - `cookies()`는 요청 시점 API(Request-time API)이므로, 레이아웃이나 페이지에서 호출 시 해당 라우트는 [다이나믹 렌더링](../../4-glossary/README.md)으로 전환된다.
> - Cache Components 환경에서 `<Suspense>` 경계 외부에서 `cookies()`를 호출하면 prerender가 차단된다.

### 제공 메서드 (Methods)

| 메서드 | 반환 타입 | 설명 |
|---|---|---|
| `get('name')` | `{ name, value } \| undefined` | 지정한 이름의 쿠키 객체를 반환한다. |
| `getAll(name?)` | `Array<{ name, value }>` | 일치하는 쿠키 목록 또는 전체 쿠키 배열을 반환한다. |
| `has('name')` | `boolean` | 해당 이름의 쿠키 존재 여부를 확인한다. |
| `set(name, value, options?)` | `void` | 응답 쿠키(`Set-Cookie`)를 설정한다. |
| `delete(name)` | `void` | 해당 쿠키를 삭제한다. |
| `toString()` | `string` | 모든 쿠키의 문자열 표현을 반환한다. |

### 쿠키 설정 옵션 (Options)

`set` 메서드 호출 시 전달할 수 있는 주요 옵션:

- `httpOnly`: 클라이언트 JavaScript(예: `document.cookie`)의 접근을 차단하여 XSS 공격을 완화한다 (권장).
- `secure`: HTTPS 연결을 통해서만 전송되도록 보장한다 (프로덕션 필수).
- `sameSite`: CSRF 공격 방지를 위한 크로스 사이트 요청 전송 정책 (`'lax'`, `'strict'`, `'none'`).
- `maxAge` / `expires`: 쿠키 유효 수명(초 단위 또는 만료 Date 객체).
- `path`: 쿠키가 유효한 경로 범위 (기본값: `'/'`).
- `domain`: 쿠키가 적용될 도메인.

### Server Component와 Server Function의 동작 차이

- **Server Component**: 브라우저가 전송한 요청 헤더를 확인하여 쿠키를 **읽는 것만 가능**하다. 스트리밍 렌더링 도중에는 HTTP 응답 헤더를 수정할 수 없으므로 `set()`이나 `delete()`를 호출할 수 없다.
- **Server Function (Server Action) & Route Handler**: 응답 헤더(`Set-Cookie`)를 제어할 수 있으므로 `set()` 및 `delete()`를 통한 쿠키 수정과 삭제가 가능하다.

### 예제

#### 1. Server Action에서 세션 쿠키 설정 및 삭제

```tsx filename="app/actions.ts" switcher
'use server'

import { cookies } from 'next/headers'

export async function login(token: string) {
  const cookieStore = await cookies()

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

```js filename="app/actions.js" switcher
'use server'

import { cookies } from 'next/headers'

export async function login(token) {
  const cookieStore = await cookies()

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0-RC` | `cookies`가 비동기 함수(`Promise`)로 변경됨 |
| `v13.0.0` | App Router에 `cookies` 도입 |

## 예제 및 데모 설계

- Server Component에서 사용자 언어 설정 쿠키를 읽어 맞춤 UI를 렌더링하는 데모를 설계한다.
- 로그인 폼의 Server Action에서 `cookies().set()`을 통해 인증 토큰을 저장하고 보호된 라우트로 리다이렉트하는 흐름을 구성한다.
- Server Component 렌더링 도중 `cookies().set()`을 호출했을 때 발생하는 런타임 에러를 확인한다.

## 연습 문제

1. Next.js 15+ 환경에서 `cookies()` 함수를 올바르게 호출하는 방식은?
   - A. `const cookieStore = cookies()`
   - B. `const cookieStore = await cookies()`
   - C. `const [cookies, setCookies] = useCookies()`
   - D. `const cookieStore = cookies.getStore()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 15부터 `cookies()`는 `Promise`를 반환하는 비동기 함수로 변경되었으므로 반드시 `await`와 함께 사용해야 한다.
</details>

2. Server Component 렌더링 본문 내부에서 쿠키를 수정하려 할 때 발생하는 동작으로 올바른 것은?
   - A. 정상적으로 브라우저 쿠키가 즉시 덮어씌워진다.
   - B. Server Component 렌더링 중에는 쿠키 수정(`set`, `delete`)이 허용되지 않아 에러가 발생하며, Server Function이나 Route Handler에서 수행해야 한다.
   - C. 클라이언트의 localStorage에 대신 저장된다.
   - D. 쿠키가 무기한 만료 처리된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Server Component는 요청 스트리밍 렌더링 특성상 응답 헤더를 변경할 수 없으므로 읽기만 가능하며, 쿠키 수정은 Server Action이나 Route Handler에서 수행해야 한다.
</details>

## 챕터 요약

- `cookies`는 HTTP 쿠키를 읽고 쓰는 `next/headers`의 비동기 함수다.
- Next.js 15 이상에서는 반드시 `await cookies()` 형태로 호출해야 한다.
- Server Component에서는 읽기(`get`, `getAll`, `has`)만 가능하며, 쓰기 및 삭제(`set`, `delete`)는 Server Function이나 Route Handler에서만 지원된다.
- 보안을 위해 `httpOnly`, `secure`, `sameSite` 옵션을 적극 활용한다.
- 호출 시 라우트가 다이나믹 렌더링으로 전환된다.
