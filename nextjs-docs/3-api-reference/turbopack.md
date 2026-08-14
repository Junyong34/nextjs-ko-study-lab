# Turbopack

- 공식 문서: [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
- 상위 메뉴: [API Reference](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Turbopack이 어떤 문제를 해결하기 위해 설계됐는지 이해한다.
- Turbopack이 지원하는 언어·프레임워크·CSS·에셋·모듈 해석 기능의 범위를 파악한다.
- `import.meta.env`와 `import.meta.glob` 같은 Turbopack 전용 API 사용법을 익힌다.
- webpack과의 알려진 차이점과 아직 지원하지 않는 기능을 확인한다.
- `next.config.js`의 `turbopack` 키로 설정을 커스터마이즈하는 방법을 이해한다.

## 핵심 개념 및 설명

Turbopack은 JavaScript와 TypeScript에 최적화된 **증분 번들러(incremental bundler)**로, Rust로 작성되었고 Next.js에 내장되어 있다. Pages Router와 App Router 양쪽 모두에서 Turbopack을 사용해 훨씬 빠른 로컬 개발 경험을 얻을 수 있다.

### 왜 Turbopack인가

Next.js 팀은 다음과 같은 목표로 Turbopack의 성능을 끌어올렸다.

- **통합 그래프(Unified Graph)**: Next.js는 클라이언트·서버 같은 여러 출력 환경을 지원한다. 여러 컴파일러를 관리하고 번들을 이어 붙이는 작업은 번거로울 수 있다. Turbopack은 모든 환경에 대해 **하나의 통합된 그래프**를 사용한다.
- **번들링 vs 네이티브 ESM**: 일부 도구는 개발 단계에서 번들링을 건너뛰고 브라우저의 네이티브 ESM에 의존한다. 이는 작은 앱에는 잘 맞지만, 큰 앱에서는 과도한 네트워크 요청 때문에 느려질 수 있다. Turbopack은 개발 단계에서도 **번들링**을 하되, 큰 앱도 빠르게 유지되도록 최적화된 방식을 쓴다.
- **증분 계산(Incremental Computation)**: Turbopack은 여러 코어에 걸쳐 작업을 병렬화하고, 함수 단위까지 결과를 **캐시**한다. 한 번 끝난 작업은 반복하지 않는다. 결과는 실행 사이에 디스크에 유지된다.
- **지연 번들링(Lazy Bundling)**: Turbopack은 dev 서버가 실제로 요청한 것만 번들링한다. 이 지연(lazy) 방식은 초기 컴파일 시간과 메모리 사용량을 줄일 수 있다.

### 지원 플랫폼

Turbopack은 플랫폼별 네이티브 바인딩이 필요하다. 다음 플랫폼을 현재 지원한다.

| 플랫폼 | 아키텍처 |
| --- | --- |
| macOS (Darwin) | x64, ARM64 |
| Windows | x64, ARM64 |
| Linux (glibc) | x64, ARM64 |
| Linux (musl) | x64, ARM64 |

네이티브 바인딩이 없는 플랫폼(예: FreeBSD, OpenBSD)에서는 Next.js가 WebAssembly(WASM) 바인딩으로 대체(fallback)한다. WASM 바인딩은 컴파일·최소화(minification) 같은 핵심 SWC 기능은 지원하지만 **Turbopack은 지원하지 않는다**. 이런 플랫폼에서는 `--webpack` 플래그를 사용한다.

```bash
next dev --webpack
next build --webpack
```

### 시작하기

Turbopack은 이제 Next.js의 **기본 번들러**다. Turbopack을 사용하는 데 별도의 설정이 필요하지 않다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

#### 대신 Webpack 사용하기

Turbopack 대신 webpack이 필요하다면 `--webpack` 플래그로 선택할 수 있다.

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

### 지원 기능

Next.js의 Turbopack은 일반적인 사용 사례에 대해 **별도 설정 없이(zero-configuration)** 동작한다. 아래는 기본으로 지원하는 기능 요약과, 필요할 때 Turbopack을 더 세부적으로 설정하는 방법에 대한 참고 링크다.

#### 언어 기능

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| JavaScript & TypeScript | 지원됨 | 내부적으로 SWC를 사용한다. 타입 체크는 Turbopack이 하지 않는다(`tsc --watch`를 실행하거나 IDE의 타입 체크에 의존한다). |
| ECMAScript (ESNext) | 지원됨 | Turbopack은 SWC의 커버리지에 맞춰 최신 ECMAScript 기능을 지원한다. |
| CommonJS | 지원됨 | `require()` 구문을 별도 설정 없이 처리한다. |
| ESM | 지원됨 | 정적(static)·동적(dynamic) import를 모두 완전히 지원한다. |
| Babel | 지원됨 | Next.js 16부터 Turbopack은 설정 파일을 감지하면 자동으로 Babel을 사용한다. webpack과 달리, Next.js 내부 변환과 이전 ECMAScript 버전으로의 다운레벨링에는 항상 SWC가 쓰인다. webpack을 사용하는 Next.js는 Babel 설정 파일이 있으면 SWC를 비활성화한다. `node_modules` 안의 파일은 제외되며, `babel-loader`를 직접 설정하지 않는 한 적용되지 않는다. |

#### 프레임워크와 React 기능

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| JSX / TSX | 지원됨 | SWC가 JSX/TSX 컴파일을 처리한다. |
| Fast Refresh | 지원됨 | 별도 설정이 필요 없다. |
| React Server Components (RSC) | 지원됨 | Next.js App Router 대상이다. Turbopack이 서버·클라이언트 번들링을 올바르게 처리한다. |
| Root layout creation | 지원 안 됨 | App Router의 root layout 자동 생성은 지원하지 않는다. Turbopack은 직접 만들라고 안내한다. |

#### CSS와 스타일링

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| Global CSS | 지원됨 | `.css` 파일을 애플리케이션에 직접 import할 수 있다. |
| CSS Modules | 지원됨 | `.module.css` 파일이 네이티브로 동작한다(Lightning CSS). |
| CSS Nesting | 지원됨 | Lightning CSS가 최신 CSS 중첩 문법을 지원한다. |
| @import 구문 | 지원됨 | 여러 CSS 파일을 결합한다. |
| PostCSS | 지원됨 | PostCSS 설정 파일(`postcss.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`)을 Node.js 워커 풀에서 자동으로 처리한다. Tailwind, Autoprefixer 등에 유용하다. |
| Sass / SCSS | 지원됨(Next.js) | Next.js에서는 Sass를 별도 설정 없이 지원한다. 커스텀 Sass 함수(`sassOptions.functions`)는 지원하지 않는다. Turbopack의 Rust 기반 아키텍처는 webpack과 달리 JavaScript 함수를 직접 실행할 수 없기 때문이다. 이 기능이 필요하면 webpack을 사용한다. 앞으로 Turbopack 단독 사용 시에는 로더 설정이 필요해질 가능성이 높다. |
| Less | 플러그인을 통해 계획됨 | 아직 기본으로 지원하지 않는다. 커스텀 로더 설정이 안정화되면 그 형태로 필요할 가능성이 높다. |
| Lightning CSS | 사용 중 | CSS 변환을 처리한다. `:local`/`:global`을 독립 pseudo-class로 쓰는 등 사용 빈도가 낮은 일부 CSS Modules 기능은 아직 지원하지 않는다. 자세한 내용은 아래를 참고한다. |

#### 에셋

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| Static Assets (이미지, 폰트) | 지원됨 | `import img from './img.png'`가 별도 설정 없이 동작한다. Next.js에서는 `<Image />` 컴포넌트용 객체를 반환한다. |
| JSON Imports | 지원됨 | `.json`에서 named import와 default import를 모두 지원한다. |

#### 모듈 해석

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| Path Aliases | 지원됨 | `tsconfig.json`의 `paths`와 `baseUrl`을 읽어 Next.js 동작과 일치시킨다. |
| Manual Aliases | 지원됨 | `next.config.js`에서 `resolveAlias`를 설정한다(webpack의 `webpack.resolve.alias`와 유사). |
| Custom Extensions | 지원됨 | `next.config.js`에서 `resolveExtensions`를 설정한다. |
| AMD | 부분 지원 | 기본적인 변환은 동작하지만, 고급 AMD 사용법은 제한적이다. |

#### 성능과 Fast Refresh

| 기능 | 상태 | 비고 |
| --- | --- | --- |
| Fast Refresh | 지원됨 | 전체 새로고침 없이 JavaScript, TypeScript, CSS를 업데이트한다. |
| Incremental Bundling | 지원됨 | Turbopack은 dev 서버가 요청한 것만 지연 빌드해 큰 앱의 속도를 높인다. |
| FileSystem Cache | 지원됨 | 컴파일러 결과물을 실행 사이에 디스크에 유지한다. `turbopackFileSystemCache`를 참고한다. |

#### Magic Comments

Turbopack은 import 동작을 제어하는 webpack 호환 magic comment를 지원한다. 이 주석은 동적 `import()`, `require()`, `require.resolve()`, `new Worker()` 표현식에서 동작한다(정적 `import` 문에는 적용되지 않는다).

| 주석 | Webpack | Turbopack | 설명 |
| --- | --- | --- | --- |
| `webpackIgnore: true` | 지원 | 지원 | 번들링을 건너뛰고 import를 그대로 유지한다 |
| `turbopackIgnore: true` | 미지원 | 지원 | 번들링을 건너뛴다(Turbopack 전용) |
| `turbopackOptional: true` | 미지원 | 지원 | resolve 에러를 억제한다 |
| `webpackOptional: true` | 미지원 | 미지원 | 지원하지 않는다 |

사용 예시는 [Lazy Loading](../2-guides/lazy-loading.md#magic-comments)을 참고한다.

### import.meta.env

Turbopack은 `import.meta.env`를 통해 내장 환경 메타데이터를 지원한다.

| 속성 | 타입 | 값 |
| --- | --- | --- |
| `DEV` | boolean | `MODE`가 `"production"`이 아닌지 여부 |
| `PROD` | boolean | `MODE`가 `"production"`인지 여부 |
| `MODE` | string | 컴파일 시점의 `NODE_ENV`. 기본값은 `"development"` |
| `BASE_URL` | string | 끝에 슬래시가 붙은 Next.js `basePath`(기본값 `"/"`) |
| `SSR` | boolean | 서버 번들에서는 `true`, 브라우저·클라이언트 번들에서는 `false` |

이 값들은 정적으로 분석되므로, Turbopack이 도달 불가능한 분기를 제거할 수 있다.

```ts
if (import.meta.env.DEV) {
  console.log('development mode')
}
```

전체 객체를 읽거나, 구조 분해하거나, 정적 대괄호 접근으로 사용할 수도 있다.

```ts
const { MODE, SSR } = import.meta.env
const baseUrl = import.meta.env['BASE_URL']
```

> **알아두면 좋은 점**: `import.meta.env`는 Turbopack이 필요하다. 커스텀 `VITE_*` 변수, Vite의 custom mode, `envPrefix`, `envDir`은 지원하지 않는다. `BASE_URL`은 Next.js의 [`basePath`](./3.5-config/3.5.1-next-config-js/basePath.md) 설정을 반영하며, Vite 형식과 맞추기 위해 끝에 슬래시가 붙는다.

### import.meta.glob

Turbopack은 glob 패턴으로 여러 모듈을 한 번에 import하는, Vite와 호환되는 API인 `import.meta.glob()`을 지원한다. 결과는 호출 파일 기준 상대 경로를 키로 하는 객체다.

```ts
const modules = import.meta.glob('./dir/*.js')
// {
//   './dir/foo.js': () => import('./dir/foo.js'),
//   './dir/bar.js': () => import('./dir/bar.js'),
// }
```

> **알아두면 좋은 점**: `import.meta.glob`은 Turbopack이 필요하다. webpack을 사용할 때는 사용할 수 없다.

#### 지연 로딩(기본값)

기본적으로 결과 객체의 각 값은 모듈에 대한 `Promise`를 반환하는 함수, 즉 thunk다. 이를 통해 지연 로딩(lazy loading)이 가능하다.

```ts
const modules = import.meta.glob('./dir/*.js')

for (const path in modules) {
  const module = await modules[path]()
  console.log(path, module)
}
```

#### 즉시 로딩

`{ eager: true }`를 전달하면 일치하는 모든 모듈을 미리 import한다. 이때 각 값은 thunk가 아니라 모듈 객체 자체다.

```ts
const modules = import.meta.glob('./dir/*.js', { eager: true })

for (const path in modules) {
  console.log(path, modules[path].default)
}
```

#### Named import

`import` 옵션으로 일치한 각 모듈에서 특정 named export만 선택할 수 있다. 이 옵션은 lazy·eager 모드 모두에서 동작한다.

```ts
// Lazy: 각 값은 () => Promise<exportValue>
const defaults = import.meta.glob('./dir/*.js', { import: 'default' })

// Eager: 각 값은 export 값 자체
const setups = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })
```

#### 쿼리 문자열

`query` 옵션으로 모든 import 요청에 쿼리 문자열을 덧붙일 수 있다.

```ts
const rawFiles = import.meta.glob('./dir/*.txt', { query: '?raw' })
```

`query` 옵션은 객체도 받을 수 있다. 키와 값은 URL 인코딩되어 쿼리 문자열로 합쳐진다.

```ts
const modules = import.meta.glob('./*.ts', {
  query: { bar: 'foo', raw: true },
})
// { query: '?bar=foo&raw=true' }와 동일하다
```

이 쿼리는 module rule로 그대로 전달될 뿐 그 자체로는 의미가 없다. Vite와 달리 Turbopack에는 내장된 `?raw`나 `?url` 처리가 없으므로, 해당 파일을 어떻게 로드할지 [rule](./3.5-config/3.5.1-next-config-js/turbopack.md#module-types)로 직접 매칭해야 한다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // import.meta.glob('./dir/*.txt', { query: '?raw' })는 파일 내용을 문자열로 반환한다
      '*.txt': { condition: { query: '?raw' }, type: 'text' },
    },
  },
}

export default nextConfig
```

#### 다중 패턴과 제외

첫 번째 인자로 glob 패턴 배열을 전달할 수 있다. 패턴 앞에 `!`를 붙이면 일치하는 파일을 제외한다.

```ts
// 여러 디렉토리를 결합한다
const modules = import.meta.glob(['./dir/*.js', './other/*.js'])

// 특정 파일을 제외한다
const withoutTests = import.meta.glob(['./src/**/*.js', '!**/*.test.js'])
```

#### TypeScript

`import.meta.glob`의 TypeScript 타입은 Next.js에 포함되어 있다. `tsconfig.json`에서 `"moduleResolution": "bundler"`(또는 `"node16"` / `"nodenext"`)로 설정되어 있으면 자동으로 사용할 수 있으며, 이는 새 Next.js 프로젝트의 기본값이다.

반환 타입은 `eager` 옵션에 따라 달라진다.

```ts
// Lazy(기본값) — Record<string, () => Promise<unknown>>
const lazy = import.meta.glob('./dir/*.ts')

// Eager — Record<string, unknown>
const eager = import.meta.glob('./dir/*.ts', { eager: true })
```

모듈 타입을 전달해 일치한 파일이 무엇을 export하는지 명시할 수 있다.

```ts
interface Mod {
  name: string
  default: () => string
}

// Record<string, () => Promise<Mod>>
const lazy = import.meta.glob<Mod>('./dir/*.ts')

// Record<string, Mod>
const eager = import.meta.glob<Mod>('./dir/*.ts', { eager: true })
```

#### 옵션 참조

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `eager` | boolean | `false` | thunk 대신 모듈을 동기적으로 import한다. |
| `import` | string | `undefined` | 각 일치 모듈에서 선택할 named export(예: `'default'`). |
| `query` | string \| Record<string, string \| boolean> | `undefined` | 각 import에 덧붙일 쿼리 문자열(또는 객체). |
| `base` | string | `undefined` | 패턴 해석과 결과 키에 사용할 base 경로를 재정의한다. |
| `caseSensitive` | boolean | `true` | glob 패턴을 대소문자 구분해 매칭한다. `false`로 설정하면 ASCII 대소문자를 무시한다. |

> **참고**: `as` 옵션(Vite 5에서 지원 중단됨)은 지원하지 않는다. [쿼리 문자열](#쿼리-문자열)에서 설명한 것처럼 `query`와 매칭 rule을 함께 사용한다. 지원 중단된 `import.meta.globEager()` API도 지원하지 않는다 — 대신 `import.meta.glob('...', { eager: true })`를 사용한다.

### webpack과의 알려진 차이

애플리케이션을 마이그레이션할 때 알아둬야 할, webpack과 Turbopack 사이의 사소하지 않은(non-trivial) 동작 차이가 여러 개 있다. 일반적으로 신규 애플리케이션에서는 크게 신경 쓰지 않아도 된다.

#### 파일 시스템 루트

Turbopack은 모듈을 해석할 때 루트 디렉토리를 기준으로 삼는다. 프로젝트 루트 바깥의 파일은 해석되지 않는다.

예를 들어 `npm link`, `yarn link`, `pnpm link` 등으로 프로젝트 루트 바깥의 의존성을 연결하면, 그 연결된 파일은 기본적으로 해석되지 않는다. 이 파일을 해석하려면 `root` 옵션을 프로젝트와 연결된 의존성을 모두 포함하는 상위 디렉토리로 설정해야 한다.

`next.config.js`의 [`turbopack.root`](./3.5-config/3.5.1-next-config-js/turbopack.md#root-directory) 옵션으로 파일 시스템 루트를 설정할 수 있다.

#### CSS Module 순서

Turbopack은 별도로 순서가 정해지지 않은 [CSS 모듈](../1-getting-started/css.md#css-modules)의 순서를 JS import 순서에 따라 정한다. 예를 들어 다음 코드에서

```tsx
import utilStyles from './utils.module.css'
import buttonStyles from './button.module.css'
export default function BlogPost() {
  return (
    <div className={utilStyles.container}>
      <button className={buttonStyles.primary}>Click me</button>
    </div>
  )
}
```

Turbopack은 import 순서를 따라 생성된 CSS 청크에서 `utils.module.css`가 `button.module.css`보다 먼저 나오도록 보장한다.

webpack도 일반적으로 이렇게 동작하지만, 예를 들어 JS 파일이 부수 효과(side-effect)가 없다고 추론될 경우처럼 JS로 추론된 순서를 무시하는 경우가 있다.

애플리케이션이 임의의 순서에 의존해왔다면, Turbopack을 도입할 때 이 때문에 미묘한 렌더링 변화가 생길 수 있다. 일반적으로 해결 방법은 간단하다. 예를 들어 `button.module.css`가 `utils.module.css`를 `@import`해서 순서를 강제하거나, 충돌하는 규칙을 찾아 같은 속성을 대상으로 하지 않도록 바꾸면 된다.

#### Sass의 node_modules import

Turbopack은 `node_modules` 안의 Sass 파일을 import하는 것을 별도 설정 없이 지원한다. webpack은 이를 위한 레거시 tilde(`~`) 문법을 지원하지만, Turbopack은 지원하지 않는다.

변경 전:

```scss
@import '~bootstrap/dist/css/bootstrap.min.css';
```

변경 후:

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

import 구문을 직접 수정할 수 없다면, `turbopack.resolveAlias` 설정을 추가해 `~` 문법을 실제 경로로 매핑할 수 있다.

```js
module.exports = {
  turbopack: {
    resolveAlias: {
      '~*': '*',
    },
  },
}
```

#### CSS / Sass / SCSS 소수점 정밀도

Turbopack은 CSS를 컴파일할 때 [Lightning CSS](https://lightningcss.dev/)를 사용한다. Lightning CSS는 숫자 CSS 값에 5자리 소수점 정밀도를 사용하는 반면, webpack은 10자리를 사용한다. 이는 순수 CSS와 Sass/SCSS 출력 모두에 적용된다. 예를 들어 `25/17`로 계산되는 값은 다음과 같이 출력된다.

- **Webpack:** `line-height: 1.4705882353`(10자리)
- **Turbopack:** `line-height: 1.47059`(5자리)

`line-height`, `letter-spacing`처럼 높은 정밀도가 중요한 계산 값에서는 webpack에서 Turbopack으로 마이그레이션할 때 미묘한 렌더링 차이가 생길 수 있다.

#### Webpack 플러그인

Turbopack은 webpack 플러그인을 지원하지 않는다. 이는 webpack의 플러그인 시스템을 통한 통합에 의존하는 서드파티 도구에 영향을 준다. [webpack 로더](./3.5-config/3.5.1-next-config-js/turbopack.md#configuring-webpack-loaders)는 지원한다. webpack 플러그인에 의존하고 있다면 Turbopack과 호환되는 대안을 찾거나, 동등한 기능이 제공될 때까지 webpack을 계속 사용해야 한다.

### 지원하지 않거나 아직 계획되지 않은 기능

일부 기능은 아직 구현되지 않았거나 계획되어 있지 않다.

- **레거시 CSS Modules 기능**
  - 독립 `:local`, `:global` pseudo-class(함수 형태 `:global(...)`만 지원한다).
  - `@value` 규칙(CSS 변수로 대체되었다).
  - `:import`, `:export` ICSS 규칙.
  - `.module.css`에서 `composes`로 `.css` 파일을 합성하는 경우. webpack은 이때 `.css` 파일을 CSS Module로 취급하지만, Turbopack에서는 `.css` 파일이 항상 전역(global)이다. CSS Module에서 `composes`를 쓰려면 `.css` 파일을 `.module.css` 파일로 바꿔야 한다.
  - CSS Modules에서 `@import`로 `.css`를 CSS Module로 import하는 경우. webpack은 이때 `.css` 파일을 CSS Module로 취급하지만, Turbopack에서는 `.css` 파일이 항상 전역이다. CSS Module에서 `@import`를 쓰려면 `.css` 파일을 `.module.css` 파일로 바꿔야 한다.
- **`sassOptions.functions`** `sassOptions.functions`에 정의한 커스텀 Sass 함수는 지원하지 않는다. 이 기능은 컴파일 중 Sass 코드에서 호출할 수 있는 JavaScript 함수를 정의하게 해준다. webpack의 Node.js 기반 sass-loader는 JavaScript 안에서 완전히 실행되는 반면, Turbopack의 Rust 기반 아키텍처는 `sassOptions.functions`로 전달된 JavaScript 함수를 직접 실행할 수 없다. 커스텀 Sass 함수를 사용하고 있다면 Turbopack 대신 webpack을 사용해야 한다.
- **`next.config.js`의 `webpack()` 설정** Turbopack은 webpack을 대체하므로 `webpack()` 설정은 인식하지 않는다. 대신 [`turbopack` 설정](./3.5-config/3.5.1-next-config-js/turbopack.md)을 사용한다.
- **Yarn PnP** Next.js의 Turbopack에서는 지원할 계획이 없다.
- **`experimental.urlImports`** Turbopack에서는 계획되어 있지 않다.
- **`experimental.esmExternals`** 계획되어 있지 않다. Turbopack은 Next.js의 레거시 `esmExternals` 설정을 지원하지 않는다.
- **일부 Next.js Experimental Flags**
  - `experimental.nextScriptWorkers`
  - `experimental.fallbackNodePolyfills` 이 두 가지는 앞으로 구현할 계획이다.

각 feature flag의 상태에 대한 전체적이고 상세한 내역은 [Turbopack API Reference](./3.5-config/3.5.1-next-config-js/turbopack.md)를 참고한다.

### 설정

Turbopack은 `next.config.js`(또는 `next.config.ts`)의 `turbopack` 키를 통해 설정할 수 있다. 설정 옵션은 다음과 같다.

- **`rules`** 파일 변환을 위한 추가 [webpack 로더](./3.5-config/3.5.1-next-config-js/turbopack.md#configuring-webpack-loaders)를 정의한다.
- **`resolveAlias`** webpack의 `resolve.alias`처럼 수동 별칭을 만든다.
- **`resolveExtensions`** 모듈 해석에 사용할 파일 확장자를 바꾸거나 확장한다.
- **[`ignoreIssue`](./3.5-config/3.5.1-next-config-js/turbopackIgnoreIssue.md)** CLI 출력과 에러 오버레이에서 특정 Turbopack 에러·경고를 숨긴다.

추가로 `next.config.js`의 `experimental` 아래에서 다음 실험적 옵션을 사용할 수 있다.

| 옵션 | 설명 | 기본값(dev) | 기본값(build) |
| --- | --- | --- | --- |
| `turbopackFileSystemCacheForDev` | dev 서버의 파일 시스템 캐시를 활성화한다. | `true` | 해당 없음 |
| `turbopackFileSystemCacheForBuild` | 빌드의 파일 시스템 캐시를 활성화한다. | 해당 없음 | `true`[^1] |
| `turbopackMinify` | 최소화(minification)를 활성화한다. boolean 또는 `{ server, client, edge }`로 환경별 설정이 가능하다. | `false` | `true` |
| `turbopackSourceMaps` | 소스맵을 활성화한다. | `true` | `productionBrowserSourceMaps` |
| `turbopackInputSourceMaps` | 입력 파일에서 소스맵 추출을 활성화한다. | `true` | `true` |
| `turbopackModuleFragments` | 현재 활발히 개발 중이다. 모듈을 fragment로 분할해 청크가 실제로 사용된 fragment만 import하게 한다. | `false` | `false` |
| `turbopackRemoveUnusedImports` | 사용하지 않는 import 제거를 활성화한다. `turbopackRemoveUnusedExports`가 필요하다. | `false` | `true` |
| `turbopackRemoveUnusedExports` | 사용하지 않는 export 제거를 활성화한다. | `false` | `true` |
| `turbopackInferModuleSideEffects` | 더 나은 트리쉐이킹을 위해 부수 효과가 없는 모듈을 추론하는 로컬 분석을 활성화한다. | `true` | `true` |
| `turbopackScopeHoisting` | scope hoisting을 활성화한다. dev 모드에서는 항상 비활성화된다. | `false` | `true` |
| `turbopackClientSideNestedAsyncChunking` | 클라이언트 측 에셋에 대해 중첩된 비동기 청킹을 활성화한다. | `false` | `true` |
| `turbopackServerSideNestedAsyncChunking` | 서버 측 에셋에 대해 중첩된 비동기 청킹을 활성화한다. | `false` | `false` |
| `turbopackImportTypeBytes` | ESM import에서 `with {type: "bytes"}` 지원을 활성화한다. | `false` | `false` |
| `turbopackUseBuiltinBabel` | Babel 설정 파일이 있을 때 자동 Babel 로더 설정을 활성화한다. | `true` | `true` |
| `turbopackUseBuiltinSass` | 자동 Sass 로더 설정을 활성화한다. | `true` | `true` |
| `turbopackModuleIds` | 모듈 ID 전략: `'named'` 또는 `'deterministic'`. | `'named'` | `'deterministic'` |
| `turbopackLocalPostcssConfig` | `postcss.config.js`를 프로젝트 루트보다 CSS 파일 디렉토리에서 먼저 찾는다. | `false` | `false` |
| `turbopackWorkerAssetPrefix` | Web Worker URL(entrypoint + module 청크)에 사용할 커스텀 asset prefix. `assetPrefix`를 재정의한다. webpack의 `output.workerPublicPath`에 대응한다. | `undefined` | `undefined` |

**표 참고**

[^1]: 기본으로 활성화되어 있다. 빌드 환경이 빌드 사이에 `.next/cache` 디렉토리를 보존하지 않는다면 이 옵션을 `false`로 설정한다.

`turbopack` 키 아래에서 별칭과 커스텀 파일 확장자를 함께 설정하는 예시는 다음과 같다.

```js
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}
```

더 깊이 있는 설정 예시는 [Turbopack 설정 문서](./3.5-config/3.5.1-next-config-js/turbopack.md)를 참고한다.

### 성능 디버깅용 추적 파일 생성

성능이나 메모리 문제를 겪고 있고 Next.js 팀이 이를 진단하는 데 도움을 주고 싶다면, dev 명령어에 `--internal-trace` 플래그를 추가해 추적 파일을 생성할 수 있다.

```bash
next dev --internal-trace
```

이 명령은 `.next-profiles/trace-turbopack.bin` 파일을 생성한다. [Next.js 저장소](https://github.com/vercel/next.js)에 GitHub 이슈를 만들 때 이 파일을 함께 첨부하면 조사에 도움이 된다.

### 요약(원문)

Turbopack은 **Rust 기반**의 **증분(incremental)** 번들러로, 특히 대규모 애플리케이션에서 로컬 개발과 빌드를 빠르게 만들도록 설계되었다. Next.js에 통합되어 있어 CSS, React, TypeScript를 별도 설정 없이 지원한다.

### 버전 변경 내역

| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | Turbopack이 Next.js의 기본 번들러가 되었다. 설정 파일이 발견되면 Babel을 자동으로 지원한다. |
| v15.5.0 | 빌드에 대한 Turbopack 지원(베타) |
| v15.3.0 | 빌드에 대한 실험적 지원 |
| v15.0.0 | dev용 Turbopack 안정화(stable) |

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서 데모 앱을 만들 때는 기본적으로 Turbopack이 켜진 상태에서 `next dev`를 실행해보고, `--webpack` 플래그로 전환했을 때 빌드 결과·속도가 어떻게 달라지는지 비교하는 데모를 설계한다.
- `import.meta.env`와 `import.meta.glob`을 사용하는 최소 예제를 만들어, lazy·eager 모드의 차이와 `turbopack.rules`로 쿼리 문자열 기반 로딩을 설정하는 과정을 확인한다.

## 연습 문제

1. Turbopack이 Next.js의 기본 번들러가 된 버전은?
   - A. v15.0.0
   - B. v15.5.0
   - C. v16.0.0

<details><summary>정답 보기</summary>

정답: C. v16.0.0부터 Turbopack이 Next.js의 기본 번들러가 되었다. v15.0.0은 dev용 Turbopack이 stable이 된 시점이고, v15.5.0은 빌드 지원이 베타로 추가된 시점이다.
</details>

2. Turbopack이 지원하지 않는 것은?
   - A. `import.meta.glob()`
   - B. webpack 플러그인
   - C. CSS Modules

<details><summary>정답 보기</summary>

정답: B. Turbopack은 webpack 플러그인을 지원하지 않는다(webpack 로더는 지원한다). `import.meta.glob()`과 CSS Modules는 모두 Turbopack이 지원하는 기능이다.
</details>

3. `import.meta.glob('./dir/*.js', { eager: true })`의 결과 객체 값은 무엇인가?
   - A. 모듈에 대한 `Promise`를 반환하는 thunk 함수
   - B. 모듈 객체 자체
   - C. 항상 `undefined`

<details><summary>정답 보기</summary>

정답: B. `eager: true`를 전달하면 각 값이 thunk가 아니라 모듈 객체 자체가 된다. 기본값(lazy)에서는 thunk 함수가 반환된다.
</details>

## 챕터 요약

- Turbopack은 Rust로 작성된 증분 번들러이며, Next.js 16부터 기본 번들러다. 필요하면 `--webpack` 플래그로 webpack으로 전환할 수 있다.
- JavaScript/TypeScript, RSC, CSS Modules, Sass, 정적 에셋 등 대부분의 기능을 별도 설정 없이 지원하지만, webpack 플러그인과 root layout 자동 생성 등 일부는 지원하지 않는다.
- `import.meta.env`와 `import.meta.glob`은 Vite와 호환되는 Turbopack 전용 API로, 정적 분석 기반 환경 변수 접근과 glob import를 제공한다.
- CSS Module 순서, Sass 소수점 정밀도, `~` tilde import 문법 등에서 webpack과 동작 차이가 있으므로 마이그레이션 시 유의해야 한다.
- `next.config.js`의 `turbopack` 키와 `experimental` 옵션으로 rules, alias, 캐시, 청킹 등을 세부적으로 설정할 수 있다.
