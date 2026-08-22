# nextjs-app 데모 주제 불일치 및 중복 예제 전수 분석 보고서 (241건)

- **분석 기준일**: 2026-08-22
- **대상**: [`packages/demos/demos.yaml`](../packages/demos/demos.yaml)에 등록된 데모 241건
- **목적**: 메뉴 제목·연결 문서가 가리키는 Next.js 주제와 실제 실습 예제가 어긋나는 지점, 서로 다른 메뉴에 동일한 예제 또는 설명이 반복되는 지점을 식별한다.
- **판정 범위**: `demos.yaml`의 메타데이터, 실제 `page.tsx`·`components/*.tsx`·Route Handler·특수 파일, 두 zone의 `next.config.ts`를 정적 코드로 대조했다.
- **런타임 범위**: 브라우저 클릭·빌드 산출물·네트워크 요청은 이번 조사에서 실행하지 않았다. 따라서 “실제 런타임에서 동작하지 않는다”가 아니라, **현재 소스에 해당 동작을 구현한 근거가 없다**는 표현을 사용한다.
- **기존 감사 문서와의 관계**: 기존 `10/11/12` 문서를 판정 근거로 재사용하지 않고 현재 소스를 독립적으로 다시 집계했다. 현재 작업 중인 기존 문서 파일은 수정하지 않았다.
- **작업 트리 주의**: 조사 중 기존 작업 트리에 있던 소스 삭제 diff 11건을 관찰했으며 복원하거나 수정하지 않았다. 아래 수치는 해당 삭제가 반영된 현재 파일을 기준으로 재집계했다.

## 1. 결론 요약

현재 241개 메뉴는 “241개의 서로 다른 Next.js 학습 예제”라기보다, 실제로는 공통 상품 주문 UI와 공통 설명 템플릿에 메뉴 제목만 바꿔 끼운 항목이 다수 섞여 있는 상태다.

| 조사 축 | 결과 | 판정 의미 |
|---|---:|---|
| 전체 데모 | 241건 | `baseline` 211건, `cache` 30건 |
| `status: done` | 241건 | 모두 `done`으로 공개되어 있음 |
| 실제 `page.tsx` 진입점 | 241/241 | 파일 존재 여부만 통과하며, 주제 구현을 보장하지 않음 |
| **고신뢰 주제 불일치** | **64건** | 동일 상품 주문 위젯 63건 + 인라인 Server Action 미구현 1건 |
| **동일 실습 컴포넌트 구조 복제** | **63건** | 문자열·컴포넌트명·JSX 텍스트를 제거해도 같은 상태·핸들러·DOM 구조가 남음 |
| **동일 4단 개념 설명 복제** | **48건** | 12개 클러스터가 `<p>`·`<li>` 본문을 완전히 공유함 |
| 동일 문서에 연결된 데모 | 82개 문서, 172건 | 중복 자체가 확정은 아니며, 통합 검토 후보 |
| config 메뉴 | 22건 | 두 zone의 실제 `next.config.ts`에 직접 선언된 주제 키는 `assetPrefix`, `cacheComponents` 중심이며 나머지는 화면 텍스트/공통 위젯으로 확인됨 |

### 핵심 판단

1. **가장 큰 문제는 주제별 구현의 부재가 아니라 공통 위젯의 대량 복제다.** 상품 선택, 주문 수량 증감, 로컬 로그 출력이 서로 다른 API·파일 컨벤션 데모의 실질적인 본문이 되었다.
2. **개념 설명도 독립적으로 생성되지 않았다.** SWR, Suspense, TanStack Query가 같은 설명을 공유하고, `error.tsx`와 `notFound()`가 같은 설명을 공유하는 식으로 메뉴 간 경계가 무너져 있다.
3. **같은 문서에 여러 데모를 연결한 것 자체는 결함이 아니다.** 예를 들어 `[id]`, `[...slug]`, `[[...slug]]`는 차이를 비교할 이유가 있다. 다만 현재 구현이 동일하면 문서 매핑 수만 늘어난 중복으로 봐야 한다.
4. **`done` 표시는 실제 주제 검증을 의미하지 않는다.** 현재 린트는 URL·문서·`page.tsx` 존재를 검사하지만, 해당 API가 실제 코드에 등장하는지 또는 화면이 해당 API를 관찰하는지는 검사하지 않는다.

## 2. 조사 방법과 판정 기준

### 2-1. 고신뢰 “주제와 전혀 다른 예제” 기준

다음 조건을 모두 만족하거나, 마지막 항목에 해당하는 경우를 고신뢰 불일치로 분류했다.

- 메뉴 제목 또는 `doc`가 특정 Next.js API, 설정 키, 파일 컨벤션을 명시한다.
- 실제 렌더링 컴포넌트는 `selectedProduct`, `orderQuantity`, `actionLog` 기반의 상품 주문 UI다.
- 실제 실습 경로에서 해당 API 호출, `next/*` import, Route Handler, 특수 파일 또는 설정 적용을 확인할 수 없다.
- 또는 제목은 인라인 `'use server'` 클로저 액션인데 실제 컴포넌트는 `'use client'`와 `useTransition()`만 사용하고 서버 액션 선언이 없다.

> 단순히 구현이 미완성인 항목, 설명이 추상적인 항목, 같은 문서에 속한 정상적인 변형은 고신뢰 불일치 수에 포함하지 않았다.

### 2-2. “같은 예제 반복” 기준

중복은 세 단계로 나누었다.

| 등급 | 기준 | 보고서 집계 |
|---|---|---:|
| A. 실습 구조 복제 | 실습 컴포넌트에서 주석·문자열·JSX 텍스트·컴포넌트명만 제거한 뒤 동일한 코드 구조가 됨 | 63건 |
| B. 설명 본문 복제 | `VerificationFooter.tsx`의 `<p>`·`<li>` 본문이 완전히 동일함 | 48건, 12클러스터 |
| C. 메뉴 파편화 후보 | 같은 `doc`에 2개 이상 데모가 연결됨 | 82개 문서, 172건 |

C는 “무조건 삭제해야 하는 중복”이 아니다. A와 B가 같은 그룹에서 함께 나타나거나, 각 데모의 고유 API가 실제 코드에 없을 때 통폐합 우선순위를 높인다.

## 3. 핵심 발견 1 — 상품 주문 위젯 63건 복제

### 3-1. 반복되는 실제 구조

대표적인 두 파일은 메뉴 제목만 다르고 다음 실습 코드가 사실상 동일하다.

- [`ConfigImagesFormatsDemo.tsx`](../apps/demo-baseline/src/app/zone/baseline/config/images/formats-avif-webp/components/ConfigImagesFormatsDemo.tsx#L4): `selectedProduct`, `orderQuantity`, `actionLog` 상태와 상품 선택·수량 변경·로그 출력
- [`RedirectAction303Demo.tsx`](../apps/demo-baseline/src/app/zone/baseline/functions/redirect/action-303/components/RedirectAction303Demo.tsx#L4): 같은 상태·같은 상품 버튼·같은 수량 조절·같은 “Next.js API 트리거” 로그

두 컴포넌트에는 `images.formats`를 실제로 설정하거나 `redirect()`를 호출하는 코드가 없다. 제목 문자열만 각각의 API 이름을 포함한다. 이 패턴을 구성하는 실질적인 동작은 다음 네 가지뿐이다.

1. `selectedProduct` 초기화 및 러닝화/윈드브레이커 선택
2. `orderQuantity` 증감
3. `Next.js API 트리거`라는 로컬 로그 추가
4. `actionLog` 배열 렌더링

### 3-2. 고신뢰 불일치 목록 63건

아래 목록은 실습 컴포넌트 구조 정규화 결과가 하나의 동일한 그룹으로 묶인 데모다. `config/asset-prefix/cdn-distribution`과 `file-conventions/route/rest-api-orders`도 같은 상태 조각을 공유하지만 각각 전역 `assetPrefix` 또는 실제 `api/route.ts`가 있어 이 63건의 고신뢰 그룹에서는 제외했다.

<details>
<summary>63건 전체 URL</summary>

- `guides/caching-legacy/segment-revalidate`
- `guides/sass/promotions-theme`
- `guides/data-security/server-only-guard`
- `guides/data-security/react-taint-api`
- `guides/content-security-policy/nonce-injection`
- `guides/environment-variables/runtime-env`
- `guides/mdx/product-tech-doc`
- `guides/third-party-libraries/google-analytics`
- `guides/multi-tenant/isolated-branding`
- `guides/multi-zones/cross-zone-routing`
- `guides/instrumentation/server-register-hook`
- `guides/static-exports/client-routing`
- `guides/static-exports/ssg-catalog`
- `guides/public-pages/terms-ssg`
- `file-conventions/layout/dynamic-category-layout`
- `file-conventions/page/react-19-use-params`
- `file-conventions/not-found/programmatic-not-found`
- `file-conventions/default/hard-reload-restore`
- `file-conventions/mdx-components/global-mdx-theme`
- `file-conventions/instrumentation/server-boot-log`
- `file-conventions/proxy/gateway-router`
- `file-conventions/unauthorized/anonymous-401`
- `file-conventions/route-segment-config/dynamic-params-toggle`
- `file-conventions/route-segment-config/instant-prefetch`
- `file-conventions/route-segment-config/max-duration-timeout`
- `functions/unstable-no-store/dynamic-bailout`
- `functions/revalidate-path/dynamic-route`
- `functions/revalidate-tag/max-expiration`
- `functions/fetch-extended/revalidate-option`
- `functions/fetch-extended/tag-option`
- `functions/headers/user-agent-device`
- `functions/after/analytics-batch`
- `functions/not-found/trigger-404`
- `functions/unauthorized/trigger-401`
- `functions/redirect/action-303`
- `functions/redirect/handler-307`
- `functions/permanent-redirect/seo-308`
- `functions/image-response/og-badge`
- `functions/generate-metadata/dynamic-title`
- `functions/generate-static-params/basic-ssg`
- `functions/connection/request-signal`
- `functions/taint-unique-value/block-secret`
- `functions/use-server-inserted-html/head-style`
- `config/redirects/regex-pattern-matching`
- `config/rewrites/cross-zone-proxy`
- `config/rewrites/query-param-rewrite`
- `config/headers/global-security-headers`
- `config/trailing-slash/url-normalization`
- `config/images/remote-patterns-security`
- `config/images/formats-avif-webp`
- `config/logging/fetches-full-url`
- `config/dev-indicators/render-badge`
- `config/env/build-time-injection`
- `config/cross-origin/anonymous-mode`
- `config/powered-by-header/hide-x-powered`
- `config/cache-components/enable-flag`
- `config/cache-life/custom-presets`
- `config/cache-handlers/redis-kv`
- `config/expire-time/memory-isr-tuning`
- `config/output/standalone-container`
- `config/output/export-static-spa`
- `edge/v8-lightweight/nodejs-modules-bailout`
- `architecture/compiler-optimization/react-compiler`

</details>

정규화된 실습 컴포넌트 전체 비교에서는 **10개 구조 복제 그룹, 영향 데모 101건**이 확인됐다. 이 중 63건 상품 주문 위젯 그룹만 주제 불일치로 확정했고, 나머지 9개 그룹의 38개 고유 데모는 다음처럼 별도 검토 후보로 남겼다. 부모 라우트가 자식 데모 파일을 포함하는 경우도 있어 이 숫자를 모두 삭제 대상이라고 해석하지 않았다.

| 추가 구조 복제 그룹 | 그룹 크기 | 대표 URL 또는 유형 |
|---|---:|---|
| 공통 컴포넌트 변형 | 13 | `guides/authentication/rsc-user-profile`, `guides/scripts/strategy-order`, `functions/image-response/dynamic-receipt`, `architecture/turbopack/incremental-harness` 등 |
| Image/Link/Font/Script 컴포넌트 변형 | 10 | `components/image/*`, `components/link/*`, `components/font/*`, `components/script/*` |
| 공통 파일 컨벤션 UI | 4 | `file-conventions/intercepting-routes`, `file-conventions/intercepting-routes/direct-vs-modal` 등 |
| 런타임·라우트 설정 변형 | 3 | `file-conventions/route-groups/shop-vs-admin-roots`, `functions/server-runtime/edge-vs-nodejs` 등 |
| 병렬 라우트 부모·자식 트리 겹침 | 2+2 | `file-conventions/parallel-routes`와 `conditional-slot`/`independent-tabs` |
| 로딩·에러 UI 구조 겹침 | 2 | `file-conventions/loading/skeleton-boundary`, `file-conventions/error/payment-error-boundary` |
| 권한 API UI 구조 겹침 | 2 | `file-conventions/forbidden/admin-role-403`, `functions/forbidden/trigger-403` |

### 3-3. 별도 고신뢰 사례 — 인라인 Server Action 미구현

[`directives/use-server/inline-action-closure`](../apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx#L10)는 제목이 컴포넌트 내부 인라인 `'use server'` 클로저 액션이다. 그러나 실제 컴포넌트는 [`InlineActionClosureDemo.tsx`](../apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/components/InlineActionClosureDemo.tsx#L1)에서 `'use client'`, `useState`, `useTransition`, `setTimeout`만 사용한다. “Simulate inline server closure action”이라는 주석 외에 `'use server'` 선언이나 서버 액션 함수가 없다.

따라서 63건의 상품 주문 위젯 그룹과 별개로 **1건의 고신뢰 주제 불일치**로 분류했다. 고신뢰 불일치는 총 64건이다.

## 4. 핵심 발견 2 — 4단 개념 설명 48건 복제

`VerificationFooter.tsx`에서 `<p>`와 `<li>`의 본문만 추출해 비교한 결과, 12개 클러스터가 완전히 같은 설명을 공유한다. 제목과 `defaultExpected`만 바뀌어도 개념 설명 본문이 같으면 학습자는 서로 다른 API의 차이를 배울 수 없다.

| 클러스터 | 건수 | 반복된 URL |
|---|---:|---|
| 스트리밍·SWR·TanStack Query | 8 | `fetching-data/use-promise-streaming`, `guides/streaming-nested`, `guides/swr-polling`, `guides/how-revalidation-works/swr-flow`, `guides/streaming/chunk-loading`, `guides/swr/mutation-optimistic`, `guides/tanstack-query/infinite-scroll`, `guides/tanstack-query/ssr-hydration` |
| 상태 코드·에러 경계 | 8 | `error-handling/segment-error`, `error-handling/global-error`, `file-conventions/not-found/programmatic-not-found`, `file-conventions/forbidden/admin-role-403`, `file-conventions/unauthorized/anonymous-401`, `functions/not-found/trigger-404`, `functions/forbidden/trigger-403`, `functions/unauthorized/trigger-401` |
| 런타임 redirect와 config redirects | 7 | `guides/redirecting/order-complete`, `guides/redirecting/session-expired`, `functions/redirect/action-303`, `functions/redirect/handler-307`, `functions/permanent-redirect/seo-308`, `config/redirects/regex-pattern-matching`, `config/redirects/header-query-condition` |
| i18n·멀티 테넌트·멀티 존 | 5 | `guides/i18n/subpath-routing`, `guides/i18n/dictionary-translation`, `guides/multi-tenant/subdomain-tenant`, `guides/multi-tenant/isolated-branding`, `guides/multi-zones/cross-zone-routing` |
| Server Action·폼 상태 | 4 | `guides/server-actions-advanced`, `guides/forms/use-action-state-errors`, `guides/forms/use-form-status-spinner`, `guides/server-actions/start-transition` |
| Metadata 생성·상속 | 3 | `metadata-and-og-images/static-and-dynamic-metadata`, `functions/generate-metadata/dynamic-title`, `functions/generate-metadata/parent-inheritance` |
| ImageResponse·OG 이미지 | 3 | `metadata-and-og-images/opengraph-image`, `functions/image-response/og-badge`, `functions/image-response/dynamic-receipt` |
| Taint 보안 | 2 | `guides/data-security/react-taint-api`, `functions/taint-unique-value/block-secret` |
| React `use(params)`와 `useParams()` | 2 | `file-conventions/page/react-19-use-params`, `functions/use-params/client-id` |
| 레이아웃 세그먼트 훅 | 2 | `functions/use-selected-layout-segment/subnav-pill`, `functions/use-selected-layout-segments/breadcrumb` |
| `generateStaticParams` 변형 | 2 | `functions/generate-static-params/basic-ssg`, `functions/generate-static-params/multiple-segments` |
| Edge Runtime 변형 | 2 | `edge/v8-lightweight/global-web-apis`, `edge/v8-lightweight/nodejs-modules-bailout` |
| **합계** | **48** | **12개 클러스터** |

### 4-1. 설명 복제가 곧 주제 오매핑이 되는 대표 사례

- `guides/streaming-nested`와 `guides/swr-polling`은 제목은 다르지만 “SWR, TanStack Query 및 React 19 Suspense 스트리밍”으로 시작하는 동일 본문을 사용한다. 실제 두 파일의 본문은 [`streaming-nested/VerificationFooter.tsx`](../apps/demo-baseline/src/app/zone/baseline/guides/streaming-nested/components/VerificationFooter.tsx#L66)와 [`swr-polling/VerificationFooter.tsx`](../apps/demo-baseline/src/app/zone/baseline/guides/swr-polling/components/VerificationFooter.tsx#L66)에서 확인된다.
- `error-handling/segment-error`, `error-handling/global-error`, `notFound()`, `forbidden()`, `unauthorized()` 데모가 모두 `notFound()`·`forbidden()`·`unauthorized()`의 상태 코드 설명을 공유한다. `error.tsx` 세그먼트 경계와 `global-error.tsx`의 차이를 설명해야 하는 데모까지 같은 내용인 것은 주제 오매핑이다.
- `config/redirects/*`가 `next.config.ts`의 `redirects()` 조건을 설명해야 하는데, `functions/redirect/*`와 같은 런타임 `redirect()`/`permanentRedirect()` 설명을 공유한다. 설정 함수와 런타임 함수를 구분하지 못한다.
- `file-conventions/page/react-19-use-params`의 메뉴는 React 19 `use(params)`인데 설명은 `useParams()` 훅이다. 이는 동일 설명 복제이면서 API 자체가 바뀐 사례다.
- `functions/image-response/dynamic-receipt`는 영수증을 제목으로 달고 있으나 `og-badge`와 동일한 할인 배지 OG 이미지 설명을 사용한다.
- `edge/v8-lightweight/nodejs-modules-bailout`는 Node.js 모듈 제한을 다뤄야 하지만 `global-web-apis`와 동일한 글로벌 환율·Edge Web API 설명을 사용한다.

## 5. 핵심 발견 3 — config 메뉴는 실제 설정과 화면 예제가 분리되어 있다

config 계열 메뉴는 22건이다. 그러나 실제 zone 설정은 다음 정도만 선언한다.

- [`apps/demo-baseline/next.config.ts`](../apps/demo-baseline/next.config.ts#L3): `assetPrefix`, `images: { unoptimized: true }`, Server Actions `allowedOrigins`
- [`apps/demo-cache-components/next.config.ts`](../apps/demo-cache-components/next.config.ts#L3): `cacheComponents`, `assetPrefix`, `images: { unoptimized: true }`, Server Actions `allowedOrigins`

따라서 `remotePatterns`, `formats`, `logging`, `devIndicators`, `env`, `crossOrigin`, `poweredByHeader`, `output`, `cacheLife`, `cacheHandlers`, `expireTime`, `staleTimes` 등은 해당 메뉴 전용 zone 설정으로 확인되지 않는다. 예를 들어 [`config/env/build-time-injection`](../apps/demo-baseline/src/app/zone/baseline/config/env/build-time-injection/components/ConfigEnvInjectionDemo.tsx#L4)은 `next.config.ts`의 `env`를 읽지 않고 상품 주문 상태만 관리한다.

이 보고서에서는 `assetPrefix`와 `cacheComponents`가 zone 전체 설정에 실제로 존재한다는 이유로 해당 메뉴를 전부 고신뢰 불일치로 세지 않았다. 다만 현재 페이지가 그 설정의 효과를 직접 검증하지 않는다는 점은 별도 재구현 대상이다.

## 6. 핵심 발견 4 — 같은 문서에 2~3개 데모가 연결된 구조

`demos.yaml`에는 총 151개의 고유 `doc`가 있고, 그중 82개 문서가 2개 이상 데모에 연결되어 있다.

| 동일 문서에 연결된 데모 수 | 문서 수 | 영향 데모 수 |
|---:|---:|---:|
| 1개 | 69 | 69 |
| 2개 | 74 | 148 |
| 3개 | 8 | 24 |
| **합계** | **151** | **241** |

대표적인 다중 매핑은 다음과 같다.

| 문서 | 연결 데모 수 | 현재 메뉴 |
|---|---:|---|
| `1-getting-started/layouts-and-pages.md` | 3 | 중첩 레이아웃, template 생명주기, Route Groups |
| `2-guides/server-actions.md` | 3 | Server Actions 기본, 고급 폼, `startTransition` |
| `3-api-reference/3.1-file-conventions/parallel-routes.md` | 3 | 병렬 슬롯, 조건부 슬롯, 독립 탭 |
| `3-api-reference/3.1-file-conventions/route.md` | 3 | 주문 REST API, 웹훅 서명, SSE 재고 스트림 |
| `3-api-reference/3.1-file-conventions/dynamic-routes.md` | 3 | `[id]`, `[...slug]`, `[[...slug]]` |
| `3-api-reference/3.2-components/image.md` | 3 | `sizes`, `blur`, LCP preload |

이 중 `[id]`·`[...slug]`·`[[...slug]]`처럼 차이를 직접 비교할 가치가 있는 변형은 유지할 수 있다. 반면 같은 문서 매핑과 함께 63건 공통 상품 위젯 또는 48건 공통 설명이 나타나는 항목은 하나의 비교 실습으로 통합하는 편이 낫다.

## 7. “반복이지만 결함으로 세지 않은 것”

분석의 과잉 판정을 막기 위해 다음은 중복 수에 포함하지 않았다.

- 모든 데모가 `DemoContainer`·`DemoGuideCard`·`DemoPlaygroundCard`·`ExpectedActualPanel`·`DemoDeepDiveCard`를 사용하는 것. 이는 [`nextjs-app/AGENTS.md`](../AGENTS.md)의 표준 레이아웃 규칙이다.
- `file-conventions/route/rest-api-orders`의 상품 UI. UI는 공통 상태를 사용하지만 실제 [`api/route.ts`](../apps/demo-baseline/src/app/zone/baseline/file-conventions/route/rest-api-orders/api/route.ts)가 있고 GET/POST 처리가 연결되어 있어 64건에서 제외했다.
- `config/asset-prefix/cdn-distribution`의 공통 상태. 페이지 UI는 부정확하지만 zone의 [`next.config.ts`](../apps/demo-baseline/next.config.ts#L3)에 `assetPrefix`가 실제 존재하므로 “전혀 다른 예제”로는 세지 않았다.
- 같은 문서에 연결된 모든 데모. 문서 매핑 중복은 차별화된 하위 실습을 표현할 수 있으므로 코드 중복과 함께 볼 때만 결함으로 판단했다.

## 8. 우선순위별 조치 권고

### P0 — 공개 상태와 실제 주제를 즉시 맞추기

1. 64건의 `status: done`을 `wip` 또는 별도 감사 상태로 내리고, 공통 상품 위젯을 실제 Next.js API·파일 컨벤션 구현으로 교체한다.
2. `config/*`는 화면에 설정 키를 문자열로 표시하는 방식 대신 실제 zone의 `next.config.ts`에 최소한 하나의 고유 설정을 넣고 빌드·실행 결과를 관찰하게 한다.
3. `directives/use-server/inline-action-closure`는 실제 Server Action 경계를 만들거나, 현재 구현에 맞게 제목을 클라이언트 transition 예제로 바꾼다.

### P1 — 설명 복제 제거

1. 12개 DeepDive 클러스터를 API별 설명으로 분리한다.
2. 특히 `config/redirects`와 `functions/redirect`, `use(params)`와 `useParams()`, `error.tsx`와 `notFound()`를 우선 분리한다.
3. 설명의 제목만 바꾸는 생성기를 중단하고, API별로 “핵심 입력·실행 경계·관찰값·실무 주의사항”을 별도 데이터로 관리한다.

### P2 — 메뉴 파편화 정리

1. 82개 다중 매핑 문서를 하나씩 검토한다.
2. 고유한 파일 컨벤션 차이가 있는 변형은 비교 랩으로 묶고, 동작·설명·컴포넌트가 같은 항목은 대표 데모 하나로 통합한다.
3. `demos.yaml`의 `status: done`을 단순 파일 존재가 아니라 “주제 API 실행 근거 + 기대/실측 검증 근거”를 통과해야 올릴 수 있게 한다.

## 9. 재발 방지용 검사 제안

현재 린트는 URL 유일성, 연결 문서 존재, `page.tsx` 존재를 확인한다. 다음 정적 검사를 추가하면 이번 유형의 재발을 자동으로 낮출 수 있다.

- **주제 실행 근거 검사**: `config/env`라면 `next.config.ts`의 `env` 키와 실제 `process.env.KEY` 참조가 모두 있어야 한다. 문자열로 제목만 출력하는 코드는 통과시키지 않는다.
- **파일 컨벤션 검사**: `route.ts`, `layout.tsx`, `template.tsx`, `not-found.tsx` 등 제목에 명시된 파일이 실제 경로에 있어야 한다.
- **공통 위젯 중복 검사**: 컴포넌트에서 `selectedProduct + orderQuantity + actionLog` 조합이 발견되면 신규 데모 등록 시 경고한다.
- **설명 본문 중복 검사**: `<p>`·`<li>` 본문 해시가 기존 데모와 같으면 경고하고, 예외 사유를 메타데이터에 남긴다.
- **정적 검증 패널 검사**: `isMatched`를 고정 `true`로 두는 대신 실제 API 결과·라우트 상태·캐시 관찰값에서 계산하도록 요구한다.

## 10. 분석 한계

- 정적 코드 감사이므로 `next dev`의 실제 브라우저 결과, `next build` 산출물, 응답 헤더, RSC payload, 네트워크 요청은 검증하지 않았다.
- 문자열로만 존재하는 API 이름과 실제 실행 코드를 구분하기 위해 실습 컴포넌트의 import·상태·파일 구조를 함께 보았지만, 모든 TypeScript 의미를 AST 수준으로 해석한 것은 아니다.
- “같은 문서에 여러 데모”는 교육 설계상 의도된 비교일 수 있다. 통폐합 결정 전에는 각 문서의 학습 목표와 실제 라우트 트리를 함께 검토해야 한다.
- 따라서 이 문서는 수정 목록을 자동 생성하는 최종 판정표가 아니라, **주제 불일치와 예제 복제의 고신뢰 우선순위를 확정하는 전수 조사 리포트**다.
