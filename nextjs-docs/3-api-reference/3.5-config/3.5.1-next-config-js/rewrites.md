# rewrites

- 공식 문서: [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `rewrites` 설정이 동작하는 원리를 이해한다. 브라우저 주소창의 URL은 그대로 두고 수신 요청만 다른 내부 경로나 외부 URL로 프록시 매핑하는 설정이다.
- 라우트 확인 순서(`headers` -> `redirects` -> `proxy` -> `beforeFiles` -> 파일 시스템 -> `afterFiles` -> 다이나믹 라우트 -> `fallback`)의 각 단계별 동작 차이를 파악한다.
- 와일드카드, 정규식, 쿼리 매개변수 전달 규칙, 점진적 마이그레이션에 쓰는 외부 프록시 구성 방식을 학습한다.

## 핵심 개념 및 설명

`rewrites`는 들어오는 요청 경로를 다른 목적지 경로로 매핑해 주는 비동기(async) 함수다. URL 리버스 프록시 역할을 하며 실제 목적지 경로를 감춘다.

리다이렉트(`redirects`)와 재작성(`rewrites`)의 핵심 차이는 다음과 같다.

- **리다이렉트 (`redirects`)**: 클라이언트에 HTTP 307 또는 308 응답을 반환하므로 브라우저가 주소창의 URL을 목적지 주소로 바꾼다.
- **재작성 (`rewrites`)**: 브라우저 주소창의 URL은 그대로 둔 채 서버가 목적지 경로의 콘텐츠를 가져와 클라이언트에 제공한다.

### 기본 설정 구조

`rewrites` 함수는 규칙 객체의 배열을 반환하거나 실행 단계별(`beforeFiles`, `afterFiles`, `fallback`) 속성을 갖는 객체를 반환한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}

export default nextConfig
```

### 재작성 설정 속성

각 재작성 규칙 객체는 다음 속성을 지원한다.

| 속성 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `source` | `string` | 필수 | 수신 요청 경로 패턴(`path-to-regexp` 문법 사용). |
| `destination` | `string` | 필수 | 내부 라우트 경로 또는 외부 URL. |
| `basePath` | `false \| undefined` | 선택 | `false`이면 `basePath`를 접두사로 포함하지 않는다 (외부 목적지 전용). |
| `locale` | `false \| undefined` | 선택 | `false`이면 다국어 매칭 시 로케일을 포함하지 않는다. |
| `has` | `Array<HasMissingObject>` | 선택 | 요청에 반드시 존재해야 하는 조건 배열. |
| `missing` | `Array<HasMissingObject>` | 선택 | 요청에 존재하지 않아야 하는 조건 배열. |

### 라우트 확인 순서 (Route Checking Order)

Next.js는 요청을 처리할 때 엄격한 우선순위 파이프라인을 따른다. 객체 형태(`beforeFiles`, `afterFiles`, `fallback`)로 `rewrites`를 정의하면 요청 처리 파이프라인의 특정 시점에 개입하도록 지정한다.

```text
1. headers 확인 및 적용
2. redirects 확인 및 적용
3. proxy
4. beforeFiles rewrites (파일 시스템 검사 전 실행)
5. 정적 파일(/public, /_next/static) 및 비다이나믹 페이지
6. afterFiles rewrites (정적 파일 확인 후, 다이나믹 라우트 검사 전 실행)
7. 다이나믹 라우트(Dynamic Routes)
8. fallback rewrites (모든 라우트와 파일이 일치하지 않은 후, 404 직전 실행)
```

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // 파일 시스템(정적 파일 및 기존 페이지)보다 먼저 확인된다
        // 실제 페이지 파일이 존재하더라도 이를 가로채서 다른 곳으로 보낼 수 있다
        {
          source: '/some-page',
          destination: '/somewhere-else',
          has: [{ type: 'query', key: 'overrideMe' }],
        },
      ],
      afterFiles: [
        // 정적 파일과 정적 페이지가 일치하지 않은 경우에만 확인된다
        // 다이나믹 라우트보다 먼저 평가된다
        {
          source: '/non-existent',
          destination: '/somewhere-else',
        },
      ],
      fallback: [
        // 정적 파일, 정적 페이지, 다이나믹 라우트가 모두 일치하지 않은 경우 실행된다
        // 404 페이지로 넘어가기 전 최후의 수단으로 외부 레거시 서버 등에 위임할 때 유용하다
        {
          source: '/:path*',
          destination: 'https://my-old-site.com/:path*',
        },
      ],
    }
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - 배열 형태로 반환한 단순 `rewrites`는 기본적으로 `afterFiles` 단계에서 평가된다.
> - `beforeFiles`는 정적 파일을 포함한 실제 파일 시스템을 무시하고 가로채므로 주의해서 사용해야 한다.

### 재작성 매개변수 동작 (Rewrite parameters)

`destination`에서 파라미터를 어떻게 쓰는지에 따라 쿼리 스트링 전달 방식이 달라진다.

1. **파라미터가 `destination`에 명시된 경우**: `source`에서 캡처한 파라미터를 `destination` 경로에 직접 주입하고 자동 쿼리 전달은 비활성화한다.
2. **파라미터가 `destination`에 생략된 경우**: `source`에서 캡처했지만 `destination`에 쓰지 않은 파라미터는 자동으로 쿼리 파라미터 형태가 되어 목적지 URL 뒤에 덧붙는다.

```ts filename="next.config.ts"
// 예시 1: 파라미터가 destination 경로에 사용됨
// /old-post/123 -> /new-post/123 으로 프록시된다
{
  source: '/old-post/:id',
  destination: '/new-post/:id',
}

// 예시 2: 파라미터가 destination 경로에 사용되지 않음
// /old-post/123 -> /new-post?id=123 으로 프록시된다
{
  source: '/old-post/:id',
  destination: '/new-post',
}
```

### 경로 매칭 (Path Matching)

Next.js는 `path-to-regexp` 라이브러리로 경로 패턴을 해석한다.

#### 와일드카드 경로 매칭 (Wildcard Path Matching)

파라미터 뒤에 `*`(0개 이상)나 `+`(1개 이상)를 붙이면 하위 경로를 통째로 매칭한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // /blog, /blog/tech, /blog/tech/nextjs 등을 /news/... 로 매핑한다
        source: '/blog/:slug*',
        destination: '/news/:slug*',
      },
    ]
  },
}

export default nextConfig
```

#### 정규식 경로 매칭 (Regex Path Matching)

괄호 안에 정규식을 넣으면 특정 형태의 문자열만 선별해 매핑한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 숫자 ID로 구성된 요청만 매칭한다
        source: '/user/:id(\\d+)',
        destination: '/profile/:id',
      },
    ]
  },
}

export default nextConfig
```

특수 기호(`(`, `)`, `{`, `}`, `:`, `*`, `+`, `?`)를 일반 문자열로 취급하려면 `\\`로 이스케이프해야 한다.

### 헤더, 쿠키, 쿼리 매칭 (Header, Cookie, and Query Matching)

`has`나 `missing` 조건을 걸면 클라이언트의 요청 상태에 따라 프록시를 골라 적용한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/feedback',
        has: [
          {
            type: 'cookie',
            key: 'beta-tester',
            value: 'true',
          },
        ],
        destination: '/beta/feedback',
      },
    ]
  },
}

export default nextConfig
```

### 외부 URL로의 재작성 (Rewriting to an external URL)

`destination`에 외부 전체 URL(`https://...`)을 지정하면 Next.js 서버가 리버스 프록시로 동작하며 외부 서버의 응답을 그대로 브라우저에 전달한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.external-backend.com/v1/:path*',
      },
    ]
  },
}

export default nextConfig
```

#### Next.js의 점진적 도입 (Incremental adoption of Next.js)

기존 레거시 웹 서비스를 Next.js로 점진적으로 전환할 때 `fallback` 재작성이 효과적이다.

1. 새로 구현한 라우트는 Next.js 프로젝트 내부 파일 시스템(`app/`)에 구축한다.
2. 아직 마이그레이션하지 않은 나머지 모든 요청은 `fallback` 재작성으로 기존 레거시 서버에 위임한다.
3. 사용자는 동일한 도메인 주소에서 서비스 단절 없이 점진적으로 개선되는 애플리케이션을 경험한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: 'https://legacy.example.com/:path*',
        },
      ],
    }
  },
}

export default nextConfig
```

#### basePath 지원 재작성 (Rewrites with basePath support)

기본적으로 Next.js는 `rewrites`의 `source`와 `destination`에 애플리케이션의 `basePath`를 자동으로 적용한다.

외부 URL로 재작성할 때 현재 애플리케이션의 `basePath`를 제외하고 원본 외부 주소 그대로 매핑하려면 `basePath: false`를 명시한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/docs',
  async rewrites() {
    return [
      {
        // 내부 대상에는 basePath가 자동 적용된다 (/docs/internal-proxy -> /docs/somewhere)
        source: '/internal-proxy',
        destination: '/somewhere',
      },
      {
        // 외부 대상 매핑 시 basePath 접두사를 배제한다
        source: '/external-api/:path*',
        destination: 'https://api.example.com/:path*',
        basePath: false,
      },
    ]
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - 내부 라우트 간 재작성에는 `basePath: false`를 사용할 수 없다. 내부 라우트는 항상 애플리케이션의 `basePath` 컨텍스트 안에서 실행되어야 한다.
> - `trailingSlash: true`를 사용할 경우 외부 재작성의 `source`와 `destination` 모두에 일관되게 후행 슬래시를 유지해야 한다.

### 버전 변경 이력 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v13.3.0` | `missing` 배열 조건 지원 추가. |
| `v10.0.0` | `beforeFiles`, `afterFiles`, `fallback` 객체 반환 형태 도입. |
| `v9.5.0` | `rewrites` 설정 함수 최초 도입. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (주소창 URL 유지 상태에서 내부 라우트 또는 외부 API 콘텐츠 프록시 관찰 가능)
- 사용자가 확인할 화면과 결과:
  - 브라우저 주소창에서 `http://localhost:3000/demo/mask-route`로 접속한다.
  - 브라우저 주소창의 URL은 `/demo/mask-route`로 그대로 남지만 화면에는 실제 대상 라우트인 `/demo/actual-target`의 UI와 데이터가 렌더링되는지 확인한다.
  - 외부 프록시 데모: `/demo/external-proxy-api/status`를 요청하면 브라우저 주소가 바뀌지 않은 채로 외부 백엔드 API의 JSON 데이터 응답이 그대로 전달되는지 Network 탭에서 확인한다.

## 연습 문제

1. Next.js의 라우트 확인 파이프라인에서 실제 페이지 파일이나 정적 자산(/public) 검사보다 먼저 실행돼 기존 페이지를 가로채 덮어쓰는 재작성 단계는 무엇인가?
   - A. `afterFiles`
   - B. `beforeFiles`
   - C. `fallback`
   - D. `defaultRewrites`

<details><summary>정답 보기</summary>

정답: **B**
해설: `beforeFiles` 재작성은 정적 파일과 비다이나믹 페이지를 포함한 파일 시스템 검사보다 먼저 실행된다. 따라서 동일한 경로의 물리적 파일이 존재하더라도 이를 가로채서 다른 대상 경로로 프록시할 수 있다.
</details>

2. `rewrites`와 `redirects`의 차이점에 대한 설명 중 올바르지 않은 것은 무엇인가?
   - A. `redirects`는 클라이언트에 307 또는 308 응답을 반환하여 브라우저 주소창의 URL을 변경한다.
   - B. `rewrites`는 브라우저 주소창의 URL을 그대로 유지하면서 다른 대상의 콘텐츠를 제공한다.
   - C. `rewrites`의 `fallback` 단계는 다이나믹 라우트까지 검사한 후 일치하는 항목이 없을 때 404 반환 직전에 실행된다.
   - D. 내부 라우트 간 `rewrites` 규칙을 작성할 때 `basePath: false`를 설정하여 `basePath`를 자유롭게 비활성화할 수 있다.

<details><summary>정답 보기</summary>

정답: **D**
해설: 내부 라우트 간 재작성에서는 `basePath: false`를 사용할 수 없으며, 오직 외부 목적지 URL(`https://...`)로 프록시할 때만 `basePath: false`를 지정할 수 있다.
</details>

## 챕터 요약

- `rewrites`는 브라우저 URL 주소를 마스킹하면서 내부 또는 외부의 다른 대상 경로로 요청을 리버스 프록시하는 설정이다.
- 객체를 반환하면 `beforeFiles`(파일 시스템 이전), `afterFiles`(파일 시스템 이후), `fallback`(404 직전) 세 단계로 실행 타이밍을 제어한다.
- `destination`에서 파라미터를 직접 소비하지 않으면 캡처한 파라미터가 자동으로 쿼리 스트링으로 전달된다.
- `fallback` 재작성은 기존 레거시 시스템에서 Next.js로 서비스를 중단 없이 점진적으로 마이그레이션할 때 쓴다.
- 외부 URL로 재작성할 때는 `basePath: false`를 붙여 로컬 서브패스 접두사를 제외한다.
