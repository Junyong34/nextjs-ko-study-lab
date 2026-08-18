# cacheLife

- 공식 문서: [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [`use cache`](../3.4-directives/use-cache.md) 지시어 스코프 내에서 캐시 유효 시간을 정의하는 `cacheLife` 함수의 사용법을 익힌다.
- 캐시 프로필을 구성하는 세 가지 핵심 시간 요소인 `stale`, `revalidate`, `expire`의 역할과 차이점을 이해한다.
- Next.js가 제공하는 7대 프리셋 프로필(`seconds`, `minutes`, `hours`, `days`, `weeks`, `max`, `default`)을 상황에 맞게 선택한다.
- `next.config.ts`에서 커스텀 캐시 프로필을 선언하거나 인라인 객체로 캐시 수명을 동적으로 지정하는 방법을 습득한다.
- 중첩된 캐시 스코프 간의 수명 우선순위와 단기 캐시(short-lived cache) 전파 에러 방지 규칙을 적용한다.

## 핵심 개념 및 설명

`cacheLife`는 함수 또는 컴포넌트의 **캐시 수명 주기(cache lifetime)**를 설정하는 Next.js 캐싱 함수다. 반드시 [`use cache`](../3.4-directives/use-cache.md) 지시어가 선언된 스코프 내부에서 호출되어야 한다.

```tsx filename="app/blog/page.tsx" highlight={1,5}
'use cache'
import { cacheLife } from 'next/cache'

export default async function BlogPage() {
  cacheLife('days') // 매일 업데이트되는 블로그 콘텐츠 프로필 적용

  const posts = await getBlogPosts()
  return <div>{/* 포스트 렌더링 */}</div>
}
```

> **알아두면 좋은 점**:
>
> - `cacheLife`는 모듈 최상단(파일 레벨)에서는 호출할 수 없으며, 반드시 캐시된 비동기 함수나 컴포넌트 본문 내부에서 호출해야 한다.
> - 모든 `use cache` 스코프마다 명시적으로 `cacheLife`를 호출하는 것을 강력히 권장한다. 생략 시 암묵적으로 `default` 프로필이 적용되어 중첩 캐시의 동작을 예측하기 어려워진다.
> - 함수 실행 1회당 오직 하나의 `cacheLife` 호출만 실행되어야 한다. 조건문 분기에 따라 서로 다른 프로필을 호출할 수는 있다.

### 캐시 프로필의 3대 속성

캐시 프로필은 다음 3가지 시간 속성을 통해 동작을 제어한다:

1. **`stale` (클라이언트 측)**:
   - 클라이언트 브라우저가 서버에 확인 요청을 보내지 않고 캐시된 데이터를 즉시 표시할 수 있는 시간이다.
   - 링크별 prefetch가 원활히 동작할 수 있도록 **최소 30초가 강제**된다.
   - 라우트의 [App Shell](../../4-glossary/README.md)에 포함되려면 `stale` 시간이 최소 5분 이상이어야 한다.
2. **`revalidate` (서버 측)**:
   - 이 기간이 지난 후 들어오는 첫 요청에 대해 서버는 기존 캐시를 즉시 반환(Stale-While-Revalidate)하고 백그라운드에서 콘텐츠를 다시 생성하여 캐시를 갱신한다.
3. **`expire` (완전 만료)**:
   - 이 시간이 지난 후 들어오는 요청에 대해서는 백그라운드 갱신이 아닌, 서버가 동기적으로 새 콘텐츠를 생성할 때까지 대기한 후 응답한다.
   - `expire`는 항상 `revalidate`보다 길어야 한다.

### 내장 프리셋 캐시 프로필 (Preset Profiles)

| 프로필 | 주요 사용처 | `stale` (클라이언트) | `revalidate` (백그라운드) | `expire` (만료) |
|---|---|---|---|---|
| `default` | 일반 표준 콘텐츠 | 5분 | 15분 | 만료 없음 (never) |
| `seconds` | 실시간 데이터 (주가, 경기 점수) | 30초 | 1초 | 1분 |
| `minutes` | 자주 변경되는 콘텐츠 (피드, 뉴스) | 5분 | 1분 | 1시간 |
| `hours` | 하루 수 회 갱신 (재고, 날씨) | 5분 | 1시간 | 1일 |
| `days` | 일 단위 갱신 (블로그, 아티클) | 5분 | 1일 | 1주일 |
| `weeks` | 주 단위 갱신 (팟캐스트, 뉴스레터) | 5분 | 1주일 | 30일 |
| `max` | 거의 변경되지 않는 정적 문서 | 5분 | 30일 | 1년 |

### 커스텀 프로필 정의 (`next.config.ts`)

`next.config.ts` 파일의 `cacheLife` 옵션을 통해 기존 프로필을 재정의하거나 프로젝트 전용 커스텀 프로필을 생성할 수 있다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    // 커스텀 프로필 정의
    biweekly: {
      stale: 60 * 60 * 24 * 14, // 14일
      revalidate: 60 * 60 * 24, // 1일
      expire: 60 * 60 * 24 * 14, // 14일
    },
    // 기본 default 프로필 재정의
    default: {
      stale: 300, // 5분
      revalidate: 3600, // 1시간
      expire: 86400, // 1일
    },
  },
}

export default nextConfig
```

```tsx filename="app/page.tsx"
'use cache'
import { cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife('biweekly') // 정의한 커스텀 프로필 사용
  return <div>2주 주기 캐시 페이지</div>
}
```

### 인라인 프로필 객체 전달

일회성 캐싱 규칙이 필요한 경우 객체를 직접 전달할 수 있다:

```tsx filename="lib/data.ts"
import { cacheLife } from 'next/cache'

export async function getLimitedOffer() {
  'use cache'

  cacheLife({
    stale: 60, // 1분
    revalidate: 300, // 5분
    expire: 3600, // 1시간
  })

  return await fetchLimitedOffer()
}
```

### 중첩 캐시 수명 규칙 (Nested Caching Behavior)

- **외부 캐시에 명시적 `cacheLife`가 있는 경우**: 외부 캐시의 수명이 내부 캐시의 수명보다 항상 우선한다.
- **외부 캐시에 `cacheLife`가 없는 경우**: 외부 캐시는 기본값(15분)을 따르지만, 내부 캐시 중 더 짧은 수명이 있다면 그 수명으로 축소된다.
- **중첩 단기 캐시 에러 방지**: `seconds`와 같은 단기 캐시(만료 5분 미만)가 `cacheLife`가 없는 상위 캐시 안에 중첩되면 빌드 시점에 에러가 발생한다. 이를 방지하려면 상위 캐시에도 명시적인 `cacheLife()`를 선언해야 한다.

### 조건부 및 데이터 기반 동적 캐시 수명

```tsx filename="lib/posts.ts"
import { cacheLife, cacheTag } from 'next/cache'

export async function getPostContent(slug: string) {
  'use cache'

  const post = await fetchPost(slug)
  cacheTag(`post-${slug}`)

  if (!post) {
    // 미발행 또는 임시 글인 경우 짧게 캐시
    cacheLife('minutes')
    return null
  }

  // 발행 완료된 글은 CMS 응답값에 맞춰 동적 지정
  cacheLife({
    revalidate: post.revalidateSeconds ?? 86400,
  })

  return post.data
}
```

## 예제 및 데모 설계

- 실시간 환율 위젯(`cacheLife('seconds')`)과 정적 상품 소개(`cacheLife('days')`)가 한 페이지에 공존할 때 `<Suspense>` 경계를 통한 점진적 렌더링 동작을 확인한다.
- `next.config.ts`에 `editorial` 커스텀 프로필을 등록하고 컴포넌트에서 호출했을 때의 타입 힌트와 재검증 주기를 테스트한다.
- Server Action에서 `revalidateTag` 호출 시 `stale` 시간과 관계없이 클라이언트 캐시가 즉시 무효화되는지 검증한다.

## 연습 문제

1. `cacheLife`의 `stale` 속성에 대한 설명으로 올바른 것은?
   - A. 서버 데이터베이스가 완전히 만료되는 시간이다.
   - B. 클라이언트 브라우저가 서버 요청 없이 캐시된 데이터를 즉시 표시할 수 있는 유효 시간이다.
   - C. 빌드 타임아웃을 설정하는 시간이다.
   - D. 모듈 최상단에서만 설정할 수 있다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `stale`은 클라이언트 라우터가 캐시된 데이터를 네트워크 요청 없이 즉각 화면에 표시할 수 있는 기간을 의미한다.
</details>

2. 다음 중 Next.js 내장 프리셋 프로필과 `revalidate` 주기의 연결이 올바른 것은?
   - A. `seconds` - 1일
   - B. `hours` - 1시간
   - C. `days` - 1주일
   - D. `max` - 1초

<details><summary>정답 보기</summary>

정답: **B**  
해설: `hours` 프로필은 `revalidate` 주기가 1시간으로 설정되어 있어 하루에 여러 번 업데이트되는 콘텐츠에 적합하다.
</details>

## 챕터 요약

- `cacheLife`는 `use cache` 스코프 내부에서 캐시 수명을 선언하는 함수다.
- `stale`(클라이언트 캐시), `revalidate`(서버 백그라운드 갱신), `expire`(동기 만료) 3대 속성으로 구성된다.
- 7가지 내장 프리셋 프로필을 제공하며, `next.config.ts`에서 재정의하거나 커스텀 프로필을 등록할 수 있다.
- 외부 캐시에 명시적 `cacheLife`를 부여하여 중첩 캐시 간의 수명 우선순위를 명확히 유지하는 것이 권장된다.
- 조건문 분기나 런타임 데이터에 기반하여 인라인 객체로 유연하게 수명을 지정할 수 있다.
