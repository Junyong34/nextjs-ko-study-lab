Plan: 폼 실습 두 개 재구성 및 공개 검증
Spec: ./spec.md
Author: Codex
Status: done
Approval: 2026-09-17 현재 대화에서 계획 검토 요청 후 사용자가 “이어서 작업 진행”으로 승인. main에서 구현·검증·커밋만 진행하며 PR/push 절차는 사용자 지시로 생략.

## Scope of change

기준 디렉토리: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/forms/`

두 대상 `use-action-state-errors/`, `use-form-status-spinner/` 각각:
- page.tsx: 메타데이터 및 조립 유지, 가이드를 실제 조작 단계에 맞춤.
- actions.ts (추가): 실제 서버 검증과 직렬화 응답.
- types.ts (추가): 결과 상태·필드 오류·관측값 타입.
- components/FormValidationDemo.tsx 또는 FormStatusDemo.tsx: 실제 액션 연결, reset, 학습 시나리오 UI.
- components/VerificationFooter.tsx: 범용 추론 제거, 명시적인 관측값 판정과 실습 기반 개념 정리.
- components/SubmitButton.tsx (필요 시 추가): useFormStatus 자식 구독 분리.

연관 변경: demos.yaml 대상 두 항목, 자동 생성 demos-manifest.json, 이 intent 폴더와 인덱스. 다른 실습과 공유 패키지는 변경하지 않는다.

## Steps

- [x] 사용자에게 두 실습의 intent/spec/plan 초안을 검토받고 승인 범위를 기록한다. main·커밋만 지시에 따라 별도 PR을 만들지 않는다.
- [x] Orca로 각 페이지의 작업을 배정하되 파일 소유권을 두 디렉토리로 나눈다. 공통 YAML·매니페스트·커밋은 coordinator가 맡는다.
- [x] useActionState 페이지에 실제 서버 액션, 필드별 오류, 유효 입력 성공, 초기화 및 응답 기반 검증을 구현한다.
- [x] useFormStatus 페이지에 실제 서버 액션, form 자식의 pending/data, 폼 밖 비교, 서버 결과와 관측 이력 검증을 구현한다.
- [x] 두 페이지를 직접 zone URL로 열어 아래 런타임 절차를 실행하고 관찰 결과를 기록한다.
- [x] 필수 검사와 앱 빌드를 수행한 뒤 두 YAML 항목을 done으로 전환하고 매니페스트를 생성한다. 셸 직접 URL에서도 학습 흐름을 재확인한다.
- [x] 범위·줄 수·실제 diff를 확인하고 이번 작업 파일만 스테이징하여 `[main][feat]: 폼 실습 두 개의 서버 동작과 학습 검증 개선` 형식으로 커밋한다. push하지 않는다.

## Verification

명령 실행 위치는 저장소 루트다.

- `pnpm --filter @study/demo-baseline check-types`: 타입 오류 없음.
- `pnpm --filter @study/demos lint`: 등록·문서·라우트 오류 없음, 경고 개별 검토.
- `pnpm --filter @study/demos build`, `pnpm test:manifest`: YAML과 생성 JSON 일치.
- `pnpm --filter @study/demo-baseline build`: 프로덕션 빌드 확인. 셸 공개 변경을 검증하기 위해 `pnpm --filter @study/shell build`도 수행.
- ESLint는 현재 zone package.json에 명령이 없다. 저장소의 실제 설정/도구 유무를 확인하고 실행 불가하면 미검증으로 명시하며 새 의존성·규칙 변경으로 숨기지 않는다.
- Next.js MCP get_errors 및 브라우저 콘솔로 런타임·hydration 오류 확인.
- 파일당 250줄 이하, git diff --check, 대상 외 diff 없음 확인.

브라우저: `http://localhost:3001/zone/baseline/guides/forms/{대상}`.

1. 초기 진입은 검증 대기여야 한다.
2. useActionState: 이메일 invalid-email, 수량 0 제출 → 실제 POST와 두 필드 오류. customer@example.com, 수량 2로 재제출 → 실제 성공 응답과 오류 제거. 잘못된 입력에서 성공 기대가 통과하지 않는지 확인.
3. useFormStatus: 제출 → 실제 POST 처리 중 자식 pending=true, 버튼 disabled, 제출 data 표시, 폼 밖 pending=false. 응답 뒤 pending=false·버튼 활성화. 서버 거절 입력에서도 pending 종료와 주문 성공은 구분. 관찰 미완료 상태가 검증 완료로 표시되지 않는지 확인.
4. 초기화 → 결과·이력·검증 대기 복귀 → 동일 흐름 재실행.
5. 공개 후 `http://localhost:3000/demo/guides/forms/{대상}`에서 가이드→실습→검증→개념 정리와 iframe 표시 확인.

## Rollback

이번 커밋만 되돌리고 이전 YAML에서 매니페스트를 재생성한다. 기존 미커밋 파일과 다른 작업 커밋은 보존한다.

## Verification results

구현 및 검증 완료. 상세 명령·환경·관찰 결과·제약은 [verification.md](./verification.md)에 기록했다.

- 단위 테스트 8개, 타입 검사, baseline·shell 빌드, 등록 lint·매니페스트·두 페이지 가이드 검사 통과.
- useActionState 직접 POST 8건, useFormStatus 직접 POST 6건, 셸 iframe 제출·초기화 확인.
- 제출 ID 버그와 모바일 코드 블록 가로 넘침을 런타임 검사에서 발견해 수정.
- ESLint는 프로젝트에 실행 환경이 없어 미실행. 기존 경고와 프로덕션 배포 미실행은 결과 기록에 구분.
- main에서 이번 두 실습만 커밋한다. PR·push는 사용자 지시로 생략하며 done은 해당 로컬 완료 범위다.
