Plan: /visualize/* SEO 메타데이터(title/description/keywords) 개선 및 sitemap 등록
Spec: ./intent.md#requirements
Author: Claude
Status: done
Approval: 사용자 승인 (2026-09-18 대화, ExitPlanMode 승인). PR #9 머지로 효력 발생 (`feature/visualize-seo-keywords` → main, merge commit `ec34634`)

## Scope of change

- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-types.ts`: `DemoMeta.keywords?: string[]` 추가
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-timeline-demos.tsx`: 6개 데모에 `keywords` 추가
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-demos.tsx`: architecture 5개 데모에 `keywords` 추가
- `nextjs-app/packages/ui/src/reference-visualize/toolkit/examples/showcase-cache-demos.tsx`: cache 4개 데모에 `keywords` 추가
- `nextjs-app/apps/shell/src/lib/seo/metadata.ts`: `PageMetadataInput`에 `keywords`, `titleAbsolute` 추가, `buildPageMetadata()` 반영
- `nextjs-app/apps/shell/src/app/visualize/[slug]/page.tsx`: title 단일 접미사화 + `keywords` 전달
- `nextjs-app/apps/shell/src/app/visualize/page.tsx`: `keywords` 전달
- `nextjs-app/apps/shell/src/app/sitemap.ts`: `/visualize` + 15개 상세 경로 등록
- `intent/README.md`: 작업 인덱스 행 추가

## Steps

1. `DemoMeta`에 `keywords?: string[]` 추가
2. 3개 데이터 파일(15개 데모)에 각 데모의 실제 title/category/description에서 도출한 키워드 4~6개씩 추가
3. `lib/seo/metadata.ts`의 `PageMetadataInput`/`buildPageMetadata()`에 `keywords`, `titleAbsolute` 추가(옵션 필드, 기존 호출부 하위 호환)
4. `/visualize/[slug]/page.tsx`의 `generateMetadata`를 `title: \`${demo.title} | Next.js 학습\`` + `titleAbsolute: true` + `keywords: demo.keywords`로 수정
5. `/visualize/page.tsx`에 허브용 `keywords` 배열 추가
6. `sitemap.ts`에 `nextjsVisualizeDemos` import 후 `/visualize` 허브 + 15개 상세 엔트리 추가
7. 타입 검사·빌드·런타임 확인
8. `intent/README.md` 작업 인덱스 갱신

## Verification

- 타입 검사: `pnpm --filter @study/shell check-types`, `pnpm --filter @study/ui check-types`
- 빌드: `pnpm --filter @study/shell build`
- 회귀: `pnpm test:manifest`
- 런타임 확인: `cd nextjs-app/apps/shell && pnpm start --port 3100` 후
  - `curl -s http://localhost:3100/visualize/cache-keys | grep -oE '<title>[^<]*</title>|<meta name="keywords"[^>]*>|<meta name="description"[^>]*>'`
  - `curl -s http://localhost:3100/visualize | grep -oE '<title>[^<]*</title>|<meta name="keywords"[^>]*>'`
  - `curl -s http://localhost:3100/sitemap.xml | grep -o '<loc>[^<]*visualize[^<]*</loc>' | wc -l` (16개 기대)

## Rollback

이 슬러그의 커밋들만 되돌리면 이전 동작(keywords 없음, 이중 접미사, sitemap 미등록)으로 복귀한다. 데이터 마이그레이션 없음.

## Verification results

- 상태: 통과
- 실행 명령·환경 / 결과 / 증거:
  - `pnpm --filter @study/shell check-types`: 오류 없이 통과 (exit code 0)
  - `pnpm --filter @study/ui check-types`: 오류 없이 통과 (exit code 0)
  - `pnpm --filter @study/shell build`: 성공, `/visualize/[slug]` 15개 정적 경로(`● /visualize/{key}`) 생성 확인
  - `pnpm test:manifest`: 240개 데모 전체 검증 통과 (회귀 없음)
  - 프로덕션 서버(포트 3100) 런타임 확인:
    - `/visualize/cache-keys`: `<title>use cache 경계와 키 | Next.js 학습</title>`, `<meta name="keywords" content="Next.js use cache,Next.js 캐시 키,next-request-in-use-cache,Next.js Cache Components"/>`
    - `/visualize`(허브): `<title>Next.js &amp; React 인터랙티브 아키텍처 시각화 갤러리 | Next.js 학습</title>`, keywords 6개 출력 확인
    - `sitemap.xml`: `visualize` 포함 `<loc>` 16개(허브 1 + 상세 15) 확인
- 실패·미검증 항목과 후속 작업:
  - description 본문 재작성(카피 톤 변경)은 범위 밖으로 남김 — 필요 시 별도 intent.
  - Vercel Preview/프로덕션 배포 후 실제 Google Search Console 색인 반영 여부는 배포 후 별도 관찰 필요(로컬 검증 범위 밖).
