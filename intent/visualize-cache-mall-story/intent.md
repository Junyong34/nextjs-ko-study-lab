Intent: /visualize "스터디몰" 캐시 스토리텔링 데모 추가
Author: Claude
Status: done
Approval: 2026-09-18 현재 대화의 플랜 모드에서 스토리·범위(핵심 3구역, cache-components 그룹 5번째 항목으로 등록, 버튼 클릭식 진행, 기존 4종 UI 비재사용·신규 디자인, "이해가 스토리보다 먼저" 원칙, 대표값만 사용)를 사용자와 반복 조율한 뒤 ExitPlanMode로 최종 승인받았다. 저장소 규칙상 단계 진입 승인은 PR 머지 전에는 효력이 없어 Status는 draft로 두되, 대화 승인에 따라 구현은 바로 진행한다(선례: `search-discoverability-accuracy`, `practice-page-refiner-forms-two` — 사용자 승인 후 PR 없이 코드·검증 진행). 2026-09-24 사용자 지시로 done 전환 — 구현 `09a6b71` main 반영 확인, 이후 셸 production build(GA 작업 `5957095` 검증, 834개 정적 페이지) 통과.

**2026-09-19 개편(같은 대화, 구현 후 사용자 피드백으로 승인 범위 내 개정)**: 최초 구현("손님 입장" 통합 버튼 하나가 세 구역을 동시에 갱신)에 대해 사용자가 "흐름이 눈에 안 들어오고 애니메이션 퀄리티가 낮다", "각 버튼도 Next.js cache 관련 버튼으로 만들어 누르면 그 흐름이 보이게 하라"고 피드백. 요구사항·완료 기준(3구역·5번째 항목·새 UI·이해 최우선)은 그대로 두고 상호작용 방식만 다음처럼 바꿨다 — 통합 버튼 대신 **버튼 자체가 실제 Next.js API**(use cache · `updateTag()` · `revalidateTag()` · `cookies()`) 4개로 분리하고, 각 버튼은 그 구역 하나에만 손님(요청)이 걸어 들어가 결과가 드러나는 자체 완결된 애니메이션을 재생한다. 세부는 plan.md 갱신 기록 참고.

**2026-09-19 2차 전면 개편(같은 대화, 사용자 재피드백)**: 위 개편본에 대해 사용자가 "제대로 동작도 안 하고 시각화도 안 돼 cache를 이해하기 힘든 수준", "기존 것을 유지하려 하면 더 엉망이 된다 — 다른 `/visualize` 페이지와 비교해 전면 개편"을 지시. 진단 결과 (1) 캐시 자체(요청이 캐시에서 끝나는지 원본 서버까지 가는지)가 그림에 없고 (2) 손님 아이콘이 바닥 선 위 점 하나라 의미가 없으며 (3) "자주 갱신"은 첫 요청부터 SWR, "오래 유지"는 영원히 FRESH라 대비가 없고 (4) 구역별 버튼이 "한 페이지 요청이 세 구역을 다르게 겪는다"는 스토리를 없앴다. 이에 매장 일러스트·손님 걷기 방식을 폐기하고, 잘 읽히는 기존 데모(`isr-cache`의 방문자→캐시→원본 서버 파이프라인, `cache-tags`의 요청→캐시 항목→응답 레인)의 검증된 패턴으로 **요청 추적 3레인** 그림으로 다시 만든다. 요구사항(3구역·5번째 항목·정확한 용어·독자적 그림)은 유지하되, "기존 4종 UI 비재사용" 항목 중 **DOM 컨트롤·설명 목록(`StructureControls`·`StructureNotes`)은 다른 페이지와 조작감을 맞추기 위해 재사용**하는 것으로 바꾼다(캔버스 그림은 여전히 새로 그린다). 상세는 아래 Design과 plan.md.

## Problem

`/visualize`의 "cache-components" 그룹에는 이미 4개의 캐시 시각화 데모(`cache-shell`, `cache-keys`, `cache-lifetime`, `cache-tags`)가 있다. 각각 상자 경계·키 조각·시간축·갈래 화살표 같은 추상 다이어그램으로 Next.js 16 `use cache`의 개념 하나씩을 정확하게 보여준다(근거: `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`). 그러나 개념이 서로 분리돼 있고 다이어그램이 추상적이라, 처음 배우는 사람은 "그래서 이 설정을 실제 서비스의 어느 화면에 왜 쓰는가"를 체감하기 어렵다.

## Proposed outcome

쇼핑몰이라는 하나의 익숙한 이야기 위에서 `cacheLife`(캐시 수명), `updateTag`/`revalidateTag`(태그 갱신), 캐시 불가능한 동적 렌더링 세 개념이 실전에서 함께 동작하는 모습을 사용자가 버튼을 눌러가며 눈으로 확인한다. 데모를 다 조작해 본 사람이 "이 화면엔 왜 이 캐시 설정을 썼는지, `cacheLife`의 시간 구간과 `updateTag`/`revalidateTag`의 차이가 실제로 어떻게 다른 결과를 만드는지"를 자기 말로 설명할 수 있게 되는 것이 목표다. 스토리·일러스트는 이 이해를 돕는 수단이며, 목표 자체는 아니다.

## Affected users and systems

- 사용자: `/visualize`에서 Next.js 16 Cache Components를 학습하는 사람.
- 시스템: `nextjs-app/apps/shell/src/app/visualize/`(갤러리·상세, 코드 변경 없이 자동 노출), `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`(등록), `toolkit/examples/CacheMallDemo.tsx`(신규), `toolkit/components/cache-components/paint-mall.ts`·`mall-model.ts`(신규).

## Requirements

- 필수:
  - 기존 `cache-components` 그룹의 5번째 `DemoMeta` 항목으로 등록한다(새 그룹·독립 페이지 아님).
  - 핵심 3구역만 다룬다 — 베스트셀러 진열대(`cacheLife`), 상품 상세 가격·재고(`cacheTag` + `updateTag`/`revalidateTag`), 장바구니/추천(캐시 불가·동적 렌더링).
  - 자동 반복재생이 아니라 사용자가 버튼을 눌러 진행하는 시나리오로 만든다. (2026-09-19 1차 개정: 버튼 자체가 실제 Next.js API 4개. **2차 개정**: 시뮬레이션 시계는 `isr-cache`처럼 흐르지만 요청은 사용자가 `페이지 요청` 버튼으로 보낸다 — 한 번의 페이지 요청이 세 레인을 동시에 지나며 레인마다 다른 결과를 겪는 것을 본다. `updateTag()`·`revalidateTag()`는 실제 API 이름을 단 버튼으로 남기고, 누르면 상품 캐시 항목의 상태가 바뀐 뒤 **다음 페이지 요청**에서 차이가 드러난다.)
  - `cacheLife`는 대표 프로필 2개("자주 갱신" vs "오래 유지")만, 갱신 방식은 `updateTag`/`revalidateTag` 2가지만 제시한다 — 모든 조합을 다 노출하지 않는다. (2차 개정: 시연 시계 안에서 revalidate·expire를 실제로 넘길 수 있도록 내장 프리셋 대신 **인라인 객체 프로필**을 시연용 축소값으로 쓴다 — `cacheLife({ revalidate: 8, expire: 18 })` vs `cacheLife({ revalidate: 20 })`. 인라인 객체는 실제 API이며 누락 속성은 default에서 상속된다(`cacheLife.md:35`). 실제 서비스에서는 `'minutes'` 같은 프리셋을 쓴다는 점을 문구로 밝힌다.)
  - 모든 인터랙션 결과에는 실제 Next.js 동작을 정확한 기술 용어로 설명하는 문구를 함께 보여준다(예: "`cacheLife`의 revalidate 구간을 지나 SWR로 응답했다"). 스토리를 위해 개념을 단순화하다가 틀린 설명이 되지 않게 한다. 근거는 기존 4종처럼 `nextjs-docs`의 실제 문서 경로를 인용한다.
  - 캔버스 그림은 기존 4종(`CacheFrame` 틀, `paint-shell`/`paint-life`/`paint-tags`의 그림체)을 그대로 재사용하지 않고 이 스토리에 맞춰 새로 설계한다. (2차 개정: DOM 컨트롤·설명 목록은 다른 `/visualize` 페이지와 조작감을 맞추기 위해 `StructureControls`·`StructureNotes`를 재사용한다.)
- 선택:
  - `CacheMallDemo.tsx` 하위에 컨트롤·범례용 작은 컴포넌트를 분리할 수 있다(250줄 제한 대응).

## Design

- **재사용(로직·엔진만)**: `.../model.ts`의 `LIFE_PROFILES`(중 대표 2개만 사용)·`lifeZone`·`tagResponse`·`taggedEntries` 순수 함수, `hooks/useCanvas.ts`, `toolkit/primitives/`(도형·선·타이포 저수준 유틸).
- **신규 설계(그림·레이아웃·UI)**: `paint-mall.ts`+`paint-mall-{types,helpers,guest,zones}.ts`(스터디몰 일러스트, 250줄 제한 대응 분리), `mall-model.ts`(구역별 순수 계산 함수), `CacheMallDemo.tsx`+`cache-mall/{Controls,Explain,useCacheMallStory}`(이 데모 전용 레이아웃 — `CacheFrame`을 쓰지 않되 공식 문서 링크·"개념 시각화" 고지 같은 필수 정보는 유지, 상태·타이밍은 `useCacheMallStory` 훅으로 분리).
- **진행 흐름(2026-09-19 2차 개정 — 요청 추적 3레인)**: 캔버스는 왼쪽 `브라우저` 노드 → 가로 레인 3개 → 오른쪽 `원본 서버` 노드로 구성한다. 레인 1 "베스트셀러 진열대"(`use cache` + `cacheLife`)와 레인 2 "상품 상세 · 재고"(`use cache` + `cacheTag('product:1')`)는 가운데에 **캐시 항목 노드**(버전 v1/v2, FRESH/STALE/EXPIRED/재생성 중 배지, 진열대는 revalidate·expire 눈금이 있는 나이 막대)를 두고, 레인 3 "장바구니"(`cookies()`)는 캐시 노드 없이 서버로 직행한다. 시뮬레이션 시계(재생/일시정지/속도/+5s 건너뛰기)가 흐르며 진열대 나이가 눈금을 넘는 것이 보인다. `페이지 요청 ⚡`를 누르면 점 3개가 브라우저에서 동시에 출발해 레인별로 다른 경로를 그린다 — HIT는 캐시 노드에서 되돌아오고(초록), STALE은 되돌아오면서 캐시→서버 재생성 경로가 켜지고(주황, 완료 시 캐시 노드가 v2로 깜박임), EXPIRED는 캐시를 통과해 서버까지 갔다가 새 값을 들고 돌아오며(장미색, 대기), 장바구니는 항상 서버 왕복(파랑, DYNAMIC). `updateTag()`/`revalidateTag()` 버튼은 상품 캐시 노드에 관리자 펄스와 API 이름 칩을 띄우고 상태를 EXPIRED/STALE로 바꾼다. 캔버스 아래에는 마지막 페이지 요청의 레인별 결과 한 줄(결론 스트립)과, 개념 노트 3개 + 최근 요청 로그를 담은 `StructureNotes`를 둔다(노트 호버 시 해당 레인 강조).
- **등록**: `showcase-cache-demos.tsx`의 `cacheDemos` 배열에 `key: 'cache-mall'` 항목 추가. 갤러리·상세·sitemap·SEO 메타데이터는 기존 `showcaseDemos` 기반 파이프라인(`visualize-seo-keywords`, `visualize-view-ga-event` 작업 결과)으로 자동 노출되므로 별도 코드 수정이 필요 없다.

## Acceptance criteria

- [ ] `/visualize`에 "cache-mall" 카드가 노출되고 상세 페이지(`/visualize/cache-mall`)가 정상 동작한다.
- [ ] `cacheLife` 대표값 전환, `updateTag()`/`revalidateTag()` 후 다음 페이지 요청, 시간 경과(revalidate·expire 초과) 후 페이지 요청이 캔버스 경로(캐시에서 끝남 / 서버까지 감 / 백그라운드 재생성)와 결과 문구에 올바르게 반영된다.
- [ ] 모든 결과 문구가 정확한 기술 용어와 근거(공식 문서 경로)를 담고 있다 — "버튼 누르니 색이 바뀌었다" 수준에 머무르지 않는다.
- [ ] 캔버스 그림·컨트롤·레이아웃이 기존 4종과 시각적으로 구분되는 독자적 디자인이다.
- [ ] 라이트/다크 모드, 모바일 1열 레이아웃에서 깨지지 않는다(`DESIGN.md` 12장 체크리스트).
- [ ] `model.test.mjs` 등 기존 모델 테스트가 회귀 없이 통과한다.

## Constraints

- 반드시 지킬 것: 파일당 250줄 이하·역할별 분리(`nextjs-app/AGENTS.md`), `next`/`react`는 `catalog:` 참조, 기존 `model.ts`의 기존 export는 수정하지 않는다(하단 주석에 명시된 하위 호환 유지 이유), `DESIGN.md`의 색·간격·다크모드 토큰 준수.
- 범위 밖: 헤더/결제 등 나머지 쇼핑몰 구역, `cacheLife` 전체 4개 프로필 노출, 기존 4종 데모의 리팩터링.

## Open questions

- 없음 — 위 범위는 이 대화의 플랜 모드 질의응답(등록 방식/스토리 범위/재생 방식/UI 재사용 여부)으로 전부 확정됐다.
