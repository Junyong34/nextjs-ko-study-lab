# 컴포넌트 디렉토리 정리 리팩토링 계획

> **에이전트 작업자에게:** Phase 1~6은 **동작 무변경**이 합격 기준입니다. 화면이 한 픽셀이라도 달라지면 그 단계는 실패입니다. Phase 7~8만 의도적으로 동작을 바꿉니다.

**Goal:** 한 파일에 뭉쳐 있는 컴포넌트·파서·스타일을 책임 단위로 쪼개고, `@study/ui` / `@study/demo-kit` / `@study/docs-render`의 경계를 [06. 7-4](../06-ui-and-screen-design.md)의 설계표와 일치시킨다.

**전제:** 이 계획은 `main`(`96844a7`) 시점의 코드를 대상으로 한다.

---

## 1. 왜 지금 해야 하는가

### 1-1. 측정값

| 파일 | 줄 | 담고 있는 것 |
|---|---:|---|
| `packages/docs-render/src/MarkdownRenderer.tsx` | **861** | 파서 5종 · 링크/에셋 경로 해석 2종 · `CodeBlock` · `renderTable` · 헤딩 4종 복붙 · Alert 3종 복붙 · 스캐너 루프 |
| `packages/docs-render/src/TableOfContents.tsx` | **488** | 헤딩 파서 · ScrollSpy · 용어집 화면 · 일반 TOC 화면 · 맨위로 버튼 2벌 |
| `apps/shell/src/components/Sidebar.tsx` | **280** | 재귀 `NavItem` · 검색 필터 · 모바일 드로어 · 데스크톱 aside |
| `packages/docs-render/src/DemoFrame.tsx` | 208 | URL 계산 · postMessage 브릿지 · 툴바 · fullscreen 분기 |
| `apps/shell/src/app/demo/page.tsx` | 157 | 통계 타일 · 데모 카드 · 배지 (전부 인라인) |
| `apps/shell/src/components/FeedbackModal.tsx` | 155 | 모달 껍데기 · 폼 3필드 · 성공 화면 |
| `apps/shell/src/components/DemoViewer.tsx` | 125 | `DemoFrame`과 **거의 같은** postMessage 브릿지 |

TSX/TS 합계 약 3,200줄 중 **1,629줄(51%)이 상위 3개 파일**에 있습니다.

### 1-2. 중복 목록

| 중복된 것 | 나타나는 곳 |
|---|---|
| iframe + `DEMO_RESIZE` 수신 + origin 검증 + 로딩 오버레이 + 신호등 툴바 | `DemoViewer.tsx`, `DemoFrame.tsx` — **두 벌** |
| status 배지 (`done`→emerald+`CheckCircle2` / else→amber+`Clock`) | `demo/page.tsx`, `demo/[...slug]/page.tsx`, `DocDemoList.tsx` — **3곳** |
| zone 배지 (`Layers` + `zone: {slug}`) | 위와 같은 3곳 |
| 데모 카드 (제목·상태·zone·"데모 열기"+`ArrowRight`) | `demo/page.tsx`, `DocDemoList.tsx` — **두 벌** |
| GitHub 로고 SVG path (24줄) | `Header.tsx`, `Footer.tsx` |
| Next.js 삼각형 로고 SVG | `Header.tsx`, `Footer.tsx` |
| 활성 항목 클래스 `bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50` | `Sidebar.tsx`, `TableOfContents.tsx`(2곳) — 리터럴 복붙 |
| primary 버튼 색 팔레트 `bg-zinc-900 … dark:bg-zinc-100 dark:text-zinc-900` | 4곳 — **형태는 전부 다름**, 아래 참고 |
| input 클래스 체인 (11개 유틸리티) | `Sidebar.tsx` 검색, `FeedbackModal.tsx` 3필드 — **2곳은 완전 동일** |
| 헤딩 렌더링 블록 (id·alias 스팬·`#` 앵커) | `MarkdownRenderer.tsx` 안에서 **4번** |
| Alert 블록 (아이콘+배경+테두리) | `MarkdownRenderer.tsx` 안에서 **3번** |
| "맨 위로 이동" 버튼 | `TableOfContents.tsx` 안에서 **2번** |
| 헤딩 파싱 로직 | `MarkdownRenderer.tsx` 스캐너, `TableOfContents.tsx`의 `parseHeadings` |

### 1-3. 설계 문서와 어긋난 것

| # | 규칙 | 현재 상태 |
|---|---|---|
| 17 | `@study/ui`는 **셸 전용**, 데모 공통 UI는 `@study/demo-kit` ([06. 7-4](../06-ui-and-screen-design.md)) | **정확히 반대**. `@study/ui`가 `DemoContainer`·`ExpectedActualPanel`·`DemoResetButton`을 담고 데모 앱 2개가 의존. 셸 UI는 `apps/shell/src/components/`에 있고 셸은 `@study/ui`를 **한 번도 import하지 않음** |
| 16 | 문서 본문에 데모를 심지 않는다 — 코드펜스는 **링크 카드** | `MarkdownRenderer`가 ` ```demo `를 `DemoFrame`(iframe)으로 렌더 → Phase 7 |
| 12 | 데모 앱은 chrome을 그리지 않는다 | 두 데모 `page.tsx` 모두 제목·설명·zone 배지·근거 문서 링크를 직접 그림 → Phase 8 |
| 20 | shadcn 토큰(`@theme inline` + oklch) | 미도입. `globals.css`가 `--color-indigo-*`를 회색으로 덮어쓰는 편법, 전 컴포넌트가 `zinc-*` 하드코딩 → **이번 범위 밖** |

### 1-4. 구조적 결함

- **역방향 의존**: `TableOfContents` → `MarkdownRenderer`(`slugify`). 렌더러가 파서를 export하고 있어, TOC를 쓰려면 861줄짜리 클라이언트 모듈이 끌려온다.
- **파일 중간 import**: `MarkdownRenderer.tsx` 158행에 `import { codeToHtml } from 'shiki'`가 함수 정의 사이에 끼어 있다.
- **불필요한 클라이언트 경계**: `Footer.tsx`가 피드백 모달 상태 하나 때문에 통째로 `'use client'`. `MarkdownRenderer` 861줄 전체가 `'use client'`.
- **`lib/docs.ts` 겸직**: 경로 탐색 + fs 읽기 + 매니페스트 파싱 + `@study/demos` re-export.

---

## 2. 범위

**포함 (Phase 1~6, 동작 무변경)** — 파일 이동, 컴포넌트 추출, 중복 제거, 패키지 경계 정정.

**포함 (Phase 7~8, 동작 변경)** — 문서 본문 iframe 제거, 데모 앱 chrome 제거. 구조 리팩토링이 끝난 뒤에 별도 커밋으로 진행합니다.

**이 계획에 없음**

| 항목 | 이유 |
|---|---|
| shadcn/ui 소스 도입, `zinc-*` → 디자인 토큰 치환 | 작업량이 2~3배가 되고 UI 회귀 위험이 커진다. 규칙 20은 별도 티켓 |
| `remark`/`rehype` 파이프라인 교체 ([06. 7-3](../06-ui-and-screen-design.md)) | 자체 파서를 표준 파이프라인으로 바꾸는 것은 재작성이지 정리가 아니다 |
| 검색 팔레트·테마 토글·랜딩 히어로 등 미구현 화면 | 리팩토링이 아니라 신규 기능 |
| `getDocsRoot()`의 후보 경로 5개 순회 방식 개선 | 배포 경로 검증이 필요해 별도 티켓 |

---

## 3. 목표 디렉토리 구조

```
nextjs-app/
├─ apps/
│  ├─ shell/src/
│  │  ├─ app/                          # 라우트: 데이터 로딩 + 조립만
│  │  │  ├─ [...slug]/page.tsx
│  │  │  ├─ demo/page.tsx
│  │  │  ├─ demo/[...slug]/page.tsx
│  │  │  ├─ docs-assets/[...path]/route.ts
│  │  │  └─ layout.tsx
│  │  └─ lib/
│  │     ├─ docs-root.ts               # 경로 탐색만
│  │     ├─ manifest.ts                # docs-manifest 로드·조회
│  │     └─ demos.ts                   # @study/demos re-export
│  │                                   # └ components/ 는 사라진다
│  ├─ demo-baseline/
│  └─ demo-cache-components/
└─ packages/
   ├─ ui/src/                          # 셸 전용 (규칙 17)
   │  ├─ primitives/                   # Badge Button IconButton Input Card Spinner
   │  ├─ brand/                        # NextLogo GitHubIcon
   │  ├─ layout/
   │  │  ├─ header/                    # Header HeaderNav
   │  │  └─ footer/                    # Footer FooterLinks FeedbackTrigger
   │  ├─ nav/
   │  │  ├─ doc-tree/                  # DocTree DocTreeNode DocTreeSearch DocTreeDrawer useTreeFilter
   │  │  └─ toc/                       # TableOfContents TocList GlossaryIndex AlphabetGrid
   │  │                                #   MobileAlphabetBar ScrollTopButton useScrollSpy config
   │  ├─ demo/                         # DemoCard DemoStatusBadge ZoneBadge DemoPageHeader DemoIndexStats
   │  ├─ feedback/                     # FeedbackModal FeedbackForm FeedbackSuccess
   │  ├─ types/                        # TreeNode 등 화면 계약 타입
   │  ├─ styles.ts                     # 반복 클래스 리터럴 상수
   │  └─ index.ts
   ├─ docs-render/src/                 # 셸 전용
   │  ├─ markdown/
   │  │  ├─ parse/                     # slugify headings demo-block inline
   │  │  ├─ resolve/                   # asset-url doc-link segment
   │  │  ├─ nodes/                     # Heading Alert Table Figure Blockquote ListItem Paragraph OfficialDocLink
   │  │  └─ MarkdownRenderer.tsx       # 스캐너 루프만
   │  ├─ code/                         # shiki lang-map highlight-cache CodeBlock
   │  ├─ demo/                         # DemoIframe useDemoResizeBridge DemoFrame DocDemoList
   │  └─ index.ts
   ├─ demo-kit/src/                    # 신설 — 데모 앱 전용 (규칙 17)
   │  ├─ DemoContainer.tsx
   │  ├─ ExpectedActualPanel.tsx
   │  ├─ DemoResetButton.tsx
   │  ├─ useResizeBridge.ts
   │  └─ index.ts
   └─ demos/                           # 변경 없음
```

---

## 4. Phase 0 — 기준선 확보 ✅ 완료 (2026-08-21)

- [x] `pnpm install` — 8개 워크스페이스, 4.3s
- [x] `pnpm check-types` — **7/7 통과**
- [x] `pnpm build` — **5/5 성공**. 문서 283편 SSG, 데모 2건
- [x] dev 서버 기동 — **3100(셸) / 3101(baseline) / 3102(cache)**
  - 메인 체크아웃이 3000/3001/3002를 쓰고 있어 포트를 옮겼다. 각 앱의 `.env.local`(gitignore 대상)에 `ZONE_BASELINE_URL`·`ZONE_CACHE_URL`·`PUBLIC_ORIGIN`을 맞춰 넣었다 — [`AGENTS.md`](../../AGENTS.md) 규칙 2가 요구하는 환경변수 방식 그대로다
  - 셸 라우트 8종 + zone 프록시 2종 전부 200
- [x] 회귀 비교 기준선 확보 — **스크린샷 대신 렌더 HTML 스냅샷**을 쓴다 (13절)

### 4-1. 기준선 수치

| 항목 | 값 |
|---|---:|
| 스냅샷 라우트 | 11개 (전부 200) |
| 셸 CSS | 88,743 bytes / 828 rules |
| demo-baseline CSS | 28,942 bytes / 293 rules |
| demo-cache CSS | 28,715 bytes / 287 rules |

---

## 4-2. 기준선에서 발견한 기존 결함

**리팩토링이 만든 것이 아니라 원래 있던 것들이다.** 이번 범위에서는 고치지 않고 기록만 한다 — 고치면 "동작 무변경" 불변식이 깨진다.

| # | 결함 | 위치 | 영향 |
|---|---|---|---|
| F1 | **`backdrop-blur-2xs`는 Tailwind v4에 없는 클래스다.** 생성된 CSS에 규칙이 없어 블러가 실제로 걸리지 않는다 (v4의 스케일은 `xs`부터) | `apps/shell/src/components/DemoViewer.tsx:104`, `packages/docs-render/src/DemoFrame.tsx:177` | 데모 로딩 오버레이의 블러가 무효. **Phase 5에서 두 파일이 하나로 합쳐지므로 그때 고칠지 판단한다** |
| F2 | `fs.readFileSync`의 경로가 동적이라 Turbopack이 **프로젝트 전체를 트레이싱**한다 | `packages/demos/src/index.ts:68` | 배포 산출물에 소스 전체가 포함된다. 빌드 경고로 매번 출력됨 |
| F3 | `turbo.json`의 `@study/docs#build`에 `outputs`가 없어 `no output files found` 경고 | `turbo.json` | [03. 6-2](../03-composition-architecture.md)가 경고한 "md를 고쳐도 사이트가 안 바뀜"과 직결 |

F2·F3은 이 계획과 무관한 별도 티켓이다.

---

## 5. Phase 1 — `@study/demo-kit` 신설 (규칙 17 정합) ✅ 완료 (2026-08-21)

패키지 경계를 먼저 바로잡습니다. **이걸 나중에 하면 Phase 2~3에서 옮긴 파일을 또 옮기게 됩니다.**

- [x] `packages/demo-kit/` 생성 — `package.json`(`@study/demo-kit`, `exports` 맵은 `@study/ui`와 동형), `tsconfig.json`, `src/index.ts`
- [x] `packages/ui/src/{DemoContainer,ExpectedActualPanel,DemoResetButton}.tsx` → `packages/demo-kit/src/`로 **이동** (내용 변경 없음)
- [x] `apps/demo-baseline` · `apps/demo-cache-components` 각각:
  - `package.json` 의존성 `@study/ui` → `@study/demo-kit`
  - `next.config.ts`의 `transpilePackages`
  - `src/app/globals.css`의 `@source "../../../../packages/demo-kit"`
  - `page.tsx`의 import
- [x] `packages/ui/src/index.ts`를 비운다 (Phase 3에서 셸 UI가 채운다)
- [x] `apps/shell`의 `@study/ui` 의존은 **유지** — Phase 3에서 실제로 쓰기 시작한다

**검증:** `pnpm build` 통과 + 데모 2개 화면 무변경. 데모 앱 빌드 산출물에서 셸 UI 코드가 빠졌는지 확인.

## 6. Phase 2 — 원자 컴포넌트 추출 ✅ 완료 (2026-08-21)

`@study/ui`에 재사용 단위를 먼저 만듭니다. 아직 아무도 쓰지 않습니다 — Phase 3~6이 소비합니다.

### 6-1. 착수 전 실측에서 드러난 것

계획을 세울 때 "primary 버튼 6곳 중복"이라고 적었지만, 클래스 문자열을 실제로 대조하니 **형태가 전부 달랐습니다.**

| 사용처 | 형태 |
|---|---|
| 데모 색인 "데모 열기" | `rounded-lg px-3.5 py-1.5 text-xs font-semibold` |
| 피드백 모달 제출 | `rounded-lg px-4 py-2 text-xs font-semibold shadow-sm` |
| `DemoFrame` fullscreen 링크 | `rounded-md px-3 py-1.5 text-xs font-medium` |
| 모바일 트리 토글 | `rounded-full h-12 w-12` |

공통은 **색 팔레트뿐**입니다. zone 배지도 데모 색인은 `text-[11px] font-medium`, 독립 열람은 `text-xs font-semibold`로 다르고, status 배지는 pill 2곳과 tag 1곳이 아예 다른 모양입니다.

**그래서 방침을 이렇게 잡았습니다.**

- **색과 상태 표현은 `styles.ts` 상수로 뽑는다** — 중복 제거 효과의 대부분이 여기서 나오고, DOM은 안 바뀝니다
- **형태는 variant로 그대로 보존한다** — 통일하면 화면이 바뀌어 "동작 무변경" 불변식이 깨집니다
- **형태 통일은 별도 티켓**으로 넘깁니다. shadcn 도입 티켓과 함께 다루는 편이 자연스럽습니다

### 6-2. 한 일

- [x] `packages/ui/package.json` — `next`·`react`를 peerDependency로, `lucide-react`를 dependency로 추가
- [x] `cn.ts` — 클래스 연결 유틸. **`tailwind-merge`는 일부러 쓰지 않습니다** (13-1의 DOM 비교가 예측 가능한 클래스 문자열에 의존)
- [x] `styles.ts` — `ACTIVE_ITEM` · `INACTIVE_ITEM` · `ACCENT_SURFACE` · `PRIMARY_SURFACE` · `OUTLINE_SURFACE` · `FIELD_SURFACE` · `STATUS_TONE` · `CARD_SURFACE` · `CARD_HOVER`
  - **규칙 20(디자인 토큰) 대응 지점이 이 파일 하나로 좁혀집니다**
- [x] `brand/NextLogo.tsx` · `brand/GitHubIcon.tsx` — Header/Footer의 SVG path 복붙 제거 (GitHub path는 24줄짜리)
- [x] `primitives/Button.tsx` — `Button` + `ButtonLink`. `variant`(primary/outline/ghost) × `shape`(cta/submit/compact/block)
- [x] `primitives/IconButton.tsx` — `density`(tight/normal)
- [x] `primitives/Badge.tsx` — `StatusBadge`(pill/tag) · `ZoneBadge`(sm/md) · `CountBadge`
- [x] `primitives/Input.tsx` — `Input`(padding: normal/withIcon) · `Textarea`
- [x] `primitives/Spinner.tsx` — `size`(sm/md) × `tone`(strong/soft)
- [x] `primitives/Card.tsx` — `cardClass()`. 링크·div 어느 태그에나 붙일 수 있도록 클래스 문자열만 반환

### 6-3. 검증

check-types 8/8, build 5/5, DOM 스냅샷 11/11 동일.

셸 CSS가 828 → **831 rules**(+482 bytes)로 늘었습니다. `@source`가 아직 아무도 쓰지 않는 `packages/ui`의 새 클래스를 스캔하기 때문이며 정상입니다. Phase 3~6에서 원본 리터럴이 사라지면 상쇄됩니다.

**검증 도구를 한 가지 보완했습니다.** 공통 상수를 조립하면 클래스 *순서*가 바뀌는데 Tailwind는 순서와 무관하므로, `to-dom.sh`가 `class` 속성의 토큰을 정렬한 뒤 비교하도록 했습니다. 확인할 것은 "클래스 집합이 같은가"입니다.

---

## 7. Phase 3 — 셸 UI 이동 + 분해 ✅ 완료 (2026-08-21, 우측 목차 제외)

### 7-0. 실제로 한 일과 계획에서 달라진 점

**우측 목차(`TableOfContents`)는 Phase 4로 미뤘습니다.** 지금 옮기면 `slugify` 때문에
`@study/ui` → `@study/docs-render` 의존이 생깁니다. 14절이 예고한 순서 그대로,
Phase 4-1에서 `slugify`를 떼어낸 뒤 옮깁니다.

| 원본 | 줄 | 결과 |
|---|---:|---|
| `Header.tsx` | 95 | `Header`(18) + `HeaderBrand`(32) + `HeaderNav`(60) |
| `Footer.tsx` | 100 | `Footer`(35, **서버 컴포넌트**) + `FooterBrand`(19) + `FooterLinks`(42) |
| `FeedbackModal.tsx` | 155 | `FeedbackModal`(68) + `FeedbackForm`(90) + `FeedbackSuccess`(17) + `FeedbackTrigger`(35) |
| `Sidebar.tsx` | 280 | `DocTree`(94) + `DocTreeNode`(132) + `DocTreeSearch`(36) + `useTreeFilter`(46) |

`apps/shell/src/components/`에는 `DemoViewer.tsx`만 남았습니다 (Phase 5 대상).

추가로 `site.ts`를 만들어 Header·Footer에 흩어져 있던 `v16.3.1`·저장소 URL·릴리스 URL·
피드백 주소를 한곳에 모았습니다. **버전 문자열이 화면에 하드코딩돼 있어 catalog를 올릴 때
따로 고쳐야 한다는 점은 그 자체로 결함이며(F4), 별도 티켓입니다.**

### 7-1. 검증에서 배운 것

DOM 스냅샷이 **두 번 실패했고, 둘 다 도구 문제였습니다.**

1. **속성 순서** — 컴포넌트로 감싸면 `{...props}`를 펼치는 위치 때문에
   `<input type= placeholder= class=>`가 `<input class= type= …>`이 됩니다.
   DOM 의미는 같으므로 `to-dom.sh`가 속성도 정렬하도록 했습니다.
2. **정규화 로직 중복** — `snapshot.sh`와 `to-dom.sh`에 같은 규칙을 복사해 뒀다가
   한쪽만 고쳐서 어긋났고, 없는 회귀를 쫓았습니다. 이제 `snapshot.sh`가 `to-dom.sh`를
   호출합니다.

**진짜 차이는 하나 있었습니다.** `<span>Next.js {version}</span>`이 텍스트 노드 두 개가 되면서
React가 `<!-- -->` 마커를 끼워 넣었습니다. 정규화로 감추지 않고 템플릿 리터럴로 합쳐
노드를 하나로 되돌렸습니다 — **마커 위치는 컴포넌트 경계를 반영하므로 가리면 안 됩니다.**

CSS 카나리아에 `480px`(HeaderNav의 `min-[480px]:block`)를 추가했습니다. Phase 3부터
셸 CSS가 `@study/ui`를 실제로 포함하는지 확인하는 지표입니다. 임의값 클래스는 정규식으로
찾으면 이스케이프에 걸리므로 `grep -F`로 바꿨습니다.

### 7-2. 원래 계획 항목

`apps/shell/src/components/` → `packages/ui/src/`. 파일을 옮기면서 동시에 쪼갭니다.

- [ ] `ui/types/tree.ts` — `TreeNode`를 `apps/shell/src/lib/docs.ts`에서 이관. shell은 이걸 re-export (순환 방지: **타입 소유권은 `@study/ui`**)
- [ ] `ui/layout/header/` ← `Header.tsx`(95줄) → `Header.tsx` + `HeaderNav.tsx`. 로고 SVG는 `brand/`가 대신함
- [ ] `ui/layout/footer/` ← `Footer.tsx`(100줄) → `Footer.tsx`(**서버 컴포넌트로 전환**) + `FooterLinks.tsx` + `FeedbackTrigger.tsx`(`'use client'`)
  - **`'use client'` 경계가 Footer 전체 → 버튼 하나로 줄어든다**
- [ ] `ui/feedback/` ← `FeedbackModal.tsx`(155줄) → `FeedbackModal.tsx`(껍데기) + `FeedbackForm.tsx` + `FeedbackSuccess.tsx`
- [ ] `ui/nav/doc-tree/` ← `Sidebar.tsx`(280줄) → 5파일
  - `DocTree.tsx` (조립) · `DocTreeNode.tsx` (재귀 항목) · `DocTreeSearch.tsx` · `DocTreeDrawer.tsx` (모바일) · `useTreeFilter.ts` (검색 필터 로직)
- [ ] `ui/nav/toc/` ← `TableOfContents.tsx`(488줄) → 9파일
  - `useScrollSpy.ts` — 스크롤 감지·클릭 잠금·`scrollToId`·`scrollToTop` (약 150줄이 여기로)
  - `scrollspy-config.ts` — `SCROLLSPY_CONFIG`, `ALL_ALPHABETS`
  - `TableOfContents.tsx` — 용어집/일반 분기만 (목표 40줄 이하)
  - `TocPanel.tsx` — 공통 `aside` 껍데기
  - `TocList.tsx` — 일반 문서 목차
  - `GlossaryIndex.tsx` · `AlphabetGrid.tsx` · `MobileAlphabetBar.tsx` — 용어집 전용
  - `ScrollTopButton.tsx` — 2번 복붙 제거
  - `parseHeadings`는 Phase 4에서 `docs-render`로 넘긴다 (여기서는 import만 바꿀 준비)
- [ ] `apps/shell/src/app/layout.tsx`의 import를 `@/components/*` → `@study/ui`로
- [ ] `apps/shell/src/components/` 삭제

**검증:** 스크린샷 대조. 특히 사이드바 검색·접힘, 용어집 알파벳 점프, 모바일 드로어를 손으로 확인.

---

## 8. Phase 4 — `docs-render` 분해 ✅ 완료 (2026-08-21)

### 8-0. 결과

| 원본 | 줄 | 결과 |
|---|---:|---|
| `MarkdownRenderer.tsx` | **861** | `MarkdownRenderer`(234) + 파서 4 + 경로해석 2 + 노드 5 + shiki 2 = **14파일** |
| `TableOfContents.tsx` | **488** | `TableOfContents`(85) + `useScrollSpy`(147) + 화면 5 + config = **8파일**, `@study/ui`로 이관 |

**300줄 넘는 파일이 0개가 됐습니다.** 최대는 `MarkdownRenderer` 234줄(스캐너 루프)입니다.

없앤 복붙: 헤딩 4벌 → `Heading level={n}` 하나, Alert 3벌 → `Alert variant` 하나,
"맨 위로" 버튼 2벌 → `ScrollTopButton` 하나, 헤딩 파싱 2벌 → `parseHeadings` 하나.

### 8-1. 패키지 경계를 어떻게 갈랐나

`TableOfContents`를 `@study/ui`로 옮기려면 `parseHeadings`가 걸립니다. 파싱을 따라 옮기면
UI 패키지가 마크다운을 알게 되고, 그대로 두면 `@study/ui` → `@study/docs-render` 의존이 생깁니다.

**파싱과 그리기를 갈랐습니다.**

- `@study/docs-render` — `parseHeadings()` · `isGlossaryDoc()` : 문서 내용에 대한 판단
- `@study/ui` — `<TableOfContents headings={…} isGlossary={…} />` : 받은 것을 그리기만

셸 라우트가 둘을 잇습니다. 인터페이스는 `content: string` → `headings: HeadingItem[]`으로 바뀌었지만
렌더 결과는 동일합니다.

### 8-2. `slugify`는 동등성을 따로 증명했습니다

정규식에 한글 유니코드 범위(`가-힣` 등)가 들어 있어 눈으로 대조하기 어렵고,
**파일을 옮기는 과정에서 이스케이프가 실제 문자로 풀려 범위가 어긋날 뻔했습니다.**
원본 라인을 그대로 이식한 뒤, 원본 함수와 새 함수에 같은 입력 17개를 넣어 결과가
일치하는지 스크립트로 확인했습니다 (`slug-test.mjs`).

### 8-3. 검증 도구를 또 한 번 보완했습니다

원본은 `className={\`\n  w-full …\n\`}` 형태라 클래스 값 앞뒤에 공백이 남습니다.
`cn()`은 깔끔하게 이어 붙이므로 `class=" cursor-pointer …"` vs `class="cursor-pointer …"`로
갈렸습니다. 브라우저가 무시하는 차이이므로 토큰 분리 전에 trim하도록 했습니다.

### 8-4. 원래 계획 항목

861줄짜리 파일을 해체합니다. 이 계획에서 가장 큰 단계이므로 **커밋을 나눕니다.**

**4-1. 순수 함수 먼저 (JSX 없음)**
- [ ] `markdown/parse/slugify.ts` ← `slugify`, `SlugResult`
  - **`TableOfContents` → `MarkdownRenderer` 역방향 의존이 여기서 끊긴다**
- [ ] `markdown/parse/headings.ts` ← `TableOfContents`의 `parseHeadings`. `slugify`를 공유해 중복 제거
- [ ] `markdown/parse/demo-block.ts` ← `parseDemoBlock`, `DemoConfig`
- [ ] `markdown/resolve/segment.ts` ← `cleanSegment`
- [ ] `markdown/resolve/doc-link.ts` ← `resolveDocLink`
- [ ] `markdown/resolve/asset-url.ts` ← `resolveAssetUrl`
- [ ] `code/lang-map.ts` · `code/highlight.ts` ← `LANG_MAP`, `highlightCache`, `codeToHtml` 호출
  - **파일 중간에 있던 `import { codeToHtml } from 'shiki'`가 정상 위치로 간다**

**4-2. 노드 컴포넌트**
- [ ] `code/CodeBlock.tsx` ← `CodeBlock`
- [ ] `markdown/nodes/Heading.tsx` — `level: 1|2|3|4` **하나로 4벌 복붙 제거**. 레벨별 클래스는 룩업 테이블
- [ ] `markdown/nodes/Alert.tsx` — `variant: 'note' | 'warning' | 'caution'` **하나로 3벌 복붙 제거**. 아이콘·색은 룩업 테이블
- [ ] `markdown/nodes/Table.tsx` ← `renderTable`
- [ ] `markdown/nodes/Figure.tsx` · `Blockquote.tsx` · `ListItem.tsx` · `Paragraph.tsx` · `OfficialDocLink.tsx`
- [ ] `markdown/parse/inline.tsx` ← `renderInline` (인라인 이미지/코드/링크/굵게/기울임)

**4-3. 조립**
- [ ] `markdown/MarkdownRenderer.tsx` — 스캐너 루프와 디스패치만. **목표 150줄 이하**
- [ ] `index.ts` 재구성. 기존 `export *` 표면을 유지해 소비자 코드가 안 깨지게 한다

**검증:** 문서 페이지를 여러 편 대조. 코드 하이라이팅, 표, Alert 3종, 헤딩 앵커(`#`), 상대 링크 변환, 이미지 경로, `상위 메뉴:` 제외 규칙까지 확인.

---

## 9. Phase 5 — iframe 브릿지 단일화

- [ ] `docs-render/demo/useDemoResizeBridge.ts` — origin 검증 + `event.source` 검증 + `DEMO_RESIZE` 수신 + 2px 임계 높이 상태. **`DemoViewer`와 `DemoFrame`의 중복 로직이 여기 하나로**
- [ ] `docs-render/demo/DemoIframe.tsx` — 신호등 툴바 + 로딩 오버레이 + `iframe`(`sandbox` 속성 포함) + 새로고침 핸들러
- [ ] `docs-render/demo/DemoFrame.tsx` — URL 계산과 `fullscreen` 분기만 남기고 `DemoIframe` 사용
- [ ] `apps/shell/src/components/DemoViewer.tsx` → 제거. 셸 라우트가 `DemoIframe`을 직접 쓴다 (125줄 → 0)
- [ ] `demo-kit/useResizeBridge.ts` — `DemoContainer`에서 **송신 쪽** 로직(ResizeObserver·MutationObserver·postMessage) 추출

두 브릿지의 유일한 실제 차이는 최소 높이(`DemoViewer` 400px / `DemoFrame` 80px)와 초기 높이입니다. props로 받습니다.

**검증:** 데모 2개에서 항목을 추가해 높이가 늘어날 때 iframe이 따라 늘어나는지, 무한 루프가 없는지 확인.

---

## 10. Phase 6 — 데모 UI 통합 + 셸 라우트 슬림화

- [ ] `ui/demo/DemoStatusBadge.tsx` · `ui/demo/ZoneBadge.tsx` — Phase 2의 `Badge` 위에 얹는다. 3곳 중복 제거
- [ ] `ui/demo/DemoCard.tsx` — `demo/page.tsx`와 `DocDemoList.tsx`가 공유. `variant`로 밀도만 다르게
- [ ] `ui/demo/DemoIndexStats.tsx` — `/demo`의 통계 타일 3개
- [ ] `ui/demo/DemoPageHeader.tsx` — `/demo/[...slug]`의 브레드크럼 + 제목 + 배지 + 근거 문서 링크
- [ ] `docs-render/demo/DocDemoList.tsx` — `DemoCard`를 쓰도록 축소
- [ ] `apps/shell/src/lib/docs.ts` 분해
  - `lib/docs-root.ts` — `getDocsRoot()`
  - `lib/manifest.ts` — `getManifest()`·`getDocBySlug()`·`getDocContent()`·`DocEntry`·`DocsManifest`
  - `lib/demos.ts` — `@study/demos` re-export
- [ ] 라우트 3개(`[...slug]`, `demo`, `demo/[...slug]`)를 데이터 로딩 + 조립만 남긴다. 목표: 각 60줄 이하

**검증:** `/demo` 색인과 문서 하단 데모 목록의 카드가 이전과 동일하게 보이는지 대조.

---

## 11. Phase 7 (동작 변경) — 문서 본문 iframe 제거

규칙 16과 [06. 10](../06-ui-and-screen-design.md)의 "문서 페이지에 iframe이 **하나도 없다**"를 만족시킵니다. **Phase 1~6이 끝난 뒤 별도 커밋으로 진행합니다.**

- [ ] `docs-render/demo/DemoLinkCard.tsx` 추가 — `ui/demo/DemoCard`를 본문 폭에 맞춘 형태
- [ ] `MarkdownRenderer`의 ` ```demo ` 처리를 `DemoFrame` → `DemoLinkCard`로 교체
- [ ] 지시자 필드에서 `mode`·`height` 폐기 ([06. 9](../06-ui-and-screen-design.md)의 변경표)
- [ ] `DemoFrame`의 사용처는 **독립 열람 하나**로 줄어든다 ([03. 4-6](../03-composition-architecture.md)의 "높이 브릿지는 독립 열람으로 한정")
- [ ] `MarkdownRenderer`에서 `'use client'` 제거 가능 여부 확인
  - 남는 클라이언트 요소는 `CodeBlock`(복사 버튼 + shiki 런타임 하이라이팅)뿐이다. `CodeBlock`만 클라이언트 경계로 내리면 본문은 서버 컴포넌트가 된다
  - shiki를 빌드 타임으로 옮기는 것([06. 7-3](../06-ui-and-screen-design.md)의 `@shikijs/rehype`)은 이 계획 범위 밖 — 별도 티켓
- [ ] **문서 갱신** (안 하면 설계 문서끼리 모순됨)
  - [ADR 0003](../adr/0003-demo-directive-in-markdown.md) — 코드펜스가 링크 카드를 그린다, `mode`·`height` 삭제
  - [03. 4-2 / 4-5 / 4-6](../03-composition-architecture.md)
  - [CONTEXT.md](../../CONTEXT.md) — `인라인 데모` 정의

**검증:** 문서 페이지 HTML에 `<iframe>`이 0건. 코드펜스가 있는 문서에서 링크 카드가 그려지고 `/demo/{url}`로 이동한다.

---

## 12. Phase 8 (동작 변경) — 데모 앱 chrome 제거

규칙 12를 만족시킵니다. 셸이 이미 같은 정보를 그리고 있어 **중복 제거이기도 합니다.**

- [ ] `demo-baseline/…/server-actions/basic/page.tsx` — 상단 컨트롤 바에서 제목("Server Actions 기본 폼 처리 데모")·설명·`zone: baseline` 배지 제거. `DemoResetButton`은 데모 조작이므로 **남긴다**
- [ ] `demo-cache-components/…/caching/basic/page.tsx` — 헤더 블록 전체(zone 배지·제목·근거 문서 경로) 제거. 캐시 타임스탬프/ID 카드와 검증 패널은 **데모 본체이므로 남긴다**
- [ ] 제거된 제목·설명의 단일 원본이 `demos.yaml`임을 확인. 부족하면 `description` 필드를 채운다
- [ ] `packages/demos/scripts/gen-stubs.mjs`의 스텁 템플릿에서도 chrome을 뺀다 — **안 하면 새 데모마다 위반이 재생산된다**

**검증:** `/demo/{url}` 독립 열람에서 제목이 한 번만 보인다(셸이 그린 것). iframe 안이 데모 본체만 남는다.

---

## 13. 검증 방법

| 단계 | 통과 조건 |
|---|---|
| 매 Phase | `pnpm check-types` · `pnpm build` 통과 |
| Phase 1~6 | **HTML 스냅샷 11개가 Phase 0과 완전히 동일** + CSS 카나리아 전부 존재 |
| Phase 7~8 | 의도한 차이만 발생 (본문 iframe 0건 / 데모 안 chrome 없음) |

### 13-1. HTML 스냅샷 — 주 검증 수단

스크린샷보다 정확합니다. 순수 리팩토링에서 확인해야 할 것은 "**클래스 문자열과 DOM 구조가 한 글자도 안 바뀌었는가**"이고, 그건 렌더된 HTML을 그대로 비교하는 게 정확합니다.

```
snapshot.sh <라벨>          # 11개 라우트를 받아 정규화 후 저장
compare.sh phase0 <라벨>    # 기준선과 비교. 차이 0이 합격
```

요청마다 바뀌는 값은 Next.js 런타임 ID(`self.__next_r`)와 `_rsc` 쿼리뿐이라 그 둘만 정규화합니다. **연속 두 번 캡처해 11/11 동일함을 확인**했으므로 도구 자체는 결정적입니다.

대상 라우트: 랜딩 · 문서 3편 · 용어집 · 카테고리 홈 · 데모 색인 · 데모 독립 열람 2건 · zone 프록시 2건.

### 13-2. CSS 카나리아 — `@source` 누락 탐지

[06. 7-5](../06-ui-and-screen-design.md)가 경고한 함정은 HTML 스냅샷으로 **잡히지 않습니다**. 클래스 이름은 HTML에 그대로 남고 CSS 규칙만 사라지기 때문입니다. Phase 1(`demo-kit` 신설)과 Phase 3(셸 UI 이동)이 정확히 그 위험 구간입니다.

```
css-check.sh <라벨>   # CSS 번들 크기·규칙 수 + 패키지별 카나리아 클래스 존재 확인
```

| 대상 | 카나리아 | 출처 |
|---|---|---|
| 셸 | `grid-cols-6` | `docs-render`/TableOfContents 알파벳 그리드 |
| 셸 | `line-clamp-2` | `docs-render`/DocDemoList 설명 말줄임 |
| 셸 | `w-80` | `apps/shell`/Sidebar 폭 |
| 데모 앱 | `divide-inherit` · `border-inherit` | ExpectedActualPanel — **Phase 1에서 `ui` → `demo-kit`으로 옮겨지는 바로 그 파일** |

**마커 클래스(`shiki-wrapper`, `demo-container`)는 카나리아로 쓸 수 없습니다.** Tailwind 유틸리티가 아니라 원래 CSS에 규칙이 없습니다. 반드시 Tailwind가 생성하는 유틸리티를 골라야 합니다.

Phase 3에서 셸 UI가 `@study/ui`로 옮겨지면 **`@study/ui` 전용 카나리아를 하나 추가**해야 합니다. 그 전까지 셸 CSS는 `@study/ui`의 클래스를 하나도 포함하지 않습니다 (셸이 그 패키지를 쓰지 않으므로).

### 13-3. 순수 함수 테스트 (선택)

Phase 4-1에서 나오는 `slugify`·`resolveDocLink`·`resolveAssetUrl`·`parseHeadings`·`parseDemoBlock`은 전부 입출력이 명확한 순수 함수라, 추출 직후 Vitest 케이스를 붙여두면 이후 Phase의 회귀를 자동으로 잡습니다. 테스트 도구 도입 여부는 별건이므로 선택 항목으로 둡니다.

---

## 14. 순서를 바꾸면 안 되는 이유

```
Phase 1 (demo-kit)  ─┐  먼저 안 하면 Phase 2~3에서 옮긴 파일을 또 옮긴다
Phase 2 (primitives) ─┤  Phase 3~6이 전부 이걸 소비한다
Phase 3 (셸 UI)      ─┤
Phase 4 (docs-render)─┤  4-1의 slugify 추출이 Phase 3의 TOC 의존을 끊는다
Phase 5 (브릿지)     ─┤  Phase 3에서 DemoViewer가 이미 옮겨져 있어야 통합이 쉽다
Phase 6 (데모 UI)    ─┘  Phase 2의 Badge/Card 위에 얹는다
─────────────────────
Phase 7 (iframe)     ─┐  Phase 6의 DemoCard가 있어야 링크 카드를 만든다
Phase 8 (chrome)     ─┘  독립적. 7과 순서 무관
```

## 15. 예상 결과

| 지표 | 현재 | 목표 |
|---|---:|---:|
| 최대 파일 크기 | 861줄 | 150줄 이하 |
| 300줄 초과 파일 수 | 2 | 0 |
| iframe 브릿지 구현 | 2벌 | 1벌 |
| 데모 카드 구현 | 2벌 | 1벌 |
| status/zone 배지 구현 | 3벌 | 1벌 |
| 셸의 `@study/ui` 사용 | 0건 (죽은 의존성) | 실사용 |
| 규칙 12·16·17 위반 | 3건 | 0건 |
