# turbopackLocalPostcssConfig

- 공식 문서: [turbopackLocalPostcssConfig](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackLocalPostcssConfig)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `turbopackLocalPostcssConfig`가 `postcss.config.js`를 찾는 순서를 바꾸는 방식을 이해한다.
- 기본값에서는 프로젝트 루트를 먼저 탐색하고 `true`에서는 CSS 파일 디렉토리를 먼저 탐색한다는 차이를 구분한다.
- 이 옵션이 `next dev`와 `next build`에서 쓰는 Turbopack에만 해당한다는 점을 설명할 수 있다.
- 여러 앱이나 design system package가 있는 프로젝트에서 디렉토리별 PostCSS 설정을 적용하는 구조를 설계한다.

## 핵심 개념 및 설명

`turbopackLocalPostcssConfig`는 Turbopack이 `postcss.config.js` 파일을 찾는 방식을 바꾼다. 이 옵션을 활성화하면 CSS 파일이 있는 디렉토리에서 탐색을 시작한 뒤 프로젝트 루트로 올라간다. 기본값에서는 프로젝트 루트를 먼저 확인하므로 루트의 `postcss.config.js`가 하위 디렉토리의 설정 파일보다 항상 우선한다.

이 옵션은 Turbopack을 쓸 때만 의미가 있다(`next dev` 또는 `next build`).

### 사용법 (Usage)

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
}

export default nextConfig
```

### 동작 방식 (Behavior)

| 설정 | 설정 탐색 순서 |
| --- | --- |
| `false` (기본값) | 프로젝트 루트 → CSS 파일의 디렉토리 |
| `true` | CSS 파일의 디렉토리 → 프로젝트 루트 |

기본 동작에서는 프로젝트 루트의 `postcss.config.js`를 모든 CSS 파일에 사용하며 디렉토리별 설정은 루트 설정이 없을 때만 쓰인다. `turbopackLocalPostcssConfig`를 활성화하면 이 순서가 반대로 뒤집혀 디렉토리별 설정이 우선하고 루트 설정이 fallback이 된다.

### 예제 (Example)

디렉토리마다 다른 PostCSS transform이 필요한 프로젝트, 예를 들어 여러 앱이나 design system package가 있는 monorepo에서 유용하다.

```
my-app/
├── postcss.config.js          ← fallback (local config가 없으면 적용)
├── app/
│   └── page.module.css        ← root config를 사용한다
└── packages/
    └── ui/
        ├── postcss.config.js  ← 이 디렉토리의 파일에 우선한다
        └── button.module.css  ← packages/ui/postcss.config.js를 사용한다
```

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
| --- | --- |
| `v16.3.0` | `turbopackLocalPostcssConfig`를 도입했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 하나의 monorepo 안에 루트 `postcss.config.js`와 `packages/ui/postcss.config.js`를 만들고 두 CSS 파일에 서로 다른 PostCSS transform이 적용되도록 구성한다.
- `turbopackLocalPostcssConfig: false`와 `true`를 각각 실행해 루트 설정과 디렉토리별 설정 중 어느 쪽이 적용되는지 브라우저 화면의 스타일 차이로 확인한다.
- `next dev`와 `next build`에서 CSS 파일별 설정 탐색 결과가 같은지 비교하고 루트 설정이 fallback으로 동작하는 경우도 확인한다.

## 연습 문제

1. `turbopackLocalPostcssConfig: false`일 때 `postcss.config.js`를 찾는 기본 순서는 무엇인가?
   - A. 프로젝트 루트 → CSS 파일의 디렉토리
   - B. CSS 파일의 디렉토리 → 프로젝트 루트
   - C. `packages/ui` → 프로젝트 루트 → `app`
   - D. 항상 CSS 파일의 디렉토리만 확인한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: 기본값인 `false`에서는 프로젝트 루트를 먼저 확인하고 CSS 파일의 디렉토리를 fallback으로 삼는다.
</details>

2. `turbopackLocalPostcssConfig: true`로 바꾸면 어떤 설정이 우선하는가?
   - A. 프로젝트 루트의 `postcss.config.js`
   - B. CSS 파일이 있는 디렉토리의 `postcss.config.js`
   - C. `next.config.js` 안의 `sassOptions`
   - D. 운영체제 전역의 PostCSS 설정

<details><summary>정답 보기</summary>

정답: **B**  
해설: `true`이면 CSS 파일이 있는 디렉토리에서 먼저 찾고 해당 설정이 없을 때 프로젝트 루트의 설정을 사용한다.
</details>

3. `turbopackLocalPostcssConfig`가 특히 유용한 프로젝트는 무엇인가?
   - A. 모든 CSS 파일이 하나의 루트 설정만 사용하는 프로젝트
   - B. 브라우저에서 JavaScript만 실행하는 프로젝트
   - C. 여러 앱이나 design system package가 있어 디렉토리별 PostCSS transform이 필요한 monorepo
   - D. `next dev`와 `next build`를 사용하지 않는 정적 HTML 프로젝트

<details><summary>정답 보기</summary>

정답: **C**  
해설: 디렉토리별 설정이 필요한 monorepo에서는 CSS 파일과 가까운 `postcss.config.js`를 우선하도록 설정할 수 있다.
</details>

## 챕터 요약

- `turbopackLocalPostcssConfig`는 Turbopack의 `postcss.config.js` 탐색 순서를 바꾼다.
- 기본값 `false`에서는 프로젝트 루트를 먼저 확인하고 CSS 파일의 디렉토리를 fallback으로 삼는다.
- `true`에서는 CSS 파일의 디렉토리 설정이 우선하고 프로젝트 루트 설정을 fallback으로 사용한다.
- 이 옵션은 `next dev`와 `next build`에서 쓰는 Turbopack에만 해당한다.
- 여러 앱이나 design system package가 있는 monorepo에서 디렉토리별 PostCSS transform을 적용할 때 유용하다.
