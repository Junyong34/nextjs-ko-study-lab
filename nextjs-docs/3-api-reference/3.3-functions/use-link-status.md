# useLinkStatus

- 공식 문서: [useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- [`<Link>`](../3.2-components/link.md) 컴포넌트의 클릭 및 내비게이션 **대기(pending) 상태**를 추적하는 `useLinkStatus` 훅의 사용법을 익힌다.
- `useLinkStatus`가 유용한 상황(prefetch가 꺼져 있거나 지연되는 경우)과 불필요한 상황([`loading.js`](../3.1-file-conventions/loading.md) 기반 즉각 전환)을 구분한다.
- 반드시 `<Link>`의 자손(descendant) 컴포넌트 내부에서 호출해야 하는 구조적 제약을 이해한다.
- 내비게이션이 매우 빠를 때 발생하는 UI 깜빡임을 방지하기 위한 CSS 딜레이 기법을 적용한다.

## 핵심 개념 및 설명

`useLinkStatus`는 [`<Link>`](../3.2-components/link.md) 컴포넌트의 **대기(pending)** 상태를 추적할 수 있게 해주는 훅이다. 사용자가 링크를 클릭한 후 내비게이션이 완료될 때까지 클릭된 링크 위에 미세한 인라인 피드백(스피너, 펄스 애니메이션 등)을 표시할 때 사용된다.

일반적으로는 `loading.js`를 사용한 라우트 수준 fallback과 즉각적인 전환을 위한 prefetch가 권장된다.

`useLinkStatus`는 주로 다음과 같은 상황에서 유용하다:

- [prefetch](../../1-getting-started/linking-and-navigating.md#prefetching)가 비활성화(`prefetch={false}`)되어 있거나 진행 중이어서 내비게이션이 지연되는 경우.
- 대상 라우트가 다이나믹 렌더링되고 즉각적인 내비게이션을 제공하는 [`loading.js`](../3.1-file-conventions/loading.md) 파일이 없는 경우.

```tsx filename="app/hint.tsx" switcher
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Hint() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}

export default function Header() {
  return (
    <header>
      <Link href="/dashboard" prefetch={false}>
        <span className="label">대시보드</span> <Hint />
      </Link>
    </header>
  )
}
```

```jsx filename="app/hint.js" switcher
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Hint() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}

export default function Header() {
  return (
    <header>
      <Link href="/dashboard" prefetch={false}>
        <span className="label">대시보드</span> <Hint />
      </Link>
    </header>
  )
}
```

> **알아두면 좋은 점**:
>
> - `useLinkStatus`는 **반드시 `<Link>` 컴포넌트의 자손(하위) 컴포넌트 내부에서 호출**되어야 한다.
> - 이 훅은 `<Link>` 컴포넌트에 `prefetch={false}`가 명시적으로 설정되어 있을 때 가장 유용하다.
> - 연결된 라우트가 이미 prefetch 완료된 상태라면 pending 상태는 건너뛰어진다.
> - 여러 링크를 연속해서 빠르게 클릭하면 마지막으로 클릭한 링크의 pending 상태만 표시된다.
> - Pages Router에서는 지원되지 않으며 항상 `{ pending: false }`를 반환한다.
> - 인라인 인디케이터는 레이아웃 이동(Layout Shift)을 유발하기 쉽다. 고정 크기의 힌트 요소를 항상 렌더링해두고 `opacity`나 애니메이션만 켜고 끄는 방식을 권장한다.

### `useLinkStatus`가 불필요한 경우

인라인 피드백을 추가하기 전에 다음 사항을 먼저 검토한다:

- 대상 페이지가 정적이며 프로덕션에서 자동으로 prefetch되어 pending 단계가 생략되는지 확인한다.
- 대상 라우트에 `loading.js`가 존재하여 라우트 수준 fallback을 통해 즉각 전환되는지 확인한다.

### 매개변수 (Parameters)

```tsx filename="app/hint.tsx"
const { pending } = useLinkStatus()
```

`useLinkStatus`는 인자를 받지 않는다.

### 반환값 (Returns)

단일 `pending` 속성을 갖는 객체를 반환한다:

| 속성 | 타입 | 설명 |
|---|---|---|
| `pending` | `boolean` | 브라우저 히스토리가 업데이트되기 전까지 `true`, 완료 후 `false` |

### 예제

#### 1. 인라인 링크 힌트 컴포넌트

레이아웃에 영향을 주지 않는 고정 크기 힌트 컴포넌트를 구성한다:

```tsx filename="app/components/loading-indicator.tsx" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```tsx filename="app/shop/layout.tsx" switcher
import Link from 'next/link'
import LoadingIndicator from './components/loading-indicator'

const links = [
  { href: '/shop/electronics', label: '전자제품' },
  { href: '/shop/clothing', label: '의류' },
  { href: '/shop/books', label: '도서' },
]

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b">
        {links.map((link) => (
          <Link key={link.label} href={link.href} prefetch={false} className="flex items-center">
            <span>{link.label}</span>
            <LoadingIndicator />
          </Link>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

#### 2. 빠른 내비게이션 시 깜빡임 방지 (CSS 지연 애니메이션)

내비게이션이 매우 빠르게 끝나면 힌트가 깜빡이듯 순간적으로 나타나 사용자 경험을 해칠 수 있다. 초기 애니메이션 딜레이(예: 100ms)를 설정하여 실제 로딩 시간이 걸릴 때만 힌트가 나타나도록 처리한다:

```css filename="app/styles/global.css"
.link-hint {
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.25rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0;
  visibility: hidden; /* 공간만 확보하고 숨김 */
}

.link-hint.is-pending {
  visibility: visible;
  animation-name: fadeIn, pulse;
  animation-duration: 200ms, 1s;
  /* 실제로 시간이 걸릴 때만 표시되도록 딜레이 적용 */
  animation-delay: 100ms, 100ms;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: forwards, none;
}

@keyframes fadeIn {
  to {
    opacity: 0.35;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.15;
  }
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.3.0` | `useLinkStatus` 도입 |

## 예제 및 데모 설계

- 상단 헤더 메뉴에서 `prefetch={false}`가 지정된 링크 클릭 시 `pending` 상태가 활성화되어 작은 로딩 점이 나타나는 데모를 설계한다.
- CSS 딜레이(100ms) 적용 여부에 따른 체감 사용자 경험 비교 시나리오를 구성한다.
- `<Link>` 컴포넌트 외부에서 호출했을 때의 동작 제한 사항을 검증한다.

## 연습 문제

1. `useLinkStatus` 훅을 올바르게 사용하기 위한 필수 조건은?
   - A. `next/navigation`에서 임포트해야 한다.
   - B. 반드시 `<Link>` 컴포넌트의 자손(하위) 컴포넌트 내부에서 호출되어야 한다.
   - C. Server Component 내부에서만 호출되어야 한다.
   - D. `next.config.js`에서 실험적 플래그를 켜야 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `useLinkStatus`는 `next/link`에서 임포트되며, 반드시 대상 `<Link>` 컴포넌트의 자손 컴포넌트 안에서 호출되어야 해당 링크의 pending 상태를 감지할 수 있다.
</details>

2. `useLinkStatus`의 `pending` 상태가 건너뛰어지는(항상 `false`로 유지되는) 경우는?
   - A. 대상 라우트가 이미 클라이언트에 prefetch 완료된 경우
   - B. `prefetch={false}`가 명시된 경우
   - C. 대상 라우트에 `loading.js`가 없는 경우
   - D. 네트워크 속도가 느린 경우

<details><summary>정답 보기</summary>

정답: **A**  
해설: 대상 라우트가 이미 prefetch되어 즉각 전환이 가능한 경우, 대기 상태가 발생하지 않아 pending 상태가 생략된다.
</details>

## 챕터 요약

- `useLinkStatus`는 `next/link`에서 제공하는 훅으로, `<Link>` 클릭 후 전환 대기(`pending`) 상태를 감지한다.
- 반드시 `<Link>` 컴포넌트의 하위 자손 컴포넌트 내부에서 호출해야 한다.
- prefetch가 꺼져 있거나 지연되는 다이나믹 라우트 내비게이션 시 인라인 피드백을 제공하기에 적합하다.
- 이미 prefetch 완료된 라우트로 이동할 때는 pending 상태가 생략된다.
- 빠른 내비게이션 시의 깜빡임을 방지하기 위해 CSS `animation-delay` 기법을 적용할 수 있다.
