Plan: 쇼핑몰 스토리텔링으로 감싼 Cache Components 시각화 페이지
Spec: ./intent.md#requirements
Author: Claude
Status: draft
Approval: 없음 (초안)

## Scope of change

- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/cache-shopping-story/` (신규 디렉터리)
  - `CacheShoppingStoryDemo.tsx` — 조립 컴포넌트. 장 상태를 받아 역할 배지·스텝바·내레이션 오버레이·현재 장의 기존 데모 컴포넌트를 렌더한다. 캔버스 페인트 로직은 포함하지 않는다.
  - `scenes.ts` — 4장의 메타데이터(내레이션 문구, 역할, 대응 데모 컴포넌트 참조, 4장 전용 "영향받는 화면" 텍스트 리스트)를 데이터로 분리한다.
  - `SceneNav.tsx` — 4단 스텝바 UI(현재 장 강조, 클릭 이동).
  - `RoleBadge.tsx` — 역할 배지 UI(유준/서아, 장에 따라 자동 전환).
  - `useSceneController.ts` — 현재 장 인덱스, 장 이동 함수, 현재 장의 역할을 계산하는 훅. 각 데모 내부의 재생/속도 상태(`useCacheSequence` 등)는 건드리지 않는다.
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-types.ts` — `DemoKey`에 `'cache-shopping-story'` 추가.
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx` — `cacheDemos` 배열에 다섯 번째 `DemoMeta` 항목 추가(`key: 'cache-shopping-story'`, `component: <CacheShoppingStoryDemo />`, `keywords`에 "Next.js Cache Components 쇼핑몰 예시" 등 추가).
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/index.ts` — `export * from './cache-shopping-story/CacheShoppingStoryDemo'` 추가.
- 기존 4개 데모 파일(`CacheShellDemo.tsx` 등)은 수정하지 않는다.

## Steps

1. `showcase-types.ts`에 `DemoKey` 유니언 항목 `'cache-shopping-story'` 추가.
2. `scenes.ts` 작성 — 1~4장 데이터(내레이션 카피, 역할, `CacheShellDemo`/`CacheKeysDemo`/`CacheLifetimeDemo`/`CacheTagsDemo` 컴포넌트 매핑, 4장 텍스트 리스트 항목)를 intent.md의 "Proposed outcome" 4장 서술 그대로 옮긴다. 1장은 `SHELL_STEPS` 기반 단일 시퀀스 서술을 그대로 유지하고 가짜 분기 문구를 넣지 않는다.
3. `RoleBadge.tsx`, `SceneNav.tsx` 작성 — 상태 없는 프레젠테이션 컴포넌트로 만들고, 현재 장 인덱스·역할을 props로만 받는다.
4. `useSceneController.ts` 작성 — 장 인덱스 상태와 이동 함수만 관리하는 얇은 훅.
5. `CacheShoppingStoryDemo.tsx` 작성 — 위 훅·컴포넌트·`scenes.ts`를 조립. 현재 장의 데모 컴포넌트(`scenes[i].component`)를 그대로 렌더하고, 4장에서만 하단에 텍스트 리스트를 추가로 렌더한다. 각 파일 250줄을 넘지 않는지 확인한다.
6. `showcase-cache-demos.tsx`에 다섯 번째 `DemoMeta` 추가, `index.ts`에 export 추가.
7. `pnpm --filter @study/ui typecheck`(또는 워크스페이스 루트 typecheck 스크립트)와 `pnpm --filter @study/shell build`로 타입·빌드 확인.
8. 로컬에서 `/visualize`에 새 카드가 뜨는지, `/visualize/cache-shopping-story`에서 4장 전환·기존 4개 데모 캔버스가 그대로 재생되는지, 기존 `/visualize/cache-shell` 등 개별 카드가 그대로 동작하는지 수동 확인.
9. 필요 시 `nextjs-app/apps/shell/src/lib/seo/`에 새 슬러그의 keywords/description 메타데이터가 자동으로 반영되는지 확인(기존 `visualize-seo-keywords` intent의 구현을 그대로 재사용하는 경로라면 추가 작업 불필요).

## Verification

- 테스트: 이 저장소에는 이 영역을 커버하는 자동화된 단위 테스트가 없다(캔버스 시각화 데모는 기존 4개도 스냅샷/단위 테스트 없이 수동 검증). `pnpm --filter @study/ui typecheck`, `pnpm --filter @study/shell typecheck`, `pnpm --filter @study/shell build`를 통과 조건으로 삼는다.
- 수동 확인 (로컬 dev, `pnpm --filter @study/shell dev` 등 기존 로컬 구동 절차):
  - `/visualize` 갤러리에 새 카드가 `cache-components` 그룹에 노출됨
  - `/visualize/cache-shopping-story` 진입 시 1장부터 시작, 스텝바 클릭으로 임의 장 이동 가능
  - 1~3장은 역할 배지가 "유준", 4장 진입 시 "서아"로 자동 전환
  - 각 장의 캔버스가 기존 데모와 동일하게 동작(재생/속도/리플레이 컨트롤 포함) — diff상 `CacheShellDemo.tsx` 등 4개 파일에 변경이 없음을 확인
  - 4장에서 "즉시 변경"/"서서히 변경" 선택에 따라 하단 텍스트 리스트(상품 목록/상세/장바구니 배지)가 함께 표시됨
  - 기존 `/visualize/cache-shell`, `/visualize/cache-keys`, `/visualize/cache-lifetime`, `/visualize/cache-tags` 개별 페이지가 이전과 동일하게 접근 가능
- Acceptance criteria(intent.md) 6개 항목과 1:1 대조.

## Rollback

신규 파일 추가 + 기존 2개 파일(`showcase-types.ts`, `showcase-cache-demos.tsx`, `index.ts`)에 대한 추가형 diff(항목 추가, 기존 라인 삭제 없음)로 구성된다. 문제가 생기면 해당 커밋을 `git revert`한다. 기존 4개 데모 파일을 건드리지 않으므로 롤백 시 다른 기능에 영향이 없다.

## Verification results

- 상태: 미실행
- 실행 명령·환경 / 결과 / 증거(PR·로그 링크):
- 실패·미검증 항목과 후속 작업:
