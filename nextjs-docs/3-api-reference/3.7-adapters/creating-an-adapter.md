# Creating an Adapter

- 공식 문서: [Creating an Adapter](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 어댑터가 무엇이며 `NextAdapter` 인터페이스를 어떻게 구현하는지 이해한다.
- `modifyConfig`와 `onBuildComplete` 훅의 역할과 실행 시점을 설명한다.
- 최소 구성의 어댑터 예제를 통해 빌드 산출물(outputs)에 접근하는 방법을 익힌다.

## 핵심 개념 및 설명

어댑터(adapter)는 `NextAdapter` 인터페이스를 구현하는 객체를 export하는 모듈이다. 배포 플랫폼이 Next.js 빌드 산출물을 자신의 런타임에 맞게 연결할 때 사용한다.

인터페이스는 `next` 패키지에서 가져올 수 있다.

```ts
import type { NextAdapter } from 'next'
```

인터페이스 전체 정의는 다음과 같다.

```ts
type Route = {
  source?: string
  sourceRegex: string
  destination?: string
  headers?: Record<string, string>
  has?: RouteHas[]
  missing?: RouteHas[]
  status?: number
  priority?: boolean
}

export interface AdapterOutputs {
  pages: Array<AdapterOutput['PAGES']>
  middleware?: AdapterOutput['MIDDLEWARE']
  appPages: Array<AdapterOutput['APP_PAGE']>
  pagesApi: Array<AdapterOutput['PAGES_API']>
  appRoutes: Array<AdapterOutput['APP_ROUTE']>
  prerenders: Array<AdapterOutput['PRERENDER']>
  staticFiles: Array<AdapterOutput['STATIC_FILE']>
}

export interface NextAdapter {
  name: string
  modifyConfig?: (
    config: NextConfigComplete,
    ctx: {
      phase: PHASE_TYPE
      nextVersion: string
      projectDir: string
    }
  ) => Promise<NextConfigComplete> | NextConfigComplete
  onBuildComplete?: (ctx: {
    routing: {
      beforeMiddleware: Array<Route>
      beforeFiles: Array<Route>
      afterFiles: Array<Route>
      dynamicRoutes: Array<Route>
      onMatch: Array<Route>
      fallback: Array<Route>
      shouldNormalizeNextData: boolean
      rsc: RoutesManifest['rsc']
    }
    outputs: AdapterOutputs
    projectDir: string
    repoRoot: string
    distDir: string
    config: NextConfigComplete
    nextVersion: string
    buildId: string
  }) => Promise<void> | void
}
```

<a id="route-type"></a>
### Route 타입

라우팅 규칙을 표현하는 `Route` 타입은 다음 필드로 구성된다.

- `source`: 원본 라우트 패턴 (생성된 내부 규칙에는 없을 수 있음, 선택)
- `sourceRegex`: 요청 매칭에 쓰이는 컴파일된 정규식
- `destination`: 내부 목적지 또는 리다이렉트 목적지 (선택)
- `headers`: 적용할 헤더 (선택)
- `has`: 긍정 매칭 조건 (선택)
- `missing`: 부정 매칭 조건 (선택)
- `status`: 리다이렉트 상태 코드 (선택)
- `priority`: 내부 라우트 우선순위 플래그 (선택)

<a id="adapteroutputs"></a>
### AdapterOutputs

`AdapterOutputs` 인터페이스는 빌드가 만들어낸 산출물을 종류별로 담는다.

- `pages`: Pages Router 페이지 목록
- `middleware`: 미들웨어 산출물 (선택)
- `appPages`: App Router 페이지 목록
- `pagesApi`: Pages Router API 라우트 목록
- `appRoutes`: App Router Route Handler 목록
- `prerenders`: 프리렌더된 산출물 목록
- `staticFiles`: 정적 파일 목록

<a id="nextadapter"></a>
### NextAdapter 인터페이스

`NextAdapter`는 다음 세 가지로 구성된다.

- `name`: 어댑터 이름을 나타내는 문자열이다.
- `modifyConfig`: 빌드 phase에 따라 Next.js 설정(config)을 수정할 수 있는 선택적 함수다. `config`와 `{ phase, nextVersion, projectDir }`로 구성된 `ctx`를 인자로 받아 수정된 `NextConfigComplete`를 반환하거나, `Promise`로 감싸 반환할 수 있다.
- `onBuildComplete`: 빌드가 끝난 뒤 호출되는 선택적 함수다. `routing`(`beforeMiddleware`, `beforeFiles`, `afterFiles`, `dynamicRoutes`, `onMatch`, `fallback`, `shouldNormalizeNextData`, `rsc`), `outputs`(`AdapterOutputs`), `projectDir`, `repoRoot`, `distDir`, `config`, `nextVersion`, `buildId`를 담은 `ctx`를 인자로 받는다. 반환값은 없으며 `Promise<void>` 또는 `void`다.

<a id="basic-adapter-structure"></a>
### 기본 어댑터 구조

최소 구성의 어댑터 예제는 다음과 같다.

```js
/** @type {import('next').NextAdapter} */
const adapter = {
  name: 'my-custom-adapter',

  async modifyConfig(config, { phase }) {
    // 빌드 phase에 따라 Next.js config를 수정한다
    if (phase === 'phase-production-build') {
      return {
        ...config,
        // 필요한 설정을 추가한다
      }
    }
    return config
  },

  async onBuildComplete({
    routing,
    outputs,
    projectDir,
    repoRoot,
    distDir,
    config,
    nextVersion,
    buildId,
  }) {
    // 빌드 결과물을 처리한다
    console.log('Build completed with', outputs.pages.length, 'pages')
    console.log('Build ID:', buildId)
    console.log('Dynamic routes:', routing.dynamicRoutes.length)

    // 산출물(outputs)에 접근한다
    for (const page of outputs.pages) {
      console.log('Page:', page.pathname, 'at', page.filePath)
    }

    for (const apiRoute of outputs.pagesApi) {
      console.log('API Route:', apiRoute.pathname, 'at', apiRoute.filePath)
    }

    for (const appPage of outputs.appPages) {
      console.log('App Page:', appPage.pathname, 'at', appPage.filePath)
    }

    for (const prerender of outputs.prerenders) {
      console.log('Prerendered:', prerender.pathname)
    }
  },
}

module.exports = adapter
```

`modifyConfig`는 `phase === 'phase-production-build'`일 때만 config를 수정하는 식으로 build phase별 분기를 둘 수 있다. `onBuildComplete`는 `outputs`의 각 배열을 순회하며 페이지·API 라우트·프리렌더 산출물의 경로와 파일 위치를 확인하는 데 쓰인다.

## 예제 및 데모 설계

- 데모 가능 여부: Phase 1에서는 구현 예정이다.
- Phase 2에서는 최소 구성의 어댑터를 작성해 `modifyConfig`로 build phase별 config 분기를 확인하고, `onBuildComplete`에서 `outputs.pages`, `outputs.appPages`, `outputs.prerenders` 등을 순회하며 로그로 출력하는 데모를 계획한다.

## 연습 문제

1. 어댑터가 export해야 하는 인터페이스는?
   - A. `NextConfig`
   - B. `NextAdapter`
   - C. `AdapterOutputs`

<details><summary>정답 보기</summary>

정답: B. 어댑터는 `NextAdapter` 인터페이스를 구현하는 객체를 export하는 모듈이다.
</details>

2. `onBuildComplete`가 호출되는 시점은?
   - A. 빌드가 시작되기 전
   - B. 빌드가 완료된 뒤
   - C. 요청이 들어올 때마다

<details><summary>정답 보기</summary>

정답: B. `onBuildComplete`는 빌드 완료 후 `routing`과 `outputs` 정보를 받아 처리하는 훅이다.
</details>

## 챕터 요약

- 어댑터는 `NextAdapter` 인터페이스를 구현해 export하는 모듈이다.
- `Route` 타입은 `source`, `sourceRegex`, `destination` 등으로 라우팅 규칙을 표현한다.
- `AdapterOutputs`는 `pages`, `appPages`, `pagesApi`, `appRoutes`, `prerenders`, `staticFiles` 등 빌드 산출물을 담는다.
- `modifyConfig`는 빌드 phase에 따라 config를 수정하는 선택적 훅이다.
- `onBuildComplete`는 빌드 완료 후 `routing`·`outputs` 등을 받아 처리하는 선택적 훅이다.
