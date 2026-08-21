# ESLint

- 공식 문서: [ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- 상위 메뉴: [Configuration](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js의 공식 린트 패키지인 `eslint-config-next`와 Flat Config(`eslint.config.mjs`) 설정 방식을 이해한다.
- `eslint-config-next/core-web-vitals` 프리셋을 통해 성능 및 SEO 관련 규칙을 엄격하게 적용한다.
- `next/image`, `Link`, Client Component 등 Next.js 전용 린트 규칙(`@next/eslint-plugin-next`)의 종류와 목적을 파악한다.
- Next.js 16의 `next lint` 제거 변경 사항과 표준 ESLint CLI 연동 패턴을 익힌다.

## 핵심 개념 및 설명

Next.js는 React, React Hooks, Core Web Vitals, Next.js 전용 규칙을 통합한 공식 린트 구성인 [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next)를 제공한다.

최신 ESLint의 Flat Config 포맷(`eslint.config.mjs`)을 기반으로 구성된다.

### 제공 구성 프리셋

1. **`eslint-config-next`**: Next.js, React, React Hooks 권장 규칙이 포함된 기본 설정.
2. **`eslint-config-next/core-web-vitals`**: Core Web Vitals 지표(LCP, CLS 등)에 부정적 영향을 주는 코드를 경고(warn)에서 오류(error)로 격상시키는 권장 설정.
3. **`eslint-config-next/typescript`**: TypeScript 프로젝트를 위한 `typescript-eslint` 규칙 추가.

### 설정 방법 (`eslint.config.mjs`)

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

린트 실행은 표준 ESLint CLI를 사용한다:

```bash filename="eslint.config.mjs"
npx eslint .
```

> **Next.js 16 변경점**:
> 
> Next.js 16부터 `next lint` CLI 명령과 `next.config.js`의 `eslint` 옵션이 완전히 제거되었다. 프로젝트에서는 표준 `eslint` CLI(`npx eslint .`)를 직접 호출하거나 `package.json` 스크립트로 구성해야 한다.

### 주요 Next.js 린트 규칙 (`@next/eslint-plugin-next`)

| 규칙명 | 설명 |
|---|---|
| `@next/next/no-img-element` | `<img>` 태그 사용을 방지하고 LCP 최적화된 [`Image`](../3.2-components/image.md) 컴포넌트 사용을 강제함 |
| `@next/next/no-html-link-for-pages` | 내부 라우트 이동 시 `<a>` 태그 대신 [`Link`](../3.2-components/link.md) 컴포넌트 사용을 권장함 |
| `@next/next/no-async-client-component` | Client Component(`'use client'`)가 `async` 함수로 작성되는 실수를 차단함 |
| `@next/next/no-sync-scripts` | 렌더링을 차단하는 동기 `<script>` 태그 대신 [`Script`](../3.2-components/script.md) 사용을 강제함 |
| `@next/next/google-font-display` | Google Fonts 로드 시 `display: swap` 적용 여부를 검사함 |

### Prettier 및 lint-staged 연동

코드 포맷터인 Prettier와 충돌을 방지하기 위해 `eslint-config-prettier`를 적용한다:

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
```

Git 커밋 전 스테이징된 파일에만 린트를 적용하려면 `.lintstagedrc.js`를 사용한다:

```js filename=".lintstagedrc.js"
const path = require('path')

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | `next lint` CLI 및 `next.config.js`의 `eslint` 옵션 제거 (표준 ESLint CLI 전환) |
| `v12.0.0` | `eslint-config-next/core-web-vitals` 도입 |
| `v11.0.0` | Next.js ESLint 공식 통합 도입 |

## 예제 및 데모 설계

- Next.js 페이지 내부에서 `<img>` 태그를 작성했을 때 `@next/next/no-img-element` 린트 경고/에러가 발생하는지 확인한다.
- Client Component에 `async function Component()`를 선언했을 때 `@next/next/no-async-client-component` 에러가 감지되는지 검증한다.
- `npx eslint .` 실행을 통해 프로젝트 전체 코드 품질을 검사하는 CI 워크플로우를 구성한다.

## 연습 문제

1. Next.js 16 버전에서 변경된 ESLint 실행 방식으로 올바른 것은?
   - A. `next lint` 명령어가 더 고속화되어 필수화되었다.
   - B. `next lint` CLI가 제거되었으며 표준 `eslint` CLI(`npx eslint .`)를 사용해야 한다.
   - C. ESLint 지원이 완전히 중단되었다.
   - D. `next.config.js`의 `eslint: { enabled: true }` 설정이 필수가 되었다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 16부터 프레임워크 자체의 `next lint` 명령어가 제거되고 표준 생태계의 ESLint CLI를 직접 실행하는 방식으로 전환되었다.
</details>

2. `eslint-config-next/core-web-vitals` 프리셋이 기본 `eslint-config-next`와 구별되는 주요 특징은?
   - A. TypeScript 파일만 검사한다.
   - B. 성능 및 Core Web Vitals 지표에 영향을 미치는 규칙들의 심각도를 경고(warning)에서 오류(error)로 격상시킨다.
   - C. HTML 문법 검사만 수행한다.
   - D. Prettier 기능을 내장하여 모든 포맷팅을 자동으로 수행한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `core-web-vitals` 프리셋은 LCP, CLS 등 웹 성능에 직접적인 악영향을 주는 코드 패턴(예: `<img>` 남용)을 오류로 격상시켜 빌드 및 품질을 엄격히 관리한다.
</details>

## 챕터 요약

- `eslint-config-next`는 Next.js에 최적화된 ESLint 룰셋을 제공한다.
- `core-web-vitals` 프리셋으로 성능 저해 요소를 엄격하게 차단한다.
- `no-img-element`, `no-html-link-for-pages` 등 프레임워크 전용 린트 룰을 제공한다.
- Next.js 16부터 `next lint`가 제거되어 표준 ESLint CLI(`eslint .`)를 사용한다.
- Flat Config(`eslint.config.mjs`)와 Prettier 연동을 지원한다.
