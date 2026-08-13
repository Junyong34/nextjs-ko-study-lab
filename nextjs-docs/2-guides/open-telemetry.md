# OpenTelemetry

- 공식 문서: [OpenTelemetry](https://nextjs.org/docs/app/guides/open-telemetry)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- trace, span, exporter, collector의 관계를 설명한다.
- `@vercel/otel` 또는 수동 NodeSDK 방식으로 Next.js에 OpenTelemetry를 연결한다.
- Next.js 기본 span과 custom span을 사용해 요청 지연을 추적한다.

## 핵심 개념 및 설명

observability는 로그, metric, trace로 앱의 동작과 성능을 이해하는 방식이다. OpenTelemetry는 특정 관측 서비스에 종속되지 않는 표준 계측 API와 데이터 모델을 제공한다. Next.js 자체의 주요 실행 구간은 이미 계측되어 있다.

- **Trace**: 한 요청이나 작업이 여러 시스템을 통과한 전체 경로다.
- **Span**: trace 안의 한 작업 구간과 시간, 속성을 기록한다.
- **Exporter**: 만들어진 telemetry를 외부 backend나 collector로 보낸다.
- **Collector**: telemetry를 받아 가공한 뒤 저장·분석 backend로 전달한다.

### `@vercel/otel`로 시작하기

`@vercel/otel`은 일반적인 OpenTelemetry 구성을 간단히 묶은 패키지다.

```bash
pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

> **알아두면 좋은 점**:
>
> - instrumentation 파일은 프로젝트 루트 또는 `src` 루트에 둔다. `app`이나 `pages` 안에는 두지 않는다.
> - `pageExtensions` suffix를 쓴다면 파일명도 그 규칙에 맞춘다.
> - 공식 [`with-opentelemetry` 예제](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry)에서 전체 구성을 확인할 수 있다.

### OpenTelemetry를 직접 구성하기

`@vercel/otel`이 제공하지 않는 기능이 필요하면 NodeSDK를 직접 구성할 수 있다. NodeSDK는 Edge Runtime과 호환되지 않으므로 Node.js에서만 import한다.

```bash
pnpm add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
```

```ts
// instrumentation.node.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})

sdk.start()
```

Edge Runtime 지원이 필요하면 `@vercel/otel`을 사용한다.

### 로컬 테스트와 배포

로컬 trace를 보려면 호환 backend가 연결된 OpenTelemetry Collector가 필요하다. 정상 동작하면 `GET /requested/pathname` 형태의 root server span 아래에 같은 trace의 하위 span이 보인다. 기본값보다 많은 span을 출력하려면 `NEXT_OTEL_VERBOSE=1`을 설정한다.

Vercel에서는 관측 제공자를 프로젝트에 연결할 수 있다. 자체 호스팅은 collector를 직접 띄워 telemetry를 받아야 한다. collector 없이 `@vercel/otel`이나 수동 설정에 custom exporter를 연결하는 방식도 가능하다.

### custom span

앱 고유 작업은 OpenTelemetry API로 span을 추가한다. 모든 경로에서 `span.end()`가 호출되도록 `finally`에서 종료한다.

```bash
pnpm add @opentelemetry/api
```

```ts
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

### Next.js 기본 span

Next.js는 다음 span을 자동으로 만든다.

| span | `next.span_type` | 의미 |
|---|---|---|
| `[http.method] [next.route]` | `BaseServer.handleRequest` | 들어온 요청의 root span |
| `render route (app) [next.route]` | `AppRender.getBodyResult` | App Router route 렌더링 |
| `fetch [http.method] [http.url]` | `AppRender.fetch` | 앱 코드의 fetch 요청 |
| `executing api route (app) [next.route]` | `AppRouteRouteHandlers.runHandler` | Route Handler 실행 |
| `getServerSideProps [next.route]` | `Render.getServerSideProps` | Pages Router의 서버 props 실행 |
| `getStaticProps [next.route]` | `Render.getStaticProps` | Pages Router의 정적 props 실행 |
| `render route (pages) [next.route]` | `Render.renderDocument` | Pages Router 문서 렌더링 |
| `generateMetadata [next.page]` | `ResolveMetadata.generateMetadata` | 페이지 metadata 생성 |
| `resolve page components` | `NextNodeServer.findPageComponents` | page 컴포넌트 탐색 |
| `resolve segment modules` | `NextNodeServer.getLayoutOrPageModule` | layout 또는 page 모듈 로드 |
| `start response` | `NextNodeServer.startResponse` | 응답의 첫 byte 전송 시점 |

span에는 `next.span_name`, `next.span_type`, `next.route`, `next.rsc`, `next.page` 같은 속성이 붙는다. `next.page`는 내부 특수 파일 경로이므로 `next.route`와 함께 봐야 고유하게 식별할 수 있다. fetch span을 다른 계측 도구가 처리한다면 `NEXT_OTEL_FETCH_DISABLED=1`로 Next.js 기본 fetch span을 끌 수 있다.

## 예제 및 데모 설계

- Phase 2에서 `@vercel/otel`과 로컬 collector를 연결해 한 페이지 요청의 trace를 확인한다.
- 데이터 요청에 custom span을 추가하고 Next.js의 `AppRender.fetch` span 아래 관계를 살펴본다.
- `NEXT_OTEL_VERBOSE`와 `NEXT_OTEL_FETCH_DISABLED` 적용 전후의 span 목록을 비교한다.

## 연습 문제

1. Edge Runtime까지 지원해야 할 때 우선 사용할 구성은 무엇인가?

   1. NodeSDK를 모든 runtime에서 정적 import한다.
   2. `@vercel/otel`을 사용한다.
   3. Webpack cache를 끈다.
   4. `NEXT_OTEL_FETCH_DISABLED=1`만 설정한다.

   <details><summary>정답 보기</summary>

   **정답: 2**. 수동 NodeSDK 구성은 Edge와 호환되지 않으므로 Edge 지원에는 `@vercel/otel`을 사용한다.

   </details>

2. custom span을 `finally`에서 끝내는 이유는 무엇인가?

   1. 성공과 오류 경로 모두에서 span 종료를 보장하기 위해서다.
   2. trace를 삭제하기 위해서다.
   3. collector를 시작하기 위해서다.
   4. fetch 계측을 끄기 위해서다.

   <details><summary>정답 보기</summary>

   **정답: 1**. 작업이 실패해도 `span.end()`가 실행돼 올바른 구간 시간이 기록된다.

   </details>

## 챕터 요약

- OpenTelemetry는 관측 backend에 종속되지 않는 trace 계측 표준이다.
- `@vercel/otel`은 일반적인 구성과 Edge Runtime 지원을 간단히 제공한다.
- 수동 NodeSDK 구성은 Node.js runtime에서만 조건부 import한다.
- Next.js는 요청, 렌더링, fetch, metadata 같은 주요 구간을 자동 계측한다.
- 앱 고유 작업은 custom span으로 감싸고 모든 실행 경로에서 종료한다.
