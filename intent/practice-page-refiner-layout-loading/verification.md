# layout·loading 실습 검증 기록

## 환경과 범위

2026-09-21, main, Next.js 16.3.2 / React 19. 기존 3000(shell), 3001(baseline), 3002(cache) 서버를 발견했으며 get_project_metadata로 3001 프로젝트 경로를 확인했다. 구현 범위는 승인된 두 실습과 공개 메타데이터·intent 기록뿐이다.

## 구현 전 평가

두 페이지 모두 REBUILD. 가이드·실습·검증·개념 정리 네 영역 모두 수정 필요.

- 상태 보존: 실제 layout.tsx/하위 페이지/Link가 없어 검색어만 변경 가능했다. 브라우저에서 이동 링크 0개, 검증 불일치를 확인했다.
- 중첩 로딩: 실제 loading.tsx/비동기 페이지 없이 animate-pulse 박스를 계속 표시했다. 1.6초 후에도 스켈레톤이 남고 이동 링크 0개, 검증 불일치를 확인했다.

## 공식 근거와 재사용

next-devtools nextjs_docs로 설치 버전과 번들 문서를 확인하고 layout.md / loading.md를 직접 읽었다. 공유 layout의 재사용은 Client Component의 모든 재렌더를 금지한다는 뜻이 아니다. loading.tsx는 같은 폴더의 layout 안에서 page와 하위 트리를 감싸므로 같은 layout의 await는 감싸지 않는다. prefetch가 준비되지 않은 탐색에서 fallback이 항상 즉시 보인다고 보장하지 않는다.

공통 DemoContainer/DemoGuideCard/DemoPlaygroundCard/ExpectedActualPanel/DemoDeepDiveCard/DemoResetButton을 사용한다. MOCK_PRODUCTS와 ProductCard를 검토했으며 카테고리/상품 설명에 재사용한다. 장바구니·배송 기능은 학습 주제에 필요하지 않아 추가하지 않는다.

## Orca 기록

조사: run_8666cfdd45f5 / task_349c3d8b52dc / ctx_b2826493ec73, 읽기 전용 평가 완료 및 release.
구현: run_77756317e8c9.

- layout Task task_ee9420663636. 최초 Codex 시도 ctx_70b0f717a48e는 agent-update-prompt로 작업 실행 전에 실패하여 release했다. Claude 기본 실행기로 동일 Task를 재시도했다.
- loading Task task_1665c3753228. 최초 Codex 시도 ctx_46caacf457fb도 같은 시작 문제로 작업 실행 전에 실패하여 release했다. Claude 기본 실행기로 동일 Task를 재시도했다.

## 검사 결과

구현·통합 검증 진행 중. 실행을 완료한 명령과 실제 관측만 아래에 기록한다.

### 상태 보존 실습

- 검증 함수 단위 테스트 9개 통과. 기준 없음/경로 미변경은 대기, mount·입력·콘텐츠 카테고리 불일치는 실패, 실제 경로 변경과 동일 상태는 성공.
- 실제 Chromium: 도서→전자기기→패션 Link 이동에서 document 요청은 최초 1건뿐이며 입력 유지 확인. 입력 변경→불일치→원래 값 복구→성공, 초기화→재실행, full reload 초기값 복귀 확인.
- 클라이언트 useState 초기화 때 UUID를 만들던 구현은 SSR/client 값이 달라 hydration 오류를 발생시켰다. 동일한 빈 초기 렌더 후 mount effect에서 한 번 생성하도록 수정해 브라우저 pageerror/console error 0건 확인.
- 조작 UI를 상품 children과 함께 DemoPlaygroundCard 안에 배치하여 4단 구조를 유지했다. 390px 화면 scrollWidth/clientWidth 모두 390 확인.
- browser-check.cjs를 대상 디렉토리에 남겼다. PLAYWRIGHT_MODULE로 기존 Playwright 설치 경로, BASE_URL로 zone 서버를 지정할 수 있다.
- guide-consistency 대상 위반 0건.

로딩 worker의 최초 Claude 실행은 turn_start_unobserved였다. 살아 있는 기존 터미널을 유지하고 메시지 확인을 요청했다. worker가 dispatch-show --preamble로 원래 TASK를 복구한 뒤 같은 Dispatch에서 구현을 시작했다. 새 중복 편집자는 만들지 않았다.
