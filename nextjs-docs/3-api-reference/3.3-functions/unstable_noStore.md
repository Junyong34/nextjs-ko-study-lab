# unstable_noStore

- 공식 문서: [unstable_noStore](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 특정 컴포넌트의 prerender를 선언적으로 옵트아웃(opt-out)하고 캐싱을 건너뛰게 만드는 `unstable_noStore` 함수의 역할을 이해한다.
- Next.js 15+에서 도입된 표준 대체 함수인 [`connection()`](./connection.md)으로의 마이그레이션 배경을 설명한다.
- `fetch`의 `cache: 'no-store'` 및 페이지 단위 `dynamic = 'force-dynamic'`과 비교하여 컴포넌트 수준 제어의 이점을 파악한다.
- `unstable_cache` 내부에서 `unstable_noStore`를 호출했을 때의 상호작용 특성을 이해한다.

## 핵심 개념 및 설명

`unstable_noStore`는 특정 Server Component가 캐시되지 않아야 함을 선언하고, 정적 prerender 대상에서 제외하여 요청 시점에 렌더링되도록 만드는 레거시 함수다.

> **참고**:
> 이 API는 이전 버전과의 호환성을 위해 유지되는 레거시 함수이며 더 이상 사용이 권장되지 않는다.
> **Next.js 15 이상에서는 `unstable_noStore` 대신 [`connection()`](./connection.md) 사용을 공식 권장한다.**

```jsx
import { unstable_noStore as noStore } from 'next/cache'

export default async function ServerComponent() {
  noStore()
  const result = await db.query(...)
  return <div>{result.title}</div>
}
```

> **알아두면 좋은 점**:
>
> - `unstable_noStore()`는 `fetch` 요청에 `cache: 'no-store'` 옵션을 지정하는 것과 동일한 효과를 낸다.
> - 페이지 전체에 적용되는 `export const dynamic = 'force-dynamic'`보다 컴포넌트 단위로 세밀하게 캐시를 해제할 수 있어 선호되었다.
> - [`unstable_cache`](./unstable_cache.md) 내부에서 `unstable_noStore`를 호출하면 정적 생성을 옵트아웃하지 않으며, `unstable_cache` 자체의 캐시 설정에 따라 동작이 결정된다.

### 사용법 (Usage)

`fetch`를 사용하지 않는 DB 쿼리나 외부 SDK 호출 시 `cache: 'no-store'` 또는 `next: { revalidate: 0 }` 옵션을 전달할 수 없을 때, 함수 최상단에 `noStore()`를 호출하여 대체할 수 있다:

```tsx filename="app/components/realtime-feed.tsx" switcher
import { unstable_noStore as noStore } from 'next/cache'

export default async function RealtimeFeed() {
  noStore()
  const feed = await db.feed.findMany({ take: 10 })

  return (
    <ul>
      {feed.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/components/realtime-feed.js" switcher
import { unstable_noStore as noStore } from 'next/cache'

export default async function RealtimeFeed() {
  noStore()
  const feed = await db.feed.findMany({ take: 10 })

  return (
    <ul>
      {feed.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ul>
  )
}
```

### 최신 표준 `connection()`으로의 전환

Next.js 15 이상에서는 `noStore()` 대신 `next/server`의 `connection()`을 `await`하는 방식을 사용한다:

```tsx filename="app/components/realtime-feed.tsx" switcher
import { connection } from 'next/server'

export default async function RealtimeFeed() {
  await connection() // 요청 시점 렌더링을 명시적으로 선언
  const feed = await db.feed.findMany({ take: 10 })

  return <div>{/* 피드 목록 */}</div>
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `connection()` 도입으로 인해 `unstable_noStore` 사용 중단(deprecated) 권고 |
| `v14.0.0` | `unstable_noStore` 도입 |

## 예제 및 데모 설계

- `noStore()`가 포함된 컴포넌트가 포함된 페이지를 빌드할 때 해당 세그먼트가 다이나믹 렌더링(`λ`)으로 분류되는지 확인한다.
- `unstable_noStore`로 작성된 레거시 코드를 `await connection()`으로 마이그레이션했을 때의 동작 일치성을 검증한다.
- Suspense 경계 내부에서 `noStore()`를 호출하여 상위 레이아웃은 정적 prerender를 유지하고 하위 컴포넌트만 요청 시점에 스트리밍되는지 확인한다.

## 연습 문제

1. Next.js 15 이상에서 `unstable_noStore` 대신 사용하도록 권장되는 최신 표준 API는?
   - A. `cacheLife('seconds')`
   - B. `connection()`
   - C. `revalidatePath()`
   - D. `cookies().get()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 15부터는 컴포넌트 수준에서 요청 시점 렌더링을 명시하기 위해 `unstable_noStore` 대신 `connection()`을 사용하는 것이 권장된다.
</details>

2. `unstable_noStore` 호출이 미치는 영향으로 올바른 것은?
   - A. 전체 Next.js 서버를 재시작한다.
   - B. 호출된 컴포넌트를 정적 prerender에서 제외하고 요청 시점에 렌더링하도록 지정한다.
   - C. 브라우저의 로컬 스토리지를 비운다.
   - D. 모든 Server Action을 비활성화한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `unstable_noStore`는 해당 컴포넌트가 캐시되지 않고 요청 시점에 실행되어야 함을 선언하여 정적 생성을 옵트아웃한다.
</details>

## 챕터 요약

- `unstable_noStore`는 컴포넌트 단위로 정적 prerender를 건너뛰고 캐시를 비활성화하는 레거시 함수다.
- `fetch` 옵션을 직접 넘기기 어려운 비-fetch DB 호출이나 SDK에서 주로 사용되었다.
- Next.js 15+에서는 시맨틱하게 더 명확한 `await connection()` 함수 사용을 권장한다.
- `unstable_cache` 내부에서 호출 시 정적 생성을 옵트아웃하지 않고 해당 캐시 설정을 따른다.
- 하위 호환성을 위해 유지되지만 신규 코드에서는 지양한다.
