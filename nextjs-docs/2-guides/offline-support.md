# Offline support

- 공식 문서: [Offline support](https://nextjs.org/docs/app/guides/offline-support)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `experimental.useOffline`이 재시도하는 요청과 재시도하지 않는 요청을 구분한다.
- App Shell과 Suspense fallback에 연결 상태 피드백을 설계한다.
- 네트워크가 돌아온 뒤 Server Action을 자동 재개하는 UI를 만든다.
- 운영 빌드에서 연결 끊김과 복구 흐름을 검증한다.

## 핵심 개념 및 설명

> **실험적 기능**: 이 기능은 현재 실험적이며 변경될 수 있다. 운영 환경에는 권장하지 않는다.

soft navigation, 데이터 fetch, mutation 중 네트워크가 끊기면 보통 클라이언트 오류가 발생한다. `experimental.useOffline`을 활성화하면 내비게이션, RSC 데이터 fetch, prefetch, Server Action 요청이 오프라인일 때 오류를 던지지 않는다. Next.js가 요청을 pending으로 유지하고 연결이 돌아오면 재시도한다.

그동안 UI는 Suspense fallback이나 Server Action transition의 pending 상태에 머문다. [`useOffline`](../3-api-reference/3.3-functions/use-offline.md) 훅으로 느린 서버와 연결 끊김을 구분해 사용자에게 알린다. Client Component에서 직접 호출한 `fetch()`와 React Query·SWR 요청은 각 라이브러리의 재시도 정책을 따른다.

### 예제

공식 예제는 매 요청마다 최신 metrics를 가져오는 대시보드와 Server Action을 호출하는 ping 폼을 만든다. `/without-feedback`은 일반 loading 문구를, `/with-feedback`은 연결 상태를 반영한 문구를 보여준다.

- 소스: [github.com/vercel-labs/use-offline](https://github.com/vercel-labs/use-offline)
- 데모: [use-offline.labs.vercel.dev](https://use-offline.labs.vercel.dev/)

### 오프라인 감지 활성화와 기본 동작

`experimental.useOffline`을 켠다. 공식 예제는 [`cacheComponents`](../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)와 [`partialPrefetching`](../3-api-reference/3.5-config/3.5.1-next-config-js/partialPrefetching.md)도 활성화한다. Cache Components는 캐시하지 않은 데이터 가까이에 Suspense 경계를 두고 주변 [App Shell](../4-glossary/README.md)을 렌더링한다. Partial Prefetching은 `<Link>`가 그 App Shell을 prefetch하게 한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { useOffline: true },
}

export default nextConfig
```

진입 링크가 viewport에 들어오면 Next.js가 목적지 App Shell을 prefetch한다. 오프라인에서 링크를 눌러도 정적 shell은 보이고, 네트워크가 필요한 데이터는 Suspense fallback에 머문다. 온라인으로 돌아오면 Next.js가 요청을 재시도해 metrics를 스트리밍한다.

> **참고**: 이 동작은 prefetched route로의 soft navigation과 현재 페이지의 Server Action 호출에 적용된다. 오프라인에서 전체 페이지를 reload하면 HTML 자체를 받을 수 없어 실패한다. 완전한 오프라인 로드는 Service Worker가 필요하므로 [PWAs](./progressive-web-apps.md)를 참고한다.

### Suspense fallback에서 연결 상태 알리기

`useOffline`은 브라우저가 `offline` 이벤트를 보내거나 내비게이션·prefetch·Server Action fetch가 실패하면 `true`를 반환한다. 백그라운드 연결 확인이 성공하면 다시 `false`가 된다. 운영체제 네트워크 인터페이스만 보는 `navigator.onLine`보다 실제 인터넷 연결 실패를 더 잘 반영한다.

```tsx filename="app/dashboard/connectivity-fallback.tsx"
'use client'

import { useOffline } from 'next/offline'

export function ConnectivityFallback() {
  const isOffline = useOffline()
  return <p>{isOffline ? 'Waiting for connection...' : 'Loading...'}</p>
}
```

> **참고**: `useOffline`은 서버 렌더링과 최초 hydration 중에는 `false`를 반환한다. 브라우저에 마운트한 뒤 첫 정확한 값이 나온다.

이 컴포넌트를 데이터 경계의 fallback으로 쓰거나 root layout에 배너로 두면 연결 상태를 필요한 범위에 알릴 수 있다.

```tsx filename="app/dashboard/page.tsx"
<Suspense fallback={<ConnectivityFallback />}>
  <MetricsTable />
</Suspense>
```

대부분의 앱에서는 pending loading과 root 배너로 충분하다. 특정 콘텐츠가 기다리는 이유를 직접 알려야 하면 해당 Suspense fallback을 오프라인 인식형으로 만든다. 다이나믹 라우트도 공유 App Shell을 먼저 보여주고 연결 복구 뒤 메시지를 불러올 수 있다. 링크별 URL 데이터를 미리 prefetch했다면 오프라인에서도 즉시 표시할 수 있다.

### 네트워크 복구 후 Server Action 재시도하기

flag가 없으면 오프라인 Server Action 호출의 Promise가 fetch 오류로 reject된다. flag를 켜면 오류가 애플리케이션 코드에 도달하지 않고 호출이 pending으로 남는다. 연결이 돌아오면 요청을 다시 보내고 서버 응답으로 Promise를 resolve한다.

`useTransition`과 `useOffline`을 결합해 버튼이 멈춘 것처럼 보이지 않게 한다.

```tsx filename="app/ping/ping-form.tsx"
'use client'

import { useState, useTransition } from 'react'
import { useOffline } from 'next/offline'
import { ping } from './actions'

export function PingForm() {
  const [pongs, setPongs] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const isOffline = useOffline()

  function handleSubmit() {
    startTransition(async () => {
      const pong = await ping()
      setPongs((previous) => [pong, ...previous])
    })
  }

  const label = pending
    ? isOffline ? 'Pinging (offline, will retry)...' : 'Pinging...'
    : 'Ping'

  return <button onClick={handleSubmit} disabled={pending}>{label}</button>
}
```

오프라인에서 실행하면 버튼이 비활성화되고 재시도 예정임을 알린다. 온라인으로 돌아오면 별도 클릭이나 클라이언트 재시도 코드 없이 기존 호출이 완료된다.

> **참고**: 오프라인에서 pending Server Action 중 링크를 누르면 아무 동작이 없는 것처럼 보일 수 있다. 링크의 내비게이션도 네트워크가 필요해 Action과 같은 연결 신호 뒤에 대기하며, 연결이 돌아오면 둘 다 완료된다.

### 테스트

`next build && next start`로 시험한다. 개발 모드는 오프라인 동작의 신뢰할 수 있는 기준이 아니다. Chrome DevTools의 Network > Offline, Firefox Network Monitor의 throttling, 실제 비행기 모드·Wi-Fi 해제로 끊김과 복구를 확인한다.

### Cache Components를 사용하지 않을 때

라우트의 [`loading.tsx`](../3-api-reference/3.1-file-conventions/loading.md)가 segment 수준의 shell과 prefetch 경계를 제공한다. 그 shell은 오프라인에 렌더링되고 네트워크가 돌아오면 페이지가 재개된다. 자세한 동작은 [Prefetching](./prefetching.md)을 참고한다. `useOffline` 훅, 전역 배너, Server Action 재시도는 같은 방식으로 동작한다.

### 다음 단계

- [`useOffline` 훅](../3-api-reference/3.3-functions/use-offline.md)
- [`experimental.useOffline` 설정](../3-api-reference/3.5-config/3.5.1-next-config-js/useOffline.md)
- [`loading.tsx`](../3-api-reference/3.1-file-conventions/loading.md)
- Service Worker 기반 캐싱을 다루는 [PWAs](./progressive-web-apps.md)

### 더 알아보기

#### useOffline 훅

연결 상태를 읽는 훅의 반환 시점과 사용 범위는 [`useOffline` API Reference](../3-api-reference/3.3-functions/use-offline.md)를 참고한다.

#### useOffline 설정

감지와 자동 재시도를 활성화하는 방법은 [`experimental.useOffline`](../3-api-reference/3.5-config/3.5.1-next-config-js/useOffline.md)을 참고한다.

#### PWAs

새 문서까지 오프라인에서 여는 전체 캐싱은 [PWA 가이드](./progressive-web-apps.md)의 Service Worker 패턴을 사용한다.

## 예제 및 데모 설계

- Phase 2에서 prefetched App Shell과 uncached metrics를 가진 대시보드를 만든다.
- 일반 fallback, 오프라인 인식 fallback, root 배너를 나란히 비교한다.
- 오프라인에서 Server Action을 제출하고 연결 복구 뒤 같은 요청이 완료되는지 확인한다.
- soft navigation과 전체 reload의 차이, Cache Components와 `loading.tsx` 경계의 차이를 기록한다.

## 연습 문제

1. `experimental.useOffline`이 직접 관리하지 않는 요청은 무엇인가?

   - A. prefetched route의 soft navigation
   - B. Server Action 호출
   - C. Client Component에서 직접 호출한 `fetch()`

   <details><summary>정답 보기</summary>

   정답: C. 직접 fetch한 요청은 해당 코드나 데이터 라이브러리의 재시도 정책을 따른다.

   </details>

2. 오프라인에서 전체 페이지 reload가 실패하는 이유는 무엇인가?

   - A. 브라우저가 HTML을 전달받을 네트워크가 없기 때문이다.
   - B. `useOffline`이 Server Component를 삭제하기 때문이다.
   - C. Suspense가 모든 캐시를 지우기 때문이다.

   <details><summary>정답 보기</summary>

   정답: A. 이 기능은 prefetched shell의 soft navigation을 복구하며 새 문서 자체는 Service Worker 없이는 제공하지 못한다.

   </details>

3. 오프라인 동작의 최종 검증에 권장되는 실행 방식은 무엇인가?

   - A. `next dev`
   - B. `next build && next start`
   - C. 정적 코드 검사만 수행

   <details><summary>정답 보기</summary>

   정답: B. 개발 모드는 오프라인 동작의 신뢰할 수 있는 기준이 아니다.

   </details>

## 챕터 요약

- `experimental.useOffline`은 프레임워크 내비게이션·RSC fetch·prefetch·Server Action을 pending으로 유지한다.
- prefetched App Shell과 Suspense fallback이 오프라인에서도 구조와 상태를 보여준다.
- `useOffline`은 `navigator.onLine`보다 실제 요청 실패까지 반영한다.
- 연결이 돌아오면 pending Server Action과 내비게이션을 별도 재시도 코드 없이 재개한다.
- 전체 오프라인 reload에는 Service Worker가 필요하고 최종 검증은 운영 빌드로 수행한다.
