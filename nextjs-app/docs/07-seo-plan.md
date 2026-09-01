# 07. SEO 작업 계획

`nextjs-app`(셸 + zone 2개, 데모 241개)은 Vercel 배포와 첫 배포 검증까지 마쳤지만([04. Vercel 배포 계획](./04-vercel-deployment-plan.md)), 검색엔진에 정식으로 노출되기 위한 SEO 세팅은 아직 손대지 않았습니다. GA4 트래킹은 붙어 있으나(방문 후 행동을 재는 도구), 애초에 검색엔진이 사이트를 찾아 색인하게 만드는 인프라 — robots, sitemap, 구조화 데이터, Open Graph — 는 전무한 상태입니다. 이 문서는 그 격차를 메우는 작업 목록입니다.

이 사이트는 리드젠·커머스 블로그가 아니라 **Next.js 공식 문서를 한국어로 재구성한 오픈소스 학습 아카이브 + 인터랙티브 데모**입니다. 그래서 일반적인 SEO 체크리스트에 흔한 키워드 마케팅 리서치·CTA·뉴스레터·경쟁사 분석류 항목은 이 프로젝트 성격에 맞게 덜어내고, 기술적 SEO 인프라 구축을 최우선으로 재구성했습니다(§5 참고). 대상 검색엔진은 Google과 네이버 둘 다입니다 — 한국어 콘텐츠라 네이버 노출도 무시할 수 없습니다.

> **1단계 구현 완료 (2026-09-01, `devPark/seo-technical-setup` 브랜치)**: §3-0~§3-4의 도메인 무관 항목을 구현했습니다. 실제로 만들어진 파일은 §3 각 체크박스 옆에 표기했습니다. 도메인 확정이 필요한 2단계(Search Console/네이버 등록)와 배포 후에만 확인 가능한 3단계(Core Web Vitals 실측, 중복 콘텐츠 실측)는 아직 남아 있습니다.

## 1. 현재 상태 진단

| 항목 | 상태 |
|---|---|
| `title`/`description` metadata | 되어있음 — 전 페이지에 존재, `openGraph`/`twitter`/`robots` 필드까지 `buildPageMetadata()`로 보강 완료 |
| `metadataBase` / canonical(`alternates`) | **구현됨** — `layout.tsx`에 `metadataBase`, 각 페이지에 `alternates.canonical` |
| `robots.txt` (`app/robots.ts`) | **구현됨** — `/zone/*`, `/demo-static/*` disallow |
| sitemap (`app/sitemap.ts`) | **구현됨** — 문서/완료 데모를 동적으로 순회 |
| JSON-LD 구조화 데이터 | **구현됨** — `WebSite`(전역), `BreadcrumbList`/`LearningResource`(문서 페이지) |
| Open Graph / Twitter 이미지 | **구현됨** — 기본은 `public/og-image.png`, 문서/데모 상세는 `/og` 라우트로 제목 기반 동적 생성 |
| favicon 세트 | 부분적 — `icon.svg`(기존) + `apple-icon.tsx`(신규) 구현. `favicon.ico`는 여전히 없음 |
| PWA manifest | 없음 (선택 항목으로 남겨둠) |
| GA4 트래킹 | 되어있음 — `@next/third-parties`, `NEXT_PUBLIC_GA_ID` 조건부 렌더링 (`layout.tsx`, `lib/analytics.ts`) |
| `next-seo`/`next-sitemap` 등 SEO 라이브러리 | 없음 (직접 구현, §3-0 참고) |
| 커스텀 도메인 | 미확정 — `siteConfig.url`의 fallback을 셸의 Vercel 배포 URL(`nextjs-ko-study-lab-shell.vercel.app`)로 설정. 커스텀 도메인이 붙으면 `NEXT_PUBLIC_SITE_URL` 환경변수로 재정의 가능 |

## 2. 범위와 원칙

- **대상은 학습자에게 실제로 노출되는 셸 라우트**(`/`, `/[...slug]`, `/demo`, `/demo/[...slug]`, `/study-progress`)로 한정합니다. zone 앱(`demo-baseline`, `demo-cache-components`)의 raw 프록시 경로(`/zone/*`)는 학습자 URL에서 의도적으로 숨겨진 내부 구현이므로([ADR 0005](./adr/0005-hide-zone-from-learner-url.md)) 색인 대상에서 제외하고 `robots.ts`에서 명시적으로 disallow 합니다.
- **커머스/리드젠이 아닌 오픈소스 학습 자료**라는 전제 위에서, 전환 유도형 항목(키워드 마케팅 리서치 툴, CTA, 뉴스레터, 경쟁사 벤치마킹, 작성자 마케팅 프로필)은 배제하고 "검색엔진이 콘텐츠를 정확히 읽고 색인할 수 있게 만드는" 기술적 SEO를 우선합니다.
- **도메인이 아직 미확정**이므로, 도메인과 무관하게 지금 끝낼 수 있는 작업(§3의 대부분)과 도메인 확정 후에만 가능한 작업(Search Console/네이버 등록 등)을 구분합니다(§6).
- **SEO 관련 값과 로직을 페이지별로 하드코딩하지 않고 한 곳에서 관리합니다.** rewrites 목적지를 환경변수로 두는 기존 원칙(`nextjs-app/AGENTS.md` 지켜야 할 것 2)과 같은 이유입니다 — 도메인 변경, OG 이미지 교체, 특정 기능 제거 같은 변경이 파일 하나 수정으로 끝나야 여러 파일을 찾아다니며 고치는 실수를 막을 수 있습니다. 구체적인 구현 방향은 §3-0에서 다룹니다.

## 3. 기술적 SEO 체크리스트

### 3-0. 구현 설계 원칙 — 결합도 관리

아래 §3-1~§3-6을 구현할 때 공통으로 지켜야 하는 구조 원칙입니다. **"무엇을 만드는가"보다 "어디에 두는가"에 대한 규칙**이며, 나중에 도메인이 바뀌거나 특정 SEO 기능을 걷어낼 때 대응 속도를 좌우합니다.

- [x] 사이트명·기본 도메인·기본 OG 이미지·소셜 계정·조직/저작자 정보 같은 **SEO 공통 값을 단일 설정 모듈**로 분리합니다 (예: `apps/shell/src/lib/seo/config.ts`). `robots.ts`, `sitemap.ts`, 루트 `layout.tsx`의 metadata, JSON-LD 컴포넌트가 전부 이 모듈을 import해서 쓰고, 각 파일에 리터럴 문자열을 직접 반복해서 적지 않습니다. → `apps/shell/src/lib/seo/config.ts`
- [x] JSON-LD 스키마(`WebSite`, `TechArticle`, `BreadcrumbList` 등)를 만드는 로직은 페이지마다 새로 작성하지 않고 **재사용 가능한 헬퍼 함수/컴포넌트로 분리**합니다 (예: `apps/shell/src/lib/seo/json-ld.ts`). 스키마 필드가 바뀌면 헬퍼 하나만 고치면 모든 페이지에 반영되게 합니다. → `apps/shell/src/lib/seo/json-ld.ts` + 렌더러 `apps/shell/src/components/seo/JsonLd.tsx`
- [x] `sitemap.ts`가 `demos.yaml`/문서 매니페스트를 순회하는 로직도 sitemap 파일 안에 직접 쓰지 않고 별도 유틸로 뽑아둡니다. 데이터 소스(SSOT)가 바뀌어도 이 유틸만 손보면 되게 하기 위함입니다. → 기존 `@/lib/docs` 파사드(`getManifest`/`getDemos`)를 그대로 재사용해 `sitemap.ts`에 새 순회 로직을 만들지 않음
- [x] `robots.ts`의 disallow 목록(`/zone/*` 등 내부 경로)도 위 설정 모듈이나 별도 상수로 관리해서, zone이 추가/제거될 때(§05 zone 체크리스트) 이 목록도 자연스럽게 갱신 대상에 포함되도록 합니다. → `config.ts`의 `disallowedCrawlPaths`
- [x] 위 원칙을 지켰는지 확인하는 기준: **"도메인이 바뀌었을 때 몇 개 파일을 고쳐야 하는가?"** — 이상적으로는 설정 모듈 1곳입니다. 답이 3곳 이상이면 결합도가 높다는 신호이므로 구현을 재검토합니다. → 실제로 `config.ts`의 `siteConfig.url` 한 곳만 고치면 robots/sitemap/metadata/JSON-LD/OG 이미지 전체에 반영되는 구조로 구현됨 (빌드로 검증)
- [x] (계획에 없었지만 구현 중 확인된 제약) `opengraph-image.tsx`/`icon.tsx`는 **catch-all 라우트(`[...slug]`, `demo/[...slug]`) 안에 colocate할 수 없음** — Next.js가 "Catch-all must be the last part of the URL" 빌드 에러를 낸다. 대신 제목을 쿼리로 받는 공용 라우트 `apps/shell/src/app/og/route.tsx` 하나로 문서/데모 상세의 동적 OG 이미지를 전부 처리하도록 설계를 바꿈 — 결과적으로 §3-0 원칙(공용 모듈 하나로 처리)에 더 부합하는 형태가 됨

### 3-1. 메타데이터 기본기

- [x] 루트 `layout.tsx`에 `metadataBase` 추가 — 도메인 확정 전엔 placeholder, 확정 후 실제 값으로 교체 → `siteConfig.url` 기반, `NEXT_PUBLIC_SITE_URL`로 재정의 가능
- [x] 루트 `layout.tsx`에 기본 `openGraph`/`twitter` 필드 추가 (사이트명, 기본 이미지, 카드 타입)
- [x] 문서/데모 페이지별 `alternates.canonical` 지정 — `buildPageMetadata()`가 모든 페이지에 자동 적용. §3-6의 중복 경로 문제는 canonical이 항상 `/demo/[...slug]`를 가리키게 해 구조적으로 대응함
- [ ] `title`(50~60자)/`description`(120~150자) 길이 가이드 점검 — 기존 페이지들이 이미 짧고 정형화되어 있어 확인 위주 (미실시, 후속 과제)
- [x] (계획에 없었지만 구현 중 추가) `/study-progress`(개인 학습 기록 대시보드)에 `robots: { index: false }` 적용 — 학습자 로그인 없이 브라우저별 localStorage만 보여주는 유틸리티 화면이라 검색 결과 노출 가치가 없다고 판단

### 3-2. 크롤링 / 색인

- [x] `apps/shell/src/app/robots.ts` 작성 — `/zone/*`, `/demo-static/*` disallow, 나머지 allow (`docs-assets`는 이미지 검색 색인을 막지 않도록 의도적으로 제외)
- [x] AI 크롤러(GPTBot, ClaudeBot, PerplexityBot, Google-Extended) 허용 정책 결정 — 특정 크롤러를 막는 규칙을 추가하지 않아 기본 허용됨
- [x] `apps/shell/src/app/sitemap.ts` 작성 — 문서 매니페스트와 `status: done` 데모를 순회해 동적으로 생성
- [ ] Google Search Console 등록 + 소유권 확인 + 사이트맵 제출 *(도메인 확정 후 — 미착수)*
- [ ] 네이버 서치어드바이저 등록 + 소유권 확인 + 사이트맵 제출 *(도메인 확정 후 — 미착수)*

### 3-3. 구조화 데이터 (JSON-LD)

- [x] 루트: `WebSite` 스키마 (`Organization`/`Person`은 보류 — 개인 저작물 표기 여부는 사용자 확인 필요)
- [x] 문서 페이지: `LearningResource` 스키마
- [x] 문서 페이지: `BreadcrumbList` 스키마 (홈 → 현재 문서 2단계. 카테고리 중간 단계 세분화는 후속 과제)
- [ ] Google Rich Results Test와 Schema.org Validator로 검증 *(도메인 확정 후 — 미착수)*

### 3-4. Open Graph / 아이콘

- [x] 문서/데모 상세 페이지 동적 OG 이미지 (제목 기반) → `apps/shell/src/app/og/route.tsx` (자체 `opengraph-image.tsx` 파일 컨벤션 대신 공용 라우트로 구현, 사유는 §3-0 마지막 항목 참고)
- [x] 홈/데모 색인/학습 기록 등 나머지 페이지 기본 OG 이미지 → 기존 `public/og-image.png` 재사용
- [x] favicon 세트 보완 — `apple-icon.tsx` 추가. `favicon.ico`는 여전히 없음(구형 브라우저 대비용, 우선순위 낮음)
- [ ] (선택) PWA `manifest.ts` — 미착수, 필요성 낮아 보류

### 3-5. 성능 (Core Web Vitals)

- [ ] LCP / INP / CLS 실측 (Vercel Speed Insights 또는 PageSpeed Insights)
- [ ] `next/image` 사용 여부 점검, 미최적화 이미지가 있으면 교체
- [ ] `next/font` 사용 확인 (폰트 로딩 전략 점검)

### 3-6. 구조 / 중복 콘텐츠

- [ ] `/zone/baseline/*`, `/zone/cache/*` 프록시 경로와 `/demo/[...slug]` 뷰어 경로 사이에 중복 콘텐츠가 실제로 발생하는지 배포 환경에서 확인 → 발생하면 canonical 또는 robots disallow로 정리
- [ ] 404 / 리다이렉트 정리

## 4. 콘텐츠 최적화 체크리스트

원본 체크리스트 중 이 프로젝트(마크다운 기반 학습 문서 + 데모)에 실질적으로 적용되는 항목만 남겼습니다.

- [ ] 문서 H1/H2 위계 점검 — 마크다운 기반이라 대체로 준수되어 있을 가능성이 높음, 확인 위주
- [ ] 각 문서 상단에 핵심 요약 1~2문장 배치 (결론 먼저 배치하는 BLUF 구조 — AI 답변 인용 최적화에도 유리)
- [ ] 캡처 이미지(WebP) `alt` 텍스트 점검
- [ ] 관련 문서/데모 간 내부 링크 보강 — 현재 학습 매니페스트로 연결된 상태를 확인하고 빈 곳을 보강
- [ ] 문서 최종 수정일 표시 여부 검토 — 신선도 시그널로서 데모/문서 표준([03. 데모 표준 구조](./03-demo-standard-and-layout-pattern.md))에 추가할지 판단

## 5. 배제한 항목과 이유

사용자가 제시한 원본 체크리스트 중, 이 프로젝트 성격상 그대로 적용하지 않기로 한 항목입니다.

| 원본 항목 | 배제/축소 이유 |
|---|---|
| 키워드/롱테일 리서치, 검색 의도 분석, PAA 활용 | 리드젠 목적의 콘텐츠 마케팅이 아니라 Next.js 공식 문서 재구성이므로 키워드는 원문 문서 구조에서 이미 정해짐 |
| 상위 노출 글 벤치마킹, 경쟁사 콘텐츠 차별화 | 경쟁이 아니라 학습 자료 제공이 목적이라 벤치마킹 대상이 불분명함 |
| CTA(다운로드/구독 유도), 뉴스레터 구독 | 전환 유도가 목표가 아닌 오픈소스 학습 자료이므로 불필요 |
| E-E-A-T 작성자 마케팅 프로필("N년차 전문가" 등) | 저장소가 이미 MIT 라이선스 + `CONTRIBUTING.md` 기반 오픈소스로 신뢰 시그널을 확보하는 구조이며, 개인 브랜딩용 프로필은 이 프로젝트 톤과 맞지 않음 |
| 콘텐츠 신선도 마케팅 주기(6~12개월 리프레시 캠페인) | §4에 "최종 수정일 표시 검토"로 축소 반영 — 정기 캠페인성 리프레시보다 Next.js 버전 변경 시 갱신이 더 자연스러운 트리거 |

## 6. 실행 순서

1. **1단계 (도메인 무관, 즉시 가능)** — §3-1, §3-2의 `robots.ts`/`sitemap.ts` 골격, §3-3 JSON-LD, §3-4 OG 이미지·favicon. **구현 완료** (`devPark/seo-technical-setup`). `metadataBase`는 placeholder로 우선 반영. §4 콘텐츠 최적화와 title/description 길이 점검, Rich Results Test 검증은 아직 남음
2. **2단계 (도메인 확정 후)** — `metadataBase` 실제 값 반영(`NEXT_PUBLIC_SITE_URL` 환경변수 설정), Google Search Console과 네이버 서치어드바이저 등록·소유권 확인·사이트맵 제출. **미착수**
3. **3단계 (배포 후 모니터링)** — Core Web Vitals 실측, 색인 현황 확인(Search Console 색인 상태, 네이버 웹마스터도구), §3-6 중복 콘텐츠 실측 후 정리. **미착수**

## 7. 남은 리스크 / 확인 필요 사항

| 리스크 | 확인 방법 |
|---|---|
| 커스텀 도메인 미확정 | 도메인 확정 시 `metadataBase`·Google Search Console·네이버 서치어드바이저 등록을 이어서 진행 |
| `/zone/*` 프록시 경로와 `/demo/[...slug]` 뷰어 경로 간 중복 콘텐츠 여부 미실측 | 배포 환경에서 두 경로 모두 실제로 외부에서 접근 가능한지 확인 후, 가능하다면 canonical 또는 robots disallow로 정리 |
| AI 크롤러 허용 시 콘텐츠 무단 재사용 가능성 | §3-2의 허용 정책을 문서화해두고, 문제가 생기면 특정 크롤러만 선별 차단하는 방향으로 재검토 |
| JSON-LD에 `Organization`/`Person`(저작자) 스키마를 넣을지 미정 | 개인 이름·소속을 구조화 데이터에 공개할지는 사용자 확인 필요. 필요하면 `apps/shell/src/lib/seo/json-ld.ts`에 스키마 하나만 추가하면 됨 |
