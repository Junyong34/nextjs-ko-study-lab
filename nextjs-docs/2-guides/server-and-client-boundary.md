# Server and Client Boundary

- 공식 문서: [Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Server Component와 Client Component가 서버와 브라우저에서 실행되는 범위를 구분한다.
- 서버 데이터가 RSC payload와 직렬화 가능한 props를 통해 컴포넌트 트리에 들어가는 흐름을 설명한다.
- 브라우저 상태와 상호작용이 Client Component를 필요로 하는 조건을 판단한다.
- `'use client'` 경계를 코드와 데이터가 통과하는 서로 다른 규칙을 적용한다.
- Server Component를 Client Component의 `children`으로 합성하는 패턴을 설명한다.

## 핵심 개념 및 설명

React Server Components(RSC)는 컴포넌트 트리를 서버 모듈 그래프와 클라이언트 모듈 그래프로 나눈다. Server Component 코드는 서버에만 남고 Client Component는 상호작용 UI를 담당한다. 서버는 두 종류가 합성된 트리를 직렬화한 UI 설명인 RSC payload로 렌더링하며, 그 안에는 Client Component 참조가 들어간다.

RSC 이전의 React 컴포넌트는 현재의 Client Component 모델과 같았다. 서버가 HTML로 렌더링할 수 있었지만 같은 코드가 브라우저에도 전달돼 HTML을 hydration했다. RSC에서는 모듈이 서버 그래프, 클라이언트 그래프, 또는 양쪽에 속하며 양쪽에서 쓰는 모듈은 환경별로 따로 컴파일된다. 서버 그래프는 Client Component 참조와 직렬화한 props를 RSC payload에 담고, 클라이언트 그래프는 서버 그래프를 직접 import하지 않는다.

### 렌더링 환경

이름과 달리 Client Component도 최초 HTML을 만들기 위해 서버에서 렌더링된다.

| 컴포넌트 | 서버에서 실행 | 브라우저에서 실행 |
| --- | --- | --- |
| **Server Component** | 예 | 아니요 |
| **Client Component** | 예 | 예 |

직접 방문하면 Client Component는 서버에서 HTML을 만들고 브라우저에서 hydration하며 다시 렌더링된다. 클라이언트 내비게이션에서는 서버가 RSC payload를 보내고 브라우저가 Client Component를 렌더링한다. 따라서 “서버에서 렌더링됨”은 HTML을 만든 방식을, “Server Component”는 코드가 실행되고 전달되는 환경을 나타내며 서로 다른 개념이다.

Next.js는 라우트에 따라 빌드 시점의 SSG, 빌드 뒤의 ISR, 요청마다 수행하는 SSR로 Client Component의 HTML을 생성하거나 다시 생성할 수 있다.

> **Server Components와 SEO**
>
> JavaScript를 실행하지 않고 HTML만 읽는 크롤러는 첫 응답만 본다. Server Component와 Client Component 모두 이 HTML에 기여한다. SEO 결과는 서버 렌더링이 해당 콘텐츠까지 도달하는지에 달려 있다. 사용자 상호작용이나 이벤트 뒤에만 나타나는 콘텐츠는 이런 크롤러가 읽는 HTML에 없다.

### 데이터가 트리에 들어오는 방식

RSC 이전에는 `getStaticProps`나 `getServerSideProps`가 렌더링 전에 데이터를 모아 props로 트리에 전달했다. Server Component는 서버에서만 실행되므로 렌더링 도중 데이터베이스, 파일 시스템, 내부 서비스, 비밀 값에 직접 접근할 수 있다. 데이터를 브라우저에 노출하는 API 라우트를 먼저 만들 필요가 없다.

```tsx filename="app/page.tsx"
import { PostList } from '@/app/ui/post-list'
import { getPosts } from '@/lib/data'

export default async function Page() {
  const posts = await getPosts() // 렌더링 중 서버에서 실행한다
  return <PostList posts={posts} />
}
```

> **알아두면 좋은 점**: Server Component는 서버 전용 데이터와 비밀 값에 직접 접근할 수 있으므로 Client Component에 전달할 값을 신중하게 선택한다. Props는 직렬화되어 브라우저로 전송된다.

서버가 모든 데이터를 기다린 뒤에만 UI를 반환할 필요는 없다. Server Component에서 요청을 시작하고 아직 완료되지 않은 Promise를 Client Component의 prop으로 넘길 수 있다. Client Component는 React의 `use`로 Promise를 읽으며, 기다리는 동안 가장 가까운 `Suspense` fallback이 표시된다. 요청은 클라이언트 코드 실행 전에 시작되므로 mount 뒤 같은 데이터를 다시 요청하지 않아도 된다. 다만 클라이언트 전용 상태나 사용자 상호작용에 따라 데이터가 정해지면 브라우저에서 요청을 시작해야 할 수 있다.

동일한 `fetch` 요청은 한 서버 렌더링 동안 메모이제이션된다. Cache Components를 사용하면 데이터 함수나 컴포넌트를 페이지의 나머지 부분과 독립적으로 캐싱하고 revalidation할 수 있다.

### 상태와 상호작용

Server Component 코드는 브라우저에 도달하지 않는다. Next.js가 내비게이션, 새로고침, revalidation 과정에서 라우트를 렌더링할 때 다시 실행될 수 있다. Client Component 코드는 브라우저에 도달하고 최초 로드에서 hydration되며 클라이언트 상태 갱신에 따라 다시 렌더링된다.

> **알아두면 좋은 점**: 최초 로드에서는 RSC payload가 HTML과 함께 전달된다. Server Component가 만든 DOM 노드를 직접 변경하면 React 컴포넌트 트리와 DOM이 어긋날 수 있다. 출력을 바꾸려면 서버에서 컴포넌트를 다시 렌더링해야 한다. 브라우저가 새 RSC payload를 받으면 React가 트리를 조정하고 DOM을 갱신한다.

`useState`, `useEffect`, 이벤트 핸들러는 브라우저에서 실행되어 갱신에 반응할 코드가 필요하므로 Server Component에서 사용할 수 없다. 반면 `<details>`, `<video controls>`, Server Function을 `action`으로 받은 `<form>`처럼 브라우저와 HTML이 기본 제공하는 동작은 Client Component 없이도 상호작용할 수 있다. 시간에 따라 변하는 브라우저 상태가 필요한 제어 입력, 실시간 필터, 드래그 핸들 등에 Client Component를 사용한다.

### 경계를 통과하는 것

`'use client'`는 모듈 그래프에 클라이언트 경계를 만든다.

- **코드**는 import를 통해 경계를 통과한다. Client Component가 import한 모듈은 클라이언트 번들에 포함된다.
- **데이터**는 props로 경계를 통과하며 직렬화 가능해야 한다. 일반 함수나 이벤트 핸들러는 넘길 수 없다.

> **알아두면 좋은 점**: Server Component에서 Client Component로 일반 함수를 prop으로 넘기면 오류가 발생한다. `onClick` 같은 이벤트 핸들러는 경계를 통과할 수 없지만, `'use server'`가 표시된 Server Function은 참조로 통과한다. TypeScript 플러그인은 함수 타입 prop의 이름이 `action`이거나 `Action`으로 끝날 때 허용하고 다른 함수 prop을 표시한다. 타입만으로 Server Function과 일반 함수를 구별할 수 없기 때문이다.

렌더링된 React 엘리먼트는 직렬화 가능한 데이터이므로 경계를 통과할 수 있다. 따라서 Client Component가 Server Component 코드를 import하지 않고 그 결과를 `children`으로 배치할 수 있다.

```tsx filename="app/page.tsx"
import { Cart } from '@/app/ui/cart'
import { Modal } from '@/app/ui/modal'

// Page와 Cart는 Server Component, Modal은 Client Component다.
export default function Page() {
  return (
    <Modal title={<div>Your cart</div>}>
      <Cart />
    </Modal>
  )
}
```

이 예에서 `Page`는 `Modal`과 `Cart`의 **소유자(owner)**다. 렌더링된 트리에서는 `Modal`이 `Cart`의 **부모(parent)**다. `Cart`의 소유자가 Server Component이므로 서버에서 렌더링되고, `Modal`은 `Cart`의 코드가 아니라 직렬화된 결과만 받는다.

정적 속성으로 하위 컴포넌트를 노출하는 `Menu.Item` 같은 compound component 패턴은 경계를 가로지를 때 깨질 수 있다. Server Component가 Client Component를 import하면 함수 대신 클라이언트 참조를 받으므로 정적 멤버가 `undefined`가 된다. Server Component에서 각 조각을 사용하려면 정적 속성 대신 named export로 노출한다.

`'use client'`는 클라이언트 하위 트리의 진입점에만 필요하다. 공유 컴포넌트를 바꾸고 싶지 않다면 이를 import하는 얇은 Client Component 래퍼에 지시어를 둔다.

## 예제 및 데모 설계

- **Phase 1 상태**: 구현 예정
- 서버 터미널과 브라우저 콘솔을 나란히 두고 직접 방문과 클라이언트 내비게이션의 로그 위치를 비교한다.
- Server Component가 Promise를 시작하고 Client Component가 `use`로 읽는 동안 `Suspense` fallback을 표시한다.
- 일반 함수 prop 전달 오류, Server Function 참조 전달, Server Component를 `children`으로 넣는 성공 사례를 전환해 확인한다.

## 연습 문제

1. 직접 방문 시 Client Component는 어디에서 렌더링되는가?
   - A. 브라우저에서만
   - B. 서버에서만
   - C. 서버에서 HTML을 만들고 브라우저에서 hydration한다
   - D. 빌드 프로세스에서만

   <details><summary>정답 보기</summary>

   정답: C. `Client`는 브라우저에서도 실행된다는 뜻이지 서버 렌더링을 하지 않는다는 뜻이 아니다.

   </details>

2. Server Component가 Client Component에 넘길 수 있는 것을 모두 고르시오.
   - A. 직렬화 가능한 문자열 prop
   - B. 일반 `onClick` 함수
   - C. 렌더링된 React 엘리먼트
   - D. `'use server'`가 표시된 Server Function 참조

   <details><summary>정답 보기</summary>

   정답: A, C, D. 일반 함수는 직렬화할 수 없어 경계를 통과하지 못한다.

   </details>

## 챕터 요약

- Server Component 코드는 서버에만 남고 Client Component 코드는 브라우저에도 전달된다.
- Client Component도 최초 HTML을 위해 서버에서 렌더링될 수 있다.
- 서버 데이터는 직렬화 가능한 props와 RSC payload를 통해 클라이언트 경계를 지난다.
- 브라우저 상태와 이벤트가 필요한 영역에만 Client Component를 둔다.
- React 엘리먼트를 `children`으로 넘기면 클라이언트 부모 안에 서버 출력을 합성할 수 있다.
