# connection

- 공식 문서: [connection](https://nextjs.org/docs/app/api-reference/functions/connection)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 렌더링이 빌드 시점이 아닌 실제 사용자 요청이 들어오는 시점까지 대기하도록 명시하는 `connection()` 함수의 역할을 이해한다.
- `cookies()`나 `headers()`와 같은 요청 헤더를 읽지 않으면서도 `Math.random()`, `new Date()`, 동기 DB 쿼리 등을 요청 시점에 실행되도록 제어하는 패턴을 익힌다.
- 레거시 API인 [`unstable_noStore`](./unstable_noStore.md)를 대체하는 표준 비동기 선언 방식을 습득한다.
- Cache Components 환경에서 `io()`와 `connection()`의 차이점 및 적절한 사용 시점을 구분한다.

## 핵심 개념 및 설명

`connection()`은 컴포넌트나 함수의 렌더링이 정적 prerender 단계를 멈추고, 실제 클라이언트의 **인입 요청(incoming user request)**을 기다린 후 실행되도록 선언하는 비동기 함수다.

`cookies`나 `headers` 같은 요청 시점 API를 직접 사용하지 않지만, 매 요청마다 달라져야 하는 난수(`Math.random()`), 현재 시각(`new Date()`), 또는 로컬 동기 DB 연산을 수행해야 할 때 유용하다.

```tsx filename="app/page.tsx" switcher
import { connection } from 'next/server'

export default async function Page() {
  await connection() // 정적 prerender가 여기서 중단된다
  // 아래 코드는 오직 실제 요청 시점에만 실행된다
  const rand = Math.random()
  return <span>무작위 번호: {rand}</span>
}
```

```jsx filename="app/page.js" switcher
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  const rand = Math.random()
  return <span>무작위 번호: {rand}</span>
}
```

> **알아두면 좋은 점**:
>
> - `connection()`은 기존의 [`unstable_noStore`](./unstable_noStore.md)를 완전히 대체하는 표준 API다.
> - 일반적인 요청 시점 API(`cookies()`, `headers()`, `searchParams`)를 이미 사용하고 있다면 별도로 `connection()`을 호출할 필요가 없다.
> - Cache Components 환경에서는 static shell에서 제외하되 캐시나 prefetch를 지원해야 하는 경우 [`io()`](./io.md)를 우선 고려하고, 진정한 실시간 사용자 요청 대기가 필요한 경우에만 `connection()`을 사용한다.

### 시그니처 및 반환값

```tsx
function connection(): Promise<void>
```

매개변수를 받지 않으며, `Promise<void>`를 반환하므로 단순히 `await connection()` 형태로 실행한다.

### 예제: 동기식 데이터베이스 드라이버

`better-sqlite3`와 같은 동기 DB 드라이버는 빌드 시점 prerender 중에 즉시 쿼리가 실행되어 고정될 수 있다. 요청 시점 조회가 필요하다면 쿼리 실행 전 `connection()`을 호출한다:

```ts filename="app/lib/data.ts" switcher
import { connection } from 'next/server'
import Database from 'better-sqlite3'

const db = new Database('app.db')

export async function getVisitorCount() {
  await connection() // prerender에서 제외
  return db.prepare('SELECT value FROM counters WHERE name = ?').get('visitors')
}
```

```js filename="app/lib/data.js" switcher
import { connection } from 'next/server'
import Database from 'better-sqlite3'

const db = new Database('app.db')

export async function getVisitorCount() {
  await connection()
  return db.prepare('SELECT value FROM counters WHERE name = ?').get('visitors')
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `connection` 함수 안정화 (Stabilized) |
| `v15.0.0-RC` | `connection` 도입 |

## 예제 및 데모 설계

- `await connection()`이 선언된 컴포넌트가 빌드 결과 요약에서 다이나믹 렌더링(`λ`)으로 표시되는지 확인한다.
- `<Suspense>` 경계 내부에 `connection()` 기반 컴포넌트를 배치하여 상위 페이지의 정적 App Shell과 하위 실시간 데이터의 스트리밍 조합을 테스트한다.
- `connection()` 호출 시점과 실제 렌더링 타임스탬프를 출력하여 매 새로고침마다 값이 갱신되는지 검증한다.

## 연습 문제

1. `await connection()`을 호출하는 주된 목적으로 올바른 것은?
   - A. 클라이언트 WebSocket 연결을 초기화한다.
   - B. 요청 헤더를 읽지 않는 컴포넌트에서 prerender를 중단하고 실제 사용자 요청 시점에 렌더링되도록 강제한다.
   - C. 데이터베이스 연결 풀을 생성한다.
   - D. `next.config.js`를 재로드한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `connection()`은 `cookies`나 `headers` 없이도 해당 컴포넌트의 렌더링을 실제 사용자 요청 시점으로 미루어 정적 빌드 고정을 방지한다.
</details>

2. Next.js 15+에서 `unstable_noStore` 대신 사용이 권장되는 표준 API는?
   - A. `cacheLife('seconds')`
   - B. `connection()`
   - C. `useSelectedLayoutSegment()`
   - D. `revalidatePath('/')`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `connection()`은 Next.js 15에서 `unstable_noStore`를 공식 대체하여 표준화된 함수다.
</details>

## 챕터 요약

- `connection()`은 렌더링이 실제 사용자 요청을 기다려 실행되도록 만드는 `next/server`의 비동기 함수다.
- `unstable_noStore`의 공식 후속 표준 API다.
- `cookies()`나 `headers()`를 쓰지 않는 난수, 타임스탬프, 동기 DB 쿼리 등의 다이나믹 처리에 필수적이다.
- `await connection()` 형태로 간결하게 호출한다.
- Cache Components 환경에서 캐시 가능한 지연 처리는 `io()`, 순수 요청 대기는 `connection()`을 선택한다.
