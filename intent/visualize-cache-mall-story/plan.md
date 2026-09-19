Plan: /visualize "스터디몰" 캐시 스토리텔링 데모 구현
Spec: ./intent.md#requirements
Author: Claude
Status: draft
Approval: intent.md와 동일 — 2026-09-18 대화 승인(ExitPlanMode). PR 머지 전 승인 효력 없음, 대화 승인에 따라 구현은 바로 진행. 2026-09-19 사용자 재피드백("제대로 동작도 안 하고 시각화도 안 됨 — 다른 /visualize 페이지와 비교해 전면 개편")으로 아래 Scope를 2차 개편본으로 교체.

## Scope of change (2026-09-19 2차 개편본)

기준 디렉토리: `nextjs-app/packages/ui/src/reference-visualize/toolkit/`

- `components/cache-components/mall-model.ts` — 순수 시뮬레이션. `createSim`/`tickSim`(시계·재생성 완료)/`sendPageRequest`(세 레인 동시 판정)/`applyTag`/`withShelfLife`, `SHELF_LIFE_OPTIONS`(인라인 객체 프로필 2종), `RESULT_LABEL`. 기존 `model.ts`의 `lifeZone`만 재사용.
- `components/cache-components/paint-mall-types.ts` — `LaneTravel`·`AdminPulse`·`SaveFlash`·`LaneGeometry`·`MallPaintOptions`.
- `components/cache-components/paint-mall-helpers.ts` — 색·타이밍 상수, 결과별 이동 경로(`travelSegments`)와 현재 위치(`travelPose`).
- `components/cache-components/paint-mall-nodes.ts` — 브라우저·원본 서버 노드, 캐시 항목 노드(버전·상태 배지·revalidate/expire 눈금이 있는 나이 막대), `drawPill`.
- `components/cache-components/paint-mall-lane.ts` — 레인 하나(제목 행·응답 경로 실선·재생성 경로 점선·이동 점·결과 배지).
- `components/cache-components/paint-mall.ts` — `mallLayout`(브라우저 → 레인 3개 → 서버 좌표)과 `paintMall` 진입점, 관리자 태그 갱신 펄스.
- `examples/cache-mall/useCacheMallSim.ts` — `useCanvas` 프레임 루프에서 시계를 흘리고(재생/속도), 요청 애니메이션·플래시를 ref로 관리. DOM 값은 100ms 간격으로만 state 반영(`isr-cache`와 동일 구조).
- `examples/cache-mall/Controls.tsx` — 진열대 cacheLife 2칩 + `+5s 건너뛰기`, 관리자 `updateTag('product:1')`/`revalidateTag('product:1', 'max')` 버튼.
- `examples/cache-mall/notes.ts` — `StructureNotes`용 개념 노트 3개(호버 시 레인 강조)와 최근 요청 로그, 결론 스트립 문구.
- `examples/CacheMallDemo.tsx` — `StructureControls`(재생/처음부터/속도/범례/`페이지 요청 ⚡`) → 캔버스 → 결론 스트립 → `StructureNotes` 조립.
- `examples/showcase-cache-demos.tsx` (수정) — 5번째 항목 설명 문구를 요청 추적도 기준으로 갱신.
- 삭제: 1차 개편본의 `paint-mall-guest.ts`, `paint-mall-zones.ts`, `cache-mall/useCacheMallStory.ts`, `cache-mall/Explain.tsx`.

## Scope of change (1차 — 2026-09-19 개편 시점 기록, 2차에서 대체됨)

기준 디렉토리: `nextjs-app/packages/ui/src/reference-visualize/toolkit/`

- `components/cache-components/mall-model.ts` — 구역별 순수 계산 함수(`visitShelf`, `shelfZoneCopy`, `productStepCopy`, `cartCopy`). `LIFE_PROFILES` 대표 2개·`tagResponse` 재사용.
- `components/cache-components/paint-mall-types.ts` — 공유 타입(순환 참조 방지용 분리).
- `components/cache-components/paint-mall-helpers.ts` — 색상·타이밍 상수, `pop`/`shelfProgressRatio`/`productBadge` 등 작은 순수 계산.
- `components/cache-components/paint-mall-guest.ts` — 배너·바닥 동선·걸어 들어오는 손님(요청) 아이콘.
- `components/cache-components/paint-mall-zones.ts` — 3구역(진열대/상세/장바구니) 카드 페인터.
- `components/cache-components/paint-mall.ts` — 위 네 파일을 조립하는 진입점(`paintMall`).
- `examples/cache-mall/useCacheMallStory.ts` — 상태·`setTimeout` 기반 타이밍 훅(버튼 4종 각각의 독립 애니메이션 시퀀스).
- `examples/cache-mall/Controls.tsx` — cacheLife 설정 2칩 + 실제 API 이름을 단 액션 버튼 4개(`use cache`/`updateTag()`/`revalidateTag()`/`cookies()`).
- `examples/cache-mall/Explain.tsx` — 번호로 이어진 3단계 설명, `activeZoneKey`로 캔버스와 동기화된 강조.
- `examples/CacheMallDemo.tsx` — 위 훅+컴포넌트를 조립하는 얇은 레이아웃.
- `examples/showcase-cache-demos.tsx` (수정) — `cacheDemos` 배열에 `key: 'cache-mall'` 항목, 새 상호작용 방식에 맞춘 설명 문구.

(2026-09-19 개편으로 `paint-mall.ts`·`CacheMallDemo.tsx`가 각각 250줄 제한을 넘겨 위처럼 5개/4개 파일로 분리했다 — 최초 계획의 "신규 3개 파일" 전제가 "신규 9개 파일"로 바뀐 것.)

연관 변경 없음 — 갤러리(`apps/shell/src/app/visualize/`), sitemap, SEO 메타데이터는 `showcaseDemos` 배열을 그대로 소비하므로 코드 수정 불필요(등록 후 결과만 확인).

## Steps

1. `mall-model.ts` 작성 — 손님 카운터/시뮬레이션 시각, 대표 `cacheLife` 2종, `updateTag`/`revalidateTag` 결과 계산 순수 함수. 기존 `model.ts`는 import만 하고 수정하지 않는다.
2. `paint-mall.ts` 작성 — 3구역(진열대/상세/장바구니) 목업을 새 그림체로 그리는 페인터. `primitives/`(도형·선·타이포)만 재료로 쓰고 기존 `paint-shell/life/tags.ts`의 시각 결과물은 참고만 한다.
3. `CacheMallDemo.tsx` 작성 — `useCanvas` 훅으로 캔버스 연결, 컨트롤(프로필 선택·갱신 방식 선택·"손님 입장"·"재고 변경" 버튼), 결과 문구(기술 용어 + 근거 링크)를 이 데모 전용 레이아웃으로 조립. `CacheFrame`을 쓰지 않는다.
4. `showcase-cache-demos.tsx`에 5번째 `DemoMeta`(`key: 'cache-mall'`, title/description/gridDescription/modules/keywords/component) 추가.
5. 로컬에서 셸 dev 서버로 `/visualize`와 `/visualize/cache-mall` 진입해 시나리오 전체(프로필 전환 → 손님 입장 → 재고 변경 → updateTag/revalidateTag 비교)를 직접 조작하며 확인.
6. 라이트/다크·모바일 1열 확인, 타입체크·모델 테스트 실행.
7. `intent/README.md` 작업 인덱스에 `visualize-cache-mall-story` 행 추가/갱신.

(2차 개편 진행 순서: `mall-model.ts` 시뮬레이션 재작성 → `paint-mall-{types,helpers,nodes,lane}.ts`·`paint-mall.ts` 요청 추적도 페인터 → 1차 파일 삭제 → `useCacheMallSim.ts`·`Controls.tsx`·`notes.ts`·`CacheMallDemo.tsx` → 등록 문구 갱신 → 브라우저 시나리오 검증 → intent/plan/인덱스 기록.)

## Verification

- `node --experimental-strip-types --test nextjs-app/packages/ui/src/reference-visualize/toolkit/components/cache-components/model.test.mjs` — 기존 모델 테스트 회귀 없음.
- 셸 dev 서버(`pnpm --filter @study/shell dev` 또는 저장소 관례 명령) 기동 후 브라우저로 `/visualize` → "cache-mall" 카드 노출, `/visualize/cache-mall` 상세 진입 확인.
- 수동 시나리오: (1) 초기 화면에 3구역 표시 (2) `cacheLife` 대표값 전환 후 "손님 입장" → 진열대 반응 차이 확인 (3) "재고 변경" + `updateTag` → 즉시 리셋 확인 (4) "재고 변경" + `revalidateTag` → 구값 유지 후 갱신(SWR) 확인 (5) 장바구니 구역은 매번 서버 왕복 애니메이션으로 표시되는지 확인.
- 각 결과 문구가 정확한 기술 용어·근거를 담는지 직접 검토(intent.md Acceptance criteria 대조).
- 라이트/다크 모드, 모바일 폭(1열) 레이아웃 확인 — `DESIGN.md` 12장 체크리스트 대조.
- 타입체크: 해당 워크스페이스 스크립트(예: `pnpm --filter @study/shell check-types` 또는 `packages/ui`쪽 타입체크) 통과 확인.
- sitemap/SEO 메타데이터에 `cache-mall` 슬러그가 자동 반영되는지 확인 — 실패 시 `visualize-seo-keywords` 구현을 재확인(코드 추가 변경 없이 통과해야 함).

## Rollback

`showcase-cache-demos.tsx`의 추가 항목과 `examples/index.ts`의 export를 제거하고 신규 파일(`mall-model.ts`, `paint-mall*.ts` 5개, `CacheMallDemo.tsx`, `cache-mall/` 3개)을 삭제하면 갤러리에서 즉시 사라진다. 기존 4종 데모·공통 파일은 건드리지 않으므로 별도 복구가 필요 없다.

## Verification results

- 상태: 로컬 구현·검증 완료. 2026-09-19 사용자 지시로 2차 개편본을 main에 직접 커밋·push(PR 없음).
- 실행 명령·환경 / 결과:
  - `pnpm --filter @study/ui check-types`: 통과.
  - `pnpm --filter @study/shell check-types`: 통과.
  - 셸 dev 서버(`localhost:3000`, 기존 실행 중이던 프로세스 재사용)에서 브라우저로 직접 확인:
    - `/visualize` 갤러리에 "쇼핑몰로 보는 캐시 설정" 카드 노출, cache-components 그룹 카운트 4→5 반영.
    - `/visualize/cache-mall` 상세 진입, 콘솔 에러 없음(`read_console_messages` onlyErrors 결과 없음).
    - 시나리오 전체 조작: "손님 입장" 반복 클릭 → 진열대 FRESH→STALE→(재생성)FRESH 순환 확인, "재고 변경" 후 updateTag(EXPIRED→응답 대기→v2 응답 완료)와 revalidateTag(STALE→v1 응답 중·백그라운드 갱신)의 문구 차이 확인, "진열대 · 오래 유지" 프로필 전환 시 즉시 FRESH로 리셋되어 대비 확인, "다시 시작" 리셋 확인.
    - 모바일 프리셋(375×812)에서 컨트롤 줄바꿈과 캔버스 가로 스크롤 정상, 다크 컬러스킴에서 페이지·컨트롤은 다크 대응(레이아웃 깨짐 없음). 캔버스 내부 그림은 기존 4종(`CacheFrame`)과 동일하게 고정 라이트 배경이며 이는 기존 관례를 따른 것(`CacheFrame.tsx`도 `bg-white` 고정, 다크 비대응).
- 실패·미검증 항목과 후속 작업:
  - `model.test.mjs`는 README·`model.ts` 주석이 참조하지만 저장소에 실제 파일이 존재하지 않아 실행 불가(신규 작업 범위 밖의 기존 문서-코드 불일치 — 별도 확인 필요, 이번 작업에서 새로 만들지 않음).
  - sitemap 자동 반영은 코드상 `showcaseDemos` 기반 파이프라인이라 별도 수정이 필요 없다고 판단했으나, 실제 `sitemap.ts` 출력·프로덕션 빌드까지는 로컬에서 재확인하지 않음(개발 서버 확인으로 대체).
  - `pnpm --filter @study/shell build` 등 프로덕션 빌드는 미실행 — 필요 시 후속 확인.

### 2026-09-19 1차 개편 검증 (2차에서 대체됨)

사용자 피드백("흐름이 눈에 안 들어옴", "애니메이션 퀄리티가 낮음", "버튼 자체를 Next.js cache API로 만들어 누르면 그 흐름이 보이게") 반영 후 재검증.

- `pnpm --filter @study/ui check-types`, `pnpm --filter @study/shell check-types`: 통과(파일 분리 전후 총 3회 재실행 모두 통과).
- 신규/분리 파일 전부 250줄 이하 확인(`wc -l`): `paint-mall.ts` 51, `paint-mall-types.ts` 55, `paint-mall-helpers.ts` 54, `paint-mall-guest.ts` 72, `paint-mall-zones.ts` 153, `CacheMallDemo.tsx` 75, `Controls.tsx` 117, `Explain.tsx` 125, `useCacheMallStory.ts` 217.
- 브라우저 실행 검증(`localhost:3000/visualize/cache-mall`, 콘솔 에러 없음):
  - `use cache` 버튼: 진열대에만 손님이 걸어가 도착 시 배지·막대가 갱신되는 것을 스크린샷으로 확인(걷는 중 스크린샷 1장 + 도착 후 1장).
  - `updateTag()` 버튼: 관리자 표시 즉시 → 짧은 대기 후 "v2 정착"(초록)로 빠르게 settle.
  - `revalidateTag()` 버튼: 중간에 "v1 응답 중"(주황, STALE) 상태가 눈에 띄게 오래 유지된 뒤 "v2 정착"으로 전환 — updateTag와의 시각적 차이를 스크린샷 2장으로 확인.
  - `cookies()` 버튼: 장바구니 카드만 활성 강조, 배너 "누적 요청" 카운트 증가, DYNAMIC 배지 팝인.
  - 애니메이션 재생 중 4개 액션 버튼과 설정 칩이 모두 `disabled`로 표시되고(회색), 종료 후 재활성화되는 것을 스크린샷으로 확인.
  - 다크 컬러스킴에서 새 컨트롤(설정 칩·4개 API 버튼)이 정상적으로 대비를 유지하는 것을 확인.
- 남은 항목: 두 guest(첫 읽기/다음 읽기)를 별개 캐릭터로 보여주는 대신 한 손님이 서서 배지만 전환되는 방식으로 단순화했다 — 완료 기준(정확한 설명 텍스트로 이해시키는 것)은 충족하지만, 더 극적인 시각화가 필요하면 후속 개선 여지로 남긴다.

### 2026-09-19 2차 전면 개편 검증

사용자 재피드백에 따라 1차 개편본을 폐기하고 "요청 추적 3레인" 그림으로 다시 만든 뒤 재검증.

- `pnpm --filter @study/ui check-types`, `pnpm --filter @study/shell check-types`: 통과.
- 신규 파일 전부 250줄 이하(`wc -l`): `mall-model.ts` 197, `paint-mall.ts` 105, `paint-mall-types.ts` 64, `paint-mall-helpers.ts` 143, `paint-mall-nodes.ts` 179, `paint-mall-lane.ts` 143, `CacheMallDemo.tsx` 107, `Controls.tsx` 69, `notes.ts` 76, `useCacheMallSim.ts` 166.
- 브라우저 실행 검증(`localhost:3000/visualize/cache-mall`, 새 탭 fresh load 콘솔 에러 없음; `/visualize` 갤러리 카드 노출 확인):
  - 초기: 브라우저 → 레인 3개(진열대 캐시 노드 v1 FRESH + 나이 막대·revalidate/expire 눈금, 상품 캐시 노드 v1 FRESH, 장바구니 "캐시 없음") → 원본 서버 "대기".
  - `페이지 요청 ⚡`(나이 < revalidate): 점 3개 동시 출발, 진열대·상품은 캐시 노드에서 초록으로 되돌아오며 "HIT · v1", 장바구니만 서버까지 파랑 왕복 "서버 렌더". 결론 스트립 "진열대 HIT · 캐시에서 즉시 · 상품 상세 HIT … · 장바구니 서버 렌더 · 캐시 없음".
  - 나이 > revalidate 8s: 진열대 배지 STALE(주황). 요청 → 주황 점이 캐시에서 "STALE · v1 받음"으로 되돌아오고, 캐시→서버 점선이 보라로 켜지며 "백그라운드 재생성 →", 서버 노드 "진열대 재생성 중" 스피너, 1.3s 뒤 캐시 노드가 초록 플래시와 함께 "v2 FRESH"·나이 0으로 리셋.
  - `+5s 건너뛰기` ×3으로 나이 > expire 18s: 배지 EXPIRED(장미색). 요청 → 점이 캐시 노드를 통과해 서버까지 가서 "새 값 만드는 중 (대기)" 펄스, 재생성 경로 라벨 "요청이 기다리는 재생성 →"(장미색), 돌아올 때 초록 "EXPIRED · v2 받음".
  - `updateTag('product:1')`: 서버 노드 "Server Action updateTag()" 표시 + 보라 칩이 재생성 경로를 거슬러 상품 캐시 노드에 도달, 배지 EXPIRED·"즉시 만료됨 → 다음 요청은 기다린다". 다음 요청은 서버 대기 후 v2.
  - `revalidateTag('product:1', 'max')`: 배지 STALE·"STALE 표시 → 다음 요청이 갱신 트리거". 다음 요청은 v1 즉시 + 백그라운드 재생성 → v2. 로그·개념 노트 문구가 각각 updateTag/revalidateTag 설명으로 전환.
  - "오래 유지"(`cacheLife({ revalidate: 20 })`) 전환 후 +5s ×5: 나이 25s에서 STALE, 눈금에 "expire 없음" — EXPIRED로 가지 않는 대비 확인. 일시정지 시 시계 정지 확인.
  - 개념 노트 호버: 해당 레인만 강조되고 나머지 두 레인·배지가 흐려짐(`drawPill` 알파 곱 수정 후).
  - 모바일 프리셋(375×812): 컨트롤 줄바꿈 정상, 캔버스는 다른 데모와 같이 minWidth 640 가로 스크롤.
- 미검증·후속: 프로덕션 빌드 미실행(기존과 동일). 캔버스 내부는 다른 캐시 데모와 같이 라이트 고정.

#### 같은 날 후속 피드백 반영
- "1×도 빠르다": 애니메이션 전용 시계(`animMs`)를 도입해 점 이동·펄스·플래시가 시뮬레이션 배속을 함께 따르게 하고, 속도 순환을 1× → 0.5× → 0.25× → 2×로 바꿨다(`StructureControls`에 `speedTitle` 옵션 추가, 기본값은 기존 문구라 다른 데모 영향 없음). 기본 이동 시간도 약 1.6배 늘렸다. 0.5×에서 점이 절반 속도로 움직이고 시계도 절반으로 흐르는 것을 확인.
- "실행 버튼을 구분해 달라": 컨트롤을 "설정 · 진열대 cacheLife"(아웃라인 토글 칩, `aria-pressed`)와 "실행 · 누르면 캔버스에 반영"(▶/⏩ 아이콘 + 채운 배경 + 그림자, 마지막 실행 버튼은 링 강조) 두 묶음으로 나누고, `▶ 페이지 요청 ⚡`에도 실행 툴팁을 달았다.
