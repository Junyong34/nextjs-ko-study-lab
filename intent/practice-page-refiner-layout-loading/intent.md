Intent: 레이아웃 상태 보존·중첩 로딩 실습 두 개 재구성
Author: Codex
Status: done
Approval: 2026-09-21 현재 대화에서 사용자가 제시한 intent/spec/plan에 “승인”으로 명시 승인. main 작업·커밋만 수행하며 PR/push는 하지 않는다. 같은 날 이어받은 세션이 구현 검증·버그 수정·done 전환까지 완료(상세는 plan.md).

## Problem

현재 demos.yaml에서 stub인 두 항목을 선정했다.

| 대상 | 제목 | 코드에서 확인한 문제 |
|---|---|---|
| file-conventions/layout/state-preservation | 클라이언트 상태 보존 중첩 레이아웃 | layout.tsx·하위 페이지·Link가 없고 page 내부 useState 입력 하나뿐이다. 이동 후 상태 보존을 확인할 수 없다. |
| file-conventions/loading/nested-segment-loading | 중첩 라우트 세그먼트 로딩 격리 | loading.tsx·중첩 라우트·서버 비동기 처리가 없다. animate-pulse 박스가 계속 표시되어 실제 로딩 종료가 없다. |

둘 다 page.tsx에서 VerificationFooter를 props 없이 렌더링한다. 실제 이동·입력·fallback·완료를 관측하지 않으며, 대기 설명과 함께 ExpectedActualPanel의 문자열 자동 비교로 불일치 배지가 계산된다.

| 기존 영역 평가 | 상태 보존 | 중첩 로딩 |
|---|---|---|
| 가이드 | 수정 필요: 존재하지 않는 하위 페이지 전환을 요구 | 수정 필요: 실제 경계·전환 없이 스트리밍을 주장 |
| 실습화면 | 수정 필요: 파일 컨벤션과 이동 대상 없음 | 수정 필요: 고정 스켈레톤만 표시 |
| 검증 | 수정 필요: 상태·경로 미전달 | 수정 필요: fallback·완료·상위 조작 관측 없음 |
| 개념 정리 | 수정 필요: 구현에 없는 Drawer·탭, 리렌더 원천 차단 과장 | 수정 필요: 구현에 없는 중첩 경계·서버 데이터 흐름 설명 |

두 주제는 실제 브라우저 이동과 요청/화면 관찰로 학습 가능하므로 모두 REBUILD로 제안한다. 공통 4단 UI는 유지한다.

## Proposed outcome

- 상태 보존: 상품 검색어 입력 → 실제 Link로 다른 상품 카테고리 이동 → 경로·상품 화면은 바뀌고 공유 layout의 입력값·마운트 인스턴스는 유지되는 것을 비교한다.
- 중첩 로딩: 상품 카탈로그 진입 → 상위 fallback·완료 관찰 → 상세 페이지 이동 → 하위 fallback 동안 이미 표시된 상위 UI 조작 → 상세 완료를 확인한다.
- 검증은 실제 경로, 입력 스냅샷, fallback 마운트와 완료 순서, 로딩 중 사용자 조작에 근거한다. 조건 미충족을 완료로 표시하지 않는다.
- 구현과 런타임·코드 검증을 마친 두 항목만 done으로 전환한다.

## Affected users and systems

Next.js App Router의 layout 생명주기와 loading 경계 배치를 배우는 학습자. demo-baseline의 위 두 실습 디렉토리, demos.yaml, 생성 매니페스트와 이 intent 기록이 대상이다.

## Constraints

- 사용자 지시대로 main에서 작업한다. 앞선 요청의 커밋만 수행/no push 방침을 유지한다.
- Next.js 16.3.2·React 19, 신규 의존성 없음, 파일당 250줄 이하.
- 실제 layout.tsx/loading.tsx/하위 page.tsx/Link를 사용한다. useState 탭 전환이나 브라우저 타이머로 라우터·fallback을 흉내 내지 않는다.
- 관찰 시간을 위한 지연은 서버의 실제 비동기 경계 안에만 두고 교육용 지연임을 표시한다.
- 리렌더와 리마운트를 구분하고 Client Component가 절대 리렌더되지 않는다고 설명하지 않는다.
- 같은 폴더의 loading.tsx가 해당 layout.tsx의 await까지 감싼다고 설명하지 않는다.
- 다른 실습/공통 컴포넌트/Next 설정은 수정하지 않는다. 공개 메타데이터와 기록은 동기화 범위다.

## Sources

next-devtools nextjs_docs가 설치 버전 16.3.2 및 번들 공식 문서 경로를 확인했다. nextjs_index로 3000/3001/3002를 확인했고 nextjs_call(get_project_metadata, 3001)이 현재 저장소 demo-baseline임을 확인했다. API 근거는 해당 버전의 layout.md, loading.md이며 이는 런타임 동작 검증 결과가 아니다.

공식 문서:
- https://nextjs.org/docs/app/api-reference/file-conventions/layout
- https://nextjs.org/docs/app/api-reference/file-conventions/loading

## Orca 검토

Run run_8666cfdd45f5, Task task_349c3d8b52dc, Dispatch ctx_b2826493ec73: 읽기 전용 평가 완료. 두 페이지 모두 네 영역 수정 필요 및 REBUILD 판정. 완료 보고를 수신하고 worker-release로 작업자 터미널을 정리했다.

서버 지연은 fallback 관찰 시간을 확보하는 교육용 비동기 작업으로 명시한다. 상품 데이터 복사를 추가하지 않고 기존 MOCK_PRODUCTS를 재사용한다. prefetch=false만으로 fallback이 항상 즉시 표시된다고 보장하지 않으며 실제 관측값에 따라 판정한다.

## Open questions

없음. 현재 계획에 대한 사용자 명시 승인을 받았다.
