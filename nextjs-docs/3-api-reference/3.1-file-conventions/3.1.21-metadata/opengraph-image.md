# opengraph-image and twitter-image

- 공식 문서: [opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment별 social sharing image와 alt text를 정의한다.
- 정적 파일의 type·용량 제한과 코드 생성 방식을 이해한다.

## 핵심 개념 및 설명

`opengraph-image` 및 `twitter-image` 파일 규칙을 사용하면 라우트 세그먼트에 대해 Open Graph 및 Twitter 이미지를 설정할 수 있다.

사용자가 사이트 링크를 공유할 때 소셜 네트워크 및 메시징 앱에 표시되는 이미지를 설정하는 데 유용하다.

오픈 그래프 및 Twitter 이미지를 설정하는 방법에는 두 가지가 있다.

- [이미지 파일(.jpg, .png, .gif) 사용](#image-files-jpg-png-gif)
- [코드를 사용하여 이미지 생성(.js, .ts, .tsx)](#generate-images-using-code-js-ts-tsx)

<a id="image-files-jpg-png-gif"></a>
### 이미지 파일(.jpg, .png, .gif)

이미지 파일을 사용하여 세그먼트에 `opengraph-image` 또는 `twitter-image`이미지 파일을 배치하여 라우트 세그먼트의 공유 이미지를 설정한다.

Next.js는 파일을 평가하고 앱의 `<head>` 요소에 적절한 태그를 자동으로 추가한다.

| 파일 규칙 | 지원되는 파일 형식 |
| ----------------------------------------------- | ------------------------------- |
| [`opengraph-image`](#opengraph-image) | `.jpg`,`.jpeg`,`.png`,`.gif` |
| [`twitter-image`](#twitter-image) | `.jpg`,`.jpeg`,`.png`,`.gif` |
| [`opengraph-image.alt`](#opengraph-imagealttxt) | `.txt` |
| [`twitter-image.alt`](#twitter-imagealttxt) | `.txt` |

> **알아두면 좋은 점**:
>
> `twitter-image` 파일 크기는 [5MB](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary)를 초과할 수 없으며,`opengraph-image` 파일 크기는 [8MB](https://developers.facebook.com/docs/sharing/webmasters/images)를 초과할 수 없다. 이미지 파일 크기가 이러한 제한을 초과하면 빌드가 실패한다.

<a id="opengraph-image"></a>
#### `opengraph-image`

모든 라우트 세그먼트에 `opengraph-image.(jpg|jpeg|png|gif)`이미지 파일을 추가한다.

```html filename="<head> output"
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

<a id="twitter-image"></a>
#### `twitter-image`

모든 라우트 세그먼트에 `twitter-image.(jpg|jpeg|png|gif)`이미지 파일을 추가한다.

```html filename="<head> output"
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

<a id="opengraph-imagealttxt"></a>
#### `opengraph-image.alt.txt`

`opengraph-image.(jpg|jpeg|png|gif)`이미지의 대체 텍스트와 동일한 라우트 세그먼트에 함께 제공되는 `opengraph-image.alt.txt` 파일을 추가한다.

```txt filename="opengraph-image.alt.txt"
About Acme
```

```html filename="<head> output"
<meta property="og:image:alt" content="About Acme" />
```

<a id="twitter-imagealttxt"></a>
#### `twitter-image.alt.txt`

`twitter-image.(jpg|jpeg|png|gif)`이미지의 대체 텍스트와 동일한 라우트 세그먼트에 함께 제공되는 `twitter-image.alt.txt` 파일을 추가한다.

```txt filename="twitter-image.alt.txt"
About Acme
```

```html filename="<head> output"
<meta name="twitter:image:alt" content="About Acme" />
```

<a id="generate-images-using-code-js-ts-tsx"></a>
### 코드(.js, .ts, .tsx)를 사용하여 이미지 생성

[리터럴 이미지 파일](#image-files-jpg-png-gif)을 사용하는 것 외에도 코드를 사용하여 프로그래밍 방식으로 이미지를 **생성**할 수 있다.

기본적으로 기능을 내보내는 `opengraph-image` 또는 `twitter-image` 경로를 생성하여 라우트 세그먼트의 공유 이미지를 생성한다.

| 파일 규칙 | 지원되는 파일 형식 |
| ----------------- | -------------------- |
| `opengraph-image` | `.js`,`.ts`,`.tsx` |
| `twitter-image` | `.js`,`.ts`,`.tsx` |

> **알아두면 좋은 점**:
>
> - 기본적으로 생성된 이미지는 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 캐시되지 않은 데이터를 사용하지 않는 한 [**정적으로 최적화됨**](../../../4-glossary/README.md#prerendering)(빌드 시 생성되고 캐시됨)이다.
> - [`generateImageMetadata`](../../3.3-functions/generate-image-metadata.md)를 사용하여 동일한 파일에 여러 이미지를 생성할 수 있다.
> - `opengraph-image.js` 및 `twitter-image.js`는 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 [동적 구성](../../../2-guides/caching-without-cache-components.md#dynamic) 옵션을 사용하지 않는 한 기본적으로 캐시되는 특수 Route Handler이다.

이미지를 생성하는 가장 쉬운 방법은 `next/og`의 [ImageResponse](../../3.3-functions/image-response.md) API를 사용하는 것이다.

```tsx filename="app/about/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// 이미지 메타데이터
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const interSemiBold = await readFile(
  join(process.cwd(), 'assets/Inter-SemiBold.ttf')
)

// 이미지 생성
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX 요소
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
        About Acme
      </div>
    ),
    // 이미지응답 옵션
    {
      // 편의를 위해 내보낸 opengraph-image를 재사용할 수 있다.
      // ImageResponse의 크기와 높이를 선택하려면 크기 구성을 사용한다.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```jsx filename="app/about/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// 이미지 메타데이터
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const interSemiBold = await readFile(
  join(process.cwd(), 'assets/Inter-SemiBold.ttf')
)

// 이미지 생성
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX 요소
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
        About Acme
      </div>
    ),
    // 이미지응답 옵션
    {
      // 편의를 위해 내보낸 opengraph-image를 재사용할 수 있다.
      // ImageResponse의 크기와 높이를 선택하려면 크기 구성을 사용한다.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```html filename="<head> output"
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

<a id="props"></a>
#### prop

기본 export 함수은 다음과 같은 속성을 받는다:

<a id="params-optional"></a>
##### `params`(옵션)

루트 세그먼트부터 `opengraph-image` 또는 `twitter-image` 세그먼트까지 [다이나믹 라우트 매개변수](../dynamic-routes.md) 객체를 포함하는 객체로 확인되는 Promise는 같은 위치에 배치된다.

> **알아두면 좋은 점**: [`generateImageMetadata`](../../3.3-functions/generate-image-metadata.md)를 사용하는 경우 함수는 `generateImageMetadata`가 반환한 항목 중 하나에서 `id` 값으로 해결되는 Promise인 `id`prop도 수신한다.

```tsx filename="app/shop/[slug]/opengraph-image.tsx" switcher
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx filename="app/shop/[slug]/opengraph-image.js" switcher
export default async function Image({ params }) {
  const { slug } = await params
  // ...
}
```

| 라우트 | URL | `params` |
| ------------------------------------------ | ----------- | ---------------------------------- |
| `app/shop/opengraph-image.js` | `/shop` | `undefined` |
| `app/shop/[slug]/opengraph-image.js` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[tag]/[item]/opengraph-image.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

<a id="returns"></a>
#### 반환값

기본 export 함수은 `Response`를 반환해야 한다.

> **알아두면 좋은 점**: `ImageResponse`는 이 반환 유형을 만족한다.

<a id="config-exports"></a>
#### 구성 내보내기

선택적으로 `opengraph-image` 또는 `twitter-image` 경로에서 `alt`,`size` 및 `contentType` 변수를 내보내 이미지의 메타데이터를 구성할 수 있다.

| 옵션 | 유형 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`alt`](#alt) | `string` |
| [`size`](#size) | `{ width: number; height: number }` |
| [`contentType`](#contenttype) | `string`- [이미지 MIME 유형](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

<a id="alt"></a>
##### `alt`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:alt" content="My images alt text" />
```

<a id="size"></a>
##### `size`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

<a id="contenttype"></a>
##### `contentType`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const contentType = 'image/png'

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const contentType = 'image/png'

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:type" content="image/png" />
```

<a id="route-segment-config"></a>
##### 라우트 세그먼트 구성

`opengraph-image` 및 `twitter-image`는 페이지 및 레이아웃과 동일한 [라우트 세그먼트 구성](../3.1.22-route-segment-config/README.md) 옵션을 사용할 수 있는 특수한 [Route Handler](../route.md)이다.

<a id="examples"></a>
#### 예

<a id="using-external-data"></a>
##### 외부 데이터 사용

이 예에서는 `params` 객체와 외부 데이터를 사용하여 이미지를 생성한다.

> **알아두면 좋은 점**:
> 기본적으로 이 생성된 이미지는 정적으로 최적화된다. 개별 `fetch`[`options`](../../3.3-functions/fetch.md) 또는 라우트 세그먼트 [옵션](../../../2-guides/caching-without-cache-components.md#route-segment-config-revalidate)을 구성하여 이 동작을 변경할 수 있다.

```tsx filename="app/posts/[slug]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
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
    ),
    {
      ...size,
    }
  )
}
```

```jsx filename="app/posts/[slug]/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
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
    ),
    {
      ...size,
    }
  )
}
```

<a id="using-nodejs-runtime-with-local-assets"></a>
##### 로컬 자산과 함께 Node.js 런타임 사용

이 예제에서는 Node.js 런타임을 사용하여 파일 시스템에서 로컬 이미지를 가져와 `<img>``src` 속성에 base64 문자열 또는 `ArrayBuffer`로 전달한다. 예제 소스 파일이 아닌 프로젝트 루트를 기준으로 로컬 자산을 배치한다.

자산은 요청 데이터에 의존하지 않으므로 모듈 범위에서 한 번 읽는다. [예측 가능한 값](../../../1-getting-started/caching.md#predictable-values)을 참조한다.

```tsx filename="app/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

```jsx filename="app/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

`ArrayBuffer`를 `<img>` 요소의 `src` 속성에 전달하는 것은 HTML 사양의 일부가 아닙니다.`next/og`에서 사용하는 렌더링 엔진은 이를 지원하지만 TypeScript 정의는 사양을 따르기 때문에 이 [기능](https://github.com/vercel/satori/issues/606#issuecomment-2144000453)을 사용하려면 `@ts-expect-error` 지시문이나 이와 유사한 지시문이 필요하다.

```tsx filename="app/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'))
const logoSrc = Uint8Array.from(logoData).buffer

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

```jsx filename="app/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'))
const logoSrc = Uint8Array.from(logoData).buffer

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ---------------------------------------------------- |
| `v16.0.0` | `params`는 이제 객체로 해결되는 Promise이다. |
| `v13.3.0` | `opengraph-image` 및 `twitter-image`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 blog slug별 Open Graph image와 alt를 생성하고 meta tag를 검사한다.
- 제한을 넘는 파일의 빌드 오류와 여러 image의 정렬을 확인한다.

## 연습 문제

1. Twitter image의 최대 파일 크기는?
   - A. 1MB
   - B. 5MB
   - C. 8MB

<details><summary>정답 보기</summary>

정답: B. Twitter image는 5MB, Open Graph image는 8MB 제한이다.
</details>

## 챕터 요약

- social image는 route segment별로 정의할 수 있다.
- 정적 image와 코드 생성 variant를 지원한다.
- `.alt.txt`로 접근 가능한 설명을 제공한다.
- Twitter 5MB, Open Graph 8MB 제한이 있다.
- `generateImageMetadata`로 여러 image를 만들 수 있다.
