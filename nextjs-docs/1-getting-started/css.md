# CSS

- 공식 문서: [CSS](https://nextjs.org/docs/app/getting-started/css)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Tailwind CSS, CSS Modules, Global CSS, 외부 스타일시트 네 가지 방식의 용도를 구분할 수 있다.
- CSS Modules로 클래스명 충돌 없이 컴포넌트 스코프 스타일을 만들 수 있다.
- CSS 순서가 import 순서로 결정된다는 점을 이해하고, 순서를 예측 가능하게 유지하는 방법을 안다.
- 개발 모드와 프로덕션 빌드에서 CSS가 다르게 처리된다는 점을 안다.

## 핵심 개념 및 설명

Next.js는 애플리케이션을 스타일링하는 여러 방법을 제공한다.

- [Tailwind CSS](#tailwind-css)
- [CSS Modules](#css-modules)
- [Global CSS](#global-css)
- [외부 스타일시트](#외부-스타일시트)
- [Sass](../2-guides/sass.md)
- [CSS-in-JS](../2-guides/css-in-js.md)

### Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/)는 커스텀 디자인을 만들기 위한 저수준 유틸리티 클래스를 제공하는 utility-first CSS 프레임워크다.

Tailwind CSS를 설치한다.

```bash filename="postcss.config.mjs"
pnpm add -D tailwindcss @tailwindcss/postcss
```

`postcss.config.mjs` 파일에 PostCSS 플러그인을 추가한다.

```js filename="postcss.config.mjs"
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

전역 CSS 파일에서 Tailwind를 import한다.

```css filename="app/globals.css"
@import 'tailwindcss';
```

루트 레이아웃에서 그 CSS 파일을 import한다.

```tsx filename="app/layout.tsx"
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

이제 애플리케이션에서 Tailwind의 유틸리티 클래스를 쓸 수 있다.

```tsx filename="app/page.tsx"
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

> **알아두면 좋은 점**: 아주 오래된 브라우저까지 더 넓은 호환성이 필요하면 [Tailwind CSS v3 설정 안내](../2-guides/tailwind-v3-css.md)를 참고한다.

### CSS Modules

CSS Modules는 고유한 클래스명을 생성해서 CSS를 로컬 스코프로 만든다. 같은 클래스명을 여러 파일에서 이름 충돌 걱정 없이 쓸 수 있다는 뜻이다.

CSS Modules를 쓰려면 `.module.css` 확장자로 새 파일을 만들고, `app` 디렉토리 안의 어떤 컴포넌트에서든 import한다.

```css filename="app/blog/blog.module.css"
.blog {
  padding: 24px;
}
```

```tsx filename="app/blog/page.tsx"
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

### Global CSS

전역 CSS로 애플리케이션 전체에 스타일을 적용할 수 있다.

`app/global.css` 파일을 만들고 루트 레이아웃에서 import하면 애플리케이션의 **모든 라우트**에 스타일이 적용된다.

```css filename="app/global.css"
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx filename="app/layout.tsx"
// 이 스타일은 애플리케이션의 모든 라우트에 적용된다
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

> **알아두면 좋은 점**: 전역 스타일은 `app` 디렉토리 안의 어떤 레이아웃, 페이지, 컴포넌트에서도 import할 수 있다. 다만 Next.js가 스타일시트와의 통합을 위해 React의 내장 스타일시트 지원을 쓰기 때문에, 현재는 라우트 사이를 이동할 때 스타일시트가 제거되지 않아 충돌이 생길 수 있다. Tailwind의 기본 스타일처럼 **진짜로** 전역적인 CSS에는 전역 스타일을, 컴포넌트 스타일링에는 [Tailwind CSS](#tailwind-css)를, 커스텀 스코프 CSS가 필요할 땐 [CSS Modules](#css-modules)를 쓰는 걸 권장한다.

### 외부 스타일시트

외부 패키지가 배포한 스타일시트는 콜로케이션된 컴포넌트를 포함해 `app` 디렉토리 어디에서든 import할 수 있다.

```tsx filename="app/layout.tsx"
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **알아두면 좋은 점**: React 19에서는 `<link rel="stylesheet" href="..." />`도 쓸 수 있다. 자세한 내용은 [React `link` 문서](https://react.dev/reference/react-dom/components/link)를 참고한다.

### 순서와 병합

Next.js는 프로덕션 빌드 중에 스타일시트를 자동으로 청킹(병합)해서 CSS를 최적화한다. **CSS의 순서**는 **코드에서 스타일을 import한 순서**에 따라 결정된다.

예를 들어 `<BaseButton>`이 `page.module.css`보다 먼저 import되므로, `base-button.module.css`가 `page.module.css`보다 먼저 정렬된다.

```tsx filename="page.tsx"
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```tsx filename="base-button.tsx"
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

#### 권장 사항

CSS 순서를 예측 가능하게 유지하려면:

- CSS import를 하나의 JavaScript나 TypeScript 엔트리 파일로 모으려고 노력한다.
- 전역 스타일과 Tailwind 스타일시트는 애플리케이션 루트에서 import한다.
- 대부분의 스타일링에는 **Tailwind CSS**를 쓴다. 일반적인 디자인 패턴을 유틸리티 클래스로 커버하기 때문이다.
- Tailwind 유틸리티로 충분하지 않은 컴포넌트별 스타일에는 CSS Modules를 쓴다.
- CSS 모듈에 일관된 네이밍 컨벤션을 쓴다. 예를 들어 `<name>.tsx`보다 `<name>.module.css`.
- ESLint의 [`sort-imports`](https://eslint.org/docs/latest/rules/sort-imports)처럼 import를 자동으로 정렬하는 린터나 포매터는 꺼둔다.
- `next.config.js`의 [`cssChunking`](../3-api-reference/3.5-config/3.5.1-next-config-js/README.md) 옵션으로 CSS가 청킹되는 방식을 제어할 수 있다.

### 개발 vs 프로덕션

- 개발 모드(`next dev`)에서는 CSS 변경이 [Fast Refresh](../5-architecture/fast-refresh.md)로 즉시 적용된다.
- 프로덕션(`next build`)에서는 모든 CSS 파일이 자동으로 합쳐져 **여러 개의 최소화되고 코드 스플릿된** `.css` 파일이 되어, 라우트마다 최소한의 CSS만 로드되게 한다.
- 프로덕션에서는 JavaScript가 비활성화되어도 CSS가 여전히 로드되지만, 개발 중에는 Fast Refresh를 위해 JavaScript가 필요하다.
- CSS 순서는 개발 중에 다르게 동작할 수 있으니, 최종 CSS 순서를 확인하려면 항상 빌드(`next build`)를 확인해야 한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 같은 버튼 컴포넌트를 Tailwind, CSS Modules, 전역 CSS로 각각 스타일링해서 결과물과 코드량을 비교한다.
- 사용자가 확인할 화면과 상호작용: import 순서를 바꿔서 `next build` 산출물의 CSS 순서가 어떻게 달라지는지 확인.
- 예제에서 관찰할 결과: CSS Modules로 만든 클래스명이 실제로는 해시가 붙은 고유한 이름으로 생성되는 것.

## 연습 문제

**Q1. (단일 선택) 같은 클래스명을 여러 컴포넌트 파일에서 충돌 없이 쓰고 싶을 때 가장 적합한 방법은?**

1. Global CSS
2. CSS Modules
3. 외부 스타일시트를 그대로 import
4. `!important`를 남발한다

<details>
<summary>정답 보기</summary>

**정답: 2** — CSS Modules는 고유한 클래스명을 자동 생성해서 로컬 스코프를 만들어주므로, 같은 클래스명을 여러 파일에서 충돌 없이 쓸 수 있다.

</details>

**Q2. (복수 선택) 다음 중 옳은 것을 모두 고르시오.**

- [ ] CSS의 최종 순서는 코드에서 import한 순서에 따라 결정된다.
- [ ] 프로덕션 빌드에서는 CSS가 여러 개의 최소화된 파일로 자동 청킹된다.
- [ ] 개발 모드에서 CSS를 로드하려면 JavaScript가 필요하지만, 프로덕션에서는 필요 없다.
- [ ] Global CSS는 라우트별로 필요한 부분만 골라서 적용된다.

<details>
<summary>정답 보기</summary>

**정답: 1, 2, 3** — Global CSS는 import된 레이아웃 이하 모든 라우트에 적용되며, 라우트별로 선택적으로 적용되지 않는다.

</details>

**Q3. (단일 선택) CSS import 순서를 예측 가능하게 유지하기 위한 권장 사항이 아닌 것은?**

1. CSS import를 하나의 엔트리 파일로 모은다.
2. ESLint의 `sort-imports`처럼 import를 자동 정렬하는 규칙을 켠다.
3. 전역 스타일은 애플리케이션 루트에서 import한다.
4. CSS Modules 파일에 일관된 네이밍 컨벤션을 쓴다.

<details>
<summary>정답 보기</summary>

**정답: 2** — import를 자동으로 재정렬하는 린터/포매터는 오히려 CSS 순서를 예측 불가능하게 만들 수 있어 꺼두는 것이 권장된다.

</details>

## 요약

- Next.js는 Tailwind CSS, CSS Modules, Global CSS, 외부 스타일시트를 모두 지원하며 용도가 다르다.
- CSS Modules는 고유한 클래스명으로 컴포넌트 스코프 스타일을 만들어 이름 충돌을 막는다.
- CSS 최종 순서는 코드의 import 순서로 결정되므로, import를 한곳에 모으고 자동 정렬 린터는 끄는 게 좋다.
- 대부분의 스타일링은 Tailwind로, Tailwind로 부족한 컴포넌트 스타일은 CSS Modules로 채우는 조합이 권장된다.
- 프로덕션 빌드에서는 CSS가 여러 개의 최소화·코드 스플릿된 파일로 자동 청킹되며, 개발 모드와 순서가 다를 수 있으니 최종 확인은 `next build`로 한다.
