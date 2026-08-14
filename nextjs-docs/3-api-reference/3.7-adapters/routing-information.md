# Routing Information

- 공식 문서: [Routing Information](https://nextjs.org/docs/app/api-reference/adapters/routing-information)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `onBuildComplete`의 `routing` 객체가 제공하는 라우팅 단계별 정보를 이해한다.
- `beforeMiddleware`, `beforeFiles`, `afterFiles`, `dynamicRoutes`, `onMatch`, `fallback` 각 단계의 역할을 구분한다.
- `Route` 항목이 공통으로 갖는 필드를 파악한다.

## 핵심 개념 및 설명

`onBuildComplete`의 `routing` 객체는 배포에 바로 사용할 수 있도록 가공된 라우팅 패턴 정보를 완전한 형태로 제공한다.

<a id="routing-beforemiddleware"></a>
### routing.beforeMiddleware

미들웨어 실행 전에 적용되는 라우트다. 생성된 header 및 redirect 동작을 포함한다.

<a id="routing-beforefiles"></a>
### routing.beforeFiles

파일 시스템 라우트 매칭보다 먼저 확인하는 rewrite 라우트다.

<a id="routing-afterfiles"></a>
### routing.afterFiles

파일 시스템 라우트 매칭 이후에 확인하는 rewrite 라우트다.

<a id="routing-dynamicroutes"></a>
### routing.dynamicRoutes

`[slug]`나 catch-all 라우트 같은 라우트 세그먼트로부터 생성된 다이나믹 매처(matcher)다.

<a id="routing-onmatch"></a>
### routing.onMatch

매칭에 성공한 뒤에 적용되는 라우트다. 예를 들어 해시가 포함된 정적 자산에 적용하는 불변(immutable) 캐시 헤더가 여기 해당한다.

<a id="routing-fallback"></a>
### routing.fallback

앞선 단계에서 매칭되지 않았을 때 마지막으로 확인하는 rewrite 라우트다.

<a id="common-route-fields"></a>
### 공통 Route 필드

각 라우트 항목은 다음 필드를 포함할 수 있다.

- `source`: 원본 라우트 패턴 (생성된 내부 규칙에는 없을 수 있음, 선택)
- `sourceRegex`: 요청 매칭에 쓰이는 컴파일된 정규식
- `destination`: 내부 목적지 또는 리다이렉트 목적지
- `headers`: 적용할 헤더
- `has`: 긍정 매칭 조건
- `missing`: 부정 매칭 조건
- `status`: 리다이렉트 상태 코드
- `priority`: 내부 라우트 우선순위 플래그

## 예제 및 데모 설계

- 데모 가능 여부: Phase 1에서는 구현 예정이다.
- Phase 2에서는 어댑터의 `onBuildComplete`에서 `routing` 객체를 로그로 출력해 단계별로 어떤 라우트가 담기는지 확인하는 데모를 계획한다.

## 연습 문제

1. 해시가 포함된 정적 자산에 불변 캐시 헤더를 적용하는 단계는?
   - A. `routing.beforeFiles`
   - B. `routing.onMatch`
   - C. `routing.fallback`

<details><summary>정답 보기</summary>

정답: B. `routing.onMatch`는 매칭 성공 후 적용되는 라우트로, 해시가 포함된 정적 자산의 불변 캐시 헤더가 대표적인 예다.
</details>

2. 파일 시스템 라우트 매칭보다 먼저 확인하는 rewrite 라우트는?
   - A. `routing.beforeFiles`
   - B. `routing.afterFiles`
   - C. `routing.fallback`

<details><summary>정답 보기</summary>

정답: A. `routing.beforeFiles`는 파일 시스템 라우트 매칭 전에 확인하는 rewrite 라우트다.
</details>

## 챕터 요약

- `routing` 객체는 `onBuildComplete`에서 가공된 라우팅 정보를 완전한 형태로 제공한다.
- `beforeMiddleware`, `beforeFiles`, `afterFiles`, `dynamicRoutes`, `onMatch`, `fallback` 여섯 단계로 구성된다.
- `beforeFiles`는 파일 시스템 라우트 매칭 전에, `afterFiles`는 그 이후에 확인하는 rewrite 라우트다.
- `onMatch`는 매칭 성공 후, `fallback`은 앞 단계 모두 매칭되지 않았을 때 적용된다.
- 각 `Route` 항목은 `source`, `sourceRegex`, `destination`, `headers`, `has`, `missing`, `status`, `priority` 필드를 가질 수 있다.
