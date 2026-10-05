Plan: 렌더링·prefetch 학습 공백 3건 실측 데모 보완
Spec: ./intent.md#requirements--spec-통합
Author: Claude (초안)
Status: approved
Approval: 2026-10-05 대화 승인(PR 없음, 커밋 보류). 사용자가 "2번 신규 데모 생성", "3번 done으로 전환하고 구현"으로 구현을 지시했고, 이에 맞춰 #2를 신규 데모로 바꾼 이 버전을 기준으로 진행한다. 변경 이유와 범위는 [`intent.md`](./intent.md) Approval 참고.

## Scope of change

저장소 루트 기준. 모든 경로는 `nextjs-app/` 아래이며 `z/b` = `apps/demo-baseline/src/app/zone/baseline`, `z/c` = `apps/demo-cache-components/src/app/zone/cache`.

| 항목 | 변경 | 파일·디렉토리 |
|---|---|---|
| #2 | 신규 | `z/b/file-conventions/dynamic-segments/static-or-dynamic/` (`layout.tsx`, `page.tsx`, `no-gsp/[slug]/page.tsx`, `with-gsp/[slug]/page.tsx`, `components/`, `probe.ts`, `routes.ts`, `types.ts`). 기존 `static-and-dynamic`은 수정하지 않는다 |
| #3 | 신규 | `z/c/functions/cookies/suspense-boundary/` (`page.tsx`, `inside/`, `outside/`, `actions.ts`, `components/`, `hooks/`, `types.ts`) |
| #7 | 신규 | `z/c/guides/adopting-partial-prefetching/app-shell/` (`page.tsx`, `partial/`, `legacy/` 대상 라우트, `components/`, `hooks/`, `types.ts`) |
| #7 | 수정 | `z/b/guides/adopting-partial-prefetching/hover-shell/components/DeepDive.tsx` — 신규 `app-shell` 데모 안내 문장만 추가 |
| 공통 | 수정 | `packages/demos/demos.yaml`(신규 3개 `stub` 등록 → 검증 후 `done`), 생성 `packages/demos/demos-manifest.json`(직접 편집 금지, `build`로 재생성) |
| 문서 | 확인 후 필요 시 수정 | `docs/09-demo-status-and-stepwise-release-guide.md`의 등록 합계(241 → 244)와 기준일, `intent/README.md` 작업 인덱스 |

`next.config.ts`·`proxy.ts`·공유 패키지는 변경하지 않는다. 변경이 필요해지면 구현을 멈추고 plan을 갱신해 재승인받는다.

## Steps

0. **교차 검증(구현 전, 읽기 전용)** — `next-devtools` MCP `nextjs_docs`와 `node_modules/next/dist/docs/`로 16.3.2의 `prefetch = 'partial'` 위치(layout/page)·`instant`·`cookies()`+Suspense·`[slug]` 정적 생성 동작을 확인하고 결과를 `Verification results`에 메모한다. intent의 Open questions 3·4를 이 단계에서 닫는다.
1. **#2 실측 먼저**: 임시 `[slug]` 라우트(`generateStaticParams` 없음 / 있음)를 만들어 `next build`의 라우트 표 기호와, `next start` 후 같은 URL 3회 요청의 렌더 ID 개수·`x-nextjs-cache`·`cache-control`을 기록한다. 이 값이 판정 기준(`expectedSymbol`·기대 렌더 ID 수)이 된다. 기대값을 먼저 쓰지 않는다.
2. **#2 구현**: 신규 데모 `dynamic-segments/static-or-dynamic`을 만든다. 라우트 변형(`no-gsp/[slug]`, `with-gsp/[slug]`의 목록 안 값·목록 밖 값)을 요청하는 프로브는 기존 `static-and-dynamic`의 `probe.ts`·`routes.ts` 방식을 참고해 데모 안에 새로 작성하고, 판정을 1단계 실측에 맞춘다(첫 요청 렌더 후 재사용되는 경우 포함). 가이드·개념 정리를 실측 결과로 쓴다. 기존 데모 코드는 건드리지 않는다.
3. **#3 구현**: `inside`(정적 마크업 + `<Suspense fallback>` 안에서 `cookies()` 읽기, `'use cache'` 사용 안 함)와 `outside`(Suspense 없이 `cookies()` 읽기, 0단계에서 확정한 방식으로 셸 포기 명시) 라우트를 만든다. Server Action으로 `demo_cache_*` 접두사 쿠키를 설정/삭제한다. 클라이언트 훅이 두 라우트 HTML을 청크 단위로 읽어 마커 도착 순서·시각을 측정하고(`enable-flag`의 `useStreamProbe` 방식 참고, 코드는 데모 안에 둔다), `ExpectedActualPanel`이 관측값으로 판정한다. 쿠키 없음/있음 두 상태를 모두 측정한다.
4. **#7 구현**: 대상 라우트 2종 — `partial/[id]`(`export const prefetch = 'partial'`, App Shell + `params`/`searchParams` 의존 영역은 Suspense 뒤)와 `legacy/[id]`(export 없음) — 를 만든다. 목록 화면에 같은 라우트를 가리키는 `<Link>` 여러 개와 `<Link prefetch>` 변형을 두고, `PerformanceObserver`(`usePrefetchResourceWatch` 패턴 참고, 코드는 데모 안에 둔다)로 라우트별 prefetch 요청 건수·transferSize·`Next-Router-Prefetch`/segment 헤더 유무를 기록한다. 관측되지 않는 지표는 판정에서 제외하고 사유를 표시한다. dev에서는 0건이 정상임을 모드별 판정으로 구분한다.
5. **등록·안내**: `demos.yaml`에 신규 3개를 `stub`으로 추가하고 `pnpm --filter @study/demos gen-stubs`로 진입점을 확인한 뒤(이미 만든 파일은 덮어쓰지 않는다), 구현·검증이 끝나면 `done`으로 전환한다. `hover-shell` DeepDive에 안내 문장만 추가한다.
6. **문서 동기화**: 등록 합계가 바뀌면 `docs/09`의 수치·기준일을 갱신한다. `intent/README.md` 작업 인덱스에 이 슬러그 행을 추가한다(상태 `draft`, 승인 후 `approved`).
7. **검증 수행 후 결과 기록**(아래 Verification). 커밋은 하지 않는다.

각 파일은 250줄 이하, `page.tsx`는 조립만 하고 로직은 `components/`·`hooks/`·`lib/`로 분리한다.

## Verification

모든 명령은 저장소 루트에서 실행한다.

- **정적 검사**(모든 완료 기준): `pnpm --filter @study/demo-baseline check-types`, `pnpm --filter @study/demo-cache-components check-types`, 두 앱 ESLint. 통과 조건: 오류 0.
- **등록·매니페스트**: `pnpm --filter @study/demos lint` → `pnpm --filter @study/demos build` → `pnpm test:manifest`. 통과 조건: 경고까지 검토해 신규 3개의 문서·라우트·지시자가 유효하고 테스트 통과.
- **production 실측(핵심)**: 두 앱을 `next build` 후 `next start`로 별도 포트에서 띄운다. 다른 세션과 `.next` 락이 겹치지 않도록 `NEXT_DIST_DIR=.next-<포트>`를 쓴다(`docs/05`). 
  - #2: 라우트 표 기호와 3회 요청 렌더 ID 수를 기록하고, 화면의 판정이 `일치`인지 확인.
  - #3: `inside`/`outside` 각각에서 마커 도착 순서가 기대와 일치하는지, 쿠키 없음/있음 모두 확인.
  - #7: `partial`/`legacy` 라우트의 prefetch 건수 차이와 `prefetch` prop 링크의 추가 요청을 Network·화면 로그로 확인.
- **브라우저 수동 확인**: Chrome(claude-in-chrome 또는 agent-browser)에서 각 데모를 가이드 순서대로 조작해 대기 → 성공, 잘못된 순서 → 실패 반영, 초기화 동작 확인. 모바일 폭에서 가로 넘침이 없는지 확인.
- **회귀**: 두 zone production에서 기존 `done` 라우트(`static-and-dynamic` 4개, `dynamic-params-toggle`, `enable-flag`, `hover-shell`, `static-layout-session-context`)의 상태 코드·응답 헤더를 변경 전후로 대조한다(HTML 본문·브라우저 동작은 이 대조로 확인되지 않는다고 기록).
- **dev 환경**: `next dev`에서 모드별 기대값(prefetch 0건, 매번 렌더)으로 판정되는지 확인.
- **리서치성 항목**: 0단계 교차 검증은 공식 문서 번들과 `nextjs_docs` 두 출처가 일치하는지로 확인한다. 불일치 시 실측을 우선하고 차이를 기록한다.

## Rollback

커밋하지 않으므로 작업 트리에서 되돌린다. 신규 디렉토리(`static-or-dynamic/`, `suspense-boundary/`, `app-shell/`)는 삭제하고, 수정 파일(`hover-shell/components/DeepDive.tsx`, `demos.yaml`, 생성 매니페스트, `docs/09`, `intent/README.md`)은 `git diff`를 확인한 뒤 해당 파일만 `git checkout -- <파일>`로 복원한다. 생성 매니페스트는 복원 후 `pnpm --filter @study/demos build`로 다시 만든다. 다른 사람의 변경이 섞였는지 `git status`로 확인한 뒤 되돌린다. 로컬 dev·start 서버는 종료하고 `.next-*/` 산출물은 `.gitignore` 대상이다.

## Verification results

- 상태: 진행 중 (0단계 완료)
- **0단계 교차 검증(2026-10-05, 번들 문서 `node_modules/next/dist/docs/01-app`, next 16.3.2, `nextjs_docs` MCP는 번들 문서 경로를 안내)**:
  - `prefetch` 세그먼트 export는 `cacheComponents` 필요, **Client Component 세그먼트에는 사용 불가**, 값은 `'partial'`/`'force-disabled'`, 링크가 아니라 **도착지**에 둔다. `<Link prefetch={false}>`는 도착지 설정과 무관하게 prefetch를 끈다. → #7 도착지 `page.tsx`는 Server Component여야 한다(Open question 4: layout/page 위치는 실측으로 확정).
  - `cookies()`를 Suspense 밖에서 호출하면 prerender가 막힌다(`cookies.md`). 우회는 `export const instant = false`(`instant-navigation.md`, 기존 `enable-flag/blocking`과 동일 방식). → #3 outside 라우트는 `instant = false`를 쓴다(Open question 3 해소, 빌드 통과는 구현 때 확인).
  - 빌드 기호: `○` Static, `●` SSG(`generateStaticParams`), `◐` Partial Prerender(cacheComponents), `ƒ` Dynamic. `generateStaticParams`는 최소 1개를 반환해야 한다. → #2 baseline(cacheComponents 없음)의 `[slug]` 판정은 `○/●/ƒ`로 실측한다.
- **#2 1단계 실측(2026-10-05, baseline production, `NEXT_DIST_DIR=.next-3911 next build` → `next start --port 3911`, 같은 URL 3회 curl)**:
  - `no-gsp/[slug]`(`generateStaticParams` 없음, 런타임 API 없음): 빌드 표 `ƒ`, 렌더 ID 3개 모두 다름, `cache-control: private, no-cache, no-store`, `x-nextjs-cache` 없음 → **`[slug]`만으로, 런타임 API 없이도 동적**.
  - `with-gsp/alpha`(목록 안): `●`, 렌더 ID 1개, `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `s-maxage=31536000`.
  - `with-gsp/zeta`·`zeta2`(목록 밖, `dynamicParams` 기본 true): 첫 요청 `MISS`, 이후 `HIT`, 렌더 ID 1개 → 첫 요청에 렌더되고 이후 캐시 재사용(요청 시점 생성 후 저장).
  - `with-headers/alpha`: `ƒ`, 렌더 ID 3개, `no-store`. (이후 `generateStaticParams`를 추가해 "목록이 있어도 `headers()`를 쓰면 동적"으로 재측정한다.)
- **#3 실측(2026-10-05, cache zone production, 포트 3912, 청크 단위 스트림 읽기)**: 빌드 표 `inside ◐`, `outside ƒ`. inside는 정적/fallback 약 15~86ms, 쿠키 영역 약 1.2~1.3초(스트리밍 세그먼트 `S:` 있음). outside는 정적·쿠키 영역이 약 1.23초에 함께 도착, fallback 없음. 쿠키 없음/있음 모두 서버가 읽은 값(none/kim-shopping)이 보낸 쿠키와 일치.
- **#2 화면 확인**: baseline 재빌드(`●` with-gsp/alpha·beta, `ƒ` no-gsp·with-headers) 뒤 4개 라우트 SSR 200, 렌더 ID 3/1/1/3개, 화면 문구 포함.
- **정적 검사**: `pnpm check-types`(baseline·cache) 통과, `pnpm --filter @study/demos lint` exit 0, `build`로 매니페스트 재생성, `pnpm test:manifest` exit 0(등록 244, done 243, stub 1).
- **미검증·미완료**:
  - Chrome 확장 미연결로 **브라우저 조작(버튼 클릭 → 대기/성공/실패 전환, 모바일 폭)을 두 데모 모두 확인하지 못했다**. `done`은 사용자 지시와 HTTP 수준 실측에 근거하며 브라우저 확인이 남아 있다.
  - **#7 `app-shell`은 미완료(`stub`)**: 도착지 라우트·링크·RSC 요청 로그까지만 구현. 3단 검증 패널과 4단 개념 정리가 없고(lint 경고 2건), curl로는 라우터 prefetch(`_rsc` 해시 리다이렉트)를 재현하지 못해 prefetch 건수 차이를 아직 관측하지 못했다. 브라우저에서 production 뷰포트 prefetch를 관측해야 판정을 설계할 수 있다. `hover-shell` DeepDive 안내 추가도 #7을 공개할 때 함께 한다.
  - 회귀 대조(기존 done 라우트 헤더 전후 비교), dev 모드 확인, 질문 3의 `instant = false` 외 대안 검토는 하지 않았다.
- 실행 환경: `NEXT_DIST_DIR=.next-3911/.next-3912`(gitignore 대상). 빌드가 수정한 두 앱의 `tsconfig.json`은 되돌렸다.
