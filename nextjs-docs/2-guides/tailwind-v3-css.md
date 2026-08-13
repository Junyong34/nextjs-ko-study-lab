# Tailwind CSS v3

- 공식 문서: [Tailwind CSS v3](https://nextjs.org/docs/app/guides/tailwind-v3-css)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Tailwind CSS v3와 peer dependency를 설치하고 설정 파일을 생성할 수 있다.
- App Router의 파일을 Tailwind 콘텐츠 탐색 범위에 포함할 수 있다.
- 전역 CSS와 루트 레이아웃을 연결하고 컴포넌트에 유틸리티 클래스를 적용할 수 있다.
- Tailwind CSS v3를 선택해야 하는 경우와 Turbopack 지원 범위를 설명할 수 있다.

## 핵심 개념 및 설명

이 가이드는 더 넓은 브라우저 호환성을 위해 Next.js 애플리케이션에 [Tailwind CSS v3](https://v3.tailwindcss.com/)를 설치하는 방법을 다룬다.

> **알아두면 좋은 점**: 최신 Tailwind CSS v4 구성은 [CSS 시작 안내의 Tailwind CSS 섹션](../1-getting-started/css.md#tailwind-css)을 참고한다.

### Tailwind v3 설치

Tailwind CSS와 peer dependency인 PostCSS, Autoprefixer를 개발 의존성으로 설치한다. 이어 `init -p`를 실행하면 `tailwind.config.js`와 `postcss.config.js`가 함께 생성된다.

```bash
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

pnpm과 Yarn도 설치 뒤 `npx tailwindcss init -p`를 실행한다. Bun에서는 `bun add -D tailwindcss@^3 postcss autoprefixer`와 `bunx tailwindcss init -p`를 사용한다.

### Tailwind v3 구성

`tailwind.config.js`의 `content`에는 Tailwind 클래스를 사용하는 템플릿 경로를 지정한다. App Router뿐 아니라 Pages Router나 공유 컴포넌트가 함께 있을 수 있으므로 세 경로를 모두 포함한다.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

전역 CSS 파일에는 Tailwind의 세 레이어를 추가한다.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

App Router에서는 이 전역 CSS를 [루트 레이아웃](../3-api-reference/3.1-file-conventions/layout.md)에서 import한다.

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 클래스 사용

설치와 전역 스타일 연결을 마치면 컴포넌트의 `className`에 Tailwind 유틸리티 클래스를 사용할 수 있다.

```tsx
// app/page.tsx
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

`text-3xl`은 글자 크기, `font-bold`는 글자 굵기, `underline`은 밑줄을 적용한다. Tailwind는 `content`에 지정된 소스 파일을 빌드 과정에서 탐색해 사용된 클래스에 필요한 CSS를 생성한다.

### Turbopack과 함께 사용

Next.js 13.1부터 Tailwind CSS와 PostCSS는 [Turbopack](https://turbo.build/pack/docs/features/css#tailwind-css)에서 지원된다. 따라서 이 가이드의 Tailwind v3 구성은 Turbopack을 사용하는 Next.js 개발 환경에서도 사용할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 `text-3xl font-bold underline`을 적용한 제목과 적용하지 않은 제목을 나란히 표시한다.
- `content` 경로에 포함된 컴포넌트와 제외된 별도 경로의 컴포넌트를 비교해 클래스 탐색 범위의 영향을 확인한다.
- Tailwind v3와 v4 설정 파일 및 CSS 진입점의 차이를 비교하되, 이 챕터의 실행 예제는 v3에 고정한다.
- 현재 Phase 1에서는 애플리케이션을 만들지 않고 설치 명령, 파일 구성, 확인할 화면만 설계한다.

## 연습 문제

1. Tailwind v3 설정과 PostCSS 설정을 함께 생성하는 명령은 무엇인가?

   1. `npx tailwindcss init -p`
   2. `npx next init tailwind`
   3. `npm run postcss:init`
   4. `npx tailwindcss build -p`

   <details><summary>정답 보기</summary>

   **정답: 1** — `init -p`가 `tailwind.config.js`와 `postcss.config.js`를 생성한다.

   </details>

2. App Router에서 Tailwind의 세 지시어가 있는 `app/globals.css`를 어디서 import하는가?

   1. `tailwind.config.js`
   2. 루트 레이아웃
   3. Route Handler
   4. `postcss.config.js`

   <details><summary>정답 보기</summary>

   **정답: 2** — 전역 CSS는 `app/layout.tsx` 또는 `app/layout.js`의 루트 레이아웃에서 import한다.

   </details>

3. 공식 문서의 설명과 맞는 것을 모두 고르시오.

   1. 최신 Tailwind v4 구성은 별도의 CSS 시작 안내에서 확인한다.
   2. Tailwind와 PostCSS는 Next.js 13.1부터 Turbopack에서 지원된다.
   3. `content`에는 CSS 파일 경로만 넣어야 한다.
   4. Tailwind v3 설치에는 `tailwindcss@^3`, `postcss`, `autoprefixer`가 포함된다.

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 4** — `content`에는 유틸리티 클래스를 사용하는 JS, TS, JSX, TSX, MDX 템플릿 경로를 지정한다.

   </details>

## 챕터 요약

- Tailwind CSS v3는 더 넓은 브라우저 호환성이 필요한 경우 선택할 수 있다.
- `tailwindcss@^3`, PostCSS, Autoprefixer를 설치하고 `init -p`로 두 설정 파일을 생성한다.
- `content`에는 `app`, `pages`, `components` 아래의 템플릿 경로를 지정한다.
- Tailwind 지시어를 넣은 전역 CSS는 App Router의 루트 레이아웃에서 import한다.
- Next.js 13.1부터 Tailwind CSS와 PostCSS를 Turbopack에서도 사용할 수 있다.
