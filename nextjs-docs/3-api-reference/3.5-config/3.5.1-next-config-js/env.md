# env

- 공식 문서: [env](https://nextjs.org/docs/app/api-reference/config/next-config-js/env)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Legacy**: 이 API는 legacy이며 더 이상 권장하지 않는다. 하위 호환성을 위해 계속 지원된다.

## 학습 목표

- `next.config.js`의 `env` 설정이 빌드 시점에 환경 변수를 클라이언트 JavaScript 번들에 인라인으로 주입하는 방식을 이해한다.
- webpack DefinePlugin 기반의 문자열 치환 메커니즘과, 객체 비구조화 할당(Destructuring)을 쓸 때의 한계점을 파악한다.
- `env` 설정과 최신 `.env` 파일 관리 방식(`NEXT_PUBLIC_` 접두사)의 차이점과 보안 주의사항을 설명할 수 있다.

## 핵심 개념 및 설명

`next.config.js`의 `env` 속성을 사용하면 빌드 시점에 특정 환경 변수 값을 애플리케이션의 JavaScript 번들에 직접 주입할 수 있다.

> **레거시 API 안내**:
> 이 방식은 하위 호환성을 위해 계속 지원되는 레거시 API이며 최신 Next.js에서는 사용을 권장하지 않는다. Next.js 9.4 이후부터는 더욱 직관적이고 표준적인 [.env 환경 변수 가이드](../../../2-guides/environment-variables.md) 방식을 제공하므로 해당 방식을 먼저 고려한다.

> **알아두면 좋은 점**:
>
> - `next.config.js`의 `env` 속성으로 지정한 모든 환경 변수는 이름 앞의 `NEXT_PUBLIC_` 접두사 유무와 무관하게 **항상** 클라이언트 측 JavaScript 번들에 인라인으로 포함된다.
> - 따라서 데이터베이스 암호, API 시크릿 키와 같은 민감한 비밀 정보를 이 속성에 절대 설정해서는 안 된다. `NEXT_PUBLIC_` 접두사는 `.env` 파일이나 시스템 환경 변수로 값을 주입할 때만 클라이언트 노출 여부를 제어하는 효력이 있다.

---

### 기본 설정 구조

환경 변수를 JavaScript 번들에 등록하려면 `next.config.js`에 `env` 설정을 추가한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    customKey: 'my-value',
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    customKey: 'my-value',
  },
}

export default nextConfig
```

설정 후 애플리케이션 코드 내부에서 일반적인 Node.js 환경 변수 문법(`process.env.customKey`)으로 값에 접근할 수 있다:

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>customKey의 값: {process.env.customKey}</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1>customKey의 값: {process.env.customKey}</h1>
}
```

---

### 빌드 시점 텍스트 치환 원리

Next.js는 빌드 과정에서 번들러의 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 메커니즘을 사용해 `process.env.customKey`라는 식별자 호출부를 설정에 정의한 문자열 리터럴 값 `'my-value'`로 직접 텍스트 치환한다.

예를 들어 개발자가 작성한 다음 코드는:

```jsx
return <h1>customKey의 값: {process.env.customKey}</h1>
```

빌드가 완료되면 번들 파일 안에서 다음과 같이 완전히 치환된 정적 문자열 코드로 변환된다:

```jsx
return <h1>customKey의 값: {'my-value'}</h1>
```

#### 비구조화 할당(Destructuring) 사용 불가 주의사항

DefinePlugin은 소스 코드의 AST(추상 구문 트리)에서 `process.env.KEY` 형태의 완전한 식별자 참조만 탐색해 치환한다. 따라서 다음과 같이 `process.env` 객체를 비구조화 할당(Destructuring)하는 문법은 정상 동작하지 않는다:

```ts
// ❌ 비구조화 할당은 동작하지 않는다 (undefined 반환)
const { customKey } = process.env

// ⭕ 항상 완전한 전체 식별자 참조 경로로 접근해야 한다
const customKey = process.env.customKey
```

---

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (클라이언트 번들에 인라인 주입된 환경 변수 화면 표시 및 보안 분기 확인 가능)
- `next.config.js`의 `env` 객체에 정의한 테스트 키(`customKey: 'build-time-inlined'`)가 Client Component 렌더링 결과로 브라우저 화면에 정상 출력되는지 확인한다.
- 브라우저 개발자 도구의 Sources/Network 탭에서 다운로드된 클라이언트 JavaScript 번들 청크를 검색한다. `process.env.customKey`라는 런타임 변수 참조 대신 `'build-time-inlined'`라는 원시 문자열 리터럴이 직접 인라인 하드코딩되어 있는지 검증한다.
- `const { customKey } = process.env` 비구조화 할당을 시도할 경우 `undefined`가 렌더링되어 빌드 타임 DefinePlugin 치환이 누락되는 현상을 대조 확인한다.

---

## 연습 문제

1. `next.config.js`의 `env` 옵션에 정의된 환경 변수의 동작 특성으로 올바른 것은 무엇인가?
   - A. `NEXT_PUBLIC_` 접두사가 없는 변수는 자동으로 서버 측 번들에만 격리된다.
   - B. 브라우저가 실행되는 런타임 시점에 서버에 요청을 보내 동적으로 최신 값을 읽어온다.
   - C. 접두사와 무관하게 빌드 시점에 번들러에 의해 모든 값이 클라이언트 JavaScript 번들에 인라인 텍스트로 치환된다.
   - D. `process.env`를 비구조화 할당(`const { key } = process.env`)해도 완벽하게 치환된다.

<details><summary>정답 보기</summary>

정답: **C**
해설: `next.config.js`의 `env`에 등록된 변수는 DefinePlugin을 통해 빌드 시점에 클라이언트 번들 내의 모든 `process.env.KEY` 식별자를 해당 문자열 리터럴로 직접 치환하므로, 접두사와 관계없이 모든 값이 클라이언트 번들에 노출된다.
</details>

2. 다음 중 `next.config.js`의 `env`에 선언된 `appVersion: '1.0.0'` 환경 변수를 안전하고 올바르게 참조하는 코드는 무엇인가?
   - A. `const { appVersion } = process.env`
   - B. `const version = process.env['appVersion']` (일부 번들러 환경에서 치환 실패 가능)
   - C. `const version = process.env.appVersion`
   - D. `const envObj = process.env; const version = envObj.appVersion`

<details><summary>정답 보기</summary>

정답: **C**
해설: DefinePlugin은 코드 내에서 `process.env.appVersion` 형태의 정적 점 표기법 식별자를 검색하여 값으로 치환한다. 비구조화 할당이나 객체 변수 재할당은 정적 식별자 매칭이 불가능하여 올바르게 치환되지 않는다.
</details>

---

## 챕터 요약

- `next.config.js`의 `env`는 빌드 시점에 환경 변수를 클라이언트 번들에 직접 주입하는 레거시 설정 옵션이다.
- 번들러의 DefinePlugin 치환 방식을 사용하므로 `process.env.key` 형태의 정적 전체 식별자로 접근해야 하며 비구조화 할당은 지원되지 않는다.
- 등록된 모든 변수가 클라이언트 JavaScript 소스에 원시 문자열로 영구 포함되므로 비밀 키나 토큰 같은 민감한 자격 증명을 절대 저장해서는 안 된다.
- 최신 Next.js 프로젝트에서는 이 레거시 옵션 대신 표준 `.env` 파일과 `NEXT_PUBLIC_` 접두사 규칙으로 환경 변수를 관리하기를 권장한다.
