Plan: 세션 만료 리다이렉트 실습 재구성 및 공개 검증
Spec: ./intent.md#requirements-spec-통합
Author: Claude
Status: done
Approval: 2026-09-18 현재 대화에서 사용자가 대상 선택 후 진행을 승인. main에서 구현·검증·커밋만 진행하며 PR/push 절차는 사용자 지시로 생략.

## Scope of change

기준 디렉토리: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/guides/redirecting/session-expired/`

- `page.tsx`: 가이드 문구를 실제 조작 단계에 맞추고, 실제 관측값을 `VerificationFooter`로 전달하는 조립 로직 추가.
- `actions.ts`: 기존 `redirect()` 유지, 필요 시 관측 가능한 상태 반환 보강.
- `login/page.tsx`: `returnUrl` searchParams를 화면에 명시적으로 표시.
- `components/RedirectSessionDemo.tsx`: 실제 이동 관측(예: 이동 완료 여부, 쿼리 값)을 상위로 전달하거나 자체적으로 표시.
- `components/VerificationFooter.tsx`: 범용 추론 제거, 전달받은 관측값 기반 판정으로 교체. `DemoDeepDiveCard` 설명을 실제 구현 범위로 정리.
- `types.ts` (필요 시 추가): 관측값 타입 공유.

연관 변경: `demos.yaml`의 해당 항목 1개, 자동 생성 `demos-manifest.json`, 이 intent 폴더와 `intent/README.md` 인덱스. `practice-page-refiner-forms-two`가 소유한 `guides/forms/` 디렉토리와 다른 실습·공유 패키지는 변경하지 않는다.

## Steps

- [x] 사용자에게 대상 선택안을 제시하고 승인받는다.
- [x] Orca로 이 디렉토리 전용 워커 1명에게 배정한다. `guides/forms/`는 별도로 활성 중인 다른 세션(Codex, run_5dc8388357f1)이 마무리했으므로 건드리지 않았다. 공통 YAML·매니페스트·커밋은 coordinator(이 세션)가 맡았다.
- [x] `login/page.tsx`에 `returnUrl` 노출을 추가하고, 실습화면과 `VerificationFooter`가 실제 이동/쿼리 관측값을 주고받도록 구현했다.
- [x] 가이드 스텝과 `DemoDeepDiveCard` 설명을 실제 구현 범위에 맞게 재작성했다.
- [x] 직접 zone URL로 열어 런타임 절차를 실행하고 관찰 결과를 기록했다(agent-browser CLI, `verification.md` 참고).
- [x] 필수 검사와 앱 빌드를 수행한 뒤 YAML 항목을 `done`으로 전환하고 매니페스트를 생성했다.
- [ ] 범위·줄 수·실제 diff를 확인하고 이번 작업 파일만 스테이징하여 커밋한다. push하지 않는다.

## Verification

명령 실행 위치는 저장소 루트다.

- `pnpm --filter @study/demo-baseline check-types`: 타입 오류 없음.
- `pnpm --filter @study/demos lint`: 등록·문서·라우트 오류 없음.
- `pnpm --filter @study/demos build`, `pnpm test:manifest`: YAML과 생성 JSON 일치.
- Next.js MCP get_errors 및 브라우저 콘솔로 런타임·hydration 오류 확인.
- 파일당 250줄 이하, git diff로 대상 외 diff 없음 확인.

브라우저: `http://localhost:3001/zone/baseline/guides/redirecting/session-expired`.

1. 초기 진입은 검증 대기 상태여야 한다.
2. [세션 만료] 클릭 → 실제 Server Action 호출 → `/login?returnUrl=%2Fcheckout`로 실제 이동, `returnUrl` 값이 로그인 화면에 표시됨을 확인.
3. 검증 패널이 이동 후 관측값 기반으로 성공 판정하는지 확인.
4. `DemoResetButton`으로 초기화 후 동일 흐름 재실행.
5. 공개 후 `http://localhost:3000/demo/guides/redirecting/session-expired`에서 가이드→실습→검증→개념 정리 흐름 확인.

## Rollback

이번 커밋만 되돌리고 이전 YAML에서 매니페스트를 재생성한다.

## Verification results

- 상태: 완료. 상세 기록은 [`verification.md`](./verification.md) 참고.
- 단위 테스트 3개, 타입 검사, 등록 lint, 매니페스트 빌드/일관성 검사(240개), baseline/shell 프로덕션 빌드 모두 통과.
- agent-browser CLI로 실제 Server Action 호출(POST 200 + `x-action-redirect` 헤더, HAR로 확인), 실제 URL 전환, returnUrl 일치/불일치 판정, 초기화, 콘솔/런타임 오류 없음, 셸 iframe 통합을 확인.
- 모바일 폭(390px) iframe 오버플로 점검은 수행하지 않았다.
