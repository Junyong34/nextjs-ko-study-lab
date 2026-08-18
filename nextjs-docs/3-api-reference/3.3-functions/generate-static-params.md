# generateStaticParams

- 공식 문서: [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [다이나믹 라우트](../3.1-file-conventions/dynamic-routes.md) 세그먼트를 빌드 시점에 정적으로 사전 렌더링(SSG)하는 `generateStaticParams` 함수의 역할을 이해한다.
- Pages Router의 `getStaticPaths`와 비교하여 App Router에서의 직관적인 객체 배열 반환 모델을 파악한다.
- `dynamicParams = false` 세그먼트 설정과의 조합을 통해 사전 정의되지 않은 경로의 404 처리를 구성한다.
- 다중 중첩 다이나믹 세그먼트에서 하향식(Top-down) 및 상향식(Bottom-up) 파라미터 생성 구조를 구현한다.

## 핵심 개념 및 설명

`generateStaticParams` 함수는 [다이나믹 라우트](../3.1-file-conventions/dynamic-routes.md) 세그먼트(`[slug]`, `[id]`, `[...slug]`)와 함께 선언되어, 요청 시점이 아닌 **빌드 시점(`next build`)에 해당 페이지들을 정적으로 사전 렌더링(Prerendering)**하도록 대상 파라미터 목록을 반환하는 함수다.

Page(`page.tsx`), Layout(`layout.tsx`), [Route Handler](../3.1-file-conventions/route.md)(`route.ts`)에서 사용할 수 있다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
// 1. 빌드 시 사전 생성할 [slug] 파라미터 배열 반환
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json())

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

// 2. generateStaticParams에서 반환된 params를 받아 정적 HTML이 생성됨
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then((res) => res.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then((res) => res.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

> **알아두면 좋은 점**:
>
> - `generateStaticParams` 내부의 `fetch` 요청은 동일 렌더 트리 및 `page.tsx` 내의 동일 `fetch`와 자동으로 메모이제이션되어 중복 호출되지 않는다.
> - 개발 모드(`next dev`)에서는 해당 라우트로 네비게이션할 때 호출된다.
> - ISR(증분 정적 재생성) 주기에 페이지가 재검증될 때는 `generateStaticParams`가 다시 실행되지 않는다.
> - Pages Router의 `getStaticPaths`를 완전히 대체한다.

### `dynamicParams` 옵션과의 연동

`generateStaticParams`에 정의되지 않은 새로운 경로로 사용자가 접근했을 때의 동작을 제어한다:

```tsx filename="app/blog/[slug]/page.tsx"
// generateStaticParams에 없는 slug 요청은 즉시 404를 반환
export const dynamicParams = false
```

- `dynamicParams = true` (기본값): 정의되지 않은 경로는 요청 시점에 최초 1회 서버 렌더링된 후 정적 캐시에 추가된다.
- `dynamicParams = false`: 목록에 없는 경로는 즉시 404 Not Found 화면을 표시한다.

### 다중 중첩 다이나믹 세그먼트 생성

#### 하향식 (Top-down) 부모-자식 연계

부모 레이아웃(`app/products/[category]/layout.tsx`)에서 카테고리 목록을 생성하고, 자식 페이지(`app/products/[category]/[product]/page.tsx`)는 부모로부터 전달받은 `params.category`를 활용해 상품 목록을 생성한다:

```tsx filename="app/products/[category]/[product]/page.tsx" switcher
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: string }
}) {
  const products = await fetch(`https://api.example.com/products?category=${category}`).then((res) =>
    res.json()
  )

  return products.map((product: { id: string }) => ({
    product: product.id,
  }))
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `generateStaticParams` 도입 (`getStaticPaths` 대체) |

## 예제 및 데모 설계

- 블로그 글 100개 중 상위 10개만 빌드 시점에 사전 생성(`generateStaticParams`)하고, 나머지 90개는 첫 요청 시점에 온디맨드로 정적 생성되는 하이브리드 빌드를 구성한다.
- `export const dynamicParams = false`를 활성화한 상태에서 미등록 ID 접근 시 즉시 404 화면이 뜨는지 검증한다.
- `generateStaticParams`와 `page.tsx`에서 같은 API를 호출하여 메모이제이션을 확인한다.

## 연습 문제

1. `generateStaticParams`에서 생성하지 않은 새로운 다이나믹 경로로 사용자가 접속했을 때, 즉시 404 오류를 반환하도록 강제하는 라우트 세그먼트 설정은?
   - A. `export const dynamic = 'error'`
   - B. `export const dynamicParams = false`
   - C. `export const revalidate = 0`
   - D. `export const fallback = false`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `export const dynamicParams = false`를 선언하면 `generateStaticParams`가 사전에 정의한 경로 목록 이외의 모든 요청에 대해 404 Not Found를 응답한다.
</details>

2. `generateStaticParams`가 Pages Router의 어떤 함수를 대체하는가?
   - A. `getServerSideProps`
   - B. `getStaticPaths`
   - C. `getInitialProps`
   - D. `getStaticProps`

<details><summary>정답 보기</summary>

정답: **B**  
해설: App Router의 `generateStaticParams`는 Pages Router에서 사전 렌더링 경로를 지정하던 `getStaticPaths`를 직관적인 모델로 대체한 함수다.
</details>

## 챕터 요약

- `generateStaticParams`는 빌드 시점에 다이나믹 라우트를 정적으로 사전 생성(SSG)하는 함수다.
- Page, Layout, Route Handler에서 파라미터 객체 배열을 반환하여 사용한다.
- `dynamicParams = false`로 미등록 경로의 404 처리를 강제할 수 있다.
- 다중 세그먼트의 상향식/하향식 파라미터 조합을 완벽히 지원한다.
- 동일 렌더 트리 내 중복 데이터 패칭은 자동 메모이제이션된다.
