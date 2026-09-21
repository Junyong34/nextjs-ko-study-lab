Intent: 개발 문서 콘텐츠 이용 분석 및 GA4 보고서 개선
Author: Codex
Status: draft
Approval: 2026-09-22 대화에서 사용자가 spec·plan 작성 및 기존 GA 공통화·리팩토링 범위 추가를 요청함. 문서 검토·plan 승인 및 PR 머지 기록은 아직 없음.

## Problem

현재 analytics.ts에는 learning_progress_toggle, learning_complete, demo_click, github_star_click,
share_click, demo_view, book_click, visualize_view 8종이 정의되어 있다.
완료된 ga-custom-events 및 visualize-view-ga-event 작업은 이 확장의 승인 근거가 아니다.

CodeBlock은 실제 clipboard 성공 여부를 알지만 복사 이벤트를 전송하지 않는다.
DocTreeSearch는 URL 기반 검색 결과 페이지가 아닌 트리 필터이므로 기본 검색 자동 측정만으로 충분하지 않다.
기존 FeedbackForm은 mailto를 여는 기능이며 실제 이메일 전송 성공이나 글 만족도를 확인하지 않는다.
현재 GA 관리 화면의 설정과 서버 수신 여부는 조사하지 않았다.

## Proposed outcome

1. 코드 복사 성공, 검색 결과 표시 및 선택, 목차와 문서 간 이동을 실제 동작에 맞게 측정한다.
2. 문서 식별자·주제·콘텐츠 유형·UI 위치를 일관되게 전달하여 기존 학습·데모 이벤트와 비교한다.
3. 문서별 도움 여부를 받는 간단한 긍정/부정 피드백을 추가한다. 기존 메일 문의와 구분한다.
4. 페이지 이동의 page_view 누락·중복 및 현재 페이지 귀속을 검증한다.
5. 전체 요약·글별 성과·검색/탐색 3개 보고서의 측정기준, 지표, 필터, 분모와 설정 절차를 문서화한다.
   GA 관리 화면에 접근할 수 있으면 실제 설정을 진행하고, 불가능하면 미적용 항목을 명시한다.

6. 흩어진 클릭 리스너·화면 진입 추적을 통합하고 이벤트 계약·전송·공통 문맥·검증 규칙을 단일 모듈 경계에서 관리한다. 실제 동작을 감지하는 코드는 해당 UI에 유지한다.

## Affected users and systems

- 사용자: 학습 방문자와 콘텐츠를 개선하는 운영자.
- 시스템: apps/shell의 analytics.ts, 루트 layout 및 문서 라우트, analytics 컴포넌트.
- 공유 패키지: packages/docs-render/src/code/CodeBlock.tsx 및 문서 렌더링 연결부,
  packages/ui/src/nav/doc-tree/, nav/toc/, 문서 이동 UI와 피드백 연결부.
- 검증 및 운영: packages/test-suite와 nextjs-app/docs의 GA 이벤트·보고서 운영 문서.
- 경로는 nextjs-app/ 기준이며 정확한 변경 파일은 spec/plan 단계에서 확정한다.

## Constraints

- Search Console 연결·설정·검색 유입 대시보드는 제외한다(사용자가 이미 연결 완료).
- 기존 이벤트 이름과 의미를 유지한다. 공유 UI 및 문서 패키지를 GA 라이브러리에 직접 결합하지 않는다.
- 코드 본문, 문의 내용, 이메일을 전송하지 않는다. 검색어 수집은 식별정보 차단 정책을 spec에서 정의한다.
- 복사 실패를 성공으로 집계하지 않고, mailto 실행을 이메일 발송 완료로 집계하지 않는다.
- 검색 타이핑마다 발송하지 않는다. 결과가 표시된 검색 단위와 결과 수 정의를 spec에서 확정한다.
- 자동 측정과 수동 page_view/search 이벤트의 중복을 피한다.
- 피드백 수, 글별 복사 사용자 비율 등은 동일한 기간·문서·집계 단위를 사용한다.
- 스크롤을 완독으로, 복사를 학습 성공으로 간주하지 않는다.
- GA 실수신, 브라우저 이벤트 관찰, 단위 테스트, 타입·빌드 검증 결과를 구분한다.
- 이번 범위에서 히트맵, 세션 녹화, BigQuery, 로그인별 추적, 전체 클릭 수집은 추가하지 않는다.
- 세부 스크롤 단계 추가는 보류하고 기본 90% 측정의 정확성부터 확인한다.

## Open questions

- 제안 범위 승인 후 spec에서 이벤트 계약과 피드백 UI를 구체화한다.
- GA 속성 접근 가능 여부는 관리 화면 설정 단계에서 확인한다. 코드 수집과 보고서 실제 적용을 구분한다.

## 조사 근거

- intent/ga-custom-events/{intent,plan}.md
- intent/visualize-view-ga-event/{intent,plan}.md
- nextjs-app/apps/shell/src/lib/analytics.ts
- nextjs-app/packages/docs-render/src/code/CodeBlock.tsx
- nextjs-app/packages/ui/src/nav/doc-tree/DocTreeSearch.tsx 및 useTreeFilter.ts
- nextjs-app/packages/ui/src/feedback/FeedbackForm.tsx
- 앞선 대화의 Google 공식 문서 기반 조사. API 세부사항은 구현 전 다시 확인한다.
