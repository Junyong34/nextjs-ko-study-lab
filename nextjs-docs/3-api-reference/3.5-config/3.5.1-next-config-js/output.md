# output

- 공식 문서: [output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 출력 파일 추적(Output File Tracing) 기술과 `output: 'standalone'` 설정의 필요성을 이해한다.
- `@vercel/nft`를 기반으로 배포 필수 파일만 선별하여 경량화된 프로덕션 아티팩트를 생성하는 과정을 파악한다.
- 생성된 `.next/standalone` 디렉토리의 최소 `server.js` 실행 방식과 정적 에셋 수동 복사 절차를 익힌다.
- 모노레포 환경에서 `outputFileTracingRoot`를 구성하는 방법과 `outputFileTracingIncludes`/`outputFileTracingExcludes` 제어 규칙을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 빌드 과정에서 각 페이지와 그 의존성을 자동으로 추적한다. 이렇게 추적한 결과로 애플리케이션의 프로덕션 버전을 배포하는 데 필요한 파일만 판별한다.

그만큼 도커 컨테이너 이미지 등 배포 산출물의 크기가 크게 줄어든다. 기존에는 `next start`를 실행하려면 전체 `dependencies`가 담긴 거대한 `node_modules` 폴더를 컨테이너에 모두 복사해야 했다. Next.js 12부터 제공되는 출력 파일 추적 기능을 활용하면 실행에 꼭 필요한 의존 파일만 `.next/` 디렉토리 내에 선별 보관한다.

또한 출력 파일 추적은 레거시 `serverless` 타깃 설정을 완전히 대체한다. 그 설정은 다양한 부작용과 불필요한 코드 중복을 유발했다.

> **참고**: 완전한 정적 HTML 사이트로 빌드하고자 할 때는 `output: 'export'`를 사용한다. 정적 내보내기 동작에 대한 세부 사항은 [Static Exports 가이드](../../../2-guides/static-exports.md)를 참고한다.

---

### 동작 원리 (How it Works)

`next build` 실행 시 Next.js는 내부적으로 [`@vercel/nft`](https://github.com/vercel/nft)(Node File Trace) 라이브러리를 사용한다. `@vercel/nft`는 소스 코드의 `import`, `require`, `fs` 호출 경로를 정적 분석한다. 이렇게 각 라우트가 런타임에 로드할 수도 있는 의존 파일을 모두 추적한다.

Next.js는 프로덕션 서버 자체도 함께 추적해 `.next/next-server.js.nft.json` 파일에 필요한 의존 목록을 기록한다. 각 페이지 단위로도 `.nft.json` 메타데이터 파일을 만들어 두므로, 이를 기반으로 배포 위치에 필수 파일만 선별 복사하면 된다.

---

### 추적된 파일 자동 복사 (Automatically Copying Traced Files)

Next.js는 프로덕션 배포에 필요한 최소 파일만 모아 `standalone` 폴더를 자동으로 생성할 수 있다. 선택된 `node_modules`도 여기에 함께 들어간다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

export default nextConfig
```

이 옵션을 활성화하고 빌드를 수행하면 `.next/standalone` 폴더가 생성된다. 호스트 머신에 별도의 `node_modules` 전체를 설치하지 않고도 이 폴더만으로 독립 배포해서 실행하면 된다.

또한 최소 크기의 `server.js` 진입점이 함께 출력된다. 기본 `next start` 명령을 이 진입점으로 대신하면 된다.

#### 정적 에셋 수동 복사 필요성

최소 `server.js` 서버는 기본적으로 `public` 폴더나 `.next/static` 폴더를 `standalone` 내부로 자동 복사하지 않는다. 이러한 정적 파일들은 프로덕션 환경에서 CDN을 통해 서빙하는 것이 이상적이기 때문이다.

동일한 Node.js 단일 서버에서 정적 파일까지 함께 서비스하려면 빌드 직후 이 폴더들을 `standalone` 위치로 직접 복사해야 한다:

```bash filename="Terminal"
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
```

복사를 완료한 후 로컬 또는 컨테이너 내부에서 다음 명령으로 경량 서버를 실행한다:

```bash filename="Terminal"
node .next/standalone/server.js
```

> **알아두면 좋은 점**:
>
> - 프로젝트가 특정 포트나 호스트네임에서 수신 대기해야 하는 경우 `server.js` 실행 전에 `PORT` 또는 `HOSTNAME` 환경 변수를 지정한다. 예를 들어 `PORT=8080 HOSTNAME=0.0.0.0 node server.js` 명령은 서버를 `http://0.0.0.0:8080` 포트로 기동한다.

---

### 주의사항 (Caveats)

#### 1. 모노레포(Monorepo) 환경과 `outputFileTracingRoot`

모노레포 환경에서 `next build packages/web-app`을 실행하면 기본적으로 해당 프로젝트 디렉토리(`packages/web-app`)가 파일 추적의 루트 기준이 된다. 따라서 이 폴더 외부에 위치한 공통 패키지나 상위 파일은 추적 대상에서 누락될 수 있다.

상위 공통 의존성까지 추적에 포함하려면 `outputFileTracingRoot` 설정을 모노레포 루트 경로로 지정해야 한다:

```js filename="packages/web-app/next.config.js"
const path = require('path')

module.exports = {
  output: 'standalone',
  // 상위 2단계 위의 모노레포 루트 디렉토리를 추적 기준점으로 설정한다
  outputFileTracingRoot: path.join(__dirname, '../../'),
}
```

> **알아두면 좋은 점**:
> 모노레포에서 `프로젝트 루트(project root)`는 `next.config.js` 파일이 존재하는 특정 앱 디렉토리(예: `packages/web-app`)를 의미하며, 전체 모노레포 루트와 구분된다.

#### 2. 파일 추적 수동 포함 및 제외 (`outputFileTracingIncludes` / `outputFileTracingExcludes`)

특정 런타임 에셋이 동적 경로(`fs.readFile` 등)로 읽혀 정적 분석에서 누락되거나, 반대로 불필요한 대용량 파일이 추적에 잘못 포함되는 경우가 있다. 이때는 두 옵션을 사용하여 추적 범위를 직접 보정한다:

- **객체의 키**: [picomatch](https://www.npmjs.com/package/picomatch#basic-globbing) 문법으로 라우트 경로(예: `/api/hello`, `/products/*`, `'/*'`)와 매칭되는 라우트 글로브다.
- **객체의 값**: 프로젝트 루트를 기준으로 해석되는 파일 글로브 패턴 배열이다.

```js filename="next.config.js"
module.exports = {
  outputFileTracingExcludes: {
    '/api/hello': ['./un-necessary-folder/**/*'],
    '/api/*': ['src/temp/**/*', 'public/large-logs/**/*'],
  },
  outputFileTracingIncludes: {
    '/api/another': ['./necessary-folder/**/*'],
    '/api/login/\\[\\[\\.\\.\\.slug\\]\\]': [
      './node_modules/aws-crt/dist/bin/**/*',
    ],
    '/products/*': ['src/lib/payments/**/*'],
    '/*': ['src/config/runtime/**/*.json'],
  },
}
```

`src/` 디렉토리를 사용하는 프로젝트에서도 작성 규칙은 동일하다. 키는 항상 라우트 경로를 나타내며, 값은 프로젝트 루트를 기준으로 상대 해석되므로 `src/...` 경로를 지정하면 된다.

전역적으로 모든 라우트에 특정 런타임 리소스를 포함하고자 할 때는 `'/*'` 키를 사용하면 된다:

```js filename="next.config.js"
module.exports = {
  outputFileTracingIncludes: {
    '/*': ['src/i18n/locales/**/*.json'],
  },
}
```

#### 3. 적용 범위 및 모범 사례

- **서버 추적에만 적용**: 두 옵션은 Node.js 서버 추적에만 적용된다. Edge Runtime 라우트나 완전 정적 페이지에는 영향을 주지 않는다.
- **모노레포 결합**: 모노레포에서 앱 외부의 파일을 포함할 때는 `outputFileTracingRoot`와 `outputFileTracingIncludes`를 함께 사용한다:

```js filename="next.config.js"
const path = require('path')

module.exports = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  outputFileTracingIncludes: {
    '/route1': ['../shared/assets/**/*'],
  },
}
```

> **알아두면 좋은 점**:
>
> - 운영체제 간 호환성을 유지하도록 경로 패턴에는 항상 정방향 슬래시(`/`)를 사용하기를 권장한다.
> - 추적 아티팩트의 크기가 비대해지지 않도록 저장소 루트 수준의 와일드카드(`**/*`) 지정은 피하고 가능한 한 좁은 범위의 패턴을 지정해야 한다.

C++ 네이티브 바이너리 의존성(예: `sharp`, `aws-crt`)을 사용하는 경우 다음과 같은 공통 포함 패턴을 구성하면 된다:

```js filename="next.config.js"
module.exports = {
  outputFileTracingIncludes: {
    '/*': ['node_modules/sharp/**/*', 'node_modules/aws-crt/dist/bin/**/*'],
  },
}
```

---

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (빌드 산출물 구조 및 컨테이너 배포 모드를 제어하는 옵션임)
- `next.config.js`에 `output: 'standalone'`을 지정한 후 터미널에서 `next build`를 실행하여 `.next/standalone` 디렉토리가 생성되는지 확인한다.
- 생성된 `.next/standalone` 디렉토리 내에 프로젝트 소스, 의존성이 선별된 `node_modules`, 그리고 `server.js` 진입점이 정상 배치되었는지 파일 시스템을 검증한다.
- `public` 및 `.next/static` 폴더를 `standalone` 대상 경로로 복사한 후, 원본 디렉토리 외부 환경에서 `node .next/standalone/server.js` 명령만으로 서버가 정상 구동되는지 확인한다.

---

## 연습 문제

1. `next.config.js`에 `output: 'standalone'`을 설정하고 빌드한 후 생성된 `.next/standalone/server.js`를 프로덕션 환경에서 실행할 때 필수적으로 주의해야 하는 점은 무엇인가?
   - A. `next` CLI를 프로덕션 머신에 전역 설치해야만 `server.js`를 실행할 수 있다.
   - B. `public` 및 `.next/static` 폴더는 자동으로 복사되지 않으므로, 단일 서버에서 서빙하려면 해당 폴더들을 `standalone` 내부로 수동 복사해야 한다.
   - C. `server.js`는 오직 `PORT=3000`에서만 고정 수신 대기하며 포트 변경이 불가능하다.
   - D. `standalone` 모드는 Node.js 환경이 아닌 오직 Edge Runtime 서버에서만 실행 가능하다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `standalone` 모드는 정적 파일을 CDN을 통해 서빙하는 모범 사례를 전제로 하여 `public`과 `.next/static`을 자동 포함하지 않는다. 따라서 자체 단일 Node.js 서버에서 모든 정적 에셋까지 서빙하려면 빌드 후 해당 폴더들을 수동으로 복사해주어야 한다.
</details>

2. 모노레포 구조에서 하위 패키지 애플리케이션(`packages/web-app`)의 `output: 'standalone'` 빌드 시 공통 루트 패키지의 파일이 추적에서 누락되는 문제를 해결하기 위한 올바른 설정은 무엇인가?
   - A. `output: 'export'`로 설정을 변경하여 정적 HTML로 컴파일한다.
   - B. `distDir` 설정을 모노레포 루트 경로(`../../`)로 지정한다.
   - C. `outputFileTracingRoot` 옵션을 모노레포의 루트 디렉토리 절대 경로로 지정한다.
   - D. `transpilePackages`에 모든 공통 파일을 개별 파일 단위로 등록한다.

<details><summary>정답 보기</summary>

정답: **C**
해설: Next.js의 기본 파일 추적 범위는 `next.config.js`가 위치한 프로젝트 디렉토리로 제한된다. 모노레포 상위 폴더의 의존 파일까지 추적에 포함하려면 `outputFileTracingRoot`를 모노레포 루트 경로로 설정해야 한다.
</details>

---

## 챕터 요약

- `output: 'standalone'`은 `@vercel/nft`를 통해 런타임에 필요한 파일만을 선별하여 `.next/standalone`에 경량 배포 번들을 구성한다.
- 최소화된 독립 서버 `server.js`를 생성하여 전체 `node_modules` 없이도 가벼운 Docker 컨테이너 배포를 실현한다.
- CDN 배포 최적화를 위해 `public`과 `.next/static`은 기본 제외되므로, Node.js 단일 서버 운영 시에는 빌드 후 수동 복사가 필요하다.
- 모노레포에서는 `outputFileTracingRoot`를 통해 추적 기준점을 상위로 확장하고, `outputFileTracingIncludes`와 `outputFileTracingExcludes`로 라우트별 세부 파일을 제어한다.
