# Content Security Policy

- 공식 문서: [Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Content Security Policy(CSP)가 제한하는 콘텐츠 원본과 방어하는 공격을 설명한다.
- Proxy에서 요청마다 nonce를 만들고 Next.js 렌더링에 전달할 수 있다.
- nonce 기반 CSP의 다이나믹 렌더링 비용과 SRI 기반 정적 대안을 비교한다.
- 개발·운영 환경과 서드파티 스크립트에 맞게 CSP 위반을 진단한다.

## 핵심 개념 및 설명

CSP는 브라우저가 스크립트, 스타일시트, 이미지, 폰트, 객체, 미디어, iframe 등을 어느 origin에서 불러오고 실행할 수 있는지 제한하는 응답 헤더다. XSS, clickjacking, 코드 삽입 공격을 방어하는 중요한 계층이다.

### Nonce 기반 CSP

#### nonce를 사용하는 이유

nonce는 한 번만 사용하는 예측 불가능한 무작위 문자열이다. CSP가 inline·외부 스크립트를 차단하더라도 CSP 헤더와 같은 nonce를 가진 특정 스크립트나 스타일만 실행하도록 허용할 수 있다. 공격자가 페이지에 스크립트를 넣더라도 요청마다 달라지는 nonce를 알아야 한다.

#### Proxy에서 nonce 추가하기

[Proxy](../3-api-reference/3.1-file-conventions/proxy.md)는 페이지 렌더링 전에 헤더를 추가하고 nonce를 만들 수 있다. 요청마다 새 nonce가 필요하므로 nonce 기반 CSP에는 다이나믹 렌더링을 사용해야 한다.

```ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}
```

> **알아두면 좋은 점**: 개발 환경에서는 React가 서버 오류 스택 같은 디버깅 정보를 복원하려고 `eval`을 사용하므로 `'unsafe-eval'`이 필요하다. 운영 환경에서는 필요하지 않으며 React와 Next.js도 기본적으로 운영에서 `eval`을 사용하지 않는다.

Proxy는 기본적으로 모든 요청에서 실행된다. CSP가 필요 없는 정적 asset과 `next/link` prefetch는 [`matcher`](../3-api-reference/3.1-file-conventions/proxy.md)에서 제외하는 것을 권장한다.

```ts
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

#### Next.js가 nonce를 적용하는 방식

1. Proxy가 nonce를 만들어 `Content-Security-Policy`와 `x-nonce` 요청 헤더에 넣는다.
2. Next.js가 서버 렌더링 중 CSP 헤더에서 `'nonce-{value}'` 패턴을 추출한다.
3. Next.js가 프레임워크 스크립트, 페이지 JavaScript 번들, 생성한 inline 스타일·스크립트, `nonce` prop을 가진 `<Script>`에 값을 적용한다.

각 태그에 nonce를 직접 넣을 필요는 없다. 정적 페이지는 요청·응답 헤더가 없는 빌드 시점에 생성되므로 nonce를 주입할 수 없다. 필요하면 [`connection()`](../3-api-reference/3.3-functions/connection.md)으로 요청을 기다려 다이나믹 렌더링을 명시한다.

##### 다이나믹 렌더링 강제하기

```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  return <main>Secure page</main>
}
```

##### nonce 읽기

Server Component에서는 [`headers()`](../3-api-reference/3.3-functions/headers.md)로 nonce를 읽어 서드파티 `<Script>`에 전달할 수 있다.

```tsx
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  return <Script src="https://www.googletagmanager.com/gtag/js" nonce={nonce} />
}
```

### 정적 렌더링과 다이나믹 렌더링 비교

#### 다이나믹 렌더링 요구 사항

nonce를 사용하면 모든 페이지를 다이나믹 렌더링해야 한다. 빌드는 성공해도 페이지가 다이나믹 렌더링으로 구성되지 않으면 런타임 오류가 날 수 있다. 요청마다 새 페이지와 nonce가 생성되고, 정적 최적화와 ISR을 사용할 수 없으며 별도 설정 없이 CDN에 캐시할 수 없다. static shell의 스크립트가 nonce에 접근할 수 없으므로 Partial Prerendering과도 호환되지 않는다.

#### 성능에 미치는 영향

그 결과 초기 페이지 생성이 느려질 수 있고, 모든 요청이 서버 렌더링을 요구해 서버 부하와 호스팅 비용이 커질 수 있다.

#### nonce를 사용할 때

`'unsafe-inline'`을 금지해야 하거나 민감한 데이터를 다루거나 특정 inline 스크립트만 허용해야 하는 엄격한 보안·규정 요구가 있을 때 nonce를 검토한다.

### Nonce 없이 CSP 설정하기

nonce가 필요 없는 앱은 `next.config.js`의 `headers()`에서 CSP 응답 헤더를 설정할 수 있다. 이 예는 inline 스크립트와 스타일을 허용하므로 엄격한 nonce 정책과 같은 보장 수준은 아니다.

```js
const isDev = process.env.NODE_ENV === 'development'
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: csp.replace(/\n/g, ''),
      }],
    }]
  },
}
```

### Subresource Integrity(SRI, experimental)

#### SRI 동작 방식

Next.js는 nonce의 대안으로 hash 기반 CSP를 위한 SRI를 실험적으로 지원한다. 빌드 시 JavaScript 파일의 암호학적 hash를 만들고 `<script>`의 `integrity` 속성에 넣는다. 브라우저는 전송 중 파일이 바뀌지 않았는지 확인한다.

> **알아두면 좋은 점**: SRI 지원은 실험적이며 App Router에서만 사용할 수 있다.

#### SRI 활성화하기

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    sri: {
      algorithm: 'sha256', // 'sha384' 또는 'sha512'도 사용 가능
    },
  },
}

module.exports = nextConfig
```

#### SRI와 함께 CSP 구성하기

SRI를 활성화해도 기존 CSP 정책을 계속 사용할 수 있다. SRI는 asset에 `integrity` 속성을 추가해 CSP와 독립적으로 동작한다. 다이나믹 렌더링이 필요한 경로에서는 필요에 따라 Proxy에서 nonce도 함께 생성할 수 있다.

```js
const isDev = process.env.NODE_ENV === 'development'

const csp = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

module.exports = {
  experimental: {
    sri: { algorithm: 'sha256' },
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: csp.replace(/\n/g, ''),
      }],
    }]
  },
}
```

#### nonce 대비 장점

정적 생성과 CDN 캐싱을 유지하고 요청마다 서버 렌더링하지 않아도 된다. hash가 빌드 시점에 만들어져 파일 무결성을 보장한다.

#### SRI 제약 사항

제약도 있다. 기능이 변경되거나 제거될 수 있고, Pages Router에서는 지원하지 않으며, 빌드 뒤 동적으로 생성한 스크립트는 처리하지 못한다.

> **알아두면 좋은 점**: SRI와 nonce는 함께 사용할 수 있지만, 서로 다른 위협과 렌더링 방식에 대응하므로 앱 요구에 맞춰 조합한다.

### 개발과 운영 환경

#### 개발 환경

개발에서는 디버깅을 위해 `script-src`에 `'unsafe-eval'`이 필요하다. 사용하는 스타일 도구에 따라 개발 중 `'unsafe-inline'`이 필요할 수도 있지만 운영 정책에서는 nonce로 바꾼다.

#### 운영 배포

운영에서는 다음을 점검한다.

- nonce가 없으면 Proxy가 필요한 모든 라우트에서 실행되는지 확인한다.
- 정적 asset이 막히면 Next.js asset 원본을 정책이 허용하는지 확인한다.
- 서드파티 스크립트가 막히면 필요한 도메인만 CSP에 추가한다.

### 문제 해결

#### 서드파티 스크립트

Google Tag Manager 같은 서드파티 컴포넌트에는 `headers()`로 읽은 nonce를 전달한다.

```tsx
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

`script-src`, `connect-src`, `img-src`에는 실제 사용하는 도메인만 추가한다.

```ts
const csp = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`
```

#### 흔한 CSP 위반

흔한 위반과 대응은 다음과 같다.

1. inline 스타일은 nonce를 지원하는 CSS-in-JS 라이브러리를 쓰거나 외부 파일로 옮긴다.
2. 다이나믹 import는 `script-src`가 허용하는지 확인한다.
3. WebAssembly를 사용하면 `'wasm-unsafe-eval'`이 필요할 수 있다.
4. Service Worker 스크립트에 맞는 정책을 추가한다.

### 버전 기록

| 버전 | 변경 사항 |
|---|---|
| `v14.0.0` | hash 기반 CSP를 위한 실험적 SRI 지원 추가 |
| `v13.4.20` | 올바른 nonce 처리와 CSP 헤더 파싱에 권장되는 버전 |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: nonce, 정적 헤더, SRI 세 정책이 렌더링과 브라우저 차단 결과에 미치는 영향을 비교한다.
- 사용자가 확인할 화면과 상호작용:
  - nonce가 일치하는 스크립트만 실행되고 요청마다 값이 달라지는지 확인한다.
  - 정적 페이지에 nonce 정책을 적용했을 때와 `connection()`으로 다이나믹 렌더링했을 때를 비교한다.
  - 허용하지 않은 서드파티 도메인의 CSP 콘솔 오류를 보고 정책을 최소 범위로 수정한다.

## 연습 문제

1. nonce 기반 CSP가 정적 페이지에 적용되지 않는 이유는 무엇인가?

   - A. 정적 페이지는 JavaScript를 포함할 수 없어서
   - B. 빌드 시점에는 요청 헤더가 없어 요청별 nonce를 주입할 수 없어서
   - C. nonce는 CSS에만 사용할 수 있어서

   <details><summary>정답 보기</summary>

   정답: B. Next.js는 요청의 CSP 헤더에서 nonce를 추출해 서버 렌더링 중 적용한다.

   </details>

2. 정적 생성과 CDN 캐싱을 유지하면서 엄격한 CSP를 구성할 때 검토할 실험 기능은 무엇인가?

   - A. SRI
   - B. `unsafe-inline`
   - C. `cookies()`

   <details><summary>정답 보기</summary>

   정답: A. SRI는 빌드 시 hash를 생성해 정적 asset의 무결성을 확인한다.

   </details>

3. 운영 CSP에 관한 설명으로 맞는 것을 모두 고르시오.

   - A. 서드파티 도메인은 실제 필요한 origin만 허용한다.
   - B. React가 운영에서도 기본적으로 `eval`을 쓰므로 `'unsafe-eval'`이 필수다.
   - C. nonce가 없다면 Proxy 실행 범위를 확인한다.

   <details><summary>정답 보기</summary>

   정답: A, C. `'unsafe-eval'`은 개발 디버깅에는 필요하지만 운영 기본값에는 필요하지 않다.

   </details>

## 챕터 요약

- CSP는 브라우저가 실행·로드할 콘텐츠 원본을 제한하는 보안 헤더다.
- nonce는 요청마다 새로 만들고 Proxy와 다이나믹 렌더링을 통해 적용한다.
- nonce 기반 CSP는 정적 최적화, ISR, PPR, 기본 CDN 캐싱과 맞지 않는다.
- 실험적 SRI는 정적 생성을 유지하지만 App Router의 빌드 시점 스크립트만 다룬다.
- 개발·운영 환경과 서드파티 리소스에 맞춰 최소한의 directive를 허용한다.
