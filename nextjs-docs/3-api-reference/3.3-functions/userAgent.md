# userAgent

- 공식 문서: [userAgent](https://nextjs.org/docs/app/api-reference/functions/userAgent)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- HTTP 요청 객체에서 클라이언트의 브라우저, 디바이스, OS 정보를 파싱하는 `userAgent` 헬퍼 함수의 역할을 이해한다.
- `isBot` 속성을 활용하여 검색 엔진 크롤러나 봇 트래픽을 감지하고 대응한다.
- `device.type` 값을 기반으로 모바일, 태블릿, 데스크톱 기기별 분기 라우팅을 구현한다.
- 미들웨어(Proxy) 및 Route Handler에서 `userAgent`를 활용하는 패턴을 습득한다.

## 핵심 개념 및 설명

`userAgent`는 들어온 HTTP 요청(`Request` 또는 `NextRequest`)의 `User-Agent` 헤더를 분석하여 브라우저, 운영체제, 디바이스 종류, 봇 여부 등의 상세 정보를 구조화된 객체로 반환하는 `next/server`의 헬퍼 함수다.

주로 [미들웨어(Proxy)](../3.1-file-conventions/proxy.md)에서 기기별 맞춤 페이지로 재작성(rewrite)하거나 봇 접근을 감지할 때 활용된다.

```ts filename="proxy.ts" switcher
import { type NextRequest, NextResponse, userAgent } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const { device, isBot } = userAgent(request)

  // 봇 감지 시 특수 처리
  if (isBot) {
    url.searchParams.set('bot', 'true')
  }

  // 모바일 기기 감지 시 파라미터 주입 또는 경로 분기
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  url.searchParams.set('viewport', viewport)

  return NextResponse.rewrite(url)
}
```

```js filename="proxy.js" switcher
import { NextResponse, userAgent } from 'next/server'

export function proxy(request) {
  const url = request.nextUrl
  const { device, isBot } = userAgent(request)

  if (isBot) {
    url.searchParams.set('bot', 'true')
  }

  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  url.searchParams.set('viewport', viewport)

  return NextResponse.rewrite(url)
}
```

### 반환 객체 속성

- `isBot`: 알려진 웹 크롤러나 봇으로부터 인입된 요청인지 여부 (`boolean`).
- `browser`: 브라우저 정보 (`{ name: string, version: string }`).
- `device`: 접속 기기 정보 (`{ model: string, type: 'mobile' | 'tablet' | 'smarttv' | 'console' | 'wearable' | 'embedded' | undefined, vendor: string }`). 데스크톱 브라우저는 `type`이 `undefined`로 반환된다.
- `os`: 운영체제 정보 (`{ name: string, version: string }`).
- `engine`: 렌더링 엔진 정보 (`{ name: string, version: string }`).
- `cpu`: CPU 아키텍처 정보 (`{ architecture: string }`).

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v13.0.0` | `userAgent` 헬퍼 도입 |

## 예제 및 데모 설계

- 미들웨어에서 `userAgent(request).isBot`을 확인하여 일반 사용자와 검색 봇의 캐시 정책을 분기하는 데모를 구성한다.
- 모바일 브라우저 접속자를 감지하여 모바일 전용 UI 뷰포트로 `NextResponse.rewrite()`하는 시나리오를 검증한다.
- Route Handler에서 접속자의 브라우저 이름과 OS 정보를 로깅하는 분석 엔드포인트를 구현한다.

## 연습 문제

1. `userAgent(request)`가 반환하는 객체에서 검색 엔진 크롤러나 봇 여부를 판별하는 속성은?
   - A. `isCrawler`
   - B. `isBot`
   - C. `device.isRobot`
   - D. `botDetected`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `userAgent(request)`의 반환 객체 중 `isBot` 불리언 속성을 통해 요청이 알려진 봇인지 손쉽게 판별할 수 있다.
</details>

2. 데스크톱 일반 PC 브라우저로 접속했을 때 `userAgent(request).device.type`이 가지는 값은?
   - A. `'desktop'`
   - B. `'pc'`
   - C. `undefined`
   - D. `null`

<details><summary>정답 보기</summary>

정답: **C**  
해설: `device.type`은 모바일, 태블릿, 콘솔 등 특수 기기일 때 문자열을 반환하며, 일반 데스크톱 브라우저 환경에서는 `undefined`로 반환된다.
</details>

## 챕터 요약

- `userAgent`는 HTTP 요청의 User-Agent 헤더를 파싱하는 `next/server`의 유틸리티다.
- `isBot`으로 검색 봇 여부를 즉각 감지한다.
- `browser`, `device`, `os`, `engine`, `cpu` 등 풍부한 클라이언트 메타데이터를 제공한다.
- 미들웨어에서 기기별 라우팅 분기 및 봇 대응에 주로 활용된다.
