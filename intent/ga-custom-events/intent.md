Intent: GA4 핵심 커스텀 이벤트 3종 연동
Author: devpark
Status: approved
Approval: 사용자 승인 (implementation_plan.md)

## Problem

현재 사이트(`learn-nextjs-lab.space`)에는 Google Analytics 4가 기본 연동되어 있으나 기본 페이지뷰 및 스크롤 외에 학습자의 실제 상호작용을 파악할 수 있는 이벤트가 부족하다.
특히 다음 3가지 핵심 전환 지표가 측정되지 않고 있다:
1. 문서 학습 완료 시점 및 챕터별 완독률
2. 문서 본문 및 하단에서 실제 인터랙티브 데모 랩으로의 전환 클릭
3. GitHub Star 요청 팝업의 실제 노출 수 대비 저장소 이동 전환율

## Proposed outcome

1. 학습자가 문서를 완료했을 때 `learning_complete` 이벤트(`doc_id`, `chapter`)를 전송한다.
2. 문서 내 데모 링크를 클릭했을 때 `demo_click` 이벤트(`demo_type`, `from_doc`)를 전송한다.
3. GitHub Star 팝업이 노출되거나 저장소로 이동할 때 `github_star_click` 이벤트(`action`)를 전송한다.
이를 통해 GA4 대시보드에서 독자들의 학습 흐름과 전환율을 명확하게 파악할 수 있게 된다.

## Affected users and systems

- 사용자: 학습 사이트 방문자 및 독자
- 시스템:
  - `nextjs-app/apps/shell/src/lib/analytics.ts`
  - `nextjs-app/apps/shell/src/components/learning-progress/LearningProgressProvider.tsx`
  - `nextjs-app/packages/docs-render/src/demo/DocDemoList.tsx`
  - `nextjs-app/packages/docs-render/src/demo/DemoLinkCard.tsx`
  - `nextjs-app/packages/docs-render/src/markdown/MarkdownRenderer.tsx`
  - `nextjs-app/apps/shell/src/components/analytics/DemoClickTracker.tsx`
  - `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`
  - `nextjs-app/apps/shell/src/components/github-star/GithubStarProvider.tsx`

## Constraints

- 반드시 지킬 것: `@study/docs-render` 패키지는 Server Component 호환성을 유지해야 하며, 분석 라이브러리에 강결합되지 않도록 `data-*` 속성을 활용한 이벤트 위임 방식을 적용한다.
- 범위 밖: 외부 Redis 위젯 또는 Google Analytics Data API 서버 사이드 통계 엔드포인트 연동은 별도 작업으로 진행한다.

## Requirements

1. **`learning_complete`**:
   - `kind === 'document'`인 학습 항목이 '완료' 상태로 토글될 때 발송.
   - 파라미터:
     - `doc_id`: 문서 식별 키 (예: `1-getting-started/installation.md`)
     - `chapter`: 소속 챕터/카테고리명 (예: `시작하기` 또는 최상위 디렉토리명)

2. **`demo_click`**:
   - 문서 페이지(`[...slug]`) 내의 데모 링크(`DemoLinkCard`, `DocDemoList`)를 클릭했을 때 발송.
   - 파라미터:
     - `demo_type`: 데모의 zone 식별자 (예: `baseline`, `cache`)
     - `from_doc`: 클릭이 발생한 문서 경로/URL

3. **`github_star_click`**:
   - GitHub Star 요청 팝업 관련 인터랙션 시 발송.
   - 파라미터:
     - `action`: `'open_modal'` (팝업 노출), `'go_to_repo'` (Star 남기기 버튼 클릭), `'dismiss'` (닫기 클릭), `'dismiss_forever'` (다시 보지 않기 클릭)

## Design

- `apps/shell/src/lib/analytics.ts`의 `AnalyticsEvent` 유니온 타입에 3개 이벤트를 엄격하게 타이핑.
- `LearningProgressProvider`의 `toggle` 콜백에서 문서가 완료될 때 `learning_complete` 호출.
- `DocDemoList` 및 `DemoLinkCard`의 `<a>` 태그에 `data-analytics="demo_click"`, `data-demo-type={...}`, `data-from-doc={...}` 속성 부여.
- `apps/shell`의 `[...slug]/page.tsx`에 `DemoClickTracker` 클라이언트 컴포넌트를 마운트하여 `click` 이벤트를 이벤트 위임으로 캡처 후 `trackEvent` 전송.
- `GithubStarProvider`에서 팝업 노출 조건 만족 시 `open_modal`, 클릭 시 `go_to_repo`, 닫기 시 `dismiss` 발송.

## Acceptance criteria

- [x] `learning_complete` 이벤트가 문서 완료 시 올바른 파라미터(`doc_id`, `chapter`)와 함께 전송된다.
- [x] 문서 내 데모 카드 클릭 시 `demo_click` 이벤트가 `demo_type`, `from_doc`와 함께 전송된다.
- [x] Star 팝업 노출 시 `open_modal`, 저장소 이동 클릭 시 `go_to_repo`가 전송된다.
- [x] `@study/shell` 및 `@study/docs-render`의 타입 검사가 에러 없이 통과한다.
- [x] `packages/test-suite`에 커스텀 이벤트 검증 테스트가 작성되고 통과한다.
