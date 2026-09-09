# authInterrupts

- 공식 문서: [authInterrupts](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `authInterrupts`가 `forbidden`과 `unauthorized` API를 활성화하는 설정임을 이해한다.
- `experimental.authInterrupts`의 설정 위치와 canary 기능의 변경 가능성을 파악한다.
- `forbidden`, `unauthorized`, `forbidden.js`, `unauthorized.js` 문서가 각각 어떤 API와 file convention을 다루는지 구분한다.

## 핵심 개념 및 설명

> **Canary**: 이 기능은 현재 canary channel에서만 사용할 수 있으며 변경될 수 있다. [Next.js 업그레이드](https://nextjs.org/docs/app/getting-started/upgrading#canary-version)로 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 의견을 남긴다.

`authInterrupts` 설정은 애플리케이션에서 [`forbidden`](../../3.3-functions/forbidden.md)과 [`unauthorized`](../../3.3-functions/unauthorized.md) API를 사용할 수 있게 한다. 두 함수는 experimental 기능이므로 사용하려면 `next.config.js`에 `authInterrupts` 옵션을 활성화해야 한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  experimental: {
    authInterrupts: true,
  },
}
```

### forbidden

[`forbidden`](../../3.3-functions/forbidden.md) 함수의 API Reference다.

### unauthorized

[`unauthorized`](../../3.3-functions/unauthorized.md) 함수의 API Reference다.

### forbidden.js

[`forbidden.js`](../../3.1-file-conventions/forbidden.md) special file의 API Reference다.

### unauthorized.js

[`unauthorized.js`](../../3.1-file-conventions/unauthorized.md) special file의 API Reference다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- canary 버전에서 인증 상태에 따라 `forbidden()`과 `unauthorized()`를 호출하는 경로를 구성한다.
- 권한이 없는 사용자에게는 `forbidden.js`의 UI를, 인증되지 않은 사용자에게는 `unauthorized.js`의 UI를 렌더링한 결과를 브라우저에서 비교한다.
- canary 기능이며 변경될 수 있다는 경고와 현재 활성화한 설정을 검증 패널에 함께 표시한다.

## 연습 문제

1. `authInterrupts`를 활성화하는 올바른 설정은 무엇인가?
   - A. `authInterrupts: true`
   - B. `experimental: { authInterrupts: true }`
   - C. `forbidden: { authInterrupts: true }`
   - D. `experimental: { unauthorized: true }`

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `authInterrupts`는 `experimental` 객체 안에 `authInterrupts: true`로 설정한다.
</details>

2. `authInterrupts`에 대한 설명으로 올바른 것은 무엇인가?
   - A. stable 기능이므로 모든 버전에서 변경되지 않는다.
   - B. `forbidden`과 `unauthorized` API를 사용하기 위한 experimental 설정이다.
   - C. `allowedDevOrigins`에 등록한 hostname만 허용한다.
   - D. `cacheComponents`를 자동으로 활성화한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: 공식 문서는 `authInterrupts`를 experimental 기능인 `forbidden`과 `unauthorized` API를 사용하기 위한 설정으로 설명하며, 현재 canary channel에서 제공한다.
</details>

## 챕터 요약

- `authInterrupts`는 `forbidden`과 `unauthorized` API를 사용할 수 있게 한다.
- 두 함수가 experimental 기능이므로 `experimental.authInterrupts: true`를 설정해야 한다.
- 공식 예제는 `next.config.ts`와 `next.config.js` 두 형태로 제공한다.
- `forbidden`과 `unauthorized`는 함수 API이고 `forbidden.js`와 `unauthorized.js`는 special file이다.
- 이 기능은 현재 canary channel에서 제공되며 변경될 수 있다.
