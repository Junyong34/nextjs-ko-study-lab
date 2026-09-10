Plan: 검색 발견성과 공개 정보 정확성 개선
Spec: ./spec.md
Author: devpark
Status: draft
Approval: 사용자 승인 (2026-09-10 `$implement` 지시). 저장소 규칙상 PR 머지 전 단계 효력 없음

## Scope of change

- `nextjs-docs/scripts/manifest-seo.mjs` — 문서 원문에서 description을 추출하고 중복 H1의 SEO 제목을 구분하는 순수 함수
- `nextjs-docs/scripts/build-manifest.mjs` — SEO 필드 생성·검증 및 manifest 기록
- `nextjs-docs/docs-manifest.json` — 생성 결과 동기화
- `nextjs-app/apps/shell/src/lib/manifest.ts` — `DocEntry`의 `seoTitle`·`description` 타입
- `nextjs-app/apps/shell/src/app/[...slug]/page.tsx` — 문서 metadata·OG·JSON-LD의 단일 manifest 값 사용
- `nextjs-app/apps/shell/src/lib/seo/indexability.ts` — 배포 환경별 색인 가능 여부를 판정하는 순수 함수
- `nextjs-app/apps/shell/src/lib/seo/metadata.ts`, `nextjs-app/apps/shell/src/app/layout.tsx`, `nextjs-app/apps/shell/src/app/robots.ts` — Preview 전역 `noindex, nofollow`와 robots 차단
- `nextjs-app/apps/shell/src/app/page.tsx`, `nextjs-app/apps/shell/src/components/home/RoadmapHero.tsx`, `nextjs-app/apps/shell/src/components/home/FeaturedDemosSection.tsx` — 등록 수·실행 가능 수 구분과 추천 상태 검증
- `nextjs-app/packages/test-suite/src/tier1-feature-coverage/25-search-discoverability-accuracy.test.ts` — manifest, 홈, metadata, 환경별 색인 계약
- `nextjs-app/docs/07-seo-plan.md` — 구현된 정책과 실제 검증 결과
- `intent/search-discoverability-accuracy/` 및 `intent/README.md` — 승인·검증·완료 상태 기록

## Steps

1. **검증 가능한 SEO 파생 로직을 먼저 분리한다.**
   - `manifest-seo.mjs`에 학습 목표 구간 탐색, 인라인 Markdown 정규화, 목차형 문서 대체 description, 가장 가까운 상위 README 제목 탐색, 중복 제목 한정, 최종 빈 값·중복 검사를 둔다.
   - Markdown 정규화는 링크 URL과 표식만 제거하고 링크 표시 문구, 인라인 코드 내용, 밑줄이 포함된 식별자를 보존한다.
   - 가장 가까운 README가 없거나 한정 후에도 중복이면 추측한 경로명을 붙이지 않고 명시적인 오류로 생성을 중단한다.
2. **문서 manifest에 SEO 필드를 생성한다.**
   - `build-manifest.mjs`가 모든 문서의 기본 정보를 수집한 뒤 SEO 파생 로직을 호출하도록 연결한다.
   - 루트 README는 기존 홈 metadata를 사용하므로 상세 문서의 고유성 검사에서 제외한다.
   - 생성된 `seoTitle`·`description`을 `docs`와 `urlMap`의 동일 객체에 기록하고 `docs-manifest.json`을 재생성한다.
   - 생성 전후 문서·URL·내장 데모 수가 SEO 필드 추가 외에는 달라지지 않았는지 비교한다.
3. **문서 상세의 검색·공유 정보를 하나의 값으로 통일한다.**
   - `DocEntry` 타입에 필드를 추가하고 `[...slug]/page.tsx`의 고정 description을 제거한다.
   - HTML metadata, Open Graph, Twitter, 동적 OG 제목, `LearningResource` JSON-LD가 `doc.seoTitle`·`doc.description`을 공유하게 한다.
   - 본문 H1, 브레드크럼의 문서명, 공유 버튼의 화면 제목과 학습 기록 키는 기존 `doc.title`·`doc.path`를 유지해 표시·저장 계약을 바꾸지 않는다.
4. **색인 가능 환경 판정을 중앙화한다.**
   - `indexability.ts`에 `VERCEL_TARGET_ENV`·`VERCEL_ENV` 값을 인자로 검사할 수 있는 순수 함수를 만든다. 두 값이 모두 없거나 정의된 값이 모두 `production`일 때만 허용하고 나머지는 차단한다.
   - 공통 metadata 생성기가 비공개 환경에서는 개별 페이지 설정보다 우선해 `noindex, nofollow`를 반환하도록 한다.
   - 루트 metadata에도 같은 판정을 적용해 공통 생성기를 거치지 않는 페이지의 누락을 막는다.
   - `robots.ts`는 production·값 없음에서는 기존 allow/disallow와 sitemap을 유지하고, 비공개 환경에서는 `/` 전체 차단과 sitemap 생략을 반환한다.
5. **홈의 예제 수와 추천 노출을 상태 기반으로 바꾼다.**
   - 홈 서버 컴포넌트에서 전체 등록 목록과 `done` 목록을 한 번 계산한다.
   - Hero에는 의미가 드러나는 `registeredDemoCount`·`availableDemoCount`를 전달하고 `Live`·`직접 확인`에는 후자만 사용한다. 통계 카드에는 두 수치를 함께 표시한다.
   - 추천 섹션에는 현재 `done` 목록을 전달한다. 정적 추천 항목의 `/demo/{url}`을 목록과 대조해 완료 항목만 카드로 렌더링하고, 헤더에 실행 가능 수와 전체 등록 수를 구분한다.
6. **계약 테스트를 추가한다.**
   - 순수 SEO 파생 함수에 학습 목표 있음·없음, 링크·인라인 코드, `node_modules`, 중복 H1과 상위 README, 해결 불가능한 중복 실패 사례를 추가한다.
   - 실제 생성 manifest의 상세 문서 전체에 비어 있지 않고 고유한 SEO 필드가 있는지 검사한다. 대표 일반 문서·목차형 README·중복 H1 문서의 값도 확인한다.
   - 색인 함수의 두 값 모두 없음, `production`, `preview`, `development`, 사용자 정의 target, 알 수 없는 값, 두 값의 모순 사례를 표 기반으로 검사한다. metadata·robots 소비 지점이 같은 함수를 사용하는 계약도 확인한다.
   - 홈이 `demos.yaml`에서 `done` 수를 계산하고 Hero·추천 섹션에 구분해 전달하는지, 추천 링크가 완료 목록과 대조되는지 검사한다. 58·240은 현재 fixture 검증값으로만 사용하고 UI 소스에 하드코딩되지 않았는지 확인한다.
7. **문서와 상태를 실제 결과에 맞춰 갱신한다.**
   - `07-seo-plan.md`에 홈 수치 정의, manifest metadata 원천, 환경별 색인 표를 기록한다.
   - 아래 검증을 실행하고 성공·실패·환경 제한을 `Verification results`에 그대로 남긴다. 필수 검증을 완료하지 못하면 intent 상태를 `done`으로 바꾸지 않는다.

## Verification

### 자동 검증

| 순서 | 명령 | 확인 대상 |
|---|---|---|
| 1 | `pnpm --filter @study/docs build` | SEO 필드 생성, 빈 값·중복 실패, manifest 재생성 |
| 2 | `pnpm test:tier1` | 새 검색 발견성 계약과 기존 셸 기능 회귀 |
| 3 | `pnpm test:manifest` | 문서·데모 연결 및 URL manifest 무결성 |
| 4 | `pnpm lint` | lint 오류와 새 경고 없음 |
| 5 | `pnpm check-types` | 셸 manifest 타입과 전체 워크스페이스 타입 |
| 6 | `pnpm test` | 전체 5단계 테스트 회귀 |
| 7 | `pnpm --filter @study/shell build` | Next.js production metadata·라우트 빌드 |

각 단계는 앞 단계 실패를 숨기지 않고 기록한다. manifest 생성으로 바뀌는 `generatedAt`은 생성 결과의 일부로 커밋하되, 반복 검증만으로 생긴 시간 차이를 기능 변경으로 설명하지 않는다.

### 데이터·소스 대조

- `docs-manifest.json`의 `totalDocs`, URL 집합, 데모 지시자 수를 변경 전 기준과 비교한다. 의도한 새 필드 외 항목 누락·URL 변경이 있으면 중단한다.
- 상세 문서 수, 학습 목표 추출 수, 대체 문구 수를 다시 집계한다. 현재 기준은 283·273·10이며 원문이 동시에 변경되지 않았다면 일치해야 한다.
- `demos.yaml`에서 전체·`done`·`wip`·`stub` 수를 집계하고 홈에 전달되는 값과 비교한다. 현재 전체 240개, `done` 58개는 기준선이며 코드 상수가 아니다.
- 기존 sitemap이 루트·`/demo`·상세 문서·`done` 데모만 포함하고 `/study-progress`, 미완료 데모, zone 직접 경로를 포함하지 않는지 확인한다.

### 실행 응답 점검

- 가능하면 로컬 셸을 production 모드로 실행해 `/`, 일반 문서 1개, 목차형 README 1개, 중복 H1 문서 2개, `/robots.txt`, `/sitemap.xml`, `/study-progress`, 존재하지 않는 URL의 초기 HTML과 최종 상태를 확인한다.
- production에서는 canonical과 공개 색인 정책, 고유 title·description·OG·JSON-LD, 홈의 실행 가능/전체 등록 문구, 핵심 본문·링크의 초기 HTML 포함을 확인한다.
- `VERCEL_ENV=preview` 및 `VERCEL_TARGET_ENV=staging` 빌드 또는 동일 정책의 직접 함수 검증에서는 `noindex, nofollow`, robots 전체 차단, sitemap 미광고를 확인한다. Preview 빌드가 별도 산출물 충돌을 만들면 임시 작업 디렉터리에서 수행하고 결과만 기록한다.
- 이 환경에서 Next.js 빌드가 프로세스 생성·포트 바인딩 제한으로 실패하면 코드 실패로 단정하거나 통과로 표시하지 않는다. 실패 원문과 로컬/CI 재실행 명령을 남기고 나머지 정적·단위 검증을 완료한다.

## Rollback

- 데이터 마이그레이션과 외부 설정 변경은 없으므로 코드·생성 manifest·운영 문서를 같은 변경 단위로 되돌린다.
- 긴급하게 Preview 정책만 되돌려야 할 경우 `indexability.ts`, 공통 metadata, 루트 metadata, robots 변경을 함께 되돌린다. 한 소비자만 되돌려 robots와 meta robots가 충돌하는 상태를 만들지 않는다.
- 문서 SEO 파생 로직을 되돌릴 때 `manifest-seo.mjs`, 생성기, `DocEntry` 타입, 문서 페이지 소비 코드와 생성된 manifest를 함께 되돌린다.
- 홈 표시를 되돌릴 때 홈 페이지와 두 홈 컴포넌트를 함께 되돌린다. `demos.yaml`은 이 작업에서 수정하지 않으므로 rollback 대상이 아니다.
- 되돌린 뒤 최소 `pnpm --filter @study/docs build`, `pnpm test:tier1`, `pnpm check-types`를 다시 실행한다.

## Verification results

- 상태: 부분 완료 — 코드·정적 검증은 완료, production build·실행 응답 점검은 환경 제한으로 미검증
- `pnpm --filter @study/docs build` — 통과. 284개 문서 manifest 생성, SEO 필드 기록
- 새 계약 테스트 — 통과. `25-search-discoverability-accuracy.test.ts` 7개 사례 통과
- `pnpm test:manifest` — 통과. 240개 데모 경로·문서 연결 유효
- `pnpm lint` — 통과. 기존 캐시 태그 경고 26건, 새 경고 없음
- `pnpm check-types` — 통과. 워크스페이스 9개 패키지
- `pnpm test` — 통과. 집계 480/480
- `pnpm --filter @study/shell build` — 미통과. sandbox 및 권한 확장 재시도 모두 Turbopack 내부 프로세스의 포트 바인딩을 `Operation not permitted`로 거부했다. `globals.css` 처리 중 발생했으며 이번 변경의 타입·테스트 실패로 판정하지 않는다.
- 실패·미검증 항목과 후속 작업: 로컬 또는 CI에서 셸 build를 재실행하고 production·Preview 환경의 HTML metadata, robots, sitemap 응답을 확인한다. 배포·외부 운영 설정 변경은 이 작업에서 수행하지 않았다.

구현 후 실제 결과를 기록한다. 계획만 작성한 상태에서 통과로 표시하지 않는다.

## Review

adversarial-document-reviewer의 깊은 강도로 전제·가정·주요 결정·대안·복잡도를 반증해 다음 조건을 반영했다.

- **상위 README를 찾지 못하는 중복 제목:** 경로 문자열을 임의로 사용자 문구로 만들지 않고 manifest 생성을 실패시켜 콘텐츠 결정으로 되돌린다.
- **정상 robots와 잘못된 meta robots 또는 그 반대:** 색인 판정을 공유하고 두 출력 모두를 테스트·실행 응답에서 확인한다. robots 차단만으로 색인 제외를 입증하지 않는다.
- **실제 문서에서만 우연히 통과하는 추출기:** 실제 corpus 전수 검사와 별도로 작은 합성 입력으로 정규화·중복·실패 경계를 검증한다.
- **정적 추천 목록의 상태 노후화:** 카드 URL을 렌더링 시점의 `done` 목록과 대조한다. 현재 추천 여섯 개가 완료라는 사실을 영구 조건으로 두지 않는다.
- **빌드 불가를 기능 성공으로 해석:** 기존 환경 제한을 명시하고 빌드 결과와 나머지 검증을 분리해 기록한다.
- **`VERCEL_ENV`만으로 staging까지 판정한다는 가정:** 공식 문서에서 사용자 정의 환경은 `VERCEL_TARGET_ENV`로 구분됨을 확인했다. 두 값을 함께 검사하고 모순된 조합은 fail-closed로 처리한다.
- **요청 시점에 원문을 다시 파싱하는 대안:** 페이지마다 파일을 읽으면 metadata와 본문 데이터 흐름이 갈리고 요청 비용이 생긴다. 기존 manifest 빌드 흐름에서 한 번 파생하고 전체 검사를 거치는 쪽을 선택한다.
- **문서별 frontmatter를 추가하는 대안:** 세밀한 편집은 가능하지만 283개 복제 필드의 유지 비용이 문제 크기에 비해 크다. 현 원문의 학습 목표가 273개 문서에서 고유하다는 전수 근거가 깨질 때만 후속 대안으로 재검토한다.
- **새 헬퍼의 복잡도:** manifest 파생 헬퍼는 생성기와 합성 입력 테스트가, 색인 헬퍼는 metadata·layout·robots 세 소비자가 사용한다. 각각 변동 가능성이 큰 규칙을 한곳에서 검증하려는 최소 분리이며 새 프레임워크나 저장 계층은 도입하지 않는다.
