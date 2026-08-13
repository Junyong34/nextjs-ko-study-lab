# File-system conventions

- 공식 문서: [File-system conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- 상위 메뉴: [API Reference](../README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- App Router의 특수 파일과 폴더 이름이 route tree 동작을 결정하는 방식을 이해합니다.
- UI 경계, routing 패턴, project root 파일, metadata, segment 설정을 목적에 맞게 선택합니다.
- 각 규칙의 위치·export·runtime 제약을 공식 API 계약에 맞춰 적용합니다.

## 핵심 개념 및 설명

File-system conventions는 디렉터리 구조를 라우트 구조와 실행 경계로 바꿉니다. `layout`, `page`, `loading`, `error`, `not-found`, `template`, `default`는 UI 계층을 구성합니다. `route`는 Web API endpoint를 만들고, Route Groups·Dynamic Segments·Parallel Routes·Intercepting Routes는 URL과 화면 조합 방식을 확장합니다.

프로젝트 root에는 `src`, `public`, `mdx-components`, instrumentation, Proxy 같은 규칙이 있습니다. Metadata Files는 icon·manifest·social image·crawler 문서를 만들며, Route Segment Config는 page·layout·Route Handler의 실행과 내비게이션 특성을 상수 export로 조정합니다. 아래 순서는 파일 계층의 기본부터 고급 라우팅, root 통합, metadata와 설정 순으로 학습하도록 재배열했습니다.

## 학습 순서

> 공식 사이드바는 알파벳순이지만, 학습 순서는 의존성·난이도 기준으로 재배열했습니다 ([ADR 0002](../../docs/adr/0002-reorder-learning-sequence.md)).

- 3.1.1 [layout.js](./layout.md)
- 3.1.2 [page.js](./page.md)
- 3.1.3 [loading.js](./loading.md)
- 3.1.4 [error.js](./error.md)
- 3.1.5 [not-found.js](./not-found.md)
- 3.1.6 [template.js](./template.md)
- 3.1.7 [default.js](./default.md)
- 3.1.8 [route.js](./route.md)
- 3.1.9 [Route Groups](./route-groups.md)
- 3.1.10 [Dynamic Segments](./dynamic-routes.md)
- 3.1.11 [Parallel Routes](./parallel-routes.md)
- 3.1.12 [Intercepting Routes](./intercepting-routes.md)
- 3.1.13 [src](./src-folder.md)
- 3.1.14 [public](./public-folder.md)
- 3.1.15 [mdx-components.js](./mdx-components.md)
- 3.1.16 [instrumentation.js](./instrumentation.md)
- 3.1.17 [instrumentation-client.js](./instrumentation-client.md)
- 3.1.18 [proxy.js](./proxy.md)
- 3.1.19 [forbidden.js](./forbidden.md)
- 3.1.20 [unauthorized.js](./unauthorized.md)

## 하위 카테고리

### 3.1.21 Metadata Files

- [Metadata Files 목차](./3.1.21-metadata/README.md)
- 3.1.21.1 [favicon, icon, and apple-icon](./3.1.21-metadata/app-icons.md)
- 3.1.21.2 [manifest.json](./3.1.21-metadata/manifest.md)
- 3.1.21.3 [opengraph-image and twitter-image](./3.1.21-metadata/opengraph-image.md)
- 3.1.21.4 [robots.txt](./3.1.21-metadata/robots.md)
- 3.1.21.5 [sitemap.xml](./3.1.21-metadata/sitemap.md)

### 3.1.22 Route Segment Config

- [Route Segment Config 목차](./3.1.22-route-segment-config/README.md)
- 3.1.22.1 [dynamicParams](./3.1.22-route-segment-config/dynamicParams.md)
- 3.1.22.2 [instant](./3.1.22-route-segment-config/instant.md)
- 3.1.22.3 [maxDuration](./3.1.22-route-segment-config/maxDuration.md)
- 3.1.22.4 [prefetch](./3.1.22-route-segment-config/prefetch.md)
- 3.1.22.5 [runtime](./3.1.22-route-segment-config/runtime.md)
- 3.1.22.6 [preferredRegion (deprecated)](./3.1.22-route-segment-config/preferredRegion.md)

## 예제 및 데모 설계

- Phase 2에서 하나의 route tree에 UI 특수 파일을 단계적으로 추가해 컴포넌트 계층을 시각화합니다.
- 고급 routing과 metadata·설정은 각 하위 문서의 network, 상태 코드, build output 검증 시나리오로 확인합니다.

## 연습 문제

1. 공개 route UI와 HTTP endpoint를 각각 만드는 파일 조합은?
   - A. `page.js`, `route.js`
   - B. `layout.js`, `template.js`
   - C. `loading.js`, `error.js`

<details><summary>정답 보기</summary>

정답: A. page는 route UI를, Route Handler는 HTTP 요청 처리를 정의합니다.
</details>

## 챕터 요약

- 파일과 폴더 이름이 App Router의 route tree를 정의합니다.
- UI 특수 파일은 중첩된 렌더링 경계를 구성합니다.
- route 폴더 규칙은 URL 매칭과 화면 조합을 확장합니다.
- root 파일은 asset, MDX, 관측, 요청 전처리를 통합합니다.
- metadata와 segment 설정은 비-UI 응답과 실행 동작을 제어합니다.
