# mdx-components.js

- 공식 문서: [mdx-components.js](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- App Router에서 `@next/mdx`에 필요한 전역 컴포넌트 registry를 정의한다.
- `useMDXComponents` export 계약을 지킨다.

## 핵심 개념 및 설명

App Router에서 `@next/mdx`를 사용하려면 프로젝트 root 또는 `src` 구조의 root에 `mdx-components.js|tsx`가 반드시 있어야 한다. 파일이 없으면 동작하지 않는다. 이 파일로 MDX 기본 HTML 요소와 사용자 컴포넌트의 스타일·구현을 교체할 수 있다.

```tsx
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

파일은 인자를 받지 않는 `useMDXComponents` 함수 하나를 export해야 한다.

## 예제 및 데모 설계

- Phase 2에서 MDX의 `h1`과 `a`를 사용자 컴포넌트로 매핑하고 렌더링 결과를 확인한다.
- 파일이나 export 이름이 없을 때 빌드 실패를 기록한다.

## 연습 문제

1. App Router의 `@next/mdx`가 요구하는 export는?
   - A. `generateMetadata`
   - B. `useMDXComponents`
   - C. `register`

<details><summary>정답 보기</summary>

정답: B. 인자 없는 registry 함수가 필요하다.
</details>

## 챕터 요약

- `mdx-components.js|tsx`는 App Router의 `@next/mdx`에 필수다.
- 프로젝트 root 또는 `src` 구조에 맞는 root에 둔다.
- `useMDXComponents` 한 함수를 export한다.
- MDX 요소의 전역 스타일과 컴포넌트를 매핑할 수 있다.
