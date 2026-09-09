# reactCompiler

- 공식 문서: [reactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- React Compiler가 컴포넌트 렌더링을 자동으로 최적화하는 목적을 이해한다.
- Next.js의 SWC 최적화가 관련 파일에만 React Compiler를 적용해 빌드 비용을 줄이는 방식을 파악한다.
- `reactCompiler: true`와 `compilationMode: 'annotation'`의 차이, `use memo`와 `use no memo` 지시어를 익힌다.

## 핵심 개념 및 설명

Next.js는 [React Compiler](https://react.dev/learn/react-compiler/introduction)를 지원한다. React Compiler는 컴포넌트 렌더링을 자동으로 최적화해 성능을 높이도록 설계된 도구다. 이 기능을 사용하면 `useMemo`와 `useCallback`으로 직접 메모이제이션해야 하는 경우가 줄어든다.

Next.js에는 SWC로 작성한 자체 성능 최적화가 들어 있어 React Compiler를 더 효율적으로 실행한다. Next.js는 모든 파일에서 컴파일러를 실행하지 않고 프로젝트를 분석한 뒤 관련 파일에만 React Compiler를 적용한다. Babel 플러그인만 사용하는 경우보다 불필요한 작업이 줄고 빌드가 빨라진다.

### How It Works (동작 방식)

React Compiler는 Babel 플러그인으로 실행된다. Next.js는 빌드를 빠르게 유지하려고 SWC 최적화로 JSX나 React Hooks가 있는 관련 파일에만 React Compiler를 적용한다.

모든 파일을 컴파일하지 않으므로 성능 비용은 작고 국소적인 범위에 머문다. 기본 Rust 기반 컴파일러를 사용할 때보다 빌드가 약간 느려질 수 있지만 영향은 작고 관련된 파일에 한정된다.

사용하려면 `babel-plugin-react-compiler`를 설치한다.

```bash package="pnpm"
pnpm add -D babel-plugin-react-compiler
```

```bash package="npm"
npm install -D babel-plugin-react-compiler
```

```bash package="yarn"
yarn add -D babel-plugin-react-compiler
```

```bash package="bun"
bun add -D babel-plugin-react-compiler
```

그다음 `next.config.js`에 `reactCompiler` 옵션을 추가한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

### Annotations (주석)

다음과 같이 컴파일러를 `opt-in` 모드로 구성할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
}

export default nextConfig
```

그다음 특정 컴포넌트나 훅에 React의 `"use memo"` 지시어를 붙여 opt-in할 수 있다.

```ts filename="app/page.tsx"
export default function Page() {
  'use memo'
  // ...
}
```

> **참고**: React의 `"use no memo"` 지시어로는 반대 동작을 선택할 수 있다. 특정 컴포넌트나 훅을 opt-out할 때 쓴다.

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- 동일한 입력을 렌더링하는 컴포넌트를 준비하고 `reactCompiler: true`와 기본 설정의 빌드 결과를 비교한다.
- 브라우저에서는 반복 렌더링 횟수와 상호작용 응답 시간을 관찰하고 터미널에서는 관련 파일만 컴파일되는지, 빌드 시간이 어떻게 변하는지 함께 기록한다.
- `compilationMode: 'annotation'`을 사용한 뒤 `use memo`를 붙인 컴포넌트와 붙이지 않은 컴포넌트의 빌드 결과와 렌더링이 어떻게 다른지 확인한다.

## 연습 문제

1. Next.js가 React Compiler의 빌드 비용을 줄이는 방식으로 옳은 것은?
   - A. 프로젝트의 모든 파일을 항상 React Compiler로 컴파일한다.
   - B. SWC로 프로젝트를 분석하고 JSX나 React Hooks가 있는 관련 파일에만 적용한다.
   - C. React Compiler를 브라우저에서만 실행하고 빌드에서는 실행하지 않는다.
   - D. Babel 플러그인을 제거하고 TypeScript 컴파일러로만 대체한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js는 SWC 최적화로 관련 파일을 선별해 React Compiler를 적용하므로 모든 파일을 컴파일하는 작업을 피한다.
</details>

2. `compilationMode: 'annotation'`을 사용할 때 특정 컴포넌트나 훅을 opt-in하는 지시어는 무엇인가?
   - A. `'use client'`
   - B. `'use server'`
   - C. `'use memo'`
   - D. `'use no memo'`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `"use memo"` 지시어를 특정 컴포넌트나 훅에 추가하면 해당 대상을 opt-in할 수 있다. `"use no memo"`는 반대인 opt-out에 사용한다.
</details>

## 챕터 요약

- React Compiler는 컴포넌트 렌더링을 자동으로 최적화해 수동 `useMemo`와 `useCallback` 사용을 줄인다.
- Next.js는 SWC로 관련 파일을 선별해 React Compiler를 적용한다.
- `babel-plugin-react-compiler`를 설치한 뒤 `reactCompiler: true`를 설정한다.
- `compilationMode: 'annotation'`에서는 `use memo` 지시어가 있는 컴포넌트나 훅만 opt-in한다.
- `use no memo` 지시어로 특정 컴포넌트나 훅을 opt-out할 수 있다.
