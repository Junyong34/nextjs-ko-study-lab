# generateViewport

- 공식 문서: [generateViewport](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 브라우저의 뷰포트(`<meta name="viewport">`) 및 테마 색상(`<meta name="theme-color">`)을 동적으로 설정하는 `generateViewport` 함수의 역할을 이해한다.
- 정적 `viewport` 객체와 동적 `generateViewport` 함수의 차이를 파악한다.
- 미디어 쿼리(`prefers-color-scheme`) 기반의 다크 모드 및 라이트 모드 `themeColor`를 구성한다.
- 메타데이터 스트리밍과의 차이점 및 Cache Components 환경에서의 동작 제약을 고려한다.

## 핵심 개념 및 설명

Next.js 14부터 뷰포트 및 테마 색상 관련 설정은 `metadata` 객체에서 분리되어, 정적 `viewport` 객체 또는 동적 `generateViewport` 함수를 통해 정의된다.

`generateViewport`는 **오직 Server Component에서만 지원**된다.

```tsx filename="app/layout.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

> **알아두면 좋은 점**:
>
> - 한 파일 안에서 `viewport` 객체와 `generateViewport` 함수를 동시에 export할 수 없다.
> - 일반 `metadata`와 달리 `viewport`는 브라우저의 초기 화면 레이아웃과 렌더링에 직접적인 영향을 주므로 **스트리밍(Streaming)될 수 없다.** 따라서 `generateViewport`가 지연되면 초기 페이지 응답이 블로킹될 수 있다.
> - 동적 데이터가 필요하지만 런타임 요청 데이터가 아니라면 `'use cache'`를 함께 활용하는 것이 권장된다.

### 주요 뷰포트 필드 (Viewport Fields)

#### 1. `themeColor`
- 단일 색상 문자열 또는 미디어 쿼리 배열을 지정한다.
  ```tsx
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ]
  ```

#### 2. `colorScheme`
- 지원 색상 테마 (`'light'`, `'dark'`, `'light dark'`).

#### 3. 모바일 뷰포트 크기 및 스케일 제어
- `width`: `'device-width'` 또는 숫자.
- `initialScale`: 초기 배율 (기본값: `1`).
- `maximumScale`: 최대 확대 배율.
- `userScalable`: 사용자 확대/축소 허용 여부 (`boolean`).

### 동적 `generateViewport` 함수 예제

```tsx filename="app/category/[id]/page.tsx" switcher
import type { Viewport } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const { id } = await params
  const category = await db.category.findUnique({ where: { id } })

  return {
    themeColor: category?.brandColor || '#000000',
  }
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params
  return <div>카테고리: {id}</div>
}
```

```jsx filename="app/category/[id]/page.js" switcher
export async function generateViewport({ params }) {
  const { id } = await params
  const category = await db.category.findUnique({ where: { id } })

  return {
    themeColor: category?.brandColor || '#000000',
  }
}

export default async function CategoryPage({ params }) {
  const { id } = await params
  return <div>카테고리: {id}</div>
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v14.0.0` | `viewport` 및 `generateViewport` 도입 (`metadata`에서 분리) |

## 예제 및 데모 설계

- OS 다크 모드 전환 시 브라우저 상단 주소창 테마 색상이 라이트(#ffffff)와 다크(#000000)로 자동 반응하는지 모바일 및 데스크톱 브라우저에서 검증한다.
- `generateViewport`에 카테고리별 브랜드 색상을 매핑하여 라우트 전환에 따른 메타 태그 변화를 확인한다.
- `width=device-width`, `initial-scale=1` 등의 기본 뷰포트 메타 태그가 올바르게 주입되는지 확인한다.

## 연습 문제

1. Next.js에서 다크 모드와 라이트 모드에 따라 브라우저 주소창 테마 색상을 다르게 지정하는 올바른 `themeColor` 설정 방식은?
   - A. `themeColor: 'auto'`
   - B. `themeColor: [{ media: '(prefers-color-scheme: light)', color: '#fff' }, { media: '(prefers-color-scheme: dark)', color: '#000' }]`
   - C. `metadata.theme = { dark: '#000', light: '#fff' }`
   - D. `next.config.js`의 `themeColor` 배열

<details><summary>정답 보기</summary>

정답: **B**  
해설: `Viewport` 인터페이스의 `themeColor`는 `prefers-color-scheme` 미디어 쿼리 조건 객체들의 배열을 지원하여 시스템 테마에 맞는 색상을 동적으로 제공한다.
</details>

2. `generateMetadata`와 비교하여 `generateViewport`가 가지는 주요 차이점은?
   - A. `generateViewport`는 Client Component에서만 실행된다.
   - B. `generateViewport`는 초기 화면 렌더링에 즉시 필요하므로 메타데이터처럼 스트리밍될 수 없다.
   - C. `generateViewport`는 비동기 호출을 지원하지 않는다.
   - D. `generateViewport`는 TypeScript를 지원하지 않는다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 뷰포트는 초기 브라우저 렌더링 영역 크기와 직결되므로 스트리밍으로 지연 주입될 수 없으며 초기 HTML과 함께 즉시 해석되어야 한다.
</details>

## 챕터 요약

- `generateViewport`와 `viewport`는 브라우저 뷰포트 및 테마 색상을 정의하는 Server Component 전용 API다.
- Next.js 14부터 기존 `metadata` 객체에서 독립되었다.
- 다크/라이트 모드별 `themeColor` 설정을 지원한다.
- 초기 렌더링 특성상 스트리밍이 불가능하므로 불필요한 동적 요청 지연을 피해야 한다.
