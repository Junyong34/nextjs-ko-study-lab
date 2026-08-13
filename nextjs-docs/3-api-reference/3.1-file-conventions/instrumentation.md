# instrumentation.js

- 공식 문서: [instrumentation.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 서버 instance 시작과 request error를 관측 도구에 연결한다.
- `register`, `onRequestError`, runtime별 import 계약을 이해한다.

## 핵심 개념 및 설명

`instrumentation.js|ts` 파일은 관찰 가능성 도구를 애플리케이션에 통합하여 성능과 동작을 추적하고 프로덕션에서 문제를 디버깅하는 데 사용된다.

이를 사용하려면 응용 프로그램의 **루트**에 파일을 배치하거나, ​​사용하는 경우 [`src` 폴더](src-folder.md) 내부에 파일을 배치한다.

<a id="exports"></a>
### 내보내기

<a id="register-optional"></a>
#### `register`(옵션)

파일은 새 Next.js 서버 인스턴스가 시작될 때 **한 번** 호출되고 서버가 요청을 처리할 준비가 되기 전에 완료되어야 하는 `register` 함수를 내보낸다.`register`는 비동기 기능이 될 수 있다.

```ts filename="instrumentation.ts" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

```js filename="instrumentation.js" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

<a id="onrequesterror-optional"></a>
#### `onRequestError`(옵션)

선택적으로 `onRequestError` 함수를 내보내 **서버** 오류를 사용자 정의 관측 가능성 공급자로 추적할 수 있다.

- `onRequestError`에서 비동기 작업을 실행 중인 경우 해당 작업이 기다리고 있는지 확인한다. Next.js 서버가 오류를 캡처하면 `onRequestError`가 트리거된다.
- `error` 인스턴스는 Server Component 렌더링 중에 발생하는 경우 React에서 처리할 수 있으므로 발생한 원래 오류 인스턴스가 아닐 수 있다. 이런 일이 발생하면 오류에 대한 `digest` 속성을 사용하여 실제 오류 유형을 식별할 수 있다.

```ts filename="instrumentation.ts" switcher
import { type Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  const message = err instanceof Error ? err.message : String(err)
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err
      ? String(err.digest)
      : undefined

  await fetch('https://.../report-error', {
    method: 'POST',
    body: JSON.stringify({
      message,
      digest,
      request,
      context,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

```js filename="instrumentation.js" switcher
export async function onRequestError(err, request, context) {
  const message = err instanceof Error ? err.message : String(err)
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err
      ? String(err.digest)
      : undefined

  await fetch('https://.../report-error', {
    method: 'POST',
    body: JSON.stringify({
      message,
      digest,
      request,
      context,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

<a id="parameters"></a>
##### 매개변수

이 함수는 `error`,`request` 및 `context`의 세 가지 매개 변수를 허용한다.

```ts filename="Types"
export function onRequestError(
  error: unknown,
  request: {
    path: string // 리소스 경로(예: /blog?name=foo
    method: string // 요청 방법. 예를 들어 GET, POST 등
    headers: { [key: string]: string | string[] }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router' // 라우터 유형
    routePath: string // 경로 파일 경로, 예: /앱/블로그/[동적]
    routeType: 'render' | 'route' | 'action' | 'proxy' // 오류가 발생한 상황
    renderSource:
      | 'react-server-components'
      | 'react-server-components-payload'
      | 'server-rendering'
    revalidateReason: 'on-demand' | 'stale' | undefined // 정의되지 않음은 revalidate이 없는 일반적인 요청이다.
    renderType: 'dynamic' | 'dynamic-resume' // PPR에서는 'dynamic-resume'을 사용한다
  }
): void | Promise<void>
```

- `error`: 잡힌 값은 `unknown`로 입력된다.`message` 또는 `digest`와 같은 속성을 읽기 전에 범위를 좁힌다.
- `request`: 오류와 관련된 읽기 전용 요청 정보이다.
- `context`: 오류가 발생한 컨텍스트이다. 이는 라우터 유형(앱 또는 페이지 라우터) 및/또는 (Server Component(`'render'`), Route Handler(`'route'`), Server Action(`'action'`) 또는 프록시(`'proxy'`))일 수 있다.

<a id="specifying-the-runtime"></a>
#### 런타임 지정

`instrumentation.js` 파일은 Node.js 및 Edge 런타임 모두에서 작동하지만 `process.env.NEXT_RUNTIME`를 사용하여 특정 런타임을 대상으로 할 수 있다.

```js filename="instrumentation.js"
export function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return require('./register.edge')
  } else {
    return require('./register.node')
  }
}

export function onRequestError() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return require('./on-request-error.edge')
  } else {
    return require('./on-request-error.node')
  }
}
```

<a id="version-history"></a>
### Version History

| 버전 | 변경 사항 |
| --------- | ------------------------------------------------------- |
| `v15.0.0` | `onRequestError` 출시,`instrumentation` 안정 |
| `v14.0.4` | `instrumentation`에 대한 터보팩 지원 |
| `v13.2.0` | 실험적 기능으로 도입된 `instrumentation` |

## 예제 및 데모 설계

- Phase 2에서 server start와 Route Handler 오류를 구조화 log로 남긴다.
- `digest`, routePath, routeType, renderSource를 함께 저장해 같은 오류를 연결한다.

## 연습 문제

1. `register` 호출 시점은?
   - A. 매 browser click마다
   - B. 새 server instance가 시작될 때 한 번
   - C. 모든 React render마다

<details><summary>정답 보기</summary>

정답: B. 요청을 받기 전에 instrumentation 초기화를 완료한다.
</details>

## 챕터 요약

- `instrumentation.js`는 서버 관측 도구 연결점이다.
- `register`는 server instance 시작 때 한 번 실행된다.
- `onRequestError`는 서버 오류와 요청·route context를 받는다.
- 비동기 오류 보고는 await해야 한다.
- `digest`로 처리된 서버 오류를 추적할 수 있다.
