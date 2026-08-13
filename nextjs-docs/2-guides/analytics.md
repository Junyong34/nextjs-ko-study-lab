# Analytics

- 공식 문서: [Analytics](https://nextjs.org/docs/app/guides/analytics)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js가 성능 지표를 측정·보고하기 위해 기본으로 제공하는 두 가지 방법(`useReportWebVitals` 훅으로 직접 관리하기, Vercel의 관리형 서비스 사용하기)을 구분한다.
- `instrumentation-client.js|ts` 파일이 언제 실행되며 어떤 용도에 적합한지 설명한다.
- `useReportWebVitals`를 사용하는 컴포넌트를 별도로 분리해야 하는 이유를 안다.
- Web Vitals에 포함되는 지표를 나열하고, `metric.name`으로 각 지표를 분기 처리하는 방법을 안다.
- 측정한 지표를 외부 엔드포인트로 전송해 실제 사용자 성능을 추적하는 방법을 구현한다.

## 핵심 개념 및 설명

Next.js는 성능 지표를 측정하고 보고하는 기능을 기본으로 제공한다. `useReportWebVitals` 훅을 사용해 리포팅을 직접 관리할 수도 있고, Vercel이 제공하는 [관리형 서비스](https://vercel.com/analytics?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)를 사용해 지표를 자동으로 수집하고 시각화할 수도 있다.

### Client Instrumentation

더 고급 분석과 모니터링이 필요하면 Next.js가 제공하는 `instrumentation-client.js|ts` 파일을 사용한다. 이 파일은 애플리케이션의 프론트엔드 코드가 실행되기 전에 실행되므로, 전역 분석 도구·에러 트래킹·성능 모니터링 도구를 설정하기에 적합하다.

사용하려면 애플리케이션 루트 디렉터리에 `instrumentation-client.js` 또는 `instrumentation-client.ts` 파일을 만든다.

```ts
// 앱이 시작하기 전에 분석 도구를 초기화한다
console.log('Analytics initialized')

// 전역 에러 트래킹을 설정한다
window.addEventListener('error', (event) => {
  // 에러 트래킹 서비스로 전송한다
  reportError(event.error)
})
```

### 직접 구현하기

`useReportWebVitals`를 직접 사용해 리포팅을 관리할 수도 있다.

```tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

```tsx
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

> **알아두면 좋은 점**: `useReportWebVitals` 훅은 `'use client'` 지시어가 필요하므로, 가장 성능이 좋은 방법은 root layout이 import하는 별도 컴포넌트를 만드는 것이다. 이렇게 하면 client boundary가 `WebVitals` 컴포넌트로만 한정된다.

더 자세한 내용은 [API Reference](../3-api-reference/3.3-functions/use-report-web-vitals.md)를 참고한다.

### Web Vitals

[Web Vitals](https://web.dev/vitals/)는 웹 페이지의 사용자 경험을 포착하기 위한 유용한 지표 모음이다. 다음 web vitals가 모두 포함된다.

- [Time to First Byte](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) (TTFB)
- [First Contentful Paint](https://developer.mozilla.org/docs/Glossary/First_contentful_paint) (FCP)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [First Input Delay](https://web.dev/fid/) (FID)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
- [Interaction to Next Paint](https://web.dev/inp/) (INP)

`name` 속성을 사용하면 이 지표들의 결과를 모두 처리할 수 있다.

```tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // FCP 결과를 처리한다
      }
      case 'LCP': {
        // LCP 결과를 처리한다
      }
      // ...
    }
  })
}
```

### 외부 시스템으로 결과 전송하기

엔드포인트로 결과를 전송하면 사이트의 실제 사용자 성능을 측정하고 추적할 수 있다. 예를 들면 다음과 같다.

```tsx
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // 가능하면 `navigator.sendBeacon()`을 쓰고, 없으면 `fetch()`로 대체한다.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

> **알아두면 좋은 점**: [Google Analytics](https://analytics.google.com/analytics/web/)를 사용한다면 `id` 값을 이용해 지표 분포(백분위 등)를 수동으로 계산할 수 있다.
>
> ```tsx
> useReportWebVitals((metric) => {
>   // 다음 예시처럼 Google Analytics를 초기화했다면 `window.gtag`를 사용한다:
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
>   window.gtag('event', metric.name, {
>     value: Math.round(
>       metric.name === 'CLS' ? metric.value * 1000 : metric.value
>     ), // 값은 정수여야 한다
>     event_label: metric.id, // 현재 페이지 로드에 고유한 id
>     non_interaction: true, // bounce rate에 영향을 주지 않는다.
>   })
> })
> ```
>
> [Google Analytics로 결과 전송하기](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics)를 더 읽어본다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: `WebVitals` 컴포넌트를 root layout에 연결하고, 페이지 로드·라우트 이동마다 각 Web Vitals 지표가 언제 어떤 값으로 수집되는지 화면과 콘솔에서 함께 관찰한다.
- 사용자가 확인할 화면과 상호작용: 페이지를 새로고침하거나 라우트를 이동하면서 콘솔에 출력되는 `metric.name`/`value`를 확인하고, Network 탭에서 `navigator.sendBeacon` 또는 `fetch` 요청이 분석 엔드포인트로 전송되는지 확인한다.
- 예제에서 관찰할 결과: client boundary가 `WebVitals` 컴포넌트로만 한정되어 root layout의 나머지는 Server Component로 남는다는 것과, 각 지표가 페이지 상호작용 시점에 맞춰 순차적으로 리포트된다는 것.

## 연습 문제

**Q1. (단일 선택) Next.js가 성능 지표를 측정·보고하기 위해 기본으로 제공하는 두 가지 방법이 아닌 것은?**

1. `useReportWebVitals` 훅으로 직접 리포팅을 관리하기
2. Vercel의 관리형 서비스로 지표를 자동 수집·시각화하기
3. `next.config.js`에 지표 수집 옵션을 설정하기
4. `instrumentation-client.js|ts`로 분석 도구를 초기화하기

<details>
<summary>정답 보기</summary>

**정답: 3** — `next.config.js` 옵션으로 지표를 수집하는 방식은 제공되지 않는다. `useReportWebVitals`, Vercel 관리형 서비스, `instrumentation-client.js|ts`가 공식적으로 제공되는 방법이다.

</details>

**Q2. (단일 선택) `useReportWebVitals`를 사용하는 컴포넌트를 별도로 분리해서 root layout이 import하는 이유는?**

1. 코드를 재사용하기 위해서
2. `'use client'` 지시어가 필요한 client boundary를 그 컴포넌트로만 한정하기 위해서
3. Web Vitals 지표를 더 빠르게 계산하기 위해서
4. `instrumentation-client.js`와 이름이 충돌하기 때문에

<details>
<summary>정답 보기</summary>

**정답: 2** — `useReportWebVitals`는 `'use client'`가 필요하다. 별도 컴포넌트로 분리해 root layout이 import하면 client boundary가 그 컴포넌트에만 한정되고, layout의 나머지 부분은 Server Component로 유지된다.

</details>

**Q3. (복수 선택) 다음 중 Web Vitals에 포함되는 지표를 모두 고르시오.**

- [ ] TTFB (Time to First Byte)
- [ ] LCP (Largest Contentful Paint)
- [ ] INP (Interaction to Next Paint)
- [ ] TTI (Time to Interactive)

<details>
<summary>정답 보기</summary>

**정답: TTFB, LCP, INP** — Web Vitals는 TTFB, FCP, LCP, FID, CLS, INP 여섯 가지 지표로 구성된다. TTI는 이 목록에 포함되지 않는다.

</details>

## 챕터 요약

- Next.js는 `useReportWebVitals` 훅으로 직접 리포팅을 관리하는 방법과, Vercel 관리형 서비스로 지표를 자동 수집·시각화하는 방법을 함께 제공한다.
- `instrumentation-client.js|ts`는 프론트엔드 코드 실행 전에 동작해 전역 분석·에러 트래킹·성능 모니터링 설정에 적합하다.
- `useReportWebVitals`는 `'use client'`가 필요하므로, root layout이 import하는 별도 컴포넌트로 분리해 client boundary를 최소화한다.
- Web Vitals는 TTFB·FCP·LCP·FID·CLS·INP 여섯 가지 지표로 구성되며, `metric.name`으로 각 지표를 구분해 처리할 수 있다.
- 측정된 지표는 `navigator.sendBeacon` 또는 `fetch`로 외부 엔드포인트(자체 서버, Google Analytics 등)에 전송해 실제 사용자 성능을 추적할 수 있다.
