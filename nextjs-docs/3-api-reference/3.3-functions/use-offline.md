# useOffline

- 공식 문서: [useOffline](https://nextjs.org/docs/app/api-reference/functions/use-offline)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 클라이언트 기기의 오프라인 연결 상태를 실시간 감지하는 `useOffline` 훅의 역할을 이해한다.
- `next.config.ts`에서 `experimental.useOffline` 옵션을 활성화하여 네트워크 감지 및 자동 재시도 기능을 구성한다.
- 오프라인 안내 배너 및 네트워크 상태 인식 [`loading.tsx`](../3.1-file-conventions/loading.md) Suspense 폴백을 구현한다.
- PWA(Progressive Web App) 환경에서 네트워크 단절 및 복구 시의 UX 흐름을 파악한다.

## 핵심 개념 및 설명

`useOffline`은 사용자의 브라우저 네트워크 연결이 끊겼는지 여부를 나타내는 불리언(`boolean`) 값을 반환하는 `next/offline`의 React 클라이언트 훅이다.

인터넷 연결이 유실되었을 때 경고 배너를 띄우거나, 스트리밍 지연 시 오프라인 상태임을 사용자에게 명확히 알려주는 UX를 만들 때 사용된다.

### 활성화 방법 (Configuration)

`useOffline` 훅을 사용하려면 `next.config.ts`에 실험적 플래그를 설정해야 한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useOffline: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useOffline: true,
  },
}

module.exports = nextConfig
```

> **알아두면 좋은 점**:
>
> - `experimental.useOffline` 플래그가 비활성화되어 있으면 `useOffline()`은 항상 `false`를 반환한다.
> - `useOffline`은 **Client Component**(`'use client'`)에서만 호출할 수 있다.
> - 오프라인 상태에서 네트워크가 다시 연결되면, Next.js가 차단되었던 네비게이션, 프리패치, Server Action 요청을 자동으로 재시도한다.

### 시그니처 및 반환값

```tsx
const isOffline: boolean = useOffline()
```

- `true`: 앱이 현재 오프라인 상태임 (네트워크 요청 실패 또는 브라우저 `offline` 이벤트 발생).
- `false`: 온라인 상태이거나 서버 렌더링 중(하이드레이션 이전 기본값).

### 예제

#### 1. 루트 레이아웃에 전역 오프라인 배너 배치

```tsx filename="app/components/offline-banner.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <aside
      role="status"
      className="w-full bg-amber-500 text-white text-center py-2 text-sm font-medium sticky top-0 z-50"
    >
      현재 오프라인 상태입니다. 네트워크 연결을 확인해 주세요.
    </aside>
  )
}
```

```jsx filename="app/components/offline-banner.js" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <aside
      role="status"
      className="w-full bg-amber-500 text-white text-center py-2 text-sm font-medium sticky top-0 z-50"
    >
      현재 오프라인 상태입니다. 네트워크 연결을 확인해 주세요.
    </aside>
  )
}
```

#### 2. 오프라인 인식 Suspense 로딩 폴백

```tsx filename="app/feed/loading.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export default function Loading() {
  const isOffline = useOffline()

  return (
    <div className="p-8 text-center text-gray-500">
      {isOffline
        ? '네트워크 연결이 복구되면 피드를 불러옵니다...'
        : '피드를 불러오는 중입니다...'}
    </div>
  )
}
```

```jsx filename="app/feed/loading.js" switcher
'use client'

import { useOffline } from 'next/offline'

export default function Loading() {
  const isOffline = useOffline()

  return (
    <div className="p-8 text-center text-gray-500">
      {isOffline
        ? '네트워크 연결이 복구되면 피드를 불러옵니다...'
        : '피드를 불러오는 중입니다...'}
    </div>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.x.0` | `useOffline` 훅 도입 (실험적 기능) |

## 예제 및 데모 설계

- 개발자 도구의 Network 탭에서 `Offline` 모드로 전환했을 때 상단 오프라인 경고 배너가 즉각 노출되는지 확인한다.
- 오프라인 상태에서 페이지 이동 시 프리패치된 정적 껍데기가 먼저 뜨고, 본문 로딩 영역에 오프라인 대기 안내 문구가 표시되는지 검증한다.
- 네트워크를 다시 `Online`으로 복원했을 때 배너가 사라지고 보류된 데이터가 자동으로 스트리밍되는 회복 동작을 테스트한다.

## 연습 문제

1. `useOffline` 훅을 사용하기 위해 `next.config.ts`에 활성화해야 하는 실험적 옵션은?
   - A. `experimental: { pwa: true }`
   - B. `experimental: { useOffline: true }`
   - C. `experimental: { networkStatus: true }`
   - D. `experimental: { offlineMode: true }`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `experimental: { useOffline: true }` 플래그를 활성화해야 오프라인 연결 감지 및 자동 재시도 기능이 동작한다.
</details>

2. `useOffline` 훅을 호출할 수 있는 컴포넌트 환경은?
   - A. Server Component
   - B. Route Handler
   - C. Client Component (`'use client'`)
   - D. `layout.tsx` (서버 컴포넌트)

<details><summary>정답 보기</summary>

정답: **C**  
해설: `useOffline`은 브라우저의 네트워크 연결 이벤트를 감지하는 React 클라이언트 훅이므로 Client Component에서만 사용 가능하다.
</details>

## 챕터 요약

- `useOffline`은 기기의 오프라인 여부를 감지하는 `next/offline`의 클라이언트 훅이다.
- `experimental.useOffline: true` 설정이 필요하다.
- 오프라인 상태 감지 시 배너 노출 및 전용 Suspense 로딩 안내를 구현할 수 있다.
- 네트워크가 복원되면 보류된 요청(네비게이션, Server Action)이 자동 재시도된다.
