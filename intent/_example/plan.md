> 샘플 문서. [`intent.md`](./intent.md) 상단 안내 참고.

Plan: 데모 허브 `?run=` 쿼리 파라미터 재검사
Spec: ./spec.md
Author: 예시 (실제 작성자 이름으로 교체)
Status: draft
Approval: 없음 (초안)

## Scope of change

- `nextjs-app/apps/shell/src/app/demo/[...slug]/page.tsx` — `DemoPage`의 `?run=` 처리 로직
- 관련 라우트 테스트 파일 — 실제 작업 착수 시 경로를 확인해 기입
- `nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md` — 해결된 후속 항목과 확인 범위

## Steps

1. `DemoPage`에서 `?run=` 값을 소비하는 지점을 찾고, 현재 연결된 데모 목록과 상태를 어디서 계산하는지 확인한다.
2. `?run=` 값이 연결 목록의 `done` 슬러그와 일치하지 않으면 `DemoEmptyState`를 렌더링하도록 분기한다.
3. 쿼리가 없거나 빈 문자열인 경우 기존 허브 목록을 유지한다. 지정됐지만 존재하지 않는 값은 빈 상태로 처리한다.
4. 구현 후 공개 운영 가이드의 후속 항목을 실제 검증 결과에 맞춰 갱신한다.

## Verification

- 테스트: 해당 라우트/컴포넌트의 기존 테스트에 spec의 완료 기준(정상/미공개/미소속/존재하지 않음/쿼리 없음·빈 문자열/직접 진입 유지)를 추가한다.
- 수동 확인: 저장소 루트에서 `pnpm dev`로 실행 후 `demos.yaml`에서 상태가 다른 데모 3종(연결+done, 연결+stub, 미연결+done)의 슬러그로 `?run=` 값을 바꿔가며 확인한다.

테스트 파일과 실행 명령은 실제 plan 승인 전에 확정한다. 이 샘플은 실행 가능한 승인 계획이나 검증 기록이 아니다.

## Verification results

- 상태: 미실행 (샘플)
- 실제 작업에서는 실행 명령·환경, 각 완료 기준의 결과, PR 또는 로그 링크와 남은 미검증 항목을 기록한다.

## Rollback

`DemoPage`의 분기 추가분만 되돌리면 이전 동작(검증 없이 전달)으로 복귀한다. 데이터 마이그레이션이 없으므로 되돌리기 위험은 낮다.
