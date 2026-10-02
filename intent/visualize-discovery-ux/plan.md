Plan: /visualize 검색 중심 탐색과 상세 진입 개선
Spec: ./spec.md
Author: Codex
Status: approved
Approval: intent.md의 2026-10-02 현재 대화 승인과 동일. 후속 사용자 “작업한 코드만 커밋 해줘”로 이번 작업의 main 로컬 커밋 승인. PR 머지·push·배포는 없으므로 approved를 유지한다.

## Steps

1. 셸 components/visualize에 표시용 요약·검색·URL 상태·복귀 저장 모듈을 분리한다.
2. 기존 펼침 카드를 행 링크로 교체하고 검색·필터·빈 상태를 조립한다.
3. 상세 외곽·관련 항목·복귀 링크를 정리한다. 기존 demo 쿼리 연결을 지원한다.
4. 의미 있는 검색·저장 계약 테스트, 타입·빌드와 브라우저 수용 검증을 실행한다.
5. DESIGN.md, nextjs-app/docs/01-ui-and-screen-design.md와 작업 인덱스를 갱신한다.

## Verification

- 셸·UI tsc --noEmit, 셸 next build.
- 검색 ISR/use cache/캐시·복수 검색어·빈 결과·IME, 그룹·쿼리·새로고침·뒤로가기·legacy demo.
- 목록 복귀·저장소 실패/만료, 390/768/1440px·다크·키보드·reduced-motion.
- timeline/nextjs/cache-components 대표 상세의 컨트롤과 기존 분석 계약.

## Rollback

이번 작업의 셸·문서 변경만 되돌린다. 데이터 마이그레이션은 없다.

## Verification results

- 로컬 수용 검증 통과. 로컬 커밋은 후속 사용자 승인에 따른다. PR 머지·배포가 없으므로 Status는 approved를 유지한다.
- `node --test --experimental-strip-types nextjs-app/packages/test-suite/src/tier1-feature-coverage/26-visualize-discovery-ux.test.ts`: 4/4 통과(검색 다중 필드·정규화, 저장 계약, 만료/잘못된 값, 저장소 차단).
- 셸·UI의 `./node_modules/.bin/tsc --noEmit`: 통과.
- 셸 `./node_modules/.bin/next build` (Next.js 16.3.2 / Turbopack): 통과. /visualize 정적 목록과 17개 상세를 포함해 835페이지 생성.
- Chrome 로컬 브라우저: 전체/그룹 17·6·5·6개, ISR 2개·use cache 5개·캐시 8개·ISR cache 2개, 빈 결과와 초기화, IME 조합 중 URL 보존 및 종료 후 갱신, 검색 지우기와 입력 포커스 통과.
- URL 직접 진입·새로고침·group 뒤로가기·잘못된 demo/group(전체 17개)·legacy demo 연결 통과. legacy 상세 전환 중 복원 컨텍스트가 삭제되는 초기 충돌을 수정하고 재검증했다.
- 목록 버튼과 브라우저 뒤로가기 모두 q/group URL 및 선택 항목 포커스 복원 통과. sessionStorage 차단·1시간 만료·직접 상세 진입은 기본 목록 링크로 정상 복귀.
- 390/768/1440px 각각 light/dark에서 목록의 페이지 가로 넘침 없음. 필터 44px 높이 및 모바일 줄바꿈 확인. 키보드 focus outline과 reduced-motion의 transform:none 확인.
- 대표 내부 조작: streaming-timeline 일시정지·처음부터·속도 변경, render-tree 일시정지·세그먼트 선택, cache-lifetime minutes/hours 선택과 표시 변화 정상.
- 실제 dataLayer: cache-lifetime 상세에서 visualize_view 기존 파라미터 확인. 목록 검색·필터 변경 시 이벤트 증가 없음, isr-timeline 상세 진입 시 1건 추가 확인. GA 관리 화면 수신·Production은 미검증.
- Next.js MCP get_errors: configErrors/sessionErrors 없음. dev의 기존 html scroll-behavior smooth 안내 경고는 전역 UI 범위 밖으로 유지.
- 검토 이미지: .playwright-mcp/visualize-after-desktop.webp, visualize-after-mobile-dark.webp, visualize-after-detail-mobile.webp (로컬 검토 산출물, 커밋 대상 아님).
- 내부 캔버스·모델·최소 폭은 유지. 일부 모바일 내부 가로 스크롤은 범위 밖이다. 검증 당시 커밋·push·배포 미실행. 이후 사용자 요청으로 이번 작업의 로컬 커밋만 승인됐다.

### 제목 영역 구분 보강 — 2026-10-02 후속 승인

- 사용자 “수정 해줘” 승인에 따라 페이지 제목 아래 1px 경계·24px 여백, 그룹 제목 18px/700, 중성 개수 배지를 적용했다.
- 셸 tsc --noEmit 통과. 1440/390px 각각 light/dark에서 스타일 적용과 페이지 가로 넘침 없음을 확인했다.
- 검토 이미지: .playwright-mcp/visualize-title-refined.webp. 스타일 전용 후속 변경이므로 빌드는 재실행하지 않았다(앞선 전체 구현 빌드는 통과).

### Git 전달 승인

- 2026-10-02 사용자 “작업한 코드만 커밋 해줘”에 따라 구현·테스트·관련 문서만 main에서 로컬 커밋한다.
- 다른 작업의 staged Sass 삭제와 dirty/untracked 변경, .playwright-mcp 검토 산출물은 포함하지 않는다. push·배포는 수행하지 않는다.
