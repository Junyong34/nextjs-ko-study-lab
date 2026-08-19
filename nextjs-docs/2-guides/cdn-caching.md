# CDN Caching

- 공식 문서: [CDN Caching](https://nextjs.org/docs/app/guides/cdn-caching)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 렌더링 전략별 `Cache-Control` 헤더와 CDN 캐싱 가능 범위를 구분한다.
- App Router 응답을 구분하는 요청 헤더와 `_rsc` 검색 매개변수의 역할을 설명한다.
- CDN이 반드시 보존해야 하는 값과 제한적으로 생략할 수 있는 값을 판단한다.
- pathname 기반 캐시 키 설계가 현재 방식의 문제를 어떻게 줄이는지 설명한다.

## 핵심 개념 및 설명

Next.js는 CDN이 응답을 엣지에 캐시할 수 있도록 표준 `Cache-Control` 헤더를 설정한다. 다만 App Router는 HTML, React Server Components(RSC) payload, prefetch 유형과 라우터 상태에 따라 응답이 달라진다. CDN은 이 변형을 구분하는 캐시 키와 헤더 전달 규칙을 지켜야 한다.

### 현재 사용할 수 있는 방식

#### `Cache-Control` 헤더

Next.js는 라우트의 렌더링 전략에 따라 다음 헤더를 설정한다.

- 정적 페이지: `s-maxage=31536000`으로 1년간 공유 캐시에 저장한다.
- ISR 페이지: `s-maxage={revalidate}, stale-while-revalidate={expire - revalidate}`를 사용한다. 기본 `expire`는 1년이며 [`cacheLife`](../3-api-reference/3.3-functions/cacheLife.md)로 바꿀 수 있다.
- 다이나믹 페이지: `private, no-cache, no-store, max-age=0, must-revalidate`로 공유 캐싱을 막는다.

`s-maxage`와 `stale-while-revalidate`를 지원하는 CDN은 정적·ISR 페이지를 엣지에 캐시할 수 있다. 그러나 CDN 캐싱만으로는 [`revalidateTag()`](../3-api-reference/3.3-functions/revalidateTag.md)나 [`revalidatePath()`](../3-api-reference/3.3-functions/revalidatePath.md)의 온디맨드 revalidation을 전파하지 못한다. 이 함수들은 Next.js 서버 캐시만 무효화하므로 CDN은 `s-maxage`가 끝날 때까지 기존 사본을 제공한다. 서버 캐시를 무효화한 뒤 HTML과 RSC 변형을 포함한 관련 키를 CDN purge API로 함께 제거한다.

#### 정적 asset

`/_next/static/` 아래 JavaScript, CSS, 이미지, 폰트 파일명에는 콘텐츠 해시가 들어간다. Next.js는 이 응답에 `public, max-age=31536000, immutable`을 설정한다. [`assetPrefix`](../3-api-reference/3.5-config/3.5.1-next-config-js/assetPrefix.md)를 사용하면 정적 asset을 다른 도메인이나 CDN origin에서 제공할 수 있다.

#### PPR 라우트의 정적 prefetch

Partial Prerendering(PPR)이 활성화된 라우트에서 `next-router-prefetch` 헤더가 설정된 정적 prefetch 응답은 클라이언트 라우터 상태와 무관하게 같은 prerendering 콘텐츠를 반환한다. 이 요청에서는 `next-router-state-tree`를 해석하지 않는다.

CDN이 이 응답을 캐시하려면 다음 두 조건을 지킨다.

1. HTML 응답과 prefetch 변형을 구분하도록 `_rsc` 검색 매개변수를 캐시 키에 포함한다.
2. Next.js가 설정한 `Cache-Control` 헤더를 따른다.

> **알아두면 좋은 점**: PPR이 없는 라우트는 prefetch 범위를 정하기 위해 `next-router-state-tree`를 읽으므로 현재 라우터 상태만큼 캐시 변형이 늘어난다. Cache Components의 세그먼트별 prefetch는 이미 `/page.segments/_tree.segment.rsc` 같은 pathname 기반 라우트를 사용하므로 CDN이 일반 pathname 캐시 키로 저장할 수 있다.

### CDN 캐싱이 까다로운 이유

App Router 응답은 다음 사용자 정의 요청 헤더에 따라 달라질 수 있다. Next.js는 CDN에 이를 알리기 위해 `Vary` 응답 헤더를 설정한다.

- `rsc`: HTML 대신 RSC payload를 요청하는지 구분한다.
- `next-router-state-tree`: 다이나믹 내비게이션 중 갱신할 세그먼트를 정하는 클라이언트 라우터 상태다.
- `next-router-prefetch`: prefetch 요청인지 구분한다.
- `next-router-segment-prefetch`: prefetch할 특정 세그먼트를 나타낸다.
- `next-url`: [interception route](../3-api-reference/3.1-file-conventions/intercepting-routes.md)에서 가로채는 URL을 전달한다. 이 라우트를 사용하는 경우에만 추가된다.

> **알아두면 좋은 점**: [`proxy.js`](../3-api-reference/3.1-file-conventions/proxy.md)는 인증, 리다이렉트, rewrite의 기준이 되도록 CDN 캐시보다 먼저 실행해야 한다. 배포 구조상 CDN 뒤에서 실행된다면 `proxy.js` 판단에 의존하는 라우트는 캐싱하지 않도록 설정한다.

많은 CDN은 추가 설정 없이 `Vary`를 지원하지 않는다. Next.js는 관련 요청 헤더 값을 해시한 `_rsc` 검색 매개변수를 캐시 키로 사용한다. 따라서 CDN이 `Vary`를 무시하더라도 서로 다른 응답 변형이 같은 키에 저장되지 않는다.

### CDN에서 헤더 처리하기

#### 제한적으로 생략할 수 있는 값

다음 헤더는 특정 기능이 저하되는 것을 받아들인다면 생략할 수 있다. 서버 응답은 계속 파싱할 수 있지만 더 크거나 현재 내비게이션에 덜 최적화될 수 있다.

- `next-router-state-tree`: 일반 RSC 요청에서 생략하면 특정 세그먼트 갱신 대신 전체 payload를 반환한다.
- `next-router-segment-prefetch`: prefetch 요청에서 생략하면 세그먼트별 payload 대신 더 넓은 범위의 payload로 대체한다.
- `next-url`: 생략하면 interception route를 지원하지 못한다. 사용자는 가로챈 화면 대신 일반 목적지 페이지를 보게 된다.

#### 반드시 보존해야 하는 값

- `rsc` 헤더는 클라이언트에서 서버까지 전달해야 한다. CDN이 제거하면 클라이언트 라우터가 RSC를 기대할 때 서버가 HTML을 반환해 클라이언트 내비게이션이 깨지고 브라우저 내비게이션으로 바뀐다.
- `next-router-prefetch`가 있으면 이 헤더와 `_rsc` 검색 매개변수를 모두 보존한다. prefetch 흐름에서 `_rsc`는 필수 캐시 구분자다.
- `_rsc`를 캐시 키에 포함한다. 일부 CDN의 기본 동작처럼 검색 매개변수를 캐시 키에서 제거하면 안 된다.

올바른 `_rsc` 값이 없는 RSC 요청에는 기본적으로 정확한 해시가 들어간 URL로 **307 redirect**를 반환한다. CDN은 이 redirect를 따라야 한다. 이 검증은 `experimental.validateRSCRequestHeaders: false`로 끌 수 있다. 상위 인프라에서 해시를 계산할 수 있다면 요청을 origin에 보내기 전에 올바른 `_rsc`로 rewrite해 왕복을 줄일 수 있다.

> **알아두면 좋은 점**: 현재 정적 prefetch에서도 `next-url`이 `_rsc` 해시에 포함된다. 따라서 이 헤더를 무시하면 프로토콜 오류가 없더라도 캐시 miss가 생길 수 있다. 다음의 pathname 기반 설계가 이 간극을 해결한다.

### 방향: pathname 기반 캐시 키

Next.js 팀은 캐시에 영향을 주는 모든 입력을 URL pathname으로 옮기는 방식을 설계하고 있다. 사용자 정의 헤더의 `Vary`와 `_rsc` 검색 매개변수에 의존하지 않게 하는 것이 목표다.

#### 동작 방식

이 방식은 [`output: 'export'`](./static-exports.md)와 세그먼트 prefetch가 이미 사용하는 라우팅 패턴을 확장한다.

- 전체 페이지 RSC: `/my/page.rsc`
- 특정 세그먼트 RSC: `/my/page.segments/path/to/segment.segment.rsc`

이 모델에서는 pathname이 응답 변형과 캐시 키를 결정한다. 검색 매개변수를 버려도 반환 응답이 달라지지 않으며 표준 HTTP 캐시 헤더를 그대로 따른다. CDN은 사용자 정의 헤더나 `Vary`를 해석하지 않고 pathname을 캐시 키로 사용하면 된다.

#### interception route의 변화

현재는 `next-url`이 `_rsc` 해시에 포함된다. pathname 기반 방식에서는 interception 변형을 pathname이 아닌 검색 매개변수로 인코딩할 계획이다.

- CDN이 검색 매개변수를 보존하면 interception이 정상 작동한다.
- CDN이 검색 매개변수를 제거하면 일반 페이지로 자연스럽게 대체되고 클라이언트 내비게이션 자체는 깨지지 않는다.

따라서 interception route 지원은 모든 CDN의 필수 조건이 아니라 선택 기능이 된다.

#### 현재 상태

pathname 기반 방식은 세그먼트 prefetch 경로와 `output: 'export'`에서 이미 동작하는 패턴을 확장하는 방향이지만, 현재 적극적으로 설계 중이다. 완료된 기능으로 단정해 배포 설정에 의존하면 안 된다.

### CDN 기능 호환성

주요 CDN이 제공하는 엣지 컴퓨팅, key-value 저장소, blob 저장소, PPR 재개 기능 비교는 [Deploying to Platforms](./deploying-to-platforms.md)를 참고한다. 자체 호스팅 구조는 [Self-Hosting](./self-hosting.md), CDN 뒤에서의 점진적 응답은 [Streaming](./streaming.md)을 함께 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: HTML, RSC, prefetch 요청이 어떤 캐시 키와 헤더 조합으로 분리되는지 시각화한다.
- 사용자가 확인할 화면과 상호작용:
  - 정적·ISR·다이나믹 라우트의 `Cache-Control` 응답을 비교한다.
  - `_rsc`를 캐시 키에서 제거했을 때 HTML과 RSC 응답이 충돌하는 상황을 재현한다.
  - `rsc`, `next-router-prefetch`, `next-url`을 각각 제거했을 때 기능 저하와 오류 차이를 확인한다.

## 연습 문제

1. `revalidateTag()` 호출 직후 CDN의 기존 사본도 즉시 제거하려면 무엇이 필요한가?

   - A. 브라우저 새로고침만 수행한다.
   - B. Next.js revalidation과 함께 CDN purge API를 호출한다.
   - C. `_rsc`를 캐시 키에서 제거한다.
   - D. `Vary`를 응답에서 제거한다.

   <details><summary>정답 보기</summary>

   정답: B. Next.js revalidation은 서버 캐시만 무효화하므로 CDN 캐시도 별도로 제거해야 한다.

   </details>

2. 현재 App Router CDN 설정에서 반드시 보존해야 하는 값을 모두 고른다.

   - A. `rsc` 헤더
   - B. `_rsc` 검색 매개변수를 포함한 캐시 키
   - C. 모든 요청의 `next-router-state-tree`
   - D. prefetch 요청의 `next-router-prefetch`

   <details><summary>정답 보기</summary>

   정답: A, B, D. `next-router-state-tree`는 일반 RSC 요청에서 생략할 수 있지만 payload가 더 넓어진다.

   </details>

3. pathname 기반 캐시 키 설계의 목표는 무엇인가?

   - A. 모든 응답을 비공개 캐시로 바꾼다.
   - B. 사용자 정의 헤더의 `Vary`와 `_rsc` 검색 매개변수 의존을 줄인다.
   - C. 정적 asset에서 콘텐츠 해시를 제거한다.
   - D. interception route를 필수 CDN 기능으로 만든다.

   <details><summary>정답 보기</summary>

   정답: B. 응답 유형을 pathname에 표현해 표준 캐시 키와 헤더만으로 처리하려는 방향이다.

   </details>

## 챕터 요약

- Next.js는 정적·ISR·다이나믹 라우트에 서로 다른 `Cache-Control` 정책을 설정한다.
- 온디맨드 revalidation을 CDN까지 전파하려면 서버 캐시 무효화와 CDN purge가 모두 필요하다.
- 현재 App Router 응답 변형은 사용자 정의 헤더와 `_rsc` 캐시 키로 구분한다.
- `rsc`와 prefetch의 필수 값은 보존하고, 선택 헤더를 생략할 때의 기능 저하를 이해해야 한다.
- pathname 기반 캐시 키는 이 복잡성을 줄일 방향이지만 아직 적극적인 설계 단계다.
