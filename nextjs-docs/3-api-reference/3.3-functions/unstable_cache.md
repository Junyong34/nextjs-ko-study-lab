# unstable_cache

- 공식 문서: [unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 데이터베이스 쿼리 등 비-fetch 고비용 연산 결과를 캐시하는 `unstable_cache` 함수의 기본 구조와 사용법을 이해한다.
- `fetchData`, `keyParts`, `options`(`tags`, `revalidate`) 매개변수의 역할과 캐시 키 구성 방식을 익힌다.
- Next.js 16에서 도입된 최신 [`use cache`](../3.4-directives/use-cache.md) 지시어로의 마이그레이션 배경을 설명한다.
- 요청 시점 API(`cookies`, `headers`)의 인자 전달 패턴과 태그 기반 무효화 연동 방식을 적용한다.

## 핵심 개념 및 설명

`unstable_cache`는 데이터베이스 쿼리와 같은 비용이 많이 드는 작업의 결과를 캐시하고, 여러 요청에 걸쳐 재사용할 수 있도록 지원하는 유틸리티 함수다.

> **참고**:
> 이 API는 Next.js 16에서 [`use cache`](../3.4-directives/use-cache.md) 지시어로 대체되었다. Next.js 16 이상에서는 [Cache Components](../../1-getting-started/caching.md)를 활성화하고 `unstable_cache` 대신 `use cache`를 사용하는 것을 권장한다.

```jsx
import { getUser } from './data'
import { unstable_cache } from 'next/cache'

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
)

export default async function Component({ userID }) {
  const user = await getCachedUser(userID)
  return <div>{user.name}</div>
}
```

> **알아두면 좋은 점**:
>
> - 캐시 스코프 내부에서 `headers`나 `cookies`와 같은 캐시되지 않은 데이터 소스에 직접 접근하는 것은 지원되지 않는다. 필요한 경우 캐시 함수 외부에서 값을 읽어 인자로 전달해야 한다.
> - 이 API는 Next.js의 내장 데이터 캐시를 사용하여 요청 및 배포 전반에 걸쳐 결과를 유지할 수 있다.

### 매개변수 (Parameters)

```tsx
const getCachedData = unstable_cache(fetchData, keyParts?, options?)
```

- `fetchData`: 캐시하려는 데이터를 가져오는 비동기 함수이며, 반드시 `Promise`를 반환해야 한다.
- `keyParts`: 캐시 키를 추가로 식별하기 위한 문자열 배열이다. 기본적으로 함수의 문자열 표현과 전달 인자가 캐시 키로 사용되지만, 함수 외부 클로저 변수를 매개변수로 넘기지 않고 참조할 때는 반드시 `keyParts`에 해당 변수를 포함해야 한다.
- `options`: 캐시 동작을 제어하는 설정 객체다.
  - `tags`: 캐시 무효화를 제어하기 위한 태그 문자열 배열이다 ([`revalidateTag`](./revalidateTag.md)와 연동).
  - `revalidate`: 캐시를 revalidate할 주기(초 단위)다. 생략하거나 `false`로 설정하면 무기한 캐시된다.

### 반환값 (Returns)

호출 시 캐시된 데이터로 해결되는 `Promise`를 반환하는 래퍼 함수를 반환한다. 캐시에 데이터가 없으면 제공된 `fetchData`가 실행되고 결과가 캐시된 후 반환된다.

### 예제

```tsx filename="app/page.tsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const getCachedUser = unstable_cache(
    async () => {
      return await db.user.findUnique({ where: { id: userId } })
    },
    [userId], // 외부 userId 변수를 캐시 키에 명시적 포함
    {
      tags: ['users', `user-${userId}`],
      revalidate: 60, // 60초마다 revalidation
    }
  )

  const user = await getCachedUser()
  return <div>사용자 이름: {user?.name}</div>
}
```

```jsx filename="app/page.jsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({ params }) {
  const { userId } = await params

  const getCachedUser = unstable_cache(
    async () => {
      return await db.user.findUnique({ where: { id: userId } })
    },
    [userId],
    {
      tags: ['users', `user-${userId}`],
      revalidate: 60,
    }
  )

  const user = await getCachedUser()
  return <div>사용자 이름: {user?.name}</div>
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | `use cache` 지시어로 대체 권장 안내 추가 |
| `v14.0.0` | `unstable_cache` 도입 |

## 예제 및 데모 설계

- ORM(Prisma 등)을 통한 유저 프로필 조회 함수를 `unstable_cache`로 래핑하고, 60초 내 재호출 시 DB 쿼리가 발생하지 않는지 확인한다.
- `keyParts`에 식별자를 누락했을 때 서로 다른 유저 간 캐시 충돌이 발생하는 사례와 올바른 `keyParts` 지정 패턴을 비교한다.
- `unstable_cache`로 작성된 레거시 코드를 최신 `use cache` 지시어로 전환하는 리팩토링 데모를 설계한다.

## 연습 문제

1. `unstable_cache`에서 함수 본문 외부에 정의된 변수를 사용할 때 캐시 키 충돌을 방지하기 위해 사용해야 하는 매개변수는?
   - A. `options.tags`
   - B. `keyParts`
   - C. `options.revalidate`
   - D. `fetchData`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 외부 클로저 변수를 함수의 매개변수로 직접 전달하지 않는 경우, 해당 변수를 `keyParts` 배열에 추가해야 고유한 캐시 키가 올바르게 생성된다.
</details>

2. Next.js 16 환경에서 `unstable_cache`의 공식 권장 마이그레이션 대상은?
   - A. `fetch({ next: { revalidate: 60 } })`
   - B. `use cache` 지시어
   - C. `React.cache`
   - D. `useMemo`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 16에서는 비-fetch 캐싱을 위해 Cache Components 기능인 `use cache` 지시어 사용을 공식 권장한다.
</details>

## 챕터 요약

- `unstable_cache`는 DB 쿼리나 고비용 연산 결과를 다중 요청 간에 캐시하는 래퍼 함수다.
- `fetchData`, `keyParts`, `options`(`tags`, `revalidate`) 세 가지 인자를 받는다.
- 캐시 스코프 내에서 `cookies()`나 `headers()`에 직접 접근할 수 없으며 인자로 전달해야 한다.
- Next.js 16부터는 선언적이고 유연한 `use cache` 지시어로의 전환이 권장된다.
- `tags` 옵션을 통해 `revalidateTag`와 연동하여 온디맨드 무효화가 가능하다.
