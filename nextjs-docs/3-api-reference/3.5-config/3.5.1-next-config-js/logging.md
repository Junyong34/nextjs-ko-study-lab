# logging

- 공식 문서: [logging](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 개발 모드(`next dev`)에서 Next.js의 터미널 로깅 동작과 하위 옵션 구조를 이해한다.
- `fetches` 설정으로 데이터 페칭 URL 상세 출력과 HMR 캐시 복원 여부를 로깅하는 방법을 파악한다.
- `serverFunctions`, `incomingRequests`, `browserToTerminal` 설정을 통해 개발 생산성을 극대화하는 로깅 환경을 구성한다.

## 핵심 개념 및 설명

`logging`은 개발 서버(`next dev`)가 실행되는 동안 터미널에 출력되는 다양한 로그의 수준과 표시 방식을 제어하는 옵션이다.

데이터 페칭(`fetch`) 요청의 전체 URL 출력, Server Component HMR 캐시 복원 로그, Server Function 호출 통계, 유입되는 HTTP 요청 필터링, 브라우저 클라이언트의 콘솔 출력을 서버 터미널로 실시간 포워딩하는 기능 등을 세부적으로 설정할 수 있다.

### 기본 설정 구조

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    serverFunctions: true,
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
    browserToTerminal: 'warn',
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    serverFunctions: true,
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
    browserToTerminal: 'warn',
  },
}

export default nextConfig
```

### Options

| 옵션 키 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `logging` | `false \| object` | `{}` | 개발 서버 로깅 전체를 끄거나(`false`) 세부 로깅 옵션 객체를 설정한다. |
| `logging.fetches.fullUrl` | `boolean` | `false` | 터미널에 잘린 형태가 아닌 전체 fetch 요청 URL을 출력할지 여부. |
| `logging.fetches.hmrRefreshes` | `boolean` | `false` | Server Component HMR 캐시에서 복원된 fetch 요청 로그를 표시할지 여부. |
| `logging.serverFunctions` | `boolean` | `true` | Server Function 호출 시 함수명, 인자, 소요 시간을 터미널에 출력할지 여부. |
| `logging.incomingRequests` | `boolean \| { ignore?: RegExp[] }` | `true` | 유입되는 HTTP 요청 로그를 출력할지 여부 또는 무시할 경로 정규식 목록. |
| `logging.browserToTerminal` | `boolean \| 'warn' \| 'error'` | `false` | 브라우저 콘솔 로그를 소스 위치와 함께 개발 터미널로 전달할지 여부. |

#### Fetching

`logging.fetches`는 App Router 환경에서 `fetch` 요청 시 터미널에 출력되는 정보를 제어한다:

- `fullUrl`: 기본적으로 Next.js는 터미널 가독성을 위해 긴 URL을 축약한다. `fullUrl: true`로 설정하면 쿼리 파라미터를 포함한 전체 URL을 있는 그대로 터미널에 출력한다.
- `hmrRefreshes`: 개발 중에 코드를 편집하고 저장할 때 Server Component HMR 캐시에서 복원해 재사용한 fetch 요청을 터미널에 표시한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
}

export default nextConfig
```

#### Server Functions

`logging.serverFunctions`는 Server Function(Server Action)이 호출될 때마다 터미널에 실행 요약 로그를 표시할지 설정한다:

- 기본값은 `true`다.
- 터미널에는 실행된 HTTP 메서드, 라우트, 함수 이름, 전달된 인자, 실행 소요 시간(ms), 파일 위치가 트리 형태로 출력된다:

```bash
POST /
  └─ ƒ myAction(arg1, arg2) in 5ms app/actions.ts
```

이 로그를 숨기려면 `serverFunctions: false`로 설정한다.

#### Incoming Requests

`logging.incomingRequests`는 브라우저나 외부 클라이언트에서 유입되는 모든 HTTP 요청을 터미널에 표시할지 지정한다:

- 기본값은 `true`다.
- 특정 경로(예: 헬스체크 엔드포인트나 주기적인 폴링 API) 때문에 터미널이 혼잡해지는 것을 방지하려면 `ignore` 배열에 정규식(`RegExp`)을 등록해 해당 경로 로그를 제외할 수 있다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: {
    incomingRequests: {
      // 헬스체크 및 모니터링 엔드포인트 로그 제외
      ignore: [/\api\/health/, /\/favicon\.ico/],
    },
  },
}

export default nextConfig
```

또는 `incomingRequests`를 `false`로 설정하여 유입 요청 로깅을 완전히 끌 수도 있다:

```js filename="next.config.js"
module.exports = {
  logging: {
    incomingRequests: false,
  },
}
```

#### Browser Console Logs

개발 중에 브라우저 콘솔 로그(`console.log`, `console.warn`, `console.error`)를 터미널로 전달할 수 있다. 브라우저 개발자 도구를 확인하지 않고도 클라이언트 측 코드를 디버깅할 때 유용하다.

```js filename="next.config.js"
module.exports = {
  logging: {
    browserToTerminal: true,
  },
}
```

##### Options

`browserToTerminal` 옵션은 다음 값을 지원한다:

| 값 | 설명 |
|---|---|
| `'warn'` | 기본값으로 경고(`warn`)와 에러(`error`)만 전달한다. |
| `'error'` | 에러(`error`)만 전달한다. |
| `true` | 모든 콘솔 출력(`log`, `info`, `warn`, `error`)을 전달한다. |
| `false` | 브라우저 로그 전달을 비활성화한다. |

```js filename="next.config.js"
module.exports = {
  logging: {
    browserToTerminal: 'warn',
  },
}
```

##### Source Location

`browserToTerminal`이 활성화되면 브라우저 로그에는 기본적으로 소스 위치 정보(파일 경로 및 줄 번호)가 포함된다. 예를 들면 다음과 같다:

```tsx filename="app/page.tsx" highlight={8}
'use client'

export default function Home() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Hello World')
      }}
    >
      Click me
    </button>
  )
}
```

버튼을 클릭하면 터미널에 다음 메시지가 출력된다:

```bash filename="Terminal"
[browser] Hello World (app/page.tsx:8:17)
```

> **알아두면 좋은 점**:
>
> - `logging` 설정은 오직 개발 모드(`next dev`)에서만 동작하며 프로덕션 빌드나 배포 환경(`next start`)에는 전혀 영향을 주지 않는다.
> - `browserToTerminal`은 클라이언트와 개발 서버 간의 WebSocket 연결을 통해 전달되므로 네트워크 디버깅 시 브라우저 DevTools를 수시로 열지 않고도 클라이언트 런타임 이슈를 터미널에서 즉시 파악할 수 있다.

#### Disabling Logging

Next.js 개발 서버의 기본 터미널 로그를 완전히 비활성화하려면 `logging` 옵션에 `false`를 지정한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  logging: false, // 개발 모드 터미널 로깅 전체 비활성화
}

export default nextConfig
```

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.2.0` | `browserToTerminal` 정식 추가 (`experimental.browserDebugInfoInTerminal`에서 승격) |
| `v15.4.0` | `experimental.browserDebugInfoInTerminal` 실험적 기능 도입 |
| `v15.2.0` | `incomingRequests` 및 정규식 기반 `ignore` 필터링 기능 추가 |
| `v15.0.0` | `logging: false` 지원 추가, App Router용 `fetches.hmrRefreshes` 옵션 추가 |
| `v14.0.0` | App Router용 `logging.fetches` 옵션 안정화 |

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (개발 서버 터미널 콘솔 로그 출력 형식을 제어하는 옵션임)
- 전체 fetch URL 로깅 검증: 긴 쿼리스트링을 포함한 외부 API 요청을 Server Component에서 수행한 뒤, 터미널에 URL이 생략되지 않고 온전히 출력되는지 관찰한다.
- 헬스체크 요청 필터링 검증: `incomingRequests.ignore`에 `/api/health` 정규식을 등록하고 주기적으로 헬스체크 핑을 보냈을 때 터미널 로그가 생성되지 않는지 확인한다.
- 브라우저 콘솔 전달 검증: Client Component에서 `console.error('테스트 에러')`를 호출했을 때 개발 서버 터미널에 `[browser] 테스트 에러 (app/component.tsx:12:5)` 형태로 위치 정보와 함께 즉시 전달되는지 확인한다.

## 연습 문제

1. 개발 모드에서 잦은 헬스체크 API 호출로 터미널 로그가 혼잡해질 때, 특정 엔드포인트 로그만 골라서 제외하는 올바른 설정 방식은?
   - A. `logging: false`
   - B. `logging: { incomingRequests: { ignore: [/\/api\/health/] } }`
   - C. `logging: { fetches: { ignore: ['/api/health'] } }`
   - D. `logging: { suppressPaths: ['/api/health'] }`

<details><summary>정답 보기</summary>

정답: **B**
해설: `logging.incomingRequests` 옵션 객체의 `ignore` 배열에 정규식을 등록하면 해당 패턴과 일치하는 유입 HTTP 요청을 터미널 로깅 대상에서 제외할 수 있다.
</details>

2. Next.js 16.2에서 안정화된 `logging.browserToTerminal` 옵션에 대한 설명으로 틀린 것은?
   - A. 브라우저에서 실행된 `console.log` 및 `console.error` 메시지를 개발 서버 터미널에 전달할 수 있다.
   - B. 클라이언트 소스맵을 해석하여 소스 코드의 실제 파일명과 라인 번호를 함께 표시한다.
   - C. `'warn'`으로 설정하면 경고(`warn`)와 에러(`error`) 로그만 터미널로 전달된다.
   - D. 프로덕션 환경(`next start`)에서도 사용자 브라우저 콘솔 로그를 서버 터미널에 지속적으로 실시간 스트리밍한다.

<details><summary>정답 보기</summary>

정답: **D**
해설: `logging` 관련 옵션은 개발 환경(`next dev`) 전용 설정이며 프로덕션 환경에서는 동작하지 않는다.
</details>

## 챕터 요약

- `logging`은 개발 모드(`next dev`)에서 터미널에 출력되는 로그 수준과 세부 항목을 맞춤 설정하는 옵션이다.
- `logging.fetches`로 데이터 페칭의 전체 URL 표시와 Server Component HMR 캐시 복원 여부를 추적할 수 있다.
- `logging.serverFunctions`로 Server Function 호출 시 실행 시간 및 매개변수 로그를 제어한다.
- `logging.incomingRequests`에 정규식 `ignore` 목록을 지정해 주기적인 헬스체크 요청 등의 터미널 소음을 제거할 수 있다.
- `logging.browserToTerminal`을 사용하면 클라이언트 측 에러와 경고를 소스 위치 정보와 함께 서버 터미널에서 즉시 모니터링할 수 있다.
