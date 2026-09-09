# serverExternalPackages

- 공식 문서: [serverExternalPackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `serverExternalPackages` 옵션의 역할과 Server Component 번들링 제외 메커니즘을 이해한다.
- 네이티브 C++ 애드온이나 Node.js 전용 모듈을 외부 의존성으로 분리해야 하는 기술적 배경을 파악한다.
- Next.js가 기본으로 외부화(external) 처리하는 내장 패키지 목록과 사용자 정의 패키지 등록 방법을 설명할 수 있다.

## 핵심 개념 및 설명

`serverExternalPackages`는 Server Component와 Route Handler에서 사용하는 특정 패키지를 번들링 대상에서 제외하고 런타임에 Node.js 네이티브 `require()`로 직접 로드하도록 설정하는 옵션이다.

기본적으로 Next.js는 Server Component 코드에서 참조하는 `node_modules` 종속성을 서버 번들에 함께 묶는다. 하지만 C++ 네이티브 바인딩을 사용하는 라이브러리(예: `sharp`, `sqlite3`, `bcrypt`)나 동적 코드 실행을 수반하는 패키지는 번들러(Webpack 또는 Turbopack)가 코드를 변환하면 정상적으로 동작하지 않거나 바이너리 경로를 찾지 못하는 문제가 발생할 수 있다. 이때 해당 패키지 이름을 `serverExternalPackages` 배열에 등록하면 번들러가 코드를 변환하지 않고 네이티브 모듈 로딩 방식으로 처리한다.

### 기본 설정 구조

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@acme/ui', 'package-name'],
}

export default nextConfig
```

### serverExternalPackages 옵션 개요

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `serverExternalPackages` | `string[]` | `[]` | Server Component 번들링에서 제외할 npm 패키지 이름 또는 패키지 스코프 목록 |

> **알아두면 좋은 점**:
>
> - `serverExternalPackages`는 Node.js 런타임 환경(`runtime: 'nodejs'`)에서만 동작한다. Edge Runtime(`runtime: 'edge'`)에서는 네이티브 `require()` 및 C++ 바이너리를 지원하지 않으므로 이 옵션에 포함된 패키지를 Edge 런타임 환경에서 호출하면 런타임 에러가 발생한다.
> - 독립 실행형 배포(`output: 'standalone'`)를 사용하면 Next.js의 종속성 추적(tracing) 엔진이 `serverExternalPackages`에 명시된 패키지와 의존 파일을 감지하여 `.next/standalone/node_modules` 디렉토리에 자동으로 복사한다.

### 기본으로 제외되는 패키지 목록

Next.js는 생태계에서 널리 쓰이는 네이티브 라이브러리와 데이터베이스 클라이언트 목록을 내부적으로 관리한다. 아래 패키지들은 별도로 `serverExternalPackages`에 지정하지 않아도 프레임워크가 자동으로 번들링에서 제외한다:

- **데이터베이스 및 ORM**: `@prisma/client`, `prisma`, `pg`, `mongodb`, `mongoose`, `sqlite3`, `better-sqlite3`, `libsql`, `@libsql/client`, `@mikro-orm/core`, `@mikro-orm/knex`, `ravendb`
- **암호화 및 보안**: `bcrypt`, `argon2`, `@node-rs/bcrypt`, `@node-rs/argon2`, `oslo`
- **미디어 및 그래픽**: `sharp`, `canvas`, `@react-pdf/renderer`
- **브라우저 자동화 및 테스트**: `playwright`, `playwright-core`, `puppeteer`, `puppeteer-core`, `cypress`, `jest`
- **로깅 및 모니터링**: `pino`, `pino-pretty`, `pino-roll`, `thread-stream`, `newrelic`, `dd-trace`, `@appsignal/nodejs`, `@highlight-run/node`
- **AWS 및 클라우드 SDK**: `@aws-sdk/client-s3`, `@aws-sdk/s3-presigned-post`, `aws-crt`, `firebase-admin`
- **머신러닝 및 AI**: `onnxruntime-node`, `@xenova/transformers`, `@huggingface/transformers`
- **컴파일러 및 도구 체계**: `typescript`, `ts-morph`, `ts-node`, `@swc/core`, `webpack`, `prettier`, `eslint`, `shiki`

프로젝트에서 위 목록에 없는 사내 공통 모듈이나 네이티브 C++ 바인딩 라이브러리를 사용하면서 번들링 충돌이 발생한다면 `serverExternalPackages` 배열에 패키지명을 직접 추가한다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `experimental.serverComponentsExternalPackages`에서 `serverExternalPackages`로 안정화 및 정식 옵션으로 변경 |

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (서버 번들러의 패키지 번들링 제외 및 Node.js 네이티브 모듈 로딩을 제어하는 설정임)
- 서버 번들링 충돌 재현: 네이티브 바이너리를 포함하거나 번들러 친화적이지 않은 외부 라이브러리를 `serverExternalPackages` 없이 Server Component에서 임포트해 보고 어떤 번들 타임/런타임 에러가 발생하는지 확인한다.
- 패키지 외부화 적용: `next.config.ts`에 해당 라이브러리를 `serverExternalPackages`에 등록한 뒤, 서버 번들이 생성될 때 모듈 내부 코드가 인라인되지 않고 외부 `require('package-name')` 호출로 남아 정상 동작하는지 번들 산출물을 분석한다.
- `output: 'standalone'` 결과 검증: `next build` 후 `.next/standalone/node_modules` 폴더에 `serverExternalPackages`로 지정한 패키지가 복사되어 포함되는지 확인한다.

## 연습 문제

1. Next.js App Router에서 `serverExternalPackages` 설정의 주된 목적으로 가장 올바른 것은?
   - A. 클라이언트 번들 크기를 줄이기 위해 브라우저용 라이브러리를 CDN에서 직접 로드하도록 지정한다.
   - B. Server Component 번들링 시 특정 패키지를 번들에서 제외하고 런타임에 Node.js 네이티브 `require`로 로드하도록 한다.
   - C. Edge Runtime에서 Node.js 네이티브 C++ 모듈을 완벽하게 에뮬레이션하여 실행한다.
   - D. `next build` 시점에 외부 패키지의 TypeScript 타입 정의 파일을 전역으로 다운로드한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `serverExternalPackages`는 네이티브 C++ 애드온이나 번들러와 호환되지 않는 패키지를 Server Component 번들링 대상에서 제외하고 Node.js 네이티브 `require()`로 로드하게 해서 런타임 오류를 방지한다.
</details>

2. `serverExternalPackages` 옵션과 런타임 환경에 대한 설명 중 틀린 것은?
   - A. `runtime: 'edge'` 환경에서는 네이티브 `require()`가 지원되지 않으므로 이 옵션에 등록된 패키지를 호출할 수 없다.
   - B. Next.js 15 이전에는 `experimental.serverComponentsExternalPackages`라는 명칭으로 제공되었다.
   - C. `sharp`, `bcrypt`, `@prisma/client` 등의 주요 라이브러리는 Next.js에 의해 기본적으로 외부화 목록에 포함되어 있다.
   - D. `serverExternalPackages`에 명시된 패키지는 `output: 'standalone'` 빌드 시 종속성 추적에서 완전히 누락되므로 수동 복사해야 한다.

<details><summary>정답 보기</summary>

정답: **D**
해설: `output: 'standalone'` 모드로 빌드할 때 Next.js의 파일 추적 엔진이 `serverExternalPackages`에 등록된 패키지를 감지하여 `.next/standalone/node_modules`에 자동으로 복사해 넣는다.
</details>

## 챕터 요약

- `serverExternalPackages`는 Server Component와 Route Handler에서 특정 패키지를 번들러에서 제외하고 네이티브 Node.js `require()`로 로드하게 한다.
- C++ 네이티브 바인딩이나 플랫폼 전용 바이너리를 포함하여 Webpack/Turbopack 번들링과 충돌하는 모듈을 해결할 때 필수적이다.
- `sharp`, `sqlite3`, `prisma`, `bcrypt` 등 널리 사용되는 패키지들은 프레임워크 내부에 기본으로 등록되어 있어 별도 설정 없이 동작한다.
- Node.js 런타임 전용 설정이며 네이티브 모듈 로딩을 지원하지 않는 Edge Runtime에서는 사용할 수 없다.
- `output: 'standalone'` 빌드 시 Next.js가 해당 패키지를 standalone 결과물 디렉토리에 자동으로 포함한다.
