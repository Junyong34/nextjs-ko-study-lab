# 4. 용어집 (Glossary)

> Next.js 공식 문서 전반에서 사용되는 핵심 개념과 용어 48종에 대한 기술 용어 사전입니다.

## 학습 목표

- 문서 전반에 걸쳐 반복되는 Next.js 핵심 용어 48개의 기술적 정의와 개념을 정확하게 이해한다.
- 라우팅, 렌더링, 캐싱 등 각 영역에서 유사한 용어(예: `App Shell`과 `Static Shell`, `Server Component`와 `Client Component`, `Server Action`과 `Server Function`)가 어떻게 구분되는지 비교한다.
- 각 용어가 실제로 사용되는 관련 학습 문서와 API 레퍼런스로 원활하게 연결하여 학습을 심화한다.

---

## 핵심 개념 및 설명

### 색인 (Index)

| [A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [H](#h) | [I](#i) | [L](#l) | [M](#m) | [N](#n) | [P](#p) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

---

### A

#### App Router
Next.js 버전 13에서 도입된 라우터로, React Server Components 기반으로 구축되었다. 파일 시스템 기반 라우팅을 사용하며 레이아웃, 중첩 라우팅, 로딩 상태, 오류 처리 등을 지원한다. 자세한 내용은 [App Router 시작하기](../1-getting-started/README.md)를 참고한다.

#### App Shell
URL 데이터에 의존하지 않는 페이지 요소들을 포함하는 라우트별 prerender 결과물이다. 셸은 짧은 수명의 콘텐츠가 신선도를 유지하는 기간보다 더 오래 재사용되므로, 캐시된 콘텐츠의 [`stale`](../3-api-reference/3.3-functions/cacheLife.md#stale) 시간이 5분 이상일 때 셸에 포함된다. `cookies()`나 `headers()`를 읽는 라우트는 세션 데이터를 포함하는 App Shell을 생성하며, 클라이언트에서 세션 단위로 캐시된다. 클라이언트 내비게이션 시 기본 prefetch payload로 사용되고, [링크별 prefetch](../2-guides/optimizing-prefetching.md)가 준비되지 않았을 때의 로딩 상태 및 [Cache Components를 활용한 ISR](../2-guides/incremental-static-regeneration-cache-components.md)의 fallback으로 활용된다.

---

### B

#### Build time (빌드 시점)
애플리케이션이 컴파일되는 단계다. 빌드 시점에 Next.js는 코드를 프로덕션용 최적화 파일로 변환하고, 정적 페이지를 생성하며, 배포용 에셋을 준비한다. 자세한 내용은 [`next build` CLI 참조](../3-api-reference/3.6-cli/next.md#next-build-options)를 참고한다.

---

### C

#### Cache Components
[`"use cache"` 지시어](../3-api-reference/3.4-directives/use-cache.md)를 사용해 컴포넌트 및 함수 수준의 캐싱을 가능하게 하는 기능이다. Cache Components를 사용하면 즉시 제공되는 정적 HTML 셸을 prerendering하고 준비된 다이나믹 콘텐츠를 스트리밍하여, 단일 라우트 안에서 정적·캐시·다이나믹 콘텐츠를 혼합할 수 있다. [`cacheLife()`](../3-api-reference/3.3-functions/cacheLife.md)로 캐시 수명(lifetime)을 설정하고, [`cacheTag()`](../3-api-reference/3.3-functions/cacheTag.md)로 캐시된 데이터에 태그를 지정하며, [`updateTag()`](../3-api-reference/3.3-functions/updateTag.md)로 필요에 따라 온디맨드로 무효화한다. 자세한 내용은 [Cache Components 가이드](../1-getting-started/caching.md)를 참고한다.

#### Catch-all Segments
`[...folder]/page.js` 문법을 사용해 여러 URL 경로를 일치시킬 수 있는 다이나믹 라우트 세그먼트다. 이 세그먼트는 일치하고 남은 모든 URL 세그먼트를 캡처하므로, 문서 사이트나 파일 브라우저 같은 기능을 구현할 때 유용하다. 자세한 내용은 [다이나믹 라우트 세그먼트](../3-api-reference/3.1-file-conventions/dynamic-routes.md#catch-all-segments)를 참고한다.

#### Client Bundles (클라이언트 번들)
브라우저로 전송되는 JavaScript 번들이다. Next.js는 초기 페이로드 크기를 줄이고 각 페이지에 필요한 코드만 로드할 수 있도록 [모듈 그래프(module graph)](#module-graph)를 기반으로 번들을 자동으로 분할한다.

#### Client Component
브라우저에서 실행되는 React 컴포넌트다. Next.js에서는 초기 페이지 생성 시 서버에서도 Client Component를 렌더링할 수 있다. 상태(state), effect, 이벤트 핸들러, 브라우저 API를 사용할 수 있으며, 파일 최상단에 [`"use client"` 지시어](#use-client-지시어-use-client-directive)를 표시하여 정의한다. 자세한 내용은 [Server and Client Components](../1-getting-started/server-and-client-components.md)를 참고한다.

#### Client-side navigation (클라이언트 측 내비게이션)
전체 페이지를 새로고침하지 않고 페이지 콘텐츠를 동적으로 갱신하는 내비게이션 방식이다. Next.js는 [`<Link>` 컴포넌트](../3-api-reference/3.2-components/link.md)를 통해 클라이언트 측 내비게이션을 수행하며, 공유 레이아웃의 인터랙션을 유지하고 브라우저 상태를 보존한다. 자세한 내용은 [Linking and Navigating](../1-getting-started/linking-and-navigating.md#client-side-transitions)을 참고한다.

#### Client Cache (클라이언트 캐시)
방문했거나 prefetch된 라우트의 [RSC Payload](#rsc-payload)를 저장하는 브라우저 인메모리 캐시다. [클라이언트 측 내비게이션](#client-side-navigation-클라이언트-측-내비게이션) 중에 Next.js는 서버 요청 없이 캐시된 [레이아웃](#layout-레이아웃)과 [로딩 UI](#loading-ui-로딩-ui)를 즉시 제공한다. 페이지는 기본적으로 캐시되지 않지만 브라우저 앞/뒤로 가기 내비게이션 시 재사용된다.

클라이언트 캐시는 페이지를 새로고침하면 초기화된다. [`revalidateTag`](../3-api-reference/3.3-functions/revalidateTag.md), [`revalidatePath`](../3-api-reference/3.3-functions/revalidatePath.md), [`updateTag`](../3-api-reference/3.3-functions/updateTag.md), [`router.refresh`](../3-api-reference/3.3-functions/use-router.md), [`cookies.set`](../3-api-reference/3.3-functions/cookies.md), [`cookies.delete`](../3-api-reference/3.3-functions/cookies.md)를 통해 프로그래밍 방식으로 무효화할 수 있다.

클라이언트 캐시 수명은 전역적으로는 [`staleTimes`](../3-api-reference/3.5-config/3.5.1-next-config-js/staleTimes.md)로 설정하거나, 라우트별로는 [`cacheLife`](../3-api-reference/3.3-functions/cacheLife.md#client-cache-behavior)의 `stale` 속성으로 설정할 수 있다(권장).

#### Code Splitting (코드 분할)
애플리케이션을 라우트 단위로 더 작은 JavaScript 청크로 나누는 과정이다. 모든 코드를 한 번에 로드하지 않고 현재 라우트에 필요한 코드만 로드하므로 초기 로딩 시간이 줄어든다. Next.js는 라우트를 기반으로 코드 분할을 자동으로 수행한다. 자세한 내용은 [Package Bundling 가이드](../2-guides/package-bundling.md)를 참고한다.

---

### D

#### Dynamic rendering (다이나믹 렌더링)
컴포넌트가 [빌드 시점](#build-time-빌드-시점)이 아닌 요청 시점에 렌더링되는 방식이다. 컴포넌트가 [Request-time APIs](#request-time-apis-요청-시점-api)를 사용하면 다이나믹 렌더링으로 전환된다.

#### Dynamic route segments (다이나믹 라우트 세그먼트)
요청 시점의 데이터를 기반으로 생성되는 [라우트 세그먼트](#route-segment-라우트-세그먼트)다. 폴더 이름을 대괄호로 감싸서(예: `[slug]`) 생성하며, 블로그 글이나 상품 페이지처럼 다이나믹 데이터를 기반으로 라우트를 생성할 수 있게 한다. 자세한 내용은 [Dynamic Route Segments](../3-api-reference/3.1-file-conventions/dynamic-routes.md)를 참고한다.

---

### E

#### Environment Variables (환경 변수)
빌드 시점 또는 요청 시점에 접근할 수 있는 설정값이다. Next.js에서 `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저에 노출되며, 다른 변수들은 서버 측에서만 사용할 수 있다. 자세한 내용은 [Environment Variables 가이드](../2-guides/environment-variables.md)를 참고한다.

#### Error Boundary
자식 컴포넌트 트리에서 발생하는 JavaScript 오류를 포착하고 fallback UI를 표시하는 React 컴포넌트다. Next.js에서는 [`error.js` 파일](../3-api-reference/3.1-file-conventions/error.md)을 생성하여 라우트 세그먼트를 Error Boundary로 자동으로 감쌀 수 있다. 자세한 내용은 [Error Handling](../1-getting-started/error-handling.md)을 참고한다.

---

### F

#### Font Optimization (폰트 최적화)
[`next/font`](../3-api-reference/3.2-components/font.md)를 사용하는 자동 폰트 최적화 기능이다. Next.js는 폰트를 자체 호스팅하고, 레이아웃 이동(layout shift)을 제거하며, 성능 모범 사례를 적용한다. Google Fonts 및 로컬 폰트 파일과 함께 작동한다. 자세한 내용은 [Fonts](../1-getting-started/fonts.md)를 참고한다.

#### File-system caching (파일 시스템 캐싱)
실행 사이에 컴파일러 산출물을 디스크에 저장하여 `next dev` 또는 `next build` 명령 전반의 중복 작업을 줄이고 컴파일 속도를 크게 향상시키는 Turbopack 기능이다. 자세한 내용은 [Turbopack FileSystem Caching](../3-api-reference/3.5-config/3.5.1-next-config-js/turbopackFileSystemCache.md)을 참고한다.

---

### H

#### Hydration
서버에서 렌더링된 정적 HTML을 인터랙티브하게 만들기 위해 React가 DOM에 이벤트 핸들러를 연결하는 과정이다. hydration 동안 React는 서버에서 렌더링된 마크업과 클라이언트 측 JavaScript를 조율(reconciliation)한다. 자세한 내용은 [Server and Client Components](../1-getting-started/server-and-client-components.md#how-do-server-and-client-components-work-in-nextjs)를 참고한다.

---

### I

#### Import Aliases (경로 별칭)
자주 사용하는 디렉토리에 대해 단축 참조 경로를 제공하는 사용자 정의 경로 매핑이다. Import Alias는 상대 경로 import의 복잡성을 줄이고 코드의 가독성과 유지보수성을 높인다. 자세한 내용은 [절대 경로 Import 및 모듈 경로 별칭 설정](../1-getting-started/installation.md#set-up-absolute-imports-and-module-path-aliases)을 참고한다.

#### Incremental Static Regeneration (ISR)
전체 사이트를 다시 빌드하지 않고도 정적 콘텐츠를 업데이트할 수 있는 기법이다. ISR을 사용하면 페이지 단위로 정적 생성을 사용하면서 트래픽이 들어올 때 백그라운드에서 페이지를 revalidate할 수 있다. 자세한 내용은 [ISR 가이드](../2-guides/incremental-static-regeneration.md) 또는 Cache Components를 사용하는 경우 [Cache Components를 활용한 ISR](../2-guides/incremental-static-regeneration-cache-components.md)을 참고한다.

> **알아두면 좋은 점**: Next.js에서 ISR은 [Revalidation](#revalidation)으로도 알려져 있다.

#### Intercepting Routes (인터셉팅 라우트)
현재 레이아웃 내에서 애플리케이션의 다른 부분에 있는 라우트를 로드할 수 있게 해주는 라우팅 패턴이다. 사용자가 컨텍스트를 벗어나지 않고 모달 같은 콘텐츠를 표시하면서도 URL을 공유 가능한 상태로 유지할 때 유용하다. 자세한 내용은 [Intercepting Routes](../3-api-reference/3.1-file-conventions/intercepting-routes.md)를 참고한다.

#### Image Optimization (이미지 최적화)
[`<Image>` 컴포넌트](../3-api-reference/3.2-components/image.md)를 사용하는 자동 이미지 최적화 기능이다. Next.js는 온디맨드로 이미지를 최적화하고, WebP 같은 최신 형식으로 제공하며, 지연 로딩(lazy loading) 및 반응형 크기 조절을 자동으로 처리한다. 자세한 내용은 [Images](../1-getting-started/images.md)를 참고한다.

---

### L

#### Layout (레이아웃)
여러 페이지 간에 공유되는 UI다. 레이아웃은 상태를 보존하고, 인터랙티브한 상태를 유지하며, 내비게이션 시 다시 렌더링되지 않는다. [`layout.js` 파일](../3-api-reference/3.1-file-conventions/layout.md)에서 React 컴포넌트를 export하여 정의한다. 자세한 내용은 [Layouts and Pages](../1-getting-started/layouts-and-pages.md)를 참고한다.

#### Loading UI (로딩 UI)
[라우트 세그먼트](#route-segment-라우트-세그먼트)가 로드되는 동안 표시되는 fallback UI다. 폴더에 [`loading.js` 파일](../3-api-reference/3.1-file-conventions/loading.md)을 추가하여 생성하며, 이는 페이지를 [Suspense boundary](#suspense-boundary-suspense-경계)로 자동으로 감싼다. 자세한 내용은 [Loading UI](../3-api-reference/3.1-file-conventions/loading.md)를 참고한다.

---

### M

#### Module Graph (모듈 그래프)
앱 내 파일 간의 의존성 관계를 나타내는 그래프다. 각 파일(모듈)이 노드가 되고, import/export 관계가 에지(edge)를 형성한다. Next.js는 이 그래프를 분석하여 최적의 번들링 및 코드 분할 전략을 결정한다. 자세한 내용은 [Server and Client Components](../1-getting-started/server-and-client-components.md#reducing-js-bundle-size)를 참고한다.

#### Metadata (메타데이터)
제목, 설명, Open Graph 이미지 등 브라우저와 검색 엔진이 사용하는 페이지 정보다. Next.js에서는 레이아웃이나 페이지 파일에서 [`metadata` 객체 export](../3-api-reference/3.3-functions/generate-metadata.md) 또는 [`generateMetadata` 함수](../3-api-reference/3.3-functions/generate-metadata.md)를 정의하여 메타데이터를 설정한다. 자세한 내용은 [Metadata and OG Images](../1-getting-started/metadata-and-og-images.md)를 참고한다.

#### Memoization (메모이제이션)
단일 렌더링 패스(단일 요청) 동안 동일한 함수를 여러 번 호출해도 한 번만 실행되도록 함수의 반환값을 캐시하는 기법이다. Next.js에서는 동일한 URL과 옵션을 가진 `fetch` `GET` 요청이 Server Component, 레이아웃, 페이지, `generateMetadata`/`generateStaticParams` 전반에서 자동으로 메모이제이션된다(단, React 컴포넌트 트리의 일부가 아닌 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)는 제외된다).

`fetch` 이외의 작업에는 React [`cache`](https://react.dev/reference/react/cache) 함수를 사용한다. 자세한 내용은 [`fetch` API 참조](../3-api-reference/3.3-functions/fetch.md)를 참고한다.

#### Middleware
[Proxy](#proxy)를 참고한다.

---

### N

#### Not Found
라우트가 존재하지 않거나 [`notFound()` 함수](../3-api-reference/3.3-functions/not-found.md)가 호출되었을 때 표시되는 특수 컴포넌트다. `app` 디렉토리에 [`not-found.js` 파일](../3-api-reference/3.1-file-conventions/not-found.md)을 추가하여 생성한다. 자세한 내용은 [Error Handling](../1-getting-started/error-handling.md#not-found)을 참고한다.

---

### P

#### Private Folders (비공개 폴더)
밑줄로 시작하는 폴더(예: `_components`)로, 라우팅 시스템에서 제외된다. 라우트 URL로 노출되지 않으면서 코드를 구조화하고 유틸리티를 공유할 때 사용한다. 자세한 내용은 [Private Folders](../1-getting-started/project-structure.md#private-folders)를 참고한다.

#### Page (페이지)
라우트에 고유한 UI다. `app` 디렉토리 내의 [`page.js` 파일](../3-api-reference/3.1-file-conventions/page.md)에서 React 컴포넌트를 export하여 정의한다. 자세한 내용은 [Layouts and Pages](../1-getting-started/layouts-and-pages.md)를 참고한다.

#### Parallel Routes (패럴렐 라우트)
동일한 레이아웃 내에서 여러 페이지를 동시에 또는 조건부로 렌더링할 수 있게 해주는 패턴이다. `@folder` 규칙을 사용하는 명명된 슬롯(named slot)을 통해 생성하며, 대시보드, 모달, 복잡한 레이아웃 구성에 유용하다. 자세한 내용은 [Parallel Routes](../3-api-reference/3.1-file-conventions/parallel-routes.md)를 참고한다.

#### Partial Prefetching
[Cache Components](#cache-components) 라우트를 위한 prefetch 전략으로, `<Link>`가 기본적으로 전체 페이지 대신 라우트별 [App Shell](#app-shell)을 prefetch한다. `next.config.ts`에서 [`partialPrefetching: true`](../3-api-reference/3.5-config/3.5.1-next-config-js/partialPrefetching.md)로 활성화한다. 자세한 내용은 [Adopting Partial Prefetching 가이드](../2-guides/adopting-partial-prefetching.md)를 참고한다.

#### Partial Prerendering (PPR)
단일 라우트 안에서 prerendering과 다이나믹 렌더링을 결합하는 렌더링 최적화 기술이다. 정적 셸을 즉시 제공하고 준비된 다이나믹 콘텐츠를 스트리밍하여 두 렌더링 전략의 장점을 모두 제공한다. 자세한 내용은 [Cache Components 가이드](../1-getting-started/caching.md)를 참고한다.

#### Prefetching
사용자가 라우트로 이동하기 전에 백그라운드에서 해당 라우트를 미리 로드하는 기법이다. Next.js는 [`<Link>` 컴포넌트](../3-api-reference/3.2-components/link.md)로 연결된 라우트가 뷰포트에 들어오면 자동으로 prefetch하여 내비게이션을 즉각적으로 느끼게 만든다. 자세한 내용은 [Prefetching 가이드](../2-guides/prefetching.md)를 참고한다.

#### Prerendering
[빌드 시점](#build-time-빌드-시점)이나 [revalidation](#revalidation) 중 백그라운드에서 컴포넌트를 렌더링하는 방식이다. 결과물은 HTML과 [RSC Payload](#rsc-payload)이며, CDN에서 캐시되어 제공될 수 있다. [Request-time APIs](#request-time-apis-요청-시점-api)를 사용하지 않는 컴포넌트의 기본 동작이다.

#### Proxy
요청이 완료되기 전에 서버에서 코드를 실행하는 파일([`proxy.js`](../3-api-reference/3.1-file-conventions/proxy.md))이다. 로깅, redirect, rewrite와 같은 서버 측 로직을 구현하는 데 사용된다. 이전에는 Middleware로 불렸다. 자세한 내용은 [Proxy 가이드](../1-getting-started/proxy.md)를 참고한다.

---

### R

#### Redirect (리다이렉트)
사용자를 한 URL에서 다른 URL로 이동시키는 동작이다. Next.js에서 redirect는 [`next.config.js`](../3-api-reference/3.5-config/3.5.1-next-config-js/redirects.md)에서 설정하거나, [Proxy](../3-api-reference/3.1-file-conventions/proxy.md)에서 반환하거나, [`redirect()` 함수](../3-api-reference/3.3-functions/redirect.md)를 통해 프로그래밍 방식으로 실행할 수 있다. 자세한 내용은 [Redirecting 가이드](../2-guides/redirecting.md)를 참고한다.

#### Request-time APIs (요청 시점 API)
요청에 특화된 데이터에 접근하여 컴포넌트를 [다이나믹 렌더링](#dynamic-rendering-다이나믹-렌더링)으로 전환시키는 함수들이다. 다음이 포함된다:

- [`cookies()`](../3-api-reference/3.3-functions/cookies.md) - 요청 쿠키 접근
- [`headers()`](../3-api-reference/3.3-functions/headers.md) - 요청 헤더 접근
- [`searchParams`](../3-api-reference/3.1-file-conventions/page.md#searchparams-optional) - URL 쿼리 파라미터 접근
- [`draftMode()`](../3-api-reference/3.3-functions/draft-mode.md) - 드래프트 모드 활성화 또는 확인

#### Runtime rendering
[Dynamic rendering](#dynamic-rendering-다이나믹-렌더링)을 참고한다.

#### Revalidation
캐시된 데이터를 갱신하는 과정이다. 시간 기반([`cacheLife()`](../3-api-reference/3.3-functions/cacheLife.md)를 사용해 캐시 수명 설정) 또는 온디맨드([`cacheTag()`](../3-api-reference/3.3-functions/cacheTag.md)로 데이터에 태그를 붙이고 [`updateTag()`](../3-api-reference/3.3-functions/updateTag.md)로 무효화) 방식으로 수행할 수 있다. 자세한 내용은 [Caching and Revalidating](../1-getting-started/caching.md)을 참고한다.

#### Rewrite (리라이트)
브라우저의 URL을 변경하지 않고 들어오는 요청 경로를 다른 대상 경로로 매핑하는 기능이다. [`next.config.js`](../3-api-reference/3.5-config/3.5.1-next-config-js/rewrites.md)에서 설정하거나 [Proxy](../3-api-reference/3.1-file-conventions/proxy.md)에서 반환할 수 있다. 외부 서비스 프록시나 레거시 URL 처리에 유용하다.

#### Route Groups (라우트 그룹)
URL 구조에 영향을 주지 않고 라우트를 정리하는 방법이다. 폴더 이름을 괄호로 감싸서(예: `(marketing)`) 생성하며, 관련된 라우트를 그룹화하고 그룹별 [레이아웃](#layout-레이아웃)을 적용하는 데 도움을 준다. 자세한 내용은 [Route Groups](../3-api-reference/3.1-file-conventions/route-groups.md)를 참고한다.

#### Route Handler
특정 라우트에 대한 HTTP 요청을 처리하는 함수로, [`route.js` 파일](../3-api-reference/3.1-file-conventions/route.md)에 정의된다. Route Handler는 웹 표준 Request 및 Response API를 사용하며 `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` 메서드를 처리할 수 있다. 자세한 내용은 [Route Handlers](../1-getting-started/route-handlers.md)를 참고한다.

#### Route Segment (라우트 세그먼트)
`app` 디렉토리의 폴더로 정의되는 URL 경로의 일부(두 슬래시 사이)다. 각 폴더는 URL 구조의 세그먼트를 나타낸다. 자세한 내용은 [Project Structure](../1-getting-started/project-structure.md)를 참고한다.

#### RSC Payload
React Server Component Payload는 렌더링된 React Server Components 트리의 압축된 바이너리 표현이다. Server Component의 렌더링 결과, Client Component의 placeholder, 둘 사이에 전달되는 props를 포함한다. 자세한 내용은 [Server and Client Components](../1-getting-started/server-and-client-components.md#how-do-server-and-client-components-work-in-nextjs)를 참고한다.

---

### S

#### Server Component
App Router의 기본 컴포넌트 유형이다. Server Component는 서버에서 렌더링되고, 데이터를 직접 가져올 수 있으며, 클라이언트 JavaScript 번들에 포함되지 않는다. 상태(state)나 브라우저 API는 사용할 수 없다. 자세한 내용은 [Server and Client Components](../1-getting-started/server-and-client-components.md)를 참고한다.

#### Server Action
Client Component에 prop으로 전달되거나 form action에 바인딩되는 [Server Function](#server-function)이다. Server Action은 폼 제출과 데이터 변이(mutation)에 흔히 사용된다. 자세한 내용은 [Server Actions and Mutations 가이드](../2-guides/server-actions.md)를 참고한다.

#### Server Function
서버에서 실행되는 비동기 함수로, [`"use server"` 지시어](../3-api-reference/3.4-directives/use-server.md)로 표시된다. Server Function은 클라이언트 측 코드에서 호출할 수 있다. Client Component에 prop으로 전달되거나 form action에 바인딩되면 [Server Action](#server-action)이라고 부른다. 자세한 내용은 [React Server Functions 공식 문서](https://react.dev/reference/rsc/server-functions)를 참고한다.

#### Static Export (정적 내보내기)
HTML, CSS, JavaScript 파일로 구성된 완전한 정적 사이트를 생성하는 배포 모드다. `next.config.js`에서 `output: 'export'`를 설정하여 활성화한다. Static Export 결과물은 Node.js 서버 없이도 모든 정적 파일 서버에서 호스팅할 수 있다. 자세한 내용은 [Static Exports 가이드](../2-guides/static-exports.md)를 참고한다.

#### Static rendering
[Prerendering](#prerendering)을 참고한다.

#### Static Assets (정적 에셋)
이미지, 폰트, 동영상 등 별도 처리 없이 직접 제공되는 파일들이다. 정적 에셋은 보통 `public` 디렉토리에 저장되며 상대 경로로 참조된다. 자세한 내용은 [Static Assets](../3-api-reference/3.1-file-conventions/public-folder.md)를 참고한다.

#### Static Shell (정적 셸)
브라우저에 즉시 제공되는 페이지의 prerender된 HTML 구조다. [Partial Prerendering (PPR)](#partial-prerendering-ppr)을 적용하면, 정적 셸에는 정적으로 렌더링 가능한 모든 콘텐츠와 함께 나중에 스트리밍되는 다이나믹 콘텐츠를 위한 [Suspense boundary](#suspense-boundary-suspense-경계) fallback이 포함된다.

#### Streaming (스트리밍)
전체 페이지가 렌더링될 때까지 기다리지 않고, 준비되는 대로 페이지의 일부분을 클라이언트로 점진 전송할 수 있게 해주는 기술이다. [`loading.js`](../3-api-reference/3.1-file-conventions/loading.md) 파일이나 수동 `<Suspense>` 경계를 통해 자동으로 활성화된다. 자세한 내용은 [Streaming 가이드](../2-guides/streaming.md)를 참고한다.

#### Suspense boundary (Suspense 경계)
비동기 콘텐츠를 감싸고 로딩 중에 fallback UI를 표시하는 React [`<Suspense>`](https://react.dev/reference/react/Suspense) 컴포넌트다. Next.js에서 Suspense 경계는 [정적 셸](#static-shell-정적-셸)이 끝나고 [스트리밍](#streaming-스트리밍)이 시작되는 위치를 정의하여 [Partial Prerendering (PPR)](#partial-prerendering-ppr)을 가능하게 한다.

---

### T

#### Turbopack
Next.js를 위해 구축된 빠른 Rust 기반 번들러다. Turbopack은 `next dev`의 기본 번들러이며 `next build`에서도 사용할 수 있다. Webpack에 비해 훨씬 빠른 컴파일 시간을 제공한다. 자세한 내용은 [Turbopack API 참조](../3-api-reference/turbopack.md)를 참고한다.

#### Tree Shaking (트리 쉐이킹)
빌드 과정에서 JavaScript 번들로부터 사용되지 않는 코드를 제거하는 프로세스다. Next.js는 번들 크기를 줄이기 위해 코드를 자동으로 트리 쉐이킹한다. 자세한 내용은 [Package Bundling 가이드](../2-guides/package-bundling.md)를 참고한다.

---

### U

#### URL data (URL 데이터)
pathname이나 쿼리 파라미터처럼 특정 URL을 식별하는 데이터다. App Router에서는 [`params`](../3-api-reference/3.1-file-conventions/page.md#params-optional), [`searchParams`](../3-api-reference/3.1-file-conventions/page.md#searchparams-optional), 그리고 이를 읽는 클라이언트 훅인 [`usePathname`](../3-api-reference/3.3-functions/use-pathname.md), [`useSearchParams`](../3-api-reference/3.3-functions/use-search-params.md)가 여기에 해당한다. URL 데이터는 세션별이 아니라 링크별로 달라지므로 공유 [App Shell](#app-shell)에 포함될 수 없다.

#### `"use cache"` 지시어 (`"use cache"` Directive)
컴포넌트나 함수를 캐시 가능하도록 지정하는 지시어다. 파일 최상단에 배치하여 해당 파일의 모든 export를 캐시 가능하도록 지정하거나, 함수 또는 컴포넌트 내부 최상단에 인라인으로 배치하여 특정 스코프만 캐시 가능하도록 지정할 수 있다. 자세한 내용은 [`"use cache"` 참조](../3-api-reference/3.4-directives/use-cache.md)를 참고한다.

#### `"use client"` 지시어 (`"use client"` Directive)
서버 코드와 클라이언트 코드 사이의 경계를 표시하는 특수 React 지시어다. 모든 import나 다른 코드보다 앞서 파일 최상단에 위치해야 한다. React 컴포넌트, 헬퍼 함수, 변수 선언 및 가져온 모든 의존성이 [클라이언트 번들](#client-bundles-클라이언트-번들)에 포함되어야 함을 나타낸다. 자세한 내용은 [`"use client"` 참조](../3-api-reference/3.4-directives/use-client.md)를 참고한다.

#### `"use server"` 지시어 (`"use server"` Directive)
함수를 클라이언트 측 코드에서 호출할 수 있는 [Server Function](#server-function)으로 지정하는 지시어다. 파일 최상단에 배치하여 파일의 모든 export를 Server Function으로 지정하거나, 함수 내부 최상단에 인라인으로 배치하여 특정 함수만 지정할 수 있다. 자세한 내용은 [`"use server"` 참조](../3-api-reference/3.4-directives/use-server.md)를 참고한다.

---

### V

#### Version skew (버전 불일치)
애플리케이션의 새 버전이 배포된 후에도 활성 상태로 유지되는 클라이언트가 이전 빌드의 JavaScript, CSS 또는 데이터를 참조할 수 있다. 이러한 클라이언트와 서버 간의 버전 불일치를 버전 왜곡(version skew)이라고 하며, 에셋 누락, Server Action 오류, 내비게이션 실패를 유발할 수 있다. Next.js는 [`deploymentId`](../3-api-reference/3.5-config/3.5.1-next-config-js/deploymentId.md)를 사용하여 버전 왜곡을 감지하고 처리한다. 자세한 내용은 [Self-Hosting - Version Skew](../2-guides/self-hosting.md#version-skew)를 참고한다.

---

## 예제 및 데모 설계

- **데모 가능 여부**: 가능 (Phase 1에서는 설계만 작성)
- **데모 목적**: Next.js의 주요 용어 간 관계(예: App Shell vs Static Shell, Server Component vs Client Component, Prerendering vs Dynamic rendering)를 상호작용 가능한 다이어그램 또는 용어 검색 인터페이스로 시각화하여 확인한다.
- **사용자가 확인할 화면과 상호작용**:
  - 용어 검색 필터 및 카테고리 태그(라우팅 / 렌더링 / 캐싱 / 데이터 / 설정)를 선택하여 관련 용어 목록과 정의를 즉시 필터링한다.
  - 용어 간 참조 관계(예: `Server Action` 클릭 시 `Server Function`과의 관계 강조)를 팝업 또는 툴팁으로 확인한다.
- **관찰할 결과**: 특정 키워드가 라우팅/렌더링/캐싱 컨텍스트에서 어떤 역할을 수행하는지 한눈에 파악할 수 있다.

---

## 연습 문제

**Q1. (단일 선택) Next.js 16에서 요청이 완료되기 전에 코드를 실행하여 redirect, rewrite, 헤더 수정 등을 수행하는 파일(`proxy.js`)의 명칭으로 올바른 것은?**

1. Middleware
2. Proxy
3. Route Handler
4. Interceptor

<details><summary>정답 보기</summary>

**정답: 2** — Next.js 16부터 Middleware는 그 목적을 더 명확히 나타내기 위해 Proxy로 명칭이 변경되었다.

</details>

**Q2. (복수 선택) 컴포넌트를 [다이나믹 렌더링(Dynamic rendering)](#dynamic-rendering-다이나믹-렌더링)으로 전환시키는 [Request-time APIs](#request-time-apis-요청-시점-api)를 모두 고르시오.**

- [ ] `cookies()`
- [ ] `headers()`
- [ ] `searchParams`
- [ ] `draftMode()`
- [ ] `params`

<details><summary>정답 보기</summary>

**정답: 1, 2, 3, 4** — `cookies()`, `headers()`, `searchParams`, `draftMode()`는 요청 시점의 데이터를 읽어 다이나믹 렌더링을 유발한다 (`params`는 라우트 경로 파라미터로 정적 생성 시 `generateStaticParams`와 함께 prerender될 수 있다).

</details>

---

## 요약

- Glossary는 Next.js App Router의 라우팅, 렌더링, 캐싱, 데이터 패칭, 설정 관련 핵심 용어 48개를 알파벳순으로 정리한 참조 사전이다.
- `Server Component`, `Client Component`, `Server Function`, `Server Action` 등 렌더링 및 실행 위치에 따른 개념 구분을 명확히 제공한다.
- `App Shell`, `Static Shell`, `PPR`, `Cache Components` 등 최신 Next.js 성능 최적화 아키텍처의 용어를 체계화했다.
- Next.js 16 명칭 변경 사항(예: Middleware → Proxy) 및 버전 관리 개념(Version skew, `deploymentId`)을 반영했다.
- 각 용어 항목은 관련 공식 개념 및 API 레퍼런스 학습 문서로 직접 연결된다.
