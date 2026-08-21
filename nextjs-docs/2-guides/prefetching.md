# Prefetching

- 공식 문서: [Prefetching](https://nextjs.org/docs/app/guides/prefetching)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- prefetch가 클라이언트 내비게이션을 빠르게 만드는 과정을 설명한다.
- 정적·다이나믹 라우트와 Partial Prefetching의 기본 동작 차이를 구분한다.
- 자동, 수동, hover 기반 prefetch를 비용과 사용자 의도에 맞게 선택한다.

## 핵심 개념 및 설명

### prefetch는 언제 무엇을 가져오는가

prefetch는 사용자가 라우트로 이동하기 전에 HTML, JavaScript, React Server Component(RSC) payload 같은 리소스를 가져오는 과정이다. Next.js는 라우트별로 JavaScript를 분할하므로 현재 라우트에 필요한 코드만 먼저 로드하고, 링크 대상 리소스는 백그라운드에서 브라우저 캐시에 준비한다. 클릭하면 전체 페이지를 다시 로드하지 않고 [클라이언트 전환](../1-getting-started/linking-and-navigating.md#클라이언트-사이드-전환)을 수행한다.

자동 prefetch는 프로덕션에서만 동작한다. `<Link>`가 viewport에 들어오면 작업 큐에 넣고 다음 순서로 처리한다.

1. viewport 안의 링크
2. hover나 touch로 사용자 의도가 드러난 링크
3. 더 최근에 나타난 링크
4. 화면 밖으로 나간 링크는 큐에서 제거

> **알아두면 좋은 점**: 실험적 `useOffline` 설정을 켜면 연결이 끊겼다가 복구될 때 보류된 prefetch가 이 큐를 통해 재개된다.

### 정적 라우트와 다이나믹 라우트

Cache Components를 사용하지 않을 때의 기본 동작은 다음과 같다.

| 구분 | 정적 페이지 | 다이나믹 페이지 |
| --- | --- | --- |
| prefetch 범위 | 전체 라우트 | 기본적으로 생략, `loading.js`가 있으면 셸까지 |
| Client Cache TTL | 기본 5분 | 기본 비활성 |
| 클릭 시 서버 왕복 | 없음 | 셸 뒤에서 스트리밍하므로 있음 |

> **알아두면 좋은 점**: 최초 내비게이션에서는 HTML, JavaScript, RSC payload를 가져온다. 이후 내비게이션에서는 Server Component용 RSC payload와 Client Component용 JavaScript 번들을 가져온다.

`loading.js`가 없으면 전체 페이지를 5분 동안 Client Cache에 둔다. `loading.js`가 있으면 레이아웃부터 첫 loading boundary까지 가져오며, 다이나믹 `staleTimes`는 기본적으로 꺼져 있다. Next.js는 prefetched RSC payload를 라우트 세그먼트별 메모리 캐시에 두고 형제 라우트 사이에서 부모 레이아웃을 재사용한다.

### Partial Prefetching

Cache Components와 `partialPrefetching`을 함께 켜면 전부 또는 전무 방식 대신 라우트별 App Shell을 가져온다. 같은 라우트의 여러 링크는 정적·세션 출력을 담은 하나의 셸을 공유한다. 캐시되지 않은 데이터는 내비게이션 후 `<Suspense>` 뒤에서 스트리밍되며, `prefetch={true}`를 사용하면 URL별 `params`와 `searchParams`도 미리 해석할 수 있다. `revalidateTag`나 `revalidatePath`로 데이터가 무효화되면 관련 prefetch도 조용히 갱신된다. 자세한 적용 순서는 [Partial Prefetching 도입](./adopting-partial-prefetching.md), URL별 최적화는 [Optimizing prefetching](./optimizing-prefetching.md)을 참고한다.

### prefetch 제어

기본 자동 동작은 다음 코드처럼 `<Link>`만으로 사용한다.

```tsx filename="app/ui/nav-link.tsx"
import Link from 'next/link'

export default function NavLink() {
  return <Link href="/about">About</Link>
}
```

viewport 밖의 라우트를 분석 결과나 사용자 동작에 맞춰 준비하려면 `router.prefetch()`를 호출한다.

```tsx filename="app/ui/hover-prefetch-link.tsx"
'use client'

import { useRouter } from 'next/navigation'

export function PricingCard() {
  const router = useRouter()
  return (
    <div onMouseEnter={() => router.prefetch('/pricing')}>
      <a href="/pricing">View Pricing</a>
    </div>
  )
}
```

큰 링크 목록에서는 모든 링크를 가져오지 않도록 `prefetch={false}`로 시작하고 hover 시 `null`로 되돌릴 수 있다. `null`은 사용자가 의도를 보인 뒤 기본 정적 prefetch 동작을 복원한다. 특정 링크를 완전히 제외하려면 `prefetch={false}`를 유지한다.

> **주의**: `<Link>`를 확장하면 prefetch, 캐시 무효화, 접근성을 직접 유지해야 한다. 기본 동작이 부족할 때만 적용한다.

`router.prefetch(href, { onInvalidate })`의 `onInvalidate`는 Next.js가 캐시 데이터가 오래됐다고 판단할 때 호출되므로 새 prefetch를 예약할 수 있다. 직접 `<a>`를 구현하면 기본 클릭은 전체 페이지 내비게이션이므로 `preventDefault()` 후 `router.push()`를 호출해야 한다.

> **알아두면 좋은 점**: `<a>`는 전체 페이지 내비게이션을 일으킨다. 클라이언트에서 이동하려면 클릭 기본 동작을 막고 `router.push`를 호출한다.

### 문제 해결

페이지나 레이아웃 렌더링 중 분석 이벤트 같은 부수 효과를 실행하면 실제 방문이 아니라 prefetch 시점에 실행될 수 있다. Client Component의 `useEffect`나 사용자 동작으로 호출되는 Server Action으로 옮긴다.

무한 스크롤 표처럼 링크가 많은 화면에서는 `prefetch={false}`로 네트워크 사용량을 줄일 수 있다. 다만 정적 라우트도 클릭할 때 가져오고, 다이나믹 라우트는 서버 렌더링을 기다리게 된다. 전면 비활성화보다 hover 기반 prefetch가 사용자 의도와 비용을 함께 고려하는 선택일 수 있다.

## 예제 및 데모 설계

- Phase 2에서 동일한 정적/다이나믹 목적지에 자동, hover, 비활성 링크를 배치한다.
- Network 패널로 viewport 진입, hover, 클릭 시점의 RSC 요청 수와 Client Cache 재사용을 비교한다.
- 렌더링 중 추적 함수와 `useEffect` 추적 함수를 나란히 두고 prefetch 시 부수 효과 차이를 확인한다.

## 연습 문제

1. Cache Components 없이 `loading.js`가 없는 정적 라우트의 기본 prefetch 범위는?
   - A. 전체 라우트
   - B. 레이아웃만
   - C. prefetch하지 않음

   <details><summary>정답 보기</summary>A. 정적 라우트 전체를 가져오며 기본 Client Cache TTL은 5분이다.</details>

2. 큰 링크 목록에서 사용자 의도가 드러난 링크만 가져오려는 방법은?
   - A. 모든 링크에 `prefetch={true}`
   - B. hover 전 `false`, hover 후 `null`
   - C. 렌더링 중 `router.push()`

   <details><summary>정답 보기</summary>B. viewport 기반 자동 prefetch를 미루고 hover 이후 기본 동작을 복원한다.</details>

## 챕터 요약

- prefetch는 이동 전에 라우트 리소스를 준비해 클라이언트 전환을 빠르게 한다.
- 자동 prefetch는 프로덕션에서 `<Link>`와 작업 큐를 통해 동작한다.
- 정적·다이나믹 라우트, loading boundary 여부에 따라 범위와 TTL이 다르다.
- Partial Prefetching은 링크마다 전체 페이지 대신 라우트별 App Shell을 공유한다.
- 수동·hover·비활성 전략은 네트워크 비용과 클릭 가능성을 함께 고려해 선택한다.
