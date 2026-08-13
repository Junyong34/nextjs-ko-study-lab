# Custom Server

- 공식 문서: [Custom Server](https://nextjs.org/docs/app/guides/custom-server)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 커스텀 서버가 필요한 경우와 필요하지 않은 경우를 구분할 수 있다.
- `createServer`와 `next()`로 커스텀 서버를 작성하고 `package.json` 스크립트를 연결할 수 있다.
- `next()`에 전달할 수 있는 옵션의 종류와 각 옵션의 기본값을 설명할 수 있다.
- 커스텀 서버와 standalone output 모드가 함께 쓰일 수 없는 이유를 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 기본적으로 `next start`로 실행되는 자체 서버를 포함한다. 기존 백엔드가 있다면 Next.js와 함께 그대로 사용할 수 있으며, 이는 커스텀 서버가 아니다. 커스텀 Next.js 서버는 커스텀 패턴을 위해 서버를 프로그래밍 방식으로 시작할 수 있게 해준다. 대부분의 경우 이 방식은 필요하지 않지만, 벗어나야 할 때를 위해 제공된다.

> **알아두면 좋은 점**:
>
> - 커스텀 서버를 쓰기로 결정하기 전에, 이는 Next.js에 내장된 라우터가 애플리케이션 요구사항을 충족하지 못할 때만 사용해야 한다는 점을 기억해야 한다.
> - standalone output 모드를 사용할 때는 커스텀 서버 파일을 추적하지 않는다. 이 모드는 대신 별도의 최소 `server.js` 파일을 출력한다. 두 방식은 함께 쓸 수 없다.

### 커스텀 서버 작성하기

다음은 커스텀 서버의 [예제](https://github.com/vercel/next.js/tree/canary/examples/custom-server)다.

```ts
// server.ts
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

> **알아두면 좋은 점**: `server.js`는 Next.js Compiler나 번들링 과정을 거치지 않는다. 이 파일이 요구하는 문법과 소스 코드가 현재 사용 중인 Node.js 버전과 호환되는지 직접 확인해야 한다. [예제 보기](https://github.com/vercel/next.js/tree/canary/examples/custom-server)

커스텀 서버를 실행하려면 `package.json`의 스크립트를 다음과 같이 갱신해야 한다.

```json
// package.json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

또는 nodemon을 설정할 수도 있다([예제](https://github.com/vercel/next.js/tree/canary/examples/custom-server)). 커스텀 서버는 다음 import로 서버와 Next.js 애플리케이션을 연결한다.

```ts
import next from 'next'

const app = next({})
```

위의 `next` import는 다음 옵션을 담은 객체를 받는 함수다.

| 옵션 | 타입 | 설명 |
|---|---|---|
| `conf` | `Object` | `next.config.js`에서 쓰는 것과 같은 객체다. 기본값은 `{}`다. |
| `dev` | `Boolean` | (선택) Next.js를 dev 모드로 실행할지 여부다. 기본값은 `false`다. |
| `dir` | `String` | (선택) Next.js 프로젝트의 위치다. 기본값은 `'.'`다. |
| `quiet` | `Boolean` | (선택) 서버 정보를 담은 에러 메시지를 숨긴다. 기본값은 `false`다. |
| `hostname` | `String` | (선택) 서버가 실행되는 hostname이다. |
| `port` | `Number` | (선택) 서버가 실행되는 port다. |
| `httpServer` | `node:http#Server` | (선택) Next.js가 그 뒤에서 실행되는 HTTP Server다. |
| `turbopack` | `Boolean` | (선택) Turbopack을 활성화한다(기본적으로 활성화되어 있다). |
| `webpack` | `Boolean` | (선택) webpack을 활성화한다. |

이렇게 반환된 `app`을 사용해 Next.js가 필요에 따라 요청을 처리하게 할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 `createServer` + `next()` 기반 커스텀 서버와 `next start`로 실행한 기본 서버의 요청 처리 흐름을 비교한다.
- `next()`에 `dev`, `hostname`, `port` 옵션을 다르게 넘겨 개발 모드/프로덕션 모드에서 로그 출력이 어떻게 달라지는지 확인한다.
- standalone output(`output: 'standalone'`)으로 빌드한 결과물의 `server.js`와, 이 챕터의 커스텀 `server.ts`가 각각 어떤 파일을 산출하는지 구조를 비교한다.
- 현재 Phase 1에서는 애플리케이션을 만들지 않고, 위 시나리오에서 사용할 파일 구성과 확인할 로그·출력만 설계한다.

## 연습 문제

1. 공식 문서가 커스텀 서버를 언제 사용해야 한다고 설명하는가?

   1. 모든 Next.js 프로젝트에서 기본적으로 사용해야 한다.
   2. Next.js에 내장된 라우터가 애플리케이션 요구사항을 충족하지 못할 때만 사용해야 한다.
   3. 기존 백엔드와 Next.js를 연결할 때는 반드시 커스텀 서버가 필요하다.
   4. standalone output 모드를 쓰려면 커스텀 서버가 필요하다.

   <details><summary>정답 보기</summary>

   **정답: 2** — 대부분의 경우 커스텀 서버는 필요하지 않으며, Next.js의 통합 라우터로 요구사항을 충족할 수 없을 때만 사용한다.

   </details>

2. 커스텀 서버와 standalone output 모드의 관계에 대한 설명으로 옳은 것은?

   1. 두 방식은 함께 사용해야 한다.
   2. standalone output 모드는 커스텀 서버 파일을 추적하지 않으며, 대신 별도의 최소 `server.js`를 출력한다.
   3. 커스텀 서버를 쓰면 standalone output이 자동으로 활성화된다.
   4. standalone output 모드에는 `next()` 옵션이 적용되지 않는다.

   <details><summary>정답 보기</summary>

   **정답: 2** — standalone output 모드는 커스텀 서버 파일을 추적하지 않고 별도의 최소 `server.js` 파일을 출력하므로, 두 방식은 함께 쓸 수 없다.

   </details>

3. `next()`에 전달할 수 있는 옵션에 대한 설명으로 옳은 것을 모두 고르시오.

   1. `dev`의 기본값은 `false`다.
   2. `turbopack`은 기본적으로 활성화되어 있다.
   3. `conf`는 `next.config.js`에서 쓰는 것과 다른 형식의 객체를 받는다.
   4. `httpServer`로 Next.js가 그 뒤에서 실행될 HTTP Server를 전달할 수 있다.

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 4** — `conf`는 `next.config.js`에서 쓰는 것과 같은 형식의 객체를 받는다.

   </details>

## 챕터 요약

- 커스텀 서버는 Next.js의 통합 라우터가 요구사항을 충족하지 못할 때만 사용하는 예외적인 방법이다.
- `createServer`(Node.js `http`)와 `next()`로 서버를 생성하고, `app.getRequestHandler()`로 요청을 넘긴다.
- 커스텀 서버를 실행하려면 `package.json`의 `dev`/`start` 스크립트를 `node server.js` 기반으로 바꿔야 한다.
- `server.js`는 Next.js Compiler와 번들링을 거치지 않으므로 실행 중인 Node.js 버전과의 호환성을 직접 확인해야 한다.
- `next()`는 `conf`, `dev`, `dir`, `quiet`, `hostname`, `port`, `httpServer`, `turbopack`, `webpack` 옵션을 받으며, standalone output 모드와는 함께 쓸 수 없다.
