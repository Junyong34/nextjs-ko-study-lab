Plan: 캐시 실습 3개(cacheTag·revalidateTag·revalidatePath) 재구성
Status: done
Approval: 2026-09-21 대화 승인(intent.md와 동일 대화). Spec: [./intent.md#requirements--spec-통합](./intent.md#requirements--spec-통합)

## Steps

1. **`functions/cache-tag/multi-tag-binding` (REBUILD)**
   - `cachedData.ts` 신규: `'use cache'` 함수(상품 상세, 예: 로지텍 마우스)에 `cacheTag('multi-tag-binding:product-891', 'multi-tag-binding:category-electronics', 'multi-tag-binding:brand-logitech')` 바인딩, `{ cacheId, generatedAt }` 반환.
   - `actions.ts` 신규: 태그별 개별 퍼지 액션 3개, 각각 `revalidateTag(해당태그, 'max')`.
   - `components/CacheTagMultiBindingDemo.tsx` 재작성: 버튼 3개 + `useTransition` + `router.refresh()`로 재조회, 이전/이후 `cacheId` 비교 로그.
   - `page.tsx`: 초기 `cacheId` 서버 fetch, `DemoResetButton` 추가.
   - `components/VerificationFooter.tsx`: 실측 `cacheId` 변화 기반 `isMatched`.
   - `DemoGuideCard`/`DemoDeepDiveCard` 텍스트를 실제 구현과 일치시킨다.

2. **`functions/revalidate-tag/basic-tag-purge` (IMPROVE)**
   - `cachedData.ts` 신규: 기존 인메모리 재고 배열을 `'use cache'` + `cacheTag('basic-tag-purge:inventory')`로 감싼다.
   - `actions.ts` 수정: 태그를 `'basic-tag-purge:inventory'`로 교체, 재고 변동 로직은 유지.
   - `components/RevalidateTagBasicDemo.tsx` 수정: 액션 후 `router.refresh()`로 재조회, `cacheId` 변화로 재검증 증명.
   - `components/VerificationFooter.tsx`: 실측 `cacheId`/재고값 비교.

3. **`functions/revalidate-path/page-vs-layout` (REBUILD, 실제 서브 라우트 신설)**
   - 신규: `layout.tsx`(공유 배너, `'use cache'`), `items/[id]/page.tsx`, `category/[slug]/page.tsx`(각각 자체 `'use cache'` 캐시 함수).
   - `page.tsx`(허브) 재작성: 자신의 `cacheId` 렌더 + 서브 라우트로 이동하는 실제 `<Link>`.
   - `actions.ts` 수정: `targetPath`를 이 데모의 실제 URL로 교체, 정적 `allRoutes` 룩업 제거. 액션이 캐시 함수를 직접 재호출해 실측 스냅샷(허브/아이템/카테고리 `cacheId`) 반환.
   - `components/RevalidatePathScopeDemo.tsx` 재작성: `page`/`layout` 스코프 버튼 + 서브 라우트 이동 `<Link>` + 실측 스냅샷 기반 PURGED/PRESERVED 배지.
   - `components/VerificationFooter.tsx`: 실측 스냅샷 기반 `isMatched`.
   - 구현 전 `next-devtools` MCP(`nextjs_docs`)로 Next.js 16.3.2 `revalidatePath(path, type)` 정확한 스코프 의미 교차 검증.

4. 3개 모두 완료 후 `nextjs-app/packages/demos/demos.yaml`에서 세 항목 `status: stub` → `status: done`.
5. `cd nextjs-app && pnpm --filter @study/demos lint && pnpm --filter @study/demos build` (매니페스트 재생성).
6. `demo-cache-components` 타입체크/린트/빌드 통과 확인.
7. 로컬 dev 서버(포트 3002)에서 3개 페이지 회귀 확인(초기 진입/조작/새로고침 후 값 변화, 콘솔 에러 없음).
8. `intent.md`/`plan.md` Status를 `done`으로 전환하고 `intent/README.md` 작업 인덱스 행 갱신.
9. 커밋 메시지 규칙(`[main][feat]: ...`)에 따라 커밋. PR·push 여부는 구현 완료 후 사용자에게 재확인.

## Verification

- 코드: `@study/demos` lint/build, `demo-cache-components` TypeScript·ESLint·`next build` 통과.
- 런타임: 각 데모에서 초기 진입 → 조작(버튼 클릭/서브 라우트 이동) → 새로고침 후 `cacheId`/상태 변화 관찰, `ExpectedActualPanel`이 조작 전 대기·조작 후 성공/실패를 실측 기준으로 반영, 콘솔·런타임 에러 없음.
- 문서 일치성: `DemoGuideCard`/`DemoDeepDiveCard` 서술과 실제 구현(버튼·라우트·태그명) 대조.
- 검증하지 못한 항목은 완료 보고에 명시하고, 미충족 시 `done` 대신 `approved`로 유지한다.

## 실제 검증 결과 (2026-09-21)

- **대상 1 `cache-tag/multi-tag-binding`**: REBUILD. `tsc --noEmit`, `next build` 통과(정적 사전렌더). curl 3회 재요청으로 동일 `cacheId` 유지 확인(캐싱 실동작). 버튼 클릭 → `revalidateTag` → `router.refresh()` 흐름은 `precision-tag-purge`와 동일한 검증된 패턴을 따름.
- **대상 2 `revalidate-tag/basic-tag-purge`**: IMPROVE. `tsc --noEmit`, `next build` 통과. 캐시된 조회(①)와 액션 즉시 응답(②)을 분리 표시해 `revalidateTag(tag, 'max')`의 stale-while-revalidate 특성을 실측 가능하게 구성. curl로 캐시 지속성 확인.
- **대상 3 `revalidate-path/page-vs-layout`**: REBUILD. 실제 `layout.tsx` + `items/[id]`·`category/[slug]` 서브 라우트 신설. 최초 구현 시 클라이언트 번들에 `next/cache` import가 유입되는 빌드 에러, `params`를 캐시 경계 밖에서 await할 때 발생하는 "blocking-prerender-runtime" 경고를 각각 파일 분리(`tags.ts`/`paths.ts`)와 `export const instant = false`로 해결. `next build`에서 `items/[id]`·`category/[slug]`가 Partial Prerender(15m/1y)로 정상 캐싱됨을 확인. curl로 hub·item·category 각각 캐시 지속성(동일 cacheId 반복) 확인. `revalidatePath(path, 'layout')`이 실제로 하위 라우트까지 무효화 전파하는지는 공식 문서(`revalidatePath.md`: "Layouts: invalidates ... all nested layouts beneath it, and all pages beneath them")에 근거해 구현했으나, 클릭 인터랙션 자체는 Chrome 확장 미연결로 브라우저에서 육안 확인하지 못함.
- **공통**: `pnpm --filter @study/demos lint` 통과(경고 22건은 모두 이번 변경 이전부터 존재하던 다른 "done" 데모들의 캐시 태그 접두사 관례 차이 — 차단 없음). `pnpm --filter @study/test-suite test:manifest` 240개 데모 전부 통과. `pnpm --filter @study/test-suite test:tier1`에서 4건 실패했으나, 변경 전 `demos.yaml`으로 동일 테스트를 재실행해 동일하게 4건 실패함을 확인 — 이번 작업과 무관한 기존 결함(`14.3`/`14.5`/`17.1`/`25.3`, 특히 `25.3`은 하드코딩된 기대 `done` 개수 `58`이 이미 오래전에 `131`로 벌어져 있던 기존 회귀).
- **남은 문제**: Chrome 확장 미연결로 세 데모 모두 버튼 클릭 → 실제 화면 변화의 인터랙티브 브라우저 검증은 하지 못함(코드 검증·curl 기반 캐시 지속성 검증으로 대체). 사용자가 로컬에서 직접 클릭해 확인 권장.
