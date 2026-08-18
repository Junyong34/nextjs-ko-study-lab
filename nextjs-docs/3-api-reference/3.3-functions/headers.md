# headers

- 공식 문서: [headers](https://nextjs.org/docs/app/api-reference/functions/headers)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Server Component에서 인입된 HTTP 요청 헤더를 조회하는 `headers` 비동기 함수의 사용법을 익힌다.
- Next.js 15부터 도입된 `await headers()` 비동기 호출 패턴을 이해한다.
- Web Headers 표준 인터페이스(`get`, `has`, `entries`, `forEach` 등)를 활용하여 요청 헤더 정보를 안전하게 추출한다.
- `headers()` 호출이 라우트 렌더링 방식(다이나믹 렌더링) 및 Suspense 경계에 미치는 영향을 파악한다.

## 핵심 개념 및 설명

`headers`는 Server Component에서 클라이언트가 보낸 HTTP 요청 헤더(Incoming Request Headers)를 읽을 수 있도록 지원하는 **비동기(async)** 함수다.

```tsx filename="app/page.tsx" switcher
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  return <div>사용자 브라우저: {userAgent}</div>
}
```

```jsx filename="app/page.js" switcher
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  return <div>사용자 브라우저: {userAgent}</div>
}
```

> **알아두면 좋은 점**:
>
> - `headers`는 **비동기 함수**이므로 반드시 `await` 키워드를 사용하여 호출해야 한다.
> - 반환되는 객체는 **읽기 전용(Read-only)** 표준 [Web Headers](https://developer.mozilla.org/docs/Web/API/Headers) 인스턴스이며, `set()`이나 `delete()`를 호출할 수 없다.
> - 요청 시점 API(Request-time API)이므로, 호출 시 해당 라우트는 빌드 시점 정적 생성을 건너뛰고 [다이나믹 렌더링](../../4-glossary/README.md)으로 전환된다.
> - Cache Components 환경에서는 `<Suspense>` 경계 외부에서 `headers()`를 호출하면 prerender가 차단된다.

### 반환 객체 및 주요 메서드

`headers()`는 표준 Web Headers 인터페이스를 제공한다:

- `get(name)`: 지정한 이름의 헤더 값을 문자열로 반환한다 (없으면 `null`).
- `has(name)`: 해당 헤더의 존재 여부를 `boolean`으로 반환한다.
- `entries()`: 모든 헤더의 키/값 쌍을 순회할 수 있는 이터레이터를 반환한다.
- `forEach(callback)`: 각 헤더 항목에 대해 콜백 함수를 실행한다.
- `keys()` / `values()`: 헤더 이름 / 값 목록의 이터레이터를 반환한다.

### 예제

#### Authorization 헤더를 백엔드 API로 전달하기

```tsx filename="app/profile/page.tsx" switcher
import { headers } from 'next/headers'

export default async function ProfilePage() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  const res = await fetch('https://api.example.com/user/profile', {
    headers: {
      Authorization: authHeader || '',
    },
  })

  const user = await res.json()
  return <h1>환영합니다, {user.name}님</h1>
}
```

```jsx filename="app/profile/page.js" switcher
import { headers } from 'next/headers'

export default async function ProfilePage() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  const res = await fetch('https://api.example.com/user/profile', {
    headers: {
      Authorization: authHeader || '',
    },
  })

  const user = await res.json()
  return <h1>환영합니다, {user.name}님</h1>
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0-RC` | `headers`가 비동기 함수(`Promise`)로 변경됨 |
| `v13.0.0` | App Router에 `headers` 도입 |

## 예제 및 데모 설계

- `headers().get('x-forwarded-for')` 또는 IP 관련 헤더를 읽어 접속 국가/위치별 맞춤 안내 메시지를 렌더링하는 데모를 구성한다.
- `headers()` 호출부를 `<Suspense>` 경계로 감싸, 상위 레이아웃은 정적 App Shell로 유지하고 내부 컴포넌트만 동적 스트리밍되는 구조를 테스트한다.
- `headers().set()` 시도 시 읽기 전용 에러가 발생하는지 확인한다.

## 연습 문제

1. `headers()` 함수가 반환하는 객체의 특징으로 올바른 것은?
   - A. 읽기/쓰기가 모두 자유로운 JavaScript 일반 객체다.
   - B. 클라이언트 쿠키를 수정하는 특수 배열이다.
   - C. 수정 및 삭제가 불가능한 읽기 전용 Web Headers 인스턴스다.
   - D. Client Component에서만 사용할 수 있는 React 훅이다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: `headers()`는 들어온 HTTP 요청 헤더를 조회하기 위한 읽기 전용 Web Headers 인스턴스를 반환한다.
</details>

2. 페이지 컴포넌트 본문에서 `await headers()`를 호출했을 때 라우트의 렌더링 동작 변화는?
   - A. 영구적으로 빌드 시점 정적 페이지(SSG)로 고정된다.
   - B. 요청 시점의 데이터를 필요로 하므로 다이나믹 렌더링으로 전환된다.
   - C. 서버가 500 에러를 반환한다.
   - D. 클라이언트 SPA로 다운그레이드된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `headers()`는 요청 시점에만 알 수 있는 런타임 헤더를 읽으므로, 호출된 라우트는 다이나믹 렌더링으로 동작한다.
</details>

## 챕터 요약

- `headers`는 인입된 HTTP 요청 헤더를 읽는 `next/headers`의 비동기 함수다.
- Next.js 15+에서는 반드시 `await headers()` 형태로 호출해야 한다.
- 반환값은 읽기 전용 Web Headers 인스턴스로 `get()`, `has()`, `entries()` 등을 지원한다.
- `headers()` 호출 시 해당 라우트는 다이나믹 렌더링으로 처리된다.
- 인바운드 인증 헤더 포워딩 및 클라이언트 환경 감지에 주로 활용된다.
