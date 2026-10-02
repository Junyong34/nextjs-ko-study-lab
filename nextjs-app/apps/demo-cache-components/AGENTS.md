# demo-cache-components (@study/demo-cache-components)

Next.js 16의 `cacheComponents: true` 옵션 및 `use cache`, `cacheTag`, `cacheLife`를 검증하는 데모 zone입니다.

- **포트**: 3002
- **내부 라우트 슬러그**: `/zone/cache/*`
- **정적 자산 경로**: `/demo-static/cache/*`
- **핵심 설정**: `cacheComponents: true`, `assetPrefix: '/demo-static/cache'`

zone 공통 규칙 및 데모 작성 표준은 [`../AGENTS.md`](../AGENTS.md)를 따른다.

## 이 zone의 공유 구성 (2026-10-02)

`next.config.ts`의 `cacheLife`는 모든 데모가 공유한다. 새 프로파일은 데모 접두사를 붙여 **추가만** 하고 기존 키는 바꾸지 않는다. `distDir`는 `NEXT_DIST_DIR`로 바꿀 수 있다(기본 `.next`). 자세한 절차는 [05](../../docs/05-zone-onboarding-checklist.md)에 있다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
