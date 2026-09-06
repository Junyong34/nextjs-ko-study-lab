Plan: GA4 핵심 커스텀 이벤트 3종 연동
Spec: ./intent.md#requirements
Author: devpark
Status: approved
Approval: 사용자 승인 (implementation_plan.md)

## Scope of change

- `nextjs-app/apps/shell/src/lib/analytics.ts`: 이벤트 타입 정의 확장
- `nextjs-app/apps/shell/src/components/learning-progress/LearningProgressProvider.tsx`: `learning_complete` 이벤트 발송
- `nextjs-app/packages/docs-render/src/demo/DocDemoList.tsx`: 데모 카드 링크에 `data-*` 속성 부여
- `nextjs-app/packages/docs-render/src/demo/DemoLinkCard.tsx`: 코드펜스 데모 링크 카드에 `data-*` 속성 부여
- `nextjs-app/packages/docs-render/src/markdown/MarkdownRenderer.tsx`: `DocDemoList` 및 `DemoLinkCard`에 `docPath`와 `zone` 전달
- `nextjs-app/apps/shell/src/components/analytics/DemoClickTracker.tsx`: 이벤트 위임 리스너 클라이언트 컴포넌트 신설
- `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`: `DemoClickTracker` 마운트
- `nextjs-app/apps/shell/src/components/github-star/GithubStarProvider.tsx`: `github_star_click` 이벤트 발송
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/22-ga-custom-events.test.ts`: 신규 테스트 작성
- `intent/README.md`: 작업 인덱스 행 추가

## Steps

1. `apps/shell/src/lib/analytics.ts`에 `learning_complete`, `demo_click`, `github_star_click` 타입 추가
2. `LearningProgressProvider.tsx`에 `learning_complete` 이벤트 발송 로직 추가
3. `DocDemoList.tsx`, `DemoLinkCard.tsx`, `MarkdownRenderer.tsx`에 `data-*` 속성 연동
4. `DemoClickTracker.tsx` 신설 및 `[...slug]/page.tsx`에 마운트
5. `GithubStarProvider.tsx`에 `github_star_click` 이벤트 발송 로직 추가
6. 테스트 작성 및 실행 (`22-ga-custom-events.test.ts`)
7. 타입 검증 (`check-types`)
8. 인덱스 및 산출물 상태 갱신

## Verification

- 테스트: `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier1-feature-coverage/22-ga-custom-events.test.ts`
- 타입 검사:
  - `pnpm --filter @study/shell check-types`
  - `pnpm --filter @study/docs-render check-types`

## Rollback

`git revert` 또는 `git checkout main`으로 변경 이전 상태로 원복.

## Verification results

- 상태: 통과
- 실행 명령·환경 / 결과 / 증거:
  - `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier1-feature-coverage/22-ga-custom-events.test.ts`: 12/12 케이스 전체 통과 (0 fail)
  - `pnpm --filter @study/shell check-types`: 오류 없이 통과 (exit code 0)
  - `pnpm --filter @study/docs-render check-types`: 오류 없이 통과 (exit code 0)
- 실패·미검증 항목과 후속 작업: 없음
