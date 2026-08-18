# unauthorized

- 공식 문서: [unauthorized](https://nextjs.org/docs/app/api-reference/functions/unauthorized)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 로그인하지 않은 미인증 사용자에게 Next.js의 401 Unauthorized 화면을 렌더링하도록 예외를 던지는 `unauthorized` 함수의 역할을 이해한다.
- `unauthorized`와 [`forbidden`](./forbidden.md)의 의미적 차이(인증 누락 401 vs 권한 부족 403)를 명확히 구분한다.
- [`unauthorized.tsx`](../3.1-file-conventions/unauthorized.md) 경계 컴포넌트를 생성하여 로그인 폼이나 안내 메시지를 렌더링하는 구조를 구현한다.
- 데이터 접근 계층(DAL), Server Action, Route Handler에서 세션 미확인 시 인터럽트를 발생시키는 보안 패턴을 적용한다.

## 핵심 개념 및 설명

`unauthorized()`는 내부적으로 `NEXT_HTTP_ERROR_FALLBACK;401` 예외를 발생시켜 현재 세그먼트의 렌더링을 중단하고 가장 가까운 [`unauthorized.tsx`](../3.1-file-conventions/unauthorized.md) UI를 렌더링하게 만드는 함수다.

사용자가 로그인하지 않았거나 세션이 만료된 상태에서 보호된 페이지나 기능에 접근할 때 호출한다.

### 활성화 방법 (Usage)

`unauthorized`를 사용하려면 `next.config.ts` 파일에서 실험적 플래그인 `authInterrupts`를 활성화해야 한다:

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

`unauthorized`는 [Server Component](../../1-getting-started/server-and-client-components.md), [Server Function](../../1-getting-started/mutating-data.md), [Route Handler](../3.1-file-conventions/route.md)에서 호출할 수 있다. 단, **루트 레이아웃(`app/layout.tsx`)에서는 호출할 수 없다.**

```tsx filename="app/dashboard/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  // 세션이 없으면 401 Unauthorized 발생
  if (!session) {
    unauthorized()
  }

  return (
    <main>
      <h1>대시보드</h1>
      <p>환영합니다, {session.user.name}님!</p>
    </main>
  )
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

  return (
    <main>
      <h1>대시보드</h1>
      <p>환영합니다, {session.user.name}님!</p>
    </main>
  )
}
```

> **알아두면 좋은 점**:
>
> - `unauthorized()`는 예외를 던져 실행을 중단하므로 `return unauthorized()`를 작성할 필요가 없다 (TypeScript 반환 타입 `never`).
> - 검색 엔진에 인증 실패 페이지가 노출되지 않도록 `<meta name="robots" content="noindex" />` 태그가 자동으로 삽입된다.
> - `unauthorized.tsx` 파일에 로그인 폼이나 안내 링크를 배치하여 미인증 사용자에게 자연스러운 로그인 유도 UI를 제공할 수 있다.

### `unauthorized` vs `forbidden` 차이점

| 함수 | HTTP 상태코드 | 발생 시점 | 권장 UI |
|---|---|---|---|
| `unauthorized()` | **401 Unauthorized** | **로그인하지 않은 경우** (인증 실패) | 로그인 폼 또는 로그인 버튼 링크 |
| `forbidden()` | **403 Forbidden** | **로그인은 되었으나 권한(Role)이 부족한 경우** | 접근 권한 부족 안내 또는 홈 이동 버튼 |

### 예제

#### 1. 미인증 사용자에게 로그인 UI 제공 (`unauthorized.tsx`)

```tsx filename="app/account/unauthorized.tsx" switcher
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">401 - 로그인이 필요합니다</h1>
      <p className="mt-2 text-gray-600">
        계정 정보를 확인하려면 <Link href="/login" className="text-blue-500 underline">로그인</Link>해 주세요.
      </p>
    </main>
  )
}
```

```jsx filename="app/account/unauthorized.js" switcher
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">401 - 로그인이 필요합니다</h1>
      <p className="mt-2 text-gray-600">
        계정 정보를 확인하려면 <Link href="/login" className="text-blue-500 underline">로그인</Link>해 주세요.
      </p>
    </main>
  )
}
```

#### 2. Route Handler에서 인증 보호

```tsx filename="app/api/profile/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await verifySession()

  if (!session) {
    unauthorized() // 401 반환 및 unauthorized.tsx 렌더링
  }

  const profile = await db.profile.findUnique({ where: { userId: session.userId } })
  return NextResponse.json(profile)
}
```

```jsx filename="app/api/profile/route.js" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export async function GET() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  const profile = await db.profile.findUnique({ where: { userId: session.userId } })
  return Response.json(profile)
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.1.0` | `unauthorized` 도입 (`authInterrupts` 플래그 필요) |

## 예제 및 데모 설계

- 비로그인 상태로 `/account` 라우트에 진입했을 때 `app/account/unauthorized.tsx`에 구성된 로그인 유도 컴포넌트가 즉시 노출되는지 확인한다.
- `<Suspense>` 경계 내부의 비동기 컴포넌트에서 `unauthorized()`를 던졌을 때 상위 네비게이션 바는 유지된 채 본문만 401 UI로 교체되는 스트리밍 동작을 검증한다.
- Server Action에서 세션 유효성 검사 실패 시 `unauthorized()` 호출로 안전하게 차단되는지 확인한다.

## 연습 문제

1. `unauthorized()`와 `forbidden()`의 올바른 사용 구분은?
   - A. `unauthorized()`는 관리자 전용 페이지에, `forbidden()`은 게스트 사용자에게 사용한다.
   - B. `unauthorized()`는 로그인하지 않은 사용자(인증 실패)에게, `forbidden()`은 로그인했으나 권한이 부족한 사용자(인가 실패)에게 사용한다.
   - C. 두 함수는 완전히 동일하며 별칭(alias) 관계다.
   - D. `unauthorized()`는 Client Component에서만 사용된다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 401 `unauthorized`는 사용자의 신원 인증이 되지 않은 상태(미로그인)를 처리하며, 403 `forbidden`은 인증된 사용자의 권한 부족 상태를 처리한다.
</details>

2. `unauthorized()` 함수 호출 시 자동으로 주입되는 메타 태그는?
   - A. `<meta name="keywords" content="auth" />`
   - B. `<meta name="robots" content="noindex" />`
   - C. `<meta name="viewport" content="width=device-width" />`
   - D. `<meta name="theme-color" content="#ffffff" />`

<details><summary>정답 보기</summary>

정답: **B**  
해설: 미인증 오류 페이지가 검색 엔진 결과에 수집되지 않도록 `<meta name="robots" content="noindex" />`가 자동으로 삽입된다.
</details>

## 챕터 요약

- `unauthorized()`는 미인증 사용자에게 401 Unauthorized 화면을 렌더링하는 함수다.
- `next.config.ts`의 `experimental.authInterrupts: true` 설정이 필요하다.
- 인증이 필요한 보호된 라우트, Server Action, Route Handler에서 세션 부재 시 호출한다.
- `unauthorized.tsx` 파일과 연동하여 커스텀 로그인 유도 화면을 제공할 수 있다.
- 검색 엔진 수집 방지를 위해 `noindex` 메타 태그를 자동 주입한다.
