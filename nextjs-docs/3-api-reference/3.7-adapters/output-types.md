# Output Types

- 공식 문서: [Output Types](https://nextjs.org/docs/app/api-reference/adapters/output-types)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `outputs` 객체가 담고 있는 빌드 출력 타입의 종류와 각각의 역할을 구분한다.
- `outputs.prerenders`의 `routeType`, `response`, `compute` 필드가 나타내는 의미를 이해한다.
- `outputs.staticFiles`가 다른 출력 타입과 어떻게 다른지, `immutableHash`가 왜 필요한지 파악한다.

## 핵심 개념 및 설명

`outputs` 객체는 빌드 출력 타입별 배열을 담고 있다.

- `outputs.pages`: `pages/` 디렉터리의 React 페이지
- `outputs.pagesApi`: `pages/api/`의 API route
- `outputs.appPages`: `app/` 디렉터리의 React 페이지
- `outputs.appRoutes`: `app/`의 API·메타데이터 route
- `outputs.prerenders`: ISR이 활성화된 route와 정적 prerender
- `outputs.staticFiles`: 정적 자산과 자동으로 정적 최적화된 페이지
- `outputs.middleware`: middleware 함수(있는 경우)

> **참고**: `config.output`이 `'export'`로 설정되면 `outputs.staticFiles`만 채워진다. 애플리케이션 전체가 정적 파일로 export되므로, 나머지 배열(`pages`, `appPages`, `pagesApi`, `appRoutes`, `prerenders`)은 모두 비어 있다.

`runtime: 'edge'`인 route 출력에는 `edgeRuntime`이 포함되며, 해당 출력을 edge 런타임에서 호출하는 데 필요한 정식 entry 메타데이터를 담고 있다. Edge Runtime은 [지원이 종료되었다](https://nextjs.org/docs/messages/edge-runtime-deprecated)는 점에 유의한다.

### Pages (outputs.pages)

`pages/` 디렉터리의 React 페이지다.

```ts
{
  type: 'PAGES'
  id: string           // route 식별자
  filePath: string     // 빌드된 파일의 경로
  pathname: string     // URL pathname
  sourcePage: string   // pages/ 디렉터리 내 원본 소스 파일 경로
  runtime: 'nodejs' | 'edge'
  assets: Record<string, string>  // 추적된 의존성 (key: 저장소 루트 기준 상대 경로, value: 절대 경로)
  wasmAssets?: Record<string, string>  // 번들된 wasm 파일 (key: 이름, value: 절대 경로)
  edgeRuntime?: {
    modulePath: string    // edge 런타임에 등록된 모듈의 절대 경로
    entryKey: string      // edge entry registry에서 사용하는 정식 key
    handlerExport: string // 호출할 export 이름, 현재는 'handler'
  }
  config: {
    maxDuration?: number  // route의 최대 실행 시간(초)
    preferredRegion?: string | string[]  // 선호 배포 리전 (지원 종료 예정)
    env?: Record<string, string>  // 환경 변수 (edge 런타임 전용)
  }
}
```

### API Routes (outputs.pagesApi)

`pages/api/`의 API route다.

```ts
{
  type: 'PAGES_API'
  id: string           // route 식별자
  filePath: string     // 빌드된 파일의 경로
  pathname: string     // URL pathname
  sourcePage: string   // 원본 소스 파일의 상대 경로
  runtime: 'nodejs' | 'edge'
  assets: Record<string, string>  // 추적된 의존성 (key: 저장소 루트 기준 상대 경로, value: 절대 경로)
  wasmAssets?: Record<string, string>  // 번들된 wasm 파일 (key: 이름, value: 절대 경로)
  edgeRuntime?: {
    modulePath: string    // edge 런타임에 등록된 모듈의 절대 경로
    entryKey: string      // edge entry registry에서 사용하는 정식 key
    handlerExport: string // 호출할 export 이름, 현재는 'handler'
  }
  config: {
    maxDuration?: number  // route의 최대 실행 시간(초)
    preferredRegion?: string | string[]  // 선호 배포 리전 (지원 종료 예정)
    env?: Record<string, string>  // 환경 변수 (edge 런타임 전용)
  }
}
```

### App Pages (outputs.appPages)

`app/` 디렉터리의 React 페이지다.

```ts
{
  type: 'APP_PAGE'
  id: string           // route 식별자
  filePath: string     // 빌드된 파일의 경로
  pathname: string     // URL pathname. RSC route는 .rsc 접미사를 포함한다
  sourcePage: string   // 원본 소스 파일의 상대 경로
  runtime: 'nodejs' | 'edge' // route가 빌드된 런타임
  assets: Record<string, string>  // 추적된 의존성 (key: 저장소 루트 기준 상대 경로, value: 절대 경로)
  wasmAssets?: Record<string, string>  // 번들된 wasm 파일 (key: 이름, value: 절대 경로)
  edgeRuntime?: {
    modulePath: string    // edge 런타임에 등록된 모듈의 절대 경로
    entryKey: string      // edge entry registry에서 사용하는 정식 key
    handlerExport: string // 호출할 export 이름, 현재는 'handler'
  }
  config: {
    maxDuration?: number  // route의 최대 실행 시간(초)
    preferredRegion?: string | string[]  // 선호 배포 리전 (지원 종료 예정)
    env?: Record<string, string>  // 환경 변수 (edge 런타임 전용)
  }
}
```

### App Routes (outputs.appRoutes)

`app/` 디렉터리의 API·메타데이터 route다.

```ts
{
  type: 'APP_ROUTE'
  id: string           // route 식별자
  filePath: string     // 빌드된 파일의 경로
  pathname: string     // URL pathname
  sourcePage: string   // 원본 소스 파일의 상대 경로
  runtime: 'nodejs' | 'edge' // route가 빌드된 런타임
  assets: Record<string, string>  // 추적된 의존성 (key: 저장소 루트 기준 상대 경로, value: 절대 경로)
  wasmAssets?: Record<string, string>  // 번들된 wasm 파일 (key: 이름, value: 절대 경로)
  edgeRuntime?: {
    modulePath: string    // edge 런타임에 등록된 모듈의 절대 경로
    entryKey: string      // edge entry registry에서 사용하는 정식 key
    handlerExport: string // 호출할 export 이름, 현재는 'handler'
  }
  config: {
    maxDuration?: number  // route의 최대 실행 시간(초)
    preferredRegion?: string | string[]  // 선호 배포 리전 (지원 종료 예정)
    env?: Record<string, string>  // 환경 변수 (edge 런타임 전용)
  }
}
```

### Prerenders (outputs.prerenders)

ISR이 활성화된 route와 정적 prerender다.

```ts
{
  type: 'PRERENDER'
  id: string           // route 식별자
  pathname: string     // URL pathname
  parentOutputId: string  // 원본 페이지/route의 ID
  groupId: number        // 재검증 그룹 식별자 (groupId가 같은 prerender끼리 함께 재검증된다)
  route: string           // 파일시스템 route와 정렬된 소스 route matcher로, 다이나믹 세그먼트를 유지한다 (예: /blog/[slug]는 prerender된 경로 /blog/first에 대응한다)
  routeType?: 'route' | 'fallback' | 'shell' | 'page'  // 정식 응답의 종류
  response?: 'empty' | 'initial' | 'complete'  // 요청 시점 작업 이전 응답의 완성도
  compute?: 'blocking' | 'resuming' | 'static'  // 완성된 응답을 만드는 데 필요한 요청 시점 연산
  htmlSize?: number       // prerender된 App Router HTML shell의 바이트 크기
  pprChain?: {
    headers: Record<string, string>  // PPR 체인 헤더 (예: 'next-resume': '1')
  }
  parentFallbackMode?: false | null | string  // false: 추가 경로 없음(fallback: false), null: blocking 렌더링, string: HTML fallback 경로
  fallback?: {
    filePath: string | undefined  // fallback 파일(HTML, JSON, RSC)의 경로
    initialStatus?: number  // 초기 상태 코드
    initialHeaders?: Record<string, string | string[]>  // 초기 헤더
    initialExpiration?: number  // 초기 만료 시간(초)
    initialRevalidate?: number | false  // 초기 재검증 시간(초), 완전히 정적이면 false
    postponedState: string | undefined  // 렌더링 재개에 사용되는 직렬화된 PPR 상태
  }
  config: {
    allowQuery?: string[]     // 캐시 key에 반영되는 허용 쿼리 매개변수
    allowHeader?: string[]    // ISR에 허용되는 헤더
    bypassFor?: RouteHas[]    // 캐시 우회 조건
    renderingMode?: 'STATIC' | 'PARTIALLY_STATIC'  // STATIC: 완전 정적, PARTIALLY_STATIC: PPR 활성화
    partialFallback?: boolean  // 백그라운드에서 완전한 route로 업그레이드되어야 하는 부분 fallback shell을 서빙한다
    bypassToken?: string      // prerender 캐시 우회 신호로 사용되는 생성된 토큰
  }
}
```

#### Prerender classification

`routeType`, `response`, `compute`는 prerender 그룹의 primary response에 함께 표시된다. 관련된 RSC, 데이터, 세그먼트 출력에는 이 필드들이 생략된다. `fallback: false`인 Pages Router 템플릿도 이 필드들을 생략하는데, 이런 템플릿은 매칭되지 않은 URL에 대해 서빙되는 일이 없기 때문이다.

`routeType`은 정식 응답의 종류를 나타낸다.

- `route`: Route Handler처럼 UI가 아닌 route
- `page`: prerender 가능한 매개변수가 누락되지 않은 URL을 가진 페이지
- `shell`: 해당 URL 클래스에서 재사용 가능한 가장 구체적인 페이지 shell
- `fallback`: 더 많은 prerender 가능한 매개변수를 채워 특수화할 수 있는 재사용 가능한 페이지 응답

`response`는 요청 시점 작업 이전에 응답이 얼마나 완성되어 있는지를 나타낸다.

- `empty`: 초기 페이지 응답을 서빙할 수 없다
- `initial`: 초기 응답은 서빙할 수 있지만 완성된 페이지 UI는 아니다. 실무에서는 부분적으로 prerender 가능한 UI route에만 해당한다
- `complete`: 응답이 완성되어 있다. `204` Route Handler 응답처럼 바이트 크기가 0인 응답 본문도 포함될 수 있다

`compute`는 완성된 응답을 서빙하는 데 필요한 요청 시점 연산을 나타낸다.

- `blocking`: 요청 시점 연산이 시작되기 전에는 초기 응답을 보낼 수 없다. 연산이 시작되면 계속 진행되는 동안 응답을 스트리밍할 수 있다
- `resuming`: 초기 응답을 서빙하는 동안 서버에서 지연되었던 작업이 재개된다
- `static`: 요청마다 서버 연산이 필요하지 않다

`htmlSize`는 primary App Router HTML 출력에만 포함된다. 값이 `0`이면 HTML shell이 비어 있다는 의미다. Pages Router prerender, Route Handler, 관련된 RSC·데이터·세그먼트 출력에는 이 필드가 생략된다.

### Static Files (outputs.staticFiles)

정적 자산과 자동으로 정적 최적화된 페이지다.

```ts
{
  type: 'STATIC_FILE'
  id: string // 이 정적 파일 출력의 고유 식별자
  filePath: string // 빌드된 파일의 절대 파일시스템 경로
  pathname: string // 이 정적 파일에 대응하는 라우팅 가능한 URL pathname
  immutableHash: string | undefined // 파일명에 해시가 포함된 경우의 콘텐츠 해시로, 해당 파일이 불변임을 나타낸다
}
```

`immutableHash`에 대한 자세한 내용은 [Supporting Immutable Static Assets](./immutable-static-assets.md)를 참고한다.

### Middleware (outputs.middleware)

`middleware.ts`(`.js`/`.ts`) 또는 `proxy.ts`(`.js`/`.ts`) 함수(있는 경우)다.

```ts
{
  type: 'MIDDLEWARE'
  id: string           // route 식별자
  filePath: string     // 빌드된 파일의 경로
  pathname: string      // 항상 '/_middleware'
  sourcePage: string    // 항상 'middleware'
  runtime: 'nodejs' | 'edge' // route가 빌드된 런타임
  assets: Record<string, string>  // 추적된 의존성 (key: 저장소 루트 기준 상대 경로, value: 절대 경로)
  wasmAssets?: Record<string, string>  // 번들된 wasm 파일 (key: 이름, value: 절대 경로)
  edgeRuntime?: {
    modulePath: string    // edge 런타임에 등록된 모듈의 절대 경로
    entryKey: string      // edge entry registry에서 사용하는 정식 key
    handlerExport: string // 호출할 export 이름, 현재는 'handler'
  }
  config: {
    maxDuration?: number  // route의 최대 실행 시간(초)
    preferredRegion?: string | string[]  // 선호 배포 리전 (지원 종료 예정)
    env?: Record<string, string>  // 환경 변수 (edge 런타임 전용)
    matchers?: Array<{
      source: string  // 소스 패턴
      sourceRegex: string  // 요청 매칭에 사용하는 컴파일된 정규식
      has: RouteHas[] | undefined  // 긍정 매칭 조건
      missing: RouteHas[] | undefined  // 부정 매칭 조건
    }>
  }
}
```

## 예제 및 데모 설계

- 데모 가능 여부: Phase 1에서는 구현 예정. 실제 빌드 출력을 순회하며 각 타입을 처리하는 어댑터가 있어야 의미 있게 보여줄 수 있으므로, Phase 2 커스텀 어댑터 데모에서 함께 다룬다.
- 구현 예정 시나리오: 샘플 프로젝트를 빌드한 뒤 `outputs`를 콘솔에 출력해 `pages`/`appPages`/`appRoutes`/`prerenders`/`staticFiles`/`middleware`에 실제로 어떤 값이 들어가는지 비교하고, `config.output: 'export'`일 때 `staticFiles`만 채워지는 것을 확인한다.

## 연습 문제

1. `config.output`이 `'export'`로 설정된 경우, `outputs` 객체에서 채워지는 배열은?
   - A. `outputs.pages`와 `outputs.appPages`만
   - B. `outputs.staticFiles`만
   - C. `outputs.prerenders`와 `outputs.staticFiles`

<details><summary>정답 보기</summary>

정답: B. `config.output: 'export'`에서는 애플리케이션 전체가 정적 파일로 export되므로 `outputs.staticFiles`만 채워지고 나머지 배열은 비어 있다.
</details>

2. prerender 출력의 `compute` 필드 값 중 "초기 응답을 서빙하는 동안 서버에서 지연되었던 작업이 재개된다"에 해당하는 것은?
   - A. `blocking`
   - B. `static`
   - C. `resuming`

<details><summary>정답 보기</summary>

정답: C. `resuming`은 초기 응답을 먼저 서빙하면서 postpone된 작업을 서버에서 재개하는 경우다. `blocking`은 연산이 끝나야 응답을 시작할 수 있는 경우, `static`은 요청마다 서버 연산이 필요 없는 경우다.
</details>

3. `outputs.staticFiles`의 각 항목이 다른 출력 타입(`outputs.pages` 등)과 구조적으로 가장 다른 점은?
   - A. `runtime` 필드로 edge/nodejs를 구분한다.
   - B. `assets`, `edgeRuntime`, `config` 같은 필드 없이 `filePath`, `pathname`, `immutableHash`만 갖는다.
   - C. `sourcePage` 필드로 원본 소스를 추적한다.

<details><summary>정답 보기</summary>

정답: B. `outputs.staticFiles`는 route 출력과 달리 실행 런타임이 없는 정적 자산이므로, `id`, `filePath`, `pathname`, `immutableHash`라는 단순한 구조만 갖는다.
</details>

## 챕터 요약

- `outputs` 객체는 `pages`, `pagesApi`, `appPages`, `appRoutes`, `prerenders`, `staticFiles`, `middleware` 배열로 빌드 출력을 분류한다.
- `config.output: 'export'`일 때는 `outputs.staticFiles`만 채워지고 나머지는 비어 있다.
- Route 계열 출력(`pages`, `pagesApi`, `appPages`, `appRoutes`, `middleware`)은 `runtime`, `assets`, `config` 등 공통 구조를 공유하며, edge 런타임 출력에는 `edgeRuntime` 메타데이터가 추가된다.
- `outputs.prerenders`의 `routeType`/`response`/`compute`는 각각 응답의 종류, 완성도, 요청 시점 연산 필요 여부를 나타낸다.
- `outputs.staticFiles`의 `immutableHash`는 콘텐츠 해시가 있는 불변 정적 자산을 식별하는 데 쓰인다.
