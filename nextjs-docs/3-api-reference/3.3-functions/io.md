# io

- 공식 문서: [io](https://nextjs.org/docs/app/api-reference/functions/io)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Cache Components 환경에서 동기 연산(`new Date()`, `Math.random()`)을 정적 static shell에서 제외하도록 선언하는 `io()` 함수의 역할을 이해한다.
- Server Component(`await io()`)와 Client Component(`use(io())`)에서의 올바른 호출 패턴을 습득한다.
- `io()`가 불필요한 시점(이미 요청 시점 API를 사용하거나 비동기 `fetch`가 Suspense로 감싸진 경우)을 구분한다.
- [`connection()`](./connection.md)과의 차이점(prefetch 및 캐싱 연계 가능 여부)을 비교하고 상황에 맞게 적용한다.

## 핵심 개념 및 설명

[Cache Components](../../1-getting-started/caching.md)가 활성화되었을 때, Next.js는 `new Date()`나 `Math.random()` 같은 동기적 연산 값을 빌드 시점의 [static shell](../../4-glossary/README.md)에 영구 캡처할지, 아니면 매 요청마다 신선하게 생성할지 명시적인 결정을 요구한다.

- **static shell에 캡처**: [`"use cache"`](../3.4-directives/use-cache.md)로 감싸서 빌드 시점에 저장한다.
- **static shell에서 제외**: `await io()`를 호출하여 prerender 도중 일시 중단(suspend)되도록 한다.

실제 요청 시점, 캐시 스코프 내부, 브라우저 환경, 그리고 Cache Components가 비활성화된 환경에서는 `io()`가 즉시 resolve된다.

```tsx filename="app/page.tsx" highlight={13} switcher
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function Page() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <CurrentTime />
    </Suspense>
  )
}

async function CurrentTime() {
  await io() // prerender 도중 중단되어 static shell에서 제외됨
  return <p>현재 시각: {new Date().toISOString()}</p>
}
```

```jsx filename="app/page.js" highlight={13} switcher
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function Page() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <CurrentTime />
    </Suspense>
  )
}

async function CurrentTime() {
  await io()
  return <p>현재 시각: {new Date().toISOString()}</p>
}
```

### Client Component에서의 사용법

Client Component는 서버 사이드 렌더링(SSR) 도중에도 prerender되므로, 동기식 `Date.now()` 등을 호출하기 전에 React의 `use` 훅과 함께 `use(io())`를 호출한다:

```tsx filename="app/components/client-time.tsx" highlight={6} switcher
'use client'

import { use } from 'react'
import { io } from 'next/cache'

export function ClientTime() {
  use(io())
  return <div>{Date.now()}</div>
}
```

```jsx filename="app/components/client-time.js" highlight={6} switcher
'use client'

import { use } from 'react'
import { io } from 'next/cache'

export function ClientTime() {
  use(io())
  return <div>{Date.now()}</div>
}
```

### `io()`가 필요 없는 경우

- 이미 `cookies()`나 `headers()`와 같은 요청 시점 API를 사용하고 있는 경우 (그 자체가 suspension point 역할을 함).
- `<Suspense>`로 감싸진 비동기 `fetch`나 DB 쿼리를 `await`하고 있는 경우.

### `io()`와 `connection()`의 차이점

| 특성 | `io()` | `connection()` |
|---|---|---|
| **역할** | 동기 I/O가 뒤따름을 선언하여 prerender 중단 | 실제 사용자 요청이 들어올 때까지 렌더링 대기 |
| **Prefetch 지원** | **지원 ⭕** (클라이언트 prefetch 가능) | 미지원 ❌ (실제 네비게이션 도착까지 차단) |
| **`use cache` 결합** | **결합 가능 ⭕** | 결합 불가 ❌ |
| **권장 사용처** | Cache Components 환경의 일반적인 동기 I/O 처리 | 사용자의 실제 인입 연결이 반드시 필요한 특수 케이스 |

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.3.0` | `io` 함수 도입 |

## 예제 및 데모 설계

- `CurrentTime` 컴포넌트에 `await io()`를 적용하고 `<Suspense>`로 감싸, 빌드 시 정적 껍데기(App Shell)는 즉시 생성되고 실제 시각은 요청 시점에 스트리밍되는 동작을 확인한다.
- `io()`를 사용한 함수에 `'use cache'` 및 `cacheLife('minutes')`를 추가하여 prefetch와 캐싱이 정상 작동하는지 검증한다.
- `connection()`과 `io()`의 prefetch 네트워크 응답 차이를 개발자 도구에서 비교한다.

## 연습 문제

1. Cache Components 환경에서 `Math.random()`이나 `new Date()`를 정적 static shell에 고정시키지 않고 요청 시점에 실행되도록 만들기 위해 호출하는 함수는?
   - A. `io()`
   - B. `useId()`
   - C. `useRouter()`
   - D. `redirect()`

<details><summary>정답 보기</summary>

정답: **A**  
해설: `await io()`는 prerender 도중 렌더링을 일시 중단(suspend)시켜 해당 동기 값이 static shell에 고정되는 것을 방지한다.
</details>

2. `io()`가 `connection()`에 비해 갖는 장점으로 올바른 것은?
   - A. 클라이언트 prefetch 및 `'use cache'`와의 결합을 지원한다.
   - B. 서버리스 메모리를 절약한다.
   - C. 쿠키를 자동으로 암호화한다.
   - D. Client Component에서만 단독으로 실행된다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `connection()`은 실제 사용자 요청 도달 전까지 prefetch를 차단하지만, `io()`는 일반 비동기 함수처럼 동작하므로 prefetch와 `use cache` 캐싱을 모두 지원한다.
</details>

## 챕터 요약

- `io()`는 Cache Components 환경에서 동기 연산을 static shell에서 제외하도록 알리는 `next/cache`의 함수다.
- Server Component에서는 `await io()`, Client Component에서는 `use(io())`로 호출한다.
- `new Date()`, `Math.random()`, 동기 DB 드라이버 호출 직전에 선언한다.
- `connection()`과 달리 prefetch를 차단하지 않으며 `'use cache'`와의 결합이 가능하다.
- 이미 `cookies()`나 `fetch`를 Suspense 내부에서 사용 중이라면 별도 호출이 불필요하다.
