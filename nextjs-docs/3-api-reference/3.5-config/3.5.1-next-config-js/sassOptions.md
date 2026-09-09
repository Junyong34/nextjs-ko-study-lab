# sassOptions

- 공식 문서: [sassOptions](https://nextjs.org/docs/app/api-reference/config/next-config-js/sassOptions)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `sassOptions`가 Sass 컴파일러 설정을 담당하는 방식을 이해한다.
- `next.config.ts`에서 `sassOptions`, `additionalData`, `implementation`을 설정하는 방법을 익힌다.
- `implementation` 이외 속성의 타입 지원 범위와 `functions`의 webpack과 Turbopack 제약을 구분한다.

## 핵심 개념 및 설명

`sassOptions`를 사용하면 Sass 컴파일러를 구성할 수 있다.

### 기본 설정

공식 예제는 `sassOptions` 객체에 `additionalData`를 작성하고 `implementation`을 추가해 `nextConfig`에 전달한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const sassOptions = {
  additionalData: `
    $var: red;
  `,
}

const nextConfig: NextConfig = {
  sassOptions: {
    ...sassOptions,
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `sassOptions`는 `implementation` 이외의 속성에 타입이 지정되지 않는다. Next.js가 가능한 다른 속성을 관리하지 않기 때문이다.
> - 사용자 지정 Sass 함수를 정의하는 `functions` 속성은 webpack에서만 지원한다. Turbopack에서는 사용자 지정 Sass 함수를 사용할 수 없다. Rust 기반 아키텍처가 이 옵션으로 전달한 JavaScript 함수를 직접 실행하지 못하기 때문이다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `additionalData`에 `$var: red;`를 넣고 `.scss` 파일에서 해당 변수를 사용하는 페이지를 구성해 Sass 컴파일 결과를 브라우저에서 확인한다.
- webpack과 Turbopack에서 `functions` 설정을 각각 적용해 사용자 지정 Sass 함수 지원 차이를 개발 결과로 비교한다.

## 연습 문제

1. `sassOptions`의 역할로 알맞은 것은 무엇인가?
   - A. JavaScript 번들의 라우트 타입을 생성한다.
   - B. Sass 컴파일러를 구성한다.
   - C. HMR 캐시를 비활성화한다.
   - D. 이미지의 원격 도메인을 허용한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `sassOptions`는 Sass 컴파일러에 사용할 설정을 구성하는 옵션이다.
</details>

2. `functions` 속성으로 사용자 지정 Sass 함수를 정의할 때 공식 문서가 명시한 지원 범위는 무엇인가?
   - A. webpack에서만 지원한다.
   - B. Turbopack에서만 지원한다.
   - C. webpack과 Turbopack 모두 지원한다.
   - D. 두 번들러 모두 지원하지 않는다.

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: `functions` 속성은 webpack에서만 지원하며, Turbopack에서는 전달된 JavaScript 함수를 직접 실행할 수 없다.
</details>

## 챕터 요약

- `sassOptions`는 Sass 컴파일러를 구성하는 `next.config` 옵션이다.
- 공식 예제는 TypeScript 설정에서 `additionalData`와 `implementation: 'sass-embedded'`를 사용한다.
- `implementation` 이외의 `sassOptions` 속성은 Next.js가 타입을 관리하지 않는다.
- 사용자 지정 Sass 함수를 정의하는 `functions` 속성은 webpack에서만 지원하며 Turbopack에서는 사용할 수 없다.
