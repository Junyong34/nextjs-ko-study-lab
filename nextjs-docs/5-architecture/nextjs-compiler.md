# Next.js Compiler

- 공식 문서: [Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler)
- 상위 메뉴: [Architecture](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js Compiler가 Babel과 Terser를 대체하게 된 배경과 SWC를 선택한 이유를 설명한다.
- `next.config.js`의 `compiler` 옵션으로 설정할 수 있는 주요 기능(Styled Components, Jest, Relay, Remove Console 등)을 파악한다.
- 애플리케이션이 Next.js Compiler 대신 Babel로 자동 폴백되는 조건을 이해한다.
- 실험적 기능(SWC Trace profiling, SWC Plugins)의 목적과 설정 방법을 설명한다.
- 버전별로 Next.js Compiler 관련 기능이 어떻게 도입·안정화되었는지 파악한다.

## 핵심 개념 및 설명

### Next.js Compiler란

Next.js Compiler는 [SWC](https://swc.rs/)를 사용해 Rust로 작성된 컴파일러로, 프로덕션을 위해 JavaScript 코드를 변환하고 압축(minify)한다. 개별 파일을 변환하던 Babel과 번들 출력을 압축하던 Terser를 각각 대체한다.

Next.js Compiler를 사용한 컴파일은 Babel보다 17배 빠르며, Next.js 12 버전부터 기본으로 활성화되어 있다. 기존 Babel 설정을 가지고 있거나 [지원되지 않는 기능](#지원되지-않는-기능unsupported-features)을 사용하는 애플리케이션은 Next.js Compiler를 사용하지 않고 계속 Babel을 사용하게 된다.

### SWC를 선택한 이유

[SWC](https://swc.rs/)는 차세대 고속 개발 도구를 위해 만들어진, 확장 가능한 Rust 기반 플랫폼이다.

SWC는 컴파일, 압축, 번들링 등에 사용될 수 있으며 확장 가능하도록 설계되어 있다. SWC 자체는 코드 변환(내장 변환이든 커스텀 변환이든)을 수행하도록 호출하는 대상이며, 이 변환은 Next.js 같은 상위 도구를 통해 실행된다.

Next.js 팀이 SWC를 기반으로 삼은 이유는 다음과 같다.

- **확장성(Extensibility)**: SWC는 라이브러리를 포크하거나 설계 제약을 우회하지 않고도 Next.js 내부에서 Crate로 사용할 수 있다.
- **성능(Performance)**: SWC로 전환하면서 Next.js의 Fast Refresh는 약 3배, 빌드는 약 5배 빨라졌으며, 추가 최적화 여지도 남아 있다.
- **WebAssembly**: Rust의 WASM 지원은 가능한 모든 플랫폼을 지원하고 Next.js 개발 환경을 어디서든 사용할 수 있게 하는 데 필수적이다.
- **커뮤니티(Community)**: Rust 커뮤니티와 생태계는 훌륭하며 계속 성장하고 있다.

### 지원되는 기능

아래 기능들은 모두 `next.config.js`의 `compiler` 옵션으로 설정한다.

#### Styled Components

Next.js Compiler는 `babel-plugin-styled-components`를 이식하는 작업을 진행하고 있다.

먼저 Next.js를 최신 버전으로 업데이트한다: `npm install next@latest`. 그리고 `next.config.js`를 다음과 같이 수정한다.

```js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

고급 사용 사례를 위해 styled-components 컴파일 관련 세부 속성을 개별적으로 설정할 수도 있다.

> **참고**: `ssr`과 `displayName` 변환은 Next.js에서 `styled-components`를 사용하기 위한 핵심 요구 사항이다.

```js
module.exports = {
  compiler: {
    // 각 옵션에 대한 자세한 내용은 https://styled-components.com/docs/tooling#babel-plugin 참고.
    styledComponents: {
      // 개발 환경에서는 기본으로 활성화되고, 파일 크기를 줄이기 위해 프로덕션에서는 기본으로 비활성화된다.
      // 이 값을 설정하면 모든 환경의 기본값을 덮어쓴다.
      displayName?: boolean,
      // 기본으로 활성화된다.
      ssr?: boolean,
      // 기본으로 활성화된다.
      fileName?: boolean,
      // 기본값은 빈 배열이다.
      topLevelImportPaths?: string[],
      // 기본값은 ["index"]다.
      meaninglessFileNames?: string[],
      // 기본으로 활성화된다.
      minify?: boolean,
      // 기본으로 활성화된다.
      transpileTemplateLiterals?: boolean,
      // 기본값은 빈 문자열이다.
      namespace?: string,
      // 기본으로 비활성화된다.
      pure?: boolean,
      // 기본으로 활성화된다.
      cssProp?: boolean,
    },
  },
}
```

#### Jest

Next.js Compiler는 테스트 코드를 트랜스파일하고, Jest를 Next.js와 함께 설정하는 과정을 다음과 같이 단순화한다.

- `.css`, `.module.css`(및 `.scss` 변형)와 이미지 import를 자동으로 목(mock) 처리한다.
- SWC를 사용해 `transform`을 자동으로 설정한다.
- `.env`(및 모든 변형)를 `process.env`로 로드한다.
- 테스트 대상 검색과 변환에서 `node_modules`를 제외한다.
- 테스트 대상 검색에서 `.next`를 제외한다.
- 실험적 SWC 변환을 활성화하는 플래그를 위해 `next.config.js`를 로드한다.

먼저 Next.js를 최신 버전으로 업데이트한다: `npm install next@latest`. 그리고 `jest.config.js`를 다음과 같이 수정한다.

```js
const nextJest = require('next/jest')

// next.config.js와 .env 파일을 로드할 수 있도록 Next.js 앱 경로를 전달한다.
const createJestConfig = nextJest({ dir: './' })

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig는 next/jest가 비동기인 Next.js 설정을 로드할 수 있도록 이런 형태로 내보낸다.
module.exports = createJestConfig(customJestConfig)
```

#### Relay

[Relay](https://relay.dev/) 지원을 활성화하려면 다음과 같이 설정한다.

```js
module.exports = {
  compiler: {
    relay: {
      // relay.config.js와 값을 맞춰야 한다.
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false,
    },
  },
}
```

> **알아두면 좋은 점**: Next.js에서는 `pages` 디렉터리 안의 모든 JavaScript 파일이 라우트로 취급된다. 따라서 `relay-compiler`를 사용할 때는 `artifactDirectory` 설정을 `pages` 바깥으로 지정해야 한다. 그렇지 않으면 `relay-compiler`가 소스 파일 옆의 `__generated__` 디렉터리에 파일을 생성하고, 이 파일이 라우트로 취급되어 프로덕션 빌드를 망가뜨린다.

#### Remove React Properties

JSX 속성을 제거할 수 있게 해준다. 주로 테스트 용도로 사용되며, `babel-plugin-react-remove-properties`와 비슷하다.

기본 정규식 `^data-test`에 매칭되는 속성을 제거하려면 다음과 같이 설정한다.

```js
module.exports = {
  compiler: {
    reactRemoveProperties: true,
  },
}
```

커스텀 속성을 제거하려면 다음과 같이 설정한다.

```js
module.exports = {
  compiler: {
    // 여기 정의한 정규식은 Rust에서 처리되므로 JavaScript의 RegExp와 문법이 다르다.
    // https://docs.rs/regex 참고.
    reactRemoveProperties: { properties: ['^data-custom$'] },
  },
}
```

#### Remove Console

이 변환은 애플리케이션 코드(`node_modules`는 제외)에 있는 모든 `console.*` 호출을 제거할 수 있게 해준다. `babel-plugin-transform-remove-console`과 비슷하다.

모든 `console.*` 호출을 제거하려면 다음과 같이 설정한다.

```js
module.exports = {
  compiler: {
    removeConsole: true,
  },
}
```

`console.error`를 제외한 나머지 `console.*` 출력을 제거하려면 다음과 같이 설정한다.

```js
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
}
```

#### Legacy Decorators

Next.js는 `jsconfig.json` 또는 `tsconfig.json`의 `experimentalDecorators`를 자동으로 감지한다. 레거시 데코레이터는 `mobx` 같은 라이브러리의 이전 버전에서 흔히 사용된다.

이 플래그는 기존 애플리케이션과의 호환성을 위해서만 지원된다. 새 애플리케이션에서는 레거시 데코레이터 사용을 권장하지 않는다.

먼저 Next.js를 최신 버전으로 업데이트한다: `npm install next@latest`. 그리고 `jsconfig.json` 또는 `tsconfig.json`을 다음과 같이 수정한다.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

#### importSource

Next.js는 `jsconfig.json` 또는 `tsconfig.json`의 `jsxImportSource`를 자동으로 감지해 적용한다. [Theme UI](https://theme-ui.com/) 같은 라이브러리와 함께 흔히 사용된다.

먼저 Next.js를 최신 버전으로 업데이트한다: `npm install next@latest`. 그리고 `jsconfig.json` 또는 `tsconfig.json`을 다음과 같이 수정한다.

```json
{
  "compilerOptions": {
    "jsxImportSource": "theme-ui"
  }
}
```

#### Emotion

Next.js Compiler는 `@emotion/babel-plugin`을 이식하는 작업을 진행하고 있다.

먼저 Next.js를 최신 버전으로 업데이트한다: `npm install next@latest`. 그리고 `next.config.js`를 다음과 같이 수정한다.

```js
module.exports = {
  compiler: {
    emotion: boolean | {
      // 기본값은 true다. 빌드 타입이 production이면 비활성화된다.
      sourceMap?: boolean,
      // 기본값은 'dev-only'다.
      autoLabel?: 'never' | 'dev-only' | 'always',
      // 기본값은 '[local]'이다.
      // 허용값: `[local]` `[filename]` `[dirname]`
      // 이 옵션은 autoLabel이 'dev-only' 또는 'always'로 설정된 경우에만 동작한다.
      // 결과로 만들어지는 라벨의 형식을 정의할 수 있으며,
      // 변수가 들어갈 자리를 대괄호([])로 감싼 문자열로 형식을 정의한다.
      // 예를 들어 labelFormat: "my-classname--[local]"로 설정하면
      // [local]이 결과가 할당되는 변수 이름으로 치환된다.
      labelFormat?: string,
      // 기본값은 undefined다.
      // 이 옵션은 컴파일러가 어떤 import를 보고 변환 대상을 판단할지 알려준다.
      // 그래서 Emotion의 export를 재내보내기(re-export)해도 변환을 계속 사용할 수 있다.
      importMap?: {
        [packageName: string]: {
          [exportName: string]: {
            canonicalImport?: [string, string],
            styledBaseImport?: [string, string],
          }
        }
      },
    },
  },
}
```

#### 압축(Minification)

Next.js는 v13부터 기본적으로 자체 swc 컴파일러를 압축(minification)에 사용한다. 이는 Terser보다 7배 빠르다.

> **알아두면 좋은 점**: v15부터는 `next.config.js`로 압축을 커스터마이즈할 수 없다. `swcMinify` 플래그 지원이 제거되었다.

#### 모듈 트랜스파일(Module Transpilation)

Next.js는 로컬 패키지(모노레포 등)나 외부 의존성(`node_modules`)의 의존성을 자동으로 트랜스파일하고 번들링할 수 있다. 이는 `next-transpile-modules` 패키지를 대체한다.

```js
module.exports = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
```

#### Modularize Imports

이 옵션은 Next.js 13.5부터 [`optimizePackageImports`](../3-api-reference/3.5-config/3.5.1-next-config-js/optimizePackageImports.md)로 대체되었다. import 경로를 수동으로 설정할 필요가 없는 새 옵션으로 업그레이드하는 것을 권장한다.

#### Define(빌드 시점 변수 치환)

`define` 옵션은 코드 안의 변수를 빌드 타임에 정적으로 치환할 수 있게 해준다. 이 옵션은 키-값 쌍으로 이루어진 객체를 받으며, 각 키가 대응하는 값으로 치환될 변수다.

`next.config.js`의 `compiler.define` 필드는 모든 환경(서버, edge, 클라이언트)에 대한 변수를 정의할 때 사용한다. 서버 사이드(서버와 edge) 코드에만 변수를 정의하려면 `compiler.defineServer`를 사용한다.

```js
module.exports = {
  compiler: {
    define: {
      MY_VARIABLE: 'my-string',
      'process.env.MY_ENV_VAR': 'my-env-var',
    },
    defineServer: {
      MY_SERVER_VARIABLE: 'my-server-var',
    },
  },
}
```

#### 빌드 라이프사이클 훅(Build Lifecycle Hooks)

Next.js Compiler는 빌드 프로세스의 특정 시점에 커스텀 코드를 실행할 수 있는 라이프사이클 훅을 지원한다. 현재 다음 훅을 지원한다.

##### runAfterProductionCompile

프로덕션 빌드 컴파일이 끝난 뒤, 타입 체크나 정적 페이지 생성 같은 컴파일 이후 작업이 실행되기 전에 호출되는 훅 함수다. 이 훅은 프로젝트 디렉터리와 빌드 출력 디렉터리 등 프로젝트 메타데이터에 접근할 수 있게 해주므로, 소스맵 같은 빌드 산출물을 수집하는 서드파티 도구에 유용하다.

```js
module.exports = {
  compiler: {
    runAfterProductionCompile: async ({ distDir, projectDir }) => {
      // 여기에 커스텀 코드를 작성한다.
    },
  },
}
```

이 훅은 다음 속성을 가진 객체를 인자로 받는다.

- `distDir`: 빌드 출력 디렉터리(기본값은 `.next`)
- `projectDir`: 프로젝트의 루트 디렉터리

### 실험적 기능(Experimental Features)

#### SWC 트레이스 프로파일링(SWC Trace profiling)

SWC의 내부 변환 트레이스를 Chromium의 [trace event format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview?mode=html#%21=)으로 생성할 수 있다.

```js
module.exports = {
  experimental: {
    swcTraceProfiling: true,
  },
}
```

활성화하면 SWC는 `.next/` 아래에 `swc-trace-profile-${timestamp}.json`이라는 이름으로 트레이스를 생성한다. Chromium의 트레이스 뷰어(`chrome://tracing/`, [https://ui.perfetto.dev/](https://ui.perfetto.dev/))나 호환되는 flamegraph 뷰어([https://www.speedscope.app/](https://www.speedscope.app/))로 생성된 트레이스를 불러와 시각화할 수 있다.

#### SWC 플러그인(SWC Plugins, 실험적)

wasm으로 작성된 SWC의 실험적 플러그인 지원을 사용해 변환 동작을 커스터마이즈하도록 swc의 변환을 설정할 수 있다.

```js
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

`swcPlugins`는 플러그인을 설정하기 위한 튜플의 배열을 받는다. 플러그인용 튜플은 플러그인 경로와 플러그인 설정 객체로 구성된다. 플러그인 경로는 npm 모듈 패키지 이름이거나 `.wasm` 바이너리 자체를 가리키는 절대 경로일 수 있다.

### 지원되지 않는 기능(Unsupported Features)

애플리케이션에 `.babelrc` 파일이 있으면, Next.js는 개별 파일을 변환할 때 자동으로 Babel을 사용하도록 폴백한다. 이는 커스텀 Babel 플러그인을 사용하는 기존 애플리케이션과의 하위 호환성을 보장하기 위해서다.

커스텀 Babel 설정을 사용하고 있다면 [설정을 공유해 달라](https://github.com/vercel/next.js/discussions/30174). Next.js 팀은 가능한 한 많은 일반적인 Babel 변환을 이식하고, 향후 플러그인 지원도 추가하기 위해 작업하고 있다.

### 버전 히스토리(Version History)

| 버전 | 변경 사항 |
| --- | --- |
| v13.1.0 | Module Transpilation과 Modularize Imports가 안정화되었다. |
| v13.0.0 | SWC Minifier가 기본으로 활성화되었다. |
| v12.3.0 | SWC Minifier가 안정화되었다. |
| v12.2.0 | SWC Plugins 실험적 지원이 추가되었다. |
| v12.1.0 | Styled Components, Jest, Relay, Remove React Properties, Legacy Decorators, Remove Console, jsxImportSource 지원이 추가되었다. |
| v12.0.0 | Next.js Compiler가 도입되었다. |

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서는 `next.config.js`의 `compiler.removeConsole`, `compiler.reactRemoveProperties` 옵션을 켠 프로덕션 빌드와 끈 빌드의 산출물(번들에 남은 `console.*` 호출 여부, `data-test` 속성 제거 여부)을 비교하는 데모를 설계한다.
- `styledComponents`/`emotion` 옵션을 켰을 때와 껐을 때 브라우저에 렌더링되는 클래스명·`displayName`이 어떻게 달라지는지 비교하는 데모도 포함한다.
- `.babelrc` 파일을 추가했을 때 빌드 로그에서 Next.js Compiler 대신 Babel로 폴백되는 것을 확인하는 데모를 설계한다.

## 연습 문제

1. Next.js Compiler에 대한 설명 중 옳은 것은?
   - A. Babel을 대체하지만 Terser는 그대로 사용한다.
   - B. Rust로 작성되어 SWC를 사용하며, Babel(개별 파일 변환)과 Terser(번들 압축)를 모두 대체한다.
   - C. Next.js 13부터 기본으로 활성화되었다.

<details><summary>정답 보기</summary>

정답: B. Next.js Compiler는 SWC 기반 Rust 컴파일러로, 개별 파일 변환을 담당하던 Babel과 번들 압축을 담당하던 Terser를 모두 대체하며 v12부터 기본 활성화되어 있다.
</details>

2. 애플리케이션이 Next.js Compiler 대신 Babel로 자동 폴백되는 경우는?
   - A. `next.config.js`에 `compiler` 옵션을 하나도 설정하지 않았을 때
   - B. `.babelrc` 파일이 있거나 지원되지 않는 기능을 사용할 때
   - C. `transpilePackages`로 외부 패키지를 지정했을 때

<details><summary>정답 보기</summary>

정답: B. 기존 Babel 설정(`.babelrc`)이 있거나 Next.js Compiler가 지원하지 않는 기능을 사용하면 애플리케이션은 Next.js Compiler를 사용하지 않고 Babel을 계속 사용한다.
</details>

3. 다음 중 Next.js 15 이후에도 여전히 유효한 설명은? (복수 선택)
   - A. `compiler.removeConsole`로 프로덕션 코드의 `console.*` 호출을 제거할 수 있다.
   - B. `next.config.js`의 `swcMinify` 플래그로 압축 방식을 커스터마이즈할 수 있다.
   - C. `compiler.define`으로 빌드 타임에 변수를 정적으로 치환할 수 있다.

<details><summary>정답 보기</summary>

정답: A, C. `swcMinify` 플래그는 v15부터 지원이 제거되어 더 이상 압축 방식을 커스터마이즈할 수 없다. `removeConsole`과 `define`은 v15 이후에도 그대로 사용할 수 있는 `compiler` 옵션이다.
</details>

## 챕터 요약

- Next.js Compiler는 Rust와 SWC를 기반으로 하며, 개별 파일을 변환하던 Babel과 번들을 압축하던 Terser를 모두 대체한다. Next.js 12부터 기본 활성화되어 있고 Babel보다 17배 빠르다.
- SWC를 선택한 이유는 확장성, 성능(Fast Refresh 약 3배·빌드 약 5배 향상), WebAssembly 지원, 커뮤니티다.
- `next.config.js`의 `compiler` 옵션으로 Styled Components, Emotion, Relay, Jest, Remove Console/React Properties, Legacy Decorators, Define, Build Lifecycle Hooks 등을 설정할 수 있다.
- `.babelrc`가 있거나 지원되지 않는 기능을 사용하면 애플리케이션은 Next.js Compiler 대신 Babel로 자동 폴백된다.
- SWC Trace profiling과 SWC Plugins는 실험적 기능으로, 각각 트레이스 분석과 wasm 기반 커스텀 변환을 지원한다.
