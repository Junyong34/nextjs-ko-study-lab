# serverComponentsHmrCache

- 공식 문서: [serverComponentsHmrCache](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `serverComponentsHmrCache`가 로컬 개발에서 HMR로 새로고침할 때 `Server Component` 응답을 캐시하는 방식을 이해한다.
- `cache: 'no-store'`를 지정한 `fetch` 요청에도 HMR 캐시가 적용되는 기본 동작과 캐시가 지워지는 시점을 설명할 수 있다.
- TypeScript와 JavaScript 설정에서 `experimental.serverComponentsHmrCache`를 비활성화하고 `logging.fetches`로 관찰하는 방법을 익힌다.

## 핵심 개념 및 설명

> **실험적 기능**: 이 기능은 현재 `experimental` 상태이며 변경될 수 있다. production에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에서 피드백을 공유한다.

`serverComponentsHmrCache`는 로컬 개발에서 Hot Module Replacement(HMR)로 새로고침할 때 `Server Component`의 `fetch` 응답을 캐시하는 `experimental` 옵션이다. 응답 속도를 높이고 과금되는 API 호출 비용을 줄인다.

### 기본 동작

기본적으로 HMR 캐시는 `cache: 'no-store'` 옵션이 있는 요청을 포함해 모든 `fetch` 요청에 적용된다. 따라서 캐시하지 않는 요청도 HMR 새로고침 사이에는 최신 데이터가 반영되지 않는다.

다만 페이지를 이동하거나 전체 페이지를 새로고침하면 HMR 캐시가 지워진다.

### HMR 캐시 비활성화

`next.config.ts` 또는 `next.config.js`에서 `serverComponentsHmrCache`를 `false`로 설정하면 HMR 캐시를 비활성화할 수 있다. 주석에 적힌 대로 기본값은 `true`다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // 기본값은 true
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // 기본값은 true
  },
}

module.exports = nextConfig
```

> **알아두면 좋은 점**: 동작을 더 잘 관찰하려면 [`logging.fetches`](./logging.md) 옵션을 쓰기를 권장한다. 이 옵션은 개발 중 콘솔에 fetch 캐시 적중과 누락을 기록한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `Server Component`에서 `cache: 'no-store'`를 사용해 고정된 URL을 `fetch`하고 응답 시각을 화면에 표시한다. 기본 설정에서 HMR로 새로고침해도 같은 응답이 유지되는지 확인한다.
- 페이지를 이동하거나 전체 페이지를 새로고침한 뒤 응답 시각이 바뀌는지 비교한다.
- `experimental.serverComponentsHmrCache: false`를 적용한 상태에서 HMR 새로고침마다 새로운 응답을 확인하고 `logging.fetches`의 캐시 적중과 누락 로그를 함께 관찰한다.

## 연습 문제

1. HMR 캐시의 기본 동작으로 올바른 것은 무엇인가?
   - A. `cache: 'no-store'` 요청에는 적용되지 않는다.
   - B. 모든 `fetch` 요청에 적용되며, 페이지 이동이나 전체 페이지 새로고침 때 지워진다.
   - C. 전체 페이지 reload 후에도 유지된다.
   - D. production의 모든 서버 요청에 적용된다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: 기본적으로 HMR 캐시는 `cache: 'no-store'` 요청을 포함한 모든 `fetch` 요청에 적용되지만 페이지 이동이나 전체 페이지 새로고침이 발생하면 지워진다.
</details>

2. HMR 캐시를 비활성화하는 설정으로 알맞은 것은 무엇인가?
   - A. `experimental.serverComponentsHmrCache: false`
   - B. `serverComponentsHmrCache: 'disabled'`
   - C. `experimental.hmrCache: false`
   - D. `logging.fetches: false`

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: `experimental` 객체 안에서 `serverComponentsHmrCache`를 `false`로 설정하면 HMR 캐시를 비활성화할 수 있다. `logging.fetches`는 캐시 적중과 누락을 관찰하기 위한 옵션이다.
</details>

## 챕터 요약

- `serverComponentsHmrCache`는 현재 `experimental` 상태이며 production 사용을 권장하지 않는다.
- 기본적으로 로컬 개발에서 HMR로 새로고침하는 동안 모든 `fetch` 응답을 캐시하며 `cache: 'no-store'` 요청도 포함한다.
- HMR 새로고침 사이에는 캐시되지 않아야 할 요청도 최신 데이터를 표시하지 않을 수 있다.
- 페이지를 이동하거나 전체 페이지를 새로고침하면 HMR 캐시가 지워진다.
- `experimental.serverComponentsHmrCache: false`로 기능을 끄고 `logging.fetches`로 캐시 적중과 누락을 관찰할 수 있다.
