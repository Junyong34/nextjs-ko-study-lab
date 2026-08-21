# Optimizing prefetching

- 공식 문서: [Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Partial Prefetching의 App Shell과 링크별 prefetch 범위를 구분한다.
- URL 데이터와 세션 데이터를 내비게이션 전에 준비하는 캐시 구조를 설계한다.
- `prefetch={true}`의 서버 비용이 가치 있는 링크를 판단한다.

## 핵심 개념 및 설명

### App Shell과 링크별 데이터

Cache Components와 Partial Prefetching을 켜면 `<Link>`는 기본적으로 라우트마다 재사용 가능한 App Shell 하나를 prefetch한다. 셸에는 정적 출력과 `cookies()` 또는 `headers()`를 읽는 라우트의 세션별 UI가 포함된다. 그러나 목적지마다 다른 `searchParams`와 `params`는 공유 셸에 포함되지 않는다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

이 구조를 적용하기 전에 [Instant navigation](./instant-navigation.md)에 따라 라우트의 캐시와 `<Suspense>` 경계를 먼저 검증한다.

### prefetch 시 URL 데이터 해석

`<Link prefetch={true}>`는 링크의 URL 데이터를 내비게이션 전에 해석한다. 목적지에는 전역 `partialPrefetching` 또는 세그먼트별 `prefetch = 'partial'` 설정이 필요하다.

```tsx filename="app/page.tsx"
<Link href="/search?q=react" prefetch={true}>React</Link>
<Link href="/search?q=next" prefetch={true}>Next.js</Link>
```

목적지에서 `searchParams`를 `<Suspense>` 아래에서 읽고 검색 함수를 `'use cache'`로 캐시하면 쿼리별 결과가 한 번 계산되어 재사용된다. 기본 링크는 제목과 fallback을 담은 셸을 먼저 보여주고 클릭 후 결과를 스트리밍한다. `prefetch={true}` 링크는 URL의 `q`와 캐시된 결과를 prefetch 시 해석하므로 클릭 즉시 결과를 렌더링할 수 있다. prerender는 정적·캐시 영역을 통과하다가 캐시되지 않은 읽기에서 멈추고 가장 가까운 `<Suspense>` fallback을 사용한다.

링크별 prerender는 prefetch 가능한 링크마다 서버 호출 하나를 발생시킨다. 페이지 전체가 정적이면 정적 캐시에서 제공하지만, 비정적 데이터에 접근하면 prefetch마다 생성한다.

> **알아두면 좋은 점**: 첫 방문이나 만료 뒤의 cold cache에서는 서버가 캐시 결과를 계산해야 하므로 loading spinner가 보일 수 있다. 캐시가 warm인 이후 내비게이션은 즉시 처리된다.

`generateStaticParams`가 일부 값을 미리 정의해도 `params`는 특정 URL에 속하므로 `<Suspense>`가 필요하다. `prefetch={true}`는 미리 정의되지 않은 값을 링크별로 해석한다.

### 셸에 세션 데이터 포함

`prefetch={true}`는 URL 데이터를 다룬다. 세션 데이터는 별도 구조로 셸에 포함한다. `cookies()`나 `headers()`를 읽는 라우트는 세션별 App Shell을 브라우저에 캐시하므로 링크별 prefetch 없이도 준비할 수 있다.

세션 값을 이용한 조회 결과에는 수명이 필요하다. 두 패턴 중 공유 범위에 맞는 것을 선택한다.

#### 추출해서 전달하기

캐시 함수 밖에서 cookie를 읽어 인자로 넘긴다. 함수 시그니처가 결정적이 되고 인자가 캐시 키가 되므로 같은 팀 값을 가진 여러 세션이 엔트리를 공유한다.

```tsx filename="app/search/page.tsx"
async function UserNav() {
  const team = (await cookies()).get('team')?.value
  const topics = await getTopics(team)
  return <nav>{topics.map((topic) => <a key={topic.id} href={topic.href}>{topic.label}</a>)}</nav>
}

async function getTopics(team: string | undefined) {
  'use cache'
  return db.topics.forTeam(team)
}
```

App Shell은 준비 가능한 범위까지만 전진한다. 캐시 지시어가 없는 콘텐츠는 내비게이션 뒤에 스트리밍된다.

#### `"use cache: private"`

조회가 한 세션에 묶여 있거나 auth helper 내부에서 runtime API를 읽어 밖으로 추출할 수 없으면 `"use cache: private"`를 사용한다. 결과는 서버가 아니라 해당 세션의 브라우저에만 캐시된다. 수명은 지시어 범위 전체에 적용되므로 runtime 데이터 접근에 최대한 가까이 둔다.

```tsx filename="app/dashboard/user-nav.tsx"
async function getUser() {
  'use cache: private'
  const session = (await cookies()).get('session')?.value
  return db.users.findBySession(session)
}
```

### 비용과 선택 기준

| 구분 | App Shell | `prefetch={true}` 링크별 prefetch |
| --- | --- | --- |
| 범위 | 라우트마다 하나 | 보이는 링크마다 하나 |
| 콘텐츠 | 링크별 데이터를 제외한 라우트 출력 | 링크별 URL 데이터까지 해석한 출력 |
| 비용 상한 | 라우트 수 | 보이는 링크 수 |
| 역할 | 기본 prefetch | 클릭 전에 더 많은 UI 준비 |

URL 데이터 의존성이 있고, 그 부분의 캐시 수명이 알려져 있으며, 트래픽 대비 서버 호출 가치가 있을 때 사용한다. 요청마다 신선해야 하거나 App Shell과 같은 fallback까지만 만들 수 있거나 거의 클릭하지 않는 링크라면 생략한다. prefetch는 best-effort이므로 느린 연결이나 많은 링크에서는 클릭 전에 끝나지 않을 수 있다. 카드 그리드처럼 링크가 많으면 [hover 기반 prefetch](./prefetching.md#prefetch-제어)로 의도가 드러난 링크만 가져온다.

### 다음 단계

- 동작 변경과 이전 절차: [Partial Prefetching 도입](./adopting-partial-prefetching.md)
- 라우트 구조 검증: [Instant navigation](./instant-navigation.md)
- 캐시 배경 지식: [Caching](../1-getting-started/caching.md)

## 예제 및 데모 설계

- Phase 2에서 검색 링크 두 개를 기본 링크와 `prefetch={true}` 링크로 구성한다.
- cold/warm cache에서 fallback 노출과 서버 호출 횟수를 비교한다.
- 팀 공유 캐시와 세션 전용 캐시의 엔트리 재사용 범위를 여러 브라우저 세션으로 관찰한다.

## 연습 문제

1. `prefetch={true}`가 기본 App Shell에 더하는 것은?
   - A. 모든 세션의 cookie
   - B. 링크별 URL 데이터로 해석한 캐시 콘텐츠
   - C. 캐시되지 않은 모든 요청 데이터

   <details><summary>정답 보기</summary>B. `searchParams`나 `params`에 의존하는 캐시 콘텐츠를 클릭 전에 해석한다.</details>

2. 여러 세션이 같은 팀 조회 결과를 공유해야 할 때 알맞은 방식은?
   - A. cookie 값을 추출해 `'use cache'` 함수 인자로 전달
   - B. 모든 링크에 `prefetch={false}`
   - C. 조회마다 `"use cache: private"`

   <details><summary>정답 보기</summary>A. 인자가 캐시 키가 되어 같은 팀 값을 가진 세션이 엔트리를 공유한다.</details>

## 챕터 요약

- 기본 링크는 라우트별 App Shell을 공유하고 URL별 데이터는 제외한다.
- `prefetch={true}`는 `params`와 `searchParams` 기반 캐시 콘텐츠를 미리 해석한다.
- 링크별 prefetch는 보이는 링크마다 서버 호출 비용이 생길 수 있다.
- 공유 세션 값은 추출·전달하고 세션 전용 조회는 `"use cache: private"`를 사용한다.
- App Shell보다 나은 초기 UI를 만들 수 있는 링크에만 선택적으로 적용한다.
