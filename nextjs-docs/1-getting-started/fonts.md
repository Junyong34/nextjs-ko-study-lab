# Font Optimization

- 공식 문서: [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next/font`가 일반적인 웹 폰트 로딩 방식과 비교해 어떤 문제(외부 네트워크 요청, 레이아웃 시프트)를 해결하는지 설명할 수 있다.
- `next/font/google`로 Google Font를 self-host하는 방법과, variable font를 쓸 수 없을 때 `weight`를 지정해야 하는 이유를 안다.
- `next/font/local`로 로컬 폰트 파일을 사용하는 방법과, 하나의 폰트 패밀리에 여러 weight·style 파일을 지정하는 방법을 안다.
- 폰트가 사용된 컴포넌트에 스코프된다는 점과, 앱 전체에 적용하려면 Root Layout에 추가해야 한다는 점을 이해한다.

## 핵심 개념 및 설명

[`next/font`](../3-api-reference/3.2-components/font.md) 모듈은 폰트를 자동으로 최적화하고 외부 네트워크 요청을 제거해서, 프라이버시와 성능을 함께 개선한다.

이 모듈은 모든 폰트 파일에 대해 **빌트인 self-hosting**을 지원한다. 즉 레이아웃 시프트 없이 웹 폰트를 최적으로 로드할 수 있다.

`next/font`를 쓰려면 [`next/font/local`](#로컬-폰트) 또는 [`next/font/google`](#google-fonts)에서 import한 뒤, 적절한 옵션과 함께 함수로 호출하고, 폰트를 적용하려는 엘리먼트의 `className`을 지정한다.

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

폰트는 사용된 컴포넌트에 스코프된다. 앱 전체에 폰트를 적용하려면 [Root Layout](../3-api-reference/3.1-file-conventions/layout.md)에 추가한다.

### Google fonts

모든 Google Font를 자동으로 self-host할 수 있다. 폰트는 정적 자산으로 포함되어 배포 도메인과 같은 도메인에서 서빙되므로, 사용자가 사이트를 방문할 때 브라우저가 Google로 요청을 보내지 않는다.

Google Font를 쓰려면 원하는 폰트를 `next/font/google`에서 import한다.

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

성능과 유연성을 위해 [variable font](https://fonts.google.com/variablefonts)를 쓰는 것을 권장한다. 다만 variable font를 쓸 수 없다면 `weight`를 지정해야 한다.

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 로컬 폰트

로컬 폰트를 쓰려면 `next/font/local`에서 `localFont` 함수를 import하고, 로컬 폰트 파일의 [`src`](../3-api-reference/3.2-components/font.md)를 지정한다. 이 경로는 `localFont`가 호출된 파일을 기준으로 해석된다. 폰트는 [`public`](../3-api-reference/3.1-file-conventions/public-folder.md) 폴더를 포함해 프로젝트 어디에나 저장할 수 있고, `app` 폴더 안에 같이 둘 수도 있다. 예를 들어 `app/fonts/`에 저장된 폰트를 쓴다면 다음과 같다.

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

하나의 폰트 패밀리에 여러 파일을 쓰고 싶다면 `src`를 배열로 지정할 수 있다.

```tsx
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 웹 폰트를 `<link>` 태그로 직접 불러오는 방식과 `next/font/google`로 불러오는 방식을 나란히 두고, 네트워크 요청 대상과 레이아웃 시프트 차이를 비교한다.
- 사용자가 확인할 화면과 상호작용: 네트워크 탭에서 폰트 요청이 배포 도메인에서 오는지, Google 도메인으로 나가는지 확인. 느린 네트워크로 스로틀링한 뒤 폰트가 로딩되는 동안 텍스트 레이아웃이 흔들리는지 비교.
- 예제에서 관찰할 결과: `next/font` 사용 시 Google로 나가는 요청이 없고, 폰트 로딩 중에도 레이아웃 시프트가 발생하지 않는 것.

## 연습 문제

**Q1. (단일 선택) `next/font`가 자동으로 해주는 것이 아닌 것은?**

1. 폰트 파일의 self-hosting
2. 외부 네트워크 요청 제거
3. 레이아웃 시프트 없이 폰트 로딩
4. 이미지 포맷을 WebP로 자동 변환

<details>
<summary>정답 보기</summary>

**정답: 4** — 이미지 포맷 변환은 `next/image`의 기능이다. `next/font`는 폰트 파일의 self-hosting, 외부 요청 제거, 레이아웃 시프트 방지를 담당한다.

</details>

**Q2. (단일 선택) `next/font/google`로 폰트를 쓸 때 variable font를 사용할 수 없다면 반드시 지정해야 하는 옵션은?**

1. `subsets`
2. `weight`
3. `display`
4. `preload`

<details>
<summary>정답 보기</summary>

**정답: 2** — variable font는 하나의 파일로 여러 굵기를 표현하지만, variable font를 쓸 수 없는 폰트는 `weight`를 명시해야 한다.

</details>

**Q3. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] 폰트는 기본적으로 앱 전체에 적용되며, 특정 컴포넌트에만 스코프할 수는 없다.
- [ ] Google Font를 쓰면 폰트 파일이 정적 자산으로 포함되어 배포 도메인에서 서빙된다.
- [ ] `localFont`의 `src` 경로는 `localFont`가 호출된 파일을 기준으로 해석된다.
- [ ] 로컬 폰트 파일은 `public` 폴더에만 저장할 수 있고 `app` 폴더 안에는 둘 수 없다.

<details>
<summary>정답 보기</summary>

**정답: 2, 3** — 폰트는 사용된 컴포넌트에 스코프되며, 앱 전체에 적용하려면 Root Layout에 추가해야 한다. 로컬 폰트 파일은 `public` 폴더뿐 아니라 `app` 폴더 안에 같이 둘 수도 있다.

</details>

## 챕터 요약

- `next/font`는 폰트 파일을 self-host하고 외부 네트워크 요청을 제거해서 프라이버시와 성능을 함께 개선하며, 레이아웃 시프트 없이 폰트를 로드한다.
- 폰트는 `next/font/local` 또는 `next/font/google`에서 import해 함수로 호출하고, 그 결과의 `className`을 엘리먼트에 지정해서 사용한다.
- 폰트는 사용된 컴포넌트에 스코프되므로, 앱 전체에 적용하려면 Root Layout에 추가해야 한다.
- Google Font는 정적 자산으로 배포 도메인에서 서빙되며, variable font를 쓸 수 없을 때는 `weight`를 직접 지정해야 한다.
- 로컬 폰트는 `localFont`의 `src`로 지정하며, 프로젝트 어디에나 저장할 수 있고 배열로 여러 weight·style 파일을 함께 지정할 수 있다.
