> 이 폴더(`intent/_example/`)는 intent/spec/plan 작성 형식을 보여주는 **샘플**이다. 실제 백로그 항목이 아니다.
> 새 작업을 시작할 때 이 폴더를 형식 참고용으로 읽고, `intent/_templates/`를 복사해 `intent/<슬러그>/`를 새로 만든다.
> 필드 구성은 고정이 아니다 — 작업 종류에 맞게 소제목을 추가·삭제·통합해도 된다. 자세한 변형 규칙은 [`intent/README.md`](../README.md#샘플-변형-규칙) 참고.

Intent: 데모 허브 `?run=` 쿼리 파라미터 재검사
Author: 예시 (실제 작성자 이름으로 교체)
Status: draft
Approval: 없음 (초안)

## Problem

`nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md` 5절에 기록된 미해결 후속 항목이다.
문서별 데모 허브(`/demo/{문서 경로}`)는 연결된 공개(`done`) 데모가 하나 이상 있으면 `?run=` 값을 검증 없이 뷰어에 그대로 전달한다.
그 결과 `?run=`에 미공개(`stub`/`wip`) 데모나 해당 문서에 속하지 않는 다른 데모의 슬러그를 넣어도 그대로 재생을 시도한다.
잘못된 값만 첫 번째 항목으로 대체되고, "미공개인데 값만 유효한 형식인 경우"는 걸러지지 않는다.
근거: `nextjs-app/apps/shell/src/app/demo/[...slug]/page.tsx`의 `DemoPage` 처리 로직, 위 문서 5절.

## Proposed outcome

`?run=` 값이 (1) 해당 문서에 연결된 데모가 아니거나 (2) 공개 상태가 `done`이 아니면, 직접 `/demo/{url}` 진입과 동일하게 `DemoEmptyState`로 대체된다.
문서별 허브를 통한 진입과 직접 URL 진입의 공개·소속 검증 수준이 같아진다.

## Affected users and systems

- 사용자: 학습자(허브에서 `?run=`으로 특정 데모를 바로 열람하는 사용자), 데모 상태를 `stub`→`done`으로 전환하는 운영자
- 시스템: `nextjs-app/apps/shell/src/app/demo/[...slug]/page.tsx`(`DemoPage`), `nextjs-app/apps/shell/src/lib/demo-index.ts`, `demos-manifest.json` 소비 경로

## Constraints

- 반드시 지킬 것: 직접 `/demo/{url}` 진입 경로의 기존 동작(공개 아니면 `DemoEmptyState`)은 변경하지 않는다. `demos.yaml`을 단일 원본으로 유지하고 생성 JSON(`demos-manifest.json`)은 직접 편집하지 않는다.
- 범위 밖: 홈 추천 카드(`FeaturedDemosSection`)의 고정 목록 재검증은 별도 intent로 분리한다(같은 문서 5절의 두 번째 후속 항목).

## Open questions

- 이 샘플은 값이 지정됐지만 유효하지 않으면 `DemoEmptyState`를 표시하는 안으로 작성했다. 쿼리가 없거나 빈 문자열이면 기존 허브 목록을 유지한다. 실제 작업에서는 PO 승인 전까지 초안이다.
