# webVitalsAttribution

- 공식 문서: [webVitalsAttribution](https://nextjs.org/docs/app/api-reference/config/next-config-js/webVitalsAttribution)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- Web Vitals 점수에 가장 크게 기여한 요소를 찾아야 하는 이유를 이해한다.
- CLS와 LCP의 attribution에서 얻는 정보의 차이를 설명할 수 있다.
- `experimental.webVitalsAttribution`을 metric별로 설정하는 방법을 익힌다.
- `PerformanceEventTiming`, `PerformanceNavigationTiming`, `PerformanceResourceTiming` 정보를 진단에 활용하는 범위를 파악한다.

## 핵심 개념 및 설명

Web Vitals 문제를 디버깅할 때는 문제를 일으킨 원인을 특정하면 도움이 된다. 예를 들어 Cumulative Layout Shift(CLS)에서는 가장 큰 단일 layout shift가 발생했을 때 처음 이동한 요소가 무엇인지 알고 싶을 수 있다. Largest Contentful Paint(LCP)에서는 페이지의 LCP에 해당하는 요소를 확인할 수 있다. LCP 요소가 이미지라면 이미지 resource URL로 최적화할 asset을 찾는 데 도움이 된다.

Web Vitals 점수에 가장 크게 기여한 요소를 특정하는 기능을 `attribution`이라고 한다. attribution을 사용하면 `PerformanceEventTiming`, `PerformanceNavigationTiming`, `PerformanceResourceTiming`의 entry처럼 더 자세한 정보를 얻을 수 있다. 관련 정의는 [`web-vitals`의 attribution 설명](https://github.com/GoogleChrome/web-vitals/blob/4ca38ae64b8d1e899028c692f94d4c56acfc996c/README.md#attribution)에서 확인한다.

Next.js에서는 attribution이 기본적으로 비활성화되어 있다. `next.config.js`에서 다음과 같이 지정하면 metric별로 활성화할 수 있다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
}
```

attribution에 사용할 수 있는 값은 [`NextWebVitalsMetric`](https://github.com/vercel/next.js/blob/442378d21dd56d6e769863eb8c2cb521a463a2e0/packages/next/shared/lib/utils.ts#L43) 타입에 지정된 모든 `web-vitals` metric이다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- CLS를 유발하는 layout shift와 LCP 이미지가 있는 페이지를 준비한 뒤 `['CLS', 'LCP']`를 설정한다. Web Vitals 보고 결과에서 해당 요소와 resource 정보가 함께 식별되는지 브라우저 개발자 도구에서 확인한다.
- attribution을 설정하지 않은 경우와 특정 metric만 설정한 경우를 비교해 기본값이 비활성화되어 있고 metric별로 켤 수 있다는 점을 관찰한다.

## 연습 문제

1. `webVitalsAttribution`의 기본 동작으로 올바른 것은 무엇인가?
   - A. 모든 metric의 attribution이 항상 활성화된다.
   - B. attribution은 기본적으로 비활성화되며 metric별로 활성화할 수 있다.
   - C. CLS만 강제로 활성화된다.
   - D. LCP만 강제로 비활성화된다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: Next.js에서는 attribution이 기본적으로 꺼져 있고 `experimental.webVitalsAttribution` 배열에 metric을 지정해 선택적으로 활성화한다.
</details>

2. 다음 중 `webVitalsAttribution`에서 유효한 attribution 값의 기준은 무엇인가?
   - A. `NextWebVitalsMetric` 타입에 지정된 모든 `web-vitals` metric
   - B. 브라우저가 임의로 만든 모든 문자열
   - C. CLS를 제외한 사용자 정의 metric만
   - D. `next.config.js`에 선언한 모든 옵션 키

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 유효한 값은 `NextWebVitalsMetric` 타입에 지정된 `web-vitals` metric이다.
</details>

## 챕터 요약

- attribution은 Web Vitals 점수에 가장 크게 기여한 요소를 찾는 진단 정보다.
- CLS에서는 이동한 요소를, LCP에서는 LCP 요소와 이미지 resource URL을 확인하는 데 활용할 수 있다.
- attribution은 기본적으로 비활성화되어 있으며 `experimental.webVitalsAttribution`으로 metric별로 활성화할 수 있다.
- attribution을 사용하면 `PerformanceEventTiming`, `PerformanceNavigationTiming`, `PerformanceResourceTiming` entry 같은 세부 정보를 얻을 수 있다.
- 허용 값은 `NextWebVitalsMetric` 타입에 지정된 모든 `web-vitals` metric이다.
