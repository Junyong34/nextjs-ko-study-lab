# Third Party Libraries

- 공식 문서: [Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `@next/third-parties`의 목적과 실험적 상태를 설명할 수 있다.
- Google Tag Manager와 Google Analytics를 라우트 범위에 맞게 배치하고 이벤트를 전송할 수 있다.
- Google Maps와 YouTube embed의 필수·선택 prop을 구분할 수 있다.

## 핵심 개념 및 설명

`@next/third-parties`는 널리 쓰이는 서드파티 라이브러리를 Next.js 애플리케이션에서 불러올 때 성능과 개발 경험을 개선하는 컴포넌트와 유틸리티 모음이다. 제공되는 통합은 성능과 사용 편의성에 맞게 최적화되어 있다.

### 시작하기

```bash
pnpm add @next/third-parties@latest next@latest
```

`@next/third-parties`는 활발히 개발 중인 실험적 라이브러리다. 더 많은 통합이 추가되는 동안 `latest` 또는 `canary` tag로 설치하는 것을 권장한다.

### Google 서드파티

지원하는 Google 라이브러리는 `@next/third-parties/google`에서 가져온다.

#### Google Tag Manager

`GoogleTagManager`는 페이지에 Google Tag Manager(GTM) container를 만든다. 기본적으로 페이지 hydration 뒤에 원본 인라인 script를 가져온다. 모든 라우트에서 사용하면 root layout에, 한 라우트에서만 사용하면 해당 page에 넣는다.

```tsx
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

##### 이벤트 전송

Client Component에서 `sendGTMEvent`로 사용자 상호작용을 `dataLayer`에 보낼 수 있다. 함수가 작동하려면 `<GoogleTagManager />`가 같은 파일이나 부모 layout, page, 컴포넌트에 포함되어 있어야 한다.

```tsx
'use client'

import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
    >
      Send Event
    </button>
  )
}
```

서버 측 tag manager의 `gtm.js`를 자체 tagging 서버에서 제공한다면 `gtmScriptUrl`로 script URL을 지정할 수 있다.

##### GTM 옵션

| 이름 | 유형 | 설명 |
| --- | --- | --- |
| `gtmId` | 필수\* | 보통 `GTM-`으로 시작하는 container ID다. |
| `gtmScriptUrl` | 선택\* | GTM script URL이다. 기본값은 `https://www.googletagmanager.com/gtm.js`다. |
| `dataLayer` | 선택 | container를 초기화할 data layer 객체다. |
| `dataLayerName` | 선택 | data layer 이름이다. 기본값은 `dataLayer`다. |
| `auth` | 선택 | 환경 snippet의 인증 매개변수 `gtm_auth` 값이다. |
| `preview` | 선택 | 환경 snippet의 미리 보기 매개변수 `gtm_preview` 값이다. |

\* 광고주용 Google tag gateway를 지원하도록 `gtmScriptUrl`을 제공하면 `gtmId`를 생략할 수 있다.

#### Google Analytics

`GoogleAnalytics`는 Google tag(`gtag.js`)를 통해 Google Analytics 4를 page에 넣는다. 기본적으로 hydration 뒤에 원본 script를 가져온다. 모든 라우트에서 사용하면 root layout에 두고 측정 ID를 전달한다.

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

> **권장 사항**: GTM이 이미 애플리케이션에 포함되어 있다면 Google Analytics 컴포넌트를 별도로 추가하기보다 GTM에서 Analytics를 구성할 수 있다. Tag Manager와 `gtag.js`의 차이를 공식 문서에서 확인한다.

##### 이벤트와 pageview 전송

`sendGAEvent`는 `dataLayer`를 통해 상호작용 이벤트를 보낸다. `<GoogleAnalytics />`가 같은 파일이나 부모에 있어야 한다.

```tsx
'use client'

import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGAEvent('event', 'buttonClicked', { value: 'xyz' })}
    >
      Send Event
    </button>
  )
}
```

Google Analytics는 브라우저 history 상태가 바뀌면 pageview를 자동으로 추적한다. Next.js 라우트 사이의 클라이언트 내비게이션도 별도 설정 없이 pageview를 보낼 수 있다. Admin panel의 Enhanced Measurement가 켜져 있고 “Page changes based on browser history events”가 선택되었는지 확인한다.

> **참고**: pageview 이벤트를 직접 보낸다면 중복 데이터를 피하도록 기본 pageview 측정을 꺼야 한다.

##### Google Analytics 옵션

| 이름 | 유형 | 설명 |
| --- | --- | --- |
| `gaId` | 필수 | 보통 `G-`로 시작하는 측정 ID다. |
| `dataLayerName` | 선택 | data layer 이름이다. 기본값은 `dataLayer`다. |
| `debugMode` | 선택 | Google Analytics debug mode를 켠다. |
| `nonce` | 선택 | nonce를 전달한다. |

#### Google Maps Embed

`GoogleMapsEmbed`는 Google Maps Embed를 page에 추가한다. 기본적으로 `loading` 속성으로 fold 아래 embed를 lazy loading한다.

```tsx
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

##### Google Maps 옵션

| 이름 | 유형 | 설명 |
| --- | --- | --- |
| `apiKey` | 필수 | Google Maps API key다. |
| `mode` | 필수 | map mode다. |
| `height` | 선택 | embed 높이다. 기본값은 `auto`다. |
| `width` | 선택 | embed 너비다. 기본값은 `auto`다. |
| `style` | 선택 | iframe에 전달할 style이다. |
| `allowfullscreen` | 선택 | map 일부를 전체 화면으로 표시하게 한다. |
| `loading` | 선택 | 기본값은 `lazy`다. fold 위라면 변경을 검토한다. |
| `q` | 선택 | marker 위치다. map mode에 따라 필요할 수 있다. |
| `center` | 선택 | map view의 중심을 정한다. |
| `zoom` | 선택 | 초기 zoom 수준을 정한다. |
| `maptype` | 선택 | 불러올 map tile 유형을 정한다. |
| `language` | 선택 | UI 요소와 label의 언어를 정한다. |
| `region` | 선택 | 지정학적 민감도에 맞는 국경과 label을 정한다. |

#### YouTube Embed

`YouTubeEmbed`는 YouTube 영상을 표시한다. 내부적으로 `lite-youtube-embed`를 사용해 더 빠르게 로드한다.

```tsx
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <YouTubeEmbed
      videoid="ogfYd705cRs"
      height={400}
      params="controls=0"
    />
  )
}
```

##### YouTube 옵션

| 이름 | 유형 | 설명 |
| --- | --- | --- |
| `videoid` | 필수 | YouTube video ID다. |
| `width` | 선택 | video container 너비다. 기본값은 `auto`다. |
| `height` | 선택 | video container 높이다. 기본값은 `auto`다. |
| `playlabel` | 선택 | 접근성을 위해 play button에 제공하는 시각적으로 숨긴 label이다. |
| `params` | 선택 | query string 형식의 player 매개변수다. 예: `controls=0&start=10&end=30` |
| `style` | 선택 | video container에 적용할 style이다. |

## 예제 및 데모 설계

- Phase 2에서 GTM과 Analytics를 root layout과 개별 page에 번갈아 배치해 로드 범위를 확인한다.
- 버튼 이벤트와 클라이언트 내비게이션 pageview를 debug mode와 data layer에서 확인하고 중복 pageview 사례를 재현한다.
- fold 아래 지도와 YouTube embed를 배치해 lazy loading과 네트워크 요청 시점을 비교한다.
- 각 컴포넌트의 필수 prop 누락과 접근성 `playlabel` 적용 결과를 검증한다.

## 연습 문제

1. `@next/third-parties`의 현재 상태는 무엇인가?

   - A. 더 이상 유지하지 않는 deprecated 패키지다.
   - B. 활발히 개발 중인 실험적 라이브러리다.
   - C. 브라우저에서만 설치할 수 있는 확장 기능이다.

   <details><summary>정답 보기</summary>

   정답: B. 공식 문서는 `latest` 또는 `canary` tag 설치를 권장하는 실험적 라이브러리라고 설명한다.

   </details>

2. GTM이 이미 설치된 애플리케이션의 Analytics 구성으로 권장되는 방법은 무엇인가?

   - A. 별도 `GoogleAnalytics`를 반드시 중복 설치한다.
   - B. GTM에서 Analytics를 구성하는 방식을 검토한다.
   - C. 모든 pageview를 수동으로 두 번 보낸다.

   <details><summary>정답 보기</summary>

   정답: B. GTM이 있다면 그 안에서 Analytics를 구성해 별도 script 중복을 피할 수 있다.

   </details>

3. `GoogleMapsEmbed`와 `YouTubeEmbed`의 필수 식별자 조합은 무엇인가?

   - A. `apiKey`·`mode`, `videoid`
   - B. `nonce`, `dataLayerName`
   - C. `style`, `height`

   <details><summary>정답 보기</summary>

   정답: A. 지도에는 `apiKey`와 `mode`, YouTube에는 `videoid`가 필요하다.

   </details>

## 챕터 요약

- `@next/third-parties`는 서드파티 통합의 성능과 개발 경험을 개선하는 실험적 라이브러리다.
- Google 컴포넌트는 root layout이나 page에 배치해 적용 범위를 정한다.
- GTM과 Analytics 이벤트 함수는 대응 컴포넌트가 같은 파일이나 부모에 있어야 한다.
- Analytics의 자동 pageview와 수동 pageview를 함께 쓰면 중복 측정을 피해야 한다.
- Maps와 YouTube 컴포넌트는 lazy loading과 가벼운 embed 구현을 제공한다.
