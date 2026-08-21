# Scripts

- 공식 문서: [Scripts](https://nextjs.org/docs/app/guides/scripts)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `next/script`를 배치할 위치에 따라 script가 영향을 주는 라우트 범위를 결정할 수 있다.
- `strategy`별 로딩 시점과 `worker` 전략의 제한을 설명할 수 있다.
- 인라인 script, 이벤트 handler, 추가 DOM 속성을 올바르게 설정할 수 있다.

## 핵심 개념 및 설명

### layout에 script 넣기

여러 라우트에서 쓰는 서드파티 script는 [`next/script`](../3-api-reference/3.2-components/script.md)를 가져와 해당 라우트들의 공통 layout에 넣는다.

```tsx filename="app/dashboard/layout.tsx"
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

이 script는 `dashboard/page.js`나 `dashboard/settings/page.js`처럼 해당 layout 아래의 라우트에 접근할 때 가져온다. 사용자가 같은 layout의 여러 라우트 사이를 이동해도 Next.js는 script를 한 번만 로드한다.

### 애플리케이션 전체에 script 넣기

모든 라우트에 필요한 script는 root layout에 넣는다. 애플리케이션의 어느 라우트에 접근해도 로드되고 실행되며, 페이지를 여러 번 이동해도 한 번만 로드한다.

```tsx filename="app/layout.js"
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

> **권장 사항**: 불필요한 성능 영향을 줄이려면 서드파티 script를 필요한 특정 page나 layout에만 포함하는 것을 권장한다.

### 로딩 전략

`strategy` prop으로 script의 로딩 시점을 조정한다.

| 전략 | 로딩 시점 |
| --- | --- |
| `beforeInteractive` | Next.js 코드와 페이지 hydration보다 먼저 로드한다. |
| `afterInteractive` | 일부 hydration이 진행된 뒤 이른 시점에 로드한다. 기본값이다. |
| `lazyOnload` | 브라우저 유휴 시간에 늦게 로드한다. |
| `worker` | Web Worker에서 로드한다. 실험적 기능이다. |

각 전략의 제약과 사례는 [Script Component API](../3-api-reference/3.2-components/script.md)에서 확인한다.

### Web Worker로 script 보내기(실험적)

> **경고**: `worker` 전략은 아직 안정적이지 않고 App Router에서 작동하지 않는다. 주의해서 사용한다.

`worker` 전략은 Partytown을 통해 script를 Web Worker에서 실행해 메인 thread가 애플리케이션 코드에 집중하도록 할 수 있다. 이 실험적 기능은 `next.config.js`에서 `nextScriptWorkers`를 켜야 한다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

개발 서버를 실행하면 Next.js가 `@qwik.dev/partytown` 등 필요한 패키지의 설치를 안내한다. 설정이 끝나면 `strategy="worker"`가 Partytown을 초기화하고 script를 Web Worker로 보낸다. 적용하기 전에 Partytown의 tradeoff를 검토해야 한다.

### 인라인 script

외부 파일이 아닌 인라인 JavaScript도 `Script` 컴포넌트의 자식이나 `dangerouslySetInnerHTML`로 작성할 수 있다.

```tsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

```tsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **경고**: Next.js가 인라인 script를 추적하고 최적화하려면 반드시 `id` prop을 지정해야 한다.

### 추가 코드 실행하기

`Script` 이벤트 handler로 특정 시점에 추가 코드를 실행할 수 있다.

- `onLoad`: script 로딩이 끝난 뒤 실행한다.
- `onReady`: 로딩이 끝난 뒤, 그리고 컴포넌트가 다시 마운트될 때마다 실행한다.
- `onError`: script 로딩에 실패하면 실행한다.

이 handler들은 파일 첫 줄에 `'use client'`가 있는 Client Component에서 `next/script`를 사용할 때만 작동한다.

```tsx filename="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <Script
      src="https://example.com/script.js"
      onLoad={() => {
        console.log('Script has loaded')
      }}
    />
  )
}
```

### 추가 속성 전달하기

`nonce`나 사용자 정의 `data-*` 속성처럼 `Script`가 직접 사용하지 않는 DOM 속성을 전달할 수 있다. Next.js는 이를 최종 최적화된 `<script>` 요소로 전달한다.

```tsx filename="app/page.tsx"
<Script
  src="https://example.com/script.js"
  id="example-script"
  nonce="XUENAJFW"
  data-test="script"
/>
```

### API 참고

모든 prop과 전략별 제약은 [Script Component API](../3-api-reference/3.2-components/script.md)에서 확인한다.

## 예제 및 데모 설계

- Phase 2에서 dashboard layout과 root layout에 각각 script를 배치해 로드 범위를 비교한다.
- 네 가지 `strategy`의 network 요청과 실행 시점을 DevTools Performance/Network에서 기록한다.
- 인라인 script의 `id` 유무, `onLoad`/`onReady` 재마운트, `onError`, `nonce` 전달 결과를 확인한다.

## 연습 문제

1. dashboard와 그 하위 라우트에만 필요한 script를 배치할 위치는 어디인가?

   - A. dashboard의 공통 layout
   - B. root layout만 가능하다.
   - C. `public` 디렉터리

   <details><summary>정답 보기</summary>

   정답: A. 공통 layout에 두면 해당 layout 아래 라우트에서만 로드하고 한 번만 실행한다.

   </details>

2. `Script` 이벤트 handler를 사용하기 위한 조건은 무엇인가?

   - A. Server Component에서만 사용한다.
   - B. `'use client'`가 선언된 Client Component에서 사용한다.
   - C. 반드시 `worker` 전략을 사용한다.

   <details><summary>정답 보기</summary>

   정답: B. `onLoad`, `onReady`, `onError`는 Client Component에서만 작동한다.

   </details>

3. App Router에서 `worker` 전략에 관한 설명으로 맞는 것은 무엇인가?

   - A. 기본 전략이다.
   - B. 안정적이며 별도 설정이 필요 없다.
   - C. 아직 안정적이지 않고 App Router에서 작동하지 않는다.

   <details><summary>정답 보기</summary>

   정답: C. 공식 문서는 이 실험적 전략을 App Router에서 사용할 수 없다고 경고한다.

   </details>

## 챕터 요약

- `Script`의 배치 위치가 script를 사용하는 라우트 범위를 결정한다.
- `strategy`는 hydration 전후, 유휴 시간, Web Worker 중 로딩 시점을 선택한다.
- `worker`는 실험적이며 현재 App Router에서 작동하지 않는다.
- 인라인 script에는 Next.js가 추적할 수 있는 `id`가 필요하다.
- 이벤트 handler는 Client Component에서만 작동하며 추가 DOM 속성은 최종 `<script>`에 전달된다.
