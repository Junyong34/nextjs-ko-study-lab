# 01. 프로젝트 구성 방법 및 절차

- 상위: [nextjs-app 작업 규칙](../AGENTS.md)
- 관련 결정: [ADR 0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)
- 이 문서의 범위: 워크스페이스 뼈대부터 zone 하나를 추가하는 반복 절차, 로컬 실행, 첫 배포 검증까지

이 문서는 **아직 실행되지 않은 절차**입니다. Phase 2 착수 시 이 순서대로 만듭니다.

## 1. 사전 요구사항

| 항목 | 요구 | 현재 로컬 (확인일 2026-08-18) |
|---|---|---|
| Node.js | `>=20.9.0` (`next@16.3.1`의 engines) | 22.14.0 ✅ |
| pnpm | 9.5 이상 (catalog 지원) | 10.33.0 ✅ |
| Turborepo | 2.x | 미설치 — 워크스페이스 devDependency로 설치 |

전역 설치는 하지 않습니다. `packageManager` 필드와 corepack이 버전을 고정합니다.

## 2. 왜 `create-next-app`을 그대로 쓰지 않는가

`create-next-app`은 **독립 앱 하나**를 만드는 도구입니다. 모노레포에서 그대로 쓰면 네 가지가 어긋납니다.

1. **버전이 앱마다 박힙니다.** 생성된 `package.json`에 `"next": "16.3.1"`이 직접 들어갑니다. zone이 6개면 버전 선언이 6곳이 되고, 그 순간 [ADR 0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)가 지키려는 "기준 버전은 하나"가 깨집니다.
2. **자기 자리에서 설치를 시작합니다.** 워크스페이스 루트가 아니라 앱 폴더에 `node_modules`를 만들려 합니다.
3. **git 저장소를 새로 만들려 합니다.**
4. **`--use-pnpm`이 앱 폴더에 워크스페이스 선언을 남깁니다.** 생성물에 `pnpm-workspace.yaml`(`ignoredBuiltDependencies`)과 `"packageManager"` 필드가 함께 들어갑니다. 루트에서 `pnpm install`을 돌릴 때는 문제가 없지만, **zone 디렉토리 안에서 pnpm 명령을 실행하면** pnpm이 그 폴더를 워크스페이스 루트로 착각해 `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`으로 실패합니다 ([04. 검증 §15-b](./04-feasibility-verification.md)).

그래서 절차는 **"생성한 뒤 반드시 손보는 단계"**를 포함합니다. 3-3의 ②~⑥이 그것이며, 하나라도 빠지면 모노레포로 동작하지 않습니다.

`create-next-app`의 전체 옵션은 이 저장소의 [3.6.1 create-next-app 문서](../../nextjs-docs/3-api-reference/3.6-cli/create-next-app.md)에 정리돼 있습니다.

> **그 문서의 `--turbopack`·`--webpack` 행은 실제 CLI와 다릅니다.** nextjs.org의 해당 페이지에는 두 플래그가 실려 있지만, `npx create-next-app@16.3.1 --help`의 실제 목록에는 없습니다(번들러 플래그는 `--rspack`뿐). 학습 문서는 공식 페이지를 옮긴 것이므로 그대로 두고, **절차에서는 실측을 따릅니다** ([04. 검증 §9](./04-feasibility-verification.md)).

## 3. 절차

### 3-1. 워크스페이스 루트 구성

저장소 루트에 세 파일을 만듭니다. 이 커밋에서 `nextjs-docs`의 기준 버전도 함께 올립니다.

**`package.json`** (루트, private)

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
    "check-types": "turbo check-types"
  },
  "devDependencies": { "turbo": "^2.10.10" }
}
```

**`pnpm-workspace.yaml`** — 기준 버전이 선언되는 **유일한 곳**입니다.

```yaml
packages:
  - nextjs-docs
  - nextjs-app/apps/*
  - nextjs-app/packages/*

catalog:
  # 기준 버전 — 캐럿 없이 정확 고정
  next: 16.3.1
  react: 19.2.8
  react-dom: 19.2.8
  # 부수 의존성 — 3-4의 packages/*가 참조하므로 여기 없으면 install이 실패한다
  '@types/react': ^19.2.0
  '@types/react-dom': ^19.2.0
```

**기준 버전 3종에만 캐럿(`^`)을 쓰지 않습니다.** 정확 고정의 목적은 설치 재현성이 아니라 "문서 기준 버전 = 앱 버전"이라는 문서 정합성이므로, 그 계약에 속하지 않는 타입 패키지까지 정확 고정할 이유는 없습니다 ([ADR 0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)).

`@types/*`를 빠뜨리면 3-4의 `packages/ui`가 `"@types/react": "catalog:"`를 참조하는 순간 **워크스페이스 전체의 `pnpm install`이 실패합니다** — `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC`. 5절 완료 판정의 첫 항목이 곧바로 거짓이 되므로 여기서 함께 선언합니다 ([04. 검증 §11](./04-feasibility-verification.md)).

**`nextjs-docs/package.json`** — 문서를 워크스페이스 패키지로 편입합니다.

```json
{
  "name": "@study/docs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "node scripts/build-manifest.mjs"
  }
}
```

여기서 `build`는 291개 md를 훑어 **문서 매니페스트**(목차 트리 + 각 문서의 데모 지시자 목록)를 만듭니다. 이 태스크가 있어야 하는 이유는 3-4에서 설명합니다.

**기준 버전은 이미 `16.3.1`로 맞춰져 있습니다.** `nextjs-docs/README.md`의 값을 `16.3.0` → `16.3.1`로 갱신하는 일은 [04. 검증](./04-feasibility-verification.md)과 함께 끝났고, 같은 README가 요구하는 "완료 문서 재검토 대상 표시"도 판단이 끝났습니다 — patch 릴리스이고 재검토를 요구하는 API 변경이 없어 **대상 없음**입니다. 따라서 이 커밋에서는 catalog에 같은 값(`16.3.1`)을 적기만 하면 됩니다.

이후 기준 버전을 올릴 때는 **`pnpm-workspace.yaml`의 catalog와 `nextjs-docs/README.md`를 반드시 같은 커밋에서** 함께 고칩니다. 둘이 갈라지는 순간 [CONTEXT-MAP](../../CONTEXT-MAP.md)이 규정한 "학습 문서의 근거 버전 = 모든 zone이 설치하는 버전"이 깨집니다.

### 3-2. 디렉토리 자리 만들기

```
nextjs-app/
├─ apps/       # zone (실행되는 Next.js 앱)
└─ packages/   # zone들이 공유하는 코드
```

### 3-3. zone 하나 생성 — 반복 가능한 절차

셸이든 데모 앱이든 **똑같은 6단계**입니다. 아래는 셸 기준이고, 데모 앱은 3-3-7의 차이만 추가됩니다.

> **예외 하나**: `demo-export`(`output: 'export'`)는 산출물이 `out/` 정적 파일이고 서버가 없어 `next start` 대상이 아닙니다. ④의 `"start": "next start --port 3004"`가 이 zone에서만 성립하지 않으며, 로컬에서 셸의 rewrite 목적지를 살리려면 별도 정적 서버가 필요합니다. 나머지 단계는 동일합니다 ([04. 검증 §15-c](./04-feasibility-verification.md)).

**① 생성**

```bash
cd nextjs-app/apps

pnpm create next-app@16.3.1 shell \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm \
  --skip-install --disable-git --no-agents-md
```

플래그 선택 근거:

| 플래그 | 이유 |
|---|---|
| `--skip-install` | 설치는 마지막에 워크스페이스 루트에서 한 번만 (`pnpm install`) |
| `--disable-git` | 이미 git 저장소 안입니다 |
| `--no-agents-md` | 생성 시점에 `AGENTS.md`를 만들지 않습니다. 손으로 쓴 것만 두기 위해서입니다 — ⑥ 참고 |
| `--src-dir` | zone마다 설정 파일(`next.config.ts`, `.env.local`, `AGENTS.md`)이 여러 개 붙으므로 앱 코드와 분리합니다 |

> **`--turbopack`을 넘기지 마세요.** `create-next-app@16.3.1`에는 그런 플래그가 **없습니다.** 그런데 이 CLI는 모르는 플래그를 에러 없이 **조용히 무시**하므로, 넘겨도 실패하지 않고 생성물에도 아무 흔적이 남지 않습니다("명시적으로 남긴다"는 효과가 0). Turbopack은 16의 기본 번들러라 아무것도 안 해도 켜져 있고, [공식 v16 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-16)는 기존 스크립트에서 이 플래그를 **제거**하라고 권고합니다. 근거는 [04. 검증 §9](./04-feasibility-verification.md).

**② 생성물을 워크스페이스에 맞게 정리** — 세 가지를 손봅니다. (①에서 `nextjs-app/apps`에 있는 상태)

```bash
rm shell/pnpm-workspace.yaml   # 중첩 워크스페이스 선언 제거
```

- `package.json`의 `name`을 `@study/shell`로
- `package.json`의 `"packageManager"` 필드 **삭제** — 루트 선언과 두 벌이 됩니다
- 앱 폴더의 `pnpm-workspace.yaml` **삭제** — 남겨두면 zone 안에서 실행한 pnpm 명령이 전부 실패합니다 (2절 4번)

**③ 버전 선언을 catalog로 교체** — 이 단계를 빠뜨리면 모노레포의 의미가 없습니다.

```jsonc
{
  "dependencies": {
    "next": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

**④ 포트 고정** — rewrites 목적지가 항상 맞아야 하므로 dev 포트를 고정합니다.

```jsonc
{
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "check-types": "tsc --noEmit"
  }
}
```

`check-types`는 3-5의 turbo 태스크가 호출할 스크립트입니다. **모든 패키지에 같은 이름으로 있어야** `turbo check-types`가 워크스페이스 전체를 훑습니다 — 한 곳이라도 빠지면 그 패키지는 조용히 검사에서 제외됩니다.

포트 배정은 [03. 결합 구조 설계](./03-composition-architecture.md)의 zone 표를 따릅니다.

**⑤ `next.config.ts` 작성** — zone 종류에 따라 다릅니다. 내용은 [03. 결합 구조 설계](./03-composition-architecture.md)에 있습니다.

**⑥ zone용 `AGENTS.md`와 `CLAUDE.md` 작성** — 이 zone이 어느 설정 축을 담당하는지, 어떤 문서의 데모를 담는지 한 문단으로 적습니다. `CLAUDE.md`는 저장소 관례대로 `@AGENTS.md` 한 줄입니다.

> **`pnpm dev`를 처음 돌리면 이 파일들이 바뀝니다.** Next.js 16.3부터 `next dev`는 환경에서 AI 코딩 에이전트를 감지하면 zone 루트의 `AGENTS.md`·`CLAUDE.md`에 `<!-- BEGIN:nextjs-agent-rules -->` ~ `<!-- END:nextjs-agent-rules -->` 블록을 삽입합니다. 파일이 없으면 만들고, 있으면 그 블록만 갱신합니다. **마커 바깥에 쓴 내용은 보존되므로** ⑥에서 쓴 내용은 그대로 남습니다.
>
> 놀라지 말고 **그대로 커밋하세요.** 지워도 다음 `next dev`에서 되살아나 커밋되지 않은 변경으로 남을 뿐입니다. 블록의 내용은 "학습 데이터 대신 `node_modules/next/dist/docs/`의 버전 일치 문서를 읽어라"는 지시인데, 291개 문서가 한 버전을 근거로 쓰인 이 저장소에서는 오히려 도움이 됩니다 — 04 검증도 그 동봉 문서를 1차 출처로 썼습니다.
>
> 정말 원치 않으면 `next.config.ts`에 `agentRules: false`로 끌 수 있지만, 위 이유로 **켜두기를 권합니다** ([04. 검증 §15-a](./04-feasibility-verification.md)).

**⑦ 데모 앱만 추가로**: `assetPrefix` 설정과 라우트를 `src/app/zone/{슬러그}/` 아래에 두는 규칙. **폴더명에 쓰는 슬러그는 앱 이름과 다른 값**입니다 (`demo-cache-components` 앱의 슬러그는 `cache`). 밑줄을 붙여 `_zone`으로 만들면 App Router가 라우팅에서 제외하므로 안 됩니다. 상세는 [03. 결합 구조 설계 2·3절](./03-composition-architecture.md).

### 3-4. 공유 패키지(`packages/*`) 구성 — Internal Package 패턴

공유 컴포넌트(`packages/ui`)나 공통 렌더러(`packages/docs-render`)는 **별도의 번들링 빌드 단계(tsup/rollup 등) 없이 TypeScript 소스 그대로 export**하는 Internal Package 패턴을 사용합니다.

1. **`packages/ui/package.json`**:
   ```jsonc
   {
     "name": "@study/ui",
     "version": "0.0.0",
     "private": true,
     "exports": {
       "./*": "./src/*.tsx"
     },
     "scripts": {
       "check-types": "tsc --noEmit"
     },
     "peerDependencies": {
       "react": "catalog:",
       "react-dom": "catalog:"
     },
     "devDependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "@types/react": "catalog:"
     }
   }
   ```

   `peerDependencies`만 두면 소비하는 앱에서는 동작하지만 **패키지 자신을 타입체크하거나 편집할 때 react 타입이 해석되지 않습니다.** pnpm은 선언하지 않은 의존성을 `node_modules`에 올려주지 않기 때문입니다. `devDependencies`에도 함께 적습니다.
2. **소비하는 앱(`apps/shell`, `apps/demo-*`) 설정**:
   - `package.json`의 dependencies에 `"@study/ui": "workspace:*"` 추가
   - `next.config.ts`에 `transpilePackages: ['@study/ui', '@study/docs-render']` 명시
     - **필수는 아닙니다.** 16의 기본 번들러인 Turbopack은 App Router에서 워크스페이스 패키지의 TS 소스를 자동으로 트랜스파일합니다 ([04. 검증 §8](./04-feasibility-verification.md)). 그럼에도 명시하는 이유는 이 zone이 어떤 내부 패키지에 의존하는지가 `next.config.ts`만 봐도 드러나기 때문이고, 명시해도 무해합니다
3. **Tailwind CSS v4 스타일 스캔**:
   - Tailwind는 `node_modules` 아래를 기본 스캔에서 제외하므로, 공유 패키지의 클래스를 쓰려면 `@source`로 명시해야 합니다.
   - **`@source`의 경로는 그 지시자가 적힌 CSS 파일 기준 상대 경로입니다.** `--src-dir`로 만든 앱의 `globals.css`는 `apps/{앱이름}/src/app/globals.css`에 놓이므로 `packages/`까지는 네 단계를 올라갑니다:

     ```css
     @import "tailwindcss";
     @source "../../../../packages/ui";
     ```

     ```
     src/app/ ─┬─ ../          → src/
               ├─ ../../       → {앱이름}/
               ├─ ../../../    → apps/
               └─ ../../../../ → nextjs-app/   ← 여기서 packages/ui
     ```

   - 이 경로가 한 단계라도 어긋나면 **빌드는 성공하고 화면도 뜨지만 공유 컴포넌트의 Tailwind 클래스만 조용히 누락됩니다.** 원인을 찾기 어려운 종류의 실수라 첫 공유 컴포넌트를 붙일 때 반드시 눈으로 확인합니다.

### 3-4-1. `packages/demos` — 데모 목록 패키지

데모의 존재·주소·상태를 선언하는 단일 원본입니다 ([ADR 0004](./adr/0004-demo-list-as-source-of-truth.md)). 셸이 색인·문서 하단 목록·본문 링크 카드 검증에 쓰고, 생성기와 lint가 같은 파일을 읽습니다.

```
nextjs-app/packages/demos/
├─ demos.yaml            # 원본 — url · title · doc · zone · status
├─ src/index.ts          # 타입 + 로더
├─ scripts/
│  ├─ gen-stubs.mjs      # 목록에 있는데 없는 라우트를 만든다 (수동 실행)
│  └─ lint.mjs           # 목록 ↔ 라우트 ↔ 코드펜스 대조
└─ package.json          # build: 검증 + demos-manifest.json
```

**`build`는 검증과 매니페스트 생성만 합니다.** 스텁 라우트 생성은 turbo 태스크로 두지 않습니다 — 스텁은 커밋되는 실제 파일이고, 생성기가 **다른 패키지 안에** 파일을 써넣는 것은 turbo의 `outputs` 모델과 맞지 않습니다. `gen-stubs`는 사람이 데모를 시작할 때 돌리는 명령입니다.

셸이 `"@study/demos": "workspace:*"`를 선언하므로 `demos.yaml`을 고치면 `dependsOn: ["^build"]`를 타고 셸의 빌드 캐시가 무효화됩니다.

`lint`가 검사하는 것:

| 검사 | 어기면 |
|---|---|
| `url`이 전역에서 유일한가 | 두 데모가 같은 주소를 주장 |
| md 코드펜스의 `path`가 목록에 있는가 | 문서에 죽은 iframe |
| `status: done`인 데모의 진입점 라우트가 있는가 | 색인·문서에서 404 |
| `status: done`인 데모의 `doc`이 **md 상태 완료**인가 | 반쯤 쓰인 문서가 완성된 데모를 거느림 |
| 캐시 태그·`cacheLife` 프로파일에 데모 접두사가 붙었나 | 데모끼리 캐시를 지움 ([03. 6-6](./03-composition-architecture.md)) |

마지막 두 항목 때문에 `@study/demos`가 `@study/docs`에 의존합니다 — `PROGRESS.md`의 md 상태를 읽어야 하고, 색인 정렬에도 목차 트리가 필요합니다. **읽기만 하고 쓰지 않습니다** ([Context Map](../../CONTEXT-MAP.md)).

### 3-5. turbo 파이프라인

루트 `turbo.json`:

```jsonc
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "!.next/dev/**", "dist/**"],
      "env": ["ZONE_*_URL"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "inputs": ["$TURBO_DEFAULT$", ".env.local", ".env"]
    },
    "lint": {},
    "check-types": {
      "dependsOn": ["^check-types"]
    }
  }
}
```

**`dependsOn: ["^build"]`가 여기서 하는 진짜 일** — 셸의 `package.json`이 `"@study/docs": "workspace:*"`를 의존성으로 선언하면, 셸의 `build` 해시에 `@study/docs`의 `build` 태스크 해시가 들어갑니다. 그래서 **md를 고치면 셸의 빌드 캐시가 정확히 무효화**됩니다.

이게 `@study/docs`에 `build` 스크립트를 둔 이유입니다. 만약 `@study/docs`에 태스크가 하나도 없으면 `^build`가 아무것도 잡지 못하고, **md를 고쳐도 셸이 캐시된 옛 결과를 그대로 내놓습니다.** 문서를 매일 고치는 저장소에서 이건 조용히 사람을 잡는 버그입니다.

매니페스트 생성을 미루고 싶다면 임시로 루트 `turbo.json`에 `"globalDependencies": ["nextjs-docs/**/*.md"]`를 둘 수 있습니다. 정확하지만 거칠어서 — md 한 줄만 고쳐도 **모든 zone의 모든 캐시**가 날아갑니다. zone이 3개일 땐 견딜 만하고 6개가 되면 아플 겁니다.

### 3-6. 설치와 로컬 실행

```bash
pnpm install          # 워크스페이스 루트에서 한 번
pnpm dev              # turbo가 모든 zone의 dev 서버를 동시에 기동
```

`http://localhost:3000` 하나만 열면 됩니다. 나머지 포트는 셸이 뒤에서 부릅니다 — 학습자도, 개발자도 직접 열 일이 없습니다.

### 3-7. 첫 배포 검증 (셸 + 데모 앱 1개가 동작하는 시점)

로컬에서는 **절대 드러나지 않는** 문제들이 있어서, zone을 다 만들기 전에 한 번 배포 경로를 뚫습니다.

| 확인할 것 | 로컬에서 안 잡히는 이유 |
|---|---|
| `outputFileTracingRoot` 누락 → 산출물에 md 없음 | 로컬은 파일시스템을 직접 읽으니 항상 성공 |
| `assetPrefix` 실수 → CSS·JS 404 | 로컬은 zone별 포트가 달라 경로가 겹치지 않음 |
| `serverActions.allowedOrigins` 누락 → Server Action 거부 | 로컬은 origin이 `localhost`로 사실상 같음 |

절차:

1. Vercel에서 프로젝트 2개 생성. 각각 Root Directory를 `nextjs-app/apps/shell`, `nextjs-app/apps/demo-baseline`으로 지정
2. 셸 프로젝트 환경변수에 `ZONE_BASELINE_URL`을 데모 앱의 배포 도메인으로 설정
3. 셸 도메인에서 문서 → 데모 링크 이동, 독립 열람 iframe 표시, 데모 화면의 CSS·JS 로딩을 확인
4. 확인이 끝나면 다시 로컬 중심으로 진행. zone을 추가할 때만 이 절차를 반복

## 4. zone 추가 체크리스트

zone을 하나 늘릴 때마다 손대야 하는 곳입니다. **하나라도 빠지면 그 zone은 사이트에서 보이지 않습니다.**

> zone에는 **앱 이름**(`demo-cache-components`)과 **슬러그**(`cache`) 두 이름이 있고 서로 대체할 수 없습니다. 어느 자리에 무엇이 들어가는지는 [03. 결합 구조 설계 2절](./03-composition-architecture.md)의 표를 보세요.

- [ ] `nextjs-app/apps/{앱이름}/` 생성 (3-3의 ①~⑦). **`--turbopack`은 넘기지 않습니다**
- [ ] 생성물 정리 — 앱 폴더의 `pnpm-workspace.yaml` 삭제, `package.json`의 `packageManager` 필드 삭제
- [ ] `package.json` 이름 `@study/{앱이름}`, 의존성 `catalog:`, dev 포트 고정, `check-types` 스크립트
- [ ] `next.config.ts`에 `assetPrefix: '/demo-static/{슬러그}'` 설정 및 공유 패키지 사용 시 `transpilePackages` 명시
- [ ] 라우트를 `src/app/zone/{슬러그}/` 아래에 배치 (밑줄 `_zone` 금지 — 라우팅에서 제외됨)
- [ ] `not-found.tsx`에 iframe 안에서 읽힐 폴백 작성 ([03. 6-7](./03-composition-architecture.md))
- [ ] **셸의 `next.config.ts`에 rewrites 2줄 추가** — `/zone/{슬러그}/:path*` + `/demo-static/{슬러그}/:path*`. **정적 자산은 접두사를 벗기지 말고 그대로 통과**시킵니다
- [ ] **`assetPrefix`가 안 붙는 두 경로를 피했는지 확인** — 데모 앱에는 `public/`을 두지 않고, `next/image`는 `unoptimized` 또는 zone별 `images.path`를 지정합니다 ([03. 결합 구조 6-1](./03-composition-architecture.md))
- [ ] **셸의 `.env.local`에 `ZONE_{슬러그 대문자}_URL` 추가**
- [ ] (배포 시) Vercel 프로젝트 생성 + 셸 프로젝트에 환경변수 추가

## 4-1. 데모 추가 체크리스트

zone 추가는 드물고, **데모 추가가 일상 작업**입니다. 훨씬 짧습니다.

- [ ] `demos.yaml`에 항목 추가 — `url` · `title` · `doc` · `zone` · `status: stub`
  - `url`은 `{문서 파일명}/{데모명}`이 관습이지만, [중복 11건](./03-composition-architecture.md)에 해당하면 다른 이름을 줍니다
- [ ] `pnpm --filter @study/demos gen-stubs` — 진입점 라우트 생성
- [ ] 데모 내용 작성. `status: wip`
  - 캐시 태그·`cacheLife` 프로파일 이름에 **데모 접두사** ([03. 6-6](./03-composition-architecture.md))
  - 스토리지 키·쿠키에 `demo_{슬러그}_*` 접두사 ([03. 6-5](./03-composition-architecture.md))
  - 화면 하단에 **기대 / 실제** 표시 ([03. 4-8](./03-composition-architecture.md))
- [ ] 본문에서 가리킬 데모라면 md에 `demo` 코드펜스 삽입 (`path`, 필요하면 `caption`. `zone`·`mode`·`height` 없음)
- [ ] `pnpm --filter @study/demos lint` 통과
- [ ] `status: done`으로 전환 — **이때 `doc`의 md 상태가 완료여야 합니다**

`status`를 `done`으로 바꾸는 것이 곧 공개입니다. 그 전까지는 색인에도, 문서 하단 목록에도, 본문 링크 카드에도, 검색 결과에도 나타나지 않습니다.

## 5. 완료 판정

이 절차가 끝났다고 말하려면 아래가 전부 참이어야 합니다.

- `pnpm install`이 워크스페이스 루트에서 한 번에 끝난다
- `pnpm dev` 한 번으로 모든 zone이 뜬다
- `localhost:3000`에서 문서가 보이고, 문서의 데모 링크를 눌러 들어간 독립 열람 화면에서 데모가 동작한다
- `nextjs-docs`의 md를 고치면 `pnpm build` 결과에 반영된다 (캐시가 무효화된다)
- 어느 `package.json`에도 `next` 버전 문자열이 직접 적혀 있지 않다
