# favicon, icon, and apple-icon

- 공식 문서: [favicon, icon, and apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- favicon·일반 icon·Apple touch icon의 type과 위치 제약을 구분한다.
- 정적 image와 `ImageResponse` 기반 생성 방식을 선택한다.
- 생성 함수의 params·size·contentType 설정을 이해한다.

## 핵심 개념 및 설명

`favicon`,`icon` 또는 `apple-icon` 파일 규칙을 사용하면 애플리케이션에 대한 아이콘을 설정할 수 있다.

웹 브라우저 탭, 휴대폰 홈 화면, 검색 엔진 결과 등의 위치에 표시되는 앱 아이콘을 추가하는 데 유용하다.

앱 아이콘을 설정하는 방법에는 두 가지가 있다.

- [이미지 파일(.ico, .jpg, .png) 사용](#image-files-ico-jpg-png)
- [코드를 사용하여 아이콘 생성(.js, .ts, .tsx)](#generate-icons-using-code-js-ts-tsx)

<a id="image-files-ico-jpg-png"></a>
### 이미지 파일(.ico, .jpg, .png)

`favicon`,`icon` 또는 `apple-icon`이미지 파일을 `/app` 디렉터리에 배치하여 이미지 파일을 사용하여 앱 아이콘을 설정한다.`favicon`이미지는 `app/`의 최상위 레벨에만 위치할 수 있다.

Next.js는 파일을 평가하고 앱의 `<head>` 요소에 적절한 태그를 자동으로 추가한다.

| 파일 규칙 | 지원되는 파일 형식 | 유효한 위치 |
| --------------------------- | --------------------------------------- | --------------- |
| [`favicon`](#favicon) | `.ico` | `app/` |
| [`icon`](#icon) | `.ico`,`.jpg`,`.jpeg`,`.png`,`.svg` | `app/**/*` |
| [`apple-icon`](#apple-icon) | `.jpg`,`.jpeg`,`.png` | `app/**/*` |

<a id="favicon"></a>
#### `favicon`

`favicon.ico`이미지 파일을 루트 `/app` 라우트 세그먼트에 추가한다.

```html filename="<head> output"
<link rel="icon" href="/favicon.ico" sizes="any" />
```

<a id="icon"></a>
#### `icon`

`icon.(ico|jpg|jpeg|png|svg)`이미지 파일을 추가한다.

```html filename="<head> output"
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

<a id="apple-icon"></a>
#### `apple-icon`

`apple-icon.(jpg|jpeg|png)`이미지 파일을 추가한다.

```html filename="<head> output"
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

> **알아두면 좋은 점**:
>
> - 파일 이름에 숫자 접미사를 추가하여 여러 개의 아이콘을 설정할 수 있다. 예를 들어 `icon1.png`,`icon2.png` 등이다. 번호가 매겨진 파일은 사전순으로 정렬된다.
> - 파비콘은 루트 `/app` 세그먼트에만 설정할 수 있다. 더 세부적인 내용이 필요한 경우 [`icon`](#icon)를 사용할 수 있다.
> - `rel`,`href`,`type` 및 `sizes`와 같은 적절한 `<link>` 태그 및 속성은 평가된 파일의 아이콘 유형 및 메타데이터에 따라 결정된다.
> - 예를 들어 32 x 32px`.png` 파일에는 `type="image/png"` 및 `sizes="32x32"` 속성이 있다.
> - 확장자가 `.svg`이거나 파일의 이미지 크기가 결정되지 않은 경우 아이콘에 `sizes="any"`가 추가된다. 자세한 내용은 이 [파비콘 핸드북](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)을 참조한다.

<a id="generate-icons-using-code-js-ts-tsx"></a>
### 코드(.js, .ts, .tsx)를 사용하여 아이콘 생성

[리터럴 이미지 파일](#image-files-ico-jpg-png)을 사용하는 것 외에도 코드를 사용하여 프로그래밍 방식으로 아이콘을 **생성**할 수 있다.

기본적으로 함수를 내보내는 `icon` 또는 `apple-icon` 경로를 생성하여 앱 아이콘을 생성한다.

| 파일 규칙 | 지원되는 파일 형식 |
| --------------- | -------------------- |
| `icon` | `.js`,`.ts`,`.tsx` |
| `apple-icon` | `.js`,`.ts`,`.tsx` |

아이콘을 생성하는 가장 쉬운 방법은 `next/og`의 [`ImageResponse`](../../3.3-functions/image-response.md) API를 사용하는 것이다.

```tsx filename="app/icon.tsx" switcher
import { ImageResponse } from 'next/og'

// 이미지 메타데이터
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 이미지 생성
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX 요소
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // 이미지응답 옵션
    {
      // 편의를 위해 내보낸 아이콘 크기 메타데이터를 재사용할 수 있다.
      // ImageResponse의 범위와 높이도 설정된다.
      ...size,
    }
  )
}
```

```jsx filename="app/icon.js" switcher
import { ImageResponse } from 'next/og'

// 이미지 메타데이터
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 이미지 생성
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX 요소
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // 이미지응답 옵션
    {
      // 편의를 위해 내보낸 아이콘 크기 메타데이터를 재사용할 수 있다.
      // ImageResponse의 범위와 높이도 설정된다.
      ...size,
    }
  )
}
```

```html filename="<head> output"
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

> **알아두면 좋은 점**:
>
> - 기본적으로 생성된 아이콘은 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 캐시되지 않은 데이터를 사용하지 않는 한 [**정적으로 최적화됨**](../../../4-glossary/README.md#prerendering)(빌드 시 생성되고 캐시됨)이다.
> - [`generateImageMetadata`](../../3.3-functions/generate-image-metadata.md)를 사용하여 동일한 파일에 여러 개의 아이콘을 생성할 수 있다.
> - `favicon` 아이콘을 생성할 수 없다. 대신 [`icon`](#icon) 또는 [favicon.ico](#favicon) 파일을 사용한다.
> - 앱 아이콘은 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 [동적 구성](../../../2-guides/caching-without-cache-components.md#dynamic) 옵션을 사용하지 않는 한 기본적으로 캐시되는 특수 Route Handler이다.

<a id="props"></a>
#### prop

기본 export 함수은 다음과 같은 속성을 받는다:

<a id="params-optional"></a>
##### `params`(옵션)

루트 세그먼트부터 `icon` 또는 `apple-icon` 세그먼트까지 [다이나믹 라우트 매개변수](../dynamic-routes.md) 객체를 포함하는 객체로 확인되는 Promise는 같은 위치에 배치된다.

> **알아두면 좋은 점**: [`generateImageMetadata`](../../3.3-functions/generate-image-metadata.md)를 사용하는 경우 함수는 `generateImageMetadata`가 반환한 항목 중 하나에서 `id` 값으로 해결되는 Promise인 `id`prop도 수신한다.

```tsx filename="app/shop/[slug]/icon.tsx" switcher
export default async function Icon({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx filename="app/shop/[slug]/icon.js" switcher
export default async function Icon({ params }) {
  const { slug } = await params
  // ...
}
```

| 라우트 | URL | `params` |
| ------------------------------- | ----------- | ---------------------------------- |
| `app/shop/icon.js` | `/shop` | `undefined` |
| `app/shop/[slug]/icon.js` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

<a id="returns"></a>
#### 반환값

기본 export 함수은 `Blob`|`ArrayBuffer`|`TypedArray`|`DataView`|`ReadableStream`|`Response`.

> **알아두면 좋은 점**: `ImageResponse`는 이 반환 유형을 만족한다.

<a id="config-exports"></a>
#### 구성 내보내기

선택적으로 `icon` 또는 `apple-icon` 경로에서 `size` 및 `contentType` 변수를 내보내 아이콘의 메타데이터를 구성할 수 있다.

| 옵션 | 유형 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`size`](#size) | `{ width: number; height: number }` |
| [`contentType`](#contenttype) | `string`- [이미지 MIME 유형](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

<a id="size"></a>
##### `size`

```tsx filename="icon.tsx | apple-icon.tsx" switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```jsx filename="icon.js | apple-icon.js" switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```html filename="<head> output"
<link rel="icon" sizes="32x32" />
```

<a id="contenttype"></a>
##### `contentType`

```tsx filename="icon.tsx | apple-icon.tsx" switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```jsx filename="icon.js | apple-icon.js" switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```html filename="<head> output"
<link rel="icon" type="image/png" />
```

<a id="route-segment-config"></a>
##### 라우트 세그먼트 구성

`icon` 및 `apple-icon`는 페이지 및 레이아웃과 동일한 [라우트 세그먼트 구성](../3.1.22-route-segment-config/README.md) 옵션을 사용할 수 있는 특수한 [Route Handler](../route.md)이다.

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ---------------------------------------------------- |
| `v16.0.0` | `params`는 이제 객체로 해결되는 Promise이다. |
| `v13.3.0` | `favicon``icon` 및 `apple-icon` 출시 |

## 예제 및 데모 설계

- Phase 2에서 root favicon과 nested route icon을 만들고 head의 link tag를 비교한다.
- params 기반 동적 icon과 `generateImageMetadata`의 여러 결과를 확인한다.

## 연습 문제

1. nested segment에 둘 수 없는 것은?
   - A. `icon.png`
   - B. `apple-icon.png`
   - C. `favicon.ico`

<details><summary>정답 보기</summary>

정답: C. favicon은 `app` root에만 둔다.
</details>

## 챕터 요약

- favicon, icon, apple-icon은 서로 지원 type과 위치가 다르다.
- 정적 파일의 head prop은 Next.js가 계산한다.
- 숫자 suffix로 여러 icon을 정의할 수 있다.
- 코드 생성 variant는 `ImageResponse` 등을 반환한다.
- 다이나믹 생성 함수는 Promise params를 받을 수 있다.
