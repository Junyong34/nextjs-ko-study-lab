# Lazy Loading

- 공식 문서: [Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- lazy loading이 초기 JavaScript 번들에 미치는 영향을 설명한다.
- `next/dynamic`으로 Client Component와 외부 라이브러리를 필요한 시점에 로드한다.
- SSR 제외, loading UI, named export와 magic comment의 제약을 구분한다.

## 핵심 개념 및 설명

lazy loading은 라우트를 렌더링하는 데 필요한 JavaScript 양을 줄여 초기 로딩 성능을 개선한다. Client Component와 가져온 라이브러리의 로딩을 실제로 필요할 때까지 미룬다. Server Component는 기본적으로 자동 코드 분할되며, 동적으로 가져온 Server Component 자체가 아니라 그 안의 Client Component가 lazy loading 대상이 된다.

### `next/dynamic`

`next/dynamic`은 `React.lazy()`와 `<Suspense>`를 조합한 API이며 `app`과 `pages` 디렉터리에서 같은 방식으로 동작한다. Next.js가 모듈과 번들을 연결해 미리 로드할 수 있도록 `import()` 경로는 템플릿 문자열이나 변수가 아닌 명시적 문자열이어야 한다. `import()`는 `dynamic()` 호출 안에 있어야 하고, `dynamic()`은 렌더링 함수 안이 아니라 모듈 최상위에 둔다.

```tsx filename="app/page.js"
import dynamic from 'next/dynamic'

const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
```

Client Component의 SSR을 건너뛰려면 Client Component에서 `ssr: false`를 사용한다. Server Component에서 이 옵션을 쓰면 오류가 발생한다.

```tsx filename="app/page.js"
'use client'

const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false })
```

사용자에게 로딩 상태를 보여주려면 `loading` 옵션을 제공한다. named export는 `import()` Promise의 `then`에서 선택한다.

```tsx filename="app/page.js"
const WithLoading = dynamic(() => import('../components/WithLoading'), {
  loading: () => <p>Loading...</p>,
})

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

### 외부 라이브러리

외부 라이브러리는 상호작용 시점에 동적으로 가져올 수 있다. 다음 패턴은 입력 이벤트가 발생할 때 `fuse.js`를 로드하므로 초기 번들에서 제외한다.

```tsx filename="app/page.js"
'use client'

export default function Page() {
  return <input onChange={async (e) => {
    const Fuse = (await import('fuse.js')).default
    const fuse = new Fuse(names)
    console.log(fuse.search(e.currentTarget.value))
  }} />
}
```

### Magic Comments

Magic comment는 정적 `import`가 아니라 동적 `import()` 식에만 적용된다.

> **알아두면 좋은 점**: Magic comment는 `import x from 'y'` 같은 정적 import에서는 동작하지 않는다.

- `webpackIgnore: true` / `turbopackIgnore: true`: bundler가 import를 분석·번들링하지 않고 런타임에 그대로 로드한다.
- `turbopackOptional: true`: Turbopack에서 모듈이 없어도 빌드가 실패하지 않도록 선택적 의존성으로 표시한다.

> **알아두면 좋은 점**: `webpackOptional`은 지원하지 않는다. Turbopack에서는 `turbopackOptional`을 사용한다.

```ts filename="app/page.js"
await import(/* webpackIgnore: true */ externalUrl)
await import(/* turbopackOptional: true */ './optional-module')
```

## 예제 및 데모 설계

- Phase 2에서 일반 import와 `next/dynamic` 컴포넌트의 초기 번들 크기를 비교한다.
- 버튼 클릭 전후 Network 패널에서 외부 라이브러리 chunk 요청 시점을 확인한다.
- SSR 포함/제외 컴포넌트의 초기 HTML과 loading UI 차이를 관찰한다.

## 연습 문제

1. `dynamic()`의 `import()` 경로로 사용할 수 없는 것은?
   - A. 명시적 문자열
   - B. 템플릿 문자열 변수
   - C. named export를 고르는 Promise

   <details><summary>정답 보기</summary>B. Next.js가 모듈 ID와 bundle을 연결하려면 경로가 명시적으로 작성돼야 한다.</details>

2. `ssr: false`를 사용할 수 있는 대상은?
   - A. Client Component에서 불러오는 Client Component
   - B. Server Component 자체
   - C. 모든 Server Component

   <details><summary>정답 보기</summary>A. SSR 제외는 Client Component에서 사용하며 Server Component에서는 지원하지 않는다.</details>

## 챕터 요약

- lazy loading은 초기 라우트에 필요한 JavaScript를 줄인다.
- `next/dynamic`은 `React.lazy`와 Suspense를 통합한다.
- `dynamic()`과 명시적 `import()`는 모듈 최상위에 둔다.
- `ssr: false`는 Client Component에서만 사용한다.
- 외부 라이브러리와 선택적 모듈은 동적 import와 magic comment로 제어한다.
