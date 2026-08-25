# ImageResponse

- 공식 문서: [ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- JSX와 CSS를 사용하여 동적 Open Graph(OG) 소셜 미디어 이미지를 생성하는 `ImageResponse` 생성자의 역할을 이해한다.
- [`opengraph-image.tsx`](../3.1-file-conventions/3.1.21-metadata/opengraph-image.md) 및 Route Handler에서 동적 이미지를 서빙하는 방법을 습득한다.
- Flexbox 기반 CSS 지원 범위와 커스텀 폰트(`fonts` 옵션) 로드 방식을 익힌다.
- 최대 번들 크기 제한(500KB)과 폰트 최적화(`ttf`/`otf`) 규칙을 준수한다.

## 핵심 개념 및 설명

`ImageResponse`는 React JSX 문법과 CSS(Flexbox)를 사용하여 동적으로 PNG 이미지를 렌더링하고 HTTP 응답으로 반환하는 `next/og`의 생성자 클래스다.

소셜 미디어 공유용 Open Graph 이미지, 트위터 카드, 동적 배너 등을 서버에서 즉시 합성할 때 주로 활용된다.

```tsx filename="app/api/og/route.tsx" switcher
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Next.js 학습 가이드'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        <div>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

```jsx filename="app/api/og/route.js" switcher
import { ImageResponse } from 'next/og'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Next.js 학습 가이드'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        <div>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### 지원 옵션 (Parameters)

```tsx filename="app/opengraph-image.tsx"
new ImageResponse(element: ReactElement, options?: ImageResponseOptions)
```

- `width`: 생성될 이미지 가로 너비 (기본값: `1200`px).
- `height`: 생성될 이미지 세로 높이 (기본값: `630`px).
- `emoji`: 이모지 렌더링 스타일 (`'twemoji'`, `'blobmoji'`, `'noto'`, `'openmoji'`).
- `fonts`: 커스텀 폰트 배열 (`{ name, data: ArrayBuffer, weight, style }[]`).
- `debug`: 레이아웃 디버깅 보더 표시 여부 (기본값: `false`).
- `status` / `headers`: HTTP 응답 상태코드 및 헤더.

> **알아두면 좋은 점**:
>
> - `ImageResponse`는 Vercel의 Satori 엔진을 사용하여 HTML/CSS를 SVG로 변환한 후 Resvg로 PNG를 생성한다.
> - CSS의 경우 **Flexbox 기반 레이아웃만 지원**하며, CSS Grid나 복잡한 애니메이션은 지원되지 않는다.
> - 폰트, 이미지, JSX를 포함한 전체 번들 크기는 **최대 500KB**로 제한된다.
> - 폰트 파싱 속도를 위해 `woff2`보다는 `ttf` 또는 `otf` 포맷이 권장된다.

### 예제: 커스텀 폰트를 사용한 `opengraph-image.tsx`

```tsx filename="app/blog/[slug]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = '블로그 포스트 OG 이미지'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fontData = await readFile(join(process.cwd(), 'assets/Pretendard-Bold.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 60,
          backgroundColor: '#111',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 32, color: '#888' }}>Next.js 블로그</div>
        <div style={{ fontSize: 64, fontWeight: 'bold' }}>{slug}</div>
        <div style={{ fontSize: 24, color: '#4ade80' }}>nextjs-ko-study-lab</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v14.0.0` | `ImageResponse`가 `next/server`에서 `next/og`로 이동 |
| `v13.0.0` | `@vercel/og` 기반의 `ImageResponse` 도입 |

## 예제 및 데모 설계

- 쿼리 파라미터 `?title=...`에 따라 동적으로 달라지는 OG 이미지를 생성하는 `/api/og` Route Handler를 구현한다.
- 동적 블로그 상세 라우트(`app/blog/[slug]/opengraph-image.tsx`)에 `ImageResponse`를 적용하여 실제 소셜 미리보기 태그가 생성되는지 검증한다.
- 지원되지 않는 CSS Grid 속성을 적용했을 때의 렌더링 한계를 확인한다.

## 연습 문제

1. `ImageResponse`에서 사용하는 CSS 레이아웃 모델로 올바른 것은?
   - A. `display: grid`
   - B. `display: table`
   - C. `display: flex` (Flexbox 기반)
   - D. `display: float`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `ImageResponse`를 구동하는 Satori 엔진은 Flexbox 레이아웃 모델 및 절대 위치 지정(absolute positioning)을 기반으로 동작하며 CSS Grid는 지원하지 않는다.
</details>

2. Next.js 최신 버전에서 `ImageResponse`를 가져오는 올바른 모듈 경로는?
   - A. `import { ImageResponse } from 'next/image'`
   - B. `import { ImageResponse } from 'next/og'`
   - C. `import { ImageResponse } from 'next/canvas'`
   - D. `import { ImageResponse } from 'next/media'`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 14부터 `ImageResponse`는 `next/og` 패키지에서 공식 제공된다.
</details>

## 챕터 요약

- `ImageResponse`는 JSX와 CSS를 조합하여 동적 PNG 이미지를 생성하는 `next/og`의 생성자다.
- Open Graph 소셜 미디어 미리보기 이미지 및 동적 배너 생성에 최적화되어 있다.
- Flexbox 기반 CSS 및 커스텀 TTF/OTF 폰트 등록을 지원한다.
- `opengraph-image.tsx` 파일 컨벤션 또는 Route Handler에서 직접 반환할 수 있다.
- 최대 번들 크기는 500KB 이내로 유지해야 한다.
