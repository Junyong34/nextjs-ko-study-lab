# GA4 콘텐츠 분석 운영 가이드

Search Console은 이미 연결되어 있으며 이번 변경 대상에서 제외한다. 이 문서는 이벤트 계약과 운영자가 만들 보고서의 설정 절차다. **GA 계정의 맞춤 정의·탐색 보고서 적용 및 DebugView 수신 확인은 아직 수행하지 않았다.** 코드·브라우저 검증 결과는 [작업 계획](../../intent/ga-content-insights/plan.md)의 Verification results에 별도로 기록한다.

## 수집 구조와 공통 문맥

셸의 `src/lib/analytics.ts`가 공개 API이며 내부 `analytics/`에서 이벤트 계약, 문맥, 검증, DOM 변환, 전송을 관리한다. `sendGAEvent` 호출은 전송 어댑터 하나에 둔다. 루트 `AnalyticsTracker`가 클릭과 UI 의미 이벤트를 수신하고 `ContentViewTracker`가 화면 진입을 기록한다. UI·마크다운 패키지는 GA SDK를 사용하지 않는다.

공통 값은 `page_path`(쿼리·해시 제외), `content_id`, `content_group`, `content_type`, `ui_location`이다. 문서는 기존 `doc.path`를 식별자로 사용한다. 콘텐츠 유형은 document/demo/visualize/hub/other이고, 문서 그룹은 매니페스트의 분류다. 같은 글의 조회·복사·피드백을 반드시 같은 `content_id`로 비교한다.

검색어 원문과 원문 해시, 코드 본문, 이메일·문의 내용, 임의 DOM 텍스트는 보내지 않는다. `search_topic`은 허용된 문서 제목·기술 키워드에 대응할 때만 정규화된 분류를 쓰고 나머지는 `other`다. 따라서 **임의 검색어 목록이나 원문별 검색 분석은 제공하지 않는다.**

## 이벤트 사전

아래 추가 값 외에 공통 문맥이 붙는다. 수집은 GA 설정과 방문자 환경에 따라 누락될 수 있다.

| 이벤트 | 실제 발생 조건 | 추가 값 / 해석 |
|---|---|---|
| learning_progress_toggle | 학습 기록 체크 변경 | kind, item_key, completed. 실제 이해도 아님 |
| learning_complete | 문서 학습 완료 체크 | doc_id, chapter. 완독 증거 아님 |
| demo_click | 데모 링크 활성화 | demo_type, from_doc |
| github_star_click | GitHub 팝업 동작 | action. go_to_repo도 실제 Star 등록 아님 |
| share_click | 공유 링크 활성화 | share_url, page_path. 실제 공유 완료 아님 |
| demo_view | 데모 화면 진입·선택 변경 | zone, demo_url, demo_title |
| book_click | 홈 책장 선택 | book_type, chapter_step, chapter_title |
| visualize_view | 시각화 화면 진입 | demo_key, demo_title, group |
| content_view | 문서 화면 진입 | 글별 조회 사용자 분모. page_view에 합산하지 않음 |
| code_copy | 클립보드 쓰기 성공 | code_block_id, code_language. 실패 시 미발송 |
| content_search_results | 사이드바 검색 결과 표시 후 입력 500ms 안정 또는 빠른 결과 선택 | search_surface, search_topic, result_count |
| search_result_click | 현재 검색 결과의 이동 가능한 링크 활성화 | search_surface, search_topic, target_path |
| toc_click | 목차·용어 색인 앵커 활성화 | section_id, ui_location |
| doc_navigation_click | 일반 문서 링크 활성화 | target_path, ui_location. 검색·데모·공유 전용 이벤트와 중복하지 않음 |
| content_feedback | 문서의 최초 도움 여부 응답 | rating = helpful / unhelpful |

검색 결과 수는 이동 가능한 고유 URL 수다. 빈 검색·IME 조합 중·숨겨진 모바일 서랍은 결과 표시로 세지 않는다. 같은 검색어·결과의 연속 렌더링을 중복 집계하지 않지만 A→B→A는 새 실행이다. 이번 대상은 문서/데모 사이드바 검색이며 데모 색인 검색과 학습 기록 필터는 제외한다.

`content_search_results`는 수동 트리 검색 이벤트다. 향상된 측정의 URL 기반 `view_search_results`와 합쳐 같은 검색 실행 수로 해석하지 않는다.

피드백은 일반 문서 본문 하단에만 있고 README 인덱스에는 없다. 탭 세션·문서마다 최초 응답만 허용한다. `study_content_feedback_v1` sessionStorage를 사용하며 접근 실패 시 메모리로 유지한다. 저장소가 차단된 상태의 전체 새로고침까지 메모리 상태를 보존할 수는 없다. UI의 선택 확인은 GA 수신·서버 저장 성공을 뜻하지 않는다. 기존 mailto 문의와 별개다.

## GA 맞춤 정의 등록

운영자가 GA 속성의 관리 → 데이터 표시 → 맞춤 정의에서 아래 항목을 **이벤트 범위 맞춤 측정기준**으로 등록한다. 표시 이름은 한국어로 정하되 이벤트 매개변수 철자는 그대로 입력한다. 이미 존재하는 정의는 중복 생성하지 않는다.

| 매개변수 | 용도 |
|---|---|
| content_id | 글별 조회·복사·피드백 연결 |
| content_type | 문서/데모/시각화 등 유형 필터 |
| ui_location | 클릭 발생 위치 |
| rating | 긍정/부정 응답 분리 |
| search_surface | 검색 UI 구분 |
| search_topic | 허용된 검색 주제 분류 |
| result_count | 0건 결과 필터. 수치 합계 지표로 사용하지 않음 |

`content_group`은 기본 제공 콘텐츠 그룹 측정기준을 먼저 사용한다. `page_path`는 기본 페이지 경로와 비교하며 별도 맞춤 등록은 필요할 때만 한다. `code_block_id`, `target_path`, `section_id`처럼 고유 값이 많아지는 키는 처음부터 등록하지 않는다. `code_language`도 언어별 분석이 실제로 필요할 때 추가한다.

새 맞춤 정의가 일반 보고서·탐색에 표시되기까지 지연이 있을 수 있다. 등록 이전 자료가 소급하여 채워지는 것으로 가정하지 않는다. 정확한 적용 상태는 계정에서 확인한다. [공식 맞춤 측정기준 안내](https://support.google.com/analytics/answer/14240153?hl=ko)

## 탐색 보고서 3개 구성

GA 탐색 → 새 탐색 → 자유 형식에서 다음 3개를 각각 만든다. 공통 기본 기간은 최근 완료된 28일로 하고 이전 28일과 비교한다. 탐색 UI에서 기간 비교가 제공되지 않는 경우 탐색을 복제해 이전 28일로 설정하고 나란히 보거나 두 기간의 표를 내보낸다. 계산·기간 비교가 설정됐는지 확인하지 않고 완료로 기록하지 않는다.

변수 영역에서 필요한 측정기준·측정항목을 가져온 다음 탭 설정의 행·열·값·필터로 옮긴다. 보고서마다 기기 카테고리, 콘텐츠 유형, 콘텐츠 그룹 필터를 필요한 탭에 적용한다. `content_type` 필터를 기본 page_view에 걸면 해당 맞춤 값이 없는 기본 이벤트가 제외될 수 있으므로 전체 요약의 기본 지표와 커스텀 콘텐츠 탭을 구분한다. [공식 자유 형식 탐색 안내](https://support.google.com/analytics/answer/9327972?hl=ko)

### 1. 전체 요약

1. 날짜, 기기 카테고리, 이벤트 이름, 콘텐츠 유형을 가져온다.
2. 활성 사용자, 세션, 조회수, 사용자당 평균 참여시간, 이벤트 수를 가져온다. 속성 UI에서 제공하는 참여시간 지표의 정확한 이름과 분모를 확인한다.
3. 기본 탭은 날짜를 행, 기기 카테고리를 열, 활성 사용자·세션·조회수를 값으로 둔다. 필요하면 날짜/활성 사용자 선 그래프를 별도 탭으로 만든다.
4. 참여시간은 별도 표로 확인한다. 참여시간은 페이지에 초점이 있던 시간이며 이해도·완독률이 아니다.
5. 학습 완료 탭은 이벤트 이름 = `learning_complete`, 콘텐츠 그룹/콘텐츠 ID를 행, 이벤트 수·총 사용자를 값으로 둔다.
6. 콘텐츠 유형 탭은 이벤트 이름이 `content_view`, `demo_view`, `visualize_view` 중 하나인 이벤트만 필터하고 콘텐츠 유형별 이벤트 수·총 사용자를 표시한다. 이 이벤트 수를 기본 조회수에 더하지 않는다.

### 2. 글별 성과

1. 콘텐츠 ID, 콘텐츠 그룹, 이벤트 이름, rating을 가져온다. 측정항목은 총 사용자·이벤트 수다.
2. 조회 탭은 이벤트 이름 = `content_view`, 콘텐츠 ID·그룹을 행, 총 사용자·이벤트 수를 값으로 둔다.
3. 복사 탭은 이벤트 이름 = `code_copy`, 동일한 행·기간·그룹 필터, 총 사용자·이벤트 수를 값으로 둔다.
4. 피드백 탭은 이벤트 이름 = `content_feedback`, 콘텐츠 ID를 행, rating을 열, 이벤트 수를 값으로 둔다.
5. 복사 사용자 비율은 **같은 글의 code_copy 총 사용자 ÷ content_view 총 사용자**다. 이벤트 수끼리 나누지 않는다. 피드백 긍정 비율은 **helpful 이벤트 수 ÷ helpful+unhelpful 이벤트 수**다. 항상 전체 응답 수도 표시하고 분모가 0이면 비율은 표시하지 않는다.
6. 이벤트별 서로 다른 필터의 비율을 탐색에서 직접 계산하기 어려우면 위 탭을 나란히 사용한다. 내보낸 표에서 계산할 때도 같은 글·기간·기기/그룹 필터를 맞춘다. 검증되지 않은 GA 계산 측정항목이나 자동 결합이 구현됐다고 가정하지 않는다.

참고: GA의 사용자 수는 이벤트 집합별 고유 사용자 수이므로 각 글 사용자 수의 합이 전체 사용자 수와 일치하지 않는다. 수집 차단·기간 경계 등의 영향도 있으므로 복사 비율을 학습 성공률로 해석하지 않는다.

### 3. 검색 / 탐색

1. search_surface, search_topic, result_count, ui_location, 이벤트 이름을 가져온다. 값은 이벤트 수·총 사용자다.
2. 검색 표시 탭은 이벤트 이름 = `content_search_results`, search_surface·search_topic을 행, 이벤트 수를 값으로 둔다.
3. 0건 탭은 앞 탭을 복제하고 result_count가 `0`인 필터를 추가한다.
4. 검색 클릭 탭은 이벤트 이름 = `search_result_click`, 동일한 행과 기간을 사용한다. 한 검색에서 여러 링크를 누를 수 있으므로 클릭 수/표시 수를 사용자 전환율로 부르지 않는다.
5. 탐색 탭은 이벤트 이름이 `toc_click` 또는 `doc_navigation_click`인 이벤트만 필터하고 ui_location을 행, 이벤트 이름을 열, 이벤트 수를 값으로 둔다.
6. 검색 결과 없음 비율은 **0건 탭 이벤트 수 ÷ 전체 검색 표시 탭 이벤트 수**다. 직접 계산이 불가능하면 표를 나란히 두고 동일한 조건으로 내보내 계산한다.

`other`가 많다고 그 안의 임의 검색어를 복원할 수는 없다. 허용된 주제의 결과 없음과 탐색 행동을 콘텐츠 보강의 근거로 사용한다.

## 주요 이벤트와 운영 점검

`learning_complete`는 사용자의 명시적 완료 표시를 운영 목표로 삼을 때 주요 이벤트 후보가 된다. 복사나 모든 클릭을 일괄 주요 이벤트로 만들지 않는다. 피드백 응답 자체와 긍정 응답을 혼동하지 않는다.

배포 후 확인할 항목:

- [ ] GA 속성의 향상된 측정과 브라우저 기록 기반 페이지 변경 설정 확인.
- [ ] 직접 진입 → 문서 Link 이동 → 뒤로 → 앞으로에서 page_view 횟수와 page_location/page_referrer 확인. 근거 없이 수동 page_view를 추가하지 않음.
- [ ] DebugView에서 기존 8종 및 신규 이벤트의 매개변수·문서 귀속 확인. dataLayer 호출, 네트워크 요청, GA 수신은 서로 다른 검증 수준으로 기록.
- [ ] 복사 실패 시 미발송, 빠른 검색 선택·0건·IME·모바일 숨김 상태, 피드백 중복·저장소 차단 확인.
- [ ] 맞춤 정의 등록 후 수집된 자료로 탐색 3개 생성 및 분모·필터 검산.
- [ ] 계정 적용 날짜·담당자·보고서 이름과 접근 가능한 링크 기록.

현재 계정 적용 기록: **없음 — 맞춤 정의 등록, 탐색 생성, GA 실수신 및 자동 페이지뷰 설정 확인은 운영 후속 작업이다.**
