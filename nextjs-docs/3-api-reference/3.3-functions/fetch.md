# fetch

- 공식 문서: [fetch](https://nextjs.org/docs/app/api-reference/functions/fetch)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js가 웹 표준 `fetch` API를 확장하여 제공하는 캐싱, revalidation, 태그 기반 무효화 메커니즘을 이해한다.
- `next.revalidate`, `next.tags`, `cache: 'no-store' | 'force-cache'` 옵션의 조합과 동작 차이를 명확히 구분한다.
- 동일한 렌더 트리 내에서 동일 URL로 요청 시 자동으로 중복 호출을 제거하는 Request Memoization 원리를 파악한다.
- Next.js 15+ 및 Cache Components(`use cache`) 환경에서의 `fetch` 기본 동작 변화와 마이그레이션 방법을 안다.

## 핵심 개념 및 설명

Next.js는 표준 [Web Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)를 확장하여 서버에서 실행되는 각 `fetch` 요청에 고유한 캐싱 및 revalidation 정책을 지정할 수 있도록 지원한다.

```tsx filename="app/page.tsx"
export default async function Page() {
  // 3600초(1시간)마다 백그라운드에서 revalidate되며, 'collection' 태그가 부여된 요청
  const res = await fetch('https://api.example.com/items', {
    next: {
      revalidate: 3600,
      tags: ['collection'],
    },
  })
  const data = await res.json()

  return <main>{/* 데이터 렌더링 */}</main>
}
```

> **알아두면 좋은 점**:
>
> - **캐싱 기본 정책**: Next.js 15+에서는 기본적으로 캐싱되지 않으며 opt-in 방식이다. `cache: 'force-cache'`를 명시하면 `POST` 요청이나 인증 헤더가 포함된 요청도 캐시할 수 있다.
> - **revalidate 주기 축소**: 개별 `fetch()` 요청에 설정된 `revalidate` 수치가 라우트 세그먼트의 기본 `revalidate`보다 작으면, 해당 라우트 전체의 revalidation 주기가 그 작은 값으로 단축된다.
> - **Route Handler 메모이제이션 제외**: Route Handler(`route.ts`)는 React 컴포넌트 트리의 일부가 아니므로 React의 Request Memoization이 적용되지 않는다.

---

### `fetch` 확장 옵션 레퍼런스

#### 1. `options.next.revalidate`

데이터의 캐시 수명(초 단위)을 설정한다.

| 설정 값 | 동작 설명 |
|---|---|
| **`false`** | 리소스를 무기한 캐시한다. HTTP 캐시 헤더를 준수하며 시간 기반 만료가 일어나지 않는다. |
| **`0`** | 캐시를 건너뛰고 매 요청마다 네트워크를 통해 새로 가져온다. (`cache: 'no-store'`와 동일) |
| **`number`** (양의 정수) | 지정된 초 동안 리소스를 캐시하며, 만료 후 첫 요청 시 stale 데이터를 반환하면서 백그라운드에서 revalidate한다 (SWR). |

```tsx
// 60초 주기로 revalidate
fetch('https://api.example.com/data', { next: { revalidate: 60 } })
```

#### 2. `options.next.tags`

온디맨드 캐시 무효화를 위한 캐시 태그(문자열 배열)를 등록한다.

```tsx
fetch('https://api.example.com/posts/1', {
  next: { tags: ['posts', 'post-1'] },
})
```

- 이후 Server Action이나 Route Handler에서 [`revalidateTag('posts')`](./revalidateTag.md)를 호출하면 해당 태그를 가진 모든 `fetch` 캐시가 즉시 무효화된다.
- 태그 이름은 최대 256자이며 대소문자를 구분한다.

#### 3. `options.cache` (표준 Web Cache 옵션)

| 설정 값 | 동작 설명 |
|---|---|
| **`'no-store'`** | 매 요청마다 서버에서 새로 가져오며, 캐시에 저장하지 않는다. |
| **`'force-cache'`** | 캐시된 일치 항목이 있으면 해당 데이터를 반환하고, 없으면 네트워크에서 가져와 캐시에 저장한다. |

---

### Request Memoization (요청 메모이제이션)

React Server Component 렌더링 주기 동안, **동일한 URL과 옵션을 가진 `fetch` 요청은 단 1회만 네트워크를 호출**하고 그 결과를 컴포넌트 트리 전체에서 공유한다.

```tsx
// Header.tsx
const user = await fetch('https://api.example.com/user')

// Sidebar.tsx
// Header에서 이미 가져왔으므로 네트워크 요청 없이 메모이제이션된 결과를 즉시 반환
const user = await fetch('https://api.example.com/user')
```

- **범위**: 오직 `GET` 요청에만 적용되며, 단일 서버 렌더링 패스 동안만 유지되고 렌더링이 완료되면 메모리가 해제된다.
- **`cache: 'no-store'`를 사용하더라도 동일 렌더링 패스 내에서는 메모이제이션이 유지**된다.

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `fetch` 요청의 기본 캐시 정책이 `force-cache`에서 `no-store`로 변경 |
| `v13.0.0` | `next.revalidate`, `next.tags` 확장 옵션이 포함된 `fetch` 도입 |

## 예제 및 데모 설계

- 동일 페이지 내 복수의 Server Component에서 동일한 API URL로 `fetch`를 호출하여 네트워크 탭과 백엔드 로그에서 단 1회만 요청이 도달하는 Request Memoization을 검증한다.
- `next.tags: ['product-list']`를 부여하고, 버튼 클릭으로 Server Action에서 `revalidateTag('product-list')`를 호출했을 때 최신 데이터로 갱신되는 온디맨드 흐름을 구현한다.
- `next.revalidate: 10`을 부여한 뒤 10초 경과 후 요청 시 Stale-While-Revalidate 동작을 확인한다.

## 연습 문제

1. `fetch` 요청에서 1시간(3600초) 주기로 백그라운드 revalidate를 수행하도록 지정하는 올바른 옵션은?
   - A. `cache: { revalidate: 3600 }`
   - B. `next: { revalidate: 3600 }`
   - C. `next: { ttl: 3600 }`
   - D. `headers: { 'Cache-Control': 'max-age=3600' }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 확장 옵션인 `next: { revalidate: 3600 }`을 통해 초 단위 revalidation 주기를 지정한다.
</details>

2. 단일 렌더링 패스 내에서 서로 다른 세 컴포넌트가 동일한 `fetch('https://api.example.com/user')`를 호출했을 때의 동작으로 올바른 것은?
   - A. 네트워크 요청이 3회 발생한다.
   - B. 첫 번째 요청만 네트워크로 전송되고 나머지 2회는 자동 메모이제이션된 결과를 공유한다.
   - C. 병렬 요청 오류가 발생한다.
   - D. 마지막 요청만 처리된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: React의 Request Memoization 기능에 의해 동일 렌더 패스 내의 동일 `GET fetch` 요청은 1회만 실행되고 결과가 공유된다.
</details>

## 챕터 요약

- Next.js는 웹 표준 `fetch`에 `next: { revalidate, tags }` 확장 옵션을 제공한다.
- `next.revalidate`로 시간 기반(SWR), `next.tags`로 온디맨드 태그 기반 캐시 무효화를 제어한다.
- React Request Memoization을 통해 렌더 트리 내 중복 `fetch` 호출이 자동 제거된다.
- Next.js 15부터 기본 `fetch` 동작은 캐시되지 않음(`no-store`)으로 변경되었다.
