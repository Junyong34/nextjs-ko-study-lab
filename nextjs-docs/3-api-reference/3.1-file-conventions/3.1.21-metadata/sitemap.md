# sitemap.xml

- 공식 문서: [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 정적 XML 또는 코드로 검색 엔진용 URL 목록을 제공한다.
- image·video·localized URL과 여러 sitemap 생성 방법을 이해한다.

## 핵심 개념 및 설명

`sitemap.(xml|js|ts)`는 [사이트맵 XML 형식](https://www.sitemaps.org/protocol.html)과 일치하는 특수 파일로, 검색 엔진 크롤러가 사이트를 보다 효율적으로 색인화하는 데 도움이 된다.

<a id="sitemap-files-xml"></a>
#### 사이트맵 파일(.xml)

소규모 애플리케이션의 경우 `sitemap.xml` 파일을 생성하여 `app` 디렉터리의 루트에 배치할 수 있다.

```xml filename="app/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

<a id="generating-a-sitemap-using-code-js-ts"></a>
#### 코드(.js, .ts)를 사용하여 사이트맵 생성

`sitemap.(js|ts)` 파일 규칙을 사용하면 URL 배열을 반환하는 기본 함수를 내보내 프로그래밍 방식으로 사이트맵을 **생성**할 수 있다. TypeScript를 사용하는 경우 [`Sitemap`](#returns) 유형을 사용할 수 있다.

> **알아두면 좋은 점**: `sitemap.js`는 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 [동적 구성](../../../2-guides/caching-without-cache-components.md#dynamic) 옵션을 사용하지 않는 한 기본적으로 캐시되는 특수 Route Handler이다.

```ts filename="app/sitemap.ts" switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

```js filename="app/sitemap.js" switcher
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

산출:

```xml filename="acme.com/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

<a id="image-sitemaps"></a>
#### 이미지 사이트맵

`images` 속성을 사용하여 이미지 사이트맵을 만들 수 있다. [Google 개발자 문서](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)에서 자세한 내용을 살펴본다.

```ts filename="app/sitemap.ts" switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      images: ['https://example.com/image.jpg'],
    },
  ]
}
```

산출:

```xml filename="acme.com/sitemap.xml"
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <image:image>
      <image:loc>https://example.com/image.jpg</image:loc>
    </image:image>
    <lastmod>2021-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

<a id="video-sitemaps"></a>
#### 비디오 사이트맵

`videos` 속성을 사용하여 비디오 사이트맵을 만들 수 있다. [Google 개발자 문서](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)에서 자세한 내용을 살펴본다.

```ts filename="app/sitemap.ts" switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      videos: [
        {
          title: 'example',
          thumbnail_loc: 'https://example.com/image.jpg',
          description: 'this is the description',
        },
      ],
    },
  ]
}
```

산출:

```xml filename="acme.com/sitemap.xml"
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <video:video>
      <video:title>example</video:title>
      <video:thumbnail_loc>https://example.com/image.jpg</video:thumbnail_loc>
      <video:description>this is the description</video:description>
    </video:video>
    <lastmod>2021-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

<a id="generate-a-localized-sitemap"></a>
#### 현지화된 Sitemap 생성

```ts filename="app/sitemap.ts" switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

```js filename="app/sitemap.js" switcher
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

산출:

```xml filename="acme.com/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://acme.com</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/about"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/about"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/blog"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/blog"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
</urlset>
```

<a id="generating-multiple-sitemaps"></a>
#### 여러 사이트맵 생성

단일 사이트맵은 대부분의 애플리케이션에서 작동한다. 대규모 웹 애플리케이션의 경우 사이트맵을 여러 파일로 분할해야 할 수도 있다.

여러 사이트맵을 만드는 방법에는 두 가지가 있다.

- 여러 라우트 세그먼트 내에 `sitemap.(xml|js|ts)`를 중첩하여 예를 들어 `app/sitemap.xml` 및 `app/products/sitemap.xml`.
- [`generateSitemaps`](../../3.3-functions/generate-sitemaps.md) 기능을 사용한다.

예를 들어 `generateSitemaps`를 사용하여 사이트맵을 분할하려면 사이트맵 `id`가 포함된 객체 배열을 반환한다. 그런 다음 `id`를 사용하여 고유한 사이트맵을 생성한다.

```ts filename="app/product/sitemap.ts" switcher
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 총 제품 수를 가져오고 필요한 사이트맵 수를 계산한다.
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  // Google의 한도는 사이트맵당 URL 50,000개이다.
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

```js filename="app/product/sitemap.js" switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 총 제품 수를 가져오고 필요한 사이트맵 수를 계산한다.
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props) {
  const id = await props.id
  // Google의 한도는 사이트맵당 URL 50,000개이다.
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

생성된 사이트맵은 `/.../sitemap/[id]`에서 사용할 수 있다. 예를 들어 `/product/sitemap/1.xml`이다.

자세한 내용은 [`generateSitemaps`API 참조](../../3.3-functions/generate-sitemaps.md)를 참조한다.

<a id="returns"></a>
### 반환값

`sitemap.(xml|ts|js)`에서 내보낸 기본 함수는 다음 속성을 가진 객체 배열을 반환해야 한다.

```tsx
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
  alternates?: {
    languages?: Languages<string>
  }
}>
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| ---------- | ------------------------------------------------------------ |
| `v16.0.0` | `id`는 이제 `string`로 해결되는 Promise이다. |
| `v14.2.0` | 현지화 지원을 추가한다. |
| `v13.4.14` | 사이트맵에 `changeFrequency` 및 `priority` 속성을 추가한다. |
| `v13.3.0` | `sitemap`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 blog 데이터를 URL 배열로 변환하고 XML 결과를 검사한다.
- localized URL과 image/video entry, 여러 sitemap id를 추가한다.

## 연습 문제

1. 매우 많은 URL을 여러 sitemap으로 나누는 함수는?
   - A. `generateMetadata`
   - B. `generateSitemaps`
   - C. `generateStaticParams`

<details><summary>정답 보기</summary>

정답: B. sitemap id별 응답을 생성하도록 분할한다.
</details>

## 챕터 요약

- sitemap은 crawler의 URL 발견을 돕는다.
- 정적 XML과 타입 안전한 코드 생성을 지원한다.
- image, video, localized URL metadata를 담을 수 있다.
- `generateSitemaps`로 큰 목록을 나눈다.
- Request-time API가 없으면 기본적으로 캐시된다.
