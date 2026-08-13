# unauthorized.js

- 공식 문서: [unauthorized.js](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 인증되지 않은 요청에 401과 로그인 UI를 제공한다.
- `unauthorized()` 호출과 파일 UI의 책임을 구분한다.

## 핵심 개념 및 설명

**unauthorized** 파일은 인증 시 [`unauthorized`](../3.3-functions/unauthorized.md) 함수 호출 시 UI를 렌더링하는 데 사용된다. UI를 사용자 정의할 수 있는 것과 함께 Next.js는 `401` 상태 코드를 반환한다.

```tsx filename="app/unauthorized.tsx" switcher
import Login from '@/app/components/Login'

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

```jsx filename="app/unauthorized.js" switcher
import Login from '@/app/components/Login'

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

<a id="reference"></a>
### 참조

<a id="props"></a>
#### prop

`unauthorized.js` 컴포넌트는 prop을 허용하지 않는다.

<a id="examples"></a>
### 예제

<a id="displaying-login-ui-to-unauthenticated-users"></a>
#### 인증되지 않은 사용자에게 로그인 UI 표시

[`unauthorized`](../3.3-functions/unauthorized.md) 기능을 사용하여 로그인 UI로 `unauthorized.js` 파일을 렌더링할 수 있다.

```tsx filename="app/dashboard/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return <div>Dashboard</div>
}
```

```jsx filename="app/dashboard/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return <div>Dashboard</div>
}
```

```tsx filename="app/unauthorized.tsx" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

```jsx filename="app/unauthorized.js" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ----------------------------- |
| `v15.1.0` | `unauthorized.js`가 출시되었다. |

## 예제 및 데모 설계

- Phase 2에서 dashboard 진입 전 session을 검사하고 없으면 로그인 UI를 표시한다.
- 401과 403 시나리오를 나란히 테스트한다.

## 연습 문제

1. 로그인하지 않은 사용자에게 맞는 상태는?
   - A. 401
   - B. 403
   - C. 500

<details><summary>정답 보기</summary>

정답: A. `unauthorized.js`는 인증되지 않은 요청을 처리한다.
</details>

## 챕터 요약

- `unauthorized.js`는 `unauthorized()`의 UI다.
- 응답 상태 코드는 401이다.
- 로그인 UI를 제공할 수 있다.
- 403 권한 부족과 구분한다.
- 현재 experimental이다.
