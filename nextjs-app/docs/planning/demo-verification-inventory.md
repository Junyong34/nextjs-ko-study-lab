# 데모 검증 전수 인벤토리 (241개 데모 종합 기록)

이 문서는 Next.js App Router 학습 커리큘럼 내 241개 데모 전체를 대상으로 수행한 검증 가능성, 유형 분류, 실행 결과, 4대 영역 수정 판정을 기록한 인벤토리다. [241개 데모 검증 전수 점검 절차](../18-demo-verification-audit-playbook.md)의 감사 규칙과 [데모 검증 유형 분석 및 개선 설계](../17-demo-verification-type-design.md)의 5대 유형 체계를 따른다.

문서 크기 관리를 위해 데모별 상세 기록은 5개 파트 문서로 분리했다. 이 인덱스 문서는 실행 정보, 작업 배치 상태, 집계, 전체 241개 데모 요약 목록만 담는다.

## 점검 실행 정보

| 항목 | 값 |
|---|---|
| Git 커밋 | `62ac1a6` |
| 브랜치 | `main` |
| Next.js 기준 버전 | `16.3.2` |
| 실행 모드 | `development` / `production` 코드 정적 분석 및 심층 검증 |
| 브라우저 | Playwright Chromium, Chrome 151.0.0.0 |
| 운영체제 | macOS 26.0.1 (25A362) |
| 실행 zone·포트 | baseline: 3001, cache: 3002 |
| 점검 일시 | 2026-08-28 22:20 KST |
| 점검자 | Codex, Antigravity |

실행은 각 URL을 새로 열어 시작했다. 서버 메모리 상태를 쓰는 데모는 끝에서 목록 초기화를 수행했다. 개발 서버의 Network, 브라우저 콘솔, Next DevTools 진단과 접근성 스냅샷을 함께 사용했으며, B01~B20의 정상·실패 증거는 각 상세 기록에 서술했다.


## 작업 배치

| 배치 | 데모 번호 | 상태 |
|---|---:|---|
| B01 | 1–10 | 완료 |
| B02 | 11–20 | 완료 |
| B03 | 21–30 | 완료 |
| B04 | 31–40 | 완료 |
| B05 | 41–50 | 완료 |
| B06 | 51–60 | 완료 |
| B07 | 61–70 | 완료 |
| B08 | 71–80 | 완료 |
| B09 | 81–90 | 완료 |
| B10 | 91–100 | 완료 |
| B11 | 101–110 | 완료 |
| B12 | 111–120 | 완료 |
| B13 | 121–130 | 완료 |
| B14 | 131–140 | 완료 |
| B15 | 141–150 | 완료 |
| B16 | 151–160 | 완료 |
| B17 | 161–170 | 완료 |
| B18 | 171–180 | 완료 |
| B19 | 181–190 | 완료 |
| B20 | 191–200 | 완료 |
| B21 | 201–210 | 완료 |
| B22 | 211–220 | 완료 |
| B23 | 221–230 | 완료 |
| B24 | 231–240 | 완료 |
| B25 | 241 | 완료 |


## 집계

| 항목 | 개수 |
|---|---:|
| 전체 데모 | 241 |
| 점검 완료 | 241 |
| verified | 20 |
| mismatch | 219 |
| unverifiable | 0 |
| execution-error | 0 |
| blocked-by-environment | 2 |


## 파트 문서

| 파트 | 배치 | 데모 번호 | 링크 |
|---|---|---:|---|
| 1 | B01-B05 | 1-50 | [demo-verification-inventory-part1-b01-b05.md](./demo-verification-inventory-part1-b01-b05.md) |
| 2 | B06-B10 | 51-100 | [demo-verification-inventory-part2-b06-b10.md](./demo-verification-inventory-part2-b06-b10.md) |
| 3 | B11-B15 | 101-150 | [demo-verification-inventory-part3-b11-b15.md](./demo-verification-inventory-part3-b11-b15.md) |
| 4 | B16-B20 | 151-200 | [demo-verification-inventory-part4-b16-b20.md](./demo-verification-inventory-part4-b16-b20.md) |
| 5 | B21-B25 | 201-241 | [demo-verification-inventory-part5-b21-b25.md](./demo-verification-inventory-part5-b21-b25.md) |


## 데모 목록

| URL | 대표 유형 후보 | 실행 결과 | 가이드 | 데모 예제 | 검증 | 개념 정리 | 최고 심각도 |
|---|---|---|---|---|---|---|---|
| server-actions/basic | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| caching/basic | 전후 변화 | mismatch | 수정 반영 | 수정 필요 | 수정 필요 | 수정 반영 | high |
| layouts-and-pages/nested-layouts | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| layouts-and-pages/template-lifecycle | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| layouts-and-pages/route-groups-layouts | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| linking-and-navigating/soft-navigation | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| linking-and-navigating/router-prefetch | 외부 도구·환경 확인 | blocked-by-environment | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| server-client-components/composition | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| server-client-components/serialization | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| fetching-data/parallel-fetching | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| fetching-data/use-promise-streaming | 화면 관찰 | mismatch | 수정 필요 | 정상 | 수정 필요 | 수정 필요 | high |
| mutating-data/server-action-revalidate | 전후 변화 | mismatch | 수정 필요 | 정상 | 수정 필요 | 수정 필요 | high |
| mutating-data/optimistic-cart | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| revalidating/time-based-isr | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| revalidating/tag-vs-path | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| error-handling/segment-error | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| error-handling/global-error | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| css/tailwind-v4 | 화면 관찰 | mismatch | 수정 필요 | 정상 | 수정 필요 | 수정 필요 | high |
| css/css-modules | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| images/image-optimization | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| fonts/font-optimization | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| metadata-and-og-images/static-and-dynamic-metadata | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| metadata-and-og-images/opengraph-image | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| route-handlers/rest-api-crud | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | medium |
| route-handlers/streaming-sse | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | medium |
| proxy/rewrite-and-headers | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/streaming-nested | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/server-actions-advanced | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | medium |
| guides/swr-polling | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/lazy-loading-chart | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | medium |
| guides/auth-session | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/parallel-routes | 화면 관찰 | mismatch | 수정 필요 | 정상 | 수정 필요 | 정상 | high |
| file-conventions/intercepting-routes | 화면 관찰 | mismatch | 수정 필요 | 정상 | 수정 필요 | 정상 | medium |
| components/form-component | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/fast-refresh-boundary | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/rendering-philosophy/server-vs-client | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/server-and-client-boundary/children-slot | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/how-revalidation-works/swr-flow | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/caching-legacy/fetch-cache | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/streaming/chunk-loading | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/isr/time-isr-60s | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/isr-cache-components/cache-life-hours | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/migrating-cache-components/unstable-to-use-cache | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/adopting-partial-prefetching/hover-shell | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/auth-cache-components/static-layout-session-context | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/forms/use-action-state-errors | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| guides/forms/use-form-status-spinner | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| guides/server-actions/start-transition | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | high |
| guides/swr/mutation-optimistic | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/tanstack-query/infinite-scroll | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/redirecting/order-complete | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/draft-mode/preview-toggle | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/prefetching/viewport-vs-hover | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/layout/root-and-nested | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| file-conventions/loading/skeleton-boundary | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | high |
| file-conventions/not-found/missing-product-404 | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | high |
| components/image/responsive-sizes | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/rendering-philosophy/hydration-boundary | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/server-and-client-boundary/props-serialization | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/how-revalidation-works/ondemand-sync | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| guides/caching-legacy/segment-revalidate | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/isr/revalidate-path-sync | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | high |
| guides/isr-cache-components/precision-tag-purge | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/migrating-cache-components/cache-key-compare | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| guides/auth-cache-components/private-cache-user | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/tanstack-query/ssr-hydration | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/redirecting/session-expired | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/draft-mode/bypass-cookie | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/prefetching/custom-prefetch-false | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/optimizing-prefetching/bandwidth-saver | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/instant-navigation/loading-skeleton | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/instant-navigation/router-cache-back | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/lazy-loading/modal-dynamic | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/preserving-ui-state/drawer-open | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/preserving-ui-state/scroll-retention | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/preventing-flash/darkmode-script | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/view-transitions/zoom-card | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/css-in-js/style-registry | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/sass/promotions-theme | 값 비교 | mismatch | 수정 필요 | 정상 | 수정 필요 | 수정 필요 | high |
| guides/authentication/middleware-guard | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| guides/authentication/middleware-guard | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/authentication/rsc-user-profile | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/data-security/server-only-guard | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/data-security/react-taint-api | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/content-security-policy/nonce-injection | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/environment-variables/public-vs-server | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/environment-variables/runtime-env | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/json-ld/product-schema | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/interactive-apps/multi-filter-widget | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/scripts/strategy-order | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/scripts/pg-sdk-onload | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/mdx/product-tech-doc | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/mdx/custom-component-slot | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/third-party-libraries/google-analytics | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/third-party-libraries/youtube-embed | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/bff/order-aggregation | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/bff/response-shaping | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/pwas/app-install-prompt | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/i18n/subpath-routing | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/i18n/dictionary-translation | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/multi-tenant/subdomain-tenant | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/multi-tenant/isolated-branding | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/multi-zones/cross-zone-routing | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/instrumentation/server-register-hook | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/opentelemetry/trace-span | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/static-exports/client-routing | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/static-exports/ssg-catalog | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/public-pages/terms-ssg | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/analytics/custom-beacon | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| guides/videos/lazy-video-player | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/layout/state-preservation | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/layout/dynamic-category-layout | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/page/static-and-dynamic | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/page/react-19-use-params | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/loading/nested-segment-loading | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/error/payment-error-boundary | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| file-conventions/error/reset-recovery | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/not-found/programmatic-not-found | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/template/remount-lifecycle | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| file-conventions/template/input-reset-animation | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/default/hard-reload-restore | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/route/rest-api-orders | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/route/webhook-signature | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/route/sse-stock-stream | 전후 변화 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/route-groups/group-url-isolation | 화면 관찰 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/route-groups/shop-vs-admin-roots | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/dynamic-segments/single-param | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/dynamic-segments/catch-all-slug | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/dynamic-segments/optional-catch-all | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| file-conventions/parallel-routes/conditional-slot | 화면 관찰 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/parallel-routes/independent-tabs | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/intercepting-routes/direct-vs-modal | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/mdx-components/global-mdx-theme | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/instrumentation/server-boot-log | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/instrumentation/client-timing-metrics | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/proxy/gateway-router | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/forbidden/admin-role-403 | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/unauthorized/anonymous-401 | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/metadata-app-icons/dynamic-favicon | 산출물·설정 확인 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/metadata-manifest/dynamic-pwa-manifest | 산출물·설정 확인 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/metadata-og/discount-banner-og | 산출물·설정 확인 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/metadata-robots/dynamic-crawler-rules | 산출물·설정 확인 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/metadata-sitemap/split-index-sitemaps | 산출물·설정 확인 | verified | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| file-conventions/route-segment-config/dynamic-params-toggle | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/route-segment-config/instant-prefetch | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/route-segment-config/max-duration-timeout | 산출물·설정 확인 | blocked-by-environment | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| file-conventions/route-segment-config/runtime-nodejs-edge | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/image/blur-placeholder | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/image/priority-lcp-preload | 전후 변화 | verified | 정상 | 정상 | 정상 | 수정 필요 | medium |
| components/link/soft-navigation-scroll | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/link/prefetch-options | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/font/google-variable-tokens | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/font/local-font-face | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/script/loading-strategies | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| components/script/pg-sdk-onload | 전후 변화 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| functions/use-router/push-replace | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-router/refresh-server-sync | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-pathname/active-link | 화면 관찰 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| functions/use-params/client-id | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-search-params/filter-parsing | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-search-params/debounce-transition | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-selected-layout-segment/subnav-pill | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/use-selected-layout-segments/breadcrumb | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cache-life/preset-profiles | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cache-life/custom-profile | 산출물·설정 확인 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cache-tag/multi-tag-binding | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cache-tag/cascade-invalidation | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/unstable-cache/db-query | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/unstable-no-store/dynamic-bailout | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/revalidate-path/page-vs-layout | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| functions/revalidate-path/dynamic-route | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/revalidate-tag/basic-tag-purge | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| functions/revalidate-tag/max-expiration | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/update-tag/instant-memory-sync | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/fetch-extended/revalidate-option | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/fetch-extended/tag-option | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cookies/get-set-session | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/cookies/delete-logout | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/headers/user-agent-device | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/headers/custom-auth-token | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| functions/draft-mode/enable-preview | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/draft-mode/disable-preview | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/after/background-logging | 전후 변화 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/after/analytics-batch | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/not-found/trigger-404 | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/forbidden/trigger-403 | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/unauthorized/trigger-401 | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/redirect/action-303 | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/redirect/handler-307 | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/permanent-redirect/seo-308 | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/next-request/geo-ip-parsing | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| functions/next-response/json-builder | 값 비교 | verified | 정상 | 정상 | 정상 | 정상 | none |
| functions/next-response/rewrite-virtual | 화면 관찰 | verified | 정상 | 정상 | 정상 | 정상 | none |
| functions/image-response/og-badge | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/image-response/dynamic-receipt | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/generate-metadata/dynamic-title | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/generate-metadata/parent-inheritance | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/generate-static-params/basic-ssg | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/generate-static-params/multiple-segments | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/connection/request-signal | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 정상 | high |
| functions/taint-unique-value/block-secret | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/server-runtime/edge-vs-nodejs | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-report-web-vitals/telemetry | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| functions/use-server-inserted-html/head-style | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| directives/use-client/boundary-declaration | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |
| directives/use-client/window-storage-access | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| directives/use-server/file-level-action | 값 비교 | mismatch | 수정 필요 | 정상 | 수정 필요 | 정상 | medium |
| directives/use-server/inline-action-closure | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| directives/use-cache/function-cache | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| directives/use-cache/component-jsx-cache | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| directives/use-cache/private-profile-cache | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| directives/use-cache/remote-redis-cache | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/base-path/subpath-routing | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/asset-prefix/cdn-distribution | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/redirects/regex-pattern-matching | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/redirects/header-query-condition | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/rewrites/cross-zone-proxy | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/rewrites/query-param-rewrite | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/headers/global-security-headers | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/trailing-slash/url-normalization | 값 비교 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/images/remote-patterns-security | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/images/formats-avif-webp | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/logging/fetches-full-url | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/dev-indicators/render-badge | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/env/build-time-injection | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/cross-origin/anonymous-mode | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/powered-by-header/hide-x-powered | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/cache-components/enable-flag | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | medium |
| config/cache-life/custom-presets | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/cache-handlers/redis-kv | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/expire-time/memory-isr-tuning | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/stale-times/router-cache-tuning | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/output/standalone-container | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| config/output/export-static-spa | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| edge/v8-lightweight/global-web-apis | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| edge/v8-lightweight/nodejs-modules-bailout | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/accessibility/form-aria-support | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/accessibility/modal-focus-trap | 화면 관찰 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/compiler-optimization/react-compiler | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/server-action-security/csrf-protection | 외부 도구·환경 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| architecture/turbopack/incremental-harness | 산출물·설정 확인 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
