# Create React App

- 공식 문서: [Create React App](https://nextjs.org/docs/app/guides/migrating/from-create-react-app)
- 상위 메뉴: [Migrating](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Create React App(CRA)에서 Next.js로 옮기는 이유와 단계별 이전 방법을 설명한다.
- 기존 SPA 라우터를 유지한 정적 내보내기 전환과 서버 기능을 쓰는 전환의 차이를 구분한다.
- CRA의 HTML, 메타데이터, 스타일, 이미지, 환경 변수, 스크립트를 대응하는 Next.js 규칙으로 바꾼다.

## 핵심 개념 및 설명

### Next.js로 옮기는 이유

#### 느린 초기 페이지 로딩 시간

CRA는 순수 클라이언트 사이드 렌더링을 사용한다. 클라이언트 사이드 전용 애플리케이션, 즉 [SPA(single-page application)](../single-page-applications.md)는 다음 두 가지 이유로 초기 페이지 로딩이 느려지는 경우가 많다.

1. 브라우저는 React 코드와 애플리케이션 전체 번들을 내려받고 실행해야 비로소 데이터를 요청할 수 있다.
2. 새 기능과 의존성을 추가할수록 애플리케이션 코드도 함께 커진다.

#### 자동 코드 분할 부재

느린 로딩 문제는 코드 분할로 어느 정도 완화할 수 있다. 다만 코드 분할을 직접 하다 보면 오히려 성능이 나빠지기 쉽고, 실수로 네트워크 waterfall을 만들기도 쉽다. Next.js는 라우터와 빌드 파이프라인에 자동 코드 분할을 내장하고 있다.

#### 네트워크 waterfall

성능이 나빠지는 흔한 원인은 애플리케이션이 클라이언트-서버 요청을 순차적으로 보내며 데이터를 가져올 때 발생한다. SPA에서 흔한 데이터 fetching 패턴은 먼저 플레이스홀더를 렌더링하고 컴포넌트가 마운트된 뒤 데이터를 가져오는 것이다. 이 경우 데이터를 가져오는 자식 컴포넌트는 부모 컴포넌트가 자신의 데이터 로딩을 끝내야만 시작할 수 있어 "waterfall"이 생긴다.

Next.js에서도 클라이언트에서 데이터를 가져올 수 있지만, 데이터 fetching을 서버로 옮길 수도 있다. 이렇게 하면 클라이언트-서버 waterfall을 완전히 없앨 수 있다.

#### 빠르고 의도적인 로딩 상태

[React Suspense를 통한 스트리밍](../../1-getting-started/linking-and-navigating.md)을 기본으로 지원하므로, network waterfall을 만들지 않고도 UI의 어느 부분을 먼저·어떤 순서로 로드할지 더 의도적으로 정할 수 있다.

이를 통해 더 빠르게 로드되는 페이지를 만들고 [layout shift](https://vercel.com/blog/how-core-web-vitals-affect-seo)도 없앨 수 있다.

#### 데이터 fetching 전략 선택하기

필요에 따라 Next.js는 페이지·컴포넌트 단위로 데이터 fetching 전략을 선택할 수 있게 해준다. 빌드 시점, 서버의 요청 시점, 또는 클라이언트에서 데이터를 가져올 수 있다. 예를 들어 CMS에서 데이터를 가져와 블로그 게시글을 빌드 시점에 렌더링하면(SSG) CDN에서 효율적으로 캐시할 수 있다.

#### Proxy

[Next.js Proxy](../../3-api-reference/3.1-file-conventions/proxy.md)는 요청이 완료되기 전에 서버에서 코드를 실행할 수 있게 해준다. 인증이 필요한 페이지에 사용자가 방문했을 때 미인증 콘텐츠가 잠깐 보이는 것을 로그인 페이지로 리다이렉트해서 막을 때 특히 유용하다. A/B 테스트, 실험, [국제화](../internationalization.md)에도 유용하다.

#### 내장 최적화

[이미지](../../3-api-reference/3.2-components/image.md), [폰트](../../3-api-reference/3.2-components/font.md), [서드 파티 스크립트](../scripts.md)는 애플리케이션 성능에 큰 영향을 주는 경우가 많다. Next.js는 이들을 자동으로 최적화하는 전용 컴포넌트와 API를 함께 제공한다.

### 이전 단계

처음에는 기존 라우터를 곧바로 바꾸지 않고 앱을 SPA로 취급한다. 그러면 빠르게 동작하는 Next.js 앱을 만든 뒤 기능을 점진적으로 채택할 수 있고 복잡도와 병합 충돌도 줄어든다. `homepage`, Service Worker, Babel 또는 webpack 조정처럼 고급 CRA 설정을 썼다면 아래 추가 고려 사항도 확인한다.

#### 1단계: Next.js 의존성 설치하기

기존 프로젝트에 Next.js를 설치한다.

```bash
pnpm add next@latest
```

#### 2단계: Next.js 설정 파일 만들기

프로젝트 루트(`package.json`과 같은 위치)에 `next.config.ts`를 만든다. 이 파일에 [Next.js 설정 옵션](../../3-api-reference/3.5-config/3.5.1-next-config-js/README.md)을 담는다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // SPA(Single-Page Application)로 출력한다
  distDir: 'build', // 빌드 결과 디렉터리를 `build`로 바꾼다
}

export default nextConfig
```

> **알아두면 좋은 점**: `output: 'export'`를 쓰면 정적 내보내기를 한다는 뜻이다. SSR이나 API 같은 서버 기능에는 접근할 수 **없다**. 서버 기능을 쓰려면 이 줄을 지운다.

#### 3단계: Root Layout 만들기

Next.js [App Router](../../README.md) 애플리케이션에는 모든 페이지를 감싸는 [Root Layout](../../3-api-reference/3.1-file-conventions/layout.md) 파일이 반드시 있어야 하며, 이는 [React Server Component](../../1-getting-started/server-and-client-components.md)다. CRA 애플리케이션에서 Root Layout 파일에 가장 가까운 것은 `<html>`, `<head>`, `<body>` 태그가 있는 `public/index.html`이다.

1. `src` 폴더 안에 새 `app` 디렉터리를 만든다.
2. 그 `app` 디렉터리 안에 `layout.tsx`(또는 `layout.js`) 파일을 만든다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return '...'
}
```

이제 기존 `index.html`의 내용을 이 `<RootLayout>` 컴포넌트로 복사하면서, `body div#root`(와 `body noscript`)는 `<div id="root">{children}</div>`로 바꾼다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

> **알아두면 좋은 점**: Next.js는 기본적으로 CRA의 `public/manifest.json`, 추가 아이콘, [테스트 설정](../2.44-testing/README.md)을 무시한다. 필요하다면 Next.js의 [Metadata API](../../1-getting-started/metadata-and-og-images.md)와 [Testing](../2.44-testing/README.md) 설정을 지원한다.

#### 4단계: Metadata

Next.js는 `<meta charSet="UTF-8" />`와 `<meta name="viewport" content="width=device-width, initial-scale=1" />` 태그를 자동으로 포함하므로 `<head>`에서 지울 수 있다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

`favicon.ico`, `icon.png`, `robots.txt` 같은 [메타데이터 파일](../../1-getting-started/metadata-and-og-images.md)은 `app` 디렉터리 최상위에 두기만 하면 애플리케이션 `<head>` 태그에 자동으로 추가된다. [지원되는 파일](../../1-getting-started/metadata-and-og-images.md)을 모두 `app` 디렉터리로 옮긴 뒤에는 해당 `<link>` 태그를 안전하게 지울 수 있다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

마지막으로, 남은 `<head>` 태그는 [Metadata API](../../1-getting-started/metadata-and-og-images.md)로 관리할 수 있다. 최종 메타데이터 정보를 export하는 [`metadata` 객체](../../3-api-reference/3.3-functions/generate-metadata.md)로 옮긴다.

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
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

이 변경으로 `index.html`에 모든 것을 나열하던 방식에서, Next.js에 내장된 컨벤션 기반 접근([Metadata API](../../1-getting-started/metadata-and-og-images.md))으로 옮겨졌다. 이 방식은 SEO와 페이지 공유성을 더 쉽게 개선할 수 있게 해준다.

#### 5단계: 스타일

CRA처럼 Next.js도 기본으로 [CSS Modules](../../1-getting-started/css.md)를 지원한다. [전역 CSS import](../../1-getting-started/css.md)도 지원한다.

전역 CSS 파일이 있다면 `app/layout.tsx`에서 가져온다.

```tsx
import '../index.css'

export const metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
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

Tailwind CSS를 쓴다면 [설치 문서](../../1-getting-started/css.md)를 참고한다.

#### 6단계: 진입점 페이지 만들기

CRA의 진입점은 `src/index.tsx`(또는 `index.js`)지만, App Router에서는 `app` 안의 각 폴더가 라우트가 되고 폴더마다 `page.tsx`가 있어야 한다. 지금은 SPA로 유지하면서 **모든** 라우트를 가로채야 하므로 [선택적 catch-all 라우트](../../3-api-reference/3.1-file-conventions/dynamic-routes.md)를 쓴다.

1. `app` 안에 `[[...slug]]` 디렉터리를 만든다.

```
app
 ┣ [[...slug]]
 ┃ ┗ page.tsx
 ┣ layout.tsx
```

2. `page.tsx`에 다음을 추가한다.

```tsx
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // 곧 갱신한다
}
```

이 설정은 빈 slug(`/`) 하나를 위한 라우트 하나만 만들어서, 결과적으로 **모든** 라우트를 같은 페이지로 매핑한다. 이 페이지는 [Server Component](../../1-getting-started/server-and-client-components.md)이며 정적 HTML로 prerender된다.

#### 7단계: Client-Only 진입점 추가하기

다음으로 CRA의 루트 `App` 컴포넌트를 [Client Component](../../1-getting-started/server-and-client-components.md) 안에 넣어서 모든 로직을 클라이언트 쪽에 유지한다. Next.js를 처음 쓴다면, Client Component도 기본적으로는 서버에서 prerender된다는 점을 알아두면 좋다. 여기에 클라이언트 JavaScript를 실행하는 능력이 추가된다고 보면 된다.

`app/[[...slug]]/` 안에 `client.tsx`(또는 `client.js`)를 만든다.

```tsx
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

- `'use client'` 지시어는 이 파일을 **Client Component**로 만든다.
- `ssr: false`가 있는 `dynamic` import는 `<App />`의 서버 사이드 렌더링을 꺼서 완전히 클라이언트 전용(SPA)으로 만든다.

새 컴포넌트를 쓰도록 `page.tsx`를 갱신한다.

```tsx
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

#### 8단계: 정적 이미지 import 갱신하기

CRA에서는 이미지 파일을 import하면 공개 URL 문자열을 반환한다.

```jsx
import image from './img.png'

export default function App() {
  return <img src={image} />
}
```

Next.js에서는 정적 이미지 import가 객체를 반환한다. 이 객체는 [`<Image>` 컴포넌트](../../3-api-reference/3.2-components/image.md)에 그대로 전달하거나, 기존 `<img>` 태그에서는 객체의 `src` 속성을 사용한다.

`<Image>` 컴포넌트는 [자동 이미지 최적화](../../3-api-reference/3.2-components/image.md)를 함께 제공한다. `<Image>` 컴포넌트는 이미지 치수를 기준으로 `width`, `height`를 자동 설정해 layout shift를 막아 준다. 다만 한쪽 치수만 스타일링하고 다른 쪽을 `auto`로 두지 않은 이미지가 있다면, `<img>` 치수 속성값이 기본값이 되어 이미지가 왜곡될 수 있다.

`<img>` 태그를 유지하면 변경량을 줄이고 위 문제를 피할 수 있다. 이후 [loader를 설정](../../3-api-reference/3.2-components/image.md)해 이미지 최적화를 활용하거나, 자동 이미지 최적화를 지원하는 기본 Next.js 서버로 옮겨 점진적으로 `<Image>` 컴포넌트로 이전할 수 있다.

**`/public`에서 절대 경로로 가져온 이미지 import를 상대 import로 바꾼다.**

```jsx
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

**이미지 객체 전체가 아니라 `src` 속성을 `<img>` 태그에 전달한다.**

```jsx
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

파일명을 기준으로 공개 URL을 직접 참조할 수도 있다. 예를 들어 `public/logo.png`는 애플리케이션에서 `/logo.png`로 서비스되며, 이 값이 곧 `src` 값이다.

> **경고**: TypeScript를 사용한다면 `src` 속성에 접근할 때 타입 에러가 날 수 있다. `tsconfig.json`의 [`include` 배열](https://www.typescriptlang.org/tsconfig#include)에 `next-env.d.ts`를 추가해서 고친다. 이 파일은 9단계에서 애플리케이션을 실행하면 Next.js가 자동으로 생성한다.

#### 9단계: 환경 변수 마이그레이션

Next.js는 CRA와 비슷하게 [환경 변수](../environment-variables.md)를 지원하지만, 브라우저에 노출할 변수에는 **반드시** `NEXT_PUBLIC_` 접두사가 필요하다.

가장 큰 차이는 클라이언트 사이드에 환경 변수를 노출하는 접두사다. `REACT_APP_` 접두사가 붙은 모든 환경 변수를 `NEXT_PUBLIC_`로 바꾼다.

#### 10단계: `package.json` 스크립트 갱신하기

`package.json`의 `scripts`를 Next.js 명령으로 바꾸고, `.next`와 `next-env.d.ts`를 `.gitignore`에 추가한다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "npx serve@latest ./build"
  }
}
```

```bash
# .gitignore
.next
next-env.d.ts
```

`pnpm dev`를 실행하고 `http://localhost:3000`을 연다. Next.js에서(SPA 모드) 동작하는 애플리케이션을 볼 수 있다.

#### 11단계: 정리하기

이제 CRA 전용 산물을 코드베이스에서 정리할 수 있다.

- `public/index.html`을 지운다
- `src/index.tsx`를 지운다
- `src/react-app-env.d.ts`를 지운다
- `reportWebVitals` 설정을 지운다
- `react-scripts` 의존성을 `package.json`에서 제거한다

### 추가 고려 사항

#### CRA에서 커스텀 `homepage`를 쓰던 경우

CRA `package.json`의 `homepage` 필드로 특정 하위 경로에 앱을 배포했다면, `next.config.ts`의 [`basePath`](../../3-api-reference/3.5-config/3.5.1-next-config-js/basePath.md) 설정으로 그대로 옮길 수 있다.

```ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/my-subpath',
  // ...
}

export default nextConfig
```

#### 커스텀 `Service Worker` 다루기

CRA의 Service Worker(예: `create-react-app`의 `serviceWorker.js`)를 썼다면, 다음 문법으로 등록할 수 있다.

```ts
await navigator.serviceWorker.register(new URL('../serviceWorker.js', import.meta.url), ...)
```

Next.js로 [Progressive Web Applications (PWA)](../progressive-web-apps.md)를 만드는 방법을 더 알아본다.

#### API 요청 Proxy하기

CRA 앱이 `package.json`의 `proxy` 필드로 백엔드 서버에 요청을 전달했다면, `next.config.ts`의 [Next.js rewrites](../../3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md)로 다시 구성할 수 있다.

```ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend.com/:path*',
      },
    ]
  },
}
```

#### 커스텀 Webpack

CRA에서 커스텀 webpack이나 Babel 설정을 썼다면, `next.config.ts`에서 Next.js의 설정을 확장할 수 있다.

```ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // 여기서 webpack 설정을 수정한다
    return config
  },
}

export default nextConfig
```

> **알아두면 좋은 점**: 이 설정을 쓰려면 `dev` 스크립트에 `--webpack`을 추가해서 Webpack을 써야 한다.

#### TypeScript 설정

`tsconfig.json`이 있으면 Next.js가 TypeScript를 자동으로 설정한다. `tsconfig.json`의 `include` 배열에 `next-env.d.ts`가 들어 있는지 확인한다.

```json
{
  "include": ["next-env.d.ts", "app/**/*", "src/**/*"]
}
```

### 번들러 호환성

CRA는 webpack으로 번들링했지만, Next.js는 이제 로컬 개발에서 기본적으로 [Turbopack](../../3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md)을 사용한다(`next dev`). CRA와 비슷하게 Webpack을 쓰려면 `next dev --webpack`을 실행한다. CRA에서 쓰던 고급 webpack 설정을 마이그레이션해야 한다면 커스텀 webpack 설정을 계속 제공할 수 있다.

### 다음 단계

지금까지의 과정으로 SPA로 동작하는 Next.js 앱을 완성했지만, 아직 서버 사이드 렌더링이나 파일 기반 라우팅 같은 Next.js 기능은 쓰지 않고 있다. 이제 다음을 점진적으로 채택할 수 있다.

- **React Router에서 마이그레이션**해 App Router의 자동 코드 분할, 스트리밍 서버 렌더링, Server Component를 사용한다.
- **이미지 최적화**는 `<Image>` 컴포넌트로 한다.
- **폰트 최적화**는 `next/font`로 한다.
- **서드 파티 스크립트 최적화**는 `<Script>` 컴포넌트로 한다.
- **ESLint**는 Next.js 권장 규칙으로 켠다.

> **알아두면 좋은 점**: 정적 내보내기(`output: 'export'`)는 아직 `useParams` 훅이나 다른 서버 기능을 지원하지 않는다. 모든 Next.js 기능을 쓰려면 `next.config.ts`에서 `output: 'export'`를 제거한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- CRA의 `App`을 `app/[[...slug]]/client.tsx`에서 클라이언트 전용으로 렌더링하고, 새로고침한 경로도 같은 SPA가 처리하는지 확인한다.
- 이미지 import의 객체와 `src` 속성, `REACT_APP_`와 `NEXT_PUBLIC_` 접두사의 차이를 화면에서 비교한다.

## 연습 문제

1. `output: 'export'`를 설정했을 때 사용할 수 없는 기능은 무엇인가?
   - A. SSR과 API 같은 서버 기능
   - B. CSS Modules
   - C. Client Component

   <details><summary>정답 보기</summary>

   정답: A. 이 설정은 정적 내보내기이므로 서버 기능에 접근할 수 없다.

   </details>

2. CRA의 `REACT_APP_` 환경 변수는 어떻게 바꾸는가?
   - A. `NEXT_PUBLIC_`로 바꾼다.
   - B. `NEXT_SERVER_`로 바꾼다.
   - C. 접두사를 제거한다.

   <details><summary>정답 보기</summary>

   정답: A. 브라우저에 노출할 Next.js 환경 변수는 `NEXT_PUBLIC_` 접두사가 필요하다.

   </details>

3. CRA에서 쓰던 것과 같은 방식(webpack)으로 로컬 개발을 계속하려면 어떻게 해야 하는가?
   - A. `next dev --webpack`을 실행한다.
   - B. 아무것도 하지 않아도 된다. Next.js는 기본적으로 webpack을 사용한다.
   - C. `next.config.ts`에서 `bundler: 'webpack'`을 설정한다.

   <details><summary>정답 보기</summary>

   정답: A. Next.js는 로컬 개발에서 기본적으로 Turbopack을 사용하므로, CRA와 같은 webpack을 쓰려면 `--webpack` 플래그를 추가해야 한다.

   </details>

## 챕터 요약

- CRA의 클라이언트 전용 렌더링과 waterfall 문제는 자동 코드 분할, 서버 데이터 fetching, 스트리밍으로 줄일 수 있다.
- 처음에는 정적 내보내기와 선택적 catch-all 라우트로 기존 SPA를 유지할 수 있다.
- `public/index.html`은 Root Layout과 Metadata API로, 진입점은 `page.tsx`와 Client Component로 옮긴다.
- 이미지 import, 공개 환경 변수, 스크립트, CRA 전용 파일을 Next.js 규칙에 맞춰 바꾼다.
- `homepage`, Service Worker, API proxy, 커스텀 webpack은 각각 `basePath`, Service Worker 등록, `rewrites`, `webpack` 설정으로 옮긴다.
- Next.js는 로컬 개발에서 기본적으로 Turbopack을 쓰며, CRA와 같은 webpack이 필요하면 `--webpack` 플래그를 추가한다.
