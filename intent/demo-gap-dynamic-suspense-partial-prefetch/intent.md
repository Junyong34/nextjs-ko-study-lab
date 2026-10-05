Intent: 렌더링·prefetch 학습 공백 3건(`[slug]` 동적 판정, `cookies()`+Suspense 셸, Partial Prefetching) 실측 데모 보완
Author: Claude (초안)
Status: approved
Approval: 2026-10-05 대화 승인(PR 없음, 커밋 보류). 초안 검토 뒤 사용자가 열린 질문에 답하며 구현을 지시했다 — "2번 신규 데모 생성", "3번 done으로 전환하고 구현". 질문 1(`hover-shell` 제목)은 사용자가 의미를 묻고 선택하지 않아 기본안(제목 유지, 안내 문장만 추가)을 적용한다. 앞선 요청("main 브랜치에서 작업, 커밋은 바로 하지 말 것")이 계속 유효하다. 이 승인은 아래 요구사항 버전에 한한다.

## Problem

학습자가 던진 질문 6개를 기존 실습·시각화와 대조한 점검(2026-10-05)에서 아래 3건이 비어 있었다. 점검은 코드·문구를 읽은 결과이며 브라우저 실행 검증은 아니다.

| # | 학습 질문 | 현재 상태 | 학습상 영향 |
|---|---|---|---|
| 2 | 라우트가 동적 렌더링으로 넘어가는 조건은? `[slug]`가 있으면 동적인가? | `file-conventions/page/static-and-dynamic`은 `headers()`·`searchParams`·`connection()`만 ○/ƒ로 대조하고 동적 세그먼트 라우트가 없다. `dynamic-params-toggle`은 `generateStaticParams`에 없는 값의 on-demand 렌더 vs 404만 보이고 ○/ƒ·렌더 ID 재사용은 측정하지 않는다. | "`[slug]`만으로 동적이 되는가"를 직접 확인할 수 없다. |
| 3 | `cookies()`를 읽는 컴포넌트를 `<Suspense>`로 감싸면 바깥은 정적으로 남는가? | cache zone `static-layout-session-context`는 `'use cache'` 셸과 Suspense를 함께 쓴다. `enable-flag`의 probe/blocking 대조는 `cookies()`가 아니라 `connection()`을 쓴다. | Suspense만으로 셸이 남는지, `cookies()`를 Suspense 밖에서 읽으면 어떻게 되는지 분리해서 볼 수 없다. |
| 7 | 16.3 `partialPrefetching`은 무엇을 해결하는가? | `adopting-partial-prefetching/hover-shell`(baseline zone)은 제목이 "Partial Prefetching 예시"지만 DeepDive에 "`cacheComponents`가 없어 App Shell prefetch는 시연하지 못한다"고 적혀 있고 `Link` 기본 prefetch만 실측한다. `partialPrefetching`·`prefetch = 'partial'`은 두 zone의 코드 어디에도 켜져 있지 않다. | App Shell 하나를 여러 링크가 공유한다는 핵심 효과가 글로만 존재한다. |

근거: 각 데모의 `page.tsx`·`layout.tsx`·`DeepDive.tsx`·`VerificationFooter.tsx`, `nextjs-docs/3-api-reference/3.5-config/3.5.1-next-config-js/partialPrefetching.md`, `.../3.1.22-route-segment-config/prefetch.md`, `nextjs-docs/2-guides/adopting-partial-prefetching.md`(데모 설계 절: "Phase 2에서 구현 예정"). 기존 질문 1·4·5는 충분히 다뤄져 이번 범위에서 제외한다.

## Proposed outcome

학습자가 아래를 **이 저장소의 실제 응답·네트워크 관찰값**으로 확인한다.

- **#2**: `[slug]` 라우트를 ① `generateStaticParams` 없음 ② 있음(목록 안 값 / 목록 밖 값)으로 나누어 실제 요청하고, 렌더 ID 개수·`x-nextjs-cache`·`cache-control`로 ○/ƒ 판정을 비교한다. 판정 기준값은 **구현 중 production 실측으로 먼저 확정**하고, 문서·가이드의 서술을 그 실측에 맞춘다(추측한 기대값을 먼저 쓰지 않는다).
- **#3**: cache zone에서 `cookies()` 읽기를 ① `<Suspense>` 안 ② `<Suspense>` 밖(셸 포기를 명시한 대조 라우트)으로 놓고, 응답 스트림에서 정적 마크업·fallback이 쿠키 값보다 먼저 도착하는지 측정한다. `'use cache'` 없이 순수 정적 마크업만으로 셸이 남는지 확인해 기존 `static-layout-session-context`와 역할을 구분한다.
- **#7**: cache zone에서 세그먼트 단위 `export const prefetch = 'partial'`로 Partial Prefetching을 선택한 라우트와 선택하지 않은 라우트를 대조한다. 같은 라우트를 가리키는 여러 `<Link>`가 App Shell prefetch를 공유하는지(요청 건수), `<Link prefetch>`가 URL 데이터까지 추가로 요청하는지를 `PerformanceObserver` 요청 로그로 확인한다. 전역 `partialPrefetching` 플래그는 켜지 않는다.

## Requirements / Spec 통합

1. **신규 데모 3개**로 구성한다(기존 데모 코드는 수정하지 않는다).
   - #2: baseline 신규 `file-conventions/dynamic-segments/static-or-dynamic` (문서 `3-api-reference/3.1-file-conventions/dynamic-routes.md`, zone `baseline`). 기존 `static-and-dynamic`과 같은 판정 방식을 쓰되 별도 데모로 둔다.
   - #3: cache zone 신규 `functions/cookies/suspense-boundary` (문서 `3-api-reference/3.3-functions/cookies.md`, zone `cache`).
   - #7: cache zone 신규 `guides/adopting-partial-prefetching/app-shell` (문서 `2-guides/adopting-partial-prefetching.md`, zone `cache`).
2. **No-Simulation**(`nextjs-app/docs/03`): 렌더 ID·응답 헤더·스트림 청크 순서·`performance` 리소스 항목 같은 실제 관찰값만 검증 패널의 "실제"로 쓴다. 고정 성공 문구와 로컬 상태 흉내를 쓰지 않는다.
3. **전역 설정 무변경**: `next.config.ts`의 `partialPrefetching`·`staleTimes` 등 앱 전체 옵션을 켜지 않는다(`nextjs-app/docs/05` 데모 추가 체크리스트). #7은 세그먼트 `prefetch = 'partial'`만 사용한다. 쿠키·스토리지 키는 `demo_cache_*` 접두사를 쓴다.
4. 4단 레이아웃(`DemoGuideCard` → 실습 → `ExpectedActualPanel` → `DemoDeepDiveCard`), 파일당 250줄 이하, `page.tsx` 조립 + `components/`·`hooks/`·`types.ts` 분리를 지킨다. 새 의존성은 추가하지 않는다.
5. **dev/production 차이를 화면에 명시**한다. prefetch 관측(#7)과 ○/ƒ 판정(#2)은 production(`next build && next start`)에서만 의미가 있고, dev의 0건·매번 렌더는 오류가 아님을 판정 패널이 모드별로 구분한다(기존 `static-and-dynamic`의 `RUN_MODE` 방식 재사용).
6. 신규 3개는 `demos.yaml`에 `stub`으로 등록 → 구현·검증 후 `done`으로 전환한다(사용자 지시). 학습 문서(md) 상태가 완료인지 확인한다.
7. 실측하지 못한 항목(예: `cacheComponents` 앱에서 `generateStaticParams` 없는 `[slug]`의 `params` 접근 오류)은 **설명형으로 구분 표기**하고 실측했다고 쓰지 않는다.

## Acceptance criteria

- #2: production 빌드에서 `[slug]` 라우트 변형이 각각 몇 개의 렌더 ID를 반환하는지·빌드 출력 기호가 무엇인지 기록되고, 가이드·개념 정리 문장이 그 실측과 일치한다. dev에서는 모드별 기대값으로 판정된다.
- #3: production에서 Suspense 안 `cookies()`는 정적 마크업·fallback이 쿠키 값 마커보다 먼저 도착함이 측정되고, 밖(대조 라우트)은 그렇지 않음이 측정된다. 쿠키가 없는/있는 두 상태 모두 확인한다.
- #7: production에서 `prefetch = 'partial'` 라우트를 가리키는 링크 N개의 App Shell prefetch 요청 건수와, 선택하지 않은 라우트의 건수가 로그로 대조된다. `prefetch` prop 링크의 추가 요청이 관측된다. 관측되지 않는 항목은 판정에서 제외하고 사유를 표기한다.
- 세 항목 모두 검증 패널의 `isMatched`가 관측값으로 계산되고, 조작 전 대기·성공·실패가 정확히 반영된다.
- 기존 데모(`static-and-dynamic` 4개 하위 page, `enable-flag`, `hover-shell`)의 동작·판정이 달라지지 않는다. `hover-shell`은 DeepDive 안내 문장만 추가된다.
- TypeScript·ESLint·`pnpm --filter @study/demos lint`·`build`(매니페스트 재생성)·`pnpm test:manifest`·두 zone production 빌드가 통과한다.

## Affected users and systems

- 사용자: 렌더링 모델(정적/동적, Suspense 셸)과 prefetch를 학습하는 학습자
- 시스템: `nextjs-app/apps/demo-baseline/.../file-conventions/dynamic-segments/static-or-dynamic/`(신규), `nextjs-app/apps/demo-cache-components/.../functions/cookies/suspense-boundary/`(신규), `.../guides/adopting-partial-prefetching/app-shell/`(신규), `nextjs-app/packages/demos/demos.yaml`와 생성 `demos-manifest.json`, 해당 문서·ADR 갱신 여부는 plan에서 확정

## Constraints

- 반드시 지킬 것: Next.js 16.3.2 기준. 구현 전 `next-devtools` MCP(`nextjs_docs`)와 번들 공식 문서로 `prefetch`·`instant`·`cookies()` 동작을 교차 검증한다(`nextjs-app/AGENTS.md` 5항).
- 반드시 지킬 것: 이번 작업은 **main 브랜치에서 진행하고 커밋하지 않는다**(사용자 지시). 변경은 작업 트리에 남긴다.
- 반드시 지킬 것: 승인 전에는 읽기 전용 조사만 한다. 구현은 plan 승인 후 시작한다.
- 범위 밖: 질문 1·4·5 관련 데모 수정, 전역 `partialPrefetching`·`staleTimes` 활성화, 시각화(`/visualize`) 신규 추가, 기존 데모 전면 개편, 배포·Preview 검증, `done` 전체 재검증.

## Open questions

해결됨(2026-10-05):

- `hover-shell` 제목: 변경하지 않는다. DeepDive에 신규 `app-shell` 데모 안내만 추가한다.
- #2 위치: 기존 데모를 확장하지 않고 신규 데모로 분리한다.

plan 구현 단계에서 실측·교차 검증으로 확정:

- #3 대조 라우트가 `cookies()`를 Suspense 밖에서 읽을 때 빌드 오류를 피하려면 세그먼트 `instant = false`가 필요한지, 다른 방식이 있는지(기존 `enable-flag/blocking`은 `instant = false` 사용).
- #7 `prefetch = 'partial'`을 `layout.tsx`와 `page.tsx` 중 어디에 둘지, URL 데이터(`params`)에 의존하는 영역을 어떻게 구성할지.
