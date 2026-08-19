# ISR

- 공식 문서: [ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

> **알아두면 좋은 점**: 이 문서는 Cache Components를 사용하지 않는 ISR을 다룬다. `cacheComponents`를 사용한다면 [ISR with Cache Components](./incremental-static-regeneration-cache-components.md)를 참고한다.

## 학습 목표

- Incremental Static Regeneration(ISR)이 정적 페이지를 빌드 전체를 다시 실행하지 않고 갱신하는 과정을 설명한다.
- 시간 기반 `revalidate`와 `revalidatePath`·`revalidateTag` 기반 on-demand revalidation을 구분한다.
- 다이나믹 라우트의 빌드 시 생성 범위와 첫 요청 시 생성 범위를 `generateStaticParams`로 설계한다.
- 운영 환경에서 캐시 상태를 관찰하고 ISR의 런타임·배포 제약을 판단한다.

## 핵심 개념 및 설명

ISR은 대부분의 요청에 prerender된 정적 페이지를 제공하면서 런타임에 콘텐츠를 갱신한다. 전체 사이트를 다시 빌드하지 않아도 되고, 서버 부하와 대규모 콘텐츠 사이트의 `next build` 시간을 줄일 수 있다. Next.js는 페이지에 적절한 `cache-control` 헤더도 추가한다.

```tsx filename="app/blog/[id]/page.tsx"
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post: { id: string }) => ({ id: String(post.id) }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await fetch(`https://api.vercel.app/blog/${id}`).then((res) =>
    res.json()
  )
  return <h1>{post.title}</h1>
}
```

빌드 시 `generateStaticParams`가 반환한 각 게시물 페이지를 prerender한다. 생성된 페이지 요청은 캐시에서 즉시 응답한다. 60초가 지난 뒤 들어온 첫 요청에도 stale 페이지를 먼저 반환하고, 동시에 백그라운드에서 새 버전을 생성한다. 생성에 성공하면 새 버전이 캐시를 대체한다. 목록에 없던 `/blog/26`도 실제 데이터가 있으면 요청 시 생성하며, `dynamicParams`로 이 동작을 바꿀 수 있다. 데이터가 없으면 404를 반환한다.

### Reference

App Router에서 ISR을 구성하는 라우트 세그먼트 설정은 `revalidate`와 `dynamicParams`다. 관련 함수는 [`generateStaticParams`](../3-api-reference/3.3-functions/generate-static-params.md), `revalidatePath`, `revalidateTag`다. Pages Router에서는 `getStaticProps`와 `res.revalidate`를 사용한다.

### Examples

#### 시간 기반 revalidation

```tsx filename="app/blog/page.tsx"
export const revalidate = 3600

export default async function Page() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return <ul>{posts.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
}
```

한 시간이 지난 뒤 첫 방문자는 빠른 응답을 위해 stale 페이지를 받는다. Next.js는 동시에 백그라운드 재생성을 시작하고, 성공한 새 페이지로 캐시를 교체한다. revalidation 시간은 1초보다 1시간처럼 넉넉하게 잡는 것을 권장한다. 더 정밀한 제어에는 on-demand revalidation을, 실시간 데이터에는 다이나믹 렌더링을 고려한다.

#### `revalidatePath`를 사용한 on-demand revalidation

`revalidatePath`는 특정 경로의 캐시 항목을 무효화한다. 다음 요청이 해당 경로를 다시 생성하고 이후 요청을 위해 결과를 캐시한다.

> **참고**: `revalidatePath`는 캐시 항목만 무효화하며 재생성은 다음 요청에서 일어난다. App Router에서 다음 요청을 기다리지 않는 eager regeneration API는 아직 제공되지 않는다. Pages Router에서는 `res.revalidate`를 사용할 수 있다.

```ts filename="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  revalidatePath('/posts')
}
```

#### `revalidateTag`를 사용한 on-demand revalidation

대부분의 경우 전체 경로 revalidation을 우선한다. 더 세밀한 제어가 필요하면 개별 `fetch`에 태그를 붙이거나 ORM·데이터베이스 호출을 `unstable_cache`로 감싼 뒤 태그를 연결한다. Server Action 또는 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)에서 `revalidateTag('posts', 'max')`를 호출하면 해당 태그의 데이터를 stale-while-revalidate 방식으로 갱신한다.

```tsx filename="app/blog/page.tsx"
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // 게시물 목록을 렌더링한다.
}
```

```ts filename="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  revalidateTag('posts', 'max')
}
```

#### `res.revalidate()`를 사용한 on-demand validation

Pages Router에서는 비밀 토큰으로 보호한 API Route에서 `res.revalidate('/posts/1')`를 호출해 특정 실제 경로를 즉시 생성할 수 있다. rewrite된 경로가 아니라 실제 경로를 전달해야 한다. on-demand 방식만 쓴다면 `getStaticProps`의 `revalidate`는 지정하지 않아도 되며 기본값 `false`가 적용된다.

#### 처리되지 않은 예외

데이터 revalidation 중 오류가 발생하면 마지막으로 성공한 데이터가 캐시에 남는다. Next.js는 그 결과를 계속 제공하고 다음 요청에서 revalidation을 다시 시도한다. 실패한 결과로 정상 캐시를 덮어쓰지 않는 복구 모델이다.

#### 캐시 위치 사용자화

캐시된 페이지와 데이터를 영속 저장하거나 여러 컨테이너·인스턴스가 공유해야 한다면 [Self-hosting](./self-hosting.md)의 캐시 설정과 custom cache handler를 사용한다.

### Troubleshooting

#### 로컬 개발에서 캐시 데이터 디버깅

`next.config.js`의 `logging.fetches.fullUrl`을 켜면 어떤 `fetch`가 캐시됐는지 확인할 수 있다.

```js filename="next.config.js"
module.exports = {
  logging: { fetches: { fullUrl: true } },
}
```

#### 올바른 프로덕션 동작 검증

개발 서버가 아니라 `next build` 후 `next start`로 프로덕션 서버를 실행한다. `.env`에 `NEXT_PRIVATE_DEBUG_CACHE=1`을 추가하면 빌드 중 생성된 경로, 캐시 hit/miss, 요청 시 갱신 과정을 서버 콘솔에서 볼 수 있다.

### Caveats

- ISR은 기본값인 Node.js runtime에서만 지원하며 [Static Export](./static-exports.md)에서는 지원하지 않는다.
- 한 prerender 라우트의 여러 `fetch`에 서로 다른 주기가 있으면 ISR에는 가장 짧은 주기가 적용되지만, 각 데이터 캐시의 주기는 따로 지켜진다.
- `revalidate: 0` 또는 명시적인 `no-store` `fetch`가 하나라도 있으면 라우트는 다이나믹 렌더링된다.
- on-demand ISR 요청에는 proxy가 실행되지 않는다. rewrite 이전의 정확한 실제 경로를 revalidate해야 한다.
- 기본 파일 시스템 캐시는 인스턴스별이다. 여러 인스턴스에서는 공유 custom cache handler가 필요하며, on-demand 호출은 호출을 받은 인스턴스만 무효화한다.
- 백그라운드 재생성은 이를 촉발한 요청을 받은 인스턴스에서 실행된다. 요청 단위 과금 플랫폼에서는 추가 연산으로 계산된다.
- `x-nextjs-cache` 응답 헤더는 `HIT`(캐시 응답), `STALE`(stale 응답과 백그라운드 갱신), `MISS`(새 렌더링), `REVALIDATED`(on-demand 재생성)를 나타낸다.

### Platform Support

| 배포 옵션 | 지원 여부 |
| --- | --- |
| [Node.js server](../1-getting-started/deploying.md) | 지원 |
| [Docker container](../1-getting-started/deploying.md) | 지원 |
| [Static export](./static-exports.md) | 미지원 |
| Adapters | 플랫폼별로 다름 |

### Version history

| 버전 | 변경 사항 |
| --- | --- |
| `v14.1.0` | custom `cacheHandler`가 stable이 됐다. |
| `v13.0.0` | App Router가 도입됐다. |
| `v12.2.0` | Pages Router의 On-Demand ISR이 stable이 됐다. |
| `v12.0.0` | Pages Router에 bot-aware ISR fallback이 추가됐다. |
| `v9.5.0` | stable ISR이 도입됐다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: 같은 블로그 글의 `HIT → STALE → REVALIDATED` 상태 전이를 관찰한다.
- 사용자 상호작용: 글을 조회하고, 관리 화면에서 내용을 바꾼 뒤 시간 기반 갱신과 `revalidatePath` 버튼을 각각 실행한다.
- 관찰 결과: stale 응답은 즉시 보이지만 백그라운드 생성이 끝난 다음 요청부터 새 내용이 나타난다. 예외를 발생시키면 마지막 성공 버전이 유지된다.

## 연습 문제

1. `revalidate = 60`인 페이지를 60초가 지난 직후 처음 요청했을 때의 동작은 무엇인가?
   - A. 새 페이지가 생성될 때까지 응답을 보류한다.
   - B. stale 페이지를 먼저 보내고 백그라운드에서 새 페이지를 생성한다.
   - C. 항상 404를 반환한다.

   <details><summary>정답 보기</summary>

   정답: B. ISR은 빠른 응답을 위해 stale 결과를 제공하면서 백그라운드 revalidation을 시작한다.

   </details>

2. 여러 인스턴스에서 on-demand revalidation을 일관되게 적용하려면 무엇이 필요한가?
   - A. 공유 custom cache handler
   - B. `runtime = 'edge'`
   - C. Static Export

   <details><summary>정답 보기</summary>

   정답: A. 기본 파일 시스템 캐시는 인스턴스별이므로 공유 캐시가 필요하다.

   </details>

## 챕터 요약

- ISR은 정적 응답의 속도와 런타임 콘텐츠 갱신을 결합한다.
- 시간 기반 revalidation은 stale 응답 뒤 백그라운드에서 새 버전을 만든다.
- `revalidatePath`는 경로 단위, `revalidateTag`는 데이터 태그 단위로 무효화한다.
- 실패한 revalidation은 마지막 성공 결과를 보존하고 다음 요청에서 재시도한다.
- Node.js runtime, 실제 경로, 다중 인스턴스의 공유 캐시 같은 운영 제약을 함께 설계해야 한다.
