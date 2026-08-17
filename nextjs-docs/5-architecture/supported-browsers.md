# Supported Browsers

- 공식 문서: [Supported Browsers](https://nextjs.org/docs/architecture/supported-browsers)
- 상위 메뉴: [Architecture](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js가 기본적으로 어떤 브라우저를 지원 대상으로 삼는지, 그 기준을 `browserslist`로 어떻게 바꿀 수 있는지 이해한다.
- Next.js가 자동으로 주입하는 폴리필의 종류와, 프로덕션 빌드에서 중복이 제거되는 방식을 파악한다.
- App Router와 Pages Router 각각에서 커스텀 폴리필을 추가하는 방법을 구분해서 설명한다.
- 조건부 폴리필 로딩이 왜 필요한지, 어떻게 구현하는지 이해한다.
- Next.js가 기본으로 지원하는 최신 JavaScript 언어 기능의 범위를 안다.

## 핵심 개념 및 설명

### 기본 지원 브라우저

Next.js는 **별도 설정 없이도 모던 브라우저를 지원한다.** 별도로 `browserslist`를 지정하지 않으면 다음 설정이 기본값으로 적용된다.

```json
{
  "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"]
}
```

특정 브라우저나 기능을 타겟팅하고 싶다면 `package.json`에 [Browserslist](https://browsersl.ist/) 설정을 직접 추가해 이 기본값을 재정의할 수 있다.

### Polyfills

Next.js는 [널리 쓰이는 폴리필](https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js)을 자동으로 주입한다. 대표적으로 다음 세 가지가 있다.

- [**fetch()**](https://developer.mozilla.org/docs/Web/API/Fetch_API) — `whatwg-fetch`, `unfetch`를 대체한다.
- [**URL**](https://developer.mozilla.org/docs/Web/API/URL) — [`url` 패키지(Node.js API)](https://nodejs.org/api/url.html)를 대체한다.
- [**Object.assign()**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — `object-assign`, `object.assign`, `core-js/object/assign`을 대체한다.

의존성 패키지가 이 폴리필들을 이미 포함하고 있다면, 프로덕션 빌드에서 중복분이 자동으로 제거된다.

또한 번들 크기를 줄이기 위해 Next.js는 이 폴리필이 필요한 브라우저에만 로드한다. 전 세계 웹 트래픽 대부분은 이 폴리필을 아예 다운로드하지 않는다.

### Custom Polyfills

직접 작성한 코드나 외부 npm 의존성이 타겟 브라우저(예: IE 11)가 지원하지 않는 기능을 사용한다면, 폴리필을 직접 추가해야 한다.

#### App Router에서

App Router에서는 [`instrumentation-client.js` 파일](../3-api-reference/3.1-file-conventions/instrumentation-client.md)에 폴리필을 import해서 포함시킬 수 있다.

```js
import './polyfills'
```

#### Pages Router에서

Pages Router에서는 필요한 **특정 폴리필**만 골라 [커스텀 `<App>`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app) 또는 개별 컴포넌트 최상단에 import해야 한다.

```tsx
import './polyfills'

import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

#### 폴리필 조건부 로딩

가장 좋은 접근 방식은 지원되지 않는 기능을 특정 UI 영역으로 격리하고, 필요할 때만 폴리필을 조건부로 로드하는 것이다.

```tsx
import { useCallback } from 'react'

export const useAnalytics = () => {
  const tracker = useCallback(async (data: unknown) => {
    if (!('structuredClone' in globalThis)) {
      // structuredClone을 지원하지 않는 브라우저에서만 폴리필을 동적으로 불러온다
      const mod = await import('polyfills/structured-clone')
      globalThis.structuredClone = mod.default
    }

    /* structuredClone을 사용하는 작업을 수행한다 */
  }, [])

  return tracker
}
```

### JavaScript Language Features

Next.js는 별도 설정 없이 최신 JavaScript 기능을 바로 사용할 수 있게 해준다. [ES6 기능](https://github.com/lukehoban/es6features)은 물론, 다음도 지원한다.

- [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017)
- [Object Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread) (ES2018)
- [Dynamic `import()`](https://github.com/tc39/proposal-dynamic-import) (ES2020)
- [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) (ES2020)
- [Nullish Coalescing](https://github.com/tc39/proposal-nullish-coalescing) (ES2020)
- [Class Fields](https://github.com/tc39/proposal-class-fields), [Static Properties](https://github.com/tc39/proposal-static-class-features) (ES2022)
- 그 외에도 다양한 최신 기능

#### TypeScript Features

Next.js는 TypeScript를 별도 설정 없이 지원한다. [자세히 알아보기](../3-api-reference/3.5-config/typescript.md)

#### 커스텀 Babel 설정 (고급)

Babel 설정을 직접 커스터마이징할 수도 있다. [자세히 알아보기](https://nextjs.org/docs/pages/guides/babel)

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서는 `package.json`의 `browserslist` 값을 바꿔가며 빌드 산출물의 폴리필 포함 여부가 달라지는지 비교하는 데모를 설계한다.
- `structuredClone` 같은 API를 오래된 브라우저 UA로 흉내 낸 환경에서 조건부 폴리필 로딩 코드가 실제로 동작하는지 확인하는 시나리오를 포함한다.

## 연습 문제

1. Next.js가 기본적으로 자동 주입하는 폴리필이 **아닌** 것은?
   - A. `fetch()`
   - B. `URL`
   - C. `structuredClone`

<details><summary>정답 보기</summary>

정답: C. Next.js가 자동으로 주입하는 폴리필은 `fetch()`, `URL`, `Object.assign()` 세 가지다. `structuredClone`처럼 그 외의 기능은 필요할 때 직접 조건부로 폴리필을 로드해야 한다.
</details>

2. App Router 프로젝트에서 커스텀 폴리필을 추가하려 할 때 올바른 방법은?

   - A. `pages/_app.js`에 폴리필을 import한다.
   - B. `instrumentation-client.js` 파일에 폴리필을 import한다.
   - C. `next.config.js`의 `browserslist` 필드에 폴리필 코드를 직접 작성한다.

<details><summary>정답 보기</summary>

정답: B. App Router에서는 `instrumentation-client.js` 파일에 폴리필을 import한다. `pages/_app.js`는 Pages Router 방식이며, `browserslist`는 타겟 브라우저 범위를 지정할 뿐 폴리필 코드를 담는 곳이 아니다.
</details>

## 챕터 요약

- Next.js는 별도 설정 없이도 모던 브라우저(`chrome 111`, `edge 111`, `firefox 111`, `safari 16.4`)를 기본으로 지원하며, `package.json`의 `browserslist`로 이 기준을 바꿀 수 있다.
- `fetch()`, `URL`, `Object.assign()` 폴리필을 자동으로 주입하되, 필요한 브라우저에만 로드하고 의존성에 이미 포함된 폴리필은 프로덕션 빌드에서 중복 제거한다.
- IE 11 같은 구형 브라우저를 지원해야 한다면 App Router는 `instrumentation-client.js`에, Pages Router는 커스텀 `<App>`이나 개별 컴포넌트에 폴리필을 직접 import해야 한다.
- 지원되지 않는 기능을 특정 UI 영역으로 격리하고 필요할 때만 동적 import로 폴리필을 로드하는 조건부 로딩 방식을 권장한다.
- Async/await, Optional Chaining, Nullish Coalescing 등 최신 JavaScript 문법과 TypeScript를 별도 설정 없이 사용할 수 있으며, 필요하면 Babel 설정도 커스터마이징할 수 있다.
