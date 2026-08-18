# useReportWebVitals

- 공식 문서: [useReportWebVitals](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 실제 사용자 관점의 웹 성능 핵심 지표인 Core Web Vitals를 수집하는 `useReportWebVitals` 훅의 역할을 이해한다.
- TTFB, FCP, LCP, CLS, INP 등의 핵심 성능 메트릭의 의미와 `metric` 객체 구조(`rating`, `value`, `delta`)를 파악한다.
- Client Component 경계를 최소화하여 루트 레이아웃에 `WebVitals` 수집 컴포넌트를 구성하는 모범 사례를 적용한다.
- `navigator.sendBeacon` 및 Google Analytics로 성능 데이터를 전송하는 파이프라인을 구축한다.

## 핵심 개념 및 설명

`useReportWebVitals`는 구글의 [Core Web Vitals](https://web.dev/vitals/) 성능 지표(LCP, FID, CLS, INP, FCP, TTFB)를 브라우저에서 측정하고, 분석(Analytics) 서비스로 데이터를 전달할 수 있도록 지원하는 `next/web-vitals`의 클라이언트 훅이다.

```tsx filename="app/components/web-vitals.tsx" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}
```

```jsx filename="app/components/web-vitals.js" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}
```

성능 최적화를 위해 위와 같이 Client Component로 분리한 후, Server Component인 루트 레이아웃(`app/layout.tsx`)에서 임포트하여 삽입하는 것이 권장된다:

```tsx filename="app/layout.tsx"
import { WebVitals } from './components/web-vitals'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

### `metric` 객체 속성

- `id`: 현재 페이지 로드에 대한 고유 측정 ID.
- `name`: 성능 지표 이름 (`'TTFB'`, `'FCP'`, `'LCP'`, `'FID'`, `'CLS'`, `'INP'`).
- `value`: 측정된 실제 수치 (대부분 밀리초 단위, CLS는 점수 단위).
- `delta`: 이전 측정값과의 차이값.
- `rating`: 성능 상태 등급 (`'good'`, `'needs-improvement'`, `'poor'`).
- `navigationType`: 페이지 탐색 유형 (`'navigate'`, `'reload'`, `'back-forward'`, `'prerender'`, `'back-forward-cache'`).

### 외부 분석 시스템으로 데이터 전송

사용자가 페이지를 이탈할 때도 안전하게 데이터를 보낼 수 있도록 `navigator.sendBeacon` API를 활용한다:

```tsx filename="app/components/web-vitals.tsx" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric)
  const url = 'https://analytics.example.com/vitals'

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    sendToAnalytics(metric)

    // Google Analytics (gtag.js) 연동 예시
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id, // 고유 측정 ID를 통해 지표 분포 수동 집계 가능
        non_interaction: true,
      })
    }
  })

  return null
}
```

> **알아두면 좋은 점 (Google Analytics 및 모범 사례)**:
>
> - **Google Analytics `id` 활용**: `metric.id` 값을 이벤트 라벨로 전달하면, 단일 페이지 세션 동안 누적되는 메트릭 분포를 BigQuery나 GA 커스텀 보고서에서 수동으로 정밀 집계할 수 있다.
> - **컴포넌트 분리 필수**: `useReportWebVitals`는 `'use client'` 훅이므로 전체 루트 레이아웃을 Client Component로 만들지 말고, 위와 같이 별도의 작은 잎새(Leaf) 컴포넌트로 분리하여 루트 레이아웃에 삽입해야 한다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | App Router에 `useReportWebVitals` 도입 (`next/web-vitals`) |

## 예제 및 데모 설계

- 콘솔 로그에 실시간으로 출력되는 LCP(최대 콘텐츠 렌더링 시간)와 CLS(누적 레이아웃 이동) 점수를 확인한다.
- Google Analytics 이벤트(`window.gtag`)로 Web Vitals 지표를 전송하는 커스텀 핸들러를 구현한다.
- 루트 레이아웃에서 클라이언트 경계를 격리하기 위한 컴포넌트 분리 패턴을 검증한다.

## 연습 문제

1. `useReportWebVitals`가 측정하는 메트릭 중 상호작용 반응성을 측정하는 최신 지표는?
   - A. TTFB
   - B. INP (Interaction to Next Paint)
   - C. FCP
   - D. RSS

<details><summary>정답 보기</summary>

정답: **B**  
해설: INP는 사용자의 클릭, 탭, 키보드 입력 등 모든 상호작용의 지연 시간을 종합적으로 평가하는 최신 Core Web Vitals 지표다.
</details>

2. `useReportWebVitals`에서 측정한 성능 등급(`rating`)으로 반환될 수 있는 값의 조합은?
   - A. `fast`, `normal`, `slow`
   - B. `good`, `needs-improvement`, `poor`
   - C. `pass`, `fail`
   - D. `optimal`, `suboptimal`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Web Vitals 규격에 따라 `metric.rating`은 `'good'`, `'needs-improvement'`, `'poor'` 3가지 품질 등급으로 평가된다.
</details>

## 챕터 요약

- `useReportWebVitals`는 Core Web Vitals 성능 지표를 수집하는 `next/web-vitals`의 클라이언트 훅이다.
- TTFB, FCP, LCP, FID, CLS, INP 등의 주요 지표를 실시간 측정한다.
- 루트 레이아웃에 별도 Client Component로 분리 배치하는 것이 권장된다.
- `navigator.sendBeacon`을 활용해 외부 분석 서버로 비차단 전송할 수 있다.
