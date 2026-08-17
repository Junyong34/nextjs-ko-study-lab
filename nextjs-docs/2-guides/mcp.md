# Next.js MCP Server

- 공식 문서: [Next.js MCP Server](https://nextjs.org/docs/app/guides/mcp)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- MCP(Model Context Protocol)가 무엇이며, Next.js 16 이상이 제공하는 MCP 지원이 코딩 에이전트에게 어떤 실시간 접근을 제공하는지 설명할 수 있다.
- `.mcp.json`에 `next-devtools-mcp`를 등록해 개발 서버와 자동으로 연결되게 설정할 수 있다.
- `next-devtools-mcp`가 제공하는 애플리케이션 런타임 접근(에러·상태·라우트)과 개발 도구(문서 게이트웨이·브라우저 테스트) 기능을 구분해 설명할 수 있다.
- `get_errors`, `get_routes`, `get_compilation_issues`, `compile_route` 등 개별 도구의 역할과 Turbopack 전용 제약을 파악할 수 있다.
- `/_next/mcp` 엔드포인트를 중심으로 `next-devtools-mcp`가 여러 Next.js 인스턴스와 통신하는 구조를 이해하고, 연결 문제를 스스로 진단할 수 있다.

## 핵심 개념 및 설명

### 코딩 에이전트를 위한 Next.js MCP Server 활성화

[MCP(Model Context Protocol)](https://modelcontextprotocol.io/)는 AI 에이전트와 코딩 어시스턴트가 표준화된 인터페이스로 애플리케이션과 상호작용할 수 있게 하는 개방형 표준이다.

Next.js 16 이상에는 코딩 에이전트가 애플리케이션 내부 상태에 실시간으로 접근할 수 있게 하는 MCP 지원이 포함되어 있다. 이 기능을 사용하려면 [`next-devtools-mcp`](https://www.npmjs.com/package/next-devtools-mcp) 패키지를 설치한다.

### 시작하기

**요구 사항:** Next.js 16 이상

프로젝트 루트의 `.mcp.json` 파일에 `next-devtools-mcp`를 추가한다.

```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

이것으로 끝이다. 개발 서버를 시작하면 `next-devtools-mcp`가 실행 중인 Next.js 인스턴스를 자동으로 찾아 연결한다.

더 많은 설정 옵션은 [next-devtools-mcp 저장소](https://github.com/vercel/next-devtools-mcp)를 참고한다.

### 기능

`next-devtools-mcp`는 코딩 에이전트에게 계속 늘어나는 기능들을 제공한다.

#### 애플리케이션 런타임 접근

- **에러 감지**: 개발 서버로부터 현재 빌드 에러, 런타임 에러, 타입 에러를 가져온다.
- **실시간 상태 조회**: 실시간 애플리케이션 상태와 런타임 정보에 접근한다.
- **페이지 메타데이터**: 페이지 라우트, 컴포넌트, 렌더링 세부 정보를 조회한다.
- **Server Actions**: Server Action과 컴포넌트 계층을 확인한다.
- **개발 로그**: 개발 서버 로그와 콘솔 출력에 접근한다.

#### 개발 도구

- **문서 게이트웨이**: 설치된 Next.js 버전에 맞춰 번들된 문서(`node_modules/next/dist/docs/`)로 에이전트를 안내해, 설명과 생성되는 코드가 실행 중인 버전과 일치하게 한다.
- **브라우저 테스트**: 브라우저에서 페이지를 검증하기 위한 [Playwright MCP](https://github.com/microsoft/playwright-mcp) 연동을 제공한다.

> **알아두면 좋은 점**: Next.js 팀은 이 기능들을 계속 확장하고 있다. 에이전트 개발 경험을 개선하기 위한 새로운 도구와 기능이 꾸준히 추가된다.

### 개발 워크플로

1. Next.js 개발 서버를 시작한다.

   ```bash
   pnpm dev
   ```

2. 코딩 에이전트가 `next-devtools-mcp`를 통해 실행 중인 Next.js 인스턴스에 자동으로 연결된다.
3. 브라우저에서 애플리케이션을 열어 페이지를 확인한다.
4. 에이전트에게 인사이트와 진단을 질의한다(아래 예시 참고).

#### 사용 가능한 도구

`next-devtools-mcp`를 통해 에이전트는 다음 도구를 사용할 수 있다.

- **`get_errors`**: 개발 서버로부터 현재 빌드 에러, 런타임 에러, 타입 에러를 가져온다.
- **`get_logs`**: 브라우저 콘솔 로그와 서버 출력이 담긴 개발 로그 파일의 경로를 가져온다.
- **`get_page_metadata`**: 라우트, 컴포넌트, 렌더링 정보를 포함한 특정 페이지의 메타데이터를 가져온다.
- **`get_project_metadata`**: 프로젝트 구조, 설정, 개발 서버 URL을 가져온다.
- **`get_routes`**: 파일시스템을 스캔해 엔트리 포인트가 될 모든 라우트를 가져온다. 라우터 타입(appRouter, pagesRouter)별로 라우트를 그룹화해 반환하며, 다이나믹 세그먼트는 `[param]`이나 `[...slug]` 형태로 나타난다.
- **`get_server_action_by_id`**: Server Action을 ID로 조회해 소스 파일과 함수 이름을 찾는다.
- **`get_compilation_issues`**: 번들러가 보고하는 프로젝트 전체의 컴파일 경고와 에러를 가져온다. Turbopack에서만 동작한다.
- **`compile_route`**: HTTP 요청을 보내지 않고 특정 라우트를 온디맨드로 컴파일한다. `get_routes`가 반환하는 형태의 `routeSpecifier`(예: `/blog/[slug]`) 또는 `path`(예: `/blog/hello-world`)를 받으며, `path`는 개발 라우터의 실시간 라우트 테이블에서 일치하는 라우트로 해석된다. 해당 라우트의 컴파일 이슈를 반환한다. Turbopack에서만 동작한다.

### 에이전트와 함께 사용하기

MCP를 지원하는 코딩 에이전트는 실행 중인 Next.js 개발 서버를 자동으로 찾아 연결하고, 프로젝트에 대한 풍부한 컨텍스트를 얻는다.

#### 에이전트 지원 개발의 장점

에이전트는 다음을 할 수 있다.

- **컨텍스트를 고려한 제안**: 기존 구조를 바탕으로 새 기능을 추가할 적절한 위치를 추천한다.
- **실시간 애플리케이션 상태 조회**: 개발 중 현재 설정, 라우트, 미들웨어를 확인한다.
- **App Router 페이지 레이아웃 이해**: 어떤 페이지와 레이아웃이 렌더링되는지 정확히 파악한다.
- **정확한 구현 제공**: 프로젝트의 패턴과 관례를 따르는 코드를 생성한다.

### 예시

#### 에러 감지와 진단

에이전트에게 실시간으로 에러에 대해 물어본다.

```
User: "What errors are currently in my application?"
```

에이전트는 다음을 수행한다.

- `next-devtools-mcp`를 통해 실행 중인 Next.js 애플리케이션을 조회한다.
- 현재 빌드 에러, 런타임 에러, 타입 에러를 가져온다.
- 에러를 분석해 실행 가능한 수정안을 제시한다.

에이전트 응답 예시(클릭하여 펼치기)

```
> fix errors on the page

⏺ I'll help you fix the errors on the page. Let me first check what errors exist by looking at the
  current state of the project.

⏺ next-devtools - nextjs_runtime (MCP)(action: "discover_servers")
⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")

⏺ I found a hydration error on the /about page. The error shows that the server is rendering
  "server" but the client is rendering "client", causing a mismatch. Let me create a todo list and fix
   this issue.

⏺ Perfect! Now let me check for errors on the page.           01:14 PM  claude-sonnet-4-5-20250929

⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")
  ⎿ {
      "success": true,
      "port": 3000,
      "toolName": "get_errors",
      "result": {
        "content": [
          {
            "type": "text",
            "text": "# Found errors in 1 browser session(s)\n\n## Session: /about\n\n**1 error(s)
     found**\n\n### Runtime Errors\n\n#### Error 1 (Type: recoverable)\n\n**Error**: Hydration failed
```

#### 업그레이드와 모범 사례

Next.js 개념과 마이그레이션에 대한 도움을 받는다.

```
User: "Help me upgrade my Next.js app to version 16"
```

에이전트는 공식 업그레이드 codemod(`npx @next/codemod@latest upgrade latest`)를 실행하고, 호환성이 깨지는 변경 사항을 처리하는 단계별 안내를 제공한다.

개념적인 질문도 할 수 있다.

```
User: "When should I use 'use client' in App Router?"
```

에이전트는 프로젝트에 번들된, 버전에 맞는 Next.js 문서를 읽고 문서에 기반한 설명을 코드베이스의 예시와 함께 제공한다.

### 동작 방식

Next.js 16 이상에는 개발 서버 안에서 동작하는 내장 MCP 엔드포인트가 `/_next/mcp`에 포함되어 있다. `next-devtools-mcp` 패키지는 이 엔드포인트들을 자동으로 찾아 통신하며, 다음을 수행한다.

- 서로 다른 포트에서 실행 중인 여러 Next.js 인스턴스에 연결한다.
- 도구 호출을 적절한 Next.js 개발 서버로 전달한다.
- 코딩 에이전트를 위한 통합 인터페이스를 제공한다.

이 아키텍처는 에이전트 인터페이스를 내부 구현으로부터 분리해서, `next-devtools-mcp`가 서로 다른 Next.js 프로젝트에서도 매끄럽게 동작하게 한다.

### 문제 해결

#### MCP 서버가 연결되지 않을 때

- Next.js v16 이상을 사용하고 있는지 확인한다.
- `.mcp.json`에 `next-devtools-mcp`가 설정되어 있는지 확인한다.
- 개발 서버를 시작한다: `npm run dev`
- 이미 실행 중이었다면 개발 서버를 재시작한다.
- 코딩 에이전트가 MCP 서버 설정을 불러왔는지 확인한다.

## 예제 및 데모 설계

- Phase 2에서 `.mcp.json`에 `next-devtools-mcp`를 등록한 샘플 프로젝트를 만들어, `pnpm dev` 실행 후 에이전트가 자동으로 연결되는 과정을 확인한다.
- 의도적으로 hydration 불일치를 발생시킨 뒤 `get_errors` 도구로 에러가 감지되는 과정을 원문의 "에러 감지와 진단" 예시와 비교한다.
- App Router와 Pages Router 라우트가 함께 있는 프로젝트에서 `get_routes`가 라우터 타입별로 라우트를 그룹화해 반환하는 결과를 확인한다.
- Turbopack 개발 서버에서 `get_compilation_issues`와 `compile_route`를 호출해, HTTP 요청 없이 특정 라우트의 컴파일 이슈를 확인하는 흐름을 설계한다.
- 현재 Phase 1에서는 애플리케이션을 만들지 않고, 실행할 명령과 확인할 MCP 도구 응답만 설계한다.

## 연습 문제

1. `next-devtools-mcp`가 실행 중인 Next.js 개발 서버와 통신하는 내장 MCP 엔드포인트는 어디에 위치하는가?

   1. `/api/mcp`
   2. `/_next/mcp`
   3. `/.well-known/mcp`
   4. `/_next/devtools`

   <details><summary>정답 보기</summary>

   **정답: 2** — Next.js 16 이상은 개발 서버 안에서 동작하는 내장 MCP 엔드포인트를 `/_next/mcp`에 포함하며, `next-devtools-mcp` 패키지가 이 엔드포인트를 자동으로 찾아 통신한다.

   </details>

2. `get_compilation_issues`와 `compile_route` 도구에 공통으로 해당하는 제약은 무엇인가?

   1. App Router에서만 동작한다
   2. Turbopack에서만 동작한다
   3. 프로덕션 빌드에서만 동작한다
   4. `.mcp.json` 없이도 동작한다

   <details><summary>정답 보기</summary>

   **정답: 2** — 두 도구 모두 "Turbopack only"로 명시되어 있어, Turbopack을 사용하는 개발 서버에서만 컴파일 이슈 조회와 온디맨드 컴파일이 가능하다.

   </details>

3. `next-devtools-mcp`가 제공하는 기능 중 "개발 도구(Development Tools)"에 속하는 것을 모두 고르시오.

   1. 설치된 Next.js 버전에 맞춘 문서 게이트웨이
   2. Playwright MCP를 통한 브라우저 테스트 연동
   3. 빌드 에러·런타임 에러·타입 에러 감지
   4. Server Action과 컴포넌트 계층 확인

   <details><summary>정답 보기</summary>

   **정답: 1, 2** — 문서 게이트웨이와 Playwright MCP 브라우저 테스트 연동은 "개발 도구"로 분류된다. 에러 감지와 Server Action 확인은 "애플리케이션 런타임 접근"에 속한다.

   </details>

## 챕터 요약

- MCP는 AI 에이전트와 애플리케이션이 표준화된 인터페이스로 상호작용하게 하는 개방형 표준이며, Next.js 16 이상은 `next-devtools-mcp` 패키지로 이를 지원한다.
- `.mcp.json`에 `next-devtools-mcp`를 등록하면 개발 서버 실행 시 자동으로 연결되며, 별도의 설정 없이 바로 사용할 수 있다.
- `next-devtools-mcp`는 에러 감지·실시간 상태 조회 같은 애플리케이션 런타임 접근과, 버전에 맞는 문서 게이트웨이·Playwright MCP 브라우저 테스트 같은 개발 도구를 함께 제공한다.
- `get_errors`, `get_routes`, `get_page_metadata` 등 다양한 도구가 제공되며, `get_compilation_issues`와 `compile_route`는 Turbopack에서만 동작한다.
- 내장 MCP 엔드포인트는 `/_next/mcp`에 있으며, `next-devtools-mcp`가 여러 Next.js 인스턴스를 자동으로 찾아 도구 호출을 알맞게 전달한다.
