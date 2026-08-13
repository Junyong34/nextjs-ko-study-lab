# How Revalidation Works

- 공식 문서: [How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 시간 기반 revalidation과 요청 기반 revalidation의 실행 시점을 구분한다.
- HTML과 RSC payload를 같은 캐시 항목으로 다뤄야 하는 이유를 설명한다.
- 명시적 태그와 soft tag가 어떤 revalidation API를 지원하는지 설명한다.
- 다중 인스턴스 환경에서 `updateTags()`와 `refreshTags()`로 무효화를 전파한다.
- 캐시 장애가 발생했을 때 가용성을 유지하는 처리 원칙을 설명한다.

## 핵심 개념 및 설명

이 문서는 `use cache`, `cacheTag`, `cacheLife`의 사용법보다 revalidation 내부 구조가 필요한 플랫폼 개발자와 고급 사용자를 위한 내용이다. 커스텀 캐시 핸들러를 구현하거나 revalidation 동작을 디버깅할 때 기준 모델로 사용한다.

### Revalidation 모델

App Router 라우트와 ISR/prerender 캐시 항목을 만드는 Pages Router 라우트 대부분은 요청에 따라 revalidation할 수 있다. 자동 정적 최적화로 순수 정적 출력만 만드는 Pages Router 라우트는 대상이 아니다.

- **시간 기반 revalidation**은 stale-while-revalidate 패턴을 사용한다. 캐시 나이가 `cacheLife` 또는 `revalidate` 기간을 넘으면 기존 콘텐츠를 즉시 제공하면서 백그라운드에서 다시 생성한다. 새 콘텐츠가 준비될 때까지 기존 콘텐츠를 계속 제공한다.
- **요청 기반 revalidation**은 `revalidateTag()`나 `revalidatePath()`를 호출해 캐시를 명시적으로 무효화한다. 해당 콘텐츠에 대한 다음 요청이 새 렌더링을 시작한다.

> **알아두면 좋은 점**: Pages Router의 요청 기반 ISR API인 `res.revalidate()`와 `x-prerender-revalidate` 흐름은 계속 지원되며 단수형 `cacheHandler`를 사용한다. 복수형 `cacheHandlers` 옵션은 `'use cache'` 지시어용이다.

### Revalidation되는 결과

라우트를 revalidation하면 Next.js는 같은 React 컴포넌트 트리에서 **HTML 응답과 RSC payload를 모두** 다시 생성한다. 두 결과는 같은 캐시 항목에 함께 저장된다. HTML은 직접 방문에, RSC payload는 클라이언트 내비게이션에 사용되므로 두 경로가 같은 내용을 보여야 한다.

#### 두 결과가 어긋날 때

플랫폼이 서로 다른 렌더링에서 나온 HTML과 RSC payload를 제공하면 사용자는 클라이언트 내비게이션 중 오래되거나 맞지 않는 콘텐츠를 볼 수 있다. 둘을 같은 TTL과 무효화 정책으로 함께 캐싱하고 Next.js가 설정한 `Vary` 헤더를 지켜야 한다.

롤링 배포 중 배포 A로 빌드한 클라이언트가 배포 B 서버의 응답을 받는 **배포 간 불일치(cross-deployment skew)**도 별도 문제다. `deploymentId`를 설정하면 클라이언트가 다른 배포 ID를 감지했을 때 하드 내비게이션으로 일관된 콘텐츠를 다시 가져온다.

### 태그 시스템 구조

#### 명시적 태그

개발자가 `use cache` 함수 안에서 `cacheTag()`를 호출하거나 `fetch`에 `next: { tags: [...] }`를 지정해 만든다. `revalidateTag('my-tag', 'max')`를 호출하면 해당 태그가 붙은 모든 캐시 항목이 무효화된다.

#### Soft tag

Next.js는 라우트 경로를 바탕으로 `_N_T_` 접두사의 soft tag를 만든다. `/blog/hello`에는 `_N_T_/layout`, `_N_T_/blog/layout`, `_N_T_/blog/hello/layout`, `_N_T_/blog/hello` 같은 태그가 생긴다. 각 경로 세그먼트의 layout 태그와 리프 라우트 태그를 함께 사용한다.

`revalidatePath('/blog/hello')`는 같은 태그 시스템을 통해 리프 라우트와 조상 layout의 soft tag를 무효화한다. 커스텀 핸들러의 `get()`은 `softTags` 인자로 이 목록을 받는다. `getExpiration()`이 반환한 가장 최근 revalidation 시각이 캐시 항목의 생성 시각보다 최신이면 오래된 항목으로 처리해야 한다. 반환값 `0`은 해당 태그의 revalidation이 없음을, `Infinity`는 `get()`에서 soft tag 만료 여부를 직접 검사해야 함을 뜻할 수 있다.

### 다중 인스턴스 고려 사항

로드 밸런서 뒤에 여러 Next.js 인스턴스를 두면 revalidation 이벤트는 기본적으로 로컬에만 적용된다. 인스턴스 A에서 `revalidateTag()`를 호출해도 다른 인스턴스는 이벤트를 알기 전까지 오래된 콘텐츠를 제공한다.

- **`updateTags()`**: `revalidateTag()`가 호출될 때 실행된다. Redis나 데이터베이스 같은 공유 저장소에 무효화 이벤트를 기록한다.
- **`refreshTags()`**: 주기적으로, 그리고 새 요청을 시작하기 전에 항상 실행된다. 공유 저장소의 이벤트를 읽어 로컬 태그 상태를 갱신한다.

### 플랫폼 구현 패턴

#### 단일 인스턴스

기본 파일 시스템 캐시는 로컬 파일에 원자적으로 쓰고 태그 상태를 메모리에 유지한다. 별도 설정이 필요하지 않다.

#### 공유 캐시를 사용하는 다중 인스턴스

1. 태그 무효화 시각을 Redis, DynamoDB, HTTP API 같은 공유 서비스에 저장한다.
2. `updateTags()`에서 공유 서비스에 기록한다.
3. `refreshTags()`에서 공유 서비스의 상태를 읽는다. 오류가 바깥으로 전파되면 요청 자체가 실패하므로 내부에서 잡아야 한다. 연결이 복구될 때까지 마지막 로컬 상태로, 잠재적으로 오래된 콘텐츠를 제공한다.
4. HTML과 RSC payload를 공유 저장소의 같은 캐시 항목에 둔다. 원자적 쓰기는 불일치 구간을 더 줄이지만 올바른 동작을 위한 필수 조건은 아니다.

#### CDN 통합

CDN은 Next.js가 설정하는 `Vary`와 `Cache-Control`을 지켜야 한다. HTML과 RSC payload를 서로 다른 TTL로 따로 캐싱하면 안 된다.

### 점진적 성능 저하

revalidation 시스템은 엄격한 일관성보다 가용성을 우선한다.

- **캐시 쓰기 실패**: 쓰기는 비동기로 처리되므로 현재 응답은 사용자에게 제공된다. 항목은 저장되지 않고 다음 요청이 새 렌더링을 시작한다.
- **캐시 읽기 실패**: 커스텀 핸들러는 내부 오류를 잡고 캐시 미스를 뜻하는 `undefined`를 반환해야 한다. 오류를 던지면 렌더링 오류로 전파된다.
- **HTML/RSC 불일치**: 두 결과를 함께 캐싱하고 `Vary`를 지켜 방지한다.
- **배포 간 불일치**: `deploymentId`를 설정해 빌드 ID가 달라질 때 하드 내비게이션을 유도한다.

캐시 장애는 오래된 콘텐츠나 추가 렌더링 같은 성능 저하를 만들지만 애플리케이션 자체를 중단시키지 않는 방향으로 처리한다.

## 예제 및 데모 설계

- **Phase 1 상태**: 구현 예정
- 두 Next.js 인스턴스와 공유 Redis를 그려 `updateTags()` 기록, `refreshTags()` 동기화, 다음 요청의 새 렌더링 순서를 시각화한다.
- HTML과 RSC payload의 TTL을 같게 했을 때와 다르게 했을 때 클라이언트 내비게이션 결과를 비교한다.
- 공유 저장소 장애를 주입하고 `refreshTags()`가 오류를 잡을 때는 오래된 콘텐츠가 제공되지만, 오류를 던질 때는 요청이 실패함을 확인한다.

## 연습 문제

1. 시간 기반 revalidation에서 유효 기간이 지난 첫 요청이 받는 것은 무엇인가?
   - A. 오류 응답
   - B. 기존 캐시 콘텐츠
   - C. 빈 HTML
   - D. 새 콘텐츠가 끝날 때까지 차단된 응답

   <details><summary>정답 보기</summary>

   정답: B. 기존 콘텐츠를 즉시 제공하고 백그라운드에서 새 콘텐츠를 생성한다.

   </details>

2. 다중 인스턴스의 태그 무효화 전파에 필요한 조합은 무엇인가?
   - A. `updateTags()`와 `refreshTags()`
   - B. `generateStaticParams()`와 `redirect()`
   - C. `useState()`와 `useEffect()`
   - D. `headers()`와 `cookies()`

   <details><summary>정답 보기</summary>

   정답: A. 하나는 공유 저장소에 기록하고 다른 하나는 새 요청 전에 상태를 읽는다.

   </details>

## 챕터 요약

- 시간 기반 revalidation은 기존 콘텐츠를 제공하면서 백그라운드에서 갱신한다.
- 요청 기반 revalidation은 태그나 경로를 무효화하고 다음 요청에서 새 렌더링을 시작한다.
- HTML과 RSC payload는 같은 TTL과 무효화 정책으로 함께 다뤄야 한다.
- Soft tag는 경로와 조상 layout을 `revalidatePath()`로 무효화하게 해준다.
- 다중 인스턴스에서는 공유 태그 상태와 오류를 견디는 캐시 핸들러가 필요하다.
