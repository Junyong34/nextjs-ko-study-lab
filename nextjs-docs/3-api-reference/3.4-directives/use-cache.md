# use cache

- 공식 문서: [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- 상위 메뉴: [Directives](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js의 Cache Components 기능인 `'use cache'` 지시어의 역할과 캐싱 원리를 이해한다.
- 파일, 컴포넌트, 함수 3가지 수준에서 `'use cache'`를 선언하고 캐시 키 생성 방식을 설명한다.
- 직렬화 가능한 인자 및 반환 타입 제약과 비직렬화 요소를 다루는 Pass-through 패턴을 습득한다.
- 요청 시점 API(`cookies()`, `headers()`) 접근 제한과 외부 인자 전달 패턴을 적용한다.
- `cacheLife`를 통한 시간 기반 재검증과 `cacheTag`/`updateTag`를 통한 온디맨드(On-demand) 무효화 전략을 구현한다.

## 핵심 개념 및 설명

`'use cache'` 지시어는 라우트, React 컴포넌트, 또는 비동기 함수를 **캐시 가능(cacheable)** 상태로 지정할 수 있게 해주는 기능이다.

- **파일 수준**: 파일 최상단에 선언하여 해당 파일의 모든 export 함수/컴포넌트를 캐시한다.
- **컴포넌트 수준**: 비동기 컴포넌트 최상단에 선언하여 컴포넌트의 반환 JSX를 캐시한다.
- **함수 수준**: 비동기 함수 최상단에 선언하여 연산 결과나 데이터 fetching 결과를 캐시한다.

`'use cache'`를 사용하는 모든 함수와 컴포넌트는 반드시 **`async` 비동기**여야 한다.

> **알아두면 좋은 점**:
>
> - 쿠키나 헤더와 같은 런타임 데이터는 `'use cache'` 스코프 외부에서 읽은 뒤 인자로 전달하는 것이 권장되는 표준 패턴이다.
> - 기본 메모리 캐시 이상의 분산 공유 캐시가 필요하다면 플랫폼 전용 핸들러를 사용하는 [`'use cache: remote'`](./use-cache-remote.md)를 활용할 수 있다.
> - 런타임 요청 데이터를 인자로 분리하기 어렵거나 컴플라이언스 요구사항이 있는 경우 [`'use cache: private'`](./use-cache-private.md)를 고려할 수 있다.

### 활성화 방법 (Usage)

`'use cache'`를 사용하려면 `next.config.ts` 파일에서 [`cacheComponents`](../3.5-config/3.5.1-next-config-js/cacheComponents.md) 옵션을 활성화해야 한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

```tsx filename="app/page.tsx"
// 1. 파일 수준
'use cache'

export default async function Page() {
  // ...
}

// 2. 컴포넌트 수준
export async function MyComponent() {
  'use cache'
  return <div>캐시된 UI</div>
}

// 3. 함수 수준
export async function getData() {
  'use cache'
  const data = await fetch('/api/data')
  return data
}
```

### 캐시 키(Cache Key) 생성 원리

캐시 항목의 고유 키는 입력값들의 직렬화된 정보를 기반으로 자동 생성된다:

1. **Build ID / Deployment ID**: 빌드마다 고유하게 부여되며, 새 빌드 배포 시 이전 캐시를 무효화한다.
2. **Function ID**: 코드베이스 내 함수 위치 및 시그니처의 보안 해시값.
3. **직렬화 가능한 인자(Arguments)**: 컴포넌트 props 또는 함수의 매개변수.
4. **클로저 캡처 변수**: 외부 스코프에서 참조하는 변수도 자동으로 캡처되어 캐시 키에 바인딩된다.

```tsx filename="lib/data.ts"
async function Component({ userId }: { userId: string }) {
  const getData = async (filter: string) => {
    'use cache'
    // 클로저의 userId와 인자 filter가 모두 캐시 키에 포함된다
    return fetch(`/api/users/${userId}/data?filter=${filter}`)
  }

  return getData('active')
}
```

### 직렬화 (Serialization) 및 Pass-through 패턴

캐시 함수에 전달되는 인자와 반환값은 직렬화 가능해야 한다:

- **지원 타입**: 원시 타입(`string`, `number`, `boolean`, `null`, `undefined`), 일반 객체, 배열, `Date`, `Map`, `Set`, `ArrayBuffer`, JSX 요소(반환값).
- **미지원 타입**: 클래스 인스턴스, 함수(Pass-through 제외), `Symbol`, `URL` 인스턴스.

#### 인자 Pass-through (비직렬화 요소 통과)

함수 내부에서 값을 직접 검사(인스펙션)하거나 조작하지 않고 그대로 반환 JSX에 넘기는 경우, `children`이나 Server Action과 같은 비직렬화 요소를 컴포넌트 합성으로 전달할 수 있다:

```tsx filename="app/components/cached-wrapper.tsx"
import { ReactNode } from 'react'

export async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache'
  // children 내부를 조작하지 않고 pass-through로 그대로 렌더링
  return (
    <div className="wrapper">
      <header>캐시된 공통 헤더</header>
      {children}
    </div>
  )
}
```

### 주요 제약 사항 (Constraints)

1. **요청 시점 API(Request-time APIs) 접근 제한**:
   `'use cache'` 내부에서는 `cookies()`, `headers()`, `searchParams`를 직접 호출할 수 없다. 이를 위반하면 `next-request-in-use-cache` 오류가 발생한다. 반드시 외부에서 읽어 인자로 넘겨야 한다.
2. **Draft Mode**:
   Draft Mode가 활성화되면 모든 캐시 함수는 요청마다 다시 실행되며 캐시에 저장되지 않는다. 캐시 스코프 내에서 `draftMode().isEnabled` 값은 읽을 수 있으나 `enable()`/`disable()` 호출은 금지된다.
3. **`React.cache` 격리**:
   `'use cache'` 경계 내부는 독립된 `React.cache` 스코프를 갖는다. 외부에서 저장된 `React.cache` 값은 캐시 스코프 안으로 전파되지 않는다.

### 재검증 전략 (Revalidation)

#### 1. 시간 기반 재검증 (`cacheLife`)

[`cacheLife`](../3.3-functions/cacheLife.md) 함수를 사용해 캐시 유효 시간을 명시적으로 설정한다:

```tsx filename="lib/data.ts"
import { cacheLife } from 'next/cache'

export async function getData() {
  'use cache'
  cacheLife('hours') // 내장 'hours' 프로필 사용 (stale, revalidate, expire)
  return fetch('/api/data')
}
```

#### 2. 온디맨드 태그 기반 재검증 (`cacheTag`, `revalidateTag`, `updateTag`)

[`cacheTag`](../3.3-functions/cacheTag.md)로 캐시에 식별 태그를 지정하고, Server Action 등에서 [`revalidateTag`](../3.3-functions/revalidateTag.md) 또는 [`updateTag`](../3.3-functions/updateTag.md)로 즉시 무효화한다:

```tsx filename="lib/data.ts"
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return fetch('/api/products')
}
```

```tsx filename="app/actions.ts"
'use server'

import { updateTag } from 'next/cache'

export async function updateProduct() {
  await db.products.update(...)
  updateTag('products') // 'products' 태그가 붙은 모든 캐시 무효화
}
```

### 트러블슈팅: 빌드 타임아웃 (Build Hangs)

빌드 시점에 50초 타임아웃 오류가 발생한다면, `'use cache'` 내부에서 외부의 런타임 비동기 Promise(예: `cookies()`의 Promise)를 prop으로 전달받아 `await`하고 있는지 점검해야 한다. 빌드 시점에는 확인될 수 없는 런타임 Promise를 기다리면서 빌드가 멈추게 된다.

## 예제 및 데모 설계

- `cacheComponents: true` 환경에서 느린 DB 쿼리 함수에 `'use cache'` 및 `cacheLife('minutes')`를 적용하여 2회차 호출부터 즉시 응답하는 성능 개선을 확인한다.
- 상품 목록 조회 컴포넌트에 `cacheTag('products')`를 부여하고, 상품 등록 Server Action에서 `updateTag('products')`를 호출했을 때 즉시 캐시가 갱신되는 시나리오를 구성한다.
- `cookies()`를 캐시 함수 내부에서 직접 호출했을 때 발생하는 에러를 확인하고, 외부 인자 전달 패턴으로 리팩토링하는 데모를 설계한다.

## 연습 문제

1. `'use cache'` 지시어를 사용하는 함수 및 컴포넌트가 반드시 지켜야 하는 문법적 규칙은?
   - A. 반드시 Client Component여야 한다.
   - B. 반드시 `async` 비동기 함수여야 한다.
   - C. 반드시 제네릭 타입을 명시해야 한다.
   - D. `next/cache`에서 `import { useCache }`를 해야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `'use cache'`를 사용하는 모든 컴포넌트 및 함수는 비동기 연산과 캐싱 수명 주기를 처리하기 위해 반드시 `async` 함수여야 한다.
</details>

2. `'use cache'` 함수 내부에서 사용자 쿠키나 헤더 정보를 사용해야 할 때 올바른 패턴은?
   - A. 캐시 함수 내부에서 `cookies().get('theme')`를 직접 호출한다.
   - B. 캐시 스코프 외부(Server Component 등)에서 쿠키 값을 읽어 캐시 함수의 인자로 전달한다.
   - C. `useSearchParams` 훅을 사용한다.
   - D. `React.cache` 전역 스토어를 통해 공유한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `'use cache'` 내부에서 `cookies()`나 `headers()`를 직접 호출하면 에러가 발생하므로, 캐시 스코프 외부에서 필요한 값을 추출한 뒤 함수의 인자(매개변수)로 전달해야 한다.
</details>

## 챕터 요약

- `'use cache'`는 파일, 컴포넌트, 함수 수준에서 비동기 연산 및 UI를 캐시하는 Next.js Cache Components 지시어다.
- 사용을 위해 `next.config.ts`의 `cacheComponents: true` 활성화가 필요하다.
- 캐시 키는 Build ID, 함수 위치 해시, 직렬화된 인자 및 클로저 캡처 변수의 조합으로 결정된다.
- 요청 시점 API(`cookies`, `headers`)는 캐시 스코프 외부에서 읽어 인자로 전달해야 한다.
- `cacheLife`를 통한 시간 기반 수명 관리와 `cacheTag`/`updateTag`를 통한 태그 기반 온디맨드 무효화를 지원한다.
