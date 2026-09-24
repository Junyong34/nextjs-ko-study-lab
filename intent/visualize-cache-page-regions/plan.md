Plan: /visualize "한 페이지, 영역별 캐시 경계" 데이터 흐름 데모 구현
Spec: ./intent.md#requirements
Author: Claude
Status: done
Approval: intent.md와 동일 — 2026-09-19 대화 요청. PR 머지 전 승인 효력 없음. 2026-09-24 사용자 지시로 done 전환 — 구현 `6728970` main 반영 확인, 이후 셸 production build(GA 작업 `5957095` 검증, 834개 정적 페이지) 통과.

## Scope of change

기준 디렉토리: `nextjs-app/packages/ui/src/reference-visualize/toolkit/`

- `components/cache-components/regions-model.ts` — 영역 스펙·시나리오별 이동 단계·첫 페인트·영역 상태·요약 문구(순수).
- `components/cache-components/paint-regions.ts` — 레이아웃(원천 열·캐시 열·브라우저 목업)·행 좌표·히트 테스트·`paintRegions` 진입점.
- `components/cache-components/paint-regions-flow.ts` — 원천/캐시 노드, 연결선, 이동 점, 단계 라벨.
- `components/cache-components/paint-regions-page.ts` — 브라우저 목업(주소줄·첫 페인트·영역 4칸 blank/skeleton/filled).
- `examples/cache-regions/RegionCodeMap.tsx` — `page.tsx` 구성 코드 지도(영역별 색·호버 동기화).
- `examples/cache-regions/notes.ts` — `StructureNotes` 항목 4개.
- `examples/CachePageRegionsDemo.tsx` — 조립.
- `examples/showcase-types.ts`·`examples/showcase-cache-demos.tsx`·`examples/index.ts` — `cache-regions` 등록.
- `intent/README.md` — 작업 인덱스 행 추가.

## Steps

1. `regions-model.ts` — 4개 영역 스펙과 warm/cold 시나리오 타이밍, 상태 판정 함수.
2. `paint-regions-page.ts` → `paint-regions-flow.ts` → `paint-regions.ts` 순으로 페인터 작성.
3. `notes.ts`·`RegionCodeMap.tsx`·`CachePageRegionsDemo.tsx` 조립, 등록.
4. dev 서버로 두 시나리오 재생·호버·모바일 확인, 타입체크, 250줄 확인.
5. 인덱스·검증 결과 기록.

## Verification

- `pnpm --filter @study/ui check-types`, `pnpm --filter @study/shell check-types`.
- 브라우저(`localhost:3000/visualize/cache-regions`): intent Acceptance criteria 항목을 순서대로 조작·스크린샷 확인, 새 탭 fresh load 콘솔 에러 없음, `/visualize` 카드 노출.
- `wc -l`로 신규 파일 250줄 이하.

## Rollback

등록 항목(`showcase-cache-demos.tsx`·`showcase-types.ts`·`index.ts`)을 제거하고 신규 파일을 삭제하면 갤러리에서 즉시 사라진다. 공용 모듈은 수정하지 않는다.

## Verification results

- 상태: 2026-09-19 로컬 구현·검증 완료. 사용자 지시로 main에 직접 커밋·push(PR 없음).
- `pnpm --filter @study/ui check-types`, `pnpm --filter @study/shell check-types`: 통과.
- 신규 파일 250줄 이하(`wc -l`): `regions-model.ts` 171, `paint-regions-flow.ts` 163, `paint-regions-page.ts` 148, `paint-regions.ts` 88, `CachePageRegionsDemo.tsx` 137, `RegionCodeMap.tsx` 112, `notes.ts` 32.
- 브라우저(`localhost:3000/visualize/cache-regions`, 새 탭 fresh load 콘솔 에러 없음, `/visualize` 갤러리 카드 노출):
  - 캐시 채워짐: 220ms에 헤더·상품 목록이 정적 셸로 함께 도착(상품 목록은 "캐시 HIT · 셸에 포함" 칩), 환율 배너는 "cookies() 읽고 getRate('KRW') HIT"로 원천 노드("호출 안 함") 없이 캐시에서 도착, 추천은 원천에서 "캐시 없음" 자리를 지나 1150ms에 스트리밍으로 채워짐. 그 전까지 두 영역은 fallback 스켈레톤.
  - 캐시 비어 있음: 상품 목록 캐시 노드가 점선 "비어 있음(MISS)" → DB 조회 점 이동 → "방금 저장됨" 플래시 → "이제야 셸 완성" → 900ms 첫 페인트(그 전 화면은 "상품 목록 캐시가 비어 셸을 못 보낸다"). 환율 배너는 "getRate('KRW') MISS → API 호출" 후 저장·렌더.
  - 호버: 코드 지도의 `<PriceBanner />` 줄에 올리면 캔버스 환율 행·페이지 칸이 강조되고 나머지 행이 흐려지며 오른쪽 스니펫이 `PriceBanner.tsx · lib/rates.ts`로 전환. 캔버스 행 호버도 같은 상태를 공유.
  - 모바일 프리셋(375×812): 컨트롤·범례 줄바꿈 정상, 캔버스는 최소 폭 720 가로 스크롤(다른 데모와 동일).
- 사용자 피드백("텍스트가 좁아 겹침 — RSC 출력 캐시…") 반영: 캐시 열 폭 156→184, 원천 열 108→104로 조정하고 캐시 노드 라벨을 종류(주)와 태그·키 힌트(부)로 나눴으며, 노드 안 텍스트는 `fitLabel`로 폭에 맞춰 축소(안 들어가면 그리지 않음)하도록 바꿈. 재확인 시 겹침 없음.
- 사용자 피드백("'use cache' 컴포넌트/함수 배지가 답답함") 반영: 페이지 목업의 모드 배지 좌우 여백 5→8px, 높이 14→16px로 조정.
- 미검증: 프로덕션 빌드, 다크 모드 캔버스(다른 캐시 데모와 같이 라이트 고정).
