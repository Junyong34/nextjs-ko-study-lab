Intent: 폼 실습 stub 두 개의 학습 흐름 재구성 및 공개
Author: Codex
Status: done
Approval: 2026-09-17 현재 대화에서 계획 검토 요청 후 사용자가 “이어서 작업 진행”으로 승인. main에서 구현·검증·커밋만 진행하며 PR/push 절차는 사용자 지시로 생략.

## Problem

`guides/forms/use-action-state-errors`와 `guides/forms/use-form-status-spinner`는 demos.yaml에서 stub이다. 전자는 Client Component 내부 비동기 함수를 Server Action이라고 설명하고, 필드별 오류 객체 대신 단일 error 문자열을 반환한다. 후자는 실제 useFormStatus를 사용하지만 서버 요청 없이 브라우저 지연 함수로 결제 성공을 만든다. 두 VerificationFooter는 실제 실습 상태를 받지 않는다. 대기 설명을 표시하지만 ExpectedActualPanel의 문자열 자동 비교로 배지는 불일치가 되고, 제출 후에도 갱신되지 않는다.

| 영역 | useActionState | useFormStatus |
|---|---|---|
| 가이드 | 수정 필요: 실제 구현과 Server Action·필드 오류 설명 불일치 | 수정 필요: 입력할 주문자·배송지 필드가 없음 |
| 실습화면 | 수정 필요: 실제 Server Action·필드별 오류·초기화 필요 | 수정 필요: 서버 액션 대신 로컬 지연·성공 메시지 사용 |
| 검증 | 수정 필요: 관측값 미전달 | 수정 필요: pending·서버 응답 미전달 |
| 개념 정리 | 수정 필요: 구현에 없는 Zod·우편번호 설명 | 수정 필요: 버튼 비활성화만으로 중복 결제 원천 차단 주장 |

두 페이지 모두 브라우저의 실제 폼 제출, POST 요청, 반환 상태를 관찰할 수 있어 EXPLANATION보다 REBUILD가 적합하다. 기존 4단 구성과 공통 UI는 유지한다.

## Proposed outcome

- useActionState: 잘못된 이메일·수량 제출 → 서버의 필드별 오류 관찰 → 올바른 입력으로 재제출 → 성공 응답 비교를 통해 `(prevState, formData)`와 반환 state의 관계를 이해한다.
- useFormStatus: 예시 상품 주문 제출 → 자식 버튼의 pending·disabled·제출 data 관찰 → 서버 응답 뒤 유휴 상태 복귀를 통해 부모 form 구독 범위를 이해한다.
- 두 페이지는 실제 상태 기반 성공·실패 검증과 초기화 후 재실행을 제공하며 검증 통과 후 두 YAML 항목만 done으로 바꾸고 매니페스트를 재생성한다.

## Affected users and systems

- 사용자: React 19 폼 훅과 Next.js Server Actions를 학습하는 사용자.
- 시스템: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/forms/`의 지정된 두 디렉토리, `nextjs-app/packages/demos/demos.yaml`, 생성 매니페스트.
- 기존 미승인 `../practice-page-refiner-forms-cache/intent.md`에서 폼 두 항목만 별도 제안한다. 캐시 세 항목은 이번 작업에 포함하지 않는다. 기존 초안의 승인·변경을 뜻하지 않는다.

## Constraints

- 사용자 지시: main에서 작업하고 커밋만 한다. 새 브랜치·PR·push 없음.
- 구현 범위: 지정된 두 실습 디렉토리. 공개 상태 YAML·생성 JSON과 intent 기록은 요청 이행을 위한 동기화 범위다.
- Next.js 16.3.2 / React 19, 신규 의존성 없음, 파일당 250줄 이하.
- DemoContainer / DemoGuideCard / DemoPlaygroundCard / ExpectedActualPanel / DemoDeepDiveCard / DemoResetButton 재사용.
- MOCK_PRODUCTS의 상품 정보 재사용. ProductCard는 상품 소개가 필요할 때 사용 가능. 장바구니 합계·배송 추적은 주제에 필요하지 않아 CartSummary·DeliveryTracker 추가 없음.
- 실제 결제·메일 발송·영구 주문 저장을 주장하지 않는다. 관찰용 지연을 넣으면 실제 Server Action 내부에만 두고 화면에 목적을 명시한다.
- 상태가 변했다는 이유만으로 검증 성공을 만들지 않는다. 기대 조건과 실제 응답·관측값을 비교한다.

## Evidence

2026-09-17 next-devtools nextjs_docs: 설치된 Next.js 16.3.2, 번들 문서 `nextjs-app/apps/demo-baseline/node_modules/next/dist/docs/01-app/02-guides/forms.md`의 Validation errors / Pending states 확인. 공식 문서 URL: https://nextjs.org/docs/app/guides/forms
nextjs_index로 3000/3001/3002 서버 확인, nextjs_call(get_project_metadata, 3001)로 이 저장소의 demo-baseline 확인. 실행 동작의 검증 결과는 아직 아니다.
Orca Run: run_9bf8c7ad2aa3 / 읽기 전용 검토 Task: task_b9a9c4888bd3.

## Open questions

- 없음. 두 항목의 intent/spec/plan은 사용자 후속 진행 지시로 승인됐다.
