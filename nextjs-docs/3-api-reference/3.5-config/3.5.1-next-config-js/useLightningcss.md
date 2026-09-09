# useLightningcss

- 공식 문서: [useLightningcss](https://nextjs.org/docs/app/api-reference/config/next-config-js/useLightningcss)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- webpack에서 Lightning CSS를 사용하도록 설정하는 방법을 이해한다.
- webpack과 Turbopack이 CSS를 처리하는 방식과 `useLightningcss`의 적용 범위를 구분한다.
- `lightningCssFeatures`의 `include`와 `exclude`로 CSS feature 변환을 제어하는 방법을 익힌다.

## 핵심 개념 및 설명

이 기능은 현재 experimental이며 변경될 수 있다. production에서는 사용을 권장하지 않는다. Lightning CSS는 Rust로 작성된 빠른 CSS transformer이자 minifier다. `useLightningcss`는 webpack에서 Lightning CSS를 사용하도록 설정한다.

이 옵션을 설정하지 않으면 Next.js의 webpack은 기본적으로 PostCSS와 `postcss-preset-env`를 사용한다. Turbopack은 Next.js 14.2부터 Lightning CSS를 기본으로 사용하므로 이 옵션의 영향을 받지 않는다. Turbopack에서는 항상 Lightning CSS를 사용한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: false, // 기본값이며 Turbopack에서는 무시된다.
  },
}

export default nextConfig
```

## `lightningCssFeatures`

Lightning CSS는 기본적으로 [browserslist](https://browsersl.ist/) target을 기준으로 변환할 CSS feature를 정한다. `lightningCssFeatures`를 사용하면 브라우저 지원 여부와 관계없이 특정 feature를 항상 변환할지(`include`), 절대 변환하지 않을지(`exclude`) 강제할 수 있다.

이 설정은 `useLightningcss`를 활성화한 webpack과 Turbopack 모두에 적용된다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: true,
    lightningCssFeatures: {
      // target이 지원하더라도 항상 변환한다.
      include: ['light-dark', 'oklab-colors'],
      // target이 지원하지 않더라도 변환하지 않는다.
      exclude: ['nesting'],
    },
  },
}

export default nextConfig
```

### 옵션 (Options)

| 옵션 | 타입 | 설명 |
|---|---|---|
| `include` | `string[]` | 브라우저 target과 관계없이 항상 변환할 feature |
| `exclude` | `string[]` | 브라우저 target이 변환을 요구하더라도 변환하지 않을 feature |

### 사용 가능한 feature (Available features)

개별 feature는 다음과 같다.

| Feature 이름 | 설명 |
|---|---|
| `nesting` | CSS Nesting |
| `not-selector-list` | 여러 selector를 사용하는 `:not` |
| `dir-selector` | `:dir()` selector |
| `lang-selector-list` | 여러 언어를 사용하는 `:lang()` |
| `is-selector` | `:is()` selector |
| `text-decoration-thickness-percent` | `text-decoration-thickness`의 퍼센트 값 |
| `media-interval-syntax` | media query range interval 문법 |
| `media-range-syntax` | media query range 문법, 예: `width >= 600px` |
| `custom-media-queries` | `@custom-media` 규칙 |
| `clamp-function` | `clamp()` 함수 |
| `color-function` | `color()` 함수 |
| `oklab-colors` | `oklab()` 및 `oklch()` 색상 |
| `lab-colors` | `lab()` 및 `lch()` 색상 |
| `p3-colors` | Display P3 색상 |
| `hex-alpha-colors` | alpha가 포함된 4자리 및 8자리 hex 색상 |
| `space-separated-color-notation` | 공백으로 구분한 색상 표기, 예: `rgb(0 0 0)` |
| `font-family-system-ui` | `system-ui` font family |
| `double-position-gradients` | 이중 위치 gradient stop |
| `vendor-prefixes` | vendor prefix가 붙은 속성과 값 |
| `logical-properties` | 논리적 속성과 값 |
| `light-dark` | `light-dark()` 색상 함수 |

Composite group은 여러 feature를 한 번에 설정하는 축약형이다.

| Group 이름 | 포함하는 feature |
|---|---|
| `selectors` | `nesting`, `not-selector-list`, `dir-selector`, `lang-selector-list`, `is-selector` |
| `media-queries` | `media-interval-syntax`, `media-range-syntax`, `custom-media-queries` |
| `colors` | `color-function`, `oklab-colors`, `lab-colors`, `p3-colors`, `hex-alpha-colors`, `space-separated-color-notation`, `light-dark` |

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `16.2.0` | `lightningCssFeatures`가 추가됐다. |
| `15.1.0` | Turbopack에서 `useSwcCss` 지원이 제거됐다. |
| `14.2.0` | Turbopack의 기본 CSS processor가 `@swc/css`에서 Lightning CSS로 바뀌었다. Turbopack에서 `useLightningcss`가 무시되기 시작했고, 기존 호환을 위한 `experimental.turbo.useSwcCss` 옵션이 추가됐다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- webpack에서 `useLightningcss: true`와 `false`를 각각 빌드해 나온 CSS 변환 결과를 비교한다.
- `lightningCssFeatures.include`와 `exclude`에 같은 CSS feature를 다르게 지정하고 출력 CSS를 확인한다.
- Turbopack에서는 `useLightningcss` 값과 관계없이 Lightning CSS를 사용하는지 확인한다.

## 연습 문제

1. `useLightningcss`가 적용되는 번들러는 무엇인가?
   - A. webpack
   - B. Turbopack만
   - C. 두 번들러 모두 동일하게
   - D. 어떤 번들러에도 적용되지 않는다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `useLightningcss`는 webpack에서 Lightning CSS를 사용할지 정한다. Turbopack은 항상 Lightning CSS를 사용한다.
</details>

2. `lightningCssFeatures.include`의 역할은 무엇인가?
   - A. 특정 feature를 항상 변환한다.
   - B. 특정 feature를 항상 제거한다.
   - C. 모든 CSS를 minify하지 않는다.
   - D. Turbopack을 끈다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `include`에 지정한 feature는 브라우저 target이 지원하더라도 항상 변환한다.
</details>

## 챕터 요약

- `useLightningcss`는 webpack에서 Lightning CSS를 사용하는 experimental 옵션이다.
- Turbopack은 이 옵션과 관계없이 Lightning CSS를 사용한다.
- `lightningCssFeatures.include`와 `exclude`로 feature 변환을 강제할 수 있다.
- 개별 feature와 composite group을 설정할 수 있다.
