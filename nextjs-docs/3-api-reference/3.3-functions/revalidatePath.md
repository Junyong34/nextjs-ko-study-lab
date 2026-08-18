# revalidatePath

- 공식 문서: [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 특정 경로의 캐시된 데이터를 온디맨드로 무효화하는 `revalidatePath` 함수의 사용법을 익힌다.
- Server Function과 Route Handler에서의 무효화 반영 시점 차이를 이해한다.
- 리터럴 경로와 다이나믹 라우트 패턴(`/blog/[slug]`), 그리고 `type` 매개변수(`'page'` vs `'layout'`)의 역할을 구분한다.
- Rewrites 환경에서 브라우저 URL이 아닌 실제 파일 시스템의 대상(destination) 경로를 전달해야 하는 원칙을 이해한다.
- 태그 기반 무효화([`revalidateTag`](./revalidateTag.md), [`updateTag`](./updateTag.md))와의 기능적 차이를 비교하고 상호 보완적인 유틸리티를 구성한다.

## 핵심 개념 및 설명

`revalidatePath`는 지정된 특정 경로의 [캐시 데이터](../../1-getting-started/caching.md)를 온디맨드로 무효화(invalidate)할 수 있게 해주는 함수다.

```tsx filename="app/actions.ts" switcher
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/blog')
}
```

```jsx filename="app/actions.js" switcher
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/blog')
}
```

### 실행 환경 및 동작 방식 (Usage)

`revalidatePath`는 서버 환경인 **Server Function**과 **Route Handler**에서만 호출할 수 있다. Client Component나 Proxy 파일에서는 실행할 수 없다.

- **Server Function**: 현재 해당 경로를 보고 있는 경우 UI가 즉시 갱신된다.
- **Route Handler**: 경로를 revalidate 대상으로 표시하며, 다음 번 해당 경로 방문 시 실제 revalidation이 수행된다. 따라서 다이나믹 세그먼트에 대해 호출하더라도 대량의 revalidation이 즉시 한 번에 발생하지 않는다.

### 매개변수 (Parameters)

```tsx
revalidatePath(path: string, type?: 'page' | 'layout'): void
```

- `path`: 라우트 파일 구조를 나타내는 문자열이다. `/product/123`과 같은 리터럴 경로이거나 `/product/[slug]`와 같은 다이나믹 라우트 패턴이어야 한다. 대소문자를 구분하며 최대 1024자를 초과할 수 없다. `/page`나 `/layout`을 문자열 뒤에 덧붙이지 말고 `type` 매개변수를 사용해야 한다.
- `type` (선택 사항): revalidate할 경로의 유형을 지정하는 `'page'` 또는 `'layout'` 문자열이다. `path`에 다이나믹 세그먼트(예: `/product/[slug]`)가 포함된 경우 이 매개변수는 **필수**다. 리터럴 경로(예: `/product/1`)인 경우 생략할 수 있다.

### 무효화 대상과 범위 (What can be invalidated)

- **페이지 (`'page'`)**: 지정한 특정 페이지만 무효화한다. 하위 페이지(예: `/blog/[slug]/[author]`)는 영향을 받지 않는다.
- **레이아웃 (`'layout'`)**: 지정한 세그먼트의 레이아웃뿐만 아니라 그 하위의 모든 중첩 레이아웃 및 페이지까지 연쇄적으로 무효화된다.
- **전체 데이터 무효화**: `revalidatePath('/', 'layout')`을 호출하면 최상위 루트 레이아웃부터 하위의 모든 캐시 데이터와 Client Cache가 무효화된다.

### Rewrites 환경에서의 경로 전달 규칙

`next.config.js`의 `rewrites`를 사용하는 경우, 브라우저 주소창에 표시되는 소스 URL이 아니라 실제 렌더링을 담당하는 **대상(destination) 파일 경로**를 전달해야 한다.

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      { source: '/blog', destination: '/news' },
    ]
  },
}
```

```ts
// ⭕ 올바른 예: 실제 파일 경로인 대상(destination) 경로 전달
revalidatePath('/news')

// ❌ 잘못된 예: 소스 URL 전달 시 캐시 항목과 일치하지 않음
revalidatePath('/blog')
```

### `revalidateTag` / `updateTag`와의 관계

- **`revalidatePath`**: 특정 페이지나 레이아웃 경로 단위로 캐시를 무효화한다.
- **`revalidateTag` / `updateTag`**: 특정 태그가 지정된 데이터 단위로 캐시를 무효화하며, 해당 태그를 사용하는 애플리케이션 전체 페이지에 적용된다.

특정 페이지만 즉시 갱신하고 동일 데이터를 공유하는 다른 페이지를 놓치지 않으려면 두 함수를 함께 사용하는 유틸리티 패턴을 구성할 수 있다:

```ts
'use server'

import { revalidatePath, updateTag } from 'next/cache'

export async function updatePost() {
  await updatePostInDatabase()

  revalidatePath('/blog') // 블로그 목록 페이지 즉시 갱신
  updateTag('posts') // 'posts' 태그를 공유하는 대시보드 등 모든 영역 갱신
}
```

### 예제

#### Route Handler에서 웹훅 기반 revalidate

```ts filename="app/api/revalidate/route.ts" switcher
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'revalidation할 경로가 지정되지 않았습니다',
  })
}
```

```js filename="app/api/revalidate/route.js" switcher
import { revalidatePath } from 'next/cache'

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'revalidation할 경로가 지정되지 않았습니다',
  })
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `revalidatePath` 도입 |

## 예제 및 데모 설계

- 블로그 글 수정 Server Action에서 `revalidatePath('/blog/' + slug)`를 호출하여 해당 글 상세 페이지가 즉시 갱신되는 데모를 구성한다.
- `revalidatePath('/blog/[slug]', 'page')`를 실행하여 모든 블로그 상세 페이지가 다음 방문 시 갱신되는지 확인한다.
- `revalidatePath('/', 'layout')` 호출 시 전역 레이아웃 및 하위 페이지 캐시가 모두 만료되는 전체 리셋 시나리오를 검증한다.

## 연습 문제

1. 다이나믹 세그먼트 패턴인 `revalidatePath('/products/[category]', ...)`를 호출할 때 반드시 함께 전달해야 하는 매개변수는?
   - A. `fetchData`
   - B. `type` (`'page'` 또는 `'layout'`)
   - C. `staleTimes`
   - D. `cacheKey`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 경로 문자열에 다이나믹 세그먼트가 포함되어 있을 때는 해당 경로가 단일 페이지인지 레이아웃 전체인지 구분하기 위해 `type` 매개변수(`'page'` 또는 `'layout'`)를 반드시 명시해야 한다.
</details>

2. `revalidatePath('/dashboard', 'layout')`을 호출했을 때 무효화되는 대상 범위로 올바른 것은?
   - A. `/dashboard`의 페이지만 무효화된다.
   - B. `/dashboard`의 레이아웃 및 그 하위의 모든 중첩 레이아웃과 페이지가 함께 무효화된다.
   - C. 전체 웹사이트의 모든 페이지가 무효화된다.
   - D. 클라이언트 로컬 스토리지만 비워진다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `type: 'layout'`을 지정하면 해당 세그먼트의 레이아웃은 물론 그 아래에 속한 모든 하위 레이아웃과 페이지들이 연쇄적으로 무효화된다.
</details>

## 챕터 요약

- `revalidatePath`는 특정 URL 경로 또는 라우트 패턴의 캐시를 온디맨드로 무효화하는 서버 전용 함수다.
- Server Function에서는 즉시 UI가 반영되며, Route Handler에서는 다음 방문 시 revalidate된다.
- `type: 'page'`는 단일 페이지만, `type: 'layout'`은 하위 레이아웃 및 페이지 전체를 무효화한다.
- `rewrites`가 적용된 경우 브라우저 주소가 아닌 실제 파일 시스템의 대상(destination) 경로를 넘겨야 한다.
- `updateTag`와 함께 사용하여 특정 경로와 전역 데이터 일관성을 동시에 유지할 수 있다.
