# 셸과 학습 문서 페이지 구현 계획

> **에이전트 작업자에게:** 이 계획은 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`로 태스크 단위로 실행합니다. 각 단계는 체크박스(`- [ ]`)로 추적합니다.

**Goal:** `pnpm dev` 한 번으로 `localhost:3000`이 뜨고, `nextjs-docs/`의 학습 문서 264편이 좌측 트리 · 본문 · 우측 목차 3단 레이아웃으로 렌더된다.

**Architecture:** 저장소 루트를 pnpm 워크스페이스 루트로 삼고, `nextjs-app/apps/shell`(Next.js 앱) + `nextjs-app/packages/{ui,docs-render}` + `nextjs-docs`(`@study/docs`)로 구성한다. md는 복사하지 않고 `@study/docs`의 빌드 스크립트가 훑어 `docs-manifest.json`을 만들며, 셸은 `[...slug]` catch-all 하나로 전 문서를 정적 생성한다. UI는 shadcn/ui 소스를 `@study/ui`에 복사해 쓴다.

**Tech Stack:** Next.js 16.3.1 (App Router, Turbopack) · React 19.2.8 · TypeScript · Tailwind CSS v4 · pnpm 10.33.0 workspaces · Turborepo 2.x · shadcn/ui · unified/remark/rehype · shiki · Vitest · Playwright

## Global Constraints

이 절의 값은 **모든 태스크의 요구사항에 암묵적으로 포함**됩니다.

- **기준 버전은 `pnpm-workspace.yaml`의 catalog 한 곳에서만 선언한다.** `next`·`react`·`react-dom`은 어느 `package.json`에도 버전 문자열을 직접 적지 않고 `"catalog:"`로 참조한다. 현재 값: `next: 16.3.1`, `react: 19.2.8`, `react-dom: 19.2.8` (캐럿 없이 정확 고정).
- **`nextjs-docs/`의 md는 단일 원본이다.** `nextjs-app/` 아래에 사본·심볼릭 링크를 만들지 않는다.
- **`create-next-app`에 `--turbopack`을 넘기지 않는다.** 16.3.1에 없는 플래그이고 CLI가 조용히 무시한다.
- **모든 패키지에 `check-types` 스크립트가 있어야 한다.** 하나라도 빠지면 `turbo check-types`에서 조용히 제외된다.
- **셸의 dev 포트는 3000으로 고정한다.**
- **셸의 브라우저 스토리지 키·쿠키에는 `study_` 접두사를 붙인다** (예: `study_theme`, `study_sidebar`). 모든 zone이 동일 오리진이라 접두사 없는 키는 zone을 넘어 샌다.
- **디자인 토큰 이름을 새로 만들지 않는다.** shadcn의 Tailwind v4 규약(`@theme inline` + oklch)을 그대로 쓴다.
- **shadcn의 `sidebar` 컴포넌트는 설치하지 않는다.** `sidebar_state` 쿠키가 위 접두사 규칙을 어긴다.
- **화면 라벨은 `예제`, 코드·URL·타입 이름은 `demo`/`데모`다.** 코드에서 `example`로 바꿔 쓰지 않는다.
- **문서 본문에 iframe을 넣지 않는다.** (이 계획의 범위에는 데모 자체가 없다.)
- **커밋 메시지 형식**: `[$GIT_BRANCH_NAME][prefix]: title` + 빈 줄 + 본문 불릿. prefix는 `feat`/`add`/`fix`/`docs`/`refactor`/`perf`/`test`/`build`/`ci`/`revert`.

**근거 문서** — 막히면 여기를 본다.

| 문서 | 무엇이 있나 |
|---|---|
| [01. 프로젝트 구성 절차](../01-project-setup.md) | 워크스페이스 뼈대, zone 생성 6단계, Internal Package 패턴, turbo 파이프라인 |
| [03. 결합 구조 설계](../03-composition-architecture.md) | URL 계약, 문서 URL 미러링 규칙, 함정 목록 |
| [06. 화면 구성과 UI 설계](../06-ui-and-screen-design.md) | 페이지 타입 5종, 문서 페이지 구성, 디자인 토큰 |

---

## 범위

**이 계획에 포함** — 06의 §1(골격 ①②③) · §3(학습 문서 페이지) · §4(카테고리 홈) · §7(UI 기반) · §8(디자인 토큰).

**이 계획에 없음 — 후속 계획으로 분리합니다.** 각각 그 자체로 동작하는 산출물을 냅니다.

| 후속 계획 | 범위 | 이 계획에 의존하는 것 |
|---|---|---|
| **계획 2 — 헤더와 검색, 랜딩** | 06 §2, §6 | `docs-manifest`, 디자인 토큰, `@study/ui` |
| **계획 3 — 데모 배관** | 06 §5, §3-3, §3-4 + 01의 zone 추가 절차 | `[...slug]` 렌더 파이프라인 |

헤더는 이 계획에서 **로고와 두 메뉴만 있는 최소 형태**로 만듭니다. 검색 트리거와 테마 토글은 계획 2에서 붙입니다.

## 테스트 전략

| 종류 | 도구 | 대상 |
|---|---|---|
| 단위 | **Vitest** | URL 규칙, 매니페스트 생성, 목차 추출, md 변환 — 전부 순수 함수 |
| E2E 스모크 | **Playwright** | 실제 렌더된 페이지의 3단 구조, 트리 활성 표시, 목차 |

React 컴포넌트 단위 테스트(RTL)는 두지 않습니다. 이 계획의 컴포넌트는 대부분 Server Component이고 로직이 순수 함수 쪽에 모여 있어, 렌더 결과 검증은 Playwright가 더 정확합니다.

## 파일 구조

```
(저장소 루트)
├─ package.json                       # 워크스페이스 루트, turbo 스크립트           [Task 1]
├─ pnpm-workspace.yaml                # 기준 버전 catalog — 유일한 선언처            [Task 1]
├─ turbo.json                         # build/dev/lint/check-types 파이프라인        [Task 1]
├─ vitest.config.ts                   # 단위 테스트 프로젝트 목록                    [Task 1]
│
├─ nextjs-docs/                       # @study/docs — md 단일 원본
│  ├─ package.json                                                                 [Task 1]
│  ├─ src/
│  │  ├─ url.ts                       # md 경로 → 학습자 URL                        [Task 2]
│  │  ├─ manifest.ts                  # 목차 트리 생성                              [Task 3]
│  │  └─ index.ts                     # 타입 + 매니페스트 로더                       [Task 3]
│  ├─ scripts/build-manifest.mjs      # build 태스크 진입점                         [Task 3]
│  ├─ scripts/lint-urls.mjs           # URL 충돌·예약 세그먼트 검사                  [Task 3]
│  └─ docs-manifest.json              # 생성물 (gitignore)                          [Task 3]
│
└─ nextjs-app/
   ├─ apps/shell/
   │  ├─ next.config.ts                                                            [Task 4]
   │  ├─ src/app/
   │  │  ├─ layout.tsx                # 루트 레이아웃 + 폰트 + 헤더                  [Task 4, 8]
   │  │  ├─ globals.css               # 디자인 토큰 + @source                       [Task 4]
   │  │  ├─ fonts/                    # PretendardVariable.woff2                    [Task 4]
   │  │  ├─ page.tsx                  # / (루트 README.md) — 임시                    [Task 8]
   │  │  ├─ [...slug]/page.tsx        # 문서 전체                                   [Task 8]
   │  │  └─ docs-assets/[...path]/route.ts  # 문서 이미지 서빙                       [Task 12]
   │  └─ e2e/docs-page.spec.ts        # Playwright 스모크                           [Task 13]
   │
   └─ packages/
      ├─ ui/                          # @study/ui — 셸 전용
      │  ├─ package.json                                                           [Task 5]
      │  ├─ components.json           # shadcn CLI 설정                             [Task 5]
      │  └─ src/
      │     ├─ lib/utils.ts           # cn()                                       [Task 5]
      │     ├─ components/            # shadcn 복사본                               [Task 5]
      │     ├─ layout/DocsShell.tsx   # 3단 골격                                    [Task 8]
      │     ├─ layout/SiteHeader.tsx  # 최소 헤더                                   [Task 8]
      │     ├─ nav/DocsTree.tsx       # 좌측 트리                                   [Task 9]
      │     ├─ nav/PageToc.tsx        # 우측 목차                                   [Task 10]
      │     └─ nav/Breadcrumb.tsx, nav/PrevNext.tsx                                [Task 11]
      │
      └─ docs-render/                 # @study/docs-render — 셸 전용
         ├─ package.json                                                           [Task 6]
         └─ src/
            ├─ render.tsx             # md → React 엘리먼트                         [Task 6]
            ├─ highlight.ts           # shiki rehype 플러그인 설정                   [Task 7]
            └─ toc.ts                 # H2 추출                                    [Task 10]
```

**`@study/ui`와 `@study/docs-render`를 나눈 이유**: 전자는 화면 조각, 후자는 md 변환 파이프라인입니다. 후자는 React를 만들어내지만 unified 생태계 의존성(remark/rehype/shiki)을 끌고 오므로, 순수 UI 컴포넌트와 섞으면 `@study/ui`를 쓰는 쪽이 전부 그 무게를 집니다.

---

### Task 1: 워크스페이스 뼈대와 Phase 선언 갱신

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `vitest.config.ts`, `nextjs-docs/package.json`
- Modify: `.gitignore`, `nextjs-app/AGENTS.md`, `nextjs-app/README.md`, `nextjs-app/docs/README.md`

**Interfaces:**
- Consumes: 없음 (첫 태스크)
- Produces: 워크스페이스 루트. 이후 모든 태스크가 `pnpm --filter <패키지>` 로 동작한다. catalog 별칭 `catalog:` 가 `next@16.3.1`·`react@19.2.8`·`react-dom@19.2.8`·`@types/react@^19.2.0`·`@types/react-dom@^19.2.0` 를 가리킨다.

- [ ] **Step 1: 저장소 루트에 `package.json` 생성**

```json
{
  "name": "nextjs-ko-study-lab",
  "private": true,
  "packageManager": "pnpm@10.33.0",
  "engines": { "node": ">=20.9.0" },
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "check-types": "turbo check-types",
    "test": "vitest run"
  },
  "devDependencies": {
    "turbo": "^2.10.10",
    "vitest": "^4.1.11"
  }
}
```

- [ ] **Step 2: `pnpm-workspace.yaml` 생성**

기준 버전이 선언되는 **유일한 곳**입니다. 캐럿을 붙이지 마세요.

```yaml
packages:
  - nextjs-docs
  - nextjs-app/apps/*
  - nextjs-app/packages/*

catalog:
  # 기준 버전 — 캐럿 없이 정확 고정. nextjs-docs/README.md의 값과 항상 같아야 한다
  next: 16.3.1
  react: 19.2.8
  react-dom: 19.2.8
  # 부수 의존성 — packages/*가 "catalog:"로 참조하므로 여기 없으면 install이 실패한다
  '@types/react': ^19.2.0
  '@types/react-dom': ^19.2.0
```

- [ ] **Step 3: `turbo.json` 생성**

```jsonc
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "!.next/dev/**", "dist/**", "docs-manifest.json"],
      "env": ["ZONE_*_URL"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "inputs": ["$TURBO_DEFAULT$", ".env.local", ".env"]
    },
    "lint": {},
    "check-types": { "dependsOn": ["^check-types"] }
  }
}
```

`dependsOn: ["^build"]`가 하는 진짜 일은 **md를 고쳤을 때 셸의 빌드 캐시를 무효화**하는 것입니다. 셸이 `@study/docs`를 의존성으로 선언하면 셸의 build 해시에 `@study/docs`의 build 해시가 들어갑니다.

- [ ] **Step 4: `nextjs-docs/package.json` 생성**

```json
{
  "name": "@study/docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./url": "./src/url.ts"
  },
  "scripts": {
    "build": "node scripts/build-manifest.mjs",
    "lint": "node scripts/lint-urls.mjs",
    "check-types": "tsc --noEmit"
  }
}
```

- [ ] **Step 5: 루트 `vitest.config.ts` 생성**

Vitest 4는 `vitest.workspace.ts`를 더 이상 쓰지 않습니다. `test.projects`로 선언합니다.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['nextjs-docs', 'nextjs-app/packages/*'],
  },
})
```

- [ ] **Step 6: `.gitignore`에 생성물 추가**

파일 끝에 다음을 덧붙입니다.

```gitignore
# 워크스페이스 생성물
docs-manifest.json
```

- [ ] **Step 7: 설치 확인**

Run: `pnpm install`
Expected: 성공. `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`이 나오면 Step 2의 `@types/*` 항목이 빠진 것입니다.

Run: `pnpm turbo --version`
Expected: `2.` 로 시작하는 버전 출력

- [ ] **Step 8: Phase 선언 갱신 — `nextjs-app/AGENTS.md`**

`nextjs-docs/PROGRESS.md`의 194개 항목이 전부 "완료"라 Phase Gate는 이미 충족됐습니다. 그런데 선언 파일들이 여전히 "착수 전"이라 이 계획의 나머지 태스크가 저장소 규칙과 모순됩니다. **여기서 함께 고칩니다.**

`nextjs-app/AGENTS.md`의 3행과 "착수 조건" 절을 다음으로 바꿉니다.

```markdown
Next.js 학습 데모 사이트다. **설계가 끝났고 Phase Gate가 충족되어 구현에 착수했다.**

## Phase 상태

[`nextjs-docs/PROGRESS.md`](../nextjs-docs/PROGRESS.md)의 항목이 전부 "완료"가 되어 [루트 Phase Gate](../AGENTS.md#phase-gate)를 통과했다 (2026-08-19). 구현 순서는 [`docs/plans/`](./docs/plans/)를 따른다.
```

- [ ] **Step 9: Phase 선언 갱신 — `nextjs-app/README.md`**

5행 `**설계는 완료됐고 실행 코드는 아직 없습니다.**` 를 다음으로 바꿉니다.

```markdown
**설계가 끝나 구현에 착수했습니다.** 진행 중인 작업은 [`docs/plans/`](./docs/plans/)에 있습니다.
```

그리고 47~49행의 "착수 조건" 절 전체를 다음으로 바꿉니다.

```markdown
## 구현 계획

| 계획 | 범위 | 상태 |
|---|---|---|
| [2026-08-19 셸과 학습 문서 페이지](./docs/plans/2026-08-19-shell-and-docs-page.md) | 워크스페이스, 문서 렌더링, 3단 레이아웃 | 진행 중 |
```

- [ ] **Step 10: `nextjs-app/docs/README.md`에 plans 안내 추가**

"## 읽는 순서" 절 바로 앞에 다음을 넣습니다.

```markdown
## 구현 계획

설계를 코드로 옮기는 순서는 [`plans/`](./plans/)에 있습니다. 설계 문서가 "무엇을/왜"라면 계획은 "어떤 순서로"입니다.
```

- [ ] **Step 11: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][build]: pnpm 워크스페이스와 turbo 파이프라인 구성

- 루트 package.json / pnpm-workspace.yaml / turbo.json 추가
- 기준 버전 catalog에 next 16.3.1 · react 19.2.8 고정
- nextjs-docs를 @study/docs 워크스페이스 패키지로 편입
- Phase Gate 충족에 맞춰 nextjs-app의 착수 선언 갱신

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `@study/docs` — md 경로에서 학습자 URL 만들기

[03. 3-1 "문서 URL은 md 경로를 미러링한다"](../03-composition-architecture.md)의 규칙을 함수로 옮깁니다. 이 계획에서 **가장 먼저 테스트를 쓰는 곳**입니다 — 규칙이 문서에 표로 이미 적혀 있어서 그대로 테스트 케이스가 됩니다.

**Files:**
- Create: `nextjs-docs/src/url.ts`, `nextjs-docs/src/url.test.ts`
- Create: `nextjs-docs/vitest.config.ts`, `nextjs-docs/tsconfig.json`

**Interfaces:**
- Consumes: Task 1의 워크스페이스
- Produces:
  - `docPathToUrl(mdPath: string): string | null` — `nextjs-docs` 기준 상대 경로(`1-getting-started/caching.md`)를 받아 학습자 URL(`/getting-started/caching`)을 반환. URL을 만들지 않는 경로면 `null`.
  - `stripOrderPrefix(segment: string): string` — 한 세그먼트에서 번호 접두사 제거.
  - `RESERVED_SEGMENTS: readonly string[]` — `['demo', 'zone', 'demo-static']`

- [ ] **Step 1: `nextjs-docs/tsconfig.json` 생성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "scripts/**/*.mjs"]
}
```

- [ ] **Step 2: `nextjs-docs/vitest.config.ts` 생성**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { include: ['src/**/*.test.ts'] },
})
```

- [ ] **Step 3: 실패하는 테스트 작성 — `nextjs-docs/src/url.test.ts`**

표의 예시는 [03. 3-1](../03-composition-architecture.md)에서 그대로 가져온 것입니다.

```ts
import { describe, expect, it } from 'vitest'
import { docPathToUrl, stripOrderPrefix, RESERVED_SEGMENTS } from './url'

describe('stripOrderPrefix', () => {
  it.each([
    ['1-getting-started', 'getting-started'],
    ['2.15-client-side-data-fetching', 'client-side-data-fetching'],
    ['3.1.21-routing', 'routing'],
    ['3.5.1-next-config-js', 'next-config-js'],
    ['glossary', 'glossary'],
  ])('%s → %s', (input, expected) => {
    expect(stripOrderPrefix(input)).toBe(expected)
  })

  it('세그먼트 중간의 숫자는 건드리지 않는다', () => {
    expect(stripOrderPrefix('use-cache-2')).toBe('use-cache-2')
  })
})

describe('docPathToUrl', () => {
  it.each([
    ['1-getting-started/caching.md', '/getting-started/caching'],
    ['1-getting-started/README.md', '/getting-started'],
    ['2-guides/2.15-client-side-data-fetching/swr.md', '/guides/client-side-data-fetching/swr'],
    ['3-api-reference/3.4-directives/use-cache.md', '/api-reference/directives/use-cache'],
    ['3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md', '/api-reference/config/next-config-js/turbopack'],
    ['README.md', '/'],
  ])('%s → %s', (input, expected) => {
    expect(docPathToUrl(input)).toBe(expected)
  })

  it('대소문자를 보존한다', () => {
    expect(docPathToUrl('3-api-reference/3.3-functions/cacheLife.md')).toBe(
      '/api-reference/functions/cacheLife',
    )
  })

  it.each([
    'AGENTS.md',
    'CLAUDE.md',
    'CONTEXT.md',
    'PROGRESS.md',
    'TRANSLATION.md',
    'docs/adr/0002-reorder-learning-sequence.md',
    '1-getting-started/assets/installation-01.webp',
  ])('URL을 만들지 않는다: %s', (input) => {
    expect(docPathToUrl(input)).toBeNull()
  })
})

describe('RESERVED_SEGMENTS', () => {
  it('셸과 데모 앱이 소유하는 세 세그먼트', () => {
    expect([...RESERVED_SEGMENTS].sort()).toEqual(['demo', 'demo-static', 'zone'])
  })
})
```

- [ ] **Step 4: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs exec vitest run`
Expected: FAIL — `Failed to resolve import "./url"`

- [ ] **Step 5: `nextjs-docs/src/url.ts` 구현**

```ts
/** 셸과 데모 앱이 소유하는 최상위 세그먼트. 카테고리 폴더 이름으로 쓸 수 없다. */
export const RESERVED_SEGMENTS = ['demo', 'zone', 'demo-static'] as const

/** 루트에 있는, URL을 만들지 않는 운영 문서 */
const ROOT_META_FILES = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'CONTEXT.md',
  'PROGRESS.md',
  'TRANSLATION.md',
])

const ORDER_PREFIX = /^\d+(\.\d+)*-/

/** `2.15-client-side-data-fetching` → `client-side-data-fetching` */
export function stripOrderPrefix(segment: string): string {
  return segment.replace(ORDER_PREFIX, '')
}

/**
 * `nextjs-docs` 기준 상대 경로를 학습자 URL로 바꾼다.
 * URL을 만들지 않는 경로(ADR·assets·운영 문서)면 null.
 */
export function docPathToUrl(mdPath: string): string | null {
  const normalized = mdPath.replace(/\\/g, '/').replace(/^\.\//, '')

  if (!normalized.endsWith('.md')) return null
  if (ROOT_META_FILES.has(normalized)) return null

  const segments = normalized.split('/')
  if (segments.includes('assets')) return null
  if (segments[0] === 'docs') return null

  const fileName = segments.pop()!
  const dirs = segments.map(stripOrderPrefix)

  if (fileName === 'README.md') {
    return dirs.length === 0 ? '/' : `/${dirs.join('/')}`
  }

  const leaf = stripOrderPrefix(fileName.replace(/\.md$/, ''))
  return `/${[...dirs, leaf].join('/')}`
}
```

- [ ] **Step 6: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs exec vitest run`
Expected: PASS — 모든 케이스 통과

- [ ] **Step 7: 실제 저장소 전체에 적용해 눈으로 확인**

Run:
```bash
cd nextjs-docs && node --input-type=module -e "
import { docPathToUrl } from './src/url.ts'
import { readdirSync } from 'node:fs'
const files = readdirSync('.', { recursive: true }).map(String).filter((f) => f.endsWith('.md'))
const urls = files.map((f) => docPathToUrl(f.replaceAll('\\\\', '/'))).filter(Boolean)
console.log('md:', files.length, '/ URL 수:', urls.length, '/ 중복:', urls.length - new Set(urls).size)
"
```
Expected: `md: 291 / URL 수: 283 / 중복: 0` — 편수가 다르면 문서가 추가/삭제된 것이니 수치만 확인하고 넘어갑니다. **중복이 0이 아니면 멈추고 원인을 찾습니다.**

> Node가 `.ts`를 직접 못 읽으면 `npx tsx` 로 바꿔 실행합니다.

- [ ] **Step 8: 커밋**

```bash
git add nextjs-docs/src nextjs-docs/tsconfig.json nextjs-docs/vitest.config.ts
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 학습 문서 URL 매핑 규칙 구현

- docPathToUrl / stripOrderPrefix 추가 (03 3-1 규칙)
- 03 문서의 예시 표를 그대로 테스트 케이스로 사용
- 저장소 전체 283개 URL 충돌 없음 확인

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `@study/docs` — 목차 매니페스트와 URL lint

셸이 좌측 트리·이전/다음·정적 생성에 쓸 목차 트리를 만듭니다. 순서의 원본은 각 카테고리 `README.md`의 `## 학습 순서` 섹션입니다.

**Files:**
- Create: `nextjs-docs/src/manifest.ts`, `nextjs-docs/src/manifest.test.ts`, `nextjs-docs/src/index.ts`
- Create: `nextjs-docs/scripts/build-manifest.mjs`, `nextjs-docs/scripts/lint-urls.mjs`

> **먼저 실제 형식을 눈으로 확인하세요.** `sed -n '/## 학습 순서/,/^## /p' nextjs-docs/1-getting-started/README.md` 와 `grep -n '\](\./' nextjs-docs/3-api-reference/README.md | head -5`. 아래 구현은 이 두 출력을 근거로 씌어 있습니다.

**Interfaces:**
- Consumes: `docPathToUrl`, `stripOrderPrefix`, `RESERVED_SEGMENTS` (Task 2)
- Produces:
  ```ts
  export interface DocNode {
    url: string          // '/getting-started/caching'
    title: string        // '캐싱과 재검증'
    mdPath: string       // '1-getting-started/caching.md'
    order: string        // '1.9'  — README의 학습 순서에서 온 번호
    children: DocNode[]  // 카테고리/하위그룹만 채워짐
  }
  export interface DocsManifest {
    tree: DocNode[]                       // 최상위 카테고리 5개
    flat: DocNode[]                       // 학습 순서대로 평탄화 — 이전/다음에 사용
    byUrl: Record<string, DocNode>
  }
  export function loadManifest(): DocsManifest   // src/index.ts
  export function buildManifest(rootDir: string): DocsManifest  // src/manifest.ts
  export function parseDocLinks(readmeMarkdown: string): Array<{ order: string; title: string; href: string }>
  ```

- [ ] **Step 1: 실패하는 테스트 작성 — `nextjs-docs/src/manifest.test.ts`**

순서의 원본은 각 `README.md`의 **번호가 붙은 불릿 링크**입니다. 섹션 제목은 README마다 다릅니다 — `1-getting-started`는 `## 학습 순서`, `3-api-reference`는 `## 하위 카테고리`입니다. 그래서 **섹션이 아니라 불릿 형식으로** 찾습니다.

```ts
import { describe, expect, it } from 'vitest'
import { parseDocLinks, buildManifest } from './manifest'

describe('parseDocLinks', () => {
  it('번호가 붙은 불릿 링크를 문서 순서대로 뽑는다', () => {
    const md = [
      '# 시작하기',
      '',
      '## 학습 순서',
      '',
      '- 1.1 [Installation](./installation.md)',
      '- 1.2 [Project Structure](./project-structure.md)',
      '- 1.10 [Error Handling](./error-handling.md)',
    ].join('\n')

    expect(parseDocLinks(md)).toEqual([
      { order: '1.1', title: 'Installation', href: './installation.md' },
      { order: '1.2', title: 'Project Structure', href: './project-structure.md' },
      { order: '1.10', title: 'Error Handling', href: './error-handling.md' },
    ])
  })

  it('섹션 제목이 무엇이든 상관하지 않는다', () => {
    const md = ['## 하위 카테고리', '', '- 3.3 [Functions](./3.3-functions/README.md)'].join('\n')
    expect(parseDocLinks(md)).toEqual([
      { order: '3.3', title: 'Functions', href: './3.3-functions/README.md' },
    ])
  })

  it('링크 뒤의 부연은 무시한다', () => {
    const md = '- 3.1 [File-system conventions](./3.1-file-conventions/README.md) (하위 그룹 포함)'
    expect(parseDocLinks(md)[0].href).toBe('./3.1-file-conventions/README.md')
  })

  it('번호 없는 불릿 링크는 순서로 치지 않는다', () => {
    expect(parseDocLinks('- [ADR 0002](../docs/adr/0002-reorder-learning-sequence.md)')).toEqual([])
  })

  it('링크가 없으면 빈 배열', () => {
    expect(parseDocLinks('# 제목\n\n본문뿐입니다.')).toEqual([])
  })
})

describe('buildManifest', () => {
  const m = buildManifest(new URL('../', import.meta.url).pathname)

  it('최상위 카테고리가 5개다', () => {
    expect(m.tree.map((n) => n.url)).toEqual([
      '/getting-started',
      '/guides',
      '/api-reference',
      '/glossary',
      '/architecture',
    ])
  })

  it('카테고리 아래에 자식이 달린다', () => {
    const gettingStarted = m.tree.find((n) => n.url === '/getting-started')!
    expect(gettingStarted.children.length).toBeGreaterThan(10)
    expect(gettingStarted.children[0].order).toBe('1.1')
  })

  it('하위그룹이 2단으로 중첩된다', () => {
    const api = m.tree.find((n) => n.url === '/api-reference')!
    const functions = api.children.find((n) => n.url === '/api-reference/functions')
    expect(functions?.children.length).toBeGreaterThan(10)
  })

  it('flat이 학습 순서대로 평탄화된다', () => {
    expect(m.flat[0].url).toBe('/getting-started')
    expect(m.flat.length).toBeGreaterThan(250)
  })

  it('byUrl로 문서를 찾을 수 있다', () => {
    expect(m.byUrl['/getting-started/caching']?.mdPath).toBe('1-getting-started/caching.md')
  })

  it('flat에 같은 문서가 두 번 들어가지 않는다', () => {
    const urls = m.flat.map((n) => n.url)
    expect(urls.length).toBe(new Set(urls).size)
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs exec vitest run src/manifest.test.ts`
Expected: FAIL — `Failed to resolve import "./manifest"`

- [ ] **Step 3: `nextjs-docs/src/manifest.ts` 구현**

```ts
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { docPathToUrl } from './url'

export interface DocNode {
  url: string
  title: string
  mdPath: string
  order: string
  children: DocNode[]
}

export interface DocsManifest {
  tree: DocNode[]
  flat: DocNode[]
  byUrl: Record<string, DocNode>
}

/** `- 1.1 [Installation](./installation.md)` 형태의 불릿 링크 */
const NUMBERED_LINK = /^-\s*([\d.]+)\s+\[([^\]]+)\]\(([^)]+)\)/

/**
 * README에서 번호가 붙은 불릿 링크를 문서 순서대로 뽑는다.
 * 섹션 제목(`## 학습 순서` / `## 하위 카테고리`)은 README마다 달라 근거로 삼지 않는다.
 */
export function parseDocLinks(
  readmeMarkdown: string,
): Array<{ order: string; title: string; href: string }> {
  const out: Array<{ order: string; title: string; href: string }> = []
  for (const line of readmeMarkdown.split('\n')) {
    const m = NUMBERED_LINK.exec(line.trim())
    if (m) out.push({ order: m[1], title: m[2], href: m[3] })
  }
  return out
}

/** md 첫 번째 `# 제목`을 문서 제목으로 쓴다. 없으면 파일명. */
function readTitle(absPath: string, fallback: string): string {
  const m = /^#\s+(.+)$/m.exec(readFileSync(absPath, 'utf8'))
  return m ? m[1].trim() : fallback
}

function listMarkdown(rootDir: string): string[] {
  return readdirSync(rootDir, { recursive: true })
    .map(String)
    .map((p) => p.replaceAll('\\', '/'))
    .filter((p) => p.endsWith('.md'))
    .sort()
}

export function buildManifest(rootDir: string): DocsManifest {
  const byUrl: Record<string, DocNode> = {}

  for (const mdPath of listMarkdown(rootDir)) {
    const url = docPathToUrl(mdPath)
    if (!url) continue
    const fallback = mdPath.split('/').pop()!.replace(/\.md$/, '')
    byUrl[url] = {
      url,
      title: readTitle(join(rootDir, mdPath), fallback),
      mdPath,
      order: '',
      children: [],
    }
  }

  // 각 README의 번호 불릿으로 부모-자식을 잇고 order를 채운다
  for (const node of Object.values(byUrl)) {
    if (!node.mdPath.endsWith('README.md')) continue
    const dir = node.mdPath.slice(0, node.mdPath.lastIndexOf('/') + 1)
    for (const row of parseDocLinks(readFileSync(join(rootDir, node.mdPath), 'utf8'))) {
      // './3.3-functions/README.md' → '3-api-reference/3.3-functions/README.md'
      const childMd = new URL(row.href, `file:///${dir}`).pathname.replace(/^\//, '')
      const childUrl = docPathToUrl(childMd)
      const child = childUrl ? byUrl[childUrl] : undefined
      if (!child || child.url === node.url) continue
      child.order = row.order
      node.children.push(child)
    }
  }

  // 최상위 카테고리 = 깊이 1의 README. 폴더 번호 순으로 정렬
  const tree = Object.values(byUrl).filter(
    (n) => n.url !== '/' && n.url.split('/').length === 2 && n.mdPath.endsWith('README.md'),
  )
  tree.sort((a, b) => a.mdPath.localeCompare(b.mdPath, 'en', { numeric: true }))

  // 평탄화. 순환이 생겨도 멈추도록 방문 집합을 둔다
  const flat: DocNode[] = []
  const seen = new Set<string>()
  const walk = (nodes: DocNode[]) => {
    for (const n of nodes) {
      if (seen.has(n.url)) continue
      seen.add(n.url)
      flat.push(n)
      walk(n.children)
    }
  }
  walk(tree)

  return { tree, flat, byUrl }
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs exec vitest run src/manifest.test.ts`
Expected: PASS

`최상위 카테고리가 5개다` 가 실패하면 순서가 `mdPath` 사전순(`1-`, `2-`, `3-`, `4-`, `5-`)과 다른 것입니다. 실제 폴더명을 확인하고 기대값을 실제에 맞춥니다 — **구현이 아니라 기대값을 고칩니다.**

- [ ] **Step 5: `nextjs-docs/src/index.ts` 작성**

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import type { DocsManifest } from './manifest'

export type { DocNode, DocsManifest } from './manifest'
export { buildManifest, parseDocLinks } from './manifest'
export { docPathToUrl, stripOrderPrefix, RESERVED_SEGMENTS } from './url'

export const DOCS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** build 태스크가 만들어둔 매니페스트를 읽는다. 셸이 쓰는 진입점. */
export function loadManifest(): DocsManifest {
  return JSON.parse(readFileSync(join(DOCS_ROOT, 'docs-manifest.json'), 'utf8'))
}
```

- [ ] **Step 6: `nextjs-docs/scripts/build-manifest.mjs` 작성**

```js
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildManifest } from '../src/manifest.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = buildManifest(root)

writeFileSync(join(root, 'docs-manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`[@study/docs] 문서 ${manifest.flat.length}건 → docs-manifest.json`)
```

- [ ] **Step 7: `nextjs-docs/scripts/lint-urls.mjs` 작성**

[05. A-6](../05-open-questions.md)이 물었던 "lint를 어느 패키지에 둘 것인가"의 답입니다 — **`@study/docs`의 `lint`에 둡니다.** 이 검사는 `nextjs-docs`만 보면 되고 `demos.yaml`이 필요 없기 때문입니다.

```js
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docPathToUrl, RESERVED_SEGMENTS } from '../src/url.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []

// ① 번호 제거 후 URL이 겹치는 md가 없는가
const seen = new Map()
const mdFiles = readdirSync(root, { recursive: true })
  .map(String)
  .map((f) => f.replaceAll('\\', '/'))
  .filter((f) => f.endsWith('.md'))

for (const mdPath of mdFiles) {
  const url = docPathToUrl(mdPath)
  if (!url) continue
  if (seen.has(url)) {
    errors.push(`URL 충돌 ${url}\n    ${seen.get(url)}\n    ${mdPath}`)
  }
  seen.set(url, mdPath)
}

// ② 카테고리 폴더가 예약 세그먼트를 쓰지 않는가
for (const url of seen.keys()) {
  const top = url.split('/')[1]
  if (RESERVED_SEGMENTS.includes(top)) {
    errors.push(`예약 세그먼트를 카테고리로 사용: ${url} (${RESERVED_SEGMENTS.join(', ')})`)
  }
}

if (errors.length) {
  console.error(`[@study/docs] lint 실패 ${errors.length}건\n  ` + errors.join('\n  '))
  process.exit(1)
}
console.log(`[@study/docs] lint 통과 — URL ${seen.size}건, 충돌 없음`)
```

- [ ] **Step 8: 두 스크립트 실행 확인**

Run: `pnpm --filter @study/docs run build`
Expected: `[@study/docs] 문서 283건 → docs-manifest.json` (수치는 다를 수 있음)

Run: `pnpm --filter @study/docs run lint`
Expected: `[@study/docs] lint 통과 — URL 283건, 충돌 없음`

> `.mjs`에서 `.ts`를 import하지 못하면 Node 버전이 낮은 것입니다. `node --experimental-strip-types` 를 붙이거나 `pnpm add -D tsx` 후 `tsx scripts/build-manifest.mjs`로 바꿉니다. **바꿨으면 `package.json`의 스크립트도 같이 고칩니다.**

- [ ] **Step 9: 커밋**

```bash
git add nextjs-docs
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 문서 목차 매니페스트와 URL lint 추가

- README의 번호 불릿 링크를 순서의 단일 원본으로 파싱 (섹션 제목에 의존하지 않음)
- tree / flat / byUrl 세 형태로 매니페스트 생성
- URL 충돌·예약 세그먼트 검사를 @study/docs의 lint에 배치 (05 A-6 해결)

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 셸 앱 생성과 디자인 토큰

**Files:**
- Create: `nextjs-app/apps/shell/**` (create-next-app 산출물)
- Modify: `nextjs-app/apps/shell/package.json`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- Create: `nextjs-app/apps/shell/AGENTS.md`, `CLAUDE.md`
- Delete: `nextjs-app/apps/shell/pnpm-workspace.yaml`

**Interfaces:**
- Consumes: Task 1의 catalog
- Produces: `localhost:3000`에서 뜨는 Next.js 앱. CSS 변수 `--background`/`--foreground`/`--muted`/`--border`/`--primary`/`--accent`/`--destructive` 와 폰트 변수 `--font-sans`/`--font-mono`.

- [ ] **Step 1: 앱 생성**

Run:
```bash
mkdir -p nextjs-app/apps
cd nextjs-app/apps
pnpm create next-app@16.3.1 shell \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm \
  --skip-install --disable-git --no-agents-md
```
Expected: `nextjs-app/apps/shell/` 생성. **`--turbopack`을 넣지 마세요** — 16.3.1에 없는 플래그이고 CLI가 조용히 무시합니다.

- [ ] **Step 2: 생성물을 워크스페이스에 맞게 정리**

Run:
```bash
rm -f nextjs-app/apps/shell/pnpm-workspace.yaml
```

이 파일을 남기면 **zone 디렉토리 안에서 실행한 pnpm 명령이 전부 실패합니다** (`ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`).

- [ ] **Step 3: `nextjs-app/apps/shell/package.json` 교체**

```json
{
  "name": "@study/shell",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "eslint",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "next": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "@study/docs": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "^5.7.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

`"packageManager"` 필드가 남아 있으면 **삭제**합니다 — 루트 선언과 두 벌이 됩니다. `devDependencies`의 정확한 버전은 create-next-app이 생성한 값을 유지하고, 위에 없는 항목이 있으면 그대로 둡니다.

- [ ] **Step 4: Pretendard 폰트 준비**

Run:
```bash
pnpm --filter @study/shell add -D pretendard
ls nextjs-app/apps/shell/node_modules/pretendard/dist/web/variable/woff2/
```
Expected: `PretendardVariable.woff2` 를 포함한 목록. **여기서 확인한 실제 파일명을 다음 단계에 씁니다.**

Run:
```bash
mkdir -p nextjs-app/apps/shell/src/app/fonts
cp nextjs-app/apps/shell/node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 \
   nextjs-app/apps/shell/src/app/fonts/
```

`node_modules`를 직접 참조하지 않고 복사하는 이유는 `next/font/local`이 빌드 산출물 추적에 넣을 실제 파일 경로를 요구하기 때문이고, 배포 환경에서 경로가 달라지는 것을 막기 위해서입니다.

- [ ] **Step 5: `nextjs-app/apps/shell/src/app/globals.css` 교체**

토큰 이름은 shadcn 규약 그대로입니다. **새 이름을 만들지 마세요.**

```css
@import "tailwindcss";
@source "../../../../packages/ui";
@source "../../../../packages/docs-render";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --font-sans: var(--font-pretendard);
  --font-mono: var(--font-jetbrains-mono);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

:root {
  --radius: 0.5rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.17 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.52 0 0);
  --border: oklch(0.92 0 0);
  --primary: oklch(0.17 0 0);
  --primary-foreground: oklch(0.99 0 0);
  --accent: oklch(0.82 0.13 85);
  --accent-foreground: oklch(0.17 0 0);
  --destructive: oklch(0.58 0.24 27);
}

.dark {
  --background: oklch(0.15 0 0);
  --foreground: oklch(0.97 0 0);
  --muted: oklch(0.22 0 0);
  --muted-foreground: oklch(0.66 0 0);
  --border: oklch(1 0 0 / 12%);
  --primary: oklch(0.93 0 0);
  --primary-foreground: oklch(0.17 0 0);
  --accent: oklch(0.78 0.13 85);
  --accent-foreground: oklch(0.15 0 0);
  --destructive: oklch(0.66 0.21 27);
}

@layer base {
  * { border-color: var(--color-border); }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
  }
  /* 한글 조판 — 기본값은 한글을 단어 중간에서 자른다 */
  :where(p, li, td, th, h1, h2, h3, h4, dd, dt) {
    word-break: keep-all;
    overflow-wrap: break-word;
  }
}
```

- [ ] **Step 6: `nextjs-app/apps/shell/src/app/layout.tsx` 교체**

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  weight: '45 920',
  variable: '--font-pretendard',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'nextjs docs 정독하기',
  description: 'Next.js App Router 공식 문서를 한국어 학습 순서로 다시 짠 커리큘럼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: `nextjs-app/apps/shell/next.config.ts` 작성**

```ts
import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // nextjs-docs의 md를 배포 산출물에 포함시키기 위해 tracing 기준을 워크스페이스 루트로.
  // 빠뜨리면 로컬은 정상인데 배포에서 문서가 통째로 사라진다.
  outputFileTracingRoot: path.join(__dirname, '../../../'),
  transpilePackages: ['@study/ui', '@study/docs-render', '@study/docs'],
}

export default nextConfig
```

- [ ] **Step 8: zone용 `AGENTS.md`와 `CLAUDE.md` 작성**

`nextjs-app/apps/shell/AGENTS.md`:

```markdown
# @study/shell (셸)

학습자의 모든 요청을 가장 먼저 받는 zone이다. 이 앱만이 `rewrites`를 소유한다.

- 담당: 학습 문서 렌더링, 예제 색인·독립 열람, 다른 zone으로의 rewrite
- 설정 축: 기본값 (`cacheComponents` 끔). 이 앱에서 설정을 켜지 않는다
- 포트: 3000 고정
- **여기에 데모를 두지 않는다.** 데모가 실패하면 사이트 전체가 넘어진다

규칙은 [nextjs-app/AGENTS.md](../../AGENTS.md), 화면은 [06](../../docs/06-ui-and-screen-design.md)를 따른다.
```

`nextjs-app/apps/shell/CLAUDE.md`:

```markdown
@AGENTS.md
```

> `pnpm dev`를 처음 돌리면 Next.js가 이 두 파일에 `<!-- BEGIN:nextjs-agent-rules -->` 블록을 삽입합니다. **정상 동작이고 마커 바깥 내용은 보존되므로 그대로 커밋합니다.**

- [ ] **Step 9: 실행 확인**

Run: `pnpm install && pnpm --filter @study/shell run dev`
Expected: `localhost:3000` 에서 create-next-app 기본 페이지가 뜬다. 브라우저에서 열어 **한글이 Pretendard로 보이는지** 확인한다 (개발자도구 → Computed → font-family에 `__pretendard`가 포함된 이름이 나와야 한다).

Run (별도 터미널): `pnpm --filter @study/shell run check-types`
Expected: 에러 없음

- [ ] **Step 10: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 셸 앱 생성 및 디자인 토큰 설정

- create-next-app으로 @study/shell 생성 후 워크스페이스에 맞게 정리
- 버전을 catalog 참조로 교체, dev 포트 3000 고정
- shadcn 규약(@theme inline + oklch) 토큰과 한글 조판 규칙 적용
- Pretendard(local) + JetBrains Mono(google) 폰트 연결
- outputFileTracingRoot를 워크스페이스 루트로 지정

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `@study/ui` 패키지와 shadcn 초기화

**Files:**
- Create: `nextjs-app/packages/ui/package.json`, `tsconfig.json`, `components.json`, `src/lib/utils.ts`, `src/styles/globals.css`
- Modify: `nextjs-app/apps/shell/package.json`

**Interfaces:**
- Consumes: Task 4의 토큰
- Produces:
  - `import { cn } from '@study/ui/lib/utils'`
  - `import { Button } from '@study/ui/components/button'`
  - 이후 모든 shadcn 컴포넌트가 `@study/ui/components/<name>` 로 import된다.

- [ ] **Step 1: `nextjs-app/packages/ui/package.json` 작성**

`imports`/`exports` 맵이 shadcn CLI가 경로를 푸는 근거입니다. 없으면 CLI가 파일을 엉뚱한 곳에 씁니다.

```json
{
  "name": "@study/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  },
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./components/*": "./src/components/*.tsx",
    "./layout/*": "./src/layout/*.tsx",
    "./nav/*": "./src/nav/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./hooks/*": "./src/hooks/*.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "lucide-react": "^1.32.0",
    "@study/docs": "workspace:*"
  },
  "peerDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "^5.7.0"
  }
}
```

`peerDependencies`만 두면 **패키지 자신을 타입체크할 때 react 타입이 해석되지 않습니다.** pnpm은 선언하지 않은 의존성을 올려주지 않기 때문에 `devDependencies`에도 함께 적습니다.

`@study/docs`는 **타입만 쓰지만 반드시 선언합니다.** Task 9의 `DocsTree`가 `DocNode`를 import하는데, pnpm은 선언하지 않은 워크스페이스 패키지를 해석하지 못합니다. `@study/docs-render`는 아직 존재하지 않으므로 **여기서 선언하면 `pnpm install`이 실패합니다** — Task 10에서 `PageToc`가 `TocItem`을 쓸 때 추가합니다.

- [ ] **Step 2: `nextjs-app/packages/ui/tsconfig.json` 작성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

- [ ] **Step 3: `nextjs-app/packages/ui/components.json` 작성**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "#components",
    "ui": "#components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "#lib/utils"
  }
}
```

- [ ] **Step 4: `nextjs-app/packages/ui/src/styles/globals.css` 작성**

셸의 `globals.css`가 토큰의 원본이므로 여기는 **Tailwind가 이 패키지를 스캔할 때 쓰는 최소 파일**입니다.

```css
@import "tailwindcss";
@source "../";
```

- [ ] **Step 5: `nextjs-app/packages/ui/src/lib/utils.ts` 작성**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: 셸이 `@study/ui`를 의존하도록 수정**

`nextjs-app/apps/shell/package.json`의 `dependencies`에 한 줄 추가합니다.

```jsonc
{
  "dependencies": {
    "@study/ui": "workspace:*"
  }
}
```

Run: `pnpm install`
Expected: 성공

- [ ] **Step 7: shadcn 컴포넌트 설치**

Run:
```bash
cd nextjs-app/packages/ui
pnpm dlx shadcn@latest add button card badge scroll-area collapsible separator
```
Expected: `src/components/` 에 `button.tsx` 등이 생성됨

**`sidebar`를 설치하지 마세요.** `sidebar_state` 쿠키가 Global Constraints의 `study_` 접두사 규칙을 어깁니다.

CLI가 `@/components` 같은 경로로 파일을 쓰면 Step 3의 `components.json`이 적용되지 않은 것입니다. 그 폴더를 지우고 `components.json`이 `packages/ui` 안에 있는지 확인한 뒤 다시 실행합니다.

- [ ] **Step 8: `@source` 경로가 맞는지 눈으로 확인 — 이 계획에서 가장 조용히 실패하는 지점**

`nextjs-app/apps/shell/src/app/page.tsx` 를 임시로 교체합니다.

```tsx
import { Button } from '@study/ui/components/button'

export default function Home() {
  return (
    <main className="p-10">
      <Button>스타일 확인용 버튼</Button>
    </main>
  )
}
```

Run: `pnpm --filter @study/shell run dev`
Expected: 브라우저에서 **배경색·모서리·패딩이 적용된 버튼**이 보인다.

**스타일 없는 맨 텍스트로 보이면** Task 4 Step 5의 `@source "../../../../packages/ui"` 경로가 어긋난 것입니다. `src/app/globals.css` 기준으로 `../`는 `src/`, `../../`는 `shell/`, `../../../`는 `apps/`, `../../../../`가 `nextjs-app/`입니다. 빌드는 성공하고 화면도 뜨므로 **눈으로 확인하지 않으면 발견되지 않습니다.**

- [ ] **Step 9: 타입체크와 커밋**

Run: `pnpm check-types`
Expected: 모든 패키지 통과

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][add]: @study/ui 패키지와 shadcn 컴포넌트 도입

- imports/exports 맵과 components.json으로 shadcn CLI 경로 설정
- button/card/badge/scroll-area/collapsible/separator 설치
- 연습 문제는 네이티브 details를 유지 (JS 없이 동작)
- sidebar는 sidebar_state 쿠키가 네임스페이스 규칙을 어겨 제외
- Tailwind @source 경로가 실제로 동작하는지 화면으로 확인

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: `@study/docs-render` — md를 React로 바꾸기

**Files:**
- Create: `nextjs-app/packages/docs-render/package.json`, `tsconfig.json`, `vitest.config.ts`
- Create: `nextjs-app/packages/docs-render/src/render.tsx`, `src/render.test.ts`

**Interfaces:**
- Consumes: Task 5의 `@study/ui`
- Produces:
  - `renderMarkdown(markdown: string): Promise<{ content: React.ReactElement }>`
  - 표(GFM), 각주, `<details>` 원본 HTML을 통과시킨다.

- [ ] **Step 1: `nextjs-app/packages/docs-render/package.json` 작성**

```json
{
  "name": "@study/docs-render",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./render": "./src/render.tsx",
    "./toc": "./src/toc.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "unified": "^11.0.5",
    "remark-parse": "^11.0.0",
    "remark-gfm": "^4.0.0",
    "remark-rehype": "^11.1.2",
    "rehype-raw": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-react": "^8.0.0",
    "mdast-util-to-string": "^4.0.0",
    "unist-util-visit": "^5.0.0",
    "@types/hast": "^3.0.0",
    "@types/mdast": "^4.0.0"
  },
  "peerDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "@types/react": "catalog:",
    "typescript": "^5.7.0",
    "vitest": "^4.1.11"
  }
}
```

`rehype-raw`가 필요한 이유는 학습 문서의 연습 문제가 `<details><summary>` **원본 HTML**로 쓰여 있기 때문입니다. 이게 없으면 정답이 통째로 사라집니다.

- [ ] **Step 2: `tsconfig.json`과 `vitest.config.ts` 작성**

`tsconfig.json` — Task 5 Step 2와 동일한 내용을 씁니다.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: { include: ['src/**/*.test.ts'] },
})
```

- [ ] **Step 3: 실패하는 테스트 작성 — `src/render.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderMarkdown } from './render'

async function html(md: string) {
  const { content } = await renderMarkdown(md)
  return renderToStaticMarkup(content)
}

describe('renderMarkdown', () => {
  it('헤딩에 id를 붙인다', async () => {
    expect(await html('## 핵심 개념 및 설명')).toContain('id="핵심-개념-및-설명"')
  })

  it('GFM 표를 렌더한다', async () => {
    const out = await html('| 필드 | 의미 |\n|---|---|\n| `path` | 주소 |')
    expect(out).toContain('<table')
    expect(out).toContain('<code>path</code>')
  })

  it('원본 HTML인 details/summary를 살린다', async () => {
    const out = await html('<details><summary>정답 보기</summary>\n\n정답은 2번이다.\n\n</details>')
    expect(out).toContain('<details>')
    expect(out).toContain('정답 보기')
    expect(out).toContain('정답은 2번이다')
  })

  it('코드블록의 언어를 클래스로 남긴다', async () => {
    const out = await html('```ts\nconst a = 1\n```')
    expect(out).toContain('language-ts')
  })
})
```

- [ ] **Step 4: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run`
Expected: FAIL — `Failed to resolve import "./render"`

- [ ] **Step 5: `src/render.tsx` 구현**

```tsx
import { Fragment, type ReactElement } from 'react'
import * as prod from 'react/jsx-runtime'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeReact from 'rehype-react'

const jsxRuntime = { Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

export async function renderMarkdown(markdown: string): Promise<{ content: ReactElement }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    // allowDangerousHtml — nextjs-docs는 우리가 쓴 문서라 신뢰한다.
    // 외부 입력을 렌더하게 되면 rehype-sanitize를 넣어야 한다.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeReact, jsxRuntime)
    .process(markdown)

  return { content: file.result as ReactElement }
}
```

- [ ] **Step 6: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run`
Expected: PASS — 4개 모두 통과

`id="핵심-개념-및-설명"` 이 실패하면 `rehype-slug`의 한글 처리 결과가 다른 것입니다. **실제 출력값을 확인해 기대값을 그것으로 바꾸고**, Task 10의 목차가 같은 값을 쓰도록 맞춥니다.

- [ ] **Step 7: 커밋**

```bash
git add nextjs-app/packages/docs-render
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: md를 React로 변환하는 @study/docs-render 추가

- unified + remark-gfm + rehype-raw + rehype-slug 파이프라인
- 연습 문제의 details/summary 원본 HTML 보존
- 헤딩 id 자동 부여 (우측 목차 앵커의 근거)

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: 코드 하이라이팅

**Files:**
- Create: `nextjs-app/packages/docs-render/src/highlight.ts`
- Modify: `nextjs-app/packages/docs-render/src/render.tsx`, `package.json`, `src/render.test.ts`

**Interfaces:**
- Consumes: Task 6의 파이프라인
- Produces: `shikiOptions` — `@shikijs/rehype` 에 넘기는 설정. 코드블록이 `<pre class="shiki">`로 바뀌고 인라인 스타일로 색이 들어간다. **런타임 JS는 0**이다.

- [ ] **Step 1: 의존성 추가**

Run: `pnpm --filter @study/docs-render add shiki@^4.4.3 @shikijs/rehype@^4.4.3`

- [ ] **Step 2: 테스트에 케이스 추가 — `src/render.test.ts` 끝에 덧붙임**

```ts
describe('코드 하이라이팅', () => {
  it('shiki가 코드블록을 토큰으로 나눈다', async () => {
    const out = await html('```ts\nconst a = 1\n```')
    expect(out).toContain('class="shiki')
    expect(out).toContain('<span style="color:')
  })

  it('라이트/다크 두 테마를 함께 넣는다', async () => {
    const out = await html('```ts\nconst a = 1\n```')
    expect(out).toContain('--shiki-dark')
  })

  it('언어가 없는 코드블록도 깨지지 않는다', async () => {
    const out = await html('```\n그냥 텍스트\n```')
    expect(out).toContain('그냥 텍스트')
  })

  it('demo 코드펜스는 지금은 그냥 코드블록으로 남는다', async () => {
    const out = await html('```demo\npath: caching/use-cache-basic\n```')
    expect(out).toContain('caching/use-cache-basic')
  })
})
```

마지막 케이스는 **계획 3에서 링크 카드로 바뀔 자리**입니다. 지금은 깨지지 않는 것만 확인합니다.

- [ ] **Step 3: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run`
Expected: FAIL — `class="shiki` 를 찾지 못함

- [ ] **Step 4: `src/highlight.ts` 작성**

```ts
import type { RehypeShikiOptions } from '@shikijs/rehype'

export const shikiOptions: RehypeShikiOptions = {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false, // CSS 변수로 두 테마를 함께 내보낸다
  // 목록에 없는 언어(demo 등)를 만나도 던지지 않고 평문으로 처리
  fallbackLanguage: 'text',
}
```

- [ ] **Step 5: `src/render.tsx`에 연결**

import 두 줄을 추가하고,

```tsx
import rehypeShiki from '@shikijs/rehype'
import { shikiOptions } from './highlight'
```

`.use(rehypeSlug)` **다음**, `.use(rehypeReact, ...)` **앞**에 한 줄을 넣습니다.

```tsx
    .use(rehypeShiki, shikiOptions)
```

- [ ] **Step 6: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run`
Expected: PASS — 8개 모두 통과

- [ ] **Step 7: 두 테마용 CSS를 셸에 추가**

`nextjs-app/apps/shell/src/app/globals.css` 의 `@layer base` 블록 안에 덧붙입니다.

```css
  .shiki, .shiki span {
    color: var(--shiki-light);
    background-color: var(--shiki-light-bg);
  }
  .dark .shiki, .dark .shiki span {
    color: var(--shiki-dark);
    background-color: var(--shiki-dark-bg);
  }
  .shiki {
    padding: 1rem;
    border-radius: var(--radius-md);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.7;
  }
```

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: shiki 기반 코드 하이라이팅 추가

- @shikijs/rehype를 렌더 파이프라인에 연결 (빌드 타임, 런타임 JS 0)
- github-light / github-dark 두 테마를 CSS 변수로 함께 내보냄
- 모르는 언어는 fallbackLanguage로 평문 처리

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: `[...slug]` 문서 라우트와 3단 레이아웃 골격

**Files:**
- Create: `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`
- Create: `nextjs-app/packages/ui/src/layout/DocsShell.tsx`, `src/layout/SiteHeader.tsx`
- Modify: `nextjs-app/apps/shell/src/app/page.tsx`

**Interfaces:**
- Consumes: `loadManifest()` (Task 3), `renderMarkdown()` (Task 6)
- Produces:
  - `<DocsShell left={...} right={...}>{children}</DocsShell>` — 좌측/우측이 `undefined`면 그 칼럼을 그리지 않는다
  - `<SiteHeader />` — 로고 + `docs 카테고리` + `예제` 두 메뉴. 검색·테마는 계획 2에서 붙인다

- [ ] **Step 1: `SiteHeader.tsx` 작성**

```tsx
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-5">
        <Link href="/" className="font-bold tracking-tight">
          nextjs docs 정독하기
        </Link>
        <Link href="/#docs-categories" className="text-sm text-muted-foreground hover:text-foreground">
          docs 카테고리
        </Link>
        <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground">
          예제
        </Link>
        {/* 검색 트리거와 테마 토글은 계획 2에서 이 자리에 붙는다 */}
        <div className="ml-auto" />
      </div>
    </header>
  )
}
```

- [ ] **Step 2: `DocsShell.tsx` 작성**

06 §8-4의 치수와 브레이크포인트를 그대로 씁니다.

```tsx
import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'

export function DocsShell({
  left,
  right,
  children,
}: {
  left?: ReactNode
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-5">
        {left ? (
          <aside className="hidden w-[260px] shrink-0 py-8 md:block">
            <div className="sticky top-[5.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              {left}
            </div>
          </aside>
        ) : null}

        <main className="min-w-0 max-w-[740px] flex-1 py-8">{children}</main>

        {right ? (
          <aside className="hidden w-[220px] shrink-0 py-8 xl:block">
            <div className="sticky top-[5.5rem]">{right}</div>
          </aside>
        ) : null}
      </div>
    </>
  )
}
```

`md:block`(768px)과 `xl:block`(1280px)이 06 §8-4의 세 구간을 만듭니다. 좁은 화면의 서랍(`sheet`)은 계획 2에서 붙입니다.

- [ ] **Step 3: `[...slug]/page.tsx` 작성**

```tsx
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import { loadManifest, DOCS_ROOT } from '@study/docs'
import { renderMarkdown } from '@study/docs-render/render'
import { DocsShell } from '@study/ui/layout/DocsShell'

const manifest = loadManifest()

export function generateStaticParams() {
  return manifest.flat
    .filter((n) => n.url !== '/')
    .map((n) => ({ slug: n.url.slice(1).split('/') }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const node = manifest.byUrl['/' + slug.join('/')]
  return { title: node ? `${node.title} · nextjs docs 정독하기` : '문서를 찾을 수 없습니다' }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const node = manifest.byUrl['/' + slug.join('/')]
  if (!node) notFound()

  const markdown = await readFile(join(DOCS_ROOT, node.mdPath), 'utf8')
  const { content } = await renderMarkdown(markdown)

  return (
    <DocsShell left={<nav>좌측 트리 자리</nav>} right={<nav>목차 자리</nav>}>
      <article className="prose-docs">{content}</article>
    </DocsShell>
  )
}
```

`left`/`right`의 내용은 Task 9·10에서 채웁니다. **지금은 3단이 그려지는지만 봅니다.**

- [ ] **Step 4: 본문 타이포 스타일 추가**

`nextjs-app/apps/shell/src/app/globals.css` 의 `@layer base` **뒤에** 덧붙입니다. Tailwind Typography 플러그인을 쓰지 않는 이유는, 6개 섹션 구조가 고정돼 있어 필요한 규칙이 몇 줄뿐이고 플러그인의 기본값과 싸우는 비용이 더 크기 때문입니다.

```css
@layer components {
  .prose-docs { font-size: 1rem; line-height: 1.8; }
  .prose-docs > * + * { margin-top: 1rem; }
  .prose-docs h1 { font-size: 2rem; line-height: 1.3; font-weight: 800; letter-spacing: -0.02em; margin-top: 0; }
  .prose-docs h2 { font-size: 1.375rem; line-height: 1.4; font-weight: 700; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
  .prose-docs h3 { font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; }
  .prose-docs a { color: var(--color-foreground); text-decoration: underline; text-underline-offset: 3px; }
  .prose-docs ul, .prose-docs ol { padding-left: 1.25rem; }
  .prose-docs li { margin-top: 0.375rem; list-style: revert; }
  .prose-docs :not(pre) > code {
    font-family: var(--font-mono); font-size: 0.875em;
    background: var(--color-muted); padding: 0.125em 0.375em; border-radius: 0.25rem;
  }
  .prose-docs table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; display: block; overflow-x: auto; }
  .prose-docs th, .prose-docs td { border: 1px solid var(--color-border); padding: 0.5rem 0.75rem; text-align: left; }
  .prose-docs th { background: var(--color-muted); font-weight: 600; }
  .prose-docs blockquote { border-left: 3px solid var(--color-border); padding-left: 1rem; color: var(--color-muted-foreground); }
  .prose-docs img { max-width: 100%; height: auto; border-radius: var(--radius-md); }
  .prose-docs details { border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.75rem 1rem; }
  .prose-docs summary { cursor: pointer; font-weight: 600; }
}
```

- [ ] **Step 5: 루트 페이지를 임시 목록으로 교체**

랜딩은 계획 2에서 만듭니다. 지금은 문서로 들어가는 통로만 둡니다.

```tsx
import Link from 'next/link'
import { loadManifest } from '@study/docs'
import { DocsShell } from '@study/ui/layout/DocsShell'

export default function Home() {
  const { tree } = loadManifest()
  return (
    <DocsShell>
      <h1 className="text-2xl font-bold">nextjs docs 정독하기</h1>
      <p className="mt-2 text-muted-foreground">랜딩은 계획 2에서 만듭니다.</p>
      <ul id="docs-categories" className="mt-6 space-y-2">
        {tree.map((c) => (
          <li key={c.url}>
            <Link href={c.url} className="underline underline-offset-4">
              {c.title}
            </Link>
            <span className="ml-2 text-sm text-muted-foreground">문서 {c.children.length}편</span>
          </li>
        ))}
      </ul>
    </DocsShell>
  )
}
```

- [ ] **Step 6: 빌드와 화면 확인**

Run: `pnpm --filter @study/docs run build && pnpm --filter @study/shell run dev`
Expected: `localhost:3000` 에 카테고리 목록. 카테고리를 눌러 들어가면 **좌측 자리 · 본문 · 우측 자리** 3단이 보인다.

`localhost:3000/getting-started/caching` 을 직접 열어 본문·표·코드블록·연습 문제 접힘이 모두 그려지는지 확인합니다.

Run: `pnpm build`
Expected: 성공. 로그에 정적 생성된 페이지 수가 283 근처로 나온다.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: [...slug] 문서 라우트와 3단 레이아웃 골격

- generateStaticParams로 문서 전체 정적 생성
- DocsShell — 좌측/우측 슬롯을 옵션으로 두어 페이지 타입별 골격 하나로 처리
- 최소 헤더(로고 + 두 메뉴) 추가, 검색·테마는 계획 2
- prose-docs 본문 타이포 규칙 추가

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: 좌측 문서 트리

**Files:**
- Create: `nextjs-app/packages/ui/src/nav/DocsTree.tsx`
- Modify: `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`

**Interfaces:**
- Consumes: `DocsManifest['tree']` (Task 3), `DocsShell` (Task 8)
- Produces: `<DocsTree tree={tree} currentUrl={string} />` — 현재 문서가 속한 카테고리만 펼치고, 현재 항목을 강조한다.

- [ ] **Step 1: `DocsTree.tsx` 작성**

Server Component입니다. 접힘 상태를 서버에서 정하므로(현재 URL 기준) 클라이언트 상태가 필요 없습니다.

```tsx
import Link from 'next/link'
import type { DocNode } from '@study/docs'
import { cn } from '#lib/utils'

function isAncestor(node: DocNode, currentUrl: string): boolean {
  return currentUrl === node.url || currentUrl.startsWith(node.url + '/')
}

export function DocsTree({ tree, currentUrl }: { tree: DocNode[]; currentUrl: string }) {
  return (
    <nav aria-label="문서 목차" className="text-[0.8125rem] leading-[1.7]">
      <ul className="space-y-1">
        {tree.map((category) => {
          const open = isAncestor(category, currentUrl)
          return (
            <li key={category.url}>
              <Link
                href={category.url}
                className={cn(
                  'block rounded px-2 py-1 font-semibold hover:bg-muted',
                  currentUrl === category.url && 'text-foreground',
                  !open && 'text-muted-foreground',
                )}
              >
                {category.title}
              </Link>
              {open && category.children.length > 0 ? (
                <ul className="mt-1 space-y-0.5 border-l pl-2">
                  {category.children.map((child) => (
                    <TreeItem key={child.url} node={child} currentUrl={currentUrl} />
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function TreeItem({ node, currentUrl }: { node: DocNode; currentUrl: string }) {
  const active = currentUrl === node.url
  const open = isAncestor(node, currentUrl)
  return (
    <li>
      <Link
        href={node.url}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'block rounded px-2 py-1 hover:bg-muted',
          active ? 'bg-muted font-semibold text-foreground' : 'text-muted-foreground',
        )}
      >
        <span className="mr-1.5 font-mono text-[0.6875rem] opacity-60">{node.order}</span>
        {node.title}
      </Link>
      {open && node.children.length > 0 ? (
        <ul className="mt-0.5 space-y-0.5 border-l pl-2">
          {node.children.map((child) => (
            <TreeItem key={child.url} node={child} currentUrl={currentUrl} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
```

- [ ] **Step 2: 문서 페이지에 연결**

`[...slug]/page.tsx` 의 import에 한 줄 추가하고,

```tsx
import { DocsTree } from '@study/ui/nav/DocsTree'
```

`<DocsShell>` 의 `left` prop을 바꿉니다.

```tsx
    <DocsShell
      left={<DocsTree tree={manifest.tree} currentUrl={node.url} />}
      right={<nav>목차 자리</nav>}
    >
```

- [ ] **Step 3: 화면 확인**

Run: `pnpm --filter @study/shell run dev`
Expected: `localhost:3000/getting-started/caching` 에서
- 좌측에 5개 카테고리가 보이고
- `시작하기`만 펼쳐져 있고
- `캐싱과 재검증` 항목에 배경색이 들어가 있다

`localhost:3000/api-reference/functions/cacheLife` 로 이동하면 `API 레퍼런스`가 펼쳐지고 그 아래 `함수` 하위그룹까지 펼쳐져야 합니다.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 좌측 문서 트리 추가

- 현재 URL 기준으로 서버에서 펼침 상태를 정해 클라이언트 상태 없이 동작
- 학습 순서 번호를 항목 앞에 표시
- aria-current로 현재 문서 표시

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: 우측 페이지 목차

06 §3-5의 규칙 — **H2만 넣고 H3 이하는 넣지 않습니다.** 3번 섹션(핵심 개념)에만 H3가 몰려 있어 넣으면 목차가 한쪽으로 쏠립니다.

**Files:**
- Create: `nextjs-app/packages/docs-render/src/toc.ts`, `src/toc.test.ts`
- Create: `nextjs-app/packages/ui/src/nav/PageToc.tsx`
- Modify: `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`

**Interfaces:**
- Consumes: Task 6의 `rehype-slug` id 생성 규칙
- Produces:
  - `extractToc(markdown: string): TocItem[]` where `interface TocItem { id: string; text: string }`
  - `<PageToc items={TocItem[]} />`

- [ ] **Step 1: 실패하는 테스트 작성 — `src/toc.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { extractToc } from './toc'

const SAMPLE = [
  '# 캐싱과 재검증',
  '',
  '## 학습 목표',
  '내용',
  '',
  '## 핵심 개념 및 설명',
  '',
  '### use cache',
  '내용',
  '',
  '## 연습 문제',
  '',
  '## 챕터 요약',
].join('\n')

describe('extractToc', () => {
  it('H2만 뽑는다', () => {
    expect(extractToc(SAMPLE).map((i) => i.text)).toEqual([
      '학습 목표',
      '핵심 개념 및 설명',
      '연습 문제',
      '챕터 요약',
    ])
  })

  it('H1은 넣지 않는다', () => {
    expect(extractToc(SAMPLE).some((i) => i.text === '캐싱과 재검증')).toBe(false)
  })

  it('H3은 넣지 않는다', () => {
    expect(extractToc(SAMPLE).some((i) => i.text === 'use cache')).toBe(false)
  })

  it('본문 렌더의 헤딩 id와 같은 값을 만든다', () => {
    expect(extractToc('## 학습 목표')[0].id).toBe('학습-목표')
  })

  it('인라인 코드가 든 헤딩은 텍스트만 남긴다', () => {
    expect(extractToc('## `use cache` 지시자')[0].text).toBe('use cache 지시자')
  })

  it('헤딩이 없으면 빈 배열', () => {
    expect(extractToc('본문뿐입니다.')).toEqual([])
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run src/toc.test.ts`
Expected: FAIL — `Failed to resolve import "./toc"`

- [ ] **Step 3: `src/toc.ts` 구현**

id 생성을 `rehype-slug`와 **같은 라이브러리**(`github-slugger`)로 맞춥니다. 직접 만들면 본문 앵커와 어긋나 목차 링크가 죽습니다.

Run 먼저: `pnpm --filter @study/docs-render add github-slugger@^2.0.0`

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import GithubSlugger from 'github-slugger'

export interface TocItem {
  id: string
  text: string
}

/** 본문의 H2만 뽑는다. id는 rehype-slug와 같은 규칙으로 만든다. */
export function extractToc(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  visit(tree, 'heading', (node: { depth: number }) => {
    if (node.depth !== 2) return
    const text = toString(node)
    items.push({ id: slugger.slug(text), text })
  })

  return items
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run src/toc.test.ts`
Expected: PASS — 6개 모두 통과

- [ ] **Step 5: `@study/ui`가 `@study/docs-render`를 의존하도록 추가**

`nextjs-app/packages/ui/package.json` 의 `dependencies`에 한 줄 추가합니다. 타입만 쓰지만 pnpm이 해석하려면 선언이 필요합니다.

```jsonc
{
  "dependencies": {
    "@study/docs-render": "workspace:*"
  }
}
```

Run: `pnpm install`
Expected: 성공

- [ ] **Step 6: `PageToc.tsx` 작성**

```tsx
import type { TocItem } from '@study/docs-render/toc'

export function PageToc({ items, docUrl }: { items: TocItem[]; docUrl: string }) {
  return (
    <nav aria-label="이 페이지의 목차" className="text-[0.8125rem] leading-[1.9]">
      <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
        이 페이지
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="block text-muted-foreground hover:text-foreground">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t pt-3">
        {/* "이 문서의 예제"는 계획 3에서 이 자리에 붙는다 */}
        <a
          href={`https://github.com/JunYong/nextjs-ko-study-lab/blob/main/nextjs-docs${docUrl}`}
          className="block text-muted-foreground hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          GitHub 원문 ↗
        </a>
      </div>
    </nav>
  )
}
```

GitHub 링크의 저장소 주소는 실제 remote 주소로 바꿉니다 (`git remote get-url origin` 으로 확인). remote가 없으면 이 링크는 빼고 계획 2에서 추가합니다.

- [ ] **Step 7: 문서 페이지에 연결**

`[...slug]/page.tsx` 에 import 두 줄을 추가하고,

```tsx
import { extractToc } from '@study/docs-render/toc'
import { PageToc } from '@study/ui/nav/PageToc'
```

`renderMarkdown` 호출 뒤에 한 줄을 넣고,

```tsx
  const toc = extractToc(markdown)
```

`right` prop을 바꿉니다.

```tsx
      right={<PageToc items={toc} docUrl={'/' + node.mdPath} />}
```

- [ ] **Step 8: 화면 확인**

Run: `pnpm --filter @study/shell run dev`
Expected: 1280px 이상 창에서 `localhost:3000/getting-started/caching` 우측에 목차 5~6개. **항목을 클릭하면 해당 섹션으로 스크롤**되어야 합니다 — 안 되면 Task 6의 `rehype-slug` id와 `github-slugger` 결과가 다른 것이니 Step 1의 4번 케이스를 실제 값으로 맞춥니다.

창을 1279px 이하로 줄이면 우측 목차가 사라지고, 767px 이하에서는 좌측 트리도 사라져야 합니다.

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 우측 페이지 목차 추가

- H2만 추출 (H3 이하는 핵심 개념 섹션에 쏠려 균형이 깨짐)
- id 생성을 github-slugger로 통일해 본문 앵커와 일치시킴
- 1280px 미만에서 숨김

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: 브레드크럼 · 이전/다음 · 카테고리 홈

06 §3-1의 "md 1번 섹션을 브레드크럼으로 변환"과 §4의 카테고리 홈을 만듭니다.

**Files:**
- Create: `nextjs-app/packages/ui/src/nav/Breadcrumb.tsx`, `src/nav/PrevNext.tsx`
- Modify: `nextjs-app/apps/shell/src/app/[...slug]/page.tsx`
- Create: `nextjs-app/packages/docs-render/src/frontmatter.ts`, `src/frontmatter.test.ts`

**Interfaces:**
- Consumes: `DocsManifest['flat']` (Task 3)
- Produces:
  - `stripHeaderLinks(markdown: string): { officialUrl: string | null; body: string }` — md 1번 섹션(출처·상위 메뉴·전체 목차 링크 줄)을 본문에서 떼어낸다
  - `<Breadcrumb trail={Array<{ url: string; title: string }>} officialUrl={string | null} />`
  - `<PrevNext prev={DocNode | null} next={DocNode | null} />`

- [ ] **Step 1: 실패하는 테스트 작성 — `src/frontmatter.test.ts`**

실제 문서의 머리말은 다음 형태입니다 (`head -6 nextjs-docs/1-getting-started/caching.md` 로 확인 가능).

```
# Caching

- 공식 문서: [Caching](https://nextjs.org/docs/app/getting-started/caching)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)
```

`공식 출처`가 아니라 **`공식 문서`**입니다.

```ts
import { describe, expect, it } from 'vitest'
import { stripHeaderLinks } from './frontmatter'

const DOC = [
  '# Caching',
  '',
  '- 공식 문서: [Caching](https://nextjs.org/docs/app/getting-started/caching)',
  '- 상위 메뉴: [Getting Started](./README.md)',
  '- 전체 목차: [Next.js 학습 문서](../README.md)',
  '',
  '## 학습 목표',
  '',
  '내용이다.',
].join('\n')

describe('stripHeaderLinks', () => {
  it('공식 출처 URL을 뽑는다', () => {
    expect(stripHeaderLinks(DOC).officialUrl).toBe(
      'https://nextjs.org/docs/app/getting-started/caching',
    )
  })

  it('머리말 링크 줄을 본문에서 제거한다', () => {
    const { body } = stripHeaderLinks(DOC)
    expect(body).not.toContain('상위 메뉴')
    expect(body).not.toContain('전체 목차')
  })

  it('H1과 그 뒤 본문은 남긴다', () => {
    const { body } = stripHeaderLinks(DOC)
    expect(body).toContain('# Caching')
    expect(body).toContain('## 학습 목표')
    expect(body).toContain('내용이다.')
  })

  it('머리말이 없는 문서는 그대로 통과시킨다', () => {
    const plain = '# 제목\n\n본문뿐이다.'
    expect(stripHeaderLinks(plain)).toEqual({ officialUrl: null, body: plain })
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run src/frontmatter.test.ts`
Expected: FAIL — `Failed to resolve import "./frontmatter"`

- [ ] **Step 3: `src/frontmatter.ts` 구현**

```ts
const HEADER_LINE = /^-\s*(공식 문서|공식 출처|상위 메뉴|전체 목차)\s*:/
const OFFICIAL_URL = /^-\s*공식 (?:문서|출처)\s*:.*\((https?:\/\/[^)]+)\)/

/**
 * 학습 문서 1번 섹션(출처·상위 메뉴·전체 목차)을 본문에서 떼어낸다.
 * 이 정보는 브레드크럼과 원문 링크로 다시 그려지므로 본문에 두면 중복이다.
 */
export function stripHeaderLinks(markdown: string): {
  officialUrl: string | null
  body: string
} {
  const lines = markdown.split('\n')
  let officialUrl: string | null = null
  const kept: string[] = []

  for (const line of lines) {
    const m = OFFICIAL_URL.exec(line)
    if (m) officialUrl = m[1]
    if (HEADER_LINE.test(line)) continue
    kept.push(line)
  }

  if (officialUrl === null && kept.length === lines.length) {
    return { officialUrl: null, body: markdown }
  }
  // 머리말을 뺀 자리에 남은 빈 줄을 하나로 줄인다
  return { officialUrl, body: kept.join('\n').replace(/\n{3,}/g, '\n\n') }
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run src/frontmatter.test.ts`
Expected: PASS — 4개 모두 통과

- [ ] **Step 5: `Breadcrumb.tsx` 작성**

```tsx
import Link from 'next/link'

export function Breadcrumb({
  trail,
  officialUrl,
}: {
  trail: Array<{ url: string; title: string }>
  officialUrl: string | null
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted-foreground">
      {trail.map((crumb, i) => (
        <span key={crumb.url} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden>/</span> : null}
          <Link href={crumb.url} className="hover:text-foreground">
            {crumb.title}
          </Link>
        </span>
      ))}
      {officialUrl ? (
        <a
          href={officialUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto hover:text-foreground"
        >
          원문 ↗
        </a>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 6: `PrevNext.tsx` 작성**

```tsx
import Link from 'next/link'
import type { DocNode } from '@study/docs'

export function PrevNext({ prev, next }: { prev: DocNode | null; next: DocNode | null }) {
  if (!prev && !next) return null
  return (
    <nav className="mt-12 flex gap-3 border-t pt-6" aria-label="문서 이동">
      {prev ? (
        <Link href={prev.url} className="flex-1 rounded-md border p-3 hover:bg-muted">
          <span className="block text-xs text-muted-foreground">← 이전</span>
          <span className="mt-0.5 block text-sm font-medium">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link href={next.url} className="flex-1 rounded-md border p-3 text-right hover:bg-muted">
          <span className="block text-xs text-muted-foreground">다음 →</span>
          <span className="mt-0.5 block text-sm font-medium">{next.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
```

- [ ] **Step 7: 문서 페이지에 전부 연결**

`[...slug]/page.tsx` 의 `DocPage` 본문을 다음으로 교체합니다.

```tsx
export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const node = manifest.byUrl['/' + slug.join('/')]
  if (!node) notFound()

  const raw = await readFile(join(DOCS_ROOT, node.mdPath), 'utf8')
  const { officialUrl, body } = stripHeaderLinks(raw)
  const { content } = await renderMarkdown(body)
  const toc = extractToc(body)

  // 브레드크럼: URL 세그먼트를 하나씩 쌓아 매니페스트에서 제목을 찾는다
  const segments = node.url.split('/').filter(Boolean)
  const trail = segments
    .map((_, i) => '/' + segments.slice(0, i + 1).join('/'))
    .map((url) => manifest.byUrl[url])
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .map((n) => ({ url: n.url, title: n.title }))

  const index = manifest.flat.findIndex((n) => n.url === node.url)
  const prev = index > 0 ? manifest.flat[index - 1] : null
  const next = index >= 0 && index < manifest.flat.length - 1 ? manifest.flat[index + 1] : null

  return (
    <DocsShell
      left={<DocsTree tree={manifest.tree} currentUrl={node.url} />}
      right={node.children.length === 0 ? <PageToc items={toc} docUrl={'/' + node.mdPath} /> : undefined}
    >
      <Breadcrumb trail={trail} officialUrl={officialUrl} />
      <article className="prose-docs">{content}</article>
      <PrevNext prev={prev} next={next} />
    </DocsShell>
  )
}
```

`right`의 삼항이 **카테고리 홈(②)과 학습 문서(③)를 가릅니다** — 자식이 있으면 카테고리 홈이므로 우측 목차를 끕니다. 06 §1의 "②는 ③의 변형"이 이 한 줄입니다.

import 세 줄을 추가하는 것도 잊지 마세요.

```tsx
import { stripHeaderLinks } from '@study/docs-render/frontmatter'
import { Breadcrumb } from '@study/ui/nav/Breadcrumb'
import { PrevNext } from '@study/ui/nav/PrevNext'
```

- [ ] **Step 8: 화면 확인**

Run: `pnpm --filter @study/shell run dev`

| 확인할 것 | 주소 |
|---|---|
| 브레드크럼 `시작하기 / 캐싱과 재검증` + 우측 `원문 ↗` | `/getting-started/caching` |
| 본문 맨 위에 `공식 문서 / 상위 메뉴 / 전체 목차` 3줄이 **없다** | 〃 |
| 하단 이전/다음 카드 두 개 | 〃 |
| **우측 목차가 없다** (카테고리 홈) | `/getting-started` |
| 우측 목차가 있다 | `/api-reference/functions/cacheLife` |

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 브레드크럼·이전/다음·카테고리 홈 구분 추가

- md 1번 섹션(공식 문서·상위 메뉴·전체 목차)을 본문에서 떼어 브레드크럼으로 변환
- 학습 순서 평탄화 배열로 이전/다음 문서 연결
- 자식 유무로 카테고리 홈(우측 목차 없음)과 학습 문서를 가름

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: 문서 이미지 자산 서빙

`nextjs-docs/*/assets/*.webp`는 md의 상대 경로만으로는 브라우저에서 그려지지 않습니다. [03. 6-1](../03-composition-architecture.md)의 함정 목록에 있는 항목입니다.

**Files:**
- Create: `nextjs-app/apps/shell/src/app/docs-assets/[...path]/route.ts`
- Modify: `nextjs-app/packages/docs-render/src/render.tsx`, `src/render.test.ts`

**Interfaces:**
- Consumes: `DOCS_ROOT` (Task 3)
- Produces: 라우트 핸들러 `GET /docs-assets/<md 기준 경로>` 가 `nextjs-docs/` 아래 이미지를 스트리밍한다. 렌더 파이프라인이 `![](./assets/x.webp)` 를 `/docs-assets/<카테고리>/assets/x.webp` 로 다시 씁니다.

`public/`으로 복사하지 않는 이유는 291개 md와 함께 사는 자산을 빌드마다 복사하면 원본이 둘이 되고, 이 저장소의 "md는 단일 원본" 규칙과 어긋나기 때문입니다.

- [ ] **Step 1: 테스트에 케이스 추가 — `src/render.test.ts` 끝에 덧붙임**

```ts
describe('이미지 경로 재작성', () => {
  it('상대 경로 이미지를 /docs-assets 로 바꾼다', async () => {
    const { content } = await renderMarkdown('![설치 화면](./assets/installation-01.webp)', {
      docDir: '1-getting-started',
    })
    const out = renderToStaticMarkup(content)
    expect(out).toContain('src="/docs-assets/1-getting-started/assets/installation-01.webp"')
  })

  it('상위 경로 이미지도 정규화한다', async () => {
    const { content } = await renderMarkdown('![x](../1-getting-started/assets/a.webp)', {
      docDir: '2-guides',
    })
    expect(renderToStaticMarkup(content)).toContain('src="/docs-assets/1-getting-started/assets/a.webp"')
  })

  it('절대 URL 이미지는 건드리지 않는다', async () => {
    const { content } = await renderMarkdown('![x](https://example.com/a.png)', {
      docDir: '1-getting-started',
    })
    expect(renderToStaticMarkup(content)).toContain('src="https://example.com/a.png"')
  })

  it('docDir이 없으면 경로를 그대로 둔다', async () => {
    const { content } = await renderMarkdown('![x](./assets/a.webp)')
    expect(renderToStaticMarkup(content)).toContain('src="./assets/a.webp"')
  })
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run src/render.test.ts`
Expected: FAIL — `src="/docs-assets/..."` 를 찾지 못함

- [ ] **Step 3: `render.tsx`에 이미지 재작성 플러그인 추가**

파일 상단의 import에 두 줄을 추가하고,

```tsx
import { visit } from 'unist-util-visit'
import type { Root } from 'hast'
```

`renderMarkdown` 함수 **앞에** 플러그인을 정의합니다.

```tsx
/** md 기준 상대 이미지 경로를 셸의 /docs-assets 라우트로 다시 쓴다. */
function rehypeDocsAssets(options: { docDir?: string }) {
  return (tree: Root) => {
    const { docDir } = options
    if (!docDir) return
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return
      const src = node.properties?.src
      if (typeof src !== 'string') return
      if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return
      // docDir 기준으로 정규화. new URL의 pathname을 빌려 ../ 를 해소한다
      const resolved = new URL(src, `file:///${docDir}/`).pathname.replace(/^\//, '')
      node.properties.src = `/docs-assets/${resolved}`
    })
  }
}
```

시그니처와 파이프라인을 바꿉니다.

```tsx
export async function renderMarkdown(
  markdown: string,
  options: { docDir?: string } = {},
): Promise<{ content: ReactElement }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeDocsAssets, { docDir: options.docDir })
    .use(rehypeShiki, shikiOptions)
    .use(rehypeReact, jsxRuntime)
    .process(markdown)

  return { content: file.result as ReactElement }
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `pnpm --filter @study/docs-render exec vitest run`
Expected: PASS — 이전 케이스 포함 전부 통과

- [ ] **Step 5: 라우트 핸들러 작성 — `src/app/docs-assets/[...path]/route.ts`**

```ts
import { readFile } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'
import { DOCS_ROOT } from '@study/docs'

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const relative = normalize(path.join('/'))

  // 경로 탈출 차단 — nextjs-docs 밖의 파일을 읽지 못하게 한다
  if (relative.startsWith('..') || relative.includes('\0')) {
    return new Response('Not found', { status: 404 })
  }

  const ext = extname(relative).toLowerCase()
  const contentType = MIME[ext]
  if (!contentType) return new Response('Not found', { status: 404 })

  try {
    const bytes = await readFile(join(DOCS_ROOT, relative))
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
```

- [ ] **Step 6: 문서 페이지에서 `docDir` 넘기기**

`[...slug]/page.tsx` 의 `renderMarkdown` 호출을 바꿉니다.

```tsx
  const docDir = node.mdPath.slice(0, node.mdPath.lastIndexOf('/')) || '.'
  const { content } = await renderMarkdown(body, { docDir })
```

- [ ] **Step 7: 화면 확인**

이미지가 있는 문서를 찾아 엽니다.

Run: `grep -rl '!\[' nextjs-docs/1-getting-started/*.md | head -3`

그중 하나를 브라우저에서 열어 **이미지가 실제로 보이는지** 확인합니다. 깨진 이미지 아이콘이 보이면 개발자도구 Network에서 `/docs-assets/...` 요청의 상태 코드를 확인합니다.

경로 탈출 차단도 확인합니다.

Run: `curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/docs-assets/../../package.json"`
Expected: `404`

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][feat]: 문서 이미지 자산 서빙 추가

- md 상대 경로 이미지를 /docs-assets 라우트로 재작성하는 rehype 플러그인
- nextjs-docs 아래 이미지를 스트리밍하는 라우트 핸들러 (경로 탈출 차단)
- public/으로 복사하지 않아 md 단일 원본 규칙 유지

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: E2E 스모크 테스트

**Files:**
- Create: `nextjs-app/apps/shell/playwright.config.ts`, `nextjs-app/apps/shell/e2e/docs-page.spec.ts`
- Modify: `nextjs-app/apps/shell/package.json`, `.gitignore`

**Interfaces:**
- Consumes: Task 8~12의 완성된 페이지
- Produces: `pnpm --filter @study/shell run test:e2e` 로 도는 스모크. 06 §10의 성립 조건 중 화면으로 확인 가능한 것을 자동화한다.

- [ ] **Step 1: Playwright 설치**

Run:
```bash
pnpm --filter @study/shell add -D @playwright/test
pnpm --filter @study/shell exec playwright install chromium
```

- [ ] **Step 2: `playwright.config.ts` 작성**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
```

- [ ] **Step 3: `e2e/docs-page.spec.ts` 작성**

```ts
import { expect, test } from '@playwright/test'

const DOC = '/getting-started/caching'

test.describe('학습 문서 페이지', () => {
  test('3단 레이아웃이 그려진다', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(DOC)
    await expect(page.getByRole('navigation', { name: '문서 목차' })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('navigation', { name: '이 페이지의 목차' })).toBeVisible()
  })

  test('좌측 트리가 현재 문서를 표시한다', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(DOC)
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1)
  })

  test('목차 링크가 본문 앵커와 이어진다', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(DOC)
    const toc = page.getByRole('navigation', { name: '이 페이지의 목차' })
    const first = toc.getByRole('link').first()
    const href = await first.getAttribute('href')
    expect(href).toMatch(/^#/)
    await expect(page.locator(href!)).toHaveCount(1)
  })

  test('문서 페이지에 iframe이 하나도 없다', async ({ page }) => {
    await page.goto(DOC)
    await expect(page.locator('iframe')).toHaveCount(0)
  })

  test('머리말 링크 3줄이 본문에 남아 있지 않다', async ({ page }) => {
    await page.goto(DOC)
    await expect(page.getByRole('main')).not.toContainText('전체 목차:')
    await expect(page.getByRole('main')).not.toContainText('상위 메뉴:')
  })

  test('이전/다음으로 이동할 수 있다', async ({ page }) => {
    await page.goto(DOC)
    const next = page.getByRole('navigation', { name: '문서 이동' }).getByRole('link').last()
    await next.click()
    await expect(page).not.toHaveURL(new RegExp(`${DOC}$`))
  })

  test('카테고리 홈에는 우측 목차가 없다', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/getting-started')
    await expect(page.getByRole('navigation', { name: '이 페이지의 목차' })).toHaveCount(0)
  })

  test('좁은 화면에서 좌측 트리와 우측 목차가 숨는다', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 })
    await page.goto(DOC)
    await expect(page.getByRole('navigation', { name: '문서 목차' })).toBeHidden()
    await expect(page.getByRole('navigation', { name: '이 페이지의 목차' })).toBeHidden()
  })
})
```

- [ ] **Step 4: 스크립트와 gitignore 추가**

`nextjs-app/apps/shell/package.json` 의 `scripts`에 추가합니다.

```jsonc
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

`.gitignore` 에는 이미 `playwright-report/`, `test-results/` 가 있으므로 확인만 합니다.

Run: `grep -c "playwright-report\|test-results" .gitignore`
Expected: `2`

- [ ] **Step 5: 실행**

Run: `pnpm --filter @study/docs run build && pnpm --filter @study/shell run test:e2e`
Expected: 8개 모두 PASS

실패하는 테스트가 있으면 **테스트가 아니라 구현을 고칩니다.** 각 케이스는 06의 성립 조건을 그대로 옮긴 것입니다.

- [ ] **Step 6: 전체 검증**

Run: `pnpm install && pnpm lint && pnpm check-types && pnpm test && pnpm build`
Expected: 전부 성공

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
[<브랜치명>][test]: 문서 페이지 E2E 스모크 추가

- 06의 성립 조건 중 화면으로 확인 가능한 8건을 Playwright로 자동화
- 문서 페이지에 iframe이 없다는 것을 회귀 테스트로 고정
- 브레이크포인트별 좌측/우측 칼럼 노출 검증

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## 완료 판정

이 계획이 끝났다고 말하려면 아래가 전부 참이어야 합니다.

- [ ] `pnpm install`이 워크스페이스 루트에서 한 번에 끝난다
- [ ] `pnpm dev` 한 번으로 셸이 뜬다
- [ ] `localhost:3000/getting-started/caching`에서 좌측 트리 · 본문 · 우측 목차가 모두 보인다
- [ ] 본문의 표 · 코드 하이라이팅 · 연습 문제 접힘 · 이미지가 전부 그려진다
- [ ] 우측 목차 항목을 누르면 해당 섹션으로 이동한다
- [ ] 카테고리 홈에는 우측 목차가 없다
- [ ] 문서 페이지에 iframe이 **하나도 없다**
- [ ] 어느 `package.json`에도 `next` 버전 문자열이 직접 적혀 있지 않다
- [ ] `nextjs-docs`의 md를 고치면 `pnpm build` 결과에 반영된다 (turbo 캐시가 무효화된다)
- [ ] `pnpm lint && pnpm check-types && pnpm test && pnpm build`가 전부 통과한다
- [ ] `nextjs-app/` 아래에 md 사본이 하나도 없다

## 이 계획이 남기는 것

계획 2·3이 이어받는 지점입니다.

| 자리 | 지금 상태 | 누가 채우나 |
|---|---|---|
| `SiteHeader`의 우측 여백 | `<div className="ml-auto" />` | 계획 2 — 검색 트리거, 테마 토글, GitHub |
| `/` 루트 페이지 | 임시 카테고리 목록 | 계획 2 — 히어로 + 카테고리 그리드 + 예제 하이라이트 |
| 좁은 화면의 좌측 트리 | 그냥 숨김 | 계획 2 — `sheet` 서랍 |
| `PageToc` 하단 | GitHub 원문 링크만 | 계획 3 — "이 문서의 예제" |
| `demo` 코드펜스 | 평범한 코드블록으로 렌더 | 계획 3 — 링크 카드 |
| `/demo`, `/demo/…` | 없음 (404) | 계획 3 |
