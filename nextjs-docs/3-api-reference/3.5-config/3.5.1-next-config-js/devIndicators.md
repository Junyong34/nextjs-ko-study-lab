# devIndicators

- 공식 문서: [devIndicators](https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 개발 모드(`next dev`)에서 표시되는 온스크린 개발 상태 표시기(devIndicators)의 역할과 위치 제어 방식을 이해한다.
- 온스크린 표시기를 비활성화하거나 화면 4분면 모서리로 배치하는 설정 구조를 파악한다.
- 라우트가 정적(Static)으로 표시되지 않고 다이나믹(Dynamic) 렌더링으로 전환되는 원인과 해결 방안을 설명할 수 있다.

## 핵심 개념 및 설명

`devIndicators`는 로컬 개발 환경(`next dev`)에서 브라우저 화면에 떠 있는 개발 상태 표시기(Development Indicator Badge)의 동작과 화면 위치를 설정하는 옵션이다.

Next.js는 개발 중인 페이지가 정적(Static)으로 prerender될 수 있는지, 아니면 요청 시점 데이터나 헤더로 인해 다이나믹 렌더링(Dynamic Rendering)되는지를 화면 구석의 배지로 실시간으로 알려준다. 또한 페이지 빌드와 컴파일 활동 상태도 시각적으로 표시한다.

### 기본 설정 구조

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
}

export default nextConfig
```

### devIndicators 옵션 및 화면 위치 설정

| 옵션 키 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `devIndicators` | `false \| object` | `{ position: 'bottom-left' }` | 온스크린 개발 표시기 설정 객체 또는 비활성화 플래그. |
| `devIndicators.position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | `'bottom-left'` | 개발 표시기 배지가 배치될 브라우저 화면 모서리 위치. |

표시기가 애플리케이션의 하단 네비게이션 바나 플로팅 액션 버튼(FAB) 등을 가린다면, `position` 속성을 이용해 다른 모서리로 옮길 수 있다:

- `'bottom-left'`: 화면 좌측 하단 (기본값)
- `'bottom-right'`: 화면 우측 하단
- `'top-left'`: 화면 좌측 상단
- `'top-right'`: 화면 우측 상단

개발 상태 표시기를 화면에서 완전히 감추려면 `devIndicators: false`로 설정한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false, // 온스크린 개발 표시기 숨김
}

export default nextConfig
```

> **알아두면 좋은 점**:
>
> - `devIndicators: false`로 상태 배지를 감추더라도 에러 오버레이 창까지 비활성화되지는 않는다. 코드 컴파일 오류나 런타임 예외가 발생하면 오버레이는 정상 작동한다.
> - 개발 표시기는 오직 `next dev` 환경에서만 주입되고, 프로덕션 빌드(`next build` / `next start`) 산출물에서는 완전히 빠진다.

### Troubleshooting

#### Indicator not marking a route as static

정적으로 빌드될 것이라 예상한 페이지인데도 온스크린 표시기가 해당 라우트를 정적(Static)이 아닌 다이나믹(`ƒ`)으로 표시할 때가 있다.

`next build --debug` 명령을 실행하면 빌드 시점의 정확한 라우트 렌더링 방식을 터미널 결과물에서 확인할 수 있다:

- `○ (Static)`: 정적 콘텐츠로 prerender됨 (빌드 시점에 HTML 생성).
- `ƒ (Dynamic)`: 서버에서 온디맨드로 다이나믹 렌더링됨.

라우트가 의도치 않게 다이나믹 렌더링으로 전환되는 주요 원인은 두 가지다:

1. **요청 시점 API(Request-time APIs) 사용**: 라우트 트리 안의 컴포넌트에서 `headers()`, `cookies()`, 또는 페이지 props의 `searchParams`를 읽으면 Next.js는 요청마다 결과가 달라져야 하므로 전체 라우트를 다이나믹 렌더링으로 자동 전환한다.
2. **캐시되지 않은 데이터 요청**: `fetch()` 호출에 `cache: 'no-store'`를 지정했거나, Prisma, Drizzle 등의 ORM이나 데이터베이스 클라이언트를 직접 호출하여 데이터를 가져오면 요청 시점에 쿼리를 실행해야 해서 정적 prerender가 불가능해진다.

이를 해결하고 페이지의 주요 UI를 최대한 빠르게 전달하려면, 다이나믹 데이터 페칭 부분을 `loading.js`나 `<Suspense />` 경계로 감싸는 구조를 권장한다. 정적 셸(Static Shell)을 먼저 전송하고 다이나믹 콘텐츠를 스트리밍하는 방식이다.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | 레거시 옵션인 `appIsrStatus`, `buildActivity`, `buildActivityPosition` 제거 |
| `v15.2.0` | 통합된 `position` 옵션 제공 및 온스크린 표시기 UI 개편, 구형 옵션 지원 중단 예고 |
| `v15.0.0` | 정적 렌더링 상태를 감지하는 온스크린 표시기 도입 (`appIsrStatus`) |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (개발 모드 화면 모서리의 빌드 활동 및 정적/다이나믹 상태 표시기 UI 관찰 가능)
- 위치 변경 관찰: `position: 'top-right'`로 설정하고 `next dev`를 실행해 개발 상태 배지가 화면 우측 상단에 렌더링되는지 확인한다.
- 렌더링 상태 전환 관찰: 순수 정적 컴포넌트 페이지를 열었을 때 표시기가 정적 상태를 알리는지 확인하고, `cookies()`를 읽는 코드를 추가했을 때 즉시 다이나믹(`ƒ`) 상태로 전환되는지 브라우저에서 관찰한다.
- 비활성화 검증: `devIndicators: false`를 지정한 후 브라우저 화면에 표시기 DOM 요소가 렌더링되지 않는지 확인하고, 고의로 구문 에러를 냈을 때 에러 오버레이는 정상적으로 화면에 나타나는지 검증한다.

## 연습 문제

1. 개발 모드에서 화면 좌측 하단에 위치한 온스크린 개발 표시기를 우측 하단으로 이동시키기 위한 올바른 설정은?
   - A. `devIndicators: { align: 'right' }`
   - B. `devIndicators: { position: 'bottom-right' }`
   - C. `devIndicators: { placement: 'lower-right' }`
   - D. `devIndicators: { dock: 'bottom-right' }`

<details><summary>정답 보기</summary>

정답: **B**
해설: Next.js의 `devIndicators.position` 옵션에 `'bottom-right'`를 지정하면 표시기 배지의 화면 사분면 위치를 우측 하단으로 변경할 수 있다.
</details>

2. 개발 중인 라우트가 온스크린 표시기에서 정적(Static)이 아닌 다이나믹(Dynamic) 렌더링으로 분류되는 직접적인 원인으로 볼 수 없는 것은?
   - A. Server Component에서 `cookies()` 함수를 호출하여 브라우저 쿠키 값을 조회했다.
   - B. 데이터베이스 드라이버를 직접 호출하여 요청 시점마다 쿼리를 실행했다.
   - C. `fetch` 호출 시 `{ cache: 'force-cache' }` 옵션을 명시하여 응답 결과를 영구 캐싱했다.
   - D. 페이지 컴포넌트에서 URL 쿼리스트링인 `searchParams`를 참조했다.

<details><summary>정답 보기</summary>

정답: **C**
해설: `{ cache: 'force-cache' }`는 데이터를 빌드 시점 또는 캐시 계층에 저장하므로 페이지를 정적 상태로 유지하는 데 기여한다. 반면 `cookies()`, `searchParams`, 캐시되지 않은 DB 쿼리는 요청 시점 정보가 필요하므로 라우트를 다이나믹 렌더링으로 전환시킨다.
</details>

## 챕터 요약

- `devIndicators`는 로컬 개발 시 정적/다이나믹 렌더링 및 빌드 상태를 알려주는 브라우저 온스크린 배지를 설정한다.
- `position` 옵션으로 `'bottom-left'`, `'bottom-right'`, `'top-left'`, `'top-right'` 4개 모서리 중 원하는 위치로 배지를 이동할 수 있다.
- `devIndicators: false`를 설정하면 배지가 완전히 숨겨지지만, 런타임/컴파일 에러 오버레이는 계속 정상 작동한다.
- 라우트가 다이나믹(`ƒ`)으로 표시되는 것은 `cookies()`, `headers()`, `searchParams` 같은 요청 시점 API나 캐시되지 않은 데이터 페칭을 사용했기 때문이다.
- Next.js 16에서는 구형 `appIsrStatus`, `buildActivity` 옵션이 정리되고 단일 `position` 설정 체계로 통합되었다.
