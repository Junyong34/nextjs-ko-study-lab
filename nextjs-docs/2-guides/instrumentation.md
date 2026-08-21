# Instrumentation

- 공식 문서: [Instrumentation](https://nextjs.org/docs/app/guides/instrumentation)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- instrumentation이 모니터링, 로깅, 운영 디버깅에서 맡는 역할을 설명한다.
- `instrumentation.ts`의 위치와 `register` 실행 시점을 설명한다.
- side effect와 runtime 전용 코드를 안전하게 동적 import한다.

## 핵심 개념 및 설명

instrumentation은 모니터링과 로깅 도구를 앱 코드에 연결하는 과정이다. 성능과 동작을 추적하고 프로덕션 문제를 분석할 관측 데이터를 만든다.

### 파일 규칙과 `register`

프로젝트 루트에 `instrumentation.ts` 또는 `instrumentation.js`를 만든다. `src` 구조를 사용한다면 `src` 바로 아래, `app`과 같은 깊이에 둔다. `app`이나 `pages` 안에는 두지 않는다.

`register` 함수는 새 Next.js 서버 인스턴스가 시작될 때 한 번 호출되며 요청을 처리하기 전에 끝나야 한다.

```ts filename="instrumentation.ts"
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

> **알아두면 좋은 점**:
>
> - `src`를 쓴다면 `src/instrumentation.ts`로 두고 `src/app` 또는 `src/pages`와 나란히 배치한다.
> - `pageExtensions`에 suffix를 추가했다면 instrumentation 파일명도 같은 규칙에 맞춘다.

### side effect가 있는 파일 불러오기

전역 변수 등록처럼 import 자체가 필요한 코드는 `register` 안에서 동적으로 불러온다.

```ts filename="instrumentation.ts"
export async function register() {
  await import('package-with-side-effect')
}
```

> **알아두면 좋은 점**: 파일 최상단의 전역 import보다 `register` 내부 import를 권장한다. 서버 시작 side effect를 한곳에 모으고 예상하지 못한 전역 실행을 줄일 수 있다.

### runtime별 코드 분리

Next.js는 모든 runtime에서 `register`를 호출한다. Node.js 전용 패키지를 Edge Runtime에서 불러오지 않도록 `NEXT_RUNTIME`을 확인한 뒤 조건부 import한다.

```ts filename="instrumentation.ts"
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}
```

전체 파일 규약과 추가 hook은 [`instrumentation.js` API 문서](../3-api-reference/3.1-file-conventions/instrumentation.md)에서 확인한다.

## 예제 및 데모 설계

- Phase 2에서 서버 시작 시 한 번 기록되는 로그와 요청마다 기록되는 로그를 구분한다.
- Node.js와 Edge용 모듈을 나누고 `NEXT_RUNTIME`에 따라 하나만 import되는지 확인한다.
- `@vercel/otel`을 등록한 뒤 로컬 collector에서 서버 trace가 생성되는지 검사한다.

## 연습 문제

1. `instrumentation.ts`를 둘 올바른 위치는 어디인가?

   1. `app/components` 안
   2. 프로젝트 루트 또는 `src`를 쓸 때 `src` 바로 아래
   3. `public` 안
   4. `.next` 안

   <details><summary>정답 보기</summary>

   **정답: 2**. instrumentation 파일은 `app`이나 `pages` 내부가 아니라 이들과 나란한 루트에 둔다.

   </details>

2. Node.js 전용 instrumentation 모듈을 안전하게 불러오는 조건은 무엇인가?

   1. `process.env.NEXT_RUNTIME === 'nodejs'`
   2. `window !== undefined`
   3. `process.env.NODE_ENV === 'test'`
   4. `document.readyState === 'complete'`

   <details><summary>정답 보기</summary>

   **정답: 1**. 현재 runtime을 확인한 뒤 Node.js 전용 코드를 동적으로 import한다.

   </details>

## 챕터 요약

- instrumentation은 모니터링과 로깅 도구를 연결해 운영 상태를 추적한다.
- `register`는 새 서버 인스턴스 시작 시 한 번 실행되고 요청 처리 전에 끝나야 한다.
- 파일은 프로젝트 루트 또는 `src` 루트에 둔다.
- side effect import는 `register` 내부에 모으는 편이 안전하다.
- runtime 전용 코드는 `NEXT_RUNTIME` 조건으로 나눠 불러온다.
