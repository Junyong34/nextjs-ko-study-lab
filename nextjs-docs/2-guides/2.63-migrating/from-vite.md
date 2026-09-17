# Vite

- 공식 문서: [Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)
- 상위 메뉴: [Migrating](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Vite SPA를 Next.js로 옮기는 이유와 이전 단계를 설명한다.
- Vite의 TypeScript, Root Layout, 진입점, 환경 변수 규칙을 Next.js 규칙으로 옮긴다.
- 정적 내보내기 기반의 기존 배포 흐름을 유지하며 App Router로 전환한다.

## 핵심 개념 및 설명

### Next.js로 옮기는 이유

#### 느린 초기 페이지 로딩 시간

Vite의 [기본 React 플러그인](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)으로 애플리케이션을 만들었다면, 그 애플리케이션은 순수 클라이언트 사이드 애플리케이션이다. 클라이언트 사이드 전용 애플리케이션, 즉 SPA(single-page application)는 다음 두 가지 이유로 초기 페이지 로딩이 느려지는 경우가 많다.

1. 브라우저는 React 코드와 애플리케이션 전체 번들을 내려받고 실행해야 비로소 데이터를 요청할 수 있다.
2. 새 기능과 추가 의존성을 더할수록 애플리케이션 코드도 함께 커진다.

#### 자동 코드 분할 부재

느린 로딩 문제는 코드 분할로 어느 정도 관리할 수 있다. 다만 코드 분할을 직접 하면 오히려 성능이 나빠지는 경우가 많다. 코드 분할을 수동으로 하다 보면 실수로 네트워크 waterfall을 만들기 쉽다. Next.js는 라우터에 자동 코드 분할을 내장하고 있다.

#### 네트워크 waterfall

성능이 나빠지는 흔한 원인은 애플리케이션이 클라이언트-서버 요청을 순차적으로 보내며 데이터를 가져올 때 발생한다. SPA에서 흔한 데이터 fetching 패턴은 먼저 플레이스홀더를 렌더링하고 컴포넌트가 마운트된 뒤 데이터를 가져오는 것이다. 이 경우 데이터를 가져오는 자식 컴포넌트는 부모 컴포넌트가 자신의 데이터 로딩을 끝내야만 가져오기를 시작할 수 있다.

Next.js에서도 클라이언트에서 데이터를 가져오는 것을 지원하지만, 데이터 fetching을 서버로 옮길 수 있는 방법도 제공한다. 이렇게 하면 클라이언트-서버 waterfall을 없앨 수 있다.

#### 빠르고 의도적인 로딩 상태

[React Suspense를 통한 스트리밍](../../1-getting-started/linking-and-navigating.md)을 기본으로 지원하므로, network waterfall을 만들지 않고도 UI의 어느 부분을 먼저·어떤 순서로 로드할지 더 의도적으로 정할 수 있다.

이를 통해 더 빠르게 로드되는 페이지를 만들고 [layout shift](https://vercel.com/blog/how-core-web-vitals-affect-seo)도 없앨 수 있다.

#### 데이터 fetching 전략 선택하기

필요에 따라 Next.js는 페이지·컴포넌트 단위로 데이터 fetching 전략을 선택할 수 있게 해준다. 빌드 시점, 서버의 요청 시점, 또는 클라이언트에서 데이터를 가져올 수 있다. 예를 들어 CMS에서 데이터를 가져와 블로그 게시글을 빌드 시점에 렌더링하면, CDN에서 효율적으로 캐시할 수 있다.

#### Proxy

[Next.js Proxy](../../3-api-reference/3.1-file-conventions/proxy.md)는 요청이 완료되기 전에 서버에서 코드를 실행할 수 있게 해준다. 인증이 필요한 페이지에 사용자가 방문했을 때, 미인증 콘텐츠가 잠깐 보이는 것을 로그인 페이지로 리다이렉트해서 막을 때 특히 유용하다. 실험(experimentation)과 [국제화](../internationalization.md)에도 유용하다.

#### 내장 최적화

[이미지](../../3-api-reference/3.2-components/image.md), [폰트](../../3-api-reference/3.2-components/font.md), [서드 파티 스크립트](../scripts.md)는 애플리케이션 성능에 큰 영향을 주는 경우가 많다. Next.js는 이들을 자동으로 최적화하는 내장 컴포넌트를 함께 제공한다.

### 이전 단계

이 마이그레이션의 목표는 가능한 한 빨리 동작하는 Next.js 애플리케이션을 만들어, 이후 Next.js 기능을 점진적으로 채택하는 것이다. 그래서 먼저 기존 라우터는 그대로 두고 순수 클라이언트 사이드 애플리케이션(SPA)으로만 옮긴다. 이렇게 하면 마이그레이션 중 문제가 생길 가능성과 병합 충돌을 줄일 수 있다.

#### 1단계: Next.js 의존성 설치하기

가장 먼저 `next`를 의존성으로 설치한다.

```bash
pnpm add next@latest
```

#### 2단계: Next.js 설정 파일 만들기

프로젝트 루트에 `next.config.mjs`를 만든다. 이 파일에 [Next.js 설정 옵션](../../3-api-reference/3.5-config/3.5.1-next-config-js/README.md)을 담는다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // SPA(Single-Page Application)로 출력한다.
  distDir: './dist', // 빌드 결과 디렉터리를 `./dist/`로 바꾼다.
}

export default nextConfig
```

> **알아두면 좋은 점**: Next.js 설정 파일은 `.js`, `.mjs` 중 어느 확장자를 써도 된다.

#### 3단계: TypeScript 설정 갱신하기

TypeScript를 쓴다면 `tsconfig.json`을 Next.js와 호환되도록 다음처럼 직접 고친다. TypeScript를 쓰지 않는다면 이 단계는 건너뛴다.

1. `tsconfig.node.json`에 대한 project reference를 제거한다.
2. `include` 배열에 `./dist/types/**/*.ts`와 `./next-env.d.ts`를 추가한다.
3. `exclude` 배열에 `./node_modules`를 추가한다.
4. `compilerOptions.plugins` 배열에 `{ "name": "next" }`를 추가한다.
5. `esModuleInterop`을 `true`로 설정한다.
6. `jsx`를 `react-jsx`로 설정한다.
7. `allowJs`를 `true`로 설정한다.
8. `forceConsistentCasingInFileNames`를 `true`로 설정한다.
9. `incremental`을 `true`로 설정한다.

이 변경을 마친 `tsconfig.json` 예시다.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["./src", "./dist/types/**/*.ts", "./next-env.d.ts"],
  "exclude": ["./node_modules"]
}
```

#### 4단계: Root Layout 만들기

App Router 애플리케이션은 모든 페이지를 감싸는 [Root Layout](../../3-api-reference/3.1-file-conventions/layout.md) 파일이 `app` 디렉터리 최상위에 반드시 있어야 하며, 이는 [Server Component](../../1-getting-started/server-and-client-components.md)다. Vite의 `index.html` 파일이 이 역할에 가장 가깝다. `index.html`을 Root Layout으로 바꾸는 과정은 다음 6단계를 따른다.

1. `src` 폴더에 새 `app` 디렉터리를 만든다.
2. 그 `app` 디렉터리 안에 `layout.tsx` 파일을 만든다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return '...'
}
```

> **알아두면 좋은 점**: Layout 파일은 `.js`, `.jsx`, `.tsx` 확장자를 쓸 수 있다.

3. `index.html`의 내용을 방금 만든 `<RootLayout>` 컴포넌트로 복사하면서, `body div#root`와 `body script` 태그는 `<div id="root">{children}</div>`로 바꾼다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

4. Next.js는 [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset)과 [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) 태그를 기본으로 포함하므로 `<head>`에서 안전하게 지울 수 있다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

5. `favicon.ico`, `icon.png`, `robots.txt` 같은 [메타데이터 파일](../../1-getting-started/metadata-and-og-images.md)은 `app` 디렉터리 최상위에 두기만 하면 애플리케이션 `<head>` 태그에 자동으로 추가된다. [지원되는 파일](../../1-getting-started/metadata-and-og-images.md)을 모두 `app` 디렉터리로 옮긴 뒤에는 해당 `<link>` 태그를 안전하게 지울 수 있다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

6. 마지막으로, 남은 `<head>` 태그는 [Metadata API](../../1-getting-started/metadata-and-og-images.md)로 관리할 수 있다. 최종 메타데이터 정보를 export하는 [`metadata` 객체](../../3-api-reference/3.3-functions/generate-metadata.md)로 옮긴다.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

이 변경으로 `index.html`에 모든 것을 나열하던 방식에서, Next.js에 내장된 컨벤션 기반 접근(Metadata API)으로 옮겨졌다. 이 방식은 SEO와 페이지 공유성을 더 쉽게 개선할 수 있게 해준다.

#### 5단계: 진입점 페이지 만들기

Vite의 `main.tsx`에 대응하는 진입점은 Next.js의 `page.tsx`다. 먼저 SPA로 동작하게 만들 것이므로, 모든 경로를 받아내는 [선택적 catch-all 라우트 세그먼트](../../3-api-reference/3.1-file-conventions/dynamic-routes.md)인 `app/[[...slug]]` 디렉터리를 만들고, 그 안에 `page.tsx`를 만든다.

```tsx
// app/[[...slug]]/page.tsx
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // 곧 갱신한다
}
```

> **알아두면 좋은 점**: Page 파일은 `.js`, `.jsx`, `.tsx` 확장자를 쓸 수 있다.

이 파일은 [Server Component](../../1-getting-started/server-and-client-components.md)로, `next build` 실행 시 정적 자산으로 prerender되며 별도의 다이나믹 코드가 필요 없다. 전역 CSS를 여기서 가져오고, [`generateStaticParams`](../../3-api-reference/3.3-functions/generate-static-params.md)로 `/`의 index 라우트 하나만 생성하도록 지정한다.

기존 Vite 애플리케이션은 클라이언트 전용으로 실행되도록 별도 파일로 옮긴다.

```tsx
// app/[[...slug]]/client.tsx
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

`'use client'`가 있는 Client Component도 서버에서 HTML로 prerender된 뒤 클라이언트로 전달된다. `{ ssr: false }`는 `App` 컴포넌트부터는 prerender를 끄겠다는 뜻이다. 이제 `page.tsx`에서 `ClientOnly`를 사용하도록 갱신한다.

```tsx
// app/[[...slug]]/page.tsx
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

#### 6단계: 정적 이미지 import 갱신하기

Vite에서는 이미지를 import하면 프로덕션 URL 문자열을 반환한다.

```tsx
// App.tsx
import image from './img.png' // 프로덕션에서 `image`는 '/assets/img.2d8efhg.png'가 된다

export default function App() {
  return <img src={image} />
}
```

Next.js에서는 이미지를 import하면 객체를 반환한다. 이 객체는 [`<Image>` 컴포넌트](../../3-api-reference/3.2-components/image.md)에 바로 넘기거나, `src` 속성만 꺼내 기존 `<img>` 태그에 쓸 수 있다.

`<Image>` 컴포넌트는 이미지 크기에 맞춰 `width`, `height`를 자동으로 설정해 layout shift를 막아 주지만, 두 dimension 중 하나만 스타일링하고 다른 하나를 `auto`로 지정하지 않으면 이미지가 왜곡될 수 있다. `<img>` 태그를 그대로 두면 변경량을 줄이고 이 문제를 피할 수 있으며, 나중에 [loader를 설정](../../3-api-reference/3.2-components/image.md)하거나 자동 이미지 최적화를 지원하는 기본 Next.js 서버로 옮겨 `<Image>`로 전환할 수 있다.

```ts
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

```ts
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

또는 파일명을 기준으로 이미지 자산의 공개 URL을 직접 참조할 수도 있다. 예를 들어 `public/logo.png`는 애플리케이션에서 `/logo.png`로 제공되며, 이를 `src` 값으로 쓸 수 있다.

> **주의**: TypeScript를 사용한다면 `src` 속성에 접근할 때 타입 에러가 날 수 있다. 지금은 무시해도 되며, 이 가이드의 나머지 단계를 마치면 해결된다.

#### 7단계: 환경 변수 옮기기

브라우저에 노출하는 환경 변수의 접두사를 `VITE_`에서 `NEXT_PUBLIC_`로 바꾼다. Turbopack은 Vite의 `import.meta.env.MODE`, `DEV`, `PROD`, `BASE_URL`, `SSR`을 변경 없이 지원한다. `BASE_URL`은 Next.js의 [`basePath`](../../3-api-reference/3.5-config/3.5.1-next-config-js/basePath.md) 설정을 반영하며 Vite와 같은 형식으로 끝에 슬래시가 붙는다.

`import.meta.glob`도 Turbopack이 변경 없이 지원한다. Vite 5에서 deprecated된 `as` 옵션을 썼다면 `query`로 바꾼다.

```js
// Before (Vite)
const modules = import.meta.glob('./dir/*.txt', { as: 'raw' })

// After (Next.js / Turbopack)
const modules = import.meta.glob('./dir/*.txt', { query: '?raw' })
```

자세한 API는 [Turbopack 문서](../../3-api-reference/turbopack.md)를 참고한다. 커스텀 base URL을 쓰고 있었다면 `next.config.mjs`에 [`basePath`](../../3-api-reference/3.5-config/3.5.1-next-config-js/basePath.md)를 설정한다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // SPA(Single-Page Application)로 출력한다.
  distDir: './dist', // 빌드 결과 디렉터리를 `./dist/`로 바꾼다.
  basePath: '/some-base-path',
}

export default nextConfig
```

#### 8단계: `package.json` 스크립트 갱신하기

Next.js로 잘 옮겨졌는지 실행해서 확인하기 전에, `package.json`의 `scripts`를 Next.js 명령으로 바꾸고 `.next`와 `next-env.d.ts`를 `.gitignore`에 추가한다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```bash
# .gitignore
.next
next-env.d.ts
dist
```

`npm run dev`를 실행하고 `http://localhost:3000`을 연다. Next.js에서 애플리케이션이 동작하는 것을 볼 수 있다.

> **예시**: Vite 애플리케이션을 Next.js로 옮긴 실제 예시는 [이 pull request](https://github.com/inngest/vite-to-nextjs/pull/1)에서 확인할 수 있다.

#### 9단계: 정리하기

이제 Vite 관련 산물을 코드베이스에서 정리할 수 있다.

- `main.tsx`를 지운다
- `index.html`을 지운다
- `vite-env.d.ts`를 지운다
- `tsconfig.node.json`을 지운다
- `vite.config.ts`를 지운다
- Vite 의존성을 제거한다

### 다음 단계

정상적으로 마이그레이션됐다면 SPA로 동작하는 Next.js 애플리케이션이 만들어진다. 아직 Next.js의 이점을 대부분 누리지는 못하지만, 이제 점진적으로 다음을 적용할 수 있다.

- React Router를 App Router로 옮겨 자동 코드 분할, [스트리밍 서버 렌더링](../../3-api-reference/3.1-file-conventions/loading.md), [Server Component](../../1-getting-started/server-and-client-components.md)를 사용한다.
- [`<Image>` 컴포넌트](../../3-api-reference/3.2-components/image.md)로 이미지를 최적화한다.
- [`next/font`](../../3-api-reference/3.2-components/font.md)로 폰트를 최적화한다.
- [`<Script>` 컴포넌트](../scripts.md)로 서드 파티 스크립트를 최적화한다.
- Next.js 규칙을 지원하도록 [ESLint 설정](../../3-api-reference/3.5-config/eslint.md)을 갱신한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 기존 Vite `App`을 선택적 catch-all 라우트에서 클라이언트 전용으로 실행하고, 정적 빌드 결과에서도 경로 새로고침을 확인한다.
- `VITE_` 값을 `NEXT_PUBLIC_`로, 이미지 URL import를 이미지 객체의 `src`로 바꾼 결과를 비교한다.
- `<Image>`에 `width`만 스타일링하고 `height`를 `auto`로 지정하지 않았을 때 이미지가 왜곡되는 화면을 보여준다.

## 연습 문제

1. Vite의 `dist` 결과 폴더 이름을 유지하는 설정은 무엇인가?
   - A. `distDir: './dist'`
   - B. `output: 'dist'`
   - C. `buildDir: 'dist'`

   <details><summary>정답 보기</summary>

   정답: A. `distDir`가 Next.js 빌드 결과 디렉터리를 정한다.

   </details>

2. 브라우저에 노출할 Vite 환경 변수의 접두사는 무엇으로 바뀌는가?
   - A. `NEXT_PUBLIC_`
   - B. `NEXT_ENV_`
   - C. `PUBLIC_`

   <details><summary>정답 보기</summary>

   정답: A. Next.js는 브라우저에 노출할 변수에 `NEXT_PUBLIC_`를 요구한다.

   </details>

3. Next.js로 옮길 때 `tsconfig.json`의 변경은 누가 수행하는가?
   - A. 개발자가 안내된 항목을 직접 고친다
   - B. `next dev`를 처음 실행하면 Next.js가 자동으로 고쳐준다
   - C. `next.config.mjs`에 옵션을 추가하면 자동으로 반영된다

   <details><summary>정답 보기</summary>

   정답: A. `tsconfig.node.json` 참조 제거, `include`/`exclude`, `plugins`, `esModuleInterop` 같은 항목은 개발자가 직접 고쳐야 한다. `next-env.d.ts`만 Next.js가 자동으로 만들어준다.

   </details>

## 챕터 요약

- Vite SPA는 기존 라우터를 유지한 채 정적 내보내기로 먼저 옮기고, 이후 점진적으로 App Router 기능을 채택한다.
- `tsconfig.json`의 `include`/`exclude`/`plugins`/`esModuleInterop` 등은 개발자가 직접 갱신해야 하는 항목이다.
- `index.html`, `main.tsx`는 Root Layout, 선택적 catch-all `page.tsx`, `'use client'` 컴포넌트로 나뉜다.
- 이미지 import는 URL 문자열이 아니라 객체를 반환하며, `<Image>`로 옮길 때는 두 dimension을 모두 스타일링하거나 하나를 `auto`로 둬야 왜곡을 피할 수 있다.
- `VITE_` 환경 변수는 `NEXT_PUBLIC_`로, `import.meta.glob`의 `as` 옵션은 `query`로 바꾼다.
