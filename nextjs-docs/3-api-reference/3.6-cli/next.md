# next CLI

- 공식 문서: [next CLI](https://nextjs.org/docs/app/api-reference/cli/next)
- 상위 메뉴: [CLI](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `next` CLI로 개발 서버 실행, 빌드, 프로덕션 실행까지 애플리케이션 생명주기 전체를 다루는 명령을 구분한다.
- `next dev`/`next build`/`next start`의 대표 옵션과 각각의 목적을 이해한다.
- `next typegen`, `next upgrade`, `next experimental-analyze` 등 보조 명령의 용도를 파악한다.
- 개발 중 자주 필요한 포트 변경, HTTPS 사용, prerender 오류 디버깅 같은 실전 시나리오에 맞는 플래그를 선택할 수 있다.

## 핵심 개념 및 설명

Next.js CLI로 애플리케이션을 개발하고, 빌드하고, 시작하는 등의 작업을 할 수 있다.

기본 사용법은 다음과 같다.

```
pnpm next [command] [options]
```

> **알아두면 좋은 점**: `npm run`을 사용할 때는 npm이 CLI 플래그를 `next`로 전달하도록 플래그 앞에 `--`를 붙여야 한다. `pnpm`, `yarn`, `bun`에서는 필요하지 않다.

### 옵션 레퍼런스

| 옵션 | 설명 |
| --- | --- |
| `-h` 또는 `--help` | 사용 가능한 모든 옵션을 표시한다 |
| `-v` 또는 `--version` | Next.js 버전 번호를 출력한다 |

### 명령

| 명령 | 설명 |
| --- | --- |
| `dev` | Hot Module Reloading, 오류 리포팅 등을 포함해 개발 모드로 Next.js를 시작한다 |
| `build` | 애플리케이션의 최적화된 프로덕션 빌드를 만든다. 각 라우트에 대한 정보를 표시한다 |
| `start` | 프로덕션 모드로 Next.js를 시작한다. 애플리케이션은 먼저 `next build`로 컴파일되어 있어야 한다 |
| `info` | Next.js 버그를 리포트할 때 사용할 수 있는 현재 시스템 관련 정보를 출력한다 |
| `telemetry` | Next.js의 완전 익명 텔레메트리 수집을 활성화하거나 비활성화한다 |
| `typegen` | 전체 빌드를 실행하지 않고 라우트, 페이지, 레이아웃, Route Handler에 대한 TypeScript 정의를 생성한다 |
| `upgrade` | Next.js 애플리케이션을 최신 버전으로 업그레이드한다 |
| `experimental-analyze` | Turbopack을 사용해 번들 출력을 분석한다. 빌드 산출물을 만들지 않는다 |

> **알아두면 좋은 점**: 명령 없이 `next`만 실행하면 `next dev`의 별칭으로 동작한다.

### next dev 옵션

`next dev`는 Hot Module Reloading(HMR), 오류 리포팅 등을 포함한 개발 모드로 애플리케이션을 시작한다.

> **알아두면 좋은 점**: 개발 빌드는 `.next`가 아니라 `.next/dev`로 출력된다. 이 덕분에 `next dev`와 `next build`를 충돌 없이 동시에 실행할 수 있다.

`next dev` 실행 시 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 애플리케이션을 빌드할 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |
| `--turbopack` | Turbopack을 강제로 활성화한다 (기본값으로 활성화됨). `--turbo`로도 사용 가능하다 |
| `--webpack` | 개발 시 기본 번들러인 Turbopack 대신 Webpack을 사용한다 |
| `-p` 또는 `--port <port>` | 애플리케이션을 시작할 포트 번호를 지정한다. 기본값: 3000, env: `PORT` |
| `-H` 또는 `--hostname <hostname>` | 애플리케이션을 시작할 hostname을 지정한다. 네트워크상 다른 기기에서 접근하게 할 때 유용하다. 기본값: `0.0.0.0` |
| `--experimental-https` | HTTPS로 서버를 시작하고 자체 서명 인증서를 생성한다 |
| `--experimental-https-key <path>` | HTTPS 키 파일 경로 |
| `--experimental-https-cert <path>` | HTTPS 인증서 파일 경로 |
| `--experimental-https-ca <path>` | HTTPS 인증 기관 파일 경로 |
| `--experimental-upload-trace <traceUrl>` | 디버깅 트레이스의 일부를 원격 HTTP URL로 보고한다 |
| `--experimental-cpu-prof` | V8의 인스펙터를 사용해 CPU 프로파일링을 활성화한다. 프로파일은 종료 시 `.next-profiles/`에 저장된다 |

### next build 옵션

`next build`는 애플리케이션의 최적화된 프로덕션 빌드를 만든다. 출력에는 각 라우트에 대한 정보가 표시된다. 예를 들면 다음과 같다.

```
Route (app)
┌ ○ /_not-found
└ ƒ /products/[id]
 
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

출력을 읽는 방법, 다이나믹 라우트를 prerender하는 방법, 빌드 오류를 디버깅하는 방법은 [Building 가이드](https://nextjs.org/docs/app/guides/building)를 참고한다.

`next build` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 애플리케이션을 빌드할 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |
| `--turbopack` | Turbopack을 강제로 활성화한다 (기본값으로 활성화됨). `--turbo`로도 사용 가능하다 |
| `--webpack` | Webpack으로 빌드한다 |
| `-d` 또는 `--debug` | 더 상세한 빌드 출력을 활성화한다. 이 플래그를 활성화하면 rewrites, redirects, headers 같은 추가 빌드 출력이 표시된다 |
| `--profile` | React의 프로덕션 프로파일링을 활성화한다 |
| `--no-lint` | 린팅을 비활성화한다. 참고: Next.js 16부터 `next build`에서 린팅이 제거된다. Next.js 15.5+에서 eslint가 아닌 다른 린터를 사용 중이면 빌드 중 린팅이 일어나지 않는다 |
| `--no-mangling` | Mangling을 비활성화한다. 성능에 영향을 줄 수 있으므로 디버깅 목적으로만 사용해야 한다 |
| `--experimental-app-only` | App Router 라우트만 빌드한다 |
| `--experimental-build-mode [mode]` | 실험적 빌드 모드를 사용한다 (선택지: `compile`, `generate`, 기본값: `default`) |
| `--debug-prerender` | 개발 환경에서 prerender 오류를 디버깅한다 |
| `--debug-build-paths=<patterns>` | 디버깅을 위해 특정 라우트만 빌드한다 |
| `--experimental-cpu-prof` | V8의 인스펙터를 사용해 CPU 프로파일링을 활성화한다. 프로파일은 종료 시 `.next-profiles/`에 저장된다 |

### next start 옵션

`next start`는 프로덕션 모드로 애플리케이션을 시작한다. 애플리케이션은 먼저 [`next build`](#next-build-옵션)로 컴파일되어 있어야 한다.

`next start` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h` 또는 `--help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 애플리케이션을 시작할 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |
| `-p` 또는 `--port <port>` | 애플리케이션을 시작할 포트 번호를 지정한다 (기본값: 3000, env: `PORT`) |
| `-H` 또는 `--hostname <hostname>` | 애플리케이션을 시작할 hostname을 지정한다 (기본값: `0.0.0.0`) |
| `--keepAliveTimeout <keepAliveTimeout>` | 비활성 연결을 닫기 전까지 대기할 최대 시간(밀리초)을 지정한다 |
| `--experimental-cpu-prof` | V8의 인스펙터를 사용해 CPU 프로파일링을 활성화한다. 프로파일은 종료 시 `.next-profiles/`에 저장된다 |

### next info 옵션

`next info`는 [GitHub 이슈](https://github.com/vercel/next.js/issues)를 열 때 Next.js 버그를 리포트하는 데 사용할 수 있는 현재 시스템 관련 정보를 출력한다. 여기에는 운영체제 플랫폼/아키텍처/버전, 바이너리(Node.js, npm, Yarn, pnpm), 패키지 버전(`next`, `react`, `react-dom`) 등이 포함된다.

출력은 다음과 같은 형태다.

```
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 23.6.0
  Available memory (MB): 65536
  Available CPU cores: 10
Binaries:
  Node: 20.12.0
  npm: 10.5.0
  Yarn: 1.22.19
  pnpm: 9.6.0
Relevant Packages:
  next: 15.0.0-canary.115 // Latest available version is detected (15.0.0-canary.115).
  eslint-config-next: 14.2.5
  react: 19.0.0-rc
  react-dom: 19.0.0
  typescript: 5.5.4
Next.js Config:
  output: N/A
```

`next info` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h` 또는 `--help` | 사용 가능한 모든 옵션을 표시한다 |
| `--verbose` | 디버깅을 위한 추가 정보를 수집한다 |

### next telemetry 옵션

Next.js는 일반적인 사용에 대한 **완전히 익명인** 텔레메트리 데이터를 수집한다. 이 익명 프로그램 참여는 선택 사항이며, 정보를 공유하고 싶지 않다면 옵트아웃할 수 있다.

`next telemetry` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `--enable` | Next.js의 텔레메트리 수집을 활성화한다 |
| `--disable` | Next.js의 텔레메트리 수집을 비활성화한다 |

자세한 내용은 [Telemetry](https://nextjs.org/telemetry)를 참고한다.

### next typegen 옵션

`next typegen`은 전체 빌드를 수행하지 않고 애플리케이션 라우트에 대한 TypeScript 정의를 생성한다. IDE 자동완성이나 라우트 사용에 대한 CI 타입 체크에 유용하다.

이전에는 라우트 타입이 `next dev`나 `next build` 중에만 생성되어, `tsc --noEmit`을 직접 실행해서는 라우트 타입을 검증할 수 없었다. 이제는 타입을 독립적으로 생성해 외부에서 검증할 수 있다.

```
# 먼저 라우트 타입을 생성한 뒤 TypeScript로 검증한다
next typegen && tsc --noEmit
 
# 또는 빌드 없이 타입 체크만 하는 CI 워크플로에서
next typegen && npm run type-check
```

`next typegen` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 타입을 생성할 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |

출력 파일은 `<distDir>/types`에 작성된다 (일반적으로 개발 환경에서는 `.next/dev/types`, 프로덕션에서는 `.next/types`).

```
next typegen
# 또는 특정 앱에 대해
next typegen ./apps/web
```

추가로 `next typegen`은 `next-env.d.ts` 파일을 생성한다. `next-env.d.ts`는 `.gitignore`에 추가하는 것을 권장한다.

`next-env.d.ts` 파일은 `tsconfig.json` 파일에 포함되어 Next.js 타입을 프로젝트에서 사용할 수 있게 한다.

타입 체크 전에 `next-env.d.ts`가 존재하도록 하려면 `next typegen`을 실행한다. `next dev`와 `next build` 명령도 `next-env.d.ts` 파일을 생성하지만, CI/CD 환경 등에서는 타입 체크만을 위해 이 명령들을 실행하는 것이 바람직하지 않은 경우가 많다.

> **알아두면 좋은 점**: `next typegen`은 프로덕션 빌드 phase를 사용해 Next.js 설정(`next.config.js`, `next.config.mjs`, `next.config.ts`)을 로드한다. 설정이 올바르게 로드되도록 필요한 환경 변수와 의존성을 준비해두어야 한다.

### next upgrade 옵션

`next upgrade`는 Next.js 애플리케이션을 최신 버전으로 업그레이드한다.

`next upgrade` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 업그레이드할 Next.js 애플리케이션이 있는 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |
| `--revision <revision>` | 업그레이드할 Next.js 버전이나 태그를 지정한다 (예: `latest`, `canary`, `15.0.0`). 기본값은 현재 설치된 릴리스 채널이다 |
| `--verbose` | 업그레이드 과정의 상세 출력을 표시한다 |

### next experimental-analyze 옵션

`next experimental-analyze`는 [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)을 사용해 애플리케이션의 번들 출력을 분석한다. 이 명령은 JavaScript, CSS, 기타 에셋을 포함한 번들의 크기와 구성을 파악하는 데 도움을 준다. 이 명령은 애플리케이션 빌드를 만들지 않는다.

```
pnpm next experimental-analyze
```

기본적으로 이 명령은 분석이 끝나면 로컬 서버를 시작해 브라우저에서 번들 구성을 탐색할 수 있게 한다. 분석기에서 할 수 있는 것은 다음과 같다.

- 라우트별로 번들을 필터링하고 클라이언트/서버 뷰를 전환한다
- 모듈이 왜 포함되었는지 보여주는 전체 import 체인을 확인한다
- 서버-클라이언트 컴포넌트 경계와 다이나믹 import를 넘나드는 import를 추적한다

최적화 전략은 [Package Bundling](https://nextjs.org/docs/app/guides/package-bundling#optimizing-large-bundles)을 참고한다.

서버를 시작하지 않고 분석 출력을 디스크에 쓰려면 `--output` 플래그를 사용한다. 출력은 `.next/diagnostics/analyze`에 작성되며 다른 곳으로 복사하거나 공유할 수 있는 정적 파일로 구성된다.

```
# .next/diagnostics/analyze에 출력을 쓴다
npx next experimental-analyze --output
 
# 향후 분석과 비교하기 위해 출력을 복사한다
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

`next experimental-analyze` 명령에 사용 가능한 옵션은 다음과 같다.

| 옵션 | 설명 |
| --- | --- |
| `-h, --help` | 사용 가능한 모든 옵션을 표시한다 |
| `[directory]` | 애플리케이션을 분석할 디렉토리. 지정하지 않으면 현재 디렉토리를 사용한다 |
| `--no-mangling` | Mangling을 비활성화한다. 성능에 영향을 줄 수 있으므로 디버깅 목적으로만 사용해야 한다 |
| `--profile` | React의 프로덕션 프로파일링을 활성화한다. 성능에 영향을 줄 수 있다 |
| `-o, --output` | 서버를 시작하지 않고 분석 파일을 디스크에 쓴다. 출력은 `.next/diagnostics/analyze`에 작성된다 |
| `--port <port>` | 분석기를 서비스할 포트 번호를 지정한다 (기본값: 4000, env: `PORT`) |

### 예제

#### prerender 오류 디버깅

`next build` 중 prerender 오류가 발생하면 `--debug-prerender` 플래그를 사용해 더 자세한 출력을 얻을 수 있다.

```
next build --debug-prerender
```

이 플래그는 디버깅을 쉽게 만드는 실험적 옵션 몇 가지를 활성화한다.

- 서버 코드 minification을 비활성화한다.
  - `experimental.serverMinification = false`
  - `experimental.turbopackMinify = false`
- 서버 번들의 소스맵을 생성한다.
  - `experimental.serverSourceMaps = true`
- 첫 prerender 오류 이후에도 계속 빌드해 한 번에 모든 문제를 볼 수 있게 한다.
  - `experimental.prerenderEarlyExit = false`

이는 빌드 출력에서 더 읽기 쉬운 스택 트레이스와 코드 프레임이 드러나도록 돕는다.

> **경고**: `--debug-prerender`는 개발 중 디버깅 용도로만 사용한다. 성능에 영향을 줄 수 있으므로 `--debug-prerender`로 생성한 빌드를 프로덕션에 배포하지 않는다.

#### 특정 라우트만 빌드하기

`--debug-build-paths` 옵션으로 App Router와 Pages Router에서 특정 라우트만 빌드할 수 있다. 대규모 애플리케이션에서 더 빠르게 디버깅할 때 유용하다. `--debug-build-paths` 옵션은 쉼표로 구분된 파일 경로를 받고, glob 패턴을 지원하며, `!`를 접두어로 붙인 경로는 제외한다.

```
# 특정 라우트 하나만 빌드한다
next build --debug-build-paths="app/page.tsx"
 
# 두 개 이상의 라우트를 빌드한다
next build --debug-build-paths="app/page.tsx,pages/index.tsx"
 
# 경로에 라우트 그룹 폴더를 포함한다
next build --debug-build-paths="app/(marketing)/about/page.tsx"
 
# glob 패턴을 사용한다
next build --debug-build-paths="app/**/page.tsx"
next build --debug-build-paths="pages/*.tsx"
 
# ! 접두어로 라우트를 제외한다
next build --debug-build-paths="app/**/page.tsx,!app/admin/**"
```

라우트를 `src/` 아래에 두는 프로젝트에서는 경로가 `src/` 접두어가 있든 없든 해석되므로 `app/page.tsx`와 `src/app/page.tsx`가 같은 라우트에 매칭된다.

#### 기본 포트 변경하기

Next.js는 기본적으로 개발 중과 `next start` 실행 시 `http://localhost:3000`을 사용한다. 기본 포트는 다음처럼 `-p` 옵션으로 바꿀 수 있다.

```
next dev -p 4000
```

또는 `PORT` 환경 변수를 사용한다.

```
PORT=4000 next dev
```

> **알아두면 좋은 점**: HTTP 서버 구동이 다른 코드가 초기화되기 전에 일어나므로 `PORT`는 `.env`에 설정할 수 없다.

#### 개발 중 HTTPS 사용하기

웹훅이나 인증 같은 특정 사용 사례에서는 `localhost`에서 안전한 환경을 갖추기 위해 [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)를 사용할 수 있다. Next.js는 `next dev`에서 `--experimental-https` 플래그로 자체 서명 인증서를 생성할 수 있다.

```
next dev --experimental-https
```

생성된 인증서와 함께 Next.js 개발 서버는 `https://localhost:3000`에서 실행된다. `-p`, `--port`, `PORT`로 포트를 지정하지 않으면 기본 포트 `3000`이 사용된다.

`--experimental-https-key`와 `--experimental-https-cert`로 커스텀 인증서와 키를 제공할 수도 있다. 선택적으로 `--experimental-https-ca`로 커스텀 CA 인증서도 제공할 수 있다.

```
next dev --experimental-https --experimental-https-key ./certificates/localhost-key.pem --experimental-https-cert ./certificates/localhost.pem
```

`next dev --experimental-https`는 개발 전용으로만 사용하도록 만들어졌으며 [`mkcert`](https://github.com/FiloSottile/mkcert)로 로컬에서 신뢰되는 인증서를 생성한다. 프로덕션에서는 신뢰할 수 있는 기관에서 정식으로 발급받은 인증서를 사용한다.

#### 다운스트림 프록시 타임아웃 설정하기

Next.js를 다운스트림 프록시(예: AWS ELB/ALB 같은 로드 밸런서) 뒤에 배포할 때는 Next.js의 내부 HTTP 서버에 다운스트림 프록시의 타임아웃보다 _더 큰_ [keep-alive 타임아웃](https://nodejs.org/api/http.html#http_server_keepalivetimeout)을 설정하는 것이 중요하다. 그렇지 않으면 특정 TCP 연결에서 keep-alive 타임아웃에 도달했을 때 Node.js가 다운스트림 프록시에 알리지 않고 즉시 해당 연결을 종료한다. 그 결과 프록시가 Node.js가 이미 종료한 연결을 재사용하려 할 때마다 프록시 오류가 발생한다.

프로덕션 Next.js 서버의 타임아웃 값을 설정하려면 `next start`에 `--keepAliveTimeout`(밀리초)을 전달한다.

```
next start --keepAliveTimeout 70000
```

#### Node.js 인수 전달하기

`next` 명령에 [node 인수](https://nodejs.org/api/cli.html#cli_node_options_options)를 전달할 수 있다. 예를 들면 다음과 같다.

```
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

#### CPU 프로파일링

CPU 프로파일을 캡처해 Next.js 애플리케이션의 성능 병목을 분석할 수 있다. `--experimental-cpu-prof` 플래그는 V8의 내장 CPU 프로파일러를 활성화하고 프로세스가 종료될 때 프로파일을 `.next-profiles/`에 저장한다.

```
# 빌드 프로세스를 프로파일링한다
next build --experimental-cpu-prof
 
# 개발 서버를 프로파일링한다 (Ctrl+C나 SIGTERM 시 프로파일 저장)
next dev --experimental-cpu-prof
 
# 프로덕션 서버를 프로파일링한다
next start --experimental-cpu-prof
```

생성된 `.cpuprofile` 파일은 Chrome DevTools(Performance 탭 → Load profile)나 다른 V8 호환 프로파일링 도구에서 열 수 있다.

> **알아두면 좋은 점**: 프로파일 파일은 설명적인 접두어와 타임스탬프로 이름이 붙는다. 생성되는 프로파일은 명령에 따라 다르다.
>
> `next dev`:
>
> - `dev-main-*` - 부모 프로세스 (개발 서버 오케스트레이션)
> - `dev-server-*` - 자식 서버 프로세스 (요청 처리와 렌더링) - 일반적으로 분석 대상은 이 프로파일이다
>
> `next build` (Turbopack):
>
> - `build-main-*` - 메인 빌드 오케스트레이션 프로세스
> - `build-turbopack-*` - Turbopack 컴파일 워커
>
> `next build` (Webpack):
>
> - `build-main-*` - 메인 빌드 오케스트레이션 프로세스
> - `build-webpack-client-*` - 클라이언트 번들 컴파일 워커
> - `build-webpack-server-*` - 서버 번들 컴파일 워커
> - `build-webpack-edge-server-*` - Edge 런타임 컴파일 워커
>
> `next start`:
>
> - `start-main-*` - 프로덕션 서버 프로세스

### Version History

| 버전 | 변경 사항 |
| --- | --- |
| `v16.1.0` | `next upgrade` 명령을 추가했다 |
| `v16.1.0` | `next experimental-analyze` 명령을 추가했다 |
| `v16.0.0` | `next build`에서 JS 번들 크기 메트릭이 제거되었다 |
| `v15.5.0` | `next typegen` 명령을 추가했다 |
| `v15.4.0` | prerender 오류 디버깅을 돕는 `next build`용 `--debug-prerender` 옵션을 추가했다 |

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- Phase 1에서는 구현 예정으로 남긴다. Phase 2에서 `next dev`/`next build`/`next start`를 순서대로 실행해 각 명령의 출력(라우트 정보, `.next` 산출물)을 비교하는 실습과, `--debug-prerender`로 의도적인 prerender 오류를 디버깅해보는 실습을 설계한다.

## 연습 문제

1. 개발 서버를 포트 4000에서 실행하고 싶을 때 사용할 수 있는 방법으로 옳은 것을 모두 고르시오. (복수 선택)
   - A. `next dev -p 4000`
   - B. `PORT=4000 next dev`
   - C. `.env` 파일에 `PORT=4000`을 설정한다

<details><summary>정답 보기</summary>

정답: A, B. `-p`/`--port` 옵션이나 `PORT` 환경 변수로 포트를 지정할 수 있다. `PORT`는 HTTP 서버 구동이 다른 코드 초기화보다 먼저 일어나기 때문에 `.env`에는 설정할 수 없다.
</details>

2. `next build`에서 prerender 오류가 발생했을 때 더 자세한 디버깅 출력을 얻으려면 어떤 플래그를 사용하는가?
   - A. `--debug-build-paths`
   - B. `--debug-prerender`
   - C. `--no-mangling`

<details><summary>정답 보기</summary>

정답: B. `--debug-prerender`는 서버 코드 minification 비활성화, 소스맵 생성, 첫 오류 이후에도 빌드 계속 등 디버깅에 유리한 옵션들을 함께 활성화한다.
</details>

3. `next dev`와 `next build`를 동시에 실행해도 충돌하지 않는 이유는 무엇인가?
   - A. 두 명령이 같은 `.next` 디렉토리를 공유하며 자동으로 병합되기 때문이다
   - B. 개발 빌드는 `.next`가 아닌 `.next/dev`로 출력되기 때문이다
   - C. `next dev`는 디스크에 아무것도 쓰지 않기 때문이다

<details><summary>정답 보기</summary>

정답: B. 개발 빌드 출력 위치가 프로덕션 빌드 출력(`.next`)과 분리되어 있어 두 명령을 동시에 실행할 수 있다.
</details>

## 챕터 요약

- `next` CLI는 `dev`, `build`, `start`, `info`, `telemetry`, `typegen`, `upgrade`, `experimental-analyze` 명령을 제공하며, 명령 없이 `next`만 실행하면 `next dev`의 별칭이다.
- `next dev`는 `.next/dev`로 출력되어 `next build`와 동시 실행이 가능하고, `--turbopack`/`--webpack`, `-p`/`-H`, `--experimental-https*` 등의 옵션을 가진다.
- `next build`는 라우트별 정보를 출력하며 `--debug-prerender`, `--debug-build-paths`로 디버깅과 부분 빌드를 지원한다.
- `next typegen`은 전체 빌드 없이 라우트 타입을 생성해 IDE 자동완성과 CI 타입 체크에 활용할 수 있다.
- 포트 변경(`-p`/`PORT`), HTTPS 개발 환경, 다운스트림 프록시 타임아웃, CPU 프로파일링 등은 모두 `next` CLI 플래그로 다룬다.

---

> 이미지 검증: 브라우저 확장 미연결로 wigolo fetch(images: []) 기준 판단.
