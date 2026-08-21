# Fetching Data

- 공식 문서: [Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Server Component에서 `fetch` API와 ORM/DB 클라이언트로 데이터를 가져오는 방법을 구분할 수 있다.
- `loading.js`와 `<Suspense>`로 스트리밍을 적용하는 두 가지 방법의 차이를 설명할 수 있다.
- Client Component에서 `use` API와 SWR/React Query 같은 커뮤니티 라이브러리로 데이터를 가져오는 방법을 안다.
- 순차 fetching과 병렬 fetching의 차이를 이해하고, `Promise.all`로 병렬화할 수 있다.
- `React.cache`로 같은 요청 안에서 데이터 fetch를 재사용하는 방법을 안다.

## 핵심 개념 및 설명

### Server Components에서 데이터 가져오기

Server Component에서는 어떤 비동기 I/O로도 데이터를 가져올 수 있다.

1. [`fetch` API](#fetch-api로-가져오기)
2. [ORM이나 데이터베이스](#orm이나-데이터베이스로-가져오기)

#### `fetch` API로 가져오기

`fetch` API로 데이터를 가져오려면, 컴포넌트를 비동기 함수로 만들고 `fetch` 호출을 await한다.

```tsx filename="app/blog/page.tsx"
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

> **알아두면 좋은 점**
>
> - React 컴포넌트 트리 안에서 동일한 `fetch` 요청은 기본적으로 [메모이제이션](../4-glossary/README.md)된다. 그래서 데이터가 필요한 컴포넌트에서 바로 fetch하면 되고, props를 여러 단계로 내려줄 필요가 없다.
> - `fetch` 요청은 기본적으로 캐시되지 않으며, 요청이 끝날 때까지 페이지 렌더링을 막는다. 결과를 캐시하려면 [`use cache`](../3-api-reference/3.4-directives/use-cache.md) 지시어를 쓰고, 요청 시점에 최신 데이터를 스트리밍하려면 fetch하는 컴포넌트를 [`<Suspense>`](./caching.md)로 감싼다. 자세한 내용은 [caching](./caching.md)을 참고한다.
> - 개발 중에는 `fetch` 호출을 로그로 남겨 가시성을 높일 수 있다. [`logging` API reference](../3-api-reference/3.5-config/3.5.1-next-config-js/logging.md)를 참고한다.

#### ORM이나 데이터베이스로 가져오기

Server Component는 서버에서 렌더링되므로, 자격 증명이나 쿼리 로직이 클라이언트 번들에 포함되지 않는다. 즉 ORM이나 DB 클라이언트로 안전하게 데이터베이스 쿼리를 실행할 수 있다.

```tsx filename="app/blog/page.tsx"
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

요청이 제대로 인증·인가되는지는 여전히 신경써야 한다. 서버 사이드 데이터 접근을 안전하게 만드는 모범 사례는 [data security 가이드](../2-guides/data-security.md)를 참고한다.

### 스트리밍

Server Component에서 데이터를 가져올 때, 데이터는 매 요청마다 서버에서 fetch되고 렌더링된다. 느린 데이터 요청이 하나라도 있으면, 그 데이터가 전부 준비될 때까지 라우트 전체 렌더링이 막힌다.

초기 로드 시간과 사용자 경험을 개선하려면, 페이지를 더 작은 _청크_로 나누고 그 청크들을 서버에서 클라이언트로 점진적으로 보낼 수 있다. 이를 스트리밍이라고 부른다. 스트리밍이 동작하는 방식(HTTP 계약, 인프라 고려사항, 성능 트레이드오프)은 [Streaming 가이드](../2-guides/streaming.md)를 참고한다.

![스트리밍이 적용됐을 때 서버 렌더링이 동작하는 방식](./assets/fetching-data-01.webp)

애플리케이션에서 스트리밍을 쓰는 방법은 두 가지다.

1. [`loading.js` 파일](#loadingjs로-스트리밍하기)로 페이지 감싸기
2. [`<Suspense>`](#suspense로-스트리밍하기)로 컴포넌트 감싸기

> **알아두면 좋은 점**: 봇과 크롤러는 브라우저와 다르게 처리된다. Next.js는 데이터 fetching이 끝날 때까지 기다린 뒤, 점진적으로 스트리밍하는 대신 완전히 렌더링된 페이지를 보낸다. [Bots and crawlers](../2-guides/streaming.md)를 참고한다.

#### `loading.js`로 스트리밍하기

페이지와 같은 폴더에 `loading.js` 파일을 만들면 데이터가 fetch되는 동안 **페이지 전체**를 스트리밍할 수 있다. 예를 들어 `app/blog/page.js`를 스트리밍하려면 `app/blog` 폴더 안에 파일을 추가한다.

![app/blog 폴더 안에 loading.tsx 파일이 추가된 구조](./assets/fetching-data-02.webp)

```tsx filename="app/blog/loading.tsx"
export default function Loading() {
  // 여기에 로딩 UI를 정의한다.
  return <div>Loading...</div>
}
```

내비게이션이 일어나면 사용자는 페이지가 렌더링되는 동안 레이아웃과 [로딩 상태](#의미-있는-로딩-상태-만들기)를 즉시 보게 된다. 렌더링이 끝나면 새 콘텐츠가 자동으로 교체된다.

![로딩 UI가 보여지는 화면 예시](./assets/fetching-data-03.webp)

내부적으로 `loading.js`는 [`layout.js` 안에 중첩](./project-structure.md)되어, `page.js` 파일과 그 아래 모든 자식을 자동으로 `<Suspense>` 바운더리로 감싼다.

![loading.js가 layout.js와 page.js 사이에서 Suspense 바운더리를 형성하는 구조](./assets/fetching-data-04.webp)

이 때문에, 캐시되지 않은 런타임 데이터(예: `cookies()`, `headers()`, 캐시되지 않은 fetch)에 접근하는 레이아웃은 같은 라우트 세그먼트의 `loading.js`로 폴백하지 않는다. 대신 레이아웃 렌더링이 끝날 때까지 내비게이션을 막는다. [Cache Components](./caching.md)는 빌드 타임 에러로 안내해서 이를 방지한다.

이를 해결하려면 캐시되지 않은 접근을 자체 [`<Suspense>`](#suspense로-스트리밍하기) 바운더리로 감싸거나, 데이터 fetching을 `loading.js`가 커버할 수 있는 `page.js`로 옮긴다. 더 자세한 내용은 [`loading.js`](../3-api-reference/3.1-file-conventions/loading.md)를 참고한다.

이런 이유로, `loading.js`는 라우트 세그먼트를 스트리밍하는 데는 잘 맞지만, 런타임이나 캐시되지 않은 데이터 접근에 더 가깝게는 `<Suspense>`를 쓰는 게 권장된다.

#### `<Suspense>`로 스트리밍하기

`<Suspense>`는 페이지의 어느 부분을 스트리밍할지 더 세밀하게 제어할 수 있게 해준다. 예를 들어 `<Suspense>` 바운더리 밖의 페이지 콘텐츠는 즉시 보여주고, 바운더리 안의 블로그 포스트 목록만 스트리밍할 수 있다.

```tsx filename="app/blog/page.tsx"
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* 이 콘텐츠는 클라이언트로 즉시 전송된다 */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* 바운더리 안의 다이나믹 콘텐츠는 스트리밍된다 */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

#### 의미 있는 로딩 상태 만들기

즉각적인 로딩 상태는 내비게이션 직후 사용자에게 즉시 보여지는 대체 UI다. 가장 좋은 사용자 경험을 위해서는, 앱이 응답하고 있다는 것을 사용자가 이해하도록 의미 있는 로딩 상태를 설계하는 게 좋다. 예를 들어 스켈레톤이나 스피너를 쓸 수도 있고, 표지 사진·제목처럼 앞으로 나올 화면의 작지만 의미 있는 일부를 보여줄 수도 있다.

개발 중에는 [React Devtools](https://react.dev/learn/react-developer-tools)로 컴포넌트의 로딩 상태를 미리 보고 점검할 수 있다.

### Client Components

Client Component에서 데이터를 가져오는 방법은 두 가지다.

1. React의 [`use` API](https://react.dev/reference/react/use)
2. [SWR](https://swr.vercel.app/)이나 [React Query](https://tanstack.com/query/latest) 같은 커뮤니티 라이브러리

#### `use` API로 데이터 스트리밍하기

React의 [`use` API](https://react.dev/reference/react/use)로 서버에서 클라이언트로 데이터를 [스트리밍](#스트리밍)할 수 있다. Server Component에서 데이터를 fetch하는 것부터 시작해, 그 Promise를 Client Component에 prop으로 전달한다.

```tsx filename="app/blog/page.tsx"
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // 데이터 fetching 함수를 await하지 않는다
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

그다음 Client Component에서 `use` API로 그 Promise를 읽는다.

```tsx filename="app/ui/posts.tsx"
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

위 예시에서 `<Posts>` 컴포넌트는 [`<Suspense>` 바운더리](https://react.dev/reference/react/Suspense)로 감싸져 있다. 즉 Promise가 처리되는 동안 fallback이 보여진다.

Promise는 서버에서 `await`로 resolve할 수도 있고, Client Component에서 `use()`로 resolve할 수도 있다. React는 [서버 또는 클라이언트 중 어디서 Promise를 resolve할지](https://react.dev/reference/react/use#resolve-promise-in-server-or-client-component)에 대한 기준을 안내한다. 하나의 Promise를 여러 Client Component와 공유하려면 props가 아니라 context로 제공한다. [Context Provider 안에서 React의 `use` 쓰기](../2-guides/single-page-applications.md)를 참고한다.

#### 커뮤니티 라이브러리

[SWR](https://swr.vercel.app/)이나 [React Query](https://tanstack.com/query/latest) 같은 커뮤니티 라이브러리로 Client Component에서 데이터를 가져올 수 있다. 이 라이브러리들은 캐싱, 스트리밍 등에 대해 자체적인 시맨틱을 갖고 있다. 예를 들어 SWR로는:

```tsx filename="app/blog/page.tsx"
'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 예시

### 순차적 데이터 fetching

순차적 데이터 fetching은 한 요청이 다른 요청의 데이터에 의존할 때 일어난다.

예를 들어 `<Playlists>`는 `getArtist()`가 resolve된 뒤에야 fetch를 시작할 수 있다. `artistID`가 필요하기 때문이다.

```tsx filename="app/artist/[username]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  // 아티스트 정보를 가져온다
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Playlists 컴포넌트가 로딩되는 동안 fallback UI를 보여준다 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* 아티스트 ID를 Playlists 컴포넌트에 전달한다 */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }: { artistID: string }) {
  // 아티스트 ID로 플레이리스트를 가져온다
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

이 예시에서 `<Suspense>`는 아티스트 데이터가 로딩된 뒤 플레이리스트가 스트리밍되도록 해준다. 다만 페이지는 여전히 아티스트 데이터를 기다린 뒤에야 뭔가를 보여준다. 이를 방지하려면 페이지 컴포넌트 전체를 `<Suspense>` 바운더리(예: [`loading.js` 파일](#loadingjs로-스트리밍하기))로 감싸서 즉시 로딩 상태를 보여줄 수 있다.

데이터 소스가 첫 요청을 빠르게 resolve할 수 있는지 확인해야 한다. 이 요청이 나머지 전체를 막기 때문이다. 요청을 더 최적화할 수 없다면, 데이터가 자주 바뀌지 않는다면 결과를 [캐싱](./caching.md)하는 것도 고려한다.

### 병렬 데이터 fetching

병렬 데이터 fetching은 라우트 안의 데이터 요청들이 즉시 시작되어 동시에 실행될 때 일어난다.

기본적으로 [레이아웃과 페이지](./layouts-and-pages.md)는 병렬로 렌더링된다. 그래서 각 세그먼트는 가능한 한 빨리 데이터 fetching을 시작한다.

다만 _어떤_ 컴포넌트 안에서든, 여러 `async`/`await` 요청이 순서대로 배치되면 여전히 순차적일 수 있다. 예를 들어 `getAlbums`는 `getArtist`가 resolve될 때까지 막힌다.

```tsx filename="app/artist/[username]/page.tsx"
import { getArtist, getAlbums } from '@/app/lib/data'

export default async function Page({ params }) {
  // 이 요청들은 순차적으로 실행된다
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
```

`fetch`를 호출해 여러 요청을 시작한 뒤 [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)로 await하면 병렬로 시작된다. 요청은 `fetch`가 호출되는 즉시 시작된다.

```tsx filename="app/artist/[username]/page.tsx"
import Albums from './albums'

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // 요청을 시작한다
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

> **알아두면 좋은 점**: `Promise.all`을 쓸 때 요청 하나가 실패하면 전체 작업이 실패한다. 이를 다르게 다루려면 [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 메서드를 쓴다.

### `React.cache`로 데이터 재사용하기

데이터 fetch 함수를 [`React.cache`](https://react.dev/reference/react/cache)로 감싸면, 같은 요청 안의 여러 컴포넌트가 다시 fetch하지 않고 하나의 결과를 공유한다.

```tsx filename="app/lib/user.ts"
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

Server Component는 `getUser()`를 직접 호출할 수 있다.

```tsx filename="app/dashboard/page.tsx"
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser() // 캐시됨 - 같은 요청, 중복 fetch 없음
  return <h1>Dashboard for {user.name}</h1>
}
```

`getUser`가 `React.cache`로 감싸져 있기 때문에, 같은 요청 안의 여러 호출은 Server Component에서 직접 호출되든 Client Component에서 context를 통해 resolve되든 같은 메모이즈된 결과를 반환한다.

> **알아두면 좋은 점**: `React.cache`는 현재 요청에만 스코프된다. 각 요청은 자기만의 메모이제이션 스코프를 가지며 요청 간에 공유되지 않는다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 순차 fetching과 `Promise.all` 병렬 fetching 두 버전을 나란히 두고, 네트워크 탭에서 요청이 시작되는 타이밍 차이를 비교한다.
- 사용자가 확인할 화면과 상호작용: `loading.js`가 있는 라우트와 없는 라우트를 각각 방문해서 로딩 상태 차이를 확인.
- 예제에서 관찰할 결과: `Promise.all`을 쓴 버전은 두 요청이 동시에 시작되고, 순차 버전은 한 요청이 끝나야 다음이 시작되는 워터폴 패턴.

## 연습 문제

**Q1. (단일 선택) `<Suspense>`와 `loading.js`의 관계를 옳게 설명한 것은?**

1. `loading.js`는 `<Suspense>`와 무관한 독립적인 기능이다.
2. `loading.js`는 내부적으로 `page.js`를 `<Suspense>` 바운더리로 감싼다.
3. `<Suspense>`를 쓰면 `loading.js`는 무시된다.
4. `loading.js`는 Client Component에서만 동작한다.

<details>
<summary>정답 보기</summary>

**정답: 2** — `loading.js`는 자동으로 `page.js`와 그 자식들을 `<Suspense>` 바운더리로 감싼다.

</details>

**Q2. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] `getArtist`와 `getAlbums`를 `await`로 순서대로 호출하면 병렬로 실행된다.
- [ ] `Promise.all`은 요청 중 하나라도 실패하면 전체가 실패한다.
- [ ] `React.cache`로 감싼 함수는 서로 다른 요청 사이에서도 결과를 공유한다.
- [ ] Server Component 안에서는 ORM이나 DB 클라이언트로 안전하게 직접 쿼리를 실행할 수 있다.

<details>
<summary>정답 보기</summary>

**정답: 2, 4** — `await`를 순서대로 쓰면 순차 실행이 되고, `React.cache`는 요청 하나에만 스코프된다.

</details>

**Q3. (단일 선택) 실패해도 다른 요청 결과는 그대로 살리고 싶을 때 `Promise.all` 대신 쓸 수 있는 것은?**

1. `Promise.race`
2. `Promise.allSettled`
3. `Promise.any`
4. `Promise.resolve`

<details>
<summary>정답 보기</summary>

**정답: 2** — `Promise.allSettled`는 각 Promise의 성공/실패 결과를 개별적으로 담아 반환해서, 하나가 실패해도 전체가 실패로 처리되지 않는다.

</details>

## 요약

- Server Component에서는 `fetch`나 ORM/DB 클라이언트로 데이터를 안전하게 가져올 수 있다.
- 스트리밍은 `loading.js`(라우트 전체)나 `<Suspense>`(세밀한 제어) 두 방식으로 적용할 수 있다.
- Client Component에서는 React의 `use` API나 SWR/React Query 같은 라이브러리로 데이터를 가져온다.
- 순차 fetching은 워터폴을 만들고, `Promise.all`로 시작하면 병렬로 실행된다.
- `React.cache`는 같은 요청 안에서 데이터 fetch 함수의 결과를 메모이즈해 중복 호출을 없앤다.
