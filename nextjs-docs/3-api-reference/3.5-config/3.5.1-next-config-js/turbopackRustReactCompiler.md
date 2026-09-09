# turbopackRustReactCompiler

- 공식 문서: [turbopackRustReactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `experimental.turbopackRustReactCompiler`가 Turbopack 안에서 native Rust 버전의 React Compiler를 실행하는 방식을 이해한다.
- `reactCompiler` 활성화와 Rust 구현 선택이 서로 다른 설정임을 구분한다.
- Turbopack 전용이라는 제한과 `babel-plugin-react-compiler` 설치 조건을 파악한다.

## 핵심 개념 및 설명

`experimental.turbopackRustReactCompiler` 옵션은 native Rust 버전의 [React Compiler](./reactCompiler.md)를 활성화한다. 표준 Babel 버전은 Node.js에서 실행되지만 이 옵션은 React Compiler를 Turbopack 내부에서 native code로 직접 실행한다. 대체로 성능이 눈에 띄게 좋아진다.

이 옵션은 기본값이 되기 전에 피드백을 수집하려고 `experimental` 기능으로 공개됐다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler를 활성화한다
  reactCompiler: true,
  experimental: {
    // Babel transform 대신 Rust 포트를 사용한다
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
```

### Good to know (알아두면 좋은 점)

> **알아두면 좋은 점**:
>
> - 이 옵션을 사용하려면 [`reactCompiler`](./reactCompiler.md)를 활성화해야 한다. 이 옵션은 실행할 구현만 선택하며 React Compiler 자체를 활성화하지 않는다.
> - 이 옵션은 Turbopack에서만 지원한다. webpack에서 사용하면 오류가 발생한다.
> - 활성화하면 `babel-plugin-react-compiler`를 설치할 필요가 없다. Rust compiler가 Turbopack 내부에서 native 방식으로 실행된다.

React Compiler를 사용하는 자세한 방법은 [`reactCompiler` 옵션 문서](./reactCompiler.md)에서 확인한다.

### Version History (버전 기록)

| 버전 | 변경 사항 |
| --- | --- |
| `v16.3.0` | native Rust React Compiler를 사용하는 `experimental.turbopackRustReactCompiler` 옵션을 도입했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- Rust compiler 선택은 Turbopack의 빌드와 개발 서버 내부에서 실행된다. 배포된 브라우저 화면만으로는 Babel 구현과의 차이를 직접 관찰하기 어렵다.
- 로컬 환경에서 `reactCompiler: true`와 `experimental.turbopackRustReactCompiler: true`를 함께 설정하고 같은 컴포넌트를 webpack과 Turbopack으로 빌드해 성능과 오류를 비교하는 실험을 설계할 수 있다.

## 연습 문제

1. `experimental.turbopackRustReactCompiler`를 사용할 때 필요한 설정은?
   - A. `reactCompiler: true`
   - B. `typescript.ignoreBuildErrors: true`
   - C. `experimental.urlImports`

<details><summary>정답 보기</summary>

정답: **A**<br>해설: `turbopackRustReactCompiler`는 React Compiler의 구현만 선택하므로 `reactCompiler: true`를 별도로 설정해야 한다.
</details>

2. 이 옵션을 webpack에서 사용하면 어떻게 되는가?
   - A. Babel 버전으로 자동 전환한다.
   - B. 옵션을 무시하고 빌드를 계속한다.
   - C. 오류가 발생한다.

<details><summary>정답 보기</summary>

정답: **C**<br>해설: 이 옵션은 Turbopack에서만 지원되며 webpack에서 사용하면 오류가 발생한다.
</details>

## 챕터 요약

- `experimental.turbopackRustReactCompiler`는 Turbopack 내부에서 native Rust React Compiler를 실행한다.
- `reactCompiler: true`가 있어야 하며 구현을 선택하는 이 옵션만으로는 compiler가 활성화되지 않는다.
- Turbopack에서만 지원하고 webpack에서는 오류가 발생한다.
- 활성화하면 `babel-plugin-react-compiler`를 설치하지 않아도 된다.
- `v16.3.0`에 `experimental` 기능으로 도입됐고 production 사용에는 권장하지 않는다.
