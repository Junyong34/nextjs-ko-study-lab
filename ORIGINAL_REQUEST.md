# Original User Request

## Initial Request — 2026-09-03T02:51:03Z

Configure Open Graph (OG) images, Twitter cards, metadataBase, and page-specific metadata for all demo routes in `apps/demo-baseline` and `apps/demo-cache-components` within `nextjs-app`.

Working directory: /Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-app
Integrity mode: development

## Requirements

### R1. Base Layout Metadata & Asset Provision
- In `apps/demo-baseline/src/app/layout.tsx` and `apps/demo-cache-components/src/app/layout.tsx`, configure comprehensive root metadata:
  - `metadataBase` pointing to the public URL (`process.env.NEXT_PUBLIC_SITE_URL` fallback to `https://learn-nextjs-lab.space` or appropriate zone host)
  - `openGraph` with title template, description, locale (`ko_KR`), type (`website`), and default OG image
  - `twitter` with `card: 'summary_large_image'` and default image
  - Favicon and icons configuration (`icon.svg`, `apple-icon.tsx`, or static public assets)
- Copy `og-image.png` and icon assets from `apps/shell` to both demo apps (`apps/demo-baseline` and `apps/demo-cache-components`).

### R2. Page-Specific Metadata for Demo Routes
- For all demo pages in `apps/demo-baseline/src/app/zone/baseline/**/page.tsx` and `apps/demo-cache-components/src/app/zone/cache/**/page.tsx`:
  - Provide individual, relevant `title`, `description`, `openGraph`, and `twitter` metadata matching each demo's topic/title.
  - Utilize existing demo manifest data (`@study/demos` or `demos.yaml`) or explicit page metadata exports / `generateMetadata` so that each page generates appropriate `<meta>` tags and Open Graph information.

### R3. Root Route (`/`) Handling
- Add `src/app/page.tsx` to both demo apps to provide clean entry or navigation to respective zone demos rather than 404/blank pages.

## Acceptance Criteria

### Metadata & OG Verification
- [ ] Build succeeds for all apps (`pnpm --filter @study/demo-baseline build` and `pnpm --filter @study/demo-cache build`).
- [ ] Rendered HTML / server response for both base layouts and individual demo pages includes:
  - `<meta property="og:title" ...>`
  - `<meta property="og:description" ...>`
  - `<meta property="og:image" ...>`
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<link rel="icon" ...>`
- [ ] TypeScript type checks pass with 0 errors across `@study/demo-baseline`, `@study/demo-cache`, and `@study/shell`.

## Follow-up — 2026-09-08T12:29:48Z

Next.js App Router 공식 문서의 `next.config.js` 핵심 설정 옵션 20개를 공식 문서 구조(H2/H3, 콜아웃, 코드 예제)와 1:1 일치시키고, 저장소 규칙(`AGENTS.md`, `TRANSLATION.md`)의 6대 필수 섹션 템플릿에 맞추어 한국어 학습 문서로 번역 및 완성한다.

Working directory: /Users/devpark/workspace/devpark/nextjs-ko-study-lab
Integrity mode: development

## 대상 옵션 목록 (총 20개)

위치: `nextjs-docs/3-api-reference/3.5-config/3.5.1-next-config-js/`
1. `headers.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
2. `redirects.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)
3. `rewrites.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
4. `images.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/images)
5. `basePath.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
6. `assetPrefix.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix)
7. `env.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/env)
8. `output.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
9. `transpilePackages.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages)
10. `turbopack.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
11. `typedRoutes.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes)
12. `reactStrictMode.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode)
13. `serverExternalPackages.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)
14. `logging.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/logging)
15. `devIndicators.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators)
16. `distDir.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/distDir)
17. `pageExtensions.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions)
18. `trailingSlash.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash)
19. `serverActions.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions)
20. `crossOrigin.md` (공식: https://nextjs.org/docs/app/api-reference/config/next-config-js/crossOrigin)

## Requirements

### R1. 대상 파일 스텁 해제 및 6개 필수 섹션 구조 완비
각 대상 옵션 마크다운 파일에 남아있는 스텁 내용("추후 정의합니다", "추후 작성")을 완전히 제거하고, `nextjs-docs/AGENTS.md`에 명시된 6개 필수 섹션을 빈틈없이 작성한다:
1. 문서 상단 메타 링크 (공식 출처 URL / 상위 메뉴 링크 / 전체 목차 링크)
2. `## 학습 목표` (해당 옵션의 핵심 역할 및 사용 시점 2~4개 불릿)
3. `## 핵심 개념 및 설명` (공식 문서의 본문 번역 및 심화 설명)
4. `## 예제 및 데모 설계` (첫 줄은 반드시 `- 데모 가능 여부: 가능` / `불가` / `검토 예정` 중 하나로 시작)
5. `## 연습 문제` (객관식 1~2문제, `<details><summary>정답 보기</summary>` 접기 블록에 정답과 해설 명시)
6. `## 챕터 요약` (3~5개 핵심 요약 불릿)

### R2. 공식 문서 원문 구조 및 상세 정보 1:1 보존
`## 핵심 개념 및 설명` 섹션 내에서 공식 문서의 내용을 임의 축약하거나 생략하지 않는다:
- 공식 영문 문서의 모든 H2/H3 섹션 제목을 의미에 맞게 번역하여 빠짐없이 배치한다.
- 공식 문서의 표(타입, 기본값, 옵션 파라미터), 코드 블록, 그리고 "Good to know" 콜아웃(`> **알아두면 좋은 점**:`)을 누락 없이 1:1 반영한다.
- 코드 예제 내 식별자, 옵션 키는 원문을 유지하고 코드 주석은 한국어로 자연스럽게 번역한다.
- 공식 문서 내 내부 문서 링크는 가능한 경우 저장소 내 상대 경로(`../...`)로 변환한다.

### R3. `TRANSLATION.md` 용어 및 문체 규칙 엄수
- **원문 유지 용어**: `Server Component`, `Client Component`, `Route Handler`, `revalidate`, `prefetch`, `hydration`, `prerender`, `proxy` 등 공식 가이드라인 지정 용어는 한글 음차나 직역을 금지하고 원문 표기를 유지한다.
- **다이나믹 표기**: Next.js 개념어 수식 시 `동적 라우트` 대신 `다이나믹 라우트`, `다이나믹 렌더링` 등으로 표기한다.
- **문체**: 리프 학습 문서는 반드시 `~한다`체로 일관되게 작성한다 (`~합니다`, `~됩니다` 존댓말 금지).
- **원문 강도 유지**: `may`/`can`(~할 수 있다), `we recommend`(~하는 것을 권장한다), `must`(~해야 한다)의 의미 강도를 왜곡하지 않는다.

## Verification Resources
- 문서 작성 가이드라인: `nextjs-docs/AGENTS.md`
- 번역 및 용어 규칙: `nextjs-docs/TRANSLATION.md`
- 작성 모범 참조 문서: `nextjs-docs/3-api-reference/3.5-config/typescript.md`, `nextjs-docs/3-api-reference/3.5-config/eslint.md`, `nextjs-docs/3-api-reference/3.5-config/3.5.1-next-config-js/README.md`
- 공식 Next.js 영문 문서 웹 주소: `https://nextjs.org/docs/app/api-reference/config/next-config-js/<option>`

## Acceptance Criteria

### 구조 및 완성도
- [ ] 20개 대상 마크다운 파일 모두에 "추후 정의합니다" 또는 "추후 작성" 문구가 전혀 남아있지 않음
- [ ] 20개 대상 파일 모두 6대 필수 섹션 헤딩(`#`, `## 학습 목표`, `## 핵심 개념 및 설명`, `## 예제 및 데모 설계`, `## 연습 문제`, `## 챕터 요약`)을 온전히 갖춤
- [ ] `## 예제 및 데모 설계`의 첫 번째 줄이 `- 데모 가능 여부: 가능`, `- 데모 가능 여부: 불가`, 또는 `- 데모 가능 여부: 검토 예정` 중 하나로 정확히 시작함
- [ ] `## 연습 문제` 섹션마다 `<details><summary>정답 보기</summary>` 블록과 정답/해설이 포함됨

### 공식 문서 정합성
- [ ] 원문의 세부 소제목(H2/H3), 옵션 속성 표, 코드 예제가 누락 없이 번역문에 포함됨
- [ ] 공식 문서의 "Good to know" 콜아웃이 `> **알아두면 좋은 점**:` 형태로 1:1 보존됨

### 번역 및 용어 품질
- [ ] `TRANSLATION.md`의 금지 번역어(`프리페치`, `재검증`, `하이드레이션`, `프리렌더`, `서버 컴포넌트`, `클라이언트 컴포넌트`, `라우트 핸들러` 등)가 마크다운 본문에 일절 검출되지 않음
- [ ] 리프 학습 문서 본문 서술어가 `~한다` 평서문으로 일관되게 작성됨 (`~합니다`, `~됩니다` 미사용)
- [ ] 마크다운 린트 및 깨진 링크/코드블록 구문 오류가 없음
