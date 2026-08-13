# not-found.js

- 공식 문서: [not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `not-found.js`와 실험적인 `global-not-found.js`의 적용 범위를 구분한다.
- streaming 여부에 따른 상태 코드와 metadata 동작을 이해한다.
- 404 UI에서 데이터 fetching과 테마를 다루는 방법을 익힌다.

## 핵심 개념 및 설명

Next.js는 찾을 수 없는 경우를 처리하기 위해 두 가지 규칙을 제공한다.

- **`not-found.js`**: 라우트 세그먼트에서 [`notFound`](../3.3-functions/not-found.md) 기능을 호출할 때 사용된다.
- **`global-not-found.js`**: 전체 앱에서 일치하지 않는 경로에 대한 전역 404 페이지를 정의하는 데 사용된다. 이는 라우팅 수준에서 처리되며 레이아웃이나 페이지 렌더링에 의존하지 않는다.

<a id="not-foundjs"></a>
### `not-found.js`

**not-found** 파일은 [`notFound`](../3.3-functions/not-found.md) 함수가 라우트 세그먼트 내에 던져질 때 UI를 렌더링하는 데 사용된다. 사용자 정의 UI 제공과 함께 Next.js는 스트리밍된 응답에 대해 `200`HTTP 상태 코드를 반환하고, 스트리밍되지 않은 응답에 대해 `404`를 반환한다(SEO에 대한 자세한 내용은 [상태 코드](loading.md#status-codes) 참조).

```tsx filename="app/not-found.tsx" switcher
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

```jsx filename="app/blog/not-found.js" switcher
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

[컴포넌트 계층 구조](../../1-getting-started/project-structure.md#component-hierarchy)에서 `not-found.js`는 `loading.js`와 `page.js` 사이를 렌더링한다. 동일한 세그먼트에 있는 `loading.js`의 `<Suspense>` 경계와 `error.js`의 오류 경계로 래핑된다.

> **알아두면 좋은 점**: 기본 찾을 수 없음 UI는 `prefers-color-scheme`를 통해 운영 체제의 색 구성표를 따르며 앱 수준 테마(예:`<html>`의 클래스 또는 `data-theme` 특성)를 읽지 않는다. 루트 레이아웃 내부에서 렌더링되기 때문에 명시적인 테마를 일치시키는 가장 빠른 방법은 테마 선택기로 범위가 지정된 전역 스타일시트에 더 높은 특수성 규칙 쌍을 추가하는 것이다(예:`html[data-theme='light'] body` 및 `html[data-theme='dark'] body`). 마크업을 완벽하게 제어하려면 고유한 `not-found.js`를 제공한다.

<a id="global-not-foundjs-experimental"></a>
### `global-not-found.js`(실험용)

`global-not-found.js` 파일을 사용하면 전체 애플리케이션에 대해 404 페이지를 정의할 수 있다. 경로 수준에서 작동하는 `not-found.js`와 달리 요청된 URL이 어떤 경로와도 전혀 일치하지 않는 경우에 사용된다. Next.js는 **렌더링을 건너뛰고** 이 글로벌 페이지를 직접 반환한다.

`global-not-found.js` 파일은 앱의 일반 렌더링을 우회한다. 즉, 404 페이지에 필요한 전역 스타일, 글꼴 또는 기타 종속성을 가져와야 한다. 여기에는 테마가 포함된다.`global-not-found.js`는 레이아웃을 우회하므로 OS 색 구성표는 기본 UI가 볼 수 있는 유일한 신호이므로 이 파일 내에 테마(클래스 또는 속성)를 적용한다.

> **알아두면 좋은 점**: 전역 스타일의 작은 버전과 간단한 글꼴 모음을 사용하면 이 페이지의 성능이 향상될 수 있다.

`global-not-found.js`는 `layout.js`와 `not-found.js`의 조합을 사용하여 404 페이지를 구축할 수 없는 경우에 유용하다. 이는 두 가지 경우에 발생할 수 있다.

- 앱에 여러 루트 레이아웃(예:`app/(admin)/layout.tsx` 및 `app/(shop)/layout.tsx`)이 있으므로 전역 404를 구성할 단일 레이아웃이 없다.
- 루트 레이아웃은 최상위 다이나믹 세그먼트(예:`app/[country]/layout.tsx`)를 사용하여 정의되므로 일관된 404 페이지를 구성하기가 더 어려워집니다.

이를 활성화하려면 `next.config.ts`에 `globalNotFound` 플래그를 추가한다.

```tsx filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
}

export default nextConfig
```

그런 다음 `app` 디렉터리의 루트에 `app/global-not-found.js` 파일을 만듭니다.

```tsx filename="app/global-not-found.tsx" switcher
// 전역 스타일 및 글꼴 가져오기
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>This page does not exist.</p>
      </body>
    </html>
  )
}
```

```jsx filename="app/global-not-found.js" switcher
// 전역 스타일 및 글꼴 가져오기
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>This page does not exist.</p>
      </body>
    </html>
  )
}
```

`not-found.js`와 달리 이 파일은 `<html>` 및 `<body>` 태그를 포함하여 전체 HTML 문서를 반환해야 한다.

<a id="reference"></a>
### 참조

<a id="props"></a>
#### prop

`not-found.js` 또는 `global-not-found.js` 컴포넌트는 prop을 허용하지 않는다.

> **알아두면 좋은 점**: 예상되는 `notFound()` 오류를 포착하는 것 외에도 루트 `app/not-found.js` 및 `app/global-not-found.js` 파일은 전체 애플리케이션에 대해 일치하지 않는 URL을 처리한다. 즉, 앱에서 처리하지 않는 URL을 방문하는 사용자에게는 내보낸 UI가 표시된다.

<a id="examples"></a>
### 예제

<a id="data-fetching"></a>
#### 데이터 가져오기

기본적으로 `not-found`는 Server Component이다. 데이터를 가져오고 표시하려면 이를 `async`로 표시할 수 있다.

```tsx filename="app/not-found.tsx" switcher
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>Not Found: {data.name}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}
```

```jsx filename="app/not-found.jsx" switcher
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>Not Found: {data.name}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}
```

경로에 따라 콘텐츠를 표시하기 위해 `usePathname`와 같은 Client Component 후크를 사용해야 하는 경우 대신 클라이언트 측에서 데이터를 가져와야 한다.

<a id="metadata"></a>
#### 메타데이터

`global-not-found.js`의 경우 `metadata` 객체 또는 [`generateMetadata`](../3.3-functions/generate-metadata.md) 함수를 내보내 404 페이지의 `<title>`,`<meta>` 및 기타 헤드 태그를 사용자 정의할 수 있다.

> **알아두면 좋은 점**: Next.js는 `global-not-found.js` 페이지를 포함하여 404 상태 코드를 반환하는 페이지에 `<meta name="robots" content="noindex" />`를 자동으로 삽입한다.

```tsx filename="app/global-not-found.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div>
          <h1>Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </body>
    </html>
  )
}
```

```jsx filename="app/global-not-found.js" switcher
export const metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div>
          <h1>Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </body>
    </html>
  )
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | --------------------------------------------------- |
| `v15.4.0` | `global-not-found.js`도입(실험적). |
| `v13.3.0` | 루트 `app/not-found`는 일치하지 않는 전역 URL을 처리한다. |
| `v13.0.0` | `not-found`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 상품이 없을 때 `notFound()`를 호출하고 세그먼트 404 UI를 표시한다.
- 직접 입력·새로고침과 클라이언트 내비게이션에서 상태 코드와 UI를 비교한다.
- 다중 root layout 구조에서 `global-not-found.tsx`의 전역 스타일 포함 여부를 확인한다.

## 연습 문제

1. `global-not-found.js`가 반드시 직접 반환해야 하는 것은?
   - A. `<html>`과 `<body>`
   - B. `children` prop
   - C. `reset()` 함수

<details><summary>정답 보기</summary>

정답: A. 앱 layout 렌더링을 건너뛰므로 완전한 HTML 문서가 필요하다.
</details>

## 챕터 요약

- `not-found.js`는 세그먼트에서 `notFound()` 결과를 렌더링한다.
- streaming 404 UI는 HTTP `200`을 반환할 수 있다.
- `global-not-found.js`는 일치하지 않는 URL을 routing 수준에서 처리한다.
- 전역 404는 HTML 문서와 스타일·테마를 직접 포함한다.
- Next.js는 실제 404 응답에 `noindex`를 자동 주입한다.
