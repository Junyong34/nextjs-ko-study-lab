> 샘플 문서. [`intent.md`](./intent.md) 상단 안내 참고.

Spec: 데모 허브 `?run=` 쿼리 파라미터 재검사
Intent: ./intent.md
Author: 예시 (실제 작성자 이름으로 교체)
Status: draft
Approval: 없음 (초안)

## Requirements

- 필수: `DemoPage`가 `?run=` 값을 받으면, 해당 문서에 연결된 데모 목록 중 상태가 `done`인 항목에서만 일치하는 슬러그를 찾는다.
- 필수: 일치하는 항목이 없으면(미공개거나 소속이 아니면) 직접 URL 진입과 동일하게 `DemoEmptyState`를 렌더링한다.
- 필수: `?run=`이 없거나 빈 문자열이면 기존 허브 목록을 유지한다.
- 선택: 잘못된 값이 들어왔을 때 개발 모드 콘솔에 사유(미공개/미소속/존재하지 않음)를 로그로 남긴다.

## Non-goals

- 홈 추천 카드, 사이드바 등 다른 화면의 상태 재검증은 다루지 않는다.
- `demos.yaml`/`demos-manifest.json` 스키마 변경은 다루지 않는다.

## Design

`DemoPage`가 이미 보유한 "문서에 연결된 데모 목록"(공개 여부 포함)을 재사용해, `?run=` 값을 그 목록의 `done` 항목 슬러그와 대조하는 필터를 라우트 진입 시점에 추가한다. 새 데이터 소스나 API 호출은 추가하지 않는다.

## Acceptance criteria

- [ ] 연결된 `done` 데모의 슬러그를 `?run=`에 넣으면 정상적으로 해당 데모가 재생된다.
- [ ] 연결됐지만 `stub`/`wip` 상태인 데모의 슬러그를 `?run=`에 넣으면 `DemoEmptyState`가 표시된다.
- [ ] 해당 문서에 연결되지 않은 다른 데모의 슬러그를 `?run=`에 넣으면 `DemoEmptyState`가 표시된다.
- [ ] 존재하지 않는 값은 `DemoEmptyState`로, 쿼리 없음·빈 문자열은 기존 허브 목록으로 표시된다.
- [ ] 직접 `/demo/{url}` 진입 동작은 변경 전과 동일하다.

## Open questions

- 샘플 안에서 미결정 사항은 없다. 위 동작은 작성 예시이며 실제 승인이나 구현 지시가 아니다.
