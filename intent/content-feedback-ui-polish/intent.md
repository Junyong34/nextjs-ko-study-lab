Intent: 문서 하단 피드백 위젯(ContentFeedback) UI 개선과 버튼 포인터 커서
Author: Claude (AI 초안 — 사용자 승인 전)
Status: approved
Approval: 2026-10-06 사용자가 intent 초안 확인 후 "단계 3 (구현): 바로 구현"을 선택해 plan 작성·승인 단계를 생략하고 구현하도록 명시 지시. 이 기록은 PR 머지 승인이 아니라 대화상 지시이며, 열린 질문은 아래 기본 제안으로 확정됨. PR 미머지로 done 아님

## Problem

문서 하단의 "이 문서가 도움이 되었나요?" 위젯이 투박하고, 버튼인지 알아보기 어렵다는 사용자 피드백이 있다 (2026-10-06).

- 위젯은 `legend`가 테두리를 가르는 기본 `fieldset` 모양에, 텍스트만 있는 두 버튼(`도움 됐어요` / `부족해요`)과 회색 안내 문구가 전부다. 아이콘·시각적 위계가 없어 [DESIGN.md](../../DESIGN.md)의 버튼·카드 패턴과도 결이 다르다.
- 버튼에 마우스를 올려도 손가락(pointer) 커서가 나오지 않는다. 현재 `ContentFeedback.tsx`의 버튼 클래스에 `cursor-pointer`가 없고, 공통 `Button` 프리미티브(`packages/ui/src/primitives/Button.tsx`)와 `globals.css`에도 버튼 커서 규칙이 없다. Tailwind v4 preflight는 버튼 커서를 `default`로 두므로 이것이 원인으로 추정된다(plan 단계에서 브라우저로 확인).
- 응답 후에는 두 버튼이 모두 `disabled`가 되어 흐려지고, 선택된 쪽이 어느 것인지 `aria-pressed` 스타일(옅은 테두리·배경)만으로 구분된다.

근거: `nextjs-app/apps/shell/src/components/analytics/ContentFeedback.tsx`, `nextjs-app/apps/shell/src/app/[...slug]/page.tsx:112`(README.md 제외 모든 문서 페이지 하단에 표시).

## Proposed outcome

문서 하단 피드백 위젯이 DESIGN.md의 시각 언어(zinc 중심, 얇은 경계, `rounded-xl`, lucide 아이콘)에 맞는 완성도 있는 UI가 되고, 응답 가능한 버튼은 호버 시 pointer 커서와 hover·focus·active 상태로 "누를 수 있는 버튼"임이 분명해진다. 응답 후에는 선택 결과가 명확히 보인다.

## Affected users and systems

- 사용자: 학습 문서를 읽고 하단에서 피드백을 남기는 학습자
- 시스템: `nextjs-app/apps/shell/src/components/analytics/ContentFeedback.tsx` (UI만). 응답 저장·GA 전송 로직(`lib/analytics/feedback.ts`, `payload.ts`, `transport.ts`)과 `content_feedback` 이벤트 계약은 변경하지 않는다.

## Constraints

- 반드시 지킬 것:
  - 동작 유지: 탭 세션당 문서별 1회 응답, `sessionStorage` 키 `study_content_feedback_v1`, `content_feedback` 이벤트의 `rating` 값(`helpful`/`unhelpful`)은 그대로다.
  - DESIGN.md 규칙: 라이트·다크 모드 동시 구현, `hover`·`focus-visible`·`active`·`disabled` 구분, 아이콘은 `lucide-react`(장식이면 `aria-hidden`), 색만으로 상태를 전달하지 않는다. 토글 버튼은 `aria-pressed`, 상태 안내는 `role="status"`를 유지한다.
  - 모바일(약 400px)에서 가로 넘침이 없어야 한다. 파일은 250줄 이하.
  - 새 디자인 토큰 이름을 만들지 않는다.
- 범위 밖:
  - 자유 의견 입력, 재응답(응답 변경), 서버 저장 등 기능 추가.
  - GA 이벤트 스키마 변경.
  - 앱 전체 버튼의 커서 일괄 변경(아래 Open questions 1번에서 결정).

## Requirements

<!-- 작은 범위 변경이라 spec을 intent에 통합한다. PO 승인 전에는 제안안이다. -->

1. 위젯 레이아웃을 개선한다: 질문 제목과 보조 설명을 위계 있게 배치하고, 버튼 2개를 균등한 크기의 큰 터치 영역(최소 44px 높이)으로 나란히 둔다. 모바일에서는 줄바꿈 또는 세로 쌓임을 허용한다.
2. 각 버튼에 아이콘을 추가한다(예: `ThumbsUp` / `ThumbsDown`, lucide-react). 아이콘은 장식이므로 `aria-hidden`이고 텍스트 라벨은 유지한다.
3. 응답 가능한 버튼은 `cursor-pointer`를 갖고, hover(경계 강화+배경), `focus-visible`(2px outline), active(즉각 조작에 한해 `scale-95` 또는 동급 피드백)가 서로 구분된다.
4. 응답 후 상태: 선택한 버튼은 선택 상태가 분명하게 보이고(테두리·배경·체크 표시 등 색 외의 단서 포함), 선택하지 않은 버튼은 비활성으로 물러난다. 비활성 버튼은 `cursor-default`/`not-allowed`로 "눌러도 안 된다"가 전달된다. 안내 문구는 `role="status"`로 유지한다.
5. 로딩 전(`ready` 전) 상태에서 레이아웃이 흔들리지 않는다.

## Design

- 컨테이너는 `fieldset`을 유지하되(접근 가능한 그룹 이름) 시각적으로는 `rounded-xl` 카드 + zinc 경계·`p-4 sm:p-5`로 DESIGN.md의 카드 패턴에 맞춘다. 현재 코드가 쓰는 shadcn 시맨틱 토큰(`border-border`, `bg-muted`)과 DESIGN.md의 zinc 클래스 중 어느 쪽을 쓸지는 plan 단계에서 인접 셸 컴포넌트와 맞춰 확정한다.
- 공통 `Button`/`IconButton` 재사용 가능성을 먼저 확인한다. 공통 프리미티브가 토글 선택 상태·큰 터치 영역을 표현하지 못하면 로컬 클래스로 두고, `@study/ui`는 수정하지 않는다(ui 패키지는 셸 전용이지만 다른 화면에 영향이 번진다).
- 로직(`respond`, 스토어, `trackEvent`)은 손대지 않고 JSX/클래스만 바꾼다.

## Acceptance criteria

- [ ] 호버 시 응답 전 두 버튼의 커서가 pointer이고, 응답 후에는 pointer가 아니다.
- [ ] 라이트·다크 모드 모두에서 기본·hover·focus-visible·선택·비활성 상태가 눈으로 구분된다.
- [ ] 데스크톱과 400px 폭에서 가로 스크롤 없이 표시되고 버튼 높이가 44px 이상이다.
- [ ] 응답 1회 제한, `sessionStorage` 저장, `content_feedback` 이벤트(`rating`)가 변경 전과 동일하게 동작한다.
- [ ] 키보드(Tab, Enter/Space)로 응답할 수 있고, 스크린리더가 그룹 이름·선택 상태·결과 문구를 읽는다.
- [ ] 타입체크와 셸 빌드가 통과한다.

## Open questions

1. **커서 수정 범위**: (a) 이 위젯의 버튼에만 `cursor-pointer` 추가(안전, 영향 최소), (b) 셸 전역 `globals.css`에 `button:not(:disabled)`에 pointer 규칙 추가(다른 버튼 전체가 함께 바뀜, 데모 zone은 별도 앱이라 영향 없음). 기본 제안은 (a)이고, 전역 변경은 별도 intent로 분리한다. 전역도 원하면 알려 달라.
2. **시각 방향**: 기본 제안은 "카드 + 아이콘 버튼 2개(세그먼트형 균등 폭) + 응답 후 체크 표시가 붙은 선택 상태"다. 다른 선호(예: 이모지 사용, 더 미니멀한 한 줄형)가 있으면 알려 달라.
3. **응답 변경 허용 여부**: 현재는 응답 후 변경 불가다. 이번 범위는 유지(변경 불가)로 가정했다.

## Decisions

사용자가 열린 질문에 개별 답변 없이 "바로 구현"을 선택해 각 질문의 기본 제안으로 확정했다.

1. 커서: 이 위젯 버튼에만 적용. 셸 전역 버튼 커서 규칙은 범위 밖(필요하면 별도 intent).
2. 시각 방향: 카드 + 아이콘 버튼 2개(균등 폭) + 응답 후 체크 표시가 붙은 반전 선택 상태.
3. 응답 변경: 불가 유지(탭 세션당 문서별 1회).

## Verification results

- 상태: 구현 완료, 일부 검증 생략
- 변경 파일: `nextjs-app/apps/shell/src/components/analytics/ContentFeedback.tsx` (UI만, 로직·스토어·GA 이벤트 미변경)
- `npx tsc --noEmit`(apps/shell): 통과
- 브라우저(dev, `/getting-started/images`, 2026-10-06): 응답 전 두 버튼 커서 `pointer`·높이 44px. 클릭 후 선택 버튼 반전+체크, 반대쪽 `not-allowed`, 안내 문구 갱신, `sessionStorage`에 `{"1-getting-started/images.md":"helpful"}` 저장 확인. 다크 모드 표시 확인. 400px 폭에서 `scrollWidth` 400(가로 넘침 없음), 버튼 세로 쌓임.
- 미검증: GA 이벤트 실제 전송(로컬에 `NEXT_PUBLIC_GA_ID` 없음), `unhelpful` 선택 경로의 시각 확인, 키보드 조작·스크린리더 읽기, `next build`, Vercel Preview. ESLint는 저장소에 설정이 없어 실행하지 않음.
- 후속: 위 미검증 항목 확인 후 구현 PR 머지 시 `done` 전환. 작은 변경이라 별도 `plan.md`는 작성하지 않았음(사용자 지시로 생략).
