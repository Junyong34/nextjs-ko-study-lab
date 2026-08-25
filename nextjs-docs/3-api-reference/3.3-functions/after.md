# after

- 공식 문서: [after](https://nextjs.org/docs/app/api-reference/functions/after)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- HTTP 응답이나 정적 prerender가 완료된 직후 비차단(non-blocking) 백그라운드 작업을 예약하는 `after` 함수의 역할을 이해한다.
- 사용자 응답 시간을 지연시키지 않고 로깅, 감사 로그, 외부 분석 전송 등의 부수 효과를 처리한다.
- Server Component와 Route Handler / Server Function 간의 `cookies()` / `headers()` 접근 규칙 차이를 파악한다.
- 응답 실패(`notFound()`, `redirect()`, 예외 발생) 시에도 실행되는 `after`의 신뢰성 보장 특성을 확인한다.

## 핵심 개념 및 설명

`after`는 클라이언트에게 HTTP 응답이 완전히 전송되었거나(또는 prerender가 끝난 후) 실행될 작업을 예약할 수 있게 해주는 함수다. 응답 시간을 지연시키지 않아야 하는 로깅, 메트릭 수집, 분석 데이터 전송 등의 부수 효과 작업에 이상적이다.

`after`는 [Server Component](../../1-getting-started/server-and-client-components.md)(`generateMetadata` 포함), [Server Function](../../1-getting-started/mutating-data.md), [Route Handler](../3.1-file-conventions/route.md), [Proxy](../3.1-file-conventions/proxy.md)에서 사용할 수 있다.

```tsx filename="app/layout.tsx" switcher
import { after } from 'next/server'
import { logUserAccess } from '@/app/utils'

export default function Layout({ children }: { children: React.ReactNode }) {
  after(() => {
    // 레이아웃이 렌더링되어 사용자에게 전송된 후 백그라운드에서 실행된다
    logUserAccess()
  })

  return <>{children}</>
}
```

```jsx filename="app/layout.jsx" switcher
import { after } from 'next/server'
import { logUserAccess } from '@/app/utils'

export default function Layout({ children }) {
  after(() => {
    logUserAccess()
  })

  return <>{children}</>
}
```

> **알아두면 좋은 점**:
>
> - `after`는 요청 시점 API(Request-time API)가 아니므로 호출한다고 해서 정적 페이지가 다이나믹 라우트로 강제 전환되지 않는다. 정적 페이지에서는 빌드 시점 또는 revalidation 시점에 실행된다.
> - 응답 도중 에러가 던져지거나 [`notFound()`](./not-found.md), [`redirect()`](./redirect.md)가 호출되더라도 `after` 콜백은 항상 실행된다.
> - 서버리스 환경에서는 플랫폼의 `waitUntil` 프리미티브를 활용하여 응답 반환 후에도 함수 인스턴스가 유지되도록 동작한다. 최대 실행 시간은 [`maxDuration`](../3.1-file-conventions/3.1.22-route-segment-config/maxDuration.md) 설정에 따른다.

### 실행 위치별 요청 API(`cookies`, `headers`) 접근 규칙

#### 1. Route Handler 및 Server Function

콜백 내부에서 `cookies()`와 `headers()`를 **직접 호출**할 수 있다:

```ts filename="app/api/route.ts" switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logAnalytics } from '@/app/utils'

export async function POST(request: Request) {
  // 메인 뮤테이션 수행...

  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionId = (await cookies()).get('session-id')?.value || 'guest'
    await logAnalytics({ sessionId, userAgent })
  })

  return Response.json({ success: true })
}
```

```js filename="app/api/route.js" switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logAnalytics } from '@/app/utils'

export async function POST(request) {
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionId = (await cookies()).get('session-id')?.value || 'guest'
    await logAnalytics({ sessionId, userAgent })
  })

  return Response.json({ success: true })
}
```

#### 2. Server Component (Page, Layout)

Server Component에서는 `after` 콜백 내부에서 `cookies()`나 `headers()`를 직접 호출할 수 없다 (런타임 에러 발생). 대신 컴포넌트 렌더링 본문에서 값을 미리 읽어 클로저로 전달해야 한다:

```tsx filename="app/page.tsx" switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logPageVisit } from '@/app/utils'

export default async function Page() {
  // 렌더링 주기 내에서 미리 요청 데이터를 조회
  const userAgent = (await headers()).get('user-agent') || 'unknown'
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  after(() => {
    // 미리 읽은 변수를 클로저를 통해 전달
    logPageVisit({ sessionId, userAgent })
  })

  return <h1>메인 페이지</h1>
}
```

```jsx filename="app/page.jsx" switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logPageVisit } from '@/app/utils'

export default async function Page() {
  const userAgent = (await headers()).get('user-agent') || 'unknown'
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  after(() => {
    logPageVisit({ sessionId, userAgent })
  })

  return <h1>메인 페이지</h1>
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v15.1.0` | `after` 함수 안정화 (Stabilized) |
| `v15.0.0-rc` | `unstable_after` 도입 |

## 예제 및 데모 설계

- 사용자 주문 처리 Server Action에서 결제 완료 즉시 사용자에게 응답을 반환하고, `after()`를 통해 외부 ERP 시스템 동기화 및 이메일 발송 작업을 백그라운드로 처리하는 시나리오를 구성한다.
- `notFound()`가 호출되어 404 페이지가 렌더링되더라도 `after()` 내부의 통계 집계 로깅이 정상 실행되는지 확인한다.
- Server Component에서 `after` 내부 `cookies()` 직접 호출 시 발생하는 에러를 확인하고 클로저 사전 조회 패턴으로 해결하는 실습을 진행한다.

## 연습 문제

1. `after` 함수를 사용하는 주요 목적으로 올바른 것은?
   - A. 사용자 브라우저의 DOM 렌더링을 차단하여 동기화한다.
   - B. 클라이언트에게 HTTP 응답을 전송한 후, 응답 시간을 지연시키지 않고 백그라운드 부수 작업(로깅, 분석 등)을 실행한다.
   - C. Client Component의 `useEffect`를 대체한다.
   - D. 데이터베이스의 스키마 마이그레이션을 자동 실행한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `after`는 HTTP 응답 전송 완료 후 실행되는 비차단 백그라운드 작업을 예약하여 사용자 체감 응답 속도를 극대화한다.
</details>

2. Server Component 내부에서 `after`를 사용할 때 요청 헤더나 쿠키 정보를 다루는 올바른 방법은?
   - A. `after` 콜백 함수 내부에서 `await cookies()`를 직접 호출한다.
   - B. 컴포넌트 본문(렌더링 주기)에서 미리 `await cookies()`로 값을 읽은 뒤 클로저를 통해 `after` 콜백으로 넘긴다.
   - C. `localStorage`에 저장한 후 읽어온다.
   - D. `after`에서는 쿠키나 헤더 정보를 일절 참조할 수 없다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: Server Component는 부분 사전 렌더링(PPR) 및 캐시 추적을 위해 렌더링 단계에서 요청 데이터를 확인해야 하므로, `after` 내부 직접 호출 대신 컴포넌트 본문에서 미리 읽어 클로저로 전달해야 한다.
</details>

## 챕터 요약

- `after`는 응답 전송 또는 prerender 완료 후 비차단으로 실행되는 작업을 등록하는 `next/server`의 함수다.
- 사용자 응답 속도에 영향을 주지 않고 로깅, 분석 데이터 전송, 알림 전송 등을 수행한다.
- 에러 발생이나 `redirect`, `notFound` 상황에서도 실행이 보장된다.
- Route Handler와 Server Function에서는 콜백 내에서 `cookies()`/`headers()` 직접 조회가 가능하지만, Server Component에서는 본문에서 사전 조회하여 전달해야 한다.
- Next.js 15.1부터 안정화(Stable)되었다.
