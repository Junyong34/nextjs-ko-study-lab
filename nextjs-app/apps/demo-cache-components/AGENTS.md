# demo-cache-components (@study/demo-cache-components)

Next.js 16의 `cacheComponents: true` 옵션 및 `use cache`, `cacheTag`, `cacheLife`를 검증하는 데모 zone입니다.

- **포트**: 3002
- **내부 라우트 슬러그**: `/zone/cache/*`
- **정적 자산 경로**: `/demo-static/cache/*`
- **핵심 설정**: `cacheComponents: true`, `assetPrefix: '/demo-static/cache'`

zone 공통 규칙 및 데모 작성 표준은 [`../AGENTS.md`](../AGENTS.md)를 따른다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
