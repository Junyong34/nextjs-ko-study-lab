# Sass

- 공식 문서: [Sass](https://nextjs.org/docs/app/guides/sass)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js 프로젝트에 Sass를 설치하고 `.scss`와 `.sass` 파일을 사용할 수 있다.
- CSS Modules와 Sass를 결합해 컴포넌트 스코프 스타일을 만들 수 있다.
- `sassOptions`로 Sass 옵션과 구현체를 설정할 수 있다.
- CSS Module에서 내보낸 Sass 변수를 JavaScript 모듈처럼 사용할 수 있다.

## 핵심 개념 및 설명

Next.js는 `sass` 패키지를 설치하면 별도 통합 설정 없이 `.scss`와 `.sass` 확장자를 지원한다. 컴포넌트 단위 Sass에는 CSS Modules를 함께 사용하며, 파일 이름을 `.module.scss` 또는 `.module.sass`로 만든다.

```bash
npm install --save-dev sass
```

pnpm은 `pnpm add -D sass`, Yarn은 `yarn add -D sass`, Bun은 `bun add -D sass`를 실행한다.

> **알아두면 좋은 점**: Sass에는 확장자별로 서로 다른 두 문법이 있다. `.scss`는 SCSS 문법을, `.sass`는 들여쓰기 문법(Indented Syntax)을 사용해야 한다. 무엇을 선택할지 확실하지 않다면 CSS의 상위 집합이며 별도의 들여쓰기 문법을 배우지 않아도 되는 `.scss`로 시작한다.

### Sass 옵션 사용자화

Sass 옵션을 바꾸려면 `next.config`의 `sassOptions`를 사용한다. 예를 들어 `additionalData`는 모든 Sass 파일 앞에 공통 코드를 추가할 수 있다.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

export default nextConfig
```

#### 구현체 선택

`implementation` 속성으로 사용할 Sass 구현체를 지정할 수 있다. 기본적으로 Next.js는 `sass` 패키지를 사용한다. `sass-embedded`를 선택하려면 다음과 같이 설정한다.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

### Sass 변수

Next.js는 CSS Module 파일에서 내보낸 Sass 변수를 지원한다. `:export` 블록은 Sass 값을 JavaScript에서 import할 수 있는 이름으로 노출한다.

```scss
// app/variables.module.scss
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

App Router의 페이지에서 이 모듈을 import하면 내보낸 값을 컴포넌트에서 사용할 수 있다.

```jsx
// app/page.js
import variables from './variables.module.scss'

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>
}
```

`app/page.js`는 루트 `/` URL에 대응한다. 위 예제에서는 빌드 과정이 Sass 변수 `$primary-color`를 처리하고, CSS Module이 내보낸 `primaryColor`를 페이지 모듈에서 읽는다.

## 예제 및 데모 설계

- Phase 2에서 `.module.scss`로 카드 컴포넌트의 로컬 스타일을 만들고, 같은 클래스명을 다른 모듈에서도 사용해 충돌이 없는지 확인한다.
- `additionalData`로 공통 Sass 변수를 주입한 경우와 `:export`로 값을 JavaScript에 노출한 경우를 나란히 비교한다.
- `sass`와 `sass-embedded` 구현체를 바꾸어도 화면 결과가 같은지 확인한다.
- 현재 Phase 1에서는 실행 코드를 만들지 않고 파일 구조와 관찰 항목만 설계한다.

## 연습 문제

1. 컴포넌트 단위로 Sass와 CSS Modules를 함께 사용하는 파일명은 무엇인가?

   1. `button.scss`
   2. `button.module.scss`
   3. `button.module.css.js`
   4. `button.sass.config`

   <details><summary>정답 보기</summary>

   **정답: 2** — `.module.scss` 또는 `.module.sass` 확장자가 Sass와 CSS Modules를 함께 적용한다.

   </details>

2. Sass 구현체를 선택하는 `sassOptions` 속성은 무엇인가?

   1. `implementation`
   2. `compiler`
   3. `syntax`
   4. `loader`

   <details><summary>정답 보기</summary>

   **정답: 1** — `implementation`에 기본 `sass` 대신 `sass-embedded` 같은 구현체를 지정할 수 있다.

   </details>

3. CSS Module의 Sass 변수를 JavaScript에서 import할 수 있게 노출하는 블록은 무엇인가?

   1. `:global`
   2. `@use`
   3. `:export`
   4. `@forward`

   <details><summary>정답 보기</summary>

   **정답: 3** — `:export`가 Sass 값을 CSS Module의 export 이름으로 노출한다.

   </details>

## 챕터 요약

- Next.js는 `sass` 패키지를 설치하면 `.scss`와 `.sass` 파일을 지원한다.
- 컴포넌트 스코프 Sass에는 `.module.scss` 또는 `.module.sass`를 사용한다.
- 처음 시작할 때는 CSS의 상위 집합인 `.scss` 문법이 접근하기 쉽다.
- `sassOptions`로 공통 데이터와 사용할 Sass 구현체를 설정할 수 있다.
- CSS Module의 `:export`로 Sass 변수를 JavaScript에 노출할 수 있다.
