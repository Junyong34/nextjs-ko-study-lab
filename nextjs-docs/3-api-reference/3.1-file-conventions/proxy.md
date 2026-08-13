# proxy.js

- 공식 문서: [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- route 렌더링 전 요청을 rewrite·redirect·header·response로 처리한다.
- proxy 함수, `config.matcher`, request와 event 계약을 이해한다.
- Proxy의 실행 경계와 적합하지 않은 용도를 구분한다.

## 핵심 개념 및 설명

> **주의**: `middleware` 파일 규칙은 deprecated되었고 `proxy`로 이름이 바뀌었다.

`proxy.js|ts`는 route 렌더링 전에 서버에서 실행되어 요청이나 응답 header를 바꾸고 rewrite·redirect하거나 직접 응답한다. 프로젝트 root 또는 `src`를 쓴다면 `app`과 같은 level에 파일 하나만 둔다. default export 또는 이름이 `proxy`인 함수 하나와 선택적 `config`를 export한다.

```ts
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = { matcher: '/about/:path*' }
```

`matcher`는 빌드 때 정적으로 분석 가능하도록 상수로 작성한다. negative lookahead와 `has`/`missing` 조건으로 asset, prefetch, 특정 header를 제외할 수 있다. `request`는 `NextRequest`, 두 번째 `event`는 `waitUntil()`로 응답 이후 작업을 연장할 수 있는 `NextFetchEvent`다.

### 실행 순서와 응답 조작

요청 처리 순서에서 `headers`, `redirects` 다음에 Proxy가 실행되고, 이후 `beforeFiles` rewrites와 file-system route matching이 이어진다. `NextResponse.next()`로 계속 진행하거나 `rewrite`, `redirect`, 직접 `Response` 반환을 선택한다. request header를 upstream에 전달할 때와 response header를 browser에 보낼 때의 대상을 혼동하지 않는다. 큰 header는 upstream server의 `431 Request Header Fields Too Large`를 유발할 수 있다.

cookie는 `request.cookies`로 읽고 `response.cookies`로 설정한다. CORS preflight나 조건부 CORS response도 직접 만들 수 있다. Proxy의 matcher와 함수는 `unstable_doesProxyMatch`, `isRewrite`, `getRewrittenUrl` 같은 experimental test helper로 단위 검증할 수 있다.

> **알아두면 좋은 점**: Proxy는 렌더 코드와 별도로 실행될 수 있으므로 공유 module이나 global state에 의존하지 않는다. 정보 전달에는 header, cookie, rewrite, redirect, URL을 사용한다.

Proxy는 빠른 라우팅 결정에 적합하며 느린 데이터 fetching이나 완전한 session management를 넣는 장소가 아니다. `runtime` route segment config도 사용할 수 없다.

Next.js 16 이전 프로젝트는 `npx @next/codemod@canary middleware-to-proxy .` codemod로 파일명과 함수명을 이전할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 locale redirect, protected path matcher, response header 추가를 구현한다.
- static asset과 prefetch 요청이 matcher에서 제외되는지 request log로 확인한다.
- `waitUntil()`로 비차단 audit log를 기록한다.

## 연습 문제

1. Proxy 파일의 옛 이름은?
   - A. middleware
   - B. gateway
   - C. interceptor

<details><summary>정답 보기</summary>

정답: A. Next.js 16에서는 `proxy` 명칭을 사용한다.
</details>

2. `matcher`에 필요한 특성은?
   - A. runtime마다 임의 계산한다.
   - B. 정적 분석 가능한 상수다.
   - C. Client Component에서 export한다.

<details><summary>정답 보기</summary>

정답: B. build가 matcher를 정적으로 분석할 수 있어야 한다.
</details>

## 챕터 요약

- Proxy는 route 렌더링 전에 요청을 처리한다.
- `middleware` 명칭은 deprecated되었다.
- 함수 하나와 선택적 정적 `config`를 export한다.
- renderer와 분리될 수 있어 global state를 공유하지 않는다.
- 빠른 rewrite·redirect·header 결정에 집중한다.
