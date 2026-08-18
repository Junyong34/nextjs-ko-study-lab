# use client

- 공식 문서: [use client](https://nextjs.org/docs/app/api-reference/directives/use-client)
- 상위 메뉴: [Directives](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `'use client'` 지시어의 역할과 [Server Component](../../1-getting-started/server-and-client-components.md)와 [Client Component](../../1-getting-started/server-and-client-components.md) 사이의 경계(Boundary) 선언 방식을 이해한다.
- `'use client'` 지시어를 파일 최상단에 배치하고 모듈 진입점으로 사용하는 규칙을 익힌다.
- Server Component에서 Client Component로 데이터를 전달할 때 요구되는 직렬화(Serializable) 제약 조건을 이해한다.
- 정적 데이터 fetching과 인터랙티브 UI를 분리 결합하는 컴포넌트 합성(Composition) 패턴을 적용한다.

## 핵심 개념 및 설명

`'use client'` 지시어는 컴포넌트가 **클라이언트 측(client side)**에서 렌더링되는 진입점임을 선언한다. 상태 관리(`useState`, `useReducer`), 이벤트 핸들러(`onClick`, `onChange`), 브라우저 전용 API(`localStorage`, `window` 등) 접근과 같은 클라이언트 JavaScript 기능이 필요한 인터랙티브 UI를 구축할 때 사용한다. 이는 React의 표준 기능이다.

> **알아두면 좋은 점**:
>
> Client Component를 포함하는 모든 파일마다 `'use client'` 지시어를 붙일 필요는 없다. Server Component 내부에서 직접 임포트하여 렌더링하려는 모듈 파일에만 선언하면 된다. `'use client'` 지시어는 [서버와 클라이언트의 경계](../../2-guides/2.2-server-and-client-boundary.md)를 정의하며, 해당 파일에서 내보낸 컴포넌트가 클라이언트로의 진입점 역할을 한다.

### 사용법 (Usage)

Client Component 진입점을 선언하려면 모든 `import` 구문보다 앞선 **파일의 최상단**에 `'use client'` 지시어를 작성한다:

```tsx filename="app/components/counter.tsx" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>카운트: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        1 증가
      </button>
    </div>
  )
}
```

```jsx filename="app/components/counter.js" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>카운트: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        1 증가
      </button>
    </div>
  )
}
```

### 직렬화 가능한 Props (Serializable Props)

`'use client'` 지시어가 선언된 Client Component에 Server Component로부터 전달되는 props는 반드시 [직렬화 가능(serializable)](https://react.dev/reference/rsc/use-client#serializable-types)해야 한다. 서버에서 클라이언트로 데이터를 전송할 때 React가 직렬화할 수 있는 형식(기본 원시 타입, 순수 객체, 배열 등)이어야 함을 의미한다.

```tsx filename="app/components/counter.tsx" highlight={4} switcher
'use client'

export default function Counter({
  onClick /* ❌ Server Component에서 전달하는 일반 함수는 직렬화할 수 없다 (Server Action 제외) */,
}: {
  onClick?: () => void
}) {
  return (
    <div>
      <button type="button" onClick={onClick}>증가</button>
    </div>
  )
}
```

### Server Component 내부에 Client Component 중첩 (합성 패턴)

Server Component와 Client Component를 함께 구성하면 성능과 인터랙션을 모두 확보할 수 있다:

1. **Server Component**: 정적 콘텐츠, 서버 측 데이터 fetching, SEO 친화적 마크업 구성에 사용한다.
2. **Client Component**: 상태, 이펙트, 브라우저 API가 필요한 인터랙티브 UI에 사용한다.
3. **컴포넌트 합성**: 관심사를 명확히 분리하여 필요한 최소한의 영역만 Client Component로 격리한다.

```tsx filename="app/page.tsx" highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // Client Component 진입점

export default function Page() {
  return (
    <div>
      {/* 정적 헤더 (Server Component) */}
      <Header />
      {/* 인터랙티브 카운터 (Client Component) */}
      <Counter />
    </div>
  )
}
```

```jsx filename="app/page.js" highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // Client Component 진입점

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

## 예제 및 데모 설계

- 정적 사용자 프로필(Server Component) 하위에 좋아요 버튼(Client Component)을 배치하여 서버/클라이언트 경계 분리 동작을 확인한다.
- Server Component에서 Client Component로 직렬화 가능한 JSON 데이터(객체, 배열, 문자열)와 직렬화 불가능한 값(함수 prop)을 전달했을 때의 빌드/런타임 차이를 검증한다.
- 최상단 `'use client'` 선언 파일 하위로 임포트되는 자식 컴포넌트들이 별도 지시어 없이도 클라이언트 번들에 포함되는 번들링 경계를 테스트한다.

## 연습 문제

1. `'use client'` 지시어의 위치와 작성 원칙으로 올바른 것은?
   - A. 컴포넌트 함수 내부 최상단에 작성한다.
   - B. 모든 import 구문보다 앞선 파일의 최상단에 작성한다.
   - C. `next.config.js`에 파일 경로를 등록해야 한다.
   - D. Client Component를 가져와 사용하는 모든 파일에 중복해서 작성해야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `'use client'`는 파일의 최상단(모든 import 구문 이전)에 선언하여 해당 모듈 전체가 클라이언트 렌더링 경계의 진입점임을 명시해야 한다.
</details>

2. Server Component에서 Client Component로 props를 전달할 때 충족해야 하는 조건은?
   - A. 반드시 TypeScript 타입 선언이 포함되어야 한다.
   - B. 전달되는 데이터가 직렬화 가능(serializable)해야 한다.
   - C. 오직 문자열(string) 원시 타입만 전달할 수 있다.
   - D. 모든 props가 `Promise`로 감싸져 있어야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 서버에서 렌더링된 결과가 네트워크를 통해 클라이언트로 전송되므로, Server Component에서 Client Component로 넘기는 props는 React가 직렬화할 수 있는 데이터 타입이어야 한다.
</details>

## 챕터 요약

- `'use client'`는 Server Component와 Client Component 사이의 경계를 정의하는 React 지시어다.
- 파일 최상단(import 이전)에 위치해야 하며, 해당 모듈에서 export된 컴포넌트는 클라이언트 진입점이 된다.
- 하위 종속 컴포넌트마다 매번 지시어를 붙일 필요는 없으며, 경계 진입점 파일에만 선언하면 된다.
- Server Component에서 전달되는 props는 반드시 직렬화 가능한 형태여야 한다.
- 정적 데이터는 Server Component에서 처리하고 인터랙션이 필요한 영역만 Client Component로 분리하는 합성을 권장한다.
