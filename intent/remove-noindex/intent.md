Intent: 셸 noindex 제거
Author: Claude (사용자 요청 대리 작성)
Status: draft
Approval: 없음 (초안)

## Problem

셸(`nextjs-app/apps/shell`)은 두 층위에서 `noindex`(및 robots 전체 차단)를 만든다.

1. 배포 환경 기준: `VERCEL_TARGET_ENV`·`VERCEL_ENV`에 정의된 값이 모두 `production`이 아니면 루트 layout·`buildPageMetadata`가 `robots: { index: false, follow: false }`를 내고, `robots.ts`가 `Disallow: /`만 반환한다.
2. 페이지 단위 `noIndex` 옵션: `/study-progress`(항상), 미완성(`status !== 'done'`) 데모 직접 URL·`?run=`, 완성 데모가 없는 문서 허브가 `index: false, follow: true`를 낸다.

사용자는 이 `noindex`가 발생하지 않기를 원한다. 근거: 2026-10-07 사용자 요청 "noindex 발생안하도록 코드 수정해줘". 코드 근거: `apps/shell/src/lib/seo/{indexability,metadata}.ts`, `apps/shell/src/app/{layout,robots}.tsx`, `apps/shell/src/app/demo/[...slug]/page.tsx`, `apps/shell/src/app/study-progress/page.tsx`.

## Proposed outcome

셸이 어떤 배포 환경·어떤 페이지에서도 `robots` metadata(`noindex`)와 `Disallow: /`를 출력하지 않는다.

## Affected users and systems

- 사용자: 검색엔진 크롤러, 학습자(검색 결과 노출), 운영자(Preview·staging URL이 색인될 수 있음)
- 시스템: 위 코드 경로, `nextjs-app/packages/test-suite/src/tier1-feature-coverage/25-search-discoverability-accuracy.test.ts`(현 정책을 단언), `nextjs-app/docs/07-seo-plan.md`(Preview 색인 정책·학습 기록 noindex 서술)

## Requirements / Design / Acceptance criteria (spec 통합)

범위는 Open questions 답변 후 확정한다. 기본안(전부 제거) 기준:

- Requirements: R1 환경과 무관하게 `robots` metadata를 출력하지 않는다. R2 `robots.txt`는 항상 production 형태(`allow: '/'`, `/zone/`·`/demo-static/` disallow, sitemap 포함)다. R3 페이지 단위 `noIndex`가 어느 페이지에서도 `robots` metadata를 만들지 않는다.
- Design: `isPublicIndexingAllowed`와 `noIndex` 옵션·호출부를 삭제하거나 항상 허용으로 단순화한다. 코드와 문서가 어긋나지 않게 테스트·`07-seo-plan.md`를 함께 고친다.
- Acceptance criteria: 셸 빌드 산출물의 어떤 페이지에도 `<meta name="robots" content="noindex...">`가 없다. `/robots.txt`에 `Disallow: /`(전체)가 없다. 타입 체크·lint·`pnpm test`가 통과한다.

## Constraints

- 반드시 지킬 것: `/zone/`, `/demo-static/` 크롤링 제외(ADR 0005)는 유지한다. 생성 파일을 직접 편집하지 않는다.
- 범위 밖: 데모 zone(`demo-baseline`, `demo-cache-components`), 404 페이지의 Next.js 자동 noindex, sitemap 항목 구성 변경.

## Open questions

- Preview·staging 배포도 색인을 허용하는가? 허용하면 같은 콘텐츠가 중복 색인될 수 있고 canonical은 공개 도메인을 가리킨다. (기본안: 사용자 요청대로 허용)
- 미완성 데모·빈 허브 화면과 `/study-progress`(개인 학습 기록)도 색인을 허용하는가? 미완성 화면은 "준비 중" 빈 페이지라 soft-404로 평가될 수 있다.
- 제거 방식: 코드 삭제(정책 폐기) vs 환경변수 등으로 끄는 스위치 유지.
