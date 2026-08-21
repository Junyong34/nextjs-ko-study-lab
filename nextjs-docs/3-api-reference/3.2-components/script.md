# Script Component

- 공식 문서: [Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- 상위 메뉴: [Components](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `next/script`가 제공하는 props의 목적과 사용 조건을 설명한다.
- 스크립트 로딩 전략(`beforeInteractive`, `afterInteractive`, `lazyOnload`, `worker`) 4가지의 차이를 구분해 적용한다.
- `onLoad`, `onReady`, `onError` 콜백을 언제 쓸 수 있고, 어떤 제약이 있는지(Server Component 미지원 등) 이해한다.
- 이 문서는 API reference이므로, 실제 사용 패턴은 [Optimizing Scripts](../../2-guides/scripts.md) 가이드와 함께 학습한다.

## 핵심 개념 및 설명

### Script 컴포넌트란

이 API reference는 Script 컴포넌트에서 사용할 수 있는 [props](#props)를 이해하는 데 도움을 준다. 기능과 사용법은 [Optimizing Scripts](../../2-guides/scripts.md) 문서를 참고한다.

```tsx filename="app/dashboard/page.tsx"
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

### Props

Script 컴포넌트에서 사용할 수 있는 props는 다음과 같다.

| Prop | 예시 | 타입 | 필수 여부 |
| --- | --- | --- | --- |
| src | src="http://example.com/script" | String | 인라인 스크립트를 사용하지 않는다면 필수 |
| strategy | strategy="lazyOnload" | String | - |
| onLoad | onLoad={onLoadFunc} | Function | - |
| onReady | onReady={onReadyFunc} | Function | - |
| onError | onError={onErrorFunc} | Function | - |

### 필수 Props

`<Script />` 컴포넌트에는 다음 속성이 필요하다.

#### src

외부 스크립트의 URL을 지정하는 경로 문자열이다. 절대 경로 외부 URL이거나 내부 경로일 수 있다. 인라인 스크립트를 사용하지 않는다면 `src` 속성은 필수다.

### 선택 Props

`<Script />` 컴포넌트는 필수 속성 외에도 여러 추가 속성을 받는다.

#### strategy

스크립트를 불러오는 전략이다. 다음 네 가지 전략을 사용할 수 있다.

- `beforeInteractive`: Next.js 코드와 페이지 hydration이 일어나기 전에 로드한다.
- `afterInteractive`: (**기본값**) 이르게 로드하지만 페이지에서 일부 hydration이 일어난 뒤에 로드한다.
- `lazyOnload`: 브라우저의 유휴 시간 동안 로드한다.
- `worker`: (실험적) 웹 워커에서 로드한다.

#### beforeInteractive

`beforeInteractive` 전략으로 로드되는 스크립트는 서버에서 내려주는 초기 HTML에 삽입되어, 어떤 Next.js 모듈보다도 먼저 다운로드되고 배치된 순서대로 실행된다.

이 전략으로 지정된 스크립트는 어떤 퍼스트파티 코드보다도 먼저 프리로드되고 가져와지지만, 그 실행이 **페이지 hydration을 막지는 않는다**.

`beforeInteractive` 스크립트는 루트 레이아웃(`app/layout.tsx`) 안에 배치해야 하며, 사이트 전체에서 필요한 스크립트를 로드하도록 설계되어 있다(즉 애플리케이션의 어떤 페이지든 서버에서 로드되는 순간 이 스크립트도 함께 로드된다).

**이 전략은 가능한 한 빨리 가져와야 하는 중요한 스크립트에만 사용해야 한다.**

```tsx filename="app/layout.tsx"
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

> **알아두면 좋은 점**: `beforeInteractive` 스크립트는 컴포넌트 안 어디에 배치하든 항상 HTML 문서의 `head` 안에 삽입된다.

`beforeInteractive`로 가능한 한 빨리 가져와야 하는 스크립트의 예는 다음과 같다.

- 봇 감지기
- 쿠키 동의 관리자

#### afterInteractive

`afterInteractive` 전략을 사용하는 스크립트는 클라이언트 사이드에서 HTML에 삽입되며, 페이지에서 일부(또는 전체) hydration이 일어난 뒤 로드된다. **이는 Script 컴포넌트의 기본 전략이며**, 가능한 한 빨리 로드되어야 하지만 퍼스트파티 Next.js 코드보다 먼저 로드될 필요는 없는 스크립트에 사용해야 한다.

`afterInteractive` 스크립트는 어떤 페이지나 레이아웃 안에도 배치할 수 있으며, 해당 페이지(또는 페이지 그룹)가 브라우저에서 열릴 때만 로드되고 실행된다.

```tsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

`afterInteractive`에 적합한 스크립트의 예는 다음과 같다.

- 태그 매니저
- 애널리틱스

#### lazyOnload

`lazyOnload` 전략을 사용하는 스크립트는 브라우저의 유휴 시간 동안 클라이언트 사이드에서 HTML에 삽입되며, 페이지의 모든 리소스가 로드된 뒤에 로드된다. 이 전략은 일찍 로드될 필요가 없는 백그라운드 스크립트나 낮은 우선순위의 스크립트에 사용해야 한다.

`lazyOnload` 스크립트는 어떤 페이지나 레이아웃 안에도 배치할 수 있으며, 해당 페이지(또는 페이지 그룹)가 브라우저에서 열릴 때만 로드되고 실행된다.

```tsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

즉시 로드될 필요가 없어 `lazyOnload`로 가져올 수 있는 스크립트의 예는 다음과 같다.

- 채팅 지원 플러그인
- 소셜 미디어 위젯

#### worker

> **경고**: `worker` 전략은 아직 안정적이지 않으며 App Router에서는 아직 동작하지 않는다. 주의해서 사용해야 한다.

`worker` 전략을 사용하는 스크립트는 메인 스레드를 확보하고 중요한 퍼스트파티 리소스만 메인 스레드에서 처리되도록 웹 워커로 오프로드된다. 어떤 스크립트에도 이 전략을 사용할 수 있지만, 모든 서드파티 스크립트를 지원한다고 보장할 수 없는 고급 사용 사례에 해당한다.

`worker`를 전략으로 사용하려면 `next.config.js`에서 `nextScriptWorkers` 플래그를 활성화해야 한다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

`worker` 스크립트는 **현재 `pages/` 디렉터리에서만** 사용할 수 있다.

```tsx filename="pages/home.tsx"
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

#### onLoad

> **경고**: `onLoad`는 아직 Server Component에서 동작하지 않으며 Client Component에서만 사용할 수 있다. 또한 `onLoad`는 `beforeInteractive`와 함께 사용할 수 없다 — 대신 `onReady` 사용을 고려한다.

일부 서드파티 스크립트는 콘텐츠를 초기화하거나 함수를 호출하기 위해 스크립트 로드가 끝난 뒤 한 번 JavaScript 코드를 실행해야 한다. `afterInteractive`나 `lazyOnload`를 로딩 전략으로 사용하고 있다면, `onLoad` 속성으로 로드가 끝난 뒤 코드를 실행할 수 있다.

다음은 라이브러리가 로드된 뒤에만 lodash 메서드를 실행하는 예시다.

```tsx filename="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```

#### onReady

> **경고**: `onReady`는 아직 Server Component에서 동작하지 않으며 Client Component에서만 사용할 수 있다.

일부 서드파티 스크립트는 스크립트 로드가 끝난 뒤, 그리고 컴포넌트가 마운트될 때마다(예: 라우트 내비게이션 이후) JavaScript 코드를 실행해야 한다. `onReady` 속성을 사용하면 스크립트가 처음 로드될 때의 load 이벤트 이후와, 이후 컴포넌트가 다시 마운트될 때마다 코드를 실행할 수 있다.

다음은 컴포넌트가 마운트될 때마다 Google Maps JS 임베드를 다시 초기화하는 예시다.

```tsx filename="app/page.tsx"
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

#### onError

> **경고**: `onError`는 아직 Server Component에서 동작하지 않으며 Client Component에서만 사용할 수 있다. `onError`는 `beforeInteractive` 로딩 전략과 함께 사용할 수 없다.

스크립트가 로드에 실패한 경우를 잡아내는 것이 유용할 때가 있다. 이런 오류는 `onError` 속성으로 처리할 수 있다.

```tsx filename="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

### 버전 히스토리

| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | `beforeInteractive`와 `afterInteractive`가 app을 지원하도록 수정되었다. |
| v12.2.4 | `onReady` prop이 추가되었다. |
| v12.2.2 | `beforeInteractive`를 사용하는 `next/script`를 `_document`에 배치할 수 있게 되었다. |
| v11.0.0 | `next/script`가 도입되었다. |

## 예제 및 데모 설계

- Phase 2에서 `afterInteractive`, `lazyOnload`, `beforeInteractive` 세 전략으로 로드 시점 차이를 콘솔 로그로 비교한다.
- 서드파티 스크립트 로드 후 `onLoad`로 후처리 함수를 실행하는 예제를 구현한다.
- 라우트 이동 시 컴포넌트가 다시 마운트될 때 `onReady`로 지도 위젯을 재초기화하는 예제를 구현한다.
- 스크립트 로드 실패를 `onError`로 감지해 대체 UI를 보여주는 예제를 구현한다.

## 연습 문제

1. 사이트 전체에서 반드시 필요한 중요 스크립트를 가능한 한 빨리 가져오려 할 때 사용해야 하는 `strategy` 값과 그 배치 위치는?

   <details><summary>정답 보기</summary>

   `strategy="beforeInteractive"`를 사용하며, 반드시 루트 레이아웃(`app/layout.tsx`) 안에 배치해야 한다. 이 스크립트는 실행되어도 페이지 hydration을 막지 않지만, 배치 위치와 관계없이 항상 HTML `head`에 삽입된다.

   </details>

2. 채팅 지원 플러그인처럼 즉시 로드될 필요가 없는 스크립트에 적합한 전략은?

   <details><summary>정답 보기</summary>

   `lazyOnload`다. 브라우저의 유휴 시간 동안, 페이지의 모든 리소스가 로드된 뒤에 로드되므로 우선순위가 낮은 스크립트에 적합하다.

   </details>

3. `onLoad`, `onReady`, `onError` 콜백을 `beforeInteractive` 전략과 함께 사용할 수 있는가?

   <details><summary>정답 보기</summary>

   아니다. `onLoad`와 `onError`는 `beforeInteractive`와 함께 사용할 수 없다. 세 콜백 모두 아직 Server Component에서 동작하지 않으며 Client Component에서만 사용할 수 있다.

   </details>

## 챕터 요약

- `next/script`는 `src`(필수), `strategy`, `onLoad`, `onReady`, `onError` props로 서드파티 스크립트의 로딩 시점과 후처리를 제어한다.
- 로딩 전략은 `beforeInteractive`(hydration 전, 루트 레이아웃 전용), `afterInteractive`(기본값), `lazyOnload`(유휴 시간), `worker`(실험적, 아직 App Router 미지원) 네 가지다.
- `beforeInteractive` 스크립트는 배치 위치와 무관하게 항상 HTML `head`에 삽입되며, 봇 감지기나 쿠키 동의 관리자처럼 중요한 스크립트에만 사용해야 한다.
- `onLoad`, `onReady`, `onError`는 모두 Client Component에서만 사용할 수 있고, `beforeInteractive`와는 함께 쓸 수 없다.
- 실제 사용 패턴과 시나리오는 [Optimizing Scripts](../../2-guides/scripts.md) 가이드에서 더 다룬다.
