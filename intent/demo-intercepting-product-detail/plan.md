Plan: 상품 상세 인터셉트 라우팅 실습 신규 구현
Spec: ./intent.md#requirements
Author: Claude (초안)
Status: done
Approval: 2026-10-05 대화 승인(PR 없음). 사용자가 계획 검토 후 지연 2초로 조정을 요청하고 용어 원칙 반영 제안에 "그대로 진행 해줘"로 구현을 지시했다. 이 승인은 용어 원칙(요구사항 5항)과 지연 2초를 포함한 이 버전에 한한다. 커밋 여부는 구현·검증 후 사용자에게 확인한다.

## Scope of change

저장소 루트 기준. `z/b` = `nextjs-app/apps/demo-baseline/src/app/zone/baseline`.

| 변경 | 파일·디렉토리 |
|---|---|
| 신규 | `z/b/file-conventions/intercepting-routes/product-detail/` (아래 구조) |
| 수정 | `nextjs-app/packages/demos/demos.yaml` (`stub` 등록 → 검증 후 `done`) |
| 재생성 | `nextjs-app/packages/demos/demos-manifest.json` (직접 편집 금지, `build`로 생성) |
| 문서 | `nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md` 등록 합계·기준일, `intent/README.md` 작업 인덱스 |

기존 `intercepting-routes/{@modal,photos,direct-vs-modal}`, `next.config.ts`, `proxy.ts`, 공유 패키지는 변경하지 않는다. 변경이 필요해지면 구현을 멈추고 plan을 갱신해 재승인받는다.

### 신규 디렉토리 구조 (학습 순서대로 읽히게 구성)

```
product-detail/
├─ layout.tsx                    # children + modal 슬롯, ProductSeedProvider로 감쌈
├─ page.tsx                      # 1단 가이드 + 2단 목록 + 3단 검증 + 4단 개념 정리 조립
├─ data.ts                       # PRODUCT_SUMMARIES(요약), getProductDetail(id)(상세, 지연 포함)
├─ types.ts                      # ProductSummary / ProductDetail / EntryMode
├─ actions.ts                    # 'use server' fetchProductDetail(id) — 모달 본문 로딩용
├─ components/
│  ├─ ProductSeedProvider.tsx    # 'use client' Context: 클릭한 카드의 요약 보관
│  ├─ ProductCard.tsx            # 'use client' <Link onClick=seed 저장> / seed 없는 링크 변형
│  ├─ SummaryHeader.tsx          # 요약만으로 그리는 영역(이름·카테고리·가격)
│  ├─ DetailBody.tsx             # 상세 영역(설명·사양·재고) + DetailSkeleton
│  ├─ ModalFrame.tsx             # 'use client' 오버레이 + 닫기(router.back)
│  ├─ EntryVerification.tsx      # 'use client' 3단 검증 패널 (modal/direct 공용)
│  └─ DeepDive.tsx               # 4단 개념 정리
├─ hooks/
│  ├─ useDetailLoader.ts         # 모달: 상세 Server Action 호출 + 시각 기록
│  └─ useEntrySignals.ts         # 진입 방식·document.title·시각 마커 실측
├─ @modal/
│  ├─ default.tsx                # null
│  └─ (.)products/[id]/page.tsx  # 인터셉트: 요약 seed 즉시 렌더 + 본문 클라이언트 로딩
└─ products/[id]/page.tsx        # 정식: generateMetadata + <Suspense> 상세 스트리밍
```

학습자가 `app/` 트리만 봐도 흐름이 보이도록 (1) `data.ts`의 요약/상세 분리, (2) 인터셉트 쪽엔 `generateMetadata`가 없고 정식 쪽에만 있는 대비를 파일 위치로 드러낸다.

## Steps

0. **교차 검증(읽기 전용)** — `next-devtools` MCP `nextjs_docs`와 `node_modules/next/dist/docs/01-app`으로 다음을 확인하고 `Verification results`에 메모한다: `(.)` 레벨 계산(슬롯은 레벨 미포함), 인터셉트 라우트의 `params` 형태(Promise), 인터셉트 페이지에서 `generateMetadata` 미적용 시 `<title>` 동작, Server Action을 `useEffect`/`useTransition`에서 호출하는 권장 방식.
1. **데이터·타입**: `types.ts`, `data.ts`(요약 3종 + 상세, 상세 조회에 학습용 지연 2초(2000ms), 상수 `DETAIL_DELAY_MS`로 한 곳에서 관리). 요약 없음 링크용 상품(id `204`)은 `PRODUCT_SUMMARIES`에는 없지만 `getProductDetail`로는 조회 가능하게 둔다.
2. **정식 페이지**: `products/[id]/page.tsx` — `generateMetadata`(상품명·설명으로 title/description/OG 필드) + `<Suspense fallback={<DetailSkeleton/>}>` 안 async 로더. 상품 존재하지 않으면 `notFound()`. `EntryVerification mode="direct"`를 포함한다.
3. **인터셉트 페이지**: `@modal/(.)products/[id]/page.tsx` — Client Component. `use(params)`로 id를 읽고 Context seed가 같은 id면 `SummaryHeader`를 즉시 렌더, 아니면 헤더 스켈레톤. `useDetailLoader`가 Server Action으로 본문을 받아 `DetailBody`로 교체. `EntryVerification mode="modal"`을 포함한다. `generateMetadata`·서버 조회는 두지 않는다.
4. **슬롯·레이아웃**: `layout.tsx`(Provider + children + modal), `@modal/default.tsx`.
5. **목록·검증·개념 정리**: `page.tsx`(Server Component, `getDemoMetadata` 유지)에서 `ProductCard` 목록(seed 있는 3개 + seed 없는 1개), 새 탭 직접 진입 링크, 초기화 버튼을 조립. `EntryVerification`은 아래 판정표를 구현하고, `DeepDive`에 구조·요약/상세 분리(용어는 intent 요구사항 5항의 원칙: 쉬운 말 + 괄호 공식 용어)·왜 인터셉트에서 서버 조회를 피하는지(내비게이션이 서버 응답을 기다리지 않게)를 서술한다. 단, 실측하지 못한 서술은 "설명"으로 구분 표기한다.
6. **등록**: `demos.yaml`에 `file-conventions/intercepting-routes/product-detail` 추가(zone `baseline`, status `stub`) → 구현·검증 후 `done` 전환(사용자 승인 뒤). `pnpm --filter @study/demos gen-stubs` 사용 시 이미 만든 파일은 덮어쓰지 않는지 확인한다.
7. **문서 동기화**: 등록 합계가 바뀌면 `docs/09`의 수치·기준일 갱신, `intent/README.md` 작업 인덱스에 행 추가.
8. **검증 수행 후 결과 기록**(아래 Verification).

### 3단 검증 판정표 (실측 값 → 기대값)

| 위치 | 항목 | 기대 | 실제(측정) |
|---|---|---|---|
| 모달 | 진입 방식 | 소프트 내비게이션(문서 최초 경로 ≠ 현재 경로) | Navigation Timing |
| 모달 | 요약 표시 vs 상세 도착 | seed 있음: 요약 표시 시각 < 상세 도착 시각 / seed 없음: 둘 다 상세 도착 후 | `performance.now()` 마커 |
| 모달 | `document.title` | 목록 화면 제목 그대로(상품명 미포함) | `document.title` |
| 직접 | 진입 방식 | 하드 내비게이션(`navigate`/`reload`) | Navigation Timing |
| 직접 | `document.title` | 상품명 포함 | `document.title` |
| 직접 | fallback → 본문 | 스켈레톤 마운트 시각 ≤ 본문 마운트 시각 | 마운트 마커(클라이언트) |

주의: 직접 진입의 스켈레톤→본문 순서는 스트리밍된 HTML을 하이드레이션하는 클라이언트 마커로 근사 측정하는 것이어서 "서버가 청크를 나눠 보냈다"를 직접 증명하지 않는다. 이 한계를 화면에 표기하고, 정확히 확인하려면 curl 청크 순서를 보조 검증으로 쓴다(Verification 참고).

각 파일은 250줄 이하, 컴포넌트는 역할당 1파일.

## Verification

모든 명령은 저장소 루트에서 실행한다.

- **정적 검사**: `pnpm --filter @study/demo-baseline check-types`, baseline ESLint. 통과 조건: 오류 0.
- **등록·매니페스트**: `pnpm --filter @study/demos lint` → `pnpm --filter @study/demos build` → `pnpm test:manifest`. 통과 조건: 신규 데모의 문서·라우트·지시자 유효, 테스트 통과.
- **production 빌드·시작**: `NEXT_DIST_DIR=.next-<포트> next build` → `next start --port <포트>`(다른 세션과 `.next` 락 충돌 방지, `docs/05`). 빌드 라우트 표에서 `products/[id]`가 동적이어도 빌드가 통과하는지 확인.
- **스트리밍 보조 검증**: 정식 URL을 `curl -N`으로 받아 fallback 마크업이 상세 본문 마크업보다 먼저 도착하는지, `<title>`이 상품명인지 확인(`curl`은 인터셉트를 못 타므로 정식 페이지 한정).
- **브라우저 수동 확인**(Chrome, claude-in-chrome 또는 agent-browser): 목록 카드 클릭 → 모달 즉시 요약 → 본문 교체 / 요약 없음 링크 → 전체 스켈레톤 / 모달에서 F5 → 전체 페이지 + 제목 변경 / 새 탭 직접 진입 / 닫기·뒤로·앞으로 / 모바일 폭 가로 넘침 없음. 대기 → 성공, 불일치 시 실패 표시가 관측값으로 계산되는지 확인.
- **dev 확인**: `next dev`에서도 판정이 모드와 무관하게 동작하는지(이 데모는 production 전용 판정이 없어야 한다).
- **회귀**: 기존 `intercepting-routes`, `intercepting-routes/direct-vs-modal` 두 라우트의 HTTP 상태와 브라우저 동작이 변경 전과 같은지 확인.
- **리서치성 항목**: 0단계 교차 검증은 번들 문서와 `nextjs_docs` 두 출처가 일치하는지로 확인한다. 불일치 시 실측을 우선하고 차이를 기록한다.

## Rollback

신규 디렉토리 `product-detail/`를 삭제하고, `demos.yaml`·`docs/09`·`intent/README.md`는 `git diff`를 확인한 뒤 해당 변경분만 되돌린다. 생성 매니페스트는 복원 후 `pnpm --filter @study/demos build`로 다시 만든다. 작업 트리에 이미 다른 미커밋 변경(`intent/README.md`, `demos.yaml` 등)이 있으므로 `git checkout -- <파일>`로 통째로 되돌리지 말고 이 작업의 변경분만 수동으로 제거한다. 로컬 서버를 종료한다.

## Verification results

- 상태: 구현·검증 완료(2026-10-05). 사용자 지시로 `demos.yaml`을 `done`으로 전환하고 main에 직접 커밋했다(PR 없음).
- **0단계 교차 검증**: 번들 문서(`next@16.3.2/dist/docs/01-app/03-api-reference/03-file-conventions/intercepting-routes.md`)에서 `(.)`는 같은 레벨 세그먼트이며 `@slot` 폴더는 레벨 계산에서 제외됨을 확인했다. `nextjs_docs` MCP는 별도 호출하지 않았다(번들 문서 단일 출처).
- **정적 검사**: `pnpm --filter @study/demo-baseline check-types` 통과. ESLint는 baseline에 `eslint.config.*`가 없어 실행하지 못했다(미검증). `pnpm --filter @study/demos lint` 통과, `build`로 매니페스트 재생성(245개), `pnpm test:manifest` 통과(245 유효, 신규 항목 경고 없음).
- **production 실측**(`NEXT_DIST_DIR=.next-3921 next build` → `next start --port 3921`, zone 단독 실행, agent-browser):
  - 빌드 통과. 정식 페이지 curl: `<title>트레일 GTX 하이킹화 | Baseline 데모 - Next.js 학습</title>`, `og:title`, 마크업 순서 summary-header → detail-skeleton → detail-body, TTFB 0.18s / total 2.08s, 없는 id 404.
  - 소프트 내비게이션(카드 클릭): 250ms에 요약 표시, 약 2.0~2.3초에 본문 교체. 모달 패널 `검증 완료`(간격 2016ms·2288ms, 탭 제목에 상품명 없음).
  - 요약 없는 #204: 헤더·본문 스켈레톤 후 2.1초에 함께 표시. 패널 `검증 완료`.
  - 모달에서 새로고침: 정식 페이지(`type: reload`), 탭 제목에 상품명. 새 탭 직접 진입(`navigate`)도 `검증 완료`(스트리밍 응답 수신 1885ms·1999ms).
  - 닫기(`router.back`)·뒤로·앞으로: 목록 ↔ 모달이 정상 전환.
  - 모바일 360/375 가로 넘침 없음(수정 전 541: `<pre>`가 fieldset을 밀어냄 → `whitespace-pre-wrap`으로 수정).
  - 회귀: 기존 `intercepting-routes`, `direct-vs-modal`, `direct-vs-modal/target/201`, `photos/1` 모두 200. HTML 본문·브라우저 동작은 이 대조로 확인되지 않았다.
- **검증 중 발견·수정한 버그**: 스트리밍 중 하이드레이션이 응답 수신보다 먼저 끝나면 `responseEnd`가 0이라 `streamMs`가 -1501ms로 나왔다 → `load` 이벤트 이후에 측정하도록 `useEntrySignals`를 수정, 재확인.
- **미검증·한계**:
  - **dev 모드**: zone 단독 `next dev`에서는 카드 클릭이 소프트 내비게이션이 아니라 하드 내비게이션으로 처리됐다(모달 안 열림). 기존 `direct-vs-modal`도 같은 조건에서 똑같이 동작해 이 데모 코드의 문제가 아니라 단독 dev 환경의 특성으로 보이나 원인은 확인하지 못했다. 셸을 거친 dev 경로는 시도하지 않았다.
  - 셸 iframe 안에서의 `document.title` 동작(Open question)과 Server Action의 언마운트 후 도착 경고 여부는 확인하지 않았다.
  - `eslint`는 실행하지 못했다. Chrome 확장 미연결로 agent-browser를 썼고, 다른 세션과 브라우저를 공유해 한 차례 간섭이 있어 별도 세션으로 재확인했다.
  - 이번 작업에서 Vercel 배포·Preview는 확인하지 않았다.
