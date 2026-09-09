# redirects

- 공식 문서: [redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `redirects` 설정을 사용하여 들어오는 요청을 다른 대상 URL로 리다이렉트하는 방법을 이해한다.
- 307(임시) 및 308(영구) HTTP 상태 코드의 동작 원리와 HTTP 메서드 유지 특성을 파악한다.
- 와일드카드, 정규식, 쿼리 스트링 자동 전달, `has`/`missing` 조건부 리다이렉트 구성 방식을 학습한다.

## 핵심 개념 및 설명

`redirects`는 특정 경로로 들어온 요청을 다른 내부 경로 또는 외부 URL로 리다이렉트하는 비동기(async) 함수다. `next.config.js` 또는 `next.config.ts` 파일에서 정의하며, URL 구조 개편, 구형 페이지 주소 이전, 도메인 간 이동 등을 처리할 때 사용한다.

### 기본 설정 구조

`redirects` 함수는 리다이렉트 규칙 객체 배열을 반환한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

### 리다이렉트 설정 속성

각 리다이렉트 객체는 다음 속성을 지정할 수 있다.

| 속성 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `source` | `string` | 필수 | 수신 요청 경로 패턴(`path-to-regexp` 문법 사용). |
| `destination` | `string` | 필수 | 리다이렉트할 목적지 경로 또는 외부 URL. |
| `permanent` | `boolean` | 조건부 필수 | `true`이면 308 영구 리다이렉트, `false`이면 307 임시 리다이렉트를 사용한다 (`statusCode` 미지정 시 필수). |
| `statusCode` | `number` | 선택 | 커스텀 HTTP 상태 코드(예: 301, 302). `permanent`와 동시에 사용할 수 없다. |
| `basePath` | `false \| undefined` | 선택 | `false`이면 `basePath`를 접두사로 붙이지 않는다 (외부 리다이렉트 전용). |
| `locale` | `false \| undefined` | 선택 | `false`이면 다국어 매칭 시 로케일을 포함하지 않는다. |
| `has` | `Array<HasMissingObject>` | 선택 | 요청에 반드시 존재해야 하는 조건 배열. |
| `missing` | `Array<HasMissingObject>` | 선택 | 요청에 존재하지 않아야 하는 조건 배열. |

> **알아두면 좋은 점**:
>
> - `permanent`와 `statusCode`는 상호 배타적이다. 둘을 동시에 지정하면 설정 파싱 시점에 에러가 발생한다.
> - 들어오는 요청에 포함된 쿼리 스트링(Query String)은 별도 작업 없이도 목적지(`destination`) URL로 자동으로 전달된다. 예를 들어 `/old?foo=bar` 요청은 `/new?foo=bar`로 리다이렉트된다.

### 307 및 308 상태 코드를 사용하는 이유

전통적인 301(영구 이동) 및 302(임시 발견) 상태 코드는 많은 브라우저 구현체가 요청의 HTTP 메서드를 원래의 `POST`에서 `GET`으로 임의 변경하는 문제가 있었다.

Next.js는 이러한 비표준적 동작을 방지하기 위해 기본적으로 **307(Temporary Redirect)**과 **308(Permanent Redirect)** 상태 코드를 채택한다.

- **308 (영구 리다이렉트)**: 클라이언트와 검색 엔진에 리소스가 영구적으로 새 위치로 이동했음을 알리고 브라우저가 응답을 캐시하도록 한다. 요청 메서드가 그대로 유지된다.
- **307 (임시 리다이렉트)**: 일시적인 경로 변경임을 알리며 클라이언트가 캐시하지 않는다. 이후 요청에서도 원래 경로로 시도하며 요청 메서드는 바뀌지 않는다.

과거 레거시 클라이언트 호환성을 위해 301이나 302 상태 코드가 반드시 필요하다면 `statusCode: 301` 또는 `statusCode: 302`를 명시적으로 지정할 수 있다.

### 경로 매칭 (Path Matching)

Next.js는 경로 매칭에 `path-to-regexp` 라이브러리를 사용한다.

#### 와일드카드 경로 매칭 (Wildcard Path Matching)

파라미터 이름 뒤에 `*`를 사용하면 경로 세그먼트를 0개 이상, `+`를 사용하면 1개 이상 매칭한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /blog, /blog/a, /blog/a/b 모두 /news/a, /news/a/b 등으로 리다이렉트된다
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
      {
        // /post/first는 일치하지만 /post는 일치하지 않는다
        source: '/post/:slug+',
        destination: '/articles/:slug+',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - 파라미터 콜론(`:`) 앞에는 반드시 슬래시(`/`)가 있어야 한다 (예: `/:path*`). `/`를 생략하고 `source: '/blog:slug'` 형태로 작성하면 콜론을 리터럴 문자로 인식하여 의도치 않은 무한 리다이렉트 루프에 빠질 위험이 있다.

#### 정규식 경로 매칭 (Regex Path Matching)

특정 형식의 파라미터만 선별하여 리다이렉트하려면 괄호 안에 정규식을 삽입한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /post/123과 같은 숫자 ID만 /posts/123으로 리다이렉트한다
        source: '/post/:id(\\d+)',
        destination: '/posts/:id',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

정규식 특수 문자(`(`, `)`, `{`, `}`, `:`, `*`, `+`, `?`)를 일반 문자열로 취급하려면 역슬래시 두 개(`\\`)로 이스케이프해야 한다.

### 헤더, 쿠키, 쿼리 매칭 (Header, Cookie, and Query Matching)

`has` 또는 `missing` 조건을 지정하여 특정 헤더, 쿠키, 호스트, 쿼리 파라미터가 일치할 때만 리다이렉트를 발동할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        has: [
          {
            type: 'cookie',
            key: 'authorized',
            value: 'false',
          },
        ],
        destination: '/login',
        permanent: false,
      },
      {
        source: '/old-search',
        has: [
          {
            type: 'query',
            key: 'q',
            value: '(?<term>.*)', // 명명된 캡처 그룹 사용
          },
        ],
        destination: '/search?query=:term',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

### basePath 지원 리다이렉트 (Redirects with basePath support)

`next.config.js`에 `basePath`가 지정되어 있으면 `source`와 `destination` 모두에 `basePath` 접두사가 자동으로 붙는다.

외부 도메인이나 서브패스 외부로 리다이렉트해야 할 때는 `basePath: false`를 지정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/docs',
  async redirects() {
    return [
      {
        // /docs/old-route -> /docs/new-route 로 리다이렉트된다
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
      {
        // /external 요청 시 basePath 없이 완전한 외부 사이트로 리다이렉트된다
        source: '/external',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

### i18n 지원 리다이렉트 (Redirects with i18n support)

국제화 라우팅 설정 시 `source` 앞에 각 로케일 접두사가 자동으로 적용된다. 특정 로케일 접두사 없이 고유 경로 자체로만 리다이렉트하려면 `locale: false`를 설정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/with-locale',
        destination: '/new-with-locale',
        locale: false,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

### 기타 리다이렉트 방식 (Other Redirects)

정적 설정 수준의 `redirects` 외에도 Next.js App Router는 런타임 실행 흐름에 따라 프로그래밍 방식의 리다이렉트 API를 제공한다.

1. **`redirect()` 함수**: `Server Component`, `Route Handler`, `Server Action` 내부에서 조건에 따라 즉시 307 임시 리다이렉트를 발생시킨다. 내부적으로 `NEXT_REDIRECT` 에러를 던져 실행을 중단한다.
2. **`permanentRedirect()` 함수**: `Server Component`, `Route Handler`, `Server Action` 내부에서 308 영구 리다이렉트를 실행한다.
3. **`proxy` (미들웨어)**: 요청이 애플리케이션 라우트에 도달하기 전에 네트워크 단계에서 세션, 지오로케이션(geolocation), 쿠키 등을 검사하여 동적으로 리다이렉트를 처리한다.

### 버전 변경 이력 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v13.3.0` | `missing` 배열 조건 지원 추가. |
| `v10.0.4` | `statusCode` 옵션을 통한 커스텀 상태 코드 지원 추가. |
| `v9.5.0` | `redirects` 설정 함수 최초 도입. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (URL 입력 시 지정된 경로로 307/308 리다이렉트 브라우저 관찰 가능)
- 사용자가 확인할 화면과 결과:
  - 브라우저 주소창에 `http://localhost:3000/demo/old-path`를 입력하고 접속한다.
  - 브라우저가 즉시 `http://localhost:3000/demo/new-path`로 이동하는지 확인한다.
  - 개발자 도구의 Network 탭에서 최초 요청이 HTTP 상태 코드 `308 Permanent Redirect` 또는 `307 Temporary Redirect`를 반환하고 `Location` 헤더에 목적지 주소가 포함돼 있는지 관찰한다.
  - 쿼리 스트링 전달 검증: `/demo/old-path?category=tech` 입력 시 목적지 주소가 `/demo/new-path?category=tech`로 유지되는지 확인한다.

## 연습 문제

1. `next.config.js`의 `redirects` 설정에 대한 설명 중 올바른 것은 무엇인가?
   - A. `permanent: true`를 지정하면 브라우저에 기본적으로 301 상태 코드가 반환된다.
   - B. `permanent`와 `statusCode` 속성을 동시에 정의하여 영구 리다이렉트 여부와 상태 코드를 함께 제어할 수 있다.
   - C. Next.js는 HTTP 메서드(`POST` 등)가 `GET`으로 변조되는 문제를 방지하기 위해 기본 상태 코드로 307 및 308을 채택한다.
   - D. 요청 경로에 포함된 쿼리 스트링은 목적지 경로에 자동으로 전달되지 않으므로 수동 매핑해야 한다.

<details><summary>정답 보기</summary>

정답: **C**
해설: 과거 301/302 상태 코드는 클라이언트가 HTTP 메서드를 임의로 `GET`으로 변경하는 문제가 있었다. Next.js는 원래의 HTTP 요청 메서드를 보존하기 위해 307(임시)과 308(영구) 상태 코드를 기본으로 사용한다. `permanent`와 `statusCode`는 상호 배타적이므로 함께 사용할 수 없다.
</details>

2. 다음 중 `redirects` 규칙 작성 시 무한 리다이렉트 루프를 유발할 수 있는 가장 대표적인 실수는 무엇인가?
   - A. `basePath: false`를 지정하는 것
   - B. 파라미터 콜론(`:`) 앞에 슬래시(`/`)를 빠뜨리고 `source: '/blog:slug'` 형태로 작성하는 것
   - C. `source`에 정규식 매칭을 적용하는 것
   - D. `destination`에 외부 도메인 URL을 지정하는 것

<details><summary>정답 보기</summary>

정답: **B**
해설: 파라미터 이름 앞에 슬래시를 누락하면(예: `/blog:slug`), `path-to-regexp`가 이를 다이나믹 파라미터가 아닌 일반 문자열 리터럴로 취급하여 비정상적인 매칭이 발생하고 무한 리다이렉트 루프를 초래할 수 있다.
</details>

## 챕터 요약

- `redirects`는 URL 변경이나 페이지 이전 시 수신 요청을 지정된 목적지로 리다이렉트하는 `next.config.js`의 설정 함수다.
- 기본적으로 HTTP 메서드를 온전히 보존하는 307(임시) 및 308(영구) 상태 코드를 사용한다.
- 요청 시 전달된 쿼리 스트링은 목적지 URL로 그대로 보존되어 전달된다.
- 와일드카드(`*`, `+`), 정규식, `has`/`missing` 조건을 활용하여 정밀한 조건부 라우팅을 설계할 수 있다.
- 런타임 동적 리다이렉트가 필요하면 `redirect()`, `permanentRedirect()` 함수나 `proxy`를 활용한다.
