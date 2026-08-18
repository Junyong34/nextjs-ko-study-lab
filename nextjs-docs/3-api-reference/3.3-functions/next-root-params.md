# next/root-params

- 공식 문서: [next/root-params](https://nextjs.org/docs/app/api-reference/functions/next-root-params)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 루트 레이아웃 상위의 루트 파라미터에 접근할 수 있도록 해주는 `next/root-params` 모듈의 역할과 사용법을 이해한다.
- Server Component 및 공유 유틸리티 함수에서 props 드릴링 없이 비동기 게터 함수로 루트 파라미터(`lang`, `locale` 등)를 읽는 패턴을 익힌다.
- 다중 루트 레이아웃 환경에서의 반환 타입(`string | undefined`) 및 캐치올 세그먼트 지원 방식을 파악한다.
- [`use cache`](../3.4-directives/use-cache.md) 및 [`generateStaticParams`](./generate-static-params.md)와의 연계 동작 원리를 습득한다.

## 핵심 개념 및 설명

`next/root-params` 모듈은 **Server Component**에서 루트 수준의 다이나믹 세그먼트 파라미터에 접근할 수 있는 비동기 게터(getter) 함수를 제공한다.

루트 레이아웃(`app/[lang]/layout.tsx`) 상위에 정의된 세그먼트 이름이 그대로 export 함수명이 된다. 예를 들어 `[lang]` 폴더 구조라면 `import { lang } from 'next/root-params'` 형태로 불러온다.

```tsx filename="app/[lang]/layout.tsx" highlight={1,5} switcher
import { lang } from 'next/root-params'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={await lang()}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/[lang]/layout.js" highlight={1,5} switcher
import { lang } from 'next/root-params'

export default async function RootLayout({ children }) {
  return (
    <html lang={await lang()}>
      <body>{children}</body>
    </html>
  )
}
```

> **알아두면 좋은 점**:
>
> - 루트 파라미터 이름은 반드시 유효한 JavaScript 함수 식별자(identifier)여야 한다. 케밥 케이스(예: `[post-slug]`)는 지원되지 않으며 빌드 시 에러를 유발한다.
> - `next/root-params`는 **Server Component**에서만 사용할 수 있다. Client Component, Server Action, `unstable_cache` 내부에서는 사용할 수 없다.
> - `next dev`, `next build`, 또는 `next typegen` 실행 시 자동으로 TypeScript 타입이 생성된다.

### 루트 파라미터와 `generateStaticParams`

루트 파라미터는 라우트가 정의되는 즉시 사용 가능하다. Cache Components 환경에서는 각 루트 파라미터에 대해 최소 하나 이상의 값이 `generateStaticParams`에서 반환되어야 한다:

```tsx filename="app/[lang]/layout.tsx" highlight={11-13} switcher
import { lang } from 'next/root-params'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={await lang()}>
      <body>{children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }]
}
```

### 공유 코드 및 유틸리티에서의 접근

루트 파라미터 게터는 모듈 import 방식으로 동작하므로, 페이지나 레이아웃뿐만 아니라 서버 측 공통 유틸리티 함수에서도 손쉽게 호출할 수 있다:

```tsx filename="lib/get-dictionary.ts"
import { lang } from 'next/root-params'

export async function getDictionary() {
  const currentLang = await lang()
  return import(`@/dictionaries/${currentLang}.json`).then((module) => module.default)
}
```

### `use cache` 지시어와의 연동

`use cache` 스코프 내부에서 루트 파라미터 게터를 호출하면, Next.js가 해당 캐시 함수가 실제로 참조한 루트 파라미터만을 추적하여 캐시 키에 바인딩한다:

```tsx filename="app/[lang]/components/cached-nav.tsx"
import { lang } from 'next/root-params'

async function getNavigation() {
  'use cache'
  const currentLang = await lang()
  // 캐시 키에 오직 lang 값만 포함된다
  const res = await fetch(`https://api.example.com/nav?lang=${currentLang}`)
  return res.json()
}
```

### 세그먼트 유형별 반환 타입

| 세그먼트 유형 | 예시 | 반환 타입 |
|---|---|---|
| 다이나믹 | `[id]` | `Promise<string>` |
| 캐치올 | `[...path]` | `Promise<string[]>` |
| 옵셔널 캐치올 | `[[...path]]` | `Promise<string[] \| undefined>` |

다중 루트 레이아웃 환경에서 특정 루트에만 파라미터가 존재하는 경우 반환 타입에 `undefined`가 포함될 수 있다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.3.0` | `next/root-params` 도입 |

## 예제 및 데모 설계

- `app/[locale]/layout.tsx` 구조에서 `next/root-params`의 `locale` 게터를 사용하여 다국어 사전을 불러오는 Server Component 데모를 구성한다.
- 깊은 하위 컴포넌트에서 props 전달 없이 `await lang()`으로 현재 언어 설정을 읽어 UI를 렌더링하는 구조를 테스트한다.
- Client Component에서 `next/root-params`를 import했을 때 발생하는 컴파일 에러를 확인한다.

## 연습 문제

1. `next/root-params` 모듈에 대한 설명으로 올바른 것은?
   - A. Client Component에서 브라우저 주소창의 쿼리 스트링을 파싱한다.
   - B. 루트 레이아웃 상위의 루트 다이나믹 파라미터를 Server Component 어디서나 비동기 게터로 읽을 수 있게 해준다.
   - C. 케밥 케이스(`[user-id]`) 세그먼트 이름을 권장한다.
   - D. Route Handler에서만 사용할 수 있다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next/root-params`는 루트 레이아웃 상위의 다이나믹 세그먼트 파라미터를 Server Component 어디서나 props 드릴링 없이 읽을 수 있는 비동기 getter 함수를 제공한다.
</details>

2. 루트 세그먼트가 `app/[country]/[lang]/layout.tsx`로 정의되었을 때, `next/root-params`에서 가져올 수 있는 올바른 식별자는?
   - A. `import { params } from 'next/root-params'`
   - B. `import { country, lang } from 'next/root-params'`
   - C. `import { useRootParams } from 'next/root-params'`
   - D. `import { getParams } from 'next/root-params'`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 폴더명으로 지정된 세그먼트 식별자 이름(`country`, `lang`)이 각각 비동기 게터 함수로 export된다.
</details>

## 챕터 요약

- `next/root-params`는 루트 다이나믹 파라미터에 접근할 수 있는 함수들을 제공하는 내장 모듈이다.
- Server Component 및 서버 유틸리티에서 props 드릴링 없이 `await paramName()`으로 파라미터를 조회한다.
- 세그먼트명은 유효한 JS 식별자여야 하며, Client Component나 Server Action에서는 사용할 수 없다.
- `use cache`와 함께 사용 시 실제 참조된 파라미터만 캐시 키에 포함되어 효율적인 캐시 분할이 가능하다.
- `generateStaticParams`와 연계하여 빌드 시점에 정적 경로를 미리 생성할 수 있다.
