# Migrating to Cache Components

- 공식 문서: [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 기존 라우트 세그먼트 설정과 캐시 API를 Cache Components 모델로 옮긴다.
- instant navigation validation의 오류·insight를 따라 캐시와 `Suspense` 경계를 결정한다.
- 다이나믹 params, 런타임 데이터, Route Handler, 메타데이터의 마이그레이션 차이를 설명한다.
- 한 번에 전환하는 방식과 `instant = false`를 이용한 점진 도입 방식을 선택한다.

## 핵심 개념 및 설명

Cache Components를 켜면 `dynamic`, `revalidate`, `fetchCache` 같은 라우트 세그먼트 설정은 `'use cache'`와 `cacheLife`로 대체된다. 개발 중 Next.js는 각 라우트가 즉시 렌더되는지 검사하고, 이동을 막는 코드를 오류 또는 insight로 표시한다.

### adoption skill 사용(권장)

공식 `next-cache-components-adoption` skill은 기능 경계마다 확인하며 전환을 진행한다. 모든 라우트를 먼저 validation에서 제외하고 기능별 PR로 전환하는 Incremental 모드와 한 브랜치에서 모두 전환하는 Direct 모드를 제공한다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-adoption
```

### 수동 마이그레이션

수동 전환은 다음 순서를 따른다.

1. `next.config.ts`에서 Cache Components를 켠다.
2. 모든 라우트를 지금 바꿀지, `instant = false`로 먼저 제외하고 하나씩 바꿀지 정한다.
3. validation이 가리키는 uncached 데이터는 `'use cache'`로 캐시하고, 런타임 데이터는 `Suspense` 안으로 옮긴다.

기존 `fetch`와 `unstable_cache` 캐시는 별도 계층으로 계속 동작한다. 다이나믹 params와 메타데이터에는 아래의 전용 절차를 적용한다.

### Cache Components 활성화

Cache Components에는 Next.js 16이 필요하다. 15 이하면 먼저 업그레이드한 뒤 다음 설정을 추가한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = { cacheComponents: true }
export default nextConfig
```

> **알아두면 좋은 점**: `cacheComponents`는 기존 `experimental.dynamicIO`와 `experimental.useCache`를 대체한다.

활성화 뒤 `dynamic`, `revalidate`, `fetchCache` export가 남은 세그먼트는 오류가 난다.

### validation 제외

라우트를 바로 수정할 수 없다면 오류가 발생한 `page`, `layout`, parallel slot에 `export const instant = false`를 둔다.

> **알아두면 좋은 점**: `instant = false`는 세그먼트가 blocking해도 된다고 표시할 뿐 다이나믹 렌더링을 강제하지 않는다. 실제로 prerender 가능한 라우트는 정적 셸을 제공한다. `new Date()`, `Math.random()`, `crypto.randomUUID()` 같은 동기 IO 빌드 오류도 없애지 않는다.

### 점진적으로 도입

1. 플래그를 켜고 `dynamic`, `revalidate`, `fetchCache`를 제거한다.
2. 준비되지 않은 라우트에 `instant = false`를 추가한다. 전체 적용에는 `npx @next/codemod@canary cache-components-instant-false ./app`을 사용할 수 있다.
3. 동기 IO는 prerender 셸 밖으로 옮긴다. `Suspense` 안에서 `connection()` 뒤 호출하거나 Client Component로 옮긴다.
4. 한 라우트씩 `instant = false`를 제거하고 insight를 해결한다.

> **알아두면 좋은 점**: `src/` 구조라면 codemod 대상은 `./src/app`이다. 잘못된 경로도 실패하지 않고 `0 ok`를 출력하므로 파일 수를 확인한다.

### validation 따르기

개발 overlay의 수정 카드는 blocking 컴포넌트 또는 데이터를 `'use cache'`로 캐시하거나 `Suspense` 안으로 옮기라고 안내한다. 오류와 insight가 없어질 때까지 반복한다. 전체 흐름, DevTools, CI 검사는 [Instant navigation](./instant-navigation.md)을 참고한다. insight는 HTTP 응답에 포함되지 않으며 라우트는 개발 중에도 `200`을 반환할 수 있다. overlay, 개발 서버 로그 또는 MCP `get_errors`에서 확인한다.

### `dynamic = "force-dynamic"`

페이지는 기본적으로 다이나믹이므로 설정을 삭제한다.

### `dynamic = "force-static"`

먼저 설정을 삭제한다. uncached 데이터가 발견되면 데이터 접근 가까이에 `'use cache'`와 긴 `cacheLife`를 추가한다. 런타임 데이터는 `Suspense`로 옮기라는 오류가 나오지만, 기존 의도가 완전 정적 페이지였다면 런타임 접근 자체를 제거해야 한다.

```tsx filename="app/page.tsx"
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('max')
  const data = await fetch('https://api.example.com/data')
  return <div>{data.status}</div>
}
```

### `revalidate`

라우트 설정 대신 캐시 범위 안에서 `cacheLife`를 사용한다.

```tsx filename="app/page.tsx"
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

> **알아두면 좋은 점**: 기존 초가 내장 프로필(`seconds`, `minutes`, `hours`, `days`, `weeks`, `max`)과 맞지 않으면 가장 가까운 프로필을 고르거나 custom profile을 정의한다. `default`를 포함한 내장 프로필도 재정의할 수 있다.

### `fetchCache`

`'use cache'` 범위 안의 데이터 fetching은 모두 캐시되므로 `fetchCache`는 삭제한다.

### `fetch` 캐시 옵션

기존 `cache: 'force-cache'`와 `next: { revalidate, tags }`는 `'use cache'`, `cacheLife`, `cacheTag`로 옮긴다.

```tsx filename="app/page.tsx"
import { cacheLife, cacheTag } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')
  cacheTag('data')
  return fetch('https://api.example.com/data').then((res) => res.json())
}
```

저장 수명 차이에 유의한다. `fetch` Data Cache는 배포와 serverless 인스턴스를 넘어 유지되지만, `'use cache'` 기본 저장소는 메모리이며 단일 배포·인스턴스 수명에 묶인다. 인스턴스 종료 뒤에도 유지하려면 `'use cache: remote'` 또는 cache handler를 사용한다. 영속 저장소여도 새 배포 후 재계산될 수 있다.

### `unstable_cache`

감싼 함수를 일반 함수로 바꾸고 `'use cache'`를 넣는다. 함수 인자가 캐시 키에 자동 포함되므로 key parts 배열은 필요 없다. 옵션의 `revalidate`와 `tags`는 `cacheLife`와 `cacheTag`로 옮긴다. `unstable_cache`의 영속성과 `'use cache'`의 기본 메모리 수명 차이는 위와 같다.

### On-demand revalidation

`cacheTag`로 데이터를 표시한 뒤 목적에 맞는 API를 선택한다.

- `updateTag`: Server Action mutation 직후 사용자가 자신의 변경을 즉시 봐야 할 때 사용한다. 다음 요청은 fresh 데이터를 기다린다.
- `revalidateTag`: stale-while-revalidate가 필요할 때 사용한다. 두 번째 인수로 `'max'` 같은 캐시 프로필이 필요하며 Server Action과 Route Handler에서 동작한다.
- `revalidatePath`: 이전 모델과 동일하다.

> **알아두면 좋은 점**: `updateTag`는 Server Action에서만 호출할 수 있다. Route Handler나 webhook에서는 캐시 프로필과 함께 `revalidateTag`를 사용한다.

### `unstable_noStore`

Cache Components에서는 `'use cache'`를 명시하지 않으면 캐시하지 않으므로 `unstable_noStore`를 제거한다. 요청 시점 실행을 명시해야 하면 `connection()`을 먼저 호출하고 컴포넌트를 `Suspense`로 감싼다.

### `generateStaticParams`와 `dynamicParams`

#### `generateStaticParams`는 param을 하나 이상 반환해야 한다

빈 배열은 오류다. Next.js가 라우트를 prerender해 비어 있지 않은 static shell을 검증할 수 있도록 하나 이상 반환한다. 반환하지 않은 경로도 App Shell과 요청 시 스트리밍으로 제공한다. 전체 흐름은 [ISR with Cache Components](./incremental-static-regeneration-cache-components.md)를 참고한다.

#### `dynamicParams`는 첫 방문을 더 이상 blocking하지 않는다

기본값인 `dynamicParams: true`에서 `generateStaticParams`가 반환하지 않은 param으로 처음 방문하면, 이전에는 페이지 렌더링이 끝날 때까지 응답이 blocking됐다. Cache Components에서는 Next.js가 App Shell을 즉시 제공하고, 알려진 param으로 백그라운드 업그레이드를 수행한다. `dynamicParams: false`의 동작은 바뀌지 않으므로 목록에 없는 경로는 계속 404를 반환한다.

#### `params`는 `Suspense` 안에서 기다린다

페이지 최상단에서 `await params`하지 말고 Promise를 `Suspense` 안의 자식으로 전달한다. `usePathname`, `useParams`, `useSelectedLayoutSegment(s)`도 알려지지 않은 다이나믹 params에 의존하면 suspend하므로 가장 작은 읽기 영역을 감싼다. `useSearchParams`는 요청 시점에만 알려지므로 항상 경계가 필요하다.

### `cookies`, `headers`, `searchParams`

이 런타임 데이터는 전체 라우트를 다이나믹으로 바꾸는 대신, 읽는 자식을 `Suspense`로 감싸 정적 셸 밖에서 스트리밍한다. 페이지가 받은 `params`와 `searchParams` Promise도 그대로 자식에 전달하고 경계 안에서 기다린다.

> **알아두면 좋은 점**: root layout의 `<html>` 속성을 쿠키나 헤더로 정하면 전체 하위 트리가 요청에 묶여 감쌀 자식이 없다. paint 전에 `<head>` inline script로 속성을 정하는 방법은 [Preventing Flash](./preventing-flash-before-hydration.md)를 참고한다.

### Route Handlers (`GET`)

`dynamic = 'force-static'`를 삭제하고 데이터 접근을 `'use cache'` helper로 옮긴다. 지시어는 `GET` export 자체에는 붙일 수 없다.

> **알아두면 좋은 점**: `GET`에서 uncached 또는 런타임 데이터 접근을 만나면 throw로 prerendering을 중단한다. 기존 `try/catch`가 이를 잡아 빌드 로그를 오염시키면 `experimental.hideLogsAfterAbort: true`를 고려한다.

### `generateMetadata`와 `generateViewport`

외부 데이터는 `'use cache'`로 캐시한다. 메타데이터가 런타임 데이터에 실제로 의존하면 `Suspense`로 감쌀 수 없으므로, 페이지에 `connection()`을 호출하는 동적 marker 컴포넌트를 `Suspense` 안에 추가해 의도를 명시한다.

### `runtime = 'edge'`

Cache Components는 Node.js runtime만 지원한다. deprecated된 `runtime = 'edge'`를 삭제해 기본 Node.js runtime을 사용한다. 특정 경로에 edge 동작이 필요하면 proxy를 고려한다.

### `experimental_ppr`

Next.js 16에서는 `experimental.ppr`과 `experimental_ppr`이 제거됐다. Partial Prerendering이 Cache Components에 포함되므로 두 설정을 삭제한다.

### UI 상태 보존

Cache Components는 React `<Activity mode="hidden">`로 이동한 라우트를 unmount하지 않고 숨긴다. effect는 정리되고 다시 실행되지만 `useState`, 폼 입력, 스크롤 위치는 유지된다. 이전에 unmount로 상태를 초기화했다면 dropdown·popover는 cleanup에서 닫고, dialog 상태는 URL에서 유도하며, 폼은 제출 처리나 사용자 동작에서 명시적으로 reset한다. 자세한 패턴은 [Preserving UI State](./preserving-ui-state.md)를 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: 기존 설정을 하나씩 제거할 때 validation이 제안하는 캐시·스트리밍 경계를 관찰한다.
- 사용자 상호작용: `force-static`, `revalidate`, runtime API가 섞인 샘플을 단계별로 전환하고 overlay를 확인한다.
- 관찰 결과: 정적 셸은 유지되고 URL·세션별 영역만 스트리밍되며, 뒤로 이동했을 때 UI 상태가 보존된다.

## 연습 문제

1. `revalidate = 3600`의 Cache Components 대응은 무엇인가?
   - A. `cacheLife('hours')`를 `'use cache'` 범위에서 사용한다.
   - B. `dynamic = 'force-static'`을 유지한다.
   - C. `unstable_noStore()`를 호출한다.

   <details><summary>정답 보기</summary>

   정답: A. 캐시 수명은 캐시 범위 안에서 `cacheLife`로 선언한다.

   </details>

2. 다음 중 `instant = false`로 해결되지 않는 것은 무엇인가?
   - A. 아직 전환하지 않은 blocking 라우트 validation
   - B. prerender 중 `Math.random()` 같은 동기 IO 오류
   - C. 점진 도입을 위한 임시 opt-out

   <details><summary>정답 보기</summary>

   정답: B. 동기 IO는 셸 밖 요청 시점 또는 Client Component로 직접 옮겨야 한다.

   </details>

## 챕터 요약

- Cache Components는 라우트 전역 설정을 명시적인 캐시 범위와 `Suspense` 경계로 바꾼다.
- validation의 캐시 또는 스트리밍 제안을 따라 한 라우트씩 전환할 수 있다.
- `fetch`·`unstable_cache`와 `'use cache'`는 기본 영속 범위가 다르다.
- params·런타임 데이터는 가장 작은 `Suspense` 경계 안에서 읽어 정적 셸을 보존한다.
- Node.js runtime, 메타데이터, Route Handler, UI 상태 보존까지 함께 검토해야 완전한 마이그레이션이 된다.
