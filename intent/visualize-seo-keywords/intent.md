Intent: /visualize/* SEO 메타데이터(title/description/keywords) 개선 및 sitemap 등록
Author: Claude
Status: approved
Approval: 사용자 승인 (2026-09-18 대화, plan 검토 후 ExitPlanMode 승인). 저장소 규칙상 PR 머지 전 단계 효력 없음 — `feature/visualize-seo-keywords` 브랜치에서 구현·로컬 검증 완료, main 병합 전

## Problem

`/visualize/*`(허브 1개 + 데모 상세 15개)는 Next.js/React 런타임 동작을 캔버스로 시각화하는 콘텐츠지만, 검색 노출 관점에서 세 가지 구조적 문제가 있었다.

1. `keywords` 필드가 `DemoMeta`, `PageMetadataInput`, `buildPageMetadata()` 어디에도 없어 `<meta name="keywords">`가 출력되지 않았다.
2. `/visualize/[slug]/page.tsx`의 `generateMetadata`가 직접 `${demo.title} | Next.js & React 인터랙티브 시각화`를 만들고, 여기에 루트 `layout.tsx`의 `title.template('%s | Next.js 학습')`이 다시 붙어 최종 `<title>`이 3단으로 길어졌다(예: `use cache 경계와 키 | Next.js & React 인터랙티브 시각화 | Next.js 학습`).
3. `apps/shell/src/app/sitemap.ts`에 `/visualize`와 15개 상세 경로가 전혀 등록되어 있지 않았다.

근거: `nextjs-app/apps/shell/src/lib/seo/metadata.ts`, `.../app/visualize/[slug]/page.tsx`, `.../app/sitemap.ts`, `packages/ui/.../showcase-types.ts` 코드 확인. `intent/README.md`, `nextjs-app/docs/07-seo-plan.md` 조사 결과 `/visualize`의 title/description/keywords를 다루는 기존 작업 없음을 확인.

## Proposed outcome

- 15개 데모 + 허브에 `keywords`(데모 고유 기술어 + "Next.js" 조합)가 실제로 `<meta name="keywords">`로 출력된다.
- `/visualize/[slug]`의 `<title>`이 사이트 전체와 동일한 단일 접미사(`... | Next.js 학습`)로 통일되어 핵심 키워드가 앞으로 온다.
- `/visualize`와 15개 상세 경로가 `sitemap.xml`에 등록되어 검색엔진이 발견할 수 있다.

## Affected users and systems

- 사용자: `/visualize/*`를 검색을 통해 찾아오는 학습자
- 시스템:
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-types.ts`
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-demos.tsx`
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-timeline-demos.tsx`
  - `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`
  - `nextjs-app/apps/shell/src/lib/seo/metadata.ts`
  - `nextjs-app/apps/shell/src/app/visualize/page.tsx`
  - `nextjs-app/apps/shell/src/app/visualize/[slug]/page.tsx`
  - `nextjs-app/apps/shell/src/app/sitemap.ts`

## Constraints

- 반드시 지킬 것: `buildPageMetadata()`는 저장소 전체 페이지가 공유하는 단일 함수이므로, `/visualize/*`만을 위한 변경이 다른 호출부(문서·데모존 페이지)의 기존 동작을 바꾸지 않아야 한다 — `keywords`·`titleAbsolute`는 옵션 필드로만 추가한다.
- 범위 밖: 15개 데모 `description` 본문 재작성(길이 단축·카피 톤 변경), `buildPageMetadata`를 쓰는 다른 페이지의 `keywords` 채움, `07-seo-plan.md`의 "키워드 마케팅"(신규 랜딩페이지 등) 보류 항목.

## Requirements

1. `DemoMeta`에 선택적 `keywords?: string[]` 필드를 추가하고 15개 데모 전체에 채운다(데모 고유 기술어 + "Next.js" 조합, 4~6개).
2. `PageMetadataInput`에 `keywords?: string[]`, `titleAbsolute?: boolean`을 추가하고 `buildPageMetadata()`가 이를 반영한다. `titleAbsolute: true`면 Next.js Metadata API의 `title.absolute`를 사용해 부모 `title.template`를 무시한다.
3. `/visualize/[slug]/page.tsx`의 `generateMetadata`가 `title: \`${demo.title} | Next.js 학습\``, `titleAbsolute: true`, `keywords: demo.keywords`를 전달한다.
4. `/visualize/page.tsx`(허브)가 `keywords`를 전달한다.
5. `apps/shell/src/app/sitemap.ts`가 `nextjsVisualizeDemos`를 이용해 `/visualize` + 15개 상세 경로를 `/demo` 허브·상세와 동일한 우선순위(`0.7`/`weekly`, `0.6`/`monthly`) 패턴으로 등록한다.

## Design

- `keywords`/`titleAbsolute`는 `PageMetadataInput`에 옵션 필드로만 추가해 기존 호출부(문서·데모존 페이지)의 동작을 바꾸지 않는다.
- `openGraph`/`twitter`의 title은 `titleAbsolute` 여부와 무관하게 항상 caller가 넘긴 `title` 문자열을 그대로 재사용해, 소셜 카드 제목과 `<title>`이 동일하게 유지된다.
- `title.absolute`는 Next.js 정식 Metadata API 필드로 부모 template를 무시하도록 지원된다(`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`에서 확인).

## Acceptance criteria

- [x] `pnpm --filter @study/shell check-types`가 오류 없이 통과한다.
- [x] `pnpm --filter @study/shell build`가 15개 `/visualize/[slug]` 정적 경로를 포함해 성공한다.
- [x] 프로덕션 서버에서 `/visualize/cache-keys`의 `<title>`이 `use cache 경계와 키 | Next.js 학습`(단일 접미사)이고 `<meta name="keywords">`가 출력된다.
- [x] `sitemap.xml`에 `/visualize` + 15개 상세 경로(총 16개)가 등록된다.
