# webpack

- 공식 문서: [webpack](https://nextjs.org/docs/app/api-reference/config/next-config-js/webpack)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js가 사용하는 webpack 설정을 확장하는 방법을 이해한다.
- `webpack` 함수의 두 번째 인자에 전달되는 build 정보와 기본 loader를 파악한다.
- server와 client, Node.js와 Edge Runtime 빌드를 구분해 설정하는 방법을 익힌다.
- 사용자 지정 webpack 설정이 semver 적용 대상이 아니어서 생기는 위험을 이해한다.

## 핵심 개념 및 설명

> **알아두면 좋은 점**: webpack 설정 변경은 semver의 적용 대상이 아니므로 사용할 때 주의한다.

사용자 지정 webpack 설정을 추가하기 전에 Next.js가 이미 지원하는 기능이 있는지 확인한다.

- [CSS imports](../../../1-getting-started/css.md)
- [CSS modules](../../../1-getting-started/css.md#css-modules)
- [Sass/SCSS imports](https://nextjs.org/docs/app/guides/sass)
- [Sass/SCSS modules](https://nextjs.org/docs/app/guides/sass)

자주 요청되는 기능 중 일부는 다음 plugin으로 사용할 수 있다.

- [`@next/mdx`](https://github.com/vercel/next.js/tree/canary/packages/next-mdx)
- [`@next/bundle-analyzer`](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)

`webpack`을 확장하려면 `next.config.js`에서 기존 설정을 확장하는 함수를 정의한다.

```js filename="next.config.js"
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // 수정한 config를 반드시 반환한다.
    return config
  },
}
```

`webpack` 함수는 세 번 실행된다. server용으로 두 번, client용으로 한 번이며 server 실행은 Node.js와 Edge Runtime으로 나뉠 수 있다. 따라서 `isServer` 속성으로 client 설정과 server 설정을 구분할 수 있다.

두 번째 인자는 다음 속성을 담은 객체다.

- `buildId`: `String`이며 빌드 사이에서 고유 식별자로 사용하는 build id다.
- `dev`: `Boolean`이며 development에서 컴파일하는지 나타낸다.
- `isServer`: `Boolean`이며 server-side compilation이면 `true`, client-side compilation이면 `false`다.
- `nextRuntime`: `String | undefined`이며 server-side compilation의 target runtime이다. `"edge"` 또는 `"nodejs"`가 될 수 있고 client-side compilation에서는 `undefined`다.
- `defaultLoaders`: `Object`이며 Next.js가 내부적으로 사용하는 기본 loader다.
  - `babel`: `Object`이며 기본 `babel-loader` 설정이다.

`defaultLoaders.babel` 사용 예시는 다음과 같다.

```js
// babel-loader에 의존하는 loader를 추가하는 설정 예시
// @next/mdx plugin의 소스에서 가져온 예시다.
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })

    return config
  },
}
```

### `nextRuntime`

`nextRuntime`이 `"edge"` 또는 `"nodejs"`이면 `isServer`는 `true`다. 현재 `nextRuntime: "edge"`는 Edge Runtime에서 실행되는 proxy와 Server Component에만 해당한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `isServer`와 `nextRuntime`을 출력해 client, Node.js server, Edge Runtime 빌드가 각각 어떻게 호출되는지 확인한다.
- `defaultLoaders.babel`을 사용하는 MDX loader를 추가하고 `.mdx` 파일이 webpack으로 처리되는지 검증한다.

## 연습 문제

1. `webpack` 함수에서 server-side compilation을 확인하는 방법은 무엇인가?
   - A. `isServer === true`인지 확인한다.
   - B. `dev === false`인지 확인한다.
   - C. `buildId`가 비어 있는지 확인한다.
   - D. `nextRuntime === undefined`인지 확인한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `isServer`는 server-side compilation에서 `true`, client-side compilation에서 `false`다.
</details>

2. client-side compilation에서 `nextRuntime`의 값은 무엇인가?
   - A. `"browser"`
   - B. `"nodejs"`
   - C. `undefined`
   - D. `null`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `nextRuntime`은 server-side compilation에서는 `"edge"` 또는 `"nodejs"`이고 client-side compilation에서는 `undefined`다.
</details>

## 챕터 요약

- `webpack` 함수로 Next.js의 webpack 설정을 확장할 수 있다.
- 함수는 server용 두 번, client용 한 번 실행된다.
- `isServer`, `dev`, `nextRuntime`, `buildId`, `defaultLoaders`로 실행 맥락을 구분한다.
- 사용자 지정 webpack 설정은 semver의 적용 대상이 아니므로 변경 위험을 고려해야 한다.
