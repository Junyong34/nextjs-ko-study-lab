# robots.txt

- 공식 문서: [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- crawler별 접근 규칙을 정적 text 또는 `MetadataRoute.Robots`로 생성한다.
- 표준·비표준 directive와 caching 조건을 이해한다.

## 핵심 개념 및 설명

`app` 디렉터리의 **루트**에 [로봇 제외 표준](https://en.wikipedia.org/wiki/Robots.txt#Standard)과 일치하는 `robots.txt` 파일을 추가하거나 생성하여 검색 엔진 크롤러에게 사이트에서 액세스할 수 있는 URL을 알려준다.

<a id="static-robotstxt"></a>
### 정적 `robots.txt`

```txt filename="app/robots.txt"
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

<a id="generate-a-robots-file"></a>
### 로봇 파일 생성

[`Robots` 객체](#robots-object)를 반환하는 `robots.js` 또는 `robots.ts` 파일을 추가한다.

> **알아두면 좋은 점**: `robots.js`는 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 [동적 구성](../../../2-guides/caching-without-cache-components.md#dynamic) 옵션을 사용하지 않는 한 기본적으로 캐시되는 특수 Route Handler이다.

```ts filename="app/robots.ts" switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

```js filename="app/robots.js" switcher
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

산출:

```txt filename="app/robots.txt"
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

<a id="customizing-specific-user-agents"></a>
#### 특정 사용자 에이전트 사용자 정의

사용자 에이전트 배열을 `rules` 속성에 전달하여 개별 검색 엔진 봇이 사이트를 크롤링하는 방법을 사용자 정의할 수 있다. 예를 들어:

```ts filename="app/robots.ts" switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

```js filename="app/robots.js" switcher
export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/private/'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

산출:

```txt filename="app/robots.txt"
User-Agent: Googlebot
Allow: /
Disallow: /private/

User-Agent: Applebot
Disallow: /

User-Agent: Bingbot
Disallow: /

Sitemap: https://acme.com/sitemap.xml
```

<a id="non-standard-directives"></a>
#### 비표준 지시문

일부 검색 엔진은 `Request-Rate`(Seznam) 또는 `Clean-param`(Yandex)와 같이 [로봇 제외 표준](https://en.wikipedia.org/wiki/Robots.txt#Standard)의 일부가 아닌 명령을 지원한다. 규칙의 `other` 필드를 통해 이를 전달한다. 키는 대/소문자를 유지하고 배열 값은 규칙의 `User-Agent` 블록 범위로 항목당 한 줄을 내보낸다.

```ts filename="app/robots.ts" switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: 'SeznamBot',
        allow: '/',
        other: {
          'Request-Rate': '10/1m',
        },
      },
    ],
  }
}
```

```js filename="app/robots.js" switcher
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: 'SeznamBot',
        allow: '/',
        other: {
          'Request-Rate': '10/1m',
        },
      },
    ],
  }
}
```

산출:

```txt filename="app/robots.txt"
User-Agent: *
Allow: /

User-Agent: SeznamBot
Allow: /
Request-Rate: 10/1m
```

> **알아두면 좋은 점**: `other`의 값은 그대로 전달된다. Next.js는 지시어 이름이나 값의 유효성을 검사하지 않으므로 정확한 구문은 대상 검색 엔진의 설명서를 참조한다.

<a id="robots-object"></a>
#### 로봇 객체

```tsx filename="app/robots.ts"
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }>
  sitemap?: string | string[]
  host?: string
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ---------------------------------------------------------- |
| `v16.3.0` | 비표준 에이전트별 지시어에 대한 `other` 필드를 추가했다. |
| `v13.3.0` | `robots`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 Googlebot과 Bingbot 규칙, sitemap, 비표준 directive를 생성하고 raw text를 검증한다.

## 연습 문제

1. crawler별 다른 규칙을 정의하는 방법은?
   - A. `rules` 배열
   - B. `children` prop
   - C. `ImageResponse`

<details><summary>정답 보기</summary>

정답: A. user agent별 rule 객체를 배열에 둔다.
</details>

## 챕터 요약

- robots 파일은 `app` root에 둔다.
- 정적 text와 코드 생성 방식을 지원한다.
- `MetadataRoute.Robots`로 타입을 검사한다.
- `rules` 배열로 crawler를 구분한다.
- 비표준 directive는 `other`에 보존할 수 있다.
