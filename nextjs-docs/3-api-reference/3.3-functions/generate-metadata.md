# generateMetadata

- 공식 문서: [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 다이나믹 라우트 매개변수(`params`), 쿼리 스트링(`searchParams`), 또는 외부 API 데이터에 기반하여 메타데이터를 비동기로 생성하는 `generateMetadata` 함수의 사용법을 익힌다.
- 정적 `metadata` 객체와 동적 `generateMetadata` 함수의 차이점 및 적절한 선택 기준을 이해한다.
- `title` 템플릿(`template`, `default`, `absolute`)과 `metadataBase`를 활용한 효율적인 SEO 구조를 설계한다.
- Open Graph, Twitter, Robots, Icons, Alternates, Verification 등 전체 메타데이터 필드 체계를 이해한다.
- 상위 세그먼트 메타데이터(`ResolvingMetadata`)를 상속 및 확장하는 패턴과 세그먼트 간 병합(Merging) 및 평가 순서(Ordering) 규칙을 파악한다.

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
> - 파일 기반 메타데이터([`opengraph-image.tsx`](../3.1-file-conventions/3.1.21-metadata/opengraph-image.md), `favicon.ico` 등)가 설정 객체보다 우선순위가 높다.
> - Next.js 14부터 `viewport`, `themeColor`, `colorScheme` 속성은 메타데이터 객체에서 분리되었으며 전용 API인 [`generateViewport`](./generate-viewport.md)를 사용해야 한다.

### 매개변수 (Parameters)

`generateMetadata` 함수는 다음 두 개의 인자를 받는다.

1. **`props`**: 현재 라우트 세그먼트의 매개변수를 담은 객체
   - `params`: 현재 라우트의 다이나믹 매개변수 객체를 반환하는 `Promise` (Next.js 15+는 비동기 Promise)
   - `searchParams`: 현재 URL의 쿼리 스트링 매개변수를 담은 `Promise` (오직 `page.js`에서만 사용 가능하며, `layout.js`에는 제공되지 않음)
2. **`parent`**: 상위 라우트 세그먼트의 해결된 메타데이터에 접근할 수 있는 `ResolvingMetadata` 객체 (`await parent`로 호출)

---

### 주요 메타데이터 필드 (Metadata Fields)

Next.js `Metadata` 객체는 표준 HTML 메타 태그와 소셜 메타 태그를 완벽히 지원한다.

| 필드명 | 타입 | 설명 및 예시 |
|---|---|---|
| **`title`** | `string \| { template, default, absolute }` | 브라우저 탭 및 검색 결과 제목 |
| **`description`** | `string` | 페이지 요약 설명 (`<meta name="description">`) |
| **`metadataBase`** | `URL` | 상대 경로 URL들을 결합하기 위한 기준 도메인 URL |
| **`openGraph`** | `OpenGraph` | Facebook/카카오톡 등 소셜 공유용 Open Graph 메타 태그 (`title`, `description`, `url`, `siteName`, `images`, `locale`, `type`) |
| **`twitter`** | `Twitter` | Twitter(X) 카드 메타 태그 (`card`, `title`, `description`, `siteId`, `creator`, `images`) |
| **`robots`** | `Robots \| string` | 검색 엔진 크롤러 제어 (`index`, `follow`, `nocache`, `googleBot`) |
| **`icons`** | `Icon \| Array` | 파비콘 및 앱 아이콘 설정 (`icon`, `shortcut`, `apple`, `other`) |
| **`alternates`** | `Alternates` | 다국어 대체 URL(`languages`) 및 표준 링크(`canonical`) |
| **`manifest`** | `string \| URL` | 웹 앱 매니페스트(`manifest.json`) 파일 경로 |
| **`verification`** | `Verification` | 검색 엔진 소유권 확인 태그 (`google`, `yandex`, `yahoo`, `other`) |
| **`appleWebApp`** | `AppleWebApp` | iOS Safari 웹 앱 설정 (`capable`, `title`, `statusBarStyle`) |
| **`appLinks`** | `AppLinks` | 모바일 딥링크를 위한 App Links 메타 태그 |
| **`archives` / `assets`** | `Array<string>` | 문서 아카이브 및 자산 URL 목록 |
| **`category`** | `string` | 페이지 카테고리 메타 태그 |
| **`other`** | `Record<string, string \| number \| Array>` | 표준 규격에 없는 커스텀 `<meta>` 태그 키-값 쌍 |

---

### 세부 필드 설정 패턴

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

상대 경로로 작성된 이미지 URL이나 canonical 링크를 완전한 절대 URL로 결합하기 위한 베이스 URL 접두사다.

```tsx filename="app/layout.tsx"
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  openGraph: {
    images: '/og-image.png', // https://example.com/og-image.png 로 자동 변환
  },
}
```

#### 3. `robots` (크롤러 색인 제어)

```tsx filename="app/admin/page.tsx"
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}
```

#### 4. `alternates` (Canonical 및 다국어 지원)

```tsx filename="app/about/page.tsx"
export const metadata: Metadata = {
  alternates: {
    canonical: '/about',
    languages: {
      'en-US': '/en/about',
      'ko-KR': '/ko/about',
    },
  },
}
```

---

### 메타데이터 병합(Merging) 및 평가 순서(Ordering)

1. **평가 순서 (Top-Down)**: 루트 레이아웃(`app/layout.tsx`)부터 중첩 레이아웃, 최종 `page.tsx` 순서로 순차 평가된다.
2. **병합 규칙 (Shallow Overwrite)**: 동일한 키가 여러 레벨에서 정의되면 가장 가까운 리프(Leaf) 세그먼트의 값이 상위 값을 덮어쓴다. 단, `openGraph`나 `robots` 같은 중첩 객체 필드는 키 단위로 얕은 병합(Shallow merge)된다.
3. **상속 확장 (`parent`)**: 하위 세그먼트에서 상위 메타데이터를 재활용하고 싶을 때는 `parent: ResolvingMetadata`를 `await`하여 상위 배열이나 객체(예: 상위 OG 이미지 목록)를 펼쳐서 합성할 수 있다.

---

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `params` 및 `searchParams`가 `Promise` 타입으로 비동기화 |
| `v14.0.0` | `viewport` 및 `themeColor` 설정이 `generateViewport`로 분리 |
| `v13.0.0` | App Router에 `generateMetadata` 및 `metadata` 도입 |

## 예제 및 데모 설계

- 루트 레이아웃에 `title.template`을 정의하고 하위 다이나믹 상세 페이지에서 반환된 타이틀이 `%s` 위치에 결합되는지 브라우저 탭과 `<head>` 태그에서 확인한다.
- `generateMetadata`와 `Page` 컴포넌트 모두에서 동일한 `fetch(id)`를 호출했을 때 네트워크 중복 없이 캐시되는 메모이제이션을 검증한다.
- `metadataBase`를 설정했을 때 상대 경로의 `og:image`가 온전한 절대 경로 메타 태그로 렌더링되는지 테스트한다.
- `parent: ResolvingMetadata`를 활용하여 상위 레이아웃의 브랜드 OG 이미지를 보존하면서 상품별 이미지를 추가하는 병합 데모를 구성한다.

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

2. `generateMetadata`에서 `searchParams`를 읽을 수 있는 위치에 대한 설명으로 올바른 것은?
   - A. `layout.tsx`와 `page.tsx` 모두에서 읽을 수 있다.
   - B. `layout.tsx`에서만 읽을 수 있다.
   - C. `page.tsx`에서만 읽을 수 있고, `layout.tsx`에는 제공되지 않는다.
   - D. Client Component에서만 읽을 수 있다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: `searchParams`는 내비게이션 시 레이아웃이 다시 렌더링되지 않도록 하기 위해 `layout.js`에는 전달되지 않으며 오직 `page.js`의 `generateMetadata` 및 페이지 컴포넌트에만 전달된다.
</details>

3. 상대 경로 메타데이터 이미지(`/og.png`)를 완전한 절대 URL(`https://example.com/og.png`)로 변환하기 위해 루트 레이아웃에 설정하는 속성은?
   - A. `baseUrl`
   - B. `metadataBase`
   - C. `domainUrl`
   - D. `origin`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `metadataBase` 속성에 `new URL('https://example.com')`을 지정하면 모든 상대 경로 메타데이터 URL이 절대 URL로 자동 해결된다.
</details>

## 챕터 요약

- `generateMetadata`는 비동기 데이터에 기반하여 `<head>` 메타데이터를 동적으로 생성하는 Server Component 함수다.
- `title.template`과 `title.absolute`를 통해 사이트 전반의 일관된 타이틀 체계를 구성한다.
- `metadataBase`는 상대 URL을 완전한 절대 URL로 자동 병합한다.
- `openGraph`, `twitter`, `robots`, `alternates`, `verification` 등 방대한 메타 태그를 단일 객체로 선언할 수 있다.
- 상위 메타데이터는 2번째 인자인 `ResolvingMetadata`를 통해 비동기로 접근하고 확장할 수 있다.
- 동일 렌더 트리 내 중복 데이터 패칭은 자동 메모이제이션된다.
