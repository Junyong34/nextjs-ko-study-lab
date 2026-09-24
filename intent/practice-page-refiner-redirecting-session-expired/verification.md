# 세션 만료 리다이렉트 실습 검증 기록

검증 환경: 2026-09-18, main 작업공간, Next.js 16.3.2 / React 19, Node 22.14.0, agent-browser(Chromium) 0.27.0. 프로젝트 의존성은 추가하지 않고 설치되어 있던 CLI 도구를 사용했다.

## 판정과 기존 평가

IMPROVE. `actions.ts`의 `redirect()` 호출 자체는 이미 실제로 동작해 REBUILD가 필요하지 않았다. 문제는 (1) `VerificationFooter`가 `page.tsx`에서 어떤 props도 전달받지 못해 검증 판정이 항상 죽어 있던 것, (2) 가이드·개념 정리 문구가 "307 즉시 리다이렉트"를 주장했지만 실제로는 Server Action + JS 활성 환경의 클라이언트 사이드 전환이라는 점이었다. 두 문제 모두 국소 수정으로 해결했다. 자세한 근거는 `intent.md`에 기록했다.

## 공식 근거

next-devtools MCP가 가리키는 `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`(next@16.3.2)의 "Good to know"를 직접 확인했다: Server Action에서 `redirect()`는 JS 활성 시 클라이언트 사이드 전환, JS 비활성 폼 제출 시 303, 그 외 컨텍스트(Server Component 렌더링/Route Handler)에서만 307. 이 데모는 클라이언트 컴포넌트가 `startTransition`으로 Server Action을 호출하므로 첫 번째 경우에 해당한다. `DemoContainer`/`DemoGuideCard`/`DemoPlaygroundCard`/`ExpectedActualPanel`/`DemoDeepDiveCard`/`DemoResetButton`을 재사용했다. 새 dependency는 추가하지 않았다.

## 자동 검증

저장소 루트에서 실행:

```sh
node --experimental-strip-types --test nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/redirecting/session-expired/verification.test.mjs
pnpm --filter @study/demo-baseline exec tsc --noEmit --incremental false
pnpm --filter @study/demos lint
pnpm --filter @study/demos build
pnpm test:manifest
```

- 단위 테스트: 3개 통과. 대기 상태(undefined/빈 값), 기대 `returnUrl` 정확히 일치, 유사·오타·외부 도메인 등 불일치 케이스를 검사한다.
- 타입 검사 통과(출력 없음, exit 0).
- 등록 lint 통과. 기존 캐시 태그 접두사 경고 24건은 변경 범위 밖(demo-cache-components).
- 매니페스트 생성 및 등록/라우트 검사 240개 통과(done 128 / stub 112).
- `guides/forms/**`, 다른 실습, 공유 패키지는 git diff로 미변경 확인.

ESLint는 baseline 패키지에 실행 스크립트가 없어 미실행이며, 이를 타입 검사·등록 lint로 대체했다고 혼동하지 않는다. baseline/shell 프로덕션 빌드는 이후 실행해 통과했다 — 아래 "프로덕션 빌드" 참고.

## 브라우저 검증 (agent-browser CLI)

직접 zone URL: `http://localhost:3001/zone/baseline/guides/redirecting/session-expired`

1. 초기 진입: 검증 패널이 "대기 중"(중립, 배지 없음) 상태로 렌더링됨을 확인.
2. `[세션 만료 시뮬레이션]` 클릭 → `network requests` 캡처로 `POST /zone/baseline/guides/redirecting/session-expired`가 실제로 **200**을 반환함을 확인(307이 아님 — 이번 수정의 핵심 검증 포인트). 브라우저 URL이 실제로 `/session-expired/login?returnUrl=%2Fcheckout`로 전환됨을 확인.
3. 로그인 화면: "로그인 후 돌아갈 경로(returnUrl): /checkout" 표시 확인, 검증 패널이 "검증 완료"(녹색)로 판정됨을 확인.
4. 불일치 케이스: `?returnUrl=%2Forders`로 직접 진입 → 검증 패널이 "불일치"(빨강)로 판정됨을 확인 — 항상 성공하는 가짜 검증이 아님을 확인.
5. `/session-expired`로 복귀 후 `[예제 초기화]`(`DemoResetButton`, ref 기반 클릭) → 상태가 "결제 진행 중"으로 복귀함을 확인.
6. `agent-browser console`/`errors`로 콘솔·페이지 오류, hydration 경고 없음을 확인(HMR/Fast Refresh 로그만 존재).

`agent-browser network har start/stop`으로 HAR을 캡처해 응답 헤더를 직접 확인했다:

```
POST http://localhost:3001/zone/baseline/guides/redirecting/session-expired -> 200
  req header: next-action = 0087467eedea338ab633cae7caaa4893e84cd71279
  res header: x-action-redirect = /zone/baseline/guides/redirecting/session-expired/login?returnUrl=%2Fcheckout;push
```

307이 아니라 200 + `x-action-redirect` 헤더 + `;push`(클라이언트 라우터 push 지시)임을 실제 HAR로 확인했다 — 문서·코드 경로 근거에 이어 HTTP 레벨 증거까지 확보됐다.

## 셸 iframe 확인

`http://localhost:3000/demo/guides/redirecting/session-expired`을 agent-browser로 열어 스크린샷으로 확인: 4단 레이아웃이 셸 크롬(헤더/사이드바/문서 브레드크럼) 안에 정상 렌더링되고, "Redirecting 예제 목록" 2개 중 2번째("다음 예제" 비활성, "이전 예제"로 order-complete 이동 가능)로 올바르게 연결됨을 확인. 콘솔 오류 없음(`agent-browser errors`).

## 프로덕션 빌드

```sh
pnpm --filter @study/demo-baseline build   # ✓ Compiled successfully in 2.1s, exit 0
pnpm --filter @study/shell build           # ✓ Compiled successfully in 3.7s, exit 0
```

baseline 빌드 로그의 `window is not defined` 로그는 `guides/use-client-window-storage-access` 등 다른(범위 밖) 데모가 의도적으로 보여주는 서버 렌더링 시점 `window` 접근 예시이며 오류가 아니다. Edge Runtime deprecated 경고도 기존 범위 밖 라우트에서 발생한다.

## 남은 사항

- 모바일 폭(390px) iframe 오버플로 점검은 수행하지 않았다.
