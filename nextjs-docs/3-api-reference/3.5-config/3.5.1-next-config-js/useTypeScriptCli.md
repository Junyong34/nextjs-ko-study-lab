# useTypeScriptCli

- 공식 문서: [useTypeScriptCli](https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `experimental.useTypeScriptCli`가 `next build`의 TypeScript 검사 경로를 어떻게 선택하는지 이해한다.
- project-local `tsc`, TypeScript JavaScript compiler API, TypeScript 6과 TypeScript 7의 관계를 파악한다.
- 기본 CLI checker를 끄는 설정과 TypeScript 7에서 발생하는 제한을 설명할 수 있다.
- `tsconfig`, `next-env.d.ts`, route types, `--debug-build-paths`가 CLI checker 동작에 미치는 영향을 구분한다.

## 핵심 개념 및 설명

기본적으로 `next build`는 TypeScript JavaScript compiler API를 불러오는 대신 project-local `tsc` 명령을 실행한다. 이렇게 하면 TypeScript 6을 지원하고, TypeScript 7의 JavaScript API를 사용할 수 없는 동안에도 TypeScript 7을 쓸 수 있다.

프로젝트에 TypeScript 7을 설치하려면 다음 명령을 실행한다.

```bash
pnpm add -D typescript@^7
```

CLI checker는 기본적으로 켜져 있다. TypeScript JavaScript compiler API를 사용하려면 `experimental.useTypeScriptCli`를 `false`로 설정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
}

export default nextConfig
```

TypeScript 7을 사용하면서 CLI checker를 끄면 TypeScript JavaScript compiler API를 사용할 수 없으므로 `next build`가 종료된다.

### 동작

- Next.js는 checker를 실행하기 전에 `next-env.d.ts`와 route types를 계속 생성하고 권장 `tsconfig` 설정을 적용한다.
- TypeScript 진단은 `tsc`가 직접 출력한다. Next.js 전용 code frame과 오류 재작성은 적용하지 않는다.
- 설정한 `tsconfig` 파일이 선택한 프로젝트 전체를 검사하며, test files와 설정에 포함된 `.next/dev/types`도 함께 검사한다. [`--debug-build-paths`](../../3.6-cli/next.md#next-build-옵션)는 검사 대상을 제한하지 않으며 CLI checker와 함께 사용하면 warning을 출력한다.
- [`typescript.tsconfigPath`](../typescript.md)는 `tsc`에 전달할 프로젝트를 선택한다.
- [`typescript.ignoreBuildErrors`](../typescript.md)는 CLI checker를 포함한 type-checking 단계를 건너뛴다.

자세한 내용은 [TypeScript 7과 Next.js 사용법](../typescript.md)을 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 이 옵션의 차이는 브라우저 화면보다 `next build`가 출력하는 TypeScript 진단과 종료 결과에서 확인할 수 있다.
- 검증용 프로젝트에서 TypeScript 7을 설치하고 기본값인 CLI checker로 `next build`를 실행한다. 이어서 `experimental.useTypeScriptCli: false`로 바꿔 같은 명령을 실행하면 TypeScript JavaScript compiler API를 찾지 못해 종료되는데, 이 결과를 앞의 결과와 비교한다.
- `--debug-build-paths`를 함께 사용해도 CLI checker가 전체 `tsconfig` 프로젝트를 검사하고 warning을 출력하는지 터미널에서 확인한다.

## 연습 문제

1. `experimental.useTypeScriptCli`를 설정하지 않았을 때 `next build`의 기본 동작은 무엇인가?
   - A. TypeScript 검사를 실행하지 않는다.
   - B. project-local `tsc` 명령을 실행한다.
   - C. 브라우저에서 `tsc`를 실행한다.
   - D. 항상 TypeScript JavaScript compiler API만 사용한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: CLI checker가 기본적으로 활성화되어 `next build`는 project-local `tsc` 명령을 실행한다.
</details>

2. TypeScript 7을 사용하는 프로젝트에서 `experimental.useTypeScriptCli: false`를 설정하면 어떤 결과가 발생하는가?
   - A. `next build`가 TypeScript JavaScript compiler API를 사용할 수 없어 종료된다.
   - B. TypeScript 7이 자동으로 TypeScript 6으로 바뀐다.
   - C. `next build`가 type-checking을 두 번 실행한다.
   - D. 모든 test files가 자동으로 삭제된다.

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: TypeScript 7에서는 TypeScript JavaScript compiler API를 사용할 수 없으므로 CLI checker를 끄면 `next build`가 종료된다.
</details>

3. `--debug-build-paths`와 CLI checker를 함께 사용했을 때의 설명으로 올바른 것은 무엇인가?
   - A. CLI checker가 지정한 경로만 검사한다.
   - B. CLI checker가 검사 대상을 제한하지 않고 warning을 출력한다.
   - C. TypeScript 검사가 자동으로 비활성화된다.
   - D. `tsconfig` 파일이 무시된다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `--debug-build-paths`는 CLI checker가 검사하는 전체 프로젝트를 제한하지 않으며 함께 사용하면 warning을 출력한다.
</details>

## 챕터 요약

- 기본적으로 `next build`는 TypeScript JavaScript compiler API 대신 project-local `tsc`를 실행한다.
- 이렇게 하면 TypeScript 6을 지원하고, JavaScript API를 사용할 수 없는 TypeScript 7도 쓸 수 있다.
- `experimental.useTypeScriptCli: false`를 설정하면 TypeScript JavaScript compiler API를 사용한다.
- Next.js는 checker 실행 전에 `next-env.d.ts`, route types, 권장 `tsconfig` 설정을 준비한다.
- CLI checker는 전체 `tsconfig` 프로젝트를 검사하며 `--debug-build-paths`로 검사 범위를 줄일 수 없다.
