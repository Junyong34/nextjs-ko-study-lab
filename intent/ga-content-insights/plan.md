Plan: GA4 콘텐츠 측정 확장과 공통화
Spec: ./spec.md
Author: Codex
Status: approved
Approval: 2026-09-22 대화에서 사용자 "ga 플랜 작업 시작… main 브랜치에 커밋 푸쉬" 지시로 구현·직접 main 커밋/push 승인. 구현 5957095 원격 반영. GA 관리 화면 적용 및 실수신 확인은 남아 있음.

## Scope of change

모든 경로는 저장소 루트 기준이다.

| 대상 | 변경 |
|---|---|
| nextjs-app/apps/shell/src/lib/analytics.ts 및 analytics/ 신규 모듈 | 기존 API 유지, 타입·전송·문맥·검증·DOM 변환 분리 |
| nextjs-app/apps/shell/src/components/analytics/ | 기존 클릭 트래커 통합, 콘텐츠 경계와 진입 추적기 추가 |
| nextjs-app/apps/shell/src/app/layout.tsx 및 [...slug]/page.tsx | 루트 수집기·문서 메타데이터·피드백 연결 |
| nextjs-app/apps/shell/src/components/demo/{DemoViewTracker,DemoViewer}.tsx | 공통 진입 추적기로 교체 |
| nextjs-app/apps/shell/src/components/visualize/{VisualizeViewTracker,VisualizeDetailViewer}.tsx | 공통 진입 추적기로 교체 |
| nextjs-app/apps/shell/src/components/learning-progress/LearningProgressProvider.tsx | 기존 상태 전환을 공통 계약으로 연결 |
| nextjs-app/apps/shell/src/components/github-star/GithubStarProvider.tsx 및 home/TrackedBookLink.tsx | 기존 의미 보존, 공통 API와 문맥 사용 |
| nextjs-app/packages/docs-render/src/code/CodeBlock.tsx 및 markdown/MarkdownRenderer.tsx | 복사 성공 의미 이벤트·블록 식별자·문서 링크 속성 |
| nextjs-app/packages/ui/src/nav/doc-tree/{DocTree,DocTreeNode,DocTreeSearch}.tsx 및 useTreeFilter.ts | 검색 확정 상태·실제 결과 집계·링크 선택 연결 |
| nextjs-app/packages/ui/src/nav/toc/{TableOfContents,TocList}.tsx | 목차 의미 속성 |
| nextjs-app/apps/shell/src/components/analytics/ContentFeedback.tsx (신규) | 문서 도움 여부 UI·세션 저장 |
| nextjs-app/packages/test-suite/src/tier1-feature-coverage/22-ga-custom-events.test.ts | 기존 이벤트 계약 회귀 테스트 보강 |
| nextjs-app/packages/test-suite/src/tier2-boundaries-edge-cases/ga-content-insights.test.ts (신규) | payload·검색·중복·실패 경계 테스트 |
| nextjs-app/docs/ga-content-analytics.md (신규), docs/README.md | 이벤트 사전·보고서 구성·운영 확인 절차 |
| intent/ga-content-insights/ 및 intent/README.md | 승인·검증 상태 동기화 |

실제 사용처 검색으로 경로를 확인하며 일부 연결 파일이 추가되면 승인 범위 내 변경 이유를 기록한다.
다른 작업의 baseline config/env 변경은 편집·커밋하지 않는다. 인덱스의 타 작업 변경도 보존한다.

## Steps

1. 승인 및 기준선 확인
   - intent/spec/plan 승인 기록 확인 후 구현 브랜치에서 시작한다.
   - 적용 AGENTS, docs/01-ui-and-screen-design.md, ADR 0006, 로컬 Next.js 문서를 읽는다.
   - 기존 8종 이벤트 호출·속성 생산자·레이아웃 마운트 지도를 운영 문서에 정리한다.
   - GA 설치 경로와 자동 페이지뷰 설정을 확인한다. 비밀값이나 측정 ID를 로그에 노출하지 않는다.
2. 공통 수집 모듈과 회귀 검증
   - 전송 어댑터를 주입 가능한 경계로 만들어 외부 네트워크 없는 payload 테스트를 작성한다.
   - 기존 공개 trackEvent 유지, 이벤트 타입 분리, 허용 필드·URL 정규화·공통 문맥 생성 구현.
   - 기존 8종을 먼저 이동하고 이벤트 의미와 기존 매개변수의 호환성을 확인한다.
3. 중복 트래커 정리
   - 루트 클릭 수집기로 DemoClickTracker/ShareClickTracker를 대체하고 기존 마운트를 제거한다.
   - Element/SVG/키보드 활성화를 처리하며 정확한 전용 이벤트 우선순위를 둔다.
   - 콘텐츠 경계와 공통 진입 트래커를 연결한다. 재렌더와 실제 재진입을 구분한다.
   - 문서 content_view를 추가하고 기존 demo_view/visualize_view는 이름을 유지한다.
4. 실제 콘텐츠 행동 측정
   - CodeBlock에 성공 시점 이벤트를 추가하고 클릭 당시 문서 귀속을 고정한다.
   - 검색의 정규화·허용 topic·안정화·IME·모바일 노출·빠른 선택 규칙을 순수 상태 로직으로 분리한다.
   - 검색 결과 링크·일반 문서 링크·목차 클릭을 공통 DOM 어댑터로 연결한다.
5. 문서 피드백
   - 문서 하단 버튼, 접근성, 최초 응답 세션 저장과 실패 대체를 구현한다.
   - 실제 GA 수신을 보장하는 성공 문구나 메일 전송 의미를 추가하지 않는다.
6. 브라우저 통합 검증 및 보고서 문서
   - 아래 시나리오를 실제 앱에서 수행하고 dataLayer와 GA 네트워크를 구분해서 기록한다.
   - GA 접근이 있으면 DebugView 수신 확인 및 3개 보고서 설정을 진행한다.
   - 접근이 없으면 필요한 측정기준·이벤트 필터·분모·설정 절차를 완성하고 미적용 목록을 남긴다.
7. 최종 확인
   - 단위/타입/빌드 및 영향 범위 브라우저 검증 결과를 기록한다.
   - 기존 이벤트 회귀와 중앙화 경계를 리뷰한다. 구현·배포·GA 수신·보고서 적용 상태를 각각 기록한다.
   - 승인 및 머지 조건을 충족하기 전 done 처리하지 않는다.

## Verification

저장소 루트에서 실행한다. 계획 작성 단계에서는 실행하지 않는다.

- 기존 회귀: `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier1-feature-coverage/22-ga-custom-events.test.ts`
- 신규 경계: `node --test --experimental-strip-types --disable-warning=ExperimentalWarning nextjs-app/packages/test-suite/src/tier2-boundaries-edge-cases/ga-content-insights.test.ts`
- 타입: `pnpm --filter @study/shell check-types`, `pnpm --filter @study/ui check-types`, `pnpm --filter @study/docs-render check-types`
- 빌드: `pnpm --filter @study/shell build`
- 경계 검색: sendGAEvent/gtag/dataLayer 직접 호출이 전송 어댑터 외 새로 생기지 않았는지 확인.
  테스트 코드·GoogleAnalytics 설치는 전송 어댑터 중복으로 취급하지 않는다.
- `git diff --check` 및 변경 파일 250줄 제한 확인.

| 브라우저 시나리오 | 기대 결과 |
|---|---|
| 문서 직접 진입→다른 문서→뒤로→앞으로 | 진입별 문서 이벤트 1회, 최신 문맥; GA 접근 시 page_view와 referrer 검증 |
| 데모/시각화 진입 및 선택 변경 | 기존 이름/값 유지, 재렌더 중복 없음, 재방문 기록 |
| 복사 성공/클립보드 거절/복사 대기 중 이동 | 성공만 1회, 거절 0회, 원래 문서에 귀속 |
| 검색 타이핑·IME·지우기·0건·빠른 클릭 | 확정된 표시만 집계, 결과 수 정확, 원문 없음 |
| 모바일 숨김→서랍 열기 | 숨김 중 결과 노출 집계 없음, 표시된 결과만 기록 |
| 검색 결과/목차/문서/데모 링크 클릭 | 의도한 이벤트만 발생, 이전 리스너 잔존으로 중복되지 않음 |
| 피드백 선택→새로고침→재선택 | 탭 세션 문서당 최초 응답만, 선택 상태 유지 |
| 저장소·GA 차단 | 본래 UI 기능 유지, 예외 전파 없음 |
| 기존 완료 토글·공유·책·GitHub 팝업 | 8종 이벤트의 기존 의미와 매개변수 유지 |

브라우저 관찰만으로 GA 수신 성공을 선언하지 않는다. 실제 계정 수신은 DebugView로 별도 확인한다.
자동 페이지뷰 설정 접근 불가 시 그 항목은 미검증으로 남기며 임의 수동 전송을 추가하지 않는다.

## Rollback

이번 작업 소유 커밋만 revert한다. 공통화와 호출부 변경을 함께 되돌려 이벤트 누락을 막는다.
새 피드백 세션 키는 이전 코드가 사용하지 않으며 데이터 마이그레이션은 없다.
GA 맞춤 정의·보고서는 이번 작업에서 생성한 항목만 별도 정리한다. 기존 정의는 삭제하지 않는다.

## Verification results

- 구현 커밋: `5957095` (main, 원격 push 확인). 이번 커밋에는 GA 작업 33개 파일만 포함.
- 상태: 코드 구현·로컬 검증 완료, GA 계정 적용·실수신 및 일부 시나리오 확인은 남아 있어 approved 유지.
- 사용자 지시에 따라 PR 없이 main에 직접 커밋/push.
- `pnpm --filter @study/shell check-types`: 통과.
- `pnpm --filter @study/ui check-types`, `pnpm --filter @study/docs-render check-types`: 통과.
- `pnpm --filter @study/shell build`: 최종 통과, 834개 정적 페이지 생성.
  중간 transport 타입 오류는 수정 후 타입 검사와 빌드를 다시 통과했다.
- 기존 GA 계약 11개 + payload 경계 3개 + 피드백 4개 + 검색 로직 3개: 총 21개 통과.
  실행 파일: 22-ga-custom-events.test.ts, ga-content-insights.test.ts, ga-feedback.test.ts,
  packages/ui/src/nav/doc-tree/search-measurement.test.mjs.
- Playwright, localhost:3000: 코드 복사·피드백·검색 표시·검색 결과 클릭·목차·일반 문서 이동·
  문서 진입·visualize_view의 dataLayer 이벤트 관찰. 뒤로/앞으로 각각 content_view 1회 확인.
- 복사 성공/실패는 clipboard.writeText를 제어하여 성공 시 1회, 거절 시 0회 확인.
  지연 완료 후 다른 문서로 이동해도 원래 문서에 code_copy 귀속됨을 확인.
  실제 OS 클립보드 권한 검증과 구분한다.
- 빠른 검색 결과 클릭은 결과 표시→결과 클릭 순서, 0건 검색은 result_count=0 확인.
  이메일 형태 검색은 search_topic=other로 전송되어 원문 미포함 확인.
- 피드백 재방문 시 버튼 비활성 상태 확인. 모바일 390px에서 서랍 검색 이벤트 및 가로 넘침 없음 확인.
- 브라우저 검증은 Google 측정 네트워크를 차단한 상태의 dataLayer 검증이다.
  GA 서버 요청 성공, 자동 page_view, DebugView 수신은 검증하지 않았다.
- 코드 리뷰에서 기존 상대 식별자 변형, ui_location 누락, 전역 코드블록 탐색을 발견·수정했다.
  후속 위임 리뷰는 사용량 한도로 중단되어 별도 최종 리뷰 완료를 주장하지 않는다.
- 설계 조정: CodeBlock은 renderer 전체 수정 대신 가장 가까운 콘텐츠 경계와 article 내 코드블록
  순서를 사용한다. 기존 demo/visualize 래퍼는 공통 ContentViewTracker를 호출하는 얇은 어댑터로 유지.
- 2026-09-24 후속 브라우저 검증 (Playwright/Chromium, 셸 dev localhost:3000, 더미 GA ID,
  Google 측정 네트워크 차단, dataLayer 관찰, 데스크톱 1280px). 페이지 오류 0건.
  - 기존 8종 회귀: book_click(visualize), learning_progress_toggle 켜기/끄기,
    learning_complete(켤 때만 1회, 끌 때 0회), share_click, demo_click, demo_view, visualize_view,
    github_star_click open_modal/dismiss/dismiss_forever/go_to_repo 모두 기존 매개변수로 1회씩 발생.
    GitHub 팝업은 노출 조건을 충족하는 localStorage 기록을 앱 실행 전에 주입해 띄웠다.
  - demo_view 선택 변경: 이전/다음 예제 이동마다 새 demo_url로 1회, 같은 데모에서 완료 토글로
    재렌더해도 추가 발생 없음, 이전 데모 재방문 시 다시 1회.
  - IME: CDP 조합 입력(ㅋ→캐→캐ㅅ→캐시)을 디바운스(500ms)보다 길게 유지하는 동안
    content_search_results 0회, 조합 확정 후 1회(search_topic=other, result_count=0, 표시 결과 0개와 일치).
    지운 뒤 영문 `cache` 입력 시 1회(cache, 14건). 전송 값에 검색 원문 미포함.
  - 한계: CDP 조합 이벤트는 실제 OS IME와 다를 수 있다. 데모 iframe 대상 zone은 실행하지 않아
    iframe 내부 500 응답은 검증 범위 밖이다.
- GA 관리 화면 맞춤 정의·탐색 3종 생성은 미적용. 운영 절차는
  `nextjs-app/docs/ga-content-analytics.md`에 작성했다. Search Console은 제외.
- push 내역: 기존 로컬 커밋 671f9e4, 문서 커밋 5743e89도 5957095와 함께 원격 main에 포함됐다.
  GA 외 미커밋 baseline/config/env/manifest 작업 파일은 보존했다.
