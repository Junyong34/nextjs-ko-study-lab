# 04. 설계 실현 가능성 검증 (기준 버전 16.3.1)

- 상위: [nextjs-app 작업 규칙](../AGENTS.md)
- 검증 대상: [01. 프로젝트 구성](./01-project-setup.md), [02. 모노레포 구성](./02-monorepo-options.md), [03. 결합 구조 설계](./03-composition-architecture.md), [ADR 0001](./adr/0001-config-axis-as-app-boundary.md)·[0002](./adr/0002-pnpm-turborepo-catalog-pinning.md)·[0003](./adr/0003-demo-directive-in-markdown.md)
- 검증일: 2026-08-18
- 이 문서의 범위: 설계 문서의 **사실 주장**이 `next@16.3.1`·`react@19.2.8`·`pnpm@10.33.0`·`turbo@2.10.10`에서 실제로 성립하는지만 판정합니다. 설계 의도의 타당성은 다루지 않습니다.

> **2026-08-19 이후 읽는 사람에게** — 이 문서는 **2026-08-18 시점의 01~03**을 검증한 기록입니다. 그 뒤 [06. 화면 구성과 UI 설계](./06-ui-and-screen-design.md)와 [ADR 0006](./adr/0006-shadcn-ui-as-ui-foundation.md)이 데모의 본문 임베드를 없애면서 03 §4-2·§4-6이 바뀌었습니다. 아래에서 "인라인 데모(iframe)"를 언급하는 항목(§10, §17)은 **당시 설계에 대한 판정**이며, 지금은 그 iframe이 독립 열람과 랜딩 히어로에만 남아 있습니다. 판정 내용 자체는 유효합니다 — 적용 범위만 좁아졌습니다.

## 근거로 삼은 1차 출처

| 종류 | 출처 |
|---|---|
| 설치된 패키지 | `npm pack next@16.3.1`로 받은 tarball의 `dist/` 소스 — 아래에서 `next@16.3.1 : 경로:줄` 로 표기 |
| 버전 동봉 문서 | Next.js 16.3은 `node_modules/next/dist/docs/`에 **버전이 일치하는 공식 문서**를 동봉합니다 ([ai-agents.md:14](https://nextjs.org/docs/app/guides/ai-agents)). 이 문서군을 최우선 근거로 씀 |
| 레지스트리 메타데이터 | `npm view next@16.3.1 engines` / `peerDependencies`, `npm view turbo versions` |
| CLI 실측 | `npx create-next-app@16.3.1 --help` 및 실제 생성 실행 |
| 공식 사이트 | [nextjs.org/docs](https://nextjs.org/docs), [pnpm.io](https://pnpm.io), [turborepo.dev](https://turborepo.dev) |
| 재현 | scratchpad에서 실제로 실행한 `pnpm install` / `turbo run build` / Next.js config 로더 호출 결과 |

## 판정 요약

| # | 설계의 주장 | 판정 | 한 줄 |
|:--:|---|:--:|---|
| 1 | `cacheComponents`는 최상위 정식 옵션 | ✅ | `NextConfig` 최상위. `experimental.cacheComponents`는 deprecated 별칭 |
| 2 | `experimental.ppr`은 제거됐고 에러를 던진다 / `cacheComponents`가 PPR을 포함 | ✅ | 설정 로드 시점에 `HardDeprecatedConfigError`. `cacheComponents: true` → 내부적으로 `ppr = true` |
| 3 | `use cache`·`cacheLife`·`cacheTag`가 `cacheComponents`에 딸려 온다 | ✅ | 16.0.0부터 Cache Components 기능으로 정식화 |
| 4 | `partialPrefetching`은 `cacheComponents: true`를 전제로 한다 | ✅ | **최상위** 옵션(`experimental` 아님), 16.3.0 도입, 없으면 config 검증에서 throw |
| 5 | Next 16에 `proxy.ts`가 있고 `demo-proxy`의 학습 주제가 된다 | ✅ | `proxy` 파일 컨벤션 존재, `middleware`는 deprecated지만 동작. 단 `proxy`는 edge 런타임 미지원 |
| 6 | zone은 `/demo-static/{슬러그}/_next/...`를 **직접 서빙**하므로 셸은 접두사를 벗기지 않고 통과시킨다 | ✅ | 공식 가이드·소스 양쪽에서 확인. "15 미만용 우회"라는 설명도 정확 |
| 7 | 셸의 rewrites **2줄**이면 zone 하나가 온전히 붙는다 | ⚠️ | 페이지·`_next/static`·dev HMR 웹소켓까지는 2줄로 덮임. **`public/`과 `next/image`(`/_next/image`)는 `assetPrefix`가 안 붙어 안 덮임** |
| 8 | 공유 패키지를 쓰려면 `transpilePackages` 명시가 필요하다 | ⚠️ | 옵션은 정식·최상위. 다만 16의 기본 번들러 Turbopack은 워크스페이스 패키지를 **자동 트랜스파일**하므로 필수 아님 |
| 9 | `create-next-app`에 `--turbopack`을 넘겨 `package.json`에 남긴다 | ❌ | `create-next-app@16.3.1`에 그런 플래그가 **없습니다.** 조용히 무시되고 생성물에도 안 남음 |
| 10 | `next@16.3.1` engines `node >=20.9.0`, React 19 호환 | ✅ | engines 정확히 일치. peer `^19.0.0` ⊇ `19.2.8` |
| 11 | pnpm `catalog:`로 기준 버전을 단일 고정 | ⚠️ | 문법·최소 버전(9.5)·`devDependencies`/`peerDependencies` 사용 모두 정확. **단 `@types/react: "catalog:"`는 catalog에 항목이 없어 `pnpm install`이 실패** |
| 12 | `turbo.json`의 `inputs`는 패키지 밖 파일을 참조할 수 없다 (02 §2-1 "약점") | ❌ | `$TURBO_ROOT$`로 저장소 루트 기준 참조가 **가능합니다.** 재현으로 캐시 무효화까지 확인 |
| 13 | `dependsOn: ["^build"]`가 md 변경을 셸 캐시에 전파한다 | ✅ | 재현으로 확인. 다만 12번 때문에 "워크스페이스 편입이 **불가피한 우회**"라는 근거는 성립 안 함 |
| 14 | zone 경계를 넘는 링크에 `<Link>`가 아닌 `<a>` | ✅ | 공식 Multi-Zones 가이드와 문장 단위로 일치 |
| 15 | rewrites 프록시라서 모든 zone이 동일 오리진 | ✅ | 서버 사이드 프록시이므로 브라우저에는 셸 오리진만 노출. 6-5의 대응 규칙도 타당 |
| 16 | `--no-agents-md`로 zone의 `AGENTS.md`를 직접 관리한다 | ❌ | 16.3부터 **`next dev`가 `AGENTS.md`·`CLAUDE.md`를 자동 생성/upsert**합니다. `agentRules: false`가 필요 |
| 17 | `create-next-app` 후처리는 4가지 | ⚠️ | `--use-pnpm`이 앱 폴더에 **중첩 `pnpm-workspace.yaml`**을 남깁니다. 지우지 않으면 zone 안에서 실행한 pnpm 명령이 전부 실패 |
| 18 | 모든 zone이 `next start --port` 로 뜬다 | ⚠️ | `demo-export`(`output: 'export'`)는 `next start` 대상이 아님. 3-3의 "똑같은 6단계"가 이 zone에서만 깨짐 |
| 19 | `outputFileTracingRoot: path.join(__dirname, '../../../')` | ✅ | `next.config.ts`에서 `__dirname` 사용 가능. 실제 로드해 워크스페이스 루트로 해석되는 것 확인 |
| 20 | rewrites 목적지를 `.env.local`의 `ZONE_*_URL`로 둔다 | ✅ | `loadConfig`가 사용자 config 평가 **전에** `loadEnvConfig`를 호출하므로 성립. 단 미설정 시 가드가 없음 |

**총계** — ✅ 확인됨 11건 / ⚠️ 부분적 6건 / ❌ 사실과 다름 3건 / ❓ 근거 없음 0건.

## 버전 정합성

| 항목 | 설계가 적은 값 | 실측 | 출처 | 판정 |
|---|---|---|---|:--:|
| Next.js | `16.3.1` | `16.3.1` (npm latest) | `npm view next version` | ✅ |
| React / React DOM | `19.2.8` | `19.2.8` (npm latest) | `npm view react version` | ✅ |
| Next의 React peer 범위 | (명시 없음) | `^18.2.0 \|\| 19.0.0-rc-de68d2f4-20241204 \|\| ^19.0.0` | `npm view next@16.3.1 peerDependencies` | ✅ 19.2.8 포함 |
| Node.js | `>=20.9.0` (`next@16.3.1`의 engines) | `{"node":">=20.9.0"}` | `npm view next@16.3.1 engines` | ✅ 문자열까지 정확 |
| 로컬 Node | 22.14.0 | 22.14.0 | `node -v` | ✅ |
| pnpm | "9.5 이상 (catalog 지원)" | catalogs는 **v9.5.0**(2024-07-07)에 추가 | [pnpm v9.5.0 릴리스](https://github.com/pnpm/pnpm/releases/tag/v9.5.0) | ✅ |
| 로컬 pnpm | 10.33.0 | 10.33.0 (npm latest는 11.22.0, 12는 RC) | `pnpm --version`, [pnpm.io/installation](https://pnpm.io/installation) | ✅ 동작하지만 두 메이저 뒤처짐 |
| Turborepo | `^2.10.10` | `2.10.10`이 npm latest (2.10.11은 canary만) | `npm view turbo versions` | ✅ |
| 학습 문서 기준 버전 | `16.3.1` | `16.3.1` | `nextjs-docs/README.md` | ✅ 검증 시점의 `16.3.0`에서 갱신 완료. 재검토 대상 없음(아래 주석) |

> **16.3.0 → 16.3.1 재검토 대상**: `partialPrefetching`이 **16.3.0**에서 도입됐으므로, 문서가 16.3.0 기준이어도 이 기능은 이미 사정권입니다. 16.3.1은 patch이며 검증 과정에서 문서 재검토를 요구하는 API 변경은 발견되지 않았습니다.

## 검증 상세

### 1. `cacheComponents`는 최상위 정식 옵션인가

- **설계**: 03 §3-2에서 `next.config.ts` 최상위에 `cacheComponents: true`.
- **1차 출처**: `next@16.3.1 : dist/server/config-shared.d.ts:1538` — `interface NextConfig`(같은 파일 `:1207`에서 시작)의 직속 멤버입니다. zod 스키마도 최상위에 있습니다(`dist/server/config-schema.js:494`의 `z.strictObject` 안). `experimental.cacheComponents`(`config-shared.d.ts:995-997`)는 `@deprecated use top-level cacheComponents instead`로 표시된 별칭입니다.
- **동봉 문서**: `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` — Version History에 `16.0.0 cacheComponents introduced. This flag controls the ppr, useCache, and dynamicIO flags as a single, unified configuration.`
- **재현**: 설계의 데모 앱 config를 그대로 `loadConfig(PHASE_PRODUCTION_BUILD, dir)`에 통과시켜 `{"cacheComponents":true,...}` 확인.
- **판정**: ✅ 확인됨. 최상위 config 스키마는 `z.strictObject`라서 `experimental` 아래에 잘못 넣으면 조용히 무시되지 않고 검증 에러가 납니다.

### 2. `experimental.ppr`은 정말 에러를 던지는가 / `cacheComponents`가 PPR을 포함하는가

- **설계**: 03 §2 "왜 이렇게 갈렸는가" — "`experimental.ppr`은 이제 에러를 던지고, `cacheComponents: true`가 PPR을 **포함**합니다."
- **1차 출처(에러)**: `next@16.3.1 : dist/server/config.js:466-467`

  ```js
  if (result.experimental.ppr) {
      throw new HardDeprecatedConfigError(
        `\`experimental.ppr\` has been merged into \`cacheComponents\`. ...`)
  }
  ```
- **1차 출처(포함)**: `next@16.3.1 : dist/server/config.js:1213-1215`

  ```js
  if (result.cacheComponents) {
      // TODO: remove once we've finished migrating internally to cacheComponents.
      result.experimental.ppr = true;
  }
  ```
- **동봉 문서**: `dist/docs/01-app/02-guides/upgrading/version-16.md` §Partial Prerendering (PPR) — "**Next.js 16** removes the experimental **Partial Prerendering (PPR)** flag and configuration options, including the route level segment `experimental_ppr`."
- **재현**: `{ experimental: { ppr: true } }`만 담은 `next.config.ts`를 로드 → 위 메시지 그대로 throw. `{ cacheComponents: true }`만 담은 config를 로드 → `experimental.ppr === true`.
- **판정**: ✅ 확인됨. 설계 문장이 소스 동작과 정확히 일치합니다.

### 3. `use cache` / `cacheLife` / `cacheTag`

- **설계**: 03 §2 — "`use cache` 지시자와 `cacheLife`·`cacheTag` API도 여기 딸려 옵니다."
- **1차 출처**: `dist/docs/.../cacheComponents.md` — "When `cacheComponents` is enabled, you can use the following cache functions and configurations: `use cache` directive / `cacheLife` function / `cacheTag` function."
- `dist/docs/01-app/03-api-reference/01-directives/use-cache.md` Version History: `v16.0.0` `"use cache"` is enabled with the Cache Components feature. / `v15.0.0` experimental로 도입.
- 반대 방향도 강제됩니다: `dist/server/config.js:1219-1228`에서 `cacheComponents`가 켜진 채 `experimental.useCache: false`를 주면 에러 `E1465`.
- **판정**: ✅ 확인됨.

### 4. `partialPrefetching` — 이름·키 위치·전제 조건

가장 의심스러웠던 항목인데, **설계가 맞습니다.**

- **설계**: 03 §2 표에서 `demo-prefetch`의 결정적 설정을 "`cacheComponents` + `partialPrefetching`"으로, 본문에서 "`partialPrefetching`은 `cacheComponents: true`를 전제"라고 씀. ADR 0001도 같은 이름을 씀.
- **1차 출처(존재·위치)**: `next@16.3.1 : dist/server/config-shared.d.ts:1553` — `partialPrefetching?: boolean | 'unstable_eager'`. `interface NextConfig` 직속, 즉 **최상위**입니다. `experimental` 아래에는 이 키가 존재하지 않습니다(`experimental`은 `z.strictObject`라 넣으면 검증 실패). zod: `dist/server/config-schema.js:740`.
- **1차 출처(전제 조건)**: `next@16.3.1 : dist/server/config.js:459-460`

  ```js
  if (result.partialPrefetching && !result.cacheComponents) {
      throw new Error(`\`partialPrefetching\` requires \`cacheComponents\` to be enabled. ...`)
  }
  ```
- **동봉 문서**: `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/partialPrefetching.md` — "`partialPrefetching` requires `cacheComponents`. Without it, `next dev` and `next build` throw at config validation." Version History: `16.3.0 partialPrefetching introduced.`
- **재현**: `{ partialPrefetching: true }` 단독 → throw. `{ cacheComponents: true, partialPrefetching: true }` → 정상 로드.
- **판정**: ✅ 확인됨. **다만 설계 문서 어디에도 이 옵션이 "최상위"라는 사실이 적혀 있지 않습니다.** `experimental` 아래로 쓰기 쉬운 이름이라, 03 §2에 키 경로를 명시하는 편이 안전합니다.

### 5. `proxy.ts`

- **설계**: 03 §2에서 `demo-proxy` zone의 결정적 설정으로 "`proxy.ts`, `basePath`, `i18n`".
- **1차 출처**: `next@16.3.1 : dist/lib/constants.js:287-290`

  ```js
  const MIDDLEWARE_FILENAME = 'middleware';
  const MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
  const PROXY_FILENAME = 'proxy';
  const PROXY_LOCATION_REGEXP = `(?:src/)?${PROXY_FILENAME}`;
  ```
- `middleware.ts`도 여전히 동작하지만 `dist/build/index.js:730`에서 deprecation 경고를 내고, 둘 다 있으면 `dist/build/index.js:724`에서 빌드가 실패합니다.
- **동봉 문서**: `dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — "Create a `proxy.ts` (or `.js`) file in the project root, or inside `src` if applicable." `--src-dir`을 쓰는 이 설계에서는 **`src/proxy.ts`**가 됩니다.
- **주의**: `version-16.md` §`middleware` to `proxy` — "The `edge` runtime is **NOT** supported in `proxy`. ... If you want to continue using the `edge` runtime, keep using `middleware`." `demo-proxy`가 edge 런타임까지 가르치려면 `middleware.ts`가 별도로 필요합니다.
- **판정**: ✅ 확인됨 (edge 런타임 단서 추가 필요).

### 6. Multi-Zones — `rewrites` + `assetPrefix`, 접두사 통과

- **설계**: 03 §3-3의 인용문 — "`assetPrefix: '/demo-static/cache'`를 선언한 zone은 자기 자산을 `/demo-static/cache/_next/...` 경로에서 **직접 서빙**합니다. ... 셸은 중간에서 접두사를 손댈 필요 없이 통과시키기만 하면 됩니다." 그리고 "`/demo-static/{슬러그}/_next/:path*` → `${url}/_next/:path*` 형태는 Next.js 15 미만용 우회이고, 그마저도 zone 자신의 config에 `beforeFiles`로 넣던 것"이라는 경고.
- **1차 출처**: [nextjs.org/docs/app/guides/multi-zones](https://nextjs.org/docs/app/guides/multi-zones)
  - "Next.js assets, such as JavaScript and CSS, will be prefixed with `assetPrefix` ... **These assets will be served under `/assetPrefix/_next/...` for each of the zones.**"
  - "In versions older than Next.js 15, you may also need an additional rewrite to handle the static assets. This is no longer necessary in Next.js 15." — 그리고 그 예제는 정확히 **zone 자신의 config**에 `beforeFiles: [{ source: '/blog-static/_next/:path+', destination: '/_next/:path+' }]`를 넣는 형태입니다.
- **소스 확인**: `next@16.3.1 : dist/server/lib/router-utils/resolve-routes.js:147-148` — 들어온 경로가 `assetPrefix`로 시작하면 그 접두사를 벗겨 내부 라우팅에 넘깁니다. 즉 zone이 접두사 붙은 경로를 실제로 받습니다.
- **판정**: ✅ 확인됨. 설계의 인용 경고까지 문장 단위로 정확합니다.

**공식 예제와의 차이 — 2줄 vs 3줄**: 공식 가이드는 zone 하나에 3줄(`/blog`, `/blog/:path+`, `/blog-static/:path+`)을 씁니다. 설계는 `:path*`를 써서 2줄로 줄였습니다. `next@16.3.1`의 매처로 직접 확인한 결과:

| source | `/demo/cache` | `/demo/cache/isr/basic` |
|---|:--:|:--:|
| `/demo/cache/:path*` | 매치 (`{}`) | 매치 |
| `/demo/cache/:path+` | **미매치** | 매치 |

(`require('next/dist/shared/lib/router/utils/path-match').getPathMatch`로 실측) — 따라서 **`:path*`를 쓴 설계의 2줄 레시피가 공식 3줄과 등가이며 zone 루트까지 덮습니다.** 공식 예제를 그대로 베껴 `:path+`로 바꾸면 오히려 zone 루트가 404가 됩니다.

### 7. `assetPrefix` + Turbopack dev — 실제로 되는가

- **설계**: 01 §3-6 "`pnpm dev` 한 번으로 모든 zone 기동", 03 §4-6 인라인 데모(iframe)를 dev에서 조작.
- **dev HMR 웹소켓 경로**: `next@16.3.1 : dist/client/dev/hot-reloader/app/web-socket.js:60`

  ```js
  new window.WebSocket(`${getSocketUrl(assetPrefix)}/_next/hmr?id=${self.__next_r}`)
  ```

  `getSocketUrl`(`dist/client/dev/hot-reloader/get-socket-url.js`)은 경로형 `assetPrefix`면 `ws://{현재 host}{prefix}`를 만듭니다. iframe이 셸 오리진에서 로드되므로 최종 URL은 `ws://localhost:3000/demo-static/cache/_next/hmr`입니다.
- **서버 쪽도 같은 경로를 듣는가**: `next@16.3.1 : dist/server/lib/router-server.js:672-684`

  ```js
  let hmrPrefix = basePath;
  if (assetPrefix) { hmrPrefix = normalizedAssetPrefix(assetPrefix); ... }
  const isHMRRequest = req.url.startsWith(ensureLeadingSlash(`${hmrPrefix}/_next/hmr`));
  ```

  → 데모 앱은 `/demo-static/cache/_next/hmr`에서 듣습니다. 클라이언트와 서버가 일치합니다.
- **셸이 웹소켓 업그레이드를 프록시하는가**: `dist/server/lib/router-server.js:715-728` — upgrade 요청도 `resolveRoutes`(rewrites 적용)를 거쳐 외부 목적지면 `proxyRequest(req, socket, parsedUrl, head)`로 넘어가고, `dist/server/lib/router-utils/proxy-request.js:34`에 `ws: true`가 있습니다.
- **결론**: 설계의 정적 자산 rewrite 1줄(`/demo-static/{슬러그}/:path*`)이 dev HMR 웹소켓까지 그대로 덮습니다. **iframe 안 데모의 HMR이 셸을 통해 동작합니다.**
- **알려진 결함 조사**: vercel/next.js에서 `assetPrefix` + Turbopack 이슈는 있으나 전부 **cross-origin CDN** 시나리오입니다 — [#96831](https://github.com/vercel/next.js/issues/96831) (16.3.0, `crossorigin` 속성), [#96610](https://github.com/vercel/next.js/issues/96610) / [#93044](https://github.com/vercel/next.js/discussions/93044) (Web Worker). [#60891](https://github.com/vercel/next.js/issues/60891)은 Next 14 시절 이슈입니다. 이 설계처럼 **경로형(`/demo-static/...`) assetPrefix**에 대한 16.x 결함은 1차 출처에서 찾지 못했습니다.
- **판정**: ⚠️ 부분적 — dev 동작 자체는 ✅지만, **`assetPrefix`가 덮지 않는 두 경로**가 설계에 빠져 있습니다.

| 경로 | `assetPrefix` 적용 | 근거 | 결과 |
|---|:--:|---|---|
| `_next/static` (JS·CSS) | ✅ | multi-zones 가이드 | 2줄로 덮임 |
| `_next/hmr` (dev) | ✅ | `router-server.js:684` | 2줄로 덮임 |
| **`public/` 파일** | ❌ | [assetPrefix 문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix) — "it does not influence ... Files in the public folder" | 데모 앱이 `public/`에 둔 자산은 셸에서 404 |
| **`/_next/image`** (next/image 기본 loader) | ❌ | `next@16.3.1 : dist/server/config.js:648-649` — `images.path`는 `basePath`만 붙이고 `assetPrefix`는 안 붙임 | 셸의 이미지 최적화기로 요청이 새어 나감 |

### 8. `transpilePackages`

- **설계**: 01 §3-4 2번 — "`next.config.ts`에 `transpilePackages: ['@study/ui', '@study/docs-render']` 명시 (Next.js / Turbopack이 소스코드를 직접 트랜스파일 및 HMR)". 02 §2-1 표에서도 Internal Packages 패턴의 필수 요소로 씀. 01 §4 체크리스트에도 들어 있음.
- **1차 출처(옵션 존재)**: `next@16.3.1 : dist/server/config-shared.d.ts:1503`, `dist/server/config-schema.js:785` — 최상위 `string[]`, 정식. 로드 재현도 통과.
- **1차 출처(필요 여부)**: `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/transpilePackages.md` §When you need it

  > **Turbopack transpiles workspace packages (npm, pnpm, or Yarn workspaces) in your monorepo automatically under both routers.** Webpack does the same for the App Router.

  이어지는 "필요한 경우" 목록은 ① `node_modules` 의존성이 raw TS/JSX를 배포할 때, ② **Pages Router**를 webpack으로 빌드할 때, ③ **Pages Router**에서 번들링을 원할 때 — 셋 다 이 설계(App Router + Turbopack 기본)에 해당하지 않습니다.
- **판정**: ⚠️ 부분적 — 틀린 설정은 아니지만 **필수가 아닙니다.** "명시해야 한다"를 "명시해도 되지만 Turbopack에서는 불필요하다"로 낮춰야 합니다.

### 9. `create-next-app@16.3.1`의 `--turbopack`

**여기가 설계에서 가장 명백히 틀린 부분입니다.**

- **설계**: 01 §3-3 ① 명령에 `--turbopack`이 들어 있고, 플래그 근거 표에 "`--turbopack` | 16의 기본값이지만 `package.json`에 명시적으로 남깁니다"라고 적혀 있습니다.
- **실측**: `npx create-next-app@16.3.1 --help`의 전체 플래그 목록에 **`--turbopack`이 없습니다.** 있는 번들러 플래그는 `--rspack`뿐입니다.
- **더 나쁜 점**: 이 CLI는 모르는 플래그를 **에러 없이 무시**합니다. `--totally-bogus-flag-xyz`를 넣어도 `Success!`로 끝납니다. 즉 오타가 잡히지 않습니다.
- **생성 결과**: 설계의 명령을 그대로 실행해 보면 생성된 `package.json`은

  ```json
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "eslint" }
  ```

  — `--turbopack`은 **아무 데도 남지 않습니다.** 설계가 기대한 효과가 0입니다.
- **`next` CLI 쪽은 다름**: `next@16.3.1 : dist/bin/next`에는 `--turbo`/`--turbopack`/`--webpack`이 모두 정의돼 있으므로, 굳이 남기고 싶다면 ④ 포트 고정 단계에서 `"dev": "next dev --turbopack --port 3000"`처럼 **직접 적어야** 합니다.
- **공식 권고는 반대**: `dist/docs/01-app/02-guides/upgrading/version-16.md` §Turbopack by default — "Starting with **Next.js 16**, Turbopack is stable and used by default with `next dev` and `next build`. ... This is no longer necessary. You can update your `package.json` scripts:" 하고 `--turbopack`을 **뺀** 예시를 보여줍니다.
- **판정**: ❌ 사실과 다름. 플래그를 지우고 근거 표에서 그 줄을 삭제하는 것이 가장 단순한 수정입니다.

> `--no-agents-md`는 반대로 **유효한 플래그입니다.** `--help`에는 `--agents-md ... (default)`만 보이지만, 다른 실행에서 CLI가 스스로 `--agents-md   AGENTS.md (use --no-agents-md for No AGENTS.md)`를 출력했고, 실제로 넘겼을 때 `AGENTS.md`가 생성되지 않았습니다. 다만 16번을 보세요.

### 10. engines와 peer 범위

```
$ npm view next@16.3.1 engines
{ "node": ">=20.9.0" }

$ npm view next@16.3.1 peerDependencies
{ "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
  "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0", ... }
```

- 01 §1 표의 `>=20.9.0`은 문자열까지 정확합니다. 루트 `package.json`의 `"engines": { "node": ">=20.9.0" }`도 일치합니다.
- `react@19.2.8`은 `^19.0.0`에 포함되므로 catalog의 정확 고정과 충돌하지 않습니다.
- **판정**: ✅ 확인됨.

### 11. pnpm `catalog:`

- **최소 버전**: [pnpm v9.5.0 릴리스 노트](https://github.com/pnpm/pnpm/releases/tag/v9.5.0) (2024-07-07) — "Added support for [catalogs](https://pnpm.io/catalogs) #8122". 01 §1의 "9.5 이상" ✅.
- **문법**: [pnpm.io/catalogs](https://pnpm.io/catalogs) — `pnpm-workspace.yaml`의 최상위 `catalog:`가 `default` 카탈로그, 복수형 `catalogs:`가 Named Catalogs. 02 §2-1의 "필요 시 Named Catalogs(`catalogs.canary` 등)로 확장 가능"도 ✅.
- **사용 가능한 필드**: 같은 문서 — `dependencies` / `devDependencies` / `peerDependencies` / `optionalDependencies`, 그리고 `pnpm-workspace.yaml`의 `overrides`. 01 §3-4가 `peerDependencies`와 `devDependencies` 양쪽에 `catalog:`를 쓰는 것은 ✅.
- **❌ 실제로 깨지는 부분**: 01 §3-1의 catalog는 `next`·`react`·`react-dom` 세 개뿐인데, 01 §3-4의 `packages/ui/package.json`은 `"@types/react": "catalog:"`를 참조합니다. 그대로 재현하면:

  ```
  ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC  No catalog entry '@types/react' was found for catalog 'default'.
  ```

  `pnpm install`이 **워크스페이스 전체에서 실패**합니다. 01 §5의 완료 판정 첫 항목("`pnpm install`이 워크스페이스 루트에서 한 번에 끝난다")이 곧바로 거짓이 됩니다. catalog에 `@types/react` 항목을 추가하면 정상 동작하는 것까지 확인했습니다.
- **참고**: `@types/react`는 정확 고정 대상이 아니므로 `^19.2.0` 같은 범위로 catalog에 넣는 편이 자연스럽습니다. ADR 0002의 "캐럿 없이 정확 고정" 규칙은 기준 버전(`next`/`react`/`react-dom`)에 대한 규칙이지 모든 의존성에 대한 규칙이 아니라는 점을 문서에 명시하는 것이 좋습니다.
- **판정**: ⚠️ 부분적 (문법·버전은 ✅, 예제 코드가 그대로는 실패).

### 12. Turborepo

| 주장 | 판정 | 근거 |
|---|:--:|---|
| `turbo@^2.10.10`이 존재 | ✅ | `npm view turbo version` → `2.10.10` (latest). 실제 설치·실행 확인 |
| `$schema: "https://turborepo.dev/schema.json"` | ✅ | 200 OK. `turbo.build/schema.json`은 301로 여기로 리다이렉트 — 설계가 쓴 쪽이 정본 |
| `dependsOn` / `outputs` / `env` / `persistent` / `globalDependencies` | ✅ | [schema.json](https://turborepo.dev/schema.json)의 `definitions.Pipeline.properties`와 최상위 `properties`에 모두 존재 |
| `persistent: true`의 의미 | ✅ | [configuration#persistent](https://turborepo.dev/docs/reference/configuration#persistent) — "prevent other tasks from depending on long-running processes" |
| `globalDependencies`가 "md 한 줄에 모든 캐시가 날아간다" | ✅ | 같은 문서 — "**If any file matching these globs changes, all tasks will miss cache.**" 01 §3-5의 서술이 정확 |
| `dependsOn: ["^build"]`가 md 변경을 셸 캐시로 전파 | ✅ | **재현 확인** — `b`가 `a`를 `workspace:*`로 의존할 때, `a`의 소스만 고쳐도 `b:build`가 cache miss |
| **`inputs`는 패키지 밖 파일을 참조할 수 없다** (02 §2-1 "약점") | ❌ | **틀렸습니다** |

**12-1. `$TURBO_ROOT$` — 02 §2-1의 "약점"은 사실이 아닙니다**

- **설계**: 02 §2-1 — "`turbo.json`의 `inputs`는 패키지 상대 경로라 패키지 밖 파일을 직접 참조할 수 없습니다. 그래서 `nextjs-docs`를 워크스페이스 패키지로 편입하는 우회가 필요합니다."
- **1차 출처**: [configuration#turbo_root](https://turborepo.dev/docs/reference/configuration#turbo_root) — "Tasks might reference a file that lies outside of their directory. Starting a file glob with `$TURBO_ROOT$` will change the glob to be relative to the root of the repository instead of the package directory." 예제까지 `"inputs": ["$TURBO_ROOT$/tsconfig.json", "src/**/*.ts"]`입니다. Turborepo 저장소에서 2025-03에 이미 dogfooding 중이었습니다 ([vercel/turborepo#10168](https://github.com/vercel/turborepo/pull/10168)).
- **재현** (turbo 2.10.10):

  ```jsonc
  { "tasks": { "build": { "inputs": ["$TURBO_DEFAULT$", "$TURBO_ROOT$/nextjs-docs/**/*.md"] } } }
  ```

  1회차 cache miss → 2회차 cache hit → **패키지 밖** `nextjs-docs/a.md` 한 줄 수정 → cache miss. 정확히 의도대로 동작합니다.
- **판정**: ❌ 사실과 다름.
- **결정에 미치는 영향**: `nextjs-docs`를 `@study/docs` 워크스페이스 패키지로 편입한다는 **결정 자체는 유지해도 됩니다** — `dependsOn: ["^build"]`로 전파하는 방식이 `globalDependencies`보다 정밀하고, 매니페스트 생성 스크립트도 어차피 필요하기 때문입니다. 다만 그것이 **"기술적으로 불가피한 우회"라는 근거는 사라집니다.** ADR 0002의 "`nextjs-app/`을 독립 워크스페이스 루트로" 기각 사유("md를 고쳐도 turbo가 셸의 빌드 캐시를 무효화하지 못한다")도 같은 이유로 약해집니다 — `$TURBO_ROOT$`가 있으면 무효화됩니다.

**12-2. `outputs`의 `!.next/dev/**`**: `next@16.3.1`이 `.next/dev/`를 쓰는지 1차 출처로 확인하지 못했습니다. 부정 glob이라 틀려도 무해합니다 (미확인).

### 13. zone 경계를 넘는 내비게이션

- **설계**: 03 §5 표, AGENTS.md 규칙 4, ADR 0001 Consequences — 모두 "zone 경계를 넘으면 hard navigation, `<Link>` 금지, `<a>` 사용".
- **1차 출처**: [multi-zones](https://nextjs.org/docs/app/guides/multi-zones) §Linking between zones — "Links to paths in a different zone should use an `a` tag instead of the Next.js `<Link>` component. This is because Next.js will try to prefetch and soft navigate to any relative path in `<Link>` component, which will not work across zones."
- 또 "Navigating from a page in one zone to a page in another zone ... will perform a hard navigation, unloading the resources of the current page and loading the resources of the new page."
- **설계가 이걸 반영하는가**: ✅ 세 곳에서 반영돼 있습니다. 03 §4-5의 파이프라인도 이 제약과 충돌하지 않습니다 — 인라인 데모는 `<iframe src>`(내비게이션 아님)이고, `mode: fullscreen`은 명시적으로 `<a href>`입니다.
- **판정**: ✅ 확인됨. 설계가 제대로 반영하고 있습니다.

### 14. 동일 오리진 주장 (03 §6-5)

- **설계**: "셸의 rewrites를 통해 모든 zone이 단일 도메인으로 서비스되므로, 브라우저 입장에서는 **모든 데모 앱과 셸이 동일 오리진**입니다."
- **근거**: `rewrites`는 서버 사이드 프록시입니다 — [multi-zones](https://nextjs.org/docs/app/guides/multi-zones)의 "one of the Next.js applications can also be used to route requests for the entire domain", 그리고 구현상 `dist/server/lib/router-utils/proxy-request.js`가 셸 프로세스 안에서 상류로 요청을 대신 보냅니다. 브라우저는 셸 오리진 외의 오리진을 보지 않습니다.
- **따라서**:
  - 03 §4-6의 `window.parent.postMessage(..., window.location.origin)`은 올바릅니다 (iframe 안에서 `location.origin`이 곧 셸 오리진).
  - `event.origin === window.location.origin` + `event.source === iframe.contentWindow` 이중 검증도 적절합니다.
  - 쿠키/localStorage 오염 위험과 `demo_{슬러그}_*` 네임스페이스 대응도 타당합니다.
- **다만 이 동일 오리진 때문에** `serverActions.allowedOrigins`가 여전히 필요합니다 — 데모 앱이 보는 `Host` 헤더는 셸이 붙인 `x-forwarded-host`이고, 자기 자신의 origin(`localhost:3002`)과 다르기 때문입니다. 03 §3-2가 이걸 설정하는 것은 ✅이며, `experimental.serverActions.allowedOrigins`라는 키 경로도 `next@16.3.1 : dist/server/config-schema.js:245-247`(experimental 스키마 내부)과 [multi-zones §Server Actions](https://nextjs.org/docs/app/guides/multi-zones)에서 확인됩니다.
- **판정**: ✅ 확인됨.

### 15~20. 그 외 발견

**15-a. `next dev`가 zone의 `AGENTS.md`·`CLAUDE.md`를 자동 생성합니다 (❌ 설계와 충돌)**

- **설계**: 01 §3-3의 `--no-agents-md` 근거 — "이 저장소는 디렉토리별 `AGENTS.md`를 직접 관리합니다. 생성기가 만든 일반 안내문과 섞이면 규칙이 두 벌이 됩니다." 그리고 ⑥에서 zone용 `AGENTS.md`와 `CLAUDE.md`(`@AGENTS.md` 한 줄)를 손으로 씁니다.
- **1차 출처**: `next@16.3.1 : dist/server/config-shared.d.ts:1565-1574`

  > When `next dev` detects an AI coding agent and no managed agent-rules block is present, Next.js auto-generates `AGENTS.md` and `CLAUDE.md` at the project root ... Set to `false` to disable this behavior. `@default true`

  `dist/docs/01-app/02-guides/ai-agents.md:63` — "On Next.js 16.3 or later, run `next dev`. When an AI coding agent is detected in the environment and no managed block is present, Next.js auto-generates `AGENTS.md` and `CLAUDE.md` at the project root. **Existing `AGENTS.md` or `CLAUDE.md` files are upserted**, so content outside the managed block is preserved". 같은 문서 78행이 보여주는 생성 `CLAUDE.md` 내용은 `@AGENTS.md` — **이 저장소의 관례와 글자까지 같습니다.**
- **의미**: `--no-agents-md`는 **생성 시점 1회**만 막습니다. `pnpm dev`를 한 번 돌리는 순간 각 zone 루트에 managed block이 삽입되고, 손으로 쓴 zone `AGENTS.md`가 변경됩니다. 옵트아웃은 `agentRules: false`(`dist/docs/.../ai-agents.md:85-91`)뿐입니다.
- **판정**: ❌ — 설계 의도(직접 관리)가 기본 동작에 의해 무력화됩니다.

**15-b. `create-next-app --use-pnpm`이 중첩 `pnpm-workspace.yaml`을 남깁니다 (⚠️ 후처리 누락)**

설계의 ① 명령을 그대로 실행하면 생성물에 다음이 포함됩니다:

```
nextjs-app/apps/shell/pnpm-workspace.yaml   # ignoredBuiltDependencies: [sharp, unrs-resolver]
nextjs-app/apps/shell/package.json          # "packageManager": "pnpm@10.33.0"
```

- 루트에서 `pnpm install`을 돌리는 것은 문제없지만(재현 확인), **zone 디렉토리 안에서 pnpm 명령을 실행하면** pnpm이 그 폴더를 워크스페이스 루트로 보고 다음으로 실패합니다:

  ```
  ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC  No catalog entry 'react' was found for catalog 'default'.
  ```
- `"packageManager"` 중복도 루트 선언과 두 벌이 됩니다. 01 §2가 "후처리 4가지"라고 못 박았으니, 이 정리 단계가 목록에 들어가야 합니다.

**15-c. `demo-export` zone은 3-3의 6단계를 따를 수 없습니다 (⚠️ 내부 불일치)**

- 03 §2 표에서 `demo-export`는 포트 3004, `output: 'export'`.
- `dist/docs/01-app/02-guides/static-exports.md` §Deploying — 산출물은 `out/` 정적 파일이고 서버가 없습니다. §Unsupported Features에는 **Rewrites, Redirects, Headers, Proxy, ISR, Server Actions, 기본 loader의 Image Optimization**이 전부 포함됩니다.
- 따라서 01 §3-3 ④가 강제하는 `"start": "next start --port 3004"`가 이 zone에서는 성립하지 않고, 로컬에서 셸의 rewrite 목적지를 살리려면 별도 정적 서버가 필요합니다. `assetPrefix` 자체는 정적 내보내기에서도 쓸 수 있으므로 구조가 불가능한 것은 아니지만, **"셸이든 데모 앱이든 똑같은 6단계"라는 문장이 이 zone에서만 깨집니다.**

**15-d. `ZONE_*_URL` 미설정 가드 없음 (⚠️ 사소)**

03 §3-3의 `zones` 배열은 `process.env.ZONE_BASELINE_URL`을 그대로 템플릿 리터럴에 넣습니다. 값이 없으면 destination이 `"undefined/demo/baseline/:path*"`가 되어 rewrite 검증 단계에서 실패합니다. 환경변수 하나에 로컬↔배포 전환이 전부 달려 있다고 설계가 스스로 강조하는 만큼, 없으면 명확히 throw하는 가드가 있는 편이 좋습니다.

**15-e. `outputFileTracingRoot`의 `__dirname` (✅)**

`next.config.ts`에 `import path from 'node:path'`와 `__dirname`을 섞어 쓰는 것이 ESM에서 깨지지 않는지 실측했습니다. `loadConfig`로 로드한 결과 `outputFileTracingRoot`가 세 단계 위 디렉토리로 정상 해석됐습니다. `nextjs-app/apps/shell` 기준 `../../../`은 저장소 루트가 맞습니다.

**15-f. `.env.local`이 `next.config.ts`에서 읽히는가 (✅)**

`next@16.3.1 : dist/server/config.js:1404` — `loadConfig`가 사용자 config를 평가하기 **전에** `@next/env`의 `loadEnvConfig(dir, ...)`를 호출합니다. 03 §3-3의 `.env.local` 기반 설계가 성립합니다.

**15-g. 포트 표·슬러그 정합성 (✅)**

| 확인 항목 | 결과 |
|---|---|
| 03 §2 표(3000~3005)와 §1 다이어그램(3000~3003) | 겹치는 범위에서 일치 |
| 앱 이름 ↔ 슬러그 ↔ 환경변수 (`demo-cache-components`/`cache`/`ZONE_CACHE_URL`) | 03 §2·§3-3, 01 §4 전부 일치 |
| README 다이어그램의 `/demo/baseline/*`·`/demo/cache/*` | 03 §2 표와 일치 |
| ADR 0001의 "충돌 축 5개, 앱 3개부터" ↔ 03 §2 표의 "1차 생성" 3개 | 일치 |
| 02 §4-1의 "`.gitignore`가 이미 `.turbo/`와 `.pnpm-store/`를 무시" | 실제로 `.gitignore:14`, `:32`에 존재 ✅ |
| 01 §3-1·03 §4-5의 "291개 md" | `find nextjs-docs -name "*.md" \| wc -l` → 291 ✅ |

## 수정이 필요한 항목 — **전부 반영 완료 (2026-08-18)**

> 아래 12건은 **모두 01~03·ADR 0002·`nextjs-docs/README.md`에 반영됐습니다.** 이 표는 무엇이 왜 바뀌었는지를 남기는 기록이며, 지금 설계 문서를 읽는 사람은 이미 고쳐진 내용을 보게 됩니다.
>
> 반영하면서 원안과 달리 판단한 것 하나: 5번(`$TURBO_ROOT$`)은 사실만 정정하고 **워크스페이스 편입 결정은 유지**했습니다. 근거를 "도구 제약상 불가피"에서 "의존 그래프가 캐시 무효화 이유까지 드러내는 쪽이 낫다"로 바꿨습니다.

우선순위 순입니다. 1~3번은 그대로 실행하면 **막힙니다.**

| # | 파일 · 절 | 지금 | 이렇게 |
|:--:|---|---|---|
| 1 | `01-project-setup.md` §3-3 ① 및 플래그 표 | 명령에 `--turbopack`, 표에 "16의 기본값이지만 package.json에 명시적으로 남깁니다" | **`--turbopack`을 삭제**하고 표에서 그 행을 뺍니다. 정말 남기고 싶으면 ④에서 `"dev": "next dev --turbopack --port 3000"`으로 직접 적되, [공식 업그레이드 가이드는 제거를 권장](https://nextjs.org/docs/app/guides/upgrading/version-16)한다는 단서를 답니다 |
| 2 | `01-project-setup.md` §3-1 `pnpm-workspace.yaml` | catalog에 `next`·`react`·`react-dom`만 | **`"@types/react": ^19.2.0`(및 필요하면 `@types/react-dom`) 추가.** 없으면 §3-4의 `packages/ui`가 `pnpm install`을 워크스페이스 전체에서 실패시킵니다. 동시에 ADR 0002의 "정확 고정"이 기준 버전 3종에만 적용된다는 점을 명시 |
| 3 | `01-project-setup.md` §2 · §3-3 · §4 체크리스트 | 후처리 4가지 | **후처리에 2개 추가**: (a) `apps/{앱이름}/pnpm-workspace.yaml` 삭제, (b) `apps/{앱이름}/package.json`의 `packageManager` 필드 삭제 |
| 4 | `01-project-setup.md` §3-3 ⑥, 플래그 표 `--no-agents-md` 행 | "생성기가 만든 안내문과 섞이면 규칙이 두 벌" | **`next dev`가 16.3부터 `AGENTS.md`·`CLAUDE.md`를 자동 upsert한다**는 사실을 추가하고, zone `next.config.ts`에 `agentRules: false`를 넣거나 managed block을 수용한다는 방침을 정합니다 |
| 5 | `02-monorepo-options.md` §2-1 "약점" 문단, `adr/0002-...md` Considered Options 4번째 | "`inputs`는 패키지 밖 파일을 직접 참조할 수 없습니다" | **`$TURBO_ROOT$`로 가능하다**로 정정. 워크스페이스 편입 결정은 유지하되 근거를 "불가피"에서 "`^build` 전파가 더 정밀하고 매니페스트 스크립트가 어차피 필요하다"로 바꿉니다 |
| 6 | `03-composition-architecture.md` §6-1 표, `01-project-setup.md` §4 | 정적 자산은 rewrites 2줄이면 끝 | **`public/`과 `/_next/image`는 `assetPrefix`가 안 붙는다**는 행 추가. 대응은 "데모 앱은 `public/`을 쓰지 않는다 + `next/image`는 `unoptimized` 또는 zone별 `images.path` 지정" 정도 |
| 7 | `01-project-setup.md` §3-4 2번, `02-monorepo-options.md` §2-1 표 | `transpilePackages` "명시" | "Turbopack이 워크스페이스 패키지를 자동 트랜스파일하므로 **필수는 아니다**. 명시해도 무해" |
| 8 | `03-composition-architecture.md` §2 표 / 본문 | `partialPrefetching` (키 경로 없음) | **최상위 옵션**임을 명시 (`experimental` 아님). `demo-prefetch`의 결정적 설정을 `cacheComponents: true` + `partialPrefetching: true`로 코드 형태로 적으면 오해가 없습니다 |
| 9 | `03-composition-architecture.md` §2 표 `demo-export` 행, `01-project-setup.md` §3-3 | "셸이든 데모 앱이든 똑같은 6단계" | `output: 'export'` zone은 `next start`가 없다는 예외를 각주로 답니다 |
| 10 | `03-composition-architecture.md` §2 표 `demo-proxy` 행 | `proxy.ts` | `proxy`는 **edge 런타임 미지원**이고 `--src-dir` 프로젝트에서는 **`src/proxy.ts`**라는 점을 덧붙입니다 |
| 11 | `03-composition-architecture.md` §3-3 코드 | `${url}/demo/${slug}/:path*` | `url`이 `undefined`일 때 명시적으로 throw하는 가드 추가 |
| 12 | `nextjs-docs/README.md` 기준 버전 | `16.3.0` | `16.3.1`. 01 §3-1이 예고한 대로 워크스페이스 뼈대 커밋에서 함께 |

**수정이 불필요하다고 확인한 것** (조사 결과 설계가 맞음): 03 §3-3의 "접두사를 벗기지 마세요" 경고 전체, `:path*` 2줄 레시피, `<a>` 대 `<Link>` 규칙, 동일 오리진 분석과 `postMessage` 검증, `outputFileTracingRoot`/`__dirname`, `.env.local` 로딩 시점, `dependsOn: ["^build"]` 캐시 전파, `experimental.serverActions.allowedOrigins` 키 경로, Node/React/pnpm/turbo 버전 표 전부.

## 미해결 / 확인 불가

| 항목 | 상태 |
|---|---|
| `turbo.json`의 `"!.next/dev/**"` | `next@16.3.1`이 `.next/dev/`를 실제로 만드는지 1차 출처로 확인 못 함. 부정 glob이라 틀려도 무해 (**미확인**) |
| 경로형 `assetPrefix` + Turbopack의 16.x 결함 | 경로형에 대한 공개 이슈를 찾지 못했습니다. "없다"가 아니라 **"찾지 못했다"**입니다. 확인된 16.3.0 이슈([#96831](https://github.com/vercel/next.js/issues/96831))는 cross-origin CDN 전용 |
| `demo-export`를 Vercel에 배포했을 때 셸 rewrite 목적지로서의 동작 | 실제 배포로만 확인 가능 (**미검증**) |
| iframe 안에서 `use cache` 데모의 캐시 동작 관찰 | 코드가 없어 검증 불가 (**미검증**) |
| 03 §4-6 `ResizeObserver` + `postMessage` 브릿지의 실제 동작 | 프로토콜 설계는 타당하나 구현 전이라 (**미검증**) |
| Tailwind v4 `@source "../../../../packages/ui"` 경로 4단계 | 디렉토리 배치상 계산은 맞지만, Tailwind v4의 `@source` 상대 경로 규칙을 1차 출처로 확인하지 않았습니다 (**미확인**) |
| `nextjs-docs`의 `.webp` 자산(76개) 서빙 방식 | AGENTS.md가 문제를 정확히 짚고 있으나 해법이 두 가지로 열려 있음 (**미결정**) |

## 총평

**이 설계는 실현 가능합니다.** Multi-Zones의 핵심 — 셸의 `rewrites`, zone별 `assetPrefix`, 접두사를 벗기지 않는 정적 자산 통과, `<a>`를 쓰는 zone 간 이동, 동일 오리진 — 은 1차 출처와 대조했을 때 **틀린 데가 없었고**, 오히려 공식 가이드보다 정확한 부분이 있습니다(`:path*` 2줄, "15 미만용 우회" 경고). `cacheComponents`를 앱 경계로 삼는 판단([ADR 0001](./adr/0001-config-axis-as-app-boundary.md))도 `experimental.ppr`이 실제로 throw하고 `partialPrefetching`이 실제로 `cacheComponents`를 요구한다는 점에서 **소스 수준에서 정당화됩니다.**

틀린 것은 전부 **주변부**입니다: 존재하지 않는 CLI 플래그 하나, catalog 항목 하나 누락, Turborepo 제약 하나의 오해, 그리고 `next dev`의 새 기본 동작 하나. 앞의 셋은 착수 첫 30분 안에 부딪히고, 넷째는 조용히 파일을 고쳐 놓습니다. 착수 전에 **수정 1~4번만 반영하면 나머지는 진행하면서 고쳐도 됩니다.**
