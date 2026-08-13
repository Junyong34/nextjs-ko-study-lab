# Authentication with Cache Components

- 공식 문서: [Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Cache Components를 사용하는 앱에서 세션 읽기가 static shell에 포함될 수 없는 이유를 설명한다.
- `Suspense`와 `use cache: private`로 인증 UI를 요청 시점에 스트리밍한다.
- 세션에서 파생한 데이터를 서버 캐시에 안전하게 저장하고 갱신한다.
- 인증 라우트의 prefetch 조건과 캐시 키·태그의 보안 주의사항을 판단한다.

## 핵심 개념 및 설명

Cache Components를 활성화하면 세션은 요청 시점에 읽는다. 따라서 세션에 의존하는 UI는 빌드 시점의 [static shell](../1-getting-started/caching.md#prerendering)에 포함할 수 없다. 대신 인증 UI를 `Suspense` 경계 뒤에서 스트리밍하고, 세션에서 파생한 데이터에는 별도의 캐시 수명을 줄 수 있다.

공식 예제는 암호화된 쿠키 세션을 위해 `iron-session`을 사용하지만, 이 패턴은 다른 세션·인증 라이브러리에도 적용할 수 있다. 이 문서는 로그인 과정에서 세션이 이미 설정되었다고 가정한다. 인증·인가의 전체 흐름은 [Authentication](./authentication.md), 서버에 데이터 접근을 한정하는 원칙은 [Data Security](./data-security.md)를 함께 참고한다.

### 사전 준비

[`cacheComponents`](../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)를 활성화한다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

### 기존 앱을 점진적으로 마이그레이션하기

Cache Components를 켜면 instant navigation 검증은 세션을 읽는 모든 라우트를 표시한다. 요청 시점의 읽기는 static shell에 넣을 수 없기 때문이다. 모든 라우트를 한 번에 고칠 필요는 없다. 페이지나 레이아웃에 `export const instant = false`를 설정하면 서버에서 계속 블로킹하도록 둘 수 있다. 이후 아래 패턴을 라우트별로 적용한다. 전체 절차는 [Migrating to Cache Components](./migrating-to-cache-components.md#following-validation)를 참고한다.

### 1단계: 현재 사용자 읽기

현재 사용자를 구하려면 세션 쿠키를 읽고 사용자 저장소를 조회한다. 이 작업은 요청에 의존하므로 항상 [`Suspense`](../3-api-reference/3.1-file-conventions/loading.md) 경계 뒤에 두고 내비게이션마다 스트리밍한다.

세션에는 유효 기간이 있으므로 캐시 수명을 부여하면 프레임워크가 이 콘텐츠를 미리 가져올 수 있다. 다만 일반 [`use cache`](../3-api-reference/3.4-directives/use-cache.md)와 [`use cache: remote`](../3-api-reference/3.4-directives/use-cache-remote.md)는 `cookies()`를 호출할 수 없다. 쿠키 값을 밖에서 읽어 인자로 넘기는 방식도 세션 도우미가 내부 깊숙한 곳에서 쿠키를 읽고, 토큰 만료를 현재 시각과 비교하는 경우에는 적용할 수 없다.

이때 [`use cache: private`](../3-api-reference/3.4-directives/use-cache-private.md)를 사용한다. 이 지시어는 `cookies()`와 `headers()`를 직접 읽을 수 있으며 결과를 서버가 아닌 브라우저에만 보관한다.

```ts
import 'server-only'
import { cookies } from 'next/headers'
import { sealData, unsealData } from 'iron-session'

export type SessionData = {
  userId?: string
}

const COOKIE_NAME = 'app_session'
const password = process.env.SESSION_PASSWORD!

export async function getSession(): Promise<SessionData> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value
  if (!cookie) return {}
  return unsealData<SessionData>(cookie, { password })
}
```

```ts
import 'server-only'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { findUserById } from './data'

export type User = { id: string; name: string }

export async function getCurrentUser(): Promise<User> {
  'use cache: private'

  const { userId } = await getSession()
  if (!userId) redirect('/login')

  const user = await findUserById(userId)
  if (!user) redirect('/login')

  return { id: user.id, name: user.name }
}
```

`redirect()`는 값을 반환하지 않고 렌더링을 중단하도록 예외를 던진다. 따라서 리다이렉트 결과는 캐시되지 않고, 정상적으로 확인된 사용자만 캐시된다.

> **알아두면 좋은 점**: `use cache: private`는 `cookies()`, `headers()`, `searchParams`를 허용하지만 [`connection()`](../3-api-reference/3.3-functions/connection.md)은 허용하지 않는다.

서버에 데이터를 캐시해야 한다면 `userId`처럼 세션에서 안전한 값을 추출해 일반 `use cache` 또는 `use cache: remote` 함수에 넘긴다. 이 패턴은 4단계에서 사용한다.

### 2단계: 페이지를 막지 않고 사용자 표시하기

세션을 읽는 컴포넌트는 `Suspense` 경계 안에 있어야 한다. Cache Components를 사용할 때 경계 밖에서 `cookies()`를 읽으면 빌드 오류가 발생한다. 경계 밖의 정적 콘텐츠나 일반 `use cache`로 감싼 콘텐츠는 static shell에 들어가 즉시 표시되고, 인증 영역만 요청을 기다린다.

```tsx
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getAnnouncements } from '@/lib/data'

export default function Page() {
  return (
    <main>
      <Announcements />
      <Suspense fallback={<p>Loading your dashboard…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}

async function Announcements() {
  'use cache'
  const announcements = await getAnnouncements()
  return <ul>{announcements.map((item) => <li key={item}>{item}</li>)}</ul>
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
```

레이아웃 최상위에서도 세션을 `await`하지 않는다. 그렇게 하면 `{children}`을 포함한 세그먼트 전체가 요청을 기다린다. 세션 읽기를 경계 안쪽의 컴포넌트로 밀어 넣는다. 자세한 원리는 [Streaming](./streaming.md#push-dynamic-access-down)을 참고한다.

> **알아두면 좋은 점**: 세션 읽기·검증과 최소 사용자 객체 반환을 `getCurrentUser` 한 곳에 모으는 방식은 [Data Access Layer](./authentication.md#creating-a-data-access-layer-dal) 패턴이다.

### 3단계: 여러 컴포넌트에서 사용자 공유하기

같은 경계 안에서는 세션을 컴포넌트마다 다시 읽을 필요가 없다. Server Component는 `getCurrentUser()`를 직접 호출할 수 있다. Client Component에 prop을 여러 단계로 전달하고 싶지 않다면 Promise를 한 번 만들고 Context로 전달한 뒤 React의 `use()`로 해제한다. Promise는 레이아웃 최상위가 아니라 `Suspense` 경계 안에서 만든다.

```tsx
'use client'

import { createContext, use } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/lib/auth'

const UserContext = createContext<Promise<User> | null>(null)

export function UserProvider({ userPromise, children }: {
  userPromise: Promise<User>
  children: ReactNode
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}

export function useUser() {
  const userPromise = use(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return use(userPromise)
}
```

Server Component는 Promise를 기다리지 않고 Provider에 넘긴다. 각 Client Component는 `useUser()`를 호출하며, `use()`가 Promise 해결까지 중단하므로 자체 `Suspense` 경계 뒤에 둔다.

> **알아두면 좋은 점**: 클라이언트에는 필요한 필드만 노출한다. 원시 세션 대신 `{ id, name }`처럼 좁은 객체를 반환한다. 민감한 값이 클라이언트로 전달되지 않게 하려면 React의 [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)도 참고한다.

### 4단계: 세션에서 파생한 데이터 캐시하기

사용자별 데이터를 캐시하는 방법은 두 가지다.

- 사용자 ID를 일반 `use cache` 함수에 넘기면 ID가 캐시 키의 일부가 되고 결과는 서버에 저장된다. [`cacheTag`](../3-api-reference/3.3-functions/cacheTag.md)로 나중에 무효화할 수 있다.
- `use cache: private` 범위 안에서 읽으면 결과는 서버가 아닌 브라우저에만 저장된다. 데이터를 서버에 일시적으로도 저장하면 안 되는 요구사항에 적합하다.

```ts
import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from './auth'

export async function getNotes() {
  const user = await getCurrentUser()
  return getNotesByUserId(user.id)
}

async function getNotesByUserId(userId: string) {
  'use cache'
  cacheTag(`notes:${userId}`)
  cacheLife('minutes')

  return db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
  })
}
```

`getNotesByUserId`는 내보내지 않는다. 외부 호출자가 다른 사용자 ID를 직접 넘길 수 없게 하고, 공개된 `getNotes`가 세션을 확인한 뒤 ID를 전달해야 안전하다.

> **알아두면 좋은 점: 캐시 키와 태그는 평문으로 저장된다.** 캐시 함수의 인자와 캡처한 변수는 캐시 키로 직렬화되고 `cacheTag` 값도 작성한 그대로 보관된다. 기본 캐시와 remote cache 어느 쪽도 이를 해시하지 않는다. 토큰·비밀번호·원시 이메일 같은 비밀·민감 정보는 인자와 태그에 넣지 말고, 사용자 ID처럼 안정적인 식별자를 사용한다.

일반 `use cache`는 서버 메모리에 최선형(best effort)으로 보관되므로 메모리 압박 시 제거될 수 있다. 서버리스에서는 인스턴스 사이에 유지되지 않는다. 요청과 인스턴스를 넘어 공유해야 하면 `use cache: remote`를 사용한다.

### 5단계: 세션에서 파생한 데이터 갱신하기

[Server Action](../1-getting-started/mutating-data.md)이 사용자 데이터를 변경하면 같은 태그로 [`updateTag`](../3-api-reference/3.3-functions/updateTag.md)를 호출해 캐시 항목을 갱신한다. 클라이언트가 보낸 사용자 정보를 신뢰하지 말고 Action 안에서 세션을 다시 읽어 인가한다.

```ts
'use server'

import { redirect } from 'next/navigation'
import { updateTag } from 'next/cache'
import { getSession } from '@/lib/session'
import { saveNote } from '@/lib/data'

export async function addNote(formData: FormData) {
  const { userId } = await getSession()
  if (!userId) redirect('/login')

  const note = String(formData.get('note') ?? '').trim()
  if (note) {
    await saveNote(userId, note)
    updateTag(`notes:${userId}`)
  }
}
```

### 6단계: 인증 내비게이션을 즉시 열기

`use cache: private`는 별도 설정이 없으면 5분 `stale`을 가진 `default` [`cacheLife`](../3-api-reference/3.3-functions/cacheLife.md) 프로필을 사용한다. 세션을 읽는 라우트는 인증 콘텐츠를 포함한 세션별 App Shell을 만들고, 이를 세션별로 prefetch하고 캐시하므로 내비게이션이 즉시 열릴 수 있다.

- `cacheLife`를 조정할 때 `stale`을 30초 이상으로 유지한다. 이보다 짧으면 해당 범위가 prefetch 대상에서 빠진다.
- `params`나 `searchParams`에도 의존하는 라우트의 링크에는 [`<Link prefetch={true}>`](../3-api-reference/3.2-components/link.md#prefetch)를 지정한다. 링크마다 URL 데이터를 미리 해결하는 방식은 [Optimizing prefetching](./optimizing-prefetching.md)을 참고한다.

```tsx
<Link href={`/notes/${note.id}`} prefetch={true}>
  {note.text}
</Link>
```

목적지에는 [Partial Prefetching](./adopting-partial-prefetching.md)이 필요하다. [`partialPrefetching`](../3-api-reference/3.5-config/3.5.1-next-config-js/partialPrefetching.md)을 켜거나 세그먼트에 `prefetch = 'partial'`을 설정한다. 이 prefetch는 링크마다 서버 호출 한 번을 사용하므로, 대기 시간을 줄일 가치가 있는 링크에만 추가한다.

### 흔한 실수

- 일반 `use cache` 안에서 `cookies()`나 `headers()`를 읽으면 오류가 발생한다. 요청 값을 밖에서 읽어 넘기거나 `use cache: private`를 사용한다.
- 캐시 키나 태그에 비밀·개인 데이터를 넣지 않는다. 이 값들은 평문으로 저장된다.
- UI에서 요소를 숨기는 것만으로 데이터를 보호할 수 없다. 모든 Server Action과 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)에서 데이터 접근과 가까운 곳에서 세션을 다시 검증한다.

## 예제 및 데모 설계

- 데모 가능 여부: Phase 2에서 구현 예정
- 데모 목적: static shell과 인증 UI의 스트리밍, 사용자별 노트 캐시와 `updateTag` 갱신을 한 화면에서 비교한다.
- 사용자가 확인할 화면과 상호작용:
  - 로그인 전후에도 공지 영역은 즉시 나타나고 대시보드만 fallback 뒤에서 스트리밍되는지 확인한다.
  - 노트를 추가한 직후 동일 사용자 태그의 목록만 갱신되는지 확인한다.
  - URL에 의존하는 노트 링크에서 `prefetch={true}` 적용 전후의 내비게이션 대기 시간을 비교한다.

## 연습 문제

1. 쿠키를 직접 읽는 `getCurrentUser()`에 적합한 지시어는 무엇인가?

   - A. `use cache`
   - B. `use cache: remote`
   - C. `use cache: private`
   - D. `use client`

   <details><summary>정답 보기</summary>

   정답: C. `use cache: private`는 요청 API를 읽으면서 결과를 브라우저에만 캐시할 수 있다.

   </details>

2. 사용자별 노트를 서버 캐시에 안전하게 저장하는 방법을 모두 고른다.

   - A. 공개 함수가 클라이언트의 `userId`를 그대로 신뢰한다.
   - B. 세션에서 ID를 확인한 뒤 비공개 캐시 함수에 넘긴다.
   - C. 태그에는 원시 이메일과 토큰을 함께 넣는다.
   - D. mutation 후 동일한 태그로 `updateTag`를 호출한다.

   <details><summary>정답 보기</summary>

   정답: B, D. 서버가 세션으로 사용자를 확인하고 안정적인 식별자와 태그를 사용해야 한다.

   </details>

3. `params`에 의존하는 인증 라우트의 per-link prefetch에 필요한 조건은 무엇인가?

   - A. `Link`의 `prefetch={true}`와 목적지의 Partial Prefetching
   - B. `cacheLife`의 `stale`을 30초 미만으로 설정
   - C. 레이아웃 최상위에서 세션 Promise를 `await`
   - D. 모든 캐시를 `no-store`로 설정

   <details><summary>정답 보기</summary>

   정답: A. 링크별 URL 데이터를 클릭 전에 해결하려면 명시적 prefetch와 Partial Prefetching이 필요하다.

   </details>

## 챕터 요약

- 세션 읽기는 요청 시점 작업이므로 static shell이 아니라 `Suspense` 경계 뒤에서 스트리밍한다.
- `use cache: private`는 요청 API에 접근하면서 결과를 브라우저에만 캐시한다.
- 서버 캐시에는 세션에서 확인한 안정적인 식별자만 넘기고 민감 정보는 키·태그에서 제외한다.
- mutation 뒤에는 동일한 태그로 `updateTag`를 호출하며 Action 안에서 세션을 다시 검증한다.
- 인증 라우트의 즉시 내비게이션은 충분한 `stale` 수명과 필요한 경우 Partial Prefetching으로 유지한다.
