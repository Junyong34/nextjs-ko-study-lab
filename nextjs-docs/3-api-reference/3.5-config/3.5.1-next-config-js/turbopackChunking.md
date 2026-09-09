# turbopackChunking

- 공식 문서: [turbopackChunking](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackChunking)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `experimental.turbopackChunking`이 production JavaScript chunk를 나누는 방식을 조정하는 방법을 이해한다.
- chunk 크기와 개수의 기본값이 초기 페이지 로드, 내비게이션, 네트워크 요청에 미치는 영향을 구분한다.
- `generateComponentChunks`와 `minComponentChunkSize`로 component chunks를 생성하는 방식을 익힌다.
- `firstPageLoadPriority`, `priorityRoutes`, `priorityBoost`, `requestCost`가 chunk 병합 휴리스틱을 조정하는 방식을 설명할 수 있다.

## 핵심 개념 및 설명

`experimental.turbopackChunking`은 Turbopack의 production JavaScript chunker를 설정한다. chunker가 사용자 행동을 어떻게 가정할지 바꾸고, 원본 크기 임계값을 조정하며, `experimental` component chunks 기능을 활성화할 수 있다.

Turbopack의 기본 chunking 설정은 다음과 같다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    turbopackChunking: {
      minChunkSize: 50000,
      maxChunkCountPerGroup: 40,
      maxMergeChunkSize: 200000,
      minComponentChunkSize: 20000,
      generateComponentChunks: false,
    },
  },
} satisfies NextConfig

export default nextConfig
```

### 크기 임계값 (Size Thresholds)

다음 옵션은 Turbopack이 chunk를 얼마나 적극적으로 병합하고 chunk를 얼마나 크게 만들 수 있는지 제어한다. 크기는 압축하지 않고 minify하지 않은 코드의 바이트 수를 기준으로 한다. 대략 압축하고 minify한 출력의 5배에 해당한다.

- **`minChunkSize`** (기본값 `50000`): 이 크기보다 작은 chunk가 둘 이상 만들어지지 않도록 작은 chunk를 더 큰 chunk에 병합한다. 값을 높이면 chunk 수는 줄고 크기는 커진다. 값을 낮추면 작은 chunk가 더 많이 생긴다.
- **`maxChunkCountPerGroup`** (기본값 `40`): chunk group 하나에 이 수보다 많은 chunk를 출력하지 않는다. chunk group은 예를 들어 하나의 route나 다이나믹 import에 해당한다. 값을 낮추면 더 적극적으로 병합해 페이지당 네트워크 요청 수가 줄어든다. 값을 높이면 더 작은 chunk가 만들어지고 내비게이션 중 cache hit 가능성이 커진다.
- **`maxMergeChunkSize`** (기본값 `200000`): 이 크기보다 큰 chunk는 다른 chunk와 병합하지 않는다. 큰 chunk의 코드가 여러 큰 출력 chunk에 중복되는 일을 막으려는 설정이다.

chunk를 병합하면 초기 페이지 로드 성능이 좋아지는 대신 내비게이션 성능이 낮아질 수 있다. 추가 네트워크 요청마다 비용이 들지만, 더 작은 chunk는 여러 페이지에서 재사용될 가능성이 높기 때문이다.

### Component Chunks

component chunks 생성은 `experimental` 기능으로, 병합한 chunk의 초기 페이지 로드 이점을 유지하면서 재사용성을 잃지 않게 한다. 런타임은 병합한 chunk를 하나의 파일로 로드할지, 아직 갖고 있지 않은 component chunks만 로드할지 동적으로 선택할 수 있다. 병합한 chunk로 이미 로드한 chunk는 다시 다운로드하지 않는다.

이 방식은 내비게이션할 때 브라우저가 이미 가진 JavaScript를 다시 다운로드하는 일을 막는다.

- **`generateComponentChunks`** (기본값 `false`): 활성화하면 병합한 각 production chunk와 함께 해당 chunk를 구성하는 component chunks도 출력한다. 브라우저 런타임은 개별 component chunk를 가져올 수 있다.
- **`minComponentChunkSize`** (기본값 `20000`): 이 크기보다 작은 component chunk는 하나씩 출력하지 않고 하나의 component로 묶는다. 아주 작은 chunk가 많이 만들어지는 일을 막기 위한 설정이다.

### 휴리스틱 (Heuristics)

다음 옵션은 두 chunk를 병합할 가치가 있는지 판단할 때 chunker가 사용하는 가정을 바꾼다.

- **`firstPageLoadPriority`** (0에서 1 사이의 숫자): 하나의 페이지를 처음 로드할 때 chunk를 병합하는 이점에 어느 정도 비중을 둘지 지정한다. 값이 높을수록 더 적극적으로 병합한다. 더 적절한 값을 모른다면 사이트의 bounce rate를 근사값으로 사용할 수 있다.
- **`priorityRoutes`** (`RegExp` 배열): 방문자가 첫 페이지로 자주 들어오는 route를 지정한다. 예를 들어 홈페이지가 해당한다. 이 route의 client-side bundle은 단일 route 요청 비용을 줄이기 위해 더 적극적으로 병합된다. 대신 다른 페이지로 내비게이션할 때 추가 요청이 발생한다.
- **`priorityBoost`** (기본값 `1.5`): `priorityRoutes` route가 단일 요청으로 처리될 확률에 곱하는 값이다. 값을 높이면 해당 route의 bundle을 더 적극적으로 병합한다.
- **`requestCost`** (기본값 `200000`): 추가 요청 하나의 예상 비용을 압축하지 않고 minify하지 않은 코드의 바이트 수로 지정한다. 값을 높이면 더 적은 수의 큰 chunk와 전체적으로 더 적은 요청을 선호한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 동일한 애플리케이션을 기본 설정과 각 `experimental.turbopackChunking` 설정으로 production build하고 생성된 JavaScript chunk 목록을 비교한다.
- 브라우저의 Network 패널에서 첫 페이지 로드와 다른 route로 내비게이션할 때의 요청 수, chunk 크기, 이미 받은 chunk의 재사용 여부를 관찰한다.
- `priorityRoutes`와 `requestCost`를 바꿔 첫 진입 route의 병합 정도와 이후 내비게이션 요청 수가 달라지는지 확인한다.

## 연습 문제

1. `minChunkSize`의 값을 높였을 때 일반적으로 나타나는 결과는 무엇인가?
   - A. 더 많은 작은 chunk가 만들어진다.
   - B. 더 적은 수의 큰 chunk가 만들어진다.
   - C. 모든 JavaScript chunk가 삭제된다.
   - D. `priorityRoutes`가 자동으로 설정된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `minChunkSize`는 작은 chunk를 더 큰 chunk에 병합하는 기준이므로 값을 높이면 더 적은 수의 큰 chunk가 만들어진다.
</details>

2. `generateComponentChunks: true`에 대한 설명으로 올바른 것은 무엇인가?
   - A. production build에서 component chunks를 만들지 않는다.
   - B. 병합한 production chunk와 함께 구성 요소인 component chunks도 출력한다.
   - C. 모든 route의 JavaScript를 하나의 chunk로 합친다.
   - D. 개발 환경에서만 CSS chunk를 생성한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 이 옵션을 활성화하면 병합한 production chunk에 포함된 component chunks도 출력해 런타임이 필요한 조각만 가져올 수 있게 한다.
</details>

3. `requestCost` 값을 높이면 chunker는 어떤 선택을 선호하는가?
   - A. 더 많은 작은 chunk와 더 많은 요청
   - B. 더 적은 수의 큰 chunk와 더 적은 요청
   - C. `priorityRoutes`의 정규식 제거
   - D. 이미 로드한 chunk의 강제 재다운로드

<details><summary>정답 보기</summary>

정답: **B**  
해설: `requestCost`는 추가 요청의 예상 비용이다. 값이 높으면 chunker가 요청 수를 줄이기 위해 더 큰 chunk를 선호한다.
</details>

## 챕터 요약

- `experimental.turbopackChunking`은 Turbopack production JavaScript chunker의 크기, 개수, 병합 방식을 조정한다.
- `minChunkSize`, `maxChunkCountPerGroup`, `maxMergeChunkSize`는 chunk 병합과 크기 상한을 제어한다.
- `generateComponentChunks`와 `minComponentChunkSize`는 component chunks를 출력하고 작은 조각이 너무 많이 생기지 않게 한다.
- `firstPageLoadPriority`, `priorityRoutes`, `priorityBoost`, `requestCost`는 사용자 행동과 추가 요청 비용을 기준으로 병합 정도를 조정한다.
- chunk를 병합하면 초기 페이지 로드 요청을 줄일 수 있지만 내비게이션에서 재사용할 수 있는 작은 chunk가 줄어들 수 있다.
