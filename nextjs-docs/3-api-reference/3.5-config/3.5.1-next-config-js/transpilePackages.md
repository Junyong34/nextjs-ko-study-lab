# transpilePackages

- 공식 문서: [transpilePackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `transpilePackages`의 역할과, `node_modules`나 로컬 패키지를 자동으로 트랜스파일(transpilation)하는 동작 원리를 이해한다.
- 모노레포(Monorepo) 환경, 그리고 최신 문법(TypeScript, JSX)을 쓰는 외부 라이브러리를 연동할 때의 설정 방법을 파악한다.
- `serverExternalPackages`와 충돌할 때의 규칙, App Router와 Turbopack이 자동으로 처리하는 범위를 설명할 수 있다.

## 핵심 개념 및 설명

`transpilePackages`는 Next.js가 로컬 패키지(예: 모노레포 워크스페이스)나 외부 의존성(`node_modules`)을 자동으로 트랜스파일하고 번들링하도록 지정하는 옵션이다. 과거 Next.js 프로젝트에서 주로 쓰던 커뮤니티 플러그인 `next-transpile-modules` 패키지를 완전히 대체한다.

Next.js의 기본 SWC 컴파일 파이프라인은 성능을 최적화하려고 기본적으로 `node_modules` 내부의 코드 트랜스파일을 건너뛴다. 하지만 최신 JavaScript 문법, JSX, TypeScript 소스를 직접 배포하는 라이브러리나 모노레포 내부의 공유 패키지를 사용할 때는 해당 패키지를 트랜스파일 대상에 명시적으로 포함해야 한다.

### 기본 설정 구조

`transpilePackages`는 `next.config.js`, `next.config.mjs`, `next.config.ts`의 최상위 설정 객체에 패키지 이름 문자열 배열로 지정한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['package-name', '@scope/pkg'],
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['package-name', '@scope/pkg'],
}

export default nextConfig
```

### 옵션 명세

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `transpilePackages` | `string[]` | `[]` | Next.js 컴파일러가 트랜스파일하고 번들링할 패키지 이름 목록. 글로브 패턴이나 상대 파일 경로는 지원하지 않는다. |

### When you need it

Next.js는 애플리케이션 소스 코드의 최신 JavaScript와 TypeScript를 기본적으로 컴파일한다. 하지만 다음 상황에서는 `transpilePackages`를 명시적으로 설정해야 한다:

1. **트랜스파일되지 않은 외부 라이브러리 연동**: `node_modules` 내부의 서드파티 패키지가 트랜스파일되지 않은 최신 ECMAScript 문법이나 TypeScript 소스, 원시 JSX를 그대로 제공해서 타깃 브라우저 환경이나 런타임 호환 때문에 컴파일이 필요한 경우.
2. **모노레포 환경의 Pages Router (Webpack)**: Turborepo, pnpm workspaces, npm/Yarn workspaces 환경에서 Pages Router와 Webpack을 사용할 때, 의존 패키지가 애플리케이션 루트 디렉토리 밖에 있는 경우.
3. **Pages Router의 서버 의존성 번들링**: Pages Router 환경에서 서버 의존 패키지를 런타임에 `require`하지 않고 라우트 번들 내부에 직접 인라인으로 번들링하려는 경우.

> **알아두면 좋은 점**:
>
> - **Turbopack 자동 트랜스파일**: 번들러로 Turbopack을 쓰면 App Router와 Pages Router 모두에서 워크스페이스 로컬 패키지를 자동으로 트랜스파일하므로 따로 설정할 필요가 없다.
> - **App Router Webpack 자동 트랜스파일**: Webpack 번들러를 사용하더라도 App Router 환경에서는 워크스페이스 로컬 패키지를 자동으로 트랜스파일한다.
> - **`serverExternalPackages`와의 상호 배타성**: 한 패키지를 `transpilePackages`와 `serverExternalPackages`에 동시에 등록할 수 없다. 같은 패키지가 양쪽에 모두 있으면 Next.js는 빌드를 시작할 때 즉시 오류를 낸다.
> - **자동 처리 패키지**: `optimizePackageImports`에 지정한 패키지와 Next.js 내부 기본 트랜스파일 목록(`default-transpiled-packages.json`)에 든 라이브러리는 개발자가 직접 지정하지 않아도 트랜스파일 파이프라인에 자동으로 포함된다.
> - **패키지 이름 지정 형식**: 배열 요소는 정확한 npm 패키지 이름이어야 한다. `my-pkg/*`와 같은 와일드카드 패턴이나 `../packages/my-pkg`와 같은 상대 경로는 허용되지 않는다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `transpilePackages` 옵션 공식 도입 (`next-transpile-modules` 대체) |

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정 (모노레포 로컬 패키지와 트랜스파일 대상 외부 라이브러리 임포트 동작 검증)
- 모노레포 환경에서 별도의 빌드 단계(dist 배포) 없이 원시 TypeScript/JSX 컴포넌트를 노출하는 `@workspace/ui` 로컬 패키지를 구성한다.
- `next.config.ts`에 `transpilePackages: ['@workspace/ui']`를 등록하고 Webpack/Turbopack 빌드 과정에서 SWC 변환이 제대로 적용되는지 확인한다.
- 옵션을 빠뜨렸을 때 발생하는 파싱 오류(`SyntaxError: Unexpected token '<'`)와 설정을 추가한 뒤 정상 렌더링되는 결과를 대조 검증한다.

## 연습 문제

1. `transpilePackages`에 전달하는 패키지 지정 형식에 대한 설명으로 옳은 것은?
   - A. `transpilePackages: ['@workspace/*']`와 같이 와일드카드 글로브 패턴을 사용할 수 있다.
   - B. `transpilePackages: ['../packages/shared-ui']`와 같이 상대 경로를 지정해야 한다.
   - C. 정확한 패키지 이름 문자열 배열(예: `['package-name', '@scope/pkg']`)로 지정해야 하며 글로브나 경로는 지원하지 않는다.
   - D. 패키지 내 특정 엔트리 파일의 절대 경로를 전달해야 한다.

<details><summary>정답 보기</summary>

정답: **C**  
해설: `transpilePackages`는 패키지 이름의 정확한 문자열 목록만 인자로 받으며, 와일드카드 글로브 패턴이나 상대/절대 디렉토리 경로는 지원하지 않는다.
</details>

2. `transpilePackages`와 `serverExternalPackages` 옵션의 상호작용에 대한 설명으로 옳은 것은?
   - A. 동일한 패키지를 양쪽 모두에 지정하면 클라이언트와 서버 양쪽에서 독립적으로 최적화된다.
   - B. 동일한 패키지를 양쪽에 동시에 지정하면 Next.js 빌드 시작 시 충돌 오류가 발생한다.
   - C. `serverExternalPackages` 설정이 항상 `transpilePackages` 설정을 자동으로 덮어쓴다.
   - D. App Router 환경에서는 두 옵션의 충돌을 자동으로 무시한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 한 패키지를 번들링 파이프라인에 포함하는 `transpilePackages`와 번들링에서 제외하여 Node.js 런타임에 직접 require하도록 하는 `serverExternalPackages`는 상호 배타적이다. 동일 패키지가 양쪽에 모두 존재하면 빌드 시작 시 즉시 오류가 발생한다.
</details>

## 챕터 요약

- `transpilePackages`는 로컬 워크스페이스 패키지나 `node_modules` 내부의 라이브러리를 SWC 컴파일러 파이프라인에 포함해 자동 트랜스파일한다.
- 기존 외부 커뮤니티 플러그인이던 `next-transpile-modules`를 프레임워크 내장 옵션으로 완전히 대체했다.
- 패키지명은 정확한 문자열 배열로 작성해야 하며 글로브 패턴이나 상대 경로는 지원하지 않는다.
- `serverExternalPackages`와 동일한 패키지를 중복 지정할 수 없으며 충돌하면 빌드 에러가 발생한다.
- Turbopack 환경과 App Router Webpack 환경에서는 모노레포 로컬 패키지가 상당 부분 자동 트랜스파일된다.
