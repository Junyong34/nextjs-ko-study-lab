# Building

- 공식 문서: [Building](https://nextjs.org/docs/app/guides/building)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next build`가 진행하는 단계(Setup, Route discovery, Compilation, Static analysis, Prerendering, Output)를 설명할 수 있다.
- 빌드 후 출력되는 라우트 표의 기호(○, ◐, ●, ƒ)가 각각 무엇을 의미하는지 구분할 수 있다.
- prerender-blocking 오류가 발생하는 이유를 이해하고, `<Suspense>`, `use cache`, `export const instant = false` 세 가지 해결 방법을 상황에 맞게 선택할 수 있다.
- `--debug-prerender`, `--debug-build-paths` 플래그로 빌드 오류를 진단하고 빌드 범위를 좁힐 수 있다.

## 핵심 개념 및 설명

`next build`는 애플리케이션을 프로덕션용으로 컴파일한다. 코드를 번들링하고 최적화하며, 가능한 모든 라우트를 prerender하고, 각 URL이 어떤 방식으로 서비스되는지 보여주는 라우트 표를 출력한다.

> **알아두면 좋은 점**: 이 문서의 출력 결과와 오류 메시지는 `next.config.ts`에 `cacheComponents: true`를 설정해 [Cache Components](../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)를 활성화한 상태를 기준으로 한다. 이 설정 없이도 이 가이드의 내용은 대부분 적용되지만, 라우트 표의 기호와 prerender-blocking 오류의 형태는 달라진다. 설정 방법은 [Cache Components 활성화하기](../1-getting-started/caching.md#cache-components-활성화하기)를 참고한다.

### `next build`가 하는 일

`next build`를 실행하면 빌드는 다음 단계를 차례로 거친다.

1. **Setup**: 환경 변수(`.env` 파일)를 불러오고, `next.config`를 검증하며, 빌드 ID를 생성한다.
2. **Route discovery**: `app/`과 `pages/` 디렉토리를 스캔해 라우트를 찾고, `proxy`나 `instrumentation` 같은 루트 레벨 컨벤션 파일을 감지한다. TypeScript 라우트 정의도 생성한다.
3. **Compilation**: Turbopack(또는 webpack)으로 클라이언트, 서버, edge 코드를 번들링한다. TypeScript와 JSX를 transpile하고, 사용하지 않는 코드를 tree-shake하며, CSS와 폰트를 최적화한다. 타입 검사는 이 단계와 병렬로 실행된다.
4. **Static analysis**: 각 라우트를 prerender 대상인지 요청 시 렌더링 대상인지로 분류한다. `generateStaticParams`의 출력을 수집하고, prerender-blocking 오류가 있는지 확인한다.
5. **Prerendering**: 정적 페이지와 PPR shell을 HTML로 prerender한다. 클라이언트 내비게이션에 쓰일 RSC payload도 생성한다.
6. **Output**: 빌드 결과를 `.next/`에 기록한다. `output: 'standalone'`이면 런타임에 필요한 파일만 묶고, `output: 'export'`이면 완전한 정적 사이트를 생성한다. 마지막으로 라우트 표를 출력한다.

### 빌드 출력 읽기

빌드 명령은 사용하는 패키지 매니저에 따라 `npm run build`, `pnpm build`, `yarn build`, `bun build` 중 하나다.

빌드가 성공하면 Next.js는 각 라우트가 어떻게 서비스되는지 기호로 표시하는 라우트 표를 출력한다.

| 기호 | 이름 | 동작 |
|---|---|---|
| `○` | Static | 빌드 시점에 완전히 prerender된다. 서버 렌더링 없이 그대로 서비스된다. |
| `◐` | Partial Prerender | 정적 shell은 즉시 서비스되고, 동적 콘텐츠는 요청 시점에 스트리밍된다. |
| `●` | SSG | `generateStaticParams`(또는 `getStaticProps`)로 prerender된 정적 HTML이다. |
| `ƒ` | Dynamic | 요청마다 서버에서 렌더링된다. |

`○` Static, `●` SSG, `ƒ` Dynamic은 Next.js가 Pages Router를 포함해 항상 사용해온 렌더링 방식이다 — 각 라우트는 빌드 시점에 정적 HTML로 prerender되거나, 요청마다 서버에서 렌더링된다.

Cache Components는 `◐` Partial Prerender를 추가하고, [Partial Prerendering](../1-getting-started/caching.md)을 기본 렌더링 모델로 만든다. 각 라우트는 빌드 시점에 prerender되는 정적 shell과 요청 시점에 스트리밍되는 동적 부분으로 나뉜다. 라우트는 완전히 정적인 상태(`○`)부터 부분적으로 prerender된 상태(`◐`)까지 스펙트럼에 놓이며, 더는 전부 서버 렌더링되지 않는다. `ƒ`는 요청에 의존하는 Route Handler, Proxy(Middleware), `icon`이나 `opengraph-image` 같은 동적 메타데이터처럼 prerender할 것이 전혀 없는 라우트에만 표시된다.

이 기호는 라우트가 prerender 시점에 실제로 하는 동작을 반영하며, `instant` 같은 검증 설정을 export했는지 여부를 나타내지 않는다. Cache Components를 쓰지 않거나 Pages Router에서는 prerender된 페이지도 `●`(SSG)로 표시될 수 있다.

### 예제: 상품 페이지 빌드하기

prerender 검증 실패는 프로덕션 빌드가 실패하는 가장 흔한 이유 중 하나다. 이는 안전장치로 작동한다 — Cache Components는 캐시되지 않은 데이터와 런타임 데이터를 빌드 시점에 미리 잡아내서, 그 데이터가 프로덕션에서 앱을 느리게 만들기 전에 막는다. 이 절의 나머지는 실패한 빌드부터 수정까지 이 오류 하나를 따라간다.

이 예제는 `id`로 데이터를 불러오는 다이나믹 상품 페이지를 가진 스토어 앱을 사용한다.

```text filename="Terminal"
app/
├── layout.tsx
├── page.tsx
└── products/
    └── [id]/
        └── page.tsx
```

`app/products/[id]/page.tsx`에서 작업한다.

```tsx filename="app/products/[id]/page.tsx"
// app/products/[id]/page.tsx
export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

빌드 동안 Next.js는 각 라우트를 가능한 만큼 빌드 시점에 prerender한다. 런타임 데이터(`params`, `searchParams`, `cookies()`, `headers()`)와 캐시되지 않은 데이터(`fetch()`, 데이터베이스 호출)는 이 단계에서 사용할 수 없다. 런타임 값을 읽는 코드는 `<Suspense>`로 감싸고, 데이터를 가져오는 코드는 `use cache`로 캐시하거나 마찬가지로 `<Suspense>`로 감싸야 한다. 그렇지 않으면 빌드는 `blocking-prerender-runtime` 또는 `blocking-prerender-dynamic` 오류로 실패한다. `Math.random()`이나 `new Date()` 같은 무작위 값과 타임스탬프도 빌드를 실패시킬 수 있다.

`next build`를 실행하면 `params` 읽기와 캐시되지 않은 `fetch`가 `<Suspense>` 경계 밖에서 실행되기 때문에 prerender-blocking 오류로 실패한다.

```text filename="Terminal"
Error: Route "/products/[id]": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
```

### 빌드 오류 디버깅

때로는 오류만으로 충분한 정보를 얻을 수 없다. 프로덕션 빌드는 서버 코드를 압축하고 소스맵을 생성하지 않기 때문이다. `--debug-prerender`를 붙여 다시 실행한다.

```bash filename="Terminal"
next build --debug-prerender
```

이 플래그는 압축을 끄고, 서버 번들의 소스맵을 켜며, 첫 실패에서 멈추지 않고 계속 진행해 남은 문제들이 한 번의 실행에서 모두 드러나게 한다. prerender 중 발생하는 어떤 오류에도 도움이 되며, blocking 오류에만 한정되지 않는다. 이제 스택 트레이스는 페이지에서 처음으로 막힌 지점, 즉 `params` 읽기를 정확히 가리킨다.

> **알아두면 좋은 점**: `--debug-prerender`로 만든 빌드는 배포하지 않는다. 프로덕션에 필요한 최적화가 빠져 있다.

`next dev`에서 해당 라우트를 실행하면 컴포넌트와 줄까지 바로 해석된 전체 오류를 곧바로 볼 수 있다. 이런 오류를 자세히 다루는 방법은 [Ensuring instant navigations](./instant-navigation.md)를 참고한다.

원인을 찾았으니, 이제 각 해결 방법을 적용하며 빌드 출력이 어떻게 바뀌는지 살펴본다.

#### 스트리밍 라우트로 만들기

오류의 첫 번째 제안인 `[stream]`은 데이터 접근 주변에 placeholder를 두는 것이다. `loading.js` 파일을 추가해 전체 세그먼트를 `<Suspense>` 경계로 감싼다. Next.js는 이 fallback을 라우트의 정적 shell로 prerender하고, `params`와 데이터 처리는 요청 시점에 실행된다. 경계를 다른 위치에 두는 방법은 [Streaming](./streaming.md)을 참고한다.

```tsx filename="app/products/[id]/loading.tsx"
// app/products/[id]/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

빌드를 실행하면 통과하고, 라우트는 부분적으로 prerender된다.

```text filename="Terminal"
Route (app)
┌ ○ /                   # 빌드 시점에 prerender됨
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # shell은 prerender되고, 콘텐츠는 요청 시점에 스트리밍됨

○  (Static)             정적 콘텐츠로 prerender됨
◐  (Partial Prerender)  정적 HTML로 prerender되고 동적 콘텐츠는 서버에서 스트리밍됨
```

상품 URL은 이제 prerender된 shell을 즉시 서비스하고, 이어서 페이지 콘텐츠를 스트리밍한다.

#### 특정 라우트만 빌드하기

이 라우트 하나만 반복 작업하는 큰 앱이라면, 전체를 다시 빌드하는 대신 빌드 범위를 이 라우트로 좁힐 수도 있다. `--debug-build-paths`에 포함할 라우트 파일을 넘긴다.

```bash filename="Terminal"
next build --debug-build-paths="app/products/[id]/page.tsx"
```

Next.js는 일치하는 라우트만 컴파일하고 prerender하며, 나머지 앱은 건너뛴다. 이 옵션은 쉼표로 구분된 경로와 glob 패턴을 받고, `!` 접두사로 제외할 수 있으며, 디버깅 중에는 `--debug-prerender`와 함께 쓸 수 있다. 이 스토어는 라우트 수가 적으므로 계속 앱 전체를 빌드한다.

#### Prerender된 params

다이나믹 세그먼트가 fallback 행 하나만 보여주는 이유는 Next.js가 어떤 `param` 값이 존재하는지 모르기 때문이다. `generateStaticParams`를 export해 값을 나열한다.

```tsx filename="app/products/[id]/page.tsx"
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

다시 빌드하면 나열한 `param`마다 `/products/[id]` 라우트 아래에 들여쓴 행이 추가된다.

```text filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ◐ /products/1       # param은 알지만 데이터는 여전히 캐시되지 않음
  ├ ◐ /products/2       # param은 알지만 데이터는 여전히 캐시되지 않음
  └ ◐ /products/3       # param은 알지만 데이터는 여전히 캐시되지 않음

○  (Static)             정적 콘텐츠로 prerender됨
◐  (Partial Prerender)  정적 HTML로 prerender되고 동적 콘텐츠는 서버에서 스트리밍됨
```

> **알아두면 좋은 점**: `generateStaticParams`는 반드시 하나 이상의 `param`을 반환해야 한다. 빈 배열을 반환하면 빌드 오류가 발생한다.

새 행들은 `○`가 아니라 `◐`로 표시된다. `param`을 나열하면 Next.js에 어떤 페이지가 존재하는지 알려주지만, 콘텐츠는 여전히 캐시되지 않은 조회에서 나오고, 이 조회는 요청 시점에만 실행되기 때문이다. 각 페이지는 정적 shell을 서비스하고 콘텐츠를 스트리밍한다.

> **알아두면 좋은 점**: 여기서 `fetch`는 prerender 중에 실행되므로, 실제로 동작하는 엔드포인트나 데이터를 반환하는 가짜 비동기 소스를 가리켜야 한다. `◐` 행은 조회가 실제 캐시되지 않은 I/O일 때만 나타난다. 동기적인 메모리 값은 정적으로 취급되어 각 `param`이 `○`로 prerender된다.

#### 캐시된 데이터

오류의 `[cache]` 해결 방법은 조회를 빌드 시점으로 옮기는 것이다. `use cache`를 추가해 prerender 중에 실행되도록 한다.

```tsx filename="app/products/[id]/page.tsx"
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

async function getProduct(id: string) {
  'use cache'
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

다시 빌드하면 나열된 `param`들이 `○`로 표시된다. `param`은 알고 있고 데이터는 캐시되어 있으므로, Next.js는 각 페이지를 완전히 prerender한다. 나열되지 않은 `param`에는 여전히 `◐` 행이 남아, 정적 shell을 서비스하는 동안 콘텐츠가 스트리밍된다.

```text filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]    # 나열되지 않은 param은 요청 시점에 스트리밍됨
  ├ ○ /products/1       # 빌드 시점에 완전히 prerender됨
  ├ ○ /products/2       # 빌드 시점에 완전히 prerender됨
  └ ○ /products/3       # 빌드 시점에 완전히 prerender됨

○  (Static)             정적 콘텐츠로 prerender됨
◐  (Partial Prerender)  정적 HTML로 prerender되고 동적 콘텐츠는 서버에서 스트리밍됨
```

`cookies()`, `headers()`, `searchParams`를 읽는 페이지는 계속 `◐`로 남아, 방문마다 그 부분을 shell에 스트리밍한다.

나열되지 않은 `param`을 사용자가 방문하면, Next.js는 콘텐츠가 스트리밍되는 동안 정적 shell을 즉시 서비스한 뒤 백그라운드에서 페이지를 업그레이드한다. 자세한 내용은 [ISR with Cache Components](./incremental-static-regeneration-cache-components.md)를 참고한다.

prerender된 경로가 표에 다 담기지 않을 만큼 많으면, Next.js는 `[+N more paths]`로 끝나는 짧은 목록을 출력한다.

캐시된 함수나 컴포넌트를 포함한 라우트에는 Revalidate와 Expire 열도 표시된다. 라우트는 자신이 포함한 모든 캐시 중 가장 짧은 revalidate와 expire 값을 보여준다. 이는 `cacheLife`를 명시적으로 호출하지 않아도 적용되는데, 캐시가 기본 프로필을 사용하기 때문이다. 같은 캐시된 상품 데이터를 렌더링하는 `/products` 목록 페이지를 추가해본다.

```text filename="Terminal"
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /products                15m      1y
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ○ /products/1            15m      1y
  ├ ○ /products/2            15m      1y
  └ ○ /products/3            15m      1y
```

이 라우트들은 기본 프로필 값인 15분 뒤 revalidate된다. 이 프로필은 만료되지 않으며, Expire 열은 1년으로 제한되어 `1y`로 표시된다. 표는 어떤 캐시가 그 값을 만들었는지 보여주지 않으므로, 라우트에 캐시가 여러 개면 각각의 `cacheLife` 호출을 확인해야 한다.

#### 블로킹 라우트

오류의 마지막 제안인 `[block]`은 위 두 방법의 대안이다. 앞의 수정을 모두 제거하고, 원래 페이지에 `instant = false`만 설정했다고 가정한다. 이는 라우트가 렌더링되는 방식을 바꾸지 않는다. 단지 검증에서 벗어나 블로킹 라우트를 의도적으로 허용할 뿐이다.

```tsx filename="app/products/[id]/page.tsx"
// app/products/[id]/page.tsx
export const instant = false

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

빌드는 통과하고, 출력은 스트리밍 라우트와 같은 모습이다. 다이나믹 세그먼트는 실제로 prerender되는 것이 없어도 `◐` fallback 행을 표시한다.

```text filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # 요청 시점에 렌더링되며, 조회가 끝날 때까지 블로킹됨

○  (Static)             정적 콘텐츠로 prerender됨
◐  (Partial Prerender)  정적 HTML로 prerender되고 동적 콘텐츠는 서버에서 스트리밍됨
```

스트리밍 라우트와 달리 fallback UI가 없다 — 조회가 끝날 때까지 사용자는 아무것도 보지 못한다. 이 방식이 적절한 경우는 [검증 제외](./instant-navigation.md#검증-제외)를 참고한다.

## 예제 및 데모 설계

- Phase 2에서 `loading.tsx` 없음 / 있음 / `use cache` 적용 / `instant = false` 네 가지 버전의 `app/products/[id]/page.tsx`를 준비하고, 각각 `next build` 출력의 라우트 표 기호가 어떻게 달라지는지 나란히 비교한다.
- `generateStaticParams`가 반환하는 `param` 목록을 바꿔가며 빌드해, 나열된 `param`(`○` 또는 `◐`)과 나열되지 않은 `param`(`◐` fallback)의 차이를 화면으로 확인한다.
- `--debug-prerender`를 켜고 끈 두 빌드의 오류 스택 트레이스를 비교해 소스맵과 압축 해제의 효과를 보여준다.
- 현재 Phase 1에서는 데모 앱을 만들지 않고, 위 시나리오에서 사용할 파일 구성과 확인할 빌드 출력만 설계한다.

## 연습 문제

1. `next build`의 라우트 표에서 `◐` 기호가 의미하는 것은?

   1. 요청마다 서버에서 완전히 렌더링된다.
   2. 정적 shell은 즉시 서비스되고, 동적 콘텐츠는 요청 시점에 스트리밍된다.
   3. `generateStaticParams` 없이는 절대 나타나지 않는다.
   4. 빌드가 실패했다는 뜻이다.

   <details><summary>정답 보기</summary>

   **정답: 2** — `◐`(Partial Prerender)는 정적 shell을 빌드 시점에 prerender하고, 동적 부분은 요청 시점에 스트리밍하는 라우트를 나타낸다.

   </details>

2. prerender-blocking 오류가 발생했을 때 제시되는 세 가지 해결 방법 중 실제로 코드를 바꾸지 않고 검증만 우회하는 것은?

   1. `<Suspense>`로 감싸기
   2. `use cache` 추가하기
   3. `export const instant = false` 설정하기
   4. `generateStaticParams` 추가하기

   <details><summary>정답 보기</summary>

   **정답: 3** — `instant = false`는 라우트의 렌더링 방식을 바꾸지 않고, 블로킹 라우트를 의도적으로 허용하도록 검증만 비활성화한다.

   </details>

3. 빌드 오류의 원인을 더 자세히 진단하려 할 때 도움이 되는 방법을 모두 고르시오.

   1. `next build --debug-prerender`로 다시 빌드한다.
   2. `next dev`로 해당 라우트를 열어 개발 모드의 전체 오류를 확인한다.
   3. `--debug-prerender`로 만든 빌드를 그대로 배포한다.
   4. `--debug-build-paths`로 해당 라우트만 빌드해 반복 작업 속도를 높인다.

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 4** — `--debug-prerender`로 만든 빌드는 프로덕션에 필요한 최적화가 빠져 있어 배포해서는 안 된다.

   </details>

## 챕터 요약

- `next build`는 Setup → Route discovery → Compilation → Static analysis → Prerendering → Output 순서로 진행된다.
- 라우트 표의 `○`/`◐`/`●`/`ƒ` 기호는 각 라우트가 정적 prerender, 부분 prerender, SSG, 요청 시 렌더링 중 무엇으로 서비스되는지 보여준다.
- prerender-blocking 오류는 `<Suspense>` 스트리밍, `use cache` 캐싱, `instant = false` 세 가지 방법 중 하나로 해결한다.
- `generateStaticParams`로 나열한 `param`이라도 데이터가 캐시되지 않으면 `◐`로 남고, `use cache`까지 적용해야 `○`가 된다.
- `--debug-prerender`는 자세한 스택 트레이스를 위한 디버깅 전용 빌드이며, `--debug-build-paths`는 특정 라우트만 빌드해 반복 속도를 높인다.
