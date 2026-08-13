# instrumentation.js

- 공식 문서: [instrumentation.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 서버 instance 시작과 request error를 관측 도구에 연결한다.
- `register`, `onRequestError`, runtime별 import 계약을 이해한다.

## 핵심 개념 및 설명

`instrumentation.js|ts`는 production 성능·동작·오류를 관측 도구에 연결한다. 프로젝트 root 또는 `src`를 쓴다면 그 안에 둔다.

### `register`와 `onRequestError`

`register`는 새 Next.js server instance가 시작될 때 한 번 호출되며 요청 처리 준비 전에 완료되어야 한다. async 함수가 될 수 있다. `onRequestError(error, request, context)`는 서버가 포착한 오류를 custom provider에 보고한다. 비동기 보고는 반드시 await한다. React 처리 뒤 원본 Error가 아닐 수 있으므로 `digest`를 함께 사용한다.

```ts
import type { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  await reportError({ error, request, context })
}
```

`NEXT_RUNTIME`을 검사해 `nodejs` 또는 `edge`에 필요한 모듈만 동적으로 import할 수 있다. 다만 Edge Runtime은 현재 deprecated 상태다.

`onRequestError`의 request에는 `path`, `method`, `headers`가 들어온다. context는 `routerKind`, `routePath`, `routeType`, `renderSource`, `renderType`, `revalidateReason` 같은 실행 맥락을 제공하므로 오류를 단순 message가 아니라 어느 router·route·render 단계에서 났는지 분류할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 server start와 Route Handler 오류를 구조화 log로 남긴다.
- `digest`, routePath, routeType, renderSource를 함께 저장해 같은 오류를 연결한다.

## 연습 문제

1. `register` 호출 시점은?
   - A. 매 browser click마다
   - B. 새 server instance가 시작될 때 한 번
   - C. 모든 React render마다

<details><summary>정답 보기</summary>

정답: B. 요청을 받기 전에 instrumentation 초기화를 완료한다.
</details>

## 챕터 요약

- `instrumentation.js`는 서버 관측 도구 연결점이다.
- `register`는 server instance 시작 때 한 번 실행된다.
- `onRequestError`는 서버 오류와 요청·route context를 받는다.
- 비동기 오류 보고는 await해야 한다.
- `digest`로 처리된 서버 오류를 추적할 수 있다.
