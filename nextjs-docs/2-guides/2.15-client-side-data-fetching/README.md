# Client-side data fetching

- 공식 문서: [Client-side data fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching)
- 상위 메뉴: [Guides](../README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 클라이언트 데이터 fetching 라이브러리가 필요한 경우를 판단할 수 있습니다.
- 인라인 로딩, Suspense, 서버 제공 초기 데이터 패턴을 비교할 수 있습니다.
- Next.js 서버·클라이언트 캐시와 브라우저 데이터 캐시의 역할을 구분할 수 있습니다.
- mutation 뒤 브라우저 값과 서버 캐시를 함께 갱신할 수 있습니다.

## 핵심 개념 및 설명

### Client-side data fetching

많은 앱은 별도 클라이언트 데이터 fetching 라이브러리 없이도 반응성 있는 상호작용을 만들 수 있습니다. Client Component가 서버 데이터를 한 번만 읽는다면 Server Component에서 Promise를 전달하고 React `use()`로 푸는 방법을 먼저 고려합니다. 클라이언트에서 공유 캐시, focus revalidation, 폴링, 요청 중복 제거, 여러 컴포넌트의 낙관적 업데이트가 필요할 때 SWR, TanStack Query, [Apollo Client](https://www.apollographql.com/docs/react) 같은 라이브러리를 사용합니다.

### 클라이언트 fetching 패턴 선택

먼저 초기 화면에 서버 데이터가 필요한지, hydration 이후 브라우저 요청까지 기다려도 되는지 결정합니다.

| 패턴 | SWR | TanStack Query | 데이터가 준비되는 시점 |
| --- | --- | --- | --- |
| 인라인 로딩 상태 | `useSWR` | `useQuery` | hydration 이후 브라우저 요청 |
| Suspense 로딩 상태 | `useSWR` + `suspense: true` | `useSuspenseQuery` | hydration 이후 브라우저 요청 |
| 서버에서 제공 | `<SWRConfig fallback>` | `<HydrationBoundary>` | 초기 렌더링 또는 서버 스트리밍 |

각 컴포넌트가 자체 로딩 UI를 가져야 하면 인라인 패턴을 선택합니다. 여러 UI가 함께 또는 점진적으로 나타나는 경계를 설계하려면 Suspense를 사용합니다. 자동완성처럼 상호작용 뒤에만 필요한 데이터는 클라이언트 전용 요청이 적합할 수 있습니다. 초기 화면에 필요한 값은 Server Component에서 제공하면 RSC Payload에 포함하거나 Suspense로 스트리밍할 수 있고, 이후에는 라이브러리가 브라우저에서 관리합니다.

### Cache Components로 서버 데이터 캐싱(선택 사항)

서버에서 초기 데이터를 제공하는 것과 그 데이터를 서버에 캐싱하는 것은 독립적인 선택입니다. Cache Components까지 활성화하면 관련 값이 세 계층에 존재할 수 있습니다.

| 계층 | 저장 내용 | 신선도 제어 |
| --- | --- | --- |
| Next.js 서버 캐시 | 캐시된 데이터와 Server Component 출력 | `cacheLife`의 `revalidate`, `expire` |
| Next.js 클라이언트 캐시 | 방문하거나 prefetch한 라우트의 RSC Payload | `cacheLife`의 `stale` |
| 데이터 fetching 라이브러리 | SWR key 또는 TanStack query key의 브라우저 데이터 | 라이브러리 revalidation 옵션과 mutation |

각 계층의 신선도 기간은 같을 필요가 없습니다. 다만 캐시 식별자와 mutation 무효화는 서로 맞아야 합니다.

### mutation 조정

Server Component는 세그먼트에 필요한 초기 데이터를 제공하고, 라이브러리는 공유 브라우저 캐시를 관리합니다. mutation은 브라우저 캐시를 즉시 바꾸는 동시에 다음 서버 렌더링이 새 값을 읽도록 서버 캐시를 무효화할 수 있습니다. 낙관적 업데이트가 실패하면 이전 브라우저 값을 복원해야 합니다.

| 메서드 | 사용할 때 | 다음 서버 읽기 |
| --- | --- | --- |
| `updateTag(tag)` | Server Action의 변경을 즉시 보여야 할 때 | 새 데이터를 기다립니다. |
| `revalidateTag(tag, 'max')` | 오래된 값이 허용되는 수동적 갱신일 때 | 오래된 값을 제공하며 백그라운드에서 갱신합니다. |
| `revalidateTag(tag, { expire: 0 })` | webhook 등 외부 시스템이 즉시 만료해야 할 때 | 새 데이터를 기다립니다. |

서버 읽기가 캐시되지 않았다면 무효화할 서버 tag도 없습니다.

### SWR 또는 TanStack Query 적용

- 2.15.1 [SWR](./swr.md): 조건부 key, fallback, `mutate` 중심 패턴입니다.
- 2.15.2 [TanStack Query](./tanstack-query.md): query key, hydration, `useMutation` 중심 패턴입니다.

두 라이브러리는 서로 대체 가능한 독립 선택지입니다. 서버 데이터 흐름은 [Fetching Data](../../1-getting-started/fetching-data.md), SPA 구조는 [SPAs](../single-page-applications.md), 반응형 mutation은 [Interactive apps](../interactive-apps.md), 서버 캐시는 [Caching](../../1-getting-started/caching.md)을 참고합니다.

두 패턴의 실제 동작은 공식 [next-spa-patterns 데모](https://next-spa-patterns.labs.vercel.dev/)와 [소스 코드](https://github.com/vercel-labs/next-spa-patterns)에서 함께 확인할 수 있습니다.

## 예제 및 데모 설계

- Phase 2에서 같은 상품 검색과 읽지 않은 알림 UI를 SWR/TanStack Query 두 버전으로 구현합니다.
- hydration 이후 요청과 서버 제공 초기 데이터의 첫 화면 차이를 네트워크 패널로 비교합니다.
- 브라우저 낙관적 업데이트가 실패할 때 롤백되는 과정을 표시합니다.
- 서버 tag를 무효화했을 때 다음 내비게이션의 데이터가 달라지는지 확인합니다.

## 연습 문제

1. 초기 렌더링에 반드시 데이터가 필요할 때 적합한 패턴은 무엇입니까?

   - A. hydration 뒤 클라이언트 요청만 사용
   - B. Server Component에서 초기 데이터 제공
   - C. 데이터 요청 생략

   <details><summary>정답 보기</summary>

   정답: B. 서버가 아는 초기 값을 RSC Payload로 제공하거나 스트리밍할 수 있습니다.

   </details>

2. 세 캐시 계층의 신선도 기간은 반드시 같아야 합니까?

   - A. 예
   - B. 아니요

   <details><summary>정답 보기</summary>

   정답: B. 기간은 독립적이지만 식별자와 무효화 흐름은 조정해야 합니다.

   </details>

3. 낙관적 mutation이 실패하면 무엇을 해야 합니까?

   - A. 브라우저의 이전 값을 복원합니다.
   - B. 성공으로 간주합니다.
   - C. 서버 캐시만 삭제합니다.

   <details><summary>정답 보기</summary>

   정답: A. 사용자에게 잘못된 값을 남기지 않도록 롤백합니다.

   </details>

## 챕터 요약

- 공유 브라우저 캐시가 필요하지 않으면 Server Component와 Promise 전달을 먼저 고려합니다.
- 인라인, Suspense, 서버 제공 패턴은 초기 데이터 필요성과 로딩 경험에 따라 선택합니다.
- 서버 캐시, RSC Payload 캐시, 라이브러리 캐시는 서로 독립적입니다.
- mutation은 브라우저 값을 갱신하고 필요하면 서버 캐시도 무효화합니다.
- SWR과 TanStack Query는 같은 문제를 다른 API로 해결하는 독립 선택지입니다.
