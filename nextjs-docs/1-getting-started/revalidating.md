# Revalidating

- 공식 문서: [Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

> 이 문서는 [`cacheComponents: true`](../3-api-reference/3.5-config/3.5.1-next-config-js/README.md)를 켠 Cache Components에서의 revalidation을 다룬다. 쓰지 않는다면 [Caching and Revalidating (이전 모델)](../2-guides/caching-without-cache-components.md) 가이드를 참고한다.

## 학습 목표

- 시간 기반 revalidation(`cacheLife`)과 온디맨드 revalidation(`revalidateTag`, `updateTag`, `revalidatePath`)의 차이를 설명할 수 있다.
- `cacheTag`로 캐시된 데이터에 태그를 붙이고, 그 태그로 무효화할 수 있다.
- `revalidateTag`와 `updateTag`를 언제 각각 써야 하는지 구분할 수 있다.
- 무엇을 캐시할지 결정하는 기준을 안다.

## 핵심 개념 및 설명

revalidation은 캐시된 데이터를 갱신하는 과정이다. 빠른 캐시 응답을 계속 제공하면서 콘텐츠를 최신으로 유지할 수 있게 해준다. 전략은 두 가지다.

- **시간 기반 revalidation**: [`cacheLife`](#cachelife)로 정해진 기간이 지나면 캐시된 데이터를 자동으로 새로고침한다.
- **온디맨드 revalidation**: mutation 이후 [`revalidateTag`](#revalidatetag), [`updateTag`](#updatetag), [`revalidatePath`](#revalidatepath)로 캐시된 데이터를 수동으로 무효화한다.

### `cacheLife`

[`cacheLife`](../3-api-reference/3.3-functions/cacheLife.md)는 캐시된 데이터가 얼마나 유효한지 제어한다. [`use cache`](../3-api-reference/3.4-directives/use-cache.md) 스코프 안에서 캐시 수명을 지정하는 데 쓴다.

```tsx filename="app/lib/data.ts"
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

`cacheLife`는 프로필 이름이나 커스텀 설정 객체를 받는다.

| 프로필 | stale | revalidate | expire |
| --- | --- | --- | --- |
| default | 5m | 15m | never |
| seconds | 30s | 1s | 60s |
| minutes | 5m | 1m | 1h |
| hours | 5m | 1h | 1d |
| days | 5m | 1d | 1w |
| weeks | 5m | 1w | 30d |
| max | 5m | 30d | 1y |

세밀한 제어가 필요하면 객체를 전달한다.

```tsx
'use cache'
cacheLife({
  stale: 3600, // 1시간 동안 stale로 간주
  revalidate: 7200, // 2시간 후 revalidation
  expire: 86400, // 1일 후 만료
})
```

> **알아두면 좋은 점**: `seconds` 프로필, `revalidate: 0`, 또는 5분 미만의 `expire`를 쓰면 캐시가 "짧은 수명"으로 간주된다. 짧은 수명 캐시는 자동으로 prerender에서 제외되고 다이나믹 홀(dynamic hole)이 된다. 자세한 내용은 [Prerendering behavior](../3-api-reference/3.3-functions/cacheLife.md#prerendering-behavior)를 참고한다.

모든 프로필과 커스텀 설정 옵션은 [`cacheLife` API reference](../3-api-reference/3.3-functions/cacheLife.md)를 참고한다.

### `cacheTag`

[`cacheTag`](../3-api-reference/3.3-functions/cacheTag.md)는 캐시된 데이터에 태그를 붙여 온디맨드로 무효화할 수 있게 해준다. [`use cache`](../3-api-reference/3.4-directives/use-cache.md) 스코프 안에서 쓴다.

```tsx filename="app/lib/data.ts"
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

태그를 붙였으면, [`revalidateTag`](#revalidatetag)나 [`updateTag`](#updatetag)로 캐시를 무효화할 수 있다.

자세한 내용은 [`cacheTag` API reference](../3-api-reference/3.3-functions/cacheTag.md)를 참고한다.

### `revalidateTag`

`revalidateTag`는 stale-while-revalidate 시맨틱으로 태그별 캐시 엔트리를 무효화한다 — stale 콘텐츠를 즉시 제공하면서 백그라운드에서 최신 콘텐츠를 로드한다. 블로그 포스트나 상품 카탈로그처럼, 갱신이 약간 지연되어도 괜찮은 콘텐츠에 적합하다.

```tsx filename="app/lib/actions.ts"
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // 데이터 변경
  revalidateTag('user', 'max') // 권장: stale-while-revalidate
}
```

같은 태그를 여러 함수에서 재사용해서 한 번에 모두 revalidate할 수 있다. `revalidateTag`는 [Server Action](./mutating-data.md)이나 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)에서 호출한다.

> **알아두면 좋은 점**: 두 번째 인자는 최신 콘텐츠가 생성되는 동안 stale 콘텐츠를 얼마나 오래 제공할 수 있는지를 설정한다. 그 시간이 지나면, 이후 요청은 최신 콘텐츠가 준비될 때까지 블록된다. `'max'`를 쓰면 가장 긴 stale 윈도우를 준다.

자세한 내용은 [`revalidateTag` API reference](../3-api-reference/3.3-functions/revalidateTag.md)를 참고한다.

### `updateTag`

`updateTag`는 read-your-own-writes 시나리오를 위해 캐시된 데이터를 즉시 만료시킨다 — 사용자가 stale 콘텐츠 대신 자신의 변경사항을 바로 본다. `revalidateTag`와 달리, [Server Actions](../2-guides/server-actions.md)에서만 쓸 수 있다.

```tsx filename="app/lib/actions.ts"
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

| | `updateTag` | `revalidateTag` |
| --- | --- | --- |
| 어디서 | Server Actions에서만 | Server Actions와 Route Handlers |
| 동작 | 캐시를 즉시 만료 | Stale-while-revalidate |
| 쓰는 상황 | Read-your-own-writes (사용자가 자신의 변경을 바로 봄) | 백그라운드 갱신 (약간의 지연 괜찮음) |

자세한 내용은 [`updateTag` API reference](../3-api-reference/3.3-functions/updateTag.md)를 참고한다.

### `revalidatePath`

`revalidatePath`는 특정 라우트 경로의 모든 캐시된 데이터를 무효화한다. 그 경로에 어떤 태그가 연결되어 있는지 모를 때 라우트를 revalidate하고 싶다면 이걸 쓴다.

```tsx filename="app/lib/actions.ts"
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // 데이터 변경
  revalidatePath('/profile')
}
```

> **알아두면 좋은 점**: 가능하면 경로 기반보다 태그 기반 revalidation(`revalidateTag` / `updateTag`)을 우선하자 — 더 정밀하고 과도한 무효화를 피할 수 있다.

자세한 내용은 [`revalidatePath` API reference](../3-api-reference/3.3-functions/revalidatePath.md)를 참고한다.

### 무엇을 캐시해야 할까

[런타임 데이터](./caching.md#런타임-api-다루기)에 의존하지 않고, 한동안 캐시에서 서빙해도 괜찮은 데이터를 캐시한다. `use cache`와 `cacheLife`로 이 동작을 기술한다.

시간 기반 revalidation이 필요 없는 콘텐츠(예: CMS에서 온 데이터)라면, [`cacheTag`](#cachetag)와 `max` 같은 긴 [`cacheLife`](#cachelife)를 써서 정적 셸에 남겨둔다. 콘텐츠 소스가 콘텐츠가 바뀔 때 웹훅이나 다른 알림으로 [`revalidateTag`](#revalidatetag)를 호출하도록 설정한다. 이렇게 하면 바뀌지 않은 콘텐츠에 대한 불필요한 시간 기반 revalidation을 줄일 수 있다.

> **알아두면 좋은 점**: 서버리스 환경에서는 인메모리 캐시 엔트리가 revalidation 사이에 유지되지 않을 수 있다. 자세한 내용은 [런타임 캐싱 고려사항](../3-api-reference/3.4-directives/use-cache.md#runtime-caching-considerations)을 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: `cacheTag('posts')`로 캐시한 목록을 만들고, 글을 쓰는 Server Action에서 `revalidateTag('posts')`를 호출해 목록이 갱신되는 과정을 보여준다.
- 사용자가 확인할 화면과 상호작용: `updateTag`와 `revalidateTag`를 각각 써봤을 때 작성자 자신의 화면과 다른 사용자 화면이 갱신되는 시점 차이 비교.
- 예제에서 관찰할 결과: `cacheLife('hours')`로 설정한 데이터가 revalidate 시간이 지나기 전까지는 stale 상태로도 계속 제공되는 것.

## 연습 문제

**Q1. (단일 선택) `revalidateTag`와 `updateTag`의 가장 핵심적인 차이는?**

1. `revalidateTag`는 Route Handler에서만 쓸 수 있다.
2. `updateTag`는 캐시를 즉시 만료시키고, `revalidateTag`는 stale-while-revalidate로 동작한다.
3. `updateTag`는 시간 기반 revalidation에만 쓰인다.
4. 두 함수는 동작이 완전히 동일하다.

<details>
<summary>정답 보기</summary>

**정답: 2** — `updateTag`는 read-your-own-writes를 위해 즉시 만료시키고 Server Actions에서만 쓸 수 있다. `revalidateTag`는 stale 콘텐츠를 유지하며 백그라운드에서 갱신하고 Route Handler에서도 쓸 수 있다.

</details>

**Q2. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] `cacheLife`는 `use cache` 스코프 밖에서도 독립적으로 동작한다.
- [ ] `cacheTag`로 태그를 붙인 데이터는 `revalidateTag`나 `updateTag`로 무효화할 수 있다.
- [ ] 어떤 태그가 연결됐는지 모를 때는 `revalidatePath`로 경로 전체를 revalidate할 수 있다.
- [ ] `seconds` 프로필을 쓴 캐시는 자동으로 prerender에서 제외되고 다이나믹 홀이 된다.

<details>
<summary>정답 보기</summary>

**정답: 2, 3, 4** — `cacheLife`는 `use cache` 스코프 안에서 캐시 수명을 지정하는 용도라 그 밖에서는 의미가 없다.

</details>

**Q3. (단일 선택) 콘텐츠 소스가 웹훅으로 변경을 알려줄 수 있는 CMS 데이터에 가장 적합한 조합은?**

1. `cacheLife('seconds')`만 사용
2. `cacheTag` + 긴 `cacheLife`(`max`) + 웹훅에서 `revalidateTag` 호출
3. 캐시를 전혀 쓰지 않고 매 요청마다 fetch
4. `updateTag`를 Route Handler에서 주기적으로 호출

<details>
<summary>정답 보기</summary>

**정답: 2** — 콘텐츠가 바뀔 때만 웹훅으로 `revalidateTag`를 호출하면, 바뀌지 않은 기간 동안은 불필요한 시간 기반 revalidation 없이 긴 캐시 수명을 유지할 수 있다.

</details>

## 요약

- revalidation은 시간 기반(`cacheLife`)과 온디맨드(`revalidateTag`/`updateTag`/`revalidatePath`) 두 전략으로 나뉜다.
- `cacheTag`로 캐시된 데이터에 태그를 붙이면, 그 태그 단위로 revalidate하거나 즉시 만료시킬 수 있다.
- `revalidateTag`는 stale-while-revalidate, `updateTag`는 즉시 만료 — 후자는 Server Actions에서만 쓸 수 있다.
- 태그를 모를 때는 `revalidatePath`로 경로 전체를 revalidate할 수 있지만, 가능하면 태그 기반이 더 정밀하다.
- CMS처럼 변경 시점을 웹훅으로 알 수 있는 데이터는 긴 `cacheLife`와 `cacheTag` + 웹훅 기반 `revalidateTag` 조합이 효율적이다.
