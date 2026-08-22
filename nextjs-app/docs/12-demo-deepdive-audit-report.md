# nextjs-app 4단 [개념 정리] DemoDeepDiveCard 콘텐츠 감사 보고서 (241건)

- 대상: `nextjs-app/packages/demos/demos.yaml` 등록 데모 241건의 4단 `DemoDeepDiveCard` 콘텐츠
- 범위: 각 데모의 개념 정리 콘텐츠를 (1) 개념 설명, (2) 딥다이브(동작 원리) 설명, (3) 언제 주로 사용하는지, (4) 주의사항/팁 4가지 기준으로 평가하고, 하드코딩/복붙 여부를 코드 근거로 판정했다.
- 방법: 241건을 12개 배치(20개 내외)로 나누어 각 배치마다 실제 `page.tsx` 또는 `components/VerificationFooter.tsx` 안의 `<DemoDeepDiveCard>` JSX를 직접 읽고, 다른 데모와의 텍스트 중복 여부를 grep으로 교차 확인했다.
- 코드는 수정하지 않았다. 읽기·확인·기록만 수행했다.
- (참고) 이 보고서는 이전에 작성한 [`10-demo-audit-report.md`](./10-demo-audit-report.md)(3단 검증 패널·주제 일치 감사)와 별개의 감사이며, 이번 감사 과정에서 이전 보고서의 일부 기록(예: `route-handlers/rest-api-crud`, `streaming-sse`의 4단이 복붙됐다는 기록)이 재확인 결과 사실이 아니었음을 발견했다 — 아래 6절에 정정 사항으로 남긴다.

## 1. 컴포넌트 구조 확인

`DemoDeepDiveCard`(`nextjs-app/packages/demo-kit/src/DemoDeepDiveCard.tsx`)는 `title`과 `children`만 받는 단순 `fieldset` 래퍼다. 실제 콘텐츠는 각 데모의 `page.tsx` 또는 `components/VerificationFooter.tsx`에 JSX로 직접 작성돼 있으며, 사실상 표준화된 4개 섹션 구조를 따른다.

| 섹션 | 제목(전형) | 사용자가 요청한 기준과의 대응 |
|---|---|---|
| 1 | 핵심 스펙 및 개념 요약 | 개념 설명 |
| 2 | 데모 예제 기반 동작 원리 (데모마다 커스텀 제목을 쓰기도 함) | 딥다이브 설명 |
| 3 | 실무적 장점 (Why Use This) | — (장점 나열, 주의사항과는 다름) |
| 4 | 주요 활용 상황 (When to Use) | 언제 주로 사용 |

**"주의사항/팁"에 해당하는 5번째 섹션은 컴포넌트/템플릿 구조 자체에 존재하지 않는다.** 저장소 전체에서 `주의사항|Caution|Tip|팁:` 문자열을 검색한 결과 0건이었다(사전 확인). 241건 중 유일하게 `functions/next-request/geo-ip-parsing` 1건만, 별도 섹션이 아니라 2번 섹션 본문 안에 "로컬 개발 환경이나 프록시 뒤에서는 `request.geo`가 비어있을 수 있으므로 `x-forwarded-for` 등을 폴백으로 검사해야 한다"는 실질적 주의사항 문장을 끼워 넣은 유일한 예외다.

## 2. 요약 통계

| 판정 | 건수 | 비율 |
|---|---|---|
| 양호 (개념·딥다이브·언제사용 대부분 데모 고유 내용으로 구체적) | 58 | 24% |
| 부분개선필요 (일부만 구체적/일부 섹션 누락/형제 데모와 텍스트 중복) | 34 | 14% |
| 전면재작성필요 (제목만 치환된 완전 하드코딩 템플릿, 또는 다른 주제 내용 오복붙) | 149 | 62% |
| **합계** | **241** | 100% |

- **주의사항/팁 전용 섹션 보유**: 0/241 (0%) — 구조적으로 전무
- **실질적 주의사항 문구가 다른 섹션에 섞여서라도 존재**: 1/241 (`functions/next-request/geo-ip-parsing`)

### 배치별 집계

| 배치 | 범위(대표) | N | 양호 | 부분개선 | 전면재작성 |
|---|---|---|---|---|---|
| 01 | 1-getting-started 전반 | 21 | 2 | 3 | 16 |
| 02 | metadata/route-handlers/guides 일부 | 20 | 7 | 0 | 13 |
| 03 | guides(isr-cache~caching-legacy) | 20 | 2 | 5 | 13 |
| 04 | guides(isr~authentication) | 20 | 1 | 1 | 18 |
| 05 | guides(data-security~multi-tenant) | 20 | 1 | 3 | 16 |
| 06 | guides(multi-zones~file-conventions/default) | 20 | 3 | 0 | 17 |
| 07 | file-conventions(route~metadata-og) | 20 | 9 | 5 | 6 |
| 08 | file-conventions/route-segment-config~functions/use-search-params | 20 | 8 | 0 | 12 |
| 09 | functions(use-selected-layout-segment~draft-mode) | 20 | 4 | 0 | 16 |
| 10 | functions(draft-mode~taint-unique-value) | 20 | 8 | 9 | 3 |
| 11 | functions~directives~config | 20 | 0 | 7 | 13 |
| 12 | config~edge~architecture | 20 | 13 | 1 | 6 |
| **합계** | | **241** | **58** | **34** | **149** |

품질 편차가 큰 지점: `functions/*`(배치08~10)와 `config/*`(배치11~12), `file-conventions/route*`(배치07)는 상대적으로 양호 비율이 높다(작성 시기 또는 담당자가 달랐던 것으로 추정). 반면 `guides/*` 대부분(배치02~06)은 전면재작성 비율이 65~90%에 달한다.

## 3. 핵심 결함 유형 (개별 사례가 아니라 반복되는 패턴)

### 3-1. 완전 하드코딩 템플릿 (제목만 문자열 치환) — 가장 많은 유형

전형적 문구:
> "{제목}는 Next.js App Router의 {세그먼트} 표준 아키텍처 스펙으로, 웹 표준 모델 위에서 서버 렌더링과 클라이언트 상태 상호작용을 최적화하도록 설계된 핵심 기능입니다."
> "본 데모에서는 실제 이커머스 쇼핑몰의 데이터 흐름(...)을 바탕으로, 사용자 조작에 따른 상태 변화와 서버-클라이언트 통신 결과를 검증 패널을 통해 단계별로 관찰할 수 있도록 구성되었습니다."
> (3번 섹션) "프로덕션 안정성 확보: 대규모 트래픽과 복잡한 비즈니스 로직 환경에서도..." / "프레임워크 레벨 최적화: ..." / "유지보수성 및 확장성: ..."
> (4번 섹션) "쇼핑몰 서비스의 핵심 화면 및 백엔드 비즈니스 로직 연동" / "사용자 인터랙션 성능 및 서버 렌더링 효율 극대화가 필요한 프로덕션 환경" / "보안, 접근성, 검색엔진 최적화(SEO) 표준을 준수해야 하는 엔터프라이즈 애플리케이션"

이 정확히 동일한 문구(제목 부분만 치환)가 149건 중 대다수에서 그대로 발견됐다. 학습자 입장에서는 어떤 데모를 열어도 "표준 아키텍처 스펙", "프로덕션 안정성 확보" 같은 공허한 문장만 보게 되며, 그 API가 실제로 무엇을 하는지는 전혀 알 수 없다.

### 3-2. 서로 다른 데모끼리 콘텐츠를 그대로 복붙 (형제 항목 구분 불가)

같은 상위 개념을 다루는 여러 데모가 **서로 텍스트가 100% 동일**하여, 각 데모의 고유한 차이를 설명하지 못하는 사례가 다수 확인됐다.

| 복붙 클러스터 | 문제 |
|---|---|
| `guides/streaming-nested`, `guides/swr-polling`, `guides/how-revalidation-works/swr-flow`, `guides/streaming/chunk-loading` (4건) | 전부 "SWR, TanStack Query 및 React 19 Suspense 스트리밍은..." 동일 문단. 각자의 실제 주제(중첩 Suspense, `mutate()` 갱신, Stale-While-Revalidate, 청크 로딩)는 어디서도 설명되지 않음 |
| `guides/i18n/subpath-routing`, `guides/i18n/dictionary-translation`, `guides/multi-tenant/subdomain-tenant`, `guides/multi-zones/cross-zone-routing`, `guides/multi-tenant/isolated-branding` (5건) | "/ko/products와 /en/products로 접속 시..." 동일 문단. `multi-tenant/isolated-branding`은 특히 심각 — 이 데모의 실제 주제(테넌트별 로고/컬러 동적 주입)가 어디에도 언급되지 않음 |
| `guides/forms/use-action-state-errors` ↔ `guides/forms/use-form-status-spinner` | 텍스트 100% 동일. `useFormStatus`의 pending 스피너 고유 메커니즘 설명 없음 |
| `guides/swr/mutation-optimistic` ↔ `guides/tanstack-query/infinite-scroll` | 텍스트 100% 동일. `useInfiniteQuery`/`fetchNextPage` 등 무한 스크롤 고유 개념 설명 없음 |
| `functions/use-selected-layout-segment/subnav-pill` ↔ `functions/use-selected-layout-segments/breadcrumb` | 텍스트 100% 동일(내용 자체는 정확하나 두 훅의 차이 구분 불가) |
| `functions/not-found/trigger-404`, `functions/forbidden/trigger-403`, `functions/unauthorized/trigger-401` (3건) | 텍스트 100% 동일. 세 함수의 개별 메커니즘(`NEXT_NOT_FOUND` 예외 등) 구분 없음 |
| `functions/redirect/action-303`, `functions/redirect/handler-307`, `functions/permanent-redirect/seo-308` (3건) | 텍스트 100% 동일. Server Action 컨텍스트(303)와 Route Handler 컨텍스트(307)의 차이 설명 없음 |
| `functions/image-response/og-badge` ↔ `functions/image-response/dynamic-receipt` | 텍스트 100% 동일 — 후술 3-3 참고(주제 자체가 틀림) |
| `functions/generate-metadata/dynamic-title` ↔ `functions/generate-metadata/parent-inheritance` | 텍스트 100% 동일. `parent`/`metadataBase`/title template 등 상속 메커니즘 설명 없음 |
| `functions/generate-static-params/basic-ssg` ↔ `functions/generate-static-params/multiple-segments` | 텍스트 100% 동일. `[category]/[id]` 다중 파라미터 조합 방식 설명 없음 |
| `file-conventions/forbidden/admin-role-403` ↔ `file-conventions/unauthorized/anonymous-401` | 텍스트 100% 동일 |
| `config/redirects/regex-pattern-matching` ↔ `config/redirects/header-query-condition` | 텍스트 100% 동일(아래 3-3의 개념 오류와 중첩) |

### 3-3. 완전히 다른 개념/주제를 설명하는 오류 (단순 템플릿보다 심각)

단순히 공허한 것이 아니라 **틀린 내용을 가르치는** 사례:

- **`file-conventions/page/react-19-use-params`**: 제목은 React 19 `use(params)`(Promise 언래핑)인데, 실제 내용은 완전히 다른 API인 `useParams()`(`next/navigation` 훅)를 설명한다.
- **`guides/server-actions/start-transition`**: 제목은 `startTransition`을 통한 프로그래밍 방식 Server Action 호출인데, 본문 전체가 `useActionState`/`useFormStatus`/결제 버튼 스피너 내용(forms 그룹에서 유입)이다. `startTransition`의 트랜지션 렌더링 우선순위 개념이 전혀 없다.
- **`functions/image-response/dynamic-receipt`**: "결제 영수증" 데모인데 섹션 2 전체가 "할인 뱃지 OG 이미지" 시나리오(`og-badge`에서 복붙)를 설명한다.
- **`config/redirects/regex-pattern-matching`, `config/redirects/header-query-condition`**: 제목은 `next.config.ts`의 `redirects()` **설정 함수**(정규식 패턴, 헤더/쿼리 조건)인데, 실제 내용은 전혀 다른 API인 **런타임 함수** `redirect()`/`permanentRedirect()`(Server Action/Route Handler 내부 호출)를 설명한다. config 옵션과 런타임 함수를 혼동한 개념 오류다.
- **`edge/v8-lightweight/nodejs-modules-bailout`**: 형제 데모 `global-web-apis`의 4개 섹션 전체가 100% 그대로 복사되어 있다. "Node.js 전용 모듈 접근 차단"이라는 이 데모의 주제(fs/net 등 Node API가 Edge에서 막히는 것)는 단 한 문장도 다루지 않는다.
- **`error-handling/segment-error`, `error-handling/global-error`**: 두 데모가 서로 완전히 동일한 내용(`notFound()`/`forbidden()`/`unauthorized()` 설명)을 복붙했는데, 정작 두 데모의 실제 주제(각각 `error.tsx` 세그먼트 경계, `global-error.tsx` 3계층)와는 무관한 엉뚱한 내용이다.
- **`architecture/compiler-optimization/react-compiler`, `architecture/server-action-security/csrf-protection`, `architecture/turbopack/incremental-harness`**: 완전 템플릿인 데다, `demos.yaml`의 `doc` 필드 자체도 무관한 `5-architecture/fast-refresh.md`로 오배선되어 있다(3단 감사 보고서에서도 확인된 사항).

### 3-4. 섹션이 구조적으로 누락된 축약 변형

일부 데모는 4섹션이 아니라 2~3섹션만 존재한다 — 있는 섹션(1,2)의 내용 자체는 대체로 구체적이고 정확하지만, "언제 사용"에 해당하는 4번 섹션이 통째로 빠져 사용자가 실무 활용 맥락을 알 수 없다.

- `file-conventions/loading/skeleton-boundary`, `file-conventions/not-found/missing-product-404`, `file-conventions/error/payment-error-boundary`: 3섹션만(4번 없음)
- `file-conventions/metadata-app-icons/dynamic-favicon`, `file-conventions/metadata-manifest/dynamic-pwa-manifest`, `file-conventions/metadata-og/discount-banner-og`: 2섹션만(3,4번 없음)
- `file-conventions/metadata-robots/dynamic-crawler-rules`, `file-conventions/metadata-sitemap/split-index-sitemaps`: 2섹션만

### 3-5. 화면 실습 내용과 딥다이브 설명의 불일치

`edge/v8-lightweight/global-web-apis`의 딥다이브 설명은 "국가별 환율 실시간 계산기" 기능을 서술하지만, 실제 2단 실습 화면에는 이 기능이 없다(3단 감사에서도 "정적 하드코딩 텍스트만 표시, 실제 `runtime='edge'` 실행 없음"으로 확인된 화면이다). 설명이 존재하지 않는 기능을 가리키고 있다.

### 3-6. 기술적 정확성이 의심되는 서술 (별도 검증 권고)

- **`config/env/build-time-injection`**: "보안 격리: 시크릿 키를 분리 관리"라는 서술이 있으나, Next.js의 `env` 필드는 클라이언트 번들에도 그대로 노출되므로 시크릿 격리 용도로는 부적합하다. 기술적으로 부정확할 소지가 있어 재검토가 필요하다.
- **`file-conventions/route-segment-config/instant-prefetch`**: 내용 서술 품질은 높으나, `export const instant`가 Next.js 16.3.1 공식 API로 실재하는지 이번 감사에서 별도로 사실 검증하지 못했다. 존재하지 않는 API를 가르치고 있을 가능성이 있어 우선 확인이 필요하다.

## 4. 수정이 필요한 데모 페이지 리스트업

### 4-1. 전면재작성필요 (149건) — 우선순위 최상

아래는 4개 기준(개념설명/딥다이브설명/언제사용) 대부분이 하드코딩 템플릿이거나, 완전히 다른 주제 내용이 잘못 붙여넣어진 데모다. `url` 기준으로 정렬했다.

**1-getting-started (14건)**: `layouts-and-pages/nested-layouts`, `layouts-and-pages/template-lifecycle`, `layouts-and-pages/route-groups-layouts`, `linking-and-navigating/soft-navigation`, `linking-and-navigating/router-prefetch`, `server-client-components/composition`, `server-client-components/serialization`, `fetching-data/parallel-fetching`, `mutating-data/server-action-revalidate`, `mutating-data/optimistic-cart`, `revalidating/time-based-isr`, `revalidating/tag-vs-path`, `css/tailwind-v4`, `css/css-modules`, `images/image-optimization`, `fonts/font-optimization`

**2-guides (77건 중 약 63건)**: `guides/streaming-nested`, `guides/swr-polling`, `guides/lazy-loading-chart`, `guides/auth-session`, `architecture/fast-refresh-boundary`, `guides/rendering-philosophy/server-vs-client`, `guides/server-and-client-boundary/children-slot`, `guides/how-revalidation-works/swr-flow`, `guides/caching-legacy/fetch-cache`, `guides/streaming/chunk-loading`, `guides/isr/time-isr-60s`, `guides/isr-cache-components/cache-life-hours`, `guides/migrating-cache-components/unstable-to-use-cache`, `guides/adopting-partial-prefetching/hover-shell`, `guides/auth-cache-components/static-layout-session-context`, `guides/server-actions/start-transition`(개념오류), `guides/draft-mode/preview-toggle`, `guides/prefetching/viewport-vs-hover`, `guides/how-revalidation-works/ondemand-sync`, `guides/caching-legacy/segment-revalidate`, `guides/isr/revalidate-path-sync`, `guides/isr-cache-components/precision-tag-purge`, `guides/migrating-cache-components/cache-key-compare`, `guides/auth-cache-components/private-cache-user`, `guides/draft-mode/bypass-cookie`, `guides/prefetching/custom-prefetch-false`, `guides/optimizing-prefetching/bandwidth-saver`, `guides/instant-navigation/loading-skeleton`, `guides/instant-navigation/router-cache-back`, `guides/lazy-loading/modal-dynamic`, `guides/preserving-ui-state/drawer-open`, `guides/preserving-ui-state/scroll-retention`, `guides/preventing-flash/darkmode-script`, `guides/view-transitions/zoom-card`, `guides/css-in-js/style-registry`, `guides/sass/promotions-theme`, `guides/authentication/middleware-guard`, `guides/authentication/rsc-user-profile`, `guides/data-security/server-only-guard`, `guides/content-security-policy/nonce-injection`, `guides/environment-variables/public-vs-server`, `guides/environment-variables/runtime-env`, `guides/json-ld/product-schema`, `guides/interactive-apps/multi-filter-widget`, `guides/scripts/strategy-order`, `guides/scripts/pg-sdk-onload`, `guides/mdx/product-tech-doc`, `guides/mdx/custom-component-slot`, `guides/third-party-libraries/google-analytics`, `guides/third-party-libraries/youtube-embed`, `guides/bff/order-aggregation`, `guides/bff/response-shaping`, `guides/pwas/app-install-prompt`, `guides/multi-tenant/isolated-branding`, `guides/multi-zones/cross-zone-routing`, `guides/instrumentation/server-register-hook`, `guides/opentelemetry/trace-span`, `guides/static-exports/client-routing`, `guides/static-exports/ssg-catalog`, `guides/public-pages/terms-ssg`, `guides/analytics/custom-beacon`, `guides/videos/lazy-video-player`

**3-api-reference (약 66건)**: `file-conventions/layout/state-preservation`, `file-conventions/layout/dynamic-category-layout`, `file-conventions/page/static-and-dynamic`, `file-conventions/page/react-19-use-params`(개념오류), `file-conventions/loading/nested-segment-loading`, `file-conventions/error/reset-recovery`, `file-conventions/template/input-reset-animation`, `file-conventions/default/parallel-fallback`, `file-conventions/default/hard-reload-restore`, `file-conventions/route-groups/shop-vs-admin-roots`, `file-conventions/parallel-routes/independent-tabs`, `file-conventions/intercepting-routes/direct-vs-modal`, `file-conventions/mdx-components/global-mdx-theme`, `file-conventions/instrumentation/server-boot-log`, `file-conventions/instrumentation/client-timing-metrics`, `file-conventions/proxy/gateway-router`, `components/image/blur-placeholder`, `components/image/priority-lcp-preload`, `components/link/soft-navigation-scroll`, `components/link/prefetch-options`, `components/font/google-variable-tokens`, `components/font/local-font-face`, `components/script/loading-strategies`, `components/script/pg-sdk-onload`, `functions/use-router/push-replace`, `functions/use-router/refresh-server-sync`, `functions/use-search-params/filter-parsing`, `functions/use-search-params/debounce-transition`, `functions/cache-life/preset-profiles`, `functions/cache-life/custom-profile`, `functions/cache-tag/multi-tag-binding`, `functions/cache-tag/cascade-invalidation`, `functions/unstable-cache/db-query`, `functions/unstable-no-store/dynamic-bailout`, `functions/revalidate-path/page-vs-layout`, `functions/revalidate-path/dynamic-route`, `functions/revalidate-tag/basic-tag-purge`, `functions/revalidate-tag/max-expiration`, `functions/update-tag/instant-memory-sync`, `functions/fetch-extended/revalidate-option`, `functions/fetch-extended/tag-option`, `functions/cookies/get-set-session`, `functions/cookies/delete-logout`, `functions/draft-mode/enable-preview`, `functions/draft-mode/disable-preview`, `functions/after/background-logging`, `functions/after/analytics-batch`, `functions/image-response/dynamic-receipt`(개념오류·오복붙), `functions/server-runtime/edge-vs-nodejs`, `functions/use-report-web-vitals/telemetry`, `functions/use-server-inserted-html/head-style`, `directives/use-client/boundary-declaration`, `directives/use-client/window-storage-access`, `directives/use-server/file-level-action`, `directives/use-server/inline-action-closure`, `directives/use-cache/function-cache`, `directives/use-cache/component-jsx-cache`, `directives/use-cache/private-profile-cache`, `directives/use-cache/remote-redis-cache`, `config/redirects/regex-pattern-matching`(개념오류), `config/redirects/header-query-condition`(개념오류), `edge/v8-lightweight/nodejs-modules-bailout`(오복붙)

**5-architecture (5건)**: `architecture/accessibility/form-aria-support`, `architecture/accessibility/modal-focus-trap`, `architecture/compiler-optimization/react-compiler`(doc오배선 중복), `architecture/server-action-security/csrf-protection`(doc오배선 중복), `architecture/turbopack/incremental-harness`(doc오배선 중복)

### 4-2. 부분개선필요 (34건) — 우선순위 중간

형제 데모와 텍스트가 중복되거나, 섹션이 일부 누락되거나, 내용은 있으나 데모 고유 초점이 약한 경우.

`caching/basic`(완전 하드코딩은 아니나 개선 여지), `fetching-data/use-promise-streaming`(다른 데모 내용 혼입), `error-handling/segment-error`, `error-handling/global-error`(서로 복붙 + 주제 무관), `guides/forms/use-form-status-spinner`(복붙), `guides/swr/mutation-optimistic`(복붙+내용불일치), `guides/tanstack-query/infinite-scroll`(복붙+내용불일치), `file-conventions/loading/skeleton-boundary`(섹션누락), `file-conventions/not-found/missing-product-404`(섹션누락), `guides/i18n/subpath-routing`(복붙), `guides/i18n/dictionary-translation`(복붙), `guides/multi-tenant/subdomain-tenant`(복붙), `guides/tanstack-query/ssr-hydration`, `file-conventions/page/react-19-use-params`(개념오류, 위 4-1과 중복 집계 가능), `file-conventions/error/payment-error-boundary`(섹션누락), `file-conventions/forbidden/admin-role-403`(복붙), `file-conventions/unauthorized/anonymous-401`(복붙), `file-conventions/metadata-app-icons/dynamic-favicon`(섹션누락), `file-conventions/metadata-manifest/dynamic-pwa-manifest`(섹션누락), `file-conventions/metadata-og/discount-banner-og`(섹션누락), `file-conventions/metadata-robots/dynamic-crawler-rules`(섹션누락), `file-conventions/metadata-sitemap/split-index-sitemaps`(섹션누락), `file-conventions/parallel-routes/conditional-slot`(섹션누락, 경미), `functions/use-selected-layout-segment/subnav-pill`(복붙), `functions/use-selected-layout-segments/breadcrumb`(복붙), `functions/not-found/trigger-404`(복붙), `functions/forbidden/trigger-403`(복붙), `functions/unauthorized/trigger-401`(복붙), `functions/redirect/action-303`(복붙), `functions/redirect/handler-307`(복붙), `functions/permanent-redirect/seo-308`(복붙), `functions/image-response/og-badge`(복붙), `functions/generate-metadata/parent-inheritance`(복붙), `functions/generate-static-params/multiple-segments`(복붙), `config/base-path/subpath-routing`, `config/asset-prefix/cdn-distribution`, `config/rewrites/cross-zone-proxy`, `config/rewrites/query-param-rewrite`, `config/headers/global-security-headers`, `config/trailing-slash/url-normalization`, `config/images/remote-patterns-security`(이상 7건은 내용 자체는 양호하나 주의사항/팁 섹션 부재만 결함이라 "경미한개선필요"), `edge/v8-lightweight/global-web-apis`(화면-설명 불일치)

> 목록 중 일부는 4-1과 겹쳐 보일 수 있는데, 이는 판정 배치별로 "복붙되었지만 내용 자체 품질은 준수"인지 "복붙 + 내용도 부실"인지가 갈렸기 때문이다. 실제 착수 시에는 4-1을 우선 처리하고, 4-2는 그다음 순번으로 처리하면 된다.

### 4-3. 양호 (58건) — 참고용, 다른 데모의 콘텐츠 작성 템플릿으로 활용 권장

아래 데모들은 실제 API 시그니처·코드 경로·구체적 실무 시나리오를 담고 있어, 나머지 183건을 재작성할 때 **품질 기준선(참고 템플릿)**으로 삼을 만하다.

`server-actions/basic`, `caching/basic`(원조 PoC 2건), `metadata-and-og-images/static-and-dynamic-metadata`, `metadata-and-og-images/opengraph-image`, `route-handlers/rest-api-crud`, `route-handlers/streaming-sse`, `proxy/rewrite-and-headers`, `guides/server-actions-advanced`, `file-conventions/intercepting-routes`, `guides/forms/use-action-state-errors`, `guides/redirecting/order-complete`, `guides/redirecting/session-expired`, `guides/data-security/react-taint-api`, `file-conventions/error/payment-error-boundary`, `file-conventions/not-found/programmatic-not-found`, `file-conventions/template/remount-lifecycle`, `functions/headers/user-agent-device`, `functions/headers/custom-auth-token`, `file-conventions/route/rest-api-orders`, `file-conventions/route/webhook-signature`, `file-conventions/route/sse-stock-stream`, `file-conventions/route-groups/group-url-isolation`, `file-conventions/dynamic-segments/single-param`, `file-conventions/dynamic-segments/catch-all-slug`, `file-conventions/dynamic-segments/optional-catch-all`, `file-conventions/parallel-routes/conditional-slot`, `file-conventions/route-segment-config/dynamic-params-toggle`, `file-conventions/route-segment-config/instant-prefetch`(단, API 실재 여부 확인 필요), `file-conventions/route-segment-config/max-duration-timeout`, `file-conventions/route-segment-config/runtime-nodejs-edge`, `functions/use-pathname/active-link`, `functions/use-params/client-id`, `functions/next-request/geo-ip-parsing`(주의사항 내장 유일 사례), `functions/next-response/json-builder`, `functions/next-response/rewrite-virtual`, `functions/generate-metadata/dynamic-title`, `functions/generate-static-params/basic-ssg`, `functions/connection/request-signal`, `functions/taint-unique-value/block-secret`, `config/rewrites/cross-zone-proxy`, `config/rewrites/query-param-rewrite`, `config/headers/global-security-headers`, `config/trailing-slash/url-normalization`, `config/images/remote-patterns-security`, `config/base-path/subpath-routing`, `config/asset-prefix/cdn-distribution`, `config/images/formats-avif-webp`, `config/logging/fetches-full-url`, `config/dev-indicators/render-badge`, `config/env/build-time-injection`(단, 시크릿 격리 서술 재검토 필요), `config/cross-origin/anonymous-mode`, `config/powered-by-header/hide-x-powered`, `config/cache-components/enable-flag`, `config/cache-life/custom-presets`, `config/cache-handlers/redis-kv`, `config/expire-time/memory-isr-tuning`, `config/stale-times/router-cache-tuning`, `config/output/standalone-container`, `config/output/export-static-spa`

## 5. 권고 우선순위

1. **개념 오류 6건 최우선 수정**: `file-conventions/page/react-19-use-params`, `guides/server-actions/start-transition`, `functions/image-response/dynamic-receipt`, `config/redirects/regex-pattern-matching`, `config/redirects/header-query-condition`, `edge/v8-lightweight/nodejs-modules-bailout` — 단순히 부실한 게 아니라 **학습자에게 틀린 개념을 가르치는** 상태다.
2. **149건 전면재작성**: 4-1 목록을 대상으로, 6절의 "양호 58건"을 품질 기준선 삼아 데모별 실제 API 동작·코드 경로·데모 화면 특화 시나리오로 다시 쓴다. `guides/*` 그룹의 비중이 가장 크다.
3. **"주의사항/팁" 섹션을 5번째 섹션으로 신설**: `DemoDeepDiveCard`를 쓰는 모든 데모(241건)에 공통 적용되는 구조적 공백이다. `functions/next-request/geo-ip-parsing`의 사례(로컬/프록시 환경 유의사항)를 참고 삼아, API별로 실제 흔히 겪는 함정(예: `redirect()`를 `try/catch`로 감싸면 안 됨, `cacheTag`는 `cacheLife`와 함께 써야 함 등)을 채워 넣는 별도 작업이 필요하다.
4. **34건 부분개선**: 복붙된 형제 데모는 각자의 고유 차이점 위주로 섹션 2를 다시 쓰고, 섹션 누락 항목은 "언제 사용" 섹션을 추가한다.
5. **기술 정확성 재검증 2건**: `config/env/build-time-injection`의 시크릿 격리 서술, `file-conventions/route-segment-config/instant-prefetch`의 `export const instant` API 실재 여부는 Next.js 16.3.1 공식 문서(next-devtools MCP 등)로 별도 교차 검증 후 수정한다.

## 6. 이전 감사 보고서([10-demo-audit-report.md](./10-demo-audit-report.md)) 정정 사항

이번 4단 전용 재검증 과정에서 이전 3단 감사 보고서의 아래 두 기록이 사실과 다름을 확인했다.

- `route-handlers/rest-api-crud`: 이전 보고서는 "4단 DeepDive 내용이 headers()/GeoIP 주제로 REST CRUD와 무관"이라고 기록했으나, 이번에 원문을 재확인한 결과 route.ts의 Request/Response 표준과 GET/POST/PATCH/DELETE 각 동작을 정확히 설명하고 있어 **양호** 판정이다.
- `route-handlers/streaming-sse`: 이전 보고서는 "4단이 rest-api-crud와 완전 동일한 headers/GeoIP 텍스트 복붙"이라고 기록했으나, 이번 재확인 결과 ReadableStream/TextEncoder, `text/event-stream` 헤더, EventSource 재연결까지 구체적으로 설명하는 **양호** 콘텐츠였다.

두 건 모두 이전 감사(배치 단위 병렬 조사)에서의 오판으로 보이며, 두 보고서를 함께 참고할 때는 이 정정 사항을 우선한다. 이 보고서는 코드 변경 없이 재검증한 결과만 반영했으며, `10-demo-audit-report.md` 파일 자체는 수정하지 않았다.
