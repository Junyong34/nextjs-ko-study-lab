Spec: GA4 콘텐츠 측정 확장과 공통화
Intent: ./intent.md
Author: Codex
Status: done
Approval: 2026-09-22 대화에서 사용자 "ga 플랜 작업 시작… main 브랜치에 커밋 푸쉬" 지시로 구현·직접 main 커밋/push 승인. 구현 5957095 원격 반영. 2026-09-24 대화에서 사용자가 GA 관리 화면 적용·확인을 직접 완료했다고 알려 done 전환 지시.

## Requirements

### R1. 기존 이벤트 호환성과 공통화

기존 8종 learning_progress_toggle, learning_complete, demo_click, github_star_click,
share_click, demo_view, book_click, visualize_view의 이름, 필수 매개변수, 발생 의미를 유지한다.
완료 체크는 사용자 표시이며 실제 이해도나 완독을 뜻하지 않는다.
공유 클릭과 GitHub 이동도 실제 공유 완료·Star 등록으로 해석하지 않는다.

GA SDK 호출은 셸 analytics 모듈의 전송 어댑터 한곳에서만 한다.
이벤트 계약, 공통 문맥 생성, payload 검증, DOM 이벤트 변환은 관심사별 파일로 분리한다.
기존 lib/analytics.ts는 공개 진입점으로 남겨 호출부가 내부 구조에 의존하지 않게 한다.
DemoClickTracker와 ShareClickTracker의 전역 클릭 리스너는 루트의 단일 트래커로 통합한다.
DemoViewTracker와 VisualizeViewTracker의 effect 전송은 공통 화면 진입 추적기를 사용한다.
학습 완료와 팝업 등의 상태 변화는 기존 소유 컴포넌트에서 공통 API를 호출한다.
단순히 파일을 옮기는 것을 공통화 완료로 보지 않는다.

### R2. 신규 이벤트 계약

아래 매개변수에 R3의 현재 화면 문맥을 추가한다. 키는 event-scoped이며 사용자 속성으로 저장하지 않는다.

| 이벤트 | 발생 조건 | 추가 매개변수 |
|---|---|---|
| code_copy | clipboard.writeText 성공 후 1회. 거절 시 0회 | code_block_id, code_language |
| content_search_results | 검색 결과가 실제 표시된 비어 있지 않은 검색 상태 | search_surface, search_topic, result_count |
| search_result_click | 현재 검색 결과의 이동 가능한 링크 선택 | search_surface, search_topic, target_path |
| toc_click | 문서 목차/용어 색인의 앵커 활성화 | section_id, ui_location |
| doc_navigation_click | 문서로 이동하는 표시된 링크 활성화 | target_path, ui_location |
| content_feedback | 문서의 도움 여부 첫 응답 확정 | rating: helpful 또는 unhelpful |

content_search_results는 URL 기반 자동 view_search_results와 다른 수동 UI 검색 이벤트다.
두 이벤트를 같은 검색 실행의 합계로 더하지 않는다. 이번 구현은 문서/데모 사이드바 트리 검색을 대상으로 한다.
데모 색인 q 검색·학습 기록 필터 등 다른 검색 UI의 확장은 이번 범위에서 제외한다.
검색 결과 표시 후 입력이 500ms 안정됐을 때 1회 기록한다. 빠르게 결과를 클릭하면 먼저 해당 결과 표시 이벤트를 확정한다.
IME 조합 중·빈 검색·지워진 검색·숨겨진 모바일 서랍에서는 결과 표시 이벤트를 보내지 않는다.
같은 정규화 검색어와 결과 집합의 연속 재렌더는 중복 제거한다. A→B→A 검색은 새 실행으로 센다.
result_count는 결과 트리의 이동 가능한 고유 URL 수이며 그룹 헤더 수가 아니다.
서랍을 열어 실제 결과가 보이는 시점에는 아직 기록되지 않은 결과를 기록한다.
검색 링크는 search_result_click만 보내고 일반 doc_navigation_click을 중복 발송하지 않는다.
데모/공유 링크는 기존 전용 이벤트를 우선하며 일반 문서 이동과 이중 집계하지 않는다.

### R3. 콘텐츠 문맥과 수집 제한

공통 문맥: page_path(쿼리·해시 제외), content_id, content_group, content_type, ui_location.
문서 content_id는 기존 learning_complete.doc_id와 같은 doc.path를 사용한다.
content_group은 기존 manifest의 카테고리 또는 최상위 문서 그룹으로 결정한다.
content_type은 document/demo/visualize/hub/other로 고정하며 근거 없는 튜토리얼 분류는 만들지 않는다.
문서 외 콘텐츠는 demo URL 또는 visualize key 등 기존 식별자를 사용한다.
문맥은 렌더링된 콘텐츠의 서버 메타데이터에서 얻는다. 라우트가 바뀌면 이전 문맥을 재사용하지 않는다.
비동기 복사 성공은 클릭 당시의 문서 문맥을 보존하여 이동 후 다른 글로 귀속되지 않게 한다.

검색어 원문은 GA로 보내지 않는다. manifest 제목·알려진 기술 키워드의 허용 목록에 정확히 대응할 때만
정규화한 search_topic을 전송하며 나머지는 other로 묶는다. 원문 해시도 전송하지 않는다.
이 제한 때문에 임의 검색어별 분석은 제공하지 않는다고 보고서에 명시한다.
코드 원문·메일 주소·문의 본문·임의 DOM 텍스트는 수집하지 않는다.
외부/공유 URL은 허용된 경로 정보만 남기고 쿼리·해시는 제거한다.
GA 미설정·차단·전송 실패가 복사·이동·피드백 UI 동작을 막지 않게 한다.

### R4. 문서 피드백

일반 문서 본문 하단에 도움 됐어요/부족해요 버튼을 둔다. 인덱스 README는 제외한다.
한 탭 세션의 한 문서에서 최초 선택만 집계하고 이후 선택 상태를 표시한다.
sessionStorage의 study_content_feedback_v1 키를 사용하며 스토리지 접근 실패 시 메모리로 대체한다.
키보드 조작과 선택 상태를 지원한다. 응답 변경은 이번 범위에서 제공하지 않는다.
GA 수신 성공을 알 수 없으므로 서버 저장 완료 등의 문구를 표시하지 않는다.
기존 mailto 문의 UI는 유지하며 새 응답 기능과 별개로 둔다.

### R5. 페이지뷰 및 화면 진입 정확성

기존 GoogleAnalytics 설치와 향상된 측정의 history 기반 page_view를 우선 유지한다.
근거 없이 수동 page_view를 추가하지 않는다. 직접 진입, Link 이동, 뒤로/앞으로 이동에서
page_location/page_referrer와 page_view 횟수를 실제 브라우저에서 확인한다.
화면 진입 커스텀 이벤트는 같은 화면의 재렌더·Strict Mode effect 반복으로 중복되지 않고,
A→B→A처럼 실제 재진입하면 다시 발생한다. 데모 선택 변경도 기존 의미대로 추적한다.
전역 영구 Set으로 재방문을 누락시키지 않는다. 리스너 cleanup과 중복 설치 방지를 검증한다.

### R6. 보고서 산출물

새 운영 문서에 이벤트 사전, 맞춤 측정기준 등록 목록, GA4 탐색 보고서 3개의 설정 절차를 작성한다.

| 보고서 | 행/필터 | 지표 |
|---|---|---|
| 전체 요약 | 날짜, 콘텐츠 유형, 기기 | 활성 사용자, 세션, 조회수, 평균 참여시간, 기존 학습 완료 |
| 글별 성과 | content_id, content_group | 글 조회 사용자, 복사 사용자, 피드백 응답 수 및 긍정 비율 |
| 검색/탐색 | search_surface, search_topic, ui_location | 결과 표시 수, 0건 결과 수, 결과 클릭 수, 목차/문서 이동 |

글별 비율의 분모를 확보하도록 문서 조회 시 content_view(content_id 등 공통 문맥)를 1회 보낸다.
이것은 page_view의 대체가 아닌 글별 커스텀 분석용 이벤트이며 조회수에 합산하지 않는다.
복사 사용자 비율은 같은 content_id의 code_copy 사용자 / content_view 사용자로 정의한다.
피드백 긍정 비율은 helpful 응답 수 / 전체 응답 수이며 반드시 표본 수를 함께 표시한다.
검색 결과 없음 비율은 result_count=0 결과 표시 수 / 전체 결과 표시 수이다.
서로 다른 이벤트 필터의 분모를 GA 화면에서 계산하기 어려우면 나란히 표를 제공한다.
실제 지원을 검증하지 않은 계산 지표/임의 데이터 결합을 구현 완료로 표시하지 않는다.
기본 기간 28일, 이전 28일 비교. content_id 외 고유도가 높은 키를 불필요하게 맞춤 등록하지 않는다.
학습 완료 등 운영 목적에 맞는 주요 이벤트 후보를 설명하되 모든 클릭을 주요 이벤트로 만들지 않는다.
GA 계정 접근이 가능할 때만 실제 보고서 설정을 적용하고, 문서만 있으면 계정 적용 미완료로 구분한다.

## Non-goals

Search Console, 히트맵, BigQuery, 전체 클릭 수집, 로그인 추적, 추가 스크롤 단계,
메일 발송 기능, 데모 zone 내부 상호작용 수집은 제외한다.

## Design

- lib/analytics.ts: 외부 공개 API 및 타입 재노출.
- lib/analytics/{events,context,payload,transport,dom-events}.ts: 이벤트 계약·문맥·검증·전송·위임 변환.
- components/analytics/AnalyticsTracker.tsx: 루트 1개 클릭/의미 이벤트 리스너 소유.
- components/analytics/ContentAnalyticsBoundary.tsx: 서버가 전달한 현재 콘텐츠 메타데이터 경계.
- components/analytics/ContentViewTracker.tsx: 문서/데모/시각화 진입의 공통 수명주기.
- packages/ui 및 docs-render: data 속성 또는 의미 있는 DOM CustomEvent만 제공.
  클립보드 성공과 검색 결과 표시는 click 위임으로 추정하지 않고 발생 주체에서 알린다.
- 새 공유 전송 패키지는 만들지 않는다. 필요한 DOM 계약 타입은 GA와 무관한 UI 계약으로 두고
  shell의 DOM 어댑터에서 런타임 검증한다. 서버→클라이언트에 함수 props를 넘기지 않는다.
- 모든 파일은 250줄 이하로 유지한다. DOM 전역 스캔 대신 콘텐츠 경계와 명시적 data 속성을 쓴다.

## Acceptance criteria

- [ ] R1 기존 8종 이벤트의 계약·트리거 회귀 검증과 단일 전송 경계 확인.
- [ ] R2 복사 성공/실패, 검색 0건·IME·빠른 클릭·모바일 숨김, 중복 클릭 분류 검증.
- [ ] R3 현재 문서 귀속 및 원문/식별정보 누출 방지 검증.
- [ ] R4 세션 중복 응답 방지, 스토리지 실패, 키보드 조작 검증.
- [ ] R5 직접 진입·내부 이동·뒤로/앞으로·재진입의 실제 이벤트 수 확인.
- [ ] R6 운영 문서와 보고서 설정 절차 작성, 실제 계정 적용 여부 별도 기록.
- [ ] 관련 단위 테스트·타입 검사·셸 빌드 통과와 브라우저 검증 기록.

## Open questions

구현 설계에 남은 선택 사항 없음. GA 계정 접근 권한/향상된 측정 설정은 실행 단계에서 확인한다.
계정 접근 불가는 코드 검증과 운영 문서 작성을 막지 않으나 계정 적용 완료를 의미하지 않는다.
