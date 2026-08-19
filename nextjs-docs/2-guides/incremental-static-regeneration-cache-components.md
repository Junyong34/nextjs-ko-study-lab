# ISR with Cache Components

- 공식 문서: [ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Cache Components와 Partial Prefetching이 목록에 없는 다이나믹 URL에도 즉시 App Shell을 제공하는 원리를 설명한다.
- `generateStaticParams`, `Suspense`, `use cache`로 빌드 시 prerender 범위를 구성한다.
- 알려진 params와 알려지지 않은 params 조합에 따라 빌드·첫 방문·후속 방문의 결과를 예측한다.
- 빌드 시간과 저장 공간을 고려해 어떤 라우트를 미리 생성할지 선택한다.

## 핵심 개념 및 설명

`cacheComponents`와 Partial Prefetching을 함께 사용하는 ISR은 빌드 목록에 없던 URL의 첫 방문에도 즉시 응답한다. Partial Prerendering은 렌더를 URL 데이터와 무관한 재사용 영역인 **App Shell**과, `generateStaticParams`가 알려준 URL별 정적 콘텐츠로 나눈다.

알려진 params에는 완전히 prerender된 페이지를 캐시에서 제공한다. 알려지지 않은 params에는 App Shell을 즉시 제공하고 콘텐츠를 스트리밍한 뒤, 알려진 params로 백그라운드 업그레이드를 수행한다. 같은 URL의 다음 방문은 업그레이드된 캐시 결과를 받는다. Pages Router의 ISR 또는 `fallback: true`에 대응하는 모델이다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

### Example

#### 라우트 준비

카테고리 레이아웃은 인기 카테고리 둘을, 상품 페이지는 카테고리별 인기 상품 하나를 `generateStaticParams`로 반환할 수 있다. 중요한 규칙은 레이아웃이나 페이지 최상단에서 `params`를 기다리지 않는 것이다. `params` Promise를 `Suspense` 내부 자식에게 넘기고 그 안에서 `await`해야 알려지지 않은 URL에도 공통 App Shell을 만들 수 있다.

```tsx filename="app/[category]/layout.tsx"
import { Suspense } from 'react'

export async function generateStaticParams() {
  const categories = await getTopCategories()
  return categories.map((category) => ({ category: category.slug }))
}

async function CategoryHeader({ params }: LayoutProps<'/[category]'>) {
  const { category } = await params
  const data = await getCategory(category)
  return <h1>{data?.name ?? 'Category'}</h1>
}

export default function CategoryLayout(props: LayoutProps<'/[category]'>) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryHeader params={props.params} />
      </Suspense>
      {props.children}
    </>
  )
}
```

알려진 param도 URL 하나에만 속하므로 `Suspense` 위에서 기다리면 App Shell이 그 URL에 묶인다. 데이터 모듈에 `'use cache'`를 두면 export한 함수의 결과를 정적 셸에 포함할 수 있다. `cookies`나 `headers` 같은 런타임 API는 `Suspense`로 감싸 fallback을 셸에 포함한다.

> **알아두면 좋은 점**: JSX의 `<Suspense>` 대신 [`loading.tsx`](../3-api-reference/3.1-file-conventions/loading.md)를 사용할 수도 있다. `loading.tsx`는 세그먼트 경계에, inline `Suspense`는 컴포넌트 트리의 원하는 위치에 경계를 둔다.

#### 빌드 시점

예제에서 Next.js는 알려진 `tops`, `shorts` 레이아웃과 `params`가 suspend되는 `[category]` App Shell을 만든다. 각 카테고리의 알려진 상품 `tee`, `joggers`와 `[product]` App Shell도 만든다. 조합 결과는 다음과 같다.

- `/tops/tee`, `/shorts/joggers`: 두 params를 아는 완전 정적 페이지
- `/tops/[product]`, `/shorts/[product]`: 카테고리 헤더는 렌더되고 상품은 fallback인 셸
- `/[category]/[product]`: 카테고리와 상품이 모두 fallback인 공통 셸

#### 런타임

`/tops/tee`는 완전 정적 페이지를 받는다. 첫 `/tops/overshirt` 방문은 알려진 카테고리 셸과 상품 fallback을 즉시 받고 상품 콘텐츠를 스트리밍한다. 첫 `/shoes/basketball-shoes` 방문은 두 params가 모두 알려지지 않았으므로 공통 셸을 받고 두 영역을 스트리밍한다. 첫 방문 뒤에는 해당 params로 백그라운드 업그레이드가 실행된다.

`<Link>`가 뷰포트에 들어와 prefetch되거나 `router.prefetch`를 호출한 것도 첫 방문으로 계산한다. 따라서 클릭 전에 업그레이드가 시작될 수 있다.

> **알아두면 좋은 점**: 목록에 없는 params의 App Shell을 즉시 제공하는 동작은 Next.js 16.3부터 지원한다. 이전 버전은 전체 서버 렌더가 끝날 때까지 응답을 기다린다.

#### 업그레이드 결과

- 모든 데이터 접근이 캐시되고 params가 모두 해소되면 완전 정적 페이지가 된다.
- params는 모두 해소됐지만 `Suspense` 안에 uncached 데이터 또는 `cookies`·`headers`가 남으면 fallback을 포함한 캐시 페이지가 된다. 런타임 영역은 요청 시 스트리밍한다.
- params는 라우트 순서대로 해소된다. `generateStaticParams`가 반환하지 않은 상위 param은 해소되지 않은 채 남아 더 깊은 param의 업그레이드를 막는다.

### prerender 대상 선택

모든 prerender 페이지는 빌드 작업과 배포 저장 공간을 늘린다. 다음 배포 전까지 방문하지 않을 페이지라면 비용만 발생한다. 인기 페이지나 예측 가능한 콘텐츠처럼 미리 준비할 가치가 있는 params만 `generateStaticParams`에서 반환한다. 나머지는 첫 요청에서 만들고 이후 방문을 위해 업그레이드한다.

### Pages Router에서 이전하기

- `getStaticPaths`의 `fallback: true`는 `cacheComponents`의 기본 동작에 해당한다. 방문자는 즉시 `Suspense` fallback을 받고 콘텐츠를 스트리밍한다.
- `router.isFallback`은 필요하지 않다. prerender가 정적 셸을 만들고 `'use cache'`로 셸을 확장한다.
- `getStaticProps`의 `revalidate`는 `'use cache'`와 `cacheLife`로 옮긴다.
- `getStaticPaths`는 `generateStaticParams`로 옮긴다.

### Next steps

캐싱 전체 모델은 Getting Started의 Caching, params 조합은 [`generateStaticParams`](../3-api-reference/3.3-functions/generate-static-params.md), 셸의 스켈레톤은 [`loading.tsx`](../3-api-reference/3.1-file-conventions/loading.md), 점진적 응답은 [Streaming](./streaming.md), 자체 호스팅 캐시는 [Self-hosting](./self-hosting.md)을 이어서 학습한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: `known/known`, `known/unknown`, `unknown/unknown` params 조합의 첫·후속 방문 차이를 비교한다.
- 사용자 상호작용: 상품 링크를 hover 또는 viewport에 노출해 prefetch한 뒤 이동하고, 캐시를 비운 상태와 후속 방문을 비교한다.
- 관찰 결과: App Shell 범위와 fallback 위치가 달라지며, prefetch 뒤에는 클릭 전에 업그레이드가 시작된다.

## 연습 문제

1. 알려지지 않은 상품 param에서도 카테고리 App Shell을 유지하려면 `params`를 어디서 기다려야 하는가?
   - A. 레이아웃 최상단
   - B. `Suspense` 내부 자식
   - C. Client Component의 이벤트 핸들러만

   <details><summary>정답 보기</summary>

   정답: B. URL별 `params` 읽기를 경계 안으로 밀어야 공통 셸을 보존할 수 있다.

   </details>

2. `generateStaticParams`에 모든 콘텐츠 URL을 넣지 않는 주된 이유는 무엇인가?
   - A. 다이나믹 라우트가 금지되기 때문이다.
   - B. 방문하지 않을 페이지까지 빌드하고 저장하는 비용을 피하기 위해서다.
   - C. `Suspense`를 사용할 수 없기 때문이다.

   <details><summary>정답 보기</summary>

   정답: B. 인기 경로만 미리 만들고 나머지는 on-demand 업그레이드할 수 있다.

   </details>

## 챕터 요약

- Cache Components ISR은 완전 정적 페이지와 재사용 App Shell을 함께 만든다.
- `params`는 `Suspense` 안에서 읽어 URL과 무관한 셸을 최대한 보존한다.
- 알려지지 않은 URL은 셸을 즉시 받고 콘텐츠를 스트리밍한 뒤 백그라운드에서 업그레이드된다.
- prefetch도 첫 방문으로 계산되어 클릭 전에 업그레이드를 시작할 수 있다.
- `generateStaticParams`에는 빌드 비용을 들일 가치가 있는 인기·예측 가능 경로를 우선한다.
