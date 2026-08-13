# PPR Platform Guide

- 공식 문서: [PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- PPR이 빌드 시점과 요청 시점에 생성·전송하는 산출물을 설명한다.
- origin 전용 구현과 CDN shell + origin compute 구현의 차이를 비교한다.
- resume protocol과 adapter 출력으로 플랫폼의 PPR 지원을 설계한다.

## 핵심 개념 및 설명

Partial Prerendering(PPR)은 한 라우트 안에서 정적 렌더링과 다이나믹 렌더링을 결합한다. 빌드할 때 static HTML shell과 `postponedState`를 만들고, 요청이 오면 shell을 즉시 보낸 뒤 다이나믹 영역을 이어서 렌더링하고 [스트리밍](./streaming.md)한다.

### PPR 동작 방식

#### 빌드 시점

각 PPR 라우트는 세 가지 산출물을 만든다.

- **static HTML shell**: prerender할 수 있는 콘텐츠와 다이나믹 콘텐츠 자리에 표시할 Suspense fallback을 담는다.
- **`postponedState`**: 나중에 렌더링을 재개하기 위한 직렬화 문자열이다. 불투명한 값으로 취급하고 분석하거나 변경하지 않은 채 전달해야 한다. 값을 바꾸면 다이나믹 렌더링 결과가 올바르지 않다.
- **RSC payload**: 페이지의 정적 부분에 대응하는 React Server Components 데이터다.

#### 요청 시점

1. 서버가 static HTML shell을 즉시 보낸다.
2. `postponedState`를 사용해 다이나믹 부분의 렌더링을 재개한다.
3. 완료되는 콘텐츠를 스트리밍하고 React가 미뤄진 Suspense 경계를 hydrate한다.

사용자는 static shell을 먼저 보고, 다이나믹 콘텐츠는 준비되는 순서대로 나타난다.

### PPR 산출물 저장

각 라우트의 static HTML shell과 `postponedState`는 한 쌍으로 저장해야 한다. 시간 기반 또는 요청 기반 revalidation이 일어나면 Next.js가 둘을 함께 다시 생성한다. 새 shell과 오래된 postponed state를 조합하거나 그 반대로 제공하면 다이나믹 결과가 잘못된다.

따라서 두 산출물은 원자적으로 갱신한다. adapter에서는 [`requestMeta.onCacheEntryV2`](../3-api-reference/3.7-adapters/implementing-ppr-in-an-adapter.md)로 [시간 기반 revalidation](./incremental-static-regeneration.md)이나 [`revalidateTag`](../3-api-reference/3.3-functions/revalidateTag.md)를 사용한 요청 기반 revalidation 이후 캐시 변경을 관찰해 저장소에 전파할 수 있다.

### Origin 전용 구현

모든 요청을 Next.js 서버로 직접 보내는 가장 단순한 방식이다. 서버가 로컬 캐시에서 shell을 읽어 보내고, 이어 다이나믹 콘텐츠를 렌더링해 스트리밍한다. `next start`의 기본 동작이다.

별도 인프라는 필요 없다. 플랫폼이 스트리밍 HTTP 응답을 지원하면 PPR을 지원할 수 있다.

### CDN shell + origin compute

첫 바이트 시간을 줄이려면 static HTML shell을 CDN edge에 캐시할 수 있다.

1. CDN이 캐시한 shell을 edge 지연 시간으로 즉시 보낸다.
2. 동시에 origin 서버에 resume 요청을 보낸다.
3. origin이 다이나믹 부분만 렌더링해 스트리밍한다.
4. CDN이 shell과 다이나믹 응답을 하나의 스트리밍 응답으로 이어 붙인다.

이 방식에는 캐시한 콘텐츠와 다이나믹 콘텐츠를 한 응답으로 결합하는 CDN 기능이 필요하다. 더 낮은 지연 시간이 필요하면 `onBuildComplete`에서 edge KV 같은 저장소에 shell을 넣을 수 있다. 이는 플랫폼 아키텍처 선택이며 Next.js 애플리케이션 코드를 바꿀 필요는 없다.

### Resume protocol

resume protocol은 Next.js handler에 shell을 건너뛰고 다이나믹 부분만 렌더링하라고 알린다. CDN과 origin이 분리된 구조나 shell을 따로 제공하는 adapter 기반 배포에서 사용한다. 일반 `next start`는 shell 전송과 resume을 한 번에 처리하므로 별도 protocol 호출이 필요 없다.

#### CDN에서 origin으로 호출

- 라우트에 `POST` 요청을 보낸다.
- `next-resume: 1` 헤더를 넣는다.
- 요청 body에 `postponedState`를 넣는다.
- 서버는 미뤄진 Suspense 경계만 렌더링해 스트리밍한다.

> **알아두면 좋은 점**: Server Action과 PPR resume을 같은 POST에서 처리하면 body는 postponed state 뒤에 action body가 이어지는 구조다. `x-next-resume-state-length`가 postponed state 접두사의 byte 길이를 전달해 둘을 나눈다. 일반적인 순수 PPR resume에서는 body 전체가 postponed state이므로 이 헤더가 필요 없다.

#### Adapter 기반 호출

handler를 프로세스 안에서 직접 호출할 때는 다음 값을 제공한다.

- `req.method: 'POST'`
- `next-resume: 1` 요청 헤더
- body의 `postponedState`

또는 세 번째 인수에 `requestMeta: { postponed: postponedState }`를 넘겨 HTTP 계층을 건너뛸 수 있다. handler는 다이나믹 부분만 렌더링해 `res`로 스트리밍하며 별도 HTTP 왕복이 없다.

#### 빌드 출력에서 PPR 라우트 찾기

[adapter 출력](../3-api-reference/3.7-adapters/output-types.md)의 `outputs.prerenders`에서 `renderingMode: 'PARTIALLY_STATIC'`인 항목이 PPR 라우트다. 해당 항목의 `fallback.postponedState`를 읽는다. `pprChain.headers`에는 resume에 필요한 `{ 'next-resume': '1' }`가 들어 있다. 전체 코드 예제는 [Adapter에서 PPR 구현하기](../3-api-reference/3.7-adapters/implementing-ppr-in-an-adapter.md)를 참고한다.

### 구현 체크리스트

1. **빌드 출력 읽기**: `onBuildComplete`에서 `PARTIALLY_STATIC` prerender를 찾아 shell과 `postponedState`를 저장한다.
2. **shell 제공**: PPR 요청이 오면 캐시한 shell을 즉시 보내고 스트리밍을 시작한다.
3. **다이나믹 렌더링 resume**: CDN 구조에서는 POST와 resume 헤더·body로 origin을 호출한다. adapter 구조에서는 같은 정보를 handler에 직접 넘긴다.
4. **캐시 갱신**: `requestMeta.onCacheEntryV2`로 revalidation 결과를 받고 shell과 postponed state 쌍을 원자적으로 갱신한다.
5. **안전한 성능 저하**: postponed state가 없거나 오래됐으면 전체 서버 렌더링으로 대체한다. shell-first 최적화는 잃지만 완전한 페이지를 제공한다.

전체 adapter API와 구현 예제는 [Deployment Adapter API](../3-api-reference/3.5-config/3.5.1-next-config-js/adapterPath.md)에서 확인한다.

## 예제 및 데모 설계

- Phase 2에서 빌드 산출물의 shell, `postponedState`, RSC payload를 라우트별로 탐색한다.
- origin 전용 PPR과 CDN shell 구조를 타임라인으로 시각화해 TTFB와 완료 시간을 비교한다.
- shell과 postponed state 버전을 일부러 어긋나게 한 실패 예와 원자적 갱신 결과를 비교한다.
- resume POST의 헤더와 body를 기록하고 순수 resume과 Server Action 결합 요청을 구분한다.

## 연습 문제

1. PPR에서 반드시 한 쌍으로 원자적으로 저장해야 하는 것은?

   - A. static HTML shell과 `postponedState`
   - B. CSS와 source map
   - C. Proxy와 Route Handler

   <details><summary>정답 보기</summary>

   정답: A. 서로 다른 버전을 조합하면 다이나믹 렌더링 결과가 잘못된다.

   </details>

2. 순수 CDN-to-origin PPR resume 요청으로 맞는 것은?

   - A. GET 요청과 빈 body
   - B. `next-resume: 1` 헤더가 있는 POST와 body의 `postponedState`
   - C. WebSocket 연결

   <details><summary>정답 보기</summary>

   정답: B. origin은 이 정보를 사용해 shell을 제외한 다이나믹 부분만 렌더링한다.

   </details>

3. `postponedState`를 다룰 때 지켜야 할 원칙은?

   - A. JSON으로 parsing한 뒤 필요한 필드만 저장한다.
   - B. 압축을 풀어 값 일부를 수정한다.
   - C. 불투명한 문자열로 취급해 변경 없이 전달한다.

   <details><summary>정답 보기</summary>

   정답: C. 내부 형식을 해석하거나 바꾸면 resume 결과가 올바르지 않다.

   </details>

## 챕터 요약

- PPR은 build time shell과 request time 다이나믹 스트리밍을 결합한다.
- static HTML shell, `postponedState`, 정적 RSC payload가 빌드 산출물이다.
- shell과 postponed state는 같은 버전으로 원자적으로 저장·갱신한다.
- origin 전용 구현은 단순하고 CDN shell 구조는 TTFB를 더 줄일 수 있다.
- resume protocol은 POST, `next-resume` 헤더, postponed state로 다이나믹 렌더링만 재개한다.
