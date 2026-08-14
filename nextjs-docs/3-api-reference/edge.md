# Edge Runtime

- 공식 문서: [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- 상위 메뉴: [API Reference](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Node.js Runtime과 Edge Runtime 두 서버 런타임의 차이를 이해한다.
- Edge Runtime의 제약(ISR 미지원, 일부 Node.js API 미지원)을 파악한다.
- Edge Runtime이 지원하는 API 범주와 지원하지 않는 언어 기능을 확인한다.
- `unstable_allowDynamic`으로 동적 코드 평가 검사를 완화하는 방법을 이해한다.

## 핵심 개념 및 설명

Next.js에는 애플리케이션에서 사용할 수 있는 두 가지 서버 런타임이 있다.

- **Node.js Runtime**(기본값): 모든 Node.js API에 접근할 수 있으며, 애플리케이션을 렌더링하는 데 사용된다.
- **Edge Runtime**: 더 제한된 [API 집합](#reference)만 포함하며, [Proxy](./3.1-file-conventions/proxy.md)에서 사용된다.

### 주의사항

> **알아두면 좋은 점**:
>
> - Edge Runtime은 모든 Node.js API를 지원하지 않는다. 일부 패키지는 예상대로 동작하지 않을 수 있다.
> - Edge Runtime은 증분 정적 재생성(Incremental Static Regeneration, ISR)을 지원하지 않는다.
> - 두 런타임 모두 배포 어댑터에 따라 [스트리밍](./3.1-file-conventions/loading.md)을 지원할 수 있다.

### Reference

<a id="reference"></a>

Edge Runtime은 다음 API를 지원한다.

#### Network APIs

| API | 설명 |
| --- | --- |
| `Blob` | blob을 나타낸다 |
| `fetch` | 리소스를 가져온다 |
| `FetchEvent` | fetch 이벤트를 나타낸다 |
| `File` | 파일을 나타낸다 |
| `FormData` | form 데이터를 나타낸다 |
| `Headers` | HTTP 헤더를 나타낸다 |
| `Request` | HTTP 요청을 나타낸다 |
| `Response` | HTTP 응답을 나타낸다 |
| `URLSearchParams` | URL 검색 매개변수를 나타낸다 |
| `WebSocket` | 웹소켓 연결을 나타낸다 |

#### Encoding APIs

| API | 설명 |
| --- | --- |
| `atob` | base-64로 인코딩된 문자열을 디코딩한다 |
| `btoa` | 문자열을 base-64로 인코딩한다 |
| `TextDecoder` | `Uint8Array`를 문자열로 디코딩한다 |
| `TextDecoderStream` | 스트림용으로 체이닝 가능한 디코더다 |
| `TextEncoder` | 문자열을 `Uint8Array`로 인코딩한다 |
| `TextEncoderStream` | 스트림용으로 체이닝 가능한 인코더다 |

#### Stream APIs

| API | 설명 |
| --- | --- |
| `ReadableStream` | 읽기 가능한 스트림을 나타낸다 |
| `ReadableStreamBYOBReader` | `ReadableStream`의 reader를 나타낸다 |
| `ReadableStreamDefaultReader` | `ReadableStream`의 reader를 나타낸다 |
| `TransformStream` | 변환 스트림을 나타낸다 |
| `WritableStream` | 쓰기 가능한 스트림을 나타낸다 |
| `WritableStreamDefaultWriter` | `WritableStream`의 writer를 나타낸다 |

#### Crypto APIs

| API | 설명 |
| --- | --- |
| `crypto` | 플랫폼의 암호화 기능에 접근한다 |
| `CryptoKey` | 암호화 키를 나타낸다 |
| `SubtleCrypto` | 해싱, 서명, 암호화, 복호화 같은 일반적인 암호화 프리미티브에 접근한다 |

#### Web Standard APIs

| API | 설명 |
| --- | --- |
| `AbortController` | 하나 이상의 DOM 요청을 원하는 시점에 중단할 수 있게 한다 |
| `Array` | 값들의 배열을 나타낸다 |
| `ArrayBuffer` | 범용 고정 길이 원시 이진 데이터 버퍼를 나타낸다 |
| `Atomics` | 정적 메서드로 원자적(atomic) 연산을 제공한다 |
| `BigInt` | 임의 정밀도를 가진 정수를 나타낸다 |
| `BigInt64Array` | 64비트 부호 있는 정수 타입 배열을 나타낸다 |
| `BigUint64Array` | 64비트 부호 없는 정수 타입 배열을 나타낸다 |
| `Boolean` | 논리적 개체를 나타내며 true·false 두 값을 가질 수 있다 |
| `clearInterval` | `setInterval()` 호출로 설정된 반복 작업을 취소한다 |
| `clearTimeout` | `setTimeout()` 호출로 설정된 예약 작업을 취소한다 |
| `console` | 브라우저의 디버깅 콘솔에 접근한다 |
| `DataView` | `ArrayBuffer`의 범용 뷰를 나타낸다 |
| `Date` | 플랫폼 독립적인 형식으로 특정 시점을 나타낸다 |
| `decodeURI` | `encodeURI`나 유사한 방식으로 생성된 URI를 디코딩한다 |
| `decodeURIComponent` | `encodeURIComponent`나 유사한 방식으로 생성된 URI 컴포넌트를 디코딩한다 |
| `DOMException` | DOM에서 발생하는 오류를 나타낸다 |
| `encodeURI` | 특정 문자들을 UTF-8 인코딩을 나타내는 하나~네 개의 이스케이프 시퀀스로 치환해 URI를 인코딩한다 |
| `encodeURIComponent` | 특정 문자들을 UTF-8 인코딩을 나타내는 하나~네 개의 이스케이프 시퀀스로 치환해 URI 컴포넌트를 인코딩한다 |
| `Error` | 문장 실행이나 속성 접근 중 발생하는 오류를 나타낸다 |
| `EvalError` | 전역 함수 `eval()`과 관련해 발생하는 오류를 나타낸다 |
| `Float32Array` | 32비트 부동소수점 숫자 타입 배열을 나타낸다 |
| `Float64Array` | 64비트 부동소수점 숫자 타입 배열을 나타낸다 |
| `Function` | 함수를 나타낸다 |
| `Infinity` | 수학적 무한대 값을 나타낸다 |
| `Int8Array` | 8비트 부호 있는 정수 타입 배열을 나타낸다 |
| `Int16Array` | 16비트 부호 있는 정수 타입 배열을 나타낸다 |
| `Int32Array` | 32비트 부호 있는 정수 타입 배열을 나타낸다 |
| `Intl` | 국제화·지역화 기능에 접근한다 |
| `isFinite` | 값이 유한한 숫자인지 판별한다 |
| `isNaN` | 값이 `NaN`인지 아닌지 판별한다 |
| `JSON` | JavaScript 값을 JSON 형식으로 변환하거나 JSON 형식에서 변환하는 기능을 제공한다 |
| `Map` | 각 값이 한 번만 나타날 수 있는 값들의 컬렉션을 나타낸다 |
| `Math` | 수학 함수와 상수에 접근한다 |
| `Number` | 숫자 값을 나타낸다 |
| `Object` | 모든 JavaScript 객체의 기반이 되는 객체를 나타낸다 |
| `parseFloat` | 문자열 인자를 파싱해 부동소수점 숫자를 반환한다 |
| `parseInt` | 문자열 인자를 파싱해 지정된 진법의 정수를 반환한다 |
| `Promise` | 비동기 연산의 최종 완료(또는 실패)와 그 결과 값을 나타낸다 |
| `Proxy` | 속성 조회, 할당, 열거, 함수 호출 등 기본 연산에 대한 커스텀 동작을 정의하는 객체를 나타낸다 |
| `queueMicrotask` | 마이크로태스크를 실행 대기열에 넣는다 |
| `RangeError` | 값이 허용된 값·범위 집합에 속하지 않을 때의 오류를 나타낸다 |
| `ReferenceError` | 존재하지 않는 변수를 참조할 때의 오류를 나타낸다 |
| `Reflect` | 가로챌 수 있는(interceptable) JavaScript 연산을 위한 메서드를 제공한다 |
| `RegExp` | 문자 조합을 매칭할 수 있는 정규 표현식을 나타낸다 |
| `Set` | 각 값이 한 번만 나타날 수 있는 값들의 컬렉션을 나타낸다 |
| `setInterval` | 고정된 시간 간격으로 함수를 반복 호출한다 |
| `setTimeout` | 지정된 밀리초 후 함수를 호출하거나 표현식을 평가한다 |
| `SharedArrayBuffer` | 범용 고정 길이 원시 이진 데이터 버퍼를 나타낸다 |
| `String` | 문자들의 시퀀스를 나타낸다 |
| `structuredClone` | 값의 깊은 복사본을 만든다 |
| `Symbol` | 객체 속성의 키로 사용되는 고유하고 불변인 데이터 타입을 나타낸다 |
| `SyntaxError` | 문법적으로 잘못된 코드를 해석하려 할 때의 오류를 나타낸다 |
| `TypeError` | 값이 예상된 타입이 아닐 때의 오류를 나타낸다 |
| `Uint8Array` | 8비트 부호 없는 정수 타입 배열을 나타낸다 |
| `Uint8ClampedArray` | 0~255로 클램프된 8비트 부호 없는 정수 타입 배열을 나타낸다 |
| `Uint32Array` | 32비트 부호 없는 정수 타입 배열을 나타낸다 |
| `URIError` | 전역 URI 처리 함수가 잘못 사용됐을 때의 오류를 나타낸다 |
| `URL` | 객체 URL을 생성하는 정적 메서드를 제공하는 객체를 나타낸다 |
| `URLPattern` | URL 패턴을 나타낸다 |
| `URLSearchParams` | 키/값 쌍의 컬렉션을 나타낸다 |
| `WeakMap` | 키가 약하게(weak) 참조되는 키/값 쌍의 컬렉션을 나타낸다 |
| `WeakSet` | 각 객체가 한 번만 나타날 수 있는 객체들의 컬렉션을 나타낸다 |
| `WebAssembly` | WebAssembly에 접근한다 |

#### Next.js Specific Polyfills

- [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage)

#### Environment Variables

`next dev`와 `next build` 양쪽 모두에서 `process.env`로 [환경 변수](../2-guides/environment-variables.md)에 접근할 수 있다.

#### Unsupported APIs

Edge Runtime에는 다음과 같은 제약이 있다.

- 네이티브 Node.js API는 **지원하지 않는다**. 예를 들어 파일 시스템을 읽거나 쓸 수 없다.
- `node_modules`는 ES Modules로 구현되어 있고 네이티브 Node.js API를 사용하지 않는 한 사용할 수 **있다**.
- `require`를 직접 호출하는 것은 **허용되지 않는다**. 대신 ES Modules를 사용해야 한다.

다음 JavaScript 언어 기능은 비활성화되어 있으며 **동작하지 않는다.**

| API | 설명 |
| --- | --- |
| `eval` | 문자열로 표현된 JavaScript 코드를 평가한다 |
| `new Function(evalString)` | 인자로 전달된 코드로 새 함수를 만든다 |
| `WebAssembly.compile` | 버퍼 소스로부터 WebAssembly 모듈을 컴파일한다 |
| `WebAssembly.instantiate` | 버퍼 소스로부터 WebAssembly 모듈을 컴파일하고 인스턴스화한다 |

드문 경우지만, 코드(또는 그 코드가 import하는 모듈)에 런타임에는 **도달할 수 없지만** 트리쉐이킹으로 제거되지 않는 동적 코드 평가 구문이 포함될 수 있다. 이럴 때는 Proxy 설정에서 특정 파일에 대한 검사를 완화할 수 있다.

```ts
export const config = {
  unstable_allowDynamic: [
    // 단일 파일을 허용한다
    '/lib/utilities.js',
    // glob으로 function-bind 서드파티 모듈 안의 모든 파일을 허용한다
    '**/node_modules/function-bind/**',
  ],
}
```

`unstable_allowDynamic`은 특정 파일에 대해 동적 코드 평가 검사를 무시하는 [glob](https://github.com/micromatch/micromatch#matching-features) 또는 glob 배열이다. 이 glob은 애플리케이션 루트 폴더를 기준으로 한 상대 경로다.

이 구문이 Edge에서 실제로 실행되면 오류가 발생하며 런타임 에러를 일으킨다는 점에 유의한다.

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서 Proxy 데모를 만들 때, `runtime = 'edge'`로 설정한 경로에서 파일 시스템 API를 호출해 Edge Runtime 제약이 실제로 오류를 발생시키는지 확인하는 데모를 설계한다.
- `unstable_allowDynamic` 설정 전후로 빌드 경고·에러가 어떻게 달라지는지 비교하는 시나리오를 포함한다.

## 연습 문제

1. Edge Runtime이 지원하지 **않는** 것은?
   - A. `fetch`, `Request`, `Response` 같은 네트워크 API
   - B. 증분 정적 재생성(ISR)
   - C. `crypto`, `SubtleCrypto` 같은 암호화 API

<details><summary>정답 보기</summary>

정답: B. Edge Runtime은 ISR을 지원하지 않는다. 네트워크 API와 암호화 API는 모두 지원 범위에 포함된다.
</details>

2. Edge Runtime에서 `eval`이나 `new Function(evalString)`을 코드가 실제로 실행할 때 일어나는 일은?
   - A. 자동으로 Node.js Runtime으로 전환된다.
   - B. 무시되고 빈 값을 반환한다.
   - C. 지원되지 않는 기능이므로 런타임 에러가 발생한다.

<details><summary>정답 보기</summary>

정답: C. `eval`, `new Function(evalString)`, `WebAssembly.compile`, `WebAssembly.instantiate`는 비활성화되어 있어 Edge에서 실행되면 오류를 던진다.
</details>

## 챕터 요약

- Next.js는 기본값인 Node.js Runtime과, 더 제한된 API를 제공하는 Edge Runtime 두 가지를 제공한다.
- Edge Runtime은 Proxy에서 사용되며, 일부 Node.js API와 ISR을 지원하지 않는다.
- Edge Runtime은 Network·Encoding·Stream·Crypto·Web Standard APIs와 `AsyncLocalStorage` 폴리필, `process.env` 환경 변수 접근을 지원한다.
- `require` 직접 호출과 `eval`, `new Function`, `WebAssembly.compile`/`instantiate`는 Edge Runtime에서 동작하지 않는다.
- `unstable_allowDynamic`으로 도달 불가능한 동적 코드 평가 구문에 대한 검사를 파일 단위로 완화할 수 있다.
