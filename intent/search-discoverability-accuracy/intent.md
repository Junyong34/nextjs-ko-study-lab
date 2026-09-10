Intent: 검색 발견성과 공개 정보 정확성 개선
Author: devpark
Status: draft
Approval: 사용자 승인 (2026-09-10 대화 메시지). 저장소 규칙상 PR 머지 전 단계 효력 없음

## Problem

공개 셸 사이트의 크롤링·canonical·sitemap·초기 HTML은 기본 동작이 갖춰져 있지만, 검색 결과와 첫 화면에서 사용자가 페이지의 실제 가치와 제공 범위를 정확히 판단하기 어려운 부분이 남아 있다.

2026-09-10 소스와 운영 사이트를 대조한 근거는 다음과 같다.

1. 홈은 등록된 예제 240개 전체를 `240 Live Demos`로 표시하고 “240개 실습 예제에서 핵심 기능의 동작을 직접 확인”할 수 있다고 안내한다. 같은 시점 `/demo`가 표시하는 구현 완료 예제는 58개이며, 나머지는 `stub` 또는 `wip` 상태다. 등록 수와 실행 가능 수가 섞여 공개 범위를 실제보다 크게 보이게 한다.
2. 매니페스트의 문서 284개 중 루트 README를 제외한 283개 문서 상세 페이지는 서로 다른 본문과 학습 목표를 갖지만 모든 페이지의 meta description이 `Next.js App Router 한국어 학습 가이드입니다.`로 같다. 검색 결과와 공유 미리보기에서 각 문서가 답하는 질문을 구분하기 어렵다.
3. `robots.ts`와 루트 metadata는 production·preview 환경을 구분하지 않는다. Vercel Preview의 접근 제한 여부는 저장소에서 확인되지 않으므로, Preview가 공개된 경우 production과 같은 크롤링 허용 정책을 내보낼 수 있다.

대표 검색어(`Next.js App Router 한국어`, `Next.js 16 한국어 학습`, `Next.js 캐싱 실습`, `Server Component Next.js 한국어`) 조회에서는 공식 영문 문서가 주로 노출되고 이 사이트는 확인되지 않았다. 다만 사용한 검색 백엔드가 일부 엔진만 정상인 제한 상태였고 검색량 데이터도 없으므로, 이를 순위·수요의 확정 근거로 사용하지 않는다.

## Proposed outcome

- 홈에서 등록된 예제 수와 실제 실행 가능한 `done` 예제 수를 구분하고, `Live`와 “직접 확인” 표현은 실행 가능한 범위에만 사용한다.
- 문서 상세의 title·description이 본문 주제와 학습 목표를 반영해 페이지별로 구분되며, 284개 문서 원본을 중복 복사하지 않는다.
- Preview·staging은 명시적으로 색인되지 않고, production의 공개 문서·완료 예제는 현재와 같이 크롤링과 색인이 가능하다.
- 이미 올바른 production canonical, sitemap의 공개 URL 목록, 개인화 학습 기록의 `noindex`, zone 경로 차단, 초기 HTML의 핵심 본문·링크는 유지한다.

## Affected users and systems

- 사용자: 검색엔진·AI 검색에서 학습 문서를 찾는 개발자, 홈에서 실행 가능한 예제 범위를 판단하는 학습자, Preview를 검토하는 운영자
- 시스템: `nextjs-docs` 문서 매니페스트 생성, `nextjs-app/apps/shell` 홈·문서 metadata·robots·환경별 색인 정책, 관련 테스트와 `nextjs-app/docs/07-seo-plan.md`

## Constraints

- 반드시 지킬 것:
  - `nextjs-docs`를 콘텐츠 단일 원본으로 유지하고, 셸에 문서 사본이나 검색어 변형용 얇은 페이지를 만들지 않는다.
  - `demos.yaml`의 `status`를 예제 공개 여부의 단일 원본으로 사용한다.
  - production 공개 URL과 `www.learn-nextjs-lab.space` canonical을 임의로 바꾸지 않는다.
  - `study-progress`의 `noindex`, `/zone/`·`/demo-static/` 차단, 미완료 예제의 `noindex`를 약화하지 않는다.
  - 검색·인용용 봇과 학습용 봇 정책을 구분한다. GPTBot·ClaudeBot·Google-Extended 등 학습용 정책은 사용자 지시 없이 변경하지 않는다.
  - title·description은 문서 원문에서 확인할 수 있는 내용만 사용하고, 최신성·성과·수요를 추측하지 않는다.
- 범위 밖:
  - Search Console·네이버 서치어드바이저·Bing Webmaster Tools 등록 및 색인 요청
  - production 배포, 도메인·인증서·Vercel 프로젝트 설정 변경
  - 신규 FAQ·비교·키워드 랜딩 페이지 대량 생성
  - Core Web Vitals 개선과 240개 예제 본문 전면 개편
  - 진행 중인 `demo-learning-fidelity` intent의 `?run=` 검증 변경

## Open questions

- 문서별 description의 단일 원본을 별도 frontmatter로 둘지, 기존 `학습 목표`·첫 핵심 설명에서 결정적으로 추출해 매니페스트에 저장할지는 spec에서 비용과 품질을 비교해 정한다.
- Vercel Preview Deployment Protection의 실제 설정은 외부 계정 확인 항목으로 남긴다. 코드의 Preview `noindex`는 보호 설정 유무와 별개로 방어 계층을 둘지 spec에서 확정한다.
