# 폼 실습 두 개 검증 기록

검증 환경: 2026-09-17~18, main 작업공간, Next.js 16.3.2 / React 19.2.8 / Node 22.14.0, Chromium 1223 + Playwright 1.60.0. 프로젝트 의존성은 추가하지 않고 설치되어 있던 브라우저 도구를 사용했다.

## 판정과 기존 평가

두 페이지 모두 REBUILD. 외형의 4단 공통 UI는 유지하고 실제 서버 처리·검증 연결을 재구성했다. 가이드/실습/검증/개념 정리 모두 수정 필요였으며 구체적인 근거는 intent.md에 기록했다.

기존 useActionState 화면을 실제 브라우저로 제출했을 때 오류 문구는 나타났지만 POST는 0건이었다. 검증 배지는 불일치이며 실제 설명은 대기 문구에 머물렀다. 재구성 후 동일 흐름에서 실제 Next-Action POST와 응답값을 관찰했다.

## 공식 근거와 자산

next-devtools nextjs_docs로 설치 버전 16.3.2 및 번들 문서 `node_modules/next/dist/docs/01-app/02-guides/forms.md`를 확인했다. Validation errors / Pending states 절의 실제 Server Action, (previousState, formData), state 반환, 자식 useFormStatus 배치를 적용했다. nextjs_index와 nextjs_call(get_project_metadata)은 3001이 해당 baseline 앱임을 확인했다.

DemoContainer, DemoGuideCard, DemoPlaygroundCard, ExpectedActualPanel, DemoDeepDiveCard, DemoResetButton과 MOCK_PRODUCTS를 재사용했다. 폼 훅 학습에 필요하지 않은 장바구니·배송 추적 UI는 추가하지 않았다. 데이터는 예시 상품이며 결제·주문 영구 저장·메일 발송은 하지 않는다. useFormStatus 액션의 1.2초 지연은 관측용이며 서버 요청과 React 훅은 실제로 동작한다.

## 자동 검증

저장소 루트에서 실행:

```sh
node --experimental-strip-types --disable-warning=ExperimentalWarning --test nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/forms/use-action-state-errors/*.test.mjs nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/forms/use-form-status-spinner/*.test.mjs
pnpm --filter @study/demo-baseline check-types
pnpm --filter @study/demo-baseline build
pnpm --filter @study/shell build
pnpm --filter @study/demos lint
pnpm --filter @study/demos build
pnpm test:manifest
```

- 단위 테스트: 8개 통과. 이메일·수량의 누락/파일/잘못된 형식/정수/범위 경계, 오류→성공→재오류 상태 교체, 실제 반환값의 필드 집합·입력 일치, 관측 누락·이전 응답·잘못된 disabled·폼 밖 pending 등 실패 조건 검사.
- 타입 검사 통과.
- baseline 프로덕션 빌드 통과. 기존 Edge Runtime deprecated 경고와 window 접근 학습 데모의 의도된 로그는 변경 범위 밖이다.
- 등록 lint 통과. 기존 캐시 태그 접두사 경고 24개는 변경 범위 밖이다.
- 매니페스트 생성 및 등록/라우트 검사 240개 통과.
- 대상 두 페이지 guide-consistency 검사: violations 각각 0개.
- Node strip-types 실행은 기존 package.json의 모듈 형식 미지정 경고가 있다. 이 작업 때문에 프로젝트 설정을 변경하지 않았다.
- baseline에 ESLint 실행 스크립트·설정·의존성이 없어 ESLint 자체는 미실행. 등록 lint 및 타입 검사와 구분한다.

## 브라우저 검증

직접 zone URL:
- http://localhost:3001/zone/baseline/guides/forms/use-action-state-errors
- http://localhost:3001/zone/baseline/guides/forms/use-form-status-spinner

useActionState: 초기 대기 → 기본 오류 2개 → 유효 입력 성공 및 오류 제거 → 성공 기대에 오류 응답을 제출해 불일치 → 기대 시나리오를 오류로 바꾸어 일치 → 수량 1.5/빈 값/11/0 거절 → 초기화 → 재실행. POST 8건 모두 HTTP 200 및 Next-Action 헤더 확인, 콘솔 error/pageerror 없음. 오류 응답의 HTTP 200은 폼 입력 성공과 별개이며 반환 status/errors로 구분한다.

useFormStatus: 정상 수량 2 → 0 및 1.5 서버 거절 → 3으로 다시 성공 → 입력 스냅샷과 실제 요청의 불일치를 만들어 검증 실패 확인 → 초기화 → 정상 재실행. POST 6건 모두 HTTP 200 및 Next-Action 헤더 확인, 콘솔 error/pageerror 없음. 매 제출 pending=false→true→false, 처리 중 disabled=true 및 제출 data, 폼 밖 pending=false, 종료 뒤 버튼 활성화를 확인했다. 정상 처리 중 배지는 대기, 완료 후 조건 미충족은 불일치다.

회귀 검증 스크립트:

```sh
PLAYWRIGHT_MODULE=/path/to/existing/playwright node nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/forms/use-form-status-spinner/browser-check.cjs
```

BASE_URL 환경변수는 기본 http://localhost:3001. 별도 서버를 먼저 실행해야 한다. 서버 응답은 mock하지 않는다. 식별자 변경 전 버전에서는 검증 완료를 기다리다 실패했고, 수정 후 반복 제출·실패 판정·초기화가 통과했다.

## 런타임에서 발견해 수정한 문제

onSubmitCapture 안에서 hidden requestId를 바꾸면 React가 처리하는 FormData에는 빈 식별자가 실렸다. 실제 multipart 본문과 서버 errors.requestId로 원인을 확인했다. 다음 식별자를 렌더 시점에 준비하고, 관측에는 이미 렌더된 입력을 읽도록 변경했다. 단위 검증 통과만으로 이 문제를 발견할 수 없었으며 실제 브라우저 POST 검증이 필요했다.

## Orca 실행 기록

- 조사 Run: run_9bf8c7ad2aa3 / Task task_b9a9c4888bd3
- 구현 Run: run_5dc8388357f1
- useActionState: task_fb8cdf96272d / ctx_a95497adb214
- useFormStatus: task_3d0dd9a07da8 / ctx_245582efe021
- 최종 읽기 전용 리뷰: task_ed2ec49ada80 / ctx_9d502457a3f8

## 셸·모바일·최종 리뷰

- 셸 프로덕션 빌드 통과.
- `http://localhost:3000/demo/guides/forms/use-action-state-errors` 및 `use-form-status-spinner`에서 4단 iframe, 초기 대기, 실제 프록시 POST 200, 검증 완료, 초기화 후 대기 복귀 확인. pageerror 없음.
- 390px 모바일 셸 안의 356px iframe을 검사했다. 코드 블록의 최소 콘텐츠 폭으로 가로 넘침이 생기는 문제를 두 페이지의 DemoDeepDiveCard에 min-w-0을 지정해 수정했다. 수정 후 iframe scrollWidth/clientWidth가 356/356으로 일치했다.
- Orca 읽기 전용 최종 리뷰: 중요 버그 없음. 단위 테스트는 DOM 제출 이벤트 순서를 검증하지 못하므로 위 실제 브라우저 검증을 완료 근거에 함께 남겼다.

## 남은 사항

ESLint는 기존 실행 환경 부재로 미실행이며 타입·등록 lint·빌드·런타임 검사로 대체했다고 혼동하지 않는다. 기존 캐시 태그 lint 경고 24개와 Edge Runtime 경고는 범위 밖이다. 배포/프로덕션 서버 검증은 이번 요청 범위가 아니며 수행하지 않았다.
