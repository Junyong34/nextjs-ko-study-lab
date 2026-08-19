# Invoking Entrypoints

- 공식 문서: [Invoking Entrypoints](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 빌드 출력 entrypoint가 공통으로 따르는 `handler(..., ctx)` 인터페이스를 이해한다.
- Node.js 런타임과 Edge 런타임에서 entrypoint를 호출하는 방식의 차이를 구분한다.
- `requestMeta`와 `edgeRuntime` 메타데이터를 이용해 entrypoint를 올바르게 호출하는 방법을 익힌다.

## 핵심 개념 및 설명

빌드 출력 entrypoint는 공통적으로 `handler(..., ctx)` 형태의 인터페이스를 사용한다. 다만 실행되는 런타임에 따라 요청·응답 타입은 서로 다르다.

### Node.js 런타임 (runtime: 'nodejs')

Node.js entrypoint는 다음 인터페이스를 사용한다.

```ts
handler(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: {
    waitUntil?: (promise: Promise<void>) => void
    requestMeta?: RequestMeta
  }
): Promise<void>
```

Node.js entrypoint를 직접 호출할 때, 어댑터는 내부 구현에 의존하는 대신 `requestMeta`에 헬퍼를 바로 전달할 수 있다. 지원되는 필드에는 `hostname`, `revalidate`, `render404` 등이 있다.

```ts
await handler(req, res, {
  requestMeta: {
    // process.cwd() 기준 Next.js 프로젝트 디렉터리의 상대 경로
    relativeProjectDir: '.',
    // route handler가 절대 URL을 구성할 때 사용하는 선택적 hostname
    hostname: '127.0.0.1',
    // 네트워크를 거치지 않고 재검증하기 위한 선택적 내부 revalidate 함수
    revalidate: async ({ urlPath, headers, opts }) => {
      // 플랫폼별 revalidate 구현
    },
    // Pages Router의 notFound: true에 대응하는 404 페이지를 렌더링하는 선택적 함수
    render404: async (req, res, parsedUrl, setHeaders) => {
      // 플랫폼별 404 렌더링 구현
    },
  },
})
```

Next.js 코어의 관련 파일은 다음과 같다.

- [`packages/next/src/build/templates/app-page.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/app-page.ts)
- [`packages/next/src/build/templates/app-route.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/app-route.ts)
- [`packages/next/src/build/templates/pages-api.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/pages-api.ts)

### Edge 런타임 (runtime: 'edge') (지원 종료)

> **참고**: Edge Runtime은 [지원이 종료되었다](https://nextjs.org/docs/messages/edge-runtime-deprecated). 새로운 route는 Node.js 런타임을 사용해야 한다.

Edge entrypoint는 다음 인터페이스를 사용한다.

```ts
handler(
  request: Request,
  ctx: {
    waitUntil?: (prom: Promise<void>) => void
    signal?: AbortSignal
    requestMeta?: RequestMeta
  }
): Promise<Response>
```

`handler(..., ctx)` 형태 자체는 동일하지만, Node.js 런타임과 Edge 런타임은 서로 다른 요청·응답 primitive를 사용한다.

`runtime: 'edge'`인 출력에 대해서는 Next.js가 entrypoint 호출에 필요한 정식 메타데이터인 `output.edgeRuntime`도 함께 제공한다.

```ts
{
  modulePath: string // edge 런타임에 등록된 모듈의 절대 경로
  entryKey: string // edge entry registry에서 사용하는 정식 key
  handlerExport: string // 호출할 export 이름, 현재는 'handler'
}
```

edge 런타임이 `modulePath`의 청크를 로드하고 평가한 뒤에는, `entryKey`로 전역 edge entry registry(`globalThis._ENTRIES`)에서 등록된 entry를 읽고 그 entry에서 `handlerExport`를 호출한다.

```ts
const entry = await globalThis._ENTRIES[output.edgeRuntime.entryKey]
const handler = entry[output.edgeRuntime.handlerExport]
await handler(request, ctx)
```

파일명에서 registry key나 handler 이름을 추론하지 말고 `edgeRuntime`을 사용해야 한다.

Next.js 코어의 관련 파일은 다음과 같다.

- [`packages/next/src/build/templates/edge-ssr.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/edge-ssr.ts)
- [`packages/next/src/build/templates/edge-app-route.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/edge-app-route.ts)
- [`packages/next/src/build/templates/pages-edge-api.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/pages-edge-api.ts)
- [`packages/next/src/build/templates/middleware.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/middleware.ts)

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 구현 예정). 실제 어댑터 없이 브라우저에서 동작을 보여주기 어려운 빌드 타임/서버 전용 인터페이스이므로, Phase 2에서 커스텀 어댑터 데모를 만들 때 함께 다룬다.
- 구현 예정 시나리오: 최소한의 Node.js entrypoint 호출 예제를 만들어 `requestMeta`에 넘긴 `hostname`, `revalidate` 값이 실제 handler 실행에 어떻게 반영되는지 로그로 확인한다.

## 연습 문제

1. Node.js entrypoint의 `handler` 함수가 받는 세 번째 인자(`ctx`)에 포함될 수 있는 필드가 아닌 것은?
   - A. `waitUntil`
   - B. `requestMeta`
   - C. `edgeRuntime`

<details><summary>정답 보기</summary>

정답: C. `edgeRuntime`은 `ctx`가 아니라 `runtime: 'edge'`로 빌드된 출력(output) 객체에 포함되는 필드다. `ctx`에는 `waitUntil`과 `requestMeta`(Node.js) 또는 `waitUntil`, `signal`, `requestMeta`(Edge)가 들어간다.
</details>

2. Edge 런타임에서 entrypoint를 호출하는 절차로 옳은 것은?
   - A. `entryKey`로 얻은 entry에서 `handlerExport`가 가리키는 함수를 호출한다.
   - B. 파일명을 파싱해 handler 함수 이름을 알아낸다.
   - C. `modulePath`를 곧바로 `import()`해서 반환값을 handler로 사용한다.

<details><summary>정답 보기</summary>

정답: A. `modulePath`의 청크를 로드·평가한 뒤 `globalThis._ENTRIES[entryKey]`에서 entry를 가져오고, 그 entry의 `handlerExport`를 호출해야 한다. 파일명 추론이나 직접 import는 권장되지 않는다.
</details>

## 챕터 요약

- 빌드 출력 entrypoint는 런타임과 무관하게 `handler(..., ctx)` 형태를 공유한다.
- Node.js entrypoint는 `IncomingMessage`/`ServerResponse`를 받고, `requestMeta`로 `hostname`, `revalidate`, `render404` 같은 헬퍼를 전달할 수 있다.
- Edge Runtime은 지원이 종료되었으며, 새 route는 Node.js 런타임을 사용해야 한다.
- Edge entrypoint는 `Request`/`Response`를 사용하며, 호출 시 `output.edgeRuntime`의 `modulePath`, `entryKey`, `handlerExport`를 이용해야 한다.
- registry key나 handler 이름을 파일명에서 추론하지 않고 `edgeRuntime` 메타데이터를 신뢰한다.
