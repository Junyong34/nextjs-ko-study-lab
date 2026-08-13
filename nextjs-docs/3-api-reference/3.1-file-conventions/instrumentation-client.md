# instrumentation-client.js

- 공식 문서: [instrumentation-client.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 앱이 상호작용 가능해지기 전 client instrumentation을 초기화한다.
- App Router transition을 관측하고 bundle 성능 비용을 관리한다.

## 핵심 개념 및 설명

`instrumentation-client.js|ts` 파일을 사용하면 애플리케이션이 대화형이 되기 전에 실행되는 모니터링, 분석 코드 및 기타 부작용을 추가할 수 있다. 이는 성능 추적, 오류 모니터링, 폴리필 또는 기타 클라이언트 측 관찰 도구를 설정하는 데 유용하다.

이를 사용하려면 파일을 애플리케이션의 **루트** 또는 `src` 폴더 안에 넣는다.

<a id="usage"></a>
### 사용법

[서버 측 계측](../../2-guides/instrumentation.md)과 달리 특정 기능을 내보낼 필요가 없다. 파일에 직접 모니터링 코드를 작성할 수 있다.

```ts filename="instrumentation-client.ts" switcher
// 성능 모니터링 설정
performance.mark('app-init')

// 분석 초기화
console.log('Analytics initialized')

// 오류 추적 설정
window.addEventListener('error', (event) => {
  // 오류 추적 서비스로 보내기
  reportError(event.error)
})
```

```js filename="instrumentation-client.js" switcher
// 성능 모니터링 설정
performance.mark('app-init')

// 분석 초기화
console.log('Analytics initialized')

// 오류 추적 설정
window.addEventListener('error', (event) => {
  // 오류 추적 서비스로 보내기
  reportError(event.error)
})
```

**오류 처리:** 강력한 모니터링을 보장하려면 계측 코드 주변에 try-catch 블록을 구현한다. 이렇게 하면 개별 추적 오류가 다른 계측 기능에 영향을 미치는 것을 방지할 수 있다.

<a id="router-navigation-tracking"></a>
### 라우터 탐색 추적

`onRouterTransitionStart`를 내보내 App Router 탐색의 시작을 관찰할 수 있다.

```ts filename="instrumentation-client.ts"
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  console.log(url, navigationType)
}
```

추가 라우터 전환 정보는 실험적이다. 세 번째 `event` 인수를 수신하려면 활성화한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    instrumentationClientRouterTransitionEvents: true,
  },
}

export default nextConfig
```

이벤트에는 탐색이 전달될 때 알려진 전환 메타데이터와 소스 컨텍스트가 포함된다.

```ts filename="instrumentation-client.ts" switcher
import type { RouterTransitionStartEvent, RouterTransitionType } from 'next'

export function onRouterTransitionStart(
  url: string,
  navigationType: RouterTransitionType,
  { id, timestamp, fromRoutes, prefetchIntent }: RouterTransitionStartEvent
) {
  console.log(id, timestamp, url, navigationType, fromRoutes, prefetchIntent)
}
```

```js filename="instrumentation-client.js" switcher
export function onRouterTransitionStart(url, navigationType, event) {
  console.log(
    event.id,
    event.timestamp,
    url,
    navigationType,
    event.fromRoutes,
    event.prefetchIntent
  )
}
```

`onRouterTransitionStart`는 다음을 수신한다:

- `url: string`- 탐색되는 URL
- `navigationType: 'push' | 'replace' | 'traverse'`- 탐색 유형
- `event.id`- 이 전환에 대한 이벤트가 공유하는 불투명 ID
- `event.timestamp`- 프레임워크에서 캡처한 Unix 타임스탬프(밀리초)
- `event.fromRoutes`- 탐색 전에 경로 패턴이 표시된다. 기본 `children` 경로가 먼저이고 결정적 순서에 따라 병렬 슬롯이 이어집니다.
- `event.prefetchIntent`- 링크 탐색의 경우 클릭한 링크가 전체 prefetch를 요청했는지(`full`), 자동 prefetch를 사용했는지(`auto`), prefetch를 요청하지 않았는지(`none`) 여부이다. 연결된 링크가 없는 탐색(프로그래밍 방식의 `router.push()`/`router.replace()` 또는 브라우저 뒤로/앞으로)의 경우 링크 prefetch 의도가 적용되지 않으므로 이는 `null`이다.

경로 항목은 파일 시스템 스타일 패턴을 사용하므로 `/blog/hello`에서 벗어나 탐색하면 `/blog/[slug]`가 보고될 수 있다.

후크 오류는 격리되어 있으며 탐색이나 기타 후크에 영향을 주지 않는다.

<a id="performance-considerations"></a>
### 성능 고려 사항

계측 코드를 가볍게 유지한다.

Next.js는 개발 중 초기화 시간을 모니터링하고 16ms보다 오래 걸리면 경고를 기록한다. 이는 원활한 페이지 로딩에 영향을 줄 수 있다.

<a id="execution-timing"></a>
### 실행 시점

`instrumentation-client.js` 파일은 애플리케이션 수명주기의 특정 지점에서 실행된다.

1. **후** HTML 문서가 로드된 후
2. **이전** React hydration 시작
3. **이전** 사용자 상호작용이 가능하다.

이러한 타이밍은 초기 애플리케이션 수명주기 이벤트를 캡처하는 데 필요한 오류 추적, 분석 및 성능 모니터링을 설정하는 데 이상적이다.

동기식 최상위 코드만 hydration 전에 완료되도록 보장된다. 여기에서 시작된 비동기 작업(`Promise`,`import()` 또는 최상위 `await`)은 기다리지 않으며 hydration이 시작된 후에 해결될 수 있으므로 실행 후 잊어버리는 작업으로 처리한다. 컴포넌트가 실행되기 전에 무언가를 준비해야 하는 경우 [Polyfills](#polyfills)의 동기 패턴 중 하나를 사용한다.

<a id="see-also"></a>
### 함께 보기

`next.config.js` 플러그인(예:`withSentry`와 같은 래퍼)은 [`instrumentationClientInject`](../3.5-config/3.5.1-next-config-js/instrumentationClientInject.md) 옵션을 통해 자체 클라이언트 계측 모듈을 등록할 수 있다. 주입된 모듈은 이 파일보다 먼저 배열 순서로 실행되며 동일한 라우터 전환 시작 후크를 내보낼 수 있다. 애플리케이션 코드는 계속해서 이 파일 규칙을 직접 사용해야 한다.

<a id="examples"></a>
### 예제

<a id="error-tracking"></a>
#### 오류 추적

React가 시작되기 전에 오류 추적을 초기화하고 더 나은 디버깅 컨텍스트를 위해 탐색 탐색 경로를 추가한다.

```ts filename="instrumentation-client.ts" switcher
import Monitor from './lib/monitoring'

Monitor.initialize()

export function onRouterTransitionStart(url: string) {
  Monitor.pushEvent({
    message: `Navigation to ${url}`,
    category: 'navigation',
  })
}
```

```js filename="instrumentation-client.js" switcher
import Monitor from './lib/monitoring'

Monitor.initialize()

export function onRouterTransitionStart(url) {
  Monitor.pushEvent({
    message: `Navigation to ${url}`,
    category: 'navigation',
  })
}
```

<a id="analytics-tracking"></a>
#### 분석 추적

사용자 동작 분석을 위한 상세한 메타데이터를 사용하여 분석을 초기화하고 탐색 이벤트를 추적한다.

```ts filename="instrumentation-client.ts" switcher
import { analytics } from './lib/analytics'

analytics.init()

export function onRouterTransitionStart(url: string, navigationType: string) {
  analytics.track('page_navigation', {
    url,
    type: navigationType,
    timestamp: Date.now(),
  })
}
```

```js filename="instrumentation-client.js" switcher
import { analytics } from './lib/analytics'

analytics.init()

export function onRouterTransitionStart(url, navigationType) {
  analytics.track('page_navigation', {
    url,
    type: navigationType,
    timestamp: Date.now(),
  })
}
```

<a id="performance-monitoring"></a>
#### 성능 모니터링

Performance Observer API 및 성능 표시를 사용하여 대화형 시간 및 탐색 성능을 추적한다.

```ts filename="instrumentation-client.ts" switcher
const startTime = performance.now()

const observer = new PerformanceObserver(
  (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry instanceof PerformanceNavigationTiming) {
        console.log('Time to Interactive:', entry.loadEventEnd - startTime)
      }
    }
  }
)

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url: string) {
  performance.mark(`nav-start-${url}`)
}
```

```js filename="instrumentation-client.js" switcher
const startTime = performance.now()

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry instanceof PerformanceNavigationTiming) {
      console.log('Time to Interactive:', entry.loadEventEnd - startTime)
    }
  }
})

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url) {
  performance.mark(`nav-start-${url}`)
}
```

<a id="polyfills"></a>
#### 폴리필

[실행 타이밍](#execution-timing)에서 설명한 대로 여기에서는 동기식 최상위 코드만 hydration 전에 실행되므로 조건부 `import()` 또는 최상위 `await`는 hydration이 이미 시작된 후에 해결될 수 있다.

컴포넌트가 실행되기 전에 폴리필이 적용되도록 하려면 폴리필을 정적으로 가져와 기능 감지 후 동기적으로 적용한다. 가져오기는 정적이므로 폴리필은 모든 방문자에게 제공된다.

```ts filename="instrumentation-client.ts"
import ResizeObserverPolyfill from './lib/polyfills/resize-observer'

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverPolyfill
}
```

여기에서는 조건부 `import()`를 사용하여 폴리필을 로드하지 않는다. 가져오기는 실행 후 잊어버리기 때문에 hydration가 이미 시작된 후에 폴리필이 적용될 수 있으며 이는 컴포넌트에 너무 늦을 수 있다.

```ts filename="instrumentation-client.ts"
// 피한다: 동적 가져오기는 실행 후 잊어버리므로 `ResizeObserver`
// 컴포넌트가 실행될 때 여전히 정의되지 않을 수 있다.
if (!window.ResizeObserver) {
  import('./lib/polyfills/resize-observer').then((mod) => {
    window.ResizeObserver = mod.default
  })
}
```

요청 시 로드되는 모든 항목의 경우 해당 기능을 사용하는 코드에서 폴리필을 선호한다. 해당 전략과 기타 전략은 [사용자 정의 폴리필](https://nextjs.org/docs/architecture/supported-browsers#custom-polyfills)을 참조한다.

Next.js는 이미 [널리 사용되는 폴리필](https://nextjs.org/docs/architecture/supported-browsers#polyfills)(예:`fetch`,`URL` 및 `Object.assign`)의 기준을 필요한 브라우저에 주입하므로 해당 기준 외부의 기능에 대해서만 폴리필을 추가하면 된다.

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ----------------------------------------------------- |
| `v16.3.0` | 실험적인 라우터 전환 시작 이벤트 도입 |
| `v15.3` | `instrumentation-client` 출시 |

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
