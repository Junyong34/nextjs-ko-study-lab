# cacheTag

- 공식 문서: [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [`use cache`](../3.4-directives/use-cache.md) 스코프 내부에서 캐시 항목에 고유 식별 태그를 지정하는 `cacheTag` 함수의 사용법을 익힌다.
- 단일 호출에서 다중 태그 부여 및 외부 데이터 기반의 동적 태그 생성 방식을 이해한다.
- 태그가 지정된 캐시를 무효화하는 두 가지 함수인 [`updateTag`](./updateTag.md)와 [`revalidateTag`](./revalidateTag.md)의 적절한 사용 시점을 구분한다.
- 태그 수량(최대 128개) 및 길이(최대 256자) 제한과 멱등성(Idempotent) 특성을 파악한다.

## 핵심 개념 및 설명

`cacheTag`는 캐시된 데이터에 태그(문자열 식별자)를 부여하여, 필요할 때 특정 태그가 붙은 캐시 항목만 선택적으로 무효화(purge/revalidate)할 수 있게 해주는 함수다.

```tsx filename="app/data.ts" switcher
import { cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('my-data')
  const data = await fetch('/api/data')
  return data
}
```

```jsx filename="app/data.js" switcher
import { cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('my-data')
  const data = await fetch('/api/data')
  return data
}
```

### 사용법 (Usage)

`next.config.ts` 파일에서 [`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md) 플래그를 활성화해야 한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

태그가 지정된 캐시는 [Server Function](../3.4-directives/use-server.md)이나 [Route Handler](../3.1-file-conventions/route.md)에서 온디맨드로 무효화할 수 있다:

- [`updateTag`](./updateTag.md): 폼 제출과 같은 사용자 트리거 뮤테이션(Read-your-own-writes)에서 변경 직후 즉시 최신 데이터를 읽어야 할 때 사용한다. Server Function 내부에서만 호출 가능하다.
- [`revalidateTag`](./revalidateTag.md): 백그라운드에서 재검증이 수행되는 동안 일시적으로 이전 캐시를 서빙해도 괜찮거나, Route Handler 또는 웹훅 컨텍스트에서 무효화할 때 사용한다.

```tsx filename="app/action.ts" switcher
'use server'

import { updateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  updateTag('my-data') // 'my-data' 태그가 지정된 모든 캐시 즉시 무효화
}
```

```jsx filename="app/action.js" switcher
'use server'

import { updateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  updateTag('my-data')
}
```

### 주요 특성 및 제약 (Good to know)

- **태그 멱등성(Idempotent)**: 동일한 태그를 여러 번 중복 적용해도 부작용 없이 한 번만 등록된다.
- **다중 태그 지원**: `cacheTag('tag-one', 'tag-two')`와 같이 쉼표로 구분하여 여러 태그를 한 번에 전달할 수 있다.
- **제한 규격**: 단일 `cacheTag()` 호출당 최대 128개의 태그를 지정할 수 있으며, 각 태그 문자열의 최대 길이는 256자다. 256자를 초과하는 태그는 무시되며 128개를 초과하는 태그는 버려지고 경고 로그가 출력된다.

### 예제

#### 1. 외부 데이터 기반의 동적 태그 생성

비동기 함수가 가져온 엔티티의 고유 ID를 태그에 포함시켜 특정 항목 단위로 정밀하게 캐시를 제어할 수 있다:

```tsx filename="app/components/bookings.tsx" switcher
import { cacheTag } from 'next/cache'

export async function Bookings({ type = 'haircut' }: { type: string }) {
  async function getBookingsData() {
    'use cache'
    const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
    // 상위 카테고리 태그와 개별 데이터 ID 태그를 함께 지정
    cacheTag('bookings-data', `booking-${data.id}`)
    return data
  }

  return <div>{/* 예약 렌더링 */}</div>
}
```

```jsx filename="app/components/bookings.js" switcher
import { cacheTag } from 'next/cache'

export async function Bookings({ type = 'haircut' }) {
  async function getBookingsData() {
    'use cache'
    const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
    cacheTag('bookings-data', `booking-${data.id}`)
    return data
  }

  return <div>{/* 예약 렌더링 */}</div>
}
```

#### 2. Server Action에서 태그 기반 재검증

```tsx filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function updateBookings() {
  await updateBookingData()
  revalidateTag('bookings-data', 'max')
}
```

## 예제 및 데모 설계

- 블로그 글 조회 컴포넌트에 `cacheTag('posts', 'post-' + id)`를 부여하고, 글 수정 Server Action에서 `updateTag('post-' + id)`를 호출하여 대상 글만 캐시가 갱신되는 데모를 구성한다.
- 쉼표로 구분된 다중 태그(`cacheTag('dashboard', 'user-' + userId)`) 적용 시 두 태그 중 하나만 무효화되어도 캐시가 정상적으로 갱신되는지 확인한다.
- 128개 초과 또는 256자 초과 태그 전달 시 경고 처리 동작을 검증한다.

## 연습 문제

1. `cacheTag` 함수가 호출되어야 하는 올바른 위치는?
   - A. 클라이언트 컴포넌트의 `useEffect` 내부
   - B. `use cache` 지시어가 선언된 비동기 함수나 컴포넌트 스코프 내부
   - C. `next.config.js`의 `plugins` 배열
   - D. 미들웨어 파일 최상단

<details><summary>정답 보기</summary>

정답: **B**  
해설: `cacheTag`는 `use cache` 스코프 내부에서 실행되어 해당 캐시 항목에 식별 태그를 바인딩하는 함수다.
</details>

2. 사용자가 폼을 제출하여 데이터를 변경한 후, 다음 읽기에서 즉시 최신 데이터를 보장해야 하는(Read-your-own-writes) 상황에 가장 적합한 무효화 함수는?
   - A. `revalidatePath`
   - B. `updateTag`
   - C. `cacheLife`
   - D. `cookies().delete()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `updateTag`는 Server Function 내부에서 실행되어 해당 태그의 캐시를 즉시 만료시키고 다음 읽기에서 최신 데이터를 가져오도록 보장한다.
</details>

## 챕터 요약

- `cacheTag`는 `use cache` 스코프 내부에서 캐시 항목에 식별자 태그를 부여하는 함수다.
- 단일 호출당 최대 128개(각 256자 제한)의 태그를 전달할 수 있으며 멱등성을 가진다.
- 데이터 응답의 고유 ID를 활용해 `cacheTag('items', item.id)`와 같이 세밀한 캐시 관리가 가능하다.
- Server Action에서 즉각적인 반영은 `updateTag`, 백그라운드 갱신이나 Route Handler에서는 `revalidateTag`를 사용한다.
- 활성화를 위해 `next.config.ts`의 `cacheComponents: true` 설정이 필요하다.
