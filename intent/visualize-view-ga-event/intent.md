Intent: `/visualize/[slug]` 진입 GA4 커스텀 이벤트(`visualize_view`) 추가
Author: Claude
Status: done
Approval: 사용자 승인 (2026-09-18 대화 지시, `/fork`). PR #9 머지로 효력 발생 (`feature/visualize-seo-keywords` → main, merge commit `ec34634`)

## Problem

`nextjs-app/apps/shell/src/lib/analytics.ts`에는 `learning_complete`, `demo_click`, `github_star_click`, `share_click`, `demo_view`, `book_click` 6종의 GA4 커스텀 이벤트가 있지만, `/visualize/[slug]`(시각화 데모 상세) 진입은 기본 GA4 페이지뷰 외에 별도 커스텀 이벤트로 추적되지 않는다. `/demo/[...slug]`는 이미 `demo_view`(`DemoViewTracker`, `zone`/`demo_url`/`demo_title`)로 동일한 목적을 구현해 둔 선례가 있다.

## Proposed outcome

`/visualize/[slug]` 진입 시 `visualize_view` 이벤트가 `demo_key`/`demo_title`/`group` 파라미터와 함께 GA4로 전송된다. `demo_view`와 동일한 방식(마운트 시 1회 `useEffect`로 발사하는 client 컴포넌트)으로 구현해 기존 패턴과 일관성을 유지한다.

## Affected users and systems

- 사용자: `/visualize/*`를 통해 학습하는 방문자 (직접적 UI 변화 없음, 분석 데이터만 추가)
- 시스템:
  - `nextjs-app/apps/shell/src/lib/analytics.ts`
  - `nextjs-app/apps/shell/src/components/visualize/VisualizeViewTracker.tsx` (신규)
  - `nextjs-app/apps/shell/src/components/visualize/VisualizeDetailViewer.tsx`

## Constraints

- 반드시 지킬 것: 기존 6종 이벤트 정의와 `DemoViewTracker` 패턴을 그대로 따른다. `AnalyticsEvent` 유니온에 옵션 없이 새 멤버만 추가해 기존 이벤트 타입에 영향을 주지 않는다.
- 범위 밖: `/visualize` 허브(목록) 페이지 진입 추적(허브는 기본 GA4 페이지뷰로 충분 — `/demo` 허브도 별도 view 이벤트가 없는 것과 동일한 이유), 이 이벤트의 GA4 대시보드 리포트 구성.

## Requirements

1. `AnalyticsEvent`에 `visualize_view`(`params: { demo_key: string; demo_title: string; group: string }`) 멤버를 추가한다.
2. `VisualizeViewTracker` client 컴포넌트를 신설해 마운트 시 1회 `trackEvent({ name: 'visualize_view', ... })`를 발사한다(`DemoViewTracker`와 동일 구조).
3. `/visualize/[slug]` 상세 뷰(`VisualizeDetailViewer`)가 진입 시 이 트래커를 렌더링해 `demo.key`/`demo.title`/`demo.group`을 전달한다.

## Design

`DemoViewer.tsx` → `DemoViewTracker.tsx` 구조를 그대로 미러링한다: 상세 뷰 컴포넌트 최상단에 트래커를 마운트하고, 트래커는 `useEffect([demoKey, demoTitle, group])`로 값이 바뀔 때(다른 데모로 클라이언트 내비게이션 시에도) 재발사되도록 한다.

## Acceptance criteria

- [x] `pnpm --filter @study/shell check-types`가 오류 없이 통과한다.
- [x] `pnpm --filter @study/shell build`가 `/visualize/[slug]` 15개 정적 경로를 포함해 성공한다.
- [x] `VisualizeDetailViewer`가 `VisualizeViewTracker`를 마운트하고 `demo.key`/`demo.title`/`demo.group`을 전달한다(코드 확인).
