# CSS-in-JS

- 공식 문서: [CSS-in-JS](https://nextjs.org/docs/app/guides/css-in-js)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- App Router에서 CSS-in-JS 라이브러리를 쓰기 위한 React와 라이브러리의 조건을 설명할 수 있다.
- 서버 렌더링과 스트리밍 중 스타일 레지스트리가 CSS를 수집하고 삽입하는 흐름을 설명할 수 있다.
- `styled-jsx`와 `styled-components`를 루트 레이아웃에 연결할 수 있다.

## 핵심 개념 및 설명

> **경고**: CSS-in-JS를 Server Component와 스트리밍 같은 최신 React 기능과 함께 쓰려면, 라이브러리 작성자가 동시성 렌더링(concurrent rendering)을 포함한 최신 React를 지원해야 한다.

`app` 디렉토리의 Client Component에서는 다음 라이브러리를 사용할 수 있다.

- [`ant-design`](https://ant.design/docs/react/use-with-next#using-app-router)
- [`chakra-ui`](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [`@fluentui/react-components`](https://react.fluentui.dev/?path=/docs/concepts-developer-server-side-rendering-next-js-appdir-setup--page)
- [`kuma-ui`](https://kuma-ui.com)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`@mui/joy`](https://mui.com/joy-ui/integrations/next-js-app-router/)
- [`pandacss`](https://panda-css.com)
- [`styled-jsx`](#styled-jsx)
- [`styled-components`](#styled-components)
- [`stylex`](https://stylexjs.com)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://vanilla-extract.style)

[`emotion`](https://github.com/emotion-js/emotion/issues/2928)은 현재 App Router 지원을 진행하고 있다.

> **알아두면 좋은 점**: Next.js 팀은 여러 CSS-in-JS 라이브러리를 시험하고 있다. React 18 기능이나 `app` 디렉토리를 지원하는 라이브러리의 예제를 계속 추가할 예정이다.

### `app`에서 CSS-in-JS 구성하기

CSS-in-JS는 다음 세 요소를 직접 구성해야 하는 opt-in 방식이다.

1. 한 번의 렌더링에서 생성된 CSS 규칙을 모으는 **스타일 레지스트리**를 만든다.
2. `useServerInsertedHTML`로 해당 규칙을 사용하는 콘텐츠보다 먼저 스타일을 삽입한다.
3. 초기 서버 렌더링 동안 애플리케이션을 스타일 레지스트리로 감싸는 Client Component를 만든다.

#### `styled-jsx`

Client Component에서 `styled-jsx`를 쓰려면 `v5.1.0`을 사용해야 한다. 레지스트리는 최초 렌더링에서 한 번만 만들고, 서버가 HTML을 만들 때 수집한 스타일을 반환한 뒤 비운다.

```tsx filename="app/registry.tsx"
// app/registry.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // 지연 초기화로 스타일시트를 한 번만 만든다.
  const [registry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = registry.styles()
    registry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>
}
```

그다음 [루트 레이아웃](../3-api-reference/3.1-file-conventions/layout.md)을 레지스트리로 감싼다.

```tsx filename="app/layout.tsx"
// app/layout.tsx
import StyledJsxRegistry from './registry'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

공식 저장소의 [`with-styled-jsx` 예제](https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx)에서 전체 구성을 확인할 수 있다.

#### Styled Components

다음 구성은 `styled-components@6` 이상을 기준으로 한다. 먼저 Next.js 컴파일러의 `styledComponents` 지원을 켠다.

```js filename="next.config.js"
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

전역 레지스트리는 렌더링 중 만들어진 규칙을 모으고, `useServerInsertedHTML`은 루트 레이아웃의 `<head>`에 해당 규칙을 삽입한다. 브라우저에서는 `styled-components`가 평소처럼 동작하므로 레지스트리 래퍼 없이 자식을 반환한다.

```tsx filename="lib/registry.tsx"
// lib/registry.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // 서버 렌더링에 사용할 스타일시트를 한 번만 만든다.
  const [sheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement()
    sheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
```

```tsx filename="app/layout.tsx"
// app/layout.tsx
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

공식 저장소의 [`with-styled-components` 예제](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)도 참고할 수 있다.

> **알아두면 좋은 점**:
>
> - 서버 렌더링 중에는 스타일을 전역 레지스트리로 추출한 뒤 HTML의 `<head>`로 내보낸다. 스타일 규칙이 그 규칙을 사용하는 콘텐츠보다 먼저 놓이게 된다. 향후에는 React의 새 기능으로 삽입 위치를 결정할 수도 있다.
> - 스트리밍 중에는 각 청크의 스타일을 수집해 기존 스타일 뒤에 추가한다. 클라이언트 `hydration`이 끝나면 `styled-components`가 이후의 다이나믹 스타일을 삽입한다.
> - 트리 최상단의 Client Component에서 스타일을 모으면 이후 서버 렌더링 때 스타일을 다시 만들지 않고 Server Component `payload`에도 보내지 않으므로 더 효율적이다.
> - 개별 컴파일 속성을 조정하는 고급 사용법은 [Next.js 컴파일러의 styled-components 설정](https://nextjs.org/docs/architecture/nextjs-compiler#styled-components)을 참고한다.

## 예제 및 데모 설계

- Phase 2에서 같은 카드 UI를 `styled-jsx`와 `styled-components`로 각각 구성한다.
- 초기 문서 응답의 `<head>`를 관찰해 콘텐츠보다 스타일 태그가 먼저 삽입되는지 확인한다.
- 스트리밍되는 영역을 추가하고, 청크별 스타일이 기존 스타일 뒤에 합쳐진 뒤 `hydration` 후 클라이언트가 다이나믹 스타일을 관리하는 과정을 비교한다.
- 현재 Phase 1에서는 구현하지 않고 위 관찰 항목과 파일 구성을 설계로만 남긴다.

## 연습 문제

1. App Router의 CSS-in-JS 구성에서 렌더링 중 생성된 CSS 규칙을 모으는 요소는 무엇인가?

   1. Route Handler
   2. 스타일 레지스트리
   3. `postcss.config.js`
   4. Server Component `payload`

   <details><summary>정답 보기</summary>

   **정답: 2** — 스타일 레지스트리가 한 번의 렌더링에서 생성된 CSS 규칙을 수집한다.

   </details>

2. `useServerInsertedHTML`의 역할로 맞는 것은 무엇인가?

   1. 브라우저에서 CSS 파일을 지연 다운로드한다.
   2. 모든 Server Component를 Client Component로 바꾼다.
   3. 수집한 스타일을 그 스타일을 사용할 콘텐츠보다 먼저 삽입한다.
   4. CSS 클래스 이름을 자동 생성한다.

   <details><summary>정답 보기</summary>

   **정답: 3** — 이 훅은 서버가 만든 HTML에 레지스트리의 스타일을 적절한 시점에 삽입한다.

   </details>

3. Styled Components의 서버 렌더링 설명으로 맞는 것을 모두 고르시오.

   1. `styled-components@6` 이상을 기준으로 한다.
   2. 브라우저에서도 서버용 `ServerStyleSheet`가 계속 자식을 감싼다.
   3. 스트리밍되는 각 청크의 스타일은 기존 스타일에 추가된다.
   4. 최상단 Client Component 레지스트리는 CSS를 Server Component `payload`에 넣기 위한 것이다.

   <details><summary>정답 보기</summary>

   **정답: 1, 3** — 브라우저에서는 `styled-components`가 이어받고, 최상단 레지스트리는 CSS 재생성과 `payload` 전송을 피한다.

   </details>

## 챕터 요약

- CSS-in-JS 라이브러리는 최신 React의 Server Component, 스트리밍, 동시성 렌더링을 지원해야 한다.
- App Router 구성에는 스타일 레지스트리, `useServerInsertedHTML`, 최상단 Client Component가 필요하다.
- `styled-jsx`는 `v5.1.0`, `styled-components`는 `v6` 이상을 기준으로 한다.
- 서버 렌더링에서는 스타일을 콘텐츠보다 먼저 삽입하고 스트리밍 중에는 청크별 스타일을 이어 붙인다.
- 클라이언트 `hydration`이 끝나면 CSS-in-JS 라이브러리가 이후의 다이나믹 스타일을 관리한다.
