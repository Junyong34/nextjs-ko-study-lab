Plan: `app-shell` 도착 시각 측정 확장
Spec: ./intent.md#requirements--spec-통합
Author: Claude (초안)
Status: approved
Approval: 2026-10-05 대화 승인(intent.md와 동일 지시). 변경 이유와 범위는 [`intent.md`](./intent.md) Approval 참고.

## Scope of change

`z/c` = `nextjs-app/apps/demo-cache-components/src/app/zone/cache`, 모든 경로는 `z/c/guides/adopting-partial-prefetching/app-shell/` 기준.

| 변경 | 파일 |
|---|---|
| 신규 | `lib/catalog.ts`(`'use cache'` 함수 2개: 긴 stale, 짧은 stale), `components/Mark.tsx`(클라이언트 마커), `components/Areas.tsx`(영역 A~D 서버 컴포넌트), `components/ArrivalTable.tsx`(도착 시각 표), `lib/arrival.ts`(관계 판정) |
| 수정 | `components/ProbeContext.tsx`(클릭·도착 기록 추가), `components/LinkGrid.tsx`(클릭 기록), `partial/[id]/page.tsx`·`legacy/[id]/page.tsx`(영역 렌더), `components/Verification.tsx`·`lib/judge.ts`(판정 확장), `components/ConceptCard.tsx`·`layout.tsx`(가이드·개념 정리), `components/Detail.tsx`(영역 C·D 재사용 또는 흡수) |
| 갱신 | `intent/README.md` 인덱스, `docs/09`는 수치 변동 없음 |

`next.config.ts`·공유 패키지·`demos.yaml`(status)은 바꾸지 않는다.

## Steps

0. **교차 검증(읽기 전용)**: `cacheLife` 문서의 Prerendering behavior(stale 30초~5분은 프리렌더 포함·App Shell 제외, expire 5분 미만은 프리렌더 제외)를 확인했다. 영역 B2는 `cacheLife({ stale: 60, revalidate: 900, expire: 3600 })`로 "프리렌더 포함·App Shell 제외" 구간에 둔다.
1. `lib/catalog.ts`: 영역 B(`cacheLife('hours')`)와 B2(`cacheLife({ stale: 60, … })`)용 `'use cache'` 함수를 만든다. 둘 다 id를 인자로 받지 않는다(URL에 의존하면 셸에 못 들어간다). 태그에 `guides-adopting-partial-prefetching-app-shell:` 접두사를 붙인다.
2. `ProbeContext`에 `recordClick(route, linkKind, id)`와 `markArrival(area)`를 추가한다. 클릭 시점의 `performance.now()`를 ref로 보관하고, 마커가 마운트될 때 `now - t0`를 도착 시각으로 저장한다. `LinkGrid`의 각 링크 `onClick`에서 클릭을 기록한다.
3. `components/Areas.tsx`와 두 도착 페이지에 영역 A·B·B2·C·D를 렌더한다. B2·C·D는 Suspense 안에 둔다(B2는 프리렌더 제외 구간일 수 있음, C·D는 요청 시점 데이터). 각 영역 안에 `<Mark area=…/>`를 둔다.
4. **측정 먼저**: cache zone production 빌드 후 로컬(접두사 제거 프록시)과 가능하면 배포 환경에서 링크 종류별로 클릭해 영역별 도착 시각을 여러 번 기록한다. 안정적으로 유지되는 관계만 골라 판정 기준으로 쓴다(`lib/arrival.ts`). 가설과 다르면 실측대로 서술을 바꾼다.
5. `ArrivalTable`·`Verification`·`ConceptCard`·가이드 단계를 갱신한다. 개념 정리에 영역 종류, App Shell, stale 5분 조건, 정적 셸과 App Shell의 차이를 쓰고 미확인 항목을 구분한다.
6. 인덱스에 행을 추가한다.

## Verification

모든 명령은 저장소 루트에서 실행한다.

- **정적 검사**: `pnpm --filter @study/demo-cache-components check-types`. 오류 0.
- **등록·매니페스트**: `pnpm --filter @study/demos lint`, `pnpm test:manifest`. 통과(등록 개수 변동 없음).
- **production 빌드**: `NEXT_DIST_DIR=.next-3912 pnpm exec next build`가 통과하고 도착 페이지가 `◐`로 표시된다.
- **브라우저 관찰**(`agent-browser`, production, 모바일 폭 포함): 링크 종류별 클릭 → 영역별 도착 시각 표 확인, 반복 3회 이상에서 판정 관계 유지, 검증 패널의 대기→검증 완료 전환, 375px 가로 넘침 없음.
- **회귀**: 기존 3개 판정(런타임 셸 1건, prefetch 링크, `prefetch={false}`)이 계속 일치. `demo-baseline`은 변경 없음.
- **리서치성 항목**: `cacheLife` 문서의 stale 임계값 서술이 실측(B2가 셸에서 제외되는지)과 일치하는지로 교차 검증한다. 불일치하면 실측을 우선한다.

## Rollback

커밋 전이므로 작업 트리에서 되돌린다. 신규 파일은 삭제하고, 수정 파일은 `git diff` 확인 후 `git checkout -- <파일>`로 복원한다. 커밋 이후에는 해당 커밋을 `git revert`한다. `.next-*/` 산출물은 gitignore 대상이다.

## Verification results

- 상태: 구현·로컬 production 검증 완료, **배포 환경 검증은 미실행**(커밋·push 전)
- 실행 환경: cache zone `next build` → `next start --port 3912`, 접두사(`/demo-static/cache`)를 벗기는 프록시 경유, `agent-browser`로 실제 클릭. 지연 환경은 프록시가 요청·응답에 각 150ms(왕복 300ms)를 더한 시험 환경이고 Next.js 동작 자체는 그대로다.
- **측정 결과(클릭 기준 ms, 지연 환경, 로드 3회에서 같은 패턴)**:
  - `cold`(어떤 링크도 prefetch 안 함): A·B·B2 **328~347**, C·D 972~984
  - `partial` 기본 링크: A·B·B2 5~20, C·D 약 970~979
  - `partial` `prefetch={false}`(상품 5): A·B·B2 7~18 — 같은 라우트의 다른 링크가 셸을 가져와 공유했기 때문
  - `partial` `prefetch`(상품 4)·`legacy` 기본: A·B·B2 5~17, C·D 약 970
  - 지연 없는 로컬: cold 29, 나머지 13~21, C·D 약 820 → prefetch 유무 차이가 드러나지 않음
- **가설 대비**: A·B(셸 포함)·C·D(셸 밖) 관계는 가설과 일치. **B2(stale 60초)는 B와 같은 시점(0~1ms 차)에 도착해 "App Shell에서 제외"라는 문서 서술을 확인하지 못했다.** 마운트 시각으로는 셸에 실려 왔는지 클릭 직후 응답으로 왔는지 구분되지 않으므로 문서와 다르다고 결론짓지 않고 개념 정리에 "확인하지 못한 것"으로 기록했다. 판정에서는 제외하고 참고로만 표시한다.
- **판정 동작**: 지연 환경에서 패널 `검증 완료`(요청 3종 + A·B 먼저 도착 + cold 비교 일치). 지연 없는 로컬에서는 cold 비교를 "비교 생략"으로 처리하고 나머지가 일치해 `검증 완료`.
- **정적 검사**: `pnpm check-types`(cache zone) exit 0, 오류 0. `pnpm --filter @study/demos lint` exit 0, `pnpm test:manifest` exit 0(등록 245, 전부 done, Layout Contract 경고 없음). production 빌드 통과, 도착 페이지 `◐`.
- **모바일 폭**: 375px에서 문서 폭 360px(가로 넘침 없음).
- **구현 중 바꾼 점**: 처음에는 prefetch 유무 비교가 `partial` 라우트의 `prefetch={false}` 링크로 가능하다고 봤으나, 같은 라우트의 셸 공유 때문에 비교가 성립하지 않았다. 그래서 링크가 전부 `prefetch={false}`인 `cold/[id]` 라우트와 링크 그룹 E를 추가했다(plan의 파일 목록에 없던 항목, 승인 범위 안의 구현 변경).
- 미검증·남은 작업:
  - 배포 환경(Vercel) 관찰. 커밋·push 후 같은 측정을 한 번 수행하고 `cold`와 `partial`의 차이가 실제 네트워크에서 드러나는지 기록한다.
  - B2의 셸 포함 여부를 구분하는 다른 측정 방법(예: 클릭 직전 네트워크 요청 유무).
  - 세션 데이터(`cookies()`) 영역, 기본 링크의 PPR 런타임 요청 원인은 이번에도 확인하지 못했다.
  - 이 슬러그의 `Status`는 배포 환경 검증과 구현 PR 머지 전이라 `approved` 유지.
