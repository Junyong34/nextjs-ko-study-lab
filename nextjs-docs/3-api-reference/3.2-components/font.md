# Font

- 공식 문서: [Font](https://nextjs.org/docs/app/api-reference/components/font)
- 상위 메뉴: [Components](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `next/font`가 폰트를 자동으로 최적화하고 외부 네트워크 요청을 제거해 프라이버시와 성능을 개선하는 원리를 설명한다.
- `next/font/google`과 `next/font/local`의 차이를 이해하고, `src`, `weight`, `subsets`, `variable` 등 주요 옵션을 구분해 사용한다.
- `className`, `style`, CSS 변수 세 가지 방식으로 폰트 스타일을 적용하는 방법을 익힌다.
- 폰트 정의 파일(font definitions file)로 여러 곳에서 같은 폰트를 재사용하는 방법을 익힌다.

## 핵심 개념 및 설명

### Font Module이란

[`next/font`](https://nextjs.org/docs/app/api-reference/components/font)는 커스텀 폰트를 포함한 폰트를 자동으로 최적화하고, 외부 네트워크 요청을 제거해 프라이버시와 성능을 함께 개선한다.

모든 폰트 파일에 대해 **내장된 자동 셀프 호스팅(self-hosting)** 기능을 제공한다. 즉, [레이아웃 이동(layout shift)](https://web.dev/articles/cls) 없이 웹 폰트를 최적으로 불러올 수 있다.

[Google Fonts](https://fonts.google.com/)도 편리하게 사용할 수 있다. CSS와 폰트 파일은 빌드 시점에 다운로드되어 나머지 정적 자산과 함께 셀프 호스팅된다. **브라우저가 Google로 요청을 보내지 않는다.**

```tsx
import { Inter } from 'next/font/google'

// variable 폰트를 불러올 때는 font weight를 지정하지 않아도 된다
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

> **참고 영상**: `next/font` 사용법에 대해 더 알고 싶다면 [YouTube(6분)](https://www.youtube.com/watch?v=L8_98i_bMMA) 영상을 참고한다.

### Props

`next/font/google`, `next/font/local`에 전달할 수 있는 옵션은 다음과 같다. "적용 대상" 열은 해당 옵션이 어느 로더에서 쓰이는지를 나타낸다.

| Key | 적용 대상 | 타입 | 필수 여부 |
| --- | --- | --- | --- |
| src | next/font/local | String 또는 Array of Objects | Yes |
| weight | next/font/google, next/font/local | String 또는 Array | Required/Optional |
| style | next/font/google, next/font/local | String 또는 Array | - |
| subsets | next/font/google | Array of Strings | - |
| axes | next/font/google | Array of Strings | - |
| display | next/font/google, next/font/local | String | - |
| preload | next/font/google, next/font/local | Boolean | - |
| fallback | next/font/google, next/font/local | Array of Strings | - |
| adjustFontFallback | next/font/google, next/font/local | Boolean 또는 String | - |
| variable | next/font/google, next/font/local | String | - |
| declarations | next/font/local | Array of Objects | - |

#### src

폰트 파일의 경로다. 폰트 로더 함수가 호출된 디렉터리를 기준으로, 문자열 또는 객체 배열(`Array<{path: string, weight?: string, style?: string}>` 타입)로 지정한다.

`next/font/local`에서 사용한다.

- 필수

예시:

- `src:'./fonts/my-font.woff2'` — `my-font.woff2`가 `app` 디렉터리 안의 `fonts` 디렉터리에 있는 경우
- `src:[{path: './inter/Inter-Thin.ttf', weight: '100',},{path: './inter/Inter-Regular.ttf',weight: '400',},{path: './inter/Inter-Bold-Italic.ttf', weight: '700',style: 'italic',},]`
- 폰트 로더 함수를 `app/page.tsx`에서 `src:'../styles/fonts/my-font.ttf'`로 호출한다면, `my-font.ttf`는 프로젝트 루트의 `styles/fonts`에 위치한다

#### weight

폰트 [`weight`](https://fonts.google.com/knowledge/glossary/weight)는 다음 중 하나로 지정한다.

- 특정 폰트에서 사용 가능한 weight 값 하나를 나타내는 문자열, 또는 [variable](https://fonts.google.com/variablefonts) 폰트인 경우 범위를 나타내는 문자열
- variable이 아닌 [Google 폰트](https://fonts.google.com/variablefonts)라면 weight 값들의 배열. `next/font/google`에만 적용된다.

`next/font/google`, `next/font/local`에서 사용한다.

- 사용하는 폰트가 [variable](https://fonts.google.com/variablefonts)이 **아니라면** 필수

예시:

- `weight: '400'`: 단일 weight 값을 나타내는 문자열 — [`Inter`](https://fonts.google.com/specimen/Inter?query=inter) 폰트의 경우 가능한 값은 `'100'`, `'200'`, `'300'`, `'400'`, `'500'`, `'600'`, `'700'`, `'800'`, `'900'` 또는 `'variable'`이며, `'variable'`이 기본값이다
- `weight: '100 900'`: variable 폰트의 `100`~`900` 범위를 나타내는 문자열
- `weight: ['100','400','900']`: variable이 아닌 폰트에 대한 3개 값의 배열

#### style

폰트 [`style`](https://developer.mozilla.org/docs/Web/CSS/font-style)은 다음 중 하나로 지정한다.

- 기본값이 `'normal'`인 문자열 [값](https://developer.mozilla.org/docs/Web/CSS/font-style#values)
- variable이 아닌 [Google 폰트](https://fonts.google.com/variablefonts)라면 style 값들의 배열. `next/font/google`에만 적용된다.

`next/font/google`, `next/font/local`에서 사용한다.

- 선택

예시:

- `style: 'italic'`: `next/font/google`에서는 `normal` 또는 `italic`을 지정하는 문자열
- `style: 'oblique'`: `next/font/local`에서는 어떤 값도 지정할 수 있지만, [표준 폰트 style](https://developer.mozilla.org/docs/Web/CSS/font-style) 값을 사용하는 것을 권장한다
- `style: ['italic','normal']`: `next/font/google`에서 `normal`과 `italic` 2개 값의 배열

#### subsets

폰트 [`subsets`](https://fonts.google.com/knowledge/glossary/subsetting)는 [프리로드](#preload)하고 싶은 서브셋 이름을 담은 문자열 배열로 지정한다. `subsets`로 지정한 폰트는 [`preload`](#preload) 옵션이 기본값인 `true`일 때 `head`에 link preload 태그가 삽입된다.

`next/font/google`에서 사용한다.

- 선택

예시:

- `subsets: ['latin']`: `latin` 서브셋을 담은 배열

사용하는 폰트의 Google Fonts 페이지에서 전체 서브셋 목록을 확인할 수 있다.

#### axes

일부 variable 폰트는 추가로 포함할 수 있는 `axes`를 제공한다. 파일 크기를 줄이기 위해 기본적으로는 font weight만 포함된다. `axes`로 지정할 수 있는 값은 폰트마다 다르다.

`next/font/google`에서 사용한다.

- 선택

예시:

- `axes: ['slnt']`: `Inter` variable 폰트가 `wght` 외에 추가로 제공하는 `axes`인 `slnt` 값을 담은 배열([참고](https://fonts.google.com/variablefonts?vfquery=inter#font-families)). [Google variable fonts 페이지](https://fonts.google.com/variablefonts#font-families)에서 필터를 사용해 `wght` 외의 axes 값을 확인할 수 있다

#### display

폰트 [`display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)는 문자열 [값](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#values) `'auto'`, `'block'`, `'swap'`, `'fallback'`, `'optional'` 중 하나로 지정하며, 기본값은 `'swap'`이다.

`next/font/google`, `next/font/local`에서 사용한다.

- 선택

예시:

- `display: 'optional'`: `optional` 값을 지정하는 문자열

#### preload

폰트를 [프리로드](#프리로딩)할지 여부를 지정하는 boolean 값이다. 기본값은 `true`다.

`next/font/google`, `next/font/local`에서 사용한다.

- 선택

예시:

- `preload: false`

#### fallback

폰트를 불러오지 못했을 때 사용할 대체 폰트다. 기본값 없이 대체 폰트 이름을 담은 문자열 배열로 지정한다.

- 선택

`next/font/google`, `next/font/local`에서 사용한다.

예시:

- `fallback: ['system-ui', 'arial']`: 대체 폰트를 `system-ui` 또는 `arial`로 지정하는 배열

#### adjustFontFallback

- `next/font/google`의 경우: [Cumulative Layout Shift](https://web.dev/cls/)를 줄이기 위해 자동 대체 폰트를 사용할지 지정하는 boolean 값이다. 기본값은 `true`다.
- `next/font/local`의 경우: 자동 대체 폰트 사용 여부를 지정하는 문자열 또는 boolean `false` 값이다. 가능한 값은 `'Arial'`, `'Times New Roman'`, `false`이며, 기본값은 `'Arial'`이다.

`next/font/google`, `next/font/local`에서 사용한다.

- 선택

예시:

- `adjustFontFallback: false`: `next/font/google`의 경우
- `adjustFontFallback: 'Times New Roman'`: `next/font/local`의 경우

#### variable

[CSS 변수 방식](#css-변수)으로 스타일을 적용할 때 사용할 CSS 변수 이름을 정의하는 문자열 값이다.

`next/font/google`, `next/font/local`에서 사용한다.

- 선택

예시:

- `variable: '--my-font'`: `--my-font` CSS 변수가 선언된다

#### declarations

생성되는 `@font-face`를 더 세밀하게 정의하는 폰트 face [디스크립터](https://developer.mozilla.org/docs/Web/CSS/@font-face#descriptors) key-value 쌍의 배열이다.

`next/font/local`에서 사용한다.

- 선택

예시:

- `declarations: [{ prop: 'ascent-override', value: '90%' }]`

### 사용 예시

#### Google Fonts

Google 폰트를 사용하려면 `next/font/google`에서 함수로 임포트한다. 최고의 성능과 유연성을 위해 [variable 폰트](https://fonts.google.com/variablefonts) 사용을 권장한다.

```tsx
import { Inter } from 'next/font/google'

// variable 폰트를 불러올 때는 font weight를 지정하지 않아도 된다
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

variable 폰트를 사용할 수 없다면 **weight를 지정해야 한다**.

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
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

배열을 사용하면 여러 weight와 style을 함께 지정할 수 있다.

```tsx
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

> **알아두면 좋은 점**: 여러 단어로 된 폰트 이름은 밑줄(`_`)을 사용한다. 예를 들어 `Roboto Mono`는 `Roboto_Mono`로 임포트해야 한다.

##### 서브셋 지정하기

Google Fonts는 자동으로 [서브셋](https://fonts.google.com/knowledge/glossary/subsetting)으로 나뉜다. 이렇게 하면 폰트 파일 크기가 줄어 성능이 개선된다. 이 중 어떤 서브셋을 프리로드할지 직접 지정해야 한다. [`preload`](#preload)가 `true`인 상태에서 서브셋을 지정하지 않으면 경고가 발생한다.

함수 호출에 다음과 같이 추가해 지정할 수 있다.

```tsx
const inter = Inter({ subsets: ['latin'] })
```

자세한 내용은 이 문서를 참고한다.

#### 여러 폰트 사용하기

애플리케이션에서 여러 폰트를 임포트해 사용할 수 있다. 두 가지 방법이 있다.

첫 번째 방법은 폰트를 내보내는(export) 유틸리티 함수를 만들어 필요한 곳에서 임포트하고 `className`을 적용하는 것이다. 이렇게 하면 렌더링될 때만 폰트가 프리로드된다.

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

```tsx
import { inter } from './fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```tsx
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
```

위 예시에서 `Inter`는 전역으로 적용되고, `Roboto Mono`는 필요한 곳에서 임포트해 적용할 수 있다.

또는 [CSS 변수](#css-변수)를 만들어 원하는 CSS 방식과 함께 사용할 수도 있다.

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'
import styles from './global.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```css
html {
  font-family: var(--font-inter);
}

h1 {
  font-family: var(--font-roboto-mono);
}
```

위 예시에서 `Inter`는 전역으로 적용되고, 모든 `<h1>` 태그는 `Roboto Mono`로 스타일링된다.

> **권장 사항**: 새로운 폰트 하나마다 클라이언트가 추가로 다운로드해야 할 리소스가 되므로, 여러 폰트는 신중하게 사용한다.

##### 로컬 폰트

`next/font/local`을 임포트하고 로컬 폰트 파일의 `src`를 지정한다. 최고의 성능과 유연성을 위해 [variable 폰트](https://fonts.google.com/variablefonts) 사용을 권장한다.

```tsx
import localFont from 'next/font/local'

// 폰트 파일은 `app` 안에 함께 둘 수 있다
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
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

하나의 폰트 패밀리에 여러 파일을 사용하고 싶다면 `src`를 배열로 지정할 수 있다.

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

자세한 내용은 이 문서를 참고한다.

##### Tailwind CSS와 함께 사용하기

`next/font`는 [CSS 변수](#css-변수)를 사용해 [Tailwind CSS](https://tailwindcss.com/)와 매끄럽게 통합된다.

아래 예시는 `next/font/google`의 `Inter`와 `Roboto_Mono` 폰트를 사용한다(어떤 Google 폰트나 로컬 폰트도 사용할 수 있다). `variable` 옵션으로 각 폰트의 CSS 변수 이름(예: `inter`, `roboto_mono`)을 정의한다. 그다음 `inter.variable`과 `roboto_mono.variable`을 적용해 HTML 문서에 CSS 변수를 포함시킨다.

> **알아두면 좋은 점**: 취향, 스타일링 요구 사항, 프로젝트 요구 사항에 따라 이 변수들을 `<html>` 또는 `<body>` 태그에 추가할 수 있다.

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
```

마지막으로 [Tailwind CSS 설정](../../1-getting-started/css.md#tailwind-css)에 CSS 변수를 추가한다.

```css
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-roboto-mono);
}
```

##### Tailwind CSS v3

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
```

이제 `font-sans`와 `font-mono` 유틸리티 클래스를 엘리먼트에 적용할 수 있다.

```html
<p class="font-sans ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
```

##### 스타일 적용하기

폰트 스타일은 세 가지 방법으로 적용할 수 있다.

- [`className`](#classname)
- [`style`](#style-1)
- [CSS 변수](#css-변수)

###### className

불러온 폰트의 읽기 전용 CSS `className`을 반환하며, HTML 엘리먼트에 전달한다.

```tsx
<p className={inter.className}>Hello, Next.js!</p>
```

###### style

불러온 폰트의 읽기 전용 CSS `style` 객체를 반환하며, HTML 엘리먼트에 전달한다. 폰트 패밀리 이름과 대체 폰트에 접근할 수 있는 `style.fontFamily`를 포함한다.

```tsx
<p style={inter.style}>Hello World</p>
```

###### CSS 변수

외부 스타일시트에 스타일을 정의하고 추가 옵션을 지정하고 싶다면 CSS 변수 방식을 사용한다.

폰트를 임포트할 때, CSS 변수가 정의된 CSS 파일도 함께 임포트하고 폰트 로더 객체의 `variable` 옵션을 다음과 같이 설정한다.

```tsx
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'

const inter = Inter({
  variable: '--font-inter',
})
```

폰트를 사용하려면, 스타일을 적용하고 싶은 텍스트의 부모 컨테이너의 `className`을 폰트 로더의 `variable` 값으로 설정하고, 텍스트의 `className`을 외부 CSS 파일의 `styles` 속성으로 설정한다.

```tsx
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

`component.module.css` CSS 파일에 `text` 선택자 클래스를 다음과 같이 정의한다.

```css
.text {
  font-family: var(--font-inter);
  font-weight: 200;
  font-style: italic;
}
```

위 예시에서 `Hello World` 텍스트는 `Inter` 폰트와 생성된 대체 폰트로 스타일링되며, `font-weight: 200`과 `font-style: italic`이 적용된다.

##### 폰트 정의 파일 사용하기

`localFont`나 Google 폰트 함수를 호출할 때마다, 그 폰트는 애플리케이션에서 하나의 인스턴스로 호스팅된다. 따라서 같은 폰트를 여러 곳에서 사용해야 한다면, 한 곳에서 불러온 뒤 필요한 곳에서 해당 폰트 객체를 임포트해야 한다. 이를 폰트 정의 파일로 구현한다.

예를 들어 `app` 디렉터리 루트의 `styles` 폴더에 `fonts.ts` 파일을 만든다.

그다음 폰트 정의를 다음과 같이 지정한다.

```tsx
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'

// variable 폰트를 정의한다
const inter = Inter()
const lora = Lora()
// non-variable 폰트의 weight 2개를 정의한다
const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })
// GreatVibes-Regular.ttf가 styles 폴더에 있는 커스텀 로컬 폰트를 정의한다
const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

이제 코드에서 다음과 같이 이 정의들을 사용할 수 있다.

```tsx
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

`tsconfig.json`이나 `jsconfig.json` 파일에 경로 별칭을 정의하면 코드에서 폰트 정의에 더 쉽게 접근할 수 있다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/fonts": ["./styles/fonts"]
    }
  }
}
```

이제 다음과 같이 어떤 폰트 정의도 임포트할 수 있다.

```tsx
import { greatVibes, sourceCodePro400 } from '@/fonts'
```

##### 프리로딩

폰트 함수가 사이트의 한 페이지에서 호출되면, 전역적으로 사용 가능하게 되거나 모든 라우트에서 프리로드되는 것이 아니다. 대신, 폰트가 사용된 파일 종류에 따라 관련 라우트에서만 프리로드된다.

- [단일 페이지](../3.1-file-conventions/page.md)라면 그 페이지의 단일 라우트에서 프리로드된다.
- [레이아웃](../3.1-file-conventions/layout.md)이라면 그 레이아웃으로 감싸인 모든 라우트에서 프리로드된다.
- [루트 레이아웃](../3.1-file-conventions/layout.md)이라면 모든 라우트에서 프리로드된다.

### 버전 히스토리

| 버전 | 변경 사항 |
| --- | --- |
| v13.2.0 | `@next/font`가 `next/font`로 이름이 바뀌었다. 더 이상 별도 설치가 필요하지 않다. |
| v13.0.0 | `@next/font`가 추가되었다. |

## 예제 및 데모 설계

- Phase 2에서 `next/font/google`과 `next/font/local`을 함께 사용하는 레이아웃을 구현한다.
- `variable` 옵션으로 CSS 변수를 만들어 Tailwind CSS의 `font-sans`/`font-mono` 유틸리티와 연결한다.
- 폰트 정의 파일(`fonts.ts`)을 만들어 여러 페이지에서 같은 폰트 인스턴스를 재사용한다.
- `className`, `style`, CSS 변수 세 가지 적용 방식을 같은 페이지에서 비교한다.

## 연습 문제

1. variable 폰트가 아닌 Google 폰트를 `next/font/google`로 불러올 때 반드시 지정해야 하는 옵션은?

   <details><summary>정답 보기</summary>

   `weight`다. variable 폰트가 아니라면 사용할 weight 값(문자열 또는 배열)을 반드시 지정해야 한다.

   </details>

2. `subsets: ['latin']`처럼 서브셋을 지정하지 않고 `preload`가 기본값(`true`)인 상태로 두면 어떤 일이 벌어지는가?

   <details><summary>정답 보기</summary>

   경고가 발생한다. `preload`가 `true`일 때는 어떤 서브셋을 프리로드할지 반드시 지정해야 한다.

   </details>

3. 같은 폰트를 여러 페이지에서 반복해서 불러오지 않고 재사용하려면 어떤 방법을 사용해야 하는가?

   <details><summary>정답 보기</summary>

   폰트 정의 파일(font definitions file)을 만들어 한 곳에서 `localFont`나 Google 폰트 함수를 호출하고, 필요한 곳에서는 그 결과 객체만 임포트해서 쓴다. 호출할 때마다 새 인스턴스로 호스팅되기 때문이다.

   </details>

## 챕터 요약

- `next/font`는 Google 폰트와 로컬 폰트를 빌드 시점에 다운로드해 셀프 호스팅하므로, 브라우저가 외부에 요청을 보내지 않고 레이아웃 이동도 줄어든다.
- `src`(로컬 필수), `weight`, `subsets`(Google), `display`, `variable` 등 옵션으로 어떤 폰트를 어떻게 불러올지 세밀하게 제어한다.
- 폰트 스타일은 `className`, `style`, CSS 변수 세 가지 방식으로 적용할 수 있으며, CSS 변수 방식은 Tailwind CSS와 매끄럽게 통합된다.
- 같은 폰트를 여러 곳에서 재사용하려면 폰트 정의 파일을 만들어 한 곳에서만 로더 함수를 호출한다.
- 폰트는 호출된 파일의 종류(페이지/레이아웃/루트 레이아웃)에 따라 관련 라우트에만 프리로드된다.
