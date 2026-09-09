# mdxRs

- 공식 문서: [mdxRs](https://nextjs.org/docs/app/api-reference/config/next-config-js/mdxRs)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `mdxRs`가 `@next/mdx`와 함께 MDX 파일을 Rust compiler로 컴파일하는 실험적 옵션임을 이해한다.
- `next.config.js`에서 `pageExtensions`와 `experimental.mdxRs`를 함께 설정하는 방법을 익힌다.
- experimental 기능을 production에 적용할 때의 문서상 제한을 설명할 수 있다.

## 핵심 개념 및 설명

`mdxRs`는 `@next/mdx`와 함께 experimental 용도로 쓰며, MDX 파일을 새로운 Rust compiler로 컴파일한다.

`next.config.js`에서 `@next/mdx` wrapper를 만들고 `experimental.mdxRs`를 `true`로 설정한다. MDX 파일을 페이지로 사용하려면 `pageExtensions`에 `'mdx'`를 포함한다.

```js
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `@next/mdx`로 간단한 `.mdx` 페이지를 구성하고 `experimental.mdxRs: true`를 설정한 뒤 브라우저에서 MDX 페이지가 렌더링되는지 확인한다.
- `pageExtensions`에 `'mdx'`가 포함된 경우와 빠진 경우의 라우팅과 build 결과를 비교해 이 설정이 어떤 역할을 하는지 관찰한다.

## 연습 문제

1. `mdxRs`의 역할로 가장 알맞은 것은?
   - A. CSS를 브라우저에서 inline으로 변환한다.
   - B. `@next/mdx`와 함께 MDX 파일을 새로운 Rust compiler로 컴파일한다.
   - C. 모든 JavaScript 파일을 TypeScript로 변환한다.
   - D. `next/image`의 이미지 캐시를 외부 저장소로 옮긴다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `mdxRs`는 `@next/mdx`와 함께 MDX 파일을 새로운 Rust compiler로 컴파일하는 experimental 옵션이다.
</details>

2. MDX 파일을 페이지 확장자로 사용하기 위한 설정에 포함해야 하는 값은?
   - A. `pageExtensions: ['ts', 'tsx', 'mdx']`의 `'mdx'`
   - B. `experimental: { mdxRs: false }`의 `false`
   - C. `httpAgentOptions: { keepAlive: false }`
   - D. `images: { customCacheHandler: true }`

<details><summary>정답 보기</summary>

정답: **A**  
해설: 공식 예제는 `pageExtensions`에 `'mdx'`를 포함하고 `experimental.mdxRs`를 `true`로 설정한다.
</details>

## 챕터 요약

- `mdxRs`는 `@next/mdx`와 함께 MDX 파일을 Rust compiler로 컴파일하는 experimental 옵션이다.
- `pageExtensions`에 `'mdx'`를 추가해 MDX 파일을 페이지 확장자로 등록한다.
- `experimental.mdxRs`를 `true`로 설정하고 `withMDX(nextConfig)`를 export한다.
- 이 기능은 변경될 수 있으며 production 환경에는 권장하지 않는다.
