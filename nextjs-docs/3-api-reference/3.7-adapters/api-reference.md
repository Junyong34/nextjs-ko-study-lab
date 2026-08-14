# API Reference

- 공식 문서: [API Reference](https://nextjs.org/docs/app/api-reference/adapters/api-reference)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `NextAdapter` 인터페이스가 노출하는 두 훅 `modifyConfig`와 `onBuildComplete`의 호출 시점과 역할을 구분한다.
- `modifyConfig`로 빌드 전에 Next.js 설정을 조작하는 방법을 이해한다.
- `onBuildComplete`가 전달하는 라우팅·출력 정보의 구조를 파악해 배포 어댑터가 활용할 수 있는 데이터 범위를 안다.

## 핵심 개념 및 설명

이 문서는 `NextAdapter` 인터페이스 중 `modifyConfig`와 `onBuildComplete`에 대한 레퍼런스다. 어댑터는 Next.js의 빌드·런타임 모델과 통합되는 배포 어댑터를 만들고 검증할 때 구현하는 모듈이다.

### `async modifyConfig(config, context)`

`next.config.js` 파일을 로드하는 모든 CLI 명령에서 호출되어 설정을 수정할 수 있게 한다.

**매개변수:**

- `config`: 전체 Next.js 설정 객체
- `context.phase`: 현재 빌드 phase ([phases](https://nextjs.org/docs/app/api-reference/config/next-config-js#phase) 참고)
- `context.nextVersion`: 사용 중인 Next.js 버전
- `context.projectDir`: Next.js 프로젝트 디렉토리의 절대 경로

**반환값:** 수정된 설정 객체 (비동기일 수 있다)

### `async onBuildComplete(context)`

빌드 프로세스가 완료된 후 라우트와 출력에 대한 상세 정보와 함께 호출된다.

**매개변수:**

- `context.routing`: Next.js 라우팅 phase와 메타데이터를 담은 객체
  - `routing.beforeMiddleware`: 미들웨어보다 먼저 실행되는 라우트 (header와 redirect 처리를 포함한다)
  - `routing.beforeFiles`: 파일시스템 라우트 매칭 전에 확인되는 rewrite 라우트
  - `routing.afterFiles`: 파일시스템 라우트 매칭 후에 확인되는 rewrite 라우트
  - `routing.dynamicRoutes`: 다이나믹 라우트 매칭 테이블
  - `routing.onMatch`: 매칭에 성공한 뒤 적용되는 라우트 (예를 들어 불변 정적 에셋 캐시 헤더)
  - `routing.fallback`: 최종 rewrite fallback 라우트
  - `routing.shouldNormalizeNextData`: 매칭 중 `/_next/data/<buildId>/...` URL을 정규화해야 하는지 여부
  - `routing.rsc`: React Server Components 라우팅 동작에 사용되는 라우트 메타데이터
- `context.outputs`: 타입별로 정리된 모든 빌드 출력에 대한 상세 정보
- `context.projectDir`: Next.js 프로젝트 디렉토리의 절대 경로
- `context.repoRoot`: 감지된 저장소 루트의 절대 경로
- `context.distDir`: 빌드 출력 디렉토리의 절대 경로
- `context.config`: (`modifyConfig`가 적용된) 최종 Next.js 설정
- `context.nextVersion`: 사용 중인 Next.js 버전
- `context.buildId`: 현재 빌드의 고유 식별자

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- Phase 1에서는 구현 예정으로 남긴다. Phase 2에서 최소 어댑터 모듈을 작성해 `modifyConfig`로 설정값을 로깅하고, `onBuildComplete`가 전달하는 `context.routing`과 `context.outputs`를 콘솔에 출력해 구조를 확인하는 실습을 설계한다.

## 연습 문제

1. `modifyConfig`가 호출되는 시점은 언제인가?
   - A. 애플리케이션이 요청을 처리할 때마다
   - B. `next.config.js` 파일을 로드하는 모든 CLI 명령에서
   - C. `onBuildComplete`가 끝난 직후에만

<details><summary>정답 보기</summary>

정답: B. `modifyConfig`는 `next.config.js`를 로드하는 모든 CLI 명령에서 호출되어 설정을 수정할 기회를 제공한다.
</details>

2. `onBuildComplete`의 `context.routing`에 포함되지 않는 것은?
   - A. `routing.dynamicRoutes` — 다이나믹 라우트 매칭 테이블
   - B. `routing.beforeFiles` — 파일시스템 라우트 매칭 전 rewrite 라우트
   - C. `context.buildId` — 현재 빌드의 고유 식별자

<details><summary>정답 보기</summary>

정답: C. `context.buildId`는 `context.routing`이 아니라 `onBuildComplete`의 `context` 최상위 필드다. `routing.dynamicRoutes`와 `routing.beforeFiles`는 모두 `context.routing`의 하위 필드다.
</details>

## 챕터 요약

- `NextAdapter` 인터페이스의 핵심 훅은 `modifyConfig`와 `onBuildComplete` 두 가지다.
- `modifyConfig(config, context)`는 `next.config.js`를 로드하는 모든 CLI 명령에서 호출되어 설정 객체를 수정할 수 있다.
- `onBuildComplete(context)`는 빌드 완료 후 호출되며 `context.routing`, `context.outputs` 등을 통해 라우팅·출력 정보를 어댑터에 전달한다.
- `context.routing`은 미들웨어 이전/이후, rewrite, 다이나믹 라우트, RSC 관련 필드로 세분화되어 있다.
- 두 훅 모두 비동기(async)로 정의되며 배포 플랫폼별 설정 조작과 빌드 후처리에 사용된다.

---

> 이미지 검증: 브라우저 확장 미연결로 wigolo fetch(images: []) 기준 판단.
