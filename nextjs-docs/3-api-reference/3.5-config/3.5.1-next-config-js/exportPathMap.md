# exportPathMap

- 공식 문서: [exportPathMap](https://nextjs.org/docs/app/api-reference/config/next-config-js/exportPathMap)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Legacy**: 이 API는 legacy이며 더 이상 권장하지 않는다. 하위 호환성을 위해 계속 지원된다.

## 학습 목표

- 레거시 API인 `exportPathMap`이 요청 경로와 `pages` 디렉터리의 페이지를 매핑하는 방식을 이해한다.
- `exportPathMap` 함수의 인자와 반환 객체의 `page`, `query` 필드를 설명할 수 있다.
- `trailingSlash`와 `next export -o`가 정적 export 결과에 미치는 영향을 파악한다.
- `exportPathMap`의 deprecated 상태와 `getStaticPaths`, `generateStaticParams`로 대체하는 방향을 이해한다.

## 핵심 개념 및 설명

이 기능은 `next export` 전용이며 현재는 `deprecated` 상태다. `pages`에서는 `getStaticPaths`, `app`에서는 `generateStaticParams`를 사용하는 방식을 권장한다.

`exportPathMap`으로 export할 요청 경로와 렌더링할 페이지의 매핑을 지정할 수 있다. 여기에 정의한 경로는 [`next dev`](../../3.6-cli/next.md#next-dev-options)를 실행할 때에도 사용할 수 있다.

예를 들어 애플리케이션에 다음 세 페이지가 있다고 가정한다.

- `pages/index.js`
- `pages/about.js`
- `pages/post.js`

`next.config.js`에 다음과 같이 `exportPathMap`을 설정한다.

```js filename="next.config.js"
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}
```

> **알아두면 좋은 점**: `exportPathMap`의 `query` 필드는 [자동으로 정적 최적화되는 페이지](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization) 또는 [`getStaticProps` 페이지](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)와 함께 사용할 수 없다. 이런 페이지는 빌드 시점에 HTML 파일로 렌더링되므로 `next export` 중에 추가 query 정보를 전달할 수 없다.

페이지는 HTML 파일로 export된다. 예를 들어 `/about`은 `/about.html`이 된다.

`exportPathMap`은 두 인자를 받는 `async` 함수다. 첫 번째 인자는 Next.js가 사용하는 기본 매핑인 `defaultPathMap`이다. 두 번째 인자는 다음 속성을 담은 객체다.

- `dev`: 개발 중 `exportPathMap`이 호출되면 `true`다. `next export`를 실행하면 `false`다. 개발 중에는 이 값으로 라우트를 정의한다.
- `dir`: 프로젝트 디렉터리의 절대 경로다.
- `outDir`: `out/` 디렉터리의 절대 경로다. [`-o`](./exportPathMap.md#출력-디렉터리-사용자-지정-customizing-the-output-directory)로 이 경로를 설정할 수 있다. `dev`가 `true`이면 `outDir` 값은 `null`이다.
- `distDir`: `.next/` 디렉터리의 절대 경로다. [`distDir`](./distDir.md) 설정으로 이 경로를 구성할 수 있다.
- `buildId`: 생성된 build id다.

반환 객체는 페이지 매핑이다. `key`는 `pathname`이고 `value`는 다음 필드를 받을 수 있는 객체다.

- `page`: `String` 타입이다. 렌더링할 `pages` 디렉터리 안의 페이지다.
- `query`: `Object` 타입이다. `prerendering`할 때 `getInitialProps`에 전달하는 `query` 객체다. 기본값은 `{}`다.

export된 `pathname`은 파일 이름일 수도 있다. 예를 들어 `/readme.md`를 사용할 수 있다. `.html`과 확장자가 다르면 해당 콘텐츠를 제공할 때 `Content-Type` 헤더를 `text/html`로 설정해야 할 수 있다.

### 후행 슬래시 추가 (Adding a trailing slash)

페이지를 `index.html` 파일로 export하고 URL에 후행 슬래시를 요구하도록 Next.js를 구성할 수 있다. 이때 `/about`은 `/about/index.html`이 되고 `/about/`으로 라우팅할 수 있다. 이 동작은 Next.js 9 이전의 기본값이었다.

후행 슬래시를 다시 사용하려면 `next.config.js`에서 `trailingSlash`를 활성화한다.

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

### 출력 디렉터리 사용자 지정 (Customizing the output directory)

[`next export`](../../../2-guides/static-exports.md)는 기본 출력 디렉터리로 `out`을 사용한다. `-o` 인자로 이 디렉터리를 변경할 수 있다.

```bash filename="Terminal"
next export -o outdir
```

> **주의**: `exportPathMap` 사용은 `deprecated` 상태이며 `pages` 내부의 `getStaticPaths`가 `exportPathMap`을 덮어쓴다. 두 기능을 함께 사용하는 것은 권장하지 않는다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (정적 export 결과와 후행 슬래시 라우팅을 브라우저에서 확인할 수 있다)
- `pages/index.js`, `pages/about.js`, `pages/post.js`를 만들고 예제의 `exportPathMap`을 설정한다.
- `next export -o outdir`를 실행한 뒤 `outdir/about.html`이 생성되고 브라우저에서 `/about`을 열 수 있는지 확인한다.
- `trailingSlash: true`를 적용하면 `outdir/about/index.html`이 생성되고 `/about/`으로 접근하는지 비교한다.

## 연습 문제

1. `exportPathMap`의 `query` 필드에 대한 설명으로 올바른 것은 무엇인가?
   - A. 모든 `getStaticProps` 페이지에 요청 시점의 query 값을 주입한다.
   - B. `prerendering`할 때 `getInitialProps`에 전달할 `query` 객체이며 기본값은 `{}`다.
   - C. `next export`가 생성하는 출력 디렉터리 이름을 지정한다.
   - D. 브라우저의 주소창에 표시할 URL에 자동으로 `/query`를 붙인다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `query`는 `prerendering`할 때 `getInitialProps`에 전달되는 객체이며 기본값은 `{}`다. 자동으로 정적 최적화되는 페이지나 `getStaticProps` 페이지에서는 사용할 수 없다.
</details>

2. `trailingSlash: true`를 설정했을 때 `/about`의 export 결과와 접근 경로로 올바른 것은 무엇인가?
   - A. `/about.html`이 생성되고 `/about`으로 접근한다.
   - B. `/about/index.html`이 생성되고 `/about/`으로 접근한다.
   - C. `/index/about.html`이 생성되고 `/index/about`으로 접근한다.
   - D. 출력 파일은 바뀌지 않고 `query`만 변경된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `trailingSlash`를 활성화하면 `/about`이 `/about/index.html`로 export되고 `/about/`으로 라우팅된다.
</details>

3. `exportPathMap`을 사용할 때 공식 문서가 권장하지 않는 조합은 무엇인가?
   - A. `exportPathMap`과 `pages` 내부의 `getStaticPaths`
   - B. `exportPathMap`과 `pages/index.js`
   - C. `exportPathMap`과 `next dev`
   - D. `exportPathMap`과 `trailingSlash: true`

<details><summary>정답 보기</summary>

정답: **A**  
해설: `pages` 내부의 `getStaticPaths`가 `exportPathMap`을 덮어쓸 수 있으므로 두 기능을 함께 사용하는 것은 권장하지 않는다.
</details>

## 챕터 요약

- `exportPathMap`은 `next export`에서 요청 경로와 `pages` 페이지의 매핑을 지정하는 레거시 API다.
- `dev`, `dir`, `outDir`, `distDir`, `buildId`를 함수의 두 번째 인자에서 받을 수 있다.
- 반환 객체의 `page`는 렌더링할 페이지를, `query`는 `getInitialProps`에 전달할 객체를 나타낸다.
- `trailingSlash: true`를 사용하면 `/about`이 `/about/index.html`이 되고 `/about/`으로 접근한다.
- `exportPathMap`은 `deprecated` 상태이며 `getStaticPaths` 또는 `generateStaticParams`를 사용하는 방식을 권장한다.
