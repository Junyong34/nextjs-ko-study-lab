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

`create-next-app`은 **독립 앱 하나**를 만드는 도구입니다. 모노레포에서 그대로 쓰면 세 가지가 어긋납니다.

1. **버전이 앱마다 박힙니다.** 생성된 `package.json`에 `"next": "16.3.1"`이 직접 들어갑니다. zone이 6개면 버전 선언이 6곳이 되고, 그 순간 [ADR 0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)가 지키려는 "기준 버전은 하나"가 깨집니다.
2. **자기 자리에서 설치를 시작합니다.** 워크스페이스 루트가 아니라 앱 폴더에 `node_modules`를 만들려 합니다.
3. **git 저장소를 새로 만들려 합니다.**

그래서 절차는 **"생성한 뒤 반드시 손보는 단계"**를 포함합니다. 3-3의 후처리 4가지가 그것이며, 하나라도 빠지면 모노레포로 동작하지 않습니다.

`create-next-app`의 전체 옵션은 이 저장소의 [3.6.1 create-next-app 문서](../../nextjs-docs/3-api-reference/3.6-cli/create-next-app.md)에 정리돼 있습니다.

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
  next: 16.3.1
  react: 19.2.8
  react-dom: 19.2.8
```

캐럿(`^`)을 쓰지 않는 이유는 [ADR 0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)에 있습니다.

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

**같은 커밋에서 함께 할 일**: `nextjs-docs/README.md`의 기준 버전을 `16.3.0` → `16.3.1`로 갱신합니다. 같은 README가 "버전이 올라가면 이 값을 갱신하고, 변경된 기능과 관련된 완료 문서를 재검토 대상으로 표시한다"고 규정하고 있으므로, 재검토 대상 표시도 이때 판단합니다. 16.3.0 → 16.3.1은 patch라 재검토 대상이 없을 가능성이 높지만, 확인 없이 넘어가지는 않습니다.

### 3-2. 디렉토리 자리 만들기

```
nextjs-app/
├─ apps/       # zone (실행되는 Next.js 앱)
└─ packages/   # zone들이 공유하는 코드
```

### 3-3. zone 하나 생성 — 반복 가능한 절차

셸이든 데모 앱이든 **똑같은 6단계**입니다. 아래는 셸 기준이고, 데모 앱은 3-3-7의 차이만 추가됩니다.

**① 생성**

```bash
cd nextjs-app/apps

pnpm create next-app@16.3.1 shell \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack --use-pnpm \
  --skip-install --disable-git --no-agents-md
```

플래그 선택 근거:

| 플래그 | 이유 |
|---|---|
| `--skip-install` | 설치는 마지막에 워크스페이스 루트에서 한 번만 (`pnpm install`) |
| `--disable-git` | 이미 git 저장소 안입니다 |
| `--no-agents-md` | 이 저장소는 디렉토리별 `AGENTS.md`를 직접 관리합니다. 생성기가 만든 일반 안내문과 섞이면 규칙이 두 벌이 됩니다 |
| `--src-dir` | zone마다 설정 파일(`next.config.ts`, `.env.local`, `AGENTS.md`)이 여러 개 붙으므로 앱 코드와 분리합니다 |
| `--turbopack` | 16의 기본값이지만 `package.json`에 명시적으로 남깁니다 |

**② 이름을 워크스페이스 규칙에 맞춤** — `package.json`의 `name`을 `@study/shell`로.

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

**⑦ 데모 앱만 추가로**: `assetPrefix` 설정과 라우트를 `src/app/demo/{슬러그}/` 아래에 두는 규칙. **폴더명에 쓰는 슬러그는 앱 이름과 다른 값**입니다 (`demo-cache-components` 앱의 슬러그는 `cache`). 상세는 [03. 결합 구조 설계 2절](./03-composition-architecture.md).

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
   - `next.config.ts`에 `transpilePackages: ['@study/ui', '@study/docs-render']` 명시 (Next.js / Turbopack이 소스코드를 직접 트랜스파일 및 HMR)
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
3. 셸 도메인에서 문서 → 데모 이동, 데모 화면의 CSS·JS 로딩, 문서 안 인라인 데모 표시를 확인
4. 확인이 끝나면 다시 로컬 중심으로 진행. zone을 추가할 때만 이 절차를 반복

## 4. zone 추가 체크리스트

zone을 하나 늘릴 때마다 손대야 하는 곳입니다. **하나라도 빠지면 그 zone은 사이트에서 보이지 않습니다.**

> zone에는 **앱 이름**(`demo-cache-components`)과 **슬러그**(`cache`) 두 이름이 있고 서로 대체할 수 없습니다. 어느 자리에 무엇이 들어가는지는 [03. 결합 구조 설계 2절](./03-composition-architecture.md)의 표를 보세요.

- [ ] `nextjs-app/apps/{앱이름}/` 생성 (3-3의 ①~⑦)
- [ ] `package.json` 이름 `@study/{앱이름}`, 의존성 `catalog:`, dev 포트 고정, `check-types` 스크립트
- [ ] `next.config.ts`에 `assetPrefix: '/demo-static/{슬러그}'` 설정 및 공유 패키지 사용 시 `transpilePackages` 명시
- [ ] 라우트를 `src/app/demo/{슬러그}/` 아래에 배치
- [ ] **셸의 `next.config.ts`에 rewrites 2줄 추가** — 페이지 경로 + 정적 자산 경로. **정적 자산은 접두사를 벗기지 말고 그대로 통과**시킵니다
- [ ] **셸의 `.env.local`에 `ZONE_{슬러그 대문자}_URL` 추가**
- [ ] 해당 학습 문서에 데모 지시자 삽입
- [ ] (배포 시) Vercel 프로젝트 생성 + 셸 프로젝트에 환경변수 추가

## 5. 완료 판정

이 절차가 끝났다고 말하려면 아래가 전부 참이어야 합니다.

- `pnpm install`이 워크스페이스 루트에서 한 번에 끝난다
- `pnpm dev` 한 번으로 모든 zone이 뜬다
- `localhost:3000`에서 문서가 보이고, 문서 안 인라인 데모가 동작한다
- `nextjs-docs`의 md를 고치면 `pnpm build` 결과에 반영된다 (캐시가 무효화된다)
- 어느 `package.json`에도 `next` 버전 문자열이 직접 적혀 있지 않다
