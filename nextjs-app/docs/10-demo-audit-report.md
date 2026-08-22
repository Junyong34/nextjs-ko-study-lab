# nextjs-app 데모 감사 보고서 (241건)

- 대상: `nextjs-app/packages/demos/demos.yaml` 등록 데모 241건 (전부 `status: done`)
- 범위: (1) 메뉴 주제(제목/연결 문서) ↔ 실제 데모 코드 일치 여부, (2) 3단 `ExpectedActualPanel`의 기대(Expected) vs 실측(Actual) 정합성, (3) 이커머스 컨셉 전환 후보 선별
- 방법: 241건을 12개 배치(20개 내외)로 나누어 각 배치마다 실제 `page.tsx`/`components/*.tsx`/`actions.ts`와 연결된 `nextjs-docs/*.md`를 직접 열람해 코드 로직 기준으로 판정했다. 화면을 실제로 클릭해 런타임을 확인하지는 않았고, **정적 코드 근거**(import 여부, API 호출 리터럴, 파일 컨벤션 존재 여부, `ExpectedActualPanel`의 `isMatched` 값)로 판정했다.
- 코드/데모 파일은 수정하지 않았다. 읽기·확인·기록만 수행했다.

## 1. 요약

| 축 | PASS | PARTIAL | FAIL | 합계 |
|---|---|---|---|---|
| ① 주제 일치 (제목/doc ↔ 실제 코드) | 36 | 77 | 128 | 241 |
| ② 기대/실측 일치 (ExpectedActualPanel) | 1 | 10 | 230 | 241 |

- 두 축 모두 PASS(사실상 결함 없음): **`server-actions/basic`(#1) 단 1건**뿐이다. 이는 저장소 최초의 개념 증명(PoC) 데모이며, 이후 대량 생성된 239건 전부가 두 축 중 최소 하나에서 결함을 보인다.
- 문서 그룹별 건수: `1-getting-started` 25건, `2-guides` 77건, `3-api-reference` 133건, `5-architecture` 6건 (합 241)

## 2. 핵심 구조적 결함 — 개별 버그가 아니라 대량 생성 패턴의 문제

12개 배치를 병렬로 검증하는 과정에서, 서로 다른 배치가 **독립적으로 동일한 패턴을 반복 보고**했다. 이는 우연한 개별 실수가 아니라 데모를 대량 생성한 파이프라인/템플릿 자체의 구조적 결함임을 시사한다.

### 2-1. `ExpectedActualPanel`의 `isMatched`가 사실상 전수 하드코딩됨 (241건 중 240건)

거의 모든 `VerificationFooter.tsx`가 `isMatched={true}`를 리터럴로 박아 놓았다. 코드가 어떻게 동작하든, 사용자가 무엇을 클릭하든 3단 검증 패널은 항상 "일치"만 표시한다. 유일한 예외는 `server-actions/basic`(`isMatched={items.length > 0}`처럼 실제 상태값으로 계산)이다.

이 중 **약 155건**은 Expected/Actual 문구 자체가 제목 문자열만 삽입한 완전 동일 템플릿이다(`expected="• {제목} 사양에 따른 정상 동작 및 상태 변화 관찰"` / `actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"`). 나머지는 문구는 데모별로 구체적이지만 `isMatched`는 여전히 고정값이다.

`git status`로 확인한 결과, 일부 데모(`layouts-and-pages/nested-layouts` 등, 배치 01에서 발견)는 **커밋된 원본에 실제 `usePathname()` 기반 동적 검증 로직이 있었으나, 미커밋 상태에서 이 범용 템플릿으로 회귀(regression)**된 흔적이 `git diff`로 확인됐다. AGENTS.md 규칙 15는 이 패널을 "기준 버전이 올라갈 때 회귀를 잡는 장치"로 규정하지만, 현재 구현으로는 회귀가 발생해도 감지할 수 없다 — 코드가 완전히 깨져도 패널은 항상 초록색이다.

### 2-2. 다수 데모가 제목이 지칭하는 실제 Next.js 파일 컨벤션/API를 코드에 전혀 갖고 있지 않다

`functions/*`, `directives/*`, `components/*`, `config/*`, `file-conventions/*` 상당수를 대상으로 제목이 지칭하는 API·특수 파일이 실제로 존재/호출되는지 확인한 결과:

- **`file-conventions/route/*`, `route-groups/*`, `dynamic-segments/*`, `parallel-routes/conditional-slot`, `independent-tabs`, `intercepting-routes/direct-vs-modal`, `mdx-components/*`, `instrumentation/*`, `proxy/gateway-router`, `forbidden/*`, `unauthorized/*`, `metadata-app-icons/*`, `metadata-manifest/*`, `metadata-og/*`** (배치 07, 20건 전부): `route.ts`, `[id]`/`[...slug]`/`[[...slug]]`, `@slot`, `(..)인터셉트`, `mdx-components.tsx`, `instrumentation.ts`, `proxy.ts`, `forbidden.tsx`, `unauthorized.tsx`, `icon.tsx`, `manifest.ts`, `opengraph-image.tsx` 등 문서가 다루는 실제 특수 파일이 **디렉토리 어디에도 존재하지 않는다.** 대신 `useState` 기반 목업 UI로 대체돼 있다.
- **`file-conventions/{layout,loading,error,not-found,template,default}/*`** (배치 06 다수): 실제 중첩 `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `default.tsx` 파일 없이 `useState` 토글로 흉내만 낸다.
- **`functions/*`** (배치 08~10 다수): `draftMode()`, `after()`, `redirect()`, `NextResponse.json/rewrite()`, `ImageResponse`, `generateMetadata`, `generateStaticParams`, `connection()`, `experimental_taintUniqueValue`, `useRouter()`, `usePathname()`, `useParams()`, `cacheTag()`, `revalidatePath()`, `revalidateTag()`, `unstable_cache()`, `headers().get()` 등 제목이 명시한 API를 `grep`으로 확인했을 때 해당 컴포넌트에 **import/호출 자체가 없는 경우가 다수**다.
- **`components/*`** (배치 08): `next/image`의 `<Image placeholder="blur">`/`priority`, `<Link scroll/prefetch>`, `next/font`(Google/local), `<Script strategy/onLoad>` 등 실제 컴포넌트 렌더링 없이 `<div>` 텍스트/클래스 토글로 대체된 경우가 다수.
- **`config/*`** (배치 11~12): `basePath`, `redirects`, `rewrites`, `headers`, `trailingSlash`, `images`, `logging`, `devIndicators`, `env`, `crossOrigin`, `poweredByHeader`, `output`, `cacheComponents`, `cacheLife`, `cacheHandlers`, `expireTime`, `staleTimes` 등 대부분이 `demo-baseline`/`demo-cache-components`의 실제 `next.config.ts`에 반영돼 있지 않다. 예외로 `assetPrefix`와 `images.remotePatterns`(배치 11)만 실제 `next.config.ts`에 반영돼 있다.
- **`guides/*`** (배치 03~06 다수): `useActionState`, `useFormStatus`, `useSWR`/`mutate()`, `useInfiniteQuery`(TanStack Query), `next/dynamic`, `draftMode()`, `redirect()`, `.mdx` 파일(저장소 전체에 `.mdx` 파일이 0건), `middleware.ts`/`proxy.ts`(app 전체에 없음), `.scss` 파일(0건), CSS-in-JS 라이브러리, `view-transition-name`/`startViewTransition()` 등 문서가 요구하는 실제 API/파일이 코드에 없다.

이는 AGENTS.md 규칙 24("가짜 시뮬레이션을 엄격히 금지하고, 실제 Next.js 파일 시스템 규칙과 라우터를 사용한다")를 광범위하게 위반한다.

### 2-3. 84개 이상의 데모가 완전히 동일한 제네릭 "상품선택+수량+로그" 위젯을 복붙해서 쓴다

주제와 무관하게 '상품 버튼 2개 + 수량 증감 + "동작 실행" 버튼 + 하단 로그 박스' 구조의 컴포넌트가 서로 다른 배치에서 반복적으로 바이트 단위로 동일하게 발견됐다(예: `file-conventions/route/rest-api-orders`와 `webhook-signature`가 100% 동일 코드, `components/image/priority-lcp-preload`와 `components/font/google-variable-tokens`가 동일 위젯 재사용 등). 클릭할 때마다 로그 문자열만 추가될 뿐 해당 데모가 주장하는 Next.js 개념과 무관하다.

### 2-4. 더 나은 구현이 이미 파일로 존재하는데 `page.tsx`가 이를 사용하지 않는 경우(dead code)

배치 11에서 확인: `directives/use-client/window-storage-access`는 실제 `localStorage`를 쓰는 `StorageClientDemo.tsx`가 파일로 존재하지만 `page.tsx`는 이를 import하지 않고 더미 배열만 쓰는 `DirectiveUseClientStorageDemo.tsx`를 렌더링한다. `directives/use-server/file-level-action`도 실제 쿠폰 할인 계산 로직이 있는 `DirectiveUseServerDemo.tsx`가 dead code로 남아 있고, 정적 문자열만 표시하는 `DirectiveUseServerFileDemo.tsx`가 대신 렌더링된다. `directives/use-server/inline-action-closure`도 즉시구매 클로저 로직(`InlineActionClosureDemo.tsx`)이 죽은 코드다.

### 2-5. `demos.yaml`의 `doc` 필드 자체가 잘못 연결된 사례

배치 12에서 확인: `architecture/compiler-optimization/react-compiler`, `architecture/server-action-security/csrf-protection`, `architecture/turbopack/incremental-harness` 3건 모두 `5-architecture/fast-refresh.md`(Fast Refresh/파일 export 규칙 문서)를 가리키고 있으나, 각 데모의 실제 주제(React Compiler 메모이제이션, Server Action CSRF, Turbopack 증분 빌드)와 전혀 무관하다.

### 2-6. 연결된 학습 문서 자체가 스텁 상태인 경우

배치 12에서 확인: `config/*` 계열(`images.md`, `logging.md`, `devIndicators.md`, `env.md`, `crossOrigin.md`, `output.md`, `poweredByHeader.md`, `cacheComponents.md`, `cacheLife.md`, `cacheHandlers.md`, `expireTime.md`, `staleTimes.md`) 다수가 "추후 정의합니다"/"검토 예정" 수준의 스텁이다. 루트 `AGENTS.md`의 "Phase 1 문서화 194건 전부 완료" 주장과 배치되므로 별도 확인이 필요하다.

### 2-7. 4단 `DemoDeepDiveCard` 내용이 다른 데모와 복붙된 사례

배치 02, 08에서 확인: `route-handlers/streaming-sse`, `proxy/rewrite-and-headers`의 4단 개념 정리가 `route-handlers/rest-api-crud`(headers/GeoIP 주제)와 동일한 텍스트를 그대로 복붙했다. `file-conventions/route-segment-config/{dynamic-params-toggle, instant-prefetch, max-duration-timeout, runtime-nodejs-edge}` 4건도 서로 동일한 "next.config.ts의 images/S3/CDN" 내용을 복붙해, 각 데모의 실제 주제(dynamicParams, instant, maxDuration, runtime)와 무관하다.

---

## 3. 데모별 상세 (241건 전체)

배치(01~12)는 `demos.yaml` 등록 순서를 그대로 20개 안팎으로 나눈 것이며, 아래 표의 `#`는 `demos.yaml` 내 순번이다.

### 1-getting-started (25건 — 배치 01 전체 + 배치 02 앞부분)

| # | url | zone | doc | 주제일치 | 기대/실측일치 | 비고 |
|---|---|---|---|---|---|---|
| 1 | server-actions/basic | baseline | 2-guides/server-actions.md | PASS | PASS | 실제 `items.length`·최신 항목 텍스트를 반영, `isMatched={items.length>0}` 동적 계산. 저장소 유일의 완전 정상 데모 |
| 2 | caching/basic | cache | 1-getting-started/caching.md | PASS | PARTIAL | 실제 `cacheId`/`timestamp` 런타임 값 표시하나 `isMatched={true}` 하드코딩, 새로고침 전후 비교는 사용자 육안 판단에 의존 |
| 3 | layouts-and-pages/nested-layouts | baseline | 1-getting-started/layouts-and-pages.md | PASS | FAIL | 실제 GNB/Sidebar/shoes·clothing·electronics 서브라우트 정상 구현. `VerificationFooter.tsx`가 미커밋 상태에서 실제 `usePathname()` 검증 로직 → 범용 템플릿(`isMatched={true}`)으로 회귀(git diff 확인) |
| 4 | layouts-and-pages/template-lifecycle | baseline | 1-getting-started/layouts-and-pages.md | PASS | FAIL | 실제 `template.tsx`+서브라우트 존재, 동일 회귀 패턴 |
| 5 | layouts-and-pages/route-groups-layouts | baseline | 1-getting-started/layouts-and-pages.md | PASS | FAIL | 실제 `(shop)`/`(auth)` Route Groups 구현, 동일 회귀 패턴 |
| 6 | linking-and-navigating/soft-navigation | baseline | 1-getting-started/linking-and-navigating.md | PASS | FAIL | 실제 서브라우트 존재, 범용 VerificationFooter |
| 7 | linking-and-navigating/router-prefetch | baseline | 1-getting-started/linking-and-navigating.md | PASS | FAIL | 실제 PrefetchController 존재, 범용 VerificationFooter |
| 8 | server-client-components/composition | baseline | 1-getting-started/server-and-client-components.md | PASS | FAIL | RSC/RCC 합성 정상, 범용 VerificationFooter |
| 9 | server-client-components/serialization | baseline | 1-getting-started/server-and-client-components.md | PASS | FAIL | 직렬화 데이터 트리+Server Action 정상, 범용 VerificationFooter |
| 10 | fetching-data/parallel-fetching | baseline | 1-getting-started/fetching-data.md | PASS | FAIL | Waterfall vs Promise.all 대조 정상, 범용 VerificationFooter |
| 11 | fetching-data/use-promise-streaming | baseline | 1-getting-started/fetching-data.md | PASS | FAIL | React19 `use(Promise)`+Suspense 정상 구현, 범용 VerificationFooter |
| 12 | mutating-data/server-action-revalidate | baseline | 1-getting-started/mutating-data.md | PASS | FAIL | `revalidatePath` 정상 적용, 범용 VerificationFooter |
| 13 | mutating-data/optimistic-cart | baseline | 1-getting-started/mutating-data.md | PASS | FAIL | `useOptimistic` 정상, 범용 VerificationFooter |
| 14 | revalidating/time-based-isr | cache | 1-getting-started/revalidating.md | PASS | FAIL | `cacheLife({stale,revalidate,expire})` 실제 적용, 범용 VerificationFooter |
| 15 | revalidating/tag-vs-path | cache | 1-getting-started/revalidating.md | PASS | FAIL | 3개 독립 `cacheTag` 블록 정상 구현, 범용 VerificationFooter |
| 16 | error-handling/segment-error | baseline | 1-getting-started/error-handling.md | PASS | FAIL | 실제 `payment/error.tsx` 세그먼트 에러 바운더리 존재, 범용 VerificationFooter |
| 17 | error-handling/global-error | baseline | 1-getting-started/error-handling.md | PARTIAL | FAIL | 제목은 "예상된 에러 vs 예외 vs global-error 3계층"인데 실제 구현은 `useActionState` 기반 1계층뿐. 세그먼트 예외·global-error는 정적 카드 텍스트뿐이고 실제 `error.tsx`/`global-error.tsx`가 이 디렉토리에 없음(규칙24 위반 소지) |
| 18 | css/tailwind-v4 | baseline | 1-getting-started/css.md | PASS | FAIL | ThemeInspector 정상, 범용 VerificationFooter |
| 19 | css/css-modules | baseline | 1-getting-started/css.md | PASS | FAIL | CardA/CardB 스코프 격리 정상 실증, 범용 VerificationFooter |
| 20 | images/image-optimization | baseline | 1-getting-started/images.md | PASS | FAIL | WebP/CLS 비교 정상, 범용 VerificationFooter |
| 21 | fonts/font-optimization | baseline | 1-getting-started/fonts.md | PASS | FAIL | 셀프호스팅/CLS 비교 정상, 범용 VerificationFooter |
| 22 | metadata-and-og-images/static-and-dynamic-metadata | baseline | 1-getting-started/metadata-and-og-images.md | PASS | FAIL | `generateMetadata` 실사용 정확, 범용 VerificationFooter |
| 23 | metadata-and-og-images/opengraph-image | baseline | 1-getting-started/metadata-and-og-images.md | PASS | FAIL | `opengraph-image.tsx`가 실제 `ImageResponse` 사용, 범용 VerificationFooter |
| 24 | route-handlers/rest-api-crud | baseline | 1-getting-started/route-handlers.md | PARTIAL | FAIL | `route.ts` GET/POST/PATCH/DELETE 실제 구현 정확. 단 4단 DeepDive 내용이 "headers()/User-Agent/GeoIP" 주제로 REST CRUD와 무관 |
| 25 | route-handlers/streaming-sse | baseline | 1-getting-started/route-handlers.md | FAIL | FAIL | `ReadableStream` 구현 자체는 정확하나, 4단 DeepDive 전체가 rest-api-crud와 완전 동일한 headers/GeoIP 텍스트 복붙 |

### 2-guides (77건 — 배치 02 후반부 ~ 배치 06 초반)

| # | url | zone | doc | 주제일치 | 기대/실측일치 | 비고 |
|---|---|---|---|---|---|---|
| 26 | proxy/rewrite-and-headers | baseline | 1-getting-started/proxy.md | PARTIAL | FAIL | ProxySimulatorClient는 제목과 부합하나 4단 DeepDive가 rest-api-crud와 동일한 headers/GeoIP 복붙 |
| 27 | guides/streaming-nested | baseline | 2-guides/streaming.md | PASS | FAIL | 실제 `<Suspense>` 2중 경계+async 서버 컴포넌트 정확 구현. 미사용 orphan 파일에 가짜 시뮬레이션 존재하나 화면엔 미반영 |
| 28 | guides/server-actions-advanced | baseline | 2-guides/server-actions.md | PASS | FAIL | `useActionState`/쿠폰 검증 로직 정확, 범용 VerificationFooter |
| 29 | guides/swr-polling | baseline | 2-guides/2.15-client-side-data-fetching/swr.md | FAIL | FAIL | 제목이 "SWR mutate() 갱신"을 명시하나 `swr` 패키지/`useSWR`/`mutate` 전혀 미사용, `useState`+`setInterval`로 흉내(규칙24 위반). 4단도 복붙 텍스트 |
| 30 | guides/lazy-loading-chart | baseline | 2-guides/lazy-loading.md | PARTIAL | FAIL | `next/dynamic(ssr:false)` 실사용 정확하나 4단이 완전 범용 템플릿 |
| 31 | guides/auth-session | baseline | 2-guides/authentication.md | PARTIAL | FAIL | `getSession` 기반 RBAC 정확하나 4단이 범용 템플릿 |
| 32 | file-conventions/parallel-routes | baseline | 3-api-reference/3.1-file-conventions/parallel-routes.md | PARTIAL | FAIL | `@analytics`/`@team` 실제 병렬 슬롯 사용(규칙24 준수) 정확하나 4단이 범용 템플릿 |
| 33 | file-conventions/intercepting-routes | baseline | 3-api-reference/3.1-file-conventions/intercepting-routes.md | PARTIAL | FAIL | 모달 인터셉트 구성은 정확하나 4단이 범용 템플릿 |
| 34 | components/form-component | baseline | 3-api-reference/3.2-components/form.md | PARTIAL | FAIL | `<Form>` 기반 검색 구성 정확하나 4단이 범용 템플릿 |
| 35 | architecture/fast-refresh-boundary | baseline | 5-architecture/fast-refresh.md | PARTIAL | FAIL | StatePreservingCounter가 도메인 무관 범용 카운터. HMR 상태보존이라는 주제 자체가 설명 의존적인데 4단도 범용 템플릿이라 보완 안 됨(이커머스 전환 후보) |
| 36 | guides/rendering-philosophy/server-vs-client | baseline | 2-guides/rendering-philosophy.md | FAIL | FAIL | 1단 DemoGuideCard의 concept/steps까지 완전 범용 템플릿("쇼핑몰 시나리오 초기화/핵심 인터랙션 수행/성능 및 동작 검증") — 서버 vs 클라이언트 렌더링 고유 설명 전무 |
| 37 | guides/server-and-client-boundary/children-slot | baseline | 2-guides/server-and-client-boundary.md | FAIL | FAIL | 1단 문구가 위 항목과 100% 동일 범용 템플릿, children 슬롯 고유 설명 없음 |
| 38 | guides/how-revalidation-works/swr-flow | cache | 2-guides/how-revalidation-works.md | FAIL | FAIL | 1단 범용 템플릿 + 4단이 다른 데모와 동일한 "TTFB 0ms/Suspense 청크" 복붙, SWR flow 고유 설명 전무 |
| 39 | guides/caching-legacy/fetch-cache | baseline | 2-guides/caching-without-cache-components.md | FAIL | FAIL | 1단 범용 템플릿, 레거시 fetch cache 옵션 고유 설명 없음 |
| 40 | guides/streaming/chunk-loading | baseline | 2-guides/streaming.md | FAIL | FAIL | 1단 범용 템플릿, 청크 스트리밍 고유 설명 없음 |
| 41 | guides/isr/time-isr-60s | baseline | 2-guides/incremental-static-regeneration.md | FAIL | FAIL | 1단 범용 템플릿 + `secondsLeft=60` state가 갱신되지 않는 정적 UI, `export const revalidate` 등 실제 ISR 설정이 코드에 전혀 없음(규칙24 위반) |
| 42 | guides/isr-cache-components/cache-life-hours | cache | 2-guides/incremental-static-regeneration-cache-components.md | PARTIAL | FAIL | stale/revalidate/expire 값이 하드코딩 정적 텍스트, 실제 `cacheLife('hours')`/`'use cache'` 미사용 |
| 43 | guides/migrating-cache-components/unstable-to-use-cache | cache | 2-guides/migrating-to-cache-components.md | PASS | FAIL | 레거시 vs 모던 코드 스니펫 탭 대조는 합리적, 3단은 템플릿 |
| 44 | guides/adopting-partial-prefetching/hover-shell | baseline | 2-guides/adopting-partial-prefetching.md | PARTIAL | FAIL | 호버 시 `prefetched` 상태만 토글, 실제 정적 셸/동적 콘텐츠 분리(PPR) 미구현 |
| 45 | guides/auth-cache-components/static-layout-session-context | cache | 2-guides/authentication-with-cache-components.md | PARTIAL | FAIL | 두 블록 정적 병렬 표시만, 실제 `'use cache'`+`use(UserContext)` 결합 없음 |
| 46 | guides/forms/use-action-state-errors | baseline | 2-guides/forms.md | FAIL | FAIL | `useActionState` import/사용 전무, `useState`+`preventDefault`로 로컬 검증만(규칙24 위반) |
| 47 | guides/forms/use-form-status-spinner | baseline | 2-guides/forms.md | FAIL | FAIL | `useFormStatus` 미사용, `useState`+`setTimeout`로 pending 흉내(규칙24 위반) |
| 48 | guides/server-actions/start-transition | baseline | 2-guides/server-actions.md | PARTIAL | FAIL | `useTransition`은 사용하나 내부가 `new Promise(setTimeout)`뿐, 실제 Server Action 호출 없음 |
| 49 | guides/swr/mutation-optimistic | baseline | 2-guides/2.15-client-side-data-fetching/swr.md | FAIL | FAIL | `swr` import 전무, `mutate()` 미호출. 순수 `useState` 카운터(규칙24 위반) |
| 50 | guides/tanstack-query/infinite-scroll | baseline | 2-guides/2.15-client-side-data-fetching/tanstack-query.md | FAIL | FAIL | `@tanstack/react-query` import 전무, `useInfiniteQuery` 미사용(규칙24 위반) |
| 51 | guides/redirecting/order-complete | baseline | 2-guides/redirecting.md | FAIL | FAIL | `redirect()` 미호출, 텍스트로 "발동!"만 표시 |
| 52 | guides/draft-mode/preview-toggle | baseline | 2-guides/draft-mode.md | FAIL | FAIL | `draftMode()`/Bypass 쿠키 미사용, 순수 `useState` 토글 |
| 53 | guides/prefetching/viewport-vs-hover | baseline | 2-guides/prefetching.md | PARTIAL | FAIL | 실제 `<Link prefetch={false}>`가 아닌 `<div onMouseEnter>` 텍스트 로그로 흉내 |
| 54 | file-conventions/layout/root-and-nested | baseline | 3-api-reference/3.1-file-conventions/layout.md | FAIL | FAIL | 실제 중첩 `layout.tsx`/서브라우트 없음. `useState` 탭 전환으로 레이아웃 흉내(규칙24 명시적 위반) |
| 55 | file-conventions/loading/skeleton-boundary | baseline | 3-api-reference/3.1-file-conventions/loading.md | FAIL | FAIL | 실제 `loading.tsx`/Suspense 없음, `setTimeout` 흉내(규칙24 위반) |
| 56 | file-conventions/not-found/missing-product-404 | baseline | 3-api-reference/3.1-file-conventions/not-found.md | FAIL | FAIL | 실제 `not-found.tsx`/`notFound()` 없음, 조건부 렌더로 텍스트만(규칙24 위반) |
| 57 | components/image/responsive-sizes | baseline | 3-api-reference/3.2-components/image.md | FAIL | FAIL | 실제 `next/image` 미사용, `_next/image?url=...` 문자열만 표시 |
| 58 | guides/rendering-philosophy/hydration-boundary | baseline | 2-guides/rendering-philosophy.md | PARTIAL | FAIL | 버튼 클릭으로 `mounted` 상태 수동 토글, 실제 하이드레이션 타이밍과 무관 |
| 59 | guides/server-and-client-boundary/props-serialization | baseline | 2-guides/server-and-client-boundary.md | FAIL | FAIL | 컴포넌트 전체가 `'use client'`, 서버→클라이언트 직렬화 경계 시연 없음 |
| 60 | guides/how-revalidation-works/ondemand-sync | cache | 2-guides/how-revalidation-works.md | FAIL | FAIL | `revalidateTag()` 미호출, 로컬 텍스트만 변경(규칙24 위반) |
| 61 | guides/caching-legacy/segment-revalidate | baseline | 2-guides/caching-without-cache-components.md | PARTIAL | FAIL | 실제 `export const revalidate = N` 설정이나 서버 재검증 호출 없음, 전부 클라이언트 로그 |
| 62 | guides/isr/revalidate-path-sync | baseline | 2-guides/incremental-static-regeneration.md | PARTIAL | FAIL | `setLog`로 문구만 표시, 실제 Server Action/캐시 무효화 없음 |
| 63 | guides/isr-cache-components/precision-tag-purge | cache | 2-guides/incremental-static-regeneration-cache-components.md | PARTIAL | FAIL | `cacheTag`/`revalidateTag` 실호출 없이 문구만 교체 |
| 64 | guides/migrating-cache-components/cache-key-compare | cache | 2-guides/migrating-to-cache-components.md | PARTIAL | FAIL | 정적 텍스트 대조표뿐, 실제 `use cache` 키 생성 실행 없음(이커머스 전환 후보) |
| 65 | guides/auth-cache-components/private-cache-user | cache | 2-guides/authentication-with-cache-components.md | PARTIAL | FAIL | 하드코딩 캐시 텍스트만 변경, 실제 `use cache: private` 미사용 |
| 66 | guides/tanstack-query/ssr-hydration | baseline | 2-guides/2.15-client-side-data-fetching/tanstack-query.md | FAIL | FAIL | `@tanstack/react-query` import 전무(이커머스 전환 후보) |
| 67 | guides/redirecting/session-expired | baseline | 2-guides/redirecting.md | PARTIAL | FAIL | `redirect()` 실호출 없이 문구만 교체 |
| 68 | guides/draft-mode/bypass-cookie | baseline | 2-guides/draft-mode.md | PARTIAL | FAIL | `draftMode()` API 실호출 없이 `useState` 토글 |
| 69 | guides/prefetching/custom-prefetch-false | baseline | 2-guides/prefetching.md | FAIL | FAIL | `prefetch={false}` `<Link>` 자체가 없음, 복붙 위젯 |
| 70 | guides/optimizing-prefetching/bandwidth-saver | baseline | 2-guides/optimizing-prefetching.md | PARTIAL | FAIL | 정적 통계 수치만 하드코딩, 실측 네트워크 요청 없음 |
| 71 | guides/instant-navigation/loading-skeleton | baseline | 2-guides/instant-navigation.md | PARTIAL | FAIL | 실제 라우트 이동/`loading.tsx` 트리거 없이 라벨만 전환 |
| 72 | guides/instant-navigation/router-cache-back | baseline | 2-guides/instant-navigation.md | FAIL | FAIL | 뒤로가기/라우터 캐시와 무관한 장바구니 수량 위젯 복붙 |
| 73 | guides/lazy-loading/modal-dynamic | baseline | 2-guides/lazy-loading.md | FAIL | FAIL | `next/dynamic` import가 디렉토리 전체에 없음(grep 0건), 제목과 정면 모순 |
| 74 | guides/preserving-ui-state/drawer-open | baseline | 2-guides/preserving-ui-state.md | PARTIAL | FAIL | 단일 `useState` 토글, "다른 탭 이동해도 유지" 주장 검증 불가 |
| 75 | guides/preserving-ui-state/scroll-retention | baseline | 2-guides/preserving-ui-state.md | PARTIAL | FAIL | 실제 `useSearchParams`/스크롤 위치 측정 없이 필터 버튼 상태만 |
| 76 | guides/preventing-flash/darkmode-script | baseline | 2-guides/preventing-flash-before-hydration.md | FAIL | FAIL | SSR 인라인 스크립트가 실제 layout에 없고 클라이언트 컴포넌트가 코드를 문자열로만 보여줌 |
| 77 | guides/view-transitions/zoom-card | baseline | 2-guides/view-transitions.md | FAIL | FAIL | `view-transition-name`/`startViewTransition()` 실사용 없음, 텍스트 라벨만 |
| 78 | guides/css-in-js/style-registry | baseline | 2-guides/css-in-js.md | FAIL | FAIL | CSS-in-JS 라이브러리/`useServerInsertedHTML` 실사용 없음 |
| 79 | guides/sass/promotions-theme | baseline | 2-guides/sass.md | FAIL | FAIL | `.scss` 파일 자체가 저장소에 0건 |
| 80 | guides/authentication/middleware-guard | baseline | 2-guides/authentication.md | FAIL | FAIL | 앱 전체에 `middleware.ts`/`proxy.ts` 없음(find 0건), `useState` 텍스트 시뮬레이션 |
| 81 | guides/authentication/rsc-user-profile | baseline | 2-guides/authentication.md | FAIL | FAIL | 제목은 "Server Component"인데 실제는 `'use client'`, 서버 세션 조회 없음 |
| 82 | guides/data-security/server-only-guard | baseline | 2-guides/data-security.md | FAIL | FAIL | 다른 데모와 100% 동일 위젯 재사용, `server-only` import 없음 |
| 83 | guides/data-security/react-taint-api | baseline | 2-guides/data-security.md | FAIL | FAIL | `experimental_taintObjectReference` 호출 없음, 복붙 위젯 |
| 84 | guides/content-security-policy/nonce-injection | baseline | 2-guides/content-security-policy.md | FAIL | FAIL | Middleware nonce/CSP 헤더 관련 코드 없음, 복붙 위젯 |
| 85 | guides/environment-variables/public-vs-server | baseline | 2-guides/environment-variables.md | PARTIAL | FAIL | `NEXT_PUBLIC_API_URL` 등 하드코딩 문자열만, 실제 `process.env` 참조 없음 |
| 86 | guides/environment-variables/runtime-env | baseline | 2-guides/environment-variables.md | FAIL | FAIL | `process.env` 런타임 참조 전무, 복붙 위젯 |
| 87 | guides/json-ld/product-schema | baseline | 2-guides/json-ld.md | PARTIAL | FAIL | JSON-LD 객체를 `<pre>`로만 출력, 실제 `<head>`/`generateMetadata` 주입 없음 |
| 88 | guides/interactive-apps/multi-filter-widget | baseline | 2-guides/interactive-apps.md | PARTIAL | FAIL | 제목은 "필터/정렬/장바구니 복합"이나 실제는 필터 토글만, 정렬/장바구니 없음 |
| 89 | guides/scripts/strategy-order | baseline | 2-guides/scripts.md | PARTIAL | FAIL | `strategy` 3종을 정적 텍스트로만 나열, `<Script strategy=...>` 미사용 |
| 90 | guides/scripts/pg-sdk-onload | baseline | 2-guides/scripts.md | PARTIAL | FAIL | `sdkReady`가 `useState(true)`로 항상 true, 실제 `onLoad` 콜백 없음 |
| 91 | guides/mdx/product-tech-doc | baseline | 2-guides/mdx.md | FAIL | FAIL | 저장소 전체에 `.mdx` 파일 0건, 실제 MDX 렌더링 전혀 없음 |
| 92 | guides/mdx/custom-component-slot | baseline | 2-guides/mdx.md | FAIL | FAIL | `.mdx` 파일 부재, 일반 버튼 하나뿐 |
| 93 | guides/third-party-libraries/google-analytics | baseline | 2-guides/third-party-libraries.md | FAIL | FAIL | `@next/third-parties`의 `GoogleAnalytics` 사용 없음, 복붙 위젯 |
| 94 | guides/third-party-libraries/youtube-embed | baseline | 2-guides/third-party-libraries.md | PARTIAL | FAIL | `YouTubeEmbed` 실제 사용 없이 `div` 클릭 시뮬레이션 |
| 95 | guides/bff/order-aggregation | baseline | 2-guides/backend-for-frontend.md | PARTIAL | FAIL | `/api/bff/order` 호출한다고 표기하나 실제 `fetch`/route.ts 없음 |
| 96 | guides/bff/response-shaping | baseline | 2-guides/backend-for-frontend.md | PARTIAL | FAIL | 원본/정제 응답 정적 텍스트 비교뿐, 실제 응답 가공 코드 없음 |
| 97 | guides/pwas/app-install-prompt | baseline | 2-guides/progressive-web-apps.md | PARTIAL | FAIL | "manifest.json 정상 감지" 문구 항상 하드코딩, 실제 `beforeinstallprompt`/manifest 검증 없음 |
| 98 | guides/i18n/subpath-routing | baseline | 2-guides/internationalization.md | FAIL | FAIL | 실제 `[lang]` 동적 세그먼트 없음(find 0건), `useState` 버튼 토글로 가짜 라우팅 |
| 99 | guides/i18n/dictionary-translation | baseline | 2-guides/internationalization.md | FAIL | FAIL | 제목은 "서버 사이드"인데 실제는 `'use client'`+`useState`로 사전 갈아끼움, 정반대 구현 |
| 100 | guides/multi-tenant/subdomain-tenant | baseline | 2-guides/multi-tenant.md | FAIL | FAIL | `headers()`/`host` 검사 없이 버튼으로 테넌트 전환, 서브도메인 감지 로직 전무 |
| 101 | guides/multi-tenant/isolated-branding | baseline | 2-guides/multi-tenant.md | FAIL | FAIL | 복붙 위젯, 로고/컬러 동적 주입과 무관 |
| 102 | guides/multi-zones/cross-zone-routing | baseline | 2-guides/multi-zones.md | FAIL | FAIL | 복붙 위젯, Multi-zones rewrites/서브도메인 코드 전무 |
| 103 | guides/instrumentation/server-register-hook | baseline | 2-guides/instrumentation.md | FAIL | FAIL | 실제 `instrumentation.ts`/`register()` 파일 없음(find 확인), 복붙 위젯 |
| 104 | guides/opentelemetry/trace-span | baseline | 2-guides/open-telemetry.md | PARTIAL | FAIL | 하드코딩된 Trace ID/Span 텍스트만 정적 출력, 실제 계측 없음 |
| 105 | guides/static-exports/client-routing | baseline | 2-guides/static-exports.md | FAIL | FAIL | `next.config.ts`에 `output:'export'` 미설정, 복붙 위젯 |
| 106 | guides/static-exports/ssg-catalog | baseline | 2-guides/static-exports.md | FAIL | FAIL | client-routing과 컴포넌트 로직 구분 없음(실질 동일 코드) |
| 107 | guides/public-pages/terms-ssg | baseline | 2-guides/public-static-pages.md | FAIL | FAIL | 약관 콘텐츠 없이 복붙 위젯 |
| 108 | guides/analytics/custom-beacon | baseline | 2-guides/analytics.md | PARTIAL | FAIL | `navigator.sendBeacon()` 등 실호출 없이 `useState` 토글로 "204 No Content" 텍스트만 |
| 109 | guides/videos/lazy-video-player | baseline | 2-guides/videos.md | PARTIAL | FAIL | 실제 `<video>`/IntersectionObserver 없이 버튼 토글로 재생 상태만 흉내 |
| 110 | file-conventions/layout/state-preservation | baseline | 3-api-reference/3.1-file-conventions/layout.md | FAIL | FAIL | 실제 중첩 `layout.tsx`+서브라우트 없음(단일 `page.tsx`뿐) |
| 111 | file-conventions/layout/dynamic-category-layout | baseline | 3-api-reference/3.1-file-conventions/layout.md | FAIL | FAIL | `[category]/layout.tsx` 동적 세그먼트 파일 없음, 복붙 위젯 |
| 112 | file-conventions/page/static-and-dynamic | baseline | 3-api-reference/3.1-file-conventions/page.md | PARTIAL | FAIL | 정적/동적 뱃지 텍스트만 하드코딩, 렌더링 모드가 갈리는 실제 코드 없음 |
| 113 | file-conventions/page/react-19-use-params | baseline | 3-api-reference/3.1-file-conventions/page.md | FAIL | FAIL | 동적 세그먼트(`[id]`) 자체가 없어 `use(params)` 언래핑 불가. 4단이 되레 `useParams()`(별개 API) 설명 |

### 3-api-reference (133건 — 배치 06 후반 ~ 배치 12)

| # | url | zone | doc | 주제일치 | 기대/실측일치 | 비고 |
|---|---|---|---|---|---|---|
| 114 | file-conventions/loading/nested-segment-loading | baseline | 3-api-reference/3.1-file-conventions/loading.md | PARTIAL | FAIL | 실제 `loading.tsx`/Suspense 트리거 없이 정적 스켈레톤 pulse만 |
| 115 | file-conventions/error/payment-error-boundary | baseline | 3-api-reference/3.1-file-conventions/error.md | PARTIAL | FAIL | 실제 `error.tsx` 없음, `useState`로 에러 상태 흉내(throw 후 캡처 아님) |
| 116 | file-conventions/error/reset-recovery | baseline | 3-api-reference/3.1-file-conventions/error.md | PARTIAL | FAIL | 실제 `error.tsx`의 `reset()` prop 없이 버튼 클릭으로 상태만 토글 |
| 117 | file-conventions/not-found/programmatic-not-found | baseline | 3-api-reference/3.1-file-conventions/not-found.md | FAIL | FAIL | 실제 `notFound()`/`not-found.tsx` 없음, 복붙 위젯 |
| 118 | file-conventions/template/remount-lifecycle | baseline | 3-api-reference/3.1-file-conventions/template.md | PARTIAL | FAIL | 실제 `template.tsx` 없이 React `key` prop으로 리마운트만 흉내 |
| 119 | file-conventions/template/input-reset-animation | baseline | 3-api-reference/3.1-file-conventions/template.md | PARTIAL | FAIL | 단순 입력창 하나뿐, 실제 라우트 전환에 따른 리셋 동작 없음 |
| 120 | file-conventions/default/parallel-fallback | baseline | 3-api-reference/3.1-file-conventions/default.md | PARTIAL | FAIL | 탭 UI로 흉내, 실제 `@slot`+`default.tsx` 대신 `useState`(규칙24 위반) |
| 121 | file-conventions/default/hard-reload-restore | baseline | 3-api-reference/3.1-file-conventions/default.md | FAIL | FAIL | 실제 하드 리로드 동작 없음, 복붙 위젯 |
| 122 | file-conventions/route/rest-api-orders | baseline | 3-api-reference/3.1-file-conventions/route.md | FAIL | FAIL | `route.ts` 파일 자체가 없음(전역 검색), 복붙 위젯 |
| 123 | file-conventions/route/webhook-signature | baseline | 3-api-reference/3.1-file-conventions/route.md | FAIL | FAIL | rest-api-orders와 100% 동일 코드, 서명 검증 로직 전무 |
| 124 | file-conventions/route/sse-stock-stream | baseline | 3-api-reference/3.1-file-conventions/route.md | FAIL | FAIL | 실제 SSE(EventSource/ReadableStream) 없음, 버튼 클릭 목업뿐 |
| 125 | file-conventions/route-groups/group-url-isolation | baseline | 3-api-reference/3.1-file-conventions/route-groups.md | FAIL | FAIL | `(group)` 폴더 없음, 동일 목업 템플릿 |
| 126 | file-conventions/route-groups/shop-vs-admin-roots | baseline | 3-api-reference/3.1-file-conventions/route-groups.md | FAIL | FAIL | `(shop)`/`(admin)` layout 실존 안 함, 정적 텍스트로만 |
| 127 | file-conventions/dynamic-segments/single-param | baseline | 3-api-reference/3.1-file-conventions/dynamic-routes.md | FAIL | FAIL | `[id]` 폴더 전역 검색 0건, 목업 템플릿 |
| 128 | file-conventions/dynamic-segments/catch-all-slug | baseline | 3-api-reference/3.1-file-conventions/dynamic-routes.md | FAIL | FAIL | `[...slug]` 폴더 0건, 목업 템플릿 |
| 129 | file-conventions/dynamic-segments/optional-catch-all | baseline | 3-api-reference/3.1-file-conventions/dynamic-routes.md | FAIL | FAIL | `[[...slug]]` 폴더 0건, 목업 템플릿 |
| 130 | file-conventions/parallel-routes/conditional-slot | baseline | 3-api-reference/3.1-file-conventions/parallel-routes.md | FAIL | FAIL | 실제 슬롯 없음, 버튼으로 텍스트만 전환 |
| 131 | file-conventions/parallel-routes/independent-tabs | baseline | 3-api-reference/3.1-file-conventions/parallel-routes.md | FAIL | FAIL | `@specs`/`@reviews` 슬롯 없음, 정적 카드 2개뿐 |
| 132 | file-conventions/intercepting-routes/direct-vs-modal | baseline | 3-api-reference/3.1-file-conventions/intercepting-routes.md | FAIL | FAIL | `(..)products/[id]` 인터셉트 폴더 없음, 정적 설명 카드뿐 |
| 133 | file-conventions/mdx-components/global-mdx-theme | baseline | 3-api-reference/3.1-file-conventions/mdx-components.md | FAIL | FAIL | `mdx-components.tsx` 프로젝트 전체 0건 |
| 134 | file-conventions/instrumentation/server-boot-log | baseline | 3-api-reference/3.1-file-conventions/instrumentation.md | FAIL | FAIL | `instrumentation.ts` 0건 |
| 135 | file-conventions/instrumentation/client-timing-metrics | baseline | 3-api-reference/3.1-file-conventions/instrumentation-client.md | FAIL | FAIL | `instrumentation-client.ts` 0건 |
| 136 | file-conventions/proxy/gateway-router | baseline | 3-api-reference/3.1-file-conventions/proxy.md | FAIL | FAIL | `proxy.ts` 0건 |
| 137 | file-conventions/forbidden/admin-role-403 | baseline | 3-api-reference/3.1-file-conventions/forbidden.md | FAIL | FAIL | `forbidden.tsx` 0건 |
| 138 | file-conventions/unauthorized/anonymous-401 | baseline | 3-api-reference/3.1-file-conventions/unauthorized.md | FAIL | FAIL | `unauthorized.tsx` 0건 |
| 139 | file-conventions/metadata-app-icons/dynamic-favicon | baseline | 3-api-reference/.../app-icons.md | FAIL | FAIL | `icon.tsx` 없음, 목업 템플릿 |
| 140 | file-conventions/metadata-manifest/dynamic-pwa-manifest | baseline | 3-api-reference/.../manifest.md | FAIL | FAIL | `manifest.ts` 없음, 목업 템플릿 |
| 141 | file-conventions/metadata-og/discount-banner-og | baseline | 3-api-reference/.../opengraph-image.md | FAIL | FAIL | `opengraph-image.tsx`(ImageResponse) 없음, 목업 템플릿 |
| 142 | file-conventions/metadata-robots/dynamic-crawler-rules | baseline | 3-api-reference/.../robots.md | PARTIAL | FAIL | 실제 `robots.ts` 없음(page.tsx만), 상품클릭 UI로 무관하게 대체 |
| 143 | file-conventions/metadata-sitemap/split-index-sitemaps | baseline | 3-api-reference/.../sitemap.md | PARTIAL | FAIL | `generateSitemaps()` 실구현 없음, 정적 텍스트 2줄만 |
| 144 | file-conventions/route-segment-config/dynamic-params-toggle | baseline | 3-api-reference/.../dynamicParams.md | FAIL | FAIL | 4단이 다른 3개 데모와 동일한 "next.config.ts images/S3/CDN" 복붙, 주제와 무관 |
| 145 | file-conventions/route-segment-config/instant-prefetch | baseline | 3-api-reference/.../instant.md | FAIL | FAIL | 4단이 위 항목과 완전 동일 복붙 |
| 146 | file-conventions/route-segment-config/max-duration-timeout | baseline | 3-api-reference/.../maxDuration.md | FAIL | FAIL | `export const maxDuration` 실제 부재, 4단도 동일 복붙 |
| 147 | file-conventions/route-segment-config/runtime-nodejs-edge | baseline | 3-api-reference/.../runtime.md | PARTIAL | FAIL | 실제 `export const runtime` 코드 없음, 4단도 동일 복붙(4건째) |
| 148 | components/image/blur-placeholder | baseline | 3-api-reference/3.2-components/image.md | FAIL | FAIL | `<Image placeholder="blur">` 미사용, 단순 `<div>` 블러 클래스 토글(규칙24 위반) |
| 149 | components/image/priority-lcp-preload | baseline | 3-api-reference/3.2-components/image.md | FAIL | FAIL | `<Image priority>` 미사용, 다른 데모와 동일한 복붙 컴포넌트 |
| 150 | components/link/soft-navigation-scroll | baseline | 3-api-reference/3.2-components/link.md | FAIL | FAIL | 실제 `<Link scroll={...}>` 렌더링 없음, `useState`로 텍스트만(규칙24 위반) |
| 151 | components/link/prefetch-options | baseline | 3-api-reference/3.2-components/link.md | FAIL | FAIL | 실제 `<Link prefetch>` 3종 렌더링 없음, 정적 설명 3박스만 |
| 152 | components/font/google-variable-tokens | baseline | 3-api-reference/3.2-components/font.md | FAIL | FAIL | `next/font` import 전무, 복붙 컴포넌트 |
| 153 | components/font/local-font-face | baseline | 3-api-reference/3.2-components/font.md | FAIL | FAIL | `next/font/local` import 전무, 복붙 컴포넌트 |
| 154 | components/script/loading-strategies | baseline | 3-api-reference/3.2-components/script.md | PARTIAL | FAIL | `<Script strategy=...>` 실사용 미확인 |
| 155 | components/script/pg-sdk-onload | baseline | 3-api-reference/3.2-components/script.md | FAIL | FAIL | 버튼 클릭 시 상태 문자열만, 실제 `<Script onLoad>` 없음 |
| 156 | functions/use-router/push-replace | baseline | 3-api-reference/3.3-functions/use-router.md | PARTIAL | FAIL | 실제 `useRouter()` import 없음(grep 무결과), `useState` 히스토리 스택으로 흉내(규칙24 위반) |
| 157 | functions/use-router/refresh-server-sync | baseline | 3-api-reference/3.3-functions/use-router.md | FAIL | FAIL | 실제 `router.refresh()` 호출 없이 `setTimeout`으로 카운터만 증가 |
| 158 | functions/use-pathname/active-link | baseline | 3-api-reference/3.3-functions/use-pathname.md | PARTIAL | FAIL | 실제 `usePathname()` 미사용(`useState`로 흉내), 4단 설명은 구체적 |
| 159 | functions/use-params/client-id | baseline | 3-api-reference/3.3-functions/use-params.md | PARTIAL | FAIL | 실제 `useParams()` 미사용(`useState`로 흉내) |
| 160 | functions/use-search-params/filter-parsing | baseline | 3-api-reference/3.3-functions/use-search-params.md | PARTIAL | FAIL | 실제 `useSearchParams()` 미사용, URL 쿼리와 무관한 클라이언트 상태로만 동작 |
| 161 | functions/use-search-params/debounce-transition | baseline | 3-api-reference/3.3-functions/use-search-params.md | PARTIAL | FAIL | `useTransition`은 사용하나 `startTransition` 콜백이 빈 주석뿐, URL 동기화 미구현 |
| 162 | functions/use-selected-layout-segment/subnav-pill | baseline | 3-api-reference/3.3-functions/use-selected-layout-segment.md | FAIL | FAIL | 실제 훅 호출 없이 `useState`로 탭 흉내(규칙24 위반) |
| 163 | functions/use-selected-layout-segments/breadcrumb | baseline | 3-api-reference/3.3-functions/use-selected-layout-segments.md | FAIL | FAIL | 실제 훅 호출 없이 하드코딩 배열만 렌더링, 실제 중첩 라우트 없음 |
| 164 | functions/cache-life/preset-profiles | cache | 3-api-reference/3.3-functions/cacheLife.md | PARTIAL | FAIL | 프리셋 값은 개념적으로 올바르나 실제 `cacheLife()`/`'use cache'` 없이 정적 텍스트만 |
| 165 | functions/cache-life/custom-profile | cache | 3-api-reference/3.3-functions/cacheLife.md | FAIL | FAIL | 다른 3개 데모와 완전 동일 복붙 위젯, `next.config.ts` custom cacheLife 정의 없음 |
| 166 | functions/cache-tag/multi-tag-binding | cache | 3-api-reference/3.3-functions/cacheTag.md | PARTIAL | FAIL | 태그 목록 정적 표시만, 실제 `cacheTag()` 호출 없음 |
| 167 | functions/cache-tag/cascade-invalidation | cache | 3-api-reference/3.3-functions/cacheTag.md | PARTIAL | FAIL | 버튼 클릭 시 문자열만, 실제 연쇄 무효화 로직 없음 |
| 168 | functions/unstable-cache/db-query | cache | 3-api-reference/3.3-functions/unstable_cache.md | FAIL | FAIL | 복붙 위젯, `unstable_cache()` 관련 코드 전무 |
| 169 | functions/unstable-no-store/dynamic-bailout | baseline | 3-api-reference/3.3-functions/unstable_noStore.md | FAIL | FAIL | 복붙 위젯, `unstable_noStore()` 호출 없음 |
| 170 | functions/revalidate-path/page-vs-layout | cache | 3-api-reference/3.3-functions/revalidatePath.md | PARTIAL | FAIL | page vs layout 텍스트는 개념상 올바르나 실제 `revalidatePath()` 미호출 |
| 171 | functions/revalidate-path/dynamic-route | cache | 3-api-reference/3.3-functions/revalidatePath.md | FAIL | FAIL | 복붙 위젯, 동적 라우트·`revalidatePath()` 요소 전무 |
| 172 | functions/revalidate-tag/basic-tag-purge | cache | 3-api-reference/3.3-functions/revalidateTag.md | PARTIAL | FAIL | 버튼 텍스트만 변경, 실제 호출 없음 |
| 173 | functions/revalidate-tag/max-expiration | cache | 3-api-reference/3.3-functions/revalidateTag.md | FAIL | FAIL | 복붙 위젯, `max` 만료 옵션 개념 미표현 |
| 174 | functions/update-tag/instant-memory-sync | cache | 3-api-reference/3.3-functions/updateTag.md | PARTIAL | FAIL | 버튼 라벨에 시그니처 언급되나 실제 호출 없음 |
| 175 | functions/fetch-extended/revalidate-option | baseline | 3-api-reference/3.3-functions/fetch.md | FAIL | FAIL | 복붙 위젯, fetch revalidate 옵션 코드 없음 |
| 176 | functions/fetch-extended/tag-option | baseline | 3-api-reference/3.3-functions/fetch.md | FAIL | FAIL | 복붙 위젯, fetch tags 옵션 코드 없음 |
| 177 | functions/cookies/get-set-session | baseline | 3-api-reference/3.3-functions/cookies.md | PARTIAL | FAIL | 버튼 라벨은 "Server Action: 쿠키 갱신"이나 실제로는 `useState`만 변경(레이블 오도) |
| 178 | functions/cookies/delete-logout | baseline | 3-api-reference/3.3-functions/cookies.md | PARTIAL | FAIL | 로그아웃 상태를 `useState`로만 표현, `cookies().delete()` 없음 |
| 179 | functions/headers/user-agent-device | baseline | 3-api-reference/3.3-functions/headers.md | FAIL | FAIL | 복붙 위젯, User-Agent 감지 요소 전무 |
| 180 | functions/headers/custom-auth-token | baseline | 3-api-reference/3.3-functions/headers.md | PARTIAL | FAIL | 하드코딩 토큰 문자열 정적 표시, `headers().get()` 없음 |
| 181 | functions/draft-mode/enable-preview | baseline | 3-api-reference/3.3-functions/draft-mode.md | PARTIAL | FAIL | 버튼 클릭 시 상태 텍스트만, `draftMode().enable()` 없음 |
| 182 | functions/draft-mode/disable-preview | baseline | 3-api-reference/3.3-functions/draft-mode.md | FAIL | FAIL | `draftMode()` API 전혀 import/호출 없이 `useState` 토글(규칙24 위반) |
| 183 | functions/after/background-logging | baseline | 3-api-reference/3.3-functions/after.md | FAIL | FAIL | 코드 주석에 "simulate after() background work"라 명시 — 실제 `after()` 미사용 |
| 184 | functions/after/analytics-batch | baseline | 3-api-reference/3.3-functions/after.md | FAIL | FAIL | `from 'next/` import 전무(grep), 동일 상투구 패널 |
| 185 | functions/not-found/trigger-404 | baseline | 3-api-reference/3.3-functions/not-found.md | FAIL | FAIL | `notFound()` 호출·트리거 로직 없음, 복붙 위젯 |
| 186 | functions/forbidden/trigger-403 | baseline | 3-api-reference/3.3-functions/forbidden.md | FAIL | FAIL | `from 'next/` import 없음, 동일 복붙 패턴 |
| 187 | functions/unauthorized/trigger-401 | baseline | 3-api-reference/3.3-functions/unauthorized.md | FAIL | FAIL | `from 'next/` import 없음, 동일 복붙 패턴 |
| 188 | functions/redirect/action-303 | baseline | 3-api-reference/3.3-functions/redirect.md | FAIL | FAIL | "redirect()" 텍스트만 언급, 실제 호출/Server Action 없음 |
| 189 | functions/redirect/handler-307 | baseline | 3-api-reference/3.3-functions/redirect.md | FAIL | FAIL | `from 'next/` import 전무 |
| 190 | functions/permanent-redirect/seo-308 | baseline | 3-api-reference/3.3-functions/permanentRedirect.md | FAIL | FAIL | `from 'next/` import 없음, 동일 상투구 패널 |
| 191 | functions/next-request/geo-ip-parsing | baseline | 3-api-reference/3.3-functions/next-request.md | FAIL | FAIL | `from 'next/` import 없음, 실제 Route Handler 없이 `useState` 위젯만 |
| 192 | functions/next-response/json-builder | baseline | 3-api-reference/3.3-functions/next-response.md | FAIL | FAIL | `NextResponse.json()` 실호출하는 route.ts 부재 |
| 193 | functions/next-response/rewrite-virtual | baseline | 3-api-reference/3.3-functions/next-response.md | FAIL | FAIL | `NextResponse.rewrite()` 실호출 없음 |
| 194 | functions/image-response/og-badge | baseline | 3-api-reference/3.3-functions/image-response.md | FAIL | FAIL | `next/og`의 `ImageResponse` import/실제 이미지 생성 라우트 없음 |
| 195 | functions/image-response/dynamic-receipt | baseline | 3-api-reference/3.3-functions/image-response.md | FAIL | FAIL | `from 'next/` import 없음, 동일 패턴 |
| 196 | functions/generate-metadata/dynamic-title | baseline | 3-api-reference/3.3-functions/generate-metadata.md | FAIL | FAIL | `generateMetadata` 함수 자체가 코드에 없음 |
| 197 | functions/generate-metadata/parent-inheritance | baseline | 3-api-reference/3.3-functions/generate-metadata.md | FAIL | FAIL | 부모 metadata 상속 실증 코드 없음 |
| 198 | functions/generate-static-params/basic-ssg | baseline | 3-api-reference/3.3-functions/generate-static-params.md | FAIL | FAIL | `generateStaticParams` export 부재, 실제 SSG 검증 불가 |
| 199 | functions/generate-static-params/multiple-segments | baseline | 3-api-reference/3.3-functions/generate-static-params.md | FAIL | FAIL | `[category]/[id]` 다중 세그먼트 실제 라우트 없이 클라이언트 위젯뿐 |
| 200 | functions/connection/request-signal | baseline | 3-api-reference/3.3-functions/connection.md | FAIL | FAIL | `connection()` 실호출 없음 |
| 201 | functions/taint-unique-value/block-secret | baseline | 3-api-reference/3.5-config/.../taint.md | FAIL | FAIL | `experimental_taintUniqueValue` 실호출 없음 |
| 202 | functions/server-runtime/edge-vs-nodejs | baseline | 3-api-reference/.../runtime.md | PARTIAL | FAIL | 정적 설명 텍스트만, 실제 `export const runtime='edge'` 분기 코드 없음 |
| 203 | functions/use-report-web-vitals/telemetry | baseline | 3-api-reference/3.3-functions/use-report-web-vitals.md | PASS | FAIL | `useReportWebVitals` 호출은 존재하나 "LCP: 540ms" 등 하드코딩 텍스트, 실제 훅 콜백 값 아님 |
| 204 | functions/use-server-inserted-html/head-style | baseline | 2-guides/css-in-js.md | PARTIAL | FAIL | doc가 guide로 연결(API 레퍼런스 부재로 불가피). 복붙 위젯이며 `useServerInsertedHTML` 호출 없음 |
| 205 | directives/use-client/boundary-declaration | baseline | 3-api-reference/3.4-directives/use-client.md | PASS | FAIL | `'use client'` 존재, 위시리스트/장바구니 실제 상태 로직(양호한 소수 사례) |
| 206 | directives/use-client/window-storage-access | baseline | 3-api-reference/3.4-directives/use-client.md | PASS | FAIL | 실제 렌더링 컴포넌트는 더미 배열 push뿐. 진짜 `localStorage` 사용 컴포넌트는 dead code로 존재 |
| 207 | directives/use-server/file-level-action | baseline | 3-api-reference/3.4-directives/use-server.md | PASS | FAIL | 실제 렌더링은 정적 문자열뿐. 쿠폰 할인 계산 로직은 dead code |
| 208 | directives/use-server/inline-action-closure | baseline | 3-api-reference/3.4-directives/use-server.md | PASS | FAIL | 실제 렌더링은 복붙 위젯. 즉시구매 클로저 로직은 dead code |
| 209 | directives/use-cache/function-cache | cache | 3-api-reference/3.4-directives/use-cache.md | PASS | FAIL | `'use cache'` 존재(코드 확인)(이커머스 전환 후보) |
| 210 | directives/use-cache/component-jsx-cache | cache | 3-api-reference/3.4-directives/use-cache.md | PASS | FAIL | `'use cache'` 존재(이커머스 전환 후보) |
| 211 | directives/use-cache/private-profile-cache | cache | 3-api-reference/3.4-directives/use-cache-private.md | PASS | FAIL | `'use cache: private'` 존재, doc 주제(개인화 주문 내역)와 이미 부합 |
| 212 | directives/use-cache/remote-redis-cache | cache | 3-api-reference/3.4-directives/use-cache-remote.md | PASS | FAIL | `'use cache: remote'` 존재(이커머스 전환 후보) |
| 213 | config/base-path/subpath-routing | baseline | 3-api-reference/.../basePath.md | PARTIAL | PARTIAL | 화면 텍스트에만 등장, `next.config.ts`에 실제 미설정(시뮬레이션) |
| 214 | config/asset-prefix/cdn-distribution | baseline | 3-api-reference/.../assetPrefix.md | PASS | PARTIAL | `assetPrefix`가 실제 `next.config.ts`에 설정됨(드문 진짜 반영 사례) |
| 215 | config/redirects/regex-pattern-matching | baseline | 3-api-reference/.../redirects.md | PARTIAL | PARTIAL | `next.config.ts`에 실제 미반영, 시뮬레이션만 |
| 216 | config/redirects/header-query-condition | baseline | 3-api-reference/.../redirects.md | PARTIAL | PARTIAL | 동일 사유 |
| 217 | config/rewrites/cross-zone-proxy | baseline | 3-api-reference/.../rewrites.md | PARTIAL | PARTIAL | `next.config.ts`에 실제 미반영, 화면 텍스트로만 시뮬레이션 |
| 218 | config/rewrites/query-param-rewrite | baseline | 3-api-reference/.../rewrites.md | PARTIAL | PARTIAL | 동일 사유 |
| 219 | config/headers/global-security-headers | baseline | 3-api-reference/.../headers.md | PARTIAL | PARTIAL | `next.config.ts`에 실제 미반영, 화면 텍스트로만 시뮬레이션 |
| 220 | config/trailing-slash/url-normalization | baseline | 3-api-reference/.../trailingSlash.md | PARTIAL | PARTIAL | `next.config.ts`에 실제 미반영, 화면 텍스트로만 시뮬레이션 |
| 221 | config/images/remote-patterns-security | baseline | 3-api-reference/.../images.md | PASS | PARTIAL | `images:` 옵션이 실제 `next.config.ts`에 설정됨(진짜 반영 사례) |
| 222 | config/images/formats-avif-webp | baseline | 3-api-reference/.../images.md | FAIL | FAIL | 다른 config/* 와 동일한 복붙 위젯, AVIF/WebP와 무관. doc 스텁 |
| 223 | config/logging/fetches-full-url | baseline | 3-api-reference/.../logging.md | FAIL | FAIL | 동일 복붙 위젯, `logging.fetches.fullUrl` 관련 로그 없음. doc 스텁 |
| 224 | config/dev-indicators/render-badge | baseline | 3-api-reference/.../devIndicators.md | FAIL | FAIL | 동일 복붙 위젯, 렌더링 뱃지 UI 전무. doc 스텁 |
| 225 | config/env/build-time-injection | baseline | 3-api-reference/.../env.md | FAIL | FAIL | 동일 복붙 위젯, 빌드타임 env 주입 시연 없음. doc 스텁 |
| 226 | config/cross-origin/anonymous-mode | baseline | 3-api-reference/.../crossOrigin.md | FAIL | FAIL | 동일 복붙 위젯, `crossOrigin` 속성 시연 없음. doc 스텁 |
| 227 | config/powered-by-header/hide-x-powered | baseline | 3-api-reference/.../poweredByHeader.md | FAIL | FAIL | 동일 복붙 위젯, X-Powered-By 확인 로직 없음. doc 스텁 |
| 228 | config/output/standalone-container | baseline | 3-api-reference/.../output.md | FAIL | FAIL | 동일 복붙 위젯, standalone 빌드 관련 내용 없음. doc 스텁 |
| 229 | config/output/export-static-spa | baseline | 3-api-reference/.../output.md | FAIL | FAIL | 동일 복붙 위젯, static export 시연 없음. doc 스텁(동일 파일 재사용) |
| 230 | edge/v8-lightweight/global-web-apis | baseline | 3-api-reference/edge.md | PARTIAL | FAIL | 정적 하드코딩 텍스트("콜드스타트: 2ms")만, 실제 `runtime='edge'` 실행·인터랙션 없음 |
| 231 | edge/v8-lightweight/nodejs-modules-bailout | baseline | 3-api-reference/edge.md | FAIL | FAIL | config/* 와 동일한 복붙 위젯으로 전환, Node.js 모듈 차단 시연 전무 |
| 232 | architecture/accessibility/form-aria-support | baseline | 5-architecture/accessibility.md | PARTIAL | FAIL | 실제 `aria-invalid`/`aria-describedby`/`role=alert` 입력 폼(기능적으로 유의미)이나 doc는 route announcer/eslint-plugin 하위주제라 다소 어긋남 |
| 233 | architecture/accessibility/modal-focus-trap | baseline | 5-architecture/accessibility.md | PARTIAL | FAIL | `role="dialog" aria-modal="true"` 모달은 열리나 "Tab 키로 순환" 텍스트만 있고 실제 focus trap 로직(`onKeyDown`, ref 관리) 없음 |
| 234 | architecture/compiler-optimization/react-compiler | baseline | 5-architecture/fast-refresh.md | FAIL | FAIL | 복붙 위젯, React Compiler 메모이제이션과 무관. **doc이 `fast-refresh.md`로 오배선**(전혀 다른 주제) |
| 235 | architecture/server-action-security/csrf-protection | baseline | 5-architecture/fast-refresh.md | FAIL | FAIL | "Origin == Host (일치)" 하드코딩 텍스트뿐, 실제 검증 없음. **doc도 `fast-refresh.md`로 오배선** |
| 236 | architecture/turbopack/incremental-harness | baseline | 5-architecture/fast-refresh.md | FAIL | FAIL | "증분 HMR 8ms" 등 정적 하드코딩 수치, 실측 불가. **doc도 `fast-refresh.md`로 오배선** |
| 237 | config/cache-components/enable-flag | cache | 3-api-reference/.../cacheComponents.md | FAIL | FAIL | 동일 복붙 위젯, `cacheComponents: true` 플래그 시연 없음. doc 스텁 |
| 238 | config/cache-life/custom-presets | cache | 3-api-reference/.../cacheLife.md | FAIL | FAIL | 동일 복붙 위젯, 커스텀 cacheLife 프리셋 정의 시연 없음. doc 스텁 |
| 239 | config/cache-handlers/redis-kv | cache | 3-api-reference/.../cacheHandlers.md | FAIL | FAIL | 동일 복붙 위젯, Redis 언급조차 없음. doc 스텁 |
| 240 | config/expire-time/memory-isr-tuning | cache | 3-api-reference/.../expireTime.md | FAIL | FAIL | 동일 복붙 위젯, ISR 메모리 캐시 튜닝 시연 없음. doc 스텁 |
| 241 | config/stale-times/router-cache-tuning | cache | 3-api-reference/.../staleTimes.md | PARTIAL | FAIL | `staleTimes: {dynamic:0, static:300}` 값을 정적 텍스트로 표시(비교적 근접), 실제 네비게이션 재검증 인터랙션 없음. doc 스텁 |

> 참고: `3-api-reference/*`, `5-architecture/*`의 doc 경로 중 `.../`로 축약 표기된 항목은 `demos.yaml`의 전체 경로(`3-api-reference/3.1-file-conventions/...`, `3-api-reference/3.1-file-conventions/3.1.21-metadata/...`, `3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/...`, `3-api-reference/3.2-components/...`, `3-api-reference/3.3-functions/...`, `3-api-reference/3.5-config/3.5.1-next-config-js/...`)를 그대로 따른다.

---

## 4. 이커머스 컨셉 전환 후보

241건 중 대다수(약 230건 이상)는 이미 제목·화면 문구 수준에서 상품/장바구니/주문/결제/배송 등 이커머스 어휘를 채택하고 있다. 따라서 "컨셉 전환"이 시급한 항목은 소수이며, 대부분의 결함은 컨셉이 아니라 **위 2절에서 정리한 구현 자체의 부재**다. 실제로 컨셉 자체가 도메인과 무관해 전환 가치가 있는 항목은 다음 8건이다.

| # | url | 현재 컨셉 | 제안 이커머스 시나리오 | 근거 |
|---|---|---|---|---|
| 18 | css/tailwind-v4 | 추상적 "ThemeInspector" 카드(색상/패딩 토글), 상품·도메인 맥락 없음 | 상품 카드(가격 뱃지, 할인율, 재고 상태)에 악센트 컬러·패딩 유틸리티를 적용하는 실습으로 전환 | 이웃한 데모들은 대부분 상품/장바구니 맥락을 갖췄는데 이 데모만 순수 UI 인스펙터라 학습 몰입도가 떨어짐 |
| 19 | css/css-modules | 추상적 "Card A / Card B"(Blue/Emerald 테마 비교) | "상품 카드" vs "프로모션 배너 카드" 컴포넌트로 이름을 바꾸고 동일 `.card`/`.title` 클래스 충돌 격리를 시연 | 스코프 격리 개념 자체는 카드 UI로 이미 표현돼 있어, 이름과 문구만 이커머스 용어로 바꿔도 즉시 개선되는 저비용·고효과 케이스 |
| 35 | architecture/fast-refresh-boundary | `StatePreservingCounter`: 도메인 무관 범용 숫자 카운터 + 자유 텍스트 입력 | 장바구니 수량 스테퍼 + "선물 메모" 입력 필드로 교체 | 1단 가이드 문구는 이미 "장바구니 수량이나 입력 폼의 상태"를 언급하는데 2단 실습이 이를 반영하지 못함 — 가이드와 실습을 일치시키면서 HMR 상태보존을 체감 가능한 시나리오로 전환 |
| 64 | guides/migrating-cache-components/cache-key-compare | 범용 `['user-profile', userId, region]` 캐시 키 예시 | `['product-detail', productId, locale]` 등 상품 상세 캐시 키로 전환 | 캐시 키 생성 방식 비교가 이 저장소의 일관된 이커머스 도메인(상품/카탈로그)과 무관한 범용 프로필 예시를 써 학습 흐름이 끊김 |
| 66 | guides/tanstack-query/ssr-hydration | 추상적 "쿼리 데이터" SSR 하이드레이션 텍스트(라이브러리 자체 미사용) | 상품 목록 `prefetchQuery` + `HydrationBoundary`로 실제 상품 카탈로그를 서버에서 미리 가져와 하이드레이션 | 최소한 실제 TanStack Query로 상품 목록을 프리페치하는 방식으로 재구현하면 이커머스 맥락과 학습 효과가 동시에 개선됨(단, 컨셉 전환보다 "가짜 시뮬레이션 제거"가 더 시급) |
| 209 | directives/use-cache/function-cache | 범용 함수 캐싱 데모(이커머스 키워드 미검출) | 상품 상세 조회 함수(`getProductDetail`)에 `'use cache'`를 적용해 DB 조회 없이 즉시 응답되는 것을 실제 상품 데이터로 시연 | 같은 zone의 `caching/basic`(실제 `cacheId`/`timestamp`로 검증)과 톤을 통일하면 학습 일관성이 높아짐 |
| 210 | directives/use-cache/component-jsx-cache | 범용 컴포넌트 캐싱 데모(이커머스 키워드 미검출) | 인기 상품 랭킹 컴포넌트 전체를 `'use cache'`로 캐싱해 재렌더링 없이 즉시 서빙되는 것을 시연 | JSX 캐싱은 "리스트/랭킹처럼 자주 재사용되는 뷰"에서 효과가 커 이커머스 랭킹 위젯이 개념 전달에 적합 |
| 212 | directives/use-cache/remote-redis-cache | 범용 원격 캐시 연동(이커머스 키워드 미검출) | 재고/가격처럼 여러 서버 인스턴스가 공유해야 하는 데이터를 Redis 원격 캐시로 다루는 실제 재고 동기화 시나리오로 구체화 | 원격 캐시의 실무 가치는 "여러 인스턴스 간 공유 데이터 일관성"이며 재고 동기화가 가장 직관적인 이커머스 사례 |

나머지 233건은 이미 이커머스 컨셉을 표면적으로 채택했으므로(`N — 이미 적용됨`) 전환 후보에서 제외했다. 다만 그중 상당수는 **이커머스 문구/라벨과 실제 코드 동작이 결합되지 않은 "장식적 포장"** 상태이며, 이는 컨셉 전환이 아니라 2절에서 정리한 실제 기능 재구현으로 해결해야 할 문제다.

---

## 5. 권고 우선순위

1. **`ExpectedActualPanel.isMatched` 하드코딩 제거(240건)**: 각 데모의 실제 상태값 기반으로 `isMatched`를 계산하도록 고쳐야 3단 검증 패널이 AGENTS.md 규칙 15가 의도한 "회귀 감지 장치"로 기능한다. 가장 넓은 범위에 영향을 주는 단일 수정이다.
2. **파일 컨벤션이 통째로 빠진 데모군 우선 재구현**: `file-conventions/route/*`, `route-groups/*`, `dynamic-segments/*`, `intercepting-routes/direct-vs-modal`, `mdx-components/*`, `instrumentation/*`, `proxy/gateway-router`, `forbidden/*`, `unauthorized/*`, `metadata-app-icons/*`, `metadata-manifest/*`, `metadata-og/*` (배치 07, 20건) — 학습자가 실제 파일을 전혀 볼 수 없는 최우선 결함군.
3. **`demos.yaml`의 doc 오배선 수정(3건)**: `architecture/compiler-optimization/react-compiler`, `architecture/server-action-security/csrf-protection`, `architecture/turbopack/incremental-harness` → `fast-refresh.md`가 아닌 각 주제에 맞는 문서로 재연결.
4. **`config/*` 학습 문서 스텁 해소**: 12개 이상의 `nextjs-docs/3-api-reference/3.5-config/...md` 파일이 "추후 정의" 상태로, Phase 1 완료 주장과 배치된다. 문서 우선 완성 후 데모 재검토가 필요하다.
5. **dead code 정리 또는 활성화(3건 이상 확인)**: `directives/use-client/window-storage-access`, `use-server/file-level-action`, `use-server/inline-action-closure` — 더 나은 구현이 이미 파일로 존재하므로, `page.tsx`의 import만 교체하면 즉시 품질이 개선된다.
6. **이커머스 전환 8건**은 상대적으로 비용이 낮은 개선이므로 위 1~5번 이후 여유가 있을 때 처리를 권고한다.
