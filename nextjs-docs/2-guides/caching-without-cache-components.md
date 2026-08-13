# Caching (Previous Model)

- 공식 문서: [Caching (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Cache Components를 사용하지 않는 프로젝트에서 `fetch`와 `unstable_cache`로 데이터를 캐싱한다.
- `dynamic`, `fetchCache`, `revalidate` 라우트 세그먼트 설정의 범위와 우선순위를 설명한다.
- 시간 기반 revalidation과 태그·경로 기반 revalidation을 적용한다.
- React `cache`의 요청 중복 제거와 영속 캐싱의 차이를 구분한다.
- preload 패턴과 `generateStaticParams`를 사용할 시점을 판단한다.

## 핵심 개념 및 설명

> **전제**: 이 가이드는 Next.js 16에서 `cacheComponents` 플래그와 함께 도입된 Cache Components를 사용하지 않는 이전 캐싱 모델을 다룬다.

### `fetch` 요청 캐싱

기본적으로 `fetch` 요청은 캐싱되지 않는다. 개별 요청의 `cache`를 `'force-cache'`로 지정하면 캐싱할 수 있다.

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

#### `fetch`가 아닌 함수를 위한 `unstable_cache`

`unstable_cache`는 데이터베이스 질의처럼 `fetch`를 사용하지 않는 비동기 함수 결과를 영속적으로 캐싱한다. 두 번째 인자는 캐시 키 접두사, 세 번째 인자의 `tags`는 요청 기반 revalidation용 태그, `revalidate`는 다시 확인하기까지의 초 단위 기간이다.

```ts
import { unstable_cache } from 'next/cache'

export const getCachedUser = unstable_cache(
  async (id: string) => db.user.findUnique({ where: { id } }),
  ['user'],
  { tags: ['user'], revalidate: 3600 }
)
```

#### 라우트 세그먼트 설정

Page, Layout, Route Handler에서 설정을 export해 라우트 수준 동작을 바꿀 수 있다.

##### `dynamic`

| 값 | 동작 |
| --- | --- |
| `'auto'` | 기본값. 컴포넌트의 다이나믹 동작을 막지 않으면서 가능한 만큼 캐싱한다. |
| `'force-dynamic'` | 요청마다 렌더링한다. 모든 `fetch`의 `cache: 'no-store'`, `revalidate: 0` 및 `fetchCache = 'force-no-store'`와 같은 효과다. |
| `'error'` | 요청 시점 API나 캐싱되지 않은 데이터를 쓰면 오류를 내고 prerendering과 데이터 캐싱을 강제한다. 모든 `fetch`의 `'force-cache'` 및 `fetchCache = 'only-cache'`와 같은 효과다. |
| `'force-static'` | `cookies`, `headers`, `useSearchParams`가 빈 값을 반환하게 해 prerendering을 강제한다. 이 라우트도 `revalidate`, `revalidatePath`, `revalidateTag`로 갱신할 수 있다. |

##### `fetchCache`

`fetchCache`는 layout이나 page 안의 모든 `fetch` 요청에 적용되는 고급 설정이다. 구체적인 필요가 없다면 사용하지 않는 편이 낫다. 기본 `'auto'`에서는 요청 시점 API보다 앞서 발견한 요청은 주어진 `cache` 옵션에 따라 캐싱하고, 뒤에서 발견한 요청은 캐싱하지 않는다.

| 값 | 옵션이 없는 `fetch`와 강제 규칙 |
| --- | --- |
| `'auto'` | 요청 시점 API 전후의 기본 휴리스틱을 유지한다. |
| `'default-cache'` | 기본을 `'force-cache'`로 하되 개별 옵션을 허용한다. |
| `'only-cache'` | 기본을 `'force-cache'`로 하고 `'no-store'` 사용 시 오류를 낸다. |
| `'force-cache'` | 모든 요청을 `'force-cache'`로 바꾼다. |
| `'default-no-store'` | 기본을 `'no-store'`로 하되 개별 옵션을 허용한다. |
| `'only-no-store'` | 기본을 `'no-store'`로 하고 `'force-cache'` 사용 시 오류를 낸다. |
| `'force-no-store'` | 개별 옵션과 관계없이 모든 요청을 `'no-store'`로 바꾼다. |

한 라우트의 layout과 page 설정은 서로 호환돼야 한다. 같은 캐시 방향의 `'force-*'`는 `'only-*'`보다 우선하지만, `'only-cache'`와 `'only-no-store'` 또는 `'force-cache'`와 `'force-no-store'`를 섞을 수 없다. 부모의 `'default-no-store'`와 자식의 `'auto'` 또는 `'*-cache'`도 같은 요청의 동작을 달라지게 하므로 허용되지 않는다. 공유 부모 layout은 일반적으로 `'auto'`로 두고 갈라지는 자식 세그먼트에서 조정하는 것을 권장한다.

### 시간 기반 revalidation

`fetch`의 `next.revalidate`에 초를 지정한다. `fetch`가 아닌 함수는 `unstable_cache`의 같은 이름 옵션을 사용한다.

```tsx
const data = await fetch('https://...', { next: { revalidate: 3600 } })
```

#### 라우트 세그먼트 설정 `revalidate`

| 값 | 동작 |
| --- | --- |
| `false` | 기본값. 사실상 무기한 캐싱하되 개별 요청은 `'no-store'`나 `revalidate: 0`을 선택할 수 있다. |
| `0` | 라우트를 요청마다 렌더링하고 옵션 없는 `fetch`의 기본을 `'no-store'`로 바꾼다. 명시적 `'force-cache'`나 양수 `revalidate`는 유지한다. |
| 양수 | layout 또는 page의 기본 revalidation 주기를 초 단위로 정한다. |

개별 `fetch`의 `revalidate`를 덮어쓰지는 않는다. 한 라우트의 layout과 page 중 가장 짧은 값이 라우트 전체 주기가 되며, 더 짧은 개별 `fetch` 값도 전체 라우트의 revalidation 빈도를 높인다.

> **알아두면 좋은 점**:
>
> - 값은 정적으로 분석할 수 있어야 한다. `revalidate = 600`은 유효하지만 `revalidate = 60 * 10`은 유효하지 않다.
> - 지원 중단 예정인 `runtime = 'edge'`에서는 이 값을 사용할 수 없다.
> - 개발 환경의 페이지는 요청 시점에 렌더링되고 캐싱되지 않는다. 따라서 기간을 기다리지 않고 변경을 확인할 수 있다.

### 요청 기반 revalidation

Server Action이나 Route Handler에서 이벤트 뒤 캐시를 갱신할 때 `revalidateTag` 또는 `revalidatePath`를 사용한다.

#### 캐시 데이터에 태그 지정

```tsx
export async function getUserById(id: string) {
  return fetch(`https://.../${id}`, { next: { tags: ['user'] } })
}
```

`unstable_cache`도 `tags` 옵션을 받는다.

#### `revalidateTag`

```ts
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  await mutateUser(id)
  revalidateTag('user', 'max')
}
```

같은 태그가 붙은 캐시 데이터를 무효화한다.

#### `revalidatePath`

```ts
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  await mutateUser(id)
  revalidatePath('/profile')
}
```

특정 라우트 경로의 캐시 데이터를 무효화한다.

### 요청 중복 제거

`fetch`는 한 서버 렌더링 동안 동일한 요청을 자동으로 메모이제이션한다. ORM이나 데이터베이스를 직접 사용한다면 React `cache`로 데이터 접근 함수를 감싸 같은 렌더링 과정의 중복 호출을 하나로 합칠 수 있다.

```ts
import { cache } from 'react'

export const getPost = cache(async (id: string) => {
  return db.post.findUnique({ where: { id } })
})
```

React `cache`는 한 렌더링 과정의 중복 제거용이다. 요청을 넘어 유지되는 `unstable_cache`의 영속 캐싱과 혼동하지 않는다.

### 데이터 미리 로드

차단 작업보다 먼저 데이터 요청을 시작하는 `preload` 유틸리티를 만들 수 있다. `server-only`와 React `cache`를 함께 사용하면 같은 함수를 미리 호출해도 실제 데이터 접근은 중복되지 않는다.

```ts
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => {
  // 데이터를 읽는다.
})

export const preload = (id: string) => {
  void getItem(id)
}
```

페이지에서 `preload(id)`를 다른 `await`보다 먼저 호출하면 그 작업과 데이터 fetching이 겹쳐 실행된다.

### 다이나믹 라우트 정적 생성

다이나믹 라우트를 `generateStaticParams`로 prerender하고 시간에 따라 revalidation하려면 [Incremental Static Regeneration](./incremental-static-regeneration.md) 패턴을 사용한다.

## 예제 및 데모 설계

- **Phase 1 상태**: 구현 예정
- 같은 데이터 접근에 `no-store`, `force-cache`, `next.revalidate`, `unstable_cache`를 차례로 적용해 서버 호출 횟수를 비교한다.
- 태그가 같은 두 화면과 다른 경로 하나를 두고 `revalidateTag`와 `revalidatePath`의 무효화 범위를 시각화한다.
- `preload` 전후의 서버 타임라인을 표시해 순차 실행과 겹쳐 실행되는 요청을 비교한다.

## 연습 문제

1. `fetch`가 아닌 데이터베이스 함수 결과를 요청 사이에서도 캐싱하려면 무엇을 사용하는가?
   - A. React `cache`
   - B. `unstable_cache`
   - C. `useMemo`
   - D. `headers`

   <details><summary>정답 보기</summary>

   정답: B. React `cache`는 한 서버 렌더링 과정의 중복 제거에 사용한다.

   </details>

2. 라우트의 layout과 page에 서로 다른 양수 `revalidate`가 있을 때 전체 주기를 정하는 값은 무엇인가?
   - A. 가장 긴 값
   - B. page의 값
   - C. 가장 짧은 값
   - D. 평균값

   <details><summary>정답 보기</summary>

   정답: C. 자식도 부모만큼 자주 revalidation되도록 가장 짧은 값이 전체 라우트에 적용된다.

   </details>

3. `revalidateTag`와 `revalidatePath`에 관한 설명으로 옳은 것을 모두 고르시오.
   - A. 둘 다 Server Action이나 Route Handler에서 사용할 수 있다.
   - B. `revalidateTag`는 같은 태그가 붙은 항목을 대상으로 한다.
   - C. `revalidatePath`는 특정 경로를 대상으로 한다.
   - D. 둘 다 애플리케이션을 다시 배포한다.

   <details><summary>정답 보기</summary>

   정답: A, B, C. 두 API는 배포가 아니라 캐시 무효화를 수행한다.

   </details>

## 챕터 요약

- 이전 캐싱 모델에서는 `fetch` 옵션과 `unstable_cache`로 캐시 범위를 선택한다.
- 라우트 세그먼트 설정은 강력하지만 부모·자식 옵션의 호환성을 지켜야 한다.
- 시간 기반 revalidation은 초 단위 기간을, 요청 기반 revalidation은 태그나 경로를 사용한다.
- React `cache`는 렌더링 중 중복 제거, `unstable_cache`는 요청을 넘는 영속 캐싱을 담당한다.
- `preload`는 차단 작업 전에 데이터 fetching을 시작해 순차 폭포를 줄인다.
