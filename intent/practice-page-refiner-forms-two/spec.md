Spec: 폼 실습 두 개의 실제 서버 동작과 검증
Intent: ./intent.md
Author: Codex
Status: done
Approval: 2026-09-17 현재 대화에서 계획 검토 요청 후 사용자가 “이어서 작업 진행”으로 승인. main에서 구현·검증·커밋만 진행하며 PR/push 절차는 사용자 지시로 생략.

## Requirements

1. 실제 actions.ts의 `use server` 함수로 폼을 제출한다. 이메일은 기본 형식, 수량은 정수 1~10을 서버에서 검사하고 필드별 오류를 함께 반환한다.
2. useActionState는 idle/error/success 결과와 제출값을 표시한다. 잘못된 이메일·수량과 유효한 입력을 비교한다. 브라우저 내장 검증이 서버 오류 관찰을 가로막지 않도록 noValidate의 학습 목적을 설명한다.
3. useFormStatus는 form 안의 자식 컴포넌트에서 pending/data를 읽는다. 폼 밖 관측값과 비교하여 구독 범위를 보인다. 성공과 서버 검증 거절 모두 pending 종료와 구분한다.
4. 검증 패널은 응답과 실제 훅 관측값으로 판정한다. 제출 전 대기, 학습 목표 미충족 시 실패, 요구되는 관측 충족 시 성공. ExpectedActualPanel의 undefined 자동 비교를 피하도록 초기 상태는 공통 API가 지원하는 대기 표현을 사용한다. 응답 성공만으로 pending 관찰까지 성공 처리하지 않는다.
5. 가이드와 개념 정리는 실제 입력·버튼·응답에 연결한다. 상태 초기화로 응답·관측 이력을 비운 뒤 같은 흐름을 재실행한다.
6. HTML label 연결과 오류 안내를 제공한다. pending 표시와 오류/완료 메시지는 접근 가능한 텍스트로도 읽을 수 있어야 한다.

## Design

각 page.tsx는 서버 메타데이터와 상위 조립을 맡는다. 각 실습의 클라이언트 조립 컴포넌트가 실습·검증의 공통 상태를 소유하고, VerificationFooter에 구체 타입의 응답과 관측값을 전달한다. actions.ts는 서버 검증과 직렬화 가능한 결과 반환을 맡고 types.ts는 타입만 공유한다. 폼 상태 훅 자체를 타이머나 임의 성공 플래그로 대신하지 않는다.

useActionState 검증은 오류/성공 시나리오별 기대 필드와 실제 반환값을 비교한다. useFormStatus 검증은 제출 중 관찰한 pending 및 data, 완료 후 서버 결과와 pending=false를 함께 비교한다. 관측 이력은 실제 훅 상태에서만 기록한다.

## Non-goals

실제 결제·이메일 발송, 캐시 실습, 공유 컴포넌트 수정, 의존성·lint 설정 변경, 프로덕션 배포.

## Acceptance criteria

- [x] 실제 POST Server Action과 서버 응답을 확인한다.
- [x] 잘못된 이메일·수량의 필드 오류 및 유효한 입력의 성공 결과를 관찰한다.
- [x] pending 중 버튼 비활성화·제출 data, 완료 후 유휴 복귀를 확인한다.
- [x] 검증 패널이 성공과 미충족을 구분하며 초기화 뒤 대기로 돌아간다.
- [x] 콘솔·런타임·hydration 오류를 확인하고 타입·빌드·매니페스트 검사를 수행한다.
- [x] 완료 증거가 확보된 두 항목만 done으로 변경하며 main에서 커밋한다.

## Open questions

없음. 사용자 후속 진행 지시로 구현 착수를 승인받았다.
