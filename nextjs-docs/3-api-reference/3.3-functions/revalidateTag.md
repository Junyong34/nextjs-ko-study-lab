# revalidateTag

- 공식 문서: [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 특정 캐시 태그가 지정된 데이터를 온디맨드로 무효화하는 `revalidateTag` 함수의 사용법을 익힌다.
- 백그라운드에서 데이터를 갱신하면서 이전 캐시를 즉시 서빙하는 Stale-While-Revalidate(SWR) 동작 메커니즘을 이해한다.
- Next.js 최신 2인자 시그니처인 `profile="max"` 옵션과 웹훅용 `{ expire: 0 }`의 역할을 파악한다.
- Server Action 및 Route Handler(외부 CMS 웹훅 등)에서 태그 기반 재검증을 구현한다.

## 핵심 개념 및 설명

`revalidateTag`는 특정 캐시 태그와 연결된 [캐시 데이터](../../1-getting-started/caching.md)를 온디맨드로 무효화할 수 있게 해주는 함수다.

약간의 업데이트 지연이 허용되는 블로그 게시물, 상품 카탈로그, 문서 사이트 등에 이상적이다. 사용자는 백그라운드에서 새 데이터가 로드되는 동안 기존 캐시 콘텐츠를 지연 없이 즉시 제공받는다.

### 실행 환경 및 시그니처

`revalidateTag`는 서버 환경인 **Server Function**과 **Route Handler**에서만 실행할 수 있다.

```ts
revalidateTag(tag: string, profile: string | { expire?: number }): void
```

- `tag`: 재검증하려는 데이터와 연결된 캐시 태그 문자열(최대 256자, 대소문자 구분).
- `profile`: 재검증 동작 방식을 지정하는 프로필이다.
  - **`profile="max"` (권장)**: 태그 항목을 stale 상태로 표시하고, 다음 방문 시 백그라운드에서 새로고침을 수행하는 Stale-While-Revalidate 시맨틱을 제공한다.
  - **`{ expire: 0 }`**: 외부 웹훅 호출 시 즉각적인 만료가 필요한 경우 사용한다.
  - **단일 인자 형태 (더 이상 권장되지 않음)**: 인자 없이 `revalidateTag(tag)`만 호출하는 형태는 deprecated되었으며, 2인자 시그니처를 사용하거나 [`updateTag`](./updateTag.md)로 마이그레이션해야 한다.

> **알아두면 좋은 점**:
> `profile="max"`를 사용할 때 `revalidateTag`는 태그 데이터를 stale로 표시할 뿐이며, 실제 새 데이터 가져오기는 해당 태그를 사용하는 페이지를 사용자가 다음 번에 방문할 때 발생한다. 따라서 호출 즉시 대량의 재검증 트래픽이 한 번에 발생하지 않는다.

### 데이터에 태그를 부여하는 방법

1. **`fetch` 요청 시**:
   ```tsx
   fetch(url, { next: { tags: ['posts'] } })
   ```
2. **`'use cache'` 스코프 내부에서**:
   ```tsx
   import { cacheTag } from 'next/cache'

   async function getData() {
     'use cache'
     cacheTag('posts')
     return await fetchFromDb()
   }
   ```

### 예제

#### 1. Server Action에서 태그 재검증

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts', 'max')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts', 'max')
}
```

#### 2. Route Handler에서 CMS 웹훅 처리

외부 CMS에서 콘텐츠가 발행되었을 때 웹훅 엔드포인트를 통해 태그를 무효화할 수 있다:

```ts filename="app/api/revalidate/route.ts" switcher
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: '유효하지 않은 토큰입니다' }, { status: 401 })
  }

  const { tag } = await request.json()
  if (tag) {
    // 웹훅을 통한 즉시 만료는 { expire: 0 } 사용 가능
    revalidateTag(tag, 'max')
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({ revalidated: false, message: '태그가 누락되었습니다' })
}
```

```js filename="app/api/revalidate/route.js" switcher
import { revalidateTag } from 'next/cache'

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: '유효하지 않은 토큰입니다' }, { status: 401 })
  }

  const { tag } = await request.json()
  if (tag) {
    revalidateTag(tag, 'max')
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({ revalidated: false, message: '태그가 누락되었습니다' })
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | `profile`을 요구하는 2인자 시그니처 도입 및 단일 인자 형태 deprecated 안내 |
| `v13.0.0` | `revalidateTag` 도입 |

## 예제 및 데모 설계

- Strapi/Contentful 등의 CMS 글 수정 웹훅을 수신하여 `revalidateTag('posts', 'max')`를 실행하고, 다음 페이지 접근 시 백그라운드 재검증이 일어나는 과정을 검증한다.
- `profile="max"` 적용 시 기존 캐시가 즉시 응답되고 이후 백그라운드 갱신 데이터로 교체되는 SWR 시나리오를 테스트한다.
- `updateTag`와 `revalidateTag`의 응답 대기 시간 차이를 비교한다.

## 연습 문제

1. `revalidateTag('articles', 'max')`를 호출했을 때의 동작 방식으로 올바른 것은?
   - A. 'articles' 태그가 지정된 모든 페이지를 즉시 빌드하여 서버가 멈춘다.
   - B. 해당 태그를 stale 상태로 표시하고, 다음 방문 시 이전 캐시를 서빙하면서 백그라운드에서 새 데이터를 가져온다.
   - C. 데이터베이스의 모든 레코드를 삭제한다.
   - D. 클라이언트의 브라우저 쿠키를 삭제한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `profile="max"` 옵션과 함께 `revalidateTag`를 호출하면 태그 항목이 stale로 마킹되어, 다음 요청 시 이전 캐시를 우선 반환하고 백그라운드에서 재검증을 수행한다.
</details>

2. Next.js 최신 버전에서 `revalidateTag`의 권장 시그니처 형태는?
   - A. `revalidateTag(tag)` (단일 인자)
   - B. `revalidateTag(tag, profile)` (2인자 형태)
   - C. `revalidateTag(path, type)`
   - D. `revalidateTag(url, headers)`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js에서는 재검증 수명 프로필을 명시하는 2인자 시그니처(`revalidateTag(tag, profile)`) 사용이 권장된다.
</details>

## 챕터 요약

- `revalidateTag`는 특정 캐시 태그와 연결된 데이터를 온디맨드로 무효화하는 함수다.
- `profile="max"`를 전달하여 백그라운드 갱신(Stale-While-Revalidate) 방식으로 원활한 사용자 경험을 제공한다.
- `fetch`의 `next: { tags: [...] }` 또는 `'use cache'` 내부의 `cacheTag()`로 태그를 부여한다.
- Server Action과 Route Handler에서 안전하게 호출할 수 있다.
- 폼 제출 후 즉각적인 최신 데이터 조회가 필요한 경우는 `updateTag`를 사용하는 것이 권장된다.
