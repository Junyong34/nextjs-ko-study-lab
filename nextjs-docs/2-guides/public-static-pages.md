# Public Pages

- 공식 문서: [Public pages](https://nextjs.org/docs/app/guides/public-static-pages)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 모든 사용자에게 같은 내용을 보여주는 public page의 렌더링 모델을 설명한다.
- 외부 데이터가 있는 컴포넌트를 캐시할지 스트리밍할지 판단한다.
- 정적·캐시·요청별 컴포넌트를 한 페이지에서 Partial Prerendering으로 조합한다.

## 핵심 개념 및 설명

public page는 모든 사용자에게 같은 콘텐츠를 보여주는 랜딩 페이지, 마케팅 페이지, 상품 목록, 블로그 목록 같은 화면이다. 공유 데이터이므로 미리 [prerender](../4-glossary/README.md)해 재사용할 수 있다. Next.js에서는 페이지 전체를 정적 또는 다이나믹 중 하나로 고르지 않고 컴포넌트별 입력과 수명에 맞춰 조합할 수 있다.

### 예제: 상품 목록 페이지

정적 헤더에서 시작해 외부 데이터 상품 목록을 추가하고, 응답을 막지 않도록 캐시한다. 마지막에는 사용자별 프로모션을 스트리밍해 페이지 전체를 다이나믹 렌더링으로 바꾸지 않는다.

공식 예제의 [영상](https://youtu.be/F6romq71KtI), [실행 데모](https://cache-components-public-pages.labs.vercel.dev/), [소스 코드](https://github.com/vercel-labs/cache-components-public-pages)를 함께 참고할 수 있다.

#### 1단계: 정적 헤더

```tsx filename="app/products/page.tsx"
function Header() {
  return <h1>Shop</h1>
}

export default async function Page() {
  return <Header />
}
```

`Header`는 외부 데이터, 요청 헤더, route params, 현재 시간, 난수처럼 요청마다 달라질 입력을 사용하지 않는다. 출력이 미리 결정되므로 정적 컴포넌트이며 Next.js가 빌드 시점에 안전하게 prerender할 수 있다.

> **알아두면 좋은 점**: locale에 맞는 날짜나 시간을 화면 깜빡임 없이 보여줘야 한다면 [Preventing flash before hydration](./preventing-flash-before-hydration.md) 가이드를 참고한다.

[`next build`](../3-api-reference/3.6-cli/next.md) 출력의 `○` 표시는 라우트가 별도 설정 없이 정적 콘텐츠로 prerender되었음을 뜻한다.

```text filename="Terminal"
Route (app)      Revalidate  Expire
┌ ○ /products           15m      1y
└ ○ /_not-found

○  (Static)  prerendered as static content
```

#### 2단계: 상품 목록 추가

```tsx filename="app/products/page.tsx"
import db from '@/db'
import { List } from '@/app/products/ui'

async function ProductList() {
  const products = await db.product.findMany()
  return <List items={products} />
}

export default async function Page() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  )
}
```

상품 목록은 시간이 지나며 바뀔 수 있는 외부 데이터에 의존한다. 아무 지침이 없으면 프레임워크는 사용자 요청마다 새 데이터를 가져오려는 의도로 해석한다. 이 요청 시점 작업을 `<Suspense>` 밖에서 기다리면 상품 조회가 끝날 때까지 정적 헤더까지 보낼 수 없다. Next.js는 uncached 데이터를 처음 `await`하는 지점에서 라우트 prerender를 막는다는 [경고](https://nextjs.org/docs/messages/blocking-prerender-dynamic)를 표시한다.

응답을 풀어주는 방법은 두 가지다.

- 여러 사용자가 공유할 수 있는 안정적인 결과라면 **캐시**해 나머지 페이지와 함께 prerender한다.
- 요청마다 달라져 캐시할 수 없다면 **스트리밍**해 나머지 응답이 기다리지 않게 한다.

상품 카탈로그는 모든 사용자가 공유하므로 캐시가 적합하다.

### Cache Components

```tsx filename="app/products/page.tsx"
async function ProductList() {
  'use cache'

  const products = await db.product.findMany()
  return <List items={products} />
}
```

[`'use cache'`](../3-api-reference/3.4-directives/use-cache.md)를 붙이면 반환 결과가 저장되고 재사용된다. 컴포넌트 입력을 요청 전에 알 수 있으면 정적 컴포넌트처럼 prerender할 수 있다. 다시 빌드하면 `/products`는 여전히 `○`로 표시된다.

```text filename="Terminal"
Route (app)      Revalidate  Expire
┌ ○ /products           15m      1y
└ ○ /_not-found

○  (Static)  prerendered as static content
```

#### 3단계: 다이나믹 프로모션 추가

```tsx filename="app/products/page.tsx"
async function PromotionContent() {
  const promotion = await getPromotion()
  return <Promotion data={promotion} />
}
```

사용자 위치나 A/B 테스트에 따라 달라지는 프로모션은 모든 사용자와 공유할 수 없어 캐시가 적합하지 않다. 그렇다고 전체 페이지를 하나의 느린 다이나믹 응답으로 만들 필요는 없다.

### Partial Prerendering

[`<Suspense>` 경계](../4-glossary/README.md)는 스트리밍 응답을 나눌 위치와 기다리는 동안 보여줄 fallback을 정한다.

```tsx filename="app/products/page.tsx"
import { Suspense } from 'react'

export default async function Page() {
  return (
    <>
      <Suspense fallback={<PromotionSkeleton />}>
        <PromotionContent />
      </Suspense>
      <Header />
      <ProductList />
    </>
  )
}
```

fallback은 정적 헤더와 캐시한 상품 목록과 함께 prerender된다. 요청별 프로모션은 준비되는 대로 스트리밍되어 fallback 자리를 바꾼다. 이처럼 Next.js가 prerender 가능한 작업과 요청 시점 작업을 분리하면 라우트는 부분적으로 prerender된다.

```text filename="Terminal"
Route (app)      Revalidate  Expire
┌ ◐ /products           15m      1y
└ ◐ /_not-found

◐  (Partial Prerender)  Prerendered as static HTML with dynamic server-streamed content
```

- **빌드 시점**: 헤더, 상품 목록, 프로모션 fallback을 렌더링하고 캐시해 CDN에 배포한다.
- **요청 시점**: 가까운 CDN이 prerender된 부분을 즉시 제공한다. 서버는 사용자별 프로모션을 병렬로 렌더링하고 클라이언트에 스트리밍한다.

### 다음 단계

같은 판단 기준은 prerender된 페이지와 캐시 데이터의 revalidation, route params별 페이지 변형, 개인화된 private page로 확장할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 정적 헤더, 공유 상품 목록, 사용자별 프로모션을 한 페이지에 순서대로 추가한다.
- 각 단계의 `next build` 기호(`○`, `◐`)와 최초 응답 시간을 나란히 표시한다.
- 느린 상품 조회를 캐시하기 전후로 헤더가 차단되는지 확인한다.
- 프로모션을 캐시하려는 잘못된 설계와 Suspense로 스트리밍하는 설계를 비교한다.

## 연습 문제

1. 상품 카탈로그처럼 모든 사용자가 공유하는 외부 데이터의 적절한 처리 방법은?

   - A. 요청마다 항상 새로 가져온다.
   - B. `'use cache'`로 캐시해 prerender 가능한 결과로 만든다.
   - C. 반드시 Client Component로 옮긴다.

   <details><summary>정답 보기</summary>

   정답: B. 입력을 요청 전에 알고 사용자끼리 공유할 수 있으면 캐시에 적합하다.

   </details>

2. 사용자 위치에 따라 달라지는 프로모션이 페이지 전체를 막지 않게 하는 방법은?

   - A. `<Suspense>` 경계 안에서 스트리밍한다.
   - B. 정적 헤더를 제거한다.
   - C. 모든 위치의 결과를 하나로 캐시한다.

   <details><summary>정답 보기</summary>

   정답: A. 요청별 콘텐츠는 fallback을 포함한 Suspense 경계 안에서 준비되는 대로 보낸다.

   </details>

3. Partial Prerendering의 빌드 산출물에 포함되는 것은?

   - A. 요청별 프로모션의 최종 결과만 포함된다.
   - B. 정적·캐시 콘텐츠와 다이나믹 영역의 fallback이 포함된다.
   - C. 빈 HTML만 포함된다.

   <details><summary>정답 보기</summary>

   정답: B. 빌드 시점에 알 수 있는 콘텐츠와 fallback을 prerender하고 요청별 내용은 나중에 스트리밍한다.

   </details>

## 챕터 요약

- public page도 컴포넌트마다 정적·캐시·다이나믹 특성이 다를 수 있다.
- 요청 전에 결정되는 컴포넌트는 빌드 시점에 prerender할 수 있다.
- 공유 가능한 외부 데이터는 `'use cache'`로 안정적인 결과로 만든다.
- 요청별 콘텐츠는 `<Suspense>`로 스트리밍해 전체 응답 차단을 피한다.
- PPR은 prerender된 shell과 스트리밍 콘텐츠를 한 라우트에 결합한다.
