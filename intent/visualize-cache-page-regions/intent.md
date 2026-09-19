Intent: /visualize "한 페이지, 영역별 캐시 경계" 데이터 흐름 데모 추가
Author: Claude
Status: draft
Approval: 2026-09-19 대화에서 사용자가 직접 요청("페이지가 영역별로 분리돼 있고, 영역별 컴포넌트마다 캐시 설정에 따라 데이터를 어떻게 가져와 사용자에게 보여주는지 시각화 — 캐시 설정된 컴포넌트, 함수, 캐시 없이 매번 새로 가져오는 영역 등을 분리해서"). 저장소 규칙상 PR 머지 전 승인 효력 없음. 선례(`visualize-cache-mall-story`)와 같이 대화 승인으로 구현을 진행하며, 요구사항·설계·완료 기준을 이 문서에 통합한다(작은 범위 변경 양식).

## Problem

`cache-components` 그룹의 기존 5개 데모는 개념 하나(셸 경계·키·수명·태그) 또는 스토리(쇼핑몰)를 다루지만, **실제 페이지 하나가 여러 영역으로 나뉘고 영역마다 캐시 전략이 다를 때** 각 영역의 데이터가 어디서 출발해 어떤 경로로 사용자 화면에 도착하는지를 한 그림에서 비교하는 데모가 없다. 학습자는 "컴포넌트 전체에 `'use cache'`를 붙이는 것", "데이터 함수에만 붙이는 것", "`cookies()` 때문에 캐시할 수 없는 것"이 같은 페이지 안에서 어떻게 다르게 동작하는지 체감하기 어렵다.

## Proposed outcome

한 페이지(`app/page.tsx`)를 4개 영역으로 나눈 요청 흐름도를 보고, 영역별로 "원천(DB·외부 API·요청 쿠키) → 캐시 항목 → 사용자 화면" 경로가 어떻게 다른지, 캐시가 채워져 있을 때와 비어 있을 때(빌드·태그 갱신 직후) 도착 시각이 어떻게 달라지는지를 재생으로 확인한다. 코드 지도(`page.tsx` 구성)와 캔버스 영역이 호버로 연결되어 "이 줄이 저 영역"임을 바로 안다.

## Affected users and systems

- 사용자: `/visualize`에서 Cache Components를 배우는 사람.
- 시스템: `nextjs-app/packages/ui/src/reference-visualize/toolkit/` — `components/cache-components/regions-model.ts`·`paint-regions*.ts`(신규), `examples/CachePageRegionsDemo.tsx`·`examples/cache-regions/*`(신규), `examples/showcase-cache-demos.tsx`·`showcase-types.ts`(등록). 갤러리·sitemap·SEO는 `showcaseDemos` 파이프라인으로 자동 반영.

## Requirements

- 필수:
  - `cache-components` 그룹의 6번째 `DemoMeta`(`key: 'cache-regions'`)로 등록한다.
  - 페이지 영역 4개를 다룬다 — ① 헤더(정적 셸, 데이터 없음) ② 상품 목록(컴포넌트 전체 `'use cache'` + `cacheLife` + `cacheTag`) ③ 환율 배너(컴포넌트는 `cookies()`를 읽어 요청마다 렌더, 데이터 함수 `getRate(currency)`에만 `'use cache'`) ④ 추천(`cookies()` + DB 조회, 캐시 없음, `<Suspense>`로 스트리밍).
  - 캔버스는 행(영역)마다 "원천 → 캐시 항목(또는 캐시 없음) → 페이지 영역"을 그리고, 오른쪽에 브라우저 목업으로 페이지를 두어 영역이 빈 화면 → 스켈레톤 → 콘텐츠로 채워지는 순간을 보여준다.
  - 재생은 `StructureControls`(재생/처음부터/속도)로 하고, "캐시 채워짐(평소)"/"캐시 비어 있음(빌드·갱신 직후)" 두 시나리오를 전환할 수 있다. 비어 있을 때는 컴포넌트 캐시 영역이 셸 자체를 늦춘다는 점이 보여야 한다.
  - 영역별 설명은 정확한 용어와 근거(`use-cache.md`, `cacheLife.md`, `cacheTag.md`, `caching.md`)를 담고, `page.tsx` 코드 지도와 캔버스 행이 호버로 동기화된다.
  - 시연용 시간(ms)은 실측이 아님을 명시한다.
- 선택: 코드 지도에서 줄을 클릭해도 강조되게 한다.

## Design

- 모델(`regions-model.ts`, 순수): `REGIONS`(4개 영역 스펙 — 모드·파일·코드·원천·설명), `flowStepsFor(regionId, fill)`(시나리오별 이동 단계 목록: `shell`/`fetch`/`read`/`stream`과 시작·끝 ms·라벨), `firstPaintMs(fill)`, `regionStateAt(regionId, fill, nowMs)` → `blank | skeleton | filled`, `summaryAt(fill, nowMs)`(결론 스트립 한 줄).
- 그림: `paint-regions.ts`(레이아웃·행 좌표·호버 히트 테스트·진입점), `paint-regions-flow.ts`(원천 노드·캐시 노드·연결선·이동 점·단계 라벨), `paint-regions-page.ts`(브라우저 목업 — 주소줄, 첫 페인트 표시, 영역 4칸의 blank/skeleton/filled 그림).
- DOM: `CachePageRegionsDemo.tsx`(컨트롤 → 캔버스 → 결론 스트립 → 코드 지도 + `StructureNotes`), `cache-regions/RegionCodeMap.tsx`(page.tsx 구성 코드, 영역별 색·호버), `cache-regions/notes.ts`.
- 재생: `useTimelinePlayback`(`totalMs` 1600, `cycleMs` 5600, `holdMs` 1400)와 `useCanvas`(`trackPointer`)를 조합. 호버는 캔버스 행/페이지 영역 히트 테스트와 DOM 노트·코드 지도 양쪽에서 같은 `regionId`를 쓴다.

## Acceptance criteria

- [ ] `/visualize`에 "cache-regions" 카드가 노출되고 `/visualize/cache-regions`가 동작한다.
- [ ] 캐시 채워짐 시나리오에서 헤더·상품 목록이 첫 페인트와 함께 도착하고, 환율 배너는 쿠키를 읽은 뒤 `getRate` 캐시 HIT로(외부 API 호출 없이), 추천은 DB까지 갔다가 가장 늦게 스트리밍되어 채워진다.
- [ ] 캐시 비어 있음 시나리오에서 상품 목록이 DB → 캐시 저장을 거치며 첫 페인트가 늦어지고, 환율 배너는 외부 API 호출 후 캐시에 저장되는 것이 보인다.
- [ ] 노트·코드 지도 호버 시 캔버스 해당 행·페이지 영역이 강조되고, 반대로 캔버스 호버도 노트에 반영된다.
- [ ] 라이트/모바일 폭에서 깨지지 않으며(캔버스는 다른 데모처럼 최소 폭 가로 스크롤), 타입체크 통과, 파일당 250줄 이하.

## Constraints

- 반드시 지킬 것: 파일당 250줄 이하·역할 분리, 기존 공용 모듈(`structure/*`, `model.ts`) export 수정 금지(옵션 추가는 기본값 유지 시 허용), `DESIGN.md` 색 규약, 실제 Next.js 용어 정확성(`'use cache'`는 컴포넌트·함수·파일 상단에 붙일 수 있고, 안에서 `cookies()`를 읽으면 `next-request-in-use-cache` 오류).
- 범위 밖: 실제 서버 실행·측정, `use cache: private`/`remote` 변형, 라우트 세그먼트 단위 캐시.

## Open questions

- 없음.
