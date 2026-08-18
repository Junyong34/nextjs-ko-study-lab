# next.config.js

- 공식 문서: [next.config.js](https://nextjs.org/docs/app/api-reference/config/next-config-js)
- 상위 메뉴: [Configuration](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 애플리케이션의 런타임 및 빌드 동작을 전역적으로 제어하는 `next.config.js` (`next.config.ts`) 구성 방식을 익힌다.
- CommonJS, ESM(`next.config.mjs`), TypeScript(`next.config.ts`) 포맷 및 함수형/비동기 설정 모델을 이해한다.
- `phase` 컨텍스트(`next/constants`)를 활용하여 개발/프로덕션 환경별 분기 설정을 적용한다.
- 리다이렉트(`redirects`), 리라이트(`rewrites`), 헤더(`headers`), 이미지 최적화(`images`), Turbopack 등 핵심 설정 옵션 목록을 파악한다.

## 핵심 개념 및 설명

`next.config.js`(또는 `next.config.ts`, `next.config.mjs`)는 프로젝트 루트 디렉토리에 위치하며, Next.js의 빌드 파이프라인, 서버 라우팅 규칙, 실험적 기능, 이미지 최적화 등을 커스터마이징하는 핵심 설정 파일이다.

이 파일은 브라우저 번들에 포함되지 않으며 Node.js 런타임 및 빌드 단계에서만 해석된다.

### 기본 설정 구조

#### 1. TypeScript (`next.config.ts`)

Next.js 최신 버전에서는 타입 안전성을 제공하는 `next.config.ts`를 기본 지원한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // 실험적 기능 플래그
  },
}

export default nextConfig
```

#### 2. ECMAScript Modules (`next.config.mjs`)

```js filename="next.config.mjs" switcher
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

#### 3. CommonJS (`next.config.js`)

```js filename="next.config.js" switcher
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 함수형 및 Phase 기반 조건부 설정

현재 실행 단계(`phase`: 개발 서버, 프로덕션 빌드 등)에 따라 동적으로 설정을 분기하거나 비동기 작업을 수행할 수 있다:

```js filename="next.config.js"
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = async (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      // 로컬 개발 전용 설정
      logging: {
        fetches: { fullUrl: true },
      },
    }
  }

  return {
    // 프로덕션 빌드 전용 설정
    compress: true,
  }
}
```

### 주요 설정 옵션 요약

| 옵션명 | 설명 |
|---|---|
| `basePath` | 애플리케이션을 도메인의 서브 경로(예: `/docs`) 하위에 배포할 때 지정 |
| `assetPrefix` | 정적 자산(JS/CSS/이미지)을 CDN 도메인에서 제공하도록 접두사 지정 |
| `env` | 빌드 시점에 인라인 주입할 환경 변수 정의 |
| `images` | `next/image`의 원격 도메인(`remotePatterns`), 디바이스 크기, 포맷 설정 |
| `redirects` | URL 패턴 기반의 HTTP 리다이렉트(307/308) 규칙 배열 반환 |
| `rewrites` | 주소창 변경 없이 내부 경로 또는 외부 API로 프록시하는 재작성 규칙 |
| `headers` | 보안 및 캐싱을 위한 커스텀 HTTP 응답 헤더 등록 |
| `output` | 배포 최적화 출력 모드 (`'standalone'`, `'export'`) |
| `transpilePackages` | 모노레포 패키지 또는 외부 ESM 라이브러리의 트랜스파일 대상 등록 |
| `turbopack` | Turbopack 번들러 전용 로더 및 모듈 앨리어스 설정 |
| `typedRoutes` | 정적 타이핑된 라우트 경로 지원 (`experimental`) |

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `next.config.ts` 기본 지원 및 Turbopack 기본 통합 강화 |
| `v12.1.0` | 비동기 함수형 설정(`async (phase) => ...`) 지원 |

## 예제 및 데모 설계

- `next.config.ts`에서 `redirects()`를 선언하여 `/legacy/:id` 접근 시 `/new/:id`로 308 영구 이동하는 규칙을 작성하고 브라우저에서 검증한다.
- `images.remotePatterns`를 추가하여 허용된 외부 도메인의 이미지만 `next/image`로 최적화되도록 보안 정책을 적용한다.
- `phase === PHASE_DEVELOPMENT_SERVER` 분기를 통해 개발 환경에서만 상세 fetch 로깅을 활성화한다.

## 연습 문제

1. Next.js에서 `next.config.js`가 실행되는 환경으로 올바른 것은?
   - A. 클라이언트 브라우저 런타임
   - B. Node.js 서버 및 빌드 프로세스
   - C. 브라우저 Web Worker
   - D. 서비스 워커(Service Worker)

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next.config.js`는 Node.js 모듈로 빌드 시점과 서버 초기화 시점에만 해석되며 클라이언트 번들에는 포함되지 않는다.
</details>

2. `next.config.js`에서 개발 서버 실행 여부를 구분하기 위해 `next/constants`에서 가져와 사용하는 상수는?
   - A. `ENV_DEVELOPMENT`
   - B. `PHASE_DEVELOPMENT_SERVER`
   - C. `MODE_DEV`
   - D. `IS_LOCAL`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next/constants` 모듈이 제공하는 `PHASE_DEVELOPMENT_SERVER` 상수를 함수형 설정의 `phase` 인자와 비교하여 개발 모드 전용 설정을 분기한다.
</details>

## 챕터 요약

- `next.config.js` (`next.config.ts`)는 Next.js의 전역 빌드 및 런타임 설정을 담당한다.
- Node.js 환경에서만 실행되며 TypeScript, ESM, CJS 문법을 모두 지원한다.
- `(phase, { defaultConfig })` 함수형 설정을 통해 환경별 분기가 가능하다.
- `redirects`, `rewrites`, `headers`, `images` 등의 핵심 라우팅 및 최적화 규칙을 관리한다.
