# turbopack

- 공식 문서: [turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `turbopack` 설정 옵션의 구조와 Rust 기반 차세대 번들러의 동작 제어 방식을 이해한다.
- Webpack 로더 매핑(`rules`), 모듈 별칭(`resolveAlias`), 커스텀 확장자(`resolveExtensions`), 루트 디렉토리(`root`) 설정을 파악한다.
- 로더가 지원하는 기능과 제한 사항(JavaScript 반환 필수, 미지원 Webpack API), import attributes를 활용한 인라인 로더 문법을 설명할 수 있다.

## 핵심 개념 및 설명

Turbopack은 Next.js를 위해 Rust 언어로 개발한 초고속 차세대 증분(incremental) 번들러다. `next.config.js`, `next.config.mjs`, 또는 `next.config.ts` 파일의 `turbopack` 설정 옵션에서 로더 규칙, 모듈 별칭(alias), 커스텀 파일 확장자, 프로덕션 소스맵 디버그 ID를 구성할 수 있다.

과거 실험 단계에서 제공하던 `experimental.turbo` 설정은 Next.js 15부터 최상위 `turbopack` 키로 공식 승격됐다.

### 기본 설정 구조

```ts filename="next.config.ts"
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      underscore: 'lodash',
    },
  },
}

export default nextConfig
```

### Reference (레퍼런스)

#### Options (옵션 목록)

`turbopack` 객체 아래에서 설정할 수 있는 옵션은 전부 아래와 같다:

| 옵션명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `root` | `string` | 자동 감지 (락파일 위치) | 애플리케이션 루트 디렉토리 (절대 경로). 모노레포 환경에서 워크스페이스 상위 루트를 명시할 때 사용한다. |
| `rules` | `Record<string, Rule \| Rule[]>` | `{}` | 파일 글로브 패턴(예: `'*.svg'`)에 매핑되는 모듈 로더 규칙 목록. |
| `resolveAlias` | `Record<string, string \| { browser: string }>` | `{}` | 모듈 import 경로 별칭 매핑. 브라우저 전용 대체 경로 객체도 지원한다. |
| `resolveExtensions` | `string[]` | 기본 확장자 목록 | 모듈 해석(resolve) 시 순차 탐색할 커스텀 파일 확장자 목록. |
| `debugIds` | `boolean` | `false` | JS 번들과 소스맵에 TC39 Debug ID를 생성하여 Sentry, Datadog 등 모니터링 도구의 스택 추적 연동을 지원한다. |

#### Supported loaders (지원되는 로더)

Webpack 생태계의 기존 로더를 Turbopack에서도 재활용할 수 있다. `rules` 객체의 값으로 지정하는 규칙 속성은 아래와 같다:

| 속성명 | 타입 | 설명 |
|---|---|---|
| `loaders` | `Array<string \| { loader: string, options: object }>` | 실행할 Webpack 호환 로더 이름 또는 설정 객체 목록. |
| `as` | `string` | 산출물 모듈 확장자 패턴 (예: `'*.js'`). 로더 변환 결과물 포맷을 지정한다. |
| `type` | `'asset' \| 'ecmascript' \| 'typescript' \| 'css' \| 'css-module' \| 'wasm' \| 'raw' \| 'bytes'` | Turbopack이 모듈을 처리할 기본 타입을 직접 지정한다. |
| `condition` | 객체 / 빌트인 조건 | 로더를 적용할 조건을 세부 필터링하는 조건자 (`all`, `any`, `not`, `path`, `query`, `content`, `contentType`). |

`condition` 속성에는 아래 빌트인 조건 키워드를 조합해 적용할 수 있다:
- `'browser'`: 브라우저 클라이언트 번들에만 적용된다.
- `'foreign'`: `node_modules` 외부 의존성 패키지에만 적용된다.
- `'development'`: 개발 모드(`next dev`) 실행 중에만 적용된다.
- `'production'`: 프로덕션 빌드(`next build`) 시에만 적용된다.
- `'node'`: Node.js 런타임 환경 번들에만 적용된다.
- `'edge-light'`: Edge 런타임 번들에 적용된다 (권장하지 않음).

##### Missing Webpack loader features (지원되지 않는 Webpack 로더 기능)

Turbopack의 로더 실행기(loader-runner)는 Webpack과 다른 아키텍처로 동작하므로 다음 제약이 있다:

- **JavaScript 반환 필수**: 로더의 최종 출력값은 반드시 실행 가능한 JavaScript 코드여야 한다. 스타일시트나 원시 이미지 바이트를 직접 방출하는 로더는 Turbopack이 지원하지 않는다.
- **미지원 Webpack 로더 API**: `this.importModule`, `this.loadModule`, `this.emitFile`, `this.utils`, `this.resolve` API는 지원하지 않는다.
- **제한된 파일 시스템 접근**: `this.fs` 객체는 `readFile` 메서드만 제공하며 전체 Node.js fs 인터페이스는 제공하지 않는다.

### Examples (예제)

#### Root directory (루트 디렉토리 설정)

모노레포 환경에서 애플리케이션 루트 외부에 있는 패키지나 설정 파일에 안전하게 접근할 수 있도록 루트 경로를 지정할 수 있다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
}

export default nextConfig
```

#### Configuring webpack loaders (Webpack 로더 설정)

SVG 파일을 React 컴포넌트로 변환하는 `@svgr/webpack` 로더를 설정하는 전형적인 예제다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `rules` 객체에서 사용하는 glob 패턴은 슬래시(`/`) 문자가 없으면 파일 이름을 기준으로 매칭한다. 반면 슬래시가 있으면 프로젝트 루트 기준 전체 상대 파일 경로를 기준으로 매칭한다. 윈도우 파일 경로는 Unix 스타일인 `/` 구분자로 정규화해 처리한다.
> - Turbopack은 [Rust `globset` 라이브러리](https://docs.rs/globset/latest/globset/)의 수정 버전을 사용한다.
> - Next.js 13.4.4 이전 버전에서는 `turbopack.rules` 대신 `turbo.loaders`라는 이름을 사용했으며 `*.mdx` 대신 `.mdx`처럼 파일 확장자만 허용했다.
> - 일치하는 모든 규칙은 정의된 순서대로 실행된다.

#### Advanced webpack loader conditions (고급 Webpack 로더 조건)

조건부 로더로 특정 환경(예: 개발 모드, 특정 경로)에서만 로더가 실행되도록 제어할 수 있다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.custom.js': {
        loaders: ['custom-loader'],
        as: '*.js',
        condition: {
          all: ['development', { not: 'foreign' }],
        },
      },
    },
  },
}

export default nextConfig
```

규칙(Rules)은 단일 객체이거나 객체의 배열일 수 있다. 상호 배타적인 조건을 모델링할 때 배열 형태가 유용하다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: 'browser',
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
        {
          condition: { not: 'browser' },
          loaders: ['./custom-svg-loader.js'],
          as: '*.js',
        },
      ],
    },
  },
}

export default nextConfig
```

#### Module types (모듈 타입 지정)

Webpack의 [`type`](https://webpack.js.org/configuration/module/#ruletype) 옵션처럼 별도 로더 없이도 파일 처리 방식을 바꿀 수 있도록 내장 모듈 타입을 직접 지정할 수 있다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        type: 'asset',
      },
    },
  },
}

export default nextConfig
```

`type: 'asset'`을 사용하면 해당 파일을 import할 때 생성된 파일의 URL을 반환한다:

```tsx filename="app/page.tsx"
import svgUrl from './icon.svg'

export default function Page() {
  return <img src={svgUrl} alt="Icon" />
}
```

`type` 옵션은 `loaders`와 함께 결합할 수도 있다. 이때 로더가 먼저 실행되고 그 결과물이 지정한 모듈 타입에 맞춰 처리된다.

모듈 타입으로는 아래를 쓸 수 있다:

| 타입 | 설명 |
| --- | --- |
| `asset` | 파일을 내보내고 URL을 반환한다 (Webpack의 `asset/resource`와 유사). |
| `ecmascript` | JavaScript 모듈로 처리한다. |
| `typescript` | TypeScript 모듈로 처리한다. |
| `css` | CSS 스타일시트로 처리한다. |
| `css-module` | CSS Module로 처리한다. |
| `wasm` | WebAssembly 모듈로 처리한다. |
| `raw` | 파일 원시 내용을 문자열로 반환한다. |
| `bytes` | 파일 내용을 바이트 단위로 인라인 처리한다. |

#### Inline loader configuration with import attributes (import attributes를 활용한 인라인 로더 설정)

`turbopack.rules`에 전역 설정을 추가하지 않고도, 개별 파일을 import하는 시점에 ECMAScript 표준 import attributes(`with` 구문)로 인라인 Turbopack 로더를 지정할 수 있다. 특정 타입의 파일 전체에 영향을 주지 않고 특정 import에만 로더를 적용할 때 유용하다:

```tsx filename="app/page.tsx"
// .txt 파일을 JavaScript 모듈로 가져오기 위해 raw-loader 적용
import rawText from '../data.txt' with { turbopackLoader: 'raw-loader', turbopackAs: '*.js' }

export default function Page() {
  return <p>{rawText}</p>
}
```

Turbopack이 지원하는 import attribute는 아래와 같다:

| 속성명 | 설명 |
| --- | --- |
| `turbopackLoader` | 적용할 로더 이름 (예: `'raw-loader'`). |
| `turbopackLoaderOptions` | 로더에 전달할 옵션의 JSON 문자열 (예: `'{"search":"X","replace":"Y"}'`). |
| `turbopackAs` | 출력 결과물의 리네임 패턴 (`turbopack.rules[].as`와 동일). 예: `'*.js'`는 로더 출력을 JavaScript로 취급. |
| `turbopackModuleType` | 출력 결과물의 모듈 타입 지정 (`turbopack.rules[].type`과 동일). |

옵션이 필요한 로더라면 `turbopackLoaderOptions`에 JSON 인코딩 문자열을 전달한다:

```tsx filename="app/page.tsx"
import value from '../data.js' with {
  turbopackLoader: 'string-replace-loader',
  turbopackLoaderOptions: '{"search":"PLACEHOLDER","replace":"replaced value"}',
}
```

> **알아두면 좋은 점**:
>
> - `turbopackLoader`가 포함된 import attribute는 Turbopack 전용 기능이며 Webpack은 지원하지 않는다.
> - 구식 `assert` 키워드가 아닌 ECMAScript 표준인 `with` 키워드를 반드시 사용해야 한다.

#### Resolving aliases (별칭 해석)

특정 모듈 경로를 다른 라이브러리나 파일로 리다이렉트할 수 있다. 브라우저 전용 대체 경로도 지원한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      mocha: {
        browser: 'mocha/browser-entry.js',
      },
    },
  },
}

export default nextConfig
```

#### Resolving custom extensions (커스텀 확장자 해석)

모듈 import 시 확장자를 생략했을 때 탐색할 커스텀 확장자 목록을 지정한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },
}

export default nextConfig
```

#### Debug IDs (디버그 ID)

프로덕션 번들에 고유한 디버그 식별자(Debug ID)를 주입해, Sentry, Datadog 같은 서드파티 에러 모니터링 도구에서 소스맵을 정확하게 매핑할 수 있도록 지원한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    debugIds: true,
  },
}

export default nextConfig
```

### Codemod 마이그레이션

Next.js 14 이하 버전에서 사용하던 `experimental.turbo` 설정을 새로운 `turbopack` 설정 구조로 자동 변환하려면 공식 codemod를 실행한다:

```bash filename="Terminal"
npx @next/codemod@latest next-experimental-turbo-to-turbopack .
```

> **알아두면 좋은 점**:
>
> - **내장 기능에 별도 로더 불필요**: CSS, PostCSS, Sass, CSS Modules, TypeScript, 최신 ECMAScript 트랜스파일은 로더 설정 없이 Turbopack에 기본 내장되어 동작한다.
> - **Webpack 플러그인 미지원**: Webpack 로더는 지원하지만 Webpack 전용 플러그인(Plugins) 아키텍처는 Turbopack과 근본적으로 달라 지원하지 않는다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `turbopack` 최상위 설정 옵션 안정화 (`experimental.turbo` 대체). `root` 옵션 도입. |
| `v13.0.0` | `experimental.turbo` 실험적 설정 옵션 도입 |

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (배포된 페이지에서는 소스 편집과 개발 서버 재빌드를 실행할 수 없음)
- Turbopack은 Next.js 개발 서버(`next dev --turbopack`) 및 빌드 파이프라인의 핵심 컴파일러/번들러 엔진으로 브라우저 런타임 인터랙션 데모 대상이 아니다.
- 로컬 개발 환경에서 터미널 빌드 시간, Fast Refresh 응답 속도, 번들 생성 파일 크기 차이를 관찰할 수 있다.

## 연습 문제

1. Turbopack에서 Webpack 호환 로더(`loaders`)를 구성할 때 충족해야 하는 필수 요건은?
   - A. 로더의 최종 출력값은 반드시 실행 가능한 JavaScript 코드여야 한다.
   - B. 로더는 반드시 TypeScript AST 파서를 직접 호출해야 한다.
   - C. 로더는 오직 동기(synchronous) 함수 형태로만 작성되어야 한다.
   - D. Webpack 플러그인을 반드시 함께 등록해야 로더가 실행된다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: Turbopack의 loader-runner는 변환 결과물이 JavaScript 코드인 로더만 지원한다. 원시 스타일시트나 이미지를 직접 방출하는 로더는 지원되지 않는다.
</details>

2. 코드 파일 내에서 ECMAScript 표준 import attributes를 사용하여 인라인으로 Turbopack 로더를 지정하는 올바른 문법은?
   - A. `import raw from './data.txt' assert { loader: 'raw-loader' }`
   - B. `import raw from './data.txt' with { turbopackLoader: 'raw-loader', turbopackAs: '*.js' }`
   - C. `import raw from 'raw-loader!./data.txt'`
   - D. `import raw from './data.txt' query { use: 'raw-loader' }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Turbopack은 구식 Webpack 인라인 문법(`raw-loader!`)이나 폐기된 `assert` 대신 ECMAScript 표준인 `with` 구문과 `turbopackLoader`, `turbopackAs` 속성을 지원한다.
</details>

## 챕터 요약

- `turbopack` 옵션은 Next.js의 Rust 기반 증분 번들러 동작을 제어하며 Next.js 15에서 정식 안정화되었다.
- `rules`를 통해 Webpack 호환 로더를 연결할 수 있으며 변환 결과물은 반드시 JavaScript 형태여야 한다.
- `root`, `resolveAlias`, `resolveExtensions`로 모노레포 루트 경로와 모듈 해석 방식을 유연하게 설정할 수 있다.
- 코드 파일 내부에서 ECMAScript 표준 `with` import attributes를 사용해 인라인 로더를 지정할 수 있다.
- `debugIds: true`를 설정하면 모니터링 도구와 연동할 수 있는 고유한 번들 디버그 식별자를 생성한다.
