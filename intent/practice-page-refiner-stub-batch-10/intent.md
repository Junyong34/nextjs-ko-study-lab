Intent: 시뮬레이션 상태 stub 실습 10개 실동작 재구성 (practice-page-refiner)
Author: Claude
Status: done
Approval: 2026-09-29 대화 승인. 사용자가 `demos.yaml`의 stub 10개를 골라 `practice-page-refiner` 스킬로 작업하고 완료 뒤 `done`으로 전환하도록 지시했다. 작업 브랜치는 main, 실행은 Orca 서브에이전트(codex 6 + claude 4)로 지정했다. 승인 대상 stub 목록은 아래 표다. 같은 날 codex 워커가 Orca에서 시작되지 않아 사용자 승인을 받고 #1~#6을 claude 워커로 대체했다(상세는 plan.md). 이후 #1~#6은 codex가 재검토·보강한 뒤 10개 모두 `done`으로 전환했다.

## Problem

`nextjs-app/packages/demos/demos.yaml`에 `status: stub`인 항목이 남아 있다. 이 중 새 의존성(swr·tanstack-query·sass·@next/third-parties)이나 공유 설정(`next.config.ts`, `proxy.ts`) 변경 없이 페이지 디렉토리 안에서 구현할 수 있어 보이는 10개를 골랐다. 아래 "파일 구성"은 디렉토리를 직접 나열해 확인한 사실이다. 각 데모의 동작·검증 로직이 실제로 어떤지는 아직 코드를 읽어 판정하지 않았고, 워커가 `practice-page-refiner` Step 3에서 평가한다.

| # | 대상 (url) | zone | 담당(계획) | 파일 구성(작업 전, 확인됨) |
|---|---|---|---|---|
| 1 | `guides/caching-legacy/fetch-cache` | baseline | codex | page 46줄, `LegacyFetchCacheDemo` 17줄, `VerificationFooter` 107줄. route·action 없음 |
| 2 | `guides/environment-variables/runtime-env` | baseline | codex | page 57줄, `RuntimeEnvDemo` 60줄, `api/status/route.ts` 13줄, layout 8줄 |
| 3 | `file-conventions/default/parallel-fallback` | baseline | codex | page 46줄, `DefaultParallelFallbackDemo` 53줄. `default.tsx`·`@slot` 디렉토리 없음 |
| 4 | `file-conventions/parallel-routes/conditional-slot` | baseline | codex | layout, page, `@admin`·`@user`(각 page·default), `ParallelConditionalDemo` 29줄 |
| 5 | `file-conventions/parallel-routes/independent-tabs` | baseline | codex | page 46줄, `ParallelIndependentTabsDemo` 129줄. `@slot` 디렉토리·layout 없음 |
| 6 | `guides/i18n/subpath-routing` | baseline | codex | page 46줄, `I18nSubpathDemo` 17줄. `[lang]` 세그먼트 없음 |
| 7 | `guides/data-security/react-taint-api` | baseline | claude | page 87줄, `actions.ts` 34줄, `lib/taintedPaymentConfig.ts` 19줄, `ReactTaintDemo` 68줄 |
| 8 | `guides/auth-cache-components/private-cache-user` | cache | claude | page 87줄, `actions.ts` 33줄, `cachedData.ts` 35줄, `types.ts`, `PrivateCacheDemo` 78줄 |
| 9 | `edge/v8-lightweight/nodejs-modules-bailout` | baseline | claude | page 46줄, `EdgeNodejsBailoutDemo` 101줄. route·runtime 설정 파일 없음 |
| 10 | `guides/analytics/custom-beacon` | baseline | claude | page 46줄, `AnalyticsBeaconDemo` 12줄. 수신용 route 없음 |

참고: 위 표의 줄 수와 파일 유무만 사실이다. 판정(KEEP/IMPROVE/REBUILD/EXPLANATION)은 워커가 정한다. 항목 7의 `experimental_taintObjectReference`는 `taint` 플래그가 켜져 있어야 동작하므로, 이 플래그가 `next.config.ts`에 이미 있는지 워커가 확인하고 없으면 수정하지 말고 escalation한다.

## Proposed outcome

- 각 항목을 `practice-page-refiner` 스킬 절차(평가 → KEEP/IMPROVE/REBUILD/EXPLANATION 판정 → 구현 → 런타임·코드 검증)로 처리한다.
- 실습화면은 실제 API·라우트 동작을 관찰하고, 검증 패널은 그 실측값으로 성공/실패를 판정한다(No-Simulation).
- 검증까지 마친 항목만 `demos.yaml`에서 `stub → done`으로 전환하고 `demos-manifest.json`을 재생성한다.

## Requirements / Design 통합

- `@study/demo-kit` 4단 컴포넌트(`DemoContainer`/`DemoGuideCard`/`DemoPlaygroundCard`/`ExpectedActualPanel`/`DemoDeepDiveCard`/`DemoResetButton`)를 재사용하고, 파일당 250줄 제한과 `page.tsx`/`actions.ts`/`types.ts`/`components/`/`hooks/` 분리를 지킨다.
- Next.js API는 `next-devtools` MCP(`nextjs_docs`)로 16.3.2 기준을 교차 검증한다.
- 각 워커는 자기 데모 디렉토리 밖을 수정하지 않는다. `demos.yaml`, `demos-manifest.json`, 공유 패키지, `next.config.ts`, `proxy.ts`, intent 문서, git 상태는 코디네이터만 다룬다.
- 같은 워크트리(main)에서 워커가 동시에 돌므로 `next build`는 워커가 실행하지 않는다(`.next` 충돌). 워커는 `check-types`와 이미 떠 있는 dev 서버(3001 baseline, 3002 cache) 기준 curl·브라우저 관찰만 한다. 빌드는 코디네이터가 통합 후 한 번씩 실행한다.

## Acceptance criteria

- 10개 각각에 대해 판정(KEEP/IMPROVE/REBUILD/EXPLANATION), 평가 4영역, 실제 관찰 근거를 담은 워커 보고가 있다.
- 실습형으로 판정된 항목은 검증 패널이 조작 전 대기, 조작 후 실측 기준 성공/실패를 반영한다.
- `pnpm --filter demo-baseline check-types`, `pnpm --filter demo-cache-components check-types`, 두 zone `next build`, `@study/demos` lint/build가 통과한다.
- 검증하지 못한 항목은 `done`으로 올리지 않고 사유를 plan에 기록한다.

## Affected users and systems

- 사용자: 위 10개 주제를 처음 실습하는 학습자.
- 시스템: `nextjs-app/apps/demo-baseline/src/app/zone/baseline/` 아래 대상 9개 디렉토리, `nextjs-app/apps/demo-cache-components/src/app/zone/cache/guides/auth-cache-components/private-cache-user/`, `nextjs-app/packages/demos/demos.yaml`, `demos-manifest.json`.

## Constraints

- 새 의존성 추가 없음(swr·tanstack-query·sass·@next/third-parties가 필요한 stub은 이번 범위에서 제외).
- 공유 설정 파일 변경이 필요한 주제는 범위에서 제외하고, 워커가 필요성을 발견하면 수정하지 말고 코디네이터에게 escalation한다.
- 커밋·push는 사용자 요청 전에는 하지 않는다.
