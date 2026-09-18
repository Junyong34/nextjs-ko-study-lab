Plan: `/visualize/[slug]` 진입 GA4 커스텀 이벤트(`visualize_view`) 추가
Spec: ./intent.md#requirements
Author: Claude
Status: approved
Approval: 사용자 승인 (2026-09-18 대화 지시, `/fork`) — `feature/visualize-seo-keywords` 브랜치에서 구현·로컬 검증 완료, main 병합 전

## Scope of change

- `nextjs-app/apps/shell/src/lib/analytics.ts`: `AnalyticsEvent`에 `visualize_view` 멤버 추가
- `nextjs-app/apps/shell/src/components/visualize/VisualizeViewTracker.tsx`: 신설 (`DemoViewTracker` 패턴 미러링)
- `nextjs-app/apps/shell/src/components/visualize/VisualizeDetailViewer.tsx`: 트래커 마운트
- `intent/README.md`: 작업 인덱스 행 추가

## Steps

1. `analytics.ts`의 `AnalyticsEvent` 유니온에 `visualize_view` 추가
2. `VisualizeViewTracker.tsx` 신설 — `'use client'`, `useEffect`로 마운트 시 1회 `trackEvent` 호출
3. `VisualizeDetailViewer.tsx`에 import 후 최상단에 `<VisualizeViewTracker demoKey={demo.key} demoTitle={demo.title} group={demo.group} />` 마운트
4. 타입 검사·빌드로 회귀 확인
5. `intent/README.md` 작업 인덱스 갱신

## Verification

- 타입 검사: `pnpm --filter @study/shell check-types`
- 빌드: `pnpm --filter @study/shell build`
- 구조 확인: `VisualizeViewTracker.tsx`가 `DemoViewTracker.tsx`와 동일한 `useEffect` 발사 패턴인지, `VisualizeDetailViewer.tsx`가 이를 마운트하는지 코드로 확인
- (미실행) 브라우저에서 GA `dataLayer` push 확인 — 동시 세션이 chrome-devtools-mcp의 기본 프로필(`SingletonLock`)을 점유해 이번 세션에서는 브라우저 기동이 차단됨. 이미 프로덕션에서 검증된 `demo_view`와 동일한 코드 경로(`sendGAEvent` → `trackEvent`)를 그대로 재사용하므로 기능적 리스크는 낮음.

## Rollback

이 슬러그의 커밋만 되돌리면 이전 동작(visualize_view 없음)으로 복귀한다. 데이터 마이그레이션 없음.

## Verification results

- 상태: 부분 통과 (브라우저 런타임 확인 제외)
- 실행 명령·환경 / 결과 / 증거:
  - `pnpm --filter @study/shell check-types`: 오류 없이 통과 (exit code 0)
  - `pnpm --filter @study/shell build`: 성공, `/visualize/[slug]` 15개 정적 경로 생성 확인 (기존과 동일)
  - 코드 구조 확인: `VisualizeViewTracker.tsx`가 `DemoViewTracker.tsx`와 동일 구조, `VisualizeDetailViewer.tsx`가 정상 마운트함을 grep으로 확인
- 실패·미검증 항목과 후속 작업:
  - 브라우저에서 실제 `dataLayer` push 확인은 chrome-devtools-mcp 프로필 충돌로 미실행. 배포 후 GA4 실시간 리포트 또는 DebugView로 `visualize_view` 이벤트 수신 여부를 별도 관찰 필요.
