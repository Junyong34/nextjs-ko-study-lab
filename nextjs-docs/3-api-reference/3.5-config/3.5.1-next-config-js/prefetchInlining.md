# prefetchInlining

- 공식 문서: [prefetchInlining](https://nextjs.org/docs/app/api-reference/config/next-config-js/prefetchInlining)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- App Router가 작은 세그먼트 응답을 하나의 `prefetch` 응답에 인라인하는 방식을 이해한다.
- `experimental.prefetchInlining`에 `true`, `false`, 객체를 지정할 때의 차이를 구분한다.
- `maxSize`와 `maxBundleSize`가 gzip으로 압축한 세그먼트 응답의 크기를 기준으로 동작한다는 점을 익힌다.

## 핵심 개념 및 설명

현재 이 기능은 실험적이며 변경될 수 있으므로 프로덕션 사용을 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에서 피드백을 공유할 수 있다.

App Router가 라우트를 `prefetch`할 때 작은 세그먼트 응답을 각각 요청하지 않고 하나의 응답으로 묶을 수 있다. 이렇게 하면 `prefetch` 요청 수가 줄어든다. 대신 여러 라우트에서 공유하는 세그먼트 데이터가 중복될 수 있다. 이 동작은 기본적으로 켜져 있으며 애플리케이션 대부분은 기본값을 유지하는 편이 낫다.

`experimental.prefetchInlining` 옵션을 사용하면 이 동작을 덮어쓰거나 인라이닝을 끌 수 있다. 내비게이션 문제를 디버깅하거나 요청량을 측정할 때 활용할 수 있다. 대부분의 애플리케이션에서는 기본 동작을 바꿀 필요가 없다.

> **알아두면 좋은 점**:
>
> 인라이닝 동작은 App Router의 영구적인 구성 요소다. 실험적인 부분은 `experimental.prefetchInlining` 설정뿐이므로 옵션은 앞으로 바뀔 수 있다.

### Usage (사용법)

인라이닝을 끄려면 `experimental.prefetchInlining`을 `false`로 설정한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    prefetchInlining: false,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    prefetchInlining: false,
  },
}

module.exports = nextConfig
```

인라이닝을 끄지 않고 임계값을 덮어쓰려면 객체를 전달한다. 객체에서 생략한 값은 기본값을 유지한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    prefetchInlining: {
      maxSize: 2048,
      maxBundleSize: 10240,
    },
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    prefetchInlining: {
      maxSize: 2048,
      maxBundleSize: 10240,
    },
  },
}

module.exports = nextConfig
```

### Reference (레퍼런스)

`experimental.prefetchInlining`에는 다음 값을 지정할 수 있다.

| 값 | 설명 |
| --- | --- |
| `true` | 기본 임계값으로 `prefetch` 응답을 인라인한다. 기본값이다. |
| `false` | `prefetch` 인라이닝을 끈다. 각 세그먼트를 별도 요청으로 `prefetch`한다. |
| `object` | 지정한 `maxSize` 또는 `maxBundleSize`를 사용해 `prefetch` 응답을 인라인한다. |

객체를 전달하면 다음 옵션으로 임계값을 제어한다. 두 값 모두 gzip으로 압축한 세그먼트 응답의 바이트 단위 크기를 기준으로 한다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `maxSize` | `number` | `2048` | 인라이닝 대상이 될 수 있는 단일 세그먼트 응답의 최대 크기다. |
| `maxBundleSize` | `number` | `10240` | 경로를 따라 하나의 묶음 `prefetch` 응답에 인라인할 수 있는 전체 크기의 최대값이다. |

임계값을 낮추면 세그먼트별 중복 제거가 더 많이 유지된다. 임계값을 높이면 더 많은 데이터를 인라인해 요청 수를 더 줄일 수 있다.

### Version History (버전 기록)

| 버전 | 변경 사항 |
| --- | --- |
| `16.3.0` | `experimental.prefetchInlining`을 기본적으로 활성화했다. |
| `16.2.0` | `experimental.prefetchInlining`을 추가했다. |

### Related (관련 문서)

- [Link Component](../../3.2-components/link.md): 기본 제공 `next/link` 컴포넌트로 빠른 클라이언트 내비게이션을 쓸 수 있게 한다.
- [Prefetching](../../../2-guides/prefetching.md): Next.js에서 `prefetch`를 구성하는 방법을 다룬다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 라우트를 두 개 이상 준비하고 `<Link>`가 화면에 나타날 때 어떤 `prefetch` 요청이 발생하는지 네트워크 패널에서 관찰한다.
- `experimental.prefetchInlining: true`, `false`, 객체 설정을 각각 적용해 요청 수와 묶음 응답의 차이를 비교한다.
- 객체 설정에서는 `maxSize`와 `maxBundleSize`를 낮춰 세그먼트 응답이 개별 요청으로 남는 조건을 확인한다.

## 연습 문제

1. `experimental.prefetchInlining: false`를 설정했을 때의 동작으로 옳은 것은?
   - A. 모든 라우트의 `prefetch`가 비활성화된다.
   - B. 각 세그먼트를 별도 요청으로 `prefetch`한다.
   - C. 모든 세그먼트 응답을 하나의 무제한 응답으로 묶는다.
   - D. `prefetch` 요청이 빌드 시점에만 실행된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `false`는 인라이닝만 끄며 각 세그먼트는 별도 요청으로 `prefetch`된다.
</details>

2. `maxSize`와 `maxBundleSize`의 측정 기준으로 옳은 것은?
   - A. 압축하지 않은 JavaScript 파일의 문자 수다.
   - B. gzip으로 압축한 세그먼트 응답의 바이트 수다.
   - C. 브라우저 캐시의 전체 용량이다.
   - D. 라우트의 HTML 문서 개수다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 두 임계값은 gzip으로 압축한 세그먼트 응답을 바이트 단위로 측정한다.
</details>

## 챕터 요약

- App Router는 작은 세그먼트 응답을 묶어 `prefetch` 요청 수를 줄일 수 있다.
- 인라이닝 동작은 기본적으로 켜져 있으며 `experimental.prefetchInlining`은 실험적 설정이다.
- `true`는 기본값 유지, `false`는 비활성화, 객체는 임계값 조정으로 구분한다.
- `maxSize`는 단일 세그먼트, `maxBundleSize`는 경로상의 묶음 응답 전체를 제한한다.
- 두 임계값은 gzip으로 압축한 세그먼트 응답의 바이트 크기를 기준으로 한다.
