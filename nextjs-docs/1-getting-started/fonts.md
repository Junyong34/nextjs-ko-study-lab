# Font Optimization

- 공식 문서: [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next/font`가 폰트를 최적화하고 외부 네트워크 요청을 제거하는 이유를 설명할 수 있다.
- `next/font/google`과 `next/font/local`을 사용해 Google Font와 로컬 폰트를 적용할 수 있다.
- 폰트를 특정 컴포넌트에만 적용할지, Root Layout을 통해 애플리케이션 전체에 적용할지 결정할 수 있다.
- variable font를 사용할 수 없는 경우 `weight`를 지정하고, 로컬 폰트 패밀리의 여러 파일을 하나의 설정으로 묶을 수 있다.

## 핵심 개념 및 설명

### `next/font`의 역할

`next/font` 모듈은 폰트를 자동으로 최적화하고 외부 네트워크 요청을 제거한다. 폰트 파일을 애플리케이션과 함께 self-hosting하므로, 사용자가 페이지를 방문할 때 별도의 폰트 공급자 요청을 보내지 않는다. 그 결과 개인정보 보호와 성능 측면의 이점을 얻을 수 있다.

또한 웹 폰트를 로드할 때 레이아웃 시프트가 발생하지 않도록 최적화한다. 폰트를 사용하려면 `next/font/local` 또는 `next/font/google`에서 로더를 import하고, 적절한 옵션으로 함수처럼 호출한다. 반환된 객체의 `className`을 폰트를 적용할 요소에 지정한다.

```tsx filename="app/layout.tsx"
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

폰트 설정은 해당 폰트를 사용하는 컴포넌트 범위에 적용된다. 애플리케이션 전체에 적용하려면 Root Layout에 폰트를 추가한다.

### Google fonts

Google Font는 `next/font/google`에서 원하는 폰트를 import해 사용한다. Next.js는 Google Font를 자동으로 self-hosting한다. 폰트는 정적 자산으로 포함되어 배포와 함께 애플리케이션과 같은 도메인에서 제공된다. 따라서 사용자가 사이트를 방문할 때 브라우저가 Google로 요청을 보내지 않는다.

```tsx filename="app/layout.tsx"
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

최상의 성능과 유연성을 위해 variable font를 사용하는 것을 권장한다. variable font를 사용할 수 없다면 폰트의 `weight`를 지정해야 한다.

```tsx filename="app/layout.tsx"
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

### Local fonts

로컬 폰트는 `next/font/local`에서 `localFont` 함수를 import하고 로컬 폰트 파일의 `src`를 지정해 사용한다. `src` 경로는 `localFont`를 호출한 파일을 기준으로 해석된다. 폰트 파일은 프로젝트 어디에나 둘 수 있으며, `public` 폴더에 저장하거나 `app` 폴더 안의 컴포넌트와 함께 배치할 수도 있다.

예를 들어 `app/fonts/`에 폰트를 저장했다면 다음처럼 설정한다.

```tsx filename="app/layout.tsx"
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

하나의 폰트 패밀리가 여러 파일로 구성되어 있다면 `src`에 배열을 전달한다. 각 파일의 `path`, `weight`, `style`을 지정해 일반체·기울임체·굵은체 같은 변형을 하나의 폰트 설정으로 묶을 수 있다.

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

### API Reference

폰트 로더가 지원하는 전체 옵션과 자세한 사용법은 [Font API Reference](../3-api-reference/3.2-components/font.md)에서 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 외부 CSS로 Google Font를 불러오는 방식과 `next/font`로 self-hosting하는 방식을 비교해, 폰트 요청과 레이아웃 안정성의 차이를 관찰한다.
- 사용자가 확인할 화면과 상호작용: Google Font, 로컬 폰트, 시스템 폴백 폰트를 적용한 세 개의 카드와 네트워크 요청 목록을 확인한다. Root Layout에 적용한 폰트와 특정 컴포넌트에만 적용한 폰트의 범위도 비교한다.
- 예제에서 관찰할 결과: `next/font`를 사용한 폰트가 애플리케이션의 정적 자산으로 제공되고, 브라우저가 Google에 별도의 폰트 요청을 보내지 않는 것을 확인한다. 폰트 로딩 전후에도 텍스트 레이아웃이 크게 이동하지 않는지 확인한다.

## 연습 문제

**Q1. (단일 선택) `next/font`를 사용했을 때 기대할 수 있는 동작은?**

1. 브라우저가 페이지 방문 때마다 Google에 폰트 파일을 요청한다.
2. 폰트 파일을 애플리케이션과 함께 self-hosting하고 외부 네트워크 요청을 제거한다.
3. 폰트를 사용하는 모든 컴포넌트에만 자동으로 전역 CSS를 주입한다.
4. 폰트의 `className`을 지정하지 않아도 모든 HTML 요소에 폰트를 적용한다.

<details>
<summary>정답 보기</summary>

**정답: 2** — `next/font`는 폰트를 애플리케이션의 정적 자산으로 self-hosting해 외부 네트워크 요청을 제거하고, 레이아웃 시프트를 줄이도록 최적화한다.

</details>

**Q2. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] Google Font는 `next/font/google`에서 import한다.
- [ ] variable font를 사용할 수 없다면 `weight`를 지정해야 한다.
- [ ] 로컬 폰트의 `src` 경로는 항상 프로젝트 루트 기준으로 작성한다.
- [ ] 애플리케이션 전체에 폰트를 적용하려면 Root Layout에 추가한다.

<details>
<summary>정답 보기</summary>

**정답: 1, 2, 4** — 로컬 폰트의 `src` 경로는 `localFont`를 호출한 파일을 기준으로 해석되므로 3번은 틀렸다.

</details>

**Q3. (단일 선택) 하나의 로컬 폰트 패밀리에 일반체·기울임체·굵은체 파일을 함께 등록하려면 어떻게 해야 하는가?**

1. `src`에 폰트 파일 하나만 전달하고 CSS에서 임의로 변형한다.
2. `src`에 파일 설정 배열을 전달하고 각 항목에 `path`, `weight`, `style`을 지정한다.
3. 모든 파일을 `public` 폴더에 두기만 하면 Next.js가 자동으로 같은 패밀리로 묶는다.
4. 각 파일마다 서로 다른 `localFont` 호출을 만들고 `className`을 하나만 선택한다.

<details>
<summary>정답 보기</summary>

**정답: 2** — `src` 배열의 각 항목에 파일 경로와 굵기·스타일 정보를 지정하면 여러 파일을 하나의 폰트 설정으로 구성할 수 있다.

</details>

## 챕터 요약

- `next/font`는 폰트를 자동으로 최적화하고 애플리케이션과 함께 self-hosting한다.
- `next/font/google`으로 Google Font를 사용하면 브라우저가 Google에 별도 요청을 보내지 않는다.
- 폰트는 사용하는 컴포넌트 범위에 적용되며, 전체 애플리케이션에 적용하려면 Root Layout에 등록한다.
- variable font를 사용할 수 없을 때는 `weight`를 지정한다.
- `next/font/local`의 `src`에는 하나의 파일이나 여러 파일의 설정 배열을 전달할 수 있다.
