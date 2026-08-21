# AI Coding Agents

- 공식 문서: [AI Coding Agents](https://nextjs.org/docs/app/guides/ai-agents)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `AGENTS.md`와 `next` 패키지에 번들된 문서(`node_modules/next/dist/docs/`)를 이용해 AI 코딩 에이전트에게 학습 데이터 대신 버전에 맞는 최신 API와 패턴을 제공하는 방법을 설명할 수 있다.
- 프로젝트 상태(신규 생성, Next.js 16.3 이상 기존 프로젝트, 16.2 이하 구버전)에 따라 `AGENTS.md`·`CLAUDE.md`를 자동 생성·갱신하거나 opt-out하는 방법을 선택할 수 있다.
- `next dev` 실행 중 에이전트가 참고할 수 있는 두 가지 런타임 시야 — 프레임워크 시야(MCP 서버)와 브라우저 시야(`agent-browser`) — 를 구분해 설명할 수 있다.
- Cache Components가 켜진 상태에서 발생하는 blocking 에러의 안내 메시지 구조와 dev overlay의 **Copy prompt** 흐름을 이해할 수 있다.
- Next.js Skills가 다루는 세 가지 워크플로 유형과, `next-dev-loop`를 비롯한 개별 Skill의 설치·실행 방법을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 설치한 `next` 패키지 버전에 맞는 문서를 함께 배포해서, AI 코딩 에이전트가 학습 데이터 대신 정확하고 최신인 API와 패턴을 참고할 수 있게 한다. 프로젝트 루트의 `AGENTS.md` 파일은 에이전트를 이 번들 문서로 안내한다.

이 가이드는 네 단계로 구성된다. 에이전트를 번들 문서로 안내하고([1단계](#1단계-에이전트를-번들-문서로-안내한다)), [런타임 시야](#2단계-에이전트에게-런타임-시야를-제공한다)를 제공하고, [에러가 수정을 이끌게](#3단계-에러가-수정을-이끌게-한다) 하고, 여러 단계로 이어지는 작업은 [Skill에 맡긴다](#4단계-여러-단계로-이어지는-작업은-skill에-맡긴다).

### 1단계: 에이전트를 번들 문서로 안내한다

`AGENTS.md`가 프로젝트 루트에 있고 에이전트를 번들 문서로 안내하는지 확인한다. `next`를 설치하면 Next.js 문서가 `node_modules/next/dist/docs/`에 번들되며, [Next.js 문서 사이트](https://nextjs.org/docs)의 구조를 그대로 미러링한다.

```
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/
│   ├── 02-guides/
│   └── 03-api-reference/
├── 02-pages/
├── 03-architecture/
└── index.mdx
```

에이전트는 네트워크 요청이나 외부 조회 없이도 항상 설치된 버전과 일치하는 문서에 접근한다. [Next.js를 업그레이드](../1-getting-started/upgrading.md)하면 번들 문서도 함께 업그레이드되며, 기존 기능에 대한 새 안내도 반영된다. Claude Code, Codex, Cursor, GitHub Copilot을 비롯한 대부분의 AI 코딩 에이전트는 세션을 시작할 때 `AGENTS.md`를 자동으로 읽는다.

#### 새 프로젝트

[`create-next-app`](../3-api-reference/3.6-cli/create-next-app.md)은 `AGENTS.md`와 `CLAUDE.md`를 자동으로 생성한다. 추가 설정은 필요하지 않다.

```bash
pnpm create next-app@canary
```

에이전트 파일을 원하지 않으면 `--no-agents-md`를 전달한다.

```bash
npx create-next-app@canary --no-agents-md
```

#### 기존 프로젝트

Next.js 16.3 이상에서는 `next dev`를 실행한다. 환경에서 AI 코딩 에이전트가 감지되고 관리 블록이 없으면, Next.js가 프로젝트 루트에 `AGENTS.md`와 `CLAUDE.md`를 자동으로 생성한다. 기존 `AGENTS.md`나 `CLAUDE.md` 파일은 upsert(있으면 갱신, 없으면 생성)되므로 관리 블록 밖의 내용은 그대로 유지된다.

```md filename="AGENTS.md"
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

`CLAUDE.md`에는 다음 한 줄만 들어간다.

```md filename="CLAUDE.md"
@AGENTS.md
```

`<!-- BEGIN:nextjs-agent-rules -->`와 `<!-- END:nextjs-agent-rules -->` 마커 바깥에 프로젝트 고유의 지시사항을 추가하면, Next.js가 관리 블록을 갱신할 때도 그 내용은 보존된다.

#### Opt-out

Next.js 팀은 자동 생성을 켜 두는 것을 기본값으로 권장한다. [nextjs.org/evals의 벤치마크 결과](https://nextjs.org/evals)는 에이전트가 번들 문서를 읽을 때 더 나은 결과를 낸다는 것을 보여준다. 그래도 opt-out하려면 설정에서 `agentRules`를 `false`로 지정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
}

export default nextConfig
```

#### 이전 버전에서는

16.2 버전에서는 문서가 번들되어 있지만 `AGENTS.md`가 자동 생성되지는 않는다. 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 번들 문서를 읽으라는 지시를 담아 직접 파일을 추가한다.

16.1 이하 버전에서는 문서 자체가 번들되어 있지 않다. 레거시 `agents-md` 명령을 사용하면 버전에 맞는 문서 사본을 프로젝트 루트의 `.next-docs/`에 내려받고 `AGENTS.md`에 색인을 만든다.

```bash filename="Terminal"
npx @next/codemod@canary agents-md
```

#### 네트워크로 받는 문서

Next.js 문서는 `node_modules`를 읽는 대신 페이지를 가져오는 에이전트를 위해 Markdown 형태로도 네트워크에 제공된다. [nextjs.org/docs](https://nextjs.org/docs)의 어떤 페이지 URL 뒤에든 `.md`를 붙이면 순수 Markdown 버전을 받을 수 있고, `Accept: text/markdown` 헤더를 보내는 클라이언트도 Markdown 응답을 받는다. 여기에는 번들되지 않는 `/docs/messages` 아래의 개별 에러 페이지도 포함된다.

[`/docs/llms.txt`](https://nextjs.org/docs/llms.txt) 색인과 단일 파일 [`/docs/llms-full.txt`](https://nextjs.org/docs/llms-full.txt)는 [`llms.txt` 관례](https://llmstxt.org/)를 따른다. 그래서 다른 도구를 위해 이미 `llms.txt`를 읽는 에이전트는 같은 방식으로 Next.js 문서도 찾을 수 있다.

### 2단계: 에이전트에게 런타임 시야를 제공한다

`next dev`를 실행하고 에이전트가 그 서버를 대상으로 작업하게 한다. 런타임 에러, 클라이언트 측 경고, 렌더링된 결과는 브라우저에 있으며 에이전트는 브라우저를 볼 수 없다. Next.js는 에이전트가 터미널에서 읽을 수 있는 서로 보완적인 두 가지 시야를 제공한다.

먼저 `next dev`는 브라우저 콘솔 에러와 경고를 터미널로 전달한다([`logging.browserToTerminal`](../3-api-reference/3.5-config/3.5.1-next-config-js/logging.md) 설정). 그 결과 에이전트가 이미 읽고 있는 출력에 수정해야 할 클라이언트 측 실패가 함께 담긴다.

`next dev`는 자신의 PID, 포트, URL을 `.next/dev/lock`에도 기록한다. 같은 프로젝트에서 두 번째 `next dev`를 실행하면 이미 실행 중인 서버의 URL과 종료할 PID를 출력하므로, 에이전트는 중복 서버를 새로 띄우는 대신 기존 서버에 연결한다.

**프레임워크의 시야**는 `/_next/mcp`에서 동작하는 [Next.js MCP 서버](./mcp.md)에서 나온다. 이 서버는 실행 중인 dev 서버의 라우트, 서버 로그, 컴파일 이슈를 노출한다. `get_compilation_issues`와 `compile_route` 도구는 코드가 dev 서버에서 곧바로 컴파일되는지 보고하므로, 에이전트가 이를 확인하려고 전체 `next build`를 실행할 필요가 없다.

**브라우저의 시야**는 DOM, 콘솔, 네트워크, Web Vitals를 구조화된 텍스트로 노출하는 CLI인 [`agent-browser`](https://github.com/vercel-labs/agent-browser)에서 나온다. React DevTools를 켜면(`agent-browser open`에 `--enable react-devtools`를 전달하며, `next-dev-loop` Skill이 이를 대신 처리한다) 컴포넌트 트리와 아직 대기 중인 `Suspense` 경계까지 보고한다. 에이전트는 `react tree` 같은 명령을 실행해 그 출력을 읽고, 볼 수 없는 DevTools 패널을 들여다보는 대신 다음에 확인할 대상을 판단한다.

[`next-dev-loop` Skill](https://nextjs.org/docs/app/guides/ai-agents#next-dev-loop)은 이 두 시야를 결합해, 프레임워크와 브라우저의 관점을 하나의 수정-검증 루프로 묶는다.

> **알아두면 좋은 점**: 이 도구들이 만들어진 배경은 [Next.js 16.2](https://nextjs.org/blog/next-16-2-ai)와 [Next.js 16.3](https://nextjs.org/blog/next-16-3-ai-improvements) AI 블로그 글을 참고한다.

### 3단계: 에러가 수정을 이끌게 한다

[Cache Components](../3-api-reference/3.5-config/3.5.1-next-config-js/cacheComponents.md)가 켜진 상태에서 blocking 에러가 발생하면, 서로 다른 트레이드오프를 가진 라벨링된 수정안들이 함께 제시된다. dev overlay에는 **Copy prompt** 버튼이 있어 선택한 수정안을 그대로 붙여넣을 수 있는 프롬프트로 만들어준다. 이 프롬프트는 에이전트가 해당 에러 페이지를 읽고, 정형화된 패턴을 적용하고, 런타임에서 결과를 검증하는 과정을 안내한다.

같은 메뉴가 `next dev` 터미널과 `next build` 출력에도 그대로 출력되므로, CI 로그를 읽는 에이전트도 이를 볼 수 있다.

```txt filename="Terminal"
Route "/products/[slug]": Next.js encountered uncached data during prerendering.

`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route
from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] Cache the data access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at ProductPage (app/products/[slug]/page.tsx:52:32)
    ...
```

`next dev`에서는 dev overlay와 터미널 양쪽에서 스택 프레임이 실제 소스로 해석된다. 프로덕션 빌드는 서버 코드를 압축(minify)하므로, 빌드 에러만으로 부족하면 [`next build --debug-prerender`](./building.md)로 서버 소스맵을 켜서 첫 실패 이후에도 계속 진행한다.

`Learn more` 링크는 에이전트가 읽도록 작성된 [`/docs/messages`](https://nextjs.org/docs/messages/blocking-prerender-dynamic) 아래의 개별 에러 페이지로 연결된다. 각 페이지는 같은 구성을 따르며, 각 수정안의 정형화된 패턴, 다른 수정안과의 트레이드오프, 에이전트가 처음 시도할 때 놓치기 쉬운 함정을 담는다. [Instant navigation 가이드](./instant-navigation.md#ai-workflow와-loading-state-반복-개선)는 에이전트가 이런 인사이트를 읽는 것부터, 수정 전에는 실패하고 수정 후에는 통과하는 `instant()` 테스트를 작성하는 것까지 전체 루프를 다룬다.

### 4단계: 여러 단계로 이어지는 작업은 Skill에 맡긴다

프레임워크 지식은 온디맨드 조회가 아니라 번들 문서에서 나온다. [벤치마크 결과](https://nextjs.org/evals)는 항상 사용 가능한 컨텍스트가 온디맨드 조회보다 성능이 낫다는 것을 보여준다. Skill은 단순 조회가 아니라 워크플로에 해당하는 작업을 다룬다. 앱 전체에 Cache Components나 Partial Prefetching을 도입하는 것이 그 예다. Next.js Skill은 이런 작업을 구조화된 지시사항으로 패키징해서 에이전트가 설치하고 따르게 하며, 작업 순서를 정하고 그 과정에서 [런타임 도구](#2단계-에이전트에게-런타임-시야를-제공한다)와 관련 문서를 함께 안내한다.

이 Skill들의 소스는 [Next.js 저장소](https://github.com/vercel/next.js/tree/canary/skills)에서, 목록은 [skills.sh](https://www.skills.sh/vercel/next.js)에서 확인할 수 있다.

Skill은 세 가지 워크플로 유형으로 나뉜다.

- **런타임 기반(Runtime foundations)**: `next-dev-loop`처럼 어떤 코딩 작업에도 반복 가능한 확인-수정-검증 순환을 제공한다.
- **대화형 워크플로(Interactive workflows)**: 앱 전체에 Cache Components나 Partial Prefetching을 도입하는 것처럼, 사용자 체크포인트를 두고 더 넓은 범위의 변경을 수행한다.
- **무인 루프(Unattended loops)**: 검증 가능한 목표를 향해 작업하고, 실제 판단이 필요한 지점에서만 멈춘다.

#### next-dev-loop

[`next-dev-loop`](https://www.skills.sh/vercel/next.js/next-dev-loop)는 [MCP 서버](./mcp.md)와 브라우저를 이용해 실행 중인 dev 서버를 기준으로 변경 사항을 검증하는 런타임 기반 Skill이다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-dev-loop
```

이후 에이전트에게 다음 프롬프트를 준다.

```
After every edit, verify the page still works at runtime using the next-dev-loop Skill.
```

#### next-cache-components-adoption

[`next-cache-components-adoption`](https://www.skills.sh/vercel/next.js/next-cache-components-adoption) Skill은 앱을 [Cache Components](../1-getting-started/caching.md)로 마이그레이션한다.

1. 플래그를 켜고 prerender할 수 없는 라우트를 찾는다.
2. 한 번에 한 기능씩 수정하며, 다음으로 넘어가기 전에 사용자에게 확인받는다.
3. 각 기능이 `next dev`와 `next build`에서 확인되면 마무리한다.

작업 결과를 여러 개의 PR로 나눌지, 하나의 브랜치에 유지할지는 사용자가 선택한다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-adoption
```

이후 에이전트에게 다음 프롬프트를 준다.

```
Adopt Cache Components in this project using the next-cache-components-adoption Skill.
```

#### next-cache-components-optimizer

[`next-cache-components-optimizer`](https://www.skills.sh/vercel/next.js/next-cache-components-optimizer) Skill은 대상 라우트(들)를 받아, 클릭 시점에 화면에 나타나야 할 UI를 향해 작업한다.

1. 지정한 UI에 대해 실패하는 [`instant()`](./instant-navigation.md#e2e-테스트로-회귀-방지) 테스트를 작성한다.
2. 테스트가 통과할 때까지 라우트를 리팩터링하며, 대개 데이터 읽기를 `<Suspense>` 경계 아래로 옮기는 방식을 쓴다.
3. 통과하는 테스트를 리팩터링과 함께 커밋해, 이후 회귀를 잡아낸다.

이미 [Cache Components](../1-getting-started/caching.md)로 빌드되는 라우트가 필요하다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-optimizer
```

이후 에이전트에게 다음과 같은 프롬프트를 준다.

```
Make the navigation from /settings to /dashboard instant using the next-cache-components-optimizer Skill. The header and the project list should be part of the instant UI.
```

#### next-partial-prefetching-adoption

[`next-partial-prefetching-adoption`](https://www.skills.sh/vercel/next.js/next-partial-prefetching-adoption) Skill은 앱을 [Partial Prefetching](./adopting-partial-prefetching.md)으로 옮긴다. 이 모델에서는 링크들이 하나의 App Shell을 공유한다.

1. 기존 `<Link prefetch={true}>` 호출을 사용자와 함께 점검한다.
2. 플래그를 켜고 드러난 인사이트를 해결한다.
3. 이후 prefetch할 가치가 있을 만한 URL 데이터를 가진 라우트를 표시해둔다.

이미 [Cache Components](../1-getting-started/caching.md)가 도입되어 있어야 한다.

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

이후 에이전트에게 다음 프롬프트를 준다.

```
Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption Skill.
```

### 다음 단계

- [Next.js MCP Server](./mcp.md) — 코딩 에이전트가 애플리케이션 상태에 접근하게 하는 방법
- [Upgrading](../1-getting-started/upgrading.md) — Next.js 애플리케이션을 최신 버전 또는 canary로 업그레이드하는 방법
- [create-next-app](../3-api-reference/3.6-cli/create-next-app.md) — 한 번의 명령으로 Next.js 앱을 만드는 CLI
- [next CLI](../3-api-reference/3.6-cli/next.md) — Next.js CLI로 애플리케이션을 실행하고 빌드하는 방법

## 예제 및 데모 설계

- Phase 2에서 `create-next-app`으로 새 프로젝트를 만들어 `AGENTS.md`/`CLAUDE.md`가 자동 생성되는 것과, `--no-agents-md`를 붙였을 때 생성되지 않는 것을 나란히 비교한다.
- 기존 프로젝트에서 `next dev`를 실행해 `<!-- BEGIN:nextjs-agent-rules -->` 관리 블록이 삽입되는 과정과, 그 바깥에 추가한 내용이 재실행 후에도 보존되는지 확인한다.
- `agentRules: false`를 설정한 프로젝트와 기본 설정 프로젝트에서 동일한 프롬프트를 실행해, 번들 문서를 참고했는지 여부에 따른 결과 차이를 비교한다.
- Cache Components를 켠 라우트에서 의도적으로 uncached 데이터 접근을 만들어, dev overlay의 수정안 목록과 **Copy prompt** 버튼이 생성하는 프롬프트를 실제로 확인한다.
- 현재 Phase 1에서는 애플리케이션을 만들지 않고 실행할 명령, 확인할 화면, 비교 기준만 설계한다.

## 연습 문제

1. Next.js 16.3 이상의 기존 프로젝트에서 `AGENTS.md`가 자동 생성되는 조건은 무엇인가?

   1. 프로젝트에 `.mcp.json` 파일이 있을 때
   2. `next build`를 실행했을 때
   3. `next dev` 실행 중 환경에서 AI 코딩 에이전트가 감지되고 관리 블록이 아직 없을 때
   4. `create-next-app`으로 프로젝트를 새로 만들 때만

   <details><summary>정답 보기</summary>

   **정답: 3** — Next.js 16.3 이상에서는 `next dev` 실행 중 에이전트가 감지되고 관리 블록이 없을 때 `AGENTS.md`와 `CLAUDE.md`를 자동 생성(upsert)한다. 신규 프로젝트의 자동 생성은 `create-next-app`이 담당하는 별도 경로다.

   </details>

2. 에이전트에게 제공되는 "프레임워크의 시야"와 "브라우저의 시야"를 올바르게 짝지은 것은?

   1. 프레임워크의 시야 = `agent-browser`, 브라우저의 시야 = Next.js MCP 서버
   2. 프레임워크의 시야 = Next.js MCP 서버, 브라우저의 시야 = `agent-browser`
   3. 둘 다 `next-dev-loop` Skill이 직접 제공한다
   4. 둘 다 `next build --debug-prerender`가 제공한다

   <details><summary>정답 보기</summary>

   **정답: 2** — `/_next/mcp`의 Next.js MCP 서버가 라우트·로그·컴파일 이슈 같은 프레임워크의 시야를, `agent-browser` CLI가 DOM·콘솔·네트워크·Web Vitals 같은 브라우저의 시야를 제공한다. `next-dev-loop` Skill은 이 둘을 결합해 하나의 루프로 묶는다.

   </details>

3. Next.js Skill의 세 워크플로 유형과 그 설명을 모두 고르시오.

   1. 런타임 기반(Runtime foundations) — 반복 가능한 확인-수정-검증 순환을 제공한다.
   2. 대화형 워크플로(Interactive workflows) — 사용자 체크포인트를 두고 더 넓은 범위의 변경을 수행한다.
   3. 무인 루프(Unattended loops) — 검증 가능한 목표를 향해 작업하고 진짜 판단이 필요할 때만 멈춘다.
   4. 자동 배포(Auto-deploy) — 변경을 검증 없이 곧바로 프로덕션에 반영한다.

   <details><summary>정답 보기</summary>

   **정답: 1, 2, 3** — 공식 문서가 정의하는 Skill의 워크플로 유형은 런타임 기반, 대화형 워크플로, 무인 루프 세 가지뿐이다. 자동 배포는 이 문서에서 다루는 개념이 아니다.

   </details>

## 챕터 요약

- `AGENTS.md`는 에이전트를 `node_modules/next/dist/docs/`의 번들 문서로 안내하며, 설치된 버전과 항상 일치하고 네트워크 조회가 필요 없다.
- 신규 프로젝트는 `create-next-app`이, Next.js 16.3 이상의 기존 프로젝트는 `next dev`가 `AGENTS.md`/`CLAUDE.md`를 자동 생성·갱신하며, 관리 블록 밖의 내용은 보존된다.
- 에이전트는 `next dev` 실행 중 프레임워크의 시야(Next.js MCP 서버)와 브라우저의 시야(`agent-browser`)를 함께 활용해 런타임 상태를 확인한다.
- Cache Components 아래에서 blocking 에러가 발생하면 트레이드오프가 다른 수정안 목록과 **Copy prompt** 버튼, `/docs/messages`의 에이전트용 에러 페이지가 함께 제공된다.
- Next.js Skill은 런타임 기반·대화형 워크플로·무인 루프로 나뉘며, `npx skills add vercel/next.js --skill <이름>`으로 설치해 정형화된 다단계 작업을 수행한다.
