# Metadata and OG images

- 공식 문서: [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 정적 `metadata` 객체와 다이나믹 `generateMetadata`를 상황에 맞게 선택할 수 있다.
- 파일 규칙으로 파비콘과 정적·다이나믹 Open Graph 이미지를 만들 수 있다.
- 다이나믹 렌더링에서 metadata가 스트리밍되는 방식과 예외를 설명할 수 있다.
- 페이지 본문과 metadata가 같은 데이터를 사용할 때 중복 요청을 피할 수 있다.

## 핵심 개념 및 설명

Metadata API는 SEO와 웹 공유에 필요한 정보를 정의한다. 정적 `metadata` 객체, 다이나믹 `generateMetadata` 함수, 파비콘과 OG 이미지를 위한 특수 파일 규칙을 제공한다. 어느 방식을 사용해도 Next.js가 관련 `<head>` 태그를 생성한다. `metadata`와 `generateMetadata` export는 Server Component에서만 지원한다.

### 기본 필드

라우트가 metadata를 정의하지 않아도 문자 인코딩과 반응형 viewport를 위한 두 태그는 항상 추가된다.

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

나머지 필드는 정적 `metadata` 객체나 `generateMetadata` 함수로 정의한다.

### 정적 metadata

값이 데이터에 따라 달라지지 않으면 정적 `layout.js` 또는 `page.js`에서 [`Metadata`](../3-api-reference/3.3-functions/generate-metadata.md) 객체를 export한다.

```tsx filename="app/blog/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
```

### 생성된 metadata

콘텐츠에 따라 값이 달라지면 `generateMetadata`에서 데이터를 가져와 `Metadata`를 반환한다. 아래 예에서는 URL의 `slug`로 게시물 제목과 설명을 구한다.

```tsx filename="app/blog/[slug]/page.tsx"
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return { title: post.title, description: post.description }
}

export default function Page({ params, searchParams }: Props) {}
```

#### 스트리밍 metadata

다이나믹 렌더링 페이지에서는 `generateMetadata`가 끝날 때까지 UI 렌더링을 막지 않는다. Next.js는 시각 콘텐츠를 먼저 스트리밍하고, metadata가 준비되면 HTML에 삽입한다. 빌드 시점에 metadata가 확정되는 prerender 페이지에는 이 과정이 필요하지 않다.

metadata가 `<head>`에 있기를 기대하는 `Twitterbot`, `Slackbot`, `Bingbot` 같은 봇은 요청의 User-Agent 헤더로 식별한다. 이런 봇에는 스트리밍 metadata를 사용하지 않는다. [`htmlLimitedBots`](../3-api-reference/3.5-config/3.5.1-next-config-js/htmlLimitedBots.md)로 대상 목록을 바꾸거나 스트리밍 metadata를 완전히 끌 수 있다.

#### 데이터 요청 메모이제이션

metadata와 페이지가 같은 데이터를 읽으면 React의 `cache`로 반환값을 메모이제이션해 실제 조회를 한 번만 실행할 수 있다.

```ts filename="app/lib/data.ts"
import { cache } from 'react'
import { db } from '@/app/lib/db'

// 두 곳에서 호출해도 같은 렌더링 작업에서는 한 번만 조회한다
export const getPost = cache(async (slug: string) => {
  return db.query.posts.findFirst({ where: eq(posts.slug, slug) })
})
```

### 파일 기반 metadata

`favicon.ico`, `apple-icon.jpg`, `icon.jpg`, `opengraph-image.jpg`, `twitter-image.jpg`, `robots.txt`, `sitemap.xml`은 metadata 특수 파일이다. 정적 파일을 놓거나 대응하는 코드 파일에서 프로그래밍 방식으로 생성할 수 있다.

### 파비콘

파비콘은 북마크와 검색 결과에서 사이트를 나타내는 작은 아이콘이다. `app` 폴더 루트에 `favicon.ico`를 둔다. 코드로 생성하는 방법은 [아이콘 파일 규칙](../3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md)에서 확인할 수 있다.

![app 폴더 안에서 layout, page와 나란히 놓인 favicon 특수 파일](./assets/metadata-and-og-images-01.webp)

### 정적 Open Graph 이미지

OG 이미지는 소셜 미디어에서 사이트를 대표한다. 모든 라우트에 적용할 이미지는 `app` 루트에 `opengraph-image.jpg`로 둔다.

![app 폴더 안에서 layout, page와 나란히 놓인 OG 이미지 특수 파일](./assets/metadata-and-og-images-02.webp)

특정 라우트에는 더 깊은 폴더에 같은 이름의 파일을 둔다. 예를 들어 `app/blog/opengraph-image.jpg`는 `/blog`에 적용되며 상위 폴더의 OG 이미지보다 우선한다.

![blog 폴더 안에 놓인 라우트별 OG 이미지 특수 파일](./assets/metadata-and-og-images-03.webp)

`jpeg`, `png`, `gif` 형식도 지원한다.

### 생성된 Open Graph 이미지

[`ImageResponse`](../3-api-reference/3.3-functions/image-response.md)는 JSX와 CSS로 데이터 기반 이미지를 만든다. 게시물마다 고유한 이미지를 만들려면 `app/blog/[slug]/opengraph-image.tsx`를 추가한다.

```tsx filename="app/blog/[slug]/opengraph-image.tsx"
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {post.title}
    </div>
  )
}
```

> **알아두면 좋은 점**: 예제는 [Vercel OG Playground](https://og-playground.vercel.app/)에서 확인할 수 있다. `ImageResponse`는 `@vercel/og`, `satori`, `resvg`로 HTML과 CSS를 PNG로 변환한다. flexbox와 CSS 속성 일부만 지원하므로 `display: grid` 같은 고급 레이아웃은 동작하지 않는다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 작성)
- 데모 목적: 정적 metadata, 게시물별 metadata, 정적·생성형 OG 이미지의 결과를 비교한다.
- 사용자가 확인할 화면과 상호작용: 게시물 slug를 바꾸고 브라우저 개발자 도구의 `<head>`와 공유 미리보기를 확인한다.
- 관찰할 결과: 구체적인 하위 라우트의 metadata 파일이 상위 파일보다 우선하며, 같은 게시물 조회는 메모이제이션된다.

## 연습 문제

**Q1. (단일 선택) 게시물 데이터에 따라 제목을 바꿀 때 사용할 API는?**

1. 정적 `metadata`
2. `generateMetadata`
3. `viewport`
4. `proxy`

<details><summary>정답 보기</summary>

**정답: 2** — 요청한 게시물 데이터로 metadata를 계산해야 하므로 `generateMetadata`가 알맞다.

</details>

**Q2. (복수 선택) 옳은 설명을 모두 고르시오.**

- [ ] `metadata` export는 Client Component에서도 지원한다.
- [ ] prerender 페이지의 metadata는 빌드 시점에 확정된다.
- [ ] `app/blog/opengraph-image.jpg`는 `/blog`에서 상위 OG 이미지보다 우선한다.
- [ ] `ImageResponse`는 모든 CSS 속성을 지원한다.

<details><summary>정답 보기</summary>

**정답: 2, 3** — metadata export는 Server Component 전용이며 `ImageResponse`는 CSS 속성 일부만 지원한다.

</details>

## 요약

- Next.js는 정적 객체, 생성 함수, 특수 파일로 metadata를 정의한다.
- 문자 인코딩과 viewport 태그는 별도 정의 없이도 항상 추가된다.
- 다이나믹 페이지의 metadata는 UI 뒤에 스트리밍될 수 있지만 제한된 봇에는 적용되지 않는다.
- `cache`는 metadata와 페이지가 공유하는 데이터의 중복 조회를 줄인다.
- 폴더 계층의 파비콘·OG 이미지 파일과 `ImageResponse`로 정적·다이나믹 공유 이미지를 구성한다.
