# cacheComponents

- 공식 문서: [cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `cacheComponents`가 `use cache`를 사용한 컴포넌트와 함수 수준의 캐싱을 활성화하는 방식을 이해한다.
- static HTML shell과 dynamic content의 스트리밍을 한 라우트에서 함께 사용하는 구조를 파악한다.
- Partial Prerendering (PPR), React `<Activity>`, Node.js runtime 요구사항과 migration 조건을 설명할 수 있다.

## 핵심 개념 및 설명

Cache Components는 [`use cache`](../../3.4-directives/use-cache.md) directive를 사용해 컴포넌트와 함수 수준의 캐싱을 활성화한다. Data fetching은 기본적으로 dynamic이며 page, component, function 수준에서 무엇을 캐시할지 선택한다. Next.js는 static HTML shell을 prerender해 즉시 제공하고 준비되는 대로 dynamic content를 스트리밍한다. 따라서 하나의 route 안에서 static content와 dynamic content를 함께 구성할 수 있다.

## 사용법 (Usage)

`cacheComponents` flag를 활성화하려면 `next.config.ts`에서 `true`로 설정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

> **알아두면 좋은 점**: Cache Components에는 Node.js runtime이 필요하다. deprecated된 `runtime = 'edge'` export를 설정한 route는 migration한다. 다른 server-side JavaScript runtime은 동작이 보장되지 않는다는 점도 기억한다. [Migrating to Cache Components](../../../2-guides/migrating-to-cache-components.md#runtime--edge)를 참고한다.

`cacheComponents`를 활성화하면 다음 cache function과 configuration을 사용할 수 있다.

- [`use cache` directive](../../3.4-directives/use-cache.md)
- [`cacheLife` function](./cacheLife.md)과 `use cache`
- [`cacheTag` function](../../3.3-functions/cacheTag.md)

> **알아두면 좋은 점**: `experimental.useCache` 또는 `experimental.dynamicIO`를 사용했다면 [Version 16 upgrade guide](../../../2-guides/2.64-upgrading/version-16.md#experimentaldynamicio-and-experimentalusecache)를 따라 migration한다. route segment config와 다른 caching pattern은 [Migrating to Cache Components](../../../2-guides/migrating-to-cache-components.md)에서 확인한다.

또한 `cacheComponents`는 App Router에서 **[Partial Prerendering (PPR)](../../../4-glossary/README.md#partial-prerendering-ppr)**을 기본 동작으로 구현한다. 따라서 `experimental.ppr` configuration flag와 `experimental_ppr` route segment configuration은 더 이상 필요하지 않으며 제거되었다.

static shell과 streaming이 함께 동작하는 방식은 [Prerendering](../../../1-getting-started/caching.md#prerendering)에서 확인한다.

> **알아두면 좋은 점**: Next.js 15에서 experimental PPR을 사용했다면 migration할 때 [Version 16 upgrade guide의 Partial Prerendering (PPR) 절](../../../2-guides/2.64-upgrading/version-16.md#partial-prerendering-ppr)을 참고한다.

## Activity를 사용한 내비게이션 (Navigation with Activity)

`cacheComponents`를 활성화하면 Next.js는 React의 [`<Activity>`](https://react.dev/reference/react/Activity) component를 사용해 client-side navigation 중 component state를 보존한다.

다른 route로 이동할 때 Next.js는 이전 route를 unmount하는 대신 Activity mode를 [`"hidden"`](https://react.dev/reference/react/Activity#activity)으로 설정한다. 그러면 다음 동작이 일어난다.

- route 사이를 이동해도 component state가 보존된다.
- 이전 route로 돌아오면 state가 유지된 상태로 다시 나타난다.
- route가 hidden 상태가 되면 effect를 정리하고 다시 visible 상태가 되면 재생성한다.

이 동작은 사용자가 route 사이를 오갈 때 form input이나 펼친 section 같은 UI state를 유지해 navigation 경험을 개선한다.

> **알아두면 좋은 점**: Next.js는 최근 방문한 route 몇 개를 `"hidden"`으로 유지하는 heuristic을 사용한다. 오래된 route는 DOM에서 제거해 DOM이 과도하게 커지는 것을 막는다.

component가 unmount되지 않고 계속 mount된 상태를 유지하면 일부 UI pattern의 동작이 달라질 수 있다. dropdown, dialog, testing 같은 일반적인 pattern은 [Preserving UI state guide](../../../2-guides/preserving-ui-state.md)에서 확인한다.

## 버전 기록 (Version History)

| Version | Change |
| --- | --- |
| 16.0.0 | `cacheComponents`를 도입했다. 이 flag는 `ppr`, `useCache`, `dynamicIO` flag를 하나의 통합 configuration으로 제어한다. |

### Caching

[Caching](../../../1-getting-started/caching.md): Next.js에서 data와 UI를 캐시하는 방법을 학습한다.

### ISR with Cache Components

[ISR with Cache Components](../../../2-guides/incremental-static-regeneration-cache-components.md): dynamic route의 일부를 prerender하고 나머지 route에는 App Shell을 제공한 뒤 첫 방문 이후 확장하는 방법을 학습한다.

### use cache

[`use cache`](../../3.4-directives/use-cache.md): Next.js 애플리케이션에서 `use cache` directive를 사용하는 방법을 학습한다.

### use cache: remote

[`use cache: remote`](../../3.4-directives/use-cache-remote.md): remote cache handler를 사용해 지속적이고 공유되는 캐싱을 구성하는 방법을 학습한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `cacheComponents`가 활성화된 route에서 즉시 보이는 static shell과 늦게 도착하는 dynamic content를 한 화면에 표시한다.
- `use cache`, `cacheLife`, `cacheTag`를 적용한 영역과 적용하지 않은 영역의 응답 및 cache 동작을 비교한다.
- 두 route 사이를 이동한 뒤 입력값이나 펼친 section이 유지되는지 확인해 `<Activity>`가 보존하는 component state를 관찰한다.
- Node.js runtime만 보장된다는 조건과 `experimental.useCache`, `experimental.dynamicIO`, `experimental.ppr`, `experimental_ppr` migration 안내를 데모 설명에 함께 표시한다.

## 연습 문제

1. `cacheComponents`를 활성화했을 때의 동작으로 올바른 것은 무엇인가?
   - A. 모든 data fetching을 static으로 강제한다.
   - B. static HTML shell을 즉시 제공하고 dynamic content를 준비되는 대로 스트리밍할 수 있다.
   - C. 모든 route를 Edge runtime에서 실행한다.
   - D. `use cache` directive를 사용할 수 없게 한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: Cache Components는 static HTML shell을 먼저 제공하고 dynamic content를 스트리밍해 한 route 안에서 두 종류의 content를 함께 구성할 수 있게 한다.
</details>

2. Cache Components의 runtime 조건으로 올바른 것은 무엇인가?
   - A. Node.js runtime이 필요하며 다른 server-side JavaScript runtime의 동작은 보장되지 않는다.
   - B. `runtime = 'edge'` export가 필수다.
   - C. 브라우저 runtime에서만 동작한다.
   - D. 모든 route가 자동으로 Edge runtime으로 migration된다.

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 공식 문서는 Cache Components에 Node.js runtime이 필요하고 다른 server-side JavaScript runtime은 보장되지 않는다고 설명한다.
</details>

3. `cacheComponents`가 활성화된 client-side navigation에서 이전 route의 component state를 유지하는 데 사용하는 React component는 무엇인가?
   - A. `<Suspense>`
   - B. `<Activity>`
   - C. `<StrictMode>`
   - D. `<CacheBoundary>`

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: Next.js는 React의 `<Activity>` component를 사용하고 이전 route를 unmount하는 대신 Activity mode를 `"hidden"`으로 설정한다.
</details>

## 챕터 요약

- `cacheComponents`는 `use cache`를 바탕으로 page, component, function 수준의 캐싱을 선택하게 한다.
- data fetching은 기본적으로 dynamic이며 static HTML shell과 dynamic content를 한 route에서 함께 제공할 수 있다.
- Cache Components는 Node.js runtime이 필요하고 다른 server-side JavaScript runtime은 동작이 보장되지 않는다.
- App Router에서 Partial Prerendering (PPR)을 기본 동작으로 제공하므로 `experimental.ppr`와 `experimental_ppr`는 더 이상 필요하지 않다.
- client-side navigation에서는 React `<Activity>`와 `"hidden"` mode를 사용해 최근 route의 component state를 보존한다.
