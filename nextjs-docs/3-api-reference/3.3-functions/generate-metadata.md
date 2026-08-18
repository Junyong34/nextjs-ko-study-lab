# generateMetadata

- 공식 문서: [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 동적 라우트 매개변수나 외부 API 데이터에 기반하여 페이지 메타데이터를 비동기로 생성하는 `generateMetadata` 함수의 사용법을 익힌다.
- 정적 `metadata` 객체와 동적 `generateMetadata` 함수의 차이점 및 적절한 선택 기준을 이해한다.
- `title` 템플릿(`template`, `default`, `absolute`)과 `metadataBase`를 활용한 효율적인 SEO 구조를 설계한다.
- 상위 세그먼트 메타데이터(`ResolvingMetadata`)를 상속 및 확장하는 패턴을 구현한다.

## 핵심 개념 및 설명

Next.js App Router에서는 검색 엔진 최적화(SEO)와 소셜 미디어 공유(Open Graph, Twitter Card)를 위해 메타데이터를 선언적 방식으로 정의할 수 있다.

- **정적 메타데이터**: 고정된 값일 경우 `layout.tsx` 또는 `page.tsx`에서 `metadata` 객체를 `export`한다.
- **동적 메타데이터**: 라우트 파라미터(`params`), 쿼리 스트링(`searchParams`), 또는 서버 API 데이터에 의존할 경우 `generateMetadata` 비동기 함수를 `export`한다.

`metadata`와 `generateMetadata`는 **오직 Server Component에서만 지원**된다.

```tsx filename="app/products/[id]/page.tsx" switcher
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const product = await fetch(`https://api.example.com/products/${id}`).then((res) => res.json())

  // 상위 레이아웃의 메타데이터(예: 기본 OG 이미지) 상속 및 확장
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      images: [product.imageUrl, ...previousImages],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  return <div>상품 상세 정보: {id}</div>
}
```

```jsx filename="app/products/[id]/page.js" switcher
export async function generateMetadata({ params, searchParams }, parent) {
  const { id } = await params
  const product = await fetch(`https://api.example.com/products/${id}`).then((res) => res.json())

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      images: [product.imageUrl, ...previousImages],
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  return <div>상품 상세 정보: {id}</div>
}
```

> **알아두면 좋은 점**:
>
> - 한 파일 안에서 `metadata` 객체와 `generateMetadata` 함수를 동시에 `export`할 수 없다.
> - `generateMetadata` 내부에서 호출하는 `fetch` 요청은 페이지 컴포넌트나 레이아웃에서 호출하는 `fetch`와 동일한 URL/옵션일 경우 자동으로 메모이제이션되어 1회만 실행된다.
> - 파일 기반 메타데이터([`opengraph-image.tsx`](../3.1-file-conventions/opengraph-image.md), `favicon.ico` 등)가 설정 객체보다 우선순위가 높다.
> - Next.js 14부터 `viewport`, `themeColor`, `colorScheme` 속성은 메타데이터 객체에서 제거되었으며 [`generateViewport`](./generate-viewport.md)를 사용해야 한다.

### 주요 메타데이터 필드

#### 1. `title` (템플릿 및 절대값)

```tsx filename="app/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 내 서비스',
    default: '내 서비스 - 홈',
  },
}
```

- 하위 `page.tsx`에서 `title: '소개'`를 반환하면 최종 브라우저 타이틀은 `<title>소개 | 내 서비스</title>`이 된다.
- 상위 템플릿을 무시하고 완전히 독립적인 타이틀을 쓰려면 `title: { absolute: '특별 이벤트 페이지' }`를 지정한다.

#### 2. `metadataBase`

상대 경로로 작성된 이미지 URL이나 canonical 링크를 완전한 절대 URL로 결합하기 위한 베이스 URL 접두사다:

```tsx filename="app/layout.tsx"
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  openGraph: {
    images: '/og-image.png', // https://example.com/og-image.png 로 자동 변환
  },
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v14.0.0` | `viewport` 및 `themeColor` 설정이 `generateViewport`로 분리 |
| `v13.0.0` | App Router에 `generateMetadata` 및 `metadata` 도입 |

## 예제 및 데모 설계

- 루트 레이아웃에 `title.template`을 정의하고 하위 동적 상세 페이지에서 반환된 타이틀이 `%s` 위치에 결합되는지 브라우저 탭과 `<head>` 태그에서 확인한다.
- `generateMetadata`와 `Page` 컴포넌트 모두에서 동일한 `fetch(id)`를 호출했을 때 네트워크 중복 없이 캐시되는 메모이제이션을 검증한다.
- `metadataBase`를 설정했을 때 상대 경로의 `og:image`가 온전한 절대 경로 메타 태그로 렌더링되는지 테스트한다.

## 연습 문제

1. 상위 레이아웃에 정의된 `title.template` ('%s | Acme')을 무시하고 현재 페이지의 타이틀만 고정하여 렌더링하고자 할 때 사용하는 옵션은?
   - A. `title: { ignore: '단독 제목' }`
   - B. `title: { absolute: '단독 제목' }`
   - C. `title: { force: '단독 제목' }`
   - D. `title: { static: '단독 제목' }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `title.absolute` 필드를 사용하면 상위 세그먼트 레이아웃에 선언된 `title.template`의 접두/접미사 규칙을 무시하고 해당 문자열을 그대로 타이틀로 출력한다.
</details>

2. Next.js 14 이후 `themeColor` 및 뷰포트 관련 메타 태그를 정의하기 위해 사용하는 전용 API는?
   - A. `generateMetadata`의 `theme` 필드
   - B. `generateViewport`
   - C. `generateTheme`
   - D. `next.config.js`의 `viewport` 설정

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 14부터 뷰포트 및 테마 색상 관련 설정은 `generateMetadata`에서 분리되어 `generateViewport` (또는 `viewport` 객체 export)를 통해 정의한다.
</details>

## 챕터 요약

- `generateMetadata`는 비동기 데이터에 기반하여 `<head>` 메타데이터를 동적으로 생성하는 Server Component 함수다.
- `title.template`과 `title.absolute`를 통해 사이트 전반의 일관된 타이틀 체계를 구성한다.
- `metadataBase`는 상대 URL을 완전한 절대 URL로 자동 병합한다.
- 상위 메타데이터는 2번째 인자인 `ResolvingMetadata`를 통해 비동기로 접근하고 확장할 수 있다.
- 동일 렌더 트리 내 중복 데이터 패칭은 자동 메모이제이션된다.
