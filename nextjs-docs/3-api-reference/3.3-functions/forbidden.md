# forbidden

- 공식 문서: [forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 권한이 없는 사용자에게 Next.js의 403 Forbidden 화면을 렌더링하도록 예외를 발생시키는 `forbidden` 함수의 역할을 이해한다.
- `next.config.ts`에서 `experimental.authInterrupts` 플래그를 활성화하여 `forbidden` 및 `unauthorized` 기능을 구성한다.
- 데이터 접근 계층(DAL) 및 Server Action에서 역할 기반 접근 제어(RBAC) 패턴을 구현한다.
- [`forbidden.tsx`](../3.1-file-conventions/forbidden.md) 경계 파일 및 `noindex` 메타 태그 삽입 동작을 파악한다.

## 핵심 개념 및 설명

`forbidden()`은 내부적으로 `NEXT_HTTP_ERROR_FALLBACK;403` 예외를 발생시켜 현재 세그먼트의 렌더링을 중단하고 가장 가까운 [`forbidden.tsx`](../3.1-file-conventions/forbidden.md) UI를 렌더링하게 만드는 함수다.

인증은 완료되었으나 특정 리소스에 접근할 권한(예: 관리자 역할 등)이 부족한 사용자를 차단할 때 사용된다.

### 활성화 방법 (Usage)

`forbidden`을 사용하려면 `next.config.ts` 파일에서 실험적 플래그인 `authInterrupts`를 활성화해야 한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

module.exports = nextConfig
```

`forbidden`은 [Server Component](../../1-getting-started/server-and-client-components.md), [Server Function](../../1-getting-started/mutating-data.md), [Route Handler](../3.1-file-conventions/route.md)에서 호출할 수 있다. 단, **루트 레이아웃(`app/layout.tsx`)에서는 호출할 수 없다.**

```tsx filename="app/admin/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // 사용자의 역할이 'admin'이 아니면 403 Forbidden 발생
  if (session.role !== 'admin') {
    forbidden()
  }

  return <div>관리자 전용 대시보드</div>
}
```

```jsx filename="app/admin/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  if (session.role !== 'admin') {
    forbidden()
  }

  return <div>관리자 전용 대시보드</div>
}
```

> **알아두면 좋은 점**:
>
> - `forbidden()`은 예외를 던지므로 `return forbidden()`을 작성할 필요가 없다 (TypeScript 반환 타입 `never`).
> - 검색 엔진에 권한 오류 페이지가 색인되지 않도록 `<meta name="robots" content="noindex" />` 태그가 자동으로 주입된다.
> - 비동기 Promise를 `await`하지 않고 방치한 채 내부에서 `forbidden()`을 부르면 `unhandledRejection` 에러가 발생하므로 반드시 렌더링 경로에서 `await`해야 한다.

### 예제

#### 1. Server Action에서 역할 권한 검증

```ts filename="app/actions/update-role.ts" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export async function updateRole(formData: FormData) {
  const session = await verifySession()

  if (session.role !== 'admin') {
    forbidden() // 권한 없는 수정 요청 차단
  }

  // 관리자 권한으로 역할 업데이트 로직 수행
}
```

```js filename="app/actions/update-role.js" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export async function updateRole(formData) {
  const session = await verifySession()

  if (session.role !== 'admin') {
    forbidden()
  }
}
```

#### 2. Suspense 스트리밍 내부에서의 403 처리

데이터 접근 함수 내부에서 세션을 확인하고 권한이 없으면 `forbidden()`을 던진다. 이 경우 상위 정적 껍데기는 유지된 채 해당 Suspense 영역만 `forbidden.tsx`로 교체된다:

```tsx filename="app/projects/page.tsx"
import { Suspense } from 'react'
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

async function ProjectList() {
  const session = await verifySession()
  if (session.role !== 'manager') {
    forbidden()
  }
  const projects = await db.project.findMany()
  return <ul>{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>프로젝트 관리</h1>
      <Suspense fallback={<p>권한 확인 및 데이터 로딩 중...</p>}>
        <ProjectList />
      </Suspense>
    </main>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.1.0` | `forbidden` 도입 (`authInterrupts` 플래그 필요) |

## 예제 및 데모 설계

- 일반 사용자 계정으로 `/admin` 페이지 접근 시 `app/admin/forbidden.tsx`에 선언된 403 커스텀 안내 페이지가 렌더링되는지 확인한다.
- `authInterrupts: true` 설정을 끈 상태에서 `forbidden()` 호출 시 발생하는 설정 안내 오류를 확인한다.
- Server Action에서 권한 검증 실패 시 `forbidden()` 예외가 적절히 클라이언트에 처리되는지 테스트한다.

## 연습 문제

1. `forbidden()` 함수를 사용하기 위해 `next.config.ts`에 설정해야 하는 옵션은?
   - A. `cacheComponents: true`
   - B. `experimental: { authInterrupts: true }`
   - C. `serverActions: true`
   - D. `reactStrictMode: false`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `forbidden()` 및 `unauthorized()` 함수를 사용하려면 `experimental: { authInterrupts: true }` 설정이 활성화되어 있어야 한다.
</details>

2. 다음 중 `forbidden()`을 호출할 수 **없는** 위치는?
   - A. Server Component (Page)
   - B. 루트 레이아웃 (`app/layout.tsx`)
   - C. Route Handler
   - D. Server Action

<details><summary>정답 보기</summary>

정답: **B**  
해설: `forbidden`은 전체 애플리케이션의 최상위 경계인 루트 레이아웃(`app/layout.tsx`)에서는 호출할 수 없다.
</details>

## 챕터 요약

- `forbidden()`은 권한 부족 시 403 Forbidden 화면을 렌더링하도록 인터럽트 예외를 발생시키는 함수다.
- `next.config.ts`의 `experimental.authInterrupts: true` 설정이 필요하다.
- `unauthorized`(로그인 필요)와 달리, 로그인된 사용자의 권한(Role) 부족 상황을 처리한다.
- Server Component, Server Function, Route Handler에서 호출 가능하며 루트 레이아웃에서는 불가하다.
- 자동 `noindex` 메타 태그 주입 및 `forbidden.tsx` 경계 연동을 지원한다.
