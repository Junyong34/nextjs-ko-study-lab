# demo-baseline (@study/demo-baseline)

표준 App Router 기능(라우팅, Server Actions, Route Handlers, 함수, 디렉티브, 인증, i18n, 접근성 등)을 검증하는 데모 zone입니다.

- **포트**: 3001
- **내부 라우트 슬러그**: `/zone/baseline/*`
- **정적 자산 경로**: `/demo-static/baseline/*`

zone 공통 규칙 및 데모 작성 표준은 [`../AGENTS.md`](../AGENTS.md)를 따른다.

## 이 zone의 공유 구성 (2026-10-02)

여러 데모가 함께 쓰는 파일이다. 고치면 다른 데모의 응답이 바뀔 수 있으므로, 바꾼 뒤에는 기존 데모 라우트의 상태 코드와 응답 헤더를 변경 전후로 대조한다. 구조와 근거는 [02의 5.4](../../docs/02-codebase-deep-dive-guide.md#54-데모-앱의-설정과-계측), 작업 절차는 [05](../../docs/05-zone-onboarding-checklist.md)에 있다.

- `src/config/demo-next-config/`: 데모별 `redirects`·`rewrites`·`headers`·`env` 조각. 조각 하나가 데모 하나를 소유하고 `index.ts`가 합친다.
- `next.config.ts`: 위 조각, MDX(`withMDX`, `pageExtensions`에 `md`·`mdx`), `distDir`(`NEXT_DIST_DIR`, 기본 `.next`)를 합친다.
- `src/instrumentation.ts`와 `src/lib/otel-setup.ts`: nodejs 런타임 한정 OpenTelemetry 등록. `register()`가 `try/catch`로 호출한다.
- `src/mdx-components.tsx`: zone 안 모든 MDX에 적용되는 전역 매핑. 태그 종류는 바꾸지 않고 class만 더한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
