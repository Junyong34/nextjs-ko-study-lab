# cssChunking

- 공식 문서: [cssChunking](https://nextjs.org/docs/app/api-reference/config/next-config-js/cssChunking)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- CSS 파일을 chunk로 나누고 순서를 조정하는 CSS Chunking의 목적을 이해한다.
- experimental.cssChunking의 true, false, strict, graph 옵션이 webpack과 Turbopack에서 어떻게 동작하는지 구분한다.
- Lighthouse와 Chrome DevTools Coverage panel로 라우트가 실제로 사용하는 CSS를 확인하는 방법을 익힌다.
- Turbopack의 graph 전략에서 requestCost와 weightDistribution으로 요청 수와 불필요한 CSS 다운로드를 어떻게 견주는지 이해한다.

## 핵심 개념 및 설명

> 이 기능은 현재 experimental이며 변경될 수 있다. production에서 사용하는 것은 권장하지 않는다. 사용해 본 뒤 GitHub에서 의견을 공유할 수 있다.

CSS 파일을 chunk로 분할하고 순서를 다시 정해 웹 애플리케이션의 성능을 높이는 전략이 CSS Chunking이다. 이를 적용하면 애플리케이션의 CSS를 한 번에 모두 로드하지 않고, 각 route는 자신에게 필요한 CSS에 가까운 양만 로드한다.

CSS 파일을 어떻게 나눌지는 next.config.js의 experimental.cssChunking 옵션에서 정한다.

```tsx filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: true, // 기본값
  },
} satisfies NextConfig

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: true, // 기본값
  },
}

module.exports = nextConfig
```

### 옵션 (Options)

- **true (default)** (**webpack and Turbopack**): Next.js는 가능한 경우 CSS 파일을 병합하는데, import 순서에서 파일 사이의 명시적·암시적 의존성을 파악해 chunk 수와 요청 수를 줄인다.
- **false** (**webpack only**): Next.js는 CSS 파일을 병합하거나 순서를 다시 정하지 않는다.
- **strict** (**webpack only**): Next.js는 CSS 파일을 파일에 import한 순서대로 올바르게 로드한다. 그 결과 chunk와 요청이 더 많아지기도 한다.
- **graph** (**Turbopack only**): Next.js는 비용 기반 그래프 알고리즘으로 route 전체의 CSS를 묶어 각 route가 다운로드하는 바이트와 요청 수 사이의 균형을 맞춘다.

### 전략 선택 (Choosing a strategy)

대부분의 애플리케이션에서는 어느 bundler를 사용하든 기본값인 true가 적절하다. 이 값은 CSS를 병합해 요청 수를 줄이므로, 다른 전략은 구체적인 이유가 있을 때만 고른다.

Turbopack이라면 성능 때문에 손대는 경우가 많다. graph로 전환해 route 사이에서 CSS를 얼마나 공유할지 조절한다. 그 대신 route가 다운로드하는 사용하지 않는 CSS를 줄이는 만큼 요청 수가 늘기도 한다. 자세한 내용은 [요청과 그룹화의 균형](#balancing-requests-and-grouping)을 참고한다.

webpack 쪽 이유는 대개 정확성이다. 예기치 않은 CSS 동작이 발생하면 strict로 전환한다. 예를 들어 서로 다른 파일에서 a.css와 b.css를 서로 다른 import 순서(a를 먼저 import하거나 b를 먼저 import)로 가져오면 true는 두 파일 사이에 의존성이 없다고 가정하고 어떤 순서로든 병합한다. b.css가 a.css에 의존한다면 strict는 병합을 막고 import 순서대로 로드한다. 이 경우 chunk와 요청 수가 늘어난다. 병합을 완전히 끄려면 false를 사용한다.

### route가 실제로 사용하는 CSS 디버깅 (Debugging what a route actually uses)

사용하지 않는 CSS가 일부 있어도 괜찮고 대부분의 앱은 설정을 바꿀 필요가 없다. 다만 렌더링을 막는 CSS는 확인하는 편이 좋다. [Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/unused-css-rules)는 예상 절약량과 함께 **Reduce unused CSS** 기회로 표시한다. Chrome DevTools에서는 [Coverage panel](https://developer.chrome.com/docs/devtools/coverage)로 stylesheet별 사용량을 확인한다. 사용량 막대에서 적용된 CSS는 초록색으로, 사용하지 않은 CSS는 회색으로 표시한다.

보고서를 읽을 때는 상호작용해야만 적용되는 스타일을 주의한다. 예를 들어 :hover, :focus, 메뉴와 모달에서 JavaScript로 전환하는 클래스는 직접 동작을 실행하기 전까지 Coverage에서 사용하지 않은 것으로 계산한다.

사용하지 않은 CSS의 원인은 두 가지 중 하나다. 첫 번째는 route가 import한 stylesheet 안에 실제로 사용하지 않는 CSS가 있는 경우다. 소스에서 사용하지 않는 규칙을 삭제하거나, 해당 CSS를 사용하는 route만 import하는 stylesheet로 옮긴다. [CSS Modules](../../../1-getting-started/css.md#css-modules)를 사용하면 컴포넌트가 import한 범위로 스타일을 지정하기 쉬워진다.

두 번째는 bundler가 다른 stylesheet를 route가 로드하는 shared chunk에 병합한 경우다. 이 동작은 어떤 [chunking 전략](#choosing-a-strategy)을 쓰느냐에 따라 달라진다. Turbopack에서는 [graph 모드](#balancing-requests-and-grouping)로 CSS를 얼마나 적극적으로 병합할지 조정한다.

### 요청과 그룹화의 균형 (Balancing requests and grouping)

graph 전략은 CSS를 shared chunk로 묶어 요청 수를 줄이는데, 문자열 형식으로 활성화하면 기본 조정값을 그대로 쓴다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: 'graph',
  },
} satisfies NextConfig

export default nextConfig
```

균형을 바꾸려면 객체를 전달한다. requestCost와 weightDistribution은 모두 선택 사항이므로 변경할 값만 포함한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: {
      type: 'graph',
      requestCost: 100000,
      weightDistribution: 0.1,
    },
  },
} satisfies NextConfig

export default nextConfig
```

- **requestCost** (기본값 20000): 추가 CSS 요청 하나의 비용을 바이트 단위로 추정한 값이다. 값을 크게 하면 더 적은 수의 큰 shared chunk를 만들어 전체 요청 수를 줄이는 쪽으로 기운다.
- **weightDistribution** (기본값 0.1): shared chunk의 비용을 해당 chunk를 로드하는 route 사이에 어떻게 나눌지 정한다. 각 route가 import하는 CSS의 양에 따라 가중치를 둔다. 0이면 모든 route에 같은 가중치를 주고, 값이 클수록 CSS를 적게 import한 route에 더 큰 가중치를 준다. CSS가 많은 route에서는 추가 CSS가 덜 눈에 띈다고 보고 CSS가 적은 route를 우선해 최적화하는 셈이다.

#### graph가 병합 대상을 정하는 방식 (How graph decides what to merge)

CSS를 shared chunk로 병합하는 동작은 기본값인 true도 이미 수행한다. graph에서는 병합할지 분리할지의 경계를 직접 조절한다.

하나의 stylesheet를 공유하는 두 route를 생각해 보자.

```txt
/a → [shared.css, only-a.css]
/b → [shared.css]
```

/b는 only-a.css를 import하지 않으므로, only-a.css를 shared chunk에 남겨 둘지 별도 chunk로 분리할지를 결정해야 한다.

병합해 두면 /a는 모든 CSS를 한 번의 요청으로 로드한다. 다만 같은 shared chunk를 로드하는 /b도 import하지 않은 only-a.css를 다운로드한다.

분리하면 /b는 해당 바이트를 받지 않아도 되지만, /a가 두 번 요청해야 한다. 기본값에서는 고정된 휴리스틱이 두 선택지 중 하나를 정한다.

graph는 이 절충을 requestCost로 환산해 견준다. 추가 요청 하나와 바꿀 수 있는, import하지 않은 CSS의 양이 이 값이다. only-a.css가 requestCost보다 충분히 작으면 병합해 두고, requestCost를 넘을 만큼 커지면 분리한다.

결정에는 shared chunk 자체의 크기보다 병합으로 route에 추가되는 import하지 않은 CSS의 크기가 훨씬 크게 작용한다. 기본 requestCost는 약 20 KB이므로 only-a.css가 대략 그 크기를 넘어야 별도 chunk로 분리될 만하다. 따라서 작은 stylesheet는 계속 병합되는 경향이 있다.

**그래프 알고리즘 개요**

이 알고리즘은 개별 CSS 파일을 기준으로 동작하며, 각 route가 import하는 CSS의 순서 목록에서 시작한다.

```txt
/dashboard  → [reset.css, theme.css, layout.css, dashboard.css]
/settings   → [reset.css, theme.css, layout.css, settings.css]
/login      → [reset.css, login.css]
```

여기서 두 CSS 파일을 같은 순서로 함께 import하는 route가 많을수록 간선이 무거워지는 가중 그래프를 만든다. 자주 짝을 이루는 파일이 서로 인접하도록 그래프를 한 줄로 평탄화한 뒤, 그 줄에 _cut_을 배치해 다음과 같이 chunk를 나눈다.

```txt
reset theme layout │ dashboard │ settings │ login
└──── chunk 1 ────┘   chunk 2     chunk 3    chunk 4
```

route는 자신이 import한 파일이 포함된 모든 chunk를 로드한다. 그래서 /dashboard가 로드하는 chunk는 1과 2, /login은 1과 4다.

알고리즘은 모든 route의 전체 다운로드 비용이 가장 작아지는 지점에서 chunk를 나눈다. 바이트와 요청 수를 함께 견주므로 각 route 하나의 비용만 최적화하지는 않는다. 전체 비용이 줄어든다면 route가 import하지 않은 CSS를 일부 포함하기도 한다. 이 가중 방식은 아래 두 옵션으로 조절한다.

- **requestCost**: reset.css, theme.css, layout.css가 하나의 chunk를 공유하면 이 파일들이 필요한 route는 세 번 대신 한 번만 요청한다. requestCost는 요청 하나의 바이트 비용이다. 값을 높이면 CSS를 더 많이 병합하므로 다운로드 크기는 커지고 요청 수는 줄어든다. 값을 0에 가깝게 낮추면 chunk가 잘게 쪼개진다. route는 자신이 import한 파일에 가까운 CSS만 다운로드하고, 요청 수는 그만큼 늘어난다.
- **weightDistribution**: /login은 chunk 1에서 reset.css만 필요하지만 같은 chunk에 있기 때문에 theme.css와 layout.css도 다운로드한다. 이 추가 다운로드를 얼마나 무겁게 볼지는 이 값으로 정한다. 0이면 /login과 /dashboard를 똑같이 계산해 추가 CSS를 허용한다. 값을 높이면 /login처럼 CSS를 적게 import한 route에 더 큰 가중치를 두므로, 전체 요청 수가 늘어나는 비용을 치르면서 import하지 않은 CSS를 덜 받도록 최적화한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 동일한 CSS를 공유하는 세 route와 route별 CSS를 준비하고 webpack과 Turbopack에서 생성된 CSS chunk 수와 요청 수를 비교한다.
- cssChunking을 true, false, strict, graph로 바꿔 빌드한 뒤 Chrome DevTools Network와 Coverage panel에서 route별 stylesheet 사용량을 관찰한다.
- graph 모드에서 requestCost와 weightDistribution을 바꾸고 /login처럼 CSS를 적게 import한 route가 받는 shared CSS와 요청 수가 어떻게 달라지는지 확인한다.

## 연습 문제

1. cssChunking 옵션의 graph 값에 대한 설명으로 올바른 것은 무엇인가?
   - A. webpack에서만 CSS import 순서를 보존한다.
   - B. Turbopack에서 비용 기반 그래프 알고리즘으로 route 사이의 CSS를 그룹화한다.
   - C. CSS 병합과 순서 조정을 모두 끈다.
   - D. 모든 route의 CSS를 하나의 파일에 넣는다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: graph는 Turbopack 전용 전략이며, route가 다운로드하는 바이트와 요청 수 사이의 균형을 맞추는 비용 기반 그래프 알고리즘을 사용한다.
</details>

2. webpack에서 CSS import 순서와 의존성 문제를 명시적으로 보존해야 할 때 선택할 전략은 무엇인가?
   - A. true
   - B. false
   - C. strict
   - D. graph

<details><summary>정답 보기</summary>

정답: **C**  
해설: strict는 webpack에서 CSS 파일을 import한 순서대로 로드하며, 병합 때문에 순서가 바뀌는 문제를 줄인다.
</details>

3. graph 전략의 requestCost 값을 높이면 일반적으로 어떻게 되는가?
   - A. 더 많은 작은 chunk와 더 많은 요청을 만든다.
   - B. 더 적은 수의 큰 shared chunk와 더 적은 요청을 선호한다.
   - C. 모든 CSS를 제거한다.
   - D. weightDistribution 값을 자동으로 0으로 바꾼다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: requestCost가 클수록 추가 요청의 비용을 크게 평가하므로 알고리즘은 CSS를 더 많이 병합해 요청 수를 줄이는 쪽을 선호한다.
</details>

## 챕터 요약

- cssChunking은 route가 필요한 CSS에 가까운 양만 로드하도록 CSS 파일을 chunk로 나누고 순서를 조정한다.
- true가 기본값이며 webpack과 Turbopack에서 가능한 CSS 병합을 수행한다.
- false와 strict는 webpack 전용이고, strict는 CSS import 순서를 보존한다.
- graph는 Turbopack 전용이며 requestCost와 weightDistribution으로 CSS 그룹화와 요청 수의 균형을 조정한다.
- Lighthouse와 Chrome DevTools Coverage panel로 실제 사용 CSS와 bundler가 shared chunk에 병합한 CSS를 구분해 확인한다.
