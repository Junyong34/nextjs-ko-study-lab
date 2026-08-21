# generateStaticParams

- 공식 문서: [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 빌드 시점에 다이나믹 라우트 세그먼트를 정적으로 prerender하기 위한 `generateStaticParams` 함수의 동작 원리와 작성법을 마스터한다.
- 단일 세그먼트, 다중 중첩 세그먼트, Catch-all 세그먼트 등 다양한 라우팅 구조에 맞는 반환 객체 배열 패턴을 설계한다.
- `dynamicParams` 설정(`true` / `false`)과 결합하여 빌드되지 않은 경로에 대한 런타임 폴백 및 404 정책을 결정한다.
- 상위 레이아웃과 하위 페이지 세그먼트 간의 하향식(Top-Down) 실행 순서 및 매개변수 전달 구조를 이해한다.
- Route Handler(`route.ts`)와 `generateStaticParams`를 결합하여 정적 API 엔드포인트를 생성하는 방법을 파악한다.

## 핵심 개념 및 설명

`generateStaticParams`는 다이나믹 라우트 세그먼트(`[slug]`, `[...slug]`)와 함께 사용되어 빌드 시점에 요청 경로를 정적으로 생성(prerender)하는 Server Component 전용 함수다.

```tsx filename="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json())

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <article>게시물: {slug}</article>
}
```

> **알아두면 좋은 점**:
>
> - `generateStaticParams` 내부에서 호출하는 `fetch` 요청은 동일한 엔드포인트일 경우 페이지 렌더링 중 호출되는 `fetch`와 자동으로 메모이제이션되어 네트워크 중복이 발생하지 않는다.
> - ISR(증분 정적 재생성) 주기에 페이지가 revalidate될 때는 `generateStaticParams`가 다시 실행되지 않고 해당 페이지만 백그라운드에서 다시 렌더링된다.
> - 개발 환경(`next dev`)에서는 빌드 시점 대신 경로를 요청할 때 호출된다.

---

### 라우트 세그먼트 패턴별 반환 구조

`generateStaticParams`는 각 세그먼트의 파라미터 이름을 키로 하는 **객체들의 배열**을 반환해야 한다.

#### 1. 단일 다이나믹 세그먼트 (`app/blog/[slug]/page.tsx`)

```tsx filename="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }]
}
```

#### 2. 다중 중첩 다이나믹 세그먼트 (`app/products/[category]/[item]/page.tsx`)

상위 세그먼트와 하위 세그먼트의 파라미터를 모두 포함하는 객체 배열을 반환한다.

```tsx filename="app/product/[id]/page.tsx"
export async function generateStaticParams() {
  return [
    { category: 'electronics', item: 'phone' },
    { category: 'electronics', item: 'laptop' },
    { category: 'clothing', item: 't-shirt' },
  ]
}
```

#### 3. Catch-all 다이나믹 세그먼트 (`app/docs/[...slug]/page.tsx`)

배열 형태의 경로 조각들을 전달한다.

```tsx filename="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  return [
    { slug: ['getting-started', 'installation'] }, // /docs/getting-started/installation
    { slug: ['components', 'buttons'] },           // /docs/components/buttons
  ]
}
```

#### 4. Optional Catch-all 세그먼트 (`app/shop/[[...slug]]/page.tsx`)

루트 경로(`/shop`)를 포함하려면 빈 배열 `[]`을 함께 반환한다.

```tsx filename="app/products/[category]/[product]/page.tsx"
export async function generateStaticParams() {
  return [
    { slug: [] },                  // /shop
    { slug: ['summer-collection'] }, // /shop/summer-collection
  ]
}
```

---

### `dynamicParams` 옵션과의 연동

`generateStaticParams`에서 반환되지 않은 경로에 사용자가 접근했을 때의 동작을 제어한다.

```tsx filename="app/blog/[slug]/page.tsx"
export const dynamicParams = false // 지정되지 않은 경로는 즉시 404 반환

export async function generateStaticParams() {
  return [{ slug: 'first-post' }]
}
```

- **`dynamicParams: true` (기본값)**: `generateStaticParams`에 없는 경로로 요청이 들어오면 서버에서 온디맨드로 페이지를 다이나믹 렌더링하고 캐시한다.
- **`dynamicParams: false`**: `generateStaticParams`에 정의되지 않은 모든 경로는 404(`notFound`)로 즉시 처리된다. (정적 파일만 허용할 때 필수)

---

### 하향식 (Top-Down) 평가 순서

동일 라우트 경로 상의 상위 레이아웃과 하위 페이지에 모두 `generateStaticParams`가 선언되어 있다면, **상위 세그먼트가 먼저 실행**되고 그 결과가 하위 세그먼트의 `params` 인자로 전달된다.

```tsx filename="app/[category]/[product]/page.tsx"
// 상위 app/[category]/layout.tsx 의 generateStaticParams가 먼저 평가됨
export async function generateStaticParams({
  params,
}: {
  params: { category: string }
}) {
  const { category } = params
  const products = await getProductsByCategory(category)

  return products.map((product) => ({
    product: product.id,
  }))
}
```

---

### Route Handler와의 연계 (`route.ts`)

정적 API 엔드포인트를 빌드 시점에 미리 생성할 수도 있다.

```tsx filename="app/api/posts/[id]/route.ts"
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return Response.json({ id, title: `Post ${id}` })
}
```

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | 페이지 컴포넌트의 `params`가 `Promise`로 변경 |
| `v13.0.0` | `getStaticPaths`를 대체하는 `generateStaticParams` 도입 |

## 예제 및 데모 설계

- `[slug]` 라우트에 `generateStaticParams`를 구성하고 `next build` 실행 시 `.next/server/app`에 HTML이 정적 생성되는지 출력 로그를 확인한다.
- `dynamicParams = false`를 설정하고 목록에 없는 슬러그로 접근 시 404 페이지가 반환되는지 테스트한다.
- 다중 중첩 라우트(`[category]/[item]`)에서 상위 레이아웃의 `params`를 하위 세그먼트에서 수신하여 조합하는 하향식 빌드 흐름을 검증한다.

## 연습 문제

1. `generateStaticParams`에서 반환해야 하는 올바른 데이터 구조는?
   - A. 경로 문자열의 배열: `['/post-1', '/post-2']`
   - B. 세그먼트 파라미터 이름을 키로 하는 객체들의 배열: `[{ slug: 'post-1' }, { slug: 'post-2' }]`
   - C. 단일 객체: `{ slugs: ['post-1', 'post-2'] }`
   - D. Map 객체: `new Map()`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `generateStaticParams`는 각 다이나믹 세그먼트 매개변수 이름을 키로 갖는 객체들의 배열(`Array<Record<string, string | string[]>>`)을 반환해야 한다.
</details>

2. `generateStaticParams`에 정의되지 않은 경로로의 접근을 완전히 차단하고 404 페이지를 반환하도록 강제하는 설정은?
   - A. `export const staticOnly = true`
   - B. `export const dynamicParams = false`
   - C. `export const fallback = false`
   - D. `export const strictParams = true`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `export const dynamicParams = false`를 선언하면 사전 생성되지 않은 임의의 경로 요청 시 온디맨드 렌더링 대신 즉시 404 Not Found를 반환한다.
</details>

3. Catch-all 세그먼트(`app/docs/[...slug]/page.tsx`)에서 `/docs/a/b` 경로를 prerender하기 위한 올바른 반환 객체는?
   - A. `{ slug: 'a/b' }`
   - B. `{ slug: ['a', 'b'] }`
   - C. `{ path: ['a', 'b'] }`
   - D. `{ slug: { first: 'a', second: 'b' } }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Catch-all 다이나믹 세그먼트(`[...slug]`)는 경로 세그먼트들을 문자열 배열(`['a', 'b']`) 형태로 매핑해야 한다.
</details>

## 챕터 요약

- `generateStaticParams`는 빌드 시점에 다이나믹 라우트의 경로들을 미리 정적으로 생성(prerender)한다.
- 단일, 다중, Catch-all(`[...slug]`), Optional Catch-all(`[[...slug]]`) 등 모든 라우팅 구조를 지원한다.
- `dynamicParams: false` 설정을 통해 사전 정의되지 않은 경로에 대한 엄격한 404 제어가 가능하다.
- 상위 세그먼트부터 하위 세그먼트로 순차 평가되며, 상위 `params`가 하위 함수로 주입된다.
- 내부의 중복 `fetch` 호출은 자동 메모이제이션된다.
