# instrumentation-client.js

- 공식 문서: [instrumentation-client.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 앱이 상호작용 가능해지기 전 client instrumentation을 초기화한다.
- App Router transition을 관측하고 bundle 성능 비용을 관리한다.

## 핵심 개념 및 설명

`instrumentation-client.js|ts`는 monitoring, analytics, polyfill 같은 client-side side effect를 애플리케이션이 interactive해지기 전에 실행한다. 프로젝트 root 또는 `src` 안에 두며 필수 export 없이 top-level에 코드를 쓸 수 있다. 한 기능의 실패가 다른 관측 코드를 막지 않도록 try/catch로 격리한다.

`onRouterTransitionStart(url, navigationType)`를 export하면 `push`, `replace`, `traverse` 내비게이션 시작을 관찰할 수 있다. 추가 transition event는 experimental 설정을 켰을 때만 세 번째 인자로 제공된다.

experimental event에는 transition의 opaque `id`, framework가 기록한 `timestamp`, 출발 route 목록인 `fromRoutes`, prefetch 의도인 `prefetchIntent`가 포함된다. 이 정보는 개별 내비게이션의 시작과 후속 성능 event를 연결할 때 사용한다.

이 파일은 initial client bundle에 포함되므로 가볍게 유지한다. 무거운 라이브러리는 dynamic import하고, 긴 동기 작업과 불필요한 전역 listener를 피한다. module evaluation은 hydration 전이지만 HTML parsing 뒤에 실행될 수 있으므로 DOM 존재 시점을 가정하지 않는다.

오류 추적, analytics 초기화, Web Performance API 관측, application code보다 먼저 필요한 polyfill이 대표 사용 사례다. 브라우저 전용 API를 사용하되 각 초기화 블록을 독립적으로 실패 처리한다.

## 예제 및 데모 설계

- Phase 2에서 navigation type과 URL을 log하고 push/back 동작을 비교한다.
- `performance.mark`와 error listener를 추가하되 의도적인 provider 실패를 격리한다.
- 무거운 SDK의 dynamic import 전후 초기 bundle 크기를 비교한다.

## 연습 문제

1. 파일 성능 관리로 적절한 것은?
   - A. 모든 SDK를 동기 import한다.
   - B. 무거운 SDK는 dynamic import한다.
   - C. DOM이 항상 준비됐다고 가정한다.

<details><summary>정답 보기</summary>

정답: B. initial client bundle 비용을 낮춰야 한다.
</details>

## 챕터 요약

- client instrumentation은 hydration 전에 초기화된다.
- top-level 코드로 monitoring과 polyfill을 설정할 수 있다.
- `onRouterTransitionStart`로 App Router 내비게이션을 관찰한다.
- 추가 transition event는 experimental이다.
- 초기 bundle에 포함되므로 파일을 가볍고 격리된 구조로 유지한다.
