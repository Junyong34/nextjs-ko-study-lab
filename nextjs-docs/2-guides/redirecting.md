# Redirecting

- 공식 문서: [Redirecting](https://nextjs.org/docs/app/guides/redirecting)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 실행 위치와 목적에 따라 redirect API를 선택할 수 있다.
- 임시·영구 redirect의 상태 코드와 Server Action 동작을 설명할 수 있다.
- 요청 전 redirect를 `next.config.js`와 Proxy로 구현할 수 있다.
- 대규모 redirect map을 빠르고 안전하게 조회하는 구조를 설계할 수 있다.

## 핵심 개념 및 설명

### Next.js의 redirect 처리 방법

| API | 목적 | 실행 위치 | 상태 코드 |
| --- | --- | --- | --- |
| `redirect` | mutation 또는 이벤트 뒤 이동 | Server Component, Server Function, Route Handler | 307 또는 Server Action에서 303 |
| `permanentRedirect` | mutation 또는 이벤트 뒤 영구 이동 | Server Component, Server Function, Route Handler | 308 |
| `useRouter` | 클라이언트 사이드 내비게이션 | Client Component 이벤트 핸들러 | 해당 없음 |
| `next.config.js`의 `redirects` | 경로 기반 수신 요청 redirect | 설정 파일 | 307 또는 308 |
| `NextResponse.redirect` | 조건 기반 수신 요청 redirect | Proxy | 임의 지정 |

### `redirect` 함수

`redirect`는 Server Component, Route Handler, Server Function에서 사용한다. mutation 뒤 관련 캐시를 갱신하고 새 위치로 이동할 때 흔히 쓴다.

```tsx
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // 데이터베이스 작업과 오류 처리를 수행한다.
  } catch (error) {
    // 오류를 처리한다.
  }
  revalidatePath('/posts')
  redirect(`/post/${id}`)
}
```

> **알아두면 좋은 점**:
>
> - JavaScript가 있으면 Server Action의 `redirect`는 클라이언트 사이드 내비게이션을 수행한다. JavaScript가 없으면 폼 제출에 303을 사용하고, 그 밖의 맥락에서는 307을 사용한다.
> - `redirect`는 오류를 던지므로 `try/catch` 바깥에서 호출한다.
> - Client Component 렌더링 중에는 호출할 수 있지만 이벤트 핸들러에서는 `useRouter`를 사용한다.
> - 절대 URL도 받을 수 있다.
> - 렌더링 전에 이동하려면 `next.config.js`나 Proxy를 사용한다.

### `permanentRedirect` 함수

`permanentRedirect`는 사용자명 변경처럼 엔티티의 canonical URL이 영구적으로 달라졌을 때 사용한다.

```tsx
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string) {
  // 데이터베이스의 사용자명을 변경한다.
  revalidateTag('username', 'max')
  permanentRedirect(`/profile/${username}`)
}
```

> **알아두면 좋은 점**: JavaScript가 없는 Server Action 폼 제출은 303을 사용하고, 다른 맥락의 `permanentRedirect`는 308을 사용한다. 절대 URL도 가능하며 렌더링 전 redirect에는 설정이나 Proxy를 사용한다.

### `useRouter()` 훅

Client Component 이벤트 핸들러에서 프로그래밍 방식으로 이동하려면 `useRouter().push()`를 쓴다.

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return <button onClick={() => router.push('/dashboard')}>Dashboard</button>
}
```

> **알아두면 좋은 점**: 프로그래밍 방식 이동이 필요하지 않으면 [`<Link>`](../3-api-reference/3.2-components/link.md)를 사용한다.

### `next.config.js`의 `redirects`

미리 알고 있는 경로 변경은 `redirects()`에 선언한다. 경로뿐 아니라 헤더, 쿠키, query 조건도 매칭할 수 있다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/about', destination: '/', permanent: true },
      { source: '/blog/:slug', destination: '/news/:slug', permanent: true },
    ]
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `permanent`에 따라 307 또는 308을 반환한다.
> - 플랫폼별 개수 제한이 있을 수 있다. Vercel은 1,024개 제한이 있으므로 1,000개 이상은 Proxy 기반 해법을 고려한다.
> - `redirects`는 Proxy보다 먼저 실행된다.

### Proxy의 `NextResponse.redirect`

인증·세션 같은 요청 조건에 따라 렌더링 전에 이동하려면 Proxy에서 `NextResponse.redirect`를 반환한다.

```tsx
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  if (authenticate(request)) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = { matcher: '/dashboard/:path*' }
```

> **알아두면 좋은 점**: Proxy는 `next.config.js`의 `redirects` 뒤, 렌더링 전에 실행된다.

### 대규모 redirect 관리(고급)

1,000개 이상의 redirect는 애플리케이션을 다시 배포하지 않고 갱신할 수 있도록 Proxy와 외부 redirect map을 조합할 수 있다.

#### 1. redirect map 생성과 저장

소스 경로를 key로 하고 목적지와 영구 여부를 값으로 하는 map을 JSON 파일이나 빠른 key-value 저장소에 둔다. Proxy는 요청 pathname으로 entry를 읽어 307 또는 308을 선택한다.

```json
{
  "/old": { "destination": "/new", "permanent": true },
  "/blog/post-old": { "destination": "/blog/post-new", "permanent": true }
}
```

#### 2. 데이터 조회 성능 최적화

모든 요청에서 큰 데이터셋을 읽으면 느리고 비싸다. 빠른 읽기에 맞춘 저장소를 사용하거나 Bloom filter로 후보 경로인지 먼저 판별한다. filter가 양성이면 Route Handler에서 실제 map을 확인한다. Bloom filter에는 거짓 양성이 있으므로 최종 redirect 전에 반드시 원본 map을 조회해야 한다.

Route Handler 요청도 검증해 악의적인 조회를 막는다. Bloom filter는 존재하지 않는 경로의 비싼 조회를 줄일 뿐 진실의 원천은 아니다.

## 예제 및 데모 설계

- Phase 2에서 다섯 redirect 방식을 각각 실행하는 페이지를 만든다.
- JavaScript 활성·비활성 Server Action 제출의 상태 코드를 네트워크 패널로 비교한다.
- `redirect`를 `try` 안과 밖에 둔 결과를 비교한다.
- 10만 경로 map을 직접 조회할 때와 Bloom filter를 먼저 확인할 때의 횟수를 시각화한다.

## 연습 문제

1. Client Component 클릭 핸들러에서 이동할 때 적합한 API는 무엇인가?

   - A. `useRouter().push()`
   - B. 렌더링 중 `redirect()`
   - C. `draftMode()`

   <details><summary>정답 보기</summary>

   정답: A. 이벤트 핸들러의 프로그래밍 방식 이동에는 `useRouter`를 사용한다.

   </details>

2. canonical URL이 영구적으로 바뀌었을 때 적합한 상태 코드는 무엇인가?

   - A. 200
   - B. 307
   - C. 308

   <details><summary>정답 보기</summary>

   정답: C. `permanentRedirect`는 일반 맥락에서 308을 사용한다.

   </details>

3. Bloom filter가 양성을 반환하면 바로 redirect해도 되는가?

   - A. 예
   - B. 아니요, 원본 map에서 확인해야 한다.

   <details><summary>정답 보기</summary>

   정답: B. Bloom filter에는 거짓 양성이 있으므로 실제 entry를 검증한다.

   </details>

## 챕터 요약

- redirect API는 실행 위치, 이동 시점, 영구성에 따라 선택한다.
- `redirect`는 제어 흐름 오류를 던지므로 `try/catch` 밖에서 호출한다.
- 미리 아는 경로는 `next.config.js`, 조건 기반 요청은 Proxy가 적합하다.
- `redirects`는 Proxy보다 먼저 실행된다.
- 대규모 map은 빠른 저장소와 Bloom filter 후보 검사를 조합할 수 있다.
