# mdx-components.js

- 공식 문서: [mdx-components.js](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- App Router에서 `@next/mdx`에 필요한 전역 컴포넌트 registry를 정의한다.
- `useMDXComponents` export 계약을 지킨다.

## 핵심 개념 및 설명

`mdx-components.js|tsx` 파일은 [App Router가 포함된 `@next/mdx`](../../2-guides/mdx.md)를 사용하려면 **필수**이며 이 파일이 없으면 작동하지 않는다. 또한 이를 사용하여 [스타일을 사용자 정의](../../2-guides/mdx.md#using-custom-styles-and-components)할 수 있다.

MDX 컴포넌트를 정의하려면 프로젝트 루트에 있는 `mdx-components.tsx`(또는 `.js`) 파일을 사용한다. 예를 들어 `pages` 또는 `app`와 동일한 수준이거나 해당하는 경우 `src` 내부이다.

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js" switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

<a id="exports"></a>
### 내보내기

<a id="usemdxcomponents-function"></a>
#### `useMDXComponents` 기능

파일은 `useMDXComponents`라는 단일 함수를 내보내야 한다. 이 함수는 어떤 인수도 허용하지 않는다.

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js" switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | -------------------- |
| `v13.1.2` | MDX 컴포넌트가 추가되었다. |

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
