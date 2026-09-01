# shell (@study/shell)

문서 렌더링, 데모 색인/독립 열람, Multi-zones 프록시 게이트웨이입니다. 유일한 학습자 진입점입니다.

- **포트**: 3000
- **라우트**: `/[...slug]`(문서), `/demo`·`/demo/[...slug]`(데모 색인·열람), `/docs-assets/[...path]`(이미지 스트리밍), `/zone/*`(rewrites 프록시)
- **커스텀 도메인이 붙는 유일한 앱** — zone(`demo-baseline`, `demo-cache-components`)은 셸 뒤에 숨는다

zone 공통 규칙(zone 간 이동, `<Link>` 금지, dev 포트 고정)은 [`../AGENTS.md`](../AGENTS.md)를 따른다.

## 지켜야 할 것

1. **셸에는 데모를 두지 않는다.** 셸은 문서 렌더링과 라우팅만 책임진다.
2. **문서 본문에 데모를 심지 않는다.** 코드펜스가 그리는 것은 iframe이 아니라 **링크 카드**다. iframe이 있는 곳은 데모 독립 열람 하나뿐이고, 랜딩 히어로의 대표 데모만 예외다 ([01. 3-2](../../docs/01-ui-and-screen-design.md), [ADR 0006](../../docs/adr/0006-shadcn-ui-as-ui-foundation.md)).
3. **스토리지 키에 접두사를 붙인다.** 모든 zone이 동일 오리진이라 데모가 셸의 상태를 덮어쓸 수 있다. 셸은 `study_*`(테마는 `study_theme`)를 쓴다 ([01. 8-2](../../docs/01-ui-and-screen-design.md)).

## nextjs-docs 참조

셸은 [`nextjs-docs/`](../../../nextjs-docs/)의 md를 화면에 그린다. 문서는 **단일 원본**이며 이쪽에 사본을 두지 않는다.

- **배포 시 파일 추적**: `next.config.ts`에 `outputFileTracingRoot`를 워크스페이스 루트로 명시한다. 빠뜨리면 배포 산출물에서 md가 통째로 누락되는데, **로컬에서는 항상 정상 동작한다.**
- **이미지 자산 서빙**: `nextjs-docs/*/assets/*.webp`는 md의 상대 경로만으로 브라우저에서 그려지지 않는다. `public/`으로 복사하는 빌드 스크립트나 해당 경로를 스트리밍하는 라우트 핸들러가 필요하다.
- **캐시 무효화**: `nextjs-docs`는 `@study/docs` 워크스페이스 패키지이며 build 태스크를 갖는다. 이걸 없애면 md를 고쳐도 셸이 캐시된 옛 결과를 내놓는다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
