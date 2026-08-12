# Server and Client Components

- 공식 문서: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Server Component와 Client Component를 언제 각각 써야 하는지 판단할 수 있다.
- `"use client"` 지시어가 모듈 그래프에 어떤 경계를 만드는지 이해한다.
- Server Component에서 Client Component로 데이터와 자식(children)을 전달하는 패턴을 구분할 수 있다.
- `server-only`/`client-only` 패키지로 환경 오염(environment poisoning)을 막는 방법을 안다.

## 핵심 개념 및 설명

기본적으로 레이아웃과 페이지는 [Server Components](https://react.dev/reference/rsc/server-components)다. 서버에서 데이터를 가져오고 UI 일부를 렌더링하고, 선택적으로 결과를 캐시하고, 클라이언트로 스트리밍할 수 있다. 인터랙티비티나 브라우저 API가 필요할 때는 [Client Components](https://react.dev/reference/rsc/use-client)로 기능을 덧붙인다.

### 언제 Server/Client Component를 쓸까

클라이언트와 서버 환경은 할 수 있는 일이 다르다. Server/Client Component를 나누면 각 환경에 맞는 로직을 그 환경에서 실행할 수 있다.

**Client Component**가 필요한 경우:

- [상태](https://react.dev/learn/managing-state)와 [이벤트 핸들러](https://react.dev/learn/responding-to-events) (예: `onClick`, `onChange`)
- [생명주기 로직](https://react.dev/learn/lifecycle-of-reactive-effects) (예: `useEffect`)
- 브라우저 전용 API (예: `localStorage`, `window`, `Navigator.geolocation`)
- [커스텀 훅](https://react.dev/learn/reusing-logic-with-custom-hooks)

**Server Component**가 필요한 경우:

- 데이터 소스에 가까운 곳에서 데이터베이스나 API로부터 데이터 가져오기
- API 키, 토큰 같은 비밀 값을 클라이언트에 노출하지 않고 사용
- 브라우저로 전송되는 JavaScript 양 줄이기
- [First Contentful Paint(FCP)](https://web.dev/fcp/) 개선, 콘텐츠를 클라이언트로 점진적으로 스트리밍

예를 들어 `<Page>` 컴포넌트는 포스트 데이터를 가져오는 Server Component이고, 그 데이터를 클라이언트 인터랙티비티를 담당하는 `<LikeButton>`에 props로 넘긴다.

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```tsx
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

### Next.js에서 Server/Client Component는 어떻게 동작할까

#### 서버에서

서버에서는 Next.js가 React의 API로 렌더링을 조율한다. 렌더링 작업은 개별 라우트 세그먼트([레이아웃과 페이지](./layouts-and-pages.md), [병렬 라우트 슬롯](../3-api-reference/3.1-file-conventions/parallel-routes.md) 포함, 화면에 보이든 아니든)마다 청크로 나뉜다.

- **Server Component**는 React Server Component Payload(RSC Payload)라는 특수한 데이터 형식으로 렌더링된다.
- **Client Component**와 RSC Payload는 HTML을 [prerender](../4-glossary/README.md)하는 데 쓰인다.

> **React Server Component Payload(RSC)란?**
>
> RSC Payload는 렌더링된 React Server Components 트리를 압축한 바이너리 표현이다. React가 클라이언트에서 브라우저 DOM을 갱신하는 데 쓴다. RSC Payload에는 다음이 담긴다.
>
> - Server Component의 렌더링 결과
> - Client Component가 렌더링되어야 할 위치의 자리표시자와 그 JavaScript 파일 참조
> - Server Component에서 Client Component로 전달된 props

#### 클라이언트에서 (최초 로드)

클라이언트에서는:

1. **HTML**로 라우트의 빠른 비인터랙티브 미리보기를 즉시 보여준다.
2. **RSC Payload**로 Client Component 트리와 Server Component 트리를 재조정(reconcile)한다.
3. **JavaScript**로 Client Component를 hydrate해서 애플리케이션을 인터랙티브하게 만든다.

> **hydration이란?**
>
> Hydration은 React가 [이벤트 핸들러](https://react.dev/learn/responding-to-events)를 DOM에 붙여서 정적 HTML을 인터랙티브하게 만드는 과정이다.

#### 이후 내비게이션에서

이후 내비게이션에서는:

- **RSC Payload**가 프리페칭되고 캐시되어 즉각적인 내비게이션이 가능해진다.
- **Client Component**는 서버가 렌더링한 HTML 없이도 전적으로 클라이언트에서 렌더링된다.

## 예시

### Client Component 사용하기

파일 맨 위, import 위에 [`"use client"`](../3-api-reference/3.4-directives/use-client.md) 지시어를 추가하면 Client Component를 만들 수 있다.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

`"use client"`는 Server 모듈 그래프와 Client 모듈 그래프(트리) 사이의 **경계**를 선언하는 데 쓰인다.

파일이 `"use client"`로 마킹되면, **그 파일이 import하는 모든 것과 직접 렌더링하는 컴포넌트가 클라이언트 번들에 포함**된다. 즉 클라이언트에서 쓰일 모든 컴포넌트에 일일이 지시어를 붙이지 않아도 된다.

이 동작은 Client Component의 [모듈 그래프](../4-glossary/README.md)에 속한 컴포넌트, 즉 그 파일이 import하고 직접 렌더링하는 컴포넌트에만 적용된다. children이나 다른 props로 전달된 Server Component에는 적용되지 않는다. 그런 컴포넌트는 Client Component의 모듈 그래프로 import되지 않는다. 서버에서 렌더링되어 렌더링된 결과물로 Client Component에 전달된다.

Server와 Client Component를 어떻게 함께 조합할 수 있는지는 [Server/Client Component 끼워넣기](#server와-client-component-끼워넣기)를 참고한다.

### JS 번들 크기 줄이기

클라이언트 JavaScript 번들 크기를 줄이려면, UI의 큰 부분을 Client Component로 마킹하지 말고 인터랙티브한 특정 컴포넌트에만 `'use client'`를 추가한다.

예를 들어 `<Layout>` 컴포넌트는 로고와 내비게이션 링크 같은 대부분 정적인 요소를 담고 있지만, 인터랙티브한 검색바를 포함한다. `<Search />`는 인터랙티브해서 Client Component여야 하지만, 나머지 레이아웃은 Server Component로 남을 수 있다.

```tsx
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

// Layout은 기본적으로 Server Component다
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx
'use client'

export default function Search() {
  // ...
}
```

### Server에서 Client Component로 데이터 전달하기

props를 이용해 Server Component에서 Client Component로 데이터를 전달할 수 있다.

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

```tsx
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

대안으로, [`use` API](https://react.dev/reference/react/use)로 Server Component에서 Client Component로 데이터를 스트리밍할 수도 있다. [예시](./fetching-data.md)를 참고한다.

> **알아두면 좋은 점**: Client Component로 전달되는 props는 React가 [직렬화](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)할 수 있어야 한다.

### Server와 Client Component 끼워넣기

Server Component를 Client Component의 prop으로 전달할 수 있다. 이렇게 하면 서버에서 렌더링된 UI를 Client Component 안에 시각적으로 중첩할 수 있다.

흔한 패턴은 `children`을 써서 `<ClientComponent>` 안에 _슬롯_을 만드는 것이다. 예를 들어 서버에서 데이터를 가져오는 `<Cart>`를, 클라이언트 상태로 표시 여부를 토글하는 `<Modal>` 컴포넌트 안에 넣는 경우다.

```tsx
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

그다음 부모 Server Component(예: `<Page>`)에서 `<Cart>`를 `<Modal>`의 자식으로 전달할 수 있다.

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

이 패턴에서 Server Component는 Client Component에 props로 전달되더라도 미리 서버에서 렌더링된다. React Server Component Payload에는 그 Server Component들의 렌더링 결과와, Client Component가 렌더링되어야 할 위치의 자리표시자·JS 파일 참조가 함께 담긴다.

### Context Provider

[React context](https://react.dev/learn/passing-data-deeply-with-context)는 현재 테마 같은 전역 상태를 공유하는 데 흔히 쓰인다. 그런데 React context는 Server Component에서 지원되지 않는다.

context를 쓰려면 `children`을 받는 Client Component를 만든다.

```tsx
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

그다음 Server Component(예: `layout`)에서 이를 import한다.

```tsx
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

이제 Server Component가 provider를 직접 렌더링할 수 있고, 앱 전체의 다른 모든 Client Component가 이 context를 사용할 수 있다.

> **알아두면 좋은 점**: provider는 트리에서 가능한 한 깊게 렌더링해야 한다 — `ThemeProvider`가 전체 `<html>` 문서가 아니라 `{children}`만 감싸는 것에 주목한다. 이렇게 하면 Next.js가 Server Component의 정적인 부분을 더 쉽게 최적화할 수 있다.

### 서드파티 컴포넌트

클라이언트 전용 기능에 의존하는 서드파티 컴포넌트를 쓸 때는, 예상대로 동작하도록 Client Component로 감쌀 수 있다.

예를 들어 `acme-carousel` 패키지의 `<Carousel />`은 `useState`를 쓰지만 아직 `"use client"` 지시어가 없다.

Client Component 안에서 `<Carousel />`을 쓰면 예상대로 동작한다.

```tsx
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Client Component 안에서 쓰이므로 동작한다 */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

하지만 Server Component 안에서 직접 쓰려고 하면 에러가 난다. Next.js가 `<Carousel />`이 클라이언트 전용 기능을 쓴다는 걸 모르기 때문이다.

이를 해결하려면, 클라이언트 전용 기능에 의존하는 서드파티 컴포넌트를 직접 만든 Client Component로 감싼다.

```tsx
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

이제 `<Carousel />`을 Server Component 안에서 직접 쓸 수 있다.

```tsx
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* 동작함, Carousel이 Client Component이므로 */}
      <Carousel />
    </div>
  )
}
```

> **라이브러리 제작자를 위한 조언**
>
> 컴포넌트 라이브러리를 만든다면, 클라이언트 전용 기능에 의존하는 엔트리 포인트에 `"use client"` 지시어를 추가한다. 그러면 사용자가 래퍼를 만들지 않고도 Server Component 안으로 컴포넌트를 import할 수 있다.
>
> 일부 번들러가 `"use client"` 지시어를 제거할 수 있다는 점도 알아두자.

### 환경 오염 막기

JavaScript 모듈은 Server와 Client Component 모듈 양쪽에서 공유될 수 있다. 즉 서버 전용 코드가 실수로 클라이언트로 import될 수도 있다. 다음 함수를 보자.

```tsx
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

이 함수는 클라이언트에 절대 노출되면 안 되는 `API_KEY`를 담고 있다.

Next.js에서는 `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 번들에 포함된다. 접두사가 없으면 Next.js가 빈 문자열로 대체한다.

그 결과, `getData()`를 클라이언트에서 import하고 실행할 수는 있어도 예상대로 동작하지 않는다.

Client Component에서 실수로 쓰이는 걸 막으려면 [`server-only` 패키지](https://www.npmjs.com/package/server-only)를 쓸 수 있다.

```tsx
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

이제 이 모듈을 Client Component로 import하려고 하면 빌드 타임 에러가 발생한다.

`window` 객체에 접근하는 코드처럼 클라이언트 전용 로직을 담은 모듈을 마킹할 때는 [`client-only` 패키지](https://www.npmjs.com/package/client-only)를 대응해서 쓸 수 있다.

Next.js에서 `server-only`나 `client-only`를 설치하는 건 **선택 사항**이다. 다만 린트 규칙이 불필요한 의존성을 지적한다면 설치해서 문제를 피할 수 있다.

```bash
pnpm add server-only
```

Next.js는 `server-only`, `client-only` import를 내부적으로 처리해서, 모듈이 잘못된 환경에서 쓰였을 때 더 명확한 에러 메시지를 준다. NPM의 이 패키지들 내용 자체는 Next.js가 실제로 쓰지 않는다.

Next.js는 [`noUncheckedSideEffectImports`](https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports)가 켜진 TypeScript 설정을 위해 `server-only`, `client-only`의 자체 타입 선언도 제공한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 남기고 구현은 보류)
- 데모 목적: 같은 페이지 안에 Server Component(데이터 fetch)와 Client Component(좋아요 버튼)를 함께 두고, 브라우저 개발자 도구의 네트워크 탭에서 클라이언트로 전송되는 JS 번들 차이를 비교한다.
- 사용자가 확인할 화면과 상호작용: `'use client'`를 뺐을 때와 붙였을 때 빌드 에러/번들 크기가 어떻게 달라지는지 직접 확인.
- 예제에서 관찰할 결과: `server-only`를 import한 함수를 Client Component에서 쓰려고 할 때 발생하는 빌드 타임 에러.

## 연습 문제

**Q1. (단일 선택) 파일에 `"use client"`를 추가했을 때 클라이언트 번들에 포함되는 것은?**

1. 그 파일뿐
2. 그 파일이 children prop으로 받는 모든 Server Component
3. 그 파일이 import하고 직접 렌더링하는 모든 컴포넌트
4. 프로젝트의 모든 컴포넌트

<details>
<summary>정답 보기</summary>

**정답: 3** — `"use client"`가 붙은 파일이 import하고 직접 렌더링하는 컴포넌트들이 클라이언트 번들에 포함된다. children이나 다른 props로 전달된 Server Component는 포함되지 않는다.

</details>

**Q2. (복수 선택) 다음 중 Client Component가 필요한 경우를 모두 고르시오.**

- [ ] `useState`, `onClick` 같은 상태와 이벤트 핸들러를 쓸 때
- [ ] 데이터베이스에 직접 쿼리를 실행할 때
- [ ] `window.localStorage`에 접근할 때
- [ ] API 키를 안전하게 숨겨서 외부 API를 호출할 때

<details>
<summary>정답 보기</summary>

**정답: 1, 3** — 데이터베이스 직접 쿼리와 API 키를 숨기는 작업은 Server Component에서 해야 한다.

</details>

**Q3. (단일 선택) 서버 전용 코드가 클라이언트로 실수로 import되는 것을 빌드 타임에 막으려면?**

1. 환경 변수 이름에 `NEXT_PUBLIC_`을 붙인다.
2. 해당 모듈에 `server-only` 패키지를 import한다.
3. `'use client'`를 그 모듈에도 추가한다.
4. `.env` 파일을 `.gitignore`에 추가한다.

<details>
<summary>정답 보기</summary>

**정답: 2** — `server-only`를 import한 모듈을 Client Component에서 import하려고 하면 빌드 타임 에러가 발생한다.

</details>

## 요약

- 레이아웃과 페이지는 기본적으로 Server Component이며, 인터랙티비티나 브라우저 API가 필요할 때만 Client Component를 쓴다.
- `"use client"`는 파일 하나가 아니라, 그 파일이 import·직접 렌더링하는 모듈 그래프 전체를 클라이언트 번들에 포함시키는 경계다.
- Server Component는 props로 데이터를, children으로 렌더링된 결과를 Client Component에 전달할 수 있다.
- React context는 Server Component에서 쓸 수 없으므로, provider는 Client Component로 만들고 트리에서 최대한 깊게 배치한다.
- `server-only`/`client-only` 패키지로 서버·클라이언트 전용 코드가 잘못된 환경에서 쓰이는 것을 빌드 타임에 막을 수 있다.
