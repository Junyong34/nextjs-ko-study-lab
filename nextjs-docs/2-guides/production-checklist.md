# Production

- 공식 문서: [Production](https://nextjs.org/docs/app/guides/production-checklist)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js가 기본으로 제공하는 프로덕션 최적화와 애플리케이션에서 직접 점검할 항목을 구분한다.
- 개발 중 라우팅·데이터·UI·보안·SEO·타입 안전성을 점검한다.
- 배포 전에 프로덕션 빌드, Core Web Vitals, 번들 크기를 검증하는 절차를 세운다.

## 핵심 개념 및 설명

프로덕션 준비는 배포 직전의 한 번짜리 검사가 아니다. Next.js의 기본 최적화를 이해하고, 개발 중에 올바른 패턴을 적용한 뒤, 실제 프로덕션 빌드로 성능과 오류를 확인하는 과정이다.

### 자동 최적화

Next.js는 별도 설정 없이 다음 최적화를 제공한다.

- **[Server Components](../1-getting-started/server-and-client-components.md)**: 기본 컴포넌트 모델이며 서버에서 실행되므로 그 코드가 클라이언트 JavaScript 번들 크기에 영향을 주지 않는다. 상호작용이 필요한 곳만 Client Component로 만든다.
- **[코드 분할](../1-getting-started/linking-and-navigating.md#내비게이션이-동작하는-방식)**: Server Component는 라우트 세그먼트를 기준으로 자동 분할된다. 필요하면 Client Component와 서드파티 라이브러리도 [lazy loading](./lazy-loading.md)한다.
- **[prefetching](../1-getting-started/linking-and-navigating.md#prefetching)**: 새 라우트 링크가 뷰포트에 들어오면 백그라운드에서 라우트를 준비한다. 필요에 따라 끌 수 있다.
- **[prerendering](../4-glossary/README.md)**: Server Component와 Client Component의 초기 결과를 빌드 시점에 서버에서 렌더링하고 캐시한다. 요청별 값이 필요하면 해당 라우트에 [다이나믹 렌더링](../4-glossary/README.md)을 사용한다.
- **[캐싱](../1-getting-started/caching.md)**: 데이터 요청, 렌더링 결과, 정적 자산 등을 캐시해 서버와 데이터 소스에 보내는 요청을 줄인다. 데이터 성격에 따라 캐시에서 제외할 수 있다.

### 개발 중 점검

#### 라우팅과 렌더링

- [레이아웃](../3-api-reference/3.1-file-conventions/layout.md)으로 여러 페이지의 UI를 공유하고 내비게이션 중 부분 렌더링을 활용한다.
- 내부 이동에는 [`<Link>`](../3-api-reference/3.2-components/link.md)를 사용해 클라이언트 전환과 prefetching의 이점을 얻는다.
- [예상한 오류와 처리하지 못한 오류](../1-getting-started/error-handling.md), [404](../3-api-reference/3.1-file-conventions/not-found.md)를 각각 적절한 오류 UI로 처리한다.
- `"use client"` 경계를 필요한 상호작용 가까이에 두어 클라이언트 번들을 불필요하게 키우지 않는다. 자세한 구성은 [Server Component와 Client Component](../1-getting-started/server-and-client-components.md)에서 다룬다.
- [`cookies`](../3-api-reference/3.3-functions/cookies.md), [`searchParams`](../3-api-reference/3.1-file-conventions/page.md) 같은 요청 시점 API는 라우트를 다이나믹 렌더링으로 전환할 수 있다. 사용 의도를 확인하고 적절한 `<Suspense>` 경계를 둔다. [Root Layout](../3-api-reference/3.1-file-conventions/layout.md)에서 사용하면 애플리케이션 전체에 영향을 줄 수 있다.

> **알아두면 좋은 점**: 공식 문서는 [실험 단계의 Partial Prerendering](https://nextjs.org/blog/next-14#partial-prerendering-preview)이 라우트 전체를 다이나믹 렌더링으로 바꾸지 않고 일부만 다이나믹하게 만들 수 있다고 설명한다.

#### 데이터 가져오기와 캐싱

- [Server Component에서 데이터를 가져와](../1-getting-started/fetching-data.md) 서버의 데이터 소스에 직접 접근한다.
- Client Component가 백엔드 자원에 접근할 때 [Route Handler](../3-api-reference/3.1-file-conventions/route.md)를 사용할 수 있다. Server Component에서 Route Handler를 다시 호출하면 불필요한 서버 요청이 생기므로 피한다.
- [Loading UI](../3-api-reference/3.1-file-conventions/loading.md)와 React Suspense로 응답을 스트리밍해 하나의 느린 작업이 라우트 전체를 막지 않게 한다.
- 독립적인 데이터 요청은 [병렬로 시작](../1-getting-started/fetching-data.md#병렬-데이터-fetching)해 네트워크 워터폴을 줄인다.
- [데이터 요청이 캐시되는지](../1-getting-started/caching.md) 확인한다. `fetch`를 사용하지 않는 요청에도 필요한 캐싱을 적용한다.
- [`public` 디렉터리](../3-api-reference/3.1-file-conventions/public-folder.md)에는 이미지 같은 정적 자산을 둔다.

#### UI와 접근성

- [폼 제출](./forms.md)은 Server Action에서 처리하고 서버에서 입력을 다시 검증하며 오류를 다룬다.
- `app/global-error.tsx`로 애플리케이션 전체에서 처리하지 못한 오류에 일관되고 접근 가능한 fallback UI와 복구 수단을 제공한다. `app/global-not-found.tsx`로 일치하지 않는 라우트에 접근 가능한 404를 제공한다.
- [Font Module](../3-api-reference/3.2-components/font.md)은 폰트 파일을 정적 자산과 함께 자체 호스팅해 외부 요청을 없애고 layout shift를 줄인다.
- [`<Image>`](../3-api-reference/3.2-components/image.md)는 이미지를 자동 최적화하고 layout shift를 막으며 WebP 같은 현대적 형식으로 제공한다.
- [`<Script>`](./scripts.md)는 서드파티 스크립트를 자동으로 지연해 main thread를 막지 않게 한다.
- [`eslint-plugin-jsx-a11y`](../5-architecture/accessibility.md)로 접근성 문제를 개발 초기에 찾는다.

#### 보안

- [taint API](../3-api-reference/3.5-config/3.5.1-next-config-js/taint.md)로 민감한 객체나 값이 클라이언트에 전달되는 것을 막는다.
- 각 [Server Action](../1-getting-started/mutating-data.md) 안에서 인증과 인가를 다시 검사한다. Proxy나 레이아웃·페이지 검사를 유일한 방어선으로 삼지 않는다.
- 데이터베이스 접근은 `server-only` [Data Access Layer](./data-security.md)에 모으고 비용이 큰 작업에는 [rate limiting](./backend-for-frontend.md)을 검토한다.
- [.env.*](./environment-variables.md)를 Git에서 제외하고 브라우저에 공개할 값에만 `NEXT_PUBLIC_` 접두사를 붙인다.
- [Content Security Policy](./content-security-policy.md)로 XSS, clickjacking, 코드 삽입 공격을 완화한다.

#### 메타데이터, SEO, 타입 안전성

- [Metadata API](../1-getting-started/metadata-and-og-images.md)로 제목과 설명을 제공하고 공유용 [Open Graph 이미지](../3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md)를 준비한다.
- [sitemap](../3-api-reference/3.3-functions/generate-sitemaps.md)과 [robots](../3-api-reference/3.1-file-conventions/3.1.21-metadata/robots.md) 파일을 생성해 검색 엔진의 크롤링과 색인을 돕는다.
- [TypeScript와 Next.js TypeScript 플러그인](../3-api-reference/3.5-config/3.5.1-next-config-js/typescript.md)으로 잘못된 사용을 조기에 찾는다.

### 프로덕션 전 점검

먼저 `next build`로 로컬 프로덕션 빌드를 실행해 빌드 오류를 찾는다. 이어 `next start`로 프로덕션과 비슷한 환경에서 실행하고 성능을 측정한다.

#### Core Web Vitals

- 시크릿 창에서 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)를 실행해 실험실 데이터를 확인한다. 시뮬레이션 결과만으로 결론 내리지 않고 실제 사용자의 [Core Web Vitals](https://web.dev/articles/vitals) 같은 필드 데이터와 함께 본다.
- [`useReportWebVitals`](../3-api-reference/3.3-functions/use-report-web-vitals.md)로 Web Vitals를 분석 도구에 전송한다.

#### 번들 분석

[`@next/bundle-analyzer`](./package-bundling.md)로 JavaScript 번들의 크기와 큰 모듈을 찾는다. [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost), [Package Phobia](https://packagephobia.com/), [Bundle Phobia](https://bundlephobia.com/), [bundlejs](https://bundlejs.com/) 같은 도구도 새 의존성이 번들에 미치는 영향을 파악하는 데 활용할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 의도적으로 큰 Client Component와 서버 전용 버전을 만들어 번들 차이를 비교한다.
- `next build`와 `next start` 결과, Lighthouse 실험실 지표, `useReportWebVitals` 필드 이벤트를 한 화면에 기록한다.
- 요청 시점 API를 Root Layout과 하위 `<Suspense>` 경계에서 각각 사용해 렌더링 범위 차이를 확인한다.
- 오류, 404, 느린 데이터, 잘못된 폼 입력, CSP 위반을 재현하는 프로덕션 점검 페이지를 만든다.

## 연습 문제

1. Server Component가 클라이언트 JavaScript 번들에 미치는 영향으로 맞는 것은?

   - A. 모든 Server Component 코드가 번들에 포함된다.
   - B. 서버에서 실행되므로 그 코드가 클라이언트 번들 크기에 영향을 주지 않는다.
   - C. `next start`에서만 번들에서 제외된다.

   <details><summary>정답 보기</summary>

   정답: B. Server Component는 서버에서 실행되며 상호작용이 필요한 부분만 Client Component로 보낸다.

   </details>

2. Server Component에서 Route Handler를 호출하지 않는 것이 권장되는 이유는?

   - A. Route Handler는 GET을 지원하지 않기 때문이다.
   - B. 서버 내부에서 불필요한 추가 HTTP 요청이 생기기 때문이다.
   - C. Route Handler는 Client Component 전용이기 때문이다.

   <details><summary>정답 보기</summary>

   정답: B. Server Component에서는 데이터 소스에 직접 접근해 추가 서버 왕복을 피한다.

   </details>

3. 배포 전 성능 검증으로 가장 적절한 것은?

   - A. 개발 서버의 Lighthouse 결과만 확인한다.
   - B. `next build`만 성공하면 성능 검증을 끝낸다.
   - C. 프로덕션과 비슷한 실행 환경에서 실험실 데이터와 필드 데이터를 함께 본다.

   <details><summary>정답 보기</summary>

   정답: C. 시뮬레이션 결과는 실제 사용자 데이터와 함께 해석해야 한다.

   </details>

## 챕터 요약

- Next.js는 Server Components, 코드 분할, prefetching, prerendering, 캐싱을 기본 제공한다.
- 개발 중에는 라우팅·데이터·접근성·보안·SEO·타입 안전성을 지속적으로 점검한다.
- 요청 시점 API와 `"use client"` 경계는 렌더링 방식과 번들 크기에 직접 영향을 준다.
- 배포 전에는 `next build`와 `next start`로 프로덕션 동작을 검증한다.
- Lighthouse, 필드 Web Vitals, 번들 분석 결과를 함께 사용한다.
