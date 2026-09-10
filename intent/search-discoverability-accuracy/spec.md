Spec: 검색 발견성과 공개 정보 정확성 개선
Intent: ./intent.md
Author: devpark
Status: draft
Approval: 사용자 승인 (2026-09-10 `$implement` 지시). 저장소 규칙상 PR 머지 전 단계 효력 없음

## Requirements

### 홈의 예제 수와 표현

- `demos.yaml`의 전체 등록 항목 수와 `status: done` 항목 수를 서버에서 각각 계산한다. 숫자를 컴포넌트에 상수로 복사하지 않는다.
- `Live Demos`, `실행 가능`, `직접 확인`처럼 지금 사용할 수 있다는 뜻의 표현에는 `done` 수만 사용한다.
- 전체 등록 수를 보여줄 때는 `전체 등록` 또는 같은 의미의 문구를 함께 표시해 실행 가능 수와 혼동되지 않게 한다.
- 홈의 추천 데모 카드는 `done` 항목만 연결한다. 추천 목록의 항목이 미완료 상태로 바뀌면 실행 가능한 카드로 계속 노출하지 않는다.
- 학습 진행률에서 사용하는 공개 데모 집계와 `/demo` 목록의 상태 판정은 기존과 같이 `done`을 기준으로 유지한다.

### 문서별 검색·공유 metadata

- `nextjs-docs` 원문으로부터 각 문서의 `seoTitle`과 `description`을 매니페스트 생성 시 결정해 `docs-manifest.json`에 저장한다. 셸에 문서별 사본이나 수동 키워드 표를 만들지 않는다.
- 기본 `seoTitle`은 문서의 H1을 그대로 사용한다. 같은 H1이 둘 이상이면 현재 문서 자신을 제외하고 가장 가까운 상위 `README.md`의 H1을 한정어로 붙여 서로 다른 제목으로 만든다. 한정어도 원문에서만 가져오며 URL 경로나 번호 문자열을 사용자용 문구로 임의 변환하지 않는다.
- `description`은 `## 학습 목표` 아래 첫 번째 불릿을 우선 사용하고 `seoTitle`을 앞에 붙인다. 링크는 표시 문구, 인라인 코드는 코드 내용처럼 사람이 읽는 텍스트를 보존하고 Markdown 표식만 제거한다.
- `## 학습 목표`가 없는 목차형 문서는 `seoTitle`과 문서 유형을 사용한 결정적 대체 문구를 만든다. 현재 전수 조사에서 해당하는 10개 문서를 위해 원문에 별도 frontmatter를 추가하지 않는다.
- 생성 결과가 비어 있거나 상세 문서 사이에서 `seoTitle` 또는 `description`이 중복되면 매니페스트 생성을 실패시켜 새 문서 추가 때 품질 저하를 감지한다.
- 문서 상세의 HTML metadata, Open Graph, Twitter 카드, 동적 OG 제목, `LearningResource` JSON-LD가 매니페스트의 같은 `seoTitle`·`description`을 사용한다. 화면 H1과 학습 기록 키는 기존 문서 title·path를 유지한다.
- 홈과 루트 README는 기존 사이트 metadata를 유지하며 상세 문서 중복 검사 대상에서 제외한다.

### 환경별 색인 정책

- Vercel에서는 `VERCEL_TARGET_ENV`와 `VERCEL_ENV`가 모두 `production`일 때만 현재 production 색인 정책을 유지한다. 둘 중 하나라도 정의된 비-production 값이면 fail-closed로 비공개 색인 환경으로 취급한다.
- `VERCEL_TARGET_ENV`의 사용자 정의 환경 이름(예: `staging`, `qa`)과 `VERCEL_ENV`의 `preview`, `development`, 알 수 없는 값은 모두 비공개 색인 환경에 포함한다. 두 변수가 모두 없을 때만 자체 호스팅·일반 로컬 빌드의 기존 공개 정책을 유지한다.
- 비공개 색인 환경의 모든 셸 페이지 metadata는 `noindex, nofollow`를 내보낸다. 개별 페이지가 production에서 `noindex, follow`를 쓰더라도 비공개 환경에서는 더 강한 전역 정책을 우선한다.
- 비공개 색인 환경의 `robots.txt`는 모든 경로를 차단하고 production sitemap URL을 광고하지 않는다.
- production의 공개 경로 허용, `/zone/`·`/demo-static/` 차단, sitemap 공개 문서·완료 데모 목록, canonical 도메인은 변경하지 않는다.
- Vercel Deployment Protection 설정 확인은 별도 운영 점검으로 남긴다. 코드의 `noindex`·robots 정책은 보호 설정과 독립적으로 동작한다.

### 문서와 검증

- `nextjs-app/docs/07-seo-plan.md`에 환경별 색인 정책, 문서 metadata 원천, 홈 수치 정의와 검증 결과를 반영한다.
- 검색 노출·순위 상승은 완료 판정으로 사용하지 않는다. 구현이 제어할 수 있는 HTML·manifest·robots·sitemap 계약을 검증한다.
- 기존 lint 경고는 새 오류로 계산하지 않되 이 변경으로 경고를 추가하지 않는다.

## Non-goals

- Search Console·네이버 서치어드바이저·Bing Webmaster Tools 등록이나 색인 요청
- production 배포, Vercel 프로젝트 설정·Deployment Protection·도메인 변경
- 검색량·순위·유입 성과 보장, 신규 키워드 랜딩 페이지 제작
- GPTBot·ClaudeBot·Google-Extended 등 학습용 봇의 허용·차단 정책 변경
- 문서 본문 284개에 SEO 전용 frontmatter를 일괄 추가하거나 원문을 재작성하는 작업
- Core Web Vitals, 분석 이벤트, 진행 중인 `demo-learning-fidelity`의 `?run=` 동작 변경

## Design

### 데이터 흐름

`build-manifest.mjs`가 문서를 한 번 읽을 때 기존 `title`과 함께 `seoTitle`·`description` 후보를 수집한다. 전체 문서를 읽은 뒤 H1 중복을 판정하고, 중복 문서만 가장 가까운 상위 README 제목으로 한정한다. 마지막에 빈 값과 중복을 검사한 뒤 manifest의 `docs`와 `urlMap`에 같은 항목을 기록한다.

학습 목표 추출기는 줄 단위로 정확히 `## 학습 목표` 구간을 찾고 다음 H2에서 멈춘다. 첫 불릿의 인라인 Markdown만 정규화한다. 코드 안의 `_`, API 이름, 한글과 영문은 삭제하지 않는다. 현재 상세 문서 283개 가운데 273개는 이 경로를 사용하고, 학습 목표가 없는 목차형 README 10개는 `"{seoTitle}에서 다루는 Next.js App Router 항목과 학습 순서를 정리한 한국어 가이드입니다."` 형식의 대체 문구를 사용한다. 생성 시점의 전수 검사가 이후 문서 수 변화에도 적용되므로 코드에 273·10을 조건으로 넣지는 않는다.

셸의 `DocEntry` 타입에 두 필드를 추가한다. 문서 라우트는 metadata와 JSON-LD를 별도로 조립하지 않고 같은 필드를 전달한다. 본문 H1은 번역 원문의 제목이므로 `doc.title`을 계속 사용한다.

### 색인 정책

색인 가능 여부를 반환하는 작은 순수 함수를 `lib/seo`에 두고 루트 metadata, 공통 `buildPageMetadata`, `robots.ts`가 공유한다. 두 Vercel 환경 변수가 모두 없거나, 정의된 값이 모두 `production`일 때만 true다. `VERCEL_TARGET_ENV`로 사용자 정의 환경을 식별하고 `VERCEL_ENV`를 함께 검사해 모순된 값도 공개로 통과시키지 않는다. 공통 metadata 생성기는 비공개 환경에서 개별 `noIndex` 옵션보다 우선해 `index: false, follow: false`를 반환한다. 루트 metadata에도 같은 정책을 적용해 공통 생성기를 쓰지 않는 경로가 빠지지 않게 한다.

`robots.ts`는 색인 가능 환경에서 기존 규칙과 sitemap을 그대로 반환한다. 비공개 환경에서는 `User-agent: *`, `Disallow: /`만 반환한다. canonical은 production URL을 계속 가리키되 비공개 환경이 `noindex`이므로 Preview URL을 검색 대상으로 만들지 않는다.

### 홈 표시

홈 서버 컴포넌트가 전체 등록 수와 `done` 수를 계산해 Hero와 추천 섹션에 의미가 드러나는 이름으로 전달한다. Hero의 `Live Demos`와 소개 문장은 완료 수를 사용하고, 통계 영역은 완료 수와 전체 등록 수를 함께 표시한다. 추천 카드의 대상은 렌더링 전에 `demos.yaml`의 현재 상태와 대조한다.

## Acceptance criteria

| ID | 사례 | 완료 기준 |
|---|---|---|
| H1 | 홈 첫 진입 | `Live`·`직접 확인` 수가 `demos.yaml`의 `done` 수와 일치하고 전체 등록 수는 별도 문구로 구분된다. 현재 데이터 기준 58개/240개다. |
| H2 | 추천 항목 상태 변경 회귀 | 추천 대상이 `stub` 또는 `wip`이면 실행 가능한 링크로 렌더링되지 않는다. 기존 `done` 추천 링크는 정상 동작한다. |
| M1 | manifest 생성 | 루트 외 모든 문서에 비어 있지 않은 `seoTitle`·`description`이 있고 각각 중복이 없다. 현재 기준 상세 문서 283개다. |
| M2 | Markdown 정규화 | 링크 문구, 인라인 코드와 `node_modules` 같은 식별자는 보존되고 Markdown 표식이나 URL만 description에 남지 않는다. |
| M3 | 문서 상세 응답 | 대표 학습 목표 문서, 목차형 README, H1 중복 문서에서 title·description·OG·Twitter·LearningResource가 manifest 값과 일치한다. |
| E1 | production·환경 변수 없음 | 공개 페이지는 색인 가능하고 기존 canonical, sitemap, zone 차단, `study-progress`·미완료 데모 noindex 계약이 유지된다. |
| E2 | preview·development·사용자 정의 target·알 수 없거나 모순된 환경값 | 모든 페이지 metadata가 `noindex, nofollow`이고 robots가 `/` 전체를 차단하며 sitemap을 포함하지 않는다. |
| Q1 | 정적 검증 | manifest 생성, 관련 단위·계약 테스트, lint, 타입 검사, 전체 테스트가 통과하고 새 경고가 없다. |
| Q2 | 빌드 검증 | 셸 production 빌드를 실행해 결과를 기록한다. 실행 환경 제한으로 불가능하면 오류를 성공으로 바꾸지 않고 제한과 재검증 명령을 기록한다. |
| Q3 | 초기 HTML 점검 | 대표 홈·문서·목차형 문서의 서버 HTML에 수정된 문구와 metadata가 있고 핵심 본문·링크가 클라이언트 실행 없이 유지된다. |

## 조사 근거와 결정

- 2026-09-10 전수 검사에서 manifest는 루트를 포함해 284개 문서를 가진다. 동적 문서 상세는 283개이며 273개에 `## 학습 목표` 첫 불릿이 있다. 나머지 10개는 목차형 README다.
- 현재 상세 문서의 학습 목표 첫 불릿은 서로 중복되지 않고, 30자 미만인 항목은 없으며 가장 긴 항목은 122자다. 제목을 붙여도 검색 description으로 과도한 임의 확장이 필요하지 않다.
- H1은 다섯 쌍이 중복된다. 모든 제목에 경로 문구를 덧붙이지 않고 중복된 경우에만 원문의 상위 README 제목으로 구분한다.
- 별도 frontmatter는 283개 문서 유지 비용을 만들고 원문과 metadata가 어긋날 수 있어 채택하지 않는다. 추출 결과의 빌드 검증으로 품질을 통제한다.
- Preview Deployment Protection은 저장소 밖 설정이라 코드 완료 기준에서 제외하되, 설정이 없을 때도 색인되지 않도록 코드 방어를 둔다.
- [Vercel 시스템 환경 변수 문서](https://vercel.com/docs/environment-variables/system-environment-variables)상 `VERCEL_ENV`는 `production`, `preview`, `development`만 표현하고 `VERCEL_TARGET_ENV`가 사용자 정의 환경 이름을 표현한다(확인: 2026-09-10). 따라서 staging까지 다루려면 두 값을 함께 판정해야 한다.

## Review

adversarial-document-reviewer 관점에서 다음 반례를 설계에 반영했다.

- 두 Vercel 환경 변수가 모두 없는 빌드를 Preview로 오인하면 자체 호스팅 production을 차단할 수 있다. 둘 다 없을 때는 기존 공개 정책을 유지한다.
- Preview의 robots 차단만으로 이미 발견된 URL의 색인 제외를 보장할 수 없다. 페이지 metadata의 `noindex`를 함께 사용한다.
- Markdown 기호를 전역 삭제하면 `node_modules` 같은 코드 식별자가 훼손된다. 구조별 표식만 제거하고 내용 문자는 보존하는 사례를 검사한다.
- H1을 그대로 쓰면 다섯 쌍의 검색 제목이 계속 겹친다. 중복 문서만 원문 기반 상위 제목으로 한정하고 결과 중복을 생성 실패로 처리한다.
- 현재 숫자 58·240을 UI에 고정하면 상태 변경 뒤 다시 부정확해진다. 두 수치는 완료 기준의 기준선일 뿐 런타임 조건에는 넣지 않는다.

## Open questions

- 구현을 막는 제품 결정은 없다. spec 승인 후 파일별 변경 순서, 테스트 위치와 되돌리기 절차를 plan에서 확정한다.
