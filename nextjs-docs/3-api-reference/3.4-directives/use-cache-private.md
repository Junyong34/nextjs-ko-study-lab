# use cache: private

- 공식 문서: [use cache: private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private)
- 상위 메뉴: [Directives](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `'use cache: private'` 지시어의 역할과 런타임 요청 API(`cookies()`, `headers()`, `searchParams`)를 캐시 스코프 내부에서 직접 접근할 수 있는 메커니즘을 이해한다.
- 캐시 결과가 서버에 영구 저장되지 않고 **클라이언트 브라우저 메모리에만 캐시**되는 프라이빗 캐시의 수명 특성을 파악한다.
- 일반 `'use cache'` 지시어와 비교하여 프라이빗 캐시가 필요한 시점(컴플라이언스 요구사항, 리팩토링 비용 등)을 구분한다.
- 프라이빗 캐시 내부에서 허용되는 요청 API와 금지되는 API(`connection()`)를 구분하여 적용한다.

## 핵심 개념 및 설명

`'use cache: private'` 지시어는 캐시 스코프 내부에서 `cookies()`, `headers()`, `searchParams`와 같은 런타임 요청 API에 직접 접근할 수 있도록 허용한다.

단, 그 결과는 **서버에 절대 저장되지 않으며**, 오직 **사용자의 브라우저 메모리에만 캐시**된다. 따라서 페이지 새로고침 시 캐시는 유지되지 않는다.

### 사용 시점

다음과 같은 상황에서 `'use cache: private'`를 사용한다:

- 이미 런타임 데이터를 읽고 있는 함수를 캐시하고자 할 때, [런타임 접근을 외부로 분리하여 인자로 전달하는 표준 패턴](../../1-getting-started/caching.md)으로 리팩토링하기 어려운 경우.
- 규정 준수(Compliance) 요건상 특정 개인화 데이터를 서버에 임시로라도 저장할 수 없는 경우.

런타임 데이터에 접근하므로 이 지시어가 적용된 함수는 static shell 생성 시 실행에서 제외되며, 서버 렌더링 시마다 실행된다.

> **알아두면 좋은 점**:
>
> - `'use cache: private'`에는 커스텀 캐시 핸들러(`cacheHandlers`)를 설정할 수 없다.
> - 일반 `'use cache'` 및 `'use cache: remote'`와의 차이점 비교는 [`use cache: remote` 문서](./use-cache-remote.md)를 참조한다.

### 사용법 (Usage)

`next.config.ts` 파일에서 [`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md) 플래그를 활성화한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

함수 상단에 `'use cache: private'`를 선언하고 [`cacheLife`](../3.3-functions/cacheLife.md) 설정을 함께 지정한다:

```tsx filename="app/product/[id]/page.tsx" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <Suspense fallback={<div>추천 상품 로딩 중...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }: { productId: string }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div className="grid grid-cols-3 gap-4">
      {recommendations.map((rec) => (
        <div key={rec.id}>{rec.name}</div>
      ))}
    </div>
  )
}

async function getRecommendations(productId: string) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  // private 캐시 함수 내부에서 cookies()에 직접 접근
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

```jsx filename="app/product/[id]/page.js" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <Suspense fallback={<div>추천 상품 로딩 중...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div className="grid grid-cols-3 gap-4">
      {recommendations.map((rec) => (
        <div key={rec.id}>{rec.name}</div>
      ))}
    </div>
  )
}

async function getRecommendations(productId) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

> **알아두면 좋은 점**: 링크별 prefetching이 동작하려면 `stale` 시간이 최소 30초 이상이어야 하며, 라우트의 App Shell에 콘텐츠가 포함되려면 5분 이상이어야 한다.

### 프라이빗 캐시에서 허용되는 요청 API

| API | 일반 `use cache` | `'use cache: private'` |
|---|---|---|
| `cookies()` | 허용 안 됨 ❌ | **허용됨 ⭕** |
| `headers()` | 허용 안 됨 ❌ | **허용됨 ⭕** |
| `searchParams` | 허용 안 됨 ❌ | **허용됨 ⭕** |
| `connection()` | 허용 안 됨 ❌ | 허용 안 됨 ❌ |

> **주의**: [`connection()`](../3.3-functions/connection.md)은 안전하게 캐시될 수 없는 연결별 고유 정보를 제공하므로 두 지시어 모두에서 사용이 금지된다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | Cache Components 기능과 함께 `"use cache: private"` 활성화 |

## 예제 및 데모 설계

- 사용자 장바구니 요약 컴포넌트에서 `cookies()`의 세션 토큰을 읽어 장바구니 개수를 60초간 브라우저 메모리에 캐시하는 시나리오를 구성한다.
- 일반 `'use cache'`와 `'use cache: private'` 내부에서 `cookies()`를 호출했을 때의 빌드 및 런타임 결과 차이를 비교 검증한다.
- 브라우저 뒤로 가기/앞으로 가기 시 브라우저 메모리 캐시 재사용 여부를 테스트한다.

## 연습 문제

1. `'use cache: private'` 지시어가 일반 `'use cache'`와 구별되는 핵심 동작 특성은?
   - A. Redis 서버에만 데이터를 저장한다.
   - B. 캐시 결과가 서버에 저장되지 않고 오직 클라이언트 브라우저 메모리에만 캐시된다.
   - C. 빌드 시점에 모든 페이지를 정적으로 생성한다.
   - D. Client Component 파일 내부에서만 선언할 수 있다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `'use cache: private'`는 `cookies()`나 `headers()`에 직접 접근할 수 있도록 허용하는 대신, 결과가 서버에 절대 저장되지 않고 사용자의 브라우저 메모리에만 캐시된다.
</details>

2. `'use cache: private'` 함수 내부에서 직접 호출할 수 **없는** API는?
   - A. `cookies()`
   - B. `headers()`
   - C. `searchParams`
   - D. `connection()`

<details><summary>정답 보기</summary>

정답: **D**  
해설: `connection()`은 연결별 비동기 컨텍스트를 나타내며 안전하게 캐시될 수 없으므로 일반 캐시와 프라이빗 캐시 모두에서 사용이 금지된다.
</details>

## 챕터 요약

- `'use cache: private'`는 캐시 스코프 내에서 `cookies()`, `headers()`, `searchParams` 호출을 허용하는 특수 캐싱 지시어다.
- 연산 결과는 서버에 저장되지 않고 클라이언트 브라우저 메모리에만 한시적으로 캐시된다.
- 런타임 데이터 인자 분리 리팩토링이 어렵거나 서버에 개인화 데이터를 보관할 수 없는 보안 요구사항에 적합하다.
- `connection()` 호출은 여전히 금지되며, static shell 빌드 단계에서는 실행에서 제외된다.
- `cacheLife({ stale: 60 })` 등을 통해 브라우저 캐시 유지 시간을 명시적으로 설정한다.
