# inlineCss

- 공식 문서: [inlineCss](https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `inlineCss`가 `<link>` 태그 대신 `<style>` 태그를 생성하는 방식을 이해한다.
- first-time visitors, returning visitors, CSS 번들 크기, 네트워크 상태에 따라 inline CSS와 외부 CSS의 차이를 판단한다.
- experimental 설정의 적용 범위와 production 빌드 제약을 설명할 수 있다.

## 핵심 개념 및 설명

이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 기능을 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 공유할 수 있다.

## Usage (사용법)

`inlineCss`는 `<head>` 안에 CSS를 삽입하는 experimental 지원 기능이다. 이 플래그를 활성화하면 Next.js는 일반적으로 `<link>` 태그를 생성하는 모든 위치에서 `<style>` 태그를 대신 생성한다.

`next.config.ts`에 다음과 같이 설정한다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
}

export default nextConfig
```

## Trade-Offs (트레이드오프)

- atomic CSS(예: Tailwind)를 사용하고 처음 방문하는 사용자의 first-load 성능을 최적화하려면 **Enable**을 선택한다.
- returning visitors가 많고 캐시된 stylesheet의 이점을 활용하려면 **Skip**을 선택한다.

### When Inline CSS Helps (Inline CSS가 유용한 경우)

일반적으로 브라우저는 HTML을 다운로드하고 파싱한 뒤 CSS `<link>` 태그를 발견한다. 그다음 stylesheet를 요청하고 나서야 렌더링할 수 있다. CSS를 inline으로 넣으면 [이 요청 waterfall](https://web.dev/learn/performance/optimize-resource-loading#inline_critical_css)이 사라진다. CSS가 HTML과 함께 도착하므로 브라우저는 즉시 렌더링할 수 있다.

다음 상황에서 이 이점이 가장 크다.

- **First-time visitors**: CSS 파일은 렌더링을 막는 리소스이므로 inline CSS는 first-time visitors가 겪는 최초 다운로드 지연을 없앤다. stylesheet를 캐시한 returning visitors는 이 이점을 얻지 못한다.
- **Performance metrics**: CSS 파일을 받는 추가 네트워크 요청을 없애면 [First Contentful Paint (FCP)](https://web.dev/articles/fcp)와 [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp)를 크게 개선할 수 있다.
- **Slow connections**: 지연 시간이 큰 네트워크에서는 추가 요청마다 지연이 생긴다. inline CSS는 왕복 횟수를 줄이므로 연결이 느릴 때 효과가 크다.
- **Atomic CSS (Tailwind)**: utility-first 프레임워크는 사용하는 클래스만 생성하므로 CSS가 작게 유지된다. UI를 많이 만들수록 페이지의 stylesheet 크기가 함께 커지지는 않는다. 일반적으로 UI 규모와 관계없이 작다. 따라서 HTML이 크게 부풀지 않으면서 inline CSS의 성능 이점을 얻을 수 있다.

### When External CSS is Better (외부 CSS가 더 나은 경우)

inline CSS는 HTML과 별도로 캐시할 수 없어서 페이지를 로드할 때마다 같은 CSS를 다시 다운로드한다.

다음 상황에서 이 트레이드오프가 특히 중요하다.

- **Returning visitors**: 사이트를 반복해서 방문하는 사용자는 캐시된 외부 stylesheet의 이점을 얻을 수 있다. inline CSS를 사용하면 방문할 때마다 CSS를 다시 다운로드한다.
- **Large CSS bundles**: 외부 stylesheet는 독립적으로 캐시되고 현대적인 인프라에서 효율적으로 로드된다. inline CSS는 모든 HTML 응답에 포함되므로 [Time to First Byte (TTFB)](https://web.dev/articles/ttfb)가 늘어나고 브라우저가 stylesheet를 별도로 캐시하지 못한다. 이 방식은 Tailwind와 같은 atomic framework의 작은 CSS에는 적합하지만 Bootstrap이나 Material UI와 같은 component library의 큰 번들에는 추가 부담이 된다.
- **Many pages sharing styles**: 한 페이지에서 캐시한 외부 stylesheet는 다른 페이지로 이동할 때도 속도를 높인다. inline CSS는 페이지 사이에서 캐시를 공유하는 이점이 없다.

> **알아두면 좋은 점**:
>
> 이 기능은 현재 experimental 상태이며 다음과 같은 알려진 제한이 있다.
>
> - CSS inline 처리는 전역으로 적용되며 페이지별로 설정할 수 없다.
> - 초기 페이지 로드에서 스타일이 중복된다. SSR을 위한 `<style>` 태그 안에 한 번 들어가고 RSC payload 안에 한 번 더 들어간다.
> - prerender된 페이지로 이동할 때는 중복을 피하기 위해 inline CSS 대신 `<link>` 태그를 사용한다.
> - development 모드에서는 사용할 수 없고 production 빌드에서만 동작한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- production 빌드에서 `experimental.inlineCss: true`를 적용한 페이지의 `<head>`를 브라우저 개발자 도구로 확인한다. CSS가 `<link>`가 아니라 `<style>` 태그로 들어가는지 관찰한다.
- 같은 페이지를 처음 방문할 때와 다시 방문할 때를 비교한다. inline CSS와 외부 stylesheet의 네트워크 요청 및 캐시 차이를 확인한다.

## 연습 문제

1. `inlineCss`에 대한 설명으로 옳은 것을 모두 고른다.
   - A. 일반적으로 생성하는 `<link>` 태그 대신 `<style>` 태그를 사용한다.
   - B. development 모드에서만 동작한다.
   - C. 현재 experimental 상태다.
   - D. production 빌드에서는 동작하지 않는다.

<details><summary>정답 보기</summary>

정답: **A, C**  
해설: `inlineCss`는 `<link>` 대신 `<style>`을 사용하며 현재 experimental 기능이다. development 모드에서는 사용할 수 없고 production 빌드에서 동작한다.
</details>

2. inline CSS의 이점이 가장 큰 상황은 무엇인가?
   - A. CSS가 이미 캐시된 returning visitors가 대부분인 경우
   - B. first-time visitors가 많고 네트워크 지연 시간이 큰 경우
   - C. 여러 페이지가 큰 CSS 번들을 공유하는 경우
   - D. 매 HTML 응답의 크기를 줄여야 하는 경우

<details><summary>정답 보기</summary>

정답: **B**  
해설: inline CSS는 CSS 요청 waterfall을 없애므로 처음 방문하는 사용자와 느린 네트워크에서 특히 효과가 크다.
</details>

## 챕터 요약

- `experimental.inlineCss`는 CSS `<link>` 태그 대신 `<style>` 태그를 생성한다.
- first-time visitors, 느린 연결, 작은 atomic CSS에서는 inline CSS의 이점이 크다.
- returning visitors가 많거나 CSS 번들이 크고 여러 페이지가 스타일을 공유하면 외부 CSS가 더 유리하다.
- inline CSS는 HTML과 함께 내려오므로 stylesheet를 별도로 캐시할 수 없다.
- CSS inline 처리는 전역으로 적용되며 development 모드에서는 사용할 수 없고 production 빌드에서만 동작한다.
