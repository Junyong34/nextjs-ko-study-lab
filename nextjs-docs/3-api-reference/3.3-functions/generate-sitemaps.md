# generateSitemaps

- 공식 문서: [generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 수만 개 이상의 대규모 URL을 가진 서비스에서 사이트맵을 여러 개로 분할 생성하는 `generateSitemaps` 함수의 역할을 이해한다.
- 검색 엔진(Google 등)의 사이트맵 제한(파일당 50,000개 URL)을 준수하는 분할 아키텍처를 설계한다.
- `app/sitemap.ts` 또는 하위 라우트에서 `id` 배열을 반환하고, 기본 sitemap 생성 함수에서 비동기 `props.id`를 처리하는 패턴을 습득한다.
- 생성된 분할 사이트맵 URL 구조(`/[route]/sitemap/[id].xml`)를 확인한다.

## 핵심 개념 및 설명

`generateSitemaps`는 대규모 웹 애플리케이션에서 하나의 거대한 `sitemap.xml` 파일 대신, 여러 개의 작은 사이트맵 파일로 분할하여 제공할 수 있도록 사이트맵 식별자 목록을 생성하는 함수다.

검색 엔진은 단일 사이트맵 파일당 최대 50,000개의 URL 또는 50MB 용량 제한을 두고 있으므로, 대용량 전자상거래나 콘텐츠 플랫폼에서는 분할이 필수적이다.

```ts filename="app/product/sitemap.ts" switcher
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://example.com'

// 1. 필요한 사이트맵 분할 ID 목록 반환
export async function generateSitemaps() {
  // 전체 상품 수를 기반으로 필요한 사이트맵 개수 계산 (예: 4개 분할)
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// 2. 전달받은 id를 기준으로 해당 구역의 50,000개 URL 데이터 반환
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id)

  const limit = 50000
  const start = id * limit
  const end = start + limit

  const products = await db.product.findMany({
    skip: start,
    take: limit,
    select: { id: true, updatedAt: true },
  })

  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.updatedAt,
  }))
}
```

```js filename="app/product/sitemap.js" switcher
const BASE_URL = 'https://example.com'

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props) {
  const id = Number(await props.id)

  const limit = 50000
  const start = id * limit
  const end = start + limit

  const products = await getProducts(start, end)

  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.updatedAt,
  }))
}
```

### URL 경로 규칙

생성된 분할 사이트맵 파일은 다음과 같은 일관된 URL로 서빙된다:
- `http://localhost:3000/product/sitemap/0.xml`
- `http://localhost:3000/product/sitemap/1.xml`
- `http://localhost:3000/product/sitemap/2.xml`

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | `sitemap` 기본 export 함수에 전달되는 `props.id`가 `Promise<string>`으로 변경 |
| `v15.0.0` | 개발 및 프로덕션 환경 간 사이트맵 URL 형식 일치화 |
| `v13.3.2` | `generateSitemaps` 도입 |

## 예제 및 데모 설계

- 데이터베이스의 총 게시물 수가 120,000개일 때 `generateSitemaps`가 `[{ id: 0 }, { id: 1 }, { id: 2 }]`를 반환하도록 구성한다.
- 브라우저에서 `/product/sitemap/0.xml` 및 `/product/sitemap/1.xml`로 접근했을 때 올바른 XML 형식의 사이트맵이 응답되는지 확인한다.
- Next.js 16 비동기 언래핑 규칙(`await props.id`)을 검증한다.

## 연습 문제

1. 검색 엔진(Google 등)의 표준 규격상 단일 사이트맵 XML 파일에 포함될 수 있는 최대 URL 개수는?
   - A. 1,000개
   - B. 10,000개
   - C. 50,000개
   - D. 100,000개

<details><summary>정답 보기</summary>

정답: **C**  
해설: 구글 및 표준 웹 검색 엔진의 사이트맵 규격에 따라 단일 사이트맵 파일은 최대 50,000개의 URL 또는 압축 해제 기준 50MB 용량으로 제한된다.
</details>

2. Next.js 16 이후 `sitemap(props)` 함수에서 분할 `id`를 취득하는 올바른 방법은?
   - A. `const id = props.id` (동기식 접근)
   - B. `const id = await props.id` (비동기 Promise 언래핑)
   - C. `const id = useParams().id`
   - D. `const id = props.sitemapId`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 16부터 `props.id`는 `Promise<string>` 타입으로 전달되므로 `await` 키워드를 사용하여 비동기로 취득해야 한다.
</details>

## 챕터 요약

- `generateSitemaps`는 대량의 URL을 여러 사이트맵 XML 파일로 나누어 제공하는 함수다.
- 단일 사이트맵의 50,000개 URL 용량 제한을 우회하기 위해 사용된다.
- `[{ id: 0 }, { id: 1 }, ...]` 형태의 ID 배열을 반환한다.
- 기본 sitemap export 함수는 `await props.id`를 통해 해당 파티션의 URL 목록을 생성한다.
- Next.js 16에서 `props.id`가 Promise로 변경되었다.
