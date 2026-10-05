# 09. 실습 예제 상태 관리 및 단계별 오픈 가이드

데모 공개 상태와 화면별 노출 규칙을 관리하는 대표 문서다. 제작 절차는 [05](./05-zone-onboarding-checklist.md), 제작 표준은 [03](./03-demo-standard-and-layout-pattern.md)을 따른다.

## 1. 현재 등록 상태와 확인 범위

2026-10-05 기준 `packages/demos/demos.yaml`과 `demos-manifest.json`을 대조했다.

| 등록 합계 | 공개 대상으로 지정 (`done`) | 준비 중 (`stub`) | 작업 중 (`wip`) |
|---:|---:|---:|---:|
| 244 | 243 | 1 | 0 |

zone별 등록은 baseline 212, cache 32이다. 2026-10-05에 데모 3개를 추가해 2개를 `done`으로 공개했고 `guides/adopting-partial-prefetching/app-shell`은 검증 패널 미구현으로 `stub`이다. 2026-09-07 기준 기록은 등록 240, `done` 58, `stub` 182였다. 이후 `stub`을 단계적으로 `done`으로 바꿔 2026-10-02에 모두 소진했다. 등록 합계는 그 사이 두 번 바뀌었다. 2026-09-29에 데모 2개를 추가했고, 2026-10-02에 Sass 실습 1개를 삭제했다. 경과는 [7. 2026-10 공개 완료 기록](#7-2026-10-공개-완료-기록)에 정리했다.

이 수치는 메타데이터 상태다. 코드의 존재, 전체 데모의 동작 검증, 현재 배포 환경의 정상 동작을 증명하지 않는다. 특히 `done` 241개가 같은 수준으로 검증됐다는 뜻이 아니다. 일부는 현재 설정에서 실측되는 값만 확인하고 나머지는 설명으로 다룬다. 구분은 [03](./03-demo-standard-and-layout-pattern.md#4-실측형과-설명형-데모)에 있다. 검증 기록에는 대상 URL·커밋·환경·수행 절차·관찰 결과를 별도로 남긴다.

## 2. 상태와 단일 원본

| 값 | 운영 의미 |
|---|---|
| `stub` | 준비 중. 코드가 이미 있어도 공개 전이면 이 상태를 사용할 수 있다 |
| `wip` | 제작 또는 수정 중 |
| `done` | 학습자 실행 대상으로 공개하도록 지정 |

상태 원본은 `demos.yaml`이다. 셸의 `getDemos()`는 `loadDemos()`로 YAML을 읽고 렌더러에 데이터를 전달한다. 공유 zone 메타데이터는 `demos-manifest.json`을 import한다. 두 소비 경로를 맞추기 위해 YAML 수정 뒤 매니페스트를 재생성하고 앱을 빌드·배포한다. 생성 JSON은 직접 편집하지 않는다.

## 3. 화면별 현재 동작

다음은 2026-09-05 코드 대조 결과이며 브라우저 전수 검증 결과가 아니다.

| 화면 | 현재 처리 | 코드 근거 |
|---|---|---|
| 사이드바 | `done`만 노드의 데모 목록·개수·재생 표시 계산에 사용. 공개 데모가 없으면 예제 모드에서 `demoFeasibility: not-applicable`은 설명 대체, 그 외는 준비 중으로 표시 | `apps/shell/src/lib/docs.ts`, `packages/ui/src/nav/doc-tree/` |
| `/demo` 색인 | 전체 데모를 검색·필터 대상으로 전달. `stub`·`wip` 카드에는 준비 중 배지 표시 | `apps/shell/src/lib/demo-index.ts`, `DemoIndexClient`, `DemoStatusBadge` |
| 문서 하단 카드 | 연결된 전체 데모를 표시하고 미공개 항목에 준비 중 표시 | `packages/docs-render/src/markdown/MarkdownRenderer.tsx`, `DocDemoList` |
| 본문 `demo` 지시자 | 상태 필터·배지 없이 `/demo/{url}` 링크 생성 | `packages/docs-render/src/demo/DemoLinkCard.tsx` |
| 직접 `/demo/{url}` | `done`이 아니면 `DemoEmptyState`, `done`이면 뷰어 | `apps/shell/src/app/demo/[...slug]/page.tsx` |
| 문서별 `/demo/{문서 경로}` | 연결된 `done`이 없으면 준비 중. 하나 이상 있으면 전체 연결 데모를 허브에 전달 | 같은 라우트, `DocDemoHub` |
| 문서별 허브의 `?run=` | 선택 결과의 상태를 다시 검사하지 않고 뷰어에 전달. 아래 후속 항목 참고 | 같은 라우트 |
| 학습 기록 | `done`만 데모 inventory에 포함 | `apps/shell/src/lib/learning-progress/inventory.ts` |
| 홈 책장 | 카테고리별 `done` 개수를 계산하고 공개 예제가 있는 경우 예제 책 표시 | `RoadmapBookshelf` |
| 홈 추천 카드 | `FeaturedDemosSection`의 고정 목록. 상태 필터 없음 | `apps/shell/src/components/home/FeaturedDemosSection.tsx` |
| sitemap | `done` 데모의 직접 URL만 포함 | `apps/shell/src/app/sitemap.ts` |

공개 상태는 접근 권한이나 보안 경계가 아니다. 내부 `/zone/*` 경로에 상태 기반 차단이 있다고 가정하지 않는다.

2026-10-02 현재 등록 데이터에는 `stub`·`wip`가 없어 위 표의 준비 중 분기는 데이터상 실행되지 않는다. 분기 코드는 그대로 남아 있으므로 새 데모를 `stub`으로 등록하면 즉시 다시 적용된다. 이 표의 코드 대조 기준일(2026-09-05)은 바꾸지 않았다. 다만 `?run=` 처리와 홈 추천 목록 코드는 2026-10-02에 다시 읽어 아래 §5의 설명이 유지됨을 확인했다.

## 4. 단계별 공개 절차

모든 명령은 저장소 루트에서 실행한다.

1. 대상 데모를 로컬에서 확인한다: `pnpm dev`. 예를 들어 `/demo/caching/basic`과 셸 프록시 `/zone/cache/caching/basic`, 직접 zone 서버 `http://localhost:3002/zone/cache/caching/basic`의 차이를 확인한다. 아직 미공개이면 셸의 직접 데모 URL은 준비 중 화면이므로 내부 경로에서 동작을 점검한다.
2. 가이드 절차, 실제 결과, 오류·초기화 흐름을 기록한다. 배포 의존 기능은 해당 환경의 증거도 필요하다. 학습 문서의 완료 상태도 확인한다.
3. 대상 `demos.yaml` 항목만 `done`으로 변경한다.
4. `pnpm --filter @study/demos lint`로 문서·라우트·지시자를 검사하고, `pnpm --filter @study/demos build`로 생성 JSON을 갱신한다. 경고도 검토한다.
5. `pnpm test:manifest`와 대상 기능의 검증을 수행한다. 앱 빌드·재배포 후 목록, 직접 진입, 문서별 허브, 학습 기록에 반영됐는지 확인한다.
6. `git diff`를 검토하고 변경한 문서·데모 파일 및 YAML·생성 JSON만 명시적으로 스테이징한다. 커밋 형식은 루트 작업 규칙을 따른다.

## 5. 별도 구현 후속 항목

이번 문서 정비에서도 다음 코드는 변경하지 않았다.

- **공개 상태·소속 재검사**: 문서별 허브에 공개 데모가 하나 이상 있으면 `?run=`이 다른 문서의 데모를 선택할 수 있다. 잘못된 값도 첫 항목으로 대체된다. 직접 URL과 같은 공개·소속 검증이 필요한지 별도 구현에서 해결한다. 2026-10-02 기준으로 등록 데모가 모두 `done`이므로 "미공개 데모를 선택할 수 있다"는 위험은 현재 데이터에서 발생하지 않는다. 소속 검증이 없다는 점과, 새 `stub`을 등록하면 위험이 되살아난다는 점은 그대로다.
- **홈 추천 목록**: 고정 목록을 공개 상태와 대조하지 않는다. 현재 데이터에서는 추천 대상이 모두 `done`이지만, 상태를 `stub`으로 되돌리면 추천 카드가 준비 중 대상으로 연결될 수 있다.

수정·검증 전에는 “미공개 데모 실행이 모든 경로에서 차단된다” 또는 “추천은 검증 완료된 데모로만 구성된다”고 설명하지 않는다.

## 6. 2026-09-07 아키텍처 데모 공개 기록

목록 하단에서 다른 작업과 겹치지 않도록 다음 5개를 선택해 `stub`에서 `done`으로 변경했다.

- `architecture/accessibility/form-aria-support`
- `architecture/accessibility/modal-focus-trap`
- `architecture/compiler-optimization/react-compiler`
- `architecture/server-action-security/csrf-protection`

고정 성공 문구 대신 실제 DOM 속성, native modal dialog, Next.js 16.3 네이티브 React Compiler 설정, Server Action 요청 헤더를 관찰하도록 구현했다. 등록 lint·매니페스트 생성·일관성 검사·타입 검사·전용 계약 테스트는 통과했다. Turbopack 항목은 저장소를 별도로 제공해야 하는 로컬 실습이라 공개 데모에서 제외했다.

다른 세션이 baseline 개발 서버와 빌드 산출물을 사용 중이어서 독립 브라우저 상호작용 검증은 보류했다. 앱 빌드는 기존 CSS 처리 worker의 로컬 포트 바인딩 제한으로 중단됐으며, 공개 배포 전 남은 4개 직접 URL과 폼·병렬 라우트·ARIA·Server Action을 다시 확인한다.

## 7. 2026-10 공개 완료 기록

2026-09-08의 `done` 58개에서 2026-10-02의 241개까지 `stub`을 여러 차례에 나눠 `done`으로 바꿨다. 같은 기간 `demos.yaml`의 `done` 수는 커밋 단위로 59, 65, 71, 87, 110, 133, 153, 183, 198, 222, 232, 241로 늘었다. 마지막 구간의 변경은 다음과 같다.

| 날짜 | 변경 | 커밋 |
|---|---|---|
| 2026-10-01 | `stub` 5개 — `next.config`의 `redirects`·`rewrites`·`headers`(source를 데모 경로로 한정)와 `env`(키 접두사 `DEMO_ENVFIELD_`로 한정)를 시연하는 `config/*` 데모 | `8166967` |
| 2026-10-01 | `stub` 5개 — `config/rewrites/cross-zone-proxy`, `guides/multi-zones/cross-zone-routing`, `guides/instrumentation/server-register-hook`, `config/cache-components/enable-flag`, `config/cache-life/custom-presets` | `9e23a6f` |
| 2026-10-02 | `stub` 10개 — 앱 전역 설정을 다루는 설명형 데모(아래) | `6117767` |
| 2026-10-02 | `stub` 9개 — SWR·TanStack Query·MDX·third-parties·OpenTelemetry. 의존성 추가 포함. Sass 실습 1개는 삭제 | `5d985c8` |

변경 때마다 다음을 확인했다. 기록의 한계도 함께 적는다.

- **다른 페이지 영향**: `9e23a6f`, `6117767`, `5d985c8`는 production 서버에서 기존 done 라우트의 상태 코드와 응답 헤더를 변경 전후로 대조했고 차이는 없었다. 대조한 기존 라우트는 baseline 192~202개, cache 25~27개다. `8166967`은 전체 대조 없이 설정 대상 경로와 무관한 경로의 응답 헤더를 개별 확인했다. 어느 경우도 HTML 본문이나 브라우저 동작까지 비교한 것은 아니다.
- **타입·빌드·린트**: 두 zone의 타입 검사와 production 빌드, `@study/demos` lint를 통과했다.
- **확인하지 않은 것**: 셸의 `/demo/{url}` iframe 경유 화면, Vercel 배포 환경, GA·YouTube 같은 외부 네트워크 의존 동작의 재현. 위 작업은 zone 직접 접근(3001·3002)으로 확인했다.

### 설명형으로 공개한 데모 14개

앱 전체에 영향을 주는 설정은 이 앱에서 켜면 다른 데모가 바뀌므로 켜지 않았다. 대신 현재 설정에서 실측되는 값을 확인하고, 켜야만 보이는 동작은 설정 예제·확인 절차·개념 확인으로 설명한다. 기준은 [03의 4절](./03-demo-standard-and-layout-pattern.md#4-실측형과-설명형-데모)에 있다.

- 2026-09-30 (`ebb4dc6`): `config/base-path/subpath-routing`, `config/asset-prefix/cdn-distribution`, `config/output/export-static-spa`, `config/output/standalone-container`
- 2026-10-02 (`6117767`): `config/trailing-slash/url-normalization`, `config/images/remote-patterns-security`, `config/images/formats-avif-webp`, `config/logging/fetches-full-url`, `config/dev-indicators/render-badge`, `config/cross-origin/anonymous-mode`, `config/cache-handlers/redis-kv`, `config/expire-time/memory-isr-tuning`, `config/stale-times/router-cache-tuning`, `guides/static-exports/client-routing`

이 14개를 `stub`으로 되돌릴지는 열린 결정이다. `stub`으로 되면 위 §3 표대로 준비 중으로 표시되고 학습 기록·sitemap에서 빠진다.

### 알려진 한계

- **`guides/adopting-partial-prefetching/hover-shell`**: 제목은 Partial Prefetching 예시지만 baseline zone은 `cacheComponents`를 켜지 않아 그 기능을 시연할 수 없다. 이 데모는 기본 `<Link>` prefetch와 클릭 뒤 동적 영역 스트리밍을 실측한다. 제목과 내용의 차이를 알고 `done`으로 유지하고 있다.
- **`guides/instrumentation/server-register-hook`**: `onRequestError`의 로그를 화면에서 읽으려고 `console.error`를 프로세스 전역에서 한 번 감싼다. 원래 출력은 그대로 통과한다. `instrumentation.ts`를 직접 수정하는 방식이 더 나은지는 열린 결정이다.
- **`guides/opentelemetry/trace-span`**: `next dev`에서 서버가 HMR되면 `fetch` 계측이 풀려 `traceparent`가 빠진다. 화면이 불일치와 재시작 안내를 보여 준다. production에서는 확인한 범위에서 정상이다.
- **`config/rewrites/cross-zone-proxy`**: baseline이 cache zone 주소를 조회하는데 Vercel 연결 설정에 아직 없다. 배포 환경에서는 동작하지 않을 수 있다. 자세한 내용은 [04의 3절](./04-vercel-deployment-plan.md#3-환경변수-배치)에 있다.
