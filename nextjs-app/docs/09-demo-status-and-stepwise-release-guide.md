# 09. 실습 예제 상태 관리 및 단계별 오픈 가이드

데모 공개 상태와 화면별 노출 규칙을 관리하는 대표 문서다. 제작 절차는 [05](./05-zone-onboarding-checklist.md), 제작 표준은 [03](./03-demo-standard-and-layout-pattern.md)을 따른다.

## 1. 현재 등록 상태와 확인 범위

2026-09-05 기준 `packages/demos/demos.yaml`과 `demos-manifest.json`을 대조했다.

| 등록 합계 | 공개 대상으로 지정 (`done`) | 준비 중 (`stub`) | 작업 중 (`wip`) |
|---:|---:|---:|---:|
| 241 | 25 | 216 | 0 |

이 수치는 메타데이터 상태다. 코드의 존재, 전체 데모의 동작 검증, 현재 배포 환경의 정상 동작을 증명하지 않는다. 검증 기록에는 대상 URL·커밋·환경·수행 절차·관찰 결과를 별도로 남긴다.

## 2. 상태와 단일 원본

| 값 | 운영 의미 |
|---|---|
| `stub` | 준비 중. 코드가 이미 있어도 공개 전이면 이 상태를 사용할 수 있다 |
| `wip` | 제작 또는 수정 중 |
| `done` | 학습자 실행 대상으로 공개하도록 지정 |

상태 원본은 `demos.yaml`이다. 셸의 `getDemos()`는 `loadDemos()`로 YAML을 읽고 렌더러에 데이터를 전달한다. 공유 zone 메타데이터는 `demos-manifest.json`을 import한다. 두 소비 경로를 맞추기 위해 YAML 수정 뒤 매니페스트를 재생성하고 앱을 빌드·배포한다. 생성 JSON은 직접 편집하지 않는다.

## 3. 화면별 현재 동작

다음은 2026-09-05 코드 대조 결과이며 브라우저 전수 검증 결과가 아니다.

| 화면 | 현재 처리 | 코드 근거 |
|---|---|---|
| 사이드바 | `done`만 노드의 데모 목록·개수·재생 표시 계산에 사용. 공개 데모가 없으면 예제 모드에서 `demoFeasibility: not-applicable`은 설명 대체, 그 외는 준비 중으로 표시 | `apps/shell/src/lib/docs.ts`, `packages/ui/src/nav/doc-tree/` |
| `/demo` 색인 | 전체 데모를 검색·필터 대상으로 전달. `stub`·`wip` 카드에는 준비 중 배지 표시 | `apps/shell/src/lib/demo-index.ts`, `DemoIndexClient`, `DemoStatusBadge` |
| 문서 하단 카드 | 연결된 전체 데모를 표시하고 미공개 항목에 준비 중 표시 | `packages/docs-render/src/markdown/MarkdownRenderer.tsx`, `DocDemoList` |
| 본문 `demo` 지시자 | 상태 필터·배지 없이 `/demo/{url}` 링크 생성 | `packages/docs-render/src/demo/DemoLinkCard.tsx` |
| 직접 `/demo/{url}` | `done`이 아니면 `DemoEmptyState`, `done`이면 뷰어 | `apps/shell/src/app/demo/[...slug]/page.tsx` |
| 문서별 `/demo/{문서 경로}` | 연결된 `done`이 없으면 준비 중. 하나 이상 있으면 전체 연결 데모를 허브에 전달 | 같은 라우트, `DocDemoHub` |
| 문서별 허브의 `?run=` | 선택 결과의 상태를 다시 검사하지 않고 뷰어에 전달. 아래 후속 항목 참고 | 같은 라우트 |
| 학습 기록 | `done`만 데모 inventory에 포함 | `apps/shell/src/lib/learning-progress/inventory.ts` |
| 홈 책장 | 카테고리별 `done` 개수를 계산하고 공개 예제가 있는 경우 예제 책 표시 | `RoadmapBookshelf` |
| 홈 추천 카드 | `FeaturedDemosSection`의 고정 목록. 상태 필터 없음 | `apps/shell/src/components/home/FeaturedDemosSection.tsx` |
| sitemap | `done` 데모의 직접 URL만 포함 | `apps/shell/src/app/sitemap.ts` |

공개 상태는 접근 권한이나 보안 경계가 아니다. 내부 `/zone/*` 경로에 상태 기반 차단이 있다고 가정하지 않는다.

## 4. 단계별 공개 절차

모든 명령은 저장소 루트에서 실행한다.

1. 대상 데모를 로컬에서 확인한다: `pnpm dev`. 예를 들어 `/demo/caching/basic`과 셸 프록시 `/zone/cache/caching/basic`, 직접 zone 서버 `http://localhost:3002/zone/cache/caching/basic`의 차이를 확인한다. 아직 미공개이면 셸의 직접 데모 URL은 준비 중 화면이므로 내부 경로에서 동작을 점검한다.
2. 가이드 절차, 실제 결과, 오류·초기화 흐름을 기록한다. 배포 의존 기능은 해당 환경의 증거도 필요하다. 학습 문서의 완료 상태도 확인한다.
3. 대상 `demos.yaml` 항목만 `done`으로 변경한다.
4. `pnpm --filter @study/demos lint`로 문서·라우트·지시자를 검사하고, `pnpm --filter @study/demos build`로 생성 JSON을 갱신한다. 경고도 검토한다.
5. `pnpm test:manifest`와 대상 기능의 검증을 수행한다. 앱 빌드·재배포 후 목록, 직접 진입, 문서별 허브, 학습 기록에 반영됐는지 확인한다.
6. `git diff`를 검토하고 변경한 문서·데모 파일 및 YAML·생성 JSON만 명시적으로 스테이징한다. 커밋 형식은 루트 작업 규칙을 따른다.

## 5. 별도 구현 후속 항목

이번 문서 정비에서는 다음 코드를 변경하지 않았다.

- **공개 상태 재검사**: 문서별 허브에 공개 데모가 하나 이상 있으면 `?run=`이 미공개 또는 다른 문서의 데모를 선택할 수 있다. 잘못된 값도 첫 항목으로 대체된다. 직접 URL과 같은 공개·소속 검증이 필요한지 별도 구현에서 해결한다.
- **홈 추천 목록**: 고정 목록을 공개 상태와 대조하지 않는다. 상태 변경 때 추천 카드가 준비 중 대상으로 연결될 수 있다.

수정·검증 전에는 “미공개 데모 실행이 모든 경로에서 차단된다” 또는 “추천은 검증 완료된 데모로만 구성된다”고 설명하지 않는다.
