# 03. 결합 구조 설계

- 상위: [nextjs-app 작업 규칙](../AGENTS.md)
- 관련 결정: [ADR 0001](./adr/0001-config-axis-as-app-boundary.md), [ADR 0003](./adr/0003-demo-directive-in-markdown.md)
- 근거 문서: [2.43 Multi-zones](../../nextjs-docs/2-guides/multi-zones.md)

여러 개의 독립 Next.js 앱이 학습자에게 **하나의 사이트로 보이도록** 결합하는 구조를 정의합니다.

## 1. 전체 그림

학습자는 끝까지 도메인 하나만 봅니다. 뒤에 앱이 몇 개인지 알 필요가 없습니다.

```
                    학습자 브라우저
                 study.example.com/...
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  셸 (@study/shell)          :3000   │
        │  ─────────────────────────────────  │
        │  · 모든 요청의 정문                  │
        │  · nextjs-docs의 md를 화면에 렌더    │
        │  · 목차 / 검색 / 학습 경로           │
        │  · rewrites로 /demo/* 를 넘김        │
        └─────────────────┬───────────────────┘
                          │  rewrites (주소는 바뀌지 않음)
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  /demo/baseline/*   /demo/cache/*    /demo/prefetch/*  …
  ┌────────────┐    ┌────────────┐    ┌────────────┐
  │ demo-      │    │ demo-cache-│    │ demo-      │
  │ baseline   │    │ components │    │ prefetch   │
  │   :3001    │    │   :3002    │    │   :3003    │
  │cacheComp 끔│    │cacheComp 켬│    │+partialPre│
  └────────────┘    └────────────┘    └────────────┘
```

`rewrites`는 **리다이렉트가 아닙니다.** 브라우저는 이동한 사실을 모르고 주소창도 그대로입니다. 셸이 뒤에서 대신 받아다 전달합니다.

## 2. zone 배분

경계 기준은 **전역 설정 충돌** 하나뿐입니다. 학습 카테고리는 zone 경계가 아닙니다 ([ADR 0001](./adr/0001-config-axis-as-app-boundary.md)).

| zone | 포트 | 경로 | 결정적 설정 | 담는 학습 문서 | 상태 |
|---|:---:|---|---|---|:---:|
| `shell` | 3000 | `/*` | 기본값 + rewrites 소유 | (문서 전체 렌더링) | **1차 생성** |
| `demo-baseline` | 3001 | `/demo/baseline/*` | `cacheComponents` 끔 | 1.x 대부분, 2.4 Caching(Previous), 2.6 ISR, 2.13~2.17 | **1차 생성** |
| `demo-cache-components` | 3002 | `/demo/cache/*` | `cacheComponents: true` | 2.7, 2.8, 2.10, 3.4.3~3.4.5 | **1차 생성** |
| `demo-prefetch` | 3003 | `/demo/prefetch/*` | `cacheComponents` + `partialPrefetching` | 2.9, 2.18~2.20 | 설계만 |
| `demo-export` | 3004 | `/demo/export/*` | `output: 'export'` | 정적 내보내기 제약 | 설계만 |
| `demo-proxy` | 3005 | `/demo/proxy/*` | `proxy.ts`, `basePath`, `i18n` | 1.16, 2.16, 3.5.1 옵션 | 설계만 |

### 왜 이렇게 갈렸는가

**`cacheComponents`가 최대 분기점입니다.** Next.js 16에서 이 옵션은 `experimental.ppr`을 대체했습니다 — `experimental.ppr`은 이제 에러를 던지고, `cacheComponents: true`가 PPR을 **포함**합니다. 그리고 `use cache` 지시자와 `cacheLife`·`cacheTag` API도 여기 딸려 옵니다. 즉 **PPR은 독립된 축이 아니라 `cacheComponents`의 일부**입니다. 이 하나의 스위치가 캐싱·렌더링·프리페치 문서군 전체를 두 세계로 가릅니다.

**`partialPrefetching`은 `cacheComponents: true`를 전제**로 하므로 3번째 zone은 2번째의 확장입니다. 그럼에도 분리한 이유는, 프리페치 문서(2.18~2.20)가 **켠 상태와 끈 상태의 대조**를 보여줘야 하기 때문입니다.

**`output: 'export'`는 서버 기능 전부와 상호 배타**라 반드시 격리됩니다.

**`demo-proxy`가 격리돼야 하는 이유는 미묘합니다.** `proxy.ts`와 `basePath`는 요청 경로를 바꿉니다. 셸은 그 자체가 거대한 rewrites 덩어리이므로, 셸 안에서 proxy를 실증하면 **둘 중 무엇이 경로를 바꿨는지 학습자도 개발자도 구분할 수 없습니다.**

### 셸에는 데모를 두지 않는다

두 가지 이유입니다.

1. **셸이 죽으면 사이트 전체가 죽습니다.** 데모는 일부러 실패시키는 실험(에러 바운더리, 캐시 미스, 잘못된 설정)을 포함하는데, 그걸 정문에 두면 문서까지 같이 넘어집니다.
2. **문서 페이지가 자기 자신을 iframe으로 삽입하는** 구조가 됩니다.

## 3. 라우팅 계약

### 3-1. 경로 규칙

| 종류 | 형식 | 예 |
|---|---|---|
| 데모 페이지 | `/demo/{zone}/*` | `/demo/cache/isr/basic` |
| 데모 정적 자산 | `/demo-static/{zone}/*` | `/demo-static/cache/_next/...` |
| 문서 | 그 외 전부 (셸) | `/guides/isr-cache-components` |

**한 경로는 정확히 하나의 zone에만 속합니다.** 두 zone이 같은 경로를 주장하면 라우팅이 충돌합니다.

정적 자산 경로를 페이지 경로와 **다른 접두사**로 분리한 이유: 모든 zone이 자기 `_next/`를 갖는데, 접두사가 없으면 서로 덮어씁니다.

### 3-2. 데모 앱 쪽 설정

```ts
// nextjs-app/apps/demo-cache-components/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,              // ← 이 zone의 존재 이유
  assetPrefix: '/demo-static/cache',  // ← 자산 충돌 방지
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.PUBLIC_ORIGIN ?? 'localhost:3000'],
    },
  },
}

export default nextConfig
```

라우트는 `src/app/demo/cache/` 아래에 실제로 중첩해서 둡니다. `basePath`로 처리하지 않는 이유는 6-3에 있습니다.

### 3-3. 셸 쪽 설정

```ts
// nextjs-app/apps/shell/next.config.ts
import path from 'node:path'
import type { NextConfig } from 'next'

const zones = [
  { slug: 'baseline', url: process.env.ZONE_BASELINE_URL },
  { slug: 'cache',    url: process.env.ZONE_CACHE_URL },
]

const nextConfig: NextConfig = {
  // nextjs-docs의 md를 배포 산출물에 포함시키기 위해 tracing 기준을 워크스페이스 루트로
  outputFileTracingRoot: path.join(__dirname, '../../../'),

  async rewrites() {
    return zones.flatMap(({ slug, url }) => [
      { source: `/demo/${slug}/:path*`,        destination: `${url}/demo/${slug}/:path*` },
      { source: `/demo-static/${slug}/:path*`, destination: `${url}/demo-static/${slug}/:path*` },
    ])
  },
}

export default nextConfig
```

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

## 4. 문서와 데모를 잇는 계약

### 4-1. 데모 지시자

학습 문서 md 본문의 원하는 위치에 `demo` 코드펜스를 둡니다 ([ADR 0003](./adr/0003-demo-directive-in-markdown.md)).

````markdown
`use cache`를 붙인 함수는 결과가 캐시되어 다음 요청에서 재사용됩니다.

```demo
zone: cache
path: /use-cache/basic
mode: inline
height: 320
caption: 새로고침해도 타임스탬프가 그대로인지 확인
```

위 데모에서 [새로고침]을 여러 번 눌러도 타임스탬프가 바뀌지 않습니다.
````

| 필드 | 필수 | 의미 |
|---|:---:|---|
| `zone` | ✅ | zone slug (2절 표의 값) |
| `path` | ✅ | zone 안에서의 경로. 앞의 `/demo/{zone}`은 붙이지 않음 |
| `mode` | | `inline`(기본) 또는 `fullscreen` |
| `height` | | 인라인 데모의 초기 높이(px). 기본 360 |
| `caption` | | 학습자에게 무엇을 관찰하라고 지시하는 한 줄 |

**GitHub에서 이 md를 열면 그냥 코드 블록으로 보입니다.** 아무것도 깨지지 않고, 데모가 어디에 있는지도 읽힙니다. `nextjs-docs`가 순수 마크다운이라는 성질이 유지됩니다.

### 4-2. 처리 파이프라인

```
nextjs-docs/**/*.md
        │
        │  ① @study/docs 의 build — 291개 md를 훑어
        ▼     목차 트리 + 데모 지시자 색인을 매니페스트로
   manifest.json
        │
        │  ② 셸이 문서 페이지를 렌더 (@study/docs-render)
        ▼     demo 코드펜스를 만나면 코드블록 대신
   <DemoFrame zone="cache" path="/use-cache/basic" />
        │
        │  ③ 브라우저에서
        ▼
   <iframe src="/demo/cache/use-cache/basic">
        │
        │  ④ 셸의 rewrites가 가로채
        ▼
   demo-cache-components 앱이 응답
```

`mode: fullscreen`이면 ③이 iframe 대신 `<a href="/demo/cache/...">`가 됩니다.

### 4-3. 부수 효과 — PROGRESS.md 자동화

`PROGRESS.md`의 "데모 상태" 열은 지금 사람이 손으로 관리하도록 돼 있습니다. 매니페스트가 각 문서의 데모 지시자 개수를 알고 있으므로, **문서에 지시자가 있으면 데모가 있는 것**입니다. 이 열을 스크립트로 생성하면 문서와 상태표가 어긋날 여지가 사라집니다.

## 5. 내비게이션 설계

Multi-Zones에서 이동은 두 종류이고, **이 차이 자체가 학습 대상**입니다.

| 이동 | 성격 | 사용 요소 |
|---|---|---|
| 같은 zone 안 (문서 → 문서, 데모 → 데모) | soft navigation. 문서 reload 없음 | `<Link>` |
| zone 경계를 넘음 (문서 → 데모, 데모 → 문서) | hard navigation. 앱 자원을 내리고 새로 받음 | **`<a>`** |

**zone 경계를 넘는 링크에 `<Link>`를 쓰면 안 됩니다.** `<Link>`는 상대 경로를 prefetch하고 soft navigation하려 하는데 zone 경계를 넘을 수 없습니다.

설계상의 이득: 2.43 Multi-zones 문서의 데모를 **따로 만들 필요가 없습니다.** 학습자가 이 사이트에서 문서와 데모를 오가는 동작 자체가 그 문서의 데모입니다. Network 패널에서 문서 요청이 새로 발생하는지 보면 됩니다.

## 6. 함정 목록

구현 전에 알고 있어야 나중에 헤매지 않는 것들입니다.

### 6-1. 배포에서만 드러나는 것 (로컬에서 100% 정상)

| 증상 | 원인 | 대응 |
|---|---|---|
| 배포된 사이트에서 문서가 안 보임 | `outputFileTracingRoot` 미설정 → 산출물에 md 누락 | 3-3의 설정. 첫 배포 검증에서 확인 |
| 데모 화면의 CSS·JS가 404 | `assetPrefix` 누락 또는 셸의 자산 rewrite 누락 | 3-1·3-2. zone 추가 시 **rewrites는 2줄** |
| Server Action이 거부됨 | 사용자에게 보이는 origin과 zone의 실제 origin이 다름 | `serverActions.allowedOrigins`에 셸 도메인 등록 |
| 문서 이미지가 안 보임 | `nextjs-docs/*/assets/*.webp`는 md 상대 경로만으로 브라우저에서 해석되지 않음 | 셸에 자산 라우트 핸들러를 두거나 빌드 시 `public/`으로 복사 |

로컬에서 전부 통과하는 문제들이라 **셸 + 데모 1개 시점의 1회 배포 검증**이 반드시 필요합니다 ([01. 구성 절차 3-6](./01-project-setup.md)).

### 6-2. md를 고쳐도 사이트가 안 바뀜

`@study/docs`가 워크스페이스 패키지가 아니거나 build 태스크가 없으면, turbo가 md 변경을 감지하지 못하고 캐시된 옛 결과를 내놓습니다. 원인이 코드에 없어서 찾기 어려운 종류의 문제입니다. 근거와 대응은 [01. 구성 절차 3-4](./01-project-setup.md)에 있습니다.

### 6-3. `basePath`를 경로 접두사로 쓰지 않는 이유

`basePath: '/demo/cache'`를 쓰면 라우트를 `src/app/` 바로 아래에 둘 수 있어 더 깔끔해 보입니다. 그래도 실제 폴더 중첩을 택한 이유는 두 가지입니다.

1. `basePath`는 `assetPrefix`와 자산 경로를 두고 상호작용합니다. zone마다 둘을 동시에 다루면 자산 404의 원인을 좁히기 어려워집니다.
2. **`basePath` 자체가 `demo-proxy` zone의 학습 주제입니다.** 모든 zone이 이미 basePath를 쓰고 있으면, 그걸 가르치는 데모가 "이미 켜져 있는 것"을 설명해야 하는 이상한 상황이 됩니다.

### 6-4. 포트가 고정돼야 하는 이유

셸의 rewrites 목적지가 `localhost:3002`로 고정돼 있는데 데모 앱이 다른 포트를 잡으면, 그 zone은 통째로 502가 됩니다. dev 스크립트에 `--port`를 명시합니다.

## 7. 이 설계가 성립했다고 말할 수 있는 조건

- 주소창에 `localhost:3000` 외의 주소가 **한 번도** 나타나지 않는다
- 문서 페이지 안의 인라인 데모가 조작되고, 그 데모는 셸이 아닌 다른 앱이 응답한 것이다
- `cacheComponents` 끈 데모와 켠 데모가 같은 사이트에서 **동시에** 동작한다
- zone을 하나 추가할 때 손대는 곳이 [01. 구성 절차 4절](./01-project-setup.md)의 체크리스트를 벗어나지 않는다
