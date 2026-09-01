# 04. Vercel 배포 계획

Multi-Zones(셸 + zone 앱들)를 Vercel에 올리는 방법을 정합니다. "zone당 Vercel 프로젝트를 만든다는 것 외에는 열려 있던" 미해결 항목을 여기서 닫습니다. 1차 출처는 [Vercel 공식 모노레포 문서](https://vercel.com/docs/monorepos)와 [Turborepo 배포 가이드](https://vercel.com/docs/monorepos/turborepo)입니다.

**첫 배포 검증 완료**: 실제로 3개 프로젝트를 배포해 확인한 결과, §3-2의 Related Projects 자동 주입은 프로덕션 빌드에서 값이 채워지지 않았고(`withRelatedProject`가 `defaultHost` 폴백으로 떨어짐 → shell이 `localhost:3001`/`3002`로 rewrite를 시도해 `DNS_HOSTNAME_RESOLVED_PRIVATE` 404 발생), 대신 **각 프로젝트 Settings → Environment Variables(Production)에 `ZONE_BASELINE_URL`/`ZONE_CACHE_URL`/`PUBLIC_ORIGIN`을 실제 배포 URL로 직접 넣고 재배포**하는 방식으로 해결했습니다. 코드의 `withRelatedProject`는 그대로 둬도 무해합니다(Related Projects 값이 없으면 이 수동 env var가 `defaultHost`로 그대로 쓰이므로) — 다만 "환경변수 없이 자동 연결"이라는 원래 기대는 이번 검증에서 깨졌으므로, §3-2는 참고용으로 남기고 §8에 실측 결과를 반영합니다.

## 1. 배포 구성 원칙

**zone당 별도 Vercel 프로젝트를 만든다** (기존 결정 유지). Vercel 모노레포 지원의 기본 모델이 "리포지토리의 디렉토리 하나 = 프로젝트 하나 = 도메인 하나"이기 때문입니다.<sup>[1]</sup> 여러 프로젝트를 한 도메인 아래 경로로 묶는 것은 Vercel도 프록시(rewrites) 방식으로 처리하라고 명시하는데<sup>[2]</sup>, 이건 이미 셸의 `next.config.ts` rewrites로 구현되어 있습니다 — **추가로 할 일이 없습니다.**

현재 프로젝트 3개:

| Vercel 프로젝트 | Root Directory | 역할 |
|---|---|---|
| `study-shell` | `nextjs-app/apps/shell` | 문서 렌더링 + 라우팅, 커스텀 도메인 부착 대상 |
| `study-baseline` | `nextjs-app/apps/demo-baseline` | zone `baseline` |
| `study-cache` | `nextjs-app/apps/demo-cache-components` | zone `cache` |

zone을 추가하면 [05. zone 추가 체크리스트](./05-zone-onboarding-checklist.md#1-zone-추가-체크리스트)에 "Vercel 프로젝트 생성 + Root Directory 지정 + Related Projects 갱신(§3)"을 항목으로 더합니다.

## 2. 프로젝트별 빌드 설정

pnpm + Turborepo 조합은 Vercel이 Import 시 자동 감지하므로<sup>[3]</sup>, 아래 값은 **수동으로 바꿀 필요 없이 기본값을 그대로 씁니다.** 명시하는 이유는 대시보드에서 오검출됐을 때 대조하기 위해서입니다.

| 필드 | 값 | 비고 |
|---|---|---|
| Framework Preset | Next.js | 자동 감지 |
| Build Command | `turbo run build` | Root Directory에서 필터가 자동 추론됨<sup>[3]</sup> |
| Install Command | 자동 감지 (pnpm) | 루트 `package.json`의 `packageManager: "pnpm@10.33.0"` 참조 |
| Output Directory | 프레임워크 기본값 | `.next` |
| Ignored Build Step | `npx turbo-ignore --fallback=HEAD^1` | 기본값. §4 참고 |

**켜야 하는 옵션 하나**: Root Directory 설정 화면의 **"Include source files outside of the Root Directory in the Build Step"**. 각 앱의 Root Directory(`nextjs-app/apps/{앱}`) 밖에 있는 `nextjs-app/packages/*`와 `nextjs-docs/`를 참조하므로 필요합니다. 2020-08-27 이후 생성된 프로젝트는 기본 활성화지만<sup>[4]</sup> 확인 없이 넘어가지 않습니다. 참고로 셸의 `outputFileTracingRoot`는 이 문제의 부분집합(빌드 산출물의 md 추적)만 다루는 별개 설정입니다 — 둘 다 필요합니다.

## 3. 환경변수 배치 — C-3의 답: Related Projects

### 3-1. 왜 수동 `ZONE_*_URL`로는 안 되는가

C-3이 막힌 지점 그대로입니다: 프리뷰 배포마다 도메인이 바뀌므로(`study-baseline-git-feature-x.vercel.app` 형태) 프로젝트 환경변수에 값을 고정할 수 없습니다. 프로덕션 환경변수만 고정하면 프리뷰에서 셸이 다른 zone의 **프로덕션** 배포를 가리키게 되어, PR 미리보기가 그 PR의 변경을 반영 못 합니다.

### 3-2. 채택안: Vercel Related Projects

Related Projects는 프로젝트당 최대 3개까지 다른 프로젝트를 연결하고<sup>[5]</sup>, 매 배포마다 연결된 프로젝트들의 **그 환경에 맞는** URL(프리뷰면 프리뷰, 프로덕션이면 프로덕션)을 `VERCEL_RELATED_PROJECTS` 환경변수로 자동 주입합니다. 우리 구성은 정확히 프로젝트 3개라 상한에 딱 맞습니다.

**양방향으로 건다**: `ZONE_*_URL`(셸 → zone)뿐 아니라 `PUBLIC_ORIGIN`(zone → 셸, `serverActions.allowedOrigins`용)도 같은 문제입니다 — 셸의 프리뷰 도메인도 매번 바뀝니다. 이 두 문제가 같은 원인(프리뷰 도메인 비고정)이므로 한 가지 기능으로 같이 풉니다: **세 프로젝트가 서로를 `relatedProjects`로 건다.**

| 프로젝트 | `vercel.json`의 `relatedProjects` | 읽는 값 |
|---|---|---|
| `study-shell` | `[baseline projectId, cache projectId]` | `ZONE_BASELINE_URL`, `ZONE_CACHE_URL` 대체 |
| `study-baseline` | `[shell projectId]` | `PUBLIC_ORIGIN` 대체 |
| `study-cache` | `[shell projectId]` | `PUBLIC_ORIGIN` 대체 |

```json
// nextjs-app/apps/shell/vercel.json
{
  "relatedProjects": ["prj_baseline_xxx", "prj_cache_xxx"]
}
```

프로젝트 ID는 각 프로젝트 생성 **후** Settings에서 확인 가능합니다 — 순서상 먼저 프로젝트 3개를 `relatedProjects` 없이 만들고, ID를 모은 뒤 이 설정을 추가하는 2단계 순서가 필요합니다(닭-달걀 문제).

**완료**: 세 앱의 `next.config.ts`에 `@vercel/related-projects`의 `withRelatedProject`를 적용했습니다. `shell`은 `projectName: 'study-baseline'`/`'study-cache'`로 zone host를 조회하고, `demo-baseline`/`demo-cache-components`는 `projectName: 'study-shell'`로 `PUBLIC_ORIGIN`을 조회합니다. `defaultHost`는 기존과 동일하게 `.env.local`의 `ZONE_BASELINE_URL`/`ZONE_CACHE_URL`/`PUBLIC_ORIGIN`(스킴 제거 후)을 씁니다. **"목적지를 환경변수로 두는 것이 로컬↔배포 전환의 전부"라는 기존 원칙은 유지되고, 배포에서만 값의 출처가 수동 설정 → Related Projects 자동 주입으로 바뀝니다.**

⚠️ **미검증 항목** (§8에 재수록): README(`@vercel/related-projects`)의 예시가 스킴 없는 host를 반환/기대하는 것으로 보여 `shell` 쪽은 `process.env.VERCEL` 유무로 스킴(`http`/`https`)을 코드에서 직접 붙였습니다 — 실제 Vercel 배포에서 이 가정이 맞는지는 첫 배포에서 실측이 필요합니다.

### 3-3. Turborepo 캐시 정합성

`turbo.json`의 `build` 태스크는 이미 `"env": ["ZONE_*_URL", "PUBLIC_ORIGIN"]`를 선언해 두었습니다 — 이건 Vercel이 명시적으로 권장하는 패턴(빌드에 인라인되는 환경변수를 선언 안 하면 캐시가 스테이징 값을 프로덕션에 잘못 재사용할 수 있음)<sup>[6]</sup>과 정확히 일치합니다. Related Projects로 전환하면 `VERCEL_RELATED_PROJECTS`도 같은 목록에 추가해야 합니다 — Vercel 문서가 Turborepo Strict Mode에서 명시적으로 요구하는 항목입니다.<sup>[5]</sup>

```diff
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "!.next/dev/**", "dist/**"],
-   "env": ["ZONE_*_URL", "PUBLIC_ORIGIN"]
+   "env": ["ZONE_*_URL", "PUBLIC_ORIGIN", "VERCEL_RELATED_PROJECTS"]
  }
```

## 4. 빌드 스킵 (Ignored Build Step)

Vercel의 "영향 없는 프로젝트 자동 스킵"은 조건 3가지를 요구합니다<sup>[7]</sup>: (a) pnpm/yarn/npm/Bun workspace 정의 준수, (b) 워크스페이스 내 모든 패키지의 `name` 유일, (c) 패키지 간 의존이 각 `package.json`에 명시. 대조 결과:

| 조건 | 이 저장소 | 근거 |
|---|---|---|
| workspace 정의 | ✅ | `pnpm-workspace.yaml` |
| `name` 유일성 | ✅ | `@study/shell`, `@study/demos`, `@study/docs` 등 전부 스코프됨 |
| 명시적 의존 | ✅ | `shell/package.json`이 `@study/demos`·`@study/docs`·`@study/docs-render`·`@study/ui`를 `workspace:*`로 직접 선언 |

**세 조건 모두 충족 — 커스텀 Ignored Build Step 스크립트 없이 기본 자동 스킵만으로 충분합니다.** 예: `demo-cache-components`만 고친 커밋은 `study-shell`·`study-baseline` 빌드가 자동으로 스킵됩니다. 나중에 조건이 깨지면(예: 암묵적 의존 추가) `turbo query affected --base=$VERCEL_GIT_PREVIOUS_SHA --packages <프로젝트명> --exit-code`를 Ignored Build Step에 직접 넣는 대안이 있습니다.<sup>[3]</sup>

### 4-1. 브랜치별 자동 배포 제어 (`git.deploymentEnabled`)

위 Ignored Build Step은 "영향 없는 패키지의 빌드를 건너뛴다"는 것이고, "이 브랜치는 애초에 배포를 트리거하지 않는다"는 별개 문제입니다. 후자는 각 프로젝트의 `vercel.json`에 `git.deploymentEnabled`로 제어합니다.<sup>[10]</sup>

**정책**: `main`은 프로덕션 자동 배포를 유지하고, `preview/*` 브랜치만 Preview 자동 배포를 트리거하며, 그 외 모든 브랜치(이 저장소의 작업 브랜치 명명 규칙인 `devPark/*` 포함)는 자동 배포하지 않습니다. 매 작업 브랜치 커밋마다 3개 zone을 전부 Preview 배포할 필요가 없고, 확인이 필요할 때만 `preview/*`로 병합해 트리거하는 방식입니다.

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview/*": true,
      "**": false
    }
  }
}
```

세 프로젝트(`study-shell`, `study-baseline`, `study-cache`)의 `vercel.json` 전부에 동일하게 적용했습니다 (§3-2의 `relatedProjects`와 같은 파일).

**매칭 규칙(minimatch) 주의점**:
- 브랜치가 여러 규칙에 매칭되면 **하나라도 `true`면 배포됩니다.** `main`은 `main: true`와 `**: false`에 동시 매칭되지만 `true` 규칙이 있어 배포가 일어납니다.
- 단일 `*`는 `/`를 넘어 매칭하지 않는 표준 glob 동작입니다. `devPark/seo-technical-setup`처럼 슬래시를 포함한 브랜치명까지 차단하려면 globstar(`**`)가 필요합니다 — `*`만 썼다면 이런 브랜치는 "미지정 브랜치는 기본 `true`"에 걸려 그대로 자동 배포됐을 것입니다.

⚠️ **미검증**: `devPark/*`·`preview/*` 실제 브랜치에 커밋을 푸시해 각각 배포가 스킵/트리거되는지는 아직 실측하지 않았습니다. §8에 반영.

## 5. Turborepo 원격 캐시

Vercel에 호스팅되는 빌드는 **별도 연동 없이 자동으로 Vercel Remote Cache를 씁니다.**<sup>[8]</sup> 로컬 개발 속도를 위해 `pnpm dlx turbo login && pnpm dlx turbo link`를 저장소 루트에서 한 번 실행하면 로컬 빌드도 같은 캐시를 공유합니다 — 필수는 아니고 편의 옵션입니다.

## 6. 첫 배포 검증 절차

3-프로젝트 + Related Projects 기준의 배포 검증 절차입니다.

1. Vercel에서 프로젝트 3개 생성. Root Directory를 각각 `nextjs-app/apps/shell`, `nextjs-app/apps/demo-baseline`, `nextjs-app/apps/demo-cache-components`로 지정 (§2). "Include source files outside of the Root Directory" 옵션 확인
2. 세 프로젝트 모두 최초 배포(관계 설정 없이) — Settings에서 각 프로젝트 ID 확보
3. `vercel.json`에 `relatedProjects` 상호 설정 (§3-2 표) — 재배포. (`turbo.json`의 `VERCEL_RELATED_PROJECTS` 추가와 `next.config.ts`의 `@vercel/related-projects` 적용은 코드에 이미 반영됨)
4. 배포에서만 드러나는 항목 확인: 문서 렌더링(md 산출물 포함 여부), 데모 화면 CSS/JS 로딩(`assetPrefix`), Server Action 허용(`allowedOrigins`)
5. 셸 도메인에서 문서 → 데모 링크 이동, 독립 열람 iframe 표시까지 끝단 확인
6. 확인이 끝나면 로컬 중심으로 복귀. zone을 추가할 때만 1~5를 반복(3번은 신규 zone과 기존 두 프로젝트의 `relatedProjects` 목록에 서로 추가하는 것으로 축소됨)

## 7. 도메인 전략

커스텀 도메인은 **셸에만** 붙입니다. zone 프로젝트들은 Vercel이 자동 발급하는 `*.vercel.app` 도메인을 그대로 씁니다 — 학습자 URL에 zone이 노출되지 않는다는 기존 설계([ADR 0005](./adr/0005-hide-zone-from-learner-url.md))와 그대로 맞습니다. zone 도메인은 셸의 rewrites 목적지로만 쓰이고 사용자에게 보이지 않습니다.

## 8. 남은 리스크 / 다음 확인 사항

이 계획에서 아직 실측하지 못한 것들입니다. §6 첫 배포 검증에서 함께 닫습니다.

| 항목 | 리스크 | 확인 방법 |
|---|---|---|
| ~~`VERCEL_RELATED_PROJECTS` 값 형식~~ | **해결됨(2026-09-01 첫 배포 검증)**: 값 형식 이전에, `VERCEL_RELATED_PROJECTS`가 shell 빌드에서 아예 채워지지 않아 `withRelatedProject`가 `defaultHost`(`localhost:300x`)로 폴백 → rewrite가 사설 IP를 가리켜 `DNS_HOSTNAME_RESOLVED_PRIVATE` 404 발생 | **채택한 해결책**: Related Projects에 의존하지 않고, 각 프로젝트 Settings → Environment Variables(Production)에 `ZONE_BASELINE_URL`/`ZONE_CACHE_URL`/`PUBLIC_ORIGIN`을 실제 `*.vercel.app` URL로 직접 등록 후 재배포. 이게 Vercel 공식 [Academy 멀티존 가이드](https://vercel.com/academy/nextjs-foundations/multi-app-routing)가 안내하는 표준 방식과도 일치함 |
| Related Projects 순환 참조 | 세 프로젝트가 서로를 참조하는 구성이 Vercel 쪽 제약(최대 3개, 같은 리포지토리 내)에 걸리는지 | 수동 env var 방식으로 전환하면서 더 이상 막는 요인 아님(참고용으로만 남김) |
| `next.config.ts`가 빌드 타임에 이 값을 읽는 시점 | 기존 `zoneUrl()`이 모듈 최상위 `process.env` 읽기에 의존 | **확인됨**: 빌드 시점에 읽어 결과를 굳히므로, env var 저장 후 반드시 재배포(Redeploy) 필요 — 저장만으로는 반영 안 됨 |
| CLI 기반 배포(`vercel link --repo`) | 대시보드로 프로젝트 3개를 만드는 절차만 검증됨. CLI로 한 번에 링크하는 경로는 별도 확인 필요<sup>[9]</sup> | 필요 시에만 |
| `git.deploymentEnabled`의 `main`/`preview/*`/`**` 규칙(§4-1) | `devPark/*` 작업 브랜치 커밋 시 배포가 실제로 스킵되는지, `preview/*` 브랜치 커밋 시 실제로 Preview가 트리거되는지 미실측 | 각 브랜치에 커밋 푸시 후 Vercel 대시보드 Deployments 탭에서 확인 |

---

### 출처

1. [Using Monorepos — Vercel Docs](https://vercel.com/docs/monorepos)
2. [Monorepos FAQ — "여러 프로젝트를 한 도메인 아래 경로로 제공하는 법"](https://vercel.com/docs/monorepos/monorepo-faq#how-can-i-make-my-projects-available-on-different-paths-under-the-same-domain)
3. [Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo)
4. [Monorepos FAQ — "Root Directory 밖 소스 파일 공유"](https://vercel.com/docs/monorepos/monorepo-faq#can-i-share-source-files-between-projects-are-shared-packages-supported)
5. [Using Monorepos — Related Projects](https://vercel.com/docs/monorepos#related-projects)
6. [Deploying Turborepo to Vercel — 환경변수 처리](https://vercel.com/docs/monorepos/turborepo#handling-environment-variables)
7. [Using Monorepos — Skipping unaffected projects, Requirements](https://vercel.com/docs/monorepos#requirements)
8. [Remote Caching — Vercel Docs](https://vercel.com/docs/monorepos/remote-caching)
9. [Using Monorepos — Add a monorepo through Vercel CLI](https://vercel.com/docs/monorepos#add-a-monorepo-through-vercel-cli)
10. [Git Configuration — `git.deploymentEnabled`](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled)
