# reactStrictMode

- 공식 문서: [reactStrictMode](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- React Strict Mode의 역할과, Next.js가 기본으로 활성화하는 동작 방식을 이해한다.
- 개발 환경에서 일어나는 컴포넌트 이중 호출(Double Invocation)과 레거시 API 감지 원리를 파악한다.
- 전역 비활성화와 하위 트리(`<React.StrictMode>`) 단위의 점진적 도입 전략을 설명할 수 있다.

## 핵심 개념 및 설명

React의 Strict Mode는 개발 모드(`next dev`)에서 실행되는 개발용 런타임 검사 도구다. 애플리케이션 코드에서 레거시 API 사용, 안전하지 않은 생명주기 메서드, 처리되지 않은 부작용을 찾아낸다. 그래서 React의 향후 업데이트 및 기능에 안정적으로 대비하도록 돕는다.

애플리케이션 전체의 Strict Mode 활성화 여부는 `next.config.js`, `next.config.mjs`, 또는 `next.config.ts` 파일의 `reactStrictMode` 설정으로 제어한다.

### 기본 설정 구조

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

### 옵션 명세

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `reactStrictMode` | `boolean \| null` | `true` (App Router v13.5.1 이상) | React Strict Mode 활성화 여부. |

### 동작 방식 및 감지 항목

#### 개발 모드 전용 동작

Strict Mode 검사는 개발 서버(`next dev`) 실행 중에만 동작한다. 프로덕션 빌드(`next build` 및 `next start`)에서는 완전히 제외되므로, 최종 사용자 환경의 성능이나 번들 크기에 영향을 주지 않는다.

#### 렌더링 및 Effect 이중 실행 (Double Invocation)

React는 렌더링 단계가 순수 함수처럼 동작해야 한다고 전제한다. 부작용이 없어야 할 위치에서 발생하는 사이드 이펙트나 리소스 누수를 사전에 발견하려고, 개발 모드에서 다음과 같은 동작을 의도적으로 두 번 실행한다:

1. Client Component 렌더링 함수 본문
2. `useState`, `useMemo`, `useReducer`의 초기화 함수
3. `useEffect`, `useLayoutEffect`의 셋업 및 클린업 함수

예를 들어 `useEffect` 내부에서 이벤트 리스너나 타이머를 등록한 뒤 클린업 함수를 작성하지 않았다면, 두 번째 마운트 과정에서 리스너가 중복 등록되어 버그가 즉시 드러난다.

#### 브라우저 콘솔 경고 항목

Strict Mode는 다음과 같은 비권장 및 레거시 패턴이 감지될 때 브라우저 개발자 도구 콘솔에 경고를 출력한다:

- 안전하지 않은 생명주기 메서드(`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`) 사용
- 구식 문자열 `ref` API 사용
- 폐기된 `findDOMNode` API 사용
- 레거시 Context API 사용
- 렌더링 도중 상태를 직접 변경하는 부작용

### 점진적 도입 및 하위 트리 적용

오래된 서드파티 라이브러리를 사용하거나 레거시 코드가 많은 대규모 프로젝트에서는 Strict Mode를 전역 활성화했을 때 방대한 양의 경고가 쏟아지기도 한다. 이러한 경우 `next.config.ts`에서 전역 옵션을 끄고 리팩토링이 완료된 특정 하위 컴포넌트 트리만 `<React.StrictMode>` 컴포넌트로 감싸 점진적으로 적용한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 대규모 레거시 프로젝트에서 전역 검사 비활성화
  reactStrictMode: false,
}

export default nextConfig
```

```tsx filename="app/components/modern-widget.tsx"
'use client'

import React from 'react'

export function ModernWidget() {
  return (
    <React.StrictMode>
      <section>
        <h2>현대화된 위젯 영역</h2>
        <p>이 하위 트리에 포함된 컴포넌트에만 Strict Mode 검사가 적용된다.</p>
      </section>
    </React.StrictMode>
  )
}
```

> **알아두면 좋은 점**:
>
> - **App Router 기본값**: Next.js 13.5.1부터 App Router에서는 Strict Mode가 기본값으로 `true`로 설정되어 있다. 따라서 위 설정은 주로 Pages Router 프로젝트에 적용하거나, Strict Mode를 명시적으로 비활성화(`reactStrictMode: false`)하고자 할 때 사용한다.
> - **활성화 강력 권장**: 향후 React 기능과 호환되도록 유지하고 애플리케이션 품질을 높이려면 Next.js 프로젝트에서 Strict Mode를 활성화하기를 권장한다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v13.5.1` | App Router 환경에서 `reactStrictMode` 기본값이 `true`로 변경됨 |
| `v12.0.0` | `create-next-app`으로 생성된 신규 프로젝트에서 Strict Mode 기본 활성화 |
| `v9.5.0` | `reactStrictMode` 설정 옵션 공식 도입 |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (개발 모드에서 useEffect 2회 호출 및 부작용 감지 콘솔 로그 관찰 가능)
- Client Component 내에 `useEffect`를 작성하고 내부에 `console.log('마운트 실행')`을 배치한다.
- 개발 서버(`next dev`) 환경에서 브라우저 콘솔을 열었을 때 초기 렌더링 시 로그가 2회 연속 출력되고 클린업 함수가 정상 호출되는지 관찰한다.
- `next.config.ts`에서 `reactStrictMode: false`로 전환했을 때 1회만 출력되는 동작 차이를 대조 검증한다.

## 연습 문제

1. Next.js에서 React Strict Mode의 동작 특성에 대한 설명으로 옳지 않은 것은?
   - A. 프로덕션 빌드(`next build`)에서는 실행되지 않으며 런타임 성능에 영향을 주지 않는다.
   - B. App Router에서는 Next.js 13.5.1부터 기본값으로 활성화(`true`)되어 있다.
   - C. 개발 모드에서 부작용 누수를 찾기 위해 컴포넌트 렌더링과 Effect 셋업/클린업을 의도적으로 2회 실행한다.
   - D. Strict Mode는 Server Component의 서버 측 렌더링 파이프라인에서만 독점적으로 동작한다.

<details><summary>정답 보기</summary>

정답: **D**  
해설: React Strict Mode는 주로 클라이언트 측 렌더링 및 React 런타임(Client Component)에서 생명주기 메서드, 훅 부작용, 레거시 API 사용을 검사하는 도구이며 Server Component 전용 기능이 아니다.
</details>

2. 대규모 레거시 프로젝트에서 Strict Mode를 점진적으로 도입하기 위한 가장 적절한 방법은?
   - A. `next.config.ts`에서 `reactStrictMode: 'warn'`으로 설정한다.
   - B. 전역 설정을 `reactStrictMode: false`로 두고, 현대화할 특정 컴포넌트 트리를 `<React.StrictMode>`로 감싼다.
   - C. 브라우저 주소창에 `?strict=true` 파라미터를 추가한다.
   - D. 모든 소스 파일 상단에 `'use strict'` 지시어를 선언한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 전역 설정을 비활성화한 상태에서 React가 제공하는 `<React.StrictMode>` 래퍼 컴포넌트를 사용하면 애플리케이션의 특정 하위 트리에만 선별적으로 검사를 적용하여 점진적으로 리팩토링할 수 있다.
</details>

## 챕터 요약

- `reactStrictMode`는 개발 환경에서 안전하지 않은 생명주기 메서드와 부작용을 사전에 감지하는 React 런타임 검사 옵션이다.
- App Router에서는 Next.js 13.5.1부터 기본값으로 `true`가 적용된다.
- 개발 모드에서 컴포넌트 렌더링과 Effect를 두 번 실행하여 클린업 누락과 불순한 함수를 찾아낸다.
- 프로덕션 빌드(`next build`)에서는 번들과 런타임에 영향을 미치지 않는다.
- 전역 비활성화 후 `<React.StrictMode>`를 활용하여 하위 컴포넌트 트리에 점진적으로 도입할 수 있다.
