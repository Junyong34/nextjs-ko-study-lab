# typescript

- 공식 문서: [typescript](https://nextjs.org/docs/app/api-reference/config/next-config-js/typescript)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `typescript` 옵션으로 production build의 TypeScript 오류 검사 동작을 설정하는 방법을 익힌다.
- `ignoreBuildErrors`가 오류를 숨기는 방식이 아니라 내장 type checking을 완전히 건너뛰는 설정이라는 점을 이해한다.
- `tsconfigPath`로 build와 tooling에 사용할 TypeScript configuration file을 바꾸는 방법을 익힌다.

## 핵심 개념 및 설명

`next.config.js`의 `typescript` 옵션으로 Next.js의 TypeScript 동작을 설정한다.

```js filename="next.config.js"
module.exports = {
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },
}
```

### 옵션 (Options)

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `ignoreBuildErrors` | `boolean` | `false` | TypeScript 오류가 있어도 production build를 완료하도록 허용한다. |
| `tsconfigPath` | `string` | `'tsconfig.json'` | 사용자 지정 `tsconfig.json` 파일의 경로다. |

### `ignoreBuildErrors`

프로젝트에 TypeScript 오류가 있으면 Next.js는 **production build**인 `next build`를 실패시킨다.

애플리케이션에 오류가 있어도 위험을 무릅쓰고 production code를 생성하려면 내장 type checking 단계를 비활성화할 수 있다.

이 설정은 TypeScript를 실행한 뒤 오류만 숨기는 것이 아니다. TypeScript type checking 단계를 완전히 건너뛴다.

이 설정을 비활성화했다면 build 또는 deploy 과정에서 type check를 직접 실행해야 한다. 그렇지 않으면 위험할 수 있다.

```js filename="next.config.js"
module.exports = {
  typescript: {
    // !! 경고 !!
    // 프로젝트에 type error가 있어도 production build가 성공하도록 허용한다.
    // !! 경고 !!
    ignoreBuildErrors: true,
  },
}
```

### `tsconfigPath`

build 또는 tooling에 다른 TypeScript configuration file을 사용할 수 있다.

```js filename="next.config.js"
module.exports = {
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
}
```

자세한 내용은 [TypeScript 설정](../typescript.md)에서 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- `typescript` 옵션은 production build와 tooling의 검사 동작을 바꾼다. 배포된 브라우저 화면에서는 그 설정 자체를 확인할 수 없다.
- 로컬 실습에서는 의도적인 TypeScript 오류를 만든 뒤 `ignoreBuildErrors: false`와 `true`에서 `next build` 결과를 비교할 수 있다.
- `tsconfigPath: 'tsconfig.build.json'`을 설정하고 서로 다른 compiler 옵션을 넣어 build가 어떤 설정 파일을 읽는지 확인하는 실험을 설계할 수 있다.

## 연습 문제

1. `ignoreBuildErrors: true`를 설정하면 Next.js는 어떻게 동작하는가?
   - A. TypeScript를 실행하고 오류를 경고로만 바꾼다.
   - B. TypeScript type checking 단계를 완전히 건너뛴다.
   - C. `tsconfig.json`을 자동으로 삭제한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 이 옵션은 오류를 억제하는 것이 아니라 내장 type checking 자체를 우회한다.
</details>

2. 사용자 지정 TypeScript configuration file을 지정하는 옵션은?
   - A. `tsconfigPath`
   - B. `configFile`
   - C. `typescriptConfig`

<details><summary>정답 보기</summary>

정답: **A**  
해설: `tsconfigPath`에 `'tsconfig.build.json'` 같은 경로를 지정한다.
</details>

## 챕터 요약

- `typescript` 옵션은 `next.config.js`에서 TypeScript 관련 build 동작을 설정한다.
- `ignoreBuildErrors`의 기본값은 `false`이며 TypeScript 오류가 있으면 `next build`가 실패한다.
- `ignoreBuildErrors: true`는 type checking을 완전히 건너뛰므로 별도 type check가 필요하다.
- `tsconfigPath`의 기본값은 `'tsconfig.json'`이다.
- 사용자 지정 configuration file은 `tsconfigPath`에 경로를 지정해 사용한다.
