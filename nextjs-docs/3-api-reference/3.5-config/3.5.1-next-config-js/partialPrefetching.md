# partialPrefetching

- 공식 문서: [partialPrefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 앱 수준의 Partial Prefetching을 활성화하는 `partialPrefetching`의 역할과 `cacheComponents`와의 필수 관계를 이해한다.
- 기본 App Shell prefetch와 `<Link prefetch={true}>`를 사용한 링크별 prefetch(per-link prefetching)의 범위를 구분한다.
- `params`, `searchParams`, `cookies()`, `headers()`가 App Shell과 URL별 데이터에 어떻게 영향을 주는지 설명할 수 있다.
- 앱 수준 설정과 Route Segment Config의 `prefetch`를 함께 사용할 때 적용 우선순위를 익힌다.

## 핵심 개념 및 설명

`partialPrefetching`은 앱 수준에서 Partial Prefetching을 활성화한다. 프레임워크는 기본적으로 각 라우트의 정적 부분을 prefetch한다. 개별 링크에 `prefetch={true}`를 지정하면 per-link prefetching을 사용해 더 많은 데이터를 가져온다.

### 사용법 (Usage)

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

`partialPrefetching`을 사용하려면 [`cacheComponents`](./cacheComponents.md)가 필요하다. `cacheComponents` 없이 실행하면 `next dev`와 `next build`가 설정 검증 단계에서 오류를 낸다.

### 참조 (Reference)

| 값 | 설명 |
| --- | --- |
| true | 앱 전체에서 Partial Prefetching을 활성화한다. |
| false | 기본값이다. prefetch 동작을 바꾸지 않는다. |

### prefetch가 해결되는 방식 (How prefetches resolve)

Partial Prefetching 이전에는 화면에 보이는 링크마다 prefetch가 실행됐다. N개의 링크가 N개의 라우트를 가리키면 링크가 viewport에 들어올 때 약 `~N`개의 라우트 prefetch가 생겼다.

`partialPrefetching: true`를 사용하면 Next.js는 라우트마다 재사용 가능한 [App Shell](../../../4-glossary/README.md#app-shell) 하나를 prefetch한다. App Shell에는 링크의 URL에 의존하지 않는 렌더링 결과가 들어간다. `params`나 `searchParams`에 의존하는 콘텐츠를 비롯한 URL별 콘텐츠는 기본적으로 내비게이션 뒤에 해결된다. App Shell은 클라이언트에 캐시되므로 같은 라우트를 가리키는 링크들은 하나의 prefetch를 재사용한다.

이 방식은 SPA의 라우트별 코드 분할(code splitting)과 비슷하다. 라우트마다 산출물 하나를 만들어 두고, 그 라우트를 가리키는 모든 링크가 이를 공유한다.

> **알아두면 좋은 점**:
>
> - `cookies()` 또는 `headers()`를 읽는 라우트는 세션 데이터를 포함하는 App Shell을 만든다. 프레임워크는 이를 자동으로 감지해 클라이언트에서 세션별로 셸을 캐시한다.

`<Link prefetch={true}>`는 App Shell보다 더 많은 내용을 요청할 수 있다. 이 prefetch는 `params`, `searchParams`, 전체 URL 같은 URL 데이터와 그 뒤에 있는 캐시된 콘텐츠까지 해결한다. 자세한 내용은 [Optimizing prefetching](../../../2-guides/optimizing-prefetching.md)을 참고한다.

> **알아두면 좋은 점**:
>
> - Partial Prefetching을 선택하지 않은 라우트에 `<Link prefetch={true}>`를 사용하면 개발자 콘솔 오류가 발생한다. 이 오류는 앱 전체에서 `partialPrefetching`을 활성화하거나 해당 세그먼트에서 `prefetch = 'partial'`을 사용하라고 안내한다. [dev warning Insight](https://nextjs.org/docs/messages/instant-link-prefetch-partial)에서 두 수정 방법을 자세히 설명한다.

### 세그먼트별 재정의 (Per-segment overrides)

[`prefetch`](../../3.1-file-conventions/3.1.22-route-segment-config/prefetch.md) 값을 명시적으로 export하는 세그먼트는 해당 라우트에 적용되는 앱 수준 기본값을 재정의한다.

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
| --- | --- |
| 16.3.0 | `partialPrefetching`이 도입됐다. `cacheComponents` 활성화가 필요하다. |

### 관련 항목 (Related)

#### cacheComponents

Next.js에서 `cacheComponents` 플래그를 활성화하는 방법은 [`cacheComponents`](./cacheComponents.md) API 레퍼런스에서 확인한다.

#### prefetch

`prefetch` Route Segment Config의 API 레퍼런스는 [`prefetch`](../../3.1-file-conventions/3.1.22-route-segment-config/prefetch.md)에서 확인한다.

#### Link Component

내장 `next/link` 컴포넌트로 빠른 클라이언트 내비게이션을 활성화하는 방법은 [Link Component](../../3.2-components/link.md)에서 확인한다.

#### Optimizing prefetching

`prefetch` prop으로 링크별 URL 데이터를 해결하거나 App Shell에 세션 데이터를 포함하는 방법은 [Optimizing prefetching](../../../2-guides/optimizing-prefetching.md)에서 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `cacheComponents: true`와 `partialPrefetching: true`를 설정한 두 라우트를 만든 뒤 같은 라우트를 가리키는 여러 `<Link>`를 화면에 배치한다.
- 링크가 viewport에 들어온 뒤 DevTools Network 탭에서 같은 라우트에 대한 App Shell prefetch가 하나만 재사용되는지 확인한다.
- `params`와 `searchParams`에 의존하는 콘텐츠가 클릭 뒤에 해결되는지, `<Link prefetch={true}>`를 지정하면 URL 데이터까지 미리 요청되는지 비교한다.
- `cookies()` 또는 `headers()`를 읽는 라우트에서는 세션별 App Shell이 만들어지는지 확인한다.

## 연습 문제

1. `partialPrefetching: true`를 사용하기 위한 조건은 무엇인가?
   - A. `output: 'export'`를 함께 설정해야 한다.
   - B. `cacheComponents: true`를 함께 설정해야 한다.
   - C. `prefetch = 'partial'`을 모든 세그먼트에 설정해야 한다.
   - D. `experimental.optimizePackageImports`를 활성화해야 한다.

<details><summary>정답 보기</summary>

정답: **B**

해설: `partialPrefetching`은 `cacheComponents`가 필요하다. `cacheComponents` 없이 `next dev`와 `next build`를 실행하면 설정 검증 오류가 발생한다.
</details>

2. `partialPrefetching: true`일 때 기본적으로 여러 링크가 같은 라우트를 가리키면 어떤 일이 일어나는가?
   - A. 링크마다 전체 라우트 prefetch가 새로 만들어진다.
   - B. 라우트마다 하나의 재사용 가능한 App Shell prefetch를 공유한다.
   - C. 모든 URL data가 클릭 전에 항상 해결된다.
   - D. `cookies()`와 `headers()`를 읽는 라우트는 prefetch할 수 없다.

<details><summary>정답 보기</summary>

정답: **B**

해설: Partial Prefetching은 라우트마다 재사용 가능한 App Shell 하나를 prefetch하고 같은 라우트를 가리키는 링크들이 이를 공유한다.
</details>

3. 다음 중 `<Link prefetch={true}>`에 대한 설명으로 올바른 것은 무엇인가?
   - A. App Shell만 요청하고 `params`와 `searchParams`는 항상 제외한다.
   - B. URL 데이터와 그 뒤의 캐시된 콘텐츠까지 해결하도록 요청할 수 있다.
   - C. `cacheComponents`가 없어도 설정 검증 오류 없이 동작한다.
   - D. 앱 수준의 `partialPrefetching` 설정을 세그먼트의 `prefetch`보다 항상 우선한다.

<details><summary>정답 보기</summary>

정답: **B**

해설: `<Link prefetch={true}>`는 App Shell뿐 아니라 `params`, `searchParams`, 전체 URL 같은 URL 데이터와 그 뒤의 캐시된 콘텐츠도 해결한다.
</details>

## 챕터 요약

- `partialPrefetching`은 앱 수준에서 Partial Prefetching을 활성화하며 `cacheComponents: true`가 필요하다.
- 기본 prefetch는 라우트별 재사용 가능한 App Shell의 정적 부분을 가져온다.
- 같은 라우트를 가리키는 링크들은 클라이언트에 캐시된 하나의 App Shell prefetch를 공유한다.
- `params`와 `searchParams` 같은 URL 데이터는 기본적으로 내비게이션 뒤에 해결된다.
- `<Link prefetch={true}>`는 URL 데이터와 캐시된 콘텐츠까지 추가로 해결할 수 있다.
- 세그먼트의 명시적인 `prefetch` 값은 해당 라우트의 앱 수준 기본값을 재정의한다.
