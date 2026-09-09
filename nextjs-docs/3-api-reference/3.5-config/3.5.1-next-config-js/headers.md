# headers

- 공식 문서: [headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `headers` 옵션으로 특정 경로로 들어오는 요청에 커스텀 HTTP 응답 헤더를 설정하는 방법을 이해한다.
- 와일드카드, 정규식, `has`/`missing` 조건을 활용한 정밀한 요청 경로 매칭 규칙을 학습한다.
- 보안 헤더(CSP, HSTS, CORS 등) 적용 방법과 정적 자산 캐시 헤더의 덮어쓰기 우선순위를 파악한다.

## 핵심 개념 및 설명

`headers`는 들어오는 요청 경로에 따라 커스텀 HTTP 응답 헤더를 설정할 수 있는 비동기(async) 함수다. `next.config.js` 또는 `next.config.ts` 파일에서 정의하며, 특정 라우트나 전체 애플리케이션에 보안 헤더, 캐싱 정책, CORS 헤더 등을 주입할 때 주로 사용한다.

### 기본 설정 구조

`headers` 함수는 라우트 매칭 규칙과 적용할 헤더 목록을 담은 객체 배열을 반환한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `headers`는 파일 시스템(페이지 파일 및 `/public` 정적 파일)보다 먼저 확인되어 적용된다.
> - 커스텀 헤더는 Node.js 서버 런타임과 정적 라우트 서빙 시점에 HTTP 응답으로 함께 전송된다.

### 헤더 설정 속성

`headers` 배열의 각 객체는 다음 속성을 지원한다.

| 속성 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `source` | `string` | 필수 | 수신 요청 경로 패턴(`path-to-regexp` 문법 사용). |
| `headers` | `Array<{ key: string, value: string }>` | 필수 | 응답에 추가할 HTTP 헤더 키와 값 객체 배열. |
| `basePath` | `false \| undefined` | 선택 | `false`로 설정하면 매칭 시 `basePath`를 포함하지 않는다. |
| `locale` | `false \| undefined` | 선택 | `false`로 설정하면 다국어 매칭 시 로케일 접두사를 포함하지 않는다. |
| `has` | `Array<HasMissingObject>` | 선택 | 요청에 반드시 존재해야 하는 조건(헤더, 쿠키, 호스트, 쿼리) 배열. |
| `missing` | `Array<HasMissingObject>` | 선택 | 요청에 존재하지 않아야 하는 조건 배열. |

`has`와 `missing` 객체의 속성은 다음과 같다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `type` | `string` | `'header'`, `'cookie'`, `'host'`, `'query'` 중 하나를 지정한다. |
| `key` | `string` | 확인할 헤더, 쿠키, 쿼리의 키 이름을 지정한다 (`type: 'host'`일 때는 생략). |
| `value` | `string \| undefined` | 일치해야 하는 값 또는 정규식 문자열을 지정한다. 캡처 그룹을 사용할 수 있다. |

### 헤더 덮어쓰기 동작 (Header Overriding Behavior)

두 개 이상의 헤더 규칙이 같은 요청 경로에 일치하면서 같은 헤더 키를 설정하면, 나중에 일치한 규칙의 값이 앞선 규칙의 값을 덮어쓴다(last-write-wins).

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/hello',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

위 설정에서 `/hello` 경로로 요청이 들어오면 두 규칙이 모두 일치하지만, 마지막 규칙인 `x-hello: there`가 최종 응답 헤더로 설정된다.

### 경로 매칭 (Path Matching)

Next.js는 경로 매칭에 `path-to-regexp` 라이브러리를 사용하므로, 매개변수화된 다이나믹 라우트 경로를 유연하게 지정할 수 있다.

#### 와일드카드 경로 매칭 (Wildcard Path Matching)

파라미터 이름 뒤에 `*`를 붙이면 0개 이상의 세그먼트와 일치하며, `+`를 붙이면 1개 이상의 세그먼트와 일치한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // /blog, /blog/a, /blog/a/b 등과 일치한다
        source: '/blog/:slug*',
        headers: [
          {
            key: 'x-slug',
            value: ':slug*', // 캡처된 세그먼트 값을 헤더에 재사용할 수 있다
          },
        ],
      },
      {
        // /post/a는 일치하지만 /post는 일치하지 않는다
        source: '/post/:slug+',
        headers: [
          {
            key: 'x-post-slug',
            value: ':slug+',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

#### 정규식 경로 매칭 (Regex Path Matching)

파라미터 뒤에 괄호로 정규식을 감싸 특정 패턴에만 일치하도록 제한할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // /user/123과 일치하지만 /user/abc와는 일치하지 않는다
        source: '/user/:id(\\d+)',
        headers: [
          {
            key: 'x-user-id',
            value: ':id',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` 문자는 정규식 구문에서 특수 문자로 쓰인다. 이 문자를 `source`에서 일반 문자 리터럴로 매칭하려면 반드시 앞에 `\\`를 붙여 이스케이프해야 한다 (예: `/english\\(default\\)/:slug`).

### 헤더, 쿠키, 쿼리 매칭 (Header, Cookie, and Query Matching)

`has` 또는 `missing` 필드를 사용하면 경로 외에도 HTTP 요청 헤더, 쿠키, 호스트, 쿼리 파라미터의 존재 여부와 값을 검사해 헤더를 조건부로 적용할 수 있다.

- `has`: 배열 안의 모든 조건이 반드시 충족되어야 규칙이 적용된다.
- `missing`: 배열 안의 모든 조건이 충족되지 않아야(누락되어야) 규칙이 적용된다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<auth>.*)', // 명명된 캡처 그룹을 사용할 수 있다
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized-response',
            value: ':auth',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### basePath 지원 (Headers with basePath support)

애플리케이션에 `basePath`가 설정되어 있으면, `headers`의 `source` 패턴 앞에 자동으로 `basePath`가 붙는다. 외부 도메인이나 서브패스 외부를 대상으로 작업해야 하는 특수한 상황에서는 `basePath: false`를 지정할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/docs',
  async headers() {
    return [
      {
        // 실제로는 /docs/with-basePath와 매칭된다
        source: '/with-basePath',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // basePath가 붙지 않고 /without-basePath와 직접 매칭된다
        source: '/without-basePath',
        basePath: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### i18n 지원 (Headers with i18n support)

국제화(i18n) 설정이 활성화된 경우 `source` 앞에 자동으로 로케일 접두사가 매칭된다. 로케일 매칭을 건너뛰고 특정 라우트 자체에만 헤더를 적용하려면 `locale: false`를 지정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },
  async headers() {
    return [
      {
        // /en/with-locale, /fr/with-locale 등과 일치하지 않고 오직 /with-locale과만 일치한다
        source: '/with-locale',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### Cache-Control 설정 (Cache-Control)

Next.js는 프로덕션 빌드 시 해시가 포함된 정적 자산(`/_next/static/...`)에 자동으로 불변(immutable) 캐시 헤더를 적용한다.

```http
Cache-Control: public, max-age=31536000, immutable
```

> **알아두면 좋은 점**:
>
> - `/_next/static/...` 경로의 불변 캐시 헤더는 `next.config.js`의 `headers` 설정으로 덮어쓸 수 없다. 정적 자산의 캐시 제어는 빌드 파일 해시로 영구 캐시되도록 프레임워크 수준에서 보호된다.
> - 동적 페이지나 API 응답의 `Cache-Control`은 `headers` 설정 또는 `Route Handler` 내부의 응답 객체에서 직접 설정할 수 있다.

### 주요 보안 헤더 설정 옵션 (Options)

Next.js 공식 문서는 웹 애플리케이션 보안 강화에 권장하는 대표적인 HTTP 보안 헤더 모음을 제공한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
```

#### CORS (Cross-Origin Resource Sharing)

[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS)는 어떤 사이트가 리소스에 접근할 수 있는지를 제어하는 보안 기능이다. `Access-Control-Allow-Origin` 헤더를 설정하여 특정 출처가 `Route Handler`에 접근할 수 있도록 허용할 수 있다.

```js
headers() {
  return [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*", // 허용할 출처를 지정한다
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
      ],
    },
  ];
},
```

#### X-DNS-Prefetch-Control

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)는 DNS prefetching을 제어하여 브라우저가 외부 링크, 이미지, CSS, JavaScript 등의 도메인 이름 확인을 사전에 수행하도록 한다. 이 prefetching은 백그라운드에서 수행되므로 참조된 항목이 필요할 때 DNS가 이미 확인되어 있을 가능성이 높아져 링크 클릭 시 지연 시간을 줄일 수 있다.

```js
{
  key: 'X-DNS-Prefetch-Control',
  value: 'on'
}
```

#### Strict-Transport-Security (HSTS)

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)는 브라우저에 HTTP 대신 HTTPS만을 사용하여 접근해야 함을 알린다. 아래 설정을 사용하면 현재 및 향후의 모든 서브도메인이 2년의 `max-age` 동안 HTTPS를 사용하게 된다. 이는 HTTP로만 제공될 수 있는 페이지나 서브도메인에 대한 접근을 차단한다.

```js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

#### X-Frame-Options

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)는 사이트가 `iframe` 내부에서 표시될 수 있는지를 나타내며, 클릭재킹(clickjacking) 공격을 방어할 수 있다.

**이 헤더는 최신 브라우저에서 더 잘 지원되는 CSP의 `frame-ancestors` 옵션으로 대체되었다** (설정 세부 사항은 [Content Security Policy](../../../2-guides/content-security-policy.md) 참고).

```js
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

#### Permissions-Policy

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Permissions-Policy)를 사용하면 브라우저에서 사용할 수 있는 기능과 API를 제어할 수 있다. 이전 명칭은 `Feature-Policy`였다.

```js
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}
```

#### X-Content-Type-Options

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)는 `Content-Type` 헤더가 명시적으로 설정되지 않은 경우 브라우저가 콘텐츠의 타입을 추측(sniffing)하지 못하도록 방지한다. 사용자가 파일을 업로드하고 공유할 수 있는 웹사이트의 XSS 취약점을 방지할 수 있다.

예를 들어 사용자가 이미지를 다운로드하려고 할 때 실행 파일과 같은 다른 `Content-Type`으로 취급되어 악성 코드가 실행되는 것을 막는다. 브라우저 확장 프로그램 다운로드에도 적용된다. 이 헤더의 유일한 유효값은 `nosniff`다.

```js
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

#### Referrer-Policy

[이 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)는 현재 웹사이트(출처)에서 다른 웹사이트로 이동할 때 브라우저가 얼마만큼의 정보를 포함할지 제어한다.

```js
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin'
}
```

#### Content-Security-Policy (CSP)

애플리케이션에 [Content Security Policy](../../../2-guides/content-security-policy.md)를 추가하는 방법에 대해 자세히 알아볼 수 있다:

```ts filename="next.config.ts"
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

### 버전 변경 이력 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v13.3.0` | `missing` 배열 조건 지원 추가. |
| `v10.2.0` | `has` 배열 조건 지원 추가. |
| `v9.5.0` | `headers` 옵션 최초 추가. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (브라우저 DevTools Network 탭에서 커스텀 응답 헤더 확인 가능)
- 사용자가 확인할 화면과 결과:
  - 데모 페이지(`app/demo/headers/page.tsx`) 접속 시 브라우저 개발자 도구의 Network 탭에서 도큐먼트 요청을 선택한다.
  - 응답 헤더(Response Headers) 목록에 `next.config.js`에서 구성한 `x-custom-header: my custom header value`와 보안 헤더(`X-Frame-Options: SAMEORIGIN` 등)가 정상적으로 출력되는지 확인한다.
  - 조건부 헤더 매칭 데모: 쿼리 스트링 `?preview=true`를 전달했을 때만 추가되는 `x-preview-mode: active` 헤더의 존재 여부를 비교 검증한다.

## 연습 문제

1. `next.config.js`의 `headers` 설정에 관한 설명 중 올바르지 않은 것은 무엇인가?
   - A. 동일한 경로에 두 개 이상의 규칙이 일치하고 같은 헤더 키를 설정하면 마지막에 선언된 규칙의 값이 적용된다.
   - B. `/_next/static/...` 경로의 해시된 정적 자산에 기본 설정된 불변 `Cache-Control` 헤더를 `next.config.js`에서 자유롭게 재정의할 수 있다.
   - C. `has` 배열에 여러 조건을 지정하면 모든 조건이 충족되어야만 헤더 규칙이 적용된다.
   - D. `source` 경로 매칭에서 특수 문자인 괄호 `()`나 콜론 `:`을 리터럴로 매칭하려면 `\\`로 이스케이프해야 한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: Next.js는 프로덕션 환경에서 해시가 포함된 정적 자산(`/_next/static/...`)에 `Cache-Control: public, max-age=31536000, immutable` 헤더를 프레임워크 차원에서 강제하며, 이는 `next.config.js`의 `headers` 설정으로 덮어쓸 수 없다.
</details>

2. 다음 중 `headers` 옵션의 `has` 및 `missing` 조건에서 `type`으로 사용할 수 없는 값은 무엇인가?
   - A. `header`
   - B. `cookie`
   - C. `session`
   - D. `query`

<details><summary>정답 보기</summary>

정답: **C**
해설: `has` 및 `missing` 객체의 `type` 속성은 `'header'`, `'cookie'`, `'host'`, `'query'`의 네 가지만 지원한다. `session`은 기본 지원 타입이 아니며 쿠키나 헤더를 통해 간접적으로 검사해야 한다.
</details>

## 챕터 요약

- `headers`는 `next.config.js`에서 비동기 함수로 작성하며, 경로 패턴에 따라 커스텀 HTTP 응답 헤더를 주입한다.
- 파일 시스템 확인보다 앞서 실행되며, 같은 헤더 키가 중복되면 나중에 일치한 규칙이 우선권을 갖는다.
- 와일드카드(`*`, `+`), 정규식 매칭뿐 아니라 `has`와 `missing`으로 헤더, 쿠키, 쿼리 값에 따라 헤더를 조건부로 적용할 수 있다.
- HSTS, CSP, X-Frame-Options 등 애플리케이션 전역 보안 정책을 적용하는 표준적인 방법이다.
- 해시된 정적 자산(`/_next/static/...`)의 불변 `Cache-Control`은 프레임워크가 보장하므로 `next.config.js`에서 변경할 수 없다.
