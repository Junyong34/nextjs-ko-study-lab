# Adopting Partial Prefetching

- 공식 문서: [Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Partial Prefetching을 켰을 때 기본 `<Link>`와 `prefetch={true}`의 의미 변화를 설명한다.
- 기존 `prefetch={true}` 링크를 정적·uncached·세션·URL·실시간 콘텐츠별로 분류해 수정한다.
- `params`와 `searchParams`를 App Shell 밖 `Suspense` 경계로 이동한다.
- 전체 플래그와 라우트별 `prefetch = 'partial'`을 이용한 도입 전략을 선택한다.

## 핵심 개념 및 설명

Partial Prefetching은 Cache Components의 정적·캐시 콘텐츠 prefetch와 URL별 다이나믹 콘텐츠 prefetch를 분리한다. 도입 작업은 기존 `prefetch={true}`가 전달하던 콘텐츠를 감사하고, App Shell이 URL 데이터에 묶이지 않도록 라우트를 정리하는 과정이다.

> **알아두면 좋은 점**: Partial Prefetching은 `cacheComponents`가 활성화된 경우에만 동작한다.

### adoption skill 사용(권장)

공식 `next-partial-prefetching-adoption` skill은 두 단계로 작업한다. 먼저 기존 `prefetch={true}` 링크를 감사하고, 이어 `params`·`searchParams`가 `Suspense` 밖에서 읽히는 라우트를 수정한다. 단계마다 개발 validation을 사용하며 기능 경계에서 확인한다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

### 수동 도입

1. `partialPrefetching`을 활성화하고 기존 `prefetch={true}` 링크를 감사한다.
2. 이동하면서 URL 데이터를 읽는 라우트를 감사해 App Shell 밖의 읽기를 해결한다.
3. 필요하다면 URL별 콘텐츠를 링크별로 미리 가져온다.

두 validation insight는 개발 전용이며 빌드를 막지 않는다. 아직 준비되지 않은 라우트에는 `instant = false`를 export해 validation을 미룰 수 있다.

### Partial Prefetching 활성화

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

활성화 뒤 모든 `<Link>`는 목적지 App Shell을 prefetch한다. `prefetch={true}`는 더 이상 라우트의 모든 다이나믹 콘텐츠를 포함하지 않으므로 기존 링크를 감사해야 한다. 새 프로젝트에는 legacy 링크가 없으므로 여기서 끝난다.

### `<Link>` 동작 변화

| `<Link>` prop | 도입 전(Cache Components 기본값) | Partial Prefetching 도입 후 |
| --- | --- | --- |
| `<Link href="/x">` | 캐시된 페이지 렌더를 prefetch한다. | `/x`의 공유 App Shell을 불러온다. |
| `<Link href="/x" prefetch>` | 캐시된 페이지와 다이나믹 콘텐츠를 prefetch한다. | App Shell을 불러오고, `/x`가 URL 데이터를 읽을 때 [per-link prefetching](./optimizing-prefetching.md)으로 URL별 콘텐츠도 불러온다. |
| `<Link href="/x" prefetch={false}>` | prefetch를 끈다. | 동일하게 꺼진 상태다. |

App Shell은 다이나믹 params 값과 무관하게 같은 라우트의 모든 링크가 공유하므로 링크가 많아져도 셸 작업이 배로 늘지 않는다.

### `<Link prefetch={true}>` 감사

> **알아두면 좋은 점**: `cookies()`와 `headers()`는 링크 URL이 아니라 세션마다 달라진다. 세션 콘텐츠는 App Shell에 포함될 수 있다. 링크마다 달라져 공유 셸에 넣을 수 없는 URL 데이터는 `params`와 `searchParams`다.

| 목적지 | 권장 조치 |
| --- | --- |
| 완전 정적이거나 이미 캐시된 콘텐츠 | 중복인 `prefetch={true}`를 제거한다. |
| 클릭 전 유지할 uncached 콘텐츠 | `'use cache'`로 캐시하고 `prefetch={true}`를 제거한다. |
| `cookies()` 또는 `headers()`에 의존하는 콘텐츠 | 세션 값을 캐시 함수 인자로 넘기고 `prefetch={true}`를 제거한다. |
| URL 데이터를 읽거나 이에 의존하는 캐시 콘텐츠 | 클릭 전에 해소하려면 `prefetch={true}`를 유지한다. |
| 요청마다 fresh해야 하는 실시간 콘텐츠 | `prefetch={true}`를 제거하고 요청 시 스트리밍한다. |

#### 정적 또는 캐시 콘텐츠

출력이 이미 App Shell에 있으므로 `prefetch={true}`를 제거한다.

```tsx filename="app/nav.tsx"
// 이전
<Link href="/about" prefetch={true}>About</Link>
// 이후
<Link href="/about">About</Link>
```

#### Uncached 콘텐츠

데이터 접근을 `'use cache'` 함수로 감싸 App Shell에 포함하고 링크의 `prefetch={true}`를 제거한다.

```tsx filename="app/products/page.tsx"
async function getProducts() {
  'use cache'
  return fetch('https://api.example.com/products').then((res) => res.json())
}

export default async function Page() {
  return <ProductList products={await getProducts()} />
}
```

> **알아두면 좋은 점**: App Shell에는 `stale` 시간이 5분 이상인 캐시 콘텐츠가 포함된다. 기본 프로필과 `seconds`를 제외한 모든 preset이 이 조건을 만족한다. 더 짧은 수명의 콘텐츠는 이동 뒤 스트리밍한다.

#### 세션 콘텐츠

`cookies()`·`headers()`는 캐시 함수 안에서 읽지 않는다. 먼저 세션 값을 읽고 캐시 함수의 인자로 전달한다. 같은 세션에서 그 결과를 App Shell에 포함할 수 있으므로 링크의 `prefetch={true}`는 제거한다.

```tsx filename="app/dashboard/page.tsx"
import { cookies } from 'next/headers'

async function getTopics(team: string | undefined) {
  'use cache'
  return db.topics.forTeam(team)
}

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  return <TopicList topics={await getTopics(team)} />
}
```

#### URL 데이터

`params`와 `searchParams`는 링크마다 달라 공유 App Shell에 넣을 수 없다. 이를 읽는 콘텐츠는 `Suspense` 경계 뒤에서 이동 후 스트리밍한다. 클릭 전에 해소할 가치가 있다면 링크의 `prefetch={true}`를 유지하고 아래의 URL 데이터 prefetch를 적용한다.

#### 실시간 콘텐츠

prefetch 시점과 클릭 시점 사이에도 값이 낡을 수 있으므로 미리 가져오지 않는다. `prefetch={true}`를 제거하고 요청 시 `Suspense` 경계 뒤에서 스트리밍한다.

### 점진적으로 도입

전역 플래그를 끈 상태에서도 목적지 `page` 또는 `layout`에 `export const prefetch = 'partial'`을 두어 라우트별로 도입할 수 있다.

1. 목적지 하나와 그곳을 가리키는 `prefetch={true}` 링크를 감사한 뒤 `prefetch = 'partial'`을 추가한다.
2. 배포하고 채택된 목적지 링크가 App Shell을 불러오는지 확인한다.
3. 나머지 목적지에 반복한 뒤 전역 플래그를 켠다.

전역 플래그 뒤 불필요해진 export는 `npx @next/codemod@canary remove-partial-prefetch ./app`으로 제거한다. codemod는 `'partial'` 값만 제거하고 `prefetch = 'force-disabled'` 같은 다른 값은 남긴다.

> **알아두면 좋은 점**: `src/` 구조라면 codemod 대상은 `./src/app`이다. 잘못된 경로도 `0 ok`를 출력하므로 처리 파일 수를 확인한다.

### 라우트의 URL 데이터 감사

개발 중 Next.js는 이동할 때 App Shell을 검사한다. 공유 셸의 `Suspense` 밖에서 `params`나 `searchParams`를 기다리면 URL 하나에 셸이 묶이므로 insight가 나타난다. 이 insight는 빌드를 막지 않는다.

페이지는 Promise를 기다리지 말고 자식에게 넘긴다. URL과 무관한 레이아웃은 경계 밖에 남기고, 읽기와 데이터 요청만 경계 안으로 밀어 넣는다.

```tsx filename="app/products/[slug]/page.tsx"
import { Suspense } from 'react'
import { ProductDetails } from './product-details'

export default function Page({ params }: PageProps<'/products/[slug]'>) {
  return (
    <ProductLayout>
      <Suspense fallback={<DetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </ProductLayout>
  )
}
```

자식이 경계 안에서 `await params`한다. 다시 이동해 insight가 사라졌고 App Shell이 의미 있는 UI를 그리는지 확인한다.

> **알아두면 좋은 점**: `generateMetadata` 안에서 `params`나 `searchParams`를 읽으면 URL data in `generateMetadata()` insight가 별도로 나타난다.

### URL 데이터 prefetch

URL 데이터 콘텐츠는 기본적으로 이동 뒤 스트리밍한다. 링크마다 서버 호출 비용을 감수할 가치가 있다면 `prefetch={true}`를 유지한다. `params` 또는 `searchParams`를 해소한 뒤 호출되는 함수에 `'use cache'`를 넣어 per-link prefetch 시점에 계산 가능하게 만든다.

```tsx filename="app/search/page.tsx"
import { Suspense } from 'react'

async function getResults(query: string) {
  'use cache'
  return fetch(`https://api.example.com/search?q=${query}`).then((res) =>
    res.json()
  )
}

async function Results({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}
```

서버 호출 수와 클릭 전 준비의 이득을 비교하는 기준은 [Optimizing Prefetching](./optimizing-prefetching.md)을 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: Phase 2에서 구현 예정
- 데모 목적: 기본 링크의 공유 셸과 `prefetch={true}`의 URL별 콘텐츠 요청 차이를 네트워크 패널에서 비교한다.
- 사용자 상호작용: 정적, 세션, URL별, 실시간 목적지 링크를 viewport에 노출하고 hover·click한다.
- 관찰 결과: 셸은 라우트별 한 번 공유되고 URL별 prefetch만 링크 단위 서버 호출을 만들며 실시간 영역은 클릭 뒤 스트리밍된다.

## 연습 문제

1. Partial Prefetching에서 `prefetch={true}`를 유지할 가능성이 가장 높은 목적지는 무엇인가?
   - A. 완전 정적 About 페이지
   - B. `searchParams`별 결과를 클릭 전에 준비해야 하는 검색 페이지
   - C. 클릭 순간 값이 fresh해야 하는 실시간 시세 페이지

   <details><summary>정답 보기</summary>

   정답: B. URL별 콘텐츠를 per-link prefetch로 미리 해소할 때 명시적 prefetch가 필요하다.

   </details>

2. 세션별 데이터 캐싱의 올바른 형태는 무엇인가?
   - A. 캐시 함수 안에서 직접 `cookies()`를 호출한다.
   - B. 캐시를 사용하지 않고 모든 링크를 `prefetch={false}`로 만든다.
   - C. `cookies()` 값을 밖에서 읽어 캐시 함수 인자로 전달한다.

   <details><summary>정답 보기</summary>

   정답: C. 세션 값을 캐시 키가 되는 인자로 넘기면 세션별 lookup을 안전하게 캐시할 수 있다.

   </details>

## 챕터 요약

- Partial Prefetching은 공유 App Shell과 URL별 다이나믹 콘텐츠의 prefetch를 분리한다.
- 기존 `prefetch={true}`는 목적지 콘텐츠 성격에 따라 제거·유지·캐시 전환한다.
- `cookies`·`headers`는 세션 데이터이고 `params`·`searchParams`는 URL 데이터다.
- URL 데이터 읽기는 `Suspense` 안으로 옮겨 공유 App Shell을 URL과 분리한다.
- 라우트별 opt-in으로 점진 도입한 뒤 전역 플래그와 codemod로 정리할 수 있다.
