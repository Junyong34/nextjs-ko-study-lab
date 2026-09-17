# instrumentationClientInject

- 공식 문서: [instrumentationClientInject](https://nextjs.org/docs/app/api-reference/config/next-config-js/instrumentationClientInject)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `instrumentationClientInject`가 클라이언트에서 side effect를 위해 모듈을 가져오는 시점을 이해한다.
- `next.config.js` 플러그인이 기존 프로젝트 설정을 보존하면서 계측 모듈을 추가하는 방법을 익힌다.
- 모듈 실행 순서와 `onRouterTransitionStart` 조합 규칙을 설명할 수 있다.

## 핵심 개념 및 설명

`instrumentationClientInject`는 사용자의 [`instrumentation-client.{js,ts}`](../../3.1-file-conventions/instrumentation-client.md) 파일이 실행되기 전에 클라이언트에서 side effect를 위해 가져올 모듈 목록이다. React hydration보다 먼저 실행된다.

이 옵션은 주로 **`next.config.js` 플러그인**을 위한 기능이다. 예를 들어 `withSentry`나 `withAnalytics`처럼 프로젝트 설정을 확장하는 wrapper가 자체 클라이언트 계측 모듈을 주입할 때 사용할 수 있다. 이 모듈에는 navigation hook도 포함할 수 있다. 이 방식 덕분에 모든 프로젝트가 `instrumentation-client` 파일을 직접 작성하거나 수정하지 않아도 플러그인이 자체 모듈을 주입한다. 일반적인 애플리케이션 코드는 계속 [`instrumentation-client.{js,ts}`](../../3.1-file-conventions/instrumentation-client.md) 파일 규칙을 직접 사용하는 편이 낫다.

플러그인은 보통 프로젝트에 이미 설정된 값에 자체 모듈을 추가한다.

`withMyInstrumentation.js`

```js
module.exports = function withMyInstrumentation(nextConfig = {}) {
  return {
    ...nextConfig,
    instrumentationClientInject: [
      ...(nextConfig.instrumentationClientInject ?? []),
      'my-instrumentation-package/client',
    ],
  }
}
```

직접 설정할 수도 있다.

`next.config.js`

```js
/** @type {import('next').NextConfig} */
module.exports = {
  instrumentationClientInject: [
    'my-analytics-package',
    './lib/sentry-client.js',
  ],
}
```

각 항목은 다음 중 하나다.

- 프로젝트의 `node_modules`에서 해석하는 bare npm package name
- 프로젝트 루트를 기준으로 한 경로

## Execution order (실행 순서)

모듈은 클라이언트에서 다음 순서로 실행된다.

1. `instrumentationClientInject`의 각 항목을 배열 순서대로 실행한다.
2. 프로젝트에 `instrumentation-client.{js,ts}` 파일이 있으면 실행한다.
3. React hydration을 실행한다.

## Router navigation hook (Router 내비게이션 훅)

각 injected module은 `onRouterTransitionStart` 함수를 선택적으로 export할 수 있다. 시그니처는 [`instrumentation-client` 파일 규칙의 Router navigation tracking](../../3.1-file-conventions/instrumentation-client.md#router-navigation-tracking)에서 설명한 것과 같다. Next.js는 각 내비게이션에서 export된 모든 `onRouterTransitionStart`를 호출하도록 하나의 hook을 조합한다. 호출 순서는 배열 순서이며 사용자 파일의 hook이 마지막에 실행된다.

`lib/sentry-client.js`

```js
// 부수 효과가 있는 설정은 로드 시점에 실행된다.
setupSentry()

export function onRouterTransitionStart(url, navigationType) {
  recordNavigationBreadcrumb(url, navigationType)
}
```

`onRouterTransitionStart`를 export하지 않는 모듈은 내비게이션 중에 건너뛴다.

## Version history (버전 기록)

| 버전 | 변경 사항 |
| --- | --- |
| v16.3.0 | `instrumentationClientInject`를 추가했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `instrumentationClientInject` 배열에 두 모듈을 등록하고 각 모듈과 `instrumentation-client.{js,ts}`에서 실행 로그를 남긴다. 브라우저 콘솔에서 배열 순서, 사용자 파일, React hydration 순서를 비교한다.
- `onRouterTransitionStart`를 export한 모듈과 export하지 않은 모듈을 함께 등록하고 Router 내비게이션마다 어떤 모듈의 hook이 호출되는지 확인한다.

## 연습 문제

1. 클라이언트 모듈 실행 순서를 올바르게 나열한 것은?
   - A. React hydration → `instrumentation-client.{js,ts}` → `instrumentationClientInject`
   - B. `instrumentationClientInject` → `instrumentation-client.{js,ts}` → React hydration
   - C. `instrumentation-client.{js,ts}` → React hydration → `instrumentationClientInject`
   - D. `instrumentationClientInject` → React hydration → `instrumentation-client.{js,ts}`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 배열 항목을 먼저 실행하고, 그 다음 사용자 파일을 실행한 뒤 React hydration이 일어난다.
</details>

2. `instrumentationClientInject`의 항목으로 사용할 수 있는 것은 무엇인가?
   - A. 프로젝트 `node_modules`에서 해석하는 bare npm package name
   - B. 프로젝트 루트를 기준으로 한 경로
   - C. 브라우저 주소창에 입력하는 URL만 가능
   - D. CSS selector만 가능

<details><summary>정답 보기</summary>

정답: **A, B**  
해설: 각 항목은 프로젝트의 `node_modules`에서 해석하는 npm package name이거나 프로젝트 루트 기준 경로다.
</details>

## 챕터 요약

- `instrumentationClientInject`는 사용자의 `instrumentation-client.{js,ts}` 파일과 React hydration보다 먼저 클라이언트 모듈을 실행한다.
- 이 옵션은 주로 `next.config.js` 플러그인이 자체 계측 모듈을 주입할 때 사용한다.
- 항목은 배열 순서대로 실행되며 각 모듈은 npm package name이나 프로젝트 루트 기준 경로로 지정한다.
- `onRouterTransitionStart`를 export한 모듈의 hook을 배열 순서대로 조합하고 사용자 파일의 hook을 마지막에 호출한다.
- `onRouterTransitionStart`를 export하지 않은 모듈은 Router 내비게이션 중에 건너뛴다.
