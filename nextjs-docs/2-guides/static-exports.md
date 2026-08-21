# Static Exports

- 공식 문서: [Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `output: 'export'`가 빌드하는 산출물과 배포 방식을 설명한다.
- static export에서 Server Component, Client Component, Image, Route Handler, 브라우저 API를 사용하는 조건을 구분한다.
- 요청 시점 서버가 필요한 미지원 기능을 식별하고 대안을 선택한다.

## 핵심 개념 및 설명

static export를 사용하면 Next.js 애플리케이션을 정적 사이트나 [SPA](./single-page-applications.md)로 시작한 뒤 필요할 때 서버 기능을 추가하는 구조로 전환할 수 있다. `next build`는 라우트마다 HTML 파일을 만들고 클라이언트 전환용 정적 payload도 생성한다. 정적 HTML/CSS/JavaScript를 제공할 수 있는 모든 웹 서버에 배포할 수 있다.

### 설정

`next.config.js`에서 출력 모드를 설정한다.

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // 선택: /me 링크와 결과 파일을 /me/와 /me/index.html 형태로 만든다.
  // trailingSlash: true,

  // 선택: trailing slash 자동 redirect를 막고 원래 href를 유지한다.
  // skipTrailingSlashRedirect: true,

  // 선택: 기본 out 디렉터리 대신 dist를 사용한다.
  // distDir: 'dist',
}

module.exports = nextConfig
```

`next build`가 끝나면 기본적으로 `out` 디렉터리에 HTML/CSS/JavaScript 자산이 생성된다.

### 지원 기능

#### Server Components

`app` 디렉터리의 Server Component는 `next build` 중 실행된다. 결과는 최초 로드용 정적 HTML과 클라이언트 라우트 전환용 정적 payload로 저장된다. 빌드 시점에 계산할 수 없는 다이나믹 Server Function만 사용하지 않으면 별도 변경이 필요 없다.

```tsx filename="app/page.tsx"
export default async function Page() {
  // 빌드 프로세스의 서버에서 한 번 실행된다.
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()

  return <main>{products.length} products</main>
}
```

#### Client Components

브라우저에서 최신 데이터를 가져와야 하면 Client Component와 [SWR](./2.15-client-side-data-fetching/swr.md) 같은 도구를 사용할 수 있다. 라우트 전환은 클라이언트에서 일어나므로 전통적인 SPA처럼 동작한다.

```tsx filename="app/other/page.tsx"
import Link from 'next/link'

export default function Page() {
  return <Link href="/other">Other Page</Link>
}
```

```tsx filename="app/other/page.tsx"
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Page() {
  const { data, error } = useSWR('/data.json', fetcher)
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'
  return data.title
}
```

#### Image Optimization

기본 [Image Optimization](../3-api-reference/3.2-components/image.md)은 요청 시점 서버가 필요하므로 static export에서 지원하지 않는다. `next/image`를 유지하려면 Cloudinary 같은 외부 이미지 서비스의 custom loader를 설정한다.

```js filename="next.config.js"
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}

module.exports = nextConfig
```

loader는 `src`, `width`, `quality`를 받아 외부 서비스 URL을 구성한다. 그러면 컴포넌트에서는 일반적인 `next/image` API를 계속 사용할 수 있다.

```ts filename="my-loader.ts"
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
}
```

```tsx filename="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtles" src="/turtles.jpg" width={300} height={300} />
}
```

#### Route Handlers

static export에서는 `GET` Route Handler만 정적 파일로 만들 수 있다. 다음 예제처럼 정적 응답을 생성한다.

```ts filename="app/data.json/route.ts"
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

예를 들어 `app/data.json/route.ts`는 빌드할 때 `data.json`으로 출력된다. 들어오는 요청에서 다이나믹 값을 읽어야 한다면 static export를 사용할 수 없다.

#### 브라우저 API

Client Component도 빌드 중 HTML로 prerender된다. 따라서 [`window`](https://developer.mozilla.org/docs/Web/API/Window), [`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage), [`navigator`](https://developer.mozilla.org/docs/Web/API/Navigator) 같은 Web API는 렌더링 중 바로 읽지 말고 브라우저에서만 실행되는 Effect나 이벤트에서 접근한다.

```tsx filename="app/other/page.tsx"
'use client'

import { useEffect } from 'react'

export default function ClientComponent() {
  useEffect(function reportViewportHeight() {
    console.log(window.innerHeight)
  }, [])

  return <p>Viewport를 확인한다.</p>
}
```

### 미지원 기능

Node.js 서버나 빌드 시점에 계산할 수 없는 다이나믹 로직이 필요한 다음 기능은 지원하지 않는다.

- [`dynamicParams: true`](../3-api-reference/3.1-file-conventions/dynamic-routes.md)인 Dynamic Route
- [`generateStaticParams()`](../3-api-reference/3.3-functions/generate-static-params.md)가 없는 Dynamic Route
- 들어오는 `Request`에 의존하는 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)
- [`cookies`](../3-api-reference/3.3-functions/cookies.md)
- [rewrites](../3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md), [redirects](../3-api-reference/3.5-config/3.5.1-next-config-js/redirects.md), [headers](../3-api-reference/3.5-config/3.5.1-next-config-js/headers.md)
- [Proxy](../3-api-reference/3.1-file-conventions/proxy.md)
- [ISR](./incremental-static-regeneration.md)
- 기본 loader를 사용하는 Image Optimization
- [Draft Mode](./draft-mode.md)
- [Server Actions](../1-getting-started/mutating-data.md)
- [Intercepting Routes](../3-api-reference/3.1-file-conventions/intercepting-routes.md)

이 기능을 `next dev`에서 사용하면 Root Layout에 다음 설정을 둔 것과 비슷한 오류가 발생한다.

```ts filename="app/other/page.tsx"
export const dynamic = 'error'
```

### 배포

빌드 결과가 다음 라우트를 포함한다고 하자.

- `/`
- `/blog/[id]`의 `/blog/post-1`, `/blog/post-2`

`out/index.html`, `out/404.html`, `out/blog/post-1.html`, `out/blog/post-2.html`이 생성된다. Nginx 같은 정적 호스트에서는 요청 URL을 해당 HTML 파일로 연결한다.

```nginx filename="nginx.conf"
server {
  listen 80;
  server_name acme.com;
  root /var/www/out;

  location / {
    try_files $uri $uri.html $uri/ =404;
  }

  location /blog/ {
    rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
    internal;
  }
}
```

`trailingSlash: true`이면 위의 `/blog/` rewrite는 생략할 수 있다. GitHub Pages에는 [공식 템플릿](https://github.com/nextjs/deploy-github-pages)을 사용할 수 있다.

### 버전 이력

| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | `next export`를 제거하고 `output: 'export'`로 대체 |
| v13.4.0 | 안정화된 App Router가 React Server Components와 Route Handler를 포함한 static export 지원을 확장 |
| v13.3.0 | `next export`를 deprecated 처리하고 `output: 'export'`로 대체 |

## 예제 및 데모 설계

- Phase 2에서 동일한 콘텐츠를 static export와 `next start`로 빌드하고 산출물과 요청 경로를 비교한다.
- 빌드 시점 데이터, 브라우저 SWR 데이터, 정적 Route Handler 결과가 언제 갱신되는지 타임라인으로 표시한다.
- custom image loader 적용 전후 빌드 오류와 생성된 이미지 URL을 확인한다.
- 미지원 API를 하나씩 켜서 빌드 실패 원인과 서버 배포로 전환해야 하는 기준을 학습한다.

## 연습 문제

1. static export를 활성화하는 현재 설정은?

   - A. `next export`
   - B. `output: 'export'`
   - C. `dynamic: 'force-static'`만 설정한다.

   <details><summary>정답 보기</summary>

   정답: B. v14부터 별도 `next export` 명령은 제거되고 출력 설정으로 통합됐다.

   </details>

2. static export에서 지원하는 Route Handler는?

   - A. 요청 쿠키를 읽는 POST handler
   - B. 정적으로 표시한 GET handler
   - C. 모든 HTTP 메서드

   <details><summary>정답 보기</summary>

   정답: B. 빌드 시점에 정적 응답으로 만들 수 있는 GET만 지원한다.

   </details>

3. Client Component에서 `window`를 안전하게 읽는 시점은?

   - A. 모듈 최상위
   - B. 서버 prerender 중
   - C. 브라우저에서 실행되는 Effect나 이벤트 안

   <details><summary>정답 보기</summary>

   정답: C. Client Component도 빌드 중 prerender되므로 브라우저 전용 API는 클라이언트 실행 시점에 읽는다.

   </details>

## 챕터 요약

- `output: 'export'`는 라우트별 정적 HTML과 클라이언트 전환 자산을 생성한다.
- Server Component의 데이터는 빌드 시점에 계산되고 Client Component는 브라우저에서 데이터를 갱신할 수 있다.
- Image Optimization에는 custom loader가 필요하고 Route Handler는 정적 GET만 지원한다.
- 요청 시점 서버가 필요한 기능은 static export에서 사용할 수 없다.
- 산출물의 URL 규칙에 맞게 정적 호스트의 rewrite와 404 처리를 구성한다.
