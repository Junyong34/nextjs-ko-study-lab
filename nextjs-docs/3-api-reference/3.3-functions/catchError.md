# catchError

- 공식 문서: [catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 세그먼트 파일 단위가 아닌 개별 컴포넌트 단위로 에러 경계(Error Boundary)를 선언하는 `catchError` 함수의 역할을 이해한다.
- `error.js` 파일 규칙과 비교하여 트리 내 임의의 위치에서 컴포넌트 수준 에러 복구를 구현하는 패턴을 익힌다.
- `redirect()`나 `notFound()` 같은 프레임워크 특수 예외를 가로채지 않는 Next.js 내장 통합 특성을 파악한다.
- `ErrorInfo`의 `retry()`와 `reset()` 메서드 차이를 구분하고 재시도 UI를 구성한다.

## 핵심 개념 및 설명

`catchError`는 자식 요소를 React 에러 경계(Error Boundary)로 감싸는 래퍼 컴포넌트를 선언적으로 생성해 주는 고차 함수다.

기존의 라우트 세그먼트 단위 [`error.tsx`](../3.1-file-conventions/error.md) 파일 컨벤션과 달리, 컴포넌트 트리 내 원하는 특정 하위 컴포넌트만 정밀하게 격리하여 에러를 복구할 수 있게 해준다.

`catchError`는 **Client Component**(`'use client'`)에서 정의하여 사용한다.

```tsx filename="app/components/custom-error-boundary.tsx" switcher
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <div className="error-card p-4 border border-red-300 bg-red-50 rounded">
      <h2 className="text-red-700 font-bold">{props.title}</h2>
      <p className="text-sm text-red-600 my-2">{error.message}</p>
      <button
        onClick={() => retry()}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        다시 시도
      </button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

```jsx filename="app/components/custom-error-boundary.js" switcher
'use client'

import { catchError } from 'next/error'

function ErrorFallback(props, { error, retry }) {
  return (
    <div className="error-card p-4 border border-red-300 bg-red-50 rounded">
      <h2 className="text-red-700 font-bold">{props.title}</h2>
      <p className="text-sm text-red-600 my-2">{error.message}</p>
      <button
        onClick={() => retry()}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        다시 시도
      </button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

### Next.js 내장 통합의 강점

순수 커스텀 React Error Boundary 클래스를 직접 작성하는 것과 비교하여 `catchError`는 다음과 같은 강력한 프레임워크 지원을 제공한다:

1. **빌트인 에러 복구 (`retry`)**: `retry()`는 React의 `startTransition` 내부에서 페이지를 재렌더링하므로, 에러 경계 외부의 다른 Client Component 상태를 안전하게 보존하면서 자식 요소만 다시 패치한다.
2. **프레임워크 제어 예외 보호**: `redirect()`나 `notFound()`는 내부적으로 특수 에러를 던져 동작한다. `catchError`는 이를 자동으로 감지하여 에러 폴백을 띄우지 않고 상위로 자연스럽게 흘려보낸다.
3. **클라이언트 네비게이션 자동 초기화**: 사용자가 다른 라우트로 이동하면 에러 상태가 자동으로 클리어된다.

### 매개변수 및 `ErrorInfo` 인터페이스

```tsx
const ErrorWrapper = catchError(fallback)
```

`fallback` 함수는 다음 두 가지 인자를 전달받는다:
1. `props`: 래퍼 컴포넌트에 전달된 커스텀 props (`children` 제외).
2. `errorInfo`: 에러 관련 제어 객체.
   - `error`: 포착된 `Error` 인스턴스.
   - `retry()`: 에러 경계의 자식 요소를 **다시 패치하고 재렌더링**한다 (권장).
   - `reset()`: 재패치 없이 에러 상태만 초기화한다 (Server Component 에러는 복구 불가).

### 사용 예제: 특정 위젯만 에러 격리하기

```tsx filename="app/dashboard/page.tsx"
import CustomErrorBoundary from '@/app/components/custom-error-boundary'
import { WeatherWidget } from '@/app/components/weather'
import { StockWidget } from '@/app/components/stock'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 날씨 위젯에 장애가 발생해도 주식 위젯 및 전체 대시보드는 정상 유지됨 */}
      <CustomErrorBoundary title="날씨 위젯 오류">
        <WeatherWidget />
      </CustomErrorBoundary>

      <CustomErrorBoundary title="주식 위젯 오류">
        <StockWidget />
      </CustomErrorBoundary>
    </div>
  )
}
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.3.0` | `catchError` 안정화 (Stable) |
| `v16.2.0` | `unstable_catchError` 도입 |

## 예제 및 데모 설계

- 대시보드의 특정 서브 컴포넌트에 의도적인 런타임 에러를 발생시키고, 상위 페이지나 옆의 다른 컴포넌트가 깨지지 않고 해당 위치에만 에러 폴백과 "다시 시도" 버튼이 표시되는지 확인한다.
- 자식 컴포넌트 내부에서 `notFound()` 또는 `redirect()`가 호출되었을 때 `catchError`가 이를 가로채지 않고 정상적으로 404/리다이렉트 처리하는지 검증한다.
- `retry()` 버튼을 클릭했을 때 서버 컴포넌트 재요청이 발생하여 정상 UI로 회복되는 과정을 테스트한다.

## 연습 문제

1. `catchError`가 기존 `error.js` 세그먼트 파일과 비교하여 제공하는 가장 큰 이점은?
   - A. Server Component에서만 실행되도록 보장한다.
   - B. 라우트 세그먼트 단위가 아닌 컴포넌트 트리 내 원하는 특정 하위 컴포넌트 단위로 에러 경계를 선언할 수 있다.
   - C. 모든 JavaScript 런타임 에러를 무시하고 넘긴다.
   - D. 빌드 타임을 50% 단축한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `catchError`는 `error.js`와 달리 컴포넌트 트리 내부의 특정 부분만 정밀하게 감싸서 부분적 에러 격리와 복구를 가능하게 해준다.
</details>

2. `catchError` 폴백 컴포넌트에서 에러 복구를 구현할 때 `reset()` 대신 `retry()` 사용이 권장되는 이유는?
   - A. `retry()`는 에러 상태를 초기화할 뿐만 아니라 Server Component 자식 요소를 다시 패치하여 최신 데이터로 복구하기 때문이다.
   - B. `reset()`은 브라우저를 강제 종료하기 때문이다.
   - C. `retry()`는 비동기 호출을 지원하지 않기 때문이다.
   - D. `reset()`은 TypeScript에서 지원되지 않기 때문이다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `retry()`는 서버로부터 자식 데이터를 다시 패치하고 재렌더링하므로 Server Component 에러로부터 완벽하게 복구할 수 있다.
</details>

## 챕터 요약

- `catchError`는 컴포넌트 수준의 에러 경계를 생성하는 `next/error`의 함수다.
- `error.js`와 상호 보완적으로 특정 위젯이나 섹션의 장애를 격리할 때 사용된다.
- `redirect()` 및 `notFound()`와 같은 특수 프레임워크 예외를 안전하게 전파한다.
- `retry()`를 통해 클라이언트 상태를 유지하면서 자식 Server Component를 재패치하고 복구한다.
- Next.js 16.3부터 안정화되었다.
