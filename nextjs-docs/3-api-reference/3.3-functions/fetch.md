# fetch

- 공식 문서: [fetch](https://nextjs.org/docs/app/api-reference/functions/fetch)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web 표준 `fetch`를 확장한 Next.js 서버 측 데이터 패칭 및 캐싱 메커니즘을 이해한다.
- `cache: 'force-cache'` 및 `cache: 'no-store'` 옵션의 동작 차이를 파악한다.
- `next.revalidate`를 통한 시간 기반 ISR과 `next.tags`를 통한 온디맨드 태그 무효화 전략을 구현한다.
- 단일 렌더 패스 내의 자동 요청 메모이제이션(Memoization) 원리와 옵트아웃 방식을 습득한다.

## 핵심 개념 및 설명

Next.js는 표준 [Web Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)를 확장하여, 서버 환경에서 각 요청별로 고유한 지속성 캐시(Data Cache) 및 재검증 수명을 제어할 수 있도록 지원한다.

Server Component 내부에서 `async/await`를 사용하여 직접 호출할 수 있다.

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()

  return (
    <ul>
      {posts.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 확장 옵션 (Options)

#### 1. `options.cache`

- **`auto no cache` (기본값)**: 개발 환경에서는 매 요청마다 외부 서버에서 가져오지만, 빌드 시점 정적 prerender 대상인 라우트에서는 1회 패치되어 고정된다. 요청 시점 API가 감지되면 매 요청마다 새로 가져온다.
- **`no-store`**: 요청 시점 API 유무와 관계없이 매 요청마다 원격 서버에서 데이터를 새로 가져온다.
- **`force-cache`**: 서버 측 데이터 캐시에서 일치하는 요청(URL, 메서드, 헤더, 바디 조합)을 찾는다. 유효한 캐시가 있으면 즉시 반환하고, 없으면 원격 서버에서 가져와 200 응답만 캐시에 저장한다.

#### 2. `options.next.revalidate`

캐시의 유효 시간(초 단위)을 설정한다:

- `false` (또는 생략): 무기한 캐시한다 (`revalidate: Infinity`와 동일).
- `0`: 캐시를 생성하지 않는다 (`cache: 'no-store'`와 유사).
- `number` (초): 지정한 초가 지난 후 다음 요청에서 Stale-While-Revalidate 방식으로 백그라운드 갱신한다.

```tsx
fetch('https://api.example.com/products', {
  next: { revalidate: 3600 }, // 1시간마다 재검증
})
```

#### 3. `options.next.tags`

캐시 항목에 식별 태그를 지정한다. 추후 [`revalidateTag`](./revalidateTag.md) 또는 [`updateTag`](./updateTag.md)로 온디맨드 무효화할 수 있다:

```tsx
fetch('https://api.example.com/posts', {
  next: { tags: ['posts', 'collection'] },
})
```

- 최대 128개의 태그를 지정할 수 있으며, 각 태그 길이는 최대 256자다.

### 자동 요청 메모이제이션 (Memoization)

동일한 렌더 패스(단일 HTTP 요청 렌더 트리) 내에서 동일한 URL과 옵션을 가진 `GET` `fetch` 요청은 자동으로 **메모이제이션**된다.

레이아웃, 페이지, 하위 컴포넌트, `generateMetadata` 등에서 동일한 API를 여러 번 호출하더라도 실제 네트워크 요청은 단 1회만 발생하고 결과를 공유한다.

- 메모이제이션 옵트아웃이 필요한 경우 `AbortController`의 `signal`을 전달한다:
  ```js
  const { signal } = new AbortController()
  fetch(url, { signal })
  ```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | Next.js 확장 `fetch` 도입 |

## 예제 및 데모 설계

- 동일한 `fetch('https://api.example.com/user')`를 `layout.tsx`와 `page.tsx`에서 각각 호출했을 때 서버 로그상 1회의 네트워크 요청만 기록되는 메모이제이션을 검증한다.
- `next: { revalidate: 10 }` 적용 후 10초 경과 시점의 SWR 백그라운드 갱신 과정을 테스트한다.
- Server Action에서 `updateTag('posts')`를 호출했을 때 `next: { tags: ['posts'] }`가 부여된 `fetch` 캐시가 즉시 만료되는지 확인한다.

## 연습 문제

1. 동일한 렌더 트리 내 여러 컴포넌트에서 같은 URL의 `fetch`를 호출할 때 Next.js의 기본 처리 방식으로 올바른 것은?
   - A. 컴포넌트 개수만큼 실제 외부 네트워크 요청을 중복 발생시킨다.
   - B. 동일 렌더 패스 동안 결과를 자동으로 메모이제이션하여 1회만 요청하고 공유한다.
   - C. 중복 호출 시 컴파일 에러를 발생시킨다.
   - D. 클라이언트의 localStorage에 응답을 저장한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js는 React Server Component 렌더 패스 동안 동일한 `GET` fetch 요청을 자동으로 메모이제이션하여 중복 네트워크 트래픽을 방지한다.
</details>

2. `fetch` 요청의 캐시를 1시간(3600초) 주기로 백그라운드 재검증하도록 설정하는 올바른 옵션은?
   - A. `{ cache: 'hourly' }`
   - B. `{ next: { revalidate: 3600 } }`
   - C. `{ staleTime: 3600 }`
   - D. `{ headers: { 'Cache-Control': 'max-age=3600' } }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 확장 옵션인 `next: { revalidate: 3600 }`을 통해 초 단위 재검증 주기를 지정할 수 있다.
</details>

## 챕터 요약

- Next.js는 표준 Web `fetch`를 확장하여 서버 측 데이터 캐싱과 revalidate를 지원한다.
- `cache: 'force-cache'`는 지속 캐싱, `no-store`는 매 요청 최신 조회를 수행한다.
- `next.revalidate`로 시간 기반 갱신, `next.tags`로 온디맨드 태그 무효화를 설정한다.
- 동일 렌더 트리 내 중복 `fetch` 호출은 자동으로 메모이제이션되어 단 1회만 실행된다.
- `AbortController.signal`을 넘겨 메모이제이션을 건너뛸 수 있다.
