# 03. 결합 구조 설계

- 상위: [nextjs-app 작업 규칙](../AGENTS.md)
- 관련 결정: [ADR 0001](./adr/0001-config-axis-as-app-boundary.md), [0003](./adr/0003-demo-directive-in-markdown.md), [0004](./adr/0004-demo-list-as-source-of-truth.md), [0005](./adr/0005-hide-zone-from-learner-url.md), [0006](./adr/0006-shadcn-ui-as-ui-foundation.md)
- 이어지는 문서: [06. 화면 구성과 UI 설계](./06-ui-and-screen-design.md) — 이 계약 위에 무엇이 그려지는가
- 근거 문서: [2.43 Multi-zones](../../nextjs-docs/2-guides/multi-zones.md)

여러 개의 독립 Next.js 앱이 학습자에게 **하나의 사이트로 보이도록** 결합하는 구조를 정의합니다.

## 1. 전체 그림

학습자는 끝까지 도메인 하나만 봅니다. 뒤에 앱이 몇 개인지 알 필요가 없고, **주소에도 드러나지 않습니다** ([ADR 0005](./adr/0005-hide-zone-from-learner-url.md)).

```
                    학습자 브라우저
                 study.example.com/...
                          │
                          ▼
        ┌──────────────────────────────────────────┐
        │  셸 (@study/shell)               :3000   │
        │  ──────────────────────────────────────  │
        │  · 모든 요청의 정문                       │
        │  · nextjs-docs의 md를 화면에 렌더         │
        │  · /demo/* — 색인과 독립 열람 (셸이 그림) │
        │  · rewrites로 /zone/* 를 넘김             │
        └─────────────────┬────────────────────────┘
                          │  rewrites (주소는 바뀌지 않음)
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  /zone/baseline/*   /zone/cache/*    /zone/prefetch/*  …
  ┌────────────┐    ┌────────────┐    ┌────────────┐
  │ demo-      │    │ demo-cache-│    │ demo-      │
  │ baseline   │    │ components │    │ prefetch   │
  │   :3001    │    │   :3002    │    │   :3003    │
  │cacheComp 끔│    │cacheComp 켬│    │+partialPre│
  └────────────┘    └────────────┘    └────────────┘
```

`rewrites`는 **리다이렉트가 아닙니다.** 브라우저는 이동한 사실을 모르고 주소창도 그대로입니다. 셸이 뒤에서 대신 받아다 전달합니다.

학습자가 보는 주소에는 `/zone/*`이 **한 번도 나타나지 않습니다.** 데모를 독립으로 열어도 주소는 셸의 `/demo/…`이고, 셸이 제목·설명·문서 링크를 그린 뒤 그 안에 데모를 담습니다.

## 2. zone 배분

경계 기준은 **전역 설정 충돌** 하나뿐입니다. 학습 카테고리는 zone 경계가 아닙니다 ([ADR 0001](./adr/0001-config-axis-as-app-boundary.md)).

| zone | 포트 | 내부 경로 | 결정적 설정 | 담는 학습 문서 | 상태 |
|---|:---:|---|---|---|:---:|
| `shell` | 3000 | `/*` | 기본값 + rewrites 소유 | (문서 전체 렌더링) | **1차 생성** |
| `demo-baseline` | 3001 | `/zone/baseline/*` | `cacheComponents` 끔 | 1.x 대부분, 2.4 Caching(Previous), 2.6 ISR, 2.13~2.17 | **1차 생성** |
| `demo-cache-components` | 3002 | `/zone/cache/*` | `cacheComponents: true` | 2.7, 2.8, 2.10, 3.4.3~3.4.5 | **1차 생성** |
| `demo-prefetch` | 3003 | `/zone/prefetch/*` | `cacheComponents: true` + `partialPrefetching: true` (둘 다 **최상위**) | 2.9, 2.18~2.20 | 설계만 |
| `demo-export` | 3004 | `/zone/export/*` | `output: 'export'` — **`next start` 없음** [^export] | 정적 내보내기 제약 | 설계만 |
| `demo-proxy` | 3005 | `/zone/proxy/*` | `src/proxy.ts`, `basePath`, `i18n` [^proxy] | 1.16, 2.16, 3.5.1 옵션 | 설계만 |

**"담는 학습 문서" 열은 목표이지 계약이 아닙니다.** 어느 데모가 어느 zone에 속하는지는 `demos.yaml`의 `zone` 필드가 정합니다. 이 표는 그 배분의 의도를 설명할 뿐이고, 데모를 다른 zone으로 옮겨도 학습자 URL은 바뀌지 않습니다 ([ADR 0005](./adr/0005-hide-zone-from-learner-url.md)).

[^export]: 산출물이 `out/` 정적 파일이고 서버가 없어 [01. 구성 절차 3-3](./01-project-setup.md)의 ④ `next start`가 이 zone에서만 성립하지 않습니다. 로컬에서 셸의 rewrite 목적지를 살리려면 별도 정적 서버가 필요합니다.
[^proxy]: `--src-dir`로 만든 앱이므로 파일 위치는 `src/proxy.ts`입니다. 그리고 `proxy`는 **edge 런타임을 지원하지 않습니다** — `middleware.ts`는 deprecated지만 여전히 동작하므로, edge 런타임 자체가 학습 주제라면 그쪽을 함께 다뤄야 합니다.

### zone에는 이름이 두 개다

혼동을 막기 위해 구분해서 부릅니다. **둘은 다른 값이며 서로 대체할 수 없습니다.**

| 이름 | 쓰이는 곳 | 예 |
|---|---|---|
| **앱 이름** | 폴더명 `nextjs-app/apps/{앱이름}/`, 패키지명 `@study/{앱이름}`, Vercel Root Directory | `demo-cache-components` |
| **슬러그** | 내부 라우트 `/zone/{슬러그}/*`, 자산 `/demo-static/{슬러그}/*`, 라우트 폴더 `src/app/zone/{슬러그}/`, 환경변수 `ZONE_{슬러그 대문자}_URL`, `demos.yaml`의 `zone` 필드 | `cache` |

앱 이름은 **무엇을 실증하는 앱인지**를 드러내야 하므로 길어도 됩니다. 슬러그는 **학습자에게 노출되지 않습니다** — 내부 경로와 자산 경로에만 쓰입니다.

앱 이름을 슬러그 자리에 쓰면(`src/app/zone/demo-cache-components/`) 셸의 rewrites와 어긋나 **그 zone이 사이트에서 통째로 사라집니다.** 화면에 오류가 뜨지 않고 그냥 404가 나므로 원인을 찾기 어렵습니다.

### 왜 이렇게 갈렸는가

**`cacheComponents`가 최대 분기점입니다.** Next.js 16에서 이 옵션은 `experimental.ppr`을 대체했습니다 — `experimental.ppr`은 이제 에러를 던지고, `cacheComponents: true`가 PPR을 **포함**합니다. 그리고 `use cache` 지시자와 `cacheLife`·`cacheTag` API도 여기 딸려 옵니다. 즉 **PPR은 독립된 축이 아니라 `cacheComponents`의 일부**입니다. 이 하나의 스위치가 캐싱·렌더링·프리페치 문서군 전체를 두 세계로 가릅니다.

**`partialPrefetching`은 `cacheComponents: true`를 전제**로 하므로 3번째 zone은 2번째의 확장입니다. 전제를 어기면 config 검증 단계에서 throw합니다. 그럼에도 분리한 이유는, 프리페치 문서(2.18~2.20)가 **켠 상태와 끈 상태의 대조**를 보여줘야 하기 때문입니다.

> `partialPrefetching`은 16.3.0에서 도입된 **최상위** 옵션입니다(`experimental` 아래가 아닙니다). 최상위 config 스키마는 `z.strictObject`라 `experimental.partialPrefetching`으로 잘못 넣으면 조용히 무시되지 않고 검증 에러가 납니다. `cacheComponents`도 마찬가지로 최상위이며, `experimental.cacheComponents`는 deprecated 별칭입니다 ([04. 검증 §1·§4](./04-feasibility-verification.md)).
>
> 타입은 `boolean | 'unstable_eager'`입니다(`config-shared.d.ts:1553`). 이 zone은 프리페치의 **대조**를 보여주는 곳이므로, `true`와 `'unstable_eager'`의 차이도 데모 대상이 됩니다.

**`output: 'export'`는 서버 기능 전부와 상호 배타**라 반드시 격리됩니다.

**`demo-proxy`가 격리돼야 하는 이유는 미묘합니다.** `proxy.ts`와 `basePath`는 요청 경로를 바꿉니다. 셸은 그 자체가 거대한 rewrites 덩어리이므로, 셸 안에서 proxy를 실증하면 **둘 중 무엇이 경로를 바꿨는지 학습자도 개발자도 구분할 수 없습니다.**

### 셸에는 데모를 두지 않는다

두 가지 이유입니다.

1. **셸이 죽으면 사이트 전체가 죽습니다.** 데모는 일부러 실패시키는 실험(에러 바운더리, 캐시 미스, 잘못된 설정)을 포함하는데, 그걸 정문에 두면 문서까지 같이 넘어집니다.
2. **문서 페이지가 자기 자신을 iframe으로 삽입하는** 구조가 됩니다.

## 3. 라우팅 계약

### 3-1. 경로 규칙

경로는 **학습자가 보는 것**과 **내부용** 두 층으로 나뉩니다.

| 층 | 종류 | 형식 | 예 | 소유 |
|---|---|---|---|---|
| 학습자 | 문서 | `/{카테고리}/{하위그룹}/{파일명}` | `/getting-started/caching` | 셸 |
| 학습자 | 데모 색인 | `/demo` | `/demo` | 셸 |
| 학습자 | 데모 독립 열람 | `/demo/{문서 파일명}/{데모명}` | `/demo/caching/use-cache-basic` | 셸 |
| 내부 | 데모 본체 | `/zone/{슬러그}/{문서 파일명}/{데모명}` | `/zone/cache/caching/use-cache-basic` | 데모 앱 |
| 내부 | 데모 정적 자산 | `/demo-static/{슬러그}/*` | `/demo-static/cache/_next/...` | 데모 앱 |

**한 경로는 정확히 하나의 zone에만 속합니다.** 두 zone이 같은 경로를 주장하면 라우팅이 충돌합니다.

정적 자산 경로를 페이지 경로와 **다른 접두사**로 분리한 이유: 모든 zone이 자기 `_next/`를 갖는데, 접두사가 없으면 서로 덮어씁니다.

### 문서 URL은 md 경로를 미러링한다

`nextjs-docs`의 md 경로에서 **번호 접두사만 제거하고 그대로** 씁니다.

```
nextjs-docs/{카테고리}/{하위그룹}/{파일명}.md  →  /{카테고리}/{하위그룹}/{파일명}
```

- 각 경로 세그먼트에서 `/^\d+(\.\d+)*-/`(`1-`, `2.15-`, `3.1.21-`, `3.5.1-`)를 제거합니다
- `README.md`는 세그먼트를 만들지 않고 **그 폴더 자체의 인덱스**가 됩니다

| md 경로 | 학습자 URL |
|---|---|
| `1-getting-started/caching.md` | `/getting-started/caching` |
| `1-getting-started/README.md` | `/getting-started` |
| `2-guides/2.15-client-side-data-fetching/swr.md` | `/guides/client-side-data-fetching/swr` |
| `3-api-reference/3.4-directives/use-cache.md` | `/api-reference/directives/use-cache` |
| `3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md` | `/api-reference/config/next-config-js/turbopack` |
| 루트 `README.md` | `/` |

**번호를 뺀 이유**는 [nextjs-docs ADR 0002](../../nextjs-docs/docs/adr/0002-reorder-learning-sequence.md)가 학습 순서 재배열을 허용하기 때문입니다. 번호가 URL에 있으면 재배열할 때마다 모든 문서 링크와 학습자 북마크가 깨집니다. 세그먼트의 의미 부분(`getting-started`, `directives`)은 움직이지 않습니다.

**폴더 경로를 유지한 이유**는 리프 md 파일명이 11건 중복되기 때문입니다(아래 소절). 데모 URL처럼 파일명만 쓰면 즉시 충돌합니다.

덤으로 결과 URL이 공식 문서(`nextjs.org/docs/app` + 같은 경로)와 1:1로 대응해, 학습자가 원문과 대조하기 쉽고 각 문서 상단의 공식 링크를 기계적으로 검증할 수 있습니다.

| 항목 | 규칙 |
|---|---|
| 대소문자 | **파일명 그대로 보존**합니다 — `3.3-functions/cacheLife.md` → `/api-reference/functions/cacheLife`. `next.config.js` 옵션 65개와 함수 문서 대부분이 camelCase이고 공식 문서 URL도 같은 표기를 씁니다 |
| trailing slash | 없음 (Next.js 기본값 `trailingSlash: false` 유지) |
| URL을 만들지 않는 것 | `nextjs-docs/docs/`(ADR), 모든 `assets/`, 루트의 `AGENTS.md`·`CLAUDE.md`·`CONTEXT.md`·`PROGRESS.md`·`TRANSLATION.md` |
| 예약 세그먼트 | 최상위 `demo`·`zone`·`demo-static`은 셸과 데모 앱이 소유합니다. 카테고리 폴더 이름으로 쓸 수 없습니다 |

따라오는 셸 라우트 구조입니다. 정적 세그먼트가 catch-all보다 먼저 매칭되므로 `/demo`와 충돌하지 않습니다.

```
apps/shell/src/app/
├─ page.tsx                 → /            (루트 README.md)
├─ [...slug]/page.tsx       → 나머지 문서 전부
│                             generateStaticParams가 docs-manifest의 경로를 전부 생성
└─ demo/…                   → 색인과 독립 열람 (4-3)
```

이 규칙을 md 292개에 적용하면 **284개 URL이 충돌 없이** 생성됩니다. 검사는 lint가 맡습니다 — ① 번호 제거 후 URL이 겹치는 md가 없는가, ② 카테고리 폴더가 예약 세그먼트를 쓰지 않는가 ([05. A-6](./05-open-questions.md)).

### 학습자 URL이 유일해야 한다

`/demo/{문서 파일명}/{데모명}`에는 zone이 없으므로, 문서 파일명이 전역에서 유일해야 합니다. **11건이 중복됩니다** — `cacheLife`, `draft-mode`, `forbidden`, `headers`, `images`, `instrumentation`, `not-found`, `proxy`, `turbopack`, `typescript`, `unauthorized`. 전부 개념 문서 ↔ API 레퍼런스 또는 함수 ↔ 설정 옵션 쌍입니다.

해당 데모는 `demos.yaml`에서 URL을 **명시 선언**하고, lint가 전체 유일성을 검사합니다.

```yaml
- url: proxy/basic          # 1-getting-started/proxy.md
- url: proxy-file/basic     # 3.1-file-conventions/proxy.md
- url: forbidden-file/basic
- url: forbidden-fn/basic
```

문서 **파일명**을 첫 세그먼트로 삼는 이유는 안정성입니다. 카테고리 폴더에는 번호가 붙어 있고 학습 순서 재배열이 허용되므로 순번(`2.7`)은 움직이지만, 리프 md 파일명은 움직이지 않습니다.

### 3-2. 데모 앱 쪽 설정

```ts
// nextjs-app/apps/demo-cache-components/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,              // ← 이 zone의 존재 이유 (최상위 옵션)
  assetPrefix: '/demo-static/cache',  // ← 자산 충돌 방지
  images: { unoptimized: true },      // ← /_next/image에는 assetPrefix가 안 붙는다 (6-1)
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.PUBLIC_ORIGIN ?? 'localhost:3000'],
    },
  },
}

export default nextConfig
```

라우트는 `src/app/zone/cache/` 아래에 실제로 중첩해서 둡니다. `basePath`로 처리하지 않는 이유는 6-3에 있습니다.

**밑줄을 붙여 `_zone`으로 만들면 안 됩니다.** App Router에서 `_folder`는 폴더와 하위 전체를 라우팅에서 제외합니다 — 그 zone의 데모가 전부 404가 됩니다. `%5Fzone`으로 우회할 수 있지만 디스크의 폴더 이름이 `%5Fzone`이 되어, Next.js를 가르치는 저장소에서 설명하기 나쁩니다 ([ADR 0005](./adr/0005-hide-zone-from-learner-url.md)).

**데모 앱은 chrome을 그리지 않습니다.** 제목·설명·"문서로 돌아가기"는 전부 셸이 그립니다. 데모 앱의 페이지는 독립 열람에서 보든 랜딩 히어로에서 보든 **언제나 한 가지 모습**입니다. 이렇게 나눈 이유는 4-3에 있습니다.

**데모 앱에는 `public/`을 두지 않습니다.** `assetPrefix`는 `_next/static`에만 붙고 `public/`의 파일과 `/_next/image`에는 붙지 않기 때문에, 이 두 경로는 셸의 rewrites 2줄로 덮이지 않습니다. 데모에 이미지가 필요하면 셸의 `public/`에 두고 절대 경로로 참조하거나, 위처럼 `unoptimized`로 최적화 엔드포인트를 우회합니다 (6-1 표).

### 3-3. 셸 쪽 설정

```ts
// nextjs-app/apps/shell/next.config.ts
import path from 'node:path'
import type { NextConfig } from 'next'

// 값이 없으면 destination이 "undefined/demo/..."가 되어 원인을 알기 어려운 실패가 된다.
// 여기서 즉시 끊는다.
function zoneUrl(name: string): string {
  const url = process.env[name]
  if (!url) {
    throw new Error(
      `[shell] 환경변수 ${name}가 없습니다. .env.local(로컬) 또는 배포 환경변수를 확인하세요.`,
    )
  }
  return url
}

const zones = [
  { slug: 'baseline', url: zoneUrl('ZONE_BASELINE_URL') },
  { slug: 'cache',    url: zoneUrl('ZONE_CACHE_URL') },
]

const nextConfig: NextConfig = {
  // nextjs-docs의 md를 배포 산출물에 포함시키기 위해 tracing 기준을 워크스페이스 루트로
  outputFileTracingRoot: path.join(__dirname, '../../../'),

  async rewrites() {
    return zones.flatMap(({ slug, url }) => [
      // 1. 데모 본체 — 내부 경로. 학습자 주소에는 나타나지 않는다
      {
        source: `/zone/${slug}/:path*`,
        destination: `${url}/zone/${slug}/:path*`,
      },
      // 2. 데모 정적 자산 — 경로를 그대로 보존해서 전달한다
      {
        source: `/demo-static/${slug}/:path*`,
        destination: `${url}/demo-static/${slug}/:path*`,
      },
    ])
  },
}

export default nextConfig
```

**정적 자산 rewrite는 경로를 벗기지 않고 그대로 넘깁니다.** `assetPrefix: '/demo-static/cache'`를 선언한 zone은 자기 자산을 `/demo-static/cache/_next/...` 경로에서 **직접 서빙**합니다. 브라우저가 요청하는 경로와 zone이 서빙하는 경로가 같으므로, 셸은 중간에서 접두사를 손댈 필요 없이 통과시키기만 하면 됩니다.

> **접두사를 벗기지 마세요.** `/demo-static/{슬러그}/_next/:path*` → `${url}/_next/:path*` 형태의 rewrite를 본 적이 있다면 그건 **Next.js 15 미만용 우회**이고, 그마저도 셸이 아니라 zone 자신의 config에 `beforeFiles`로 넣던 것입니다. Next.js 15부터는 필요하지 않습니다. 16에서 이 형태를 쓰면 zone이 서빙하지 않는 경로를 때리게 되어, 6-1 표의 "데모 화면의 CSS·JS가 404"를 그대로 재현합니다.

셸이 소유하는 `/demo/*`(색인·독립 열람)와 데모 앱이 소유하는 `/zone/*`은 **다른 단어**라 rewrite 규칙과 셸 라우트가 겹치지 않습니다. `/demos`와 `/demo`처럼 한 글자 차이로 두면, 오타가 404가 아니라 **다른 앱이 응답**하는 것으로 나타나 원인을 찾기 어렵습니다.

**목적지를 환경변수로 두는 것이 로컬↔배포 전환의 전부입니다.**

```
# 로컬 (.env.local)
ZONE_BASELINE_URL=http://localhost:3001
ZONE_CACHE_URL=http://localhost:3002

# Vercel (프로젝트 환경변수)
ZONE_BASELINE_URL=https://study-baseline.vercel.app
ZONE_CACHE_URL=https://study-cache.vercel.app
```

배포로 넘어갈 때 **코드는 한 글자도 바뀌지 않습니다.**

> 모듈 최상위에서 `process.env`를 읽어도 되는 이유: Next.js는 사용자 `next.config`를 **평가하기 전에** `@next/env`의 `loadEnvConfig`를 호출하므로, config 파일이 실행되는 시점에 `.env.local`이 이미 로드돼 있습니다 ([04. 검증 §15-f](./04-feasibility-verification.md)).

## 4. 문서와 데모를 잇는 계약

### 4-1. 데모 목록 — 단일 원본

어떤 데모가 존재하는지는 `nextjs-app/packages/demos/demos.yaml`(`@study/demos`) 한 곳에서만 정해집니다 ([ADR 0004](./adr/0004-demo-list-as-source-of-truth.md)).

```yaml
- url: caching/use-cache-basic      # 학습자 주소 = /demo/caching/use-cache-basic
  title: use cache 기본 동작
  doc: 1-getting-started/caching.md
  zone: cache
  status: done                      # stub | wip | done

- url: caching/no-cache-baseline    # 같은 문서의 대조짝
  title: 캐시 없이 같은 페이지
  doc: 1-getting-started/caching.md
  zone: baseline
  status: wip
```

| 필드 | 필수 | 의미 |
|---|:---:|---|
| `url` | ✅ | 학습자 주소에서 `/demo/` 뒤에 붙는 부분. 전역에서 유일해야 함 |
| `title` | ✅ | 색인·독립 열람 화면·문서 하단 목록에 쓰는 이름 |
| `doc` | ✅ | 근거 문서의 `nextjs-docs` 기준 경로. 색인 정렬과 문서 하단 목록의 조인 키 |
| `zone` | ✅ | 이 데모를 실행하는 zone 슬러그. **학습자에게 노출되지 않음** |
| `status` | ✅ | `stub`(주소만 정함) / `wip`(만드는 중) / `done`(공개) |
| `featured` | | 랜딩 히어로에 띄울 대표 데모. **전체에서 최대 1개**, `status: done`이어야 함 ([06. 2-2](./06-ui-and-screen-design.md)) |

**`status`가 노출을 제어하는 유일한 스위치입니다.** `done`이 아니면 색인에도, 문서 하단 목록에도, 본문 링크 카드에도, 검색 결과에도 나타나지 않습니다. 학습자는 도달할 방법이 없고, 개발자만 주소를 직접 쳐서 봅니다.

`demos.yaml`은 **개발자 대시보드를 겸합니다.** 진행 상황이 grep과 diff에 남으므로 브라우저용 진행 화면을 따로 만들지 않습니다.

### 4-2. 데모 지시자 — 본문 링크 위치

문서 본문 특정 지점에 데모로 가는 링크를 놓고 싶을 때만 `demo` 코드펜스를 둡니다 ([ADR 0003](./adr/0003-demo-directive-in-markdown.md)). **데모의 존재를 만들지는 않습니다** — 목록에 이미 있는 데모를 본문 어디에서 가리킬지만 정합니다.

> **문서 본문에는 데모를 심지 않습니다.** 지시자가 그리는 것은 iframe이 아니라 **링크 카드**입니다 ([06. 3-2](./06-ui-and-screen-design.md)). 데모는 항상 `/demo/…`로 이동해서 봅니다.

````markdown
`use cache`를 붙인 함수는 결과가 캐시되어 다음 요청에서 재사용됩니다.

```demo
path: caching/use-cache-basic
caption: 새로고침해도 타임스탬프가 그대로인지 확인
```

캐시 항목의 수명은 `cacheLife`로 정합니다.
````

| 필드 | 필수 | 의미 |
|---|:---:|---|
| `path` | ✅ | `demos.yaml`의 `url`과 같은 값 |
| `caption` | | 학습자에게 무엇을 관찰하라고 지시하는 한 줄. 카드 부제로 그려짐 |

`mode`와 `height`는 **삭제된 필드**입니다. 본문 임베드가 없어지면서 쓸 자리가 사라졌습니다. lint가 남아 있는 것을 잡습니다 ([06. 3-4](./06-ui-and-screen-design.md)).

`zone` 필드가 없습니다. 목록이 zone을 알고 있으므로 여기 적을 이유가 없고, 적으면 데모를 다른 zone으로 옮길 때 고칠 곳이 하나 늘어납니다.

**GitHub에서 이 md를 열면 그냥 코드 블록으로 보입니다.** 아무것도 깨지지 않고, 데모가 어디에 있는지도 읽힙니다. `nextjs-docs`가 순수 마크다운이라는 성질이 유지됩니다.

### 4-3. 셸이 chrome을 그린다

데모는 **언제나 독립 열람**으로 봅니다 ([06. 3-2](./06-ui-and-screen-design.md)). 그런데 같은 데모가 두 문맥에서 쓰입니다 — 독립 열람에서는 제목·설명·"문서로 돌아가기"가 필요하고, 랜딩 히어로의 대표 데모([06. 2-2](./06-ui-and-screen-design.md))에서는 그게 전부 중복입니다.

**이 분기를 데모 앱이 하지 않습니다.** 데모 앱은 언제나 순수 데모 하나만 그리고, chrome은 셸이 씌웁니다.

```
셸 소유
  /demo                              색인 (done만, 학습 순서)
  /demo/caching/use-cache-basic      독립 열람
       └ 제목 · 설명 · "문서로" · iframe
  /getting-started/caching           문서
       └ 지시자 자리에 iframe
       └ 하단 "이 문서의 데모" (자동 생성)

데모 앱 소유
  /zone/cache/caching/use-cache-basic
       └ 순수 데모. chrome 없음. 한 가지 모습
```

`?embed=1` 같은 쿼리로 데모 앱이 분기하게 만들면 안 됩니다. 동봉 문서가 `searchParams`를 `cookies()`·`headers()`와 같은 **런타임 의존 데이터**로 규정하므로, 캐싱을 실증하는 것이 존재 이유인 zone에서 페이지가 chrome 결정 때문에 런타임 의존이 됩니다. 실험 장치가 실험 대상을 오염시킵니다.

### 4-4. 문서에서 데모를 발견하는 경로

지시자가 없는 독립 데모는 본문에 흔적이 없습니다. 그대로 두면 문서를 읽는 사람이 그 데모의 존재를 모릅니다.

셸이 문서 페이지 **하단에 "이 문서의 데모" 목록을 자동으로 붙입니다.** `demos.yaml`의 `doc` 필드로 조인하므로 md는 손대지 않고, 데모를 추가해도 문서를 고칠 필요가 없습니다.

```
/getting-started/caching

  …문서 본문…
  [지시자 자리에 링크 카드]      ← 본문에서 가리킨 것
  …문서 본문…

  ─────────────────────
  이 문서의 데모                ← 셸이 생성
   → use cache 기본 동작
   → 캐시 없이 같은 페이지(대조)
```

### 4-5. 처리 파이프라인

```
nextjs-docs/**/*.md          packages/demos/demos.yaml
        │                              │
        │ ① @study/docs build          │ ② @study/demos build
        ▼   목차 트리(카테고리 README의  ▼   검증 + 색인용 매니페스트
   docs-manifest.json          demos-manifest.json
   (순번·제목·경로)                (url·title·doc·zone·status)
        │                              │
        └──────────┬───────────────────┘
                   │  doc 필드로 조인
                   ▼
        ③ 셸이 렌더 (@study/docs-render)
           · 문서 본문의 demo 코드펜스 → <DemoLink path="…" />
           · 문서 하단 "이 문서의 데모"
           · /demo 색인 (학습 순서 정렬)
                   │
                   ▼
        ④ <a href="/demo/caching/use-cache-basic">  ← 링크 카드. iframe 아님
                   │
                   ▼
        ⑤ 셸의 독립 열람 페이지가 chrome을 그리고 그 안에 iframe
                   │
                   ▼
        ⑥ 셸의 rewrites가 가로채 → demo-cache-components 앱이 응답
```

목차 트리의 **순서**는 각 카테고리 `README.md`의 `## 학습 순서` 섹션에서 나옵니다 — 순번·제목·파일 링크가 이미 거기 있고, 셸의 문서 내비게이션도 같은 것을 씁니다.

**iframe이 등장하는 곳은 ⑤ 하나뿐입니다.** 문서 페이지에는 iframe이 없습니다 ([06. 3-2](./06-ui-and-screen-design.md)). 유일한 예외는 랜딩 히어로의 대표 데모입니다 ([06. 2-2](./06-ui-and-screen-design.md)).

### 4-6. 데모 iframe 동적 높이 조절 프로토콜

**적용 범위는 독립 열람(4-3의 `/demo/…`) 한 곳뿐입니다.** 문서 본문에는 iframe이 없고([06. 3-2](./06-ui-and-screen-design.md)), 랜딩 히어로의 대표 데모는 CLS를 막기 위해 **고정 높이**를 쓰므로 이 브릿지를 쓰지 않습니다([06. 2-2](./06-ui-and-screen-design.md)).

독립 열람 화면 내부에서 아코디언, 탭 전환, 폼 에러 노출 등으로 콘텐츠 높이가 바뀔 때 내부 스크롤바가 생기거나 잘리지 않도록 `ResizeObserver` + `postMessage` 브릿지를 둡니다.

1. **데모 앱(`@study/demo-kit`의 공통 데모 래퍼)**:
   - `ResizeObserver`로 `document.body.scrollHeight`를 감지
   - 부모 윈도우로 크기 변경 메시지 전송:
     ```ts
     window.parent.postMessage(
       { type: 'DEMO_RESIZE', height: document.body.scrollHeight },
       window.location.origin,   // ← '*' 금지. 6-5대로 모든 zone이 동일 오리진이다
     )
     ```
2. **셸(`@study/docs-render`의 `<DemoFrame />`)**:
   - `window.addEventListener('message', ...)`로 수신하되, **`event.origin === window.location.origin`과 `event.source === iframe.contentWindow`를 확인한 뒤에만** 반영합니다. 확인 없이 받으면 페이지 안 다른 프레임이 보낸 메시지로도 높이가 바뀝니다
   - 검증을 통과하면 iframe의 `style.height`를 실시간 동기화
   - 첫 렌더의 초기 높이는 셸이 정한 상수를 씁니다. `md`에서 오지 않습니다 — `height` 필드는 4-2에서 삭제됐습니다

### 4-7. 데모는 URL에 상태를 담지 않는다

여러 라우트를 오가는 데모가 있습니다 — 1.3 Layouts and Pages, 1.4 Linking and Navigating, 그리고 **`demo-prefetch` zone은 존재 이유 자체가 내비게이션**입니다. 프리페치를 실증하려면 링크를 눌러 다른 라우트로 가야 합니다.

이때 iframe 안에서만 주소가 바뀌고 셸 주소는 그대로입니다. **새로고침하면 처음으로 돌아갑니다.**

이걸 고치지 않고 **설계 원칙으로 못 박습니다.**

> **데모는 URL에 상태를 담지 않는다.** 항상 초기 상태에서 시작하고, 내부 이동은 iframe 안에서만 일어난다.

데모로서는 오히려 장점입니다 — 누가 열어도 같은 출발점이라 **재현이 보장**됩니다. 프리페치 관찰은 Network 패널로 하므로 iframe 안에서도 그대로 됩니다. 대신 데모 중간 상태를 북마크하거나 공유할 수는 없습니다.

`demos.yaml`의 `url`은 그 데모의 **진입점**입니다. 여러 라우트를 쓰는 데모도 항목은 하나이고, 하위 라우트는 진입점 아래에 중첩합니다. lint는 진입점만 검사합니다.

### 4-8. 데모가 스스로 기대값을 보여준다

데모는 실행 코드라 문서보다 훨씬 잘 깨집니다. 기준 버전이 올라가면 `use cache` 계열 데모 여러 개가 **조용히 다른 동작**을 보일 수 있습니다. 틀린 데모는 없는 데모보다 나쁩니다 — 학습자가 틀린 것을 확신을 갖고 배웁니다.

그래서 데모 화면 자체가 기대와 실제를 나란히 표시합니다.

```
┌────────────────────────────────┐
│ 기대   새로고침해도 값이 유지됨   │
│ 실제   12:04:31 (3회 동일)  ✓   │
└────────────────────────────────┘
```

학습 문서의 "예제에서 관찰할 결과" 섹션이 이미 요구하는 것이라 학습자에게도 유익하고, 동시에 **회귀 탐지기**가 됩니다. CI 스모크는 `done` 데모를 전부 방문해 200 응답과 화면에 `✗`가 없는 것만 확인하면 됩니다.

기준 버전을 올릴 때는 문서뿐 아니라 **`done` 데모도 재검토 대상**입니다.

## 5. 내비게이션 설계

**셸이 chrome을 그리기로 하면서(4-3) 학습자의 이동은 전부 셸 안에서 일어나게 됐습니다.** 문서에서 데모 독립 열람으로 가는 것도 셸 → 셸이므로 `<Link>` soft navigation이 그대로 됩니다. zone 경계는 iframe이 로드될 때만 넘고, 그건 내비게이션이 아닙니다.

| 이동 | 성격 | 사용 요소 |
|---|---|---|
| 문서 → 문서 | soft navigation | `<Link>` |
| 문서 → 데모 색인·독립 열람 | soft navigation (둘 다 셸) | `<Link>` |
| 데모 → 문서 (chrome의 "문서로") | soft navigation. chrome은 셸이 그림 | `<Link>` |
| iframe 안 데모의 내부 이동 | 데모 앱 안에서만. 셸 주소는 안 바뀜 (4-7) | 데모 앱의 `<Link>` |

**그럼에도 `<a>` 규칙은 남습니다.** 데모 앱 코드에서 셸 경로(`/guides/…`, `/demo/…`)로 링크하면 zone 경계를 넘으므로 `<Link>`가 아니라 `<a>`여야 합니다. 다만 이 설계에서는 그럴 일이 거의 없습니다 — 데모 앱은 chrome을 그리지 않으므로 문서로 돌아가는 링크를 가질 이유가 없습니다.

### 잃은 것 하나

이전 설계에서는 "학습자가 문서와 데모를 오가는 동작 자체가 2.43 Multi-zones의 데모"였습니다. 이제 그 이동이 soft navigation이 되면서 **그 공짜 데모가 사라졌습니다.**

2.43은 `demos.yaml`에 자기 데모를 따로 가져야 합니다. 예를 들어 셸 경로와 zone 경로를 각각 `<Link>`와 `<a>`로 눌러보며 Network 패널의 차이를 관찰하는 데모입니다. 이건 오히려 더 정확합니다 — 이전에는 학습자가 우연히 겪는 것에 기댔지만, 이제는 대조를 의도적으로 보여줍니다.

## 6. 함정 목록

구현 전에 알고 있어야 나중에 헤매지 않는 것들입니다.

### 6-1. 배포에서만 드러나는 것 (로컬에서 100% 정상)

| 증상 | 원인 | 대응 |
|---|---|---|
| 배포된 사이트에서 문서가 안 보임 | `outputFileTracingRoot` 미설정 → 산출물에 md 누락 | 3-3의 설정. 첫 배포 검증에서 확인 |
| 데모 화면의 CSS·JS가 404 | `assetPrefix` 누락 또는 셸의 자산 rewrite 누락 | 3-1·3-2. zone 추가 시 **rewrites는 2줄**, 정적 자산은 경로를 벗기지 말고 통과 |
| 데모의 `public/` 파일과 `next/image` 이미지만 404 | **`assetPrefix`는 `_next/static`에만 붙습니다.** `public/`의 파일(`/logo.svg`)과 이미지 최적화 엔드포인트(`/_next/image`)에는 붙지 않아 rewrites 2줄에 걸리지 않음 | 데모 앱에 `public/`을 두지 않고, `next/image`는 `images: { unoptimized: true }` 또는 zone별 `images.path` 지정 (3-2) |
| Server Action이 거부됨 | 사용자에게 보이는 origin과 zone의 실제 origin이 다름 | `serverActions.allowedOrigins`에 셸 도메인 등록 |
| 문서 이미지가 안 보임 | `nextjs-docs/*/assets/*.webp`는 md 상대 경로만으로 브라우저에서 해석되지 않음 | 셸에 자산 라우트 핸들러를 두거나 빌드 시 `public/`으로 복사 |
| `done`인데 데모 자리가 비어 있음 | 셸과 데모 앱이 **독립 배포**라 빌드 완료 시점이 다름. 데모 앱 빌드가 실패하면 공백이 무기한 | 6-7 참고. 데모 앱의 `not-found`가 iframe 안에서 읽힐 폴백을 그림 |

로컬에서 전부 통과하는 문제들이라 **셸 + 데모 1개 시점의 1회 배포 검증**이 반드시 필요합니다 ([01. 구성 절차 3-7](./01-project-setup.md)).

### 6-2. md를 고쳐도 사이트가 안 바뀜

`@study/docs`가 워크스페이스 패키지가 아니거나 build 태스크가 없으면, turbo가 md 변경을 감지하지 못하고 캐시된 옛 결과를 내놓습니다. 원인이 코드에 없어서 찾기 어려운 종류의 문제입니다. 근거와 대응은 [01. 구성 절차 3-1, 3-5](./01-project-setup.md)에 있습니다.

### 6-3. `basePath`를 경로 접두사로 쓰지 않는 이유

`basePath: '/demo/cache'`를 쓰면 라우트를 `src/app/` 바로 아래에 둘 수 있어 더 깔끔해 보입니다. 그래도 실제 폴더 중첩을 택한 이유는 두 가지입니다.

1. `basePath`는 `assetPrefix`와 자산 경로를 두고 상호작용합니다. zone마다 둘을 동시에 다루면 자산 404의 원인을 좁히기 어려워집니다.
2. **`basePath` 자체가 `demo-proxy` zone의 학습 주제입니다.** 모든 zone이 이미 basePath를 쓰고 있으면, 그걸 가르치는 데모가 "이미 켜져 있는 것"을 설명해야 하는 이상한 상황이 됩니다.

### 6-4. 포트가 고정돼야 하는 이유

셸의 rewrites 목적지가 `localhost:3002`로 고정돼 있는데 데모 앱이 다른 포트를 잡으면, 그 zone은 통째로 502가 됩니다. dev 스크립트에 `--port`를 명시합니다.

### 6-5. 동일 오리진(Same-Origin) 환경의 Cookie / LocalStorage 오염

셸의 rewrites를 통해 모든 zone이 단일 도메인(`localhost:3000` 또는 `study.example.com`)으로 서비스되므로, 브라우저 입장에서는 **모든 데모 앱과 셸이 동일 오리진**입니다.

- **위험**: 특정 데모 앱(인증, 미들웨어, 테마 등)에서 `document.cookie = "token=..."` 또는 `localStorage.setItem("theme", ...)`처럼 범용 키를 사용하면 다른 데모 앱이나 셸의 상태가 덮어씌워질 수 있습니다.
- **대응 규칙**: 데모 앱에서 사용하는 모든 스토리지 키와 쿠키는 반드시 `demo_{슬러그}_*` 접두사를 붙여 네임스페이스를 격리합니다 (예: `demo_cache_auth_token`, `demo_baseline_theme`). 쿠키는 접두사에 더해 `Path=/zone/{슬러그}`로 스코프를 좁히면 다른 zone에 아예 전송되지 않습니다.

### 6-6. 같은 zone 안 데모끼리 캐시가 서로를 지운다

6-5보다 잡기 어려운 문제입니다. **캐시 태그는 앱 전역이고 스코프가 없습니다.**

> `revalidateTag` — "purges **every cache entry tagged** `'my-data'`"
> — 동봉 문서 `03-api-reference/04-functions/cacheTag.md:68`

같은 zone의 데모 A가 `revalidateTag('posts')`를 부르면 `'posts'`를 쓰는 데모 B의 캐시도 같이 날아갑니다. 그리고 `demo-cache-components` zone에서는 **거의 모든 데모가 캐시를 씁니다** — `posts`, `data`, `user` 같은 이름이 겹칠 게 뻔합니다.

증상이 고약합니다. 학습자는 "캐시되어 값이 유지된다"고 배운 화면에서 값이 바뀌는 걸 봅니다. **틀린 것을 배웁니다.** `cacheLife` 커스텀 프로파일도 `next.config`에 이름으로 정의하므로 zone 전체가 이름 공간 하나를 나눠 씁니다.

- **대응 규칙**: 캐시 태그와 `cacheLife` 프로파일 이름에 **데모 URL을 접두사로** 붙입니다. `demos.yaml`의 `url`에서 `/`를 `-`로 바꾼 값을 씁니다.

  ```ts
  async function getPosts() {
    'use cache'
    cacheTag('caching-use-cache-basic:posts')
    // …
  }

  // Server Action
  revalidateTag('caching-use-cache-basic:posts')
  ```

  **API는 감싸지 않습니다.** 학습자가 데모 코드에서 진짜 `cacheTag`·`revalidateTag`를 그대로 봐야 합니다 — 헬퍼로 가리면 학습 저장소에서 비싼 대가를 치릅니다. 접두사는 눈에 보이는 규약이고, lint가 접두사 없는 태그를 잡습니다. 오히려 태그 네임스페이스 설계 자체가 학습 소재가 됩니다.

### 6-7. 셸과 데모 앱의 배포 시점이 어긋난다

`demos.yaml`은 워크스페이스 공유 패키지라 셸과 데모 앱이 **같은 커밋에서 같은 값**을 봅니다. 하지만 Vercel 프로젝트가 따로라 **빌드가 끝나는 시점이 다릅니다.**

```
push (status: done + 라우트 추가)
   ├─ 셸 빌드 완료      → 색인·문서에 링크 등장
   └─ 데모 앱 빌드 중…   → 링크를 눌러 들어간 독립 열람의 iframe이 404
```

**영향 범위가 문서 페이지에는 미치지 않습니다.** 문서 본문에는 iframe이 없으므로([06. 3-2](./06-ui-and-screen-design.md)) 문서는 멀쩡하고, 학습자가 링크를 눌러 들어간 독립 열람 화면에서만 드러납니다. **다만 랜딩 히어로는 예외로 iframe을 쓰므로 첫 화면이 영향을 받습니다** — 그쪽은 셸이 그리는 정적 폴백으로 덮습니다([06. 2-3](./06-ui-and-screen-design.md)).

lint는 "`done`인데 워크스페이스에 라우트가 없다"를 잡지만 **"배포됐는지"는 못 잡습니다.** 진짜 위험은 몇 분의 공백이 아니라 **데모 앱 빌드 실패**입니다 — 그러면 공백이 무기한이 되고 셸은 계속 `done`이라고 믿습니다.

- **대응**: 커밋을 나누지 않습니다(데모마다 push 두 번은 규율 비용이 큽니다). 대신 데모 앱의 `not-found`가 iframe 안에서 읽힐 폴백을 그립니다. 배포 공백과 빌드 실패를 같은 화면이 덮습니다.

  ```
  ┌──────────────────────────┐
  │ 이 데모는 아직 배포되지    │
  │ 않았습니다.                │
  │ 잠시 후 다시 시도해주세요.  │
  └──────────────────────────┘
  ```

## 7. 이 설계가 성립했다고 말할 수 있는 조건

- 주소창에 `localhost:3000` 외의 주소가 **한 번도** 나타나지 않는다
- 주소창에 `/zone/`이 **한 번도** 나타나지 않는다
- 독립 열람 화면 안의 데모가 조작되고, 그 데모는 셸이 아닌 다른 앱이 응답한 것이다
- 문서 페이지에 iframe이 **하나도 없다**
- 같은 데모를 랜딩 히어로에서 보든 독립으로 열든, 데모 앱이 내려준 화면은 **똑같다**
- `cacheComponents` 끈 데모와 켠 데모가 같은 사이트에서 **동시에** 동작한다
- 데모를 추가할 때 md를 고치지 않아도 그 문서 하단에 나타난다
- 데모를 다른 zone으로 옮겨도 학습자 URL이 바뀌지 않는다
- zone을 하나 추가할 때 손대는 곳이 [01. 구성 절차 4절](./01-project-setup.md)의 체크리스트를 벗어나지 않는다
