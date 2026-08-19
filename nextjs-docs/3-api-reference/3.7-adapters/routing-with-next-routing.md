# Routing with @next/routing

- 공식 문서: [Routing with @next/routing](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `@next/routing`의 `resolveRoutes`로 Next.js 라우트 매칭 동작을 재현하는 방법을 이해한다.
- `onBuildComplete`에서 얻은 `routing`·`outputs` 데이터를 `resolveRoutes`에 전달하는 방법을 익힌다.
- `resolveRoutes()`가 반환하는 필드들의 의미를 파악한다.

## 핵심 개념 및 설명

[`@next/routing`](https://www.npmjs.com/package/@next/routing) 패키지를 사용하면 `onBuildComplete`에서 얻은 데이터로 Next.js의 라우트 매칭 동작을 그대로 재현할 수 있다.

```ts
import { resolveRoutes } from '@next/routing'

const pathnames = [
  ...outputs.pages,
  ...outputs.pagesApi,
  ...outputs.appPages,
  ...outputs.appRoutes,
  ...outputs.staticFiles,
].map((output) => output.pathname)

const result = await resolveRoutes({
  url: new URL(requestUrl),
  buildId,
  basePath: config.basePath || '',
  i18n: config.i18n,
  headers: new Headers(requestHeaders),
  requestBody, // 요청 본문 (ReadableStream)
  pathnames,
  routes: routing,
  invokeMiddleware: async (ctx) => {
    // 플랫폼별 미들웨어 호출 로직을 구현한다
    return {}
  },
})

if (result.resolvedPathname) {
  console.log('Resolved pathname:', result.resolvedPathname)
  console.log('Resolved query:', result.resolvedQuery)
  console.log('Invocation target:', result.invocationTarget)
}
```

`pathnames`는 `outputs`에 담긴 여러 산출물 배열(`pages`, `pagesApi`, `appPages`, `appRoutes`, `staticFiles`)의 `pathname`을 모두 모은 목록이며, `routes`에는 `onBuildComplete`에서 받은 `routing` 객체를 그대로 전달한다.

<a id="resolveroutes-return"></a>
### resolveRoutes()의 반환값

`resolveRoutes()`는 다음 필드를 반환한다.

- `middlewareResponded`: 미들웨어가 이미 응답을 보냈다면 `true`다. 이 경우 어댑터는 entrypoint를 호출하지 않아야 한다.
- `externalRewrite`: 라우팅이 외부 rewrite 목적지로 해석됐다면 `URL`을 반환한다.
- `redirect`: 요청을 리다이렉트해야 할 때 `url`(`URL`)과 `status`를 담은 객체를 반환한다.
- `resolvedPathname`: Next.js 라우팅이 선택한 라우트 경로명이다. 다이나믹 라우트의 경우 `/blog/[slug]`처럼 매칭된 라우트 템플릿이 된다.
- `resolvedQuery`: rewrite나 미들웨어가 search params를 추가·변경한 뒤의 최종 query다.
- `invocationTarget`: 매칭된 라우트를 실제로 호출할 때 사용하는 구체적인 경로명과 query다.
- `resolvedHeaders`: 라우팅 과정에서 추가되거나 수정된 헤더를 담은 `Headers` 객체다.
- `status`: 라우팅이 설정한 HTTP 상태 코드다(예: redirect나 rewrite 규칙에 의해 설정).
- `routeMatches`: 다이나믹 라우트 세그먼트에서 추출된 이름 있는 매칭 값을 담은 record다.

예를 들어 `/blog/post-1?draft=1` 요청이 `/blog/[slug]?slug=post-1`과 매칭되면, `resolvedPathname`은 `/blog/[slug]`가 되고 `invocationTarget.pathname`은 `/blog/post-1`이 된다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 구현 예정)
- Phase 2에서는 `resolveRoutes()` 호출 결과를 다이나믹 라우트 요청과 정적 라우트 요청 각각에 대해 로그로 비교하는 데모를 계획한다.

## 연습 문제

1. `resolveRoutes()`가 반환하는 필드 중, 다이나믹 라우트의 매칭된 라우트 템플릿(예: `/blog/[slug]`)을 나타내는 것은?
   - A. `invocationTarget`
   - B. `resolvedPathname`
   - C. `routeMatches`

<details><summary>정답 보기</summary>

정답: B. `resolvedPathname`은 Next.js 라우팅이 선택한 라우트 경로명으로, 다이나믹 라우트에서는 매칭된 라우트 템플릿을 나타낸다. 실제로 호출할 구체적인 경로는 `invocationTarget`에 담긴다.
</details>

2. 미들웨어가 이미 응답을 보낸 경우 어댑터가 확인해야 할 필드는?
   - A. `externalRewrite`
   - B. `middlewareResponded`
   - C. `redirect`

<details><summary>정답 보기</summary>

정답: B. `middlewareResponded`가 `true`면 미들웨어가 이미 응답을 보낸 것이므로 어댑터는 entrypoint를 호출하지 않아야 한다.
</details>

## 챕터 요약

- `@next/routing`의 `resolveRoutes()`로 Next.js의 라우트 매칭 동작을 어댑터에서 재현할 수 있다.
- `outputs`의 여러 pathname 목록과 `onBuildComplete`의 `routing` 데이터를 `resolveRoutes()`에 전달한다.
- 반환값에는 `middlewareResponded`, `externalRewrite`, `redirect`, `resolvedPathname`, `resolvedQuery`, `invocationTarget`, `resolvedHeaders`, `status`, `routeMatches`가 포함된다.
- 다이나믹 라우트에서는 `resolvedPathname`이 라우트 템플릿을, `invocationTarget`이 실제 호출 경로를 나타낸다.
